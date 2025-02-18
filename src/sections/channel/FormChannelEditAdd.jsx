import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// Material-UI components
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
  Chip,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
} from '@mui/material';

// Form validation
import * as Yup from 'yup';
import { useFormik, FormikProvider, Form } from 'formik';

// API imports
import { insertChannel, updateChannel } from 'api/channel';
import { mutate } from 'swr';

// Constants
const assetTypes = ['stock', 'crypto', 'commodity', 'forex'];
const tradeTypes = ['long', 'short', 'options', 'futures'];
const availablePlatforms = ['Platform A', 'Platform B', 'Platform C'];

const getInitialValues = (channel) => ({
  name: channel?.name || '',
  price: channel?.price !== undefined ? channel.price : 10,
  status: channel?.status === 'ENABLED',
  assetType: channel?.assetType || '',
  tradeType: channel?.tradeType || '',
  platforms: channel?.platforms || [],
  paymentPriceId: channel?.paymentPriceId || '',
  picturePath: channel?.picturePath || '',
  messagingEnabled: channel?.messagingEnabled || false,
  messagingPlatform: channel?.messagingPlatform || '',
  messagingAccountId: channel?.messagingAccountId || '',
  messagingChannelId: channel?.messagingChannelId || '',
});

export default function FormChannelEditAdd({ open, onClose, channel }) {
  // Snackbar state for user feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // 'error', 'warning', 'info', 'success'
  });

  // Handler to close the Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Channel name is required'),
    price: Yup.number().required('Price is required').min(0, 'Price must be positive'),
    assetType: Yup.string().required('Asset type is required'),
    tradeType: Yup.string().required('Trade type is required'),
    messagingEnabled: Yup.boolean(),
    // Add other fields if necessary
  });

  // Formik setup
  const formik = useFormik({
    initialValues: getInitialValues(channel),
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const updatedValues = {
          ...values,
          status: values.status ? 'ENABLED' : 'DISABLED',
        };

        if (channel) {
          await updateChannel(channel.id, updatedValues);
          setSnackbar({
            open: true,
            message: 'Channel updated successfully.',
            severity: 'success',
          });
          // Revalidate the cache for the specific channel
          mutate(`${import.meta.env.VITE_APP_API_URL}api/channel?id=${channel.id}`);
        } else {
          await insertChannel(updatedValues);
          setSnackbar({
            open: true,
            message: 'Channel added successfully.',
            severity: 'success',
          });
          resetForm();
        }
        onClose();
      } catch (error) {
        console.error('Error submitting form:', error);
        setSnackbar({
          open: true,
          message: 'Failed to save the channel. Please try again.',
          severity: 'error',
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    isSubmitting,
    values,
  } = formik;

  // Optional: If you need to perform side effects when form values change
  useEffect(() => {
    // For example, logging form values for debugging
    // console.log('Form values:', values);
  }, [values]);

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{channel ? 'Edit Channel' : 'Add New Channel'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                {/* Channel Name */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="name">Channel Name</InputLabel>
                    <TextField
                      fullWidth
                      id="name"
                      placeholder="Enter Channel Name"
                      {...getFieldProps('name')}
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Stack>
                </Grid>

                {/* Status */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.status}
                        onChange={(e) => setFieldValue('status', e.target.checked)}
                        name="status"
                        color="primary"
                      />
                    }
                    label="Enabled"
                  />
                </Grid>

                {/* Asset Type */}
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="assetType">Asset Type</InputLabel>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        id="assetType"
                        value={values.assetType}
                        onChange={(e) => setFieldValue('assetType', e.target.value)}
                        input={<OutlinedInput />}
                        renderValue={(selected) =>
                          selected
                            ? selected.charAt(0).toUpperCase() + selected.slice(1)
                            : 'Select Asset Type'
                        }
                      >
                        {assetTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Grid>

                {/* Trade Type */}
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="tradeType">Trade Type</InputLabel>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        id="tradeType"
                        value={values.tradeType}
                        onChange={(e) => setFieldValue('tradeType', e.target.value)}
                        input={<OutlinedInput />}
                        renderValue={(selected) =>
                          selected
                            ? selected.charAt(0).toUpperCase() + selected.slice(1)
                            : 'Select Trade Type'
                        }
                      >
                        {tradeTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Grid>

                {/* Platforms */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="platforms">Platforms</InputLabel>
                    <FormControl fullWidth>
                      <Select
                        multiple
                        id="platforms"
                        value={values.platforms}
                        onChange={(e) => setFieldValue('platforms', e.target.value)}
                        input={<OutlinedInput />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                      >
                        {availablePlatforms.map((platform) => (
                          <MenuItem key={platform} value={platform}>
                            <Checkbox checked={values.platforms.indexOf(platform) > -1} />
                            <Typography variant="body1">{platform}</Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Grid>

                {/* Price */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="price">Price</InputLabel>
                    <TextField
                      fullWidth
                      id="price"
                      type="number"
                      placeholder="Enter Price"
                      {...getFieldProps('price')}
                      error={Boolean(touched.price && errors.price)}
                      helperText={touched.price && errors.price}
                      inputProps={{ min: 0 }}
                    />
                  </Stack>
                </Grid>

                {/* Messaging Enabled */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.messagingEnabled}
                        onChange={(e) => setFieldValue('messagingEnabled', e.target.checked)}
                        name="messagingEnabled"
                        color="primary"
                      />
                    }
                    label="Messaging Enabled"
                  />
                </Grid>

                {/* Messaging Fields */}
                {values.messagingEnabled && (
                  <>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="messagingPlatform">Messaging Platform</InputLabel>
                        <TextField
                          fullWidth
                          id="messagingPlatform"
                          placeholder="Enter Messaging Platform"
                          {...getFieldProps('messagingPlatform')}
                          error={Boolean(touched.messagingPlatform && errors.messagingPlatform)}
                          helperText={touched.messagingPlatform && errors.messagingPlatform}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="messagingAccountId">Messaging Account ID</InputLabel>
                        <TextField
                          fullWidth
                          id="messagingAccountId"
                          placeholder="Enter Messaging Account ID"
                          {...getFieldProps('messagingAccountId')}
                          error={Boolean(touched.messagingAccountId && errors.messagingAccountId)}
                          helperText={touched.messagingAccountId && errors.messagingAccountId}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="messagingChannelId">Messaging Channel ID</InputLabel>
                        <TextField
                          fullWidth
                          id="messagingChannelId"
                          placeholder="Enter Messaging Channel ID"
                          {...getFieldProps('messagingChannelId')}
                          error={Boolean(touched.messagingChannelId && errors.messagingChannelId)}
                          helperText={touched.messagingChannelId && errors.messagingChannelId}
                        />
                      </Stack>
                    </Grid>
                  </>
                )}
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions>
              <Button onClick={onClose} color="error" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {channel ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

FormChannelEditAdd.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  channel: PropTypes.object,
};
