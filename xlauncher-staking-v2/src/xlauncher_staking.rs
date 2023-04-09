#![no_std]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

mod staking_data;

use crate::staking_data::StakingSettings;


#[multiversx_sc::contract]
pub trait HelloWorld {
    #[init]
    fn init(&self) {}

    #[only_owner]
    #[endpoint(setContractSettings)]
    fn set_contract_settings(&self,
                             token_id: TokenIdentifier,
                             min_staking_val: BigUint,
                             max_staking_val: BigUint,
                             unstake_xlh_lock_span: u64,
                             unstake_sft_lock_span: u64,
                             ) {
        let settings = StakingSettings {
            token_id,
            min_staking_val,
            max_staking_val,
            unstake_xlh_lock_span,
            unstake_sft_lock_span,
            total_staked_value: BigUint::zero(),
            total_available_for_rewords: BigUint::zero(),
            last_pool_id: 0,
        };
        self.contract_settings().set(&settings);
    }

    // storage

    #[view(getContractSettings)]
    #[storage_mapper("contractSettings")]
    fn contract_settings(&self) -> SingleValueMapper<StakingSettings<Self::Api>>;
}





