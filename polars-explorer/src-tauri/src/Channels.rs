use crate::Payload::{DataInfo, DataJSON, PageInfo};
use tauri::ipc::Channel;

pub type DataChannel = Channel<DataJSON>;
pub type PageChannel = Channel<PageInfo>;
pub type InfoChannel = Channel<DataInfo>;

// Message from this channel will clear the display
pub type ClearChannel = Channel<bool>;