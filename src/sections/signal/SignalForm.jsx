// src/components/SignalForm.jsx

import React, { useState, useEffect } from 'react';
import {
  Grid,
  Stack,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useAutocomplete, useSymbolDetails, usePriceAndVolume } from 'api/market';
import AutocompleteSymbolSelector from './AutocompleteSymbolSelector';
import PropTypes from 'prop-types';

export default function SignalForm({ formik }) {
  const { values, touched, errors, setFieldValue, getFieldProps } = formik;

  // States for Autocomplete
  const [inputValue, setInputValue] = useState(values.name || '');
  const [selectedOption, setSelectedOption] = useState(null);

  // Autocomplete fetch
  const effectiveQuery = inputValue.trim() ? inputValue : null;
  const { results = [], autocompleteLoading } = useAutocomplete(effectiveQuery);

  // Symbol details fetch
  const effectiveSymbol = selectedOption?.symbol?.trim() || null;
  const { details, detailsLoading } = useSymbolDetails(effectiveSymbol);

  // Price and Volume fetch
  const { price, volume, priceVolumeLoading } = usePriceAndVolume(effectiveSymbol);

  // Sync details and price into Formik
  useEffect(() => {
    if (!details && price === null) {
      console.log('No details and no price available.');
      return;
    }

    const { logo = '' } = details || {};

    if (logo && values.logoUrl !== logo) {
      console.log('Updating logoUrl:', logo);
      setFieldValue('logoUrl', logo);
    }

    if (price !== null && values.currentPrice !== price) {
      console.log('Updating currentPrice:', price);
      setFieldValue('currentPrice', price);
    }
  }, [details, price, values.logoUrl, values.currentPrice, setFieldValue]);

  // Handle input change in Autocomplete
  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  // Handle option selection in Autocomplete
  const handleChange = (event, newValue) => {
    if (typeof newValue === 'object' && newValue !== null) {
      setSelectedOption(newValue);
      setInputValue(newValue.description || '');
      setFieldValue('symbol', newValue.symbol);
      setFieldValue('name', newValue.description);
    } else {
      // FreeSolo input or cleared
      setSelectedOption(null);
      setInputValue(typeof newValue === 'string' ? newValue : '');
      setFieldValue('symbol', typeof newValue === 'string' ? newValue : '');
      setFieldValue('name', '');
      setFieldValue('logoUrl', '');
      setFieldValue('currentPrice', '');
    }
  };

  return (
    <Grid container spacing={3}>
      {/* NAME (Autocomplete) */}
      <Grid item xs={12} sm={6}>
        <Stack spacing={1}>
          <Typography>Name</Typography>
          <AutocompleteSymbolSelector
            value={selectedOption}
            inputValue={inputValue}
            onChange={handleChange}
            onInputChange={handleInputChange}
            options={results}
            loading={autocompleteLoading || detailsLoading || priceVolumeLoading}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
            logoUrl={values.logoUrl} // Pass logoUrl here
          />
        </Stack>
      </Grid>

      {/* SYMBOL FIELD */}
      <Grid item xs={12} sm={6}>
        <Stack spacing={1}>
          <Typography>Symbol</Typography>
          <TextField
            fullWidth
            placeholder="Enter Symbol"
            {...getFieldProps('symbol')}
            value={values.symbol}
            error={Boolean(touched.symbol && errors.symbol)}
            helperText={touched.symbol && errors.symbol}
            disabled={Boolean(selectedOption)} // Lock if an item is selected
          />
        </Stack>
      </Grid>

      {/* CURRENT PRICE FIELD */}
      <Grid item xs={12} sm={6}>
        <Stack spacing={1}>
          <Typography>Current Price</Typography>
          <TextField
            fullWidth
            value={values.currentPrice || ''}
            placeholder="Current price"
            InputProps={{ readOnly: true }}
          />
        </Stack>
      </Grid>

      {/* ASSET TYPE */}
      <Grid item xs={12} sm={6}>
        <Stack spacing={1}>
          <Typography>Asset Type</Typography>
          <FormControl
            fullWidth
            error={Boolean(touched.assetType && errors.assetType)}
          >
            <InputLabel id="asset-type-label">Asset Type</InputLabel>
            <Select labelId="asset-type-label" {...getFieldProps('assetType')}>
              <MenuItem value="Crypto">Crypto</MenuItem>
              <MenuItem value="Stock">Stock</MenuItem>
              <MenuItem value="ETF">ETF</MenuItem>
              <MenuItem value="FX">FX</MenuItem>
              <MenuItem value="Future">Future</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Grid>

      {/* TRADE TYPE */}
      <Grid item xs={12} sm={6}>
        <Stack spacing={1}>
          <Typography>Trade Type</Typography>
          <FormControl
            fullWidth
            error={Boolean(touched.tradeType && errors.tradeType)}
          >
            <InputLabel id="trade-type-label">Trade Type</InputLabel>
            <Select labelId="trade-type-label" {...getFieldProps('tradeType')}>
              <MenuItem value="Long">Long</MenuItem>
              <MenuItem value="Short">Short</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Grid>

      {/* BUY OR SELL */}
      <Grid item xs={12} sm={6}>
        <Stack spacing={1}>
          <Typography>Buy or Sell</Typography>
          <FormControl
            fullWidth
            error={Boolean(touched.buyOrSell && errors.buyOrSell)}
          >
            <InputLabel id="buy-sell-label">Buy or Sell</InputLabel>
            <Select labelId="buy-sell-label" {...getFieldProps('buyOrSell')}>
              <MenuItem value="Buy">Buy</MenuItem>
              <MenuItem value="Sell">Sell</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Grid>

      {/* TAKE PROFIT */}
      <Grid item xs={12} sm={6}>
        <Stack spacing={1}>
          <Typography>Take Profit</Typography>
          <TextField
            fullWidth
            type="number"
            placeholder="Enter Take Profit"
            {...getFieldProps('takeProfit')}
            value={values.takeProfit}
            error={Boolean(touched.takeProfit && errors.takeProfit)}
            helperText={touched.takeProfit && errors.takeProfit}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Stack>
      </Grid>

      {/* STOP LOSS */}
      <Grid item xs={12} sm={6}>
        <Stack spacing={1}>
          <Typography>Stop Loss</Typography>
          <TextField
            fullWidth
            type="number"
            placeholder="Enter Stop Loss"
            {...getFieldProps('stopLoss')}
            value={values.stopLoss}
            error={Boolean(touched.stopLoss && errors.stopLoss)}
            helperText={touched.stopLoss && errors.stopLoss}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Stack>
      </Grid>

      {/* ALLOCATION PERCENTAGE */}
      <Grid item xs={6}>
        <Stack spacing={1}>
          <Typography>Allocation Percentage</Typography>
          <TextField
            fullWidth
            type="number"
            placeholder="Enter Allocation Percentage"
            {...getFieldProps('allocationPercentage')}
            value={values.allocationPercentage}
            error={Boolean(touched.allocationPercentage && errors.allocationPercentage)}
            helperText={touched.allocationPercentage && errors.allocationPercentage}
            inputProps={{ min: 0, max: 100, step: 0.01 }}
          />
        </Stack>
      </Grid>

      {/* SIGNAL EXPIRATION TIME */}
      <Grid item xs={6}>
        <Stack spacing={1}>
          <Typography>Signal Expiration Time</Typography>
          <TextField
            fullWidth
            type="datetime-local"
            {...getFieldProps('signalExpirationTime')}
            value={values.signalExpirationTime}
            error={Boolean(touched.signalExpirationTime && errors.signalExpirationTime)}
            helperText={touched.signalExpirationTime && errors.signalExpirationTime}
          />
        </Stack>
      </Grid>
    </Grid>
  );
}

SignalForm.propTypes = {
  formik: PropTypes.object.isRequired,
};
