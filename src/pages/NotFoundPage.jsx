//pages/NotFoundPage.jsx

import { Link, useLocation } from 'react-router';
import styles from './NotFoundPage.module.css';

function NotFoundPage() {
  const {pathname} = useLocation();

  return (
    <main className={styles.notFoundPage}>
      <h1 className={styles.title}>404: Not Found</h1>

        <p className={styles.message}>
          <code>{pathname}</code> does not exist.
        </p>

        <nav className={styles.navigation}>
          <Link to="/">HomePage</Link>
          <Link to="/about">AboutPage</Link>
          <Link to="/login">LoginPage</Link>
        </nav>
    </main>
  );
}

export default NotFoundPage;
