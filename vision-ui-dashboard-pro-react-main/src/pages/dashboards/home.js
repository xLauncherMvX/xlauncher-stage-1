import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
// Vision UI Dashboard PRO React components
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import ProgressLineChart from "examples/Charts/LineCharts/ProgressLineChart";
import {IoSwapHorizontal, IoWallet} from "react-icons/io5";
import {FaStackOverflow} from "react-icons/fa";
import {MdOutlineCategory} from "react-icons/all";
import {GiMoneyStack} from "react-icons/all";
import {IoRocketOutline} from "react-icons/io5";

//Elrond
import {
  useGetAccountInfo
} from "@elrondnetwork/dapp-core";
import {
  AbiRegistry,
  Address,
  AddressValue,
  NetworkConfig,
  ProxyProvider,
  SmartContract,
  SmartContractAbi
} from "@elrondnetwork/erdjs/out";

import Main from "layouts/main";
import xConfigs from 'configs/envConfig.json';

import Chart from "react-apexcharts";

import VuiBox from "../../components/VuiBox";
import BasicLineChart from "../../examples/Charts/LineCharts/BasicLineChart";
import Card from "@mui/material/Card";
import DefaultInfoCard from "../../examples/Cards/InfoCards/DefaultInfoCard";
import {FaPaypal} from "react-icons/fa";
import UpcomingEvents from "layouts/pages/widgets/components/UpcomingEvents";
import DefaultItem from "../../examples/Items/DefaultItem";
import {IoMdNotifications} from "react-icons/io";
import {FaBurn} from "react-icons/fa";
import {MdOutlineAddChart} from "react-icons/all";
import {MdOutlineDriveFileRenameOutline} from "react-icons/all";
import {BiTransfer} from "react-icons/all";
import {FaUserTie} from "react-icons/fa";
import {AiOutlineBarChart} from "react-icons/all";
import breakpoints from "../../assets/theme/base/breakpoints";
import { ReactComponent as XLauncherLogo } from "assets/images/logo.svg";
import RustLogo from "assets/images/rockets/rust.png";
import BronzeLogo from "assets/images/rockets/bronze.png";
import SilverLogo from "assets/images/rockets/silver.png";
import GoldLogo from "assets/images/rockets/gold.png";
import PlatinumLogo from "assets/images/rockets/platinum.png";
import LegendaryLogo from "assets/images/rockets/legendary.png";
import {BsStack} from "react-icons/all";
import {GiTrophyCup} from "react-icons/all";
import {IoIosUnlock} from "react-icons/all";

function calc3(theform) {
  var with3Decimals = theform.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
  return parseFloat(with3Decimals);
}

function calc4(theform) {
  var with4Decimals = theform.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0];
  return parseFloat(with4Decimals);
}


function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1);
}

function numberFormatting(number) {
 return new Intl.NumberFormat("en-US", {
   minimumFractionDigits: 2,
   maximumFractionDigits: 2,
 }).format(number)
}

function getDayMonth(timestamp) {
  var timestampWithMs = timestamp*1000;
  const options = { month: 'short'};
  return new Date(timestampWithMs).getDate() + " " + new Intl.DateTimeFormat('en-US', options).format(timestampWithMs);
}

const openInNewTab = (url) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null;
}

function Home() {
  //Config Variables
  const { values } = breakpoints;
  let xProvider = xConfigs['provider'];
  let xStakeAddress = xConfigs["stakeAddress"];

  const { address, account } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);
  let multiplier = 1000000000000000000;

  //Get Token Details
  const tokenAPI = 'https://api.elrond.com/tokens/XLH-8daa50';
  const [tokenDetails, setTokenDetails] = useState([]);
  const getTokenDetails = async () => {
    try {
      const response = await fetch(tokenAPI,
          {
            headers: {
              'Accept': 'application/json',
            }
          });

      const json = await response.json();
      setTokenDetails(json);
    } catch (error) {
      console.error(error);
    }
  }

  //Get the remaining nfts for sale
  const [rustContractNFTS, setContractRustNFTS] = useState(0);
  const [bronzeContractNFTS, setContractBronzeNFTS] = useState(0);
  const [silverContractNFTS, setContractSilverNFTS] = useState(0);
  const [goldContractNFTS, setContractGoldNFTS] = useState(0);
  const [platinumContractNFTS, setContractPlatinumNFTS] = useState(0);
  const [legendaryContractNFTS, setContractLegendaryNFTS] = useState(0);
  var nftApiLink = "https://api.elrond.com/accounts/erd1qqqqqqqqqqqqqpgq3z3jcwdw3nz3z9gccqr540g6schckhsa3umsjmdhz6/nfts?size=5000&search=XLHO-5135c9";
  const getContractNFTS = async () => {
    try {
      const response = await fetch(
          nftApiLink,
          {
            headers: {
              'Accept': 'application/json',
            }
          });
      const json = await response.json();
      var countContractRust = 0;
      var countContractBronze = 0;
      var countContractSilver = 0;
      var countContractGold = 0;
      var countContractPlatinum = 0;
      var countContractLegendary = 0;
      if(json){
        json.map(item => {
          let nftLeftSwitcher = item.metadata.attributes[3].value;
          switch (nftLeftSwitcher) {
            case "rust":
              countContractRust += 1;
              break;
            case "bronze":
              countContractBronze += 1;
              break;
            case "silver":
              countContractSilver += 1;
              break;
            case "gold":
              countContractGold += 1;
              break;
            case "platinum":
              countContractPlatinum += 1;
              break;
            case "Orange":
              countContractLegendary += 1;
              break;
          }
        })
        setContractRustNFTS(countContractRust);
        setContractBronzeNFTS(countContractBronze);
        setContractSilverNFTS(countContractSilver);
        setContractGoldNFTS(countContractGold);
        setContractPlatinumNFTS(countContractPlatinum);
        setContractLegendaryNFTS(countContractLegendary);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const [clientReportData, setClientReportData] = useState({
    "totalAmountF": 0,
    "totalRewardsF": 0,
    "farm1AmountF": 0,
    "farm1RewardsF": 0,
    "farm2AmountF": 0,
    "farm2RewardsF": 0,
    "farm3AmountF": 0,
    "farm3RewardsF": 0
  });
  let xMultiplier = 1000000000000000000;
  const getClientReportData = async () => {
    try {
      let providerCRD = new ProxyProvider(xProvider);
      await NetworkConfig.getDefault().sync(providerCRD);

      let addressCRD = new Address(xStakeAddress);
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
      //console.log("myList " + JSON.stringify(myList, null, 2));

      let totalAmount = myList["total_amount"].toFixed(2) / xMultiplier;
      let totalRewards = myList["total_rewords"].toFixed(2) / xMultiplier;

      let farm1Amount = 0;
      let farm1Rewards = 0;
      let farm2Amount = 0;
      let farm2Rewards = 0;
      let farm3Amount = 0;
      let farm3Rewards = 0;

      if (myList["report_pull_items"]) {
        myList["report_pull_items"].map(item0 => {
          let switcher = parseInt(item0.pool_id);
          switch (switcher) {
            case 1:
              farm1Amount = item0.pool_amount.toFixed() / xMultiplier;
              farm1Rewards = item0.rewords_amount.toFixed() / xMultiplier;
              break;
            case 2:
              farm2Amount = item0.pool_amount.toFixed() / xMultiplier;
              farm2Rewards = item0.rewords_amount.toFixed() / xMultiplier;
              break;
            case 3:
              farm3Amount = item0.pool_amount.toFixed() / xMultiplier;
              farm3Rewards = item0.rewords_amount.toFixed() / xMultiplier;
              break;
          }
        })
      }

      let totalAmountF = parseFloat(totalAmount).toFixed(2);
      let totalRewardsF = parseFloat(totalRewards).toFixed(2);
      let farm1AmountF = parseFloat(farm1Amount).toFixed(2);
      let farm1RewardsF = parseFloat(farm1Rewards).toFixed(2);
      let farm2AmountF = parseFloat(farm2Amount).toFixed(2);
      let farm2RewardsF = parseFloat(farm2Rewards).toFixed(2);
      let farm3AmountF = parseFloat(farm3Amount).toFixed(2);
      let farm3RewardsF = parseFloat(farm3Rewards).toFixed(2);

      let myReturnList =
          {
            totalAmountF,
            totalRewardsF,
            farm1AmountF,
            farm1RewardsF,
            farm2AmountF,
            farm2RewardsF,
            farm3AmountF,
            farm3RewardsF
          };

      setClientReportData(myReturnList);
    } catch (error) {
      console.log(error);
    }
  };

  var rustContractNFTSLeft = "0";
  var rustContractNFTSToBuy = "0";
  if(rustContractNFTS){
    rustContractNFTSLeft = 2683 - rustContractNFTS;
    rustContractNFTSToBuy = rustContractNFTS + 7;
  }
  var bronzeContractNFTSLeft = "0";
  var bronzeContractNFTSToBuy = "0";
  if(bronzeContractNFTS){
    bronzeContractNFTSLeft = 1250 - bronzeContractNFTS;
    bronzeContractNFTSToBuy = bronzeContractNFTS;
  }
  var silverContractNFTSLeft = "0";
  var silverContractNFTSToBuy = "0";
  if(silverContractNFTS){
    silverContractNFTSLeft = 750 - silverContractNFTS;
    silverContractNFTSToBuy = silverContractNFTS;
  }
  var goldContractNFTSLeft = "0";
  var goldContractNFTSToBuy = "0";
  if(goldContractNFTS){
    goldContractNFTSLeft = 250 - goldContractNFTS;
    goldContractNFTSToBuy = goldContractNFTS;
  }
  var platinumContractNFTSLeft = "0";
  var platinumContractNFTSToBuy = "0";
  if(platinumContractNFTS){
    platinumContractNFTSLeft = 57 - platinumContractNFTS;
    platinumContractNFTSToBuy = platinumContractNFTS - 7;
  }
  var legendaryContractNFTSLeft = "0";
  var legendaryContractNFTSToBuy = "0";
  if(legendaryContractNFTS){
    legendaryContractNFTSLeft = 10 - legendaryContractNFTS;
    legendaryContractNFTSToBuy = legendaryContractNFTS;
  }

  var nftBuyingLink =
    <VuiButton
        variant={"text"}
        color={"success"}
        onClick = {()=>openInNewTab('https://www.frameit.gg/marketplace/XLHO-5135c9/items')}
    >
      <VuiTypography variant="body2" fontWeight="regular" color={"success"} ml={"-13px"} mt="-5px" mb="-5px">
        XLH (Click to buy)
      </VuiTypography>
    </VuiButton>
  ;

  var priceHistory =
      <VuiButton
          size={"small"}
          variant={"text"}
          color={"success"}
          onClick = {()=>openInNewTab('https://e-compass.io/maiars/chart-jex/xlh/usdc')}
      >
        <VuiTypography variant="body2" fontWeight="regular" color={"success"} ml={"-13px"} mt="-5px" mb="-5px">
          Click here
        </VuiTypography>
      </VuiButton>
  ;

  var totalSupply = new Intl.NumberFormat("en-GB", {minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(100000000);

  var tokenHolders = "0";
  if(tokenDetails.accounts){
    tokenHolders = tokenDetails.accounts;
  }

  var tokenTransactions = "0";
  if(tokenDetails.transactions){
    tokenTransactions = tokenDetails.transactions;
  }

  //Calculate the farms apr for 3 days
  let apr1 = 0.0015 * clientReportData.farm1AmountF;
  let apr2 = 0.0072 * clientReportData.farm2AmountF;
  let apr3 = 0.0115 * clientReportData.farm3AmountF;

  var farm1Availability = false;
  var farm1Color = "#0075ff";
  if(clientReportData.farm1RewardsF >= apr1 && clientReportData.farm1RewardsF > 0){
    farm1Availability = true;
    farm1Color = "#00FF33";
  }
  var farm2Availability = false;
  var farm2Color = "#0075ff";
  if(clientReportData.farm2RewardsF >= apr2 && clientReportData.farm2RewardsF > 0){
    farm2Availability = true;
    farm2Color = "#00FF33";
  }
  var farm3Availability = false;
  var farm3Color = "#0075ff";
  if(clientReportData.farm3RewardsF >= apr3 && clientReportData.farm3RewardsF > 0){
    farm3Availability = true;
    farm3Color = "#00FF33";
  }

  var farmsLabel = "Not Reached";
  if(farm1Availability && farm2Availability && farm3Availability){
    farmsLabel = "Farm1 + Farm2 + Farm3";
  }
  if(!farm1Availability && !farm2Availability && !farm3Availability){
    farmsLabel = "Not Reached";
  }
  if(farm1Availability && !farm2Availability && !farm3Availability){
    farmsLabel = "Farm1";
  }
  if(farm1Availability && farm2Availability && !farm3Availability){
    farmsLabel = "Farm1 + Farm2";
  }
  if(farm1Availability && !farm2Availability && farm3Availability){
    farmsLabel = "Farm1 + Farm3";
  }
  if(!farm1Availability && farm2Availability && !farm3Availability){
    farmsLabel = "Farm2";
  }if(!farm1Availability && farm2Availability && farm3Availability){
    farmsLabel = "Farm2 + Farm3";
  }
  if(!farm1Availability && !farm2Availability && farm3Availability){
    farmsLabel = "Farm3";
  }

  //Get the jex price history
  const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
  var currentTimestamp = new Date().valueOf()/1000;
  var todayTimestamp = todayStart.valueOf()/1000;
  var last14DaysTimestamp = (todayTimestamp - 86400*14);
  const [priceLabels, setPriceLabels] = useState(["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]);
  const [priceValues, setPriceValues] = useState([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
  var jexPriceAPI = "https://apiv2.e-compass.io/tv/history?symbol=XLH%2FUSDC_JEX&resolution=1D&from="+parseInt(last14DaysTimestamp)+"&to="+parseInt(currentTimestamp)+"&countback=15";
  const getPriceHistory = async () => {
    try {
      const response = await fetch(jexPriceAPI,
          {
            headers: {
              'Accept': 'application/json',
            }
          });

      const json = await response.json();
      var formatedPriceLabels = {};
      json.t.forEach((element,i) => {
        formatedPriceLabels[i] = getDayMonth(element);
      });
      var formatedPriceValues = {};
      json.c.forEach((element2,j) => {
        formatedPriceValues[j] = calc4(element2);
      });
      setPriceLabels(formatedPriceLabels);
      setPriceValues(formatedPriceValues);
    } catch (error) {
      console.error(error);
    }
  }

  var priceLabelsArray = [
    priceLabels[0],
    priceLabels[1],
    priceLabels[2],
    priceLabels[3],
    priceLabels[4],
    priceLabels[5],
    priceLabels[6],
    priceLabels[7],
    priceLabels[8],
    priceLabels[9],
    priceLabels[10],
    priceLabels[11],
    priceLabels[12],
    priceLabels[13],
    priceLabels[14]
  ]

  useEffect(() => {
    getTokenDetails();
    if(isLoggedIn){
      getClientReportData();
    }
    getContractNFTS();
  }, []);

  useEffect(() => {
    getClientReportData();
  }, [isLoggedIn]);

  const MINUTE_MS = 3000;
  useEffect(() => {
    const interval = window.setInterval(() => {
      getTokenDetails();
      getContractNFTS();
      if(isLoggedIn){
        getClientReportData();
      }
      getPriceHistory();
    }, MINUTE_MS);

    return () => window.clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  return (
      <Main name="">
        <Grid container spacing={3}>
          {/*Title1*/}
          <Grid item xs={12} mt={-8}>
            <VuiTypography
                variant={window.innerWidth < values.sm ? "h3" : "h2"}
                textTransform="capitalize"
                fontWeight="bold"
                color="white"
            >
              Token Statistics
            </VuiTypography>
          </Grid>


          {/*General Details Widget*/}
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ height: "100%", pt: "28px" }}>
              <VuiBox display="flex" flexDirection="column" lineHeight={1} mb="24px">
                <VuiTypography variant="lg" color="white" fontWeight="bold">
                  General Details
                </VuiTypography>
                <VuiTypography variant="button" color="text" fontWeight="regular">
                  XLH Token
                </VuiTypography>
              </VuiBox>
              <VuiBox>
                <DefaultItem
                    color="info"
                    textColor="success"
                    icon={<MdOutlineDriveFileRenameOutline color="white" size="22px" />}
                    title="Token Name"
                    description="XLH-8daa50"
                />
                <VuiBox mt={3.5}>
                  <DefaultItem
                      color="info"
                      textColor="success"
                      icon={<FaStackOverflow color="white" size="22px" />}
                      title="Total Supply"
                      description={totalSupply}
                  />
                </VuiBox>
              </VuiBox>
            </Card>
          </Grid>

          {/*Advanced Details Widget*/}
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ height: "100%", pt: "28px" }}>
              <VuiBox display="flex" flexDirection="column" lineHeight={1} mb="24px">
                <VuiTypography variant="lg" color="white" fontWeight="bold">
                  Advanced Details
                </VuiTypography>
                <VuiTypography variant="button" color="text" fontWeight="regular">
                  XLH Token
                </VuiTypography>
              </VuiBox>
              <VuiBox>
                <DefaultItem
                    color="info"
                    textColor="success"
                    icon={<FaBurn color="white" size="22px" />}
                    title="Burned"
                    description={tokenDetails.burnt + " XLH Burned"}
                />
              </VuiBox>
              <VuiBox mt={3.5}>
                <DefaultItem
                    color="info"
                    textColor="success"
                    icon={<AiOutlineBarChart color="white" size="22px" />}
                    title="Complete Price History"
                    description={priceHistory}
                />
              </VuiBox>
            </Card>
          </Grid>

          {/*Holders Widget*/}
          <Grid item xs={6} md={3} lg={2}>
            <DefaultInfoCard
                icon={<FaUserTie size="26px" color="white" />}
                title="Holders"
                description="XLH Accounts"
                value={tokenHolders}
            />
          </Grid>

          {/*Total Transactions Widget*/}
          <Grid item xs={6} md={3} lg={2}>
            <DefaultInfoCard
                icon={<BiTransfer color="white" size="22px" />}
                title="Transactions"
                description="Total Transactions"
                value={tokenTransactions}
            />
          </Grid>

          {/*Transactions Last 7 Days Chart*/}
          <Grid item xs={12} lg={12}>
            <Card>
              <VuiBox display="flex" alignItems="center">
                <VuiBox ml={2} lineHeight={1} display="flex" flexDirection="column">
                  <VuiTypography
                      variant="h4"
                      fontWeight="medium"
                      textTransform="capitalize"
                      color="white"
                  >
                    Price History for the last 15 days
                  </VuiTypography>
                    <VuiTypography variant="h6" color="white" fontWeight="bold" textAlign={"left"}>
                      XLH / USDC
                    </VuiTypography>
                </VuiBox>
              </VuiBox>
              <VuiBox>
                <Chart
                    options={{
                      chart: {
                        id: "line-graph",
                        toolbar: {
                          show: false,
                        }
                      },
                      markers: {
                        size: 3,
                        colors: "#0075ff",
                        strokeColors: "#0075ff",
                        strokeWidth: 2,
                        strokeOpacity: 0.9,
                        strokeDashArray: 0,
                        fillOpacity: 1,
                        discrete: [],
                        shape: "circle",
                        radius: 2,
                        offsetX: 0,
                        offsetY: 0,
                        showNullDataPoints: true,
                      },
                      tooltip: {
                        theme: "dark",
                      },
                      dataLabels: {
                        enabled: false,
                      },
                      stroke: {
                        curve: "smooth",
                        width: 2,
                      },
                      xaxis: {
                        categories: priceLabelsArray,
                        labels: {
                          style: {
                            colors: "#A0AEC0",
                            fontSize: "10px",
                          },
                        },
                        axisBorder: {
                          show: true,
                        },
                        axisTicks: {
                          show: true,
                        },
                      },
                      yaxis: {
                        labels: {
                          style: {
                            colors: "#A0AEC0",
                            fontSize: "10px",
                          },
                        },
                      },
                      legend: {
                        show: true,
                      },
                      grid: {
                        colors: "#A0AEC0",
                        strokeDashArray: 5,
                        yaxis: {
                          lines: {
                            show: false,
                          },
                        },
                        xaxis: {
                          lines: {
                            show: true,
                          },
                        },
                      },
                      fill: {
                        type: "gradient",
                        gradient: {
                          shade: "dark",
                          type: "vertical",
                          shadeIntensity: 0,
                          gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
                          inverseColors: true,
                          opacityFrom: 0.9,
                          opacityTo: 0.4,
                          stops: [],
                        },
                        colors: ["#0075ff"],
                      },
                      colors: ["#0075ff"],
                    }}
                    series={[
                      {
                        name: "Price",
                        data: [
                          priceValues["0"],
                          priceValues["1"],
                          priceValues["2"],
                          priceValues["3"],
                          priceValues["4"],
                          priceValues["5"],
                          priceValues["6"],
                          priceValues["7"],
                          priceValues["8"],
                          priceValues["9"],
                          priceValues["10"],
                          priceValues["11"],
                          priceValues["12"],
                          priceValues["13"],
                          priceValues["14"]
                        ],
                      }
                    ]}
                    type="area"
                    height={250}
                />
              </VuiBox>
            </Card>
          </Grid>

          {/*Title2*/}
          <Grid item xs={12} mt={3}>
            <VuiTypography
                variant={window.innerWidth < values.sm ? "h3" : "h2"}
                textTransform="capitalize"
                fontWeight="bold"
                color="white"
            >
              NFTS Statistics
            </VuiTypography>
          </Grid>

          {/*NFT General Details Widget*/}
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ height: "100%", pt: "18px" }}>
              <VuiBox display="flex" flexDirection="column" lineHeight={1} mb="24px">
                <VuiTypography variant="lg" color="white" fontWeight="bold">
                  General Details
                </VuiTypography>
              </VuiBox>
              <VuiBox>
                <DefaultItem
                    color="info"
                    textColor="success"
                    icon={<MdOutlineDriveFileRenameOutline color="white" size="22px" />}
                    title="Collection Name"
                    description="X-Launcher Origins"
                />
                <VuiBox mt={2}>
                  <DefaultItem
                      color="info"
                      textColor="success"
                      icon={<FaStackOverflow color="white" size="22px" />}
                      title="Collection Size"
                      description="5000"
                  />
                </VuiBox>
                <VuiBox mt={2}>
                  <DefaultItem
                      color="info"
                      textColor="success"
                      icon={<GiMoneyStack color="white" size="22px" />}
                      title="Buying Currency"
                      description={nftBuyingLink}
                  />
                </VuiBox>
                <VuiBox mt={2}>
                  <DefaultItem
                      color="info"
                      textColor="success"
                      icon={<MdOutlineCategory color="white" size="22px" />}
                      title="Categories"
                      description="Rust, Bronze, Silver, Gold, Platinum, Legendary"
                  />
                </VuiBox>
              </VuiBox>
            </Card>
          </Grid>

          {/*NFTS Sold Chart */}
          <Grid item xs={12} md={6} lg={8}>
            <Card>
              <VuiBox display="flex" alignItems="center">
                <VuiBox ml={2} lineHeight={1} display="flex" flexDirection="column">
                  <VuiTypography
                      variant="button"
                      fontWeight="medium"
                      textTransform="capitalize"
                      color="white"
                  >
                    Sold NFTS
                  </VuiTypography>
                  <VuiTypography variant="lg" color="white" fontWeight="bold" textAlign={"left"}>
                    {5000 - (rustContractNFTS + bronzeContractNFTS + silverContractNFTS + goldContractNFTS + platinumContractNFTS + legendaryContractNFTS)}
                  </VuiTypography>
                </VuiBox>
              </VuiBox>
              <VuiBox>
                <Chart
                    options={{
                      chart: {
                        id: "line-graph",
                        toolbar: {
                          show: false,
                        }
                      },
                      plotOptions: {
                        bar: {
                          borderRadius: 5,
                          columnWidth: '10%',
                          dataLabels: {
                            position: 'top', // top, center, bottom
                          },
                        }
                      },
                      dataLabels: {
                        enabled: true,
                        offsetY: -20,
                        style: {
                          fontSize: '12px',
                          colors: ["#ffffff"]
                        }
                      },
                      markers: {
                        size: 3,
                        colors: "#0075ff",
                        strokeColors: "#0075ff",
                        strokeWidth: 2,
                        strokeOpacity: 0.9,
                        strokeDashArray: 0,
                        fillOpacity: 1,
                        discrete: [],
                        shape: "circle",
                        radius: 2,
                        offsetX: 0,
                        offsetY: 0,
                        showNullDataPoints: true,
                      },
                      tooltip: {
                        theme: "dark",
                      },
                      xaxis: {
                        categories: ["Rust", "Bronze", "Silver", "Gold", "Platinum", "Legendary"],
                        labels: {
                          style: {
                            colors: "#A0AEC0",
                            fontSize: "10px",
                          },
                        },
                        axisBorder: {
                          show: true,
                        },
                        axisTicks: {
                          show: false,
                        },
                      },
                      yaxis: {
                        labels: {
                          style: {
                            colors: "#A0AEC0",
                            fontSize: "10px",
                          },
                          axisBorder: {
                            show: true,
                          },
                          axisTicks: {
                            show: false,
                          },
                        },
                      },
                      legend: {
                        show: true,
                      },
                      grid: {
                        colors: "#A0AEC0",
                        strokeDashArray: 5,
                        yaxis: {
                          lines: {
                            show: false,
                          },
                        },
                        xaxis: {
                          lines: {
                            show: true,
                          },
                        },
                      },
                      fill: {
                        type: "solid",
                        colors: ["#00FF33"],
                      },
                      colors: ["green"],
                    }}
                    series={[
                      {
                        name: "Sold NFTS",
                        data: [rustContractNFTSLeft, bronzeContractNFTSLeft, silverContractNFTSLeft, goldContractNFTSLeft, platinumContractNFTSLeft, legendaryContractNFTSLeft]
                      },
                    ]}
                    type="bar"
                    height={250}
                />
              </VuiBox>
            </Card>
          </Grid>

          {/*Title3*/}
          <Grid item xs={12} mt={3}>
            <VuiTypography
                variant={window.innerWidth < values.sm ? "h3" : "h2"}
                textTransform="capitalize"
                fontWeight="bold"
                color="white"
            >
              Available for Minting NFTS
            </VuiTypography>
          </Grid>
          {/*Rust Widget*/}
          <Grid item xs={6} md={3} lg={2}>
            <DefaultInfoCard
                imgSrc={RustLogo}
                title="Rust"
                description="Remaining NFTS"
                value={rustContractNFTSToBuy}
            />
          </Grid>

          {/*Bronze Widget*/}
          <Grid item xs={6} md={3} lg={2}>
            <DefaultInfoCard
                imgSrc={BronzeLogo}
                title="Bronze"
                description="Remaining NFTS"
                value={bronzeContractNFTSToBuy}
            />
          </Grid>

          {/*Silver Widget*/}
          <Grid item xs={6} md={3} lg={2}>
            <DefaultInfoCard
                imgSrc={SilverLogo}
                title="Silver"
                description="Remaining NFTS"
                value={silverContractNFTSToBuy}
            />
          </Grid>

          {/*Gold Widget*/}
          <Grid item xs={6} md={3} lg={2}>
            <DefaultInfoCard
                imgSrc={GoldLogo}
                title="Gold"
                description="Remaining NFTS"
                value={goldContractNFTSToBuy}
            />
          </Grid>

          {/*Platinum Widget*/}
          <Grid item xs={6} md={3} lg={2}>
            <DefaultInfoCard
                imgSrc={PlatinumLogo}
                title="Platinum"
                description="Remaining NFTS"
                value={platinumContractNFTSToBuy}
            />
          </Grid>

          {/*Legendary Widget*/}
          <Grid item xs={6} md={3} lg={2}>
            <DefaultInfoCard
                imgSrc={LegendaryLogo}
                title="Legendary"
                description="Remaining NFTS"
                value={legendaryContractNFTSToBuy}
            />
          </Grid>

          {isLoggedIn ? (
          <React.Fragment>
          {/*Title3*/}
          <Grid item xs={12} mt={3}>
            <VuiTypography
                variant={window.innerWidth < values.sm ? "h3" : "h2"}
                textTransform="capitalize"
                fontWeight="bold"
                color="white"
            >
              Account Farms Statistics
            </VuiTypography>
          </Grid>

          {/*Account General Details Widget*/}
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ height: "100%", pt: "28px" }}>
              <VuiBox display="flex" flexDirection="column" lineHeight={1} mb="24px">
                <VuiTypography variant="lg" color="white" fontWeight="bold">
                  Staking Details
                </VuiTypography>
                <VuiTypography variant="button" color="text" fontWeight="regular">
                  For All Farms
                </VuiTypography>
              </VuiBox>
              <VuiBox>
                <DefaultItem
                    color="info"
                    textColor="success"
                    icon={<BsStack color="white" size="22px" />}
                    title="Total Staked"
                    description={numberFormatting(clientReportData.totalAmountF)}
                />
                <VuiBox mt={3.5}>
                  <DefaultItem
                      color="info"
                      textColor="success"
                      icon={<GiTrophyCup color="white" size="22px" />}
                      title="Total Rewards"
                      description={numberFormatting(clientReportData.totalRewardsF)}
                  />
                </VuiBox>
                <VuiBox mt={3.5}>
                  <DefaultItem
                      color="info"
                      textColor="success"
                      icon={<IoIosUnlock color="white" size="22px" />}
                      title="Claim / Reinvest Availability"
                      description={farmsLabel}
                  />
                </VuiBox>
              </VuiBox>
            </Card>
          </Grid>

          {/*Staking Farms Chart */}
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <VuiBox display="flex" alignItems="center">
                <VuiBox ml={2} lineHeight={1} display="flex" flexDirection="column">
                  <VuiTypography
                      variant="lg"
                      fontWeight="medium"
                      textTransform="capitalize"
                      color="white"
                  >
                    Total Staking
                  </VuiTypography>
                  <VuiTypography variant="body2" color="white" textAlign={"left"}>
                    For Each Farm
                  </VuiTypography>
                </VuiBox>
              </VuiBox>
              <VuiBox>
                <Chart
                    options={{
                      chart: {
                        toolbar: {
                          show: false,
                        }
                      },
                      plotOptions: {
                        bar: {
                          borderRadius: 5,
                          barHeight: '50%',
                          dataLabels: {
                            position: 'center', // top, center, bottom
                          },
                          horizontal: true,
                        }
                      },
                      dataLabels: {
                        enabled: true,
                        style: {
                          fontSize: '12px',
                          colors: ["#ffffff"]
                        },
                        formatter: function (val) {
                          return new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(val);
                        },
                      },
                      markers: {
                        size: 3,
                        colors: "#0075ff",
                        strokeColors: "#0075ff",
                        strokeWidth: 2,
                        strokeOpacity: 0.9,
                        strokeDashArray: 0,
                        fillOpacity: 1,
                        discrete: [],
                        shape: "circle",
                        radius: 2,
                        offsetX: 0,
                        offsetY: 0,
                        showNullDataPoints: true,
                      },
                      tooltip: {
                        theme: "dark",
                      },
                      xaxis: {
                        categories: ["Farm1", "Farm2", "Farm3"],
                        labels: {
                          style: {
                            colors: "#A0AEC0",
                            fontSize: "10px",
                          },
                        },
                        axisBorder: {
                          show: true,
                        },
                        axisTicks: {
                          show: false,
                        },
                      },
                      yaxis: {
                        labels: {
                          style: {
                            colors: "#A0AEC0",
                            fontSize: "10px",
                          },
                          axisBorder: {
                            show: true,
                          },
                          axisTicks: {
                            show: false,
                          },
                        },
                      },
                      legend: {
                        show: true,
                      },
                      grid: {
                        colors: "#A0AEC0",
                        strokeDashArray: 5,
                        yaxis: {
                          lines: {
                            show: false,
                          },
                        },
                        xaxis: {
                          lines: {
                            show: true,
                          },
                        },
                      },
                      fill: {
                        type: "solid",
                        colors: ["#0075ff"],
                      }
                    }}
                    series={[
                      {
                        name: "Total Staked",
                        data: [clientReportData.farm1AmountF, clientReportData.farm2AmountF, clientReportData.farm3AmountF]
                      },
                    ]}
                    type="bar"
                    height={250}
                />
              </VuiBox>
            </Card>
          </Grid>

          {/*Rewards Farms Chart */}
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <VuiBox display="flex" alignItems="center">
                <VuiBox ml={2} lineHeight={1} display="flex" flexDirection="column">
                  <VuiTypography
                      variant="lg"
                      fontWeight="medium"
                      textTransform="capitalize"
                      color="white"
                  >
                    Total Rewards
                  </VuiTypography>
                  <VuiTypography variant="body2" color="white" textAlign={"left"}>
                    For Each Farm
                  </VuiTypography>
                </VuiBox>
              </VuiBox>
              <VuiBox>
                <Chart
                    options={{
                      chart: {
                        toolbar: {
                          show: false,
                        }
                      },
                      plotOptions: {
                        bar: {
                          borderRadius: 5,
                          barHeight: '50%',
                          distributed: true,
                          dataLabels: {
                            position: 'center', // top, center, bottom
                          },
                          horizontal: true,
                        }
                      },
                      dataLabels: {
                        enabled: true,
                        style: {
                          fontSize: '12px',
                          colors: ["#ffffff"]
                        },
                        formatter: function (val) {
                          return new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(val);
                        },
                      },
                      colors: [farm1Color, farm2Color, farm3Color],
                      markers: {
                        size: 3,
                        colors: "#0075ff",
                        strokeColors: "#0075ff",
                        strokeWidth: 2,
                        strokeOpacity: 0.9,
                        strokeDashArray: 0,
                        fillOpacity: 1,
                        discrete: [],
                        shape: "circle",
                        radius: 2,
                        offsetX: 0,
                        offsetY: 0,
                        showNullDataPoints: true,
                      },
                      tooltip: {
                        theme: "dark",
                      },
                      xaxis: {
                        categories: ["Farm1", "Farm2", "Farm3"],
                        labels: {
                          style: {
                            colors: "#A0AEC0",
                            fontSize: "10px",
                          },
                        },
                        axisBorder: {
                          show: true,
                        },
                        axisTicks: {
                          show: false,
                        },
                      },
                      yaxis: {
                        labels: {
                          style: {
                            colors: "#A0AEC0",
                            fontSize: "10px",
                          },
                          axisBorder: {
                            show: true,
                          },
                          axisTicks: {
                            show: false,
                          },
                        },
                      },
                      legend: {
                        show: false
                      },
                      grid: {
                        colors: "#A0AEC0",
                        strokeDashArray: 5,
                        yaxis: {
                          lines: {
                            show: false,
                          },
                        },
                        xaxis: {
                          lines: {
                            show: true,
                          },
                        },
                      }
                    }}
                    series={[
                      {
                        name: "Total Rewards",
                        data: [clientReportData.farm1RewardsF, clientReportData.farm2RewardsF, clientReportData.farm3RewardsF]
                      },
                    ]}
                    type="bar"
                    height={250}
                />
              </VuiBox>
            </Card>
          </Grid>
          </React.Fragment>
          ):(
            " "
          )}
        </Grid>
      </Main>
  );
}

export default Home;