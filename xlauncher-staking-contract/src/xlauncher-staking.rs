#![no_std]

elrond_wasm::imports!();
elrond_wasm::derive_imports!();

#[elrond_wasm::derive::contract]
pub trait XLauncherStaking{
    #[init]
    fn init(&self) {

    }
}