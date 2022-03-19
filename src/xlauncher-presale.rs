#![no_std]

elrond_wasm::imports!();
elrond_wasm::derive_imports!();

#[elrond_wasm::derive::contract]
pub trait XLauncherPresale {
    #[init]
    fn init(&self) {
        // no code required for now
    }

    fn set_token_identifier(
        &self,
        _token_identifier: ManagedBuffer,
    ) -> SCResult<()> {
        Ok(())
    }
}
