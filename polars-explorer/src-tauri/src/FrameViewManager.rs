use std::collections::HashMap;
use std::sync::atomic::Ordering;
use std::sync::Mutex;
use crate::FrameView::FrameView;
use crate::State::Key;

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

    // Passing references all the way is too complicated
    // pub(crate) fn get_view(&self, view_key: usize) -> &FrameView {
    //     self.store.lock().unwrap()
    //         .get(&view_key).unwrap()
    // }
}

