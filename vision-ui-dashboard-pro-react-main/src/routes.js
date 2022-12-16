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
import EstarGamesSale from "pages/presale/estarGames";
import Team from "pages/miscellaneous/team";

// React icons
import { IoDocument } from "react-icons/io5";
import { IoBuild } from "react-icons/io5";
import { IoDocuments } from "react-icons/io5";
import { FaShoppingCart, FaPiedPiperPp } from "react-icons/fa";
import { IoHome, IoServer, IoCart, IoArrowUndo } from "react-icons/io5";
import {AiFillFileAdd} from "react-icons/all";
import {FaFileAlt} from "react-icons/fa";
import {IoRocketSharp} from "react-icons/io5";


const routes = [
  //Home
  {
    //type: "collapse",
    name: "Home",
    key: "dashboard",
    icon: <IoHome size="15px" color="inherit" />,
    collapse: [
      {
        name: "Dashboard",
        key: "dashboard",
        route: "/dashboard",
        component: Home
      }
    ]
  },
  {
    type: "customInternal",
    name: "Dashboard",
    key: "dashboard",
    icon: <IoHome size="15px" color="inherit" />,
    href: "/dashboard"
  },

  //Staking
  {
    //type: "collapse",
    name: "Staking",
    key: "staking",
    icon: <IoServer size="15px" color="inherit" />,
    collapse: [
      {
        name: "Farms",
        key: "staking",
        route: "/staking",
        component: Staking
      }
    ]
  },
  {
    type: "customInternal",
    name: "Staking",
    key: "staking",
    icon: <IoServer size="15px" color="inherit" />,
    href: "/staking",
  },

  //Projects
  {
    //type: "collapse",
    name: "Projects",
    key: "projects",
    icon: <FaPiedPiperPp size="15px" color="inherit" />,
    collapse: [
      {
        name: "List",
        key: "list",
        route: "/projects",
        component: Projects
      }
    ]
  },
  {
    type: "customInternal",
    name: "Projects",
    key: "projects",
    icon: <FaPiedPiperPp size="15px" color="inherit" />,
    href: "/projects"
  },

  //NFT Mint
  {
    type: "customExternal",
    name: "Mint NFTS",
    key: "nftMint",
    icon: <IoRocketSharp size="15px" color="inherit" />,
    href: "https://www.frameit.gg/marketplace/XLHO-5135c9/items"
  },

  //Apply to us
  {
    type: "customExternal",
    name: "Apply to Us",
    key: "apply",
    icon: <FaFileAlt size="15px" color="inherit" />,
    href: "https://forms.gle/XdiY6kTF2fNUcxZy8"
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
    //type: "collapse",
    name: "Presales",
    key: "presale",
    icon: <IoCart size="15px" color="inherit" />,
    collapse: [
      // {
      //   name: "EstarGames",
      //   key: "estarGames",
      //   route: "/presale/estarGames",
      //   component: EstarGamesSale
      // }
      // {
      //   name: "XLauncher",
      //   key: "presale",
      //   route: "/presale/xlh",
      //   component: XLH
      // },
      // {
      //   name: "Zero2Infinity",
      //   key: "presalez2i",
      //   route: "/presale/z2i",
      //   component: Z2I
      // }
    ]
  },

  //Public Sales Pages
  // {
  //   type: "collapse",
  //   name: "Public Sales",
  //   key: "publicSales",
  //   icon: <IoCart size="15px" color="inherit" />,
  //   collapse: [
  //     {
  //       name: "Zero2Infinity",
  //       key: "publicSaleZ2I",
  //       route: "/publicSale/z2iPublic",
  //       component: Z2IPublic
  //     }
  //   ]
  // },

  //Refunds Pages
  // {
  //   type: "collapse",
  //   name: "Refunds",
  //   key: "refunds",
  //   icon: <IoArrowUndo size="15px" color="inherit" />,
  //   collapse: [
  //     {
  //       name: "Zero2Infinity",
  //       key: "refundsZ2I",
  //       route: "/refunds/z2iRefund",
  //       component: Z2IRefund
  //     }
  //   ]
  // },

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

  //Miscellaneous Pages
  {
    name: "Others",
    key: "others",
    icon: <IoHome size="15px" color="inherit" />,
    collapse: [
      {
        name: "Team",
        key: "team",
        route: "/team",
        component: Team
      }
    ]
  },
];

export default routes;
