use std::sync::Mutex;

use tauri::{Emitter, Manager};

/// Drawing paths the app was launched with (file association / CLI argument).
///
/// The frontend takes them once on startup, so a reload does not reopen them.
struct LaunchFiles(Mutex<Vec<String>>);

/// Extracts existing file paths from process arguments.
fn extract_paths(argv: &[String]) -> Vec<String> {
    argv.iter()
        .skip(1)
        .filter(|arg| !arg.starts_with('-'))
        .filter(|arg| std::path::Path::new(arg).is_file())
        .cloned()
        .collect()
}

/// Hands the launch-time file paths to the frontend exactly once.
#[tauri::command]
fn take_launch_files(state: tauri::State<'_, LaunchFiles>) -> Vec<String> {
    let mut files = state.0.lock().expect("launch files mutex poisoned");
    std::mem::take(&mut *files)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let launch_files = extract_paths(&std::env::args().collect::<Vec<String>>());

    tauri::Builder::default()
        .manage(LaunchFiles(Mutex::new(launch_files)))
        // A second launch (e.g. double-clicking a .dwg while the app is open)
        // forwards its file arguments to the running instance.
        .plugin(tauri_plugin_single_instance::init(|app, argv, _cwd| {
            let paths = extract_paths(&argv);
            if paths.is_empty() {
                return;
            }
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.unminimize();
                let _ = window.set_focus();
            }
            let _ = app.emit("open-files", paths);
        }))
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .invoke_handler(tauri::generate_handler![take_launch_files])
        .run(tauri::generate_context!())
        .expect("error while running MLightCAD Studio");
}
