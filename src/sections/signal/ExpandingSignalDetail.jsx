// ExpandingSignalDetail.jsx

import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// Material-UI icons
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import TrendingUpOutlined from '@mui/icons-material/TrendingUpOutlined';
import MonetizationOnOutlined from '@mui/icons-material/MonetizationOnOutlined';
import SignalCellularAltOutlined from '@mui/icons-material/SignalCellularAltOutlined';

// Project Imports
import MainCard from 'components/MainCard';

// ==============================|| EXPANDING TABLE - SIGNAL DETAILS ||============================== //

export default function ExpandingSignalDetail({ data }) {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
      <Grid item xs={12} sm={5} md={4} xl={3.5}>
        <MainCard>
          <Chip
            label={data.status === 'active' ? 'Active' : 'Inactive'}
            color={data.status === 'active' ? 'success' : 'error'}
            size="small"
            sx={{
              position: 'absolute',
              right: -1,
              top: -1,
              borderRadius: '0 4px 0 4px',
            }}
          />
          <Stack spacing={2.5} alignItems="center">
            <SignalCellularAltOutlined
              style={{
                fontSize: 48,
                color: data.status === 'active' ? 'green' : 'red',
              }}
            />
            <Typography variant="h5">{data.symbol}</Typography>
            <Typography color="secondary">{data.assetType}</Typography>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={1.5}>
            <List>
              <ListItem>
                <TrendingUpOutlined />
                <ListItemText primary="Trade Type" secondary={data.tradeType} />
              </ListItem>
              <ListItem>
                <MonetizationOnOutlined />
                <ListItemText primary="Allocation %" secondary={`${data.allocation}%`} />
              </ListItem>
              <ListItem>
                <CalendarTodayOutlined />
                <ListItemText
                  primary="Expiration Time"
                  secondary={data.signalExpirationTime || 'N/A'}
                />
              </ListItem>
            </List>
          </Stack>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={7} md={8} xl={8.5}>
        <Stack spacing={2.5}>
          <MainCard title="Signal Details">
            <List>
              <ListItem divider={!downMD}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Buy/Sell</Typography>
                      <Typography>{data.buyOrSell}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Order Type</Typography>
                      <Typography>{data.orderType || 'N/A'}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem divider={!downMD}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Order Price</Typography>
                      <Typography>{data.orderPrice || 'N/A'}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Trailing Amount</Typography>
                      <Typography>{data.trailingAmount || 'N/A'}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem divider={!downMD}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Take Profit</Typography>
                      <Typography>{data.takeProfit || 'N/A'}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Stop Loss</Typography>
                      <Typography>{data.stopLoss || 'N/A'}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          </MainCard>
          <MainCard title="Additional Information">
            <Typography color="secondary">
              Signal created at:{' '}
              {data.createdAt !== 'N/A' ? new Date(data.createdAt).toLocaleString() : 'N/A'}
            </Typography>
          </MainCard>
        </Stack>
      </Grid>
    </Grid>
  );
}

ExpandingSignalDetail.propTypes = {
  data: PropTypes.object.isRequired,
};
