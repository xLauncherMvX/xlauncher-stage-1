import React from 'react';
import {
    AbiRegistry,
    Address, ContractFunction, Egld,
    NetworkConfig,
    ProxyProvider,
    SmartContract,
    SmartContractAbi, TransactionPayload, U32Value
} from "@elrondnetwork/erdjs/out";
import {convertWeiToEsdt} from "utils/converters";
import {egldMultiplier} from "utils/utils";
import {BigNumber} from "bignumber.js";
import {refreshAccount} from "@elrondnetwork/dapp-core";

//Mint Function
export const mintFunction = async (mintAmount, mintAddress, sendTransactions, setTransactionSession) => {
    console.log("Formatting mint transaction");

    let data = TransactionPayload.contractCall()
        .setFunction(new ContractFunction("mint"))
        .setArgs([
            new U32Value(mintAmount),
        ])
        .build().toString()

    const createMintTransaction = {
        value: Egld.raw(new BigNumber(2.85 * egldMultiplier).multipliedBy(mintAmount).toFixed()),
        data: data,
        receiver: mintAddress,
        gasLimit: 20_000_000,
    };

    await refreshAccount();

    const { session /*, error*/ } = await sendTransactions({
        transactions: [createMintTransaction],
        transactionsDisplayInfo: {
            processingMessage: "Mint Transaction",
            errorMessage: "An error has occured during Mint Transaction",
            successMessage: "Mint Transaction successful",
        },
        redirectAfterSign: false,

    });
    if (session != null) {
        console.log("session ", session);
        setTransactionSession(session);
    }
};

//Get SFT smart-contract settings
export const getViewSettings = async (xProvider, mintAddress, setArray) => {
    try {
        let provider = new ProxyProvider(xProvider);
        await NetworkConfig.getDefault().sync(provider);

        let scAddress = new Address(mintAddress);
        const abiLocation = `${process.env.PUBLIC_URL}/vesta-x-sft-minter.abi.json`;
        let abiRegistry = await AbiRegistry.load({
            urls: [abiLocation],
        });
        let abi = new SmartContractAbi(abiRegistry, [`VestaXSftMinter`]);

        let contract = new SmartContract({
            address: scAddress,
            abi: abi,
        });

        let interaction = contract.methods.viewMinterSettings();
        let queryResponse = await contract.runQuery(provider, interaction.buildQuery());
        let response = interaction.interpretQueryResponse(queryResponse);
        let myList = response.firstValue.valueOf();
        //console.log("myList " + JSON.stringify(myList, null, 2));

        const decode =  {
            start_timestamp: myList.start_timestamp.toNumber(),
            first_round_length: myList.first_round_length.toNumber(),
            second_round_length: myList.second_round_length.toNumber(),
            treasury_wallet: myList.treasury_wallet.toString(),
            first_round_mint_price: convertWeiToEsdt(myList.first_round_mint_price).toNumber(),
            second_round_mint_price: convertWeiToEsdt(myList.second_round_mint_price).toNumber(),
            first_round_max_mint_amount: myList.first_round_max_mint_amount.toNumber(),
            first_round_mint_limit_multiplier: myList.first_round_mint_limit_multiplier.toNumber(),
            second_round_mint_limit_multiplier: myList.second_round_mint_limit_multiplier.toNumber(),
            collection_identifier: myList.collection_identifier.toString(),
            nonce: myList.nonce.toNumber(),
            max_supply: myList.max_supply.toNumber(),
            is_sft_deposited: myList.is_sft_deposited,
            minted_amount: myList.minted_amount.toNumber(),
            first_round_total_minted_amount: myList.first_round_total_minted_amount.toNumber(),
            second_round_total_minted_amount: myList.second_round_total_minted_amount.toNumber(),
            total_profit: convertWeiToEsdt(myList.total_profit).toNumber(),

            current_status: myList.current_status.toNumber(),
            current_timestamp: myList.current_timestamp.toNumber(),
        };
        setArray(decode);

    } catch (error) {
        console.log(error);
    }
};