import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  FolderArchive,
  Users,
  GitMerge,
  Megaphone,
  Settings,
  LogOut,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

/* ── Role-aware nav definitions ──────────────────────────────── */
const NAV_CONFIG = {
  Trainee: [
    { id: 'dashboard',   label: 'Dashboard',        icon: LayoutDashboard },
    { id: 'courses',     label: 'My Courses',        icon: BookOpen        },
    { id: 'assessments', label: 'Quizzes & Tests',   icon: CheckSquare     },
    { id: 'library',     label: 'Resource Library',  icon: FolderArchive   },
  ],
  Trainer: [
    { id: 'dashboard',           label: 'Dashboard',              icon: LayoutDashboard },
    { id: 'courses-overview',    label: 'Course Management',       icon: BookOpen        },
    { id: 'assessments-builder', label: 'Questionnaire Builder',   icon: CheckSquare     },
    { id: 'library-uploader',    label: 'Content Library',         icon: FolderArchive   },
    { id: 'feedback',            label: 'Feedback',                 icon: MessageSquare   },
  ],
  Admin: [
    { id: 'dashboard',         label: 'Dashboard',          icon: LayoutDashboard },
    { id: 'approvals',         label: 'User Approvals',     icon: Users           },
    { id: 'courses-management', label: 'Course Management', icon: BookOpen        },
    { id: 'competency',        label: 'Competency Mapping', icon: GitMerge        },
    { id: 'announcements',     label: 'Announcements',      icon: Megaphone       },
    { id: 'feedback',          label: 'Feedback Inbox',     icon: MessageSquare   },
  ],
};

/* ── Quick-contact avatar rows (shared across Trainer/Admin) ─── */
const CONTACTS = [
  { name: 'Priya Nair',   role: 'Senior Trainer',    initials: 'PN', color: 'bg-violet-500' },
  { name: 'Arjun Mehta',  role: 'LMS Administrator', initials: 'AM', color: 'bg-emerald-500' },
  { name: 'Ritika Shah',  role: 'Corporate Trainee',  initials: 'RS', color: 'bg-amber-500'  },
];

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, role, logout } = useAuth();

  const navItems = NAV_CONFIG[role] ?? NAV_CONFIG.Trainee;

  return (
    <aside className="w-[220px] shrink-0 h-screen sticky top-0 bg-[#0f172a]/60 border-r border-white/10 backdrop-blur-xl flex flex-col select-none z-30">

      {/* ── Brand ─────────────────────────────────────────────── */}
      <div className="px-5 pt-6 pb-5 flex items-center gap-3">
        <img src={logo} alt="Capacity Connect logo" className="h-9 w-9 shrink-0 drop-shadow-[0_0_16px_rgba(115,191,196,0.4)]" />
        <div className="leading-tight">
          <h1 className="text-[13px] font-extrabold text-slate-50 tracking-tight">
            Capacity<span className="text-[#73bfc4]">Connect</span>
          </h1>
          <p className="text-[10px] text-slate-300 font-medium mt-0.5">Enterprise LMS</p>
        </div>
      </div>

      {/* ── OVERVIEW section (scrollable) ─────────────────────── */}
      <div className="px-4 pt-1 flex-1 overflow-y-auto flex flex-col gap-0.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-2 mt-1 px-1">
          Overview
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 text-left ${
                isActive
                  ? 'bg-[#73bfc4]/15 text-[#73bfc4] font-bold border border-[#73bfc4]/20'
                  : 'text-slate-300 hover:text-slate-50 hover:bg-white/5'
              }`}
            >
              <Icon
                className={`w-[17px] h-[17px] shrink-0 transition-colors ${
                  isActive ? 'text-[#73bfc4]' : 'text-slate-300 group-hover:text-slate-100'
                }`}
              />
              <span className="leading-none truncate">{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#73bfc4] shrink-0" />
              )}
            </button>
          );
        })}

        {/* ── QUICK CONTACTS ────────────────────────────────── */}
        <div className="mt-6 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-3 px-1">
            Quick Contacts
          </p>
          <div className="space-y-1.5">
            {CONTACTS.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
              >
                <div
                  className={`w-8 h-8 rounded-full ${c.color} text-white flex items-center justify-center text-[11px] font-bold shrink-0`}
                >
                  {c.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-slate-50 truncate leading-tight">{c.name}</p>
                  <p className="text-[10px] text-slate-300 truncate">{c.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom anchored: Settings + User + Logout ─────────── */}
      <div className="px-4 pb-5 border-t border-white/10 pt-4 space-y-1">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 text-left ${
            activeTab === 'settings' || activeTab === 'profile-management'
              ? 'bg-[#73bfc4]/15 text-[#73bfc4] font-bold border border-[#73bfc4]/20'
              : 'text-slate-300 hover:text-slate-50 hover:bg-white/5'
          }`}
        >
          <Settings
            className={`w-[17px] h-[17px] shrink-0 transition-colors ${
              activeTab === 'settings' || activeTab === 'profile-management'
                ? 'text-[#73bfc4]'
                : 'text-slate-300 group-hover:text-slate-100'
            }`}
          />
          <span className="leading-none truncate">Settings</span>
          {(activeTab === 'settings' || activeTab === 'profile-management') && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#73bfc4] shrink-0" />
          )}
        </button>

        {/* User info row */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 mt-2">
          <div className="w-8 h-8 rounded-full bg-[#73bfc4] text-slate-950 flex items-center justify-center text-[11px] font-bold shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-slate-50 truncate leading-tight">{user?.name || 'Guest'}</p>
            <p className="text-[10px] text-slate-300 truncate">{role} Portal</p>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-white/5 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
