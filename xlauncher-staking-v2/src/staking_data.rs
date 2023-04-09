use multiversx_sc::{
    api::ManagedTypeApi,
    types::{BigUint},
};

multiversx_sc::derive_imports!();

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode, Clone)]
pub struct StakingSettings<M: ManagedTypeApi> {
    pub min_val: BigUint<M>,
    pub max_val: BigUint<M>,
}