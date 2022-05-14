#![no_std]
#![feature(generic_associated_types)]

extern crate alloc;

elrond_wasm::imports!();
elrond_wasm::derive_imports!();




#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode, Clone)]
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

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode, Clone)]
pub struct ApyConfiguration {
    pub id: u32,
    pub apy: u64,
    // apy is multiplied by 100. ex: 1% = 100, 0.5& = 50, 0.01% = 1
    pub start_timestamp: u64,
    pub end_timestamp: u64,
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode, Clone)]
pub struct ReportClinet<M: ManagedTypeApi> {
    pub total_amount: BigUint<M>,
    pub total_rewords: BigUint<M>,
    pub report_pull_items: ManagedVec<M, ReportClientPullPullItem<M>>,
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode, Clone)]
pub struct ReportClientPullPullItem<M: ManagedTypeApi> {
    pub pull_id: u32,
    pub pull_amount: BigUint<M>,
    pub rewords_amount: BigUint<M>,
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode)]
pub struct ClaimItem<M: ManagedTypeApi> {
    pub pull_id: u32,
    pub current_time_stamp: u64,
    pub pull_time_stamp_entry: u64,
    pub pull_time_stamp_last_collection: u64,
    pub pull_amount: BigUint<M>,
    pub rewords: BigUint<M>,
}

#[elrond_wasm::derive::contract]
pub trait XLauncherStaking {
    #[init]
    fn init(&self,
            token_id: TokenIdentifier,
            min_amount: BigUint,

            //pull a no lockout: 0
            pull_a_id: u32,
            pull_a_locking_time_span: u64,
            apy_a0_id: u32,
            apy_a0_start: u64,
            apy_a0_end: u64,
            apy_a0_apy: u64,

            //pull b 60 days: 5184000
            pull_b_id: u32,
            pull_b_locking_time_span: u64,
            apy_b0_id: u32,
            apy_b0_start: u64,
            apy_b0_end: u64,
            apy_b0_apy: u64,

            //pull c 180 days: 15552000
            pull_c_id: u32,
            pull_c_locking_time_span: u64,
            apy_c0_id: u32,
            apy_c0_start: u64,
            apy_c0_end: u64,
            apy_c0_apy: u64,
    ) {
        require!(token_id.is_valid_esdt_identifier(), "invalid token_id");
        require!(min_amount > 0_u64, "min_amount must be positive");

        let pull_a = self.build_pull(
            pull_a_id,
            pull_a_locking_time_span,
            apy_a0_id,
            apy_a0_start,
            apy_a0_end,
            apy_a0_apy);

        let pull_b = self.build_pull(
            pull_b_id,
            pull_b_locking_time_span,
            apy_b0_id,
            apy_b0_start,
            apy_b0_end,
            apy_b0_apy);

        let pull_c = self.build_pull(
            pull_c_id,
            pull_c_locking_time_span,
            apy_c0_id,
            apy_c0_start,
            apy_c0_end,
            apy_c0_apy);


        // variable settings
        let mut pull_items: ManagedVec<Pull<Self::Api>> = ManagedVec::new();
        pull_items.push(pull_a);
        pull_items.push(pull_b);
        pull_items.push(pull_c);
        let variable_settings = VariableContractSettings {
            token_id: (token_id),
            min_amount: (min_amount),
            pull_items: (pull_items),
        };
        self.variable_contract_settings().set(&variable_settings)
    }

    fn build_pull(self, pull_id: u32,
                  pull_locking_time_span: u64,
                  apy_0_id: u32,
                  apy_0_start: u64,
                  apy_0_end: u64,
                  apy_0_apy: u64, ) -> Pull<Self::Api> {
        let mut pull_a_config_vector: ManagedVec<ApyConfiguration> = ManagedVec::new();
        let apy_a0 = ApyConfiguration {
            id: (apy_0_id),
            apy: (apy_0_apy),
            start_timestamp: (apy_0_start),
            end_timestamp: (apy_0_end),
        };
        pull_a_config_vector.push(apy_a0);


        let pull_a = Pull {
            id: (pull_id),
            locking_time_span: (pull_locking_time_span),
            apy_configuration: (pull_a_config_vector),
        };
        return pull_a;
    }

    #[endpoint(fundContract)]
    #[payable("*")]
    fn fund_contract(&self,
                     #[payment_token] token_id: TokenIdentifier,
                     #[payment] _payment: BigUint) {
        let settings: VariableContractSettings<Self::Api> = self.variable_contract_settings().get();
        require!(token_id.is_valid_esdt_identifier(), "invalid token_id");
        require!(settings.token_id == token_id, "not the same token id");
    }

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
             #[payment_token] token_id: TokenIdentifier,
             #[payment_amount] amount: BigUint,
             pull_id: u32,
    ) {
        let settings: VariableContractSettings<Self::Api> = self.variable_contract_settings().get();
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
    }


    #[endpoint(unstake)]
    fn unstake(&self,
               pull_id: u32,
               amount: BigUint) {
        //sc_panic!("Time to unstake pull_id={} amount={}",pull_id,amount);
        let client = self.blockchain().get_caller();
        let current_time_stamp = self.blockchain().get_block_timestamp();

        let client_vector = self.client_state(&client);
        let config_vector = self.get_apy_config_vector(pull_id.clone());
        let locking_time_span = self.get_pull_locking_time_span(pull_id.clone());


        let mut selected_items: ManagedVec<ClientPullState<Self::Api>> = ManagedVec::new();
        let mut total_items_value = BigUint::zero();
        let mut total_rewards = BigUint::zero(); //total rewords

        if client_vector.len() > 0 && config_vector.len() > 0 {
            for i in 1..=client_vector.len() {
                let client_item = client_vector.get(i);

                let unstake_time = locking_time_span + client_item.pull_time_stamp_entry;
                if client_item.pull_id == pull_id
                    && unstake_time < current_time_stamp
                    && total_items_value < amount {
                    selected_items.push(client_item.clone());

                    for k in 0..=(config_vector.len() - 1) {
                        let config_item = config_vector.get(k);
                        let item_rewords = self.calculate_rewards_v2(client_item.clone(),
                                                                     config_item,
                                                                     current_time_stamp);
                        total_items_value = total_items_value + client_item.pull_amount.clone();
                        total_rewards = total_rewards + item_rewords;
                        sc_print!("k={}, amount={}, total_items_value={}",k, amount,total_items_value);
                    }
                }
            }
        }
        sc_print!("amount={}, total_items_value={}", amount,total_items_value);
        require!(amount <= total_items_value , "total staking value smaller then requested amount{}",total_items_value);

        //case 1 selected amount is exact amount staked
        if total_items_value == amount {
            for i in 0..=(selected_items.len() - 1) {
                let item = selected_items.get(i);
                self.remove_client_item_from_storadge(&item.pull_time_stamp_entry, &client);
            }
            let total_value = total_items_value.clone() + total_rewards.clone();
            if total_value > BigUint::zero() {
                //sc_panic!("unstake case 1 items total_value={}, current_time={}",total_value, current_time_stamp);
                let token_id = self.get_contract_token_id();
                self.send().direct(
                    &client,
                    &token_id,
                    0,
                    &total_value,
                    &[]);
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

            // compute how mutch we need to transfer in client wallet
            let total_case_2_value = amount.clone() + total_rewards.clone();
            if total_case_2_value > 0 {
                let token_id = self.get_contract_token_id();
                self.send().direct(
                    &client,
                    &token_id,
                    0,
                    &total_case_2_value,
                    &[]);
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

    /* #[endpoint(claim)]
     fn claim(&self,
              _pull_id: u32) -> MultiValueEncoded<MultiValue3<BigUint, BigUint, u64>> {

         let mut multi_claim_vec: MultiValueEncoded<MultiValue3<BigUint, BigUint, u64>> = MultiValueEncoded::new();

         return multi_claim_vec;
     }*/

    /**
    Multi value encoded fields
    - pull value,
    - rewords,
    - entry time stamp,
    - time_stamp_last_colection
    - current time stamp
    **/
    #[endpoint(claim)]
    fn claim(&self,
             pull_id: u32) /*-> MultiValueEncoded<MultiValue5<BigUint, BigUint, u64, u64, u64>> */ {
        let client = self.blockchain().get_caller();
        let current_time_stamp = self.blockchain().get_block_timestamp();
        let client_vector = self.client_state(&client);
        let id_clone = pull_id.clone();
        let config_vector = self.get_apy_config_vector(id_clone);
        let mut total_rewards = BigUint::zero(); //total rewords

        let mut claim_vector: ManagedVec<ClaimItem<Self::Api>> = ManagedVec::new();
        let mut multi_claim_vec: MultiValueEncoded<MultiValue5<BigUint, BigUint, u64, u64, u64>> = MultiValueEncoded::new();

        if client_vector.len() > 0 && config_vector.len() > 0 {
            for i in 1..=client_vector.len() {
                let mut client_item = client_vector.get(i);
                let mut item_rewards = BigUint::zero(); // item rewords
                if client_item.pull_id == pull_id {
                    for k in 0..=(config_vector.len() - 1) {
                        let config_item = config_vector.get(k);

                        let config_rewords = self.calculate_rewards_v2(client_item.clone(),
                                                                       config_item,
                                                                       current_time_stamp.clone());
                        if config_rewords > BigUint::zero() {
                            item_rewards += config_rewords.clone();
                        }
                        let claim_item = ClaimItem {
                            pull_id: (pull_id.clone()),
                            pull_amount: (client_item.pull_amount.clone()),
                            pull_time_stamp_entry: (client_item.pull_time_stamp_entry.clone()),
                            pull_time_stamp_last_collection: (client_item.pull_time_stamp_last_collection.clone()),
                            rewords: config_rewords.clone(),
                            current_time_stamp: current_time_stamp.clone(),
                        };
                        sc_print!("claimItem: pull_id={}, pull_amount={}, pull_time_stamp_entry={}, pull_time_stamp_last_collection={}, rewords={}, current_time_stamp={}",
                            pull_id.clone(), client_item.pull_amount.clone(),
                            client_item.pull_time_stamp_entry.clone(),
                            client_item.pull_time_stamp_last_collection.clone(),
                            config_rewords.clone(), current_time_stamp.clone());

                        multi_claim_vec.push(
                            MultiValue5::from((
                                client_item.pull_amount.clone(),
                                config_rewords.clone(),
                                client_item.pull_time_stamp_entry.clone(),
                                client_item.pull_time_stamp_last_collection.clone(),
                                current_time_stamp.clone())));

                        claim_vector.push(claim_item)
                    }
                }
                if item_rewards > 0_u64 {
                    //sc_panic!("Computed rewords = {}", item_rewords);
                    client_item.pull_time_stamp_last_collection = current_time_stamp;
                    client_vector.set(i, &client_item);
                    total_rewards += item_rewards;
                }
            }
        }
        sc_print!("total_rewards={}",total_rewards);
        if total_rewards > 0_u64 {
            let token_id = self.get_contract_token_id();
            self.send().direct(
                &client,
                &token_id,
                0,
                &total_rewards,
                &[]);
        }

        //return claim_vector;
        //return multi_claim_vec;
    }

    #[endpoint(reinvest)]
    fn reinvest(&self,
                pull_id: u32) {
        let client = self.blockchain().get_caller();
        let current_time_stamp = self.blockchain().get_block_timestamp();
        let mut client_vector = self.client_state(&client);
        let id_clone = pull_id.clone();
        let config_vector = self.get_apy_config_vector(id_clone);
        let mut total_rewards = BigUint::zero(); //total rewords
        if client_vector.len() > 0 && config_vector.len() > 0 {
            for i in 1..=client_vector.len() {
                let mut client_item = client_vector.get(i);
                let mut item_rewards = BigUint::zero(); // item rewords
                if client_item.pull_id == pull_id {
                    for k in 0..=(config_vector.len() - 1) {
                        let config_item = config_vector.get(k);

                        let config_rewords = self.calculate_rewards_v2(client_item.clone(),
                                                                       config_item,
                                                                       current_time_stamp);
                        if config_rewords > BigUint::zero() {
                            item_rewards += config_rewords;
                        }
                    }
                }
                if item_rewards > 0_u64 {
                    //sc_panic!("Computed rewords = {}", item_rewords);
                    client_item.pull_time_stamp_last_collection = current_time_stamp;
                    client_vector.set(i, &client_item);
                    total_rewards += item_rewards;
                }
            }
        }

        if total_rewards > 0_u64 {
            let new_pull_state = ClientPullState {
                pull_id: (pull_id),
                pull_time_stamp_entry: (current_time_stamp),
                pull_time_stamp_last_collection: (current_time_stamp),
                pull_amount: total_rewards,
            };

            client_vector.push(&new_pull_state);
        }
    }


    fn calculate_rewards_v2(&self,
                            client_pull_state: ClientPullState<Self::Api>,
                            apy_configuration: ApyConfiguration,
                            current_time_stamp: u64) -> BigUint {
        let s = apy_configuration.start_timestamp;
        let e = apy_configuration.end_timestamp;
        let l = client_pull_state.pull_time_stamp_last_collection;
        let t = current_time_stamp;


        if current_time_stamp < apy_configuration.end_timestamp {}
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
            //sc_panic!("Case 3 not supported: s={}, e={} t={}, l={}",s,e,t,l);
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

    #[view(getClientReport)]
    fn get_client_report(&self, client: ManagedAddress) -> ReportClinet<Self::Api> {
        //let mut report_pull_items: ManagedVec<ReportClientPullPullItem<Self::Api>> = ManagedVec::new();
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
}