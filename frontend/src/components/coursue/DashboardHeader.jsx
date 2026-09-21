import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MessageSquare,
  Bell,
  ChevronDown,
  Shield,
  UserCheck,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

export const DashboardHeader = ({ searchQuery, setSearchQuery }) => {
  const { user, role, switchDemoRole } = useAuth();
  const { addToast } = useToast();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleRoleSelect = async (targetRole) => {
    setRoleMenuOpen(false);
    addToast(`Switching view to ${targetRole}...`, 'info');
    await switchDemoRole(targetRole);
  };

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 pb-6">
      {/* Wide White Pill Search Field */}
      <div className="relative flex-1 max-w-xl w-full">
        <div className="w-full bg-white rounded-full border border-[#EEEEF4] shadow-card px-4 py-2.5 flex items-center gap-3 transition-all focus-within:border-[#755BE8]/60 focus-within:ring-2 focus-within:ring-[#755BE8]/10">
          <Search className="w-4 h-4 text-[#92929E] shrink-0" />
          <input
            type="text"
            placeholder="Search your course...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-xs text-[#19191F] placeholder-[#92929E] outline-none font-medium"
          />
        </div>
      </div>

      {/* Right Controls: Messages, Notifications, Divider, User Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Circular Message Button */}
        <button
          type="button"
          onClick={() => addToast('No unread messages in inbox', 'info')}
          className="w-9 h-9 rounded-full bg-white border border-[#EEEEF4] shadow-card flex items-center justify-center text-[#19191F] hover:bg-[#F9F9FC] transition-colors relative"
          title="Messages"
        >
          <MessageSquare className="w-4 h-4 text-[#19191F]" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#755BE8]" />
        </button>

        {/* Circular Notification Bell Button */}
        <button
          type="button"
          onClick={() => addToast('All learning notifications up to date', 'info')}
          className="w-9 h-9 rounded-full bg-white border border-[#EEEEF4] shadow-card flex items-center justify-center text-[#19191F] hover:bg-[#F9F9FC] transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-[#19191F]" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#E8505B]" />
        </button>

        {/* Subtle Divider */}
        <div className="h-6 w-[1px] bg-[#EEEEF4] mx-1" />

        {/* User Avatar & Name with Role Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity bg-transparent p-1 rounded-full"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Jason Ranti"
              className="w-8 h-8 rounded-full object-cover border border-[#EEEEF4] shadow-sm"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
              }}
            />
            <span className="text-xs font-bold text-[#19191F] hidden sm:inline-block">
              {user?.name || 'Jason Ranti'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#92929E]" />
          </button>

          {/* Role Switching Dropdown to preserve multi-role console access */}
          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#EEEEF4] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 border-b border-[#EEEEF4] mb-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#92929E]">
                  Current View: {role}
                </p>
                <p className="text-[11px] text-[#92929E]">Switch platform role</p>
              </div>

              {[
                { roleName: 'Trainee', label: 'Trainee (Coursue)', icon: GraduationCap },
                { roleName: 'Trainer', label: 'Trainer Console', icon: UserCheck },
                { roleName: 'Admin', label: 'Admin Governance', icon: Shield },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = role === item.roleName;

                return (
                  <button
                    key={item.roleName}
                    type="button"
                    onClick={() => handleRoleSelect(item.roleName)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                      isSelected
                        ? 'bg-[#EEE9FB] text-[#755BE8] font-bold'
                        : 'text-[#19191F] hover:bg-[#F9F9FC]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
