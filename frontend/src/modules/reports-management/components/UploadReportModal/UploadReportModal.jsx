import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  outlinedIconButton,
  modalCard,
  titlesTypography,
} from "../../../../common/styles/styles";
import { ActionButton } from "../../../../common/components/ui/ActionButton/ActionButton";
import { CancelButton } from "../../../../common/components/ui/CancelButton/CancelButton";

export const UploadReportModal = ({
  showUploadModal,
  setShowUploadModal,
  uploadForm,
  setUploadForm,
  handleFileSelect,
  handleUploadReport,
  uploading,
  fileInputRef,
  selectedFolderForUpload,
}) => {
  const { t } = useTranslation();

  const MAX_CHARACTERS = 500;
  const isOverLimit = uploadForm.description?.length > MAX_CHARACTERS;

  return (
    <Dialog
      open={!!showUploadModal}
      onClose={() => setShowUploadModal(null)}
      slotProps={{
        paper: {
          sx: modalCard?.dialogSection,
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              ...titlesTypography?.primaryTitle,
              textAlign: "center",
            }}
          >
            {t("reportsManagement.upload.title")}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <TextField
            label={t("reportsManagement.upload.clientFolder")}
            value={selectedFolderForUpload || ""}
            slotProps={{ input: { readOnly: true } }}
            fullWidth
            disabled
            sx={modalCard?.inputSection}
          />

          <TextField
            label={t("reportsManagement.upload.reportName")}
            placeholder={t("reportsManagement.upload.reportNamePlaceholder")}
            value={uploadForm.reportName}
            onChange={(e) =>
              setUploadForm({ ...uploadForm, reportName: e.target.value })
            }
            fullWidth
            sx={modalCard?.inputSection}
          />

          <TextField
            label={t("reportsManagement.upload.description")}
            placeholder={t("reportsManagement.upload.descriptionPlaceholder")}
            value={uploadForm.description}
            onChange={(e) =>
              setUploadForm({ ...uploadForm, description: e.target.value })
            }
            multiline
            rows={3}
            fullWidth
            error={isOverLimit}
            helperText={
              isOverLimit
                ? t("reportsManagement.upload.maxCharactersError", {
                    max: MAX_CHARACTERS,
                  })
                : `${uploadForm.description?.length || 0}/${MAX_CHARACTERS}`
            }
            sx={modalCard?.inputDescriptionSection}
          />

          <Box>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              style={{ display: "none" }}
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
                fullWidth
                sx={outlinedIconButton}
              >
                {uploadForm.file
                  ? uploadForm.file.name
                  : t("reportsManagement.upload.chooseFile")}
              </Button>
            </label>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              {t("reportsManagement.upload.fileRestriction")}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          margin: "0 0 1rem 0",
          justifyContent: "center",
        }}
      >
        <ActionButton
          handleClick={handleUploadReport}
          disabled={uploading || !uploadForm.file || isOverLimit}
          icon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
          text={uploading ? t("reportsManagement.upload.uploading") : t("reportsManagement.upload.upload")}
          sx={{ width: "10rem" }}
        />
        <CancelButton
          handleClick={() => setShowUploadModal(null)}
          text={t("reportsManagement.upload.cancel")}
        />
      </DialogActions>
    </Dialog>
  );
};
