import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerService } from '../api/auth.api.js';
import { heroImage } from '../assets/images.js';

const SECURITY_QUESTIONS = [
  "What is the name of your first pet?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was the name of your primary school?",
  "What is the name of the street you grew up on?",
  "What was the make of your first car?",
];

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    securityQuestion: SECURITY_QUESTIONS[0],
    securityAnswer: '',
  });
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

  const inputClass =
    'bg-white border border-[#dcc1ba] text-[#1c1b1b] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#994127] focus:ring-1 focus:ring-[#994127] placeholder:text-[#b09a96] transition-colors';

  const labelClass =
    'text-xs font-semibold uppercase tracking-widest text-[#56423d]';

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex">

      {/* Left — brand image panel */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden">
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
              Join a world of refined taste.
            </p>
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex flex-col justify-center w-full lg:w-3/5 px-8 md:px-16 xl:px-24 py-16 overflow-y-auto">

        {/* Mobile-only brand */}
        <Link to="/" className="text-2xl font-extrabold tracking-tighter text-[#1c1b1b] mb-12 lg:hidden">
          ATELIER
        </Link>

        <div className="w-full max-w-md mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tighter text-[#1c1b1b] mb-2">
            Create account
          </h1>
          <p className="text-[#56423d] text-sm mb-10 tracking-tight">
            Fill in the details below to get started.
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className={labelClass}>Username</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Your display name"
                value={form.username}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className={labelClass}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className={labelClass}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div className="h-px bg-[#e8d5cf] my-1" />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="securityQuestion" className={labelClass}>Security Question</label>
              <select
                id="securityQuestion"
                name="securityQuestion"
                value={form.securityQuestion}
                onChange={handleChange}
                required
                className={inputClass}
              >
                {SECURITY_QUESTIONS.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="securityAnswer" className={labelClass}>Answer</label>
              <input
                id="securityAnswer"
                name="securityAnswer"
                type="text"
                placeholder="Your answer (stored securely)"
                value={form.securityAnswer}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              className="mt-2 bg-[#994127] hover:bg-[#7a3420] text-white font-semibold py-3 rounded-lg tracking-tight transition-colors duration-200"
            >
              Create Account
            </button>
          </form>

          <p className="text-[#56423d] text-sm text-center mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-[#994127] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
