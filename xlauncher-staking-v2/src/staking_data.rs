use multiversx_sc::{
    api::ManagedTypeApi,
    types::{BigUint, TokenIdentifier},
};


multiversx_sc::derive_imports!();

#[derive(TypeAbi, TopEncode, TopDecode, ManagedVecItem, NestedEncode, NestedDecode, Clone)]
pub struct StakingSettings<M: ManagedTypeApi> {
    pub token_id: TokenIdentifier<M>,
    pub min_staking_val: BigUint<M>,
    pub max_staking_val: BigUint<M>,
}

