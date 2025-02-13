import PropTypes from 'prop-types';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { Button, Typography, Stack, CircularProgress } from '@mui/material';

export default function CheckoutForm({ handleNext }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again later.');
      setLoading(false);
      return;
    }

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', // Prevents full-page redirection unless necessary
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
    } else {
      handleNext(); // Move to the next step (success or verification)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>
        Complete Your Payment
      </Typography>
      <PaymentElement />
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button variant="contained" type="submit" disabled={!stripe || loading}>
          {loading ? <CircularProgress size={24} /> : 'Pay Now'}
        </Button>
      </Stack>
    </form>
  );
}

CheckoutForm.propTypes = {
  handleNext: PropTypes.func.isRequired,
};
