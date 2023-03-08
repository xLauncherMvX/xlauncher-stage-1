#![no_std]
#![feature(generic_associated_types)]

extern crate alloc;

use staking_data::*;

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

mod staking_data;

#[multiversx_sc::contract]
pub trait XLauncherStaking {
    #[init]
    fn init(
        &self,
        token_id: TokenIdentifier,
        min_amount: BigUint,

        //pool a no lockout: 0
        pool_a_id: u32,
        pool_a_locking_time_span: u64,
        apy_a0_id: u32,
        apy_a0_start: u64,
        apy_a0_end: u64,
        apy_a0_apy: u64,

        //pool b 60 days: 5184000
        pool_b_id: u32,
        pool_b_locking_time_span: u64,
        apy_b0_id: u32,
        apy_b0_start: u64,
        apy_b0_end: u64,
        apy_b0_apy: u64,

        //pool c 180 days: 15552000
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
                apy_a0_apy,
            );

            let pool_b = self.build_pool(
                pool_b_id,
                pool_b_locking_time_span,
                apy_b0_id,
                apy_b0_start,
                apy_b0_end,
                apy_b0_apy,
            );

            let pool_c = self.build_pool(
                pool_c_id,
                pool_c_locking_time_span,
                apy_c0_id,
                apy_c0_start,
                apy_c0_end,
                apy_c0_apy,
            );

            // 60 * 60 * 24 * 10 = 864000 (10 days)
            let days_10 = 864000_u64;
            let mut pool_items: ManagedVec<Pool<Self::Api>> = ManagedVec::new();
            pool_items.push(pool_a);
            pool_items.push(pool_b);
            pool_items.push(pool_c);
            let variable_settings = VariableContractSettings {
                token_id: (token_id),
                min_amount: (min_amount),
                pool_items: (pool_items),
                contract_is_active: true,
                unstake_lock_span: days_10,
            };
            self.variable_contract_settings().set(&variable_settings)
        }

    }

    fn build_pool(
        self,
        pool_id: u32,
        pool_locking_time_span: u64,
        apy_0_id: u32,
        apy_0_start: u64,
        apy_0_end: u64,
        apy_0_apy: u64,
    ) -> Pool<Self::Api> {
        let mut pool_a_config_vector: ManagedVec<ApyConfiguration> = ManagedVec::new();
        let apy_a0 = ApyConfiguration {
            id: (apy_0_id),
            apy: (apy_0_apy),
            start_timestamp: (apy_0_start),
            end_timestamp: (apy_0_end),
        };
        pool_a_config_vector.push(apy_a0);

        let pool_a = Pool {
            id: (pool_id),
            locking_time_span: (pool_locking_time_span),
            apy_configuration: (pool_a_config_vector),
        };
        return pool_a;
    }

    #[payable("*")]
    #[endpoint(fundContract)]
    fn fund_contract(&self) {
        let egld_or_esdt_token_identifier = self.call_value().egld_or_single_esdt();
        let token_id = egld_or_esdt_token_identifier.token_identifier;
        let settings: VariableContractSettings<Self::Api> = self.variable_contract_settings().get();
        require!(token_id.is_valid(), "invalid token_id");
        require!(settings.token_id == token_id, "not the same token id");
    }

    // NOTE
    // Same as the presale contract
    // - postponed storing the amount in the storage (not very relevant for our 1st use case)
    #[view(getTokenBalance)]
    fn get_token_balance(&self) -> BigUint {
        let settings: VariableContractSettings<Self::Api> = self.variable_contract_settings().get();
        let my_token_id = settings.token_id;
        let egld_or_esdt_token_identifier = EgldOrEsdtTokenIdentifier::esdt(my_token_id);
        let balance: BigUint = self.blockchain().get_sc_balance(&egld_or_esdt_token_identifier, 0);
        return balance;
    }

    #[payable("*")]
    #[endpoint(stake)]
    fn stake(&self, pool_id: u32) {
        let egld_or_esdt_token_identifier = self.call_value().egld_or_single_esdt();
        let amount = egld_or_esdt_token_identifier.amount;
        let token_id = egld_or_esdt_token_identifier.token_identifier;
        //let (amount, token_id) = self.call_value().payment_token_pair();
        require!(self.contract_is_active(), "Contract is in maintenance");
        let settings: VariableContractSettings<Self::Api> = self.variable_contract_settings().get();
        require!(token_id.is_valid(), "invalid token_id");
        require!(settings.token_id == token_id, "not the same token id");
        require!(
            self.pool_exists(pool_id.clone()),
            "invalid pool_id={}",
            pool_id
        );

        let client = self.blockchain().get_caller();
        let current_time_stamp = self.blockchain().get_block_timestamp();
        let mut state_vector = self.client_state(&client);

        let new_pool_state = ClientPoolState {
            pool_id: (pool_id),
            pool_time_stamp_entry: (current_time_stamp),
            pool_time_stamp_last_collection: (current_time_stamp),
            pool_amount: amount.clone(),
        };

        state_vector.push(&new_pool_state);
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

    fn add_to_unstake_value(
        &self,
        time_stamp: u64,
        total_amount: BigUint,
        requested_amount: BigUint,
    ) {
        sc_print!("total unstake amount = {}", total_amount.clone());
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
            unstake_state.total_unstaked_amount =
                unstake_state.total_unstaked_amount + total_amount;

            unstake_state.requested_amount = unstake_state.requested_amount + requested_amount;

            self.unstake_state(&client).set(&unstake_state);
        }
    }

    #[endpoint(claimUnstakedValue)]
    fn claim_unstaked_value(&self) {
        require!(self.contract_is_active(), "Contract is in maintenance");
        let current_time_stamp: u64 = self.blockchain().get_block_timestamp();
        let client = self.blockchain().get_caller();
        require!(!self.unstake_state(&client).is_empty(), "No funds to claim");
        let unstake_state = self.unstake_state(&client).get();

        sc_print!(
            "claim_unstaked_value_log: current_time_stamp={}, free_after_time_stamp={}",
            current_time_stamp,
            unstake_state.free_after_time_stamp
        );
        require!(
            unstake_state.free_after_time_stamp < current_time_stamp,
            "current_time_stamp is smaller then free_after_time_stamp"
        );

        require!(
            BigUint::zero() < unstake_state.total_unstaked_amount,
            "No funds available to claim"
        );
        let token_id = self.get_contract_token_id();
        self.send().direct_esdt(
            &client,
            &token_id,
            0,
            &unstake_state.total_unstaked_amount
        );
        self.unstake_state(&client).clear();
        self.decrement_total_staked_value(unstake_state.requested_amount);
    }

    // NEWNOTE
    // Again, very complicated method with lots of conditions You could continue to use this function or you could refactor it
    // You said there will be a merge function. You could use this to first merge all users positions and only work with that merged position for both cases
    // This way you could remove lots of conditions, which would make the function easier to read and maintain
    // (response: for now lets use it in this state. I'm definitely considering refactoring this in the future.
    // The merge method will not affect the current logic since will merge only positions that can be unstaked.
    // It will reduce gass cost overall for future transactions)
    #[endpoint(unstake)]
    fn unstake(&self, pool_id: u32, amount: BigUint) {
        require!(self.contract_is_active(), "Contract is in maintenance");

        let client = self.blockchain().get_caller();
        let current_time_stamp = self.blockchain().get_block_timestamp();

        let client_vector = self.get_client_staked_items_by_pool_id(&pool_id, &client);
        let config_vector = self.get_apy_config_vector(&pool_id);
        if (client_vector.len() == 0) || (config_vector.len() == 0) {
            sc_panic!("client and config vector are empty");
        }

        let locking_time_span = self.get_pool_locking_time_span(&pool_id);

        let mut selected_items: ManagedVec<ClientPoolState<Self::Api>> = ManagedVec::new();
        let mut total_items_value = BigUint::zero();
        let mut total_rewards = BigUint::zero();

        for i in 0..=(client_vector.len() - 1) {
            let client_item = client_vector.get(i);
            let unstake_time = locking_time_span + client_item.pool_time_stamp_entry;

            if unstake_time < current_time_stamp && total_items_value < amount {
                selected_items.push(client_item.clone());
                for k in 0..=(config_vector.len() - 1) {
                    let config_item = config_vector.get(k);
                    let item_rewards = self.calculate_rewards_v2(
                        client_item.clone(),
                        config_item,
                        &current_time_stamp,
                    );
                    total_rewards = total_rewards + item_rewards;
                }
                total_items_value = total_items_value + client_item.pool_amount.clone();
            }
        }

        require!(
            amount <= total_items_value,
            "total staking value smaller then requested \
         amount={}, val={}, rewards={}",
            amount,
            total_items_value,
            total_rewards
        );

        //case 1 selected amount is exact amount staked
        if total_items_value == amount {
            sc_print!("Case 1 amount={}, total_items_value={}",amount.clone(), total_items_value.clone());

            for i in 0..=(selected_items.len() - 1) {
                let item = selected_items.get(i);
                self.remove_client_item_from_storage(
                    &pool_id,
                    &item.pool_time_stamp_entry,
                    &client,
                );
            }
            let total_value = total_items_value.clone() + total_rewards.clone();
            if total_value > BigUint::zero() {
                self.add_to_unstake_value(current_time_stamp, total_value, amount);
                return;
            }
        }

        //case 2 amount is a bit smaller then total_items_value
        else if amount < total_items_value {
            sc_print!("Case 2 amount={}, total_items_value={}",amount.clone(), total_items_value.clone());
            for i in 0..=(selected_items.len() - 1) {
                let item = selected_items.get(i);
                self.remove_client_item_from_storage(
                    &pool_id,
                    &item.pool_time_stamp_entry,
                    &client,
                );
            }

            // select last item
            let mut last_tem = selected_items.get(selected_items.len() - 1);

            // change the amount with what is left over and the last time collection
            let diff = total_items_value.clone() - amount.clone();
            last_tem.pool_amount = diff;
            last_tem.pool_time_stamp_last_collection = current_time_stamp;

            // push back this lastItem to the user staked vector;
            let mut updated_vector = self.client_state(&client);
            updated_vector.push(&last_tem);

            // compute how much we need to transfer in client wallet
            let total_case_2_value = amount.clone() + total_rewards.clone();
            if total_case_2_value > BigUint::zero() {
                self.add_to_unstake_value(current_time_stamp, total_case_2_value, amount);
                return;
            }
        }
    }

    fn remove_client_item_from_storage(
        &self,
        pool_id: &u32,
        entry_time_stamp: &u64,
        client: &ManagedAddress,
    ) {
        let mut id = 0_usize;
        let mut client_vector = self.client_state(&client);
        for i in 1..=client_vector.len() {
            let item = client_vector.get(i);
            if item.pool_time_stamp_entry == *entry_time_stamp && item.pool_id == *pool_id {
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

    #[endpoint(claim)]
    fn claim(&self, pool_id: u32) {
        require!(self.contract_is_active(), "Contract is in maintenance");
        let client = self.blockchain().get_caller();
        let current_time_stamp = self.blockchain().get_block_timestamp();

        let total_rewards = self.calculate_pool_rewards(&pool_id, &current_time_stamp, &client);

        if total_rewards > 0_u64 {
            let token_id = self.get_contract_token_id();
            self.send()
                .direct_esdt(&client, &token_id, 0, &total_rewards);
        }
    }

    #[endpoint(reinvest)]
    fn reinvest(&self, pool_id: u32) {
        require!(self.contract_is_active(), "Contract is in maintenance");
        let client = self.blockchain().get_caller();
        let current_time_stamp = self.blockchain().get_block_timestamp();

        let total_rewards = self.calculate_pool_rewards(&pool_id, &current_time_stamp, &client);

        if total_rewards > 0_u64 {
            let new_pool_state = ClientPoolState {
                pool_id: (pool_id),
                pool_time_stamp_entry: (current_time_stamp),
                pool_time_stamp_last_collection: (current_time_stamp),
                pool_amount: total_rewards.clone(),
            };

            self.client_state(&client).push(&new_pool_state);
            self.increment_total_staked_value(total_rewards);
        }
    }

    fn calculate_pool_rewards(
        &self,
        pool_id: &u32,
        current_time_stamp: &u64,
        client: &ManagedAddress,
    ) -> BigUint {
        let client_vector = self.get_client_staked_items_by_pool_id(pool_id, &client);
        let config_vector = self.get_apy_config_vector(pool_id);
        if (client_vector.len() == 0) || (config_vector.len() == 0) {
            sc_panic!("client and config vector are empty");
        }
        let mut total_rewards = BigUint::zero(); //total rewards

        for i in 0..=(client_vector.len() - 1) {
            let client_item = client_vector.get(i);
            let mut item_rewards = BigUint::zero(); // item rewards

            for k in 0..=(config_vector.len() - 1) {
                let config_item = config_vector.get(k);

                let config_rewards =
                    self.calculate_rewards_v2(client_item.clone(), config_item, current_time_stamp);
                if config_rewards > BigUint::zero() {
                    item_rewards += config_rewards;
                }
            }

            if item_rewards > BigUint::zero() {
                self.update_staked_item_collection_time(
                    pool_id,
                    &client_item.pool_time_stamp_entry,
                    &current_time_stamp,
                    client,
                );
                total_rewards += item_rewards;
            }
        }
        return total_rewards;
    }

    fn calculate_rewards_v2(
        &self,
        client_pool_state: ClientPoolState<Self::Api>,
        apy_configuration: ApyConfiguration,
        current_time_stamp: &u64,
    ) -> BigUint {
        let s = apy_configuration.start_timestamp;
        let e = apy_configuration.end_timestamp;
        let l = client_pool_state.pool_time_stamp_last_collection;
        let t = *current_time_stamp;

        let seconds_in_year: u64 = 60 * 60 * 24 * 365;
        let pool_apy: u64 = apy_configuration.apy;
        let bu_s_in_year = BigUint::from(seconds_in_year); // seconds in year as BigUint
        let bu_apy = BigUint::from(pool_apy); // pool api as BigUint
        let bu_amount = client_pool_state.pool_amount.clone(); // pool amount as BigUint
        let bu_hundred = BigUint::from(100u64); // 100 as BigUint
        let bu_r_in_year = (&bu_amount * &bu_apy) / &bu_hundred; // rewards in one year as BigUint
        let bu_r_in_1_second = &bu_r_in_year / &bu_s_in_year; // rewards in one second as BigUint

        //case zero
        if t < l {
            sc_panic!("t shold never be smaller then l: t={}, l={}", t, l);
        }

        //case 1
        if t <= s {
            return BigUint::zero();
        }

        //case 2
        if l < s && s < t && t <= e {
            let seconds = t - s; // elapsed seconds
            let rewards = self.compute_seconds_rewards(&seconds, bu_r_in_1_second);
            return rewards;
        }

        //case 3
        if s <= l && t <= e {
            let seconds = t - l;
            let rewards = self.compute_seconds_rewards(&seconds, bu_r_in_1_second);
            return rewards;
        }

        //case 4
        if s <= l && l <= e && e < t {
            let seconds = e - l;
            let rewards = self.compute_seconds_rewards(&seconds, bu_r_in_1_second);
            return rewards;
        }

        //case 5
        if e <= l {
            return BigUint::zero();
        }

        //case 6
        if l <= s && e <= t {
            let seconds = e - s;
            let rewards = self.compute_seconds_rewards(&seconds, bu_r_in_1_second);
            return rewards;
        }

        sc_panic!("Case not supported: s={}, e={} t={}, l={}", s, e, t, l);
    }

    fn compute_seconds_rewards(&self, &seconds: &u64, bu_r_in_1_second: BigUint) -> BigUint {
        let bu_seconds = BigUint::from(seconds);
        let rewards = (&bu_seconds * &bu_r_in_1_second) / BigUint::from(100_u64);
        return rewards;
    }

    #[only_owner]
    #[endpoint(switchIsActiveFieldValue)]
    fn switch_is_active_field_value(&self) {
        require!(
            !self.variable_contract_settings().is_empty(),
            "Contract was not initialized"
        );
        let mut settings = self.variable_contract_settings().get();
        settings.contract_is_active = !settings.contract_is_active;
        self.variable_contract_settings().set(settings);
    }

    fn contract_is_active(&self) -> bool {
        require!(
            !self.variable_contract_settings().is_empty(),
            "Contract was not initialized"
        );
        let settings = self.variable_contract_settings().get();
        return settings.contract_is_active;
    }

    #[only_owner]
    #[endpoint(updateUnstakeLockSpan)]
    fn update_unstake_lock_span(&self, unstake_lock_span: u64) {
        require!(
            !self.variable_contract_settings().is_empty(),
            "Contract was not initialized"
        );
        require!(
            0_u64 < unstake_lock_span,
            "Unstake lock span must be positive"
        );
        let mut settings = self.variable_contract_settings().get();
        settings.unstake_lock_span = unstake_lock_span;
        self.variable_contract_settings().set(settings);
    }

    // NOTE
    // I would recommend not to hardcode the pool_id variable and to give it as a parameter
    // That way, you could update each pool individually and independently
    // Also, this helps to reduce the overcomplicated code, by removing the for loops
    // - very good suggestion. We stick with the current logic for now.
    //(it make the update scripts simpler to manage at the startup phase of our company)
    #[only_owner]
    #[endpoint(updatePoolSettings)]
    fn update_pool_settings(
        &self,
        apy_id: u32,
        apy_start: u64,
        apy_end: u64,
        pool_a_apy: u64,
        pool_b_apy: u64,
        pool_c_apy: u64,
    ) {
        let pool_a_id = 1_u32;
        let pool_b_id: u32 = 2_u32;
        let pool_c_id: u32 = 3_u32;

        require!(
            self.pool_settings_exist(pool_a_id, apy_id),
            "pool_a_id settings does not exists for apy_id={}",
            apy_id
        );
        require!(
            self.pool_settings_exist(pool_b_id, apy_id),
            "pool_a_id settings does not exists for apy_id={}",
            apy_id
        );
        require!(
            self.pool_settings_exist(pool_c_id, apy_id),
            "pool_a_id settings does not exists for apy_id={}",
            apy_id
        );

        self.update_pool_settings_by_pool_id_and_apy_id(
            pool_a_id,
            apy_id.clone(),
            apy_start.clone(),
            apy_end.clone(),
            pool_a_apy,
        );
        self.update_pool_settings_by_pool_id_and_apy_id(
            pool_b_id,
            apy_id.clone(),
            apy_start.clone(),
            apy_end.clone(),
            pool_b_apy,
        );
        self.update_pool_settings_by_pool_id_and_apy_id(
            pool_c_id,
            apy_id.clone(),
            apy_start.clone(),
            apy_end.clone(),
            pool_c_apy,
        );
    }

    #[only_owner]
    #[endpoint(appendPoolSettings)]
    fn append_pool_settings(
        &self,
        apy_id: u32,
        apy_start: u64,
        apy_end: u64,
        pool_a_apy: u64,
        pool_b_apy: u64,
        pool_c_apy: u64,
    ) {
        let pool_a_id = 1_u32;
        let pool_b_id: u32 = 2_u32;
        let pool_c_id: u32 = 3_u32;

        require!(
            !self.pool_settings_exist(pool_a_id, apy_id),
            "pool_a_id settings already exits for apy_id={}",
            apy_id
        );
        require!(
            !self.pool_settings_exist(pool_b_id, apy_id),
            "pool_a_id settings already exits for apy_id={}",
            apy_id
        );
        require!(
            !self.pool_settings_exist(pool_c_id, apy_id),
            "pool_a_id settings already exits for apy_id={}",
            apy_id
        );

        self.append_pool_settings_by_pool_id_and_apy_id(
            pool_a_id,
            apy_id.clone(),
            apy_start.clone(),
            apy_end.clone(),
            pool_a_apy,
        );

        self.append_pool_settings_by_pool_id_and_apy_id(
            pool_b_id,
            apy_id.clone(),
            apy_start.clone(),
            apy_end.clone(),
            pool_b_apy,
        );

        self.append_pool_settings_by_pool_id_and_apy_id(
            pool_c_id,
            apy_id.clone(),
            apy_start.clone(),
            apy_end.clone(),
            pool_c_apy,
        );
    }

    fn pool_exists(&self, pool_id: u32) -> bool {
        let var_setting = self.variable_contract_settings().get();
        let pool_items = var_setting.pool_items;
        for i in 0..=(pool_items.len() - 1) {
            let pool = pool_items.get(i);
            if pool.id == pool_id {
                return true;
            }
        }
        return false;
    }

    fn pool_settings_exist(&self, pool_id: u32, apy_id: u32) -> bool {
        let var_setting = self.variable_contract_settings().get();
        let pool_items = var_setting.pool_items;
        for i in 0..=(pool_items.len() - 1) {
            let pool = pool_items.get(i);
            if pool.id == pool_id {
                let api_config_vector = pool.apy_configuration;
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

    fn append_pool_settings_by_pool_id_and_apy_id(
        &self,
        pool_id: u32,
        apy_id: u32,
        apy_start: u64,
        apy_end: u64,
        apy: u64,
    ) {
        let mut var_setting = self.variable_contract_settings().get();
        let mut pool_items = var_setting.pool_items;

        let mut value_added = false;
        for i in 0..=(pool_items.len() - 1) {
            let mut pool = pool_items.get(i);
            if pool.id == pool_id {
                let mut api_config_vector = pool.apy_configuration;
                let apy_config = ApyConfiguration {
                    id: (apy_id),
                    apy: (apy),
                    start_timestamp: (apy_start),
                    end_timestamp: (apy_end),
                };
                api_config_vector.push(apy_config);
                value_added = true;
                pool.apy_configuration = api_config_vector;
                let _updated_pool_item = pool_items.set(i, &pool);
            }
        }
        if value_added {
            var_setting.pool_items = pool_items;
            self.variable_contract_settings().set(var_setting)
        }
    }

    fn update_pool_settings_by_pool_id_and_apy_id(
        &self,
        pool_id: u32,
        apy_id: u32,
        apy_start: u64,
        apy_end: u64,
        apy: u64,
    ) {
        let mut var_setting = self.variable_contract_settings().get();
        let mut pool_items = var_setting.pool_items;
        let mut settings_located = false;
        for i in 0..=(pool_items.len() - 1) {
            let mut pool = pool_items.get(i);
            if pool.id == pool_id {
                let mut api_config_vector = pool.apy_configuration;
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
                pool.apy_configuration = api_config_vector;
                let _updated_pool_item = pool_items.set(i, &pool);
            }
        }
        if settings_located {
            var_setting.pool_items = pool_items;
            self.variable_contract_settings().set(var_setting)
        }
    }

    // getters

    fn get_apy_config_vector(&self, pool_id: &u32) -> ManagedVec<ApyConfiguration> {
        let var_setting = self.variable_contract_settings().get();
        let pool_items = var_setting.pool_items;

        for i in 0..=(pool_items.len() - 1) {
            let pool = pool_items.get(i);
            if pool.id == *pool_id {
                let api_config = pool.apy_configuration;
                return api_config;
            }
        }
        sc_panic!("Not valid pool_id={}", pool_id)
    }

    fn get_client_staked_items_by_pool_id(
        &self,
        pool_id: &u32,
        client: &ManagedAddress,
    ) -> ManagedVec<ClientPoolState<Self::Api>> {
        let client_vector = self.client_state(&client);
        let mut selected_items: ManagedVec<ClientPoolState<Self::Api>> = ManagedVec::new();
        if client_vector.len() > 0 {
            for i in 1..=client_vector.len() {
                let item = client_vector.get(i);
                if item.pool_id == *pool_id {
                    selected_items.push(item);
                }
            }
        }
        return selected_items;
    }

    // NEWNOTE
    // The logic here still needs some rework. When we call this function in the calculate_pool_rewards() function
    // we already have the ClientPoolState. You could pass the struct altogether, and use the current timestamp directly from the struct
    // Also, right now we have a double loop - first in the calculate_pool_rewards() function and for each client_state item there, 
    // we loop again the entire client_state vector here
    // Maybe send the ClientPoolState as an argument here and just update it directly, without entering a new loop - as you already loop the vector beforehand
    // (response: I do not have access to the entire vector but only to a filtered section of it. Calling set on that memory section will not update the store
    // calculate_pool_rewords has a handle only to ManagedVec<ClientPoolState<?>,?> build in memory
    // Question: Is this comment still relevant for the current code state?)
    fn update_staked_item_collection_time(
        &self,
        pool_id: &u32,
        entry_time_id: &u64,
        current_time_stamp: &u64,
        client: &ManagedAddress,
    ) {
        let client_vector = self.client_state(&client);
        for i in 1..=client_vector.len() {
            let mut item = client_vector.get(i);
            if item.pool_time_stamp_entry == *entry_time_id && item.pool_id == *pool_id {
                item.pool_time_stamp_last_collection = *current_time_stamp;
                client_vector.set(i, &item);
            }
        }
    }

    // NEWNOTE
    // If you consider it is easy to modify, maybe save the pools in a separate storage with the pool_id as the key
    // This way, you would not need a for loop again to get the locking_time_span variable
    // This still works, but it overcomplicates the code. Even if you don't modify this now, it's good to think about this in the future.
    // (response: we keep the current way of storing this value for this contract)
    fn get_pool_locking_time_span(&self, pool_id: &u32) -> u64 {
        let var_setting = self.variable_contract_settings().get();
        let pool_items = var_setting.pool_items;

        for i in 0..=(pool_items.len() - 1) {
            let pool = pool_items.get(i);
            if pool.id == *pool_id {
                let locking_time_span = pool.locking_time_span;
                return locking_time_span;
            }
        }
        sc_panic!("Not valid pool_id={}", pool_id)
    }

    fn get_contract_token_id(&self) -> TokenIdentifier {
        let settings = self.variable_contract_settings().get();
        return settings.token_id;
    }

    // reports
    #[view(getClientTotalStakedValue)]
    fn get_client_total_staked_value(&self, client: ManagedAddress) -> BigUint {
        let report  = self.get_client_report(client);
        let total_amount = report.total_amount;
        sc_print!("Hello from staking contract val={}", total_amount);
        return total_amount;
    }

    #[view(getClientReport)]
    fn get_client_report(&self, client: ManagedAddress) -> ReportClinet<Self::Api> {
        let mut report = ReportClinet {
            total_amount: BigUint::zero(),
            total_rewards: BigUint::zero(),
            report_pool_items: ManagedVec::new(),
        };
        let current_time_stamp = self.blockchain().get_block_timestamp();
        sc_print!("getClientReport time={}",current_time_stamp.clone());
        let var_setting = self.variable_contract_settings().get();
        let client_vector = self.client_state(&client);

        if client_vector.len() == 0 {
            //if client has no staked items we stop here
            return report;
        }

        let mut count = 0;
        let pool_items = var_setting.pool_items;
        for i in 0..=(pool_items.len() - 1) {
            let pool = pool_items.get(i);
            let pul_id = pool.id;
            let mut rep_item = ReportClientPoolPoolItem {
                pool_id: pul_id.clone(),
                pool_amount: BigUint::zero(),
                rewards_amount: BigUint::zero(),
            };

            for c in 1..=client_vector.len() {
                let client_item = client_vector.get(c);
                if client_item.pool_id == pul_id {
                    rep_item.pool_amount =
                        rep_item.pool_amount.clone() + client_item.pool_amount.clone();
                    sc_print!("added value: pull_id={}, pull_amount={}", pul_id.clone(), rep_item.pool_amount.clone());
                    for pc in 0..=(pool.apy_configuration.len() - 1) {

                        let pc_val = pool.apy_configuration.get(pc);
                        let pc_clone = pc_val.clone();
                        let item_reward = self.calculate_rewards_v2(
                            client_item.clone(),
                            pc_clone,
                            &current_time_stamp,
                        );
                        rep_item.rewards_amount = rep_item.rewards_amount.clone() + item_reward;
                        sc_print!("rewards_amount value={}", rep_item.rewards_amount.clone());
                    }
                }
            }
            report.total_amount = report.total_amount.clone() + rep_item.pool_amount.clone();
            report.total_rewards = report.total_rewards.clone() + rep_item.rewards_amount.clone();
            if rep_item.pool_amount > BigUint::zero() {
                count = count + 1;
                report.report_pool_items.push(rep_item);
            }
        }
        sc_print!("current_time_stamp={}",current_time_stamp);
        sc_print!("total_rewards={}",report.total_rewards);
        return report;
    }




    #[view(getApiConfigReport1)]
    fn get_api_config_report_1(
        &self,
        pool_id: &u32,
    ) -> MultiValueEncoded<MultiValue5<u32, u64, u64, u64, u64>> {
        let mut multi_val_vec: MultiValueEncoded<MultiValue5<u32, u64, u64, u64, u64>> =
            MultiValueEncoded::new();
        let config_vector = self.get_apy_config_vector(pool_id);
        let current_time_stamp = self.blockchain().get_block_timestamp();
        for k in 0..=(config_vector.len() - 1) {
            let config_item = config_vector.get(k);

            multi_val_vec.push(MultiValue5::from((
                config_item.id,
                config_item.apy,
                config_item.start_timestamp,
                config_item.end_timestamp,
                current_time_stamp
            )))
        }
        return multi_val_vec;
    }

    // storage

    #[view(getVariableContractSettings)]
    #[storage_mapper("variableContractSettings")]
    fn variable_contract_settings(&self) -> SingleValueMapper<VariableContractSettings<Self::Api>>;

    #[view(getClientState)]
    #[storage_mapper("clientState")]
    fn client_state(
        &self,
        client_address: &ManagedAddress,
    ) -> VecMapper<ClientPoolState<Self::Api>>;

    #[view(getUnstakeState)]
    #[storage_mapper("unstakeState")]
    fn unstake_state(
        &self,
        client_address: &ManagedAddress,
    ) -> SingleValueMapper<UnstakeState<Self::Api>>;

    #[view(getClientList)]
    #[storage_mapper("clientList")]
    fn client_list(&self) -> UnorderedSetMapper<ManagedAddress>;

    #[view(getTotalStakedValue)]
    #[storage_mapper("totalStakedValue")]
    fn total_staked_value(&self) -> SingleValueMapper<BigUint>;
}
