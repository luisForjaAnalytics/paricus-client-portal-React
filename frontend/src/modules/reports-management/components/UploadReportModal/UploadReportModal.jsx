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
  primaryIconButton,
  outlinedIconButton,
  modalCard,
  titlesTypography,
} from "../../../../common/styles/styles";

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
        <Button
          variant="contained"
          onClick={handleUploadReport}
          disabled={uploading || !uploadForm.file}
          startIcon={
            uploading ? <CircularProgress size={20} /> : <UploadIcon />
          }
          sx={{ ...primaryIconButton, width: "10rem" }}
        >
          {uploading
            ? t("reportsManagement.upload.uploading")
            : t("reportsManagement.upload.upload")}
        </Button>
        <Button
          onClick={() => setShowUploadModal(null)}
          sx={outlinedIconButton}
        >
          {t("reportsManagement.upload.cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
