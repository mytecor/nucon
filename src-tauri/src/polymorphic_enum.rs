#[macro_export]
macro_rules! polymorphic_enum {
    ($name:ident $macro:ident, $($variant:ident($type:path),)*) => {
        pub enum $name { $($variant($type)),* }
        macro_rules! $macro {
            ($on:expr, |$with:ident| $body:block) => {
                match $on {
                    $($name::$variant($with) => $body )*
                }
            }
        }
    }
}
