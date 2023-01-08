#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod air60;
mod hid_wrapper;
mod polymorphic_enum;

use hid_wrapper::{connect_to_keyboard, Keyboards};
use hidapi::HidApi;
use std::sync::Mutex;

#[derive(Clone, serde::Serialize)]
struct ErrorPayload {
    message: &'static str,
}

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .manage(Mutex::new(Option::<Keyboards>::None))
        .manage(Mutex::new(HidApi::new_without_enumerate().unwrap()))
        .invoke_handler(tauri::generate_handler![connect_to_keyboard])
        .run(tauri::generate_context!())
        .expect("Runtime error");
}
