import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { AddPhotoAlternate, Image, Save } from "@mui/icons-material";
import { SwiperView } from "../../../common/components/ui/Swiper/SwiperView";
import { useTranslation } from "react-i18next";
import { useState, useCallback, useRef } from "react";
import { colors, primaryIconButton } from "../../../common/styles/styles";
import { useSaveCarouselImagesMutation } from "../../../store/api/carouselApi";
import { useNotification } from "../../../common/hooks";
import { AlertInline } from "../../../common/components/ui/AlertInline";
import { extractApiError } from "../../../common/utils/apiHelpers";

const MAX_IMAGES = 4;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const SwiperControl = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState(Array(MAX_IMAGES).fill(null));
  const fileInputRefs = useRef([]);

  const [saveCarouselImages, { isLoading: saving }] =
    useSaveCarouselImagesMutation();
  const { notificationRef, showSuccess, showError } = useNotification();

  const validateFile = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return t(
        "swiperControl.invalidType",
        "Only image files are allowed (JPG, PNG, GIF, WEBP)",
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return t("swiperControl.fileTooLarge", "File exceeds the 5MB limit");
    }
    return null;
  };

  const handleFileSelect = useCallback(
    (slotIndex) => (event) => {
      try {
        const file = event.target.files?.[0];
        if (!file) return;

        const error = validateFile(file);
        if (error) {
          console.warn(`Skipped "${file.name}": ${error}`);
          return;
        }

        const previewUrl = URL.createObjectURL(file);

        setImages((prev) => {
          const updated = [...prev];
          if (updated[slotIndex]?.previewUrl) {
            URL.revokeObjectURL(updated[slotIndex].previewUrl);
          }
          updated[slotIndex] = { file, previewUrl, name: file.name };
          return updated;
        });
      } catch (err) {
        console.error("Error processing image:", err);
      } finally {
        if (fileInputRefs.current[slotIndex]) {
          fileInputRefs.current[slotIndex].value = "";
        }
      }
    },
    [t],
  );

  const handleRemoveImage = useCallback((index) => {
    setImages((prev) => {
      const updated = [...prev];
      if (updated[index]?.previewUrl) {
        URL.revokeObjectURL(updated[index].previewUrl);
      }
      updated[index] = null;
      return updated;
    });
  }, []);

  const handleSubmit = async () => {
    const filledSlots = images
      .map((img, index) => (img ? { img, index } : null))
      .filter(Boolean);

    if (filledSlots.length === 0) {
      showError(
        t("swiperControl.noImages", "Please add at least one image before saving"),
      );
      return;
    }

    try {
      const formData = new FormData();
      for (const { img, index } of filledSlots) {
        formData.append("images", img.file);
        formData.append("slotIndices", index);
      }

      await saveCarouselImages(formData).unwrap();
      showSuccess(
        t("swiperControl.saveSuccess", "Carousel images saved successfully"),
      );
    } catch (err) {
      console.error("Error saving carousel images:", err);
      showError(
        extractApiError(err, t("swiperControl.saveError", "Error saving images")),
      );
    }
  };

  const filledCount = images.filter(Boolean).length;

  return (
    <Box sx={{ mb: 3 }}>
      {/* 4 upload buttons + submit */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        {images.map((img, index) => (
          <Button
            key={index}
            variant="outlined"
            component="label"
            size="small"
            disabled={saving}
            startIcon={img ? <Image /> : <AddPhotoAlternate />}
            sx={{
              borderColor: img ? colors.primary : colors.border,
              color: img ? colors.primary : colors.textSecondary,
              borderRadius: "0.75rem",
              textTransform: "none",
              fontSize: "0.75rem",
              minWidth: "auto",
              "&:hover": {
                borderColor: colors.primary,
                color: colors.primary,
              },
            }}
          >
            Slide {index + 1}
            <input
              ref={(el) => (fileInputRefs.current[index] = el)}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              hidden
              onChange={handleFileSelect(index)}
            />
          </Button>
        ))}

        <Typography variant="caption" color="text.secondary">
          {filledCount}/{MAX_IMAGES}
        </Typography>

        {/* Submit button */}
        <Button
          variant="contained"
          size="small"
          disabled={saving || filledCount === 0}
          onClick={handleSubmit}
          startIcon={
            saving ? (
              <CircularProgress size={14} color="inherit" />
            ) : (
              <Save sx={{ fontSize: "1rem" }} />
            )
          }
          sx={{
            ...primaryIconButton,
            height: "32px",
            fontSize: "0.75rem",
            fontWeight: "bold",
            borderRadius: "0.75rem",
            textTransform: "none",
            px: 2,
            boxShadow: `0 4px 12px ${colors.primaryLight}`,
            "&:hover": {
              boxShadow: `0 6px 16px ${colors.primaryLight}`,
            },
          }}
        >
          {saving
            ? t("swiperControl.saving", "Saving...")
            : t("swiperControl.save", "Save")}
        </Button>
      </Box>

      {/* Swiper - always visible */}
      <Box sx={{ height: "32vh", width: "100vh" }}>
        <SwiperView images={images} onRemove={handleRemoveImage} />
      </Box>

      {/* Notification */}
      <AlertInline ref={notificationRef} asSnackbar />
    </Box>
  );
};
