import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  FolderArchive,
  Settings,
  LogOut,
  MessageSquare,
} from 'lucide-react';
import { COURSUE_FRIENDS } from '../../data/coursueData';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

/* ── Trainee-specific nav items ─────────────────────────────── */
const NAV_ITEMS = [
  { id: 'Dashboard', label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'Courses',   label: 'My Courses',       icon: BookOpen        },
  { id: 'All Courses', label: 'All Courses',    icon: BookOpen        },
  { id: 'Quizzes',   label: 'Quizzes & Tests',  icon: CheckSquare     },
  { id: 'Library',   label: 'Resource Library', icon: FolderArchive   },
  { id: 'Feedback',  label: 'Feedback',         icon: MessageSquare   },
];

export const AppSidebar = ({ activeNav = 'Dashboard', onNavSelect }) => {
  const { logout } = useAuth();

  return (
    <aside className="w-[170px] xl:w-[180px] bg-[#0f172a]/60 border-r border-white/10 backdrop-blur-xl flex flex-col shrink-0 min-h-screen sticky top-0 py-6 px-4 select-none z-20 justify-between">
      {/* Top Section: Logo & Nav */}
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2">
          <img src={logo} alt="Capacity Connect logo" className="h-10 w-10 shrink-0 rounded-lg ring-1 ring-white/10 bg-white/5 p-1 drop-shadow-[0_0_16px_rgba(115,191,196,0.5)]" />
          <span className="text-[15px] font-bold tracking-tight text-slate-50">Capacity Connect</span>
        </div>

        {/* Overview Navigation */}
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#92929E] px-2 mb-2">
            OVERVIEW
          </div>
          <nav className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavSelect && onNavSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-left ${
                    isActive
                      ? 'text-[#73bfc4] font-bold bg-[#73bfc4]/10 border border-[#73bfc4]/20'
                      : 'text-slate-300 hover:text-slate-50 hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#73bfc4] stroke-[2.2]' : 'text-slate-300'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#73bfc4] shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Friends / Contacts Section */}
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-300 px-2 mb-2.5">
            FRIENDS
          </div>
          <div className="space-y-2.5 px-1">
            {COURSUE_FRIENDS.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center gap-2.5 group cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-6 h-6 rounded-full object-cover shrink-0 border border-[#EEEEF4]"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120';
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-slate-50 truncate leading-tight">{friend.name}</p>
                  <p className="text-[10px] text-slate-300 truncate leading-tight">{friend.relation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Settings & Logout */}
      <div className="pt-6">
        <div className="text-[10px] uppercase font-bold tracking-wider text-[#92929E] px-2 mb-2">
          SETTINGS
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onNavSelect && onNavSelect('Settings')}
            className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-left ${
              activeNav === 'Settings'
                ? 'text-[#73bfc4] font-bold bg-[#73bfc4]/10 border border-[#73bfc4]/20'
                : 'text-slate-300 hover:text-slate-50 hover:bg-white/5'
            }`}
          >
            <Settings
              className={`w-4 h-4 shrink-0 transition-colors ${
                activeNav === 'Settings' ? 'text-[#73bfc4] stroke-[2.2]' : 'text-slate-300'
              }`}
            />
            <span className="truncate">Settings</span>
            {activeNav === 'Settings' && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#73bfc4] shrink-0" />
            )}
          </button>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-semibold text-[#E8505B] hover:bg-[#FDF0F0] transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0 text-[#E8505B]" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
