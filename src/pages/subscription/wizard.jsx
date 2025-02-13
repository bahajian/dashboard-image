// material-ui
import Grid from '@mui/material/Grid';

import SubscriptionWizard from 'sections/subscription/wizard';

// ==============================|| FORMS WIZARD ||============================== //

export default function FormsWizard() {
  return (
    <Grid container spacing={2.5} justifyContent="center">
      <Grid item xs={12} md={6} lg={7}>
        <SubscriptionWizard />
      </Grid>
    </Grid>
  );
}
