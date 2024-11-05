use std::sync::atomic::Ordering;
use polars::prelude::{IdxSize, LazyFrame};
use tauri::State;
use crate::Payload::{DataFrameInfo, PageInfo, PagedResponse};
use crate::Query::len_lf;
use crate::State::LoadedFrameMap;

#[derive(Clone)]
pub struct LoadedFrame {
    // Keep the lazyframe, as well as certain cached results
    pub(crate) frame: LazyFrame,
    pub(crate) info: DataFrameInfo,
}


impl LoadedFrame {
    pub fn new(frame: LazyFrame, name: String, state: State<LoadedFrameMap>) -> Self {
        // Load the lazyframe into managed states
        // Returns the loadedframe
        let key = state.next_key.fetch_add(1, Ordering::Relaxed);
        let length = len_lf(frame.clone()).unwrap();
        let info = DataFrameInfo { key, name, length };
        let loaded_frame = LoadedFrame { frame, info };
        state.store.lock().unwrap().insert(key, loaded_frame.clone());
        loaded_frame
    }
    pub fn query_page(
        self: &Self,
        page: usize,
        pageSize: usize,
    ) -> PagedResponse {
        // Implement paginated query on the backend
        // LazyFrame.slice offers in-built support for range validation
        // https://docs.pola.rs/api/rust/dev/polars/prelude/struct.LazyFrame.html#method.slice
        let df = self.frame.clone()
            .slice((page * pageSize) as i64, pageSize as IdxSize)
            .collect()
            .unwrap();
        let response = serde_json::to_value(&df).unwrap();
        let total_page = (self.info.length as f64 / pageSize as f64).ceil() as usize;
        let pageInfo = PageInfo {
            pageSize,
            currentPage: page,
            totalPage: total_page,
        };
        PagedResponse { response, pageInfo }
    }
}