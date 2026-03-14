import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      const msg = error.message || '';
      if (msg.includes('not approved')) {
        setError('Your account is pending admin approval. Please wait for an administrator to approve your account.');
      } else if (msg.includes('inactive')) {
        setError('Your account is currently inactive. Please contact an administrator.');
      } else {
        setError('Failed to sign in. Please check your credentials.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[#111621]">
      {/* Left Side: Login Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-[480px] xl:w-[540px] bg-[#111621] border-r border-slate-800">
        <div className="mx-auto w-full max-w-sm">
          {/* Back to Homepage */}
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8 group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Homepage
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2463eb] text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Routico</h2>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black leading-tight tracking-tight text-white">
              Smart Routing. Smarter Deliveries.
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Log in to manage your fleet and optimize routes efficiently.
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-200" htmlFor="email">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@company.com"
                  className="block w-full rounded-lg border-0 py-3 px-4 text-white bg-slate-800/50 shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-[#2463eb] sm:text-sm sm:leading-6 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium leading-6 text-slate-200" htmlFor="password">
                  Password
                </label>
                <div className="text-sm">
                  <a className="font-semibold text-[#2463eb] hover:text-[#2463eb]/80 transition-colors" href="#">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border-0 py-3 px-4 pr-12 text-white bg-slate-800/50 shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-[#2463eb] sm:text-sm sm:leading-6 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-700 text-[#2463eb] focus:ring-[#2463eb] bg-slate-800"
              />
              <label className="ml-3 block text-sm leading-6 text-slate-300" htmlFor="remember-me">
                Remember me
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-lg bg-[#2463eb] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#2463eb]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2463eb] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign in to Dashboard'}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-slate-400">
            New to Routico?{' '}
            <Link className="font-semibold leading-6 text-[#2463eb] hover:text-[#2463eb]/80 transition-colors" to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side: World Map Visualization */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-slate-900">
          {/* Radial gradient overlay */}
          <div className="absolute inset-0 opacity-40" style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(36,99,235,0.4) 0%, rgba(17,22,33,1) 100%)'
          }} />

          {/* Map image + overlapping card in one container */}
          <div className="absolute inset-0 flex items-center justify-center p-16">
            <div className="relative h-full w-full rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <img
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNKrUos2OqZ9dQRm4Uh4B_yhg4Vxw-giRNj7GHIKxpJgB7FGRSRk7FmUSwLbUNkZMhmy6HryqJQblD8bSSmn654wSZa566Ifo1C67FmNxqKshgbBwqIUUXIRRx_YG4T0p6NWz-oBMRieJIVA-lnDw4zyNmZb72cyDaLJ2VIyZ2m6XTLKZ9iflR2jkLCUEiEdWmWLfdE5VDv-Qv01YaJUApp-L8xMnP4z5uhh_dIlg2f2gTxWLEh7gaxsfjo9KMs6lgQGtwKxB0PHMO"
                alt="Global logistics network map with delivery connection points"
              />
              {/* Glass Card overlaid on bottom of map */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-slate-900/60 backdrop-blur-md border-t border-white/10">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2 bg-[#2463eb]/20 rounded-lg">
                    <svg className="w-5 h-5 text-[#2463eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Efficiency at Scale</h3>
                </div>
                <p className="text-slate-200 leading-relaxed">
                  Join over 2,500 logistics partners worldwide using Routico to reduce fuel consumption by 22% and improve delivery times by 35% through AI-driven optimization.
                </p>
                <div className="mt-6 flex gap-8">
                  <div>
                    <div className="text-2xl font-bold text-white">99.9%</div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Uptime</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">2.4M</div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Routes/Day</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
