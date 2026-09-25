import React, { useState, useEffect, useMemo } from 'react';
import { getStoredAttempts } from '../../utils/activityTracker';
import { useAuth } from '../../context/AuthContext';

export const StreaksCalendar = ({ userId: propUserId }) => {
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

  // Compute 18-week (126-day) activity map for compact widget
  const { weeks, totalQuestions, currentStreak } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attemptsByDaysAgo = {};
    let dynamicQuestions = 0;

    attempts.forEach((att) => {
      const attDate = new Date(att.timestamp || 0);
      attDate.setHours(0, 0, 0, 0);
      const diffDays = Math.max(0, Math.floor((today - attDate) / 86400000));
      attemptsByDaysAgo[diffDays] = (attemptsByDaysAgo[diffDays] || 0) + 1;
      dynamicQuestions += (att.totalQuestions || 5);
    });

    const numWeeks = 18;
    const totalDays = numWeeks * 7;
    const dayCells = [];

    for (let i = 0; i < totalDays; i++) {
      const daysAgo = totalDays - 1 - i;
      const realAttemptsCount = attemptsByDaysAgo[daysAgo] || 0;
      let intensity = 0;
      if (realAttemptsCount === 1) intensity = 2;
      else if (realAttemptsCount === 2) intensity = 3;
      else if (realAttemptsCount >= 3) intensity = 4;

      const cellDate = new Date(today);
      cellDate.setDate(today.getDate() - daysAgo);

      dayCells.push({
        id: i,
        daysAgo,
        intensity,
        realAttempts: realAttemptsCount,
        dateFormatted: cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      });
    }

    // Split into columns (weeks)
    const weekColumns = [];
    for (let w = 0; w < numWeeks; w++) {
      weekColumns.push(dayCells.slice(w * 7, (w + 1) * 7));
    }

    // Calculate streak
    let streakCount = 0;
    if (attemptsByDaysAgo[0] > 0) {
      streakCount = 1;
      let checkDay = 1;
      while (attemptsByDaysAgo[checkDay] > 0) {
        streakCount++;
        checkDay++;
      }
    }

    return {
      weeks: weekColumns,
      totalQuestions: dynamicQuestions,
      currentStreak: streakCount,
    };
  }, [attempts]);

  const getColor = (intensity) => {
    switch (intensity) {
      case 2: return 'bg-[#7dd3fc]/80 border-[#67e8f9]';
      case 3: return 'bg-[#5eead4]/90 border-[#2dd4bf]';
      case 4: return 'bg-[#73bfc4] border-[#73bfc4] shadow-[0_0_8px_rgba(115,191,196,0.5)]';
      default: return 'bg-slate-800/80 border-slate-600/80 hover:border-slate-400';
    }
  };

  return (
    <div className="bg-slate-900/60 rounded-3xl p-5 border border-white/10 shadow-[0_18px_45px_rgba(2,6,23,0.28)] space-y-3.5 text-left backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-50 flex items-center gap-1.5">
            <span>🔥</span> Activity Streaks
          </h3>
          <p className="text-[10px] text-slate-300 mt-0.5">
            {totalQuestions} questions attempted · {attempts.length} {attempts.length === 1 ? 'quiz' : 'quizzes'}
          </p>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-[#73bfc4]/12 text-[#73bfc4] border border-[#73bfc4]/25 text-[10px] font-bold shrink-0">
          {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'} Streak
        </div>
      </div>

      {/* Grid Container */}
      <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-3">
        <div className="flex items-center justify-between text-[9px] text-slate-300 font-medium mb-2 px-1">
          <span>Past 18 Weeks</span>
          <span>Today</span>
        </div>

        <div className="flex justify-between items-center gap-1 overflow-x-auto py-1">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {week.map((day) => (
                <div
                  key={day.id}
                  title={`${day.dateFormatted}: ${day.realAttempts > 0 ? `${day.realAttempts} quiz(zes) completed` : 'No quiz activity'}`}
                  className={`w-2.5 h-2.5 sm:w-2.5 sm:h-2.5 rounded-[3px] border transition-transform hover:scale-125 cursor-pointer ${getColor(day.intensity)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Legend */}
      <div className="flex items-center justify-between text-[9px] text-slate-300 pt-0.5">
        <span className="truncate">Turns green upon test completion</span>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <span>Less</span>
          <div className="w-2 h-2 rounded-[2px] bg-slate-800 border border-slate-600" />
          <div className="w-2 h-2 rounded-[2px] bg-[#7dd3fc]/80 border-[#67e8f9]" />
          <div className="w-2 h-2 rounded-[2px] bg-[#5eead4]/90 border-[#2dd4bf]" />
          <div className="w-2 h-2 rounded-[2px] bg-[#73bfc4] border-[#73bfc4]" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
