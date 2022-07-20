#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[macro_use]
extern crate serde;

use if_chain::if_chain;
use std::fs;
use std::path::PathBuf;
use tauri::{Manager, State};

#[derive(Serialize)]
#[serde(tag = "type")]
enum Entry {
    #[serde(rename = "file")]
    File {
        name: String,
        path: String,
        size: u64,
    },
    #[serde(rename = "dir")]
    Dir { name: String, path: String },
}

#[tauri::command]
fn get_entries(path: &str) -> Result<Vec<Entry>, String> {
    let entries = fs::read_dir(path).map_err(|e| format!("{}", e))?;

    let res = entries
        .filter_map(|entry| -> Option<Entry> {
            let entry = entry.ok()?;
            let name = entry.file_name().to_string_lossy().to_string();
            let path = entry.path().to_string_lossy().to_string();
            let type_ = entry.file_type().ok()?;

            if type_.is_dir() {
                Some(Entry::Dir { name, path })
            } else if type_.is_file() {
                Some(Entry::File {
                    name,
                    path,
                    size: entry.metadata().ok()?.len(),
                })
            } else {
                None
            }
        })
        .collect();

    Ok(res)
}

#[tauri::command]
fn get_home_dir() -> Result<String, String> {
    let res = dirs::home_dir()
        .ok_or("Home Dir couldn't be found.".to_string())?
        .to_string_lossy()
        .to_string();

    Ok(res)
}

use std::path::Path;

#[tauri::command]
fn get_parent(path: &str) -> Result<String, String> {
    let path = Path::new(path);

    path.parent()
        .and_then(|p| {
            let e = path.exists();
            if e {
                Some(p.to_string_lossy().to_string())
            } else {
                None
            }
        })
        .ok_or_else(|| "Parent couldn't be found.".to_string())
}

struct InitialPath(Option<PathBuf>);

#[tauri::command]
fn get_initial_path(inipath: State<InitialPath>) -> Option<Entry> {
    // return Some(File) or Some(Dir) or None
    let res = inipath.0.as_ref().map(|p| {
        let name = p.file_name().unwrap().to_string_lossy().to_string();
        let path = p.to_string_lossy().to_string();
        let type_ = p.metadata().ok()?.file_type();

        if type_.is_dir() {
            Some(Entry::Dir { name, path })
        } else if type_.is_file() {
            Some(Entry::File {
                name,
                path,
                size: p.metadata().ok()?.len(),
            })
        } else {
            None
        }
    });

    res.flatten()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_entries,
            get_home_dir,
            get_parent,
            get_initial_path
        ])
        .setup(|app| {
            let mut initial_path = None;

            match app.get_cli_matches() {
                Ok(matches) => {
                    if_chain! {
                        if let Some(arg) = matches.args.get("source");
                        if let Some(path) = arg.value.as_str();
                        then {
                            let path = PathBuf::from(path);
                            initial_path = Some(path);
                        }
                    }
                }
                Err(_) => (),
            }

            app.manage(InitialPath(initial_path));

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
