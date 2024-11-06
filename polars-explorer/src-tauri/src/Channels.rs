use crate::Payload::{DataFrameInfo, DataInfo, JSONValue, PageInfo};
use tauri::ipc::Channel;

pub type DataChannel = Channel<JSONValue>;
pub type PageChannel = Channel<PageInfo>;
pub type InfoChannel = Channel<DataInfo>;
