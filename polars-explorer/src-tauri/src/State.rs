use crate::LoadedFrame::LoadedFrame;
use crate::Payload::FullResponse;
use std::collections::HashMap;
use std::sync::atomic::AtomicUsize;
use std::sync::Mutex;
use polars::prelude::Expr;

pub type Key = AtomicUsize;
pub(crate) struct LoadedFrameManager {
    // A Tauri managed state keeping track of all in-memory lazyframes
    pub(crate) frame_map: Mutex<HashMap<usize, LoadedFrame>>,
    pub(crate) next_key: Key,
}

// I think it might be a good idea to put all the commands at this level?

impl LoadedFrameManager {
    pub fn query_view(&self, frame_key: usize, view_key: usize) -> FullResponse {
        // TODO: I know this is a mess, but for now I haven't come up with a better solution
        // Passing down reference chains in the presence of Mutex is messy
        // This will pick up the previous pagination info

        let viewResponse = self.frame_map.lock().unwrap()
            .get(&frame_key).unwrap()
            .view_manager.lock().unwrap()
            .view_map.lock().unwrap()
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
            .get(&frame_key).unwrap()
            .view_manager.lock().unwrap()
            .view_map.lock().unwrap()
            .get_mut(&view_key).unwrap()
            .to_page(page);
        self.query_view(frame_key, view_key)
    }

    pub fn select_columns(&self,
                          frame_key: usize,
                          view_key: usize,
                          page_size: usize,
                          column_selector: Vec<Expr>) -> FullResponse {
        // Selecting columns should create a new lazyframe
        // And a new FrameView under the same LoadedFrame

        // First, clone the existing LazyFrame
        let lf =
            self.frame_map.lock().unwrap()
                .get(&frame_key).unwrap()
                .view_manager.lock().unwrap()
                .view_map.lock().unwrap()
                .get(&view_key).unwrap()
                .frame.to_owned();

        // Then, apply select on the lazyframe
        let frame = lf.select(column_selector);

        // Thereafter, we will use view_manager to load the lazyframe
        let new_viewkey =
            self.frame_map.lock().unwrap()
                .get(&frame_key).unwrap()
                .view_manager.lock().unwrap()
                .add_lazyframe(frame, "Select Columns".to_string(), page_size);

        // Finally, we will treat this as yet another view query
        self.query_view(frame_key, new_viewkey)
    }
}
