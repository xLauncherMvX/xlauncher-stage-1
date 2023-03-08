use multiversx_sc::{
    api::ManagedTypeApi,
    types::{BigUint, ManagedVec, TokenIdentifier},
};

multiversx_sc::derive_imports!();

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode, Clone)]
pub struct ClientPoolState<M: ManagedTypeApi> {
    pub pool_id: u32,
    pub pool_time_stamp_entry: u64,
    pub pool_time_stamp_last_collection: u64,
    pub pool_amount: BigUint<M>,
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode, Clone)]
pub struct UnstakeState<M: ManagedTypeApi> {
    pub total_unstaked_amount: BigUint<M>,
    pub requested_amount: BigUint<M>,
    pub free_after_time_stamp: u64,
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode)]
pub struct VariableContractSettings<M: ManagedTypeApi> {
    pub token_id: TokenIdentifier<M>,
    pub min_amount: BigUint<M>,
    pub unstake_lock_span: u64,
    pub contract_is_active: bool,
    pub pool_items: ManagedVec<M, Pool<M>>,
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode)]
pub struct Pool<M: ManagedTypeApi> {
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
    pub total_rewards: BigUint<M>,
    pub report_pool_items: ManagedVec<M, ReportClientPoolPoolItem<M>>,
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode, Clone)]
pub struct ReportClientPoolPoolItem<M: ManagedTypeApi> {
    pub pool_id: u32,
    pub pool_amount: BigUint<M>,
    pub rewards_amount: BigUint<M>,
}

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode)]
pub struct ClaimItem<M: ManagedTypeApi> {
    pub pool_id: u32,
    pub current_time_stamp: u64,
    pub pool_time_stamp_entry: u64,
    pub pool_time_stamp_last_collection: u64,
    pub pool_amount: BigUint<M>,
    pub rewards: BigUint<M>,
}
