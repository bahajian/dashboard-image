import { useRef } from 'react';
import { Outlet } from 'react-router';

// material-ui
import Grid from '@mui/material/Grid';

// project import
import ProfileTabs from 'sections/profile/user/ProfileTabs';

// ==============================|| PROFILE - USER ||============================== //

export default function UserProfile() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <ProfileTabs focusInput={focusInput} />
      </Grid>
      <Grid item xs={12} md={9}>
        <Outlet context={inputRef} />
      </Grid>
    </Grid>
  );
}
