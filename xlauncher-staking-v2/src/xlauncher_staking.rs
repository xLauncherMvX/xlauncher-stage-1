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
                             max_staking_val: BigUint,
                             unstake_xlh_lock_span: u64
    ) {
        let settings = StakingSettings {
            token_id,
            max_staking_val,
            total_staked: BigUint::zero(),
            total_available_for_rewords: BigUint::zero(),
            unstake_xlh_lock_span,
        };
        self.contract_settings().set(&settings);
    }

    // storage

    #[view(getContractSettings)]
    #[storage_mapper("contractSettings")]
    fn contract_settings(&self) -> SingleValueMapper<StakingSettings<Self::Api>>;
}





