import React, { useState, useEffect, useMemo } from 'react';
import { getStoredAttempts } from '../../utils/activityTracker';

export const StreaksCalendar = () => {
  const [attempts, setAttempts] = useState(() => getStoredAttempts());

  useEffect(() => {
    const handleUpdate = () => {
      setAttempts(getStoredAttempts());
    };

    window.addEventListener('capacity-connect-attempts-updated', handleUpdate);
    window.addEventListener('capacity-connect-assessment-submitted', handleUpdate);
    return () => {
      window.removeEventListener('capacity-connect-attempts-updated', handleUpdate);
      window.removeEventListener('capacity-connect-assessment-submitted', handleUpdate);
    };
  }, []);

  // Compute 20-week (140-day) activity map for compact sidebar widget
  const { weeks, totalQuestions, currentStreak } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attemptsByDaysAgo = {};
    let dynamicQuestions = 0;

    attempts.forEach((att) => {
      const attDate = new Date(att.timestamp || Date.now());
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
      case 2: return 'bg-[#A7F3D0] border-[#6EE7B7]'; // Light green
      case 3: return 'bg-[#34D399] border-[#10B981]'; // Medium emerald
      case 4: return 'bg-[#10B981] border-[#059669] shadow-[0_0_6px_rgba(16,185,129,0.5)]'; // Vibrant green
      default: return 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#EEEEF4] shadow-card space-y-3.5 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#19191F] flex items-center gap-1.5">
            <span>🔥</span> Activity Streaks
          </h3>
          <p className="text-[10px] text-[#92929E] mt-0.5">
            {totalQuestions} questions attempted · {attempts.length} {attempts.length === 1 ? 'quiz' : 'quizzes'}
          </p>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-[#EEE9FB] text-[#755BE8] border border-[#755BE8]/20 text-[10px] font-bold shrink-0">
          {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'} Streak
        </div>
      </div>

      {/* Grid Container */}
      <div className="bg-[#F8F9FD] border border-[#EEEEF4] rounded-2xl p-3">
        <div className="flex items-center justify-between text-[9px] text-[#92929E] font-medium mb-2 px-1">
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
      <div className="flex items-center justify-between text-[9px] text-[#92929E] pt-0.5">
        <span className="truncate">Turns green upon test completion</span>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <span>Less</span>
          <div className="w-2 h-2 rounded-[2px] bg-white border border-[#E2E8F0]" />
          <div className="w-2 h-2 rounded-[2px] bg-[#A7F3D0] border-[#6EE7B7]" />
          <div className="w-2 h-2 rounded-[2px] bg-[#34D399] border-[#10B981]" />
          <div className="w-2 h-2 rounded-[2px] bg-[#10B981] border-[#059669]" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
