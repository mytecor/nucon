use std::fmt::{Display, Formatter};

use hidapi::HidDevice;

use crate::hid_wrapper::Keyboard;

pub struct Air60 {
    pub device: Box<Option<HidDevice>>,
}

impl Keyboard for Air60 {
    const VENDOR_ID: u16 = 0x05ac;
    const PRODUCT_ID: u16 = 0x024f;

    fn check_secret(&self) -> bool {
        let device = match &*self.device {
            Some(value) => value,
            None => return false,
        };

        device
            .send_feature_report(&[5, 0x05, 0x05, 0x81, 0, 0, 0])
            .ok();

        let mut res = [5, 0, 0, 0, 0, 0, 0, 0];
        device.get_feature_report(&mut res).ok();

        return res == [0x05, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x9b];
    }

    fn get_colors_config(&self) {
        let device = match &*self.device {
            Some(value) => value,
            None => return,
        };

        device
            .send_feature_report(&[5, 0x05, 0x83, 0xb6, 0, 0, 0])
            .ok();

        let mut res = [0; 260];
        res[0] = 6;
        device.get_feature_report(&mut res).ok();

        println!("{:?}", res);
    }
}

impl Display for Air60 {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "Air60")
    }
}
