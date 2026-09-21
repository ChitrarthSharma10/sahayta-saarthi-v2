import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useToast } from '../common/Toast';

export const ContinueWatchingCarousel = ({ courses = [], onCourseClick, searchQuery }) => {
  const scrollContainerRef = useRef(null);
  const { addToast } = useToast();
  const [favoriteCourseIds, setFavoriteCourseIds] = useState(new Set());

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -290 : 290;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const toggleFavorite = (courseId, e) => {
    e.stopPropagation();
    const course = courses.find((item) => item._id === courseId);
    const nextState = !favoriteCourseIds.has(courseId);
    setFavoriteCourseIds((prev) => {
      const next = new Set(prev);
      if (nextState) next.add(courseId);
      else next.delete(courseId);
      return next;
    });
    addToast(
      nextState ? `Saved "${course?.title?.substring(0, 24)}..." to favorites` : 'Removed from favorites',
      'info'
    );
  };

  const getCategoryBadgeClass = (categoryType) => {
    switch (categoryType) {
      case 'cyan':
        return 'bg-[#E7F7F8] text-[#0EA5E9]';
      case 'lavender':
        return 'bg-[#EEE9FB] text-[#755BE8]';
      case 'pink':
        return 'bg-[#FDE8EF] text-[#E8437D]';
      default:
        return 'bg-[#EEE9FB] text-[#755BE8]';
    }
  };

  // Filter if search is active
  const filteredCourses = courses.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.title?.toLowerCase().includes(q)
      || c.category?.toLowerCase().includes(q)
      || c.trainerName?.toLowerCase().includes(q);
  });

  return (
    <div className="my-6">
      {/* Section Heading & Circular Navigation Buttons */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-[#19191F]">Continue Watching</h2>
        <div className="flex items-center gap-2">
          {/* Left arrow button */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="w-7 h-7 rounded-full bg-white border border-[#EEEEF4] text-[#92929E] hover:text-[#19191F] flex items-center justify-center transition-colors shadow-sm"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Right active purple arrow button */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="w-7 h-7 rounded-full bg-[#755BE8] hover:bg-[#6448DE] text-white flex items-center justify-center transition-transform hover:scale-105 shadow-sm shadow-[#755BE8]/30"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 pt-1 -mx-1 px-1"
      >
        {filteredCourses.map((course) => {
          const mentorName = course.trainerName || course.trainer?.name || 'Instructor';
          const mentorAvatar = course.trainer?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120';
          const isFavorite = favoriteCourseIds.has(course._id);
          return (
            <div
              key={course._id}
              onClick={() => onCourseClick && onCourseClick(course)}
              className="min-w-[270px] max-w-[285px] bg-white rounded-[20px] p-3.5 border border-[#EEEEF4] shadow-card hover:border-[#DDDDE8] transition-all duration-150 flex flex-col justify-between shrink-0 group cursor-pointer"
            >
              {/* Landscape course photograph with rounded corners & favorite overlay */}
              <div className="relative rounded-[16px] h-36 overflow-hidden bg-slate-100">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500';
                  }}
                />
                {/* Overlaid Favorite Heart Button */}
                <button
                  type="button"
                      onClick={(e) => toggleFavorite(course._id, e)}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isFavorite
                        ? 'fill-[#E8437D] text-[#E8437D]'
                        : 'text-[#92929E]'
                    }`}
                  />
                </button>
              </div>

              {/* Course Details */}
              <div className="mt-3 flex-1 flex flex-col justify-between">
                <div>
                  {/* Category badge */}
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${getCategoryBadgeClass(
                      course.category === 'Technology' ? 'lavender' : 'cyan'
                    )}`}
                  >
                    {course.category || 'General'}
                  </span>

                  {/* Compact two-line title */}
                  <h3 className="text-xs font-bold text-[#19191F] mt-2 line-clamp-2 leading-snug group-hover:text-[#755BE8] transition-colors">
                    {course.title}
                  </h3>
                </div>

                <div>
                  {/* Thin purple progress indicator */}
                  <div className="w-full h-1 bg-[#F0F0F5] rounded-full overflow-hidden mt-3 mb-2.5">
                    <div
                      className="h-full bg-[#755BE8] rounded-full"
                      style={{ width: `${course.progressPercent || 0}%` }}
                    />
                  </div>

                  {/* Mentor avatar, name, and muted "Mentor" label */}
                  <div className="flex items-center gap-2 pt-1 border-t border-[#F5F5FA]">
                    <img
                      src={mentorAvatar}
                      alt={mentorName}
                      className="w-5 h-5 rounded-full object-cover border border-[#EEEEF4]"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120';
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#19191F] truncate leading-none">
                        {mentorName}
                      </p>
                      <p className="text-[9px] text-[#92929E] leading-none mt-0.5">
                        Instructor
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
