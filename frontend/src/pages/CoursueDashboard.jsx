import React, { useState, useEffect } from 'react';
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react';
import { AppSidebar } from '../components/coursue/AppSidebar';
import { DashboardHeader } from '../components/coursue/DashboardHeader';
import { HeroBanner } from '../components/coursue/HeroBanner';
import { CourseProgressCard } from '../components/coursue/CourseProgressCard';
import { ContinueWatchingCarousel } from '../components/coursue/ContinueWatchingCarousel';
import { LessonsTable } from '../components/coursue/LessonsTable';
import { StatisticsPanel } from '../components/coursue/StatisticsPanel';
import { AssessmentModal } from '../components/trainee/AssessmentModal';
import { useToast } from '../components/common/Toast';
import { api } from '../services/api';
import { FeedbackPanel } from '../components/common/FeedbackPanel';
import { useAuth } from '../context/AuthContext';
import { StreaksCalendar } from '../components/trainee/StreaksCalendar';
import { TraineeSettingsView } from '../components/trainee/TraineeSettingsView';
import {
  X, Play, BookOpen, Clock, Users,
  FolderArchive, Video, Presentation, FileText, ExternalLink,
  ChevronRight, FileCheck, AlertCircle,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   TRAINEE SUB-VIEWS (Courses, Quizzes, Library)
   ════════════════════════════════════════════════════════════════ */

/* ── My Courses view ─────────────────────────────────────────── */
const CoursesView = ({ courses, assessments, searchQuery, onOpenCourse, enrolledCourseIds, onlyEnrolled, onEnroll, onOptOut }) => {
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const courseProgressMap = {
    'Effective Leadership & Team Management': { progress: 75, dueDate: 'Due: May 20', nextUnit: 'Conflict Resolution' },
    'Communication Skills for Professionals': { progress: 90, dueDate: 'Due: May 25', nextUnit: 'Final Presentation' },
    'Cloud Computing Fundamentals (AWS & Azure)': { progress: 40, dueDate: 'Due: Jun 10', nextUnit: 'VPC Architecture' },
    'Agile & Scrum Practitioner': { progress: 20, dueDate: 'Due: Jun 18', nextUnit: 'Sprint Ceremonies' },
    'HR Practices & Compliance Essentials': { progress: 100, dueDate: 'Completed', nextUnit: 'Cert Issued' },
  };

  const filtered = courses.filter((c) => {
    if (onlyEnrolled && !enrolledCourseIds.has(c._id)) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q) ||
      c.subject?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-[#19191F]">My Courses</h2>
        <p className="text-sm text-[#92929E] mt-1">Your enrolled corporate learning tracks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-2 py-16 text-center rounded-3xl bg-white border border-[#EEEEF4]">
            <BookOpen className="w-10 h-10 text-[#92929E] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#19191F]">{onlyEnrolled ? 'No enrolled courses yet' : 'No courses found'}</p>
            {onlyEnrolled && <p className="mt-1 text-xs text-[#92929E]">Browse All Courses to find your next learning track.</p>}
          </div>
        ) : (
          filtered.map((course) => {
            const meta = courseProgressMap[course.title] || { progress: 50, dueDate: 'Jun 30', nextUnit: 'Core Unit' };
            const courseQuiz = assessments.find((a) => a.courseId === course._id);
            return (
              <div
                key={course._id}
                onClick={() => onOpenCourse(course)}
                className="rounded-3xl bg-white border border-[#EEEEF4] hover:border-[#755BE8]/30 hover:shadow-md transition-all overflow-hidden flex flex-col group"
              >
                <div className="relative h-36 overflow-hidden bg-[#F6F7FB]">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-sm text-[#755BE8] border border-[#755BE8]/20">
                      <Clock className="w-3 h-3" /> {meta.dueDate}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-lg bg-[#EEE9FB]/90 text-[#755BE8]">
                      {course.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#19191F] group-hover:text-[#755BE8] transition-colors line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-[#92929E] mt-1 line-clamp-2 leading-relaxed">{course.description}</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#92929E]">Completed</span>
                      <span className="font-bold text-[#755BE8]">{meta.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F6F7FB] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#755BE8] rounded-full transition-all duration-300"
                        style={{ width: `${meta.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#EEEEF4] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#EEE9FB] flex items-center justify-center text-[#755BE8] text-[10px] font-bold">
                        {course.trainerName?.charAt(0) || 'T'}
                      </div>
                      <span className="text-[11px] font-semibold text-[#19191F]">{course.trainerName || 'Instructor'}</span>
                    </div>
                    {courseQuiz ? (
                      <button
                        type="button"
                        onClick={(event) => { event.stopPropagation(); setSelectedAssessment(courseQuiz); }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#755BE8] hover:bg-[#6448DE] text-white text-xs font-bold shadow-sm transition-all"
                      >
                        Take Quiz <ChevronRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(event) => { event.stopPropagation(); onOpenCourse(course); }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F6F7FB] hover:bg-[#EEE9FB] text-[#92929E] hover:text-[#755BE8] text-xs font-semibold border border-[#EEEEF4] transition-colors"
                      >
                        View Deck <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  {!onlyEnrolled && (
                    <button
                      type="button"
                      onClick={(event) => { event.stopPropagation(); onEnroll(course._id); }}
                      disabled={enrolledCourseIds.has(course._id)}
                      className="mt-2 w-full rounded-xl bg-[#EEE9FB] py-2 text-xs font-bold text-[#755BE8] hover:bg-[#E3DCFA] disabled:cursor-default disabled:opacity-60"
                    >
                      {enrolledCourseIds.has(course._id) ? 'Already Enrolled' : 'Enroll in Course'}
                    </button>
                  )}
                  {onlyEnrolled && (
                    <button
                      type="button"
                      onClick={(event) => { event.stopPropagation(); onOptOut(course._id); }}
                      className="mt-2 w-full rounded-xl border border-rose-100 bg-rose-50 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500 hover:text-white"
                    >
                      Opt Out of Course
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedAssessment && (
        <AssessmentModal
          assessment={selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
          onCompleted={() => setSelectedAssessment(null)}
        />
      )}
    </div>
  );
};

const getYouTubeEmbedUrl = (url) => {
  try {
    const parsed = new URL(url);
    const videoId = parsed.searchParams.get('v') || parsed.pathname.split('/').pop();
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
};

const CourseDetailView = ({ course, resources, assessments, onBack }) => {
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const video = resources.find((item) => item.type === 'video');
  const notes = resources.filter((item) => item.type === 'pdf' || item.type === 'doc' || item.type === 'slides');
  const courseQuiz = assessments.find((assessment) => assessment.courseId === course._id);

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#755BE8] hover:text-[#6448DE]"
      >
        <ChevronRight className="w-4 h-4 rotate-180" /> Back to My Courses
      </button>

      <div className="relative overflow-hidden rounded-3xl bg-[#19191F] min-h-[220px]">
        <img src={course.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#19191F] via-[#19191F]/80 to-transparent" />
        <div className="relative z-10 flex min-h-[220px] max-w-2xl flex-col justify-end p-7">
          <span className="mb-3 w-fit rounded-lg bg-[#EEE9FB] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#755BE8]">
            {course.category} · {course.level}
          </span>
          <h1 className="text-2xl font-extrabold text-white">{course.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{course.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-white/70">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {course.trainerName}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)] gap-6 items-start">
        <section className="rounded-3xl bg-white border border-[#EEEEF4] p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#19191F]">Lecture room</h2>
              <p className="text-xs text-[#92929E] mt-1">Watch the connected YouTube lecture for this course.</p>
            </div>
            <Video className="w-5 h-5 text-[#755BE8]" />
          </div>
          {video && getYouTubeEmbedUrl(video.url) ? (
            <div className="overflow-hidden rounded-2xl bg-[#19191F] aspect-video">
              <iframe
                title={video.title}
                src={getYouTubeEmbedUrl(video.url)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="rounded-2xl bg-[#F6F7FB] p-8 text-center text-xs text-[#92929E]">
              No lecture has been published for this course yet.
            </div>
          )}
          {video && <p className="mt-3 text-xs font-semibold text-[#19191F]">{video.title}</p>}
        </section>

        <section className="rounded-3xl bg-white border border-[#EEEEF4] p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#19191F]">Course materials</h2>
              <p className="text-xs text-[#92929E] mt-1">Notes and supporting resources</p>
            </div>
            <FolderArchive className="w-5 h-5 text-[#755BE8]" />
          </div>
          <div className="space-y-2.5">
            {notes.length === 0 ? (
              <p className="rounded-2xl bg-[#F6F7FB] p-5 text-center text-xs text-[#92929E]">No notes uploaded yet.</p>
            ) : notes.map((note) => (
              <a
                key={note._id}
                href={note.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-[#EEEEF4] p-3 hover:border-[#755BE8]/30 hover:bg-[#EEE9FB]/30 transition-colors"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEE9FB] text-[#755BE8]">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-[#19191F]">{note.title}</p>
                  <p className="mt-0.5 text-[10px] uppercase font-semibold text-[#92929E]">{note.type} · Open resource</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#92929E]" />
              </a>
            ))}
          </div>
          {courseQuiz && (
            <button
              type="button"
              onClick={() => setSelectedAssessment(courseQuiz)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#755BE8] py-3 text-xs font-bold text-white hover:bg-[#6448DE] transition-colors"
            >
              <FileCheck className="w-4 h-4" /> Take course quiz
            </button>
          )}
        </section>
      </div>

      {selectedAssessment && (
        <AssessmentModal
          assessment={selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
          onCompleted={() => setSelectedAssessment(null)}
        />
      )}
    </div>
  );
};

/* ── Quizzes & Tests view ─────────────────────────────────────── */
const QuizzesView = ({ assessments }) => {
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-[#19191F]">Quizzes & Tests</h2>
        <p className="text-sm text-[#92929E] mt-1">MCQ assessments available for your enrolled courses</p>
      </div>

      {assessments.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white border border-[#EEEEF4]">
          <FileCheck className="w-10 h-10 text-[#92929E] mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#19191F]">No assessments available yet</p>
          <p className="text-xs text-[#92929E] mt-1">Your instructor will publish quizzes here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assessments.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-2xl border border-[#EEEEF4] hover:border-[#755BE8]/30 hover:shadow-sm transition-all p-5 flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#EEE9FB] flex items-center justify-center text-[#755BE8] shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#19191F] group-hover:text-[#755BE8] transition-colors">{a.title}</h3>
                  <p className="text-[11px] text-[#92929E] mt-0.5">{a.courseTitle || 'General Assessment'}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#92929E]">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {a.questions?.length || 5} Questions</span>
                    <span>·</span>
                    <span>Passing: {a.passingScore}%</span>
                    <span>·</span>
                    <span className="text-[#755BE8] font-semibold">{a.deadline ? `Due: ${a.deadline}` : 'Self-Paced'}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssessment(a)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#755BE8] hover:bg-[#6448DE] text-white text-xs font-bold shadow-md shadow-[#755BE8]/20 transition-all hover:scale-[1.02] shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Start Quiz
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedAssessment && (
        <AssessmentModal
          assessment={selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
          onCompleted={() => setSelectedAssessment(null)}
        />
      )}
    </div>
  );
};

/* ── Resource Library view ───────────────────────────────────── */
const LibraryView = ({ library, searchQuery }) => {
  const [libTab, setLibTab] = useState('all');

  const filtered = library.filter((item) => {
    const matchType = libTab === 'all' || item.type === libTab;
    const matchSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-[#19191F]">Resource Library</h2>
        <p className="text-sm text-[#92929E] mt-1">Study materials, slides, and recordings from your courses</p>
      </div>

      <div className="flex items-center bg-white p-1 rounded-xl border border-[#EEEEF4] w-fit">
        {[{ id: 'all', label: 'All' }, { id: 'slides', label: 'Slides' }, { id: 'video', label: 'Videos' }, { id: 'pdf', label: 'PDFs' }].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setLibTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${libTab === tab.id ? 'bg-[#755BE8] text-white shadow-sm' : 'text-[#92929E] hover:text-[#19191F]'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-white border border-[#EEEEF4]">
            <FolderArchive className="w-10 h-10 text-[#92929E] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#19191F]">No resources found</p>
          </div>
        ) : (
          filtered.map((item) => {
            const isVideo = item.type === 'video';
            const isSlides = item.type === 'slides';
            return (
              <div
                key={item._id}
                className="p-4 rounded-2xl bg-white border border-[#EEEEF4] hover:border-[#755BE8]/30 hover:bg-[#EEE9FB]/20 transition-all flex items-start justify-between gap-4 group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${isVideo ? 'bg-red-50 text-red-500 border-red-100' :
                      isSlides ? 'bg-amber-50 text-amber-500 border-amber-100' :
                        'bg-blue-50 text-blue-500 border-blue-100'
                    }`}>
                    {isVideo && <Video className="w-5 h-5" />}
                    {isSlides && <Presentation className="w-5 h-5" />}
                    {!isVideo && !isSlides && <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#19191F] group-hover:text-[#755BE8] transition-colors">{item.title}</h4>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#F6F7FB] text-[#92929E] border border-[#EEEEF4]">{item.type}</span>
                    </div>
                    <p className="text-[11px] text-[#92929E] mt-0.5 line-clamp-1">{item.description || item.courseTitle}</p>
                    {item.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {item.tags.map((t, i) => (
                          <span key={i} className="text-[10px] text-[#755BE8] bg-[#EEE9FB] px-2 py-0.5 rounded-lg">#{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F6F7FB] hover:bg-[#EEE9FB] text-[#755BE8] text-xs font-semibold border border-[#EEEEF4] hover:border-[#755BE8]/30 transition-colors shrink-0"
                >
                  Open <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
  MAIN CAPACITY CONNECT DASHBOARD (Trainee shell)
   ════════════════════════════════════════════════════════════════ */
export const CoursueDashboard = () => {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Data for sub-views
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [library, setLibrary] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseResources, setCourseResources] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, assessmentsRes, libraryRes, enrollmentsRes] = await Promise.all([
          api.getCourses(),
          api.getAssessments(),
          api.getLibrary(),
          api.getEnrollments(user?._id || 'demo-trainee'),
        ]);
        if (coursesRes?.courses) setCourses(coursesRes.courses);
        if (assessmentsRes?.assessments) setAssessments(assessmentsRes.assessments);
        if (libraryRes?.library) setLibrary(libraryRes.library);
        if (enrollmentsRes?.enrollments) setEnrolledCourseIds(new Set(enrollmentsRes.enrollments.map((item) => item.courseId)));
      } catch (err) {
        console.warn('Error loading trainee data:', err);
      }
    };
    fetchData();

    // Keep the trainee portal in sync with trainer publications while it is open.
    const refreshInterval = window.setInterval(async () => {
      try {
        const [assessmentsRes, libraryRes] = await Promise.all([
          api.getAssessments(),
          api.getLibrary(),
        ]);
        if (assessmentsRes?.assessments) setAssessments(assessmentsRes.assessments);
        if (libraryRes?.library) setLibrary(libraryRes.library);
      } catch (err) {
        console.warn('Error refreshing trainee content:', err);
      }
    }, 5000);

    return () => window.clearInterval(refreshInterval);
  }, [user?._id]);

  const handleEnroll = async (courseId) => {
    try {
      await api.enrollInCourse(user?._id || 'demo-trainee', courseId);
      setEnrolledCourseIds((previous) => new Set([...previous, courseId]));
      addToast('Course added to My Courses.', 'success');
    } catch (error) {
      addToast(error.message || 'Could not enroll in course.', 'error');
    }
  };

  const handleOptOut = async (courseId) => {
    try {
      await api.optOutOfCourse(user?._id || 'demo-trainee', courseId);
      setEnrolledCourseIds((previous) => {
        const next = new Set(previous);
        next.delete(courseId);
        return next;
      });
      if (selectedCourse?._id === courseId) setSelectedCourse(null);
      addToast('You opted out of the course.', 'info');
    } catch (error) {
      addToast(error.message || 'Could not opt out of course.', 'error');
    }
  };

  useEffect(() => {
    if (!selectedCourse) {
      setCourseResources([]);
      return;
    }

    api.getLibrary({ courseId: selectedCourse._id })
      .then((response) => setCourseResources(response?.library || []))
      .catch((error) => {
        console.warn('Error loading course resources:', error);
        setCourseResources([]);
      });

    const refreshCourseResources = window.setInterval(() => {
      api.getLibrary({ courseId: selectedCourse._id })
        .then((response) => setCourseResources(response?.library || []))
        .catch((error) => console.warn('Error refreshing course resources:', error));
    }, 5000);

    return () => window.clearInterval(refreshCourseResources);
  }, [selectedCourse]);

  // Dashboard-specific modal state
  const [activeModal, setActiveModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleJoinClick = () => {
    setSelectedCourse(null);
    setActiveModal(null);
    setActiveNav('All Courses');
  };
  const handleCourseClick = (course) => { setSelectedCourse(course); setActiveNav('Courses'); };
  const handleLessonAction = (l) => { setSelectedItem(l); setActiveModal('lesson'); };
  const handleProgressAction = (m) => addToast(`Viewing progress for ${m.title}`, 'info');
  const handleAddMentor = () => addToast('Browse directory to discover accredited mentors', 'info');
  const handleSeeAllMentors = () => addToast('Loading full mentor catalog...', 'info');

  /* ── View switcher ─────────────────────────────────────────── */
  const renderMainContent = () => {
    switch (activeNav) {
      case 'Courses':
        return selectedCourse ? (
          <CourseDetailView
            course={selectedCourse}
            resources={courseResources}
            assessments={assessments}
            onBack={() => setSelectedCourse(null)}
          />
        ) : (
          <CoursesView
            courses={courses}
            assessments={assessments}
            searchQuery={searchQuery}
            onOpenCourse={setSelectedCourse}
            enrolledCourseIds={enrolledCourseIds}
            onlyEnrolled
            onEnroll={handleEnroll}
            onOptOut={handleOptOut}
          />
        );
      case 'All Courses':
        return (
          <CoursesView
            courses={courses}
            assessments={assessments}
            searchQuery={searchQuery}
            onOpenCourse={setSelectedCourse}
            enrolledCourseIds={enrolledCourseIds}
            onEnroll={handleEnroll}
            onOptOut={handleOptOut}
          />
        );
      case 'Quizzes':
        return <QuizzesView assessments={assessments} />;
      case 'Library':
        return <LibraryView library={library} searchQuery={searchQuery} />;
      case 'Feedback':
        return <FeedbackPanel />;
      case 'Settings':
        return <TraineeSettingsView />;
      case 'Dashboard':
      default:
        return (
          <>
            <HeroBanner onJoinClick={handleJoinClick} />
            <CourseProgressCard onActionClick={handleProgressAction} />
            <ContinueWatchingCarousel
              courses={courses.filter((course) => enrolledCourseIds.has(course._id))}
              searchQuery={searchQuery}
              onCourseClick={handleCourseClick}
            />
            <LessonsTable
              onLessonAction={handleLessonAction}
              onSeeAll={() => addToast('Displaying full syllabus curriculum', 'info')}
            />
          </>
        );
    }
  };

  /* ── For non-dashboard views: use a simpler 1-col layout ──── */
  const isDashboardView = activeNav === 'Dashboard';

  return (
    <div className="dark-dashboard relative min-h-screen bg-[#0B1020] text-slate-100 antialiased">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <ShaderGradientCanvas
          className="h-full w-full opacity-50"
          pointerEvents="none"
          pixelDensity={1}
          lazyLoad
          powerPreference="low-power"
        >
          <ShaderGradient
            animate="on"
            axesHelper="off"
            bgColor1="#000000"
            bgColor2="#000000"
            brightness={0.8}
            cAzimuthAngle={270}
            cDistance={0.5}
            cPolarAngle={180}
            cameraZoom={15.1}
            color1="#73bfc4"
            color2="#ff810a"
            color3="#8da0ce"
            destination="onCanvas"
            embedMode="off"
            envPreset="city"
            format="gif"
            fov={45}
            frameRate={10}
            gizmoHelper="hide"
            grain="on"
            lightType="env"
            pixelDensity={1}
            positionX={-0.1}
            positionY={0}
            positionZ={0}
            range="disabled"
            rangeEnd={40}
            rangeStart={0}
            reflection={0.4}
            rotationX={0}
            rotationY={130}
            rotationZ={70}
            shader="defaults"
            type="sphere"
            uAmplitude={3.2}
            uDensity={0.8}
            uFrequency={5.5}
            uSpeed={0.3}
            uStrength={0.3}
            uTime={0}
            wireframe={false}
          />
        </ShaderGradientCanvas>
        <div className="absolute inset-0 bg-[#0B1020]/72" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col md:flex-row">
        {/* Left Sidebar */}
        <AppSidebar activeNav={activeNav} onNavSelect={setActiveNav} />

        {/* Main content column */}
        <div className="flex-1 flex flex-col min-w-0 px-4 sm:px-6 lg:px-8 max-w-[1500px] mx-auto w-full">
          <DashboardHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {isDashboardView ? (
            /* Dashboard: central area + right statistics panel */
            <div className="flex flex-col lg:flex-row items-start gap-6 pb-12">
              <main className="flex-1 min-w-0 w-full space-y-2">
                {renderMainContent()}
              </main>
              <div className="w-full lg:w-[270px] xl:w-[285px] shrink-0 space-y-6">
                <StatisticsPanel
                  variant="trainee"
                  onAddMentor={handleAddMentor}
                  onSeeAllMentors={handleSeeAllMentors}
                />
                <StreaksCalendar />
              </div>
            </div>
          ) : (
            /* Sub-views: full-width single column */
            <main className="flex-1 min-w-0 w-full pb-12">
              {renderMainContent()}
            </main>
          )}
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────── */}
      {(activeModal === 'join' || activeModal === 'course') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-[#EEEEF4] relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#92929E] hover:text-[#19191F] hover:bg-[#F6F7FB] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#EEE9FB] text-[#755BE8]">
                {selectedItem?.category || 'Professional Certification'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#19191F] leading-snug">
              {selectedItem?.title || 'Sharpen Your Skills with Professional Online Courses'}
            </h3>
            <p className="text-xs text-[#92929E] mt-2 leading-relaxed">
              Accelerate your design and engineering competencies with hands-on projects, personalized mentor feedback, and industry-standard certifications.
            </p>
            <div className="grid grid-cols-3 gap-3 my-5">
              {[{ icon: Clock, label: '16 Hours', sub: 'Self-Paced' }, { icon: BookOpen, label: '8 Modules', sub: '4 Assessments' }, { icon: Users, label: '1-on-1', sub: 'Mentor Support' }].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="p-3 rounded-2xl bg-[#F6F7FB] text-center">
                  <Icon className="w-4 h-4 text-[#755BE8] mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-[#19191F] block">{label}</span>
                  <span className="text-[9px] text-[#92929E]">{sub}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EEEEF4]">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-[#92929E] hover:text-[#19191F]">
                Close
              </button>
              <button
                onClick={() => { addToast('Successfully enrolled in course!', 'success'); setActiveModal(null); }}
                className="px-5 py-2 rounded-xl bg-[#755BE8] hover:bg-[#6448DE] text-white text-xs font-bold shadow-md shadow-[#755BE8]/20 transition-all"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'lesson' && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-[#EEEEF4] relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#92929E] hover:text-[#19191F] hover:bg-[#F6F7FB] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#EEE9FB] text-[#755BE8]">
                {selectedItem.type}
              </span>
              <span className="text-[10px] text-[#92929E]">{selectedItem.date}</span>
            </div>
            <h3 className="text-base font-bold text-[#19191F] leading-tight">{selectedItem.description}</h3>
            <div className="flex items-center gap-3 my-4 p-3 rounded-2xl bg-[#F6F7FB]">
              <img
                src={selectedItem.mentorAvatar}
                alt={selectedItem.mentorName}
                className="w-10 h-10 rounded-full object-cover border border-[#EEEEF4]"
              />
              <div>
                <p className="text-xs font-bold text-[#19191F]">{selectedItem.mentorName}</p>
                <p className="text-[10px] text-[#92929E]">Course Instructor</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#EEEEF4]">
              <span className="text-[11px] text-[#92929E]">Ready to begin?</span>
              <button
                onClick={() => { addToast(`Launching: "${selectedItem.description}"`, 'success'); setActiveModal(null); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#755BE8] hover:bg-[#6448DE] text-white text-xs font-bold transition-all shadow-md shadow-[#755BE8]/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Launch Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
