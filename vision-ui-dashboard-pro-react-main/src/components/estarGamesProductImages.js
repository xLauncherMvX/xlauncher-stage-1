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

import { useState } from "react";

// react-images-viewer components
import ImgsViewer from "react-images-viewer";

// @mui material components
import Grid from "@mui/material/Grid";

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";

function EstarGamesProductImages() {
  const [currentImage, setCurrentImage] = useState("https://x-launcher.com/images/estar1.jpg");
  const [imgsViewer, setImgsViewer] = useState(false);
  const [imgsViewerCurrent, setImgsViewerCurrent] = useState(0);

  const handleSetCurrentImage = ({ currentTarget }) => {
    setCurrentImage(currentTarget.src);
    setImgsViewerCurrent(Number(currentTarget.id));
  };

  const openImgsViewer = () => setImgsViewer(true);
  const closeImgsViewer = () => setImgsViewer(false);
  const imgsViewerNext = () => setImgsViewerCurrent(imgsViewerCurrent + 1);
  const imgsViewerPrev = () => setImgsViewerCurrent(imgsViewerCurrent - 1);

  return (
    <VuiBox>
      <ImgsViewer
        imgs={[
          { src: "https://x-launcher.com/images/estar1.jpg" },          
          { src: "https://x-launcher.com/images/estar2.jpg" }, 
          { src: "https://x-launcher.com/images/estar3.jpg" }, 
          { src: "https://x-launcher.com/images/estar4.jpg" },
          { src: "https://x-launcher.com/images/estar5.jpg" },
          { src: "https://x-launcher.com/images/estar6.jpg" },
          { src: "https://x-launcher.com/images/estar7.jpg" },
          { src: "https://x-launcher.com/images/estar8.jpg" }
        ]}
        isOpen={imgsViewer}
        onClose={closeImgsViewer}
        currImg={imgsViewerCurrent}
        onClickPrev={imgsViewerPrev}
        onClickNext={imgsViewerNext}
        backdropCloseable
      />

      <VuiBox
        backgroundColor="red !important"
        component="img"
        src={currentImage}
        alt="Product Image"
        borderRadius="xl"
        maxWidth="100%"
        height="unset !important"
        onClick={openImgsViewer}
      />
      <VuiBox mt={2} pt={1}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={4} md={2}>
            <VuiBox
              component="img"
              id={0}
              src={"https://x-launcher.com/images/estar1.jpg"}
              alt="small image 1"
              shadow="md"
              width="100%"
              sx={({ borders: { borderRadius }, breakpoints }) => ({
                cursor: "pointer",
                height: "100%",
                objectFit: "cover",
                borderRadius: borderRadius.md,
                [breakpoints.up("md")]: {
                  borderRadius: borderRadius.lg,
                },
              })}
              onClick={handleSetCurrentImage}
            />
          </Grid>          
          <Grid item xs={4} md={2}>
            <VuiBox
              component="img"
              id={1}
              src={"https://x-launcher.com/images/estar2.jpg"}
              alt="small image 2"
              shadow="md"
              width="100%"
              sx={({ borders: { borderRadius }, breakpoints }) => ({
                cursor: "pointer",
                height: "100%",
                objectFit: "cover",
                borderRadius: borderRadius.md,
                [breakpoints.up("md")]: {
                  borderRadius: borderRadius.lg,
                },
              })}
              onClick={handleSetCurrentImage}
            />
          </Grid>
          <Grid item xs={4} md={2}>
            <VuiBox
              component="img"
              id={2}
              src={"https://x-launcher.com/images/estar3.jpg"}
              alt="small image 3"
              shadow="md"
              width="100%"
              sx={({ borders: { borderRadius }, breakpoints }) => ({
                cursor: "pointer",
                height: "100%",
                objectFit: "cover",
                borderRadius: borderRadius.md,
                [breakpoints.up("md")]: {
                  borderRadius: borderRadius.lg,
                },
              })}
              onClick={handleSetCurrentImage}
            />
          </Grid>
          <Grid item xs={4} md={2}>
            <VuiBox
              component="img"
              id={3}
              src={"https://x-launcher.com/images/estar4.jpg"}
              alt="small image 4"
              shadow="md"
              width="100%"
              sx={({ borders: { borderRadius }, breakpoints }) => ({
                cursor: "pointer",
                height: "100%",
                objectFit: "cover",
                borderRadius: borderRadius.md,
                [breakpoints.up("md")]: {
                  borderRadius: borderRadius.lg,
                },
              })}
              onClick={handleSetCurrentImage}
            />
          </Grid>
          <Grid item xs={4} md={2}>
            <VuiBox
              component="img"
              id={4}
              src={"https://x-launcher.com/images/estar5.jpg"}
              alt="small image 5"
              shadow="md"
              width="100%"
              sx={({ borders: { borderRadius }, breakpoints }) => ({
                cursor: "pointer",
                height: "100%",
                objectFit: "cover",
                borderRadius: borderRadius.md,
                [breakpoints.up("md")]: {
                  borderRadius: borderRadius.lg,
                },
              })}
              onClick={handleSetCurrentImage}
            />
          </Grid>
          <Grid item xs={4} md={2}>
            <VuiBox
              component="img"
              id={5}
              src={"https://x-launcher.com/images/estar6.jpg"}
              alt="small image 6"
              shadow="md"
              width="100%"
              sx={({ borders: { borderRadius }, breakpoints }) => ({
                cursor: "pointer",
                height: "100%",
                objectFit: "cover",
                borderRadius: borderRadius.md,
                [breakpoints.up("md")]: {
                  borderRadius: borderRadius.lg,
                },
              })}
              onClick={handleSetCurrentImage}
            />
          </Grid>
          <Grid item xs={4} md={2}>
            <VuiBox
              component="img"
              id={6}
              src={"https://x-launcher.com/images/estar7.jpg"}
              alt="small image 7"
              shadow="md"
              width="100%"
              sx={({ borders: { borderRadius }, breakpoints }) => ({
                cursor: "pointer",
                height: "100%",
                objectFit: "cover",
                borderRadius: borderRadius.md,
                [breakpoints.up("md")]: {
                  borderRadius: borderRadius.lg,
                },
              })}
              onClick={handleSetCurrentImage}
            />
          </Grid>
          <Grid item xs={4} md={2}>
            <VuiBox
              component="img"
              id={7}
              src={"https://x-launcher.com/images/estar8.jpg"}
              alt="small image 8"
              shadow="md"
              width="100%"
              sx={({ borders: { borderRadius }, breakpoints }) => ({
                cursor: "pointer",
                height: "100%",
                objectFit: "cover",
                borderRadius: borderRadius.md,
                [breakpoints.up("md")]: {
                  borderRadius: borderRadius.lg,
                },
              })}
              onClick={handleSetCurrentImage}
            />
          </Grid>
        </Grid>
      </VuiBox>
    </VuiBox>
  );
}

export default EstarGamesProductImages;