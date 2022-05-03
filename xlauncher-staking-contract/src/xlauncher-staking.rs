#![no_std]
#![feature(generic_associated_types)]

extern crate alloc;

use alloc::format;
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

// how to initialize variables
// token_id, min_amount
//
// pull_a_id, pull_a_locking_time_span
// apy_a0_id, apy_a0_start, apy_a0_end, apy_a0_apy
// apy_a1_id, apy_a1_start, apy_a1_end, apy_a1_apy
//
// pull_b_id, pull_b_locking_time_span
// apy_b0_id, apy_b0_start, apy_b0_end, apy_b0_apy
// apy_a1_id, apy_a1_start, apy_a1_end, apy_a1_apy
#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode)]
pub struct VariableContractSettings<M: ManagedTypeApi> {
    pub token_id: TokenIdentifier<M>,
    pub min_amount: BigUint<M>,
    pub pull_items: ManagedVec<M, Pull<M>>,
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode)]
pub struct Pull<M: ManagedTypeApi> {
    pub id: u32,
    pub locking_time_span: u64,
    pub apy_configuration: ManagedVec<M, ApyConfiguration>,
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode)]
pub struct ApyConfiguration {
    pub id: u64,
    pub apy: u64,
    pub start_timestamp: u64,
    pub end_timestamp: u64,
}


#[elrond_wasm::derive::contract]
pub trait XLauncherStaking {
    #[init]
    fn init(&self,
            token_id: TokenIdentifier,
            min_amount: BigUint,
            pull_a_locking_time_span: u64,
            pull_a0_apy: u64, // ignored for variable setting
    ) {
        require!(token_id.is_valid_esdt_identifier(), "invalid token_id");
        require!(min_amount > 0, "min_amount must be positive");

        let pull_a_id = 1u32;

        let pull_a_id_clone = pull_a_id.clone();
        let token_id_clone = token_id.clone();
        let min_amount_clone = min_amount.clone();
        let pull_a_locking_time_span_clone = pull_a_locking_time_span.clone();

        // standard settings
        let settings = ContractSettings {
            token_id,
            min_amount,
            pull_a_id,
            pull_a_locking_time_span,
            pull_a_apy: pull_a0_apy,
        };
        self.contract_settings().set(&settings);


        // variable pull a
        let mut _configuration_items: ManagedVec<ApyConfiguration> = ManagedVec::new();


        let pull_a = Pull {
            id: (pull_a_id_clone),
            locking_time_span: (pull_a_locking_time_span_clone),
            apy_configuration: (_configuration_items),
        };

        // variable settings
        let mut _pull_items: ManagedVec<Pull<Self::Api>> = ManagedVec::new();
        _pull_items.push(pull_a);
        let mut variable_settings = VariableContractSettings {
            token_id: (token_id_clone),
            min_amount: (min_amount_clone),
            pull_items: (_pull_items),
        };
        self.variable_contract_settings().set(&variable_settings)
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

        let new_pull_state = ClientPullState {
            pull_id: (pull_id),
            pull_time_stamp_entry: (current_time_stamp),
            pull_time_stamp_last_collection: (current_time_stamp),
            pull_amount: amount,
        };

        state_vector.push(&new_pull_state);
        /*
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
        }*/
    }

    #[endpoint]
    fn claim(&self,
             pull_id: u32) {
        let client = self.blockchain().get_caller();
        let current_time_stamp = self.blockchain().get_block_timestamp();
        let mut state_vector = self.client_state(&client);
        let id_clone = pull_id.clone();
        let config_vector = self.get_apy_config_vector(id_clone);
        if config_vector.len() ==0{
            //let message = sc_format!("{}{}","Not valid pull id=",pull_id);
            sc_panic!("Not valid id = {}", pull_id)
        }

        let zero = BigUint::from(0u64);
        for i in 1..=state_vector.len() {
            let mut prev_pull_state = state_vector.get(i);
            if prev_pull_state.pull_id == pull_id {

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

    fn calculate_rewords_v2(&self,
                            client_pull_state: ClientPullState<Self::Api>,
                            apy_configuration: ApyConfiguration) -> BigUint {
        let zero: u64 = 0;
        let val = BigUint::from(zero);
        return val;
        // let seconds_in_year: u64 = 60 * 60 * 24 * 365;
        // let pull_apy: u64 = self.get_pull_apy(pull_id.clone());
        // let bu_s_in_year = BigUint::from(seconds_in_year); // seconds in year as BigUint
        // let bu_apy = BigUint::from(pull_apy); // pull api as BigUint
        // let bu_amount = pull_amount.clone(); // pull amount as BigUint
        // let bu_hundred = BigUint::from(100u64); // 100 as BigUint
        // let bu_r_in_year = (&bu_amount * &bu_apy) / &bu_hundred; // rewords in one year as BigUint
        // let bu_r_in_1_second = &bu_r_in_year / &bu_s_in_year; // rewords in one second as BigUint
        // let seconds = &current_time_stamp - &pull_time_stamp_last_collection; // elapsed seconds since last collection
        // let bu_seconds = BigUint::from(seconds); // elapsed seconds as BigUint
        // let rewords = &bu_seconds * &bu_r_in_1_second; // calculate rewords
        // return rewords;
    }

    fn get_pull_apy(&self,
                    pull_id: u32) -> u64 {
        let contract_settings = self.contract_settings().get();
        if pull_id == contract_settings.pull_a_id {
            return contract_settings.pull_a_apy.clone();
        }
        sc_panic!("Not valid pull id");
    }

    fn get_apy_config_vector(&self, pull_id: u32) -> ManagedVec<ApyConfiguration> {

        let var_setting = self.variable_contract_settings().get();
        let pull_items = var_setting.pull_items;
        for i in 1..pull_items.len() {
            let item = pull_items.get(i); // Pull
            if pull_id == item.id {
                let located_vector = item.apy_configuration;
                return located_vector;
            }
        }
        let empty_vector: ManagedVec<ApyConfiguration> = ManagedVec::new();
        return empty_vector;
    }

    // storage

    #[view(getContractSettings)]
    #[storage_mapper("contractSettings")]
    fn contract_settings(&self) -> SingleValueMapper<ContractSettings<Self::Api>>;

    #[view(getVariableContractSettings)]
    #[storage_mapper("variableContractSettings")]
    fn variable_contract_settings(&self) -> SingleValueMapper<VariableContractSettings<Self::Api>>;

    #[view(getClientState)]
    #[storage_mapper("clientState")]
    fn client_state(&self, client_address: &ManagedAddress)
                    -> VecMapper<ClientPullState<Self::Api>>;
}