import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project import
import useAuth from 'hooks/useAuth';

// ==============================|| AUTH GUARD ||============================== //

export default function AuthGuard({ children }) {
  const { isLoggedIn, validateToken } = useAuth(); // Ensure validateToken is from context
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn || !validateToken()) {
      navigate('/login', {
        state: { from: location.pathname },
        replace: true
      });
    }
  }, [isLoggedIn, validateToken, navigate, location]);

  return children;
}

AuthGuard.propTypes = { children: PropTypes.any };
