use elrond_wasm_debug::*;

fn world() -> BlockchainMock {
    let mut blockchain = BlockchainMock::new();
    blockchain.set_current_dir_from_workspace("");

    blockchain.register_contract_builder(
        "file:output/xlauncher-presale.wasm",
        xlauncher_presale::ContractBuilder,
    );
    blockchain
}

#[test]
fn buy_ok_scen_01() {
    elrond_wasm_debug::mandos_rs("mandos/03-buy-ok.scen.json", world());
}
