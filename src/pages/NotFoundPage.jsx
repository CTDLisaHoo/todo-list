//pages/NotFoundPage.jsx

import { Link, useLocation } from 'react-router';

function NotFoundPage() {
  const {pathname} = useLocation();

  return (
    <section>
      <h2>404: Not Found</h2>
      <p><code>{pathname}</code> does not exist.</p>
      <nav>
        <Link to="/">HomePage</Link>
        <Link to="/about">AboutPage</Link>
        <Link to="/login">LoginPage</Link>
      </nav>
    </section>
  );
}

export default NotFoundPage;
