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
fn claim_successful_rs() {
    elrond_wasm_debug::mandos_rs("mandos/04-claim-case-7.scen.json", world());
}

#[test]
fn unstake_case_3_rs() {
    elrond_wasm_debug::mandos_rs("mandos/07-unstake-case-3.scen.json", world());
}

#[test]
fn update_pull_settings_rs() {
    elrond_wasm_debug::mandos_rs("mandos/09-update-pull-settings.scen.json", world());
}