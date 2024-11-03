use tauri::{AppHandle, ipc::Channel};
use serde::Serialize;

use crate::filesystem;
use polars::prelude::*;
use polars::lazy::frame::LazyCsvReader;


#[tauri::command]
pub async fn import_dataframe(app: AppHandle, receiver: Channel<serde_json::Value>) {
    if let Some(file_handle) = filesystem::open_file_dialog().await {
        if let Ok(lf) = LazyCsvReader::new(file_handle).finish() {
            // Plan 1.b Print the lazyframe's JSON serialization on the Rust backend
            let df = lf.slice(0, 10).collect().unwrap();
            let df_json = serde_json::to_value(&df).unwrap();
            println!("df_json \n{df_json}");
            // Plan 1.c.i Use Channel to send serde_json::Value
            receiver.send(df_json).unwrap();
        }
    }
}


