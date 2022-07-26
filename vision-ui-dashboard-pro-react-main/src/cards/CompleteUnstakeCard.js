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

import React, { useState, useEffect } from "react";

// react-router components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Icon from '@mui/material/Icon';
import { Scrollbars } from "react-custom-scrollbars";

// Scrollbar configs
import {
  renderThumb,
  renderTrack,
  renderView
} from "examples/Scrollbar";

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import VuiInput from "components/VuiInput";

import { ReactComponent as XLauncherLogo } from "assets/images/logo.svg";
import "assets/custom.css";
import { IoHome } from "react-icons/io5";

import { faAnglesDown } from '@fortawesome/free-solid-svg-icons/faAnglesDown';
import { faAnglesUp } from '@fortawesome/free-solid-svg-icons/faAnglesUp';
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  boxShadow: 5,
  bgcolor: '#060b28f0',
  borderRadius: "25px",
  p: 4
};

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
