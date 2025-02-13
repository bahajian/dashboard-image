import { useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import { DebouncedInput } from 'components/third-party/react-table';
import ChannelCard from 'sections/channel/ChannelCard';
import FormChannelEditAdd from 'sections/channel/FormChannelEditAdd';

import usePagination from 'hooks/usePagination';
import { useGetMyChannels } from 'api/channel';

// assets
import PlusOutlined from '@ant-design/icons/PlusOutlined';

const allColumns = [
  { id: 1, header: 'ID' },
  { id: 2, header: 'Channel Name' },
  { id: 3, header: 'Asset Type' },
  { id: 4, header: 'Trade Type' },
  { id: 5, header: 'Platform' },
  { id: 6, header: 'Owner' },
  { id: 7, header: 'Price' },
  { id: 8, header: 'Status' }
];

function dataSort(data, sortBy) {
  return data.sort(function (a, b) {
    if (sortBy === 'Channel Name') return a.name.localeCompare(b.name);
    if (sortBy === 'Asset Type') return a.assetType.localeCompare(b.assetType);
    if (sortBy === 'Trade Type') return a.tradeType.localeCompare(b.tradeType);
    if (sortBy === 'Owner') return a.ownerSub.localeCompare(b.ownerSub);
    if (sortBy === 'Status') return a.status.localeCompare(b.status);
    if (sortBy === 'Price') {
      const aPrice = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
      const bPrice = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
      return aPrice - bPrice;
    }
    return 0;
  });
}

export default function ChannelCardPage() {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const { myChannels, myChannelsLoading, myChannelsError, revalidateChannels } = useGetMyChannels();

  const [sortBy, setSortBy] = useState('Default');
  const [globalFilter, setGlobalFilter] = useState('');
  const [userCard, setUserCard] = useState([]);
  const [page, setPage] = useState(1);
  const [channelModal, setChannelModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const handleChange = (event) => {
    setSortBy(event.target.value);
  };

  useEffect(() => {
    revalidateChannels(); // Ensure fresh data on mount
  }, [revalidateChannels]);

  useEffect(() => {
    if (!myChannelsLoading && myChannels && myChannels.length > 0) {
      const filteredData = myChannels.filter((value) =>
        globalFilter ? value.name.toLowerCase().includes(globalFilter.toLowerCase()) : true
      );
      const sortedData = sortBy !== 'Default' ? dataSort(filteredData, sortBy) : filteredData;
      setUserCard(sortedData.reverse());
    } else {
      setUserCard([]);
    }
  }, [globalFilter, myChannels, sortBy, myChannelsLoading]);

  const PER_PAGE = 6;
  const count = Math.ceil(userCard.length / PER_PAGE);
  const _DATA = usePagination(userCard, PER_PAGE);

  const handleChangePage = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const handleChannelSaved = (newOrUpdatedChannel) => {
    setUserCard((prevChannels) => {
      const existingChannelIndex = prevChannels.findIndex((ch) => ch.id === newOrUpdatedChannel.id);
      if (existingChannelIndex > -1) {
        // Update existing channel
        const updatedChannels = [...prevChannels];
        updatedChannels[existingChannelIndex] = newOrUpdatedChannel;
        return updatedChannels;
      }
      // Add new channel
      return [newOrUpdatedChannel, ...prevChannels];
    });
    setChannelModal(false);
  };

  const handleChannelDeleted = (channelId) => {
    setUserCard((prevChannels) => prevChannels.filter((ch) => ch.id !== channelId));
  };

  if (myChannelsError) {
    return <Typography color="error">Error loading your channels.</Typography>;
  }

  return (
    <>
      <Box sx={{ position: 'relative', marginBottom: 3 }}>
        <Stack direction="row" alignItems="center">
          <Stack
            direction={matchDownSM ? 'column' : 'row'}
            sx={{ width: '100%' }}
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <DebouncedInput
              value={globalFilter ?? ''}
              onFilterChange={(value) => setGlobalFilter(String(value))}
              placeholder={`Search ${userCard.length} records...`}
            />
            <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                  value={sortBy}
                  onChange={handleChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography variant="subtitle1">Sort By</Typography>;
                    }
                    return <Typography variant="subtitle2">Sort by ({sortBy})</Typography>;
                  }}
                >
                  <MenuItem value="Default">Default</MenuItem>
                  {allColumns.map((column) => (
                    <MenuItem key={column.id} value={column.header}>
                      {column.header}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<PlusOutlined />}
                onClick={() => {
                  setSelectedChannel(null); // Reset for new channel
                  setChannelModal(true);
                }}
              >
                Add Channel
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Grid container spacing={3}>
        {!myChannelsLoading && userCard.length > 0 ? (
          _DATA.currentData().map((channel) => (
            <Slide key={channel.id?.toString()} direction="up" in={true} timeout={50}>
              <Grid item xs={12} sm={6} lg={4}>
                <ChannelCard channel={channel} onChannelDeleted={handleChannelDeleted} />
              </Grid>
            </Slide>
          ))
        ) : (
          <EmptyUserCard title={myChannelsLoading ? 'Loading...' : 'You have not created any channel yet.'} />
        )}
      </Grid>
      <Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
        <Pagination
          sx={{ '& .MuiPaginationItem-root': { my: 0.5 } }}
          count={count}
          size="medium"
          page={page}
          showFirstButton
          showLastButton
          variant="combined"
          color="primary"
          onChange={handleChangePage}
        />
      </Stack>
      <FormChannelEditAdd
        open={channelModal}
        onClose={() => setChannelModal(false)}
        channel={selectedChannel}
        onSave={handleChannelSaved}
      />
    </>
  );
}
