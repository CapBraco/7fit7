import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    console.log('Attempting login with:', email); // Add this
    await login(email, password);
    navigate('/dashboard');
  } catch (err: any) {
    console.error('Login error:', err); // Add this
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password"/>
      <button type="submit">Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};
