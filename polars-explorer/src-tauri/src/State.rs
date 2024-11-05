use std::collections::HashMap;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Mutex;
use polars::prelude::LazyFrame;
use tauri::State;
use crate::LoadedFrame::LoadedFrame;
use crate::Payload::DataFrameInfo;

pub type Key = AtomicUsize;
pub(crate) struct LoadedFrameMap {
    // A Tauri managed state keeping track of all in-memory lazyframes
    pub(crate) store: Mutex<HashMap<usize, LoadedFrame>>,
    pub(crate) next_key: Key,
}


pub fn select_lf_by_key(key: usize, state: State<LoadedFrameMap>) -> LoadedFrame {
    state.store.lock().unwrap()
        .get(&key).unwrap()
        .to_owned()
}