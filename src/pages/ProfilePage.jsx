//pages/ProfilePage.jsx

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
    <div>
      <h1>Profile</h1>

      <h2>User Information</h2>
      <p>Name: {email}</p>
      <p>Status: {token ? 'Authenticated' : 'Not authenticated'}</p>

      <h2>Todo Statistics</h2>

      {loading && <p>Loading statistics...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div>
          <p>Total: {total}</p>
          <p>Completed: {completed}</p>
          <p>Active: {active}</p>

          {total > 0 && (
            <p>Completion: {completionPercentage}%</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfilePage;

