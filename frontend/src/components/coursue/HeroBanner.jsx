import React from 'react';
import { ArrowRight } from 'lucide-react';

export const HeroBanner = ({ onJoinClick }) => {
  return (
    <div className="relative rounded-[24px] bg-[#755BE8] p-7 sm:p-8 md:p-9 text-white overflow-hidden shadow-soft">
      {/* Decorative Oversized 4-point Sparkles & Geometric Graphics (Inline SVG, Low-Contrast, Behind Content) */}
      <div className="absolute right-0 top-0 bottom-0 w-3/5 pointer-events-none overflow-hidden select-none">
        {/* Large 4-point sparkle */}
        <svg
          className="absolute right-12 top-1/2 -translate-y-1/2 w-48 h-48 md:w-60 md:h-60 text-white/15 animate-pulse duration-[4000ms]"
          viewBox="0 0 100 100"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M50 0 C50 30 70 50 100 50 C70 50 50 70 50 100 C50 70 30 50 0 50 C30 50 50 30 50 0 Z" />
        </svg>

        {/* Small 4-point sparkle */}
        <svg
          className="absolute right-48 top-6 w-20 h-20 text-white/10"
          viewBox="0 0 100 100"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M50 0 C50 30 70 50 100 50 C70 50 50 70 50 100 C50 70 30 50 0 50 C30 50 50 30 50 0 Z" />
        </svg>

        {/* Subtle geometric translucent curved block */}
        <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-white/5 blur-xl" />
        <div className="absolute right-28 -top-12 w-48 h-48 rounded-full bg-white/5 blur-lg" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-lg">
        {/* Eyebrow */}
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 mb-3">
          ONLINE COURSE
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-white leading-[1.25] tracking-tight">
          Sharpen Your Skills with<br />
          Professional Online Courses
        </h1>

        {/* Black Pill "Join Now" button with white circular arrow element */}
        <div className="mt-6">
          <button
            type="button"
            onClick={onJoinClick}
            className="group inline-flex items-center gap-3 bg-[#19191F] hover:bg-black text-white pl-5 pr-2 py-2 rounded-full font-semibold text-xs transition-all duration-150 shadow-md hover:scale-[1.03]"
          >
            <span>Join Now</span>
            <div className="w-6 h-6 rounded-full bg-white text-[#19191F] flex items-center justify-center transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
