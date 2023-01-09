use hidapi::{DeviceInfo, HidApi};
use std::sync::Mutex;

use crate::{air60::Air60, polymorphic_enum};

pub trait Keyboard {
    const VENDOR_ID: u16;
    const PRODUCT_ID: u16;

    fn check_secret(&self) -> bool;
    fn get_colors_config(&self);
}

polymorphic_enum!(
    Keyboards use_keyboard,
    Air60(Air60),
);

fn get_keyboard(device: &DeviceInfo, api: &HidApi) -> Result<Keyboards, &'static str> {
    let mut kb = match (device.vendor_id(), device.product_id()) {
        (Air60::VENDOR_ID, Air60::PRODUCT_ID) => Keyboards::Air60(Air60 {
            device: Box::new(None),
        }),
        _ => return Err("Unknown device"),
    };

    let res = match device.open_device(api) {
        Ok(res) => res,
        _ => return Err("Unable to open device"),
    };

    use_keyboard!(&mut kb, |kb| {
        *kb.device = Some(res);

        if !kb.check_secret() {
            return Err("Invalid interface");
        };

        kb.get_colors_config();
    });

    Ok(kb)
}

#[tauri::command]
pub async fn connect_to_keyboard(
    hid: tauri::State<'_, Mutex<HidApi>>,
    current_keyboard: tauri::State<'_, Mutex<Option<Keyboards>>>,
) -> Result<String, &'static str> {
    let api = &mut hid.lock().unwrap();

    if api.refresh_devices().is_err() {
        return Err("Unable load device list");
    };

    for device in api.device_list() {
        if let Ok(kb) = get_keyboard(device, api) {
            let name = use_keyboard!(&kb, |kb| { kb.to_string() });

            *current_keyboard.lock().unwrap() = Some(kb);

            return Ok(name);
        };
    }

    Err("No supported device connected")
}
