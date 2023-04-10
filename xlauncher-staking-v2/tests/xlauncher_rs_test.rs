use multiversx_sc_scenario::*;

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

fn world() -> ScenarioWorld {
    let mut blockchain = ScenarioWorld::new();
    blockchain.set_current_dir_from_workspace("");

    blockchain.register_contract(
        "file:output/xlauncher-staking.wasm",
        xlauncher_staking::ContractBuilder,
    );
    blockchain
}

#[test]
fn stake_pool_a_rs() {
    multiversx_sc_scenario::run_rs("scenarios/04-xtake-xlh-1-client.scen.json", world());
}

#[test]
fn claim_1_year_rs() {
    multiversx_sc_scenario::run_rs("scenarios/05-claim-1-year.scen.json", world());
}
