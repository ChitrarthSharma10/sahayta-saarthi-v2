import React from 'react';
import { MoreVertical, Scissors, Layers, Code2, Sparkles } from 'lucide-react';
import { COURSE_PROGRESS_METRICS } from '../../data/coursueData';

export const CourseProgressCard = ({ onActionClick }) => {
  const getIconAndStyle = (type, badgeColor) => {
    switch (badgeColor) {
      case 'lavender':
        return {
          icon: Scissors,
          bg: 'bg-[#EEE9FB]',
          color: 'text-[#755BE8]',
        };
      case 'pink':
        return {
          icon: Layers,
          bg: 'bg-[#FDE8EF]',
          color: 'text-[#E8437D]',
        };
      case 'cyan':
        return {
          icon: Code2,
          bg: 'bg-[#E7F7F8]',
          color: 'text-[#0EA5E9]',
        };
      default:
        return {
          icon: Sparkles,
          bg: 'bg-[#EEE9FB]',
          color: 'text-[#755BE8]',
        };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 my-6">
      {COURSE_PROGRESS_METRICS.map((item) => {
        const { icon: Icon, bg, color } = getIconAndStyle(item.iconType, item.badgeColor);

        return (
          <div
            key={item.id}
            className="bg-white rounded-[18px] p-3.5 sm:p-4 border border-[#EEEEF4] shadow-card hover:border-[#DDDDE8] transition-all duration-150 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              {/* Pastel Rounded Icon Container */}
              <div
                className={`w-10 h-10 rounded-2xl ${bg} ${color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
              >
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>

              {/* Progress text & Dark Title */}
              <div>
                <span className="text-[10px] sm:text-[11px] font-medium text-[#92929E] block leading-tight">
                  {item.watched}
                </span>
                <h3 className="text-xs sm:text-[13px] font-bold text-[#19191F] mt-0.5 tracking-tight">
                  {item.title}
                </h3>
              </div>
            </div>

            {/* Vertical Overflow Button */}
            <button
              type="button"
              onClick={() => onActionClick && onActionClick(item)}
              className="p-1 rounded-lg text-[#92929E] hover:text-[#19191F] hover:bg-[#F9F9FC] transition-colors"
              title="Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
