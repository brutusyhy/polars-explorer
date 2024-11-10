use crate::LoadedFrame::LoadedFrame;
use crate::Payload::{DataFrameInfo, FullResponse, PageInfo, ViewResponse};
use std::collections::HashMap;
use std::sync::atomic::AtomicUsize;
use std::sync::Mutex;
use polars::prelude::Expr;
use polars::prelude::JoinType::Full;
use crate::FrameView::{DataViewInfo, FrameView};
// Thanks to https://www.reddit.com/user/epostma/ for pointing this out:
// When we have a Mutex lock over frame_map, there would only be an exclusive access to everything beneath it
// Especially since all commands go through the state
// Thus, we can safely remove all lower level locks

pub type Key = AtomicUsize;
pub(crate) struct LoadedFrameManager {
    // A Tauri managed state keeping track of all in-memory lazyframes
    pub(crate) frame_map: Mutex<HashMap<usize, LoadedFrame>>,
    pub(crate) next_key: Key,
}

// I think it might be a good idea to put all the commands at this level?

// query_xxx => returns a response

impl LoadedFrameManager {
    pub fn query_view(&self, frame_key: usize, view_key: usize) -> FullResponse {
        // Now the code is cleaner since we removed lower level Mutexes

        let viewResponse = self.frame_map.lock().unwrap()
            .get(&frame_key).unwrap()
            .view_manager.query_view(view_key);

        let frameInfo = self.get_frame_info(frame_key);

        FullResponse {
            view: viewResponse,
            frameInfo,
        }
    }
    pub fn query_page(&self, frame_key: usize, view_key: usize, page: usize) -> FullResponse {
        // A helper function to first turn the frame to the desired page
        self.frame_map.lock().unwrap()
            .get_mut(&frame_key).unwrap()
            .view_manager.turn_page(view_key, page);

        self.query_view(frame_key, view_key)
    }

    pub fn query_select_columns(&self,
                                frame_key: usize,
                                view_key: usize,
                                page_size: usize,
                                column_selector: Vec<Expr>) -> FullResponse {
        // Selecting columns should create a new lazyframe
        // And a new FrameView under the same LoadedFrame
        let col_count = column_selector.len();
        // First, clone the existing LazyFrame
        let lazy_frame =
            self.frame_map.lock().unwrap()
                .get(&frame_key).unwrap()
                .view_manager
                .get_lazyframe(view_key);

        // Then, apply select on the lazyframe
        let frame = lazy_frame.select(column_selector);

        // Thereafter, we will use view_manager to load the lazyframe
        let new_viewkey =
            self.frame_map.lock().unwrap()
                .get_mut(&frame_key).unwrap()
                .view_manager
                .add_lazyframe(frame, format!("Select {} Columns", col_count), page_size);

        // Finally, we will treat this as yet another view query
        self.query_view(frame_key, new_viewkey)
    }

    pub fn get_frame_info(&self, frame_key: usize) -> DataFrameInfo {
        self.frame_map.lock().unwrap()
            .get(&frame_key).unwrap()
            .frameInfo.clone()
    }

    pub fn get_view_info(&self, frame_key: usize, view_key: usize) -> DataViewInfo {
        self.frame_map.lock().unwrap()
            .get(&frame_key).unwrap()
            .view_manager.get_view_info(view_key)
    }
    pub fn delete_frame(&self, frame_key: usize) {
        self.frame_map.lock().unwrap().remove(&frame_key);
    }
    pub fn rename_frame(&self, frame_key: usize, name: String) {
        self.frame_map.lock().unwrap()
            .get_mut(&frame_key).unwrap()
            .frameInfo.name = name;
    }
    pub fn delete_view(&self, frame_key: usize, view_key: usize) {
        self.frame_map.lock().unwrap()
            .get_mut(&frame_key).unwrap()
            .view_manager.delete(view_key)
    }
}
