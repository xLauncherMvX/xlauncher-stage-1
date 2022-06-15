const express = require("express");

import path = require("path");
import fs = require("fs");
import {
  Account,
  Address,
  UserSigner,
  SmartContractAbi,
  Balance,
  Code,
  ContractFunction,
  GasLimit,
  NetworkConfig,
  ProxyProvider,
  SmartContract,
  Interaction,
} from "@elrondnetwork/erdjs";
import {
  AbiRegistry,
  AddressValue,
  BytesValue,
  U32Value,
} from "@elrondnetwork/erdjs/out/smartcontracts/typesystem";
import { BinaryCodec } from "@elrondnetwork/erdjs/out/smartcontracts/codec";
import BigNumber from "bignumber.js";
import { readFileSync, accessSync, constants, writeFileSync } from "fs";

const app = express();

//Parameters
let contractAddress = "erd1qqqqqqqqqqqqqpgqj2zawgu92vuvs8xzcna0u7hrsd0xm9whpa7quckxv3";
let proxyAddress = "https://devnet-gateway.elrond.com";
let clientAddress = "erd1mhhnd3ux2duwc9824dhelherdj3gvzn04erdw29l8cyr5z8fpa7quda68z";

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Hello world listening on port", port);
  // getTournamentInfoList();
  // getVariableContractSettings();
  // getClientState();
  getClientReport();
  
});

async function getTournamentInfoList() {
  try {
    let provider = new ProxyProvider("https://devnet-gateway.elrond.com");
    await NetworkConfig.getDefault().sync(provider);

    let stringAddress =
      "erd1qqqqqqqqqqqqqpgq8fvsq3uxkwx7p7vuzjy97nwtfg0hyc5kd8ssmhljdx";
    let address = new Address(stringAddress);

    let abiRegistry = await AbiRegistry.load({
      files: ["my-contract.abi.json"],
    });

    let abi = new SmartContractAbi(abiRegistry, [`MyContract`]);

    let contract = new SmartContract({
      address: address,
      abi: abi,
    });

    let interaction: Interaction = contract.methods.getTournamentInfoList([
      BytesValue.fromUTF8("tournament-01"),
      BytesValue.fromUTF8("tournament-02"),
    ]);

    let queryResponse = await contract.runQuery(
      provider,
      interaction.buildQuery()
    );
    let response = interaction.interpretQueryResponse(queryResponse);
    console.log(response);

    console.log("--------------------List iteration -------------");
    let myType = response.firstValue.getType();
    console.log(myType);

    let myList = response.firstValue.valueOf();
    console.log(myList);

    myList.forEach((element) => {
      let bufferedId = element.tournament_id;

      let stringVal = bufferedId.toString();
      console.log(stringVal);

      let signInPrice = element.sing_in_price.toFixed();
      console.log(signInPrice);
    });
    // End of queryCrowdFund()
    let stamp = Date();
    console.log("End of query crowdfund " + stamp);
  } catch (error) {
    console.log(error);
  }
}

/**
 * TODO
 *  - getVariableContractSettings
 *  - clientState
 *  - getClientReport
 */

 const getVariableContractSettings = async () => {
  try {
    let providerCSD = new ProxyProvider(proxyAddress);
    await NetworkConfig.getDefault().sync(providerCSD);

    let addressCSD = new Address(contractAddress);
    
    let abiRegistryCSD = await AbiRegistry.load({
      files: ["xlauncher-staking.abi.json"],
    });

    let abiCSD = new SmartContractAbi(abiRegistryCSD, [`XLauncherStaking`]);

    let contractCSD = new SmartContract({
      address: addressCSD,
      abi: abiCSD,
    });

    let interactionCSD = contractCSD.methods.getVariableContractSettings([
      
    ]);

    let queryResponseCSD = await contractCSD.runQuery(providerCSD, interactionCSD.buildQuery());

    let responseCSD = interactionCSD.interpretQueryResponse(queryResponseCSD);
    let myListCSD = responseCSD.firstValue.valueOf();
    console.log("getVariableContractSettings " + JSON.stringify(myListCSD, null, 2));

  } catch (error) {
    console.log(error);
  }
};

const getClientState = async () => {
  try {
    let providerCSD = new ProxyProvider(proxyAddress);
    await NetworkConfig.getDefault().sync(providerCSD);

    let addressCSD = new Address(contractAddress);
    
    let abiRegistryCSD = await AbiRegistry.load({
      files: ["xlauncher-staking.abi.json"],
    });

    let abiCSD = new SmartContractAbi(abiRegistryCSD, [`XLauncherStaking`]);

    let contractCSD = new SmartContract({
      address: addressCSD,
      abi: abiCSD,
    });

    let interactionCSD = contractCSD.methods.getClientState([
      new AddressValue(new Address(clientAddress)),
    ]);

    let queryResponseCSD = await contractCSD.runQuery(providerCSD, interactionCSD.buildQuery());

    let responseCSD = interactionCSD.interpretQueryResponse(queryResponseCSD);
    let myListCSD = responseCSD.firstValue.valueOf();
    console.log("getClientState " + JSON.stringify(myListCSD, null, 2));
    

    myListCSD.forEach((element) => {
      let poolId = element.pool_id;
      let poolAmount = element.pool_amount;
      let multiplier = 1000000000000000000;
      let poolAmountF = poolAmount / multiplier;

      console.log("id: " + poolId + " amount: " + poolAmountF);
    });

  } catch (error) {
    console.log(error);
  }
};

const getClientReport = async () => {
  try {
    let providerCSD = new ProxyProvider(proxyAddress);
    await NetworkConfig.getDefault().sync(providerCSD);

    let addressCSD = new Address(contractAddress);
    
    let abiRegistryCSD = await AbiRegistry.load({
      files: ["xlauncher-staking.abi.json"],
    });

    let abiCSD = new SmartContractAbi(abiRegistryCSD, [`XLauncherStaking`]);

    let contractCSD = new SmartContract({
      address: addressCSD,
      abi: abiCSD,
    });

    let interactionCSD = contractCSD.methods.getClientReport([
      new AddressValue(new Address(clientAddress)),
    ]);

    let queryResponseCSD = await contractCSD.runQuery(providerCSD, interactionCSD.buildQuery());

    let responseCSD = interactionCSD.interpretQueryResponse(queryResponseCSD);
    let myListCSD = responseCSD.firstValue.valueOf();
    console.log("getClientReport " + JSON.stringify(myListCSD, null, 2));
    

    // myListCSD.forEach((element) => {
    //   let poolId = element.pool_id;
    //   let poolAmount = element.pool_amount;
    //   let multiplier = 1000000000000000000;
    //   let poolAmountF = poolAmount / multiplier;

    //   console.log("id: " + poolId + " amount: " + poolAmountF);
    // });

  } catch (error) {
    console.log(error);
  }
};