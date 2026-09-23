import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, GraduationCap, Lock, Mail, Plus, ShieldCheck, Trash2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';

export const LoginPage = () => {
  const { login, register, loading, error: authError } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Trainee');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [skills, setSkills] = useState('');
  const [qualifications, setQualifications] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Enter your email and password to continue.');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      addToast(`Welcome back, ${result.user.name}!`, 'success');
      return;
    }

    setLocalError(result.message);
    addToast(result.message, 'error');
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLocalError('');
    const result = await register({
      name,
      email,
      password,
      role,
      profile: { designation, department },
      skills: skills.split(',').map((item) => item.trim()).filter(Boolean),
      qualifications,
    });

    if (result.success) {
      addToast(result.message || 'Registration submitted for admin approval.', 'info');
      setIsRegistering(false);
      setPassword('');
    } else {
      setLocalError(result.message);
      addToast(result.message, 'error');
    }
  };

  return (
    <main style={{ minHeight: '100vh' }} className="login-shell flex items-center bg-[#F7F8FC] px-5 py-6 text-[#19191F] sm:px-8 lg:px-12">
      <div style={{ minHeight: 'calc(100vh - 3rem)' }} className="login-card mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-[24px] border border-[#E8E8F0] bg-white shadow-[0_20px_60px_rgba(44,39,78,0.08)] lg:flex-row">
        <section style={{ backgroundColor: '#29243F' }} className="login-panel relative flex min-h-[300px] flex-1 flex-col justify-between overflow-hidden p-8 text-white sm:p-12 lg:min-h-[680px] lg:p-14">
          <div className="login-orbit login-orbit-top absolute -right-24 -top-24 h-72 w-72 rounded-full border-[48px] border-[#8C78F2]/20" />
          <div className="login-orbit login-orbit-bottom absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[56px] border-[#6F5BE7]/20" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#7B61E8] shadow-lg shadow-[#7B61E8]/30">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[15px] font-extrabold tracking-[-0.02em]">Capacity<span className="text-[#B8A9FF]">Connect</span></p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[#B7B1CE]">Enterprise LMS</p>
            </div>
          </div>

          <div className="relative z-10 max-w-md py-10 lg:py-0">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#B8A9FF]">Your learning workspace</p>
            <h1 className="max-w-sm text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-5xl">Build capability. Make an impact.</h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#C5C1D4]">One place to discover courses, grow skills, and keep every learning journey moving forward.</p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-[#D4D0E1]">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#B8A9FF]" /> Structured learning</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#B8A9FF]" /> Role-based access</span>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center bg-white px-6 py-12 sm:px-12 lg:px-16">
          <div className="login-form-content w-full max-w-[390px]">
            <div className="mb-9">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[13px] bg-[#F0EDFF] text-[#755BE8]"><ShieldCheck className="h-5 w-5" /></div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#8E8D9B]">Welcome back</p>
              <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-[#252336]">Sign in to your account</h2>
              <p className="mt-3 text-sm leading-6 text-[#888795]">{isRegistering ? 'Submit your details for administrator review.' : 'Use your work email and password to continue to CapacityConnect.'}</p>
            </div>

            {(localError || authError) && <div className="mb-5 rounded-[12px] border border-[#F3C9D0] bg-[#FFF5F6] px-4 py-3 text-sm text-[#B54759]">{localError || authError}</div>}

            <div className="mb-6 flex rounded-[12px] border border-[#E4E3EB] bg-[#FBFBFD] p-1">
              <button type="button" onClick={() => { setIsRegistering(false); setLocalError(''); }} className={`flex-1 rounded-[9px] py-2 text-xs font-bold ${!isRegistering ? 'bg-white text-[#755BE8] shadow-sm' : 'text-[#92929E]'}`}>Sign in</button>
              <button type="button" onClick={() => { setIsRegistering(true); setLocalError(''); }} className={`flex-1 rounded-[9px] py-2 text-xs font-bold ${isRegistering ? 'bg-white text-[#755BE8] shadow-sm' : 'text-[#92929E]'}`}>Register</button>
            </div>

            {isRegistering ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label htmlFor="register-name" className="mb-2 block text-xs font-bold text-[#4A4858]">Full name</label>
                  <div className="relative"><User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A3A1AF]" /><input id="register-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" style={{ paddingLeft: '2.75rem' }} className="h-11 w-full rounded-[12px] border border-[#E4E3EB] bg-[#FBFBFD] pr-4 text-sm outline-none focus:border-[#755BE8]" required /></div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Work email" className="h-11 w-full rounded-[12px] border border-[#E4E3EB] bg-[#FBFBFD] px-4 text-sm outline-none focus:border-[#755BE8]" required />
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="h-11 w-full rounded-[12px] border border-[#E4E3EB] bg-[#FBFBFD] px-4 text-sm outline-none focus:border-[#755BE8]" required />
                </div>
                <select value={role} onChange={(event) => setRole(event.target.value)} className="h-11 w-full rounded-[12px] border border-[#E4E3EB] bg-[#FBFBFD] px-4 text-sm outline-none focus:border-[#755BE8]"><option value="Trainee">Trainee</option><option value="Trainer">Trainer</option></select>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input value={designation} onChange={(event) => setDesignation(event.target.value)} placeholder="Designation" className="h-11 w-full rounded-[12px] border border-[#E4E3EB] bg-[#FBFBFD] px-4 text-sm outline-none focus:border-[#755BE8]" />
                  <input value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="Department" className="h-11 w-full rounded-[12px] border border-[#E4E3EB] bg-[#FBFBFD] px-4 text-sm outline-none focus:border-[#755BE8]" />
                </div>
                {role === 'Trainer' && (
                  <>
                    <input value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="Skills, separated by commas" className="h-11 w-full rounded-[12px] border border-[#E4E3EB] bg-[#FBFBFD] px-4 text-sm outline-none focus:border-[#755BE8]" />
                    <div className="rounded-[12px] border border-[#E4E3EB] bg-[#FBFBFD] p-3">
                      <div className="flex items-center justify-between"><div><p className="text-xs font-bold text-[#4A4858]">Certificates and qualifications</p><p className="mt-1 text-[11px] text-[#92929E]">At least one document is required for trainer review.</p></div><button type="button" onClick={() => setQualifications((items) => [...items, { title: '', issuer: '', type: 'Certificate', url: '' }])} className="inline-flex items-center gap-1 rounded-lg bg-[#EEE9FB] px-2.5 py-1.5 text-[11px] font-bold text-[#755BE8]"><Plus className="h-3.5 w-3.5" /> Add</button></div>
                      <div className="mt-3 space-y-2">{qualifications.map((item, index) => <div key={index} className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2"><input value={item.title} onChange={(event) => setQualifications((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, title: event.target.value } : entry))} placeholder="Title" className="h-9 min-w-0 w-full rounded-lg border border-[#E4E3EB] px-2.5 text-xs" required /><input value={item.issuer} onChange={(event) => setQualifications((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, issuer: event.target.value } : entry))} placeholder="Issuer" className="h-9 min-w-0 w-full rounded-lg border border-[#E4E3EB] px-2.5 text-xs" required /><input type="url" value={item.url} onChange={(event) => setQualifications((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, url: event.target.value } : entry))} placeholder="Document URL" className="h-9 min-w-0 w-full rounded-lg border border-[#E4E3EB] px-2.5 text-xs sm:col-span-2" required /><button type="button" onClick={() => setQualifications((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="flex h-9 items-center justify-center rounded-lg px-2 text-[#92929E] hover:bg-rose-50 hover:text-rose-500 sm:col-span-2 sm:justify-self-end"><Trash2 className="h-4 w-4" /></button></div>)}</div>
                    </div>
                  </>
                )}
                <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-[#755BE8] text-sm font-bold text-white shadow-lg shadow-[#755BE8]/20 disabled:opacity-60">{loading ? 'Submitting...' : 'Submit for approval'} {!loading && <ArrowRight className="h-4 w-4" />}</button>
              </form>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="mb-2 block text-xs font-bold text-[#4A4858]">Email address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A3A1AF]" />
                  <input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" style={{ paddingLeft: '2.75rem' }} className="h-12 w-full rounded-[12px] border border-[#E4E3EB] bg-[#FBFBFD] pr-4 text-sm text-[#252336] outline-none transition focus:border-[#755BE8] focus:bg-white focus:ring-4 focus:ring-[#755BE8]/10" required />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="login-password" className="text-xs font-bold text-[#4A4858]">Password</label>
                  <span className="text-[11px] font-semibold text-[#9C9AA8]">Contact admin for help</span>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A3A1AF]" />
                  <input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" style={{ paddingLeft: '2.75rem' }} className="h-12 w-full rounded-[12px] border border-[#E4E3EB] bg-[#FBFBFD] pr-4 text-sm text-[#252336] outline-none transition focus:border-[#755BE8] focus:bg-white focus:ring-4 focus:ring-[#755BE8]/10" required />
                </div>
              </div>

              <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-[#755BE8] text-sm font-bold text-white shadow-lg shadow-[#755BE8]/20 transition hover:bg-[#684EDC] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
            )}

            <p className="mt-8 text-center text-xs text-[#A09EAA]">Access is managed by your organization administrator.</p>
          </div>
        </section>
      </div>
    </main>
  );
};