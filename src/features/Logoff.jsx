// features/Logoff.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [logoutError, setError] = useState('');
  const [isLoggingOff, setIsLoggingOff] = useState(false);

  async function handleLogoff() {
    setIsLoggingOff(true);
    setError('');

    const result = await logout();

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
      setIsLoggingOff(false);
    }
  }

  return (
    <div>
      {logoutError && (
        <div>
          <p>{logoutError}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleLogoff}
        disabled={isLoggingOff}
      >
        {isLoggingOff ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}

export default Logoff;