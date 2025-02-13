import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Checkbox,
  FormControlLabel,
  Chip,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

import MainCard from 'components/MainCard';
import { useGetProfile, updateProfile } from 'api/profile';
import countries from '../../../assets/data/countries'; // Import countries data

const TabPersonal = () => {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  const { profile, profileLoading, profileError } = useGetProfile();
  const [localProfile, setLocalProfile] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    address: '',
    role: '',
    status: '',
    createdAi: '',
    country: '',
    state: '',
    dateOfBirth: null,
    interests: [],
    note: '',
    settings: {
      notifications: false,
      darkMode: false
    }
  });
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  // Load profile data into local state
  useEffect(() => {
    if (profile && !profileLoading && !profileError) {
      setLocalProfile({
        firstname: profile.firstname || '',
        lastname: profile.lastname || '',
        phone: profile.phone || '',
        address: profile.address || '',
        role: profile.role || '',
        status: profile.status || '',
        createdAi: profile.createdAi || '',
        country: profile.country || '',
        state: profile.stateProvince || '',
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : null,
        interests: profile.interests || [],
        note: profile.note || '',
        settings: profile.settings || { notifications: false, darkMode: false }
      });
    }
  }, [profile, profileLoading, profileError]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSettingsChange = (e) => {
    const { name, checked } = e.target;
    setLocalProfile((prev) => ({
      ...prev,
      settings: { ...prev.settings, [name]: checked }
    }));
  };

  const handleDateChange = (date) => {
    setLocalProfile((prev) => ({ ...prev, dateOfBirth: date }));
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!localProfile.firstname) newErrors.firstname = 'First Name is required';
    if (!localProfile.lastname) newErrors.lastname = 'Last Name is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && profile) {
      try {
        const updatedProfile = {
          firstname: localProfile.firstname,
          lastname: localProfile.lastname,
          phone: localProfile.phone,
          address: localProfile.address,
          role: localProfile.role,
          status: localProfile.status,
          createdAi: localProfile.createdAi,
          country: localProfile.country,
          stateProvince: localProfile.state,
          dateOfBirth: localProfile.dateOfBirth?.toISOString(),
          interests: localProfile.interests,
          note: localProfile.note,
          settings: localProfile.settings
        };

        await updateProfile(updatedProfile);
        setModalOpen(true); // Show success modal
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  if (profileLoading) {
    return <MainCard title="Personal Information">Loading profile...</MainCard>;
  }

  if (profileError) {
    return <MainCard title="Personal Information">Error loading profile</MainCard>;
  }

  return (
    <MainCard title="Personal Information">
      <Box sx={{ p: 2.5 }}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} sm={6}>
            <InputLabel>First Name</InputLabel>
            <TextField
              fullWidth
              name="firstname"
              value={localProfile.firstname}
              onChange={handleChange}
              error={Boolean(errors.firstname)}
              helperText={errors.firstname}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Last Name</InputLabel>
            <TextField
              fullWidth
              name="lastname"
              value={localProfile.lastname}
              onChange={handleChange}
              error={Boolean(errors.lastname)}
              helperText={errors.lastname}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Date of Birth</InputLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={localProfile.dateOfBirth}
                maxDate={maxDate}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={Boolean(errors.dateOfBirth)}
                    helperText={errors.dateOfBirth}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Phone</InputLabel>
            <TextField
              fullWidth
              name="phone"
              value={localProfile.phone}
              onChange={handleChange}
            />
          </Grid>

          {/* Address & State */}
          <Grid item xs={12}>
            <InputLabel>Address</InputLabel>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="address"
              value={localProfile.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Country</InputLabel>
            <Select
              fullWidth
              name="country"
              value={localProfile.country}
              onChange={handleChange}
            >
              {countries.map((item) => (
                <MenuItem key={item.code} value={item.code}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>State</InputLabel>
            <TextField
              fullWidth
              name="state"
              value={localProfile.state}
              onChange={handleChange}
            />
          </Grid>

          {/* Interests */}
          <Grid item xs={12}>
            <InputLabel>Interests</InputLabel>
            <Autocomplete
              multiple
              freeSolo
              options={['Trading', 'Coaching', 'AI', 'Blockchain']}
              value={localProfile.interests}
              onChange={(event, newValue) => {
                setLocalProfile((prev) => ({ ...prev, interests: newValue }));
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip key={index} label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} placeholder="Add interests" />
              )}
            />
          </Grid>

          {/* Note */}
          <Grid item xs={12}>
            <InputLabel>Note</InputLabel>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="note"
              value={localProfile.note}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Stack>
      </Box>

      {/* Success Modal */}
      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>Profile Saved</DialogTitle>
        <DialogContent>
          <DialogContentText>Your profile has been updated successfully!</DialogContentText>
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

export default TabPersonal;
