// @mui material components
import Grid from "@mui/material/Grid";
import breakpoints from "assets/theme/base/breakpoints";

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

import Main from "layouts/main";

//Team Pictures
import andrei from "assets/images/team/andrei.jpg";
import bogdan from "assets/images/team/bogdan.jpg";
import cosmin from "assets/images/team/cosmin.jpg";
import ionut from "assets/images/team/ionut.jpg";
import radu from "assets/images/team/radu.jpg";
import arcStake from "assets/images/partners/arc_stake.jpeg";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WebsiteIcon from "@mui/icons-material/Public";
import IconButton from "@mui/material/IconButton";
import React from "react";

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
            <Grid container spacing={3}  mt={3}>
                <Grid item xs={12} lg={12}>
                    <VuiTypography
                        variant={window.innerWidth < values.sm ? "h3" : "h2"}
                        textTransform="capitalize"
                        fontWeight="bold"
                        color="white"
                    >
                        Partners
                    </VuiTypography>
                </Grid>
                <Grid item xs={12} md={4} lg={4} align={"center"} mt={4} alignItems={"center"}>
                    <VuiBox
                        component="img"
                        src={arcStake}
                        mb="8px"
                        borderRadius="15px"
                        width="250px"
                        height="100px"
                    />
                    <VuiTypography variant="h4" fontWeight="bold" color="light">
                        ARC Stake
                    </VuiTypography>
                </Grid>
            </Grid>
        </Main>
    );
}

export default Team;