#![no_std]
#![feature(generic_associated_types)]

extern crate alloc;

elrond_wasm::imports!();
elrond_wasm::derive_imports!();

mod staking_data;

use staking_data::*;

#[elrond_wasm::contract]
pub trait XLauncherStaking {
    // I think "pool" would be a more representative term for the scope of the contract, rather than pull
    // - renamed to pool
    // It would also help by making the code more easy to read and understand
    // Try to maintain each pool individually, so maybe deploy with the generic parameters and have another endpoint to update the pools
    // This would make it easier to introduce new pools without requiring a contract upgrade
    // - this is the underling design for for now we focus on present business requirements.
    #[init]
    fn init(&self,
            token_id: TokenIdentifier,
            min_amount: BigUint,

            //pool a no lockout: 0
            pool_a_id: u32,
            pool_a_locking_time_span: u64,
            apy_a0_id: u32,
            apy_a0_start: u64,
            apy_a0_end: u64,
            apy_a0_apy: u64,

            //pull b 60 days: 5184000
            pool_b_id: u32,
            pool_b_locking_time_span: u64,
            apy_b0_id: u32,
            apy_b0_start: u64,
            apy_b0_end: u64,
            apy_b0_apy: u64,

            //pull c 180 days: 15552000
            pool_c_id: u32,
            pool_c_locking_time_span: u64,
            apy_c0_id: u32,
            apy_c0_start: u64,
            apy_c0_end: u64,
            apy_c0_apy: u64,
    ) {
        require!(token_id.is_valid_esdt_identifier(), "invalid token_id");
        require!(min_amount > 0_u64, "min_amount must be positive");

        if self.variable_contract_settings().is_empty() {
            //we create the initial set of variable settings

            let pool_a = self.build_pool(
                pool_a_id,
                pool_a_locking_time_span,
                apy_a0_id,
                apy_a0_start,
                apy_a0_end,
                apy_a0_apy);

            let pool_b = self.build_pool(
                pool_b_id,
                pool_b_locking_time_span,
                apy_b0_id,
                apy_b0_start,
                apy_b0_end,
                apy_b0_apy);

            let pool_c = self.build_pool(
                pool_c_id,
                pool_c_locking_time_span,
                apy_c0_id,
                apy_c0_start,
                apy_c0_end,
                apy_c0_apy);


            // 60 * 60 * 24 * 10 = 864000 (10 days)
            let days_10 = 864000_u64;
            let mut pool_items: ManagedVec<Pool<Self::Api>> = ManagedVec::new();
            pool_items.push(pool_a);
            pool_items.push(pool_b);
            pool_items.push(pool_c);
            let variable_settings = VariableContractSettings {
                token_id: (token_id),
                min_amount: (min_amount),
                pull_items: (pool_items),
                contract_is_active: true,
                unstake_lock_span: days_10,
            };
            self.variable_contract_settings().set(&variable_settings)
        }
    }

    fn build_pool(self, pull_id: u32,
                  pull_locking_time_span: u64,
                  apy_0_id: u32,
                  apy_0_start: u64,
                  apy_0_end: u64,
                  apy_0_apy: u64, ) -> Pool<Self::Api> {
        let mut pull_a_config_vector: ManagedVec<ApyConfiguration> = ManagedVec::new();
        let apy_a0 = ApyConfiguration {
            id: (apy_0_id),
            apy: (apy_0_apy),
            start_timestamp: (apy_0_start),
            end_timestamp: (apy_0_end),
        };
        pull_a_config_vector.push(apy_a0);


        let pull_a = Pool {
            id: (pull_id),
            locking_time_span: (pull_locking_time_span),
            apy_configuration: (pull_a_config_vector),
        };
        return pull_a;
    }

    #[payable("*")]
    #[endpoint(fundContract)]
    fn fund_contract(&self) {
        let token_id = self.call_value().token();
        let settings: VariableContractSettings<Self::Api> = self.variable_contract_settings().get();
        require!(token_id.is_valid_esdt_identifier(), "invalid token_id");
        require!(settings.token_id == token_id, "not the same token id");
    }

    // NOTE
    // Same as the presale contract
    // - postponed storing the amount in the storage (not very relevant for our 1st use case)
    #[view(getTokenBalance)]
    fn get_token_balance(&self) -> BigUint {
        let settings: VariableContractSettings<Self::Api> = self.variable_contract_settings().get();
        let my_token_id = settings.token_id;
        let balance: BigUint = self.blockchain().get_sc_balance(&my_token_id, 0);
        return balance;
    }

    #[payable("*")]
    #[endpoint(stake)]
    fn stake(&self,
             pull_id: u32,
    ) {
        let (amount, token_id) = self.call_value().payment_token_pair();
        require!(self.contract_is_active(),"Contract is in maintenance");
        let settings: VariableContractSettings<Self::Api> = self.variable_contract_settings().get();
        require!(token_id.is_valid_esdt_identifier(), "invalid token_id");
        require!(settings.token_id == token_id, "not the same token id");
        require!(self.pull_exists(pull_id.clone()),"invalid pull_id={}",pull_id);


        let client = self.blockchain().get_caller();
        let current_time_stamp = self.blockchain().get_block_timestamp();
        let mut state_vector = self.client_state(&client);

        let new_pull_state = ClientPullState {
            pull_id: (pull_id),
            pull_time_stamp_entry: (current_time_stamp),
            pull_time_stamp_last_collection: (current_time_stamp),
            pull_amount: amount.clone(),
        };

        state_vector.push(&new_pull_state);
        self.append_client_if_needed();
        self.increment_total_staked_value(amount.clone());
    }

    fn append_client_if_needed(&self) {
        let mut clients_set = self.client_list();
        let client = self.blockchain().get_caller();
        if !clients_set.contains(&client) {
            clients_set.insert(client);
        }
    }

    fn increment_total_staked_value(&self, amount: BigUint) {
        self.total_staked_value().update(|total| *total += &amount);
    }

    fn decrement_total_staked_value(&self, amount: BigUint) {
        self.total_staked_value().update(|total| *total -= &amount);
    }

    fn add_to_unstake_value(&self, time_stamp: u64, total_amount: BigUint, requested_amount: BigUint) {
        let client = self.blockchain().get_caller();
        let settings = self.variable_contract_settings().get();
        let unstake_lock_span: u64 = settings.unstake_lock_span;
        let free_after_time_stamp: u64 = time_stamp + unstake_lock_span;
        if self.unstake_state(&client).is_empty() {
            let unstake_state = UnstakeState {
                total_unstaked_amount: total_amount.clone(),
                requested_amount,
                free_after_time_stamp,
            };
            self.unstake_state(&client).set(&unstake_state);
        } else {
            let mut unstake_state = self.unstake_state(&client).get();
            unstake_state.free_after_time_stamp = free_after_time_stamp;
            unstake_state.total_unstaked_amount = unstake_state.total_unstaked_amount + total_amount;

            unstake_state.requested_amount = unstake_state.requested_amount + requested_amount;

            self.unstake_state(&client).set(&unstake_state);
        }
    }

    #[endpoint(claimUnstakedValue)]
    fn claim_unstaked_value(&self) {
        require!(self.contract_is_active(),"Contract is in maintenance");
        let current_time_stamp: u64 = self.blockchain().get_block_timestamp();
        let client = self.blockchain().get_caller();
        require!(!self.unstake_state(&client).is_empty(), "No funds to claim");
        let unstake_state = self.unstake_state(&client).get();

        sc_print!("claim_unstaked_value_log: current_time_stamp={}, free_after_time_stamp={}"
        , current_time_stamp, unstake_state.free_after_time_stamp);
        require!( unstake_state.free_after_time_stamp < current_time_stamp,
            "current_time_stamp is smaller then free_after_time_stamp");


        require!(BigUint::zero() < unstake_state.total_unstaked_amount, "No funds available to claim");
        let token_id = self.get_contract_token_id();
        self.send().direct(
            &client,
            &token_id,
            0,
            &unstake_state.total_unstaked_amount,
            &[]);
        self.unstake_state(&client).clear();
        self.decrement_total_staked_value(unstake_state.requested_amount);
    }

    #[endpoint(unstake)]
    fn unstake(&self,
               pull_id: u32,
               amount: BigUint) {
        require!(self.contract_is_active(),"Contract is in maintenance");
        let mut multi_val_vec: MultiValueEncoded<MultiValue4<u32, u64, u64, BigUint>> = MultiValueEncoded::new();

        let client = self.blockchain().get_caller();
        let current_time_stamp = self.blockchain().get_block_timestamp();

        let client_vector = self.client_state(&client);
        let config_vector = self.get_apy_config_vector(pull_id.clone());
        let locking_time_span = self.get_pull_locking_time_span(pull_id.clone());


        let mut selected_items: ManagedVec<ClientPullState<Self::Api>> = ManagedVec::new();
        let mut total_items_value = BigUint::zero();
        let mut total_rewards = BigUint::zero(); //total rewords

        let mut lev_1_count = 0;
        let mut lev_2_count = 0;
        let mut lev_3_count = 0;

        if client_vector.len() > 0 && config_vector.len() > 0 {
            for i in 1..=client_vector.len() {
                let client_item = client_vector.get(i);
                let client_item_id = client_item.pull_id.clone();

                require!(client_item.pull_id == pull_id , "client_item.pull_id={}, pull_id={}",client_item_id, pull_id);

                let unstake_time = locking_time_span + client_item.pull_time_stamp_entry;

                lev_1_count = lev_1_count + 1;


                if client_item.pull_id == pull_id
                    && unstake_time < current_time_stamp
                    && total_items_value < amount {
                    selected_items.push(client_item.clone());

                    lev_2_count = lev_2_count + 1;

                    for k in 0..=(config_vector.len() - 1) {
                        let config_item = config_vector.get(k);
                        let item_rewords = self.calculate_rewards_v2(client_item.clone(),
                                                                     config_item,
                                                                     current_time_stamp);
                        total_items_value = total_items_value + client_item.pull_amount.clone();
                        total_rewards = total_rewards + item_rewords;

                        lev_3_count = lev_3_count + 1;

                        multi_val_vec.push(
                            MultiValue4::from((
                                client_item.pull_id.clone(),
                                client_item.pull_time_stamp_entry.clone(),
                                client_item.pull_time_stamp_last_collection.clone(),
                                client_item.pull_amount.clone()
                            ))
                        );
                    }
                }
            }
        }

        require!(amount <= total_items_value , "total staking value smaller then requested\
         amount={}, val={}, c1={}, c2={}, c3={}",amount,total_items_value,lev_1_count, lev_2_count, lev_3_count);


        //case 1 selected amount is exact amount staked
        if total_items_value == amount {
            for i in 0..=(selected_items.len() - 1) {
                let item = selected_items.get(i);
                self.remove_client_item_from_storadge(&item.pull_time_stamp_entry, &client);
            }
            let total_value = total_items_value.clone() + total_rewards.clone();
            if total_value > BigUint::zero() {
                self.add_to_unstake_value(current_time_stamp, total_value, amount);
                return;
            }
        }

        //case 2 amount is a bit smaller then total_items_value
        if amount < total_items_value {
            for i in 0..=(selected_items.len() - 1) {
                let item = selected_items.get(i);
                self.remove_client_item_from_storadge(&item.pull_time_stamp_entry, &client);
            }

            // select last item
            let mut last_tem = selected_items.get(selected_items.len() - 1);

            // change the amount with what is left over and the last time collection
            let diff = total_items_value.clone() - amount.clone();
            last_tem.pull_amount = diff;
            last_tem.pull_time_stamp_last_collection = current_time_stamp;

            // push back this lastItem to the user staked vector;
            let mut updated_vector = self.client_state(&client);
            updated_vector.push(&last_tem);

            // compute how much we need to transfer in client wallet
            let total_case_2_value = amount.clone() + total_rewards.clone();
            if total_case_2_value > BigUint::zero() {
                self.add_to_unstake_value(current_time_stamp,
                                          total_case_2_value,
                                          amount);
                return;
            }
        }
    }

    fn remove_client_item_from_storadge(&self, entry_time_stamp: &u64, client: &ManagedAddress) {
        let mut id = 0_usize;
        let mut client_vector = self.client_state(&client);
        for i in 1..=client_vector.len() {
            let item = client_vector.get(i);
            if item.pull_time_stamp_entry == *entry_time_stamp {
                id = i;
                break;
            }
        }
        if id > 0 {
            client_vector.swap_remove(id);
        } else {
            sc_panic!("No item located to remove id={}", id)
        }
    }


    // The staking rewards calculation is way too complicated and it has lots of iterations, that translates in higher gas costs for the tx
    // You could try to use events for previous claims and just focus on calculations from the current time forward
    // Also, based on the scope of the staking contract, as it will have more and more users, it will be more costly to save all users data
    // You could try an approach based on the DEX implementation, using a META ESDT as staking_position. But this may take quite some time to refactor
    // - we will go live with the current logic for now and work on a second version of this after we go live and I will explore
    //   - learn how events could reduce gas costs in current logic
    //   - employ DEX solution based on META ESTD staking_position

    #[endpoint(claim)]
    fn claim(&self,
             pull_id: u32) {
        require!(self.contract_is_active(),"Contract is in maintenance");
        let client = self.blockchain().get_caller();
        let current_time_stamp = self.blockchain().get_block_timestamp();

        let total_rewards = self.calculate_pull_rewords(pull_id, current_time_stamp);

        if total_rewards > 0_u64 {
            let token_id = self.get_contract_token_id();
            self.send().direct(
                &client,
                &token_id,
                0,
                &total_rewards,
                &[]);
        }
    }


    #[endpoint(reinvest)]
    fn reinvest(&self,
                pull_id: u32) {
        require!(self.contract_is_active(),"Contract is in maintenance");
        let client = self.blockchain().get_caller();
        let current_time_stamp = self.blockchain().get_block_timestamp();


        let total_rewards = self.calculate_pull_rewords(pull_id, current_time_stamp);


        if total_rewards > 0_u64 {
            let new_pull_state = ClientPullState {
                pull_id: (pull_id),
                pull_time_stamp_entry: (current_time_stamp),
                pull_time_stamp_last_collection: (current_time_stamp),
                pull_amount: total_rewards.clone(),
            };

            self.client_state(&client).push(&new_pull_state);
            self.increment_total_staked_value(total_rewards);
        }
    }

    fn calculate_pull_rewords(&self, pull_id: u32, current_time_stamp: u64) -> BigUint {
        let client_vector = self.get_client_staked_items_by_pull_id(pull_id.clone());
        let config_vector = self.get_apy_config_vector(pull_id.clone());
        if (client_vector.len() == 0) || (config_vector.len() == 0) {
            sc_panic!("client and config vector are empty");
        }
        let mut total_rewards = BigUint::zero(); //total rewords

        for i in 0..=(client_vector.len() - 1) {
            let client_item = client_vector.get(i);
            let mut item_rewards = BigUint::zero(); // item rewords

            for k in 0..=(config_vector.len() - 1) {
                let config_item = config_vector.get(k);

                let config_rewords = self.calculate_rewards_v2(client_item.clone(),
                                                               config_item,
                                                               current_time_stamp);
                if config_rewords > BigUint::zero() {
                    item_rewards += config_rewords;
                }
            }

            if item_rewards > 0_u64 {
                self.update_staked_item_collection_time(client_item.pull_time_stamp_entry,
                                                        current_time_stamp);
                total_rewards += item_rewards;
            }
        }
        return total_rewards;
    }

    // NOTE
    // There is no max limit of how many tokens an user can receive, based on the total number of funding tokens
    // This means that the token has an infinite supply? If so, how do you know when to send more funds
    // I think it would be better to have an exact amount of reward tokens saved per pool, and each user would receive staking rewards based on the weight of his position
    // Also, you should deduplicate the code by removing the function calls from the if syntaxes and only letting the seconds variable calculation
    // todo: we need to discuss about this. For now we distribute rewords only based on the value and the time staked. We will probably move over weight based rewords in the 3rd year
    fn calculate_rewards_v2(&self,
                            client_pull_state: ClientPullState<Self::Api>,
                            apy_configuration: ApyConfiguration,
                            current_time_stamp: u64) -> BigUint {
        let s = apy_configuration.start_timestamp;
        let e = apy_configuration.end_timestamp;
        let l = client_pull_state.pull_time_stamp_last_collection;
        let t = current_time_stamp;

        let seconds_in_year: u64 = 60 * 60 * 24 * 365;
        let pull_apy: u64 = apy_configuration.apy;
        let bu_s_in_year = BigUint::from(seconds_in_year); // seconds in year as BigUint
        let bu_apy = BigUint::from(pull_apy); // pull api as BigUint
        let bu_amount = client_pull_state.pull_amount.clone(); // pull amount as BigUint
        let bu_hundred = BigUint::from(100u64); // 100 as BigUint
        let bu_r_in_year = (&bu_amount * &bu_apy) / &bu_hundred; // rewords in one year as BigUint
        let bu_r_in_1_second = &bu_r_in_year / &bu_s_in_year; // rewords in one second as BigUint

        //case zero
        if t < l {
            sc_panic!("t shold never be smaller then l: t={}, l={}", t,l);
        }

        //case 1
        if t < s {
            return BigUint::zero();
        }

        //case 2
        if l < s && s < t && t <= e {
            let seconds = t - s; // elapsed seconds
            let rewards = self.compute_seconds_rewards(&seconds,
                                                       bu_r_in_1_second);
            return rewards;
        }

        //case 3
        if s <= l && t <= e {
            let seconds = t - l;
            let rewards = self.compute_seconds_rewards(&seconds,
                                                       bu_r_in_1_second);
            return rewards;
        }

        //case 4
        if s <= l && l <= e && e < t {
            let seconds = e - l;
            let rewards = self.compute_seconds_rewards(&seconds,
                                                       bu_r_in_1_second);
            return rewards;
        }

        //case 5
        if e <= l {
            return BigUint::zero();
        }

        //case 6
        if l <= s && e <= t {
            let seconds = e - s;
            let rewards = self.compute_seconds_rewards(&seconds,
                                                       bu_r_in_1_second);
            return rewards;
        }

        sc_panic!("Case not supported: s={}, e={} t={}, l={}",s,e,t,l);
    }

    fn compute_seconds_rewards(&self,
                               &seconds: &u64,
                               bu_r_in_1_second: BigUint) -> BigUint {
        let bu_seconds = BigUint::from(seconds);
        let rewards = (&bu_seconds * &bu_r_in_1_second) / BigUint::from(100_u64);
        return rewards;
    }

    #[only_owner]
    #[endpoint(switchIsActiveFieldValue)]
    fn switch_is_active_field_value(&self) {
        require!(! self.variable_contract_settings().is_empty(),"Contract was not initialized");
        let mut settings = self.variable_contract_settings().get();
        settings.contract_is_active = !settings.contract_is_active;
        self.variable_contract_settings().set(settings);
    }

    fn contract_is_active(&self) -> bool {
        require!(! self.variable_contract_settings().is_empty(),"Contract was not initialized");
        let settings = self.variable_contract_settings().get();
        return settings.contract_is_active;
    }

    #[only_owner]
    #[endpoint(updateUnstakeLockSpan)]
    fn update_unstake_lock_span(&self, unstake_lock_span: u64) {
        require!(! self.variable_contract_settings().is_empty(),"Contract was not initialized");
        require!(0_u64 < unstake_lock_span, "Unstake lock span must be positive");
        let mut settings = self.variable_contract_settings().get();
        settings.unstake_lock_span = unstake_lock_span;
        self.variable_contract_settings().set(settings);
    }

    // NOTE
    // I would recommend not to hardcode the pull_id variable and to give it as a parameter
    // That way, you could update each pool individually and independently
    // Also, this helps to reduce the overcomplicated code, by removing the for loops
    // - very good suggestion. We stick with the current logic for now.
    //(it make the update scripts simpler to manage at the startup phase of our company)
    #[only_owner]
    #[endpoint(updatePullSettings)]
    fn update_pull_settings(&self,
                            apy_id: u32,
                            apy_start: u64,
                            apy_end: u64,
                            pull_a_apy: u64,
                            pull_b_apy: u64,
                            pull_c_apy: u64, ) {
        let pull_a_id = 1_u32;
        let pull_b_id: u32 = 2_u32;
        let pull_c_id: u32 = 3_u32;

        require!(self.pull_settings_exist(pull_a_id,apy_id),"pull_a_id settings does not exists for apy_id={}", apy_id);
        require!(self.pull_settings_exist(pull_b_id,apy_id),"pull_a_id settings does not exists for apy_id={}", apy_id);
        require!(self.pull_settings_exist(pull_c_id,apy_id),"pull_a_id settings does not exists for apy_id={}", apy_id);

        self.update_pull_settings_by_pull_id_and_apy_id(
            pull_a_id,
            apy_id.clone(),
            apy_start.clone(),
            apy_end.clone(),
            pull_a_apy);
        self.update_pull_settings_by_pull_id_and_apy_id(
            pull_b_id,
            apy_id.clone(),
            apy_start.clone(),
            apy_end.clone(),
            pull_b_apy);
        self.update_pull_settings_by_pull_id_and_apy_id(
            pull_c_id,
            apy_id.clone(),
            apy_start.clone(),
            apy_end.clone(),
            pull_c_apy);
    }

    // NOTE
    // The same as with update_pull_settings
    // (same comment: we keep this logic for now)
    #[only_owner]
    #[endpoint(appendPullSettings)]
    fn append_pull_settings(&self,
                            apy_id: u32,
                            apy_start: u64,
                            apy_end: u64,
                            pull_a_apy: u64,
                            pull_b_apy: u64,
                            pull_c_apy: u64, ) {
        let pull_a_id = 1_u32;
        let pull_b_id: u32 = 2_u32;
        let pull_c_id: u32 = 3_u32;

        require!(!self.pull_settings_exist(pull_a_id,apy_id),"pull_a_id settings already exits for apy_id={}", apy_id);
        require!(!self.pull_settings_exist(pull_b_id,apy_id),"pull_a_id settings already exits for apy_id={}", apy_id);
        require!(!self.pull_settings_exist(pull_c_id,apy_id),"pull_a_id settings already exits for apy_id={}", apy_id);

        self.append_pull_settings_by_pull_id_and_apy_id(
            pull_a_id,
            apy_id.clone(),
            apy_start.clone(),
            apy_end.clone(),
            pull_a_apy);

        self.append_pull_settings_by_pull_id_and_apy_id(
            pull_b_id,
            apy_id.clone(),
            apy_start.clone(),
            apy_end.clone(),
            pull_b_apy);

        self.append_pull_settings_by_pull_id_and_apy_id(
            pull_c_id,
            apy_id.clone(),
            apy_start.clone(),
            apy_end.clone(),
            pull_c_apy);
    }

    fn pull_exists(&self,
                   pull_id: u32) -> bool {
        let var_setting = self.variable_contract_settings().get();
        let pull_items = var_setting.pull_items;
        for i in 0..=(pull_items.len() - 1) {
            let pull = pull_items.get(i);
            if pull.id == pull_id {
                return true;
            }
        }
        return false;
    }

    fn pull_settings_exist(&self,
                           pull_id: u32,
                           apy_id: u32, ) -> bool {
        let var_setting = self.variable_contract_settings().get();
        let pull_items = var_setting.pull_items;
        for i in 0..=(pull_items.len() - 1) {
            let pull = pull_items.get(i);
            if pull.id == pull_id {
                let api_config_vector = pull.apy_configuration;
                for k in 0..=(api_config_vector.len() - 1) {
                    let config_item = api_config_vector.get(k);
                    if config_item.id == apy_id {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    fn append_pull_settings_by_pull_id_and_apy_id(&self,
                                                  pull_id: u32,
                                                  apy_id: u32,
                                                  apy_start: u64,
                                                  apy_end: u64,
                                                  apy: u64) {
        let mut var_setting = self.variable_contract_settings().get();
        let mut pull_items = var_setting.pull_items;

        let mut value_added = false;
        for i in 0..=(pull_items.len() - 1) {
            let mut pull = pull_items.get(i);
            if pull.id == pull_id {
                let mut api_config_vector = pull.apy_configuration;
                let apy_config = ApyConfiguration {
                    id: (apy_id),
                    apy: (apy),
                    start_timestamp: (apy_start),
                    end_timestamp: (apy_end),
                };
                api_config_vector.push(apy_config);
                value_added = true;
                pull.apy_configuration = api_config_vector;
                let _updated_pull_item = pull_items.set(i, &pull);
            }
        }
        if value_added {
            var_setting.pull_items = pull_items;
            self.variable_contract_settings().set(var_setting)
        }
    }

    fn update_pull_settings_by_pull_id_and_apy_id(&self,
                                                  pull_id: u32,
                                                  apy_id: u32,
                                                  apy_start: u64,
                                                  apy_end: u64,
                                                  apy: u64) {
        let mut var_setting = self.variable_contract_settings().get();
        let mut pull_items = var_setting.pull_items;
        let mut settings_located = false;
        for i in 0..=(pull_items.len() - 1) {
            let mut pull = pull_items.get(i);
            if pull.id == pull_id {
                let mut api_config_vector = pull.apy_configuration;
                for k in 0..=(api_config_vector.len() - 1) {
                    let mut config_item = api_config_vector.get(k);
                    if config_item.id == apy_id {
                        config_item.start_timestamp = apy_start;
                        config_item.end_timestamp = apy_end;
                        config_item.apy = apy;
                        settings_located = true;
                    }
                    let _updated_config_item = api_config_vector.set(k, &config_item);
                }
                pull.apy_configuration = api_config_vector;
                let _updated_pull_item = pull_items.set(i, &pull);
            }
        }
        if settings_located {
            var_setting.pull_items = pull_items;
            self.variable_contract_settings().set(var_setting)
        }
    }

    // getters

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
        sc_panic!("Not valid pull_id={}",pull_id)
    }

    fn get_client_staked_items_by_pull_id(&self, pull_id: u32) -> ManagedVec<ClientPullState<Self::Api>> {
        let client = self.blockchain().get_caller();
        let client_vector = self.client_state(&client);
        let mut selected_items: ManagedVec<ClientPullState<Self::Api>> = ManagedVec::new();
        if client_vector.len() > 0 {
            for i in 1..=client_vector.len() {
                let item = client_vector.get(i);
                if item.pull_id == pull_id {
                    selected_items.push(item);
                    let len = selected_items.len();
                    sc_print!("len={}",len);
                }
            }
        }
        return selected_items;
    }

    fn update_staked_item_collection_time(&self, entry_time_id: u64, current_time_stamp: u64) {
        let client = self.blockchain().get_caller();
        let client_vector = self.client_state(&client);
        for i in 1..=client_vector.len() {
            let mut item = client_vector.get(i);
            if item.pull_time_stamp_entry == entry_time_id {
                item.pull_time_stamp_last_collection = current_time_stamp;
                client_vector.set(i, &item);
            }
        }
    }

    fn get_pull_locking_time_span(&self, pull_id: u32) -> u64 {
        let var_setting = self.variable_contract_settings().get();
        let pull_items = var_setting.pull_items;

        for i in 0..=(pull_items.len() - 1) {
            let pull = pull_items.get(i);
            if pull.id == pull_id {
                let locking_time_span = pull.locking_time_span;
                return locking_time_span;
            }
        }
        sc_panic!("Not valid pull_id={}",pull_id)
    }

    fn get_contract_token_id(&self) -> TokenIdentifier {
        let settings = self.variable_contract_settings().get();
        return settings.token_id;
    }

    // report


    // NOTE
    // The code is overcomplicated and very hard to follow. Also, it has multiple iterations so it takes longer to calculate
    // I recommend to save events for all the previous claims and to have the calculate_rewards function as a view, only for the pending rewards
    // - todo: need to reed on events api (see if this is doable now or in the next iteration of the contract)
    #[view(getClientReport)]
    fn get_client_report(&self, client: ManagedAddress) -> ReportClinet<Self::Api> {
        let mut report = ReportClinet {
            total_amount: BigUint::zero(),
            total_rewords: BigUint::zero(),
            report_pull_items: ManagedVec::new(),
        };
        let current_time_stamp = self.blockchain().get_block_timestamp();
        let var_setting = self.variable_contract_settings().get();
        let client_vector = self.client_state(&client);

        if client_vector.len() == 0 {
            //if client has no staked items we stop here
            return report;
        }

        let mut count = 0;
        let pull_items = var_setting.pull_items;
        for i in 0..=(pull_items.len() - 1) {
            let pull = pull_items.get(i);
            let pul_id = pull.id;
            let mut rep_item = ReportClientPullPullItem {
                pull_id: pul_id.clone(),
                pull_amount: BigUint::zero(),
                rewords_amount: BigUint::zero(),
            };
            for pc in 0..=(pull.apy_configuration.len() - 1) {
                let pc_val = pull.apy_configuration.get(pc);
                for c in 1..=client_vector.len() {
                    let pc_clone = pc_val.clone();
                    let client_item = client_vector.get(c);
                    if client_item.pull_id == pul_id {
                        rep_item.pull_amount = rep_item.pull_amount.clone() + client_item.pull_amount.clone();
                        let item_reword = self.calculate_rewards_v2(client_item.clone(),
                                                                    pc_clone,
                                                                    current_time_stamp);
                        rep_item.rewords_amount = rep_item.rewords_amount.clone() + item_reword;
                    }
                }
            }
            report.total_amount = report.total_amount.clone() + rep_item.pull_amount.clone();
            report.total_rewords = report.total_rewords.clone() + rep_item.rewords_amount.clone();
            if rep_item.pull_amount > 0 {
                count = count + 1;
                report.report_pull_items.push(rep_item);
            }
        }

        return report;
    }

    #[view(getClientReportV2)]
    fn get_client_report_v2(&self, client: ManagedAddress)
                            -> MultiValueEncoded<MultiValue3<u32, BigUint, BigUint>> {
        //let mut report_pull_items: ManagedVec<ReportClientPullPullItem<Self::Api>> = ManagedVec::new();
        let mut multi_val_vec: MultiValueEncoded<MultiValue3<u32, BigUint, BigUint>> = MultiValueEncoded::new();
        let mut report = ReportClinet {
            total_amount: BigUint::zero(),
            total_rewords: BigUint::zero(),
            report_pull_items: ManagedVec::new(),
        };
        let current_time_stamp = self.blockchain().get_block_timestamp();
        let var_setting = self.variable_contract_settings().get();
        let client_vector = self.client_state(&client);

        if client_vector.len() == 0 {
            //if clinet has no staked items we stop here
            //return report;
            return multi_val_vec;
        }

        let mut count = 0;
        let pull_items = var_setting.pull_items;
        for i in 0..=(pull_items.len() - 1) {
            let pull = pull_items.get(i);
            let pul_id = pull.id;
            let mut rep_item = ReportClientPullPullItem {
                pull_id: pul_id.clone(),
                pull_amount: BigUint::zero(),
                rewords_amount: BigUint::zero(),
            };
            for pc in 0..=(pull.apy_configuration.len() - 1) {
                let pc_val = pull.apy_configuration.get(pc);
                for c in 1..=client_vector.len() {
                    let pc_clone = pc_val.clone();
                    let client_item = client_vector.get(c);
                    if client_item.pull_id == pul_id {
                        rep_item.pull_amount = rep_item.pull_amount.clone() + client_item.pull_amount.clone();
                        let item_reword = self.calculate_rewards_v2(client_item.clone(),
                                                                    pc_clone,
                                                                    current_time_stamp);
                        rep_item.rewords_amount = rep_item.rewords_amount.clone() + item_reword;
                    }
                }
            }
            report.total_amount = report.total_amount.clone() + rep_item.pull_amount.clone();
            report.total_rewords = report.total_rewords.clone() + rep_item.rewords_amount.clone();
            if rep_item.pull_amount > 0 {
                count = count + 1;
                multi_val_vec.push(
                    MultiValue3::from((
                        pul_id.clone(),
                        rep_item.pull_amount.clone(),
                        rep_item.rewords_amount.clone()
                    )));
                report.report_pull_items.push(rep_item);
            }
        }

        //return report;
        return multi_val_vec;
    }

    #[view(getClientReportV3)]
    fn get_client_report_v3(&self, client: ManagedAddress)
                            -> MultiValueEncoded<MultiValue4<u32, u64, u64, BigUint>> {
        let mut multi_val_vec: MultiValueEncoded<MultiValue4<u32, u64, u64, BigUint>> = MultiValueEncoded::new();

        let client_vector = self.client_state(&client);

        if client_vector.len() == 0 {
            //if clinet has no staked items we stop here
            //return report;
            return multi_val_vec;
        }

        for c in 1..=client_vector.len() {
            let client_item = client_vector.get(c);

            multi_val_vec.push(
                MultiValue4::from((
                    client_item.pull_id,
                    client_item.pull_time_stamp_entry,
                    client_item.pull_time_stamp_last_collection,
                    client_item.pull_amount
                ))
            );
        }

        return multi_val_vec;
    }

    // storage


    #[view(getVariableContractSettings)]
    #[storage_mapper("variableContractSettings")]
    fn variable_contract_settings(&self) -> SingleValueMapper<VariableContractSettings<Self::Api>>;

    #[view(getClientState)]
    #[storage_mapper("clientState")]
    fn client_state(&self, client_address: &ManagedAddress)
                    -> VecMapper<ClientPullState<Self::Api>>;

    #[view(getUnstakeState)]
    #[storage_mapper("unstakeState")]
    fn unstake_state(&self, client_address: &ManagedAddress)
                     -> SingleValueMapper<UnstakeState<Self::Api>>;

    // NOTE
    // Use WhitelistMapper instead                    
    #[view(getClientList)]
    #[storage_mapper("clientList")]
    fn client_list(&self) -> UnorderedSetMapper<ManagedAddress>;


    #[view(getTotalStakedValue)]
    #[storage_mapper("totalStakedValue")]
    fn total_staked_value(&self) -> SingleValueMapper<BigUint>;
}