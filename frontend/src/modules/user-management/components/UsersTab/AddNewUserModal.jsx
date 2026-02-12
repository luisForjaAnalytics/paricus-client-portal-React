import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  modalCard,
  titlesTypography,
  selectMenuProps,
} from "../../../../common/styles/styles";
import { ActionButton } from "../../../../common/components/ui/ActionButton";
import { CancelButton } from "../../../../common/components/ui/CancelButton";
import { AlertInline } from "../../../../common/components/ui/AlertInline";

export const AddNewUserModal = ({
  dialog,
  editingUser,
  userForm,
  setUserForm,
  closeDialog,
  saveUser,
  saving,
  isFormValid,
  notificationRef,
  clientOptions,
  roleOptions,
  isBPOAdmin,
  handleClientChange,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Add/Edit User Dialog */}
      <Dialog
        open={dialog}
        onClose={closeDialog}
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
              {editingUser ? t("users.editUser") : t("users.addNewUser")}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box>
            <Box sx={modalCard?.boxModalStyle?.boxManagementModal}>
              <TextField
                fullWidth
                required
                label={t("users.form.firstName")}
                value={userForm.first_name}
                sx={modalCard?.inputSection}
                onChange={(e) =>
                  setUserForm({ ...userForm, first_name: e.target.value })
                }
              />

              <TextField
                fullWidth
                required
                label={t("users.form.lastName")}
                value={userForm.last_name}
                sx={modalCard?.inputSection}
                onChange={(e) =>
                  setUserForm({ ...userForm, last_name: e.target.value })
                }
              />
            </Box>
            <Box sx={modalCard?.boxModalStyle?.boxManagementModal}>
              <TextField
                fullWidth
                required
                type="email"
                label={t("users.form.email")}
                value={userForm.email}
                sx={modalCard?.inputSection}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
              />

              {!editingUser && (
                <TextField
                  fullWidth
                  required
                  type="password"
                  label={t("users.form.password")}
                  value={userForm.password}
                  sx={modalCard?.inputSection}
                  onChange={(e) =>
                    setUserForm({ ...userForm, password: e.target.value })
                  }
                />
              )}
            </Box>
            <Box sx={modalCard?.boxModalStyle?.boxManagementModal}>
              {isBPOAdmin && (
                <FormControl fullWidth required>
                  <InputLabel
                    sx={modalCard?.multiOptionFilter?.inputLabelSection}
                  >
                    {t("users.form.client")}
                  </InputLabel>
                  <Select
                    value={userForm.client_id || ""}
                    onChange={(e) => handleClientChange(e.target.value || null)}
                    label={t("users.form.client")}
                    MenuProps={selectMenuProps}
                    sx={modalCard?.multiOptionFilter?.selectSection}
                  >
                    <MenuItem value="">{t("users.form.selectClient")}</MenuItem>
                    {clientOptions.map((client) => (
                      <MenuItem key={client.value} value={client.value}>
                        {client.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <FormControl fullWidth disabled={!userForm.client_id} required>
                <InputLabel
                  sx={modalCard?.multiOptionFilter?.inputLabelSection}
                >
                  {t("users.form.role")}
                </InputLabel>
                <Select
                  value={userForm.role_id || ""}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      role_id: e.target.value || null,
                    })
                  }
                  label={t("users.form.role")}
                  MenuProps={selectMenuProps}
                  sx={modalCard?.multiOptionFilter?.selectSection}
                  displayEmpty={false}
                >
                  {!userForm.client_id ? (
                    <MenuItem value="" disabled>
                      {t("users.form.selectClientFirst")}
                    </MenuItem>
                  ) : roleOptions.length === 0 ? (
                    <MenuItem value="" disabled>
                      {t("users.form.noRolesAvailable")}
                    </MenuItem>
                  ) : (
                    roleOptions.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.title}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            margin: "0 0 1rem 0",
            justifyContent: "center",
          }}
        >
          <ActionButton
            handleClick={saveUser}
            disabled={saving || !isFormValid}
            text={saving ? t("common.saving") : t("common.save")}
            sx={{ width: "20%" }}
          />
          <CancelButton
            handleClick={closeDialog}
            text={t("common.cancel")}
          />
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <AlertInline ref={notificationRef} asSnackbar />
    </>
  );
};
