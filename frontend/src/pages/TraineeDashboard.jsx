import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  CheckCircle,
  Clock,
  BookOpen,
  Calendar,
  Award,
  ChevronRight,
  Play,
  FileCheck,
  AlertCircle,
  Search,
  Users
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AssessmentModal } from '../components/trainee/AssessmentModal';

export const TraineeDashboard = ({ searchQuery }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  // Trainee stats (dynamic / computed)
  const [stats, setStats] = useState({
    completedCourses: 2,
    testsPassed: 4,
    avgScore: 88,
    weeklyHours: 12.5,
    weeklyGoalHours: 15,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(false);
      try {
        const [coursesRes, assessmentsRes] = await Promise.all([
          api.getCourses(),
          api.getAssessments(),
        ]);
        if (coursesRes?.courses) setCourses(coursesRes.courses);
        if (assessmentsRes?.assessments) setAssessments(assessmentsRes.assessments);
      } catch (err) {
        console.warn('Error loading trainee dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStartAssessment = (quiz) => {
    setSelectedAssessment(quiz);
  };

  const handleAssessmentCompleted = (result) => {
    if (result.passed) {
      setStats((prev) => ({
        ...prev,
        testsPassed: prev.testsPassed + 1,
        avgScore: Math.round((prev.avgScore + result.score) / 2),
      }));
    }
  };

  // Mocked progress mapping for enrolled courses
  const courseProgressMap = {
    'Effective Leadership & Team Management': { progress: 75, dueDate: 'May 20, 2026', nextUnit: 'Conflict Resolution Strategies' },
    'Communication Skills for Professionals': { progress: 90, dueDate: 'May 25, 2026', nextUnit: 'Final Executive Presentation' },
    'Cloud Computing Fundamentals (AWS & Azure)': { progress: 40, dueDate: 'Jun 10, 2026', nextUnit: 'VPC & Subnet Architecture' },
    'Agile & Scrum Practitioner': { progress: 20, dueDate: 'Jun 18, 2026', nextUnit: 'Sprint Ceremonies Deep Dive' },
    'HR Practices & Compliance Essentials': { progress: 100, dueDate: 'Completed', nextUnit: 'Certification Issued' },
  };

  // Filter courses based on top bar search query
  const filteredCourses = courses.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q) ||
      c.subject?.toLowerCase().includes(q) ||
      c.trainerName?.toLowerCase().includes(q)
    );
  });

  // Next Lessons & Assessments schedule
  const nextAssessmentsTimeline = [
    {
      id: 'tl-1',
      title: 'Cloud Fundamentals – Chapter Quiz',
      courseTitle: 'Cloud Computing Fundamentals',
      dueDate: 'Due: May 20',
      timeRemaining: '2 days left',
      type: 'Assessment',
      assessmentRef: assessments.find((a) => a.title.includes('Cloud')) || assessments[0],
      highlight: 'yellow',
    },
    {
      id: 'tl-2',
      title: 'Agile Ceremonies & Sprint Planning Assignment',
      courseTitle: 'Agile & Scrum Practitioner',
      dueDate: 'Due: May 24',
      timeRemaining: '6 days left',
      type: 'MCQ Test',
      assessmentRef: assessments.find((a) => a.title.includes('Agile')) || assessments[1],
      highlight: 'lavender',
    },
    {
      id: 'tl-3',
      title: 'Leadership Case Study Presentation',
      courseTitle: 'Effective Leadership & Team Management',
      dueDate: 'Due: May 28',
      timeRemaining: '10 days left',
      type: 'Milestone Submission',
      highlight: 'slate',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Greeting Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#1c1d22] via-[#202128] to-[#1a1b22] border border-slate-800 p-8 overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Trainee Learning Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, <span className="text-yellow-400">{user?.name || 'Ananya'}</span>!
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              You are currently enrolled in 4 competency modules. Keep up the pace to hit your monthly learning milestone!
            </p>
          </div>

          {/* Quick Learning Streak Pill */}
          <div className="flex items-center gap-4 bg-[#121316]/80 border border-slate-800 p-4 rounded-2xl shrink-0 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-yellow-400 font-black text-lg">
              🔥
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Daily Streak</div>
              <div className="text-base font-bold text-white">7 Days Active</div>
              <div className="text-[10px] text-emerald-400 font-semibold">+2 hrs logged today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Trainee Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 Cols on large screen): Metrics Widget + Next Lessons Schedule */}
        <div className="lg:col-span-5 space-y-8">
          {/* Top-Left Metrics Widget */}
          <div className="rounded-3xl bg-[#1c1d22] border border-slate-800 p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-yellow-400" /> Weekly Progress
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Study analytics & evaluation scores</p>
              </div>
              <span className="text-[11px] font-bold text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700/60">
                Week 21
              </span>
            </div>

            {/* Weekly Target Bar */}
            <div className="p-4 rounded-2xl bg-[#121316] border border-slate-800/80 mb-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400">Weekly Goal Progress</span>
                <span className="font-bold text-yellow-400">{stats.weeklyHours} / {stats.weeklyGoalHours} hrs (83%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: '83%' }}
                />
              </div>
            </div>

            {/* 3 Accent Cards (Yellow / Lavender formatted metrics) */}
            <div className="grid grid-cols-3 gap-3">
              {/* Card 1: Completed Courses */}
              <div className="p-3.5 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 text-center flex flex-col justify-between">
                <div className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 mb-1">
                  Completed
                </div>
                <div className="text-2xl font-black text-yellow-400">
                  {stats.completedCourses}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Courses done</div>
              </div>

              {/* Card 2: Tests Passed (Lavender) */}
              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-center flex flex-col justify-between">
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-300 mb-1">
                  Tests Passed
                </div>
                <div className="text-2xl font-black text-purple-300">
                  {stats.testsPassed}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">100% pass rate</div>
              </div>

              {/* Card 3: Avg Score % (Lavender/Yellow blend) */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-yellow-400/10 to-purple-500/10 border border-purple-400/20 text-center flex flex-col justify-between">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Avg Score
                </div>
                <div className="text-2xl font-black text-slate-100">
                  {stats.avgScore}%
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">Top 10% Tier</div>
              </div>
            </div>
          </div>

          {/* Next Lessons & Deadlined Assessments Schedule */}
          <div className="rounded-3xl bg-[#1c1d22] border border-slate-800 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" /> Next Lessons & Deadlines
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Upcoming timelines & assessments</p>
              </div>
              <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-xl border border-purple-500/30">
                {nextAssessmentsTimeline.length} Pending
              </span>
            </div>

            {/* Timeline List */}
            <div className="space-y-3.5 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800/80 before:z-0">
              {nextAssessmentsTimeline.map((item) => {
                const isYellow = item.highlight === 'yellow';
                const isLavender = item.highlight === 'lavender';

                return (
                  <div
                    key={item.id}
                    className="relative z-10 flex items-start gap-4 p-4 rounded-2xl bg-[#121316] border border-slate-800 hover:border-slate-700 transition-all duration-200 group"
                  >
                    {/* Timeline Node Icon */}
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-md ${
                        isYellow
                          ? 'bg-yellow-400 text-slate-950 shadow-yellow-500/20'
                          : isLavender
                          ? 'bg-purple-500 text-white shadow-purple-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </div>

                    {/* Timeline Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isYellow
                              ? 'bg-yellow-400/15 text-yellow-300'
                              : isLavender
                              ? 'bg-purple-500/15 text-purple-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {item.dueDate}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.timeRemaining}</span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-200 mt-1.5 group-hover:text-yellow-400 transition-colors truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.courseTitle}
                      </p>

                      {/* Action trigger button */}
                      {item.assessmentRef && (
                        <button
                          type="button"
                          onClick={() => handleStartAssessment(item.assessmentRef)}
                          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-400/15 hover:bg-yellow-400 text-yellow-400 hover:text-slate-950 text-xs font-bold border border-yellow-400/30 transition-all duration-150"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Start Assessment</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols on large screen): Course Cards Grid */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-yellow-400" /> Active Course Curriculum
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Showing {filteredCourses.length} registered corporate learning tracks
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Sorted by Priority
            </span>
          </div>

          {/* Grid of Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCourses.map((course) => {
              const meta = courseProgressMap[course.title] || {
                progress: 50,
                dueDate: 'Due date: Jun 30',
                nextUnit: 'Core Assessment Unit',
              };

              // Link to corresponding assessment if available
              const courseQuiz = assessments.find((a) => a.courseId === course._id);

              return (
                <div
                  key={course._id}
                  className="rounded-3xl bg-[#1c1d22] border border-slate-800 hover:border-slate-700 transition-all duration-200 overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-black/60"
                >
                  {/* Thumbnail Banner with Due Date Pill */}
                  <div className="relative h-40 overflow-hidden bg-slate-900">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c1d22] via-transparent to-black/40" />

                    {/* Due Date Pill Tag */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#121316]/90 backdrop-blur-md text-yellow-400 border border-yellow-400/30 shadow-lg">
                        <Clock className="w-3 h-3 text-yellow-400" />
                        {meta.dueDate}
                      </span>
                    </div>

                    {/* Category Pill Tag */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 backdrop-blur-md text-purple-300 border border-purple-500/30">
                        {course.category}
                      </span>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[11px] font-semibold text-slate-300 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md">
                        {course.duration}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-100 group-hover:text-yellow-400 transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Progress Bar & Percentage Metric */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px]">Syllabus Completed</span>
                        <span className="font-bold text-yellow-400">{meta.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-400 via-amber-400 to-purple-500 rounded-full transition-all duration-300"
                          style={{ width: `${meta.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Instructor Avatar & Interactive Action Footer */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                          {course.trainerName?.charAt(0) || 'T'}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-200">{course.trainerName}</div>
                          <div className="text-[10px] text-slate-400">Lead Instructor</div>
                        </div>
                      </div>

                      {/* Launch Quiz / Continue Button */}
                      {courseQuiz ? (
                        <button
                          type="button"
                          onClick={() => handleStartAssessment(courseQuiz)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-bold shadow-md shadow-yellow-500/10 transition-all"
                        >
                          <span>Take Quiz</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                        >
                          <span>View Deck</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Assessment Taker Modal */}
      {selectedAssessment && (
        <AssessmentModal
          assessment={selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
          onCompleted={handleAssessmentCompleted}
        />
      )}
    </div>
  );
};
