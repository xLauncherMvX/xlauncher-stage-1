#![no_std]
#![feature(generic_associated_types)]

extern crate alloc;


elrond_wasm::imports!();
elrond_wasm::derive_imports!();


#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode)]
pub struct ContractSettings<M: ManagedTypeApi> {
    pub token_id: TokenIdentifier<M>,
    pub min_amount: BigUint<M>,
    pub pull_a_id: u32,
    pub pull_a_locking_time_span: u64,
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode)]
pub struct ClientPullState<M: ManagedTypeApi> {
    pub pull_id: u32,
    pub pull_time_stamp_entry: u64,
    pub pull_time_stamp_last_collection: u64,
    pub pull_amount: BigUint<M>,
}


#[elrond_wasm::derive::contract]
pub trait XLauncherStaking {
    #[init]
    fn init(&self,
            token_id: TokenIdentifier,
            min_amount: BigUint,
            pull_a_locking_time_span: u64,
    ) {
        require!(token_id.is_valid_esdt_identifier(), "invalid token_id");
        require!(min_amount > 0, "min_amount must be positive");
        //self.token_id().set(&token_id);

        let pull_a_id = 1u32;

        let settings = ContractSettings {
            token_id,
            min_amount,
            pull_a_id,
            pull_a_locking_time_span,
        };
        self.contract_settings().set(&settings);
    }

    #[payable("*")]
    #[endpoint(stake)]
    fn stake(&self,
             #[payment_token] token_id: TokenIdentifier,
             #[payment_amount] amount: BigUint,
             pull_id: u32,
    ) {
        let settings: ContractSettings<Self::Api> = self.contract_settings().get();
        require!(token_id.is_valid_esdt_identifier(), "invalid token_id");
        require!(settings.token_id == token_id, "not the same token id");

        let client = self.blockchain().get_caller();
        let current_time_stamp = self.blockchain().get_block_timestamp();
        let mut stateVector = self.client_state(&client);


        if stateVector.is_empty() {
            let new_pull_state = ClientPullState {
                pull_id: (pull_id),
                pull_time_stamp_entry: (current_time_stamp),
                pull_time_stamp_last_collection: (current_time_stamp),
                pull_amount: amount,
            };
            stateVector.push(&new_pull_state);
        } else {
            for i in 1..=stateVector.len() {
                let mut prev_pull_state = stateVector.get(i);
                if prev_pull_state.pull_id == pull_id {
                    let rewords = self.calculate_rewords(
                        prev_pull_state.pull_amount.clone());
                    prev_pull_state.pull_amount += (&rewords + &amount);
                    prev_pull_state.pull_time_stamp_entry = current_time_stamp;
                    prev_pull_state.pull_time_stamp_last_collection = current_time_stamp;

                    stateVector.set(i, &prev_pull_state);
                }
            }
        }
    }

    fn calculate_rewords(&self,
                         pull_amount: BigUint<Self::Api>) -> BigUint {
        pull_amount / 2u32
    }

    fn is_valid_pull_id(&self,
                        pull_id: u32,
                        staking_settings: ContractSettings<Self::Api>) -> bool {
        let is_valid: bool =
            if pull_id == staking_settings.pull_a_id {
                true
            } else { false };
        return is_valid;
    }

    // storage

    #[view(getContractSettings)]
    #[storage_mapper("contractSettings")]
    fn contract_settings(&self) -> SingleValueMapper<ContractSettings<Self::Api>>;

    #[view(getClientState)]
    #[storage_mapper("clientState")]
    fn client_state(&self, client_address: &ManagedAddress)
                    -> VecMapper<ClientPullState<Self::Api>>;
}