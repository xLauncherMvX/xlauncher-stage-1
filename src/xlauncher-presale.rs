#![no_std]

elrond_wasm::imports!();
elrond_wasm::derive_imports!();

#[elrond_wasm::derive::contract]
pub trait XLauncherPresale {
    #[init]
    fn init(&self,
            token_id: TokenIdentifier) {
        require!(token_id.is_valid_esdt_identifier(), "Invalid token identifier");
        self.token_id().set(&token_id);
    }

    #[endpoint(fundContract)]
    #[payable("*")]
    fn fund_contract(&self,
                     #[payment_token] token_identifier: TokenIdentifier,
                     #[payment] _payment: BigUint) {
        require!(!self.token_id().is_empty(), "Token id not set");

        let my_token_id = self.token_id().get();
        require!( my_token_id == token_identifier, "Invalid fund token" )
    }

    #[view(getBalance)]
    fn get_balance(&self) -> BigUint {
        let my_token_id = self.token_id().get();
        let balance: BigUint = self.blockchain().get_sc_balance(&my_token_id, 0);
        return balance;
    }

    // storage

    #[view(getTokenId)]
    #[storage_mapper("tokenId")]
    fn token_id(&self) -> SingleValueMapper<TokenIdentifier>;
}
