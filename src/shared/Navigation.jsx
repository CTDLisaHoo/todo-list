//shared/Navigation.jsx

import { NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import styles from './Navigation.module.css';

function Navigation() {
  const { isAuthenticated } = useAuth();

  const navLinkStyles = ({ isActive }) => 
    isActive 
      ? `${styles.navLink} ${styles.active}`
      : styles.navLink;
    
  return (
    <nav className={styles.navigation}>
      <ul className={styles.navList}>
        <li>
          <NavLink className={navLinkStyles} to="/about">
            About
          </NavLink>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <NavLink className={navLinkStyles} to="/todos">
                Todos
              </NavLink>
            </li>

            <li>
              <NavLink className={navLinkStyles} to="/profile">
                Profile
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink className={navLinkStyles} to="/login">
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
