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
fn _03_create_new_pool() {
    multiversx_sc_scenario::run_rs("scenarios/_03_create_new_pool.scen.json", world());
}

#[test]
fn fund_with_rewords_rs() {
    multiversx_sc_scenario::run_rs("scenarios/03-fund-with-rewords.scen.json", world());
}

#[test]
fn _04_stake_xlh_1_client() {
    multiversx_sc_scenario::run_rs("scenarios/04-stake-xlh-1-client.scen.json", world());
}

#[test]
fn claim_1_year_rs() {
    multiversx_sc_scenario::run_rs("scenarios/05-claim-1-year.scen.json", world());
}

#[test]
fn stake_sft_rs() {
    multiversx_sc_scenario::run_rs("scenarios/05-xtake-sft-1-client.scen.json", world());
}

#[test]
fn claim_1_year_10_sft_rs() {
    multiversx_sc_scenario::run_rs("scenarios/06-claim-1-year-10-sft.scen.json", world());
}

#[test]
fn top_up_1_year_rs() {
    multiversx_sc_scenario::run_rs("scenarios/07-top-up-1-year.scen.json", world());
}

#[test]
fn _08_unstake_half_1_year_rs() {
    multiversx_sc_scenario::run_rs("scenarios/08-unstake-half-1-year.scen.json", world());
}

#[test]
fn _08_unstake_all_1_year() {
    multiversx_sc_scenario::run_rs("scenarios/08-unstake-all-1-year.scen.json", world());
}