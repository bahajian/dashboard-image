// src/components/AutocompleteSymbolSelector.jsx

import React from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Avatar,
  Box,
} from '@mui/material';
import PropTypes from 'prop-types';

export default function AutocompleteSymbolSelector({
  value,            // The selected option (object or null)
  inputValue,       // The current input value (string)
  onChange,         // Callback when an option is selected
  onInputChange,    // Callback when the input value changes
  options,          // Array of autocomplete options
  loading,          // Boolean indicating if loading
  error,            // Boolean indicating if there's an error
  helperText,       // Helper text for error display
  logoUrl,          // URL for the logo image
}) {
  return (
    <Autocomplete
      freeSolo
      // Controlled props
      value={value}
      inputValue={inputValue}
      onChange={onChange}
      onInputChange={onInputChange}
      options={options}
      loading={loading}
      // Compare items by 'symbol'
      isOptionEqualToValue={(option, val) => option.symbol === val.symbol}
      // Label each option as "Description (Symbol)"
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        const { description, symbol } = option;
        return description && symbol ? `${description} (${symbol})` : symbol || '';
      }}
      // Render each option with an Avatar
      renderOption={(props, option) => (
        <li {...props}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
              {option.description?.[0]?.toUpperCase() || '?'}
            </Avatar>
            {option.description} ({option.symbol})
          </Box>
        </li>
      )}
      // Render the input field with optional logo
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search for a symbol"
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            startAdornment: logoUrl ? (
              <Box
                component="img"
                src={logoUrl}
                alt="Symbol Logo"
                sx={{
                  width: 24,
                  height: 24,
                  mr: 1,
                  borderRadius: '4px',
                  objectFit: 'cover',
                }}
              />
            ) : null,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

AutocompleteSymbolSelector.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  inputValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  logoUrl: PropTypes.string,
};

AutocompleteSymbolSelector.defaultProps = {
  value: null,
  loading: false,
  error: false,
  helperText: '',
  logoUrl: '',
};
