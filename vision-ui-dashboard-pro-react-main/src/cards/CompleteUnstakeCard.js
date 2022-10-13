import React, { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";

import { ReactComponent as XLauncherLogo } from "assets/images/logo.svg";
import "assets/custom.css";

function CompleteUnstakeCard({title, lockedTime, claimUnstake, methodCU, claimUnstakedAmount, claimUnstakedEntry}) 
{  
  return (
    <Card>
      <VuiBox>     
        <VuiBox display="flex" mb="12px" alignItems="center">
          <Tooltip key="logo" title="XLH" placement="bottom">
            <XLauncherLogo className='xlh-logo-stake'/>
          </Tooltip>
          <VuiBox ml="16px" display="flex" flexDirection="column" lineHeight={0}>
            <VuiTypography
              fontSize={16}
              fontWeight="medium"
              color="white"
              textTransform="capitalize"
            >
              {title}
            </VuiTypography>
            <VuiTypography
                variant="caption"
                fontWeight="regular"
                color="text"
                textTransform="capitalize"
              >
                {lockedTime}
            </VuiTypography>
          </VuiBox>
        </VuiBox>     
        <VuiBox display="flex" justifyContent="space-between" alignItems="center">
          <VuiTypography component="span" fontSize={14} fontWeight="regular" color="text">
            My Unstaked XLH:
          </VuiTypography>
          <VuiTypography fontSize={14} fontWeight="regular" color="white">
            {claimUnstakedAmount}
          </VuiTypography>
        </VuiBox>
        <VuiBox display="flex" justifyContent="space-between" alignItems="center">
          <VuiTypography component="span" fontSize={14} fontWeight="regular" color="text">
            Unlocking Date:
          </VuiTypography>
          <VuiTypography fontSize={14} fontWeight="regular" color="white">
            {claimUnstakedEntry}
          </VuiTypography>
        </VuiBox>    
        <Divider light /> 
        <Grid item xs={12} md={12} lg={12}>              
          <VuiButton
            color={claimUnstake.color}
            size={claimUnstake.size}
            sx={{ minWidth: "90px" }}
            onClick={methodCU}
            fullWidth
            disabled={claimUnstake.disabled}
          >
            {claimUnstake.label}
          </VuiButton>              
        </Grid>
      </VuiBox>
    </Card>
  );
}

export default CompleteUnstakeCard;
