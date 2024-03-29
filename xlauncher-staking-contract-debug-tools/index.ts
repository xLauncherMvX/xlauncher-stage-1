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
  BigUIntValue,
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

//devnet
//let contractAddress =  "erd1qqqqqqqqqqqqqpgq60rugu3m57kvx0n6wqv53y3tuzzyl602pa7qefp8ar"; // 1 periods
//let contractAddress =  "erd1qqqqqqqqqqqqqpgqqxc37qvrcg8r3y2edlqm9n7uzht0jwtkpa7qhkcw64"; // 2 periods
//let contractAddress =  "erd1qqqqqqqqqqqqqpgqxmeg3k0ty84hm3f8n9wdfpukspc0asj3pa7qtt6j0t"; // 5 periods

let contractAddress =  "erd1qqqqqqqqqqqqqpgqdw9gatcwzlsdtvjwu3mveln57g0quyzzpa7q9jg84s"; // testnet

//let proxyAddress = "https://devnet-gateway.elrond.com"; //devnet
let proxyAddress = "https://testnet-gateway.elrond.com"; //testnet

let clientAddress =
  "erd1mhhnd3ux2duwc9824dhelherdj3gvzn04erdw29l8cyr5z8fpa7quda68z";

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Hello world listening on port", port);
  getVariableContractSettings();
  //getClientState();
  //getClientReport();
  //getGasLimitValue();
});

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

    let interactionCSD = contractCSD.methods.getVariableContractSettings([]);

    let queryResponseCSD = await contractCSD.runQuery(
      providerCSD,
      interactionCSD.buildQuery()
    );

    let responseCSD = interactionCSD.interpretQueryResponse(queryResponseCSD);
    let myListCSD = responseCSD.firstValue.valueOf();
    console.log(
      "getVariableContractSettings " + JSON.stringify(myListCSD, null, 2)
    );
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

    let queryResponseCSD = await contractCSD.runQuery(
      providerCSD,
      interactionCSD.buildQuery()
    );

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

    let queryResponseCSD = await contractCSD.runQuery(
      providerCSD,
      interactionCSD.buildQuery()
    );

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

//gas limit queries
const getGasLimitValue = async () => {
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

    let interactionCSD = contractCSD.methods.reinvest([
      new BigUIntValue(new BigNumber(2)),
    ]);

    let reinvestFunction = new ContractFunction("reinvest");
    let reinvestParams = [new BigUIntValue(new BigNumber(2))];
    let value = Balance.egld(0);
    let address = new Address(clientAddress);

    let query = contractCSD.runQuery(providerCSD, {
      func: reinvestFunction,
      args: reinvestParams,
      value: value,
      caller: address,
    });

    let gasUsed = (await query).gasUsed;

    console.log("gassUsed", gasUsed);
    console.log("Query: ", query)
  } catch (error) {
    console.log(error);
  }
};
