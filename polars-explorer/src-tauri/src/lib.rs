mod Filesystem;
mod Query;
mod LoadedFrame;
mod Commands;
mod State;
mod Channels;
mod Payload;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(State::LoadedFrameMap {
            store: Default::default(),
            next_key: Default::default(),
        }) // Managing loaded LazyFrames
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![Commands::open_csv, Commands::switch_dataframe])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
