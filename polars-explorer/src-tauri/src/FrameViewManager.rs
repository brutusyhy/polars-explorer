use crate::FrameView::{DataViewInfo, FrameView};
use crate::State::Key;
use polars::prelude::LazyFrame;
use std::collections::HashMap;
use std::sync::atomic::Ordering;
use crate::Payload::ViewResponse;
// Each LoadedFrame keeps a FrameViewManager
// Which is responsible for handling FrameViews

pub(crate) struct FrameViewManager {
    pub(crate) view_map: HashMap<usize, FrameView>,
    pub(crate) next_key: Key,
}

impl FrameViewManager {
    pub(crate) fn new() -> Self {
        Self {
            view_map: Default::default(),
            next_key: Default::default(),
        }
    }
    pub(crate) fn add(&mut self, frame_view: FrameView) -> usize {
        // Add a FrameView to the manager
        // return the key for the loaded view
        let key = &self.next_key.fetch_add(1, Ordering::Relaxed);
        &self.view_map.insert(*key, frame_view);
        *key
    }

    pub(crate) fn delete(&mut self, key: usize) {
        self.view_map.remove(&key);
    }
    // Why don't I directly provide a method to add a lazyframe?

    pub(crate) fn add_lazyframe(&mut self, frame: LazyFrame, name: String, page_size: usize) -> usize {
        let key = &self.next_key.fetch_add(1, Ordering::Relaxed);
        let view = FrameView::new(*key, name, frame, page_size);
        &self.view_map.insert(*key, view);
        *key
    }

    pub(crate) fn get_view_info(&self, key: usize) -> DataViewInfo {
        self.view_map.get(&key).unwrap().info.clone()
    }

    pub(crate) fn query_view(&self, key: usize) -> ViewResponse {
        self.view_map.get(&key).unwrap().query()
    }

    pub(crate) fn turn_page(&mut self, key: usize, page: usize) {
        self.view_map.get_mut(&key).unwrap().turn_page(page);
    }

    pub(crate) fn get_lazyframe(&self, key: usize) -> LazyFrame {
        self.view_map.get(&key).unwrap().frame.to_owned()
    }
}
