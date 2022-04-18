#![no_std]

elrond_wasm::imports!();
elrond_wasm::derive_imports!();

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode)]
pub struct StakingSettings<M: ManagedTypeApi> {
    pub token_id: TokenIdentifier<M>,
    pub min_amount: BigUint<M>,
    pub pull_a_id: u32,
    pub pull_a_locking_time_span: u64,

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
            pull_a_id,
            pull_a_locking_time_span,
        };
        self.staking_settings().set(&settings);
    }

    #[payable("*")]
    #[endpoint(stake)]
    fn stake(&self,
             #[payment_token] token_id: TokenIdentifier,
             #[payment_amount] amount: BigUint,
             pool_type: u32,
    ) {
        let settings: StakingSettings<Self::Api> = self.staking_settings().get();
        require!(token_id.is_valid_esdt_identifier(), "invalid token_id");
        require!(settings.token_id == token_id, "not the same token id");
    }

    fn is_valid_pull_id(&self,
                        pull_id: u32,
                        staking_settings: StakingSettings<Self::Api>) -> bool {
        let is_valid: bool =
            if pull_id == staking_settings.pull_a_id {
                true
            } else { false };
        return is_valid;
    }

    #[view(getStakingSettings)]
    #[storage_mapper("stakingSettings")]
    fn staking_settings(&self) -> SingleValueMapper<StakingSettings<Self::Api>>;
}