#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use heroku_rs::prelude::*;

#[derive(serde::Serialize, Clone, Debug)]
pub struct AppInfo {
    active_dyno: Vec<Dyno>,
}

#[tauri::command]
fn app_info(token: &str, app: &str) -> Result<AppInfo, String> {
    let api_client = match HttpApiClient::create(token) {
        Ok(success) => success,
        Err(e) => return Err(e.to_string()),
    };
    let active_dyno = match api_client.request(&DynoList::new(app)) {
        Ok(success) => success,
        Err(e) => return Err(e.to_string()),
    };

    Ok(AppInfo {
        active_dyno,
    })
}

#[derive(serde::Serialize, Clone, Debug)]
pub struct DebugInfo {
    formation_after: Formation,
    formation_detail: Formation,
}

#[tauri::command]
fn scaling_dyno(token: &str, app: &str, process_type: &str, num: i32) -> Result<DebugInfo, String> {
    let api_client = match HttpApiClient::create(token) {
        Ok(success) => success,
        Err(e) => return Err(e.to_string()),
    };
    
   
    let formation_detail = match api_client.request(&FormationDetails::new(app, process_type)) {
        Ok(success) => success,
        Err(e) => return Err(e.to_string()),
    };

    let formation_after = match api_client.request(
        &FormationUpdate {
            app_id: app,
            formation_id: process_type,
            params: FormationUpdateParams {
                quantity: Some(num),
                size: Some(&formation_detail.size),
            },
        }
    ) {
        Ok(success) => success,
        Err(e) => return Err(e.to_string()),
    };

    Ok(DebugInfo {
        formation_detail,
        formation_after,
    })
}


use tauri_plugin_sql::TauriSql;

fn main() {
    tauri::Builder::default()
    .plugin(TauriSql::default())
    .invoke_handler(tauri::generate_handler![
        greet,
        app_info,
        scaling_dyno,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
