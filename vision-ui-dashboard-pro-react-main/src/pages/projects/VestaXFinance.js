// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import breakpoints from "assets/theme/base/breakpoints";
// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

import Main from "layouts/main";
import profile1 from "assets/images/vestaXFinances.png";
import TimelineItem from "examples/Timeline/TimelineItem";
import {IoLogoDiscord} from "react-icons/all";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import IconButton from '@mui/material/IconButton';
import WebsiteIcon from '@mui/icons-material/Link';
import FileIcon from '@mui/icons-material/PictureAsPdf';
import TelegramIcon from '@mui/icons-material/Telegram';
import YoutubeIcon from "@mui/icons-material/YouTube";
import CollectionsIcon from '@mui/icons-material/Collections';
import {useEffect, useState} from "react";

import { DappUI, logout, useGetAccountInfo, useGetPendingTransactions } from '@elrondnetwork/dapp-core';

function VestaXFinance() {
  const { values } = breakpoints;
  const { address, account } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null;
  }

  const openInSameTab = (url) => {
    const newWindow = window.open(url, '_self', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null;
  }

  const [whitelistData, setWhitelistData] = useState(null);
  const getWhitelistData=()=>{
    fetch('whitelist.json'
        ,{
          headers : {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        .then(function(response){
          //console.log(response);
          return response.json();
        })
        .then(function(myJson) {
          //console.log(myJson);
          setWhitelistData(myJson);
        });
  }

  var whitelistVar = [];
  if(!whitelistData){
    whitelistVar.addresses = [];
  }else{
    whitelistVar = whitelistData;
  }

  var whitelistSwitcher = false;
  var kycStatus = "Not Verified";
  if(isLoggedIn){
    whitelistVar.addresses.map(name => {
      console.log("name " + name);
      if(name == address){
        whitelistSwitcher = true;
        kycStatus = "Verified";
      }
    })
  }
  var title = "KYC - " + kycStatus;

  useEffect(() => {
    if(isLoggedIn) {
      getWhitelistData();
    }
  }, []);

  const MINUTE_MS = 5000;
  useEffect(() => {
    if(isLoggedIn) {
      const interval = window.setInterval(() => {
        getWhitelistData();
      }, MINUTE_MS);

      return () => window.clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }
  }, []);

  return (    
    <Main name="">
      <Grid container spacing={1}>  
        <Grid item xs={12} md={1} xl={2}>
        </Grid>      
        <Grid item xs={12} md={8} xl={8}>
          <Card>
            <VuiBox textAlign="center" mb={3}>
              <VuiTypography color="white" variant="h2">
                20.01.2023
              </VuiTypography>
            </VuiBox>
            <VuiBox
              component="img"
              src={profile1}
              mb="8px"
              borderRadius="15px"
              width="100%"
              display="inherit"
              sx={{backgroundAttachment: "initial"}}
            />
            <VuiBox display="flex" justifyContent="center" mt={1} mb={3}>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("https://vestax.finance/")}>
                <WebsiteIcon fontSize="small" />
              </IconButton>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("https://vegld.vestax.finance/")}>
                <CollectionsIcon fontSize="small"/>
              </IconButton>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("https://twitter.com/DemiourgosH")}>
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("https://t.me/demiourgosRomania")}>
                <TelegramIcon fontSize="small" />
              </IconButton>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("http://vestax.finance/VestaXFinance_whitepaper.pdf")}>
                <FileIcon fontSize="small" />
              </IconButton>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("https://www.youtube.com/c/CarpathianPictures")}>
                <YoutubeIcon fontSize="small" />
              </IconButton>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("https://discord.gg/GKKAmPKKNe")}>
                <IoLogoDiscord />
              </IconButton>
            </VuiBox>
            
            <VuiBox mt={3} ml="-15px">
              <TimelineItem
                  title={title}
                  description="To participate in the pre-sale rounds, you will need to complete a kyc process (if you have already done KYC through XLauncher, you don't have to do it through VestaX again)."
                  lastItem
                  action={{
                    route: "https://demiourgos.synaps.me/signup",
                    label: "Click here to start the VestaX KYC process",
                  }}
              />
              <TimelineItem
                  title="COMPANY"
                  description="SC DEMIOURGOS HOLDINGS SA is a company with shareholders in Bucharest, Romania.
                  Own Coding Division is the first blockchain coding company funded and owned by NFT owners on the Elrond Blockchain."
                  lastItem
              />
                <TimelineItem
                  title="INTRODUCTION"
                  description="VestaX.Finance is a community driven liquid staking DEFI service provider for MultiverseX. VestaX.Finance
                  allows users to stake the native EGLD token and earn staking rewards without locking assets. Staking through VestaX.Finance
                  will allow users to unlock the staked EGLD tokens, making them a spendable asset."
                  lastItem               
                />
                <TimelineItem
                  title="LIQUID-INDEX"
                  description="Staked EGLD represents a locked asset, which can be unlocked through VestaX.Finance. Users staking EGLD via VestaX.Finance
                  get consumable vEGLD according to vEGLD/EGLD ratio in Liquid-Staking SC, called Liquid-Index."
                  lastItem
                />
                <TimelineItem
                  title="SERVICES"
                  description="
                    Having a free and liquid asset to use anytime without loosing EGLD staking rewards, will unlock an unprecedented amount of liquidity for users,
                    further empowering the MultiverseX economy. This will be a range of services from providing DEX Aggregator services, to minting synthetic stable coins, etc.
                    (e.g. minting synthetic stable coins via vEGLD staking).
                  "
                  lastItem
                />
                <TimelineItem
                  title="GOALS"
                  description="VestaX.Finance aims to enable users to make more efficient use of their capital by rewarding them with liquid EGLD
                  (vEGLD), when staking for the MultiverseX Protocol without losing staking rewards (which are included in Liquid-Index).
                  VestaX.Finance gives users more freedom and flexibility for their funds rather than manually staking with Stake Providers."
                  lastItem
                />                
            </VuiBox>
          </Card>
        </Grid>      
      </Grid>
    </Main>
  );
}

export default VestaXFinance;
