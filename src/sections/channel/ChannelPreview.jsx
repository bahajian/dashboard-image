import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useGetChannelById } from 'api/channel';

// Material-UI components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

// Project imports
import MainCard from 'components/MainCard';
import FormChannelEditAdd from './FormChannelEditAdd';

export default function ChannelPreview() {
  const { channelId } = useParams(); // Extract channelId from URL
  const { channel, channelLoading, channelError } = useGetChannelById(channelId);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (channelLoading) {
    return (
      <Box sx={{ p: 5 }}>
        <Stack direction="row" justifyContent="center">
          <Typography>Loading channel details...</Typography>
        </Stack>
      </Box>
    );
  }

  if (channelError) {
    return (
      <Box sx={{ p: 5 }}>
        <Stack direction="row" justifyContent="center">
          <Typography color="error">Failed to load channel details. Please try again later.</Typography>
        </Stack>
      </Box>
    );
  }

  if (!channel) {
    return (
      <Box sx={{ p: 5 }}>
        <Stack direction="row" justifyContent="center">
          <Typography>Channel not found.</Typography>
        </Stack>
      </Box>
    );
  }

  const avatarSrc = channel.picturePath || '/path/to/default-avatar.png';
  const createdDate = channel.createdAt ? new Date(channel.createdAt).toLocaleDateString() : 'N/A';
  const platforms = channel.platforms || [];
  const messagingEnabled = channel.messagingEnabled || false;

  const handleDelete = async () => {
    try {
      // Implement your delete logic here, e.g., call an API to delete the channel
      // await deleteChannel(channelId);
      console.log('Deleting channel:', channelId);
      setDeleteDialogOpen(false);
      // Optionally, redirect or refresh the page after deletion
    } catch (error) {
      console.error('Error deleting channel:', error);
      // Optionally, show an error snackbar or message
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Channel Details</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => setEditModalOpen(true)}>
            Edit
          </Button>
          <Button variant="contained" color="error" onClick={() => setDeleteDialogOpen(true)}>
            Delete
          </Button>
        </Stack>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Basic Details */}
        <Grid item xs={12} sm={8} xl={9}>
          <MainCard title="Basic Information">
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar alt={channel.name} src={avatarSrc} sx={{ width: 56, height: 56 }} />
                <Typography variant="h5">{channel.name}</Typography>
              </Stack>
              <Typography variant="body1">
                <strong>Asset Type:</strong> {channel.assetType}
              </Typography>
              <Typography variant="body1">
                <strong>Trade Type:</strong> {channel.tradeType}
              </Typography>
              <Typography variant="body1">
                <strong>Price:</strong> ${channel.price}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {channel.status}
              </Typography>
              <Typography variant="body1">
                <strong>Created On:</strong> {createdDate}
              </Typography>
            </Stack>
          </MainCard>
        </Grid>

        {/* Additional Info */}
        <Grid item xs={12} sm={4} xl={3}>
          <MainCard title="Additional Information">
            <Stack spacing={2}>
              {/* Platforms */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Platforms:
                </Typography>
                {platforms.length > 0 ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {platforms.map((platform) => (
                      <Chip key={platform} label={platform} />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2">No platforms assigned.</Typography>
                )}
              </Box>

              {/* Payment Price ID */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Payment Price ID:
                </Typography>
                <Typography variant="body2">
                  {channel.paymentPriceId ? channel.paymentPriceId : 'N/A'}
                </Typography>
              </Box>

              {/* Messaging Information */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Messaging:
                </Typography>
                <Typography variant="body2">
                  <strong>Enabled:</strong> {messagingEnabled ? 'Yes' : 'No'}
                </Typography>
                {messagingEnabled && (
                  <Box sx={{ mt: 1, pl: 2 }}>
                    <Typography variant="body2">
                      <strong>Platform:</strong> {channel.messagingPlatform || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Account ID:</strong> {channel.messagingAccountId || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Channel ID:</strong> {channel.messagingChannelId || 'N/A'}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Stack>
          </MainCard>
        </Grid>
      </Grid>

      {/* Edit Modal */}
      <FormChannelEditAdd
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        channel={channel}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this channel? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

ChannelPreview.propTypes = {
  // Define prop types if necessary
};
