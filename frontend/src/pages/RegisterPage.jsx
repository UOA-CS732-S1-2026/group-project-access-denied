import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerService } from '../services/auth.service';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]   = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await registerService(form);
      login(data.token, data.user);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">Create Account</h2>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-green-400"
          />
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-green-400"
          />
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={handleChange}
            required
            className="bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-green-400"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition-colors"
          >
            Register
          </button>
        </form>
        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-green-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
