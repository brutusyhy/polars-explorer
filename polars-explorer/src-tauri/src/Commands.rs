use crate::Channels::{ClearChannel, DataChannel, InfoChannel, PageChannel};
use crate::Filesystem;
use crate::LoadedFrame::LoadedFrame;
use crate::State::LoadedFrameManager;
use polars::prelude::*;
use tauri::State;
use crate::Payload::DataInfo;
use crate::Query::{column_selector, JSONArray};

// A normal command flow:
// Command -> State -> Specific
// eg. switch_view -> state.query_view
// This is because states are wrapped in a Mutex
// This makes passing reference difficult
// And passing ownership won't make sense either


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

#[tauri::command]
pub fn select_columns(
    frameKey: usize,
    viewKey: usize,
    pageSize: usize,
    columnJSON: JSONArray,
    infoChannel: InfoChannel,
    dataChannel: DataChannel,
    pageChannel: PageChannel,
    state: State<LoadedFrameManager>,
) -> Result<(), String> {
    let selector = column_selector(columnJSON)?;
    let response = state.query_select_columns(frameKey, viewKey, pageSize, selector);
    match response.send(infoChannel, dataChannel, pageChannel) {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

// TODO: Context Menu
// #[tauri::command]
// pub fn rename_view(
//     frameKey: usize,
//     viewKey: usize,
//     name: String,
//     infoChannel: InfoChannel,
//     state: State<LoadedFrameManager>,
// ) -> Result<(), String> {}


#[tauri::command]
pub fn delete_frame(
    frameKeyToDelete: usize,
    currentFrameKey: usize,
    clearChannel: ClearChannel,
    state: State<LoadedFrameManager>,
) -> Result<(), String> {
    // 1. We first delete the target frame
    state.delete_frame(frameKeyToDelete);

    // 2. Check if we deleted the currentFrame
    // If so, the ui will be cleared
    // Otherwise, the ui should not change
    if frameKeyToDelete == currentFrameKey {
        Ok(clearChannel.send(true).unwrap())
    } else {
        Ok(())
    }
}

// TODO: Because we haven't split viewInfo from frameInfo
// We need to update both at the same time...
// But I also feel that refactoring is not worth it...?
// We'd better refrain from refreshing the frontend with message at this step
#[tauri::command]
pub fn rename_frame(
    frameKey: usize,
    name: String,
    state: State<LoadedFrameManager>,
) -> Result<(), String> {
    state.rename_frame(frameKey, name);
    Ok(())
}

