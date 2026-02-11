import { Box, Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { SwiperView } from "../../../../common/components/ui/Swiper/SwiperView";
import { useGetCarouselImagesQuery } from "../../../../store/api/carouselApi";
import { getAttachmentUrl } from "../../../../common/utils/getAttachmentUrl";
import { colors } from "../../../../common/styles/styles";

export const DashboardSwiperView = () => {
  const { selectedClientId = null } = useOutletContext() || {};
  const { t } = useTranslation();

  const permissions = useSelector((state) => state.auth?.permissions);
  const token = useSelector((state) => state.auth?.token);
  const user = useSelector((state) => state.auth?.user);
  const isBPOAdmin = permissions?.includes("admin_clients") ?? false;

  const carouselClientId = isBPOAdmin
    ? selectedClientId || undefined
    : user?.clientId;
  const { data: carouselImages = [] } =
    useGetCarouselImagesQuery(carouselClientId);
  const hasCarouselImages = carouselImages.length > 0;

  const swiperImages = Array.from({ length: 4 }, (_, i) => {
    const img = carouselImages.find((c) => c.slotIndex === i);
    if (!img) return null;
    return { previewUrl: getAttachmentUrl(img, token), name: img.fileName };
  }).filter(Boolean);

  if (!hasCarouselImages) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <Typography variant="h6" sx={{ color: colors.textMuted }}>
          {t("swiperControl.noImages", "No images available")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 3, md: 0 }, pt: { xs: 3, md: 3 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
          height: { xs: "40vh", md: "32vh" },
        }}
      >
        <SwiperView images={swiperImages} />
      </Box>
    </Box>
  );
};
