import React, { useEffect, useState } from 'react';
import { MoreHorizontal, Plus, UserPlus, Check } from 'lucide-react';
import { MENTORS_LIST } from '../../data/coursueData';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const EMPTY_CHARTS = {
  trainee: {
    title: 'Performance analytics',
    summary: 'Scores and learning hours',
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    series: [
      { label: 'Assessment score', color: '#755BE8', values: [0, 0, 0, 0] },
      { label: 'Learning hours', color: '#C7BDF2', values: [0, 0, 0, 0] },
    ],
    max: 100,
  },
  trainer: {
    title: 'Class performance',
    summary: 'Completion, scores, engagement',
    labels: ['Current'],
    series: [
      { label: 'Completion', color: '#755BE8', values: [0] },
      { label: 'Test score', color: '#A997EE', values: [0] },
      { label: 'Engagement', color: '#D8D0F7', values: [0] },
    ],
    max: 100,
  },
};

export const StatisticsPanel = ({
  onAddMentor,
  onSeeAllMentors,
  variant = 'trainee',
  chartData,
}) => {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [mentors, setMentors] = useState(MENTORS_LIST);
  const [remoteChart, setRemoteChart] = useState(null);
  const chart = chartData || remoteChart || EMPTY_CHARTS[variant] || EMPTY_CHARTS.trainee;

  useEffect(() => {
    if (chartData) return undefined;

    const userId = user?._id || (variant === 'trainer' ? null : 'demo-trainee');
    if (!userId) return undefined;

    const refreshAnalytics = () => {
      const loadAnalytics = variant === 'trainer'
        ? api.getTrainerAnalytics(userId)
        : api.getTraineeAnalytics(userId);

      loadAnalytics
        .then((response) => {
          if (response?.chart) setRemoteChart(response.chart);
        })
        .catch((error) => console.warn('Could not load statistics analytics:', error));
    };

    refreshAnalytics();
    const refreshInterval = window.setInterval(refreshAnalytics, 5000);
    window.addEventListener('capacity-connect-assessment-submitted', refreshAnalytics);

    return () => {
      window.clearInterval(refreshInterval);
      window.removeEventListener('capacity-connect-assessment-submitted', refreshAnalytics);
    };
  }, [chartData, user?._id, variant]);

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
      <div className="bg-white rounded-3xl p-5 border border-[#EEEEF4] shadow-card space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#19191F]">{chart.title}</h2>
            <p className="text-[10px] text-[#92929E] mt-0.5">{chart.summary}</p>
          </div>
          <button
            type="button"
            className="p-1 text-[#92929E] hover:text-[#19191F] rounded-lg transition-colors"
            title="Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {variant === 'trainer' && (
          <div className="bg-[#EEE9FB] rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {chart.series.map((series) => (
                  <span key={series.label} className="flex items-center gap-1 text-[9px] font-semibold text-[#92929E]">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: series.color }} />
                    {series.label}
                  </span>
                ))}
              </div>
              <span className="text-[9px] font-bold text-[#92929E]">%</span>
            </div>

            <div className="relative h-28">
              <div className="absolute inset-0 flex flex-col justify-between">
                {[100, 75, 50, 25, 0].map((value) => (
                  <div key={value} className="flex items-center gap-2">
                    <span className="w-5 text-right text-[8px] font-semibold text-[#92929E]">{value}</span>
                    <div className="flex-1 border-b border-dashed border-[#D8D0F7]" />
                  </div>
                ))}
              </div>
              <div className="absolute inset-y-0 left-7 right-1 flex items-end justify-around gap-1 pb-0.5">
                {chart.labels.map((label, index) => (
                  <div key={label} className="flex h-full flex-1 items-end justify-center gap-0.5">
                    {chart.series.map((series) => (
                      <div
                        key={series.label}
                        className="w-[clamp(6px,1.5vw,10px)] max-w-[12px] min-w-[5px] rounded-t-sm shadow-sm"
                        style={{
                          height: `${Math.max(4, (series.values[index] / chart.max) * 100)}%`,
                          backgroundColor: series.color,
                        }}
                        title={`${series.label}: ${series.values[index]}%`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-around pl-7 pr-1 pt-2 text-[8px] font-semibold text-[#92929E]">
              {chart.labels.map((label) => <span key={label} className="truncate max-w-[55px] text-center" title={label}>{label}</span>)}
            </div>
          </div>
        )}

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
