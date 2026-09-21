import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  MessageCircle,
  ChevronDown,
  UserCheck,
  Shield,
  GraduationCap,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { api } from '../../services/api';

export const TopBar = ({ searchQuery, setSearchQuery }) => {
  const { user, role, switchDemoRole } = useAuth();
  const { addToast } = useToast();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  /* ── Close dropdowns on outside click ──────────────────────── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setRoleDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ── Fetch announcements ────────────────────────────────────── */
  useEffect(() => {
    api
      .getAnnouncements()
      .then((res) => {
        if (res?.announcements) setAnnouncements(res.announcements);
      })
      .catch((e) => console.warn('Could not load announcements', e));
  }, []);

  const handleRoleSelect = async (targetRole) => {
    if (targetRole === role) { setRoleDropdownOpen(false); return; }
    setRoleDropdownOpen(false);
    addToast(`Switching to ${targetRole} view…`, 'info');
    await switchDemoRole(targetRole);
    addToast(`Switched to ${targetRole} role!`, 'success');
  };

  const ROLES = [
    { roleName: 'Trainee',  desc: 'Take quizzes, track progress',   icon: GraduationCap, dot: 'bg-amber-400'   },
    { roleName: 'Trainer',  desc: 'Build MCQs, upload materials',   icon: UserCheck,     dot: 'bg-violet-500'  },
    { roleName: 'Admin',    desc: 'Approve trainees, map competency', icon: Shield,       dot: 'bg-emerald-500' },
  ];

  return (
    <header className="h-[68px] bg-white border-b border-[#EEEEF4] px-6 flex items-center gap-4 sticky top-0 z-20">

      {/* ── Wide pill search bar ─────────────────────────────── */}
      <div className="relative flex-1 max-w-[520px]">
        <Search className="w-4 h-4 text-[#92929E] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search your course, assessment, or trainer…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#F6F7FB] border border-[#EEEEF4] focus:border-[#755BE8] text-[#19191F] placeholder-[#92929E] text-[13px] rounded-full pl-10 pr-4 py-2.5 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#755BE8]/15"
        />
      </div>

      {/* ── Right-side controls ──────────────────────────────── */}
      <div className="ml-auto flex items-center gap-2">

        {/* Messages icon */}
        <button className="w-9 h-9 rounded-full bg-[#F6F7FB] border border-[#EEEEF4] flex items-center justify-center text-[#92929E] hover:text-[#755BE8] hover:border-[#755BE8]/30 transition-colors">
          <MessageCircle className="w-4 h-4" />
        </button>

        {/* Notifications bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen((p) => !p)}
            className="relative w-9 h-9 rounded-full bg-[#F6F7FB] border border-[#EEEEF4] flex items-center justify-center text-[#92929E] hover:text-[#755BE8] hover:border-[#755BE8]/30 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {announcements.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#755BE8] text-white font-black text-[9px] flex items-center justify-center shadow">
                {announcements.length}
              </span>
            )}
          </button>

          {/* Announcements popover */}
          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#EEEEF4] shadow-xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-[#EEEEF4]">
                <span className="text-xs font-bold text-[#19191F]">Announcements</span>
                <span className="text-[10px] text-[#92929E]">{announcements.length} updates</span>
              </div>
              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
                {announcements.length === 0 ? (
                  <p className="text-[11px] text-[#92929E] text-center py-4">No new announcements</p>
                ) : (
                  announcements.map((ann) => (
                    <div
                      key={ann._id}
                      className="p-2.5 rounded-xl bg-[#F6F7FB] border border-[#EEEEF4] text-left"
                    >
                      <div className="text-xs font-bold text-[#19191F]">{ann.title}</div>
                      <div className="text-[11px] text-[#92929E] mt-0.5 line-clamp-2">{ann.content}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Subtle vertical divider */}
        <div className="h-7 w-px bg-[#EEEEF4] mx-1" />

        {/* Demo Role Switcher dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setRoleDropdownOpen((p) => !p)}
            className="flex items-center gap-2 pl-3 pr-2.5 py-2 rounded-full bg-[#EEE9FB] border border-[#755BE8]/20 text-[#755BE8] text-xs font-bold hover:bg-[#e0d8f9] transition-colors"
          >
            <span className="text-[11px]">{role}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${roleDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#EEEEF4] shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-[#EEEEF4]">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#19191F]">Switch Role Preview</p>
                <p className="text-[10px] text-[#92929E] mt-0.5">Toggle without logging out</p>
              </div>
              <div className="p-1.5 space-y-0.5">
                {ROLES.map((item) => {
                  const isSelected = role === item.roleName;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.roleName}
                      onClick={() => handleRoleSelect(item.roleName)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-[#EEE9FB] text-[#755BE8]'
                          : 'text-[#92929E] hover:bg-[#F6F7FB] hover:text-[#19191F]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#755BE8]/10' : 'bg-[#F6F7FB]'}`}>
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-[#755BE8]' : 'text-[#92929E]'}`} />
                        </div>
                        <div>
                          <div className="text-xs font-bold flex items-center gap-1.5">
                            {item.roleName}
                            {isSelected && (
                              <span className="text-[9px] px-1.5 rounded bg-[#755BE8]/10 text-[#755BE8] font-bold">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#92929E]">{item.desc}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#755BE8] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User avatar badge */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="text-right hidden sm:block">
            <div className="text-[12px] font-bold text-[#19191F] leading-tight">{user?.name}</div>
            <div className="text-[10px] font-medium text-[#92929E]">
              {user?.profile?.department || role}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#755BE8] text-white font-bold flex items-center justify-center text-sm shadow-md shadow-[#755BE8]/25">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
