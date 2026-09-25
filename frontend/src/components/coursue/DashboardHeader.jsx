import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MessageSquare,
  Bell,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { api } from '../../services/api';

export const DashboardHeader = ({ searchQuery, setSearchQuery }) => {
  const { user, role } = useAuth();
  const { addToast } = useToast();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  useEffect(() => {
    const fetchAnnouncements = () => api.getAnnouncements()
      .then((response) => setAnnouncements(response?.announcements || []))
      .catch((error) => console.warn('Could not load announcements', error));
    fetchAnnouncements();
    const refreshInterval = window.setInterval(fetchAnnouncements, 5000);
    window.addEventListener('capacity-connect-announcements-updated', fetchAnnouncements);
    return () => {
      window.clearInterval(refreshInterval);
      window.removeEventListener('capacity-connect-announcements-updated', fetchAnnouncements);
    };
  }, []);

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 pb-6">
      {/* Wide dark glass search field */}
      <div className="relative flex-1 max-w-xl w-full">
        <div className="w-full bg-white/5 rounded-full border border-white/10 px-4 py-2.5 flex items-center gap-3 transition-all focus-within:border-[#73bfc4]/60 focus-within:ring-2 focus-within:ring-[#73bfc4]/10 backdrop-blur-xl">
          <Search className="w-4 h-4 text-slate-300 shrink-0" />
          <input
            type="text"
            placeholder="Search your course...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-xs text-slate-50 placeholder-slate-300 outline-none font-medium"
          />
        </div>
      </div>

      {/* Right Controls: Messages, Notifications, Divider, User Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Circular Message Button */}
        <button
          type="button"
          onClick={() => addToast('No unread messages in inbox', 'info')}
          className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-100 hover:bg-white/10 transition-colors relative"
          title="Messages"
        >
          <MessageSquare className="w-4 h-4 text-slate-100" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#73bfc4]" />
        </button>

        {/* Circular Notification Bell Button */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((previous) => !previous)}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-100 hover:bg-white/10 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-100" />
            {announcements.length > 0 && <span className="absolute top-1.5 right-1.5 min-w-3.5 h-3.5 rounded-full bg-[#73bfc4] px-0.5 text-[8px] font-bold text-slate-950">{announcements.length}</span>}
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-[#EEEEF4] bg-white p-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#EEEEF4] pb-3"><span className="text-xs font-bold text-[#19191F]">Announcements</span><span className="text-[10px] text-[#92929E]">{announcements.length} updates</span></div>
              <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
                {announcements.length === 0 ? <p className="py-4 text-center text-[11px] text-[#92929E]">No announcements</p> : announcements.map((announcement) => <div key={announcement._id} className="rounded-xl border border-[#EEEEF4] bg-[#F6F7FB] p-3"><p className="text-xs font-bold text-[#19191F]">{announcement.title}</p><p className="mt-1 text-[11px] text-[#92929E]">{announcement.content}</p></div>)}
              </div>
            </div>
          )}
        </div>

        {/* Subtle Divider */}
        <div className="h-6 w-[1px] bg-white/10 mx-1" />

        {/* User Avatar & Name */}
        <div className="flex items-center gap-2.5 hover:opacity-90 transition-opacity bg-white/5 border border-white/10 p-1.5 rounded-full">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="User avatar"
            className="w-8 h-8 rounded-full object-cover border border-white/10 shadow-sm"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
            }}
          />
          <span className="text-xs font-bold text-slate-50 hidden sm:inline-block">
            {user?.name || 'Jason Ranti'}
          </span>
        </div>
      </div>
    </header>
  );
};
