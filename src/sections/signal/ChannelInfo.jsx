// ChannelInfo.jsx

import { useParams } from 'react-router-dom';
import { Grid, Stack, Typography, Chip, Avatar, Box, CircularProgress } from '@mui/material';
import MainCard from 'components/MainCard';
import { useGetChannelById } from 'api/channel';

export default function ChannelInfo() {
  const { channelId } = useParams();
  const { channelLoading, channel, channelError } = useGetChannelById(channelId);

  if (channelLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh">
        <CircularProgress />
      </Box>
    );
  }

  if (channelError) {
    return (
      <Box p={2}>
        <Typography variant="h6" color="error">
          Error loading channel information: {channelError.message}
        </Typography>
      </Box>
    );
  }

  return (
    channel && (
      <MainCard sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  alt={channel.name}
                  src={channel.picturePath || '/path/to/default-avatar.png'}
                  sx={{ width: 56, height: 56 }}
                />
                <Typography variant="h5">{channel.name || 'N/A'}</Typography>
              </Stack>
              <Typography variant="body1">
                <strong>Description:</strong> {channel.description || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Asset Type:</strong> {channel.assetType || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Trade Type:</strong> {channel.tradeType || 'N/A'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Platforms:
                </Typography>
                {channel.platforms && channel.platforms.length > 0 ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {channel.platforms.map((platform) => (
                      <Chip key={platform} label={platform} />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2">No platforms assigned.</Typography>
                )}
              </Box>
              <Typography variant="body1">
                <strong>Price:</strong> ${channel.price !== undefined ? channel.price : 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {channel.status || 'N/A'}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
    )
  );
}
