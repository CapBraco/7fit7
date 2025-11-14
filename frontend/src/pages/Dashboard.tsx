// src/pages/Dashboard.tsx
import { useAuth } from '../contexts/AuthContext';

export const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <p>Fitness Goal: {user?.fitness_goal}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
