import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  primaryButton,
  outlinedButton,
  modalCard,
  titlesTypography,
  primaryIconButton,
  selectMenuProps,
} from "../../../../common/styles/styles";

export const AddNewRoleModal = ({
  dialog,
  editingRole,
  roleForm,
  setRoleForm,
  closeDialog,
  saveRole,
  isSaving,
  isFormValid,
  snackbar,
  handleCloseSnackbar,
  clients,
  isBPOAdmin,
  isProtectedRole,
  deleteDialog,
  setDeleteDialog,
  roleToDelete,
  handleDeleteRole,
  isDeleting,
}) => {
  const { t } = useTranslation();

  const MAX_CHARACTERS = 500;
  const isOverLimit = roleForm.description?.length > MAX_CHARACTERS;

  return (
    <>
      {/* Add/Edit Role Dialog */}
      <Dialog
        open={dialog}
        onClose={closeDialog}
        slotProps={{
          paper: {
            sx: {...modalCard?.dialogSection,width: "20%",}
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
              {editingRole ? t("roles.editRole") : t("roles.addRole")}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              margin: "0 0 1rem 0",
            }}
          >
            <TextField
              label={t("roles.form.roleName")}
              required
              fullWidth
              value={roleForm.role_name}
              sx={modalCard?.inputSection}
              onChange={(e) =>
                setRoleForm({ ...roleForm, role_name: e.target.value })
              }
              error={
                roleForm.role_name.length > 0 && roleForm.role_name.length < 2
              }
              helperText={
                roleForm.role_name.length > 0 && roleForm.role_name.length < 2
                  ? t("roles.form.roleNameMinLength")
                  : ""
              }
            />
            <TextField
              label={t("roles.form.description")}
              fullWidth
              multiline
              rows={3}
              value={roleForm.description}
              onChange={(e) =>
                setRoleForm({ ...roleForm, description: e.target.value })
              }
              error={isOverLimit}
              helperText={
                isOverLimit
                  ? t("roles.form.maxCharactersError", {
                      max: MAX_CHARACTERS,
                    })
                  : `${roleForm.description?.length || 0}/${MAX_CHARACTERS}`
              }
              sx={modalCard?.inputDescriptionSection}
            />
            {isBPOAdmin && (
              <FormControl fullWidth required>
                <InputLabel
                  sx={modalCard?.multiOptionFilter?.inputLabelSection}
                >
                  {t("roles.form.client")}
                </InputLabel>
                <Select
                  value={roleForm.client_id || ""}
                  label={t("roles.form.client")}
                  MenuProps={selectMenuProps}
                  sx={modalCard?.multiOptionFilter?.selectSection}
                  onChange={(e) =>
                    setRoleForm({ ...roleForm, client_id: e.target.value })
                  }
                  disabled={
                    editingRole && isProtectedRole(editingRole.role_name)
                  }
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            margin: "0 0 1rem 0",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={saveRole}
            disabled={isSaving || !isFormValid() || isOverLimit}
            sx={{ ...primaryIconButton, width: "6rem" }}
          >
            {isSaving ? t("common.saving") : t("common.save")}
          </Button>
          <Button onClick={closeDialog} sx={outlinedButton}>
            {t("common.cancel")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t("roles.confirmDelete")}</DialogTitle>
        <DialogContent>
          <Typography>
            {t("roles.deleteWarning")} "{roleToDelete?.role_name}"?{" "}
            {t("roles.deleteWarningContinue")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} sx={outlinedButton}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteRole}
            disabled={isDeleting}
            sx={primaryButton}
          >
            {isDeleting ? t("common.deleting") : t("common.delete")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === "success" ? 3000 : 5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
