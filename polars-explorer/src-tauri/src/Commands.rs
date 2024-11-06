use crate::Channels::{DataChannel, InfoChannel, PageChannel};
use crate::Filesystem;
use crate::LoadedFrame::LoadedFrame;
use crate::State::LoadedFrameManager;
use polars::prelude::*;
use tauri::State;

// Open_csv will always load a new DataFrame
// We have to name the arguments this way due to Tauri limitation

#[tauri::command]
pub fn open_csv(
    infoChannel: InfoChannel,
    dataChannel: DataChannel,
    pageChannel: PageChannel,
    pageSize: usize,
    state: State<LoadedFrameManager>,
) -> Result<(), String> {
    println!("fn open_csv");
    // Open a user specified csv
    if let Some(file_handle) = Filesystem::open_file_dialog() {
        // Get file name
        let name = file_handle
            .file_name()
            .unwrap()
            .to_string_lossy()
            .into_owned();
        // Read the csv into a LazyFrame
        if let Ok(lf) = LazyCsvReader::new(file_handle).finish() {
            println!("LazyFrame {} loaded", name);

            // Load LazyFrame into backend state manager
            // https://docs.rs/tauri/latest/tauri/struct.Builder.html#method.manage
            let frame_key = LoadedFrame::load(lf, name, &state);
            // LoadedFrame automatically generates a base view
            let view_key = 0;
            let response = state.query_view(frame_key, view_key);

            return response.send(infoChannel, dataChannel, pageChannel);
        }
        return Err(format!("could not find frame {}", name));
    }
    return Err(format!("could not open csv"));
}

// Switch to an already loaded dataframe
// Pagination info is saved
#[tauri::command]
pub fn switch_view(
    frameKey: usize,
    viewKey: usize,
    infoChannel: InfoChannel,
    dataChannel: DataChannel,
    pageChannel: PageChannel,
    state: State<LoadedFrameManager>,
) -> Result<(), String> {
    let response = state.query_view(frameKey, viewKey);
    response.send(infoChannel, dataChannel, pageChannel)
}

#[tauri::command]
pub fn turn_page(
    frameKey: usize,
    viewKey: usize,
    page: usize,
    pageSize: usize,
    infoChannel: InfoChannel,
    dataChannel: DataChannel,
    pageChannel: PageChannel,
    state: State<LoadedFrameManager>,
) -> Result<(), String> {
    let response = state.query_page(frameKey, viewKey, page);
    response.send(infoChannel, dataChannel, pageChannel)
}
