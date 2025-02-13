import Grid from '@mui/material/Grid';
import { loadStripe } from '@stripe/stripe-js';
import MainCard from 'components/MainCard';
import React from 'react';
import SubscribeChannelCard from 'sections/channel/SubscribeChannelCard';

// Import the channel data access hook
import { useGetChannels } from 'api/channel';
import { useGetProfile } from 'api/profile'; // Import the profile hook

const stripePromise = loadStripe(
  'pk_live_51QULjG07n7BY3VpocvtX5kNskuA0idIfDnO6GlMo6rcETMFcN86UC1G2uFhUXhFgnMAVgEtKAmjrPMU9o1zNkeLh00SgVJIPjw'
);

export default function LandingPage() {
  const { channels, channelsLoading, channelsError } = useGetChannels();
  const { profile, profileLoading } = useGetProfile(); // Fetch user profile
  const [loading, setLoading] = React.useState(false);

  console.log(channels);

  const handleSubscribe = async (channelId, priceId) => {
    setLoading(true);
    try {
      const response = await fetch('https://api.app.signalify.co/api/payment/subscribe', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('serviceToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ channelId, priceId })
      });

      if (!response.ok) {
        throw new Error('Subscription request failed');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      // Redirect to Stripe Checkout
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error during subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <MainCard title="Landing Card">
        <div>Loading profile...</div>
      </MainCard>
    );
  }

  if (profile?.role !== 'INVESTOR') {
    return (
      <MainCard title="Landing Card">
        <div>Welcome to Signalify, start by creating a channel and provide signals responsibly.</div>
      </MainCard>
    );
  }

  if (channelsLoading) {
    return (
      <MainCard title="Landing Card">
        <div>Loading channels...</div>
      </MainCard>
    );
  }

  if (channelsError) {
    return (
      <MainCard title="Landing Card">
        <div>Error loading channels</div>
      </MainCard>
    );
  }

  return (
    <MainCard title="Landing Card">
      <Grid container spacing={3}>
        {channels.map((channel) => (
          <Grid item xs={12} sm={6} md={4} key={channel.id}>
            <SubscribeChannelCard channel={channel} onSubscribe={handleSubscribe} loading={loading} />
          </Grid>
        ))}
      </Grid>
    </MainCard>
  );
}
