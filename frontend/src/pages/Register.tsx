// src/pages/Register.tsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    password_confirm: '',
    fitness_goal: 'general',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
      <input name="password_confirm" type="password" placeholder="Confirm Password" value={form.password_confirm} onChange={handleChange} />
      <button type="submit">Register</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};
