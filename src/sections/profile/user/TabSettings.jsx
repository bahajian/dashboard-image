// TabSettings.jsx

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Grid,
  InputLabel,
  Stack,
  Switch,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useGetProfile, updateProfile } from 'api/profile';
import { openSnackbar } from 'api/snackbar';

const TabSettings = () => {
  const { profile, profileLoading, profileError } = useGetProfile();
  const [localSettings, setLocalSettings] = useState({
    notifications: false,
    darkMode: false
  });
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  // Load settings from the profile into local state
  useEffect(() => {
    if (profile && !profileLoading && !profileError) {
      setLocalSettings({
        notifications: profile.settings?.notifications || false,
        darkMode: profile.settings?.darkMode || false
      });
    }
  }, [profile, profileLoading, profileError]);

  // Handle toggle changes
  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setLocalSettings((prev) => ({ ...prev, [name]: checked }));
  };

  // Handle Save
  const handleSave = async () => {
    try {
      const updatedProfile = {
        settings: localSettings
      };

      await updateProfile(updatedProfile);
      
      openSnackbar({
        open: true,
        message: 'Settings updated successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });

      setModalOpen(true); // Show success modal
    } catch (error) {
      console.error('Error updating settings:', error);
      openSnackbar({
        open: true,
        message: `Settings update failed: ${error.message}`,
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  if (profileLoading) {
    return <MainCard title="Settings">Loading settings...</MainCard>;
  }

  if (profileError) {
    return <MainCard title="Settings">Error loading settings</MainCard>;
  }

  return (
    <MainCard title="Settings">
      <Box sx={{ p: 2.5 }}>
        <Grid container spacing={3}>
          {/* Notifications Setting */}
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.notifications}
                  onChange={handleToggleChange}
                  name="notifications"
                  color="primary"
                />
              }
              label="Enable Notifications"
            />
          </Grid>

          {/* Dark Mode Setting */}
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.darkMode}
                  onChange={handleToggleChange}
                  name="darkMode"
                  color="primary"
                />
              }
              label="Enable Dark Mode"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button variant="outlined" color="secondary" onClick={() => {
            // Optionally, reset to initial settings if needed
            if (profile) {
              setLocalSettings({
                notifications: profile.settings?.notifications || false,
                darkMode: profile.settings?.darkMode || false
              });
            }
          }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Stack>
      </Box>

      {/* Success Modal */}
      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>Settings Updated</DialogTitle>
        <DialogContent>
          <DialogContentText>Your settings have been updated successfully!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default TabSettings;
