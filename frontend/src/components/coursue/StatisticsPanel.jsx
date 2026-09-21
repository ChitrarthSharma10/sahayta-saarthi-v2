import React, { useState } from 'react';
import { MoreHorizontal, Plus, UserPlus, Check } from 'lucide-react';
import { MENTORS_LIST } from '../../data/coursueData';
import { useToast } from '../common/Toast';

export const StatisticsPanel = ({ onAddMentor, onSeeAllMentors }) => {
  const { addToast } = useToast();
  const [mentors, setMentors] = useState(MENTORS_LIST);

  const toggleFollow = (mentorId) => {
    setMentors((prev) =>
      prev.map((m) => {
        if (m.id === mentorId) {
          const nextState = !m.isFollowing;
          addToast(
            nextState ? `You are now following ${m.name}` : `Unfollowed ${m.name}`,
            'info'
          );
          return { ...m, isFollowing: nextState };
        }
        return m;
      })
    );
  };

  return (
    <div className="w-full lg:w-[270px] xl:w-[285px] shrink-0 space-y-6">
      <div className="bg-white rounded-[24px] p-5 border border-[#EEEEF4] shadow-card space-y-6">
        {/* Header: "Statistic" & overflow button */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#19191F]">Statistic</h2>
          <button
            type="button"
            className="p-1 text-[#92929E] hover:text-[#19191F] rounded-lg transition-colors"
            title="Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Circular Progress Ring & Avatar */}
        <div className="flex flex-col items-center text-center">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#F0EEF8"
                strokeWidth="5"
                fill="transparent"
              />
              {/* Active Progress Arc: 32% */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#755BE8"
                strokeWidth="5"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * 32) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* 32% Badge at top right */}
            <span className="absolute top-1 right-2 px-1.5 py-0.5 rounded-full bg-[#755BE8] text-white font-bold text-[9px] shadow-sm">
              32%
            </span>

            {/* Center Avatar */}
            <div className="absolute inset-0 m-auto w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-[#F9F9FC]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Jason Ranti"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
                }}
              />
            </div>
          </div>

          {/* User Greeting & Motivational Subtitle */}
          <h3 className="text-sm font-bold text-[#19191F] mt-3 flex items-center justify-center gap-1.5">
            Good Morning Jason <span className="text-amber-500">🔥</span>
          </h3>
          <p className="text-[10px] text-[#92929E] mt-0.5 max-w-[190px] leading-tight">
            Continue your learning to achieve your target!
          </p>
        </div>

        {/* Compact Bar Chart on Pale Lavender Surface */}
        <div className="bg-[#EEE9FB] rounded-[20px] p-3.5 relative overflow-hidden">
          {/* Chart Y Axis & Dashed Lines */}
          <div className="relative h-24 flex flex-col justify-between">
            {/* Grid Line 60 */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-[#92929E] w-3.5 text-right">60</span>
              <div className="flex-1 border-b border-dashed border-[#DDD5F5]" />
            </div>
            {/* Grid Line 40 */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-[#92929E] w-3.5 text-right">40</span>
              <div className="flex-1 border-b border-dashed border-[#DDD5F5]" />
            </div>
            {/* Grid Line 20 */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-[#92929E] w-3.5 text-right">20</span>
              <div className="flex-1 border-b border-dashed border-[#DDD5F5]" />
            </div>

            {/* Vertical Bars Overlay */}
            <div className="absolute inset-0 left-6 right-2 flex items-end justify-between px-2 pb-0.5">
              {/* Group 1: 1-10 Aug */}
              <div className="flex items-end gap-1.5 h-full pt-2">
                <div className="w-2.5 h-[35%] bg-[#DDD5F5] rounded-full" />
                <div className="w-2.5 h-[65%] bg-[#755BE8] rounded-full shadow-sm" />
              </div>

              {/* Group 2: 11-20 Aug */}
              <div className="flex items-end gap-1.5 h-full pt-2">
                <div className="w-2.5 h-[50%] bg-[#DDD5F5] rounded-full" />
                <div className="w-2.5 h-[88%] bg-[#755BE8] rounded-full shadow-sm" />
              </div>

              {/* Group 3: 21-30 Aug */}
              <div className="flex items-end gap-1.5 h-full pt-2">
                <div className="w-2.5 h-[28%] bg-[#DDD5F5] rounded-full" />
                <div className="w-2.5 h-[45%] bg-[#755BE8] rounded-full shadow-sm" />
              </div>
            </div>
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between pl-6 pr-2 pt-2 text-[9px] text-[#92929E] font-semibold">
            <span>1-10 Aug</span>
            <span>11-20 Aug</span>
            <span>21-30 Aug</span>
          </div>
        </div>

        {/* "Your mentor" Section */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#19191F]">Your mentor</h4>
            <button
              type="button"
              onClick={onAddMentor}
              className="w-5 h-5 rounded-full border border-[#EEEEF4] text-[#92929E] hover:text-[#755BE8] hover:border-[#755BE8] flex items-center justify-center transition-colors"
              title="Add Mentor"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>

          {/* Mentor Rows */}
          <div className="space-y-2.5">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="flex items-center justify-between gap-2 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#EEEEF4]"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120';
                      }}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-black rounded-full border border-white flex items-center justify-center">
                      <span className="text-[6px] text-white">✓</span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-[#19191F] truncate leading-tight">
                      {mentor.name}
                    </p>
                    <p className="text-[9px] text-[#92929E] leading-tight mt-0.5">
                      {mentor.role}
                    </p>
                  </div>
                </div>

                {/* Small Outlined Follow Button */}
                <button
                  type="button"
                  onClick={() => toggleFollow(mentor.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all shrink-0 ${
                    mentor.isFollowing
                      ? 'bg-[#EEE9FB] text-[#755BE8] border-[#755BE8]/30 font-bold'
                      : 'bg-white text-[#92929E] border-[#EEEEF4] hover:text-[#19191F] hover:border-[#DDDDE8]'
                  }`}
                >
                  {mentor.isFollowing ? (
                    <>
                      <Check className="w-2.5 h-2.5 text-[#755BE8]" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-2.5 h-2.5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Full-width pale-purple "See All" button */}
        <button
          type="button"
          onClick={onSeeAllMentors}
          className="w-full py-2.5 rounded-xl bg-[#EEE9FB] hover:bg-[#E3DCFA] text-[#755BE8] font-bold text-xs transition-colors shadow-none"
        >
          See All
        </button>
      </div>
    </div>
  );
};
