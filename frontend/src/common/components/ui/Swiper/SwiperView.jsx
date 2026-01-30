import React, { useRef } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Box, Card, CardContent } from "@mui/material";
import { dashboardStyles } from "../../../styles/styles";

// Swiper styles
const swiperStyles = {
  container: {
    width: "100%",
    height: "100%",
    "& .swiper": {
      width: "100%",
      height: "100%",
      borderRadius: "0.5rem",
    },
    "& .swiper-slide": {
      textAlign: "center",
      fontSize: "18px",
      background: "#f5f5f5",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "0.5rem",
    },
    "& .swiper-slide img": {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    "& .swiper-button-next, & .swiper-button-prev": {
      color: "#1976d2",
      transform: "scale(0.7)",
    },
    "& .swiper-pagination-bullet-active": {
      backgroundColor: "#1976d2",
    },
  },
  autoplayProgress: {
    position: "absolute",
    right: 16,
    bottom: 16,
    zIndex: 10,
    width: 48,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "#1976d2",
    "& svg": {
      position: "absolute",
      left: 0,
      top: 0,
      zIndex: 10,
      width: "100%",
      height: "100%",
      strokeWidth: "4px",
      stroke: "#1976d2",
      fill: "none",
      strokeDasharray: 125.6,
      transform: "rotate(-90deg)",
    },
  },
};

export const SwiperView = () => {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);

  const onAutoplayTimeLeft = (s, time, progress) => {
    if (progressCircle.current) {
      progressCircle.current.style.strokeDashoffset = `${125.6 * (1 - progress)}px`;
    }
    if (progressContent.current) {
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  return (
    <Card sx={dashboardStyles.dashboardStatsCard}>
      <CardContent
        sx={{
          padding: "1rem",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 1,
          }}
        ></Box>

        {/* Swiper Container */}
        <Box sx={{ ...swiperStyles.container, flex: 1, minHeight: 0 }}>
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            // pagination={{
            //   clickable: true,
            // }}
            // navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            onAutoplayTimeLeft={onAutoplayTimeLeft}
          >
            <SwiperSlide>Slide 1</SwiperSlide>
            <SwiperSlide>Slide 2</SwiperSlide>
            <SwiperSlide>Slide 3</SwiperSlide>
            <SwiperSlide>Slide 4</SwiperSlide>
            <SwiperSlide>Slide 5</SwiperSlide>
            <SwiperSlide>Slide 6</SwiperSlide>
            <SwiperSlide>Slide 7</SwiperSlide>
            <SwiperSlide>Slide 8</SwiperSlide>
            <SwiperSlide>Slide 9</SwiperSlide>
            {/* <Box slot="container-end" sx={swiperStyles.autoplayProgress}>
              <svg viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" ref={progressCircle} />
              </svg>
              <span ref={progressContent}></span>
            </Box> */}
          </Swiper>
        </Box>
      </CardContent>
    </Card>
  );
};
