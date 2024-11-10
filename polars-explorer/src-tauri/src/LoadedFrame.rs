use crate::FrameView::FrameView;
use crate::FrameViewManager::FrameViewManager;
use crate::Payload::DataFrameInfo;
use crate::State::LoadedFrameManager;
use polars::prelude::LazyFrame;
use std::sync::atomic::Ordering;
use tauri::State;

pub struct LoadedFrame {
    // Keep the lazyframe, as well as certain cached results
    pub(crate) base: LazyFrame,
    pub(crate) view_manager: FrameViewManager,
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
        let mut loaded_frame = LoadedFrame {
            base: base.clone(),
            view_manager: FrameViewManager::new(),
            frameInfo,
        };
        // Initialize the loadedframe with a base view
        // The base view will always have a key of 0
        let _ = loaded_frame
            .view_manager
            .add(FrameView::base(name, base));
        // Insert the LoadedFrame into the managed state
        state
            .frame_map
            .lock()
            .unwrap()
            .insert(frame_key, loaded_frame);
        frame_key
    }
}
