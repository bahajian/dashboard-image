import PropTypes from 'prop-types';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm'; // Custom form for Stripe's Payment Element

// Load the Stripe publishable key
const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage({ clientSecret, handleNext }) {
  // Validate that the clientSecret is provided
  if (!clientSecret) {
    console.error('Missing clientSecret for Stripe Elements');
    return <div>Error: Unable to load payment page</div>;
  }

  // Options for the Stripe Elements component
  const options = { clientSecret };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm handleNext={handleNext} />
    </Elements>
  );
}

PaymentPage.propTypes = {
  clientSecret: PropTypes.string.isRequired, // Correct prop name and type
  handleNext: PropTypes.func.isRequired,
};
