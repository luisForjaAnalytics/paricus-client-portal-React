import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Stack,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  primaryIconButton,
  outlinedButton,
  modalCard,
  titlesTypography,
} from "../../../../common/styles/styles";

export const ManageAccessModal = ({
  showFolderAccessModal,
  setShowFolderAccessModal,
  accessForm,
  setAccessForm,
  clients,
  clientFolders,
  handleGrantFolderAccess,
  grantingAccess,
  loadingAccess,
  folderAccess,
  handleRevokeFolderAccess,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={showFolderAccessModal}
      onClose={() => setShowFolderAccessModal(false)}
      slotProps={{
        paper: {
          sx: { ...modalCard?.dialogSection, width: "50%" },
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
            {t("reportsManagement.folderAccess.title")}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Grant Access Form */}
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            mb: 3,
            bgcolor: "grey.50",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
            {t("reportsManagement.folderAccess.grantTitle")}
          </Typography>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={5}>
              <FormControl fullWidth>
                <InputLabel
                  sx={modalCard?.multiOptionFilter?.inputLabelSection}
                >
                  {t("reportsManagement.folderAccess.client")}
                </InputLabel>
                <Select
                  value={accessForm.clientId}
                  onChange={(e) =>
                    setAccessForm({ ...accessForm, clientId: e.target.value })
                  }
                  label={t("reportsManagement.folderAccess.client")}
                  sx={modalCard?.multiOptionFilter?.selectSection}
                >
                  <MenuItem value="">
                    {t("reportsManagement.folderAccess.selectClient")}
                  </MenuItem>
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <FormControl fullWidth>
                <InputLabel
                  sx={modalCard?.multiOptionFilter?.inputLabelSection}
                >
                  {t("reportsManagement.folderAccess.folder")}
                </InputLabel>
                <Select
                  value={accessForm.folderName}
                  onChange={(e) =>
                    setAccessForm({
                      ...accessForm,
                      folderName: e.target.value,
                    })
                  }
                  label={t("reportsManagement.folderAccess.folder")}
                  sx={modalCard?.multiOptionFilter?.selectSection}
                >
                  <MenuItem value="">
                    {t("reportsManagement.folderAccess.selectFolder")}
                  </MenuItem>
                  {clientFolders.map((folder) => (
                    <MenuItem key={folder} value={folder}>
                      {folder}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                onClick={handleGrantFolderAccess}
                disabled={
                  !accessForm.clientId ||
                  !accessForm.folderName ||
                  grantingAccess
                }
                fullWidth
                startIcon={
                  grantingAccess ? (
                    <CircularProgress size={20} />
                  ) : (
                    <AddIcon />
                  )
                }
                sx={primaryIconButton}
              >
                {grantingAccess
                  ? t("reportsManagement.folderAccess.granting")
                  : t("reportsManagement.folderAccess.grantButton")}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Current Access List */}
        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
          {t("reportsManagement.folderAccess.currentTitle")}
        </Typography>

        {loadingAccess ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>
              {t("reportsManagement.folderAccess.loadingPermissions")}
            </Typography>
          </Box>
        ) : folderAccess.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">
              {t("reportsManagement.folderAccess.noPermissions")}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {folderAccess.map((access) => (
              <Paper
                key={`${access.clientId}-${access.folderName}`}
                variant="outlined"
                sx={{ p: 2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" fontWeight="600">
                      {access.client.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("reportsManagement.folderAccess.accessTo")}{" "}
                      {access.folderName}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() =>
                      handleRevokeFolderAccess(
                        access.clientId,
                        access.folderName
                      )
                    }
                    sx={outlinedButton}
                  >
                    {t("reportsManagement.folderAccess.revokeButton")}
                  </Button>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};
