use crate::filesystem;
use polars::prelude::*;
use polars::lazy::frame::LazyCsvReader;
#[tauri::command]
pub async fn import_dataframe() {
    if let Some(file_handle) = filesystem::open_file_dialog().await {
        if let Ok(lf) = LazyCsvReader::new(file_handle).finish() {
            println!("{:?}", lf.slice(0, 10).collect());
        }
    }
}