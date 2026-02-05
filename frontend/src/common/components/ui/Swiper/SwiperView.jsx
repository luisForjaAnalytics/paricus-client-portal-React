import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { dashboardStyles, colors } from "../../../styles/styles";

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
      position: "relative",
      overflow: "hidden",
    },
    "& .swiper-slide img": {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
    "& .swiper-button-next, & .swiper-button-prev": {
      color: "#1976d2",
      transform: "scale(0.7)",
    },
    "& .swiper-pagination-bullet-active": {
      backgroundColor: "#1976d2",
    },
  },
};

export const SwiperView = ({ images = [], onRemove }) => {
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

  const hasImages = images.some(Boolean);

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
        <Box sx={{ ...swiperStyles.container, flex: 1, minHeight: 0 }}>
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={
              hasImages
                ? { delay: 3000, disableOnInteraction: false }
                : false
            }
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            onAutoplayTimeLeft={onAutoplayTimeLeft}
          >
            {images.map((image, index) => (
              <SwiperSlide key={`slide-${index}`}>
                {image ? (
                  <>
                    <img src={image.previewUrl} alt={image.name} />
                    {onRemove && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(index);
                        }}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          zIndex: 10,
                          backgroundColor: "rgba(0,0,0,0.5)",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.7)",
                          },
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    )}
                  </>
                ) : (
                  <Typography
                    variant="h6"
                    sx={{ color: colors.textMuted, userSelect: "none" }}
                  >
                    Slide {index + 1}
                  </Typography>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </CardContent>
    </Card>
  );
};
