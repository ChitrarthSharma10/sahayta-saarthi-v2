import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getStoredAttempts } from '../../utils/activityTracker';
import { useAuth } from '../../context/AuthContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = payload[0]?.payload;
    return (
      <div className="bg-[#19191F] text-white border border-[#EEEEF4]/20 p-3 rounded-xl shadow-xl">
        <p className="text-white text-xs font-bold mb-1 truncate max-w-[200px]">
          {item?.fullTitle || label}
        </p>
        <p className="text-[#A78BFA] text-sm font-black flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A78BFA]" />
          Score: {payload[0]?.value}%
        </p>
        {item?.date && (
          <p className="text-[10px] text-gray-400 mt-1 pt-1 border-t border-gray-700">
            {item.date}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const MCQProgressChart = ({ userId: propUserId }) => {
  const { user } = useAuth();
  const activeUserId = propUserId || user?._id || user?.id || 'guest';
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const handleUpdate = (event) => {
      const targetUserId = event?.detail?.userId;
      if (!targetUserId || targetUserId === activeUserId) {
        setUpdateTrigger((prev) => prev + 1);
      }
    };

    window.addEventListener('capacity-connect-attempts-updated', handleUpdate);
    window.addEventListener('capacity-connect-assessment-submitted', handleUpdate);
    return () => {
      window.removeEventListener('capacity-connect-attempts-updated', handleUpdate);
      window.removeEventListener('capacity-connect-assessment-submitted', handleUpdate);
    };
  }, [activeUserId]);

  const attempts = useMemo(() => {
    void updateTrigger;
    return getStoredAttempts(activeUserId);
  }, [activeUserId, updateTrigger]);

  const chartData = useMemo(() => {
    return attempts.map((att, index) => {
      const d = new Date(att.timestamp || 0);
      const dateLabel = att.timestamp
        ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : `Test ${index + 1}`;
      return {
        name: `T${index + 1}`,
        score: att.score,
        fullTitle: att.title || `Test ${index + 1}`,
        date: dateLabel,
      };
    });
  }, [attempts]);

  const latestScore = attempts.length > 0 ? attempts[attempts.length - 1].score : 0;
  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
    : 0;
  const highScore = attempts.length > 0
    ? Math.max(...attempts.map((a) => a.score))
    : 0;

  if (attempts.length === 0) {
    return (
      <div className="rounded-3xl bg-white border border-[#EEEEF4] p-6 shadow-card w-full flex flex-col justify-center items-center text-center min-h-[260px]">
        <div className="w-10 h-10 rounded-2xl bg-[#EEE9FB] flex items-center justify-center text-[#755BE8] font-bold text-sm mb-3">
          📈
        </div>
        <h3 className="text-sm font-bold text-[#19191F]">Assessment Performance</h3>
        <p className="text-xs text-[#92929E] mt-1 max-w-sm">
          No assessment attempts recorded yet. Take an assessment from Quizzes & Tests to start tracking your score progression!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white border border-[#EEEEF4] p-6 shadow-card w-full flex flex-col min-h-[300px]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-[#19191F] flex items-center gap-2">
            <span>📈</span> Assessment Performance
          </h3>
          <p className="text-xs text-[#92929E] mt-0.5">
            Score progression across {attempts.length} {attempts.length === 1 ? 'assessment' : 'assessments'}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EEE9FB] text-[#755BE8]">
            <span className="w-2 h-2 rounded-full bg-[#755BE8]" />
            Latest: {latestScore}%
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F6F7FB] text-[#19191F] border border-[#EEEEF4]">
            Avg: {avgScore}%
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F6F7FB] text-[#19191F] border border-[#EEEEF4]">
            Peak: {highScore}%
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#755BE8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#755BE8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F1F5" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#92929E"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#92929E"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#755BE8"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#scoreColor)"
              activeDot={{ r: 5, fill: '#755BE8', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
