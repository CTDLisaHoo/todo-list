// pages/LoginPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import styles from './LoginPage.module.css';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  // Get intended destination from location state, default to /todos
  const from = location.state?.from?.pathname || '/todos';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  async function handleSubmit(e) {
    e.preventDefault();

    setAuthError('');
    setValidationErrors({});

    const errors = {};
    const trimmedEmail = email.trim();

    // Validate email
    if (!trimmedEmail) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.';
    } else if (trimmedEmail.length > 100) {
      errors.email = 'Email must be 100 characters or fewer.';
    }

    // Validate password
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length > 100) {
      errors.password = 'Password must be 100 characters or fewer.';
    }

    // Stop submission if validation fails
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoggingOn(true);

    try {
      const result = await login(trimmedEmail, password);

      if (!result.success) {
        setAuthError('Invalid email or password. Please try again.');
      }
    } catch {
      setAuthError('Unable to log in. Please try again.');
    } finally {
      setIsLoggingOn(false);
    }
  }

  return (
    <div className={styles.authFormScreen}>
      <form className={styles.authForm} onSubmit={handleSubmit} noValidate>
        {authError && (
          <div className={styles.authErrorMessage} role="alert">
            <p>{authError}</p>
          </div>
        )}

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setAuthError('');
            setValidationErrors((previous) => ({
              ...previous,
              email: '',
            }));
          }}
          maxLength={100}
          aria-invalid={Boolean(validationErrors.email)}
          aria-describedby={
            validationErrors.email ? 'email-error' : undefined
          }
          required
        />

        {validationErrors.email && (
          <p id="email-error" className={styles.inputError}>
            {validationErrors.email}
          </p>
        )}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setAuthError('');
            setValidationErrors((previous) => ({
              ...previous,
              password: '',
            }));
          }}
          maxLength={100}
          aria-invalid={Boolean(validationErrors.password)}
          aria-describedby={
            validationErrors.password ? 'password-error' : undefined
          }
          required
        />

        {validationErrors.password && (
          <p id="password-error" className={styles.inputError}>
            {validationErrors.password}
          </p>
        )}

        <div className={styles.authButtons}>
          <button disabled={isLoggingOn} type="submit">
            {isLoggingOn ? 'Logging in...' : 'Log On'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
