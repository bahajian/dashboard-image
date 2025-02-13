import PropTypes from 'prop-types';
import { Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function VerificationPage({ success }) {
  const navigate = useNavigate();

  const handleRedirect = () => {
    if (success) {
      navigate('/home');
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        {success ? 'Payment Successful!' : 'Payment Failed'}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {success
          ? 'Thank you for your subscription. Your payment was successful.'
          : 'Unfortunately, your payment could not be processed. Please try again.'}
      </Typography>
      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={handleRedirect}>
          {success ? 'Go to Dashboard' : 'Try Again'}
        </Button>
      </Stack>
    </>
  );
}

VerificationPage.propTypes = {
  success: PropTypes.bool.isRequired,
};
