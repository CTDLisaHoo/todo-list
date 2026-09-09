//shared/Navigation.jsx

import { NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function Navigation() {
  const { isAuthenticated } = useAuth();

  const navLinkStyles = ({ isActive }) => ({
    fontWeight: isActive ? 700 : 400,
    textDecoration: isActive ? 'underline' : 'none',
    padding: '2px 6px',
    borderRadius: 6,
    backgroundColor: isActive ? '#eee' : 'transparent',
  });

  return (
    <nav>
      <ul
        style={{
          listStyle: 'none',
          display: 'flex',
          gap: '1rem',
          padding: 0,
        }}
      >
        <li>
          <NavLink style={navLinkStyles} to="/about">
            AboutPage
          </NavLink>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <NavLink style={navLinkStyles} to="/todos">
                TodosPage
              </NavLink>
            </li>

            <li>
              <NavLink style={navLinkStyles} to="/profile">
                ProfilePage
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink style={navLinkStyles} to="/login">
              LoginPage
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
