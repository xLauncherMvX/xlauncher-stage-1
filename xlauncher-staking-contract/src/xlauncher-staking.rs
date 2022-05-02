#![no_std]
#![feature(generic_associated_types)]

extern crate alloc;

use alloc::string::ToString;

elrond_wasm::imports!();
elrond_wasm::derive_imports!();


#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode)]
pub struct ContractSettings<M: ManagedTypeApi> {
    pub token_id: TokenIdentifier<M>,
    pub min_amount: BigUint<M>,
    pub pull_a_id: u32,
    pub pull_a_locking_time_span: u64,
    pub pull_a_apy: u64,
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode)]
pub struct ClientPullState<M: ManagedTypeApi> {
    pub pull_id: u32,
    pub pull_time_stamp_entry: u64,
    pub pull_time_stamp_last_collection: u64,
    pub pull_amount: BigUint<M>,
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode)]
pub struct VariableContractSettings<M: ManagedTypeApi> {
    pub token_id: TokenIdentifier<M>,
    pub min_amount: BigUint<M>,
    pub pull_items: ManagedVec<M, Pull<M>>,
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode)]
pub struct Pull<M: ManagedTypeApi> {
    pub id: u64,
    pub locking_time_span: u64,
    pub api_configuration: ManagedVec<M, ApiConfiguration>,
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode)]
pub struct ApiConfiguration {
    pub id: u64,
    pub start_timestamp: u64,
    pub end_timestamp: u64,
    pub api: u64,
}
//
// #[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode)]
// pub struct ClientVariableState<M: ManagedTypeApi> {
//     pub pull_id: u32,
//     pub entry_time_stamp: u64,
//     pub last_collection_time_stamp: u64,
// }


#[elrond_wasm::derive::contract]
pub trait XLauncherStaking {
    #[init]
    fn init(&self,
            token_id: TokenIdentifier,
            min_amount: BigUint,
            pull_a_locking_time_span: u64,
            pull_a_apy: u64,
    ) {
        require!(token_id.is_valid_esdt_identifier(), "invalid token_id");
        require!(min_amount > 0, "min_amount must be positive");

        let pull_a_id = 1u32;

        let settings = ContractSettings {
            token_id,
            min_amount,
            pull_a_id,
            pull_a_locking_time_span,
            pull_a_apy,
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
        let mut state_vector = self.client_state(&client);


        if state_vector.is_empty() {
            let new_pull_state = ClientPullState {
                pull_id: (pull_id),
                pull_time_stamp_entry: (current_time_stamp),
                pull_time_stamp_last_collection: (current_time_stamp),
                pull_amount: amount,
            };
            state_vector.push(&new_pull_state);
        } else {
            for i in 1..=state_vector.len() {
                let mut prev_pull_state = state_vector.get(i);
                if prev_pull_state.pull_id == pull_id {
                    let rewords = self.calculate_rewords(
                        prev_pull_state.pull_id.clone(),
                        prev_pull_state.pull_time_stamp_last_collection.clone(),
                        current_time_stamp.clone(),
                        prev_pull_state.pull_amount.clone());
                    prev_pull_state.pull_amount += &rewords + &amount;
                    prev_pull_state.pull_time_stamp_entry = current_time_stamp;
                    prev_pull_state.pull_time_stamp_last_collection = current_time_stamp;

                    state_vector.set(i, &prev_pull_state);
                }
            }
        }
    }

    fn calculate_rewords(&self,
                         pull_id: u32,
                         pull_time_stamp_last_collection: u64,
                         current_time_stamp: u64,
                         pull_amount: BigUint<Self::Api>) -> BigUint {
        let seconds_in_year: u64 = 60 * 60 * 24 * 365;
        let pull_apy: u64 = self.get_pull_apy(pull_id.clone());
        let bu_s_in_year = BigUint::from(seconds_in_year); // seconds in year as BigUint
        let bu_apy = BigUint::from(pull_apy); // pull api as BigUint
        let bu_amount = pull_amount.clone(); // pull amount as BigUint
        let bu_hundred = BigUint::from(100u64); // 100 as BigUint
        let bu_r_in_year = (&bu_amount * &bu_apy) / &bu_hundred; // rewords in one year as BigUint
        let bu_r_in_1_second = &bu_r_in_year / &bu_s_in_year; // rewords in one second as BigUint
        let seconds = &current_time_stamp - &pull_time_stamp_last_collection; // elapsed seconds since last collection
        let bu_seconds = BigUint::from(seconds); // elapsed seconds as BigUint
        let rewords = &bu_seconds * &bu_r_in_1_second; // calculate rewords
        return rewords;
    }

    fn get_pull_apy(&self,
                    pull_id: u32) -> u64 {
        let contract_settings = self.contract_settings().get();
        if pull_id == contract_settings.pull_a_id {
            return contract_settings.pull_a_apy.clone();
        }
        sc_panic!("Not valid pull id");
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