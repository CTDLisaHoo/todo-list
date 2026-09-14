//pages/ProfilePage.jsx

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from './ProfilePage.module.css';

function ProfilePage() {
  const { email, token } = useAuth();

  const [todoStats, setTodoStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) return;

      try {
        setLoading(true);
        setError('');

        const options = {
          method: 'GET',
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        };

        const response = await fetch('/api/tasks', options);

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const data = await response.json();
        const todos = data.tasks ?? [];

        // Calculate statistics
        const total = todos.length;
        const completed = todos.filter((todo) => todo.isCompleted).length;
        const active = total - completed;

        setTodoStats({ total, completed, active });
      } catch (err) {
        setError(`Error loading statistics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  const { total, completed, active } = todoStats;

  const completionPercentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <main className={styles.profilePage}>
      <h1 className={styles.title}>Profile</h1>

      <section className={styles.section}>
        <h2>User Information</h2>
        <p>
          <strong>Name:</strong> {email}
        </p>
        <p>
          <strong>Status:</strong>{' '}
           {token ? 'Authenticated' : 'Not authenticated'}
        </p>
       </section>

       <section className={styles.section}>
        <h2>Todo Statistics</h2>

        {loading && (
          <p className={styles.loading}>Loading statistics...</p>
        )}

        {error && (
          <p className={styles.error}>{error}</p>
        )}

        {!loading && !error && (
          <div className={styles.stats}>
            <p>
              <strong>Total:</strong> {total}
            </p>

            <p>
              <strong>Completed:</strong> {completed}
            </p>

            <p>
              <strong>Active:</strong> {active}
            </p>

            {total > 0 && (
              <p>
                <strong>Completion:</strong>{' '}
                {completionPercentage}%
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default ProfilePage;

