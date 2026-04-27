import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginService } from '../api/auth.api';
import { heroImage } from '../assets/images';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await loginService(form);
      login(data.token, data.user);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex">

      {/* Left — brand image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={heroImage}
          alt="Atelier collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1c1b1b]/50" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link to="/" className="text-3xl font-extrabold tracking-tighter text-white">
            ATELIER
          </Link>
          <div>
            <p className="text-[#dcc1ba] text-2xl font-light tracking-tight leading-snug max-w-xs">
              Curated luxury,<br />effortlessly yours.
            </p>
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 md:px-16 xl:px-24 py-16">

        {/* Mobile-only brand */}
        <Link to="/" className="text-2xl font-extrabold tracking-tighter text-[#1c1b1b] mb-12 lg:hidden">
          ATELIER
        </Link>

        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tighter text-[#1c1b1b] mb-2">
            Welcome back
          </h1>
          <p className="text-[#56423d] text-sm mb-10 tracking-tight">
            Sign in to your account to continue.
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-[#56423d]">
                Email or Username
              </label>
              <input
                id="email"
                name="email"
                type="text"
                placeholder="you@example.com or username"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-white border border-[#dcc1ba] text-[#1c1b1b] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#994127] focus:ring-1 focus:ring-[#994127] placeholder:text-[#b09a96] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-widest text-[#56423d]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="bg-white border border-[#dcc1ba] text-[#1c1b1b] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#994127] focus:ring-1 focus:ring-[#994127] placeholder:text-[#b09a96] transition-colors"
              />
            </div>

            <button
              type="submit"
              className="mt-2 bg-[#994127] hover:bg-[#7a3420] text-white font-semibold py-3 rounded-lg tracking-tight transition-colors duration-200"
            >
              Sign In
            </button>
          </form>

          <p className="text-[#56423d] text-sm text-center mt-8">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-[#994127] font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
