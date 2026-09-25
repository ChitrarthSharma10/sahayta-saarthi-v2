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
    <aside className="w-[170px] xl:w-[180px] bg-white border-r border-[#EEEEF4] flex flex-col shrink-0 min-h-screen sticky top-0 py-6 px-4 select-none z-20 justify-between">
      {/* Top Section: Logo & Nav */}
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-7 h-7 rounded-full bg-[#755BE8] flex items-center justify-center text-white shadow-sm shadow-[#755BE8]/30 shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
              <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight text-[#19191F]">Capacity Connect</span>
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
                      ? 'text-[#755BE8] font-bold bg-[#EEE9FB]'
                      : 'text-[#92929E] hover:text-[#19191F] hover:bg-[#F9F9FC]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#755BE8] stroke-[2.2]' : 'text-[#92929E]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#755BE8] shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Friends / Contacts Section */}
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#92929E] px-2 mb-2.5">
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
                  <p className="text-[11px] font-bold text-[#19191F] truncate leading-tight">{friend.name}</p>
                  <p className="text-[10px] text-[#92929E] truncate leading-tight">{friend.relation}</p>
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
                ? 'text-[#755BE8] font-bold bg-[#EEE9FB]'
                : 'text-[#92929E] hover:text-[#19191F] hover:bg-[#F9F9FC]'
            }`}
          >
            <Settings
              className={`w-4 h-4 shrink-0 transition-colors ${
                activeNav === 'Settings' ? 'text-[#755BE8] stroke-[2.2]' : 'text-[#92929E]'
              }`}
            />
            <span className="truncate">Settings</span>
            {activeNav === 'Settings' && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#755BE8] shrink-0" />
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
