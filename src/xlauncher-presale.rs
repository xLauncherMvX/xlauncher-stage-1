#![no_std]

elrond_wasm::imports!();
elrond_wasm::derive_imports!();

#[elrond_wasm::derive::contract]
pub trait XLauncherPresale {
    #[init]
    fn init(&self, token_id: TokenIdentifier) {
        require!(token_id.is_valid_esdt_identifier(), "Invalid token identifier");
        self.token_id().set(&token_id);
    }

    #[view(getTokenId)]
    #[storage_mapper("tokenId")]
    fn token_id(&self) -> SingleValueMapper<TokenIdentifier>;
}
