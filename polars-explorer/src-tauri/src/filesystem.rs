use std::path::PathBuf;
use rfd::AsyncFileDialog;


pub async fn open_file_dialog() -> Option<PathBuf> {
    let file = AsyncFileDialog::new()
        .add_filter("csv", &["csv"])
        .set_directory("/")
        .pick_file()
        .await;

    match file {
        Some(file) => Some(file.inner().to_owned()),
        None => None,
    }
}