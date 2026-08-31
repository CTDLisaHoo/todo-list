// features/Logoff.jsx

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Logoff() {
  const { logout } = useAuth();

  const [logoutError, setLogoutError] = useState('');
  const [isLoggingOff, setIsLoggingOff] = useState(false);

  async function handleLogout() {
    setIsLoggingOff(true);
    setLogoutError('');

    const result = await logout();

    if (!result.success) {
      setLogoutError(result.error);
    }

    setIsLoggingOff(false);
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
        onClick={handleLogout}
        disabled={isLoggingOff}
      >
        {isLoggingOff ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}

export default Logoff;

