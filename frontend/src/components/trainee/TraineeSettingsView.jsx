import React, { useState } from 'react';
import { User, Bell, Shield, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

export const TraineeSettingsView = () => {
  const { user, updateUser, switchDemoRole } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [specialization, setSpecialization] = useState(user?.profile?.department || 'Vocational Skills');
  const [bio, setBio] = useState(user?.profile?.bio || 'Dedicated learner acquiring new competencies.');
  const [notifications, setNotifications] = useState({
    quizAlerts: true,
    courseUpdates: true,
    streakReminders: true,
  });
  const [saving, setSaving] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = {
        ...user,
        name,
        profile: {
          ...(user?.profile || {}),
          department: specialization,
          bio,
        },
      };
      updateUser(updated);
      try {
        localStorage.setItem('capacity_connect_user', JSON.stringify(updated));
      } catch {
        // ignore
      }
      addToast('Profile updated successfully.', 'success');
    } catch {
      addToast('Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRoleSwitch = async (targetRole) => {
    if (switchingRole || targetRole === user?.role) return;
    setSwitchingRole(true);
    try {
      await switchDemoRole(targetRole);
      addToast(`Switched to ${targetRole} role.`, 'success');
    } catch {
      addToast('Could not switch role.', 'error');
    } finally {
      setSwitchingRole(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#19191F]">Settings & Preferences</h2>
        <p className="mt-1 text-sm text-[#92929E]">
          Manage your personal profile, notifications, and account configuration.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <section className="rounded-3xl border border-[#EEEEF4] bg-white p-6 shadow-card space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEE9FB] flex items-center justify-center text-[#755BE8]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#19191F]">Learner Profile</h3>
              <p className="text-xs text-[#92929E]">Personal information displayed across courses and certificates</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#19191F] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-[#EEEEF4] bg-[#F6F7FB] px-3.5 py-2.5 text-xs text-[#19191F] outline-none focus:border-[#755BE8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#19191F] mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full rounded-xl border border-[#EEEEF4] bg-[#F6F7FB] px-3.5 py-2.5 text-xs text-[#92929E] outline-none cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#19191F] mb-1.5">Focus Track / Specialization</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Frontend Development, Data Analytics"
                  className="w-full rounded-xl border border-[#EEEEF4] bg-[#F6F7FB] px-3.5 py-2.5 text-xs text-[#19191F] outline-none focus:border-[#755BE8] transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#19191F] mb-1.5">Bio / Learning Goal</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A short note on what skills you are aiming to develop..."
                  className="w-full rounded-xl border border-[#EEEEF4] bg-[#F6F7FB] px-3.5 py-2.5 text-xs text-[#19191F] outline-none focus:border-[#755BE8] transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#755BE8] hover:bg-[#6448DE] text-white text-xs font-bold shadow-md shadow-[#755BE8]/20 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </section>

        {/* Notifications Card */}
        <section className="rounded-3xl border border-[#EEEEF4] bg-white p-6 shadow-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEE9FB] flex items-center justify-center text-[#755BE8]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#19191F]">Study & Assessment Notifications</h3>
              <p className="text-xs text-[#92929E]">Select alerts you wish to receive during your learning journey</p>
            </div>
          </div>

          <div className="divide-y divide-[#EEEEF4] text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#19191F]">Assessment Score & Result Alerts</p>
                <p className="text-[11px] text-[#92929E]">Instant feedback and notifications upon evaluation completion</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.quizAlerts}
                onChange={(e) => setNotifications((p) => ({ ...p, quizAlerts: e.target.checked }))}
                className="w-4 h-4 accent-[#755BE8] rounded cursor-pointer"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#19191F]">New Course Curriculum Alerts</p>
                <p className="text-[11px] text-[#92929E]">Notifies when instructors publish new course lessons or resources</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.courseUpdates}
                onChange={(e) => setNotifications((p) => ({ ...p, courseUpdates: e.target.checked }))}
                className="w-4 h-4 accent-[#755BE8] rounded cursor-pointer"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#19191F]">Daily Activity Streak Reminders</p>
                <p className="text-[11px] text-[#92929E]">Gentle reminders to maintain your daily study activity streak</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.streakReminders}
                onChange={(e) => setNotifications((p) => ({ ...p, streakReminders: e.target.checked }))}
                className="w-4 h-4 accent-[#755BE8] rounded cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Demo Role Switcher */}
        <section className="rounded-3xl border border-[#EEEEF4] bg-white p-6 shadow-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEE9FB] flex items-center justify-center text-[#755BE8]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#19191F]">Role & Simulation</h3>
              <p className="text-xs text-[#92929E]">Current authenticated role: <span className="font-bold text-[#755BE8]">{user?.role || 'Trainee'}</span></p>
            </div>
          </div>

          <p className="text-xs text-[#92929E]">
            Test other perspectives in the Capacity Connect ecosystem by switching your session role:
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            {['Trainee', 'Trainer', 'Admin'].map((roleOption) => (
              <button
                key={roleOption}
                type="button"
                disabled={switchingRole || user?.role === roleOption}
                onClick={() => handleRoleSwitch(roleOption)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  user?.role === roleOption
                    ? 'bg-[#EEE9FB] text-[#755BE8] cursor-default'
                    : 'bg-[#F6F7FB] text-[#92929E] hover:text-[#19191F] hover:bg-[#EEEEF4] cursor-pointer'
                }`}
              >
                {user?.role === roleOption && <CheckCircle2 className="w-3.5 h-3.5 text-[#755BE8]" />}
                <span>{roleOption}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
