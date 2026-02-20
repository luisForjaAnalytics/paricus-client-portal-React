import { Box, Button, TextField, Avatar, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertInline } from "../../../common/components/ui/AlertInline";
import { useNotification } from "../../../common/hooks";
import { extractApiError } from "../../../common/utils/apiHelpers";
import {
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} from "../../../store/api/profileApi";
import {
  outlinedIconButton,
  primaryIconButton,
  profilelStyles,
} from "../../../common/styles/styles";

const noShadowSx = {
  ...profilelStyles.inputField,
  "& .MuiOutlinedInput-root": {
    ...profilelStyles.inputField["& .MuiOutlinedInput-root"],
    boxShadow: "none",
    backgroundColor: "transparent",
  },
};

const profileGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
  gap: 3,
};

const passwordGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
  gap: 3,
};

const buildSchema = (t) =>
  z
    .object({
      firstName: z.string().min(1, t("profile.firstNameRequired")),
      lastName: z.string().min(1, t("profile.lastNameRequired")),
      phone: z.string().optional().default(""),
      currentPassword: z.string().optional().default(""),
      newPassword: z.string().optional().default(""),
      confirmPassword: z.string().optional().default(""),
    })
    .superRefine((data, ctx) => {
      const { currentPassword, newPassword, confirmPassword } = data;
      const anyFilled = currentPassword || newPassword || confirmPassword;

      if (!anyFilled) return;

      if (!currentPassword || !newPassword || !confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: t("profile.allPasswordFieldsRequired"),
          path: ["currentPassword"],
        });
        return;
      }

      if (newPassword.length < 8) {
        ctx.addIssue({
          code: "custom",
          message: t("profile.passwordMinLength"),
          path: ["newPassword"],
        });
      }

      if (newPassword !== confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: t("profile.passwordsNotMatch"),
          path: ["confirmPassword"],
        });
      }
    });

export const ProfileFormView = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);

  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] =
    useUpdatePasswordMutation();

  const { notificationRef, showNotification } = useNotification();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: zodResolver(buildSchema(t)),
    mode: "onChange",
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // Update profile
      await updateProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
      }).unwrap();

      // Update password if fields are filled
      if (data.currentPassword && data.newPassword) {
        await updatePassword({
          current_password: data.currentPassword,
          new_password: data.newPassword,
        }).unwrap();

        showNotification(
          `${t("profile.profileUpdated")} / ${t("profile.passwordUpdated")}`,
          "success",
        );
      } else {
        showNotification(t("profile.profileUpdated"), "success");
      }

      // Reset form with new profile values + clear password fields
      reset({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      showNotification(
        extractApiError(error, t("profile.profileUpdateFailed")),
        "error",
      );
    }
  };

  const handleCancel = () => {
    reset({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const isBusy = isSubmitting || isUpdatingProfile || isUpdatingPassword;

  return (
    <Box sx={profilelStyles}>
      {/* Profile Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
        <Avatar
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          alt={t("profile.photoLabel")}
          sx={{ width: 80, height: 80 }}
        />
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Profile Form */}
        <Box sx={profileGridSx}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("profile.firstName")}
                fullWidth
                sx={profilelStyles.inputField}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("profile.lastName")}
                fullWidth
                sx={profilelStyles.inputField}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            )}
          />
          <TextField
            label={t("profile.email")}
            type="email"
            fullWidth
            sx={profilelStyles.inputField}
            value={user?.email || ""}
            disabled
            helperText={t("profile.emailCannotChange")}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("profile.phoneOptional")}
                fullWidth
                sx={noShadowSx}
              />
            )}
          />
        </Box>

        {/* Change Password Section */}
        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{ mb: 3 }}
          >
            {t("profile.changePassword")}
          </Typography>

          <Box sx={passwordGridSx}>
            <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("profile.currentPassword")}
                  type="password"
                  fullWidth
                  sx={noShadowSx}
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword?.message}
                />
              )}
            />
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("profile.newPassword")}
                  type="password"
                  fullWidth
                  sx={noShadowSx}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("profile.confirmPassword")}
                  type="password"
                  fullWidth
                  sx={noShadowSx}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              )}
            />
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            disabled={!isDirty || isBusy}
            sx={primaryIconButton}
          >
            {t("profile.updateProfile")}
          </Button>

          <Button
            type="button"
            variant="outlined"
            disabled={!isDirty || isBusy}
            onClick={handleCancel}
            sx={outlinedIconButton}
          >
            {t("common.cancel")}
          </Button>
        </Box>
      </form>

      {/* Notifications */}
      <AlertInline ref={notificationRef} asSnackbar />
    </Box>
  );
};
