//shared/Header.jsx

import { useAuth } from '../contexts/AuthContext';
import Logoff from '../features/Logoff';
import Navigation from './Navigation';
import styles from './Header.module.css';

function Header() {
  const { isAuthenticated } = useAuth();

  return(
    <header className={styles.header}>
      <h1 className={styles.title}>Todo List</h1>

        <div className={styles.navigation}>
          <Navigation />
        </div>

        {isAuthenticated && (
          <div className={styles.logoff}>
            <Logoff />
          </div>
        )}
    </header>

      );
}

export default Header;
