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
  GraduationCap,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
    { id: 'profile-management',  label: 'Profile Management',       icon: Users           },
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
    <aside className="w-[220px] shrink-0 h-screen sticky top-0 bg-white border-r border-[#EEEEF4] flex flex-col select-none z-30">

      {/* ── Brand ─────────────────────────────────────────────── */}
      <div className="px-5 pt-6 pb-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-[#755BE8] flex items-center justify-center shadow-lg shadow-[#755BE8]/30 shrink-0">
          <GraduationCap className="w-5 h-5 text-white stroke-[2]" />
        </div>
        <div className="leading-tight">
          <h1 className="text-[13px] font-extrabold text-[#19191F] tracking-tight">
            Capacity<span className="text-[#755BE8]">Connect</span>
          </h1>
          <p className="text-[10px] text-[#92929E] font-medium mt-0.5">Enterprise LMS</p>
        </div>
      </div>

      {/* ── OVERVIEW section (scrollable) ─────────────────────── */}
      <div className="px-4 pt-1 flex-1 overflow-y-auto flex flex-col gap-0.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#92929E] mb-2 mt-1 px-1">
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
                  ? 'bg-[#EEE9FB] text-[#755BE8] font-bold'
                  : 'text-[#92929E] hover:text-[#19191F] hover:bg-[#F6F7FB]'
              }`}
            >
              <Icon
                className={`w-[17px] h-[17px] shrink-0 transition-colors ${
                  isActive ? 'text-[#755BE8]' : 'text-[#92929E] group-hover:text-[#19191F]'
                }`}
              />
              <span className="leading-none truncate">{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#755BE8] shrink-0" />
              )}
            </button>
          );
        })}

        {/* ── QUICK CONTACTS ────────────────────────────────── */}
        <div className="mt-6 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#92929E] mb-3 px-1">
            Quick Contacts
          </p>
          <div className="space-y-1.5">
            {CONTACTS.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-[#F6F7FB] cursor-pointer transition-colors group"
              >
                <div
                  className={`w-8 h-8 rounded-full ${c.color} text-white flex items-center justify-center text-[11px] font-bold shrink-0`}
                >
                  {c.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#19191F] truncate leading-tight">{c.name}</p>
                  <p className="text-[10px] text-[#92929E] truncate">{c.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom anchored: Settings + User + Logout ─────────── */}
      <div className="px-4 pb-5 border-t border-[#EEEEF4] pt-4 space-y-1">
        <button
          onClick={() => {}}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-[#92929E] hover:text-[#19191F] hover:bg-[#F6F7FB] transition-all"
        >
          <Settings className="w-[17px] h-[17px]" />
          Settings
        </button>

        {/* User info row */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#F6F7FB] mt-2">
          <div className="w-8 h-8 rounded-full bg-[#755BE8] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-[#19191F] truncate leading-tight">{user?.name || 'Guest'}</p>
            <p className="text-[10px] text-[#92929E] truncate">{role} Portal</p>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 rounded-lg text-[#92929E] hover:text-rose-500 hover:bg-rose-50 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
