// Code generated by the multiversx-sc multi-contract system. DO NOT EDIT.

////////////////////////////////////////////////////
////////////////// AUTO-GENERATED //////////////////
////////////////////////////////////////////////////

// Init:                                 1
// Endpoints:                           20
// Async Callback (empty):               1
// Total number of exported functions:  22

#![no_std]
#![feature(alloc_error_handler, lang_items)]

multiversx_sc_wasm_adapter::allocator!();
multiversx_sc_wasm_adapter::panic_handler!();

multiversx_sc_wasm_adapter::endpoints! {
    xlauncher_staking
    (
        fundContract
        getTokenBalance
        stake
        claimUnstakedValue
        unstake
        claim
        reinvest
        switchIsActiveFieldValue
        updateUnstakeLockSpan
        updatePoolSettings
        appendPoolSettings
        deletePoolSettings
        getClientTotalStakedValue
        getClientReport
        getApiConfigReport1
        getVariableContractSettings
        getClientState
        getUnstakeState
        getClientList
        getTotalStakedValue
    )
}

multiversx_sc_wasm_adapter::empty_callback! {}
