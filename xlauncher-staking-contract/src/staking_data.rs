use elrond_wasm::{api::ManagedTypeApi, types::{BigUint, TokenIdentifier, ManagedVec}};

elrond_wasm::derive_imports!();

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode, Clone)]
pub struct ClientPullState<M: ManagedTypeApi> {
    pub pull_id: u32,
    pub pull_time_stamp_entry: u64,
    pub pull_time_stamp_last_collection: u64,
    pub pull_amount: BigUint<M>,
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