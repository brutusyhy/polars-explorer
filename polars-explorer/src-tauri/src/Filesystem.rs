use std::path::PathBuf;
use rfd::FileDialog;


pub fn open_file_dialog() -> Option<PathBuf> {
    // Creates a native file dialog for the user to select a csv file
    FileDialog::new()
        .add_filter("csv", &["csv"])
        .set_directory(PathBuf::from("/"))
        .pick_file()
}
