#![no_std]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

mod staking_data;

use staking_data::*;

#[multiversx_sc::contract]
pub trait HelloWorld {
    #[init]
    fn init(&self) {}

    #[only_owner]
    #[endpoint(setContractSettings)]
    fn set_contract_settings(&self,
                             token_id: TokenIdentifier,
                             sft_id: TokenIdentifier,
                             sft_nonce: u64,
                             max_staking_val: BigUint,
                             unstake_xlh_lock_span: u64,
                             unstake_sft_lock_span: u64,
                             min_apy: u64,
                             max_apy: u64,
                             sft_increment_apy: u64,
    ) {
        let settings = StakingSettings {
            token_id,
            sft_id,
            sft_nonce,
            max_staking_val,
            unstake_xlh_lock_span,
            unstake_sft_lock_span,
            min_apy,
            max_apy,
            sft_increment_apy,
        };
        self.contract_settings().set(&settings);

        //check if total_staked_data is set and if not set to default
        if self.total_staked_data().is_empty() {
            let total_staked_data = TotalStakedData {
                last_pool_id: 0,
                total_xlh_staked: BigUint::zero(),
                total_xlh_available_for_rewords: BigUint::zero(),
                total_sft_staked: 0,
            };
            self.total_staked_data().set(&total_staked_data);
        }
    }


    #[only_owner]
    #[endpoint(createNewPool)]
    fn create_new_pool(&self) {
        let mut total_staked_data = self.total_staked_data().get();
        let pull_id = total_staked_data.last_pool_id + 1;
        //check pool_data does not exist
        assert!(self.pool_data(pull_id).is_empty(), "pool already exists");
        total_staked_data.last_pool_id = pull_id;
        self.total_staked_data().set(&total_staked_data);

        let new_pool = PoolData {
            pool_id: pull_id,
            pool_total_xlh: BigUint::zero(),
        };
        self.pool_data(pull_id).set(&new_pool);
    }


    #[payable("*")]
    #[endpoint(fundWithRewords)]
    fn fund_with_rewords(&self) {
        let egld_or_esdt_token_identifier = self.call_value().egld_or_single_esdt();

        let amount = egld_or_esdt_token_identifier.amount;
        let token_id = egld_or_esdt_token_identifier.token_identifier;
        let client = self.blockchain().get_caller();

        let settings = self.contract_settings().get();

        //check token_id
        assert!(token_id == settings.token_id, "wrong token id");
        //check amount
        assert!(amount > 0, "amount must be greater than 0");
        sc_print!("hell endpoint fundWithRewords amount={}", amount);

        //update total_staked_data
        let mut total_staked_data = self.total_staked_data().get();
        total_staked_data.total_xlh_available_for_rewords += amount;
        self.total_staked_data().set(&total_staked_data);
    }

    #[payable("*")]
    #[endpoint(stakeXlh)]
    fn stake_xlh(&self, pool_id: u64) {
        let egld_or_esdt_token_identifier = self.call_value().egld_or_single_esdt();

        let amount = egld_or_esdt_token_identifier.amount;
        let token_id = egld_or_esdt_token_identifier.token_identifier;
        let client = self.blockchain().get_caller();

        let settings = self.contract_settings().get();

        //check token_id
        assert!(token_id == settings.token_id, "wrong token id");
        //check amount
        assert!(amount > 0, "amount must be greater than 0");

        //check client state exists and if not create it
        if self.client_state(&client).is_empty() {
            let xlh_data: ManagedVec<ClientXlhData<Self::Api>> = ManagedVec::new();
            let new_client = ClientData {
                sft_amount: 0_u64,
                xlh_data,
            };
            self.client_state(&client).set(&new_client);
        }

        let current_time_stamp = self.blockchain().get_block_timestamp();


        //iterate over items and if located update item else add new item
        let mut client_state = self.client_state(&client).get();
        let xlh_data = &mut client_state.xlh_data;
        let mut client_pool_found = false;
        for i in 0..xlh_data.len() {
            let client_xlh_data = xlh_data.get(i);
            if client_xlh_data.pool_id == pool_id {
                client_pool_found = true;
                break;
            }
        }
        if !client_pool_found {
            let new_client_xlh_data = ClientXlhData {
                pool_id,
                xlh_amount: amount.clone(),
                time_stamp: current_time_stamp,
            };
            xlh_data.push(new_client_xlh_data);
        }

        // persist client state
        self.client_state(&client).set(client_state);

        //update total_staked_data
        let mut total_staked_data = self.total_staked_data().get();
        total_staked_data.total_xlh_staked += amount;
        self.total_staked_data().set(&total_staked_data);
    }

    #[endpoint(claimRewards)]
    fn claim_rewards(&self, pool_id: u64) {
        let client = self.blockchain().get_caller();
        let current_time_stamp = self.blockchain().get_block_timestamp();

        let rewords = self.compute_pool_rewords(&pool_id, &current_time_stamp, &client);
        self.update_client_pool_time_stamp(&pool_id, &client, current_time_stamp);
        self.deduct_rewords_from_total_data(&rewords);

        let token_id = self.contract_settings().get().token_id;

        //send rewords to client
        self.send().direct_esdt(&client, &token_id, 0, &rewords);
    }

    fn deduct_rewords_from_total_data(&self, rewords: &BigUint) {
        let mut total_staked_data = self.total_staked_data().get();




        let total_xlh_available_for_rewords = total_staked_data.total_xlh_available_for_rewords;
        sc_print!("total_xlh_available_for_rewords={}, rewords={}", total_xlh_available_for_rewords, rewords);
        let available_rewords = total_xlh_available_for_rewords - rewords; // this will throw error is result would be negative

        sc_print!("available_rewords={}", available_rewords);

        total_staked_data.total_xlh_available_for_rewords = available_rewords;
        self.total_staked_data().set(&total_staked_data);
    }

    fn update_client_pool_time_stamp(&self, pool_id: &u64, client: &ManagedAddress, current_time_stamp: u64) {
        let mut client_state = self.client_state(&client).get();
        let xlh_data = &mut client_state.xlh_data;
        for i in 0..xlh_data.len() {
            let client_xlh_data = &mut xlh_data.get(i);
            if client_xlh_data.pool_id == *pool_id {
                client_xlh_data.time_stamp = current_time_stamp;
                xlh_data.set(i, client_xlh_data);
                sc_print!("udpate_client_pool_time_stamp stamp={}", current_time_stamp);
                break;
            }
        }
        self.client_state(&client).set(client_state);
    }

    fn compute_pool_rewords(&self,
                            pool_id: &u64,
                            current_time_stamp: &u64,
                            client: &ManagedAddress) -> BigUint<Self::Api> {
        let mut optional_data: Option<ClientXlhData<Self::Api>> = None;

        //iterate over items and if located update item else add new item
        let mut client_state = self.client_state(&client).get();
        let xlh_data = &mut client_state.xlh_data;
        for i in 0..xlh_data.len() {
            let client_xlh_data = xlh_data.get(i);
            if client_xlh_data.pool_id == *pool_id {
                optional_data = Some(client_xlh_data);
                break;
            }
        }

        if optional_data.is_none() {
            sc_panic!("Not able to locate client pool_id={}",pool_id);
        }


        let client_xlh_data = optional_data.unwrap();

        let staking_settings = self.contract_settings().get();

        let apy = self.compute_client_apy(client_state, staking_settings);
        let rewords = self.compute_rewords(&client_xlh_data, &current_time_stamp, &apy);

        sc_print!("Hello compute_pool_rewords apy={}, rewords={}",apy,rewords);

        return rewords;
    }

    fn compute_rewords(&self,
                       client_xlh_data: &ClientXlhData<Self::Api>,
                       current_time_stamp: &u64,
                       apy: &u64) -> BigUint<Self::Api> {
        let bu_hundred = BigUint::from(100u64); // 100 as BigUint
        let bu_apy = BigUint::from(*apy); // pool api as BigUint
        let bu_xlh_amount = client_xlh_data.xlh_amount.clone(); // xlh amount as BigUint
        let bu_r_in_year = (bu_xlh_amount * bu_apy) / bu_hundred; // rewords in year as BigUint

        let seconds_diff = current_time_stamp - client_xlh_data.time_stamp;
        let seconds_in_year: u64 = 60 * 60 * 24 * 365;
        let bu_s_in_year = BigUint::from(seconds_in_year); // seconds in year as BigUint
        let bu_r_in_1_second = &bu_r_in_year / &bu_s_in_year; // rewards in one second as BigUint

        let rewords = self.compute_seconds_rewards(&seconds_diff, bu_r_in_1_second);

        return rewords;
    }

    fn compute_seconds_rewards(&self, &seconds: &u64, bu_r_in_1_second: BigUint) -> BigUint {
        let bu_seconds = BigUint::from(seconds);
        let rewards = (&bu_seconds * &bu_r_in_1_second) / BigUint::from(10000_u64);
        return rewards;
    }

    fn compute_client_apy(&self,
                          client_data: ClientData<Self::Api>,
                          staking_settings: StakingSettings<Self::Api>,
    ) -> u64 {
        let min_apy = staking_settings.min_apy;
        if client_data.sft_amount == 0_u64 {
            return min_apy;
        }

        let mut total_apy = min_apy * client_data.sft_amount;

        return if total_apy < staking_settings.max_apy {
            total_apy
        } else {
            staking_settings.max_apy
        };
    }

    // storage

    #[view(getContractSettings)]
    #[storage_mapper("contractSettings")]
    fn contract_settings(&self) -> SingleValueMapper<StakingSettings<Self::Api>>;

    #[view(getTotalStakedData)]
    #[storage_mapper("totalStakedData")]
    fn total_staked_data(&self) -> SingleValueMapper<TotalStakedData<Self::Api>>;

    #[storage_mapper("poolData")]
    fn pool_data(&self, pool_id: u64) -> SingleValueMapper<PoolData<Self::Api>>;

    #[view(getClientState)]
    #[storage_mapper("clientState")]
    fn client_state(
        &self,
        client_address: &ManagedAddress,
    ) -> SingleValueMapper<ClientData<Self::Api>>;
}





