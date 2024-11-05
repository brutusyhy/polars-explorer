use std::sync::atomic::AtomicUsize;
use serde::Serialize;
use tauri::ipc::Channel;

pub type ID = AtomicUsize;
pub type JSONValue = serde_json::Value;
pub type DataChannel = Channel<JSONValue>;

#[derive(Clone, Serialize)]
pub struct PageInfo {
    pub pageSize: usize,
    pub currentPage: usize,
    pub totalPage: usize,
}
pub type PageChannel = Channel<PageInfo>;

#[derive(Clone, Serialize)]
pub struct DataFrameInfo {
    pub key: usize,
    pub name: String,
}

pub type InfoChannel = Channel<DataFrameInfo>;