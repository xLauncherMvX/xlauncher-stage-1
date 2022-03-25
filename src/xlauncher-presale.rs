#![no_std]

elrond_wasm::imports!();
elrond_wasm::derive_imports!();

#[elrond_wasm::derive::contract]
pub trait XLauncherPresale {
    #[init]
    fn init(&self,
            token_id: TokenIdentifier,
            initial_price: BigUint,
            min_amount: BigUint,
            max_amount_val: BigUint) {
        require!(token_id.is_valid_esdt_identifier(), "Invalid token identifier");
        require!(initial_price > 0, "Initial price must be positive value");
        require!(min_amount > 0, "Min amount must be positive value");
        require!(max_amount_val > 0, "Max amount must be positive value");
        require!(min_amount < max_amount_val, "min amount must be smaller then max amount");
        self.token_id().set(&token_id);
        self.price().set(initial_price);
        self.min_amount().set(min_amount);
        self.max_amount().set(max_amount_val);
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

    #[view(getPrice)]
    #[storage_mapper("price")]
    fn price(&self) -> SingleValueMapper<BigUint>;

    #[view(getMinAmount)]
    #[storage_mapper("minAmount")]
    fn min_amount(&self) -> SingleValueMapper<BigUint>;

    #[view(getMaxAmount)]
    #[storage_mapper("maxAmount")]
    fn max_amount(&self) -> SingleValueMapper<BigUint>;
}
