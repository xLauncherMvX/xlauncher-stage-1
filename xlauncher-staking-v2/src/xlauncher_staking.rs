#![no_std]

mod staking_data;

multiversx_sc::imports!();
multiversx_sc::derive_imports!();


#[multiversx_sc::contract]
pub trait HelloWorld {
    #[init]
    fn init(&self) {}
}