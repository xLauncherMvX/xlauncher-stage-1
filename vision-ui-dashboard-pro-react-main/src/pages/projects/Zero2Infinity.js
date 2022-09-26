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

import Main from "layouts/main";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import profile1 from "assets/images/zero2Infinity.jpeg";

import TimelineList from "examples/Timeline/TimelineList";
import TimelineItem from "examples/Timeline/TimelineItem";

// ProductPage page components
import ProductImages from "components/zero2InfinityProductImages";

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

function List() {
  const { values } = breakpoints;

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null;
  }

  const openInSameTab = (url) => {
    const newWindow = window.open(url, '_self', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null;
  }

  return (    
    <Main >      
      <Grid container spacing={1}>  
        <Grid item xs={12} md={1} xl={2}>
        </Grid>      
        <Grid item xs={12} md={8} xl={8}>
          <Card>
            <VuiBox textAlign="center" mb={3}>
              <VuiTypography color="white" variant="h2">
                05.08.2022
              </VuiTypography>
            </VuiBox>
            <VuiBox
              component="img"
              src={profile1}
              mb="8px"
              borderRadius="15px"  
              width="100%"
              height="100%"            
            />            
            <VuiBox display="flex" justifyContent="center" mt={1} mb={3}>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("https://www.zero2infinity.space/")}>          
                <WebsiteIcon fontSize="small" />
              </IconButton>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("https://www.linkedin.com/company/zero2infinity/")}>          
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("https://twitter.com/zero2infinity")}>          
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("https://www.facebook.com/zero2infinity")}>          
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("https://www.instagram.com/zero2infinity.space")}>          
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("https://t.me/Zero2Infinity_Community")}>          
                <TelegramIcon fontSize="small" />
              </IconButton>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("https://x-launcher.com/files/Zero2InfinityWhitepaper.pdf")}>          
                <FileIcon fontSize="small" />
              </IconButton>
            </VuiBox>
            
            <VuiBox mt={3} ml="-15px">
                <TimelineItem
                  title="SPACE TRANSPORTATION"             
                  description="Zero 2 Infinity is a Zero Emissions space transportation company. It’s arguably the first 
                  NewSpace company in continental Europe. With the mission to facilitate access to Space for all, 
                  Z2I has developed unique Lighter-Than-Air solutions that meet the challenges of the 21st Century."                   
                  lastItem               
                />
                <TimelineItem
                  title="ELEVATE"           
                  description="Elevate is a stratospheric transportation service, offered by Zero 2 Infinity. 
                  By leveraging high altitude balloons, ELEVATE covers from launch to recovery to bring you equipment 
                  above 90% of the atmosphere."    
                  lastItem                             
                />
                <TimelineItem
                  title="BLOON"               
                  description="Z2I was the first organisation to propose a balloon flight to Near-Space as a commercial 
                  enterprise. In a 2002 paper, Jose outlined the feasibility of such a project which has resulted in the 
                  development of bloon.
                  Bloon exists to unlock the huge potential of space tourism in a safe, affordable and clean way."
                  lastItem
                />
                <TimelineItem
                  title="BLOOSTAR"               
                  description="Bloostar places your satellite in the orbit you want. We ensure you are ready to launch 
                  by testing your satellite in Near Space."  
                  lastItem
                />                
            </VuiBox>      
            <VuiBox align="center" textAlign="center">
              <ProductImages />
            </VuiBox>
          </Card>
        </Grid>      
      </Grid>
    </Main>
  );
}

export default List;
