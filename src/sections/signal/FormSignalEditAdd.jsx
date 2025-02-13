// src/components/FormSignalEditAdd.jsx

import PropTypes from 'prop-types';
import React from 'react';
import { Modal, DialogTitle, DialogActions, Divider, Button, Box } from '@mui/material';
import { Formik, Form } from 'formik';
import SimpleBar from 'components/third-party/SimpleBar';
import { openSnackbar } from 'api/snackbar';
import { createSignal, updateSignal } from 'api/signal';
import { SignalSchema } from './SignalFormSchema';
import SignalForm from './SignalForm';

export default function FormSignalEditAdd({ open, modalToggler, signal, channelId, revalidateSignals }) {
  const closeModal = () => modalToggler(false);

  const initialValues = {
    id: signal?.id || '', // Include `id` in initialValues for updates
    channelId: signal?.channelId || channelId || '',
    symbol: signal?.symbol || '',
    assetType: signal?.assetType || '',
    tradeType: signal?.tradeType || '',
    buyOrSell: signal?.buyOrSell || 'Buy',
    allocationPercentage: signal?.allocationPercentage ?? '',
    signalExpirationTime:
      signal?.signalExpirationTime && !isNaN(new Date(signal.signalExpirationTime).getTime())
        ? new Date(signal.signalExpirationTime).toISOString().slice(0, 16)
        : '',
    takeProfit: signal?.takeProfit ?? '',
    stopLoss: signal?.stopLoss ?? '',

    // Added these three so Autocomplete + details can function
    name: signal?.name || '',
    logoUrl: signal?.logoUrl || '',
    currentPrice: signal?.currentPrice || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        ...values,
        // Convert numeric fields properly
        allocationPercentage: Number(values.allocationPercentage),
        signalExpirationTime: values.signalExpirationTime
          ? new Date(values.signalExpirationTime).toISOString()
          : null,
        takeProfit: values.takeProfit ? Number(values.takeProfit) : null,
        stopLoss: values.stopLoss ? Number(values.stopLoss) : null,
      };

      // If you DO NOT store name, logoUrl, or currentPrice in your backend,
      // you can remove them from the payload with something like:
      //   delete payload.name;
      //   delete payload.logoUrl;
      //   delete payload.currentPrice;

      if (signal?.id) {
        // Update existing signal
        await updateSignal(payload);
        openSnackbar({
          open: true,
          message: 'Signal updated successfully.',
          variant: 'alert',
          alert: { color: 'success' }
        });
      } else {
        // Create new signal
        await createSignal(payload);
        openSnackbar({
          open: true,
          message: 'Signal created successfully.',
          variant: 'alert',
          alert: { color: 'success' }
        });
      }

      // Revalidate the table or data after creation/update
      if (typeof revalidateSignals === 'function') {
        await revalidateSignals();
      }

      setSubmitting(false);
      closeModal();
    } catch (error) {
      console.error('Error during form submission:', error);
      openSnackbar({
        open: true,
        message: 'An error occurred. Please try again.',
        variant: 'alert',
        alert: { color: 'error' }
      });
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={closeModal}
      aria-labelledby="form-modal-title"
      aria-describedby="form-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '80%', md: '70%' },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <SimpleBar>
          <Formik
            initialValues={initialValues}
            validationSchema={SignalSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {(formik) => (
              <Form>
                <DialogTitle>{signal?.id ? 'Edit Signal' : 'New Signal'}</DialogTitle>
                <Divider />
                <SignalForm formik={formik} />
                <Divider />
                <DialogActions>
                  <Button color="error" onClick={closeModal} disabled={formik.isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
                    {signal?.id ? 'Save' : 'Submit'}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </SimpleBar>
      </Box>
    </Modal>
  );
}

FormSignalEditAdd.propTypes = {
  open: PropTypes.bool.isRequired,
  modalToggler: PropTypes.func.isRequired,
  signal: PropTypes.object,
  channelId: PropTypes.string.isRequired,
  revalidateSignals: PropTypes.func, // now accepted as a prop
};
