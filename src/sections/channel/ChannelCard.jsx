import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// project imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import FormChannelEditAdd from './FormChannelEditAdd';
import { deleteChannel } from 'api/channel';

// assets
import MoreOutlined from '@ant-design/icons/MoreOutlined';
import defaultChannelImage from 'assets/images/users/default.png';

export default function ChannelCard({ channel, onChannelDeleted }) {
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [channelData, setChannelData] = useState(channel);

  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handlePreviewClick = () => {
    navigate(`/channel/${channelData.id}`);
  };

  const navigateToSignals = () => {
    navigate(`/channel/${channelData.id}/signal`);
  };

  const handleDelete = async () => {
    try {
      await deleteChannel(channelData.id); // Call the API to delete the channel
      setDeleteDialogOpen(false);
      onChannelDeleted(channelData.id); // Notify parent to remove the channel from the list
    } catch (error) {
      console.error('Error deleting channel:', error);
    }
  };

  const handleSave = (updatedChannel) => {
    setChannelData(updatedChannel);
    setEditModalOpen(false);
  };

  const avatarSrc = channelData.picturePath || defaultChannelImage;
  const createdDate = channelData.createdAt ? new Date(channelData.createdAt).toLocaleDateString() : 'N/A';

  return (
    <>
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container spacing={2.25}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem
                disablePadding
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="options" color="secondary" onClick={handleMenuOpen}>
                      <MoreOutlined style={{ fontSize: '1.15rem' }} />
                    </IconButton>
                    <Menu
                      anchorEl={menuAnchor}
                      open={Boolean(menuAnchor)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => setEditModalOpen(true)}>Edit</MenuItem>
                      <MenuItem onClick={() => setDeleteDialogOpen(true)}>Delete</MenuItem>
                    </Menu>
                  </>
                }
              >
                <ListItemAvatar>
                  <Avatar alt={channelData.name} src={avatarSrc} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1">{channelData.name}</Typography>}
                  secondary={
                    <Typography variant="caption" color="secondary">
                      Status: {channelData.status || 'N/A'}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>
          {channelData.assetType && (
            <Grid item xs={12}>
              <Typography>Asset Type: {channelData.assetType}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {channelData.tradeType && (
            <Grid item xs={12}>
              <Typography>Trade Type: {channelData.tradeType}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {Array.isArray(channelData.platforms) && channelData.platforms.length > 0 && (
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
                  m: 0,
                }}
                component="ul"
              >
                {channelData.platforms.map((plat, index) => (
                  <Chip key={index} color="secondary" variant="outlined" size="small" label={plat} />
                ))}
              </Box>
            </Grid>
          )}

          {channelData.price && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography>Price: ${channelData.price}</Typography>
              </Grid>
            </>
          )}
        </Grid>
        <Stack
          direction="row"
          className="hideforPDf"
          alignItems="center"
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: 'auto', mb: 0, pt: 2.25 }}
        >
          <Typography variant="caption" color="secondary">
            Created on {createdDate}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small" onClick={handlePreviewClick}>
              Preview
            </Button>
            <Button variant="contained" size="small" onClick={navigateToSignals}>
              Signals
            </Button>
          </Stack>
        </Stack>
      </MainCard>

      {/* Edit Modal */}
      <FormChannelEditAdd
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        channel={channelData}
        onSave={handleSave}
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
    </>
  );
}

ChannelCard.propTypes = {
  channel: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    assetType: PropTypes.string,
    tradeType: PropTypes.string,
    platforms: PropTypes.arrayOf(PropTypes.string),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    paymentPriceId: PropTypes.string,
    status: PropTypes.string,
    createdAt: PropTypes.string,
    picturePath: PropTypes.string,
  }),
  onChannelDeleted: PropTypes.func.isRequired, // Callback to notify parent about channel deletion
};
