import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { boxTypography } from "../../common/styles/styles";
import { HeaderBoxTypography } from "../../common/components/ui/HeaderBoxTypography/HeaderBoxTypography";
import { AudioRecordingsContent } from "./components/AudioRecordingsContent";

/**
 * AudioRecordingsView - Main audio recordings view component
 * Simple wrapper that renders header and content
 */
export const AudioRecordingsView = () => {
  const { t } = useTranslation();

  return (
    <Box sx={boxTypography.box}>
      {/* Page Header */}
      <HeaderBoxTypography text={t("audioRecordings.sectionTitle")} />

      {/* Audio Recordings Content */}
      <AudioRecordingsContent />
    </Box>
  );
};