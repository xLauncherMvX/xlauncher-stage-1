/** 

=========================================================
* Vision UI PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Visionware.

*/
import React, { useState, useEffect, useLayoutEffect } from "react";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import breakpoints from "assets/theme/base/breakpoints";
// Vision UI Dashboard PRO React base styles
import typography from "assets/theme/base/typography";
// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import Footer from "examples/FooterXLH";
import Globe from "examples/Globe";
// Vision UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";


// icons
import { FaShoppingCart } from "react-icons/fa";
import { BsGlobe } from "react-icons/bs";
import { IoWallet, IoDocumentText } from "react-icons/io5";

//Elrond
import {
  DappUI,
  logout,
  refreshAccount,
  transactionServices,
  useGetAccountInfo,
  useGetPendingTransactions
} from "@elrondnetwork/dapp-core";
import {
  AbiRegistry,
  Address,
  AddressValue,
  Balance,
  BigUIntValue,
  BytesValue,
  Interaction,
  NetworkConfig,
  ProxyProvider,
  SmartContract,
  SmartContractAbi,
  TransactionPayload,
  ContractFunction
} from "@elrondnetwork/erdjs/out";

import Main from "layouts/main";
import xConfigs from 'configs/envConfig.json';

function Home() {
  //Config Variables
  let xProvider = xConfigs['provider'];
  let xToken = xConfigs["token"];
  let xStakeAddress = xConfigs["stakeAddress"];

  const { address, account } = useGetAccountInfo();
  const isLoggedIn = Boolean(address); 

  //Get the list of the clients that have staked xlh
  const [clientsNumberData, setClientsNumberData] = useState(0);
  const [clientsListData, setClientListData] = useState([]);  
  const getClientsListData = async () => {
    try {
      let providerCSD = new ProxyProvider(xProvider);
      await NetworkConfig.getDefault().sync(providerCSD);

      let stringAddressCSD = xStakeAddress;
      let addressCSD = new Address(stringAddressCSD);

      const abiLocationCSD = `${process.env.PUBLIC_URL}/xlauncher-staking.abi.json`;

      let abiRegistryCSD = await AbiRegistry.load({
        urls: [abiLocationCSD],
      });
      let abiCSD = new SmartContractAbi(abiRegistryCSD, [`XLauncherStaking`]);

      let contractCSD = new SmartContract({
        address: addressCSD,
        abi: abiCSD,
      });

      let interactionCSD = contractCSD.methods.getClientList();

      let queryResponseCSD = await contractCSD.runQuery(providerCSD, interactionCSD.buildQuery());

      let responseCSD = interactionCSD.interpretQueryResponse(queryResponseCSD);
      let myListCSD = responseCSD.firstValue.valueOf();
      //console.log("myListCSD " + JSON.stringify(myListCSD, null, 2));

      myListCSD.map((client) => {
        setClientListData(clientsListData => [...clientsListData, client]);
      });
      setClientsNumberData(myListCSD.length);      

    } catch (error) {
      console.log(error);
    }
  };

  const [clientReportData, setClientReportData] = useState(["", "", "", "", "", "", "", ""]);
  let xMultiplier = 1000000000000000000;

  const [farm1List, setFarm1List] = useState([]);
  const getClientReportData = async () => {
    try {
      let providerCRD = new ProxyProvider(xProvider);
      await NetworkConfig.getDefault().sync(providerCRD);

      let stringAddressCRD = xStakeAddress;
      let addressCRD = new Address(stringAddressCRD);

      const abiLocationCRD = `${process.env.PUBLIC_URL}/xlauncher-staking.abi.json`;

      let abiRegistryCRD = await AbiRegistry.load({
        urls: [abiLocationCRD],
      });
      let abiCRD = new SmartContractAbi(abiRegistryCRD, [`XLauncherStaking`]);

      let contractCRD = new SmartContract({
        address: addressCRD,
        abi: abiCRD,
      });

      let interactionCRD = contractCRD.methods.getClientReport([
        new AddressValue(new Address(address)),
      ]);

      let queryResponseCRD = await contractCRD.runQuery(providerCRD, interactionCRD.buildQuery());

      let responseCRD = interactionCRD.interpretQueryResponse(queryResponseCRD);
      let myList = responseCRD.firstValue.valueOf();
      console.log("myList " + JSON.stringify(myList, null, 2));

      let amountFormat = 1000000000000000000;
      let totalAmount = myList["total_amount"].toFixed(2) / amountFormat;
      let totalRewards = myList["total_rewords"].toFixed(2) / amountFormat;

      myList["report_pull_items"].map((client1) => {
        if(client1.pool_id == 1){
          setFarm1List(farm1List => [address]);
        }
      });

    } catch (error) {
      console.log(error);
    }
  };

console.log("farm1List " + farm1List);
  const MINUTE_MS = 5000;
  useEffect(() => {    
    if(isLoggedIn) {
      const interval = window.setInterval(() => {      
        //getClientsListData(); 
        getClientReportData();
      }, MINUTE_MS);

      return () => window.clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }
  }, [])

  return (    
    <Main name="Home">

    </Main>
  );
}

export default Home;
