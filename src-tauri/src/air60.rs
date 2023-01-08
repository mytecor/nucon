use std::{
    fmt::{Display, Formatter},
    sync::Mutex,
};

use hidapi::HidDevice;

use crate::hid_wrapper::Keyboard;

pub struct Air60 {
    pub device: Mutex<Option<HidDevice>>,
}

impl Keyboard for Air60 {
    const VENDOR_ID: u16 = 0x05ac;
    const PRODUCT_ID: u16 = 0x024f;

    fn check_secret(&self) -> bool {
        let device = &*self.device.lock().unwrap();

        let device = match device {
            Some(value) => value,
            None => return false,
        };

        device.send_feature_report(&[5]).ok();

        let mut res = [5, 0, 0];
        device.get_feature_report(&mut res).ok();

        return res == [5, 1, 2];
    }
}

impl Display for Air60 {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "Air60")
    }
}
