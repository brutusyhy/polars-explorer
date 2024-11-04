mod filesystem;
mod dataframe;
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use dataframe::LazyFrames;
mod query;
mod typing;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(LazyFrames {
            store: Default::default(),
            next_id: Default::default(),
        }) // Managing loaded LazyFrames
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![dataframe::open_csv])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
