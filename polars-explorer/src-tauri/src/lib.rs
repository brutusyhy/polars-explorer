mod Channels;
mod Commands;
mod Filesystem;
mod FrameView;
mod FrameViewManager;
mod LoadedFrame;
mod Payload;
mod LazyFrame;
mod State;
mod Query;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(State::LoadedFrameManager {
            frame_map: Default::default(),
            next_key: Default::default(),
        }) // Managing loaded LazyFrames
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            Commands::open_csv,
            Commands::turn_page,
            Commands::switch_view,
            Commands::select_column
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
