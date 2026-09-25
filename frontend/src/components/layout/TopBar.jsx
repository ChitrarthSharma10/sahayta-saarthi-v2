import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { api } from '../../services/api';

export const TopBar = ({ searchQuery, setSearchQuery }) => {
  const { user, role } = useAuth();
  const { addToast } = useToast();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const notifRef = useRef(null);

  /* ── Close dropdowns on outside click ──────────────────────── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ── Fetch announcements ────────────────────────────────────── */
  useEffect(() => {
    const fetchAnnouncements = () => api
      .getAnnouncements()
      .then((res) => {
        if (res?.announcements) setAnnouncements(res.announcements);
      })
      .catch((e) => console.warn('Could not load announcements', e));
    fetchAnnouncements();
    const refreshInterval = window.setInterval(fetchAnnouncements, 5000);
    window.addEventListener('capacity-connect-announcements-updated', fetchAnnouncements);
    return () => {
      window.clearInterval(refreshInterval);
      window.removeEventListener('capacity-connect-announcements-updated', fetchAnnouncements);
    };
  }, []);

  return (
    <header className="h-[68px] bg-slate-950/45 border-b border-white/10 px-6 flex items-center gap-4 sticky top-0 z-20 backdrop-blur-xl">

      {/* ── Wide pill search bar ─────────────────────────────── */}
      <div className="relative flex-1 max-w-[520px]">
        <Search className="w-4 h-4 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search your course, assessment, or trainer…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 focus:border-[#73bfc4] text-slate-50 placeholder-slate-300 text-[13px] rounded-full pl-10 pr-4 py-2.5 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#73bfc4]/15"
        />
      </div>

      {/* ── Right-side controls ──────────────────────────────── */}
      <div className="ml-auto flex items-center gap-2">

        {/* Messages icon */}
        <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#73bfc4] hover:border-[#73bfc4]/30 transition-colors">
          <MessageCircle className="w-4 h-4" />
        </button>

        {/* Notifications bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen((p) => !p)}
            className="relative w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#73bfc4] hover:border-[#73bfc4]/30 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {announcements.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#73bfc4] text-slate-950 font-black text-[9px] flex items-center justify-center shadow">
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
