#![no_std]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

mod staking_data;

use crate::staking_data::StakingSettings;
use crate::staking_data::PoolData;


#[multiversx_sc::contract]
pub trait HelloWorld {
    #[init]
    fn init(&self) {}

    #[only_owner]
    #[endpoint(setContractSettings)]
    fn set_contract_settings(&self,
                             token_id: TokenIdentifier,
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
            total_staked: BigUint::zero(),
            total_available_for_rewords: BigUint::zero(),
            unstake_xlh_lock_span,
            unstake_sft_lock_span,
            min_apy,
            max_apy,
            sft_increment_apy,
        };
        self.contract_settings().set(&settings);

        //check if last_pool_id is set and if not set it to 0
        if self.last_pool_id().is_empty() {
            self.last_pool_id().set(&0);
        }
    }

    #[only_owner]
    #[endpoint(createNewPool)]
    fn create_new_pool(&self) {
        let pool_id:u64 = self.last_pool_id().get() + 1;
        assert!(self.pool_data(pool_id).is_empty(), "pool already exists");
        self.last_pool_id().set(&pool_id);
        let new_pool = PoolData {
            pool_id,
            pool_total_xlh: BigUint::zero(),
        };
        self.pool_data(pool_id).set(&new_pool);
    }


    // storage

    #[view(getContractSettings)]
    #[storage_mapper("contractSettings")]
    fn contract_settings(&self) -> SingleValueMapper<StakingSettings<Self::Api>>;

    #[view(getLastPoolId)]
    #[storage_mapper("lastPoolId")]
    fn last_pool_id(&self) -> SingleValueMapper<u64>;

    #[storage_mapper("poolData")]
    fn pool_data(&self, pool_id: u64) -> SingleValueMapper<PoolData<Self::Api>>;
}





