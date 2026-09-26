import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, Plus, ShieldCheck, Trash2, User } from 'lucide-react';
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import logo from '../assets/logo.png';

export const LoginPage = () => {
  const { login, register, loading, error: authError } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="login-shell relative flex min-h-screen items-center px-5 py-6 text-slate-100 sm:px-8 lg:px-12">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <ShaderGradientCanvas
          className="h-full w-full opacity-60"
          pointerEvents="none"
          pixelDensity={1}
          lazyLoad
          powerPreference="low-power"
        >
          <ShaderGradient
            animate="on"
            axesHelper="off"
            bgColor1="#000000"
            bgColor2="#000000"
            brightness={0.8}
            cAzimuthAngle={270}
            cDistance={0.5}
            cPolarAngle={180}
            cameraZoom={15.1}
            color1="#73bfc4"
            color2="#ff810a"
            color3="#8da0ce"
            destination="onCanvas"
            embedMode="off"
            envPreset="city"
            format="gif"
            fov={45}
            frameRate={10}
            gizmoHelper="hide"
            grain="on"
            lightType="env"
            pixelDensity={1}
            positionX={-0.1}
            positionY={0}
            positionZ={0}
            range="disabled"
            rangeEnd={40}
            rangeStart={0}
            reflection={0.4}
            rotationX={0}
            rotationY={130}
            rotationZ={70}
            shader="defaults"
            type="sphere"
            uAmplitude={3.2}
            uDensity={0.8}
            uFrequency={5.5}
            uSpeed={0.3}
            uStrength={0.3}
            uTime={0}
            wireframe={false}
          />
        </ShaderGradientCanvas>
        <div className="absolute inset-0 bg-[#0B1020]/72" />
      </div>

      <div style={{ minHeight: 'calc(100vh - 3rem)' }} className="login-card relative z-10 mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur-2xl lg:flex-row">
        <section className="login-panel relative flex min-h-[300px] flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#130f24] via-[#1a1530] to-[#231a3c] p-8 text-white sm:p-12 lg:min-h-[680px] lg:p-14">
          <div className="login-orbit login-orbit-top absolute -right-24 -top-24 h-72 w-72 rounded-full border-[48px] border-[#8C78F2]/20" />
          <div className="login-orbit login-orbit-bottom absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[56px] border-[#73bfc4]/20" />

          <div className="relative z-10 flex items-center gap-3.5">
            <img src={logo} alt="Capacity Connect logo" className="h-14 w-14 shrink-0 rounded-xl ring-1 ring-white/10 bg-white/5 p-1.5 drop-shadow-[0_0_22px_rgba(115,191,196,0.5)]" />
            <div>
              <p className="text-[16px] font-extrabold tracking-[-0.02em]">Capacity<span className="text-[#B8A9FF]">Connect</span></p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[#B7B1CE]">Enterprise LMS</p>
            </div>
          </div>

          <div className="relative z-10 max-w-md py-10 lg:py-0">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#B8A9FF]">Your learning workspace</p>
            <h1 className="max-w-sm text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-5xl">Build capability. Make an impact.</h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#C5C1D4]">One place to discover courses, grow skills, and keep every learning journey moving forward.</p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-[#D4D0E1]">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#73bfc4]" /> Structured learning</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#73bfc4]" /> Role-based access</span>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center bg-[rgba(15,20,31,0.72)] px-6 py-12 backdrop-blur-xl sm:px-12 lg:px-16">
          <div className="login-form-content w-full max-w-[390px] text-slate-100">
            <div className="mb-9">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[13px] bg-gradient-to-br from-[#73bfc4]/20 to-[#ff810a]/20 text-[#73bfc4] ring-1 ring-white/10"><ShieldCheck className="h-5 w-5" /></div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-300">Welcome back</p>
              <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-white">Sign in to your account</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{isRegistering ? 'Submit your details for administrator review.' : 'Use your work email and password to continue to CapacityConnect.'}</p>
            </div>

            {(localError || authError) && <div className="mb-5 rounded-[12px] border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{localError || authError}</div>}

            <div className="mb-6 flex rounded-[14px] border border-white/10 bg-slate-950/30 p-1 shadow-inner shadow-black/20">
              <button type="button" onClick={() => { setIsRegistering(false); setLocalError(''); }} className={`flex-1 rounded-[10px] py-2 text-xs font-bold transition-all ${!isRegistering ? 'bg-white text-[#0f172a] shadow-sm' : 'text-slate-300 hover:text-white'}`}>Sign in</button>
              <button type="button" onClick={() => { setIsRegistering(true); setLocalError(''); }} className={`flex-1 rounded-[10px] py-2 text-xs font-bold transition-all ${isRegistering ? 'bg-white text-[#0f172a] shadow-sm' : 'text-slate-300 hover:text-white'}`}>Register</button>
            </div>

            <div className="relative min-h-[420px] overflow-hidden">
              <div className={`absolute inset-0 w-full transition-all duration-400 ease-out ${isRegistering ? 'opacity-0 pointer-events-none scale-[0.98]' : 'opacity-100 scale-100'}`}>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="login-email" className="mb-2 block text-xs font-bold text-slate-200">Email address</label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" style={{ paddingLeft: '2.75rem' }} className="h-12 w-full rounded-[12px] border border-white/10 bg-slate-950/40 pr-4 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-[#73bfc4] focus:ring-4 focus:ring-[#73bfc4]/15" required />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label htmlFor="login-password" className="text-xs font-bold text-slate-200">Password</label>
                      <span className="text-[11px] font-semibold text-slate-400">Contact admin for help</span>
                    </div>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }} className="h-12 w-full rounded-[12px] border border-white/10 bg-slate-950/40 pr-4 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-[#73bfc4] focus:ring-4 focus:ring-[#73bfc4]/15" required />
                      <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1.5 text-slate-300 transition hover:bg-white/5 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-gradient-to-r from-[#73bfc4] to-[#ff810a] text-sm font-bold text-white shadow-lg shadow-[#73bfc4]/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
                    {loading ? 'Signing in...' : 'Sign in'}
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </button>
                </form>
              </div>

              <div className={`absolute inset-0 w-full transition-all duration-400 ease-out ${isRegistering ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none scale-[0.98]'}`}>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label htmlFor="register-name" className="mb-2 block text-xs font-bold text-slate-200">Full name</label>
                    <div className="relative"><User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input id="register-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" style={{ paddingLeft: '2.75rem' }} className="h-11 w-full rounded-[12px] border border-white/10 bg-slate-950/40 pr-4 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-[#73bfc4] focus:ring-4 focus:ring-[#73bfc4]/15" required /></div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Work email" className="h-11 w-full rounded-[12px] border border-white/10 bg-slate-950/40 px-4 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-[#73bfc4] focus:ring-4 focus:ring-[#73bfc4]/15" required />
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="h-11 w-full rounded-[12px] border border-white/10 bg-slate-950/40 px-4 pr-10 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-[#73bfc4] focus:ring-4 focus:ring-[#73bfc4]/15" required />
                      <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1.5 text-slate-300 transition hover:bg-white/5 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <select value={role} onChange={(event) => setRole(event.target.value)} className="h-11 w-full rounded-[12px] border border-white/10 bg-slate-950/40 px-4 text-sm text-white outline-none transition focus:border-[#73bfc4] focus:ring-4 focus:ring-[#73bfc4]/15"><option value="Trainee">Trainee</option><option value="Trainer">Trainer</option></select>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input value={designation} onChange={(event) => setDesignation(event.target.value)} placeholder="Designation" className="h-11 w-full rounded-[12px] border border-white/10 bg-slate-950/40 px-4 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-[#73bfc4] focus:ring-4 focus:ring-[#73bfc4]/15" />
                    <input value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="Department" className="h-11 w-full rounded-[12px] border border-white/10 bg-slate-950/40 px-4 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-[#73bfc4] focus:ring-4 focus:ring-[#73bfc4]/15" />
                  </div>
                  {role === 'Trainer' && (
                    <>
                      <input value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="Skills, separated by commas" className="h-11 w-full rounded-[12px] border border-[#E4E3EB] bg-[#FBFBFD] px-4 text-sm outline-none focus:border-[#755BE8]" />
                      <div className="rounded-[12px] border border-white/10 bg-slate-950/35 p-3">
                        <div className="flex items-center justify-between"><div><p className="text-xs font-bold text-slate-200">Certificates and qualifications</p><p className="mt-1 text-[11px] text-slate-400">At least one document is required for trainer review.</p></div><button type="button" onClick={() => setQualifications((items) => [...items, { title: '', issuer: '', type: 'Certificate', url: '' }])} className="inline-flex items-center gap-1 rounded-lg bg-[#73bfc4]/15 px-2.5 py-1.5 text-[11px] font-bold text-[#73bfc4] ring-1 ring-[#73bfc4]/20"><Plus className="h-3.5 w-3.5" /> Add</button></div>
                        <div className="mt-3 space-y-2">{qualifications.map((item, index) => <div key={index} className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2"><input value={item.title} onChange={(event) => setQualifications((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, title: event.target.value } : entry))} placeholder="Title" className="h-9 min-w-0 w-full rounded-lg border border-white/10 bg-slate-950/40 px-2.5 text-xs text-white placeholder:text-slate-400" required /><input value={item.issuer} onChange={(event) => setQualifications((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, issuer: event.target.value } : entry))} placeholder="Issuer" className="h-9 min-w-0 w-full rounded-lg border border-white/10 bg-slate-950/40 px-2.5 text-xs text-white placeholder:text-slate-400" required /><input type="url" value={item.url} onChange={(event) => setQualifications((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, url: event.target.value } : entry))} placeholder="Document URL" className="h-9 min-w-0 w-full rounded-lg border border-white/10 bg-slate-950/40 px-2.5 text-xs text-white placeholder:text-slate-400 sm:col-span-2" required /><button type="button" onClick={() => setQualifications((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="flex h-9 items-center justify-center rounded-lg px-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-200 sm:col-span-2 sm:justify-self-end"><Trash2 className="h-4 w-4" /></button></div>)}</div>
                      </div>
                    </>
                  )}
                  <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-gradient-to-r from-[#73bfc4] to-[#ff810a] text-sm font-bold text-white shadow-lg shadow-[#73bfc4]/20 transition hover:brightness-110 disabled:opacity-60">{loading ? 'Submitting...' : 'Submit for approval'} {!loading && <ArrowRight className="h-4 w-4" />}</button>
                </form>
              </div>
            </div>

            <p className="mt-8 text-center text-xs text-[#A09EAA]">Access is managed by your organization administrator.</p>
          </div>
        </section>
      </div>
    </main>
  );
};