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
import DefaultProjectCard from "cards/DefaultProjectCard";
import profile1 from "assets/images/zero2InfinityMini.jpeg";
import profile2 from "assets/images/estarGamesMini.png";

//Team Pictures
import andrei from "assets/images/team/andrei.jpg";
import bogdan from "assets/images/team/bogdan.jpg";
import cosmin from "assets/images/team/cosmin.jpg";
import ionut from "assets/images/team/ionut.jpg";
import radu from "assets/images/team/radu.jpg";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WebsiteIcon from "@mui/icons-material/Public";
import IconButton from "@mui/material/IconButton";

const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null;
}

function Team() {
    const { values } = breakpoints;

    return (
        <Main name="Team">
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4} align={"center"}>
                    <VuiBox
                        component="img"
                        src={andrei}
                        mb="8px"
                        borderRadius="15px"
                        width="60%"
                        height="58%"
                    />
                    <VuiTypography variant="h2" fontWeight="bold" color="light">
                        Andrei Necula
                    </VuiTypography>
                    <VuiTypography variant="h5" fontWeight="bold" color="light">
                        Co-Founder, Community Manager
                    </VuiTypography>
                    <VuiTypography>
                        &nbsp;
                    </VuiTypography>
                    <VuiTypography>
                        &nbsp;
                    </VuiTypography>
                </Grid>
                <Grid item xs={12} md={6} lg={4} align={"center"}>
                    <VuiBox
                        component="img"
                        src={cosmin}
                        mb="8px"
                        borderRadius="15px"
                        width="60%"
                        height="58%"
                    />
                    <VuiTypography variant="h2" fontWeight="bold" color="light">
                        Cosmin Radu
                    </VuiTypography>
                    <VuiTypography variant="h5" fontWeight="bold" color="light">
                        Co-Founder, Partnerships Manager
                    </VuiTypography>
                    <VuiTypography>
                        &nbsp;
                    </VuiTypography>
                    <VuiTypography>
                        &nbsp;
                    </VuiTypography>
                </Grid>
                <Grid item xs={12} md={6} lg={4} align={"center"}>
                    <VuiBox
                        component="img"
                        src={ionut}
                        mb="8px"
                        borderRadius="15px"
                        width="58%"
                        height="58%"
                    />
                    <VuiTypography variant="h2" fontWeight="bold" color="light">
                        Ionut Cioarec
                    </VuiTypography>
                    <VuiTypography variant="h5" fontWeight="bold" color="light">
                        Co-Founder, IT Engineer, Frontend Dev
                    </VuiTypography>
                    <IconButton color="white" onClick={()=> openInNewTab("https://ro.linkedin.com/in/ionut-cioarec-8b859398")}>
                        <LinkedInIcon fontSize="large" />
                    </IconButton>
                </Grid>
                <Grid item xs={12} md={6} lg={4} align={"center"}>
                    <VuiBox
                        component="img"
                        src={bogdan}
                        mb="8px"
                        borderRadius="15px"
                        width="60%"
                        height="58%"
                    />
                    <VuiTypography variant="h2" fontWeight="bold" color="light">
                        Marian Oloeriu
                    </VuiTypography>
                    <VuiTypography variant="h5" fontWeight="bold" color="light">
                        Co-Founder, Web3 Developer
                    </VuiTypography>
                    <IconButton color="white" onClick={()=> openInNewTab("https://be.linkedin.com/in/bogdan-oloeriu")}>
                        <LinkedInIcon fontSize="large" />
                    </IconButton>
                </Grid>
                <Grid item xs={12} md={6} lg={4} align={"center"}>
                    <VuiBox
                        component="img"
                        src={radu}
                        mb="8px"
                        borderRadius="15px"
                        width="60%"
                        height="58%"
                    />
                    <VuiTypography variant="h2" fontWeight="bold" color="light">
                        Vasile Radu
                    </VuiTypography>
                    <VuiTypography variant="h5" fontWeight="bold" color="light">
                        Advisor, CEO ARC Stake
                    </VuiTypography>
                    <IconButton color="white" onClick={()=> openInNewTab("https://arcstake.com/")}>
                        <WebsiteIcon fontSize="large" />
                    </IconButton>
                </Grid>
            </Grid>
        </Main>
    );
}

export default Team;