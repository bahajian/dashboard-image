import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';

// assets
import defaultChannelImage from 'assets/images/users/default.png';

export default function SubscribeChannelCard({ channel, onSubscribe, loading }) {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubscribeClick = () => {
    navigate(`/subscribe/${channel.id}/`); // Navigate to the subscription page
  };

  return (
    <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
      <Grid container spacing={2.25}>
        <Grid item xs={12}>
          <List sx={{ width: 1, p: 0 }}>
            <ListItem disablePadding>
              <ListItemAvatar>
                <Avatar
                  alt={channel.name}
                  src={channel.picturePath || defaultChannelImage}
                />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle1">{channel.name}</Typography>}
                secondary={
                  <Typography variant="caption" color="secondary">
                    Status: {channel.status}
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {channel.assetType && (
          <>
            <Grid item xs={12}>
              <Typography>Asset Type: {channel.assetType}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </>
        )}
        {channel.tradeType && (
          <>
            <Grid item xs={12}>
              <Typography>Trade Type: {channel.tradeType}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </>
        )}
        {Array.isArray(channel.platforms) && channel.platforms.length > 0 && (
          <>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Platforms:
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  listStyle: 'none',
                  p: 0.5,
                  m: 0
                }}
                component="ul"
              >
                {channel.platforms.map((plat, index) => (
                  <ListItem disablePadding key={index} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                    <Chip color="secondary" variant="outlined" size="small" label={plat} />
                  </ListItem>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </>
        )}
        {channel.price && (
          <Grid item xs={12}>
            <Typography>Price: ${channel.price}</Typography>
          </Grid>
        )}
      </Grid>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        justifyContent="space-between"
        sx={{ mt: 'auto', mb: 0, pt: 2.25 }}
      >
        {channel.createdAt && (
          <Typography variant="caption" color="secondary">
            Created at {new Date(channel.createdAt).toLocaleDateString()}
          </Typography>
        )}
        <Button variant="outlined" size="small" onClick={handleSubscribeClick} disabled={loading}>
          Subscribe
        </Button>
      </Stack>
    </MainCard>
  );
}

SubscribeChannelCard.propTypes = {
  channel: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    assetType: PropTypes.string,
    tradeType: PropTypes.string,
    platforms: PropTypes.arrayOf(PropTypes.string),
    price: PropTypes.number,
    status: PropTypes.string,
    createdAt: PropTypes.string,
    picturePath: PropTypes.string
  }).isRequired,
  onSubscribe: PropTypes.func, // Since onSubscribe is no longer used, you can make it optional or remove it
  loading: PropTypes.bool
};
