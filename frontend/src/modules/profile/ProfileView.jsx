import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
  Avatar,
  Snackbar,
  Alert
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  useUpdateProfileMutation,
  useUpdatePasswordMutation
} from '../../store/api/profileApi';
import {
  primaryButton,
  outlinedButton,
  typography,
} from '../../common/styles/styles';

export const ProfileView = ({ authStore }) => {
  const { t } = useTranslation();

  // RTK Query hooks
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Initialize form with user data
  useEffect(() => {
    if (authStore?.user) {
      setProfileForm({
        firstName: authStore.user.firstName || '',
        lastName: authStore.user.lastName || '',
        email: authStore.user.email || '',
        phone: authStore.user.phone || ''
      });
    }
  }, [authStore]);

  const userDisplayName = () => {
    const user = authStore?.user;
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || 'User';
  };

  const canSavePassword = () => {
    return (
      passwordForm.currentPassword &&
      passwordForm.newPassword &&
      passwordForm.confirmPassword &&
      passwordForm.newPassword === passwordForm.confirmPassword &&
      passwordForm.newPassword.length >= 8
    );
  };

  const showMessage = (msg, severity = 'success') => {
    setSnackbar({
      open: true,
      message: msg,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const saveProfile = async () => {
    try {
      const response = await updateProfile({
        first_name: profileForm.firstName,
        last_name: profileForm.lastName,
        phone: profileForm.phone
      }).unwrap();

      // Update the auth store with new data
      if (authStore && authStore.user) {
        authStore.user = { ...authStore.user, ...response };
      }

      showMessage(t('profile.profileUpdated'), 'success');
    } catch (error) {
      showMessage(error.data?.error || t('profile.profileUpdateFailed'), 'error');
    }
  };

  const savePassword = async () => {
    if (!canSavePassword()) return;

    try {
      await updatePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword
      }).unwrap();

      // Clear password fields
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      showMessage(t('profile.passwordUpdated'), 'success');
    } catch (error) {
      showMessage(error.data?.error || t('profile.passwordUpdateFailed'), 'error');
    }
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: typography.fontWeight.semibold,
            fontFamily: typography.fontFamily,
          }}
        >
          {t('profile.title')}
        </Typography>
      </Box>

      <Card>
        <CardHeader
          title={t('profile.title')}
          subheader={t('profile.description')}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        />

        <CardContent sx={{ p: 3 }}>
          {/* Profile Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Avatar
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              alt={t('profile.photoLabel')}
              sx={{ width: 80, height: 80 }}
            />
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {userDisplayName()}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {authStore?.user?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {authStore?.user?.roleName} at {authStore?.user?.clientName}
              </Typography>
            </Box>
          </Box>

          {/* Profile Form */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label={t('profile.firstName')}
                fullWidth
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label={t('profile.lastName')}
                fullWidth
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label={t('profile.email')}
                type="email"
                fullWidth
                value={profileForm.email}
                disabled
                helperText={t('profile.emailCannotChange')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label={t('profile.phoneOptional')}
                type="tel"
                fullWidth
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              />
            </Grid>
          </Grid>

          {/* Change Password Section */}
          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
              {t('profile.changePassword')}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label={t('profile.currentPassword')}
                  type="password"
                  fullWidth
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label={t('profile.newPassword')}
                  type="password"
                  fullWidth
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  error={passwordForm.newPassword.length > 0 && passwordForm.newPassword.length < 8}
                  helperText={
                    passwordForm.newPassword.length > 0 && passwordForm.newPassword.length < 8
                      ? t('profile.passwordMinLength')
                      : ''
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label={t('profile.confirmPassword')}
                  type="password"
                  fullWidth
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  error={
                    passwordForm.confirmPassword.length > 0 &&
                    passwordForm.newPassword !== passwordForm.confirmPassword
                  }
                  helperText={
                    passwordForm.confirmPassword.length > 0 &&
                    passwordForm.newPassword !== passwordForm.confirmPassword
                      ? t('profile.passwordsNotMatch')
                      : ''
                  }
                />
              </Grid>
            </Grid>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={saveProfile}
              disabled={isUpdatingProfile}
              sx={primaryButton}
            >
              {isUpdatingProfile ? t('common.saving') : t('profile.saveProfile')}
            </Button>

            <Button
              variant="outlined"
              onClick={savePassword}
              disabled={isUpdatingPassword || !canSavePassword()}
              sx={outlinedButton}
            >
              {isUpdatingPassword ? t('common.updating') : t('profile.updatePassword')}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileView;
