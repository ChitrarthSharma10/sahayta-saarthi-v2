import React, { useState } from 'react';
import {
  GraduationCap,
  Shield,
  UserCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  User,
  Briefcase,
  Building2,
  AlertCircle
} from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';

export const LoginPage = () => {
  const { login, register, switchDemoRole, loading, error: authError } = useAuth();
  const { addToast } = useToast();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Trainee');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [localError, setLocalError] = useState('');

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      addToast(`Welcome back, ${res.user.name}!`, 'success');
    } else {
      setLocalError(res.message);
      addToast(res.message, 'error');
    }
  };

  const handleManualRegister = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!name || !email || !password) {
      setLocalError('Please fill all required fields.');
      return;
    }

    const res = await register({
      name,
      email,
      password,
      role,
      profile: { designation, department },
    });

    if (res.success) {
      addToast(res.message || 'Registration submitted for Admin approval!', 'info');
      setIsRegister(false);
    } else {
      setLocalError(res.message);
      addToast(res.message, 'error');
    }
  };

  const handleDemoLogin = async (selectedRole) => {
    setLocalError('');
    addToast(`Authenticating demo ${selectedRole}...`, 'info');
    const res = await switchDemoRole(selectedRole);
    if (res?.success) {
      addToast(`Signed in as ${selectedRole}!`, 'success');
    } else {
      setLocalError(res?.message || 'Account access disabled.');
      addToast(res?.message || 'Account access disabled.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#121316] relative flex items-center justify-center p-6 overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Soft dark modal with rounded-3xl corners */}
      <div className="w-full max-w-xl bg-[#1c1d22]/95 border border-slate-800 rounded-3xl shadow-2xl p-8 sm:p-10 relative z-10 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 shadow-xl shadow-yellow-500/20 text-slate-950 font-black mb-4">
            <GraduationCap className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Capacity<span className="text-yellow-400">Connect</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Enterprise Capacity Building & Competency Learning Platform
          </p>
        </div>

        {/* Quick "One-Click Demo Login" Buttons */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> One-Click Demo Login
            </span>
            <span className="text-[11px] text-yellow-400 font-medium">Instant Access</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Trainee Demo Button */}
            <button
              type="button"
              onClick={() => handleDemoLogin('Trainee')}
              disabled={loading}
              className="group flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#121316] border border-slate-800 hover:border-yellow-400/50 transition-all duration-200 hover:scale-[1.02] hover:bg-slate-900"
            >
              <div className="w-9 h-9 rounded-xl bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-yellow-400 mb-2 group-hover:bg-yellow-400 group-hover:text-slate-950 transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white">Trainee</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Jason Ranti</span>
            </button>

            {/* Trainer Demo Button */}
            <button
              type="button"
              onClick={() => handleDemoLogin('Trainer')}
              disabled={loading}
              className="group flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#121316] border border-slate-800 hover:border-purple-400/50 transition-all duration-200 hover:scale-[1.02] hover:bg-slate-900"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-2 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white">Trainer</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Priya Nair</span>
            </button>

            {/* Admin Demo Button */}
            <button
              type="button"
              onClick={() => handleDemoLogin('Admin')}
              disabled={loading}
              className="group flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#121316] border border-slate-800 hover:border-emerald-400/50 transition-all duration-200 hover:scale-[1.02] hover:bg-slate-900"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white">Admin</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Arjun Mehta</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-[#1c1d22] px-4 text-xs font-medium text-slate-400 uppercase tracking-wider absolute">
            or sign in with credentials
          </span>
        </div>

        {/* Error Alert */}
        {(localError || authError) && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{localError || authError}</span>
          </div>
        )}

        {/* Tab Switcher (Login / Register) */}
        <div className="flex bg-[#121316] p-1 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setLocalError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              !isRegister ? 'bg-[#1c1d22] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setLocalError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              isRegister ? 'bg-[#1c1d22] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register User
          </button>
        </div>

        {/* Login Form */}
        {!isRegister ? (
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@capacityconnect.in"
                  className="w-full bg-slate-800 border border-slate-700 focus:border-yellow-400 text-slate-100 placeholder-slate-400 text-sm rounded-2xl pl-10 pr-4 py-3 outline-none transition-all duration-150"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 focus:border-yellow-400 text-slate-100 placeholder-slate-400 text-sm rounded-2xl pl-10 pr-4 py-3 outline-none transition-all duration-150"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-sm shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-all flex items-center justify-center gap-2 group"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleManualRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-slate-800 border border-slate-700 focus:border-yellow-400 text-slate-100 text-sm rounded-2xl pl-10 pr-4 py-2.5 outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-800 border border-slate-700 focus:border-yellow-400 text-slate-100 text-sm rounded-2xl px-3.5 py-2.5 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 focus:border-yellow-400 text-slate-100 text-sm rounded-2xl px-3.5 py-2.5 outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-yellow-400 text-slate-100 text-xs rounded-2xl px-3 py-2.5 outline-none"
                >
                  <option value="Trainee">Trainee</option>
                  <option value="Trainer">Trainer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Associate"
                  className="w-full bg-slate-800 border border-slate-700 focus:border-yellow-400 text-slate-100 text-xs rounded-2xl px-3 py-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Finance"
                  className="w-full bg-slate-800 border border-slate-700 focus:border-yellow-400 text-slate-100 text-xs rounded-2xl px-3 py-2.5 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-sm shadow-lg shadow-yellow-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Submitting...' : 'Register as Pending User'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-slate-400 text-center">
              * Note: New registrations require Admin approval before accessing courses.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
