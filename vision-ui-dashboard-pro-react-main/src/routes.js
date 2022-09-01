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

/** 
  All of the routes for the Vision UI Dashboard PRO React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Vision UI Dashboard PRO React layouts
import Default from "layouts/dashboards/default";
import CRM from "layouts/dashboards/crm";
import ProfileOverview from "layouts/pages/profile/profile-overview";
import Teams from "layouts/pages/profile/teams";
import AllProjects from "layouts/pages/profile/all-projects";
import Reports from "layouts/pages/users/reports";
import NewUser from "layouts/pages/users/new-user";
import Settings from "layouts/pages/account/settings";
import Billing from "layouts/pages/account/billing";
import Invoice from "layouts/pages/account/invoice";
import General from "layouts/pages/projects/general";
import Timeline from "layouts/pages/projects/timeline";
import Widgets from "layouts/pages/widgets";
import Charts from "layouts/pages/charts";
import Alerts from "layouts/pages/alerts";
import PricingPage from "layouts/pages/pricing-page";
import RTL from "layouts/pages/rtl";
import Kanban from "layouts/applications/kanban";
import Wizard from "layouts/applications/wizard";
import DataTables from "layouts/applications/data-tables";
import Calendar from "layouts/applications/calendar";
import NewProduct from "layouts/ecommerce/products/new-product";
import EditProduct from "layouts/ecommerce/products/edit-product";
import ProductPage from "layouts/ecommerce/products/product-page";
import OrderList from "layouts/ecommerce/orders/order-list";
import OrderDetails from "layouts/ecommerce/orders/order-details";
import SignInBasic from "layouts/authentication/sign-in/basic";
import SignInCover from "layouts/authentication/sign-in/cover";
import SignInIllustration from "layouts/authentication/sign-in/illustration";
import SignUpBasic from "layouts/authentication/sign-up/basic";
import SignUpCover from "layouts/authentication/sign-up/cover";
import SignUpIllustration from "layouts/authentication/sign-up/illustration";
import Home from "pages/dashboards/home";
import Zero2Infinity from "pages/projects/Zero2Infinity";
import Staking from "pages/staking/farms";
import Projects from "pages/projects/list";
import Finished from "pages/miscellaneous/finished";
import XLH from "pages/presale/xlh";
import Z2I from "pages/presale/z2i";
import Z2IPublic from "pages/publicSale/z2iPublic";
import Z2IRefund from "pages/refunds/z2iRefund";
import EstarGames from "pages/projects/EstarGames";

// React icons
import { IoDocument } from "react-icons/io5";
import { IoBuild } from "react-icons/io5";
import { IoDocuments } from "react-icons/io5";
import { FaShoppingCart, FaPiedPiperPp } from "react-icons/fa";
import { IoHome, IoServer, IoCart, IoArrowUndo } from "react-icons/io5";

const routes = [
  {
    //type: "collapse",
    name: "Home",
    key: "dashboards",
    icon: <IoHome size="15px" color="inherit" />,
    collapse: [
      {
        name: "Dashboard",
        key: "dashboards",
        route: "/dashboards/home",
        component: Home
      }
    ]
  },
  {
    type: "collapse",
    name: "Staking",
    key: "staking",
    icon: <IoServer size="15px" color="inherit" />,
    collapse: [
      {
        name: "Farms",
        key: "farms",
        route: "/staking/farms",
        component: Staking
      }
    ]
  },
  {
    type: "collapse",
    name: "Projects",
    key: "projects",
    icon: <FaPiedPiperPp size="15px" color="inherit" />,
    collapse: [
      {
        name: "List",
        key: "list",
        route: "/projects/list",
        component: Projects
      }
    ]
  },
  {
    // type: "collapse",
    name: "Miscellaneous",
    key: "miscellaneous",
    icon: <IoHome size="15px" color="inherit" />,
    collapse: [
      {
        name: "Finished",
        key: "miscellaneous",
        route: "/miscellaneous/finished",
        component: Finished
      }
    ]
  },

  //Presale Pages
  {
    type: "collapse",
    name: "Presales",
    key: "presale",
    icon: <IoCart size="15px" color="inherit" />,
    collapse: [
      {
        name: "XLauncher",
        key: "presale",
        route: "/presale/xlh",
        component: XLH
      },
      {
        name: "Zero2Infinity",
        key: "presalez2i",
        route: "/presale/z2i",
        component: Z2I
      }
    ]
  },

  //Public Sales Pages
  {
    type: "collapse",
    name: "Public Sales",
    key: "publicSales",
    icon: <IoCart size="15px" color="inherit" />,
    collapse: [
      {
        name: "Zero2Infinity",
        key: "publicSaleZ2I",
        route: "/publicSale/z2iPublic",
        component: Z2IPublic
      }
    ]
  },

  //Refunds Pages
  {
    type: "collapse",
    name: "Refunds",
    key: "refunds",
    icon: <IoArrowUndo size="15px" color="inherit" />,
    collapse: [      
      {
        name: "Zero2Infinity",
        key: "refundsZ2I",
        route: "/refunds/z2iRefund",
        component: Z2IRefund
      }
    ]
  },

  //Project Pages
  {
    name: "Lista Proiecte",
    key: "projects",
    icon: <IoHome size="15px" color="inherit" />,
    collapse: [
      {
        name: "Zero2Infinity",
        key: "projects1",
        route: "/projects/Zero2Infinity",
        component: Zero2Infinity
      },
      {
        name: "EstarGames",
        key: "projects2",
        route: "/projects/EstarGames",
        component: EstarGames
      }
    ]
  },
];

export default routes;
