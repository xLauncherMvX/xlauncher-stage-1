use elrond_wasm_debug::*;

fn world() -> BlockchainMock {
    let mut blockchain = BlockchainMock::new();
    blockchain.set_current_dir_from_workspace("");

    blockchain.register_contract_builder(
        "file:output/xlauncher-staking.wasm",
        xlauncher_staking::ContractBuilder,
    );
    blockchain
}

#[test]
fn stake_pull_a_rs() {
    elrond_wasm_debug::mandos_rs("mandos/02-stake-pull-a.scen.json", world());
}

#[test]
fn claim_successful_rs() {
    elrond_wasm_debug::mandos_rs("mandos/04-claim-case-7.scen.json", world());
}

#[test]
fn unstake_case_1_a_rs() {
    elrond_wasm_debug::mandos_rs("mandos/07-unstake-case-1-a.scen.json", world());
}

#[test]
fn unstake_case_2_a_rs() {
    elrond_wasm_debug::mandos_rs("mandos/07-unstake-case-2-a.scen.json", world());
}

#[test]
fn unstake_case_4_a_rs() {
    elrond_wasm_debug::mandos_rs("mandos/07-unstake-case-4.scen.json", world());
}

#[test]
fn unstake_case_3_rs() {
    elrond_wasm_debug::mandos_rs("mandos/07-unstake-case-3.scen.json", world());
}

#[test]
fn update_pull_settings_rs() {
    elrond_wasm_debug::mandos_rs("mandos/09-update-pull-settings.scen.json", world());
}

#[test]
fn append_pull_settings_rs() {
    elrond_wasm_debug::mandos_rs("mandos/10-append-pull-settings.scen.json", world());
}

#[test]
fn not_active_stake_pull_a_rs() {
    elrond_wasm_debug::mandos_rs("mandos/11-not-active-stake-pull-a.scen.json", world());
}

#[test]
fn claim_before_and_after_time_ends_rs() {
    elrond_wasm_debug::mandos_rs("mandos/12-claim-unstaked-before-and-after-time-ends.scen.json", world());
}

#[test]
fn claim_case_2() {
    elrond_wasm_debug::mandos_rs("mandos/04-claim-case-2.scen.json", world());
}

#[test]
fn reinvest_case_2_rs() {
    elrond_wasm_debug::mandos_rs("mandos/05-reinvest-case-2.scen.json", world());
}

/**
* Test complex example 01
* period1 apy values: 200,400,800
* period2 apy values: 100,200,800
* s1----------------------------------e1,s2----------------------------------------------e2
*  <--1 year ------------------------->    <---- 1 year----------------------------------->
*  0---------15768000----------------31536000-----------------47304000----------------63072000
*  <--0.5 years---c1stake(1,2,3)-------(c+i 1,2,3)--------------(c+i 1,2,3)----0.5years------>
*
*/
#[test]
fn complex_ex_1() {
    elrond_wasm_debug::mandos_rs("mandos/14-complex-ex-1.scen.json", world());
}