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
import {
  useUpdateProfileMutation,
  useUpdatePasswordMutation
} from '../../store/api/profileApi';
import {
  primaryButton,
  outlinedButton,
} from '../../layouts/style/styles';

export const ProfileView = ({ authStore }) => {
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

      showMessage('Profile updated successfully', 'success');
    } catch (error) {
      showMessage(error.data?.error || 'Failed to update profile', 'error');
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

      showMessage('Password updated successfully', 'success');
    } catch (error) {
      showMessage(error.data?.error || 'Failed to update password', 'error');
    }
  };

  return (
    <Box>
      <Card>
        <CardHeader
          title="My Profile"
          subheader="Manage your account settings and preferences"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        />

        <CardContent sx={{ p: 3 }}>
          {/* Profile Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Avatar
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              alt="Profile photo"
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
                label="First Name"
                fullWidth
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Last Name"
                fullWidth
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={profileForm.email}
                disabled
                helperText="Email cannot be changed"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Phone (Optional)"
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
              Change Password
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Current Password"
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
                  label="New Password"
                  type="password"
                  fullWidth
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  error={passwordForm.newPassword.length > 0 && passwordForm.newPassword.length < 8}
                  helperText={
                    passwordForm.newPassword.length > 0 && passwordForm.newPassword.length < 8
                      ? 'Password must be at least 8 characters'
                      : ''
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Confirm New Password"
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
                      ? 'Passwords do not match'
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
              {isUpdatingProfile ? 'Saving...' : 'Save Profile'}
            </Button>

            <Button
              variant="outlined"
              onClick={savePassword}
              disabled={isUpdatingPassword || !canSavePassword()}
              sx={outlinedButton}
            >
              {isUpdatingPassword ? 'Updating...' : 'Update Password'}
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
