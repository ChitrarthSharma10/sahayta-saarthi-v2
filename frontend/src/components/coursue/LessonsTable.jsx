import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { YOUR_LESSONS } from '../../data/coursueData';

export const LessonsTable = ({ onLessonAction, onSeeAll }) => {
  const getBadgeClass = (color) => {
    switch (color) {
      case 'lavender':
        return 'bg-[#EEE9FB] text-[#755BE8]';
      case 'cyan':
        return 'bg-[#E7F7F8] text-[#0EA5E9]';
      case 'pink':
        return 'bg-[#FDE8EF] text-[#E8437D]';
      default:
        return 'bg-[#EEE9FB] text-[#755BE8]';
    }
  };

  return (
    <div className="my-6">
      {/* Heading with "See all" link */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-[#19191F]">Your Lesson</h2>
        <button
          type="button"
          onClick={onSeeAll}
          className="text-xs font-bold text-[#755BE8] hover:underline"
        >
          See all
        </button>
      </div>

      {/* White Rounded Table */}
      <div className="bg-white rounded-[20px] border border-[#EEEEF4] shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#F0F0F5] bg-[#FAFAFC] text-[10px] uppercase font-bold tracking-wider text-[#92929E]">
                <th className="py-3.5 px-5">MENTOR</th>
                <th className="py-3.5 px-4">TYPE</th>
                <th className="py-3.5 px-4">DESC</th>
                <th className="py-3.5 px-5 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5FA]">
              {YOUR_LESSONS.map((lesson) => (
                <tr
                  key={lesson.id}
                  className="hover:bg-[#FBFBFE] transition-colors group"
                >
                  {/* Mentor with Avatar & Date */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={lesson.mentorAvatar}
                        alt={lesson.mentorName}
                        className="w-7 h-7 rounded-full object-cover border border-[#EEEEF4] shrink-0"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120';
                        }}
                      />
                      <div>
                        <p className="text-xs font-bold text-[#19191F] leading-tight">
                          {lesson.mentorName}
                        </p>
                        <p className="text-[10px] text-[#92929E] leading-tight mt-0.5">
                          {lesson.date}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Pastel Type pill */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getBadgeClass(
                        lesson.typeColor
                      )}`}
                    >
                      {lesson.type}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4">
                    <p className="text-xs font-semibold text-[#19191F] max-w-xs truncate">
                      {lesson.description}
                    </p>
                  </td>

                  {/* Circular Arrow Action Button */}
                  <td className="py-3.5 px-5 text-center">
                    <button
                      type="button"
                      onClick={() => onLessonAction && onLessonAction(lesson)}
                      className="w-7 h-7 mx-auto rounded-full border border-[#EEEEF4] text-[#92929E] hover:text-[#755BE8] hover:border-[#755BE8] hover:bg-[#EEE9FB] flex items-center justify-center transition-all duration-150 shadow-sm"
                      title="Open Lesson"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
