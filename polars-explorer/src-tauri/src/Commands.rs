use polars::prelude::*;
use tauri::State;
use crate::Channels::{DataChannel, InfoChannel, PageChannel};
use crate::Filesystem;
use crate::State::{select_lf_by_key, LoadedFrameMap};
use crate::LoadedFrame::LoadedFrame;

// Open_csv will always load a new DataFrame
// We have to name the arguments this way due to Tauri limitation
#[tauri::command]
pub fn open_csv(infoChannel: InfoChannel,
                dataChannel: DataChannel,
                pageChannel: PageChannel,
                pageSize: usize,
                state: State<LoadedFrameMap>) -> Result<(), String> {
    println!("fn open_csv");
    if let Some(file_handle) = Filesystem::open_file_dialog() {
        // Get file name
        let name =
            file_handle.file_name().unwrap()
                .to_string_lossy()
                .into_owned();
        if let Ok(lf) = LazyCsvReader::new(file_handle).finish() {
            println!("LazyFrame {} loaded", name);

            // Load LazyFrame into backend state manager
            // https://docs.rs/tauri/latest/tauri/struct.Builder.html#method.manage
            let loaded_frame = LoadedFrame::new(lf, name, state);

            let query_result = loaded_frame.query_page(0, pageSize);

            infoChannel.send(loaded_frame.info).unwrap();
            dataChannel.send(query_result.response).unwrap();
            pageChannel.send(query_result.pageInfo).unwrap();
        }
    }
    Ok(())
}

// Switch to an already loaded dataframe
#[tauri::command]
pub fn switch_dataframe(key: usize,
                        infoChannel: InfoChannel,
                        dataChannel: DataChannel,
                        pageChannel: PageChannel,
                        pageSize: usize,
                        state: State<LoadedFrameMap>) -> Result<(), String> {
    let lf = select_lf_by_key(key, state);
    let query_result = lf.query_page(0, pageSize);
    infoChannel.send(lf.info).unwrap();
    dataChannel.send(query_result.response).unwrap();
    pageChannel.send(query_result.pageInfo).unwrap();
    Ok(())
}

