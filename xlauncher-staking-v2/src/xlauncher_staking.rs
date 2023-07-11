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
            max_staking_val,
            unstake_xlh_lock_span,
            unstake_sft_lock_span,
            min_apy,
            max_apy,
            sft_increment_apy,
        };
        self.contract_settings().set(&settings);

        let sft_settings = SftSettings {
            sft_id,
            nonce: sft_nonce,
        };
        self.sft_settings().set(&sft_settings);

        //check if total_staked_data is set and if not set to default
        if self.total_staked_data().is_empty() {
            let total_staked_data = TotalStakedData {
                last_pool_id: 0,
                last_price_rank_id: 0,
                total_xlh_staked: BigUint::zero(),
                total_xlh_available_for_rewords: BigUint::zero(),
                total_sft_staked: 0,
            };
            self.total_staked_data().set(&total_staked_data);
        }
    }

    #[only_owner]
    #[endpoint(setPoolPrice)]
    fn set_pool_price(&self, rank_1_price: BigUint, rank_2_price: BigUint, rank_3_price: BigUint) {
        let id1 = 1_u64;
        let id2 = 2_u64;
        let id3 = 3_u64;
        let price_1 = PoolPrice {
            rank_id: id1,
            xlh_price: rank_1_price,
        };
        let price_2 = PoolPrice {
            rank_id: id2,
            xlh_price: rank_2_price,
        };
        let price_3 = PoolPrice {
            rank_id: id3,
            xlh_price: rank_3_price,
        };

        //set pool prices
        self.pool_price(id1).set(&price_1);
        self.pool_price(id2).set(&price_2);
        self.pool_price(id3).set(&price_3);

        //set last_price_rank_id
        let mut total_staked_data = self.total_staked_data().get();
        total_staked_data.last_price_rank_id = id3;
        self.total_staked_data().set(&total_staked_data);
    }

    #[only_owner]
    #[endpoint(setMainXlhAddress)]
    fn set_main_xlh_address(&self, main_xlh_wallet: ManagedAddress) {
        self.main_xlh_address().set(&main_xlh_wallet);
    }

    #[only_owner]
    #[endpoint(collectCreationFunds)]
    fn collect_creation_funds(&self) {
        // iterate over all pools and collect creation funds
        let total_staked_data = self.total_staked_data().get();
        let last_pool_id = total_staked_data.last_pool_id;
        let mut collected_funds = BigUint::zero();
        for i in 1..=last_pool_id {
            //if creation funds bigger than 0, collect them
            if self.pool_data(i).get().pool_creation_funds == BigUint::zero() {
                continue;
            }
            let mut pool_data = self.pool_data(i).get();
            collected_funds += pool_data.pool_creation_funds;
            pool_data.pool_creation_funds = BigUint::zero();
            self.pool_data(i).set(&pool_data);
        }
        // transfer collected funds to main_xlh_wallet
        let main_xlh_wallet = self.main_xlh_address().get();
        let token_id = self.contract_settings().get().token_id;
        self.send().direct_esdt(
            &main_xlh_wallet,
            &token_id,
            0,
            &collected_funds,
        );
    }


    #[payable("*")]
    #[endpoint(createNewPool)]
    fn create_new_pool(&self, pool_rank: u64, pool_title: ManagedBuffer) {
        let egld_or_esdt_token_identifier = self.call_value().egld_or_single_esdt();

        let amount = egld_or_esdt_token_identifier.amount;
        let token_id = egld_or_esdt_token_identifier.token_identifier;
        let client = self.blockchain().get_caller();

        // check pool_price exists
        require!(!self.pool_price(pool_rank).is_empty(), "pool price does not exist");
        //check token_id

        let settings = self.contract_settings().get();
        require!(token_id == settings.token_id, "wrong token id");

        //check amount matches pool price
        let pool_price = self.pool_price(pool_rank).get();
        require!(amount == pool_price.xlh_price, "wrong xlh amount {}", amount);

        let mut total_staked_data = self.total_staked_data().get();
        let pull_id = total_staked_data.last_pool_id + 1;
        //check pool_data does not exist
        require!(self.pool_data(pull_id).is_empty(), "pool already exists");
        total_staked_data.last_pool_id = pull_id;
        self.total_staked_data().set(&total_staked_data);

        let new_pool = PoolData {
            pool_id: pull_id,
            pool_rank,
            pool_title: pool_title.clone(),
            pool_total_xlh: BigUint::zero(),
            pool_creation_funds: amount,
            pool_owner: client,
        };

        self.pool_data(pull_id).set(&new_pool);
    }


    #[payable("*")]
    #[endpoint(fundWithRewords)]
    fn fund_with_rewords(&self) {
        let egld_or_esdt_token_identifier = self.call_value().egld_or_single_esdt();

        let amount = egld_or_esdt_token_identifier.amount;
        let token_id = egld_or_esdt_token_identifier.token_identifier;

        let settings = self.contract_settings().get();

        //check token_id
        assert!(token_id == settings.token_id, "wrong token id");
        //check amount
        assert!(amount > 0, "amount must be greater than 0");

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

        self.check_client_exists_and_if_not_create_it(&client);

        let current_time_stamp = self.blockchain().get_block_timestamp();


        //iterate over items and if located update item else add new item
        let mut client_state = self.client_state(&client).get();
        let xlh_data = &mut client_state.xlh_data;
        let mut client_pool_found = false;
        for i in 0..xlh_data.len() {
            let client_xlh_data = xlh_data.get(i);
            if client_xlh_data.pool_id == pool_id {
                client_pool_found = true;

                let rewords = self.compute_pool_rewords(&pool_id, &current_time_stamp, &client);
                self.update_client_pool_time_stamp(&pool_id, &client, current_time_stamp.clone());
                let new_xlh_staked = client_xlh_data.xlh_amount.clone() + amount.clone() + rewords.clone();
                self.update_client_pool_xlh_staked(&pool_id, &client, new_xlh_staked);
                self.deduct_rewords_from_total_data(&rewords);

                //update total_staked_data
                let new_staked_amount = amount.clone() + rewords.clone();
                let mut total_staked_data = self.total_staked_data().get();
                let total_xlh_staked = total_staked_data.total_xlh_staked.clone() + new_staked_amount.clone();
                total_staked_data.total_xlh_staked = total_xlh_staked;
                self.total_staked_data().set(&total_staked_data);

                //update pool_data
                let mut pool_data = self.pool_data(pool_id).get();
                pool_data.pool_total_xlh += new_staked_amount;

                //check if new_pool_talal_xlh is smaller or equal then max_pool_xlh
                let new_pool_total_xlh = pool_data.pool_total_xlh.clone();
                require!(new_pool_total_xlh <= settings.max_staking_val, "pool is full");

                self.pool_data(pool_id).set(&pool_data);
                self.append_client_if_needed();

                break;
            }
        }
        if !client_pool_found {
            let new_client_xlh_data = ClientXlhData {
                pool_id,
                xlh_amount: amount.clone(),
                time_stamp: current_time_stamp,
            };
            xlh_data.push(new_client_xlh_data); // persist client state
            self.client_state(&client).set(client_state);

            //update total_staked_data
            let mut total_staked_data = self.total_staked_data().get();
            total_staked_data.total_xlh_staked += amount.clone();
            self.total_staked_data().set(&total_staked_data);

            //update pool_data
            let mut pool_data = self.pool_data(pool_id).get();
            pool_data.pool_total_xlh += amount;

            //check if new_pool_talal_xlh is smaller or equal then max_pool_xlh
            let new_pool_total_xlh = pool_data.pool_total_xlh.clone();
            require!(new_pool_total_xlh <= settings.max_staking_val, "pool is full");

            self.pool_data(pool_id).set(&pool_data);
            self.append_client_if_needed();
        }
    }

    #[endpoint(unstakeSft)]
    fn unstake_sft(&self, amount: u64) {
        let client = self.blockchain().get_caller();
        let current_time_stamp = self.blockchain().get_block_timestamp();
        let mut client_state = self.client_state(&client).get();
        //check amount is not greater than client sft balance
        assert!(amount <= client_state.sft_amount, "amount is greater than client sft balance");

        //remove amount from client sft balance
        client_state.sft_amount -= amount;
        self.client_state(&client).set(client_state);

        //update total_staked_data
        let mut total_staked_data = self.total_staked_data().get();
        total_staked_data.total_sft_staked -= amount;
        self.total_staked_data().set(&total_staked_data);

        let settings = self.contract_settings().get();
        let free_after_time_stamp = current_time_stamp + settings.unstake_sft_lock_span;

        //update client_sft_data
        if self.unstake_sft_state(&client).is_empty() {
            let unstake_sft_state = UnstakeSftState {
                total_unstaked_sft_amount: amount,
                free_after_time_stamp,
            };
            self.unstake_sft_state(&client).set(unstake_sft_state);
        } else {
            let mut unstake_sft_state = self.unstake_sft_state(&client).get();
            unstake_sft_state.total_unstaked_sft_amount += amount;
            unstake_sft_state.free_after_time_stamp = free_after_time_stamp;
            self.unstake_sft_state(&client).set(unstake_sft_state);
        }
    }

    #[endpoint(unstakeXlh)]
    fn unstake_xlh(&self, pool_id: u64, amount: BigUint) {
        let client = self.blockchain().get_caller();
        let current_time_stamp = self.blockchain().get_block_timestamp();

        //iterate over items and if located unstake requested value
        let mut client_state = self.client_state(&client).get();
        let xlh_data = &mut client_state.xlh_data;
        let mut client_pool_found = false;
        for i in 0..xlh_data.len() {
            let client_xlh_data = xlh_data.get(i);
            if client_xlh_data.pool_id == pool_id {
                client_pool_found = true;

                let rewords = self.compute_pool_rewords(&pool_id, &current_time_stamp, &client);
                self.update_client_pool_time_stamp(&pool_id, &client, current_time_stamp.clone());

                let new_xlh_staked = client_xlh_data.xlh_amount.clone() - amount.clone();
                assert!(new_xlh_staked >= 0, "not enough xlh staked");
                if new_xlh_staked == 0 {
                    xlh_data.remove(i);
                    self.client_state(&client).set(client_state);
                } else {
                    self.update_client_pool_xlh_staked(&pool_id, &client, new_xlh_staked);
                    self.update_client_pool_time_stamp(&pool_id, &client, current_time_stamp.clone());
                }

                //update total_staked_data
                let mut total_staked_data = self.total_staked_data().get();
                let total_xlh_staked = total_staked_data.total_xlh_staked.clone() - amount.clone();
                total_staked_data.total_xlh_staked = total_xlh_staked;
                self.total_staked_data().set(&total_staked_data);
                self.deduct_rewords_from_total_data(&rewords);

                //update pool_data
                let mut pool_data = self.pool_data(pool_id).get();
                let pool_total_xlh = pool_data.pool_total_xlh.clone() - amount.clone();
                pool_data.pool_total_xlh = pool_total_xlh;
                self.pool_data(pool_id).set(&pool_data);

                //send rewords + amount to client
                let rewords_plus_amount = amount.clone() + rewords.clone();

                // add to client sft unstake data
                self.add_to_xlh_unstake_value(current_time_stamp, rewords_plus_amount, amount);
                break;
            }
        }
        assert!(client_pool_found, "client pool not found");
    }

    #[endpoint(claimUnstakedXlhValue)]
    fn claim_unstaked_xlh_value(&self) {
        let current_time_stamp: u64 = self.blockchain().get_block_timestamp();
        let client = self.blockchain().get_caller();
        require!(!self.unstake_xlh_state(&client).is_empty(), "No funds to claim");
        let unstake_state = self.unstake_xlh_state(&client).get();

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
        let token_id = self.contract_settings().get().token_id;
        self.send().direct_esdt(
            &client,
            &token_id,
            0,
            &unstake_state.total_unstaked_amount,
        );
        self.unstake_xlh_state(&client).clear();
    }

    #[endpoint(claimUnstakedSftValue)]
    fn claim_unstaked_sft_value(&self) {
        let current_time_stamp: u64 = self.blockchain().get_block_timestamp();
        let client = self.blockchain().get_caller();
        require!(!self.unstake_sft_state(&client).is_empty(), "No funds to claim");
        let unstake_state = self.unstake_sft_state(&client).get();

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
            BigUint::zero() < unstake_state.total_unstaked_sft_amount,
            "No funds available to claim"
        );

        //convert unstake_state.total_unstaked_sft_amount to BigUint
        let amount_u64: u64 = unstake_state.total_unstaked_sft_amount;
        let unstaked_sft_amount = BigUint::from(amount_u64);
        let settings = self.sft_settings().get();
        let sft_id = settings.sft_id;
        let nonce = settings.nonce;

        self.send().direct_esdt(
            &client,
            &sft_id,
            nonce,
            &unstaked_sft_amount,
        );
        self.unstake_sft_state(&client).clear();
    }


    fn check_client_exists_and_if_not_create_it(&self, client: &ManagedAddress) {
        if self.client_state(&client).is_empty() {
            let xlh_data: ManagedVec<ClientXlhData<Self::Api>> = ManagedVec::new();
            let new_client = ClientData {
                sft_amount: 0_u64,
                xlh_data,
            };
            self.client_state(&client).set(&new_client);
        }
    }

    #[payable("*")]
    #[endpoint(stakeSft)]
    fn stake_sft(&self) {
        let egld_or_esdt_token_identifier = self.call_value().egld_or_single_esdt();

        let amount_biguint = egld_or_esdt_token_identifier.amount;
        let token_id = egld_or_esdt_token_identifier.token_identifier;
        let token_nonce = egld_or_esdt_token_identifier.token_nonce;
        let client = self.blockchain().get_caller();

        let sft_settings = self.sft_settings().get();
        // check sft id
        assert!(token_id == sft_settings.sft_id, "wrong token id");
        // check nonce
        assert!(token_nonce == sft_settings.nonce, "wrong token nonce");
        //check amount
        assert!(amount_biguint > 0, "amount must be greater than 0");

        self.check_client_exists_and_if_not_create_it(&client);

        //update client state
        let mut client_state = self.client_state(&client).get();
        let amount: u64 = amount_biguint.to_u64().unwrap();

        client_state.sft_amount += amount;
        self.client_state(&client).set(client_state);
        self.append_client_if_needed();

        //update total contract sft staked
        let mut total_staked_data = self.total_staked_data().get();
        total_staked_data.total_sft_staked += amount;
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
        let available_rewords = total_xlh_available_for_rewords - rewords; // this will throw error is result would be negative

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
                let _ignore_result = xlh_data.set(i, client_xlh_data);
                break;
            }
        }
        self.client_state(&client).set(client_state);
    }

    fn update_client_pool_xlh_staked(&self, pool_id: &u64, client: &ManagedAddress, xlh_amount: BigUint) {
        let mut client_state = self.client_state(&client).get();
        let xlh_data = &mut client_state.xlh_data;
        for i in 0..xlh_data.len() {
            let client_xlh_data = &mut xlh_data.get(i);
            if client_xlh_data.pool_id == *pool_id {
                client_xlh_data.xlh_amount = xlh_amount;
                let _ignore_result = xlh_data.set(i, client_xlh_data);
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

        let apy = self.compute_client_apy(&client_state, &staking_settings);
        let rewords = self.compute_rewords(&client_xlh_data, &current_time_stamp, &apy);

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
                          client_data: &ClientData<Self::Api>,
                          staking_settings: &StakingSettings<Self::Api>,
    ) -> u64 {
        let min_apy = staking_settings.min_apy;
        if client_data.sft_amount == 0_u64 {
            return min_apy;
        }

        let total_apy = min_apy * client_data.sft_amount;

        return if total_apy < staking_settings.max_apy {
            total_apy
        } else {
            staking_settings.max_apy
        };
    }

    fn add_to_xlh_unstake_value(
        &self,
        time_stamp: u64,
        total_amount: BigUint,
        requested_amount: BigUint,
    ) {
        let client = self.blockchain().get_caller();
        let settings = self.contract_settings().get();
        let unstake_lock_span: u64 = settings.unstake_xlh_lock_span;
        let free_after_time_stamp: u64 = time_stamp + unstake_lock_span;

        if self.unstake_xlh_state(&client).is_empty() {
            let unstake_state = UnstakeXlhState {
                total_unstaked_amount: total_amount.clone(),
                requested_amount,
                free_after_time_stamp,
            };
            self.unstake_xlh_state(&client).set(&unstake_state);
        } else {
            let mut unstake_state = self.unstake_xlh_state(&client).get();
            unstake_state.free_after_time_stamp = free_after_time_stamp;
            unstake_state.total_unstaked_amount =
                unstake_state.total_unstaked_amount + total_amount;

            unstake_state.requested_amount = unstake_state.requested_amount + requested_amount;

            self.unstake_xlh_state(&client).set(&unstake_state);
        }
    }

    fn append_client_if_needed(&self) {
        let mut clients_set = self.client_list();
        let client = self.blockchain().get_caller();
        if !clients_set.contains(&client) {
            clients_set.insert(client);
        }
    }

    #[view(getClientReport)]
    fn get_client_report(&self, client: ManagedAddress) -> ReportClientAllPools<Self::Api> {
        let current_time_stamp = self.blockchain().get_block_timestamp();
        let client_data = self.client_state(&client).get();
        let staking_settings = self.contract_settings().get();
        let apy = self.compute_client_apy(&client_data, &staking_settings);

        return self.compute_client_report(&current_time_stamp, &client, &client_data, &apy);
    }

    #[view(getAllClientsReport)]
    fn get_all_clients_report(&self) -> ManagedVec<ReportClientAllPools<Self::Api>> {
        let current_time_stamp = self.blockchain().get_block_timestamp();
        let mut clients_report = ManagedVec::new();
        let staking_settings = self.contract_settings().get();

        let clients_set = self.client_list();
        let clients_iter = clients_set.iter();
        for client in clients_iter {
            let client_data = self.client_state(&client).get();
            let apy = self.compute_client_apy(&client_data, &staking_settings);
            let client_report =
                self.compute_client_report(&current_time_stamp, &client, &client_data, &apy);
            clients_report.push(client_report);
        }

        return clients_report;
    }

    fn compute_client_report(&self, current_time_stamp: &u64, client_address: &ManagedAddress, client_data: &ClientData<Self::Api>, apy: &u64) -> ReportClientAllPools<Self::Api> {
        let xlh_data = &client_data.xlh_data;
        let mut report = ReportClientAllPools {
            client_address: client_address.clone(),
            total_xlh_amount: BigUint::from(0u64),
            total_xlh_rewards: BigUint::from(0u64),
            total_sft_amount: 0,
            report_pool_vector: ManagedVec::new(),
        };

        for i in 0..xlh_data.len() {
            let client_xlh_data = xlh_data.get(i);
            let rewords = self.compute_rewords(&client_xlh_data, &current_time_stamp, &apy);
            let report_item = ReportClientPoolPoolItem {
                pool_id: client_xlh_data.pool_id,
                xlh_amount: client_xlh_data.xlh_amount,
                xlh_rewords: rewords,
            };
            report.total_xlh_amount = report.total_xlh_amount.clone() + report_item.xlh_amount.clone();
            report.total_xlh_rewards = report.total_xlh_rewards.clone() + report_item.xlh_rewords.clone();
            report.report_pool_vector.push(report_item);
        }
        return report;
    }

    #[view(getStakingWalletsReport)]
    fn get_staking_wallets_report(&self, pool_id: &u64) -> ManagedVec< StakingWalletReportItem<Self::Api>> {
        let mut staking_report = ManagedVec::new();
        let clients_set = self.client_list();
        let clients_iter = clients_set.iter();
        for client in clients_iter {
            let client_data = self.client_state(&client).get();
            let xlh_data = &client_data.xlh_data;
            for i in 0..xlh_data.len() {
                let client_xlh_data = xlh_data.get(i);
                if client_xlh_data.pool_id == *pool_id {
                    let report_item = StakingWalletReportItem {
                        client_address: client.clone(),
                        xlh_amount: client_xlh_data.xlh_amount,
                    };
                    staking_report.push(report_item);
                }
            }
        }
        return staking_report;
    }

    // storage

    #[view(getContractSettings)]
    #[storage_mapper("contractSettings")]
    fn contract_settings(&self) -> SingleValueMapper<StakingSettings<Self::Api>>;

    #[view(getSftSettings)]
    #[storage_mapper("sftSettings")]
    fn sft_settings(&self) -> SingleValueMapper<SftSettings<Self::Api>>;

    #[view(getTotalStakedData)]
    #[storage_mapper("totalStakedData")]
    fn total_staked_data(&self) -> SingleValueMapper<TotalStakedData<Self::Api>>;

    #[view(getPoolData)]
    #[storage_mapper("poolData")]
    fn pool_data(&self, pool_id: u64) -> SingleValueMapper<PoolData<Self::Api>>;

    #[view(getSimplePoolData)]
    #[storage_mapper("simplePoolData")]
    fn simple_pool_data(&self, pool_id: u64) -> SingleValueMapper<SimplePoolData<Self::Api>>;

    #[view(getPoolPrice)]
    #[storage_mapper("poolPrice")]
    fn pool_price(&self, pool_id: u64) -> SingleValueMapper<PoolPrice<Self::Api>>;

    #[view(getMainXlhAddress)]
    #[storage_mapper("mainXlhAddress")]
    fn main_xlh_address(&self) -> SingleValueMapper<ManagedAddress>;

    #[view(getClientState)]
    #[storage_mapper("clientState")]
    fn client_state(
        &self,
        client_address: &ManagedAddress,
    ) -> SingleValueMapper<ClientData<Self::Api>>;

    #[view(getUnstakeXlhState)]
    #[storage_mapper("unstakeXlhState")]
    fn unstake_xlh_state(
        &self,
        client_address: &ManagedAddress,
    ) -> SingleValueMapper<UnstakeXlhState<Self::Api>>;

    #[view(getUnstakeSftState)]
    #[storage_mapper("unstakeSftState")]
    fn unstake_sft_state(
        &self,
        client_address: &ManagedAddress,
    ) -> SingleValueMapper<UnstakeSftState>;

    #[view(getClientList)]
    #[storage_mapper("clientList")]
    fn client_list(&self) -> UnorderedSetMapper<ManagedAddress>;


}





