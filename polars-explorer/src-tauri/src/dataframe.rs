// Handles LazyFrame
use polars::prelude::*;

// Handles communication
use tauri::{AppHandle, ipc::Channel, State};

// Handles file selection
use crate::filesystem;
use crate::typing::{JSONValue, ID, DataChannel, PageChannel, Pagination, InfoChannel, DataFrameInfo};
use crate::query::query_page;

// Handles dataframe state management
use std::collections::HashMap;
use std::sync::Mutex;
use std::sync::atomic::{AtomicUsize, Ordering};


pub(crate) struct LazyFrames {
    pub(crate) store: Mutex<HashMap<usize, LazyFrame>>,
    pub(crate) next_id: ID,
}

pub fn load_lazyframe(lf: LazyFrame, lazyframes: State<LazyFrames>) -> DataFrameInfo {
    // Load the lazyframe into managed states
    // Returns its DataFrameInfo entry
    let df_id = lazyframes.next_id.fetch_add(1, Ordering::Relaxed);
    lazyframes.store.lock().unwrap().insert(df_id, lf);
    DataFrameInfo {
        key: df_id,
        name: format!("DataFrame {}", df_id),
    }
}

pub fn len_lf(lf: LazyFrame) -> PolarsResult<usize> {
    let count_df = lf
        .with_row_index("index", Some(1))
        .select([col("index")])
        .last()
        .collect();


    Ok(count_df?
        .column("index")?
        .get(0)?.try_extract::<usize>()?)
}


// Open_csv will always load a new DataFrame

#[tauri::command]
pub fn open_csv(infoChannel: InfoChannel,
                dataChannel: DataChannel,
                pageChannel: PageChannel,
                pageSize: usize,
                lazyframes: State<LazyFrames>) -> Result<(), String> {
    println!("fn open_csv");
    if let Some(file_handle) = filesystem::open_file_dialog() {
        if let Ok(lf) = LazyCsvReader::new(file_handle).finish() {
            println!("lf loaded");
            // 4.a Load LazyFrame into backend state manager
            // https://docs.rs/tauri/latest/tauri/struct.Builder.html#method.manage
            let df_info = load_lazyframe(lf.clone(), lazyframes);

            // Perform a paginated query and return the response
            let query_result = query_page(lf.clone(), 0, pageSize);

            // Get the full length of the LazyFrame
            let length = len_lf(lf).unwrap();
            let total_page = (length as f64 / pageSize as f64).ceil() as usize;

            infoChannel.send(df_info).unwrap();
            dataChannel.send(query_result).unwrap();
            pageChannel.send(Pagination {
                pageSize: pageSize,
                currentPage: 0,
                totalPage: total_page,
            }).unwrap();
        }
    }
    Ok(())
}



