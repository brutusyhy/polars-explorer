use crate::FrameView::{DataViewInfo, FrameView};
use crate::State::Key;
use polars::prelude::{CsvWriter, LazyFrame};
use std::collections::HashMap;
use std::fs::File;
use std::path::PathBuf;
use std::sync::atomic::Ordering;
use std::io::Write;
use polars::io::SerWriter;
use crate::LoadedFrame::LoadedFrame;
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
    // Create a FrameViewManager that takes an input as base view
    pub(crate) fn from_base_view(base_view: FrameView) -> Self {
        let mut view = base_view;
        // We have to refresh the view's key so that it becomes 0 (base view)
        view.info.key = 0;
        let mut manager = FrameViewManager::new();
        manager.add(view);
        manager.rename(0, "Base".to_string());
        manager
    }

    pub(crate) fn from_base_lazyframe(base_frame: LazyFrame) -> Self {
        let base_view = FrameView::base(base_frame);
        let mut manager = FrameViewManager::new();
        manager.add(base_view);
        manager
    }

    pub(crate) fn add(&mut self, frame_view: FrameView) -> usize {
        // Add a FrameView to the manager
        // return the key for the loaded view
        let key = &self.next_key.fetch_add(1, Ordering::Relaxed);
        &self.view_map.insert(*key, frame_view);
        *key
    }

    pub(crate) fn remove(&mut self, key: usize) -> FrameView {
        self.view_map.remove(&key).unwrap()
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

    pub(crate) fn rename(&mut self, key: usize, name: String) {
        self.view_map.get_mut(&key).unwrap().info.name = name;
    }

    pub(crate) fn export(&self, key: usize, file_handle: PathBuf) {
        let mut file = File::create(file_handle).unwrap();
        let mut df = self.get_lazyframe(key).clone().collect().unwrap();
        CsvWriter::new(&mut file)
            .include_header(true)
            .with_separator(b',')
            .finish(&mut df).unwrap()
    }
}
