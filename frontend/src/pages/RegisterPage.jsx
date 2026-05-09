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

const validators = {
  username: (v) => {
    if (!v.trim()) return 'Username is required';
    if (v.trim().length < 3) return 'Must be at least 3 characters';
    if (v.trim().length > 20) return 'Must be 20 characters or fewer';
    if (!/^[a-zA-Z0-9_]+$/.test(v.trim())) return 'Letters, numbers, and underscores only';
    return '';
  },
  email: (v) => {
    if (!v.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Please enter a valid email address';
    return '';
  },
  password: (v) => {
    if (!v) return 'Password is required';
    if (v.length < 8) return 'Must be at least 8 characters';
    if (!/[A-Z]/.test(v)) return 'Must contain at least one uppercase letter';
    if (!/[0-9]/.test(v)) return 'Must contain at least one number';
    return '';
  },
  securityAnswer: (v) => {
    if (!v.trim()) return 'Security answer is required';
    if (v.trim().length < 2) return 'Must be at least 2 characters';
    return '';
  },
};

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    securityQuestion: SECURITY_QUESTIONS[0],
    securityAnswer: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name]?.(value) ?? '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validators[name]?.(value) ?? '' }));
  };

  const validateAll = () => {
    const fields = ['username', 'email', 'password', 'securityAnswer'];
    const newErrors = {};
    const newTouched = {};
    let valid = true;
    fields.forEach((f) => {
      newTouched[f] = true;
      const err = validators[f]?.(form[f]) ?? '';
      newErrors[f] = err;
      if (err) valid = false;
    });
    setTouched((prev) => ({ ...prev, ...newTouched }));
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validateAll()) return;
    try {
      const { data } = await registerService(form);
      login(data.token, data.user);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
    }
  };

  const inputClass = (name) =>
    `bg-white border text-[#1c1b1b] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 placeholder:text-[#b09a96] transition-colors ${
      errors[name] && touched[name]
        ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
        : 'border-[#dcc1ba] focus:border-[#994127] focus:ring-[#994127]'
    }`;

  const labelClass = 'text-xs font-semibold uppercase tracking-widest text-[#56423d]';

  const renderError = (name) =>
    errors[name] && touched[name]
      ? <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
      : null;

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex">

      {/* Left — brand image panel */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden">
        <img
          src={heroImage}
          alt="APapparel collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1c1b1b]/50" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link to="/" className="text-3xl font-extrabold tracking-tighter text-white">
            APAPPAREL
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
          APAPPAREL
        </Link>

        <div className="w-full max-w-md mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tighter text-[#1c1b1b] mb-2">
            Create account
          </h1>
          <p className="text-[#56423d] text-sm mb-10 tracking-tight">
            Fill in the details below to get started.
          </p>

          {serverError && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className={labelClass}>Username</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="3–20 characters, letters and numbers"
                value={form.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass('username')}
              />
              {renderError('username')}
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
                onBlur={handleBlur}
                className={inputClass('email')}
              />
              {renderError('email')}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className={labelClass}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 8 characters, 1 uppercase, 1 number"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass('password')}
              />
              {renderError('password')}
            </div>

            <div className="h-px bg-[#e8d5cf] my-1" />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="securityQuestion" className={labelClass}>Security Question</label>
              <select
                id="securityQuestion"
                name="securityQuestion"
                value={form.securityQuestion}
                onChange={handleChange}
                className={inputClass('securityQuestion')}
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
                onBlur={handleBlur}
                className={inputClass('securityAnswer')}
              />
              {renderError('securityAnswer')}
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
