import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginService } from '../api/auth.api';
import { getSecurityQuestion, verifySecurityAnswer } from '../api/forgotPassword.api';
import FlagFoundModal from '../components/common/FlagFoundModal';
const heroImage = 'https://res.cloudinary.com/dhyxvn66a/image/upload/v1777872498/ajith-in-suit_xlvzfj.png';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  // ── Forgot password state ──────────────────────────────────────────────────
  const [forgotStep, setForgotStep] = useState(0);        // 0 = hidden, 1 = enter email, 2 = answer question
  const [forgotEmail, setForgotEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // ── Flag modal state ───────────────────────────────────────────────────────
  const [showFlag, setShowFlag] = useState(false);
  const [flagValue, setFlagValue] = useState('');

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

  // ── Forgot password handlers ───────────────────────────────────────────────
  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);
    try {
      const { data } = await getSecurityQuestion({ email: forgotEmail });
      setSecurityQuestion(data.securityQuestion);
      setForgotStep(2);
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Could not find account');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSecurityAnswerSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);
    try {
      const { data } = await verifySecurityAnswer({ email: forgotEmail, securityAnswer });
      // Log the user in
      login(data.token, data.user);
      // Show the flag popup immediately
      if (data.flag) {
        setFlagValue(data.flag);
        setShowFlag(true);
      } else {
        navigate(data.user.role === 'admin' ? '/admin' : '/');
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Verification failed');
    } finally {
      setForgotLoading(false);
    }
  };

  const resetForgot = () => {
    setForgotStep(0);
    setForgotEmail('');
    setSecurityQuestion('');
    setSecurityAnswer('');
    setForgotError('');
  };

  // ── Flag modal dismiss ─────────────────────────────────────────────────────
  const handleFlagDismiss = () => {
    setShowFlag(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex">

      {/* Flag modal */}
      {showFlag && (
        <FlagFoundModal
          flag={flagValue}
          title="🚩 Flag Captured!"
          message="You successfully bypassed the forgot password flow using social engineering."
          primaryLabel="Continue"
          primaryAction={handleFlagDismiss}
        />
      )}

      {/* Left — brand image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
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
              Curated luxury,<br />effortlessly yours.
            </p>
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 md:px-16 xl:px-24 py-16">

        {/* Mobile-only brand */}
        <Link to="/" className="text-2xl font-extrabold tracking-tighter text-[#1c1b1b] mb-12 lg:hidden">
          APAPPAREL
        </Link>

        <div className="w-full max-w-sm mx-auto">

          {/* ─── Normal Login Form ──────────────────────────────────────────── */}
          {forgotStep === 0 && (
            <>
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

              <button
                onClick={() => setForgotStep(1)}
                className="text-[#994127] text-sm font-semibold hover:underline mt-4 block mx-auto"
              >
                Forgot password?
              </button>

              <p className="text-[#56423d] text-sm text-center mt-6">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="text-[#994127] font-semibold hover:underline">
                  Create one
                </Link>
              </p>
            </>
          )}

          {/* ─── Forgot Password Step 1: Enter email ───────────────────────── */}
          {forgotStep === 1 && (
            <>
              <h1 className="text-4xl font-extrabold tracking-tighter text-[#1c1b1b] mb-2">
                Forgot password
              </h1>
              <p className="text-[#56423d] text-sm mb-10 tracking-tight">
                Enter the email address associated with your account.
              </p>

              {forgotError && (
                <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {forgotError}
                </div>
              )}

              <form onSubmit={handleForgotEmailSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="forgot-email" className="text-xs font-semibold uppercase tracking-widest text-[#56423d]">
                    Email
                  </label>
                  <input
                    id="forgot-email"
                    type="text"
                    placeholder="you@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="bg-white border border-[#dcc1ba] text-[#1c1b1b] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#994127] focus:ring-1 focus:ring-[#994127] placeholder:text-[#b09a96] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="mt-2 bg-[#994127] hover:bg-[#7a3420] text-white font-semibold py-3 rounded-lg tracking-tight transition-colors duration-200 disabled:opacity-50"
                >
                  {forgotLoading ? 'Looking up…' : 'Continue'}
                </button>
              </form>

              <button
                onClick={resetForgot}
                className="text-[#994127] text-sm font-semibold hover:underline mt-4 block mx-auto"
              >
                ← Back to sign in
              </button>
            </>
          )}

          {/* ─── Forgot Password Step 2: Answer security question ──────────── */}
          {forgotStep === 2 && (
            <>
              <h1 className="text-4xl font-extrabold tracking-tighter text-[#1c1b1b] mb-2">
                Security question
              </h1>
              <p className="text-[#56423d] text-sm mb-10 tracking-tight">
                Answer the security question to verify your identity.
              </p>

              {forgotError && (
                <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {forgotError}
                </div>
              )}

              <form onSubmit={handleSecurityAnswerSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-[#56423d]">
                    Question
                  </label>
                  <p className="bg-[#f5f0ee] border border-[#dcc1ba] text-[#1c1b1b] rounded-lg px-4 py-3 text-sm">
                    {securityQuestion}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="security-answer" className="text-xs font-semibold uppercase tracking-widest text-[#56423d]">
                    Your Answer
                  </label>
                  <input
                    id="security-answer"
                    type="text"
                    placeholder="Enter your answer"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    required
                    className="bg-white border border-[#dcc1ba] text-[#1c1b1b] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#994127] focus:ring-1 focus:ring-[#994127] placeholder:text-[#b09a96] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="mt-2 bg-[#994127] hover:bg-[#7a3420] text-white font-semibold py-3 rounded-lg tracking-tight transition-colors duration-200 disabled:opacity-50"
                >
                  {forgotLoading ? 'Verifying…' : 'Verify & Sign In'}
                </button>
              </form>

              <button
                onClick={resetForgot}
                className="text-[#994127] text-sm font-semibold hover:underline mt-4 block mx-auto"
              >
                ← Back to sign in
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginPage;