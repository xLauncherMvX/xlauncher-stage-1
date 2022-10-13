import { useState } from "react";

// react-images-viewer components
import ImgsViewer from "react-images-viewer";

// @mui material components
import Grid from "@mui/material/Grid";

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";

function Zero2InfinityProductImages() {
  const [currentImage, setCurrentImage] = useState("https://x-launcher.com/images/zero2Inf1.png");
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
          { src: "https://x-launcher.com/images/zero2Inf1.png" },          
          { src: "https://x-launcher.com/images/zero2Inf2.png" }, 
          { src: "https://x-launcher.com/images/zero2Inf3.png" }, 
          { src: "https://x-launcher.com/images/zero2Inf4.png" },
          { src: "https://x-launcher.com/images/zero2Inf5.png" },
          { src: "https://x-launcher.com/images/zero2Inf6.png" },
          { src: "https://x-launcher.com/images/zero2Inf7.png" },
          { src: "https://x-launcher.com/images/zero2Inf8.png" },
          { src: "https://x-launcher.com/images/zero2Inf9.png" },
          { src: "https://x-launcher.com/images/zero2Inf10.png" },
          { src: "https://x-launcher.com/images/zero2Inf11.png" },
          { src: "https://x-launcher.com/images/zero2Inf12.png" }
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
              src={"https://x-launcher.com/images/zero2Inf1.png"}
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
              src={"https://x-launcher.com/images/zero2Inf2.png"}
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
              src={"https://x-launcher.com/images/zero2Inf3.png"}
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
              src={"https://x-launcher.com/images/zero2Inf4.png"}
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
              src={"https://x-launcher.com/images/zero2Inf5.png"}
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
              src={"https://x-launcher.com/images/zero2Inf6.png"}
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
              src={"https://x-launcher.com/images/zero2Inf7.png"}
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
              src={"https://x-launcher.com/images/zero2Inf8.png"}
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
          <Grid item xs={4} md={2}>
            <VuiBox
              component="img"
              id={8}
              src={"https://x-launcher.com/images/zero2Inf9.png"}
              alt="small image 9"
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
              id={9}
              src={"https://x-launcher.com/images/zero2Inf10.png"}
              alt="small image 10"
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
              id={10}
              src={"https://x-launcher.com/images/zero2Inf11.png"}
              alt="small image 11"
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
              id={11}
              src={"https://x-launcher.com/images/zero2Inf12.png"}
              alt="small image 12"
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

export default Zero2InfinityProductImages;