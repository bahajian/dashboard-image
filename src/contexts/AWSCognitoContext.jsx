import { createContext, useEffect, useReducer } from 'react';
import { jwtDecode } from 'jwt-decode';
import { CognitoUser, CognitoUserPool, CognitoUserAttribute, AuthenticationDetails } from 'amazon-cognito-identity-js';

// project imports
import Loader from 'components/Loader';
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';
import { insertProfile, updateProfile } from 'api/profile'; // Import backend API methods

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};




export const userPool = new CognitoUserPool({
  UserPoolId: window.env.VITE_APP_AWS_POOL_ID || '',
  ClientId: window.env.VITE_APP_AWS_APP_CLIENT_ID || ''
});

const setSession = (serviceToken) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
  } else {
    localStorage.removeItem('serviceToken');
  }
};

// ==============================|| AWS COGNITO - CONTEXT & PROVIDER ||============================== //

const AWSCognitoContext = createContext(null);

export const AWSCognitoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const validateToken = () => {
    try {
      const serviceToken = localStorage.getItem('serviceToken');
      if (serviceToken) {
        const decodedToken = jwtDecode(serviceToken);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          setSession(null);
          dispatch({ type: LOGOUT });
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token validation failed:', error);
      setSession(null);
      dispatch({ type: LOGOUT });
      return false;
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && validateToken()) {
          setSession(serviceToken);
          dispatch({
            type: LOGIN,
            payload: { isLoggedIn: true, user: { email: jwtDecode(serviceToken).email } }
          });
        } else {
          dispatch({ type: LOGOUT });
        }
      } catch (err) {
        console.error(err);
        dispatch({ type: LOGOUT });
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });

    await new Promise((resolve, reject) => {
      user.authenticateUser(authDetails, {
        onSuccess: (session) => {
          setSession(session.getAccessToken().getJwtToken());
          dispatch({
            type: LOGIN,
            payload: { isLoggedIn: true, user: { email } }
          });
          resolve();
        },
        onFailure: (err) => {
          reject(err);
        }
      });
    });
  };

  const register = async (email, phone, password, firstname, lastname, role) => {
    await new Promise((resolve, reject) => {
      userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({ Name: 'email', Value: email }),
          new CognitoUserAttribute({ Name: 'name', Value: `${firstname} ${lastname}` }),
        ],
        [],
        async (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          try {
            // Insert profile into the backend using profile.js
            await insertProfile({
              sub: result.userSub,
              email,
              phone,
              firstname,
              lastname,
              role
            });

            localStorage.setItem('email', email);
            resolve();
          } catch (apiError) {
            console.error('Profile creation failed:', apiError);
            reject(apiError);
          }
        }
      );
    });
  };

  const logout = async() => {
    const loggedInUser = userPool.getCurrentUser();
    if (loggedInUser) {
      setSession(null);
      loggedInUser.signOut();
      dispatch({ type: LOGOUT });
      await mutate(API_BASE, null, false);
    }
  };

  const forgotPassword = async (email) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });
    user.forgotPassword({
      onSuccess: () => {},
      onFailure: () => {}
    });
  };

  const awsResetPassword = async (verificationCode, newPassword) => {
    const email = localStorage.getItem('email');
    const user = new CognitoUser({ Username: email, Pool: userPool });
    await new Promise((resolve, reject) => {
      user.confirmPassword(verificationCode, newPassword, {
        onSuccess: () => {
          localStorage.removeItem('email');
          resolve();
        },
        onFailure: (error) => {
          reject(error.message);
        }
      });
    });
  };

  const codeVerification = async (verificationCode) => {
    const email = localStorage.getItem('email');
    if (!email) {
      throw new Error('Username and Pool information are required');
    }

    const user = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    await new Promise((resolve, reject) => {
      user.confirmRegistration(verificationCode, true, (error) => {
        if (error) {
          reject(error.message || JSON.stringify(error));
        } else {
          localStorage.removeItem('email');
          resolve();
        }
      });
    });
  };

  const changePassword = async (oldPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser();
      if (!cognitoUser) {
        reject(new Error('No user is currently logged in.'));
        return;
      }
  
      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err);
          return;
        }
        if (!session.isValid()) {
          reject(new Error('Session is invalid.'));
          return;
        }
  
        cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });
  };  

  const resendConfirmationCode = async () => {
    const email = localStorage.getItem('email');
    if (!email) {
      throw new Error('Username and Pool information are required');
    }

    const user = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    await new Promise((resolve, reject) => {
      user.resendConfirmationCode((error) => {
        if (error) {
          reject(error.message || JSON.stringify(error));
        } else {
          resolve();
        }
      });
    });
  };

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <AWSCognitoContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        forgotPassword,
        awsResetPassword,
        updateProfile,
        codeVerification,
        resendConfirmationCode,
        validateToken,
        changePassword
      }}
    >
      {children}
    </AWSCognitoContext.Provider>
  );
};


export default AWSCognitoContext;
