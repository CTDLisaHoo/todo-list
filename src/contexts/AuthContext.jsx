import { createContext, useContext, useState } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook with error checking
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  // State for authentication
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  
  // Login
  const login = async (userEmail, password) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          password,
        }),
        credentials: 'include',
      };

      const res = await fetch('/api/users/logon', options);
      const data = await res.json();

      if (res.status === 200 && data.name && data.csrfToken) {
        // Success: update state
        setEmail(data.name);
        setToken(data.csrfToken);

        return { success: true };
      }

      // Authentication failed
      return {
        success: false,
        error: `Authentication failed: ${data?.message}`,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Network error during login',
      };
    }
  };

  // Logout
  const logout = async () => {
    // If there is no token, just clear state
    if (!token) {
      setEmail('');
      setToken('');
      return { success: true };
    }

    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
        },
        credentials: 'include',
      };

      const res = await fetch('/api/user/logoff', options);

      if (res.ok) {
        return { success: true };
      }

      return {
        success: false,
        error: 'Logout failed',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Network error during logout',
      };
    } finally {
      // Always clear local authentication state
      setEmail('');
      setToken('');
    }
  };
  
  // Context value object
  const value = {
    email,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

