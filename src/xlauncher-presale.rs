#![no_std]

elrond_wasm::imports!();

#[elrond_wasm::derive::contract]
pub trait XLauncherPresale {
    #[init]
    fn init(&self) {
        // no code required for now
    }
}
