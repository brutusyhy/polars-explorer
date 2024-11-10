use crate::Payload::{DataInfo, DataJSON, PageInfo};
use tauri::ipc::Channel;

pub type DataChannel = Channel<DataJSON>;
pub type PageChannel = Channel<PageInfo>;
pub type InfoChannel = Channel<DataInfo>;
