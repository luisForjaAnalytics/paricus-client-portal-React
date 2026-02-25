import { useEffect } from "react";
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
  FormHelperText,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  modalCard,
  titlesTypography,
  selectMenuProps,
} from "../../../../common/styles/styles";
import { ActionButton } from "../../../../common/components/ui/ActionButton";
import { CancelButton } from "../../../../common/components/ui/CancelButton";

const MAX_CHARACTERS = 500;

const buildSchema = (t) =>
  z.object({
    role_name: z
      .string()
      .min(1, t("roles.form.roleNameRequired"))
      .min(2, t("roles.form.roleNameMinLength")),
    description: z
      .string()
      .max(MAX_CHARACTERS, t("roles.form.maxCharactersError", { max: MAX_CHARACTERS }))
      .default(""),
    client_id: z.coerce
      .number()
      .min(1, t("roles.form.clientRequired")),
  });

export const AddNewRoleModal = ({
  dialog,
  editingRole,
  closeDialog,
  onSave,
  isSaving,
  clients,
  isBPOAdmin,
  isProtectedRole,
  defaultClientId,
}) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(buildSchema(t)),
    mode: "onChange",
    defaultValues: {
      role_name: "",
      description: "",
      client_id: defaultClientId || "",
    },
  });

  const descriptionValue = watch("description");

  // Reset form when dialog opens/closes or editingRole changes
  useEffect(() => {
    if (dialog) {
      reset({
        role_name: editingRole?.roleName || editingRole?.role_name || "",
        description: editingRole?.description || "",
        client_id: editingRole?.clientId || editingRole?.client_id || defaultClientId || "",
      });
    }
  }, [dialog, editingRole, defaultClientId, reset]);

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
      <Dialog
        open={dialog}
        onClose={closeDialog}
        slotProps={{
          paper: {
            sx: {
              ...modalCard?.dialogSection,
              width: { xs: "100%", md: "30%" },
            },
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
            component="form"
            id="role-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              margin: "0 0 1rem 0",
            }}
          >
            <Controller
              name="role_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("roles.form.roleName")}
                  required
                  fullWidth
                  sx={modalCard?.inputSection}
                  error={!!errors.role_name}
                  helperText={errors.role_name?.message}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("roles.form.description")}
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={
                    errors.description?.message ||
                    `${descriptionValue?.length || 0}/${MAX_CHARACTERS}`
                  }
                  sx={modalCard?.inputDescriptionSection}
                />
              )}
            />
            {isBPOAdmin && (
              <Controller
                name="client_id"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.client_id}>
                    <InputLabel
                      sx={modalCard?.multiOptionFilter?.inputLabelSection}
                    >
                      {t("roles.form.client")}
                    </InputLabel>
                    <Select
                      {...field}
                      label={t("roles.form.client")}
                      MenuProps={selectMenuProps}
                      sx={modalCard?.multiOptionFilter?.selectSection}
                      disabled={
                        editingRole && isProtectedRole(editingRole.role_name || editingRole.roleName)
                      }
                    >
                      {clients.map((client) => (
                        <MenuItem key={client.id} value={client.id}>
                          {client.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.client_id && (
                      <FormHelperText>{errors.client_id.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            margin: "0 0 1rem 0",
            justifyContent: "center",
          }}
        >
          <ActionButton
            handleClick={handleSubmit(onSubmit)}
            disabled={isSaving || !isValid}
            text={isSaving ? t("common.saving") : t("common.save")}
            sx={{ width: "6rem" }}
          />
          <CancelButton handleClick={closeDialog} text={t("common.cancel")} />
        </DialogActions>
      </Dialog>
  );
};
