mod Filesystem;
mod Query;
mod LoadedFrame;
mod Commands;
mod State;
mod Channels;
mod Payload;
mod FrameViewManager;
mod FrameView;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(State::LoadedFrameManager {
            frame_map: Default::default(),
            next_key: Default::default(),
        }) // Managing loaded LazyFrames
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![Commands::open_csv, Commands::turn_page])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
