#![no_std]

elrond_wasm::imports!();
elrond_wasm::derive_imports!();

use xlauncher_staking::ProxyTrait as _;

const EGLD_DECIMALS_VALUE: u64 = 1_000_000_000_000_000_000;
const ZERO: u64 = 0;

#[elrond_wasm::derive::contract]
pub trait XLauncherPresale {
    #[init]
    fn init(&self,
            token_id: TokenIdentifier,
            initial_price: BigUint,
            min_amount: BigUint,
            max_amount_val: BigUint,
            max_balance_val: BigUint) {
        require!(token_id.is_valid_esdt_identifier(), "Invalid token identifier");
        require!(initial_price > 0, "Initial price must be positive value");
        require!(min_amount > 0, "Min amount must be positive value");
        require!(max_amount_val > 0, "Max amount must be positive value");
        require!(min_amount < max_amount_val, "min amount must be smaller then max amount");
        require!(max_balance_val > 0, "Max balance must be positive value");
        self.token_id().set(&token_id);
        self.price().set(initial_price);
        self.min_amount().set(min_amount);
        self.max_amount().set(max_amount_val);
        self.max_balance().set(max_balance_val);
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

    #[view(getTokenBalance)]
    fn get_token_balance(&self) -> BigUint {
        let my_token_id = self.token_id().get();
        let balance: BigUint = self.blockchain().get_sc_balance(&my_token_id, 0);
        return balance;
    }


    #[payable("EGLD")]
    #[endpoint]
    fn buy(
        &self
    ) {
        let (payment_amount, payment_token) = self.call_value().payment_token_pair();
        require!(payment_token.is_egld(),"Only EGLD");
        require!(
            payment_amount >= self.min_amount().get(),
            "Payment amount is to low"
        );
        require!(
            payment_amount <= self.max_amount().get(),
            "Payment amount is to high"
        );
        let balance = self.get_token_balance();
        require!(
            balance > ZERO,
            "No more tokens to sale."
        );
        let current_price = self.price().get();
        let one_egld = BigUint::from(EGLD_DECIMALS_VALUE);
        let result_edst_token_amount = (&current_price * &payment_amount) / one_egld;
        require!(
            balance > result_edst_token_amount,
            "Not enough tokens for sale."
        );

        //sent token to caller
        let caller = self.blockchain().get_caller();
        let token_id_val = self.token_id().get();

        let client_token_balance = self.blockchain().get_esdt_token_data(
            &caller, &token_id_val, 0).amount;
        let client_total_balance = (&result_edst_token_amount + &client_token_balance);
        let max_balance_val = self.max_balance().get();
        require!(client_total_balance <= max_balance_val,
         "Buying that much will exceed max allowed token balance");


        self.send().direct(
            &caller,
            &token_id_val,
            0, &result_edst_token_amount,
            &[]);
        /* let owner = self.blockchain().get_owner_address();
         self.send().direct_egld(
             &owner,
             &payment_amount,
             &[],
         )*/
    }


    #[only_owner]
    #[endpoint]
    fn collect(&self) {
        let owner = self.blockchain().get_owner_address();

        let sc_address: ManagedAddress = self.blockchain().get_sc_address();
        let egld_balance = self.blockchain().get_balance(&sc_address);

        let my_token_id = self.token_id().get();
        let token_balance = self.blockchain().get_sc_balance(&my_token_id, 0);

        let big_zero: BigUint = BigUint::zero();
        if big_zero < token_balance {
            self.send().direct(
                &owner,
                &my_token_id,
                0, &token_balance,
                &[]);
        }

        if big_zero < egld_balance {
            self.send().direct_egld(
                &owner,
                &egld_balance,
                &[])
        }
    }

    #[proxy]
    fn contract_proxy(&self, sc_address: ManagedAddress) -> xlauncher_staking::Proxy<Self::Api>;


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

    #[view(getMaxBalance)]
    #[storage_mapper("maxBalance")]
    fn max_balance(&self) -> SingleValueMapper<BigUint>;
}
