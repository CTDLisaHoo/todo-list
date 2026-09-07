//components/RequireAuth.jsx

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', {
        replace: true,
        state: {
          from: location,
        },
      });
    }
  }, [isAuthenticated, navigate, location]);

  if (!isAuthenticated) {
    return (
      <div>
        <p>Redirecting...</p>
      </div>
    );
  }

  return children;
}

export default RequireAuth;