use crate::FrameView::FrameView;
use crate::State::Key;
use std::collections::HashMap;
use std::sync::atomic::Ordering;
use std::sync::Mutex;
use polars::prelude::LazyFrame;
// Each LoadedFrame keeps a FrameViewManager
// Which is responsible for handling FrameViews

pub(crate) struct FrameViewManager {
    pub(crate) view_map: Mutex<HashMap<usize, FrameView>>,
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
        &self.view_map.lock().unwrap().insert(*key, frame_view);
        *key
    }

    // Why don't I directly provide a method to add a lazyframe?

    pub(crate) fn add_lazyframe(&mut self, frame: LazyFrame, name: String, page_size: usize) -> usize {
        let key = &self.next_key.fetch_add(1, Ordering::Relaxed);
        let view = FrameView::new(*key, name, frame, page_size);
        &self.view_map.lock().unwrap().insert(*key, view);
        *key
    }
}
