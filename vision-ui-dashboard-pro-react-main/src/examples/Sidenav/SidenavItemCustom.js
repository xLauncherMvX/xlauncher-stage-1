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

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";

// Custom styles for the SidenavItem
import { item, itemContent, itemArrow } from "examples/Sidenav/styles/sidenavItem";
import "assets/custom.css";

// Vision UI Dashboard PRO React contexts
import { useVisionUIController } from "context";
import {collapseIcon, collapseIconBox, collapseItem, collapseText} from "./styles/sidenavCollapse";
import ListItemIcon from "@mui/material/ListItemIcon";

function SidenavItemCustom({ color, name, icon, active, nested, children, open, ...rest }) {
  const [controller] = useVisionUIController();
  const { miniSidenav, transparentSidenav } = controller;

  return (
    <>
      <VuiBox {...rest} sx={(theme) => collapseItem(theme, { active, transparentSidenav })}>
        <ListItemIcon
            sx={(theme) => collapseIconBox(theme, { active, transparentSidenav, color })}
        >
          {typeof icon === "string" ? (
              <Icon sx={(theme) => collapseIcon(theme, { active })}>{icon}</Icon>
          ) : (
              icon
          )}
        </ListItemIcon>
        <ListItemText
            primary={name}
            sx={(theme) => collapseText(theme, { miniSidenav, transparentSidenav, active })}
        />
      </VuiBox>
    </>
  );
}

// Setting default values for the props of SidenavItem
SidenavItemCustom.defaultProps = {
  active: false,
  nested: false,
  children: false,
  open: false,
};

// Typechecking props for the SidenavItem
SidenavItemCustom.propTypes = {
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
  nested: PropTypes.bool,
  children: PropTypes.node,
  open: PropTypes.bool,
};

export default SidenavItemCustom;
