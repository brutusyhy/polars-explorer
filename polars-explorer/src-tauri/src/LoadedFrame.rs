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
    // frameInfo contains key
    // It must be passed from the LoadedFrameManager
    pub fn from_view(view: FrameView, frameInfo: DataFrameInfo) -> Self {
        // This will create a new LoadedFrame that uses a given view as the base view
        let base = view.frame.clone();
        LoadedFrame {
            base,
            view_manager: FrameViewManager::from_base_view(view),
            frameInfo,
        }
    }

    pub fn from_base_lazyframe(base: LazyFrame, frameInfo: DataFrameInfo) -> Self {
        LoadedFrame {
            base: base.clone(),
            // Construct a base view from the lazyframe
            view_manager: FrameViewManager::from_base_lazyframe(base),
            frameInfo,
        }
    }
}
