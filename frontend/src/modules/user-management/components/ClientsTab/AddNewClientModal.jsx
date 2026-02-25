import { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  primaryButton,
  modalCard,
  titlesTypography,
  colors,
} from "../../../../common/styles/styles";
import { ActionButton } from "../../../../common/components/ui/ActionButton";
import { CancelButton } from "../../../../common/components/ui/CancelButton";

const buildSchema = (t) =>
  z.object({
    name: z
      .string()
      .min(1, t("clients.form.clientNameRequired"))
      .min(2, t("clients.form.clientNameMinLength")),
    isProspect: z.boolean().default(false),
    isActive: z.boolean().default(true),
  });

export const AddNewClientModal = ({
  editingClient,
  showCreateDialog,
  showConfirmDialog,
  handleCloseDialog,
  onSave,
  isSaving,
  clientToDeactivate,
  confirmDeactivation,
  setShowConfirmDialog,
}) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(buildSchema(t)),
    mode: "onChange",
    defaultValues: {
      name: "",
      isProspect: false,
      isActive: true,
    },
  });

  // Reset form when dialog opens/closes or editingClient changes
  useEffect(() => {
    if (showCreateDialog) {
      reset({
        name: editingClient?.name || "",
        isProspect: editingClient?.isProspect ?? false,
        isActive: editingClient?.isActive ?? true,
      });
    }
  }, [showCreateDialog, editingClient, reset]);

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <>
      {/* Create/Edit Dialog */}
      <Dialog
        open={showCreateDialog}
        onClose={handleCloseDialog}
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
              {editingClient ? t("clients.editClient") : t("clients.addClient")}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            component="form"
            id="client-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("clients.form.clientName")}
                  required
                  fullWidth
                  sx={modalCard?.inputSection}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="isProspect"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      sx={{
                        "&.Mui-checked": {
                          color: colors.primary,
                        },
                      }}
                    />
                  }
                  label={t("clients.form.isProspect")}
                  sx={{ margin: "1rem 0 0 0rem", display: "block" }}
                />
              )}
            />
            {editingClient && (
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        sx={{
                          "&.Mui-checked": {
                            color: colors.primary,
                          },
                        }}
                      />
                    }
                    label={t("clients.form.active")}
                    sx={{ margin: "1rem 0 0 0rem", display: "block" }}
                  />
                )}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            margin: "0 0 0 0",
            justifyContent: "center",
          }}
        >
          <ActionButton
            handleClick={handleSubmit(onSubmit)}
            disabled={isSaving || !isValid}
            text={isSaving ? t("common.saving") : t("common.save")}
            sx={{ width: "20%" }}
          />
          <CancelButton
            handleClick={handleCloseDialog}
            text={t("common.cancel")}
          />
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t("clients.confirmDeactivation")}</DialogTitle>
        <DialogContent>
          <Typography>
            {t("clients.deactivationWarning")} "{clientToDeactivate?.name}"?{" "}
            {t("clients.deactivationWarningContinue")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <CancelButton
            handleClick={() => setShowConfirmDialog(false)}
            text={t("common.cancel")}
          />
          <Button
            variant="contained"
            color="error"
            onClick={confirmDeactivation}
            sx={primaryButton}
          >
            {t("clients.actions.deactivate")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
