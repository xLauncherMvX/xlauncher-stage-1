#![no_std]





elrond_wasm::imports!();
elrond_wasm::derive_imports!();

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode)]
pub struct StakingSettings<M: ManagedTypeApi> {
    pub token_id: TokenIdentifier<M>,
    pub min_amount: BigUint<M>,
    pub pull_a_locking_time_span: u64,
    pub pull_a_id: u32,
}


#[elrond_wasm::derive::contract]
pub trait XLauncherStaking {
    #[init]
    fn init(&self,
            token_id: TokenIdentifier,
            min_amount: BigUint,
            pull_a_locking_time_span: u64,
    ) {
        require!(token_id.is_valid_esdt_identifier(), "invalid token_id");
        require!(min_amount > 0, "min_amount must be positive");
        //self.token_id().set(&token_id);

        let pull_a_id = 1u32;

        let settings = StakingSettings {
            token_id,
            min_amount,
            pull_a_locking_time_span,
            pull_a_id,
        };
        self.staking_settings().set(&settings);
    }

    #[view(getStakingSettings)]
    #[storage_mapper("stakingSettings")]
    fn staking_settings(&self) -> SingleValueMapper<StakingSettings<Self::Api>>;
}