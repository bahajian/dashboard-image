import PropTypes from 'prop-types';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Button,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { useGetChannelById } from 'api/channel'; // Hook to fetch channel info
import { createSubscription } from 'api/subscription'; // Backend call for creating subscriptions

// Validation schema using Yup
const validationSchema = yup.object({
  messagingEnabled: yup.boolean(),
  messagingPlatform: yup
    .string()
    .oneOf(['Telegram', 'Whatsapp'], 'Invalid Messaging Platform'),
  messagingAccountId: yup
    .string(),
  autoTradeEnabled: yup.boolean(),
  platformType: yup.string(),
  platformUsername: yup.string(),
  platformPassword: yup.string(),
  platformToken: yup.string(),
});

export default function SubscriptionForm({ handleNext, setErrorIndex, setClientSecret }) {
  const [loading, setLoading] = useState(false);
  const { channelId } = useParams();

  // Fetch channel information
  const { channel, channelLoading, channelError } = useGetChannelById(channelId);

  const formik = useFormik({
    initialValues: {
      messagingEnabled: false,
      messagingPlatform: 'Telegram',
      messagingAccountId: '',
      autoTradeEnabled: false,
      platformType: '',
      platformUsername: '',
      platformPassword: '',
      platformToken: '',
      amount: 0, // Will be set dynamically based on channel price
      priceId: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Add dynamic fields to values
        const submissionValues = {
          channelId: channelId,
          amount: channel?.price || 0, // Use channel price for the amount
          priceId: '1234567890',
          messagingEnabled: values.messagingEnabled,
          messagingPlatform: values.messagingEnabled ? values.messagingPlatform : undefined,
          messagingAccountId: values.messagingEnabled ? values.messagingAccountId : undefined,
          autoTradeEnabled: values.autoTradeEnabled,
          platformType: values.autoTradeEnabled ? values.platformType : undefined,
          platformUsername: values.autoTradeEnabled ? values.platformUsername : undefined,
          platformPassword: values.autoTradeEnabled ? values.platformPassword : undefined,
          platformToken: values.autoTradeEnabled ? values.platformToken : undefined,
        };

        const { clientSecret } = await createSubscription(submissionValues); // Backend call
        setClientSecret(clientSecret); // Pass session ID to next step
        handleNext();
      } catch (error) {
        console.error(error);
        setErrorIndex(0);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      {/* Show channel information */}
      {channelLoading ? (
        <Typography variant="h6" gutterBottom>
          Loading channel information...
        </Typography>
      ) : channelError ? (
        <Typography variant="h6" color="error" gutterBottom>
          Error loading channel information.
        </Typography>
      ) : (
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Typography variant="h6">Channel Information</Typography>
          <Typography>Asset Type: {channel?.assetType || 'N/A'}</Typography>
          <Typography>Trade Type: {channel?.tradeType || 'N/A'}</Typography>
          <Typography>Price: {channel?.price ? `$${channel.price}` : 'N/A'}</Typography>
        </Stack>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* Messaging Enabled */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  id="messagingEnabled"
                  name="messagingEnabled"
                  checked={formik.values.messagingEnabled}
                  onChange={formik.handleChange}
                />
              }
              label="Messaging Enabled"
            />
          </Grid>

          {/* Messaging Platform (Dropdown) */}
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel id="messagingPlatform-label">Messaging Platform</InputLabel>
              <FormControl fullWidth disabled={!formik.values.messagingEnabled}>
                <Select
                  labelId="messagingPlatform-label"
                  id="messagingPlatform"
                  name="messagingPlatform"
                  value={formik.values.messagingPlatform}
                  onChange={formik.handleChange}
                  error={formik.touched.messagingPlatform && Boolean(formik.errors.messagingPlatform)}
                >
                  <MenuItem value="Telegram">Telegram</MenuItem>
                  <MenuItem value="Whatsapp">Whatsapp</MenuItem>
                </Select>
                {formik.touched.messagingPlatform && formik.errors.messagingPlatform && (
                  <Typography variant="caption" color="error">
                    {formik.errors.messagingPlatform}
                  </Typography>
                )}
              </FormControl>
            </Stack>
          </Grid>

          {/* Messaging Account ID */}
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel>Messaging Account ID</InputLabel>
              <TextField
                id="messagingAccountId"
                name="messagingAccountId"
                value={formik.values.messagingAccountId}
                onChange={formik.handleChange}
                error={formik.touched.messagingAccountId && Boolean(formik.errors.messagingAccountId)}
                helperText={formik.touched.messagingAccountId && formik.errors.messagingAccountId}
                fullWidth
                disabled={!formik.values.messagingEnabled}
              />
            </Stack>
          </Grid>

          {/* Auto Trade Enabled */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  id="autoTradeEnabled"
                  name="autoTradeEnabled"
                  checked={formik.values.autoTradeEnabled}
                  onChange={formik.handleChange}
                />
              }
              label="Auto Trade Enabled"
            />
          </Grid>

          {/* Platform Type */}
          {formik.values.autoTradeEnabled && (
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel id="platformType-label">Platform Type</InputLabel>
                <FormControl fullWidth>
                  <Select
                    labelId="platformType-label"
                    id="platformType"
                    name="platformType"
                    value={formik.values.platformType}
                    onChange={formik.handleChange}
                    error={formik.touched.platformType && Boolean(formik.errors.platformType)}
                  >
                    <MenuItem value="Type1">Type1</MenuItem>
                    <MenuItem value="Type2">Type2</MenuItem>
                    {/* Add more platform types as needed */}
                  </Select>
                  {formik.touched.platformType && formik.errors.platformType && (
                    <Typography variant="caption" color="error">
                      {formik.errors.platformType}
                    </Typography>
                  )}
                </FormControl>
              </Stack>
            </Grid>
          )}

          {/* Platform Username */}
          {formik.values.autoTradeEnabled && (
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel>Platform Username</InputLabel>
                <TextField
                  id="platformUsername"
                  name="platformUsername"
                  value={formik.values.platformUsername}
                  onChange={formik.handleChange}
                  error={formik.touched.platformUsername && Boolean(formik.errors.platformUsername)}
                  helperText={formik.touched.platformUsername && formik.errors.platformUsername}
                  fullWidth
                />
              </Stack>
            </Grid>
          )}

          {/* Platform Password */}
          {formik.values.autoTradeEnabled && (
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel>Platform Password</InputLabel>
                <TextField
                  id="platformPassword"
                  name="platformPassword"
                  type="password"
                  value={formik.values.platformPassword}
                  onChange={formik.handleChange}
                  error={formik.touched.platformPassword && Boolean(formik.errors.platformPassword)}
                  helperText={formik.touched.platformPassword && formik.errors.platformPassword}
                  fullWidth
                />
              </Stack>
            </Grid>
          )}

          {/* Platform Token */}
          {formik.values.autoTradeEnabled && (
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel>Platform Token</InputLabel>
                <TextField
                  id="platformToken"
                  name="platformToken"
                  type="password"
                  value={formik.values.platformToken}
                  onChange={formik.handleChange}
                  error={formik.touched.platformToken && Boolean(formik.errors.platformToken)}
                  helperText={formik.touched.platformToken && formik.errors.platformToken}
                  fullWidth
                />
              </Stack>
            </Grid>
          )}

          {/* Submit Button */}
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ my: 3, ml: 1 }}
                  disabled={loading || channelLoading}
                >
                  {loading ? 'Submitting...' : 'Next'}
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

SubscriptionForm.propTypes = {
  handleNext: PropTypes.func.isRequired,
  setErrorIndex: PropTypes.func.isRequired,
  setClientSecret: PropTypes.func.isRequired,
};
