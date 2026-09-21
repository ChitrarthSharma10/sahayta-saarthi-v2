import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  GitMerge,
  UserCheck,
  Megaphone,
  TrendingUp,
  Bell,
  Plus,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';

const FeedbackInbox = () => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const loadFeedback = () => api.getFeedback()
      .then((response) => setFeedback(response?.feedback || []))
      .catch((error) => console.warn('Could not load feedback:', error));
    loadFeedback();
    const refreshInterval = window.setInterval(loadFeedback, 5000);
    return () => window.clearInterval(refreshInterval);
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-[#19191F]">Feedback Inbox</h2>
        <p className="mt-1 text-sm text-[#92929E]">Review feedback submitted by trainees and trainers.</p>
      </div>
      {feedback.length === 0 ? (
        <div className="rounded-3xl border border-[#EEEEF4] bg-white py-16 text-center text-xs text-[#92929E]">No feedback received yet.</div>
      ) : (
        <div className="space-y-3">
          {feedback.map((item) => (
            <article key={item._id} className="rounded-2xl border border-[#EEEEF4] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-[#19191F]">{item.userName}</h3>
                  <p className="mt-0.5 text-[11px] text-[#92929E]">{item.userRole} · {item.category}</p>
                </div>
                <span className="text-sm font-bold text-amber-500">{'★'.repeat(item.rating)}<span className="text-[#D8D8E2]">{'★'.repeat(5 - item.rating)}</span></span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#555563]">{item.message}</p>
              <p className="mt-3 text-[10px] text-[#92929E]">{new Date(item.createdAt).toLocaleString('en-IN')}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   SHARED DATA HOOK
   ════════════════════════════════════════════════════════════════ */
const useAdminData = () => {
  const [users,            setUsers]            = useState([]);
  const [courses,          setCourses]          = useState([]);
  const [announcements,    setAnnouncements]    = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [matchingResults,  setMatchingResults]  = useState(null);
  const [matchingLoading,  setMatchingLoading]  = useState(false);
  const [loading,          setLoading]          = useState(true);
  const [actionLoading,    setActionLoading]    = useState({});
  const { addToast } = useToast();

  useEffect(() => {
    const refreshUsers = async () => {
      try {
        const usersRes = await api.getUsers();
        if (usersRes?.users) setUsers(usersRes.users);
      } catch (err) {
        console.warn('Error refreshing user access statuses:', err);
      }
    };

    const fetchData = async () => {
      try {
        const [usersRes, coursesRes, announcementsRes] = await Promise.all([
          api.getUsers(),
          api.getCourses(),
          api.getAnnouncements(),
        ]);
        if (usersRes?.users)              setUsers(usersRes.users);
        if (coursesRes?.courses) {
          setCourses(coursesRes.courses);
          if (coursesRes.courses.length > 0) setSelectedCourseId(coursesRes.courses[0]._id);
        }
        if (announcementsRes?.announcements) setAnnouncements(announcementsRes.announcements);
      } catch (err) {
        console.warn('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const refreshInterval = window.setInterval(refreshUsers, 5000);
    return () => window.clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    const fetchMatches = async (showLoading = false) => {
      if (showLoading) setMatchingLoading(true);
      try {
        const res = await api.getCompetencyMatches(selectedCourseId);
        if (res?.success) setMatchingResults(res);
      } catch (err) {
        console.warn('Error fetching competency match:', err);
      } finally {
        if (showLoading) setMatchingLoading(false);
      }
    };

    fetchMatches(true);
    const refreshInterval = window.setInterval(() => fetchMatches(), 5000);
    const handleAccessChange = () => fetchMatches();
    window.addEventListener('capacity-connect-user-access-updated', handleAccessChange);
    return () => {
      window.clearInterval(refreshInterval);
      window.removeEventListener('capacity-connect-user-access-updated', handleAccessChange);
    };
  }, [selectedCourseId]);

  const handleStatusChange = async (userId, newStatus) => {
    setActionLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      const res = await api.updateUserStatus(userId, newStatus);
      if (res?.success) {
        addToast(`User marked as ${newStatus} successfully.`, newStatus === 'Approved' ? 'success' : 'info');
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u)));
        window.dispatchEvent(new Event('capacity-connect-user-access-updated'));
      }
    } catch (err) {
      addToast(err.message || `Failed to update user to ${newStatus}.`, 'error');
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return {
    users, courses, announcements, setAnnouncements, selectedCourseId, setSelectedCourseId,
    matchingResults, matchingLoading, loading, actionLoading, handleStatusChange, addToast,
  };
};

/* ════════════════════════════════════════════════════════════════
   SUB-VIEWS
   ════════════════════════════════════════════════════════════════ */

/* ── 1. Dashboard Overview ───────────────────────────────────── */
const DashboardView = ({ user, users, courses, announcements }) => {
  const pendingCount  = users.filter((u) => u.status === 'Pending').length;
  const approvedCount = users.filter((u) => u.status === 'Approved').length;
  const rejectedCount = users.filter((u) => u.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#19191F] to-[#2d2a4a] p-7 overflow-hidden shadow-xl">
        <div className="absolute -right-8 -top-8 w-52 h-52 bg-[#755BE8]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-0 -bottom-4 w-40 h-40 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider mb-3">
              <Shield className="w-3 h-3" /> Administrator Console
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Enterprise Governance, <span className="text-white/70">{user?.name || 'Arjun Mehta'}</span>
            </h1>
            <p className="text-sm text-white/60 mt-1 max-w-xl">
              Audit and approve participant access, inspect onboarding, and match verified trainers.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 border border-white/20 backdrop-blur-sm p-4 rounded-2xl shrink-0">
            <div className="p-2.5 rounded-xl bg-amber-400/20 border border-amber-400/30 text-amber-300">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-white/60 font-medium">Pending Approvals</div>
              <div className="text-xl font-extrabold text-amber-300">{pendingCount} Candidates</div>
              <div className="text-[10px] text-white/50">{approvedCount} accounts approved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users',    value: users.length,  icon: Users,        color: 'bg-[#EEE9FB] text-[#755BE8]'    },
          { label: 'Pending Review', value: pendingCount,  icon: Clock,        color: 'bg-amber-50 text-amber-500'      },
          { label: 'Approved',       value: approvedCount, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-500'  },
          { label: 'Total Courses',  value: courses.length,icon: GitMerge,     color: 'bg-blue-50 text-blue-500'        },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl bg-white border border-[#EEEEF4] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#92929E]">{label}</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-4 h-4" /></div>
            </div>
            <span className="text-3xl font-extrabold text-[#19191F]">{value}</span>
          </div>
        ))}
      </div>

      {/* Recent pending users */}
      <div className="bg-white rounded-3xl border border-[#EEEEF4] shadow-sm p-6">
        <h2 className="text-[15px] font-bold text-[#19191F] flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-[#755BE8]" /> Recent Pending Approvals
        </h2>
        {users.filter((u) => u.status === 'Pending').slice(0, 5).length === 0 ? (
          <div className="py-8 text-center rounded-2xl bg-[#F6F7FB] border border-[#EEEEF4]">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs text-[#92929E]">All caught up — no pending approvals!</p>
          </div>
        ) : (
          <div className="divide-y divide-[#EEEEF4]">
            {users.filter((u) => u.status === 'Pending').slice(0, 5).map((u) => (
              <div key={u._id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${u.role === 'Trainer' ? 'bg-[#EEE9FB] text-[#755BE8]' : 'bg-amber-50 text-amber-500'}`}>
                    {u.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#19191F]">{u.name}</p>
                    <p className="text-[11px] text-[#92929E]">{u.role} · {u.email}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 font-bold animate-pulse">
                  Pending
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent announcements */}
      {announcements.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#EEEEF4] shadow-sm p-6">
          <h2 className="text-[15px] font-bold text-[#19191F] flex items-center gap-2 mb-4">
            <Megaphone className="w-4 h-4 text-[#755BE8]" /> Latest Announcements
          </h2>
          <div className="space-y-3">
            {announcements.slice(0, 3).map((ann) => (
              <div key={ann._id} className="p-4 rounded-2xl bg-[#F6F7FB] border border-[#EEEEF4]">
                <p className="text-xs font-bold text-[#19191F]">{ann.title}</p>
                <p className="text-[11px] text-[#92929E] mt-1 line-clamp-2">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── 2. User Approvals full table ─────────────────────────────── */
const UserApprovalsView = ({ users, actionLoading, handleStatusChange, searchQuery }) => {
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [roleFilter,   setRoleFilter]   = useState('All');

  const pendingCount = users.filter((u) => u.status === 'Pending').length;

  const filtered = users.filter((u) => {
    const matchStatus = statusFilter === 'All' || u.status === statusFilter;
    const matchRole   = roleFilter   === 'All' || u.role   === roleFilter;
    const matchSearch =
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.profile?.department?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchRole && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-[#19191F]">User Access Approval</h2>
        <p className="text-sm text-[#92929E] mt-1">Review and authorize trainee registrations and trainer certifications</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#EEEEF4] shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-[#EEEEF4] flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#F6F7FB] p-1 rounded-xl border border-[#EEEEF4]">
            {['Pending', 'Approved', 'Rejected', 'All'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === st ? 'bg-[#755BE8] text-white shadow-sm' : 'text-[#92929E] hover:text-[#19191F]'
                }`}
              >
                {st}
                {st === 'Pending' && pendingCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] bg-amber-400 text-white font-black">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#F6F7FB] border border-[#EEEEF4] text-[#19191F] text-xs rounded-xl px-3 py-2 outline-none focus:border-[#755BE8] transition-colors"
          >
            <option value="All">All Roles</option>
            <option value="Trainee">Trainees Only</option>
            <option value="Trainer">Trainers Only</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#EEEEF4] bg-[#F6F7FB] text-[11px] uppercase tracking-wider text-[#92929E] font-bold">
                <th className="py-3.5 px-6">User / Identity</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Department & Title</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEF4]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center text-[#92929E] text-xs">
                    No users found matching current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const isPending  = u.status === 'Pending';
                  const isApproved = u.status === 'Approved';
                  const isTrainer  = u.role   === 'Trainer';
                  const isLoading  = actionLoading[u._id];
                  return (
                    <tr key={u._id} className="hover:bg-[#F6F7FB]/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${isTrainer ? 'bg-[#EEE9FB] text-[#755BE8]' : 'bg-amber-50 text-amber-500'}`}>
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-[#19191F] flex items-center gap-1.5">
                              {u.name}
                              {u.role === 'Admin' && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold border border-emerald-100">ADMIN</span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#92929E]">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-[10px] font-bold border ${isTrainer ? 'bg-[#EEE9FB] text-[#755BE8] border-[#755BE8]/20' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#19191F]">{u.profile?.designation || 'Not specified'}</div>
                        <div className="text-[11px] text-[#92929E]">{u.profile?.department || 'Operations'}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                          isPending  ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' :
                          isApproved ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                       'bg-rose-50 text-rose-500 border-rose-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isPending ? 'bg-amber-400' : isApproved ? 'bg-emerald-500' : 'bg-rose-400'}`} />
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {u.role !== 'Admin' && (
                          <div className="flex items-center justify-end gap-2">
                            {u.status !== 'Approved' && (
                              <button
                                type="button"
                                disabled={isLoading}
                                onClick={() => handleStatusChange(u._id, 'Approved')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white text-xs font-bold border border-emerald-100 hover:border-emerald-500 transition-all disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                              </button>
                            )}
                            {u.status !== 'Rejected' && (
                              <button
                                type="button"
                                disabled={isLoading}
                                onClick={() => handleStatusChange(u._id, 'Rejected')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white text-xs font-bold border border-rose-100 hover:border-rose-500 transition-all disabled:opacity-50"
                              >
                                <XCircle className="w-3.5 h-3.5" /> {isApproved ? 'Revoke Access' : 'Reject'}
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ── 3. Competency Mapping ────────────────────────────────────── */
const CompetencyView = ({ courses, selectedCourseId, setSelectedCourseId, matchingResults, matchingLoading, addToast }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-extrabold text-[#19191F]">Competency Mapping Engine</h2>
      <p className="text-sm text-[#92929E] mt-1">Select a curriculum track to find best-matched qualified trainers</p>
    </div>

    <div className="bg-white rounded-3xl border border-[#EEEEF4] shadow-sm p-6 space-y-6">
      {/* Course Selector */}
      <div className="max-w-lg">
        <label className="block text-xs font-semibold text-[#19191F] mb-1.5">Select Curriculum Track:</label>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="w-full bg-[#F6F7FB] border border-[#EEEEF4] focus:border-[#755BE8] text-[#19191F] text-xs rounded-xl px-4 py-3 outline-none transition-colors"
        >
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title} · {c.subject} / {c.category}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {matchingLoading ? (
        <div className="py-14 text-center rounded-2xl bg-[#F6F7FB] border border-[#EEEEF4]">
          <Sparkles className="w-6 h-6 text-[#755BE8] animate-spin mx-auto mb-2" />
          <p className="text-xs text-[#92929E]">Querying competency database…</p>
        </div>
      ) : matchingResults?.matchedTrainers?.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#92929E]">
              Ranked Matches ({matchingResults.matchedTrainers.length} Found)
            </span>
            <span className="text-xs text-[#755BE8] font-semibold">
              Subject: <strong>{matchingResults.subject}</strong>
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchingResults.matchedTrainers.map((trainer, rankIdx) => (
              <div
                key={trainer._id}
                className="p-5 rounded-2xl bg-[#F6F7FB] border border-[#EEEEF4] hover:border-[#755BE8]/30 hover:bg-[#EEE9FB]/20 transition-all space-y-4 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#755BE8] to-[#6448DE] text-white font-bold text-base flex items-center justify-center shadow-md shadow-[#755BE8]/20 shrink-0">
                      {trainer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#19191F] group-hover:text-[#755BE8] transition-colors">{trainer.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold">Approved</span>
                      </div>
                      <p className="text-[11px] text-[#92929E]">{trainer.designation}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-[#EEE9FB] text-[#755BE8]">
                    <Sparkles className="w-3 h-3" /> {trainer.matchScore}
                  </span>
                </div>

                {trainer.bio && (
                  <p className="text-xs text-[#92929E] line-clamp-2 leading-relaxed italic">"{trainer.bio}"</p>
                )}

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#92929E] mb-1.5">Matched Competencies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {trainer.matchedTerms?.map((term, i) => (
                      <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#EEE9FB] text-[#755BE8]">✓ {term}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#92929E] mb-1.5">Skill Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {trainer.skills?.slice(0, 4).map((skill, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-lg bg-white text-[#92929E] border border-[#EEEEF4]">{skill}</span>
                    ))}
                  </div>
                </div>

                {trainer.qualifications?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#92929E] mb-1.5">Verified documents submitted</p>
                    <div className="space-y-1">
                      {trainer.qualifications.map((qualification, index) => (
                        <a key={`${qualification.title}-${index}`} href={qualification.url} target="_blank" rel="noreferrer" className="block truncate text-[10px] font-semibold text-[#755BE8] hover:underline">
                          {qualification.title}{qualification.issuer ? ` · ${qualification.issuer}` : ''}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-[#EEEEF4] flex items-center justify-between">
                  <span className="text-[11px] text-[#92929E]">Rank #{rankIdx + 1} Best Fit</span>
                  <button
                    type="button"
                    onClick={() => addToast(`Assigned ${trainer.name} as lead instructor!`, 'success')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#EEE9FB] hover:bg-[#755BE8] text-[#755BE8] hover:text-white text-xs font-bold border border-[#755BE8]/20 hover:border-[#755BE8] transition-all"
                  >
                    <UserCheck className="w-3.5 h-3.5" /> Assign Trainer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-12 rounded-2xl bg-[#F6F7FB] border border-[#EEEEF4] text-center">
          <GitMerge className="w-8 h-8 text-[#92929E] mx-auto mb-2" />
          <p className="text-xs text-[#92929E]">No matching approved trainers found for this course subject.</p>
        </div>
      )}
    </div>
  </div>
);

/* ── 4. Announcements ──────────────────────────────────────────── */
const AnnouncementComposer = ({ user, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('announcement');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      const response = await api.createAnnouncement({
        title,
        content,
        type,
        postedBy: user?._id,
        postedByName: user?.name,
      });
      if (response?.announcement) onCreated(response.announcement);
    } catch (error) {
      window.alert(error.message || 'Failed to publish announcement.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4 rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#19191F]">New Announcement</h2>
          <button type="button" onClick={onClose} className="text-xs font-semibold text-[#92929E]">Cancel</button>
        </div>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Announcement title" className="w-full rounded-xl border border-[#EEEEF4] bg-[#F6F7FB] px-3 py-2.5 text-sm outline-none focus:border-[#755BE8]" required />
        <select value={type} onChange={(event) => setType(event.target.value)} className="w-full rounded-xl border border-[#EEEEF4] bg-[#F6F7FB] px-3 py-2.5 text-xs outline-none focus:border-[#755BE8]">
          <option value="announcement">Announcement</option>
          <option value="achievement">Achievement</option>
        </select>
        <textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Write the message for all learners and trainers" rows={5} className="w-full rounded-xl border border-[#EEEEF4] bg-[#F6F7FB] px-3 py-2.5 text-sm outline-none focus:border-[#755BE8]" required />
        <button disabled={saving} className="w-full rounded-xl bg-[#755BE8] py-3 text-xs font-bold text-white disabled:opacity-50">{saving ? 'Publishing...' : 'Publish Announcement'}</button>
      </form>
    </div>
  );
};

const AnnouncementsView = ({ announcements, onCreate, onDelete }) => (
  <div className="space-y-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-extrabold text-[#19191F]">Announcements</h2>
        <p className="text-sm text-[#92929E] mt-1">Platform-wide notifications broadcast to all LMS participants</p>
      </div>
      <button type="button" onClick={onCreate} className="inline-flex items-center gap-2 rounded-xl bg-[#755BE8] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#6448DE]"><Plus className="w-4 h-4" /> New Announcement</button>
    </div>

    <div className="space-y-4">
      {announcements.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white border border-[#EEEEF4]">
          <Megaphone className="w-10 h-10 text-[#92929E] mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#19191F]">No announcements yet</p>
          <p className="text-xs text-[#92929E] mt-1">System broadcasts will appear here when published.</p>
        </div>
      ) : (
        announcements.map((ann, idx) => (
          <div
            key={ann._id || idx}
            className="bg-white rounded-2xl border border-[#EEEEF4] shadow-sm p-5 flex gap-4 hover:border-[#755BE8]/30 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EEE9FB] text-[#755BE8] flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-bold text-[#19191F]">{ann.title}</h3>
                {ann.type && (
                  <span className="text-[10px] shrink-0 font-bold px-2 py-0.5 rounded-full bg-[#EEE9FB] text-[#755BE8]">
                    {ann.type}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#92929E] mt-1.5 leading-relaxed">{ann.content}</p>
              {ann.createdAt && (
                <p className="text-[10px] text-[#92929E] mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(ann.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>
            <button type="button" onClick={() => onDelete(ann)} className="shrink-0 rounded-lg p-2 text-[#92929E] hover:bg-rose-50 hover:text-rose-500" title="Delete announcement"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))
      )}
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════════
   MAIN ADMIN DASHBOARD (view switcher)
   ════════════════════════════════════════════════════════════════ */
export const AdminDashboard = ({ activeTab = 'dashboard', searchQuery = '' }) => {
  const { user } = useAuth();
  const {
    users, courses, announcements, setAnnouncements,
    selectedCourseId, setSelectedCourseId,
    matchingResults, matchingLoading,
    actionLoading, handleStatusChange, addToast,
  } = useAdminData();
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);

  const handleAnnouncementCreated = (announcement) => {
    setAnnouncements((previous) => [announcement, ...previous]);
    window.dispatchEvent(new Event('capacity-connect-announcements-updated'));
    setIsAnnouncementOpen(false);
    addToast('Announcement published to all portals.', 'success');
  };

  const handleAnnouncementDeleted = async (announcement) => {
    try {
      await api.deleteAnnouncement(announcement._id);
      setAnnouncements((previous) => previous.filter((item) => item._id !== announcement._id));
      window.dispatchEvent(new Event('capacity-connect-announcements-updated'));
      addToast('Announcement deleted from all portals.', 'info');
    } catch (error) {
      addToast(error.message || 'Failed to delete announcement.', 'error');
    }
  };

  const renderView = () => {
    switch (activeTab) {
      case 'approvals':
        return <UserApprovalsView users={users} actionLoading={actionLoading} handleStatusChange={handleStatusChange} searchQuery={searchQuery} />;
      case 'competency':
        return (
          <CompetencyView
            courses={courses}
            selectedCourseId={selectedCourseId}
            setSelectedCourseId={setSelectedCourseId}
            matchingResults={matchingResults}
            matchingLoading={matchingLoading}
            addToast={addToast}
          />
        );
      case 'announcements':
        return <AnnouncementsView announcements={announcements} onCreate={() => setIsAnnouncementOpen(true)} onDelete={handleAnnouncementDeleted} />;
      case 'feedback':
        return <FeedbackInbox />;
      case 'dashboard':
      default:
        return <DashboardView user={user} users={users} courses={courses} announcements={announcements} />;
    }
  };

  return (
    <div className="animate-in fade-in duration-200 max-w-7xl mx-auto">
      {renderView()}
      {isAnnouncementOpen && (
        <AnnouncementComposer
          user={user}
          onClose={() => setIsAnnouncementOpen(false)}
          onCreated={handleAnnouncementCreated}
        />
      )}
    </div>
  );
};
