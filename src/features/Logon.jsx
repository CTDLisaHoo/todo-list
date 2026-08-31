//features/Logon.jsx

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Logon() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoggingOn(true);
    setAuthError('');

    const result = await login(email, password);

    if (!result.success) {
      setAuthError(result.error);
    }

    setIsLoggingOn(false);
  }

  return (
    <div className="authFormScreen">
      <form className="authForm" onSubmit={handleSubmit}>
        {authError && (
          <div className="authErrorMessage">
            <p>{authError}</p>
          </div>
        )}

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="authButtons">
          <button disabled={isLoggingOn} type="submit">
            {isLoggingOn ? 'Logging in...' : 'Log On'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Logon;
