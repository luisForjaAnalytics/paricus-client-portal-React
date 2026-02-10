import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
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
      background: colors.surfaceHighest,
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
      color: colors.primary,
      transform: "scale(0.7)",
    },
    "& .swiper-pagination-bullet-active": {
      backgroundColor: colors.primary,
    },
  },
};

export const SwiperView = ({ images = [] }) => {
  const { t } = useTranslation();

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
          >
            {images.map((image, index) => (
              <SwiperSlide key={`slide-${index}`}>
                {image ? (
                  <img src={image.previewUrl} alt={image.name} />
                ) : (
                  <Typography
                    variant="h6"
                    sx={{ color: colors.textMuted, userSelect: "none" }}
                  >
                    {t("swiperControl.slide", { number: index + 1 })}
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
