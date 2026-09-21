import React, { useState } from 'react';
import { MessageSquare, Send, Star } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from './Toast';

export const FeedbackPanel = () => {
  const { user, role } = useAuth();
  const { addToast } = useToast();
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      await api.submitFeedback({
        userId: user?._id,
        userName: user?.name,
        userRole: role,
        rating,
        category,
        message,
      });
      setMessage('');
      addToast('Thanks, your feedback was sent to the admin team.', 'success');
    } catch (error) {
      addToast(error.message || 'Could not submit feedback.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-[#19191F]">Share Feedback</h2>
        <p className="mt-1 text-sm text-[#92929E]">Tell the Capacity Connect team what is working and what could improve.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-[#EEEEF4] bg-white p-6 shadow-sm">
        <div>
          <label className="mb-2 block text-xs font-bold text-[#19191F]">Overall rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} type="button" onClick={() => setRating(value)} title={`${value} stars`} className="p-1">
                <Star className={`h-5 w-5 ${value <= rating ? 'fill-amber-400 text-amber-400' : 'text-[#D8D8E2]'}`} />
              </button>
            ))}
          </div>
        </div>
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-xl border border-[#EEEEF4] bg-[#F6F7FB] px-3 py-2.5 text-xs outline-none focus:border-[#755BE8]">
          <option value="general">General experience</option>
          <option value="courses">Courses and resources</option>
          <option value="assessments">Quizzes and assessments</option>
          <option value="technical">Technical issue</option>
        </select>
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={6} placeholder="Write your feedback here..." className="w-full rounded-xl border border-[#EEEEF4] bg-[#F6F7FB] px-3 py-2.5 text-sm outline-none focus:border-[#755BE8]" required />
        <button disabled={sending} className="inline-flex items-center gap-2 rounded-xl bg-[#755BE8] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#6448DE] disabled:opacity-50">
          {sending ? 'Sending...' : 'Send Feedback'} <Send className="h-4 w-4" />
        </button>
      </form>
      <div className="flex items-center gap-2 text-xs text-[#92929E]"><MessageSquare className="h-4 w-4 text-[#755BE8]" /> Your feedback is visible to the admin team.</div>
    </div>
  );
};
