use multiversx_sc::{
    api::ManagedTypeApi,
    types::{BigUint, TokenIdentifier, ManagedVec},
};


multiversx_sc::derive_imports!();

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode)]
pub struct StakingSettings<M: ManagedTypeApi> {
    pub token_id: TokenIdentifier<M>,
    pub max_staking_val: BigUint<M>,
    pub unstake_xlh_lock_span: u64,
    pub unstake_sft_lock_span: u64,
    pub min_apy: u64,
    // in 4 decimal (10000 = 1%) (150000 = 15%)
    pub max_apy: u64,
    // in 4 decimal (10000 = 1%) (150000 = 15%)
    pub sft_increment_apy: u64, // in 4 decimal (100 = 0.01%) (1500 = 0.15%)
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode)]
pub struct SftSettings<M: ManagedTypeApi> {
    pub sft_id: TokenIdentifier<M>,
    pub nonce: u64,
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode)]
pub struct TotalStakedData<M: ManagedTypeApi> {
    pub last_pool_id: u64,
    pub total_xlh_staked: BigUint<M>,
    pub total_xlh_available_for_rewords: BigUint<M>,
    pub total_sft_staked: u64,
}

// it keeps track at global level the total staked value for each pool
#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode, Clone)]
pub struct PoolData<M: ManagedTypeApi> {
    pub pool_id: u64,
    pub pool_total_xlh: BigUint<M>,
}

// it keeps track at client level the client staked value for each pool
// and the total sft staked
#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode, Clone)]
pub struct ClientData<M: ManagedTypeApi> {
    pub sft_amount: u64,
    pub xlh_data: ManagedVec<M, ClientXlhData<M>>,
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode, Clone)]
pub struct ClientXlhData<M: ManagedTypeApi> {
    pub pool_id: u64,
    pub xlh_amount: BigUint<M>,
    pub time_stamp: u64, // always needs to be modified when amount gets modified
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode, Clone)]
pub struct ClientXlhDataWithRewords<M: ManagedTypeApi> {
    pub pool_id: u64,
    pub xlh_amount: BigUint<M>,
    pub xlh_rewords: BigUint<M>,
    pub last_collection_time_stamp: u64,
}

// this is used to keep track of the unstaked funds
#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode, Clone)]
pub struct ClientXlhUnstakeData<M: ManagedTypeApi> {
    pub total_unstake_amount: BigUint<M>,
    pub requested_amount: BigUint<M>,
    pub requested_time_stamp: u64,
    pub free_after_time_stamp: u64,
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode, Clone)]
pub struct ClientSftUnstakeData<M: ManagedTypeApi> {
    pub unstake_amount: BigUint<M>,
    pub requested_time_stamp: u64,
    pub free_after_time_stamp: u64,
}
