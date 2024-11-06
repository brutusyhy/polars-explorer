use crate::FrameView::FrameView;
use crate::FrameViewManager::FrameViewManager;
use crate::Payload::{DataFrameInfo, PageInfo, ViewResponse};
use crate::Query::get_rows;
use crate::State::LoadedFrameManager;
use polars::prelude::{IdxSize, LazyFrame};
use std::sync::atomic::Ordering;
use std::sync::Mutex;
use tauri::CursorIcon::Default;
use tauri::State;

pub struct LoadedFrame {
    // Keep the lazyframe, as well as certain cached results
    pub(crate) base: LazyFrame,
    pub(crate) view_manager: Mutex<FrameViewManager>,
    pub(crate) frameInfo: DataFrameInfo,
}

impl LoadedFrame {
    pub fn load(base: LazyFrame, name: String, state: &State<LoadedFrameManager>) -> usize {
        // Load the lazyframe into managed states
        // Returns the key for the loaded lazyframe
        let frame_key = state.next_key.fetch_add(1, Ordering::Relaxed);
        let frameInfo = DataFrameInfo {
            key: frame_key,
            name: name.clone(),
        };
        let loaded_frame = LoadedFrame {
            base: base.clone(),
            view_manager: Mutex::new(FrameViewManager::new()),
            frameInfo,
        };
        // Initialize the loadedframe with a base view
        // The base view will always have a key of 0
        let _ = loaded_frame
            .view_manager
            .lock()
            .unwrap()
            .add(FrameView::base(name, base));
        // Insert the LoadedFrame into the managed state
        state
            .frame_map
            .lock()
            .unwrap()
            .insert(frame_key, loaded_frame);
        frame_key
    }

    // pub fn get_view_guard(&self, view_key: usize) {
    //     self.views
    //         .lock()
    //         .unwrap()
    //
    // }
    // TODO: Move the query logic to frameview
    // Or maybe not? Maybe better put it into the LoadedFrameManager
    // Query a page should not gen

    // pub fn query_page(
    //     self: &Self,
    //     page: usize,
    //     pageSize: usize,
    // ) -> PagedResponse {
    //     // Implement paginated query on the backend
    //     // LazyFrame.slice offers in-built support for range validation
    //     // https://docs.pola.rs/api/rust/dev/polars/prelude/struct.LazyFrame.html#method.slice
    //     let df = self.frame.clone()
    //         .slice((page * pageSize) as i64, pageSize as IdxSize)
    //         .collect()
    //         .unwrap();
    //     let response = serde_json::to_value(&df).unwrap();
    //     let total_page = (self.info.length as f64 / pageSize as f64).ceil() as usize;
    //     let pageInfo = PageInfo {
    //         pageSize,
    //         currentPage: page,
    //         totalPage: total_page,
    //     };
    //     PagedResponse { response, pageInfo }
    // }
}
