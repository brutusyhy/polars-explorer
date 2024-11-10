use crate::LoadedFrame::LoadedFrame;
use crate::Payload::FullResponse;
use std::collections::HashMap;
use std::sync::atomic::AtomicUsize;
use std::sync::Mutex;
use polars::prelude::Expr;


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

impl LoadedFrameManager {
    pub fn query_view(&self, frame_key: usize, view_key: usize) -> FullResponse {
        // Now the code is cleaner since we removed lower level Mutexes

        let viewResponse = self.frame_map.lock().unwrap()
            .get(&frame_key).unwrap()
            .view_manager
            .view_map
            .get(&view_key).unwrap()
            .query();

        let frameInfo = self.frame_map.lock().unwrap()
            .get(&frame_key).unwrap()
            .frameInfo.to_owned();

        FullResponse {
            view: viewResponse,
            frameInfo,
        }
    }
    pub fn query_page(&self, frame_key: usize, view_key: usize, page: usize) -> FullResponse {
        // A helper function to first turn the frame to the desired page
        self.frame_map.lock().unwrap()
            .get_mut(&frame_key).unwrap()
            .view_manager
            .view_map
            .get_mut(&view_key).unwrap()
            .turn_page(page);
        self.query_view(frame_key, view_key)
    }

    pub fn select_columns(&self,
                          frame_key: usize,
                          view_key: usize,
                          page_size: usize,
                          column_selector: Vec<Expr>) -> FullResponse {
        // Selecting columns should create a new lazyframe
        // And a new FrameView under the same LoadedFrame
        let col_count = column_selector.len();
        // First, clone the existing LazyFrame
        let lf =
            self.frame_map.lock().unwrap()
                .get(&frame_key).unwrap()
                .view_manager
                .view_map
                .get(&view_key).unwrap()
                .frame.to_owned();

        // Then, apply select on the lazyframe
        let frame = lf.select(column_selector);

        // Thereafter, we will use view_manager to load the lazyframe
        let new_viewkey =
            self.frame_map.lock().unwrap()
                .get_mut(&frame_key).unwrap()
                .view_manager
                .add_lazyframe(frame, format!("Select {} Columns", col_count), page_size);

        // Finally, we will treat this as yet another view query
        self.query_view(frame_key, new_viewkey)
    }

    // TODO: Context Menu
    // pub fn rename_view(&mut self,
    //                    frame_key: usize,
    //                    view_key: usize
    //                    , name: String) {}
    //
    // // Experiment with getting a reusable function to extract nested mutex
    // pub fn get_frame_map_guard(&self) {
    //     self.frame_map.lock()
    // }
}
