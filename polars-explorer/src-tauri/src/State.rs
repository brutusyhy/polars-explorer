use crate::LoadedFrame::LoadedFrame;
use crate::Payload::{DataFrameInfo, DataInfo, FullResponse, PageInfo, ViewResponse};
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::atomic::AtomicUsize;
use std::sync::Mutex;
use polars::prelude::{Expr, LazyFrame};
use polars::prelude::JoinType::Full;
use crate::FrameView::{DataViewInfo, FrameView};
use crate::FrameViewManager::FrameViewManager;
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
    pub fn load_lazyframe(&self, base: LazyFrame, name: String) -> usize {
        // Load the lazyframe into managed states
        // Returns the key for the loaded lazyframe

        // 1. Create the LoadedFrame based on a LazyFrame
        let key = self.next_key.fetch_add(1, std::sync::atomic::Ordering::SeqCst);
        let frameInfo = DataFrameInfo {
            key,
            name,
        };
        let loaded_frame = LoadedFrame::from_base_lazyframe(base, frameInfo);
        // 2. Add the LoadedFrame into the managed state
        self.add(key, loaded_frame);
        // 3. Return the key for the new LoadedFrame
        key
    }

    pub fn turn_view_into_frame(&self, frame_key: usize, view_key: usize) -> usize {
        // This function removes a view from a LoadedFrame
        // Creates a new LoadedFrame based on the view
        // And add it to the managed state
        // Returns the key for the new LoadedFrame

        // 1. Remove the view from the LoadedFrame
        let view = self.remove_view(frame_key, view_key);
        // 2. Create a new LoadedFrame based on the view
        let key = self.next_key.fetch_add(1, std::sync::atomic::Ordering::SeqCst);
        let name = view.info.name.clone();
        let frameInfo = DataFrameInfo { key, name };
        let loaded_frame = LoadedFrame::from_view(view, frameInfo);
        // 3. Add the LoadedFrame into the managed state
        self.add(key, loaded_frame);
        // 4. Return the key for the new LoadedFrame
        key
    }

    pub fn add(&self, key: usize, frame: LoadedFrame) {
        //
        self.frame_map.lock().unwrap().insert(key, frame);
    }

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
    pub fn query_info(&self, frame_key: usize, view_key: usize) -> DataInfo {
        DataInfo {
            frameInfo: self.get_frame_info(frame_key),
            viewInfo: self.get_view_info(frame_key, view_key),
        }
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
    pub fn remove_frame(&self, frame_key: usize) -> LoadedFrame {
        self.frame_map.lock().unwrap().remove(&frame_key).unwrap()
    }
    pub fn rename_frame(&self, frame_key: usize, name: String) {
        self.frame_map.lock().unwrap()
            .get_mut(&frame_key).unwrap()
            .frameInfo.name = name;
    }

    // For convenience,
    pub fn remove_view(&self, frame_key: usize, view_key: usize) -> FrameView {
        self.frame_map.lock().unwrap()
            .get_mut(&frame_key).unwrap()
            .view_manager.remove(view_key)
    }
    pub fn rename_view(&self, frame_key: usize, view_key: usize, name: String) {
        self.frame_map.lock().unwrap()
            .get_mut(&frame_key).unwrap()
            .view_manager.rename(view_key, name);
    }
    pub fn export_view(&self, frame_key: usize, view_key: usize, file_handle: PathBuf) {
        self.frame_map.lock().unwrap()
            .get(&frame_key).unwrap()
            .view_manager.export(view_key, file_handle);
    }
}
