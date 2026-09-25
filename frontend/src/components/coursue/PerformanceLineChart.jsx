import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getStoredAttempts } from '../../utils/activityTracker';
import { useAuth } from '../../context/AuthContext';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0]?.payload;
    return (
      <div className="bg-white border border-[#EEEEF4] p-2.5 rounded-xl shadow-lg text-left">
        <p className="text-[#19191F] text-[11px] font-bold truncate max-w-[150px] mb-0.5">
          {item?.fullTitle}
        </p>
        <p className="text-[#755BE8] text-xs font-black">
          Score: {item?.score}%
        </p>
        <p className="text-[10px] text-[#92929E] mt-0.5">
          {item?.date}
        </p>
      </div>
    );
  }
  return null;
};

export const PerformanceLineChart = ({ userId: propUserId }) => {
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

  if (!attempts || attempts.length === 0) {
    return (
      <div className="bg-[#EEE9FB] rounded-2xl p-4 text-center flex flex-col items-center justify-center min-h-[140px]">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#755BE8] font-bold text-xs shadow-sm mb-2">
          MCQ
        </div>
        <p className="text-xs font-bold text-[#19191F]">No tests attempted yet</p>
        <p className="text-[10px] text-[#92929E] mt-0.5 max-w-[200px]">
          Take your first quiz from Quizzes & Tests to see your score progression!
        </p>
      </div>
    );
  }

  const latestScore = attempts[attempts.length - 1].score;

  return (
    <div className="bg-[#EEE9FB] rounded-2xl p-3.5 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#755BE8]">
          <span className="w-2 h-2 rounded-full bg-[#755BE8]" />
          <span>MCQ Test Scores</span>
        </div>
        <div className="text-[10px] font-bold text-[#755BE8] bg-white px-2 py-0.5 rounded-full shadow-xs">
          Latest: {latestScore}%
        </div>
      </div>

      <div className="h-28 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 8, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#755BE8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#755BE8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              stroke="#92929E"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              dy={3}
            />
            <YAxis
              stroke="#92929E"
              fontSize={8}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              dx={-4}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#755BE8"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#purpleGradient)"
              activeDot={{ r: 5, fill: '#755BE8', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[9px] text-[#92929E] font-medium pt-1 border-t border-[#D8D0F7]/60">
        <span>{attempts.length} {attempts.length === 1 ? 'quiz' : 'quizzes'} completed</span>
        <span className="font-semibold text-[#755BE8]">
          Avg: {Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / attempts.length)}%
        </span>
      </div>
    </div>
  );
};
