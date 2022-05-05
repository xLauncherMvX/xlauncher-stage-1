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
    pub id: u32,
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
            pull_a_id: u32,
            pull_a_locking_time_span: u64,
            apy_a0_id: u32,
            apy_a0_start: u64,
            apy_a0_end: u64,
            apy_a0_apy: u64,
    ) {
        require!(token_id.is_valid_esdt_identifier(), "invalid token_id");
        require!(min_amount > 0, "min_amount must be positive");

        //let pull_a_id = 1u32;

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
            pull_a_apy: apy_a0_apy,
        };
        self.contract_settings().set(&settings);


        // variable pull a


        let mut configuration_items: ManagedVec<ApyConfiguration> = ManagedVec::new();
        let apy_a0 = ApyConfiguration {
            id: (apy_a0_id),
            apy: (apy_a0_apy),
            start_timestamp: (apy_a0_start),
            end_timestamp: (apy_a0_end),
        };
        configuration_items.push(apy_a0);


        let pull_a = Pull {
            id: (pull_a_id_clone),
            locking_time_span: (pull_a_locking_time_span_clone),
            apy_configuration: (configuration_items),
        };

        // variable settings
        let mut pull_items: ManagedVec<Pull<Self::Api>> = ManagedVec::new();
        pull_items.push(pull_a);
        let mut variable_settings = VariableContractSettings {
            token_id: (token_id_clone),
            min_amount: (min_amount_clone),
            pull_items: (pull_items),
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
        let vector_len = config_vector.len();
        if state_vector.len() > 0 && config_vector.len() > 0 {
            let mut total_rewords = BigUint::zero(); //total rewords
            for i in 1..=state_vector.len() {
                let state_item = state_vector.get(i);
                if state_item.pull_id == pull_id {
                    let mut item_rewords = BigUint::zero(); // item rewords
                    for k in 0..=(config_vector.len() - 1) {
                        let config_item = config_vector.get(k);
                        let copy_state_item = ClientPullState {
                            pull_id: (pull_id.clone()),
                            pull_amount: (state_item.pull_amount.clone()),
                            pull_time_stamp_last_collection: (state_item.pull_time_stamp_last_collection.clone()),
                            pull_time_stamp_entry: (state_item.pull_time_stamp_entry.clone()),
                        };
                        let config_rewords = self.calculate_rewords_v2(copy_state_item,
                                                                       config_item,
                                                                       current_time_stamp);
                        if config_rewords > BigUint::zero() {
                            item_rewords += config_rewords;
                        }
                    }
                    if item_rewords > 0 {
                        sc_panic!("Computed rewords = {}", item_rewords);
                    }
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

    fn calculate_rewords_v2(&self,
                            client_pull_state: ClientPullState<Self::Api>,
                            apy_configuration: ApyConfiguration,
                            current_time_stamp: u64) -> BigUint {
        let zero = BigUint::zero();
        if current_time_stamp < apy_configuration.start_timestamp {
            return zero;
        }
        if current_time_stamp < apy_configuration.end_timestamp{

        }
        let seconds_in_year: u64 = 60 * 60 * 24 * 365;
        let pull_apy: u64 = apy_configuration.apy;
        let bu_s_in_year = BigUint::from(seconds_in_year); // seconds in year as BigUint
        let bu_apy = BigUint::from(pull_apy); // pull api as BigUint
        let bu_amount = client_pull_state.pull_amount.clone(); // pull amount as BigUint
        let bu_hundred = BigUint::from(100u64); // 100 as BigUint
        let bu_r_in_year = (&bu_amount * &bu_apy) / &bu_hundred; // rewords in one year as BigUint
        let bu_r_in_1_second = &bu_r_in_year / &bu_s_in_year; // rewords in one second as BigUint
        let mut seconds = 0_u64;
        // let seconds = &current_time_stamp - &pull_time_stamp_last_collection; // elapsed seconds since last collection
        // let bu_seconds = BigUint::from(seconds); // elapsed seconds as BigUint
        // let rewords = &bu_seconds * &bu_r_in_1_second; // calculate rewords
        // return rewords;
        //


        return zero;
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

        for i in 0..=(pull_items.len() - 1) {
            let pull = pull_items.get(i);
            if pull.id == pull_id {
                let api_config = pull.apy_configuration;
                return api_config;
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