use multiversx_sc::{
    api::ManagedTypeApi,
    types::{BigUint, TokenIdentifier, ManagedAddress, ManagedVec},
};


multiversx_sc::derive_imports!();

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode, Clone)]
pub struct StakingSettings<M: ManagedTypeApi> {
    pub token_id: TokenIdentifier<M>,
    pub min_staking_val: BigUint<M>,
    pub max_staking_val: BigUint<M>,
    pub total_staked_value: BigUint<M>,
    pub total_available_for_rewords: BigUint<M>,
    pub unstake_xlh_lock_span: u64,
    pub unstake_sft_lock_span: u64,
    pub last_pool_id: usize, // if id is 0, then there are no pools
}

pub struct PoolData<M:ManagedTypeApi>{
    pub pool_id: usize,
    pub pool_total_staked: BigUint<M>,
}


pub struct ClientXlhData<M:ManagedTypeApi>{
    pub pull_id: usize,
    pub client_total_staked: BigUint<M>,
}

pub struct ClientXlhUnstakeData<M:ManagedTypeApi>{
    pub total_unstake_amount: BigUint<M>,
    pub requested_amount: BigUint<M>,
    pub requested_time_stamp: u64,
    pub free_after_time_stamp: u64,
}

pub struct ClientSftUnstakeData<M:ManagedTypeApi>{
    pub unstake_amount: BigUint<M>,
    pub requested_time_stamp: u64,
    pub free_after_time_stamp: u64,
}

