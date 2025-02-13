import { useNavigate, useSearchParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// Third party
import OtpInput from 'react-otp-input';
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import useAuth from 'hooks/useAuth';
import AnimateButton from 'components/@extended/AnimateButton';

import { openSnackbar } from 'api/snackbar';

// assets
import BugFilled from '@ant-design/icons/BugFilled';

// ============================|| AWS - CODE VERIFICATION ||============================ //

const AuthCodeVerification = () => {
  const { codeVerification, resendConfirmationCode } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const auth = searchParams.get('auth'); // get auth and set route based on that

  return (
    <>
      <Formik
        initialValues={{
          otp: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          otp: Yup.string().length(6, 'OTP must be exactly 6 digits').required('Verification Code is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (codeVerification) {
              // set code verification method here
              await codeVerification(values.otp)
                .then(() => {
                  setSubmitting(false);
                  openSnackbar({
                    open: true,
                    message: 'Account verify successfully.',
                    variant: 'alert',

                    alert: {
                      color: 'success'
                    }
                  });
                  setTimeout(() => {
                    navigate(auth ? `/${auth}/login?auth=aws` : '/login', { replace: true });
                  }, 1500);

                  // WARNING: do not set any formik state here as formik might be already destroyed here. You may get following error by doing so.
                  // Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application.
                  // To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
                  // github issue: https://github.com/formium/formik/issues/2430
                })
                .catch((err) => {
                  setStatus({ success: false });
                  setErrors({ submit: err || JSON.stringify(err) });
                  setSubmitting(false);
                });
            }
          } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleSubmit, touched, values, setFieldValue, isSubmitting }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="verification-code">Enter Verification Code</InputLabel>
                  <Box
                    sx={{
                      '& input:focus-visible': {
                        outline: 'none !important',
                        borderColor: `${theme.palette.primary.main} !important`,
                        boxShadow: `${theme.customShadows.primary} !important`
                      }
                    }}
                  >
                    <OtpInput
                      value={values.otp}
                      onChange={(otp) => setFieldValue('otp', otp)}
                      numInputs={6}
                      inputType="tel"
                      containerStyle={{ justifyContent: 'space-between', margin: -8 }}
                      shouldAutoFocus
                      renderInput={(props) => <input {...props} />}
                      inputStyle={{
                        width: '100%',
                        margin: '8px',
                        padding: '10px',
                        border: '1px solid',
                        outline: 'none',
                        borderColor: touched.otp && errors.otp ? theme.palette.error.main : theme.palette.divider,
                        borderRadius: 4
                      }}
                    />
                  </Box>
                </Stack>
                {touched.otp && errors.otp && (
                  <FormHelperText error id="helper-text-password-reset">
                    {errors.otp}
                  </FormHelperText>
                )}
              </Grid>
              {touched && errors && errors.submit && (
                <Grid item xs={12}>
                  <Alert color="error" variant="border" icon={<BugFilled twoToneColor={theme.palette.error.main} />}>
                    {errors?.submit}
                  </Alert>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Verify Account
                  </Button>
                </AnimateButton>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                  <Typography>Did not receive the email? Check spam folder or</Typography>
                  {/* need to impletement resend code */}
                  <Typography
                    onClick={resendConfirmationCode}
                    variant="body1"
                    sx={{ textDecoration: 'none', cursor: 'pointer' }}
                    color="primary"
                  >
                    Resend code
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthCodeVerification;
