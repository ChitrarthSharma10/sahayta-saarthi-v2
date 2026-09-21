import React, { useState, useEffect } from 'react';
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
import {
  X, CheckCircle2, Play, Sparkles, BookOpen, Clock, Users,
  FolderArchive, Video, Presentation, FileText, ExternalLink,
  Tag, ChevronRight, FileCheck, AlertCircle,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   TRAINEE SUB-VIEWS (Courses, Quizzes, Library)
   ════════════════════════════════════════════════════════════════ */

/* ── My Courses view ─────────────────────────────────────────── */
const CoursesView = ({ courses, assessments, searchQuery }) => {
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const courseProgressMap = {
    'Effective Leadership & Team Management':  { progress: 75,  dueDate: 'Due: May 20', nextUnit: 'Conflict Resolution' },
    'Communication Skills for Professionals':  { progress: 90,  dueDate: 'Due: May 25', nextUnit: 'Final Presentation' },
    'Cloud Computing Fundamentals (AWS & Azure)': { progress: 40, dueDate: 'Due: Jun 10', nextUnit: 'VPC Architecture' },
    'Agile & Scrum Practitioner':              { progress: 20,  dueDate: 'Due: Jun 18', nextUnit: 'Sprint Ceremonies'  },
    'HR Practices & Compliance Essentials':    { progress: 100, dueDate: 'Completed',   nextUnit: 'Cert Issued'        },
  };

  const filtered = courses.filter((c) => {
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
            <p className="text-sm font-semibold text-[#19191F]">No courses found</p>
          </div>
        ) : (
          filtered.map((course) => {
            const meta = courseProgressMap[course.title] || { progress: 50, dueDate: 'Jun 30', nextUnit: 'Core Unit' };
            const courseQuiz = assessments.find((a) => a.courseId === course._id);
            return (
              <div
                key={course._id}
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
                        onClick={() => setSelectedAssessment(courseQuiz)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#755BE8] hover:bg-[#6448DE] text-white text-xs font-bold shadow-sm transition-all"
                      >
                        Take Quiz <ChevronRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F6F7FB] hover:bg-[#EEE9FB] text-[#92929E] hover:text-[#755BE8] text-xs font-semibold border border-[#EEEEF4] transition-colors">
                        View Deck <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
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
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              libTab === tab.id ? 'bg-[#755BE8] text-white shadow-sm' : 'text-[#92929E] hover:text-[#19191F]'
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
            const isVideo  = item.type === 'video';
            const isSlides = item.type === 'slides';
            return (
              <div
                key={item._id}
                className="p-4 rounded-2xl bg-white border border-[#EEEEF4] hover:border-[#755BE8]/30 hover:bg-[#EEE9FB]/20 transition-all flex items-start justify-between gap-4 group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    isVideo  ? 'bg-red-50 text-red-500 border-red-100' :
                    isSlides ? 'bg-amber-50 text-amber-500 border-amber-100' :
                               'bg-blue-50 text-blue-500 border-blue-100'
                  }`}>
                    {isVideo  && <Video className="w-5 h-5" />}
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
   MAIN COURSUE DASHBOARD (Trainee shell)
   ════════════════════════════════════════════════════════════════ */
export const CoursueDashboard = () => {
  const { addToast } = useToast();
  const [activeNav,   setActiveNav]   = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Data for sub-views
  const [courses,     setCourses]     = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [library,     setLibrary]     = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, assessmentsRes, libraryRes] = await Promise.all([
          api.getCourses(),
          api.getAssessments(),
          api.getLibrary(),
        ]);
        if (coursesRes?.courses)         setCourses(coursesRes.courses);
        if (assessmentsRes?.assessments) setAssessments(assessmentsRes.assessments);
        if (libraryRes?.library)         setLibrary(libraryRes.library);
      } catch (err) {
        console.warn('Error loading trainee data:', err);
      }
    };
    fetchData();
  }, []);

  // Dashboard-specific modal state
  const [activeModal,   setActiveModal]   = useState(null);
  const [selectedItem,  setSelectedItem]  = useState(null);

  const handleJoinClick       = () => setActiveModal('join');
  const handleCourseClick     = (c) => { setSelectedItem(c); setActiveModal('course'); };
  const handleLessonAction    = (l) => { setSelectedItem(l); setActiveModal('lesson'); };
  const handleProgressAction  = (m) => addToast(`Viewing progress for ${m.title}`, 'info');
  const handleAddMentor       = () => addToast('Browse directory to discover accredited mentors', 'info');
  const handleSeeAllMentors   = () => addToast('Loading full mentor catalog...', 'info');

  /* ── View switcher ─────────────────────────────────────────── */
  const renderMainContent = () => {
    switch (activeNav) {
      case 'Courses':
        return <CoursesView courses={courses} assessments={assessments} searchQuery={searchQuery} />;
      case 'Quizzes':
        return <QuizzesView assessments={assessments} />;
      case 'Library':
        return <LibraryView library={library} searchQuery={searchQuery} />;
      case 'Dashboard':
      default:
        return (
          <>
            <HeroBanner onJoinClick={handleJoinClick} />
            <CourseProgressCard onActionClick={handleProgressAction} />
            <ContinueWatchingCarousel searchQuery={searchQuery} onCourseClick={handleCourseClick} />
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
    <div className="min-h-screen bg-[#F6F7FB] text-[#19191F] flex flex-col md:flex-row antialiased">
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
            <StatisticsPanel onAddMentor={handleAddMentor} onSeeAllMentors={handleSeeAllMentors} />
          </div>
        ) : (
          /* Sub-views: full-width single column */
          <main className="flex-1 min-w-0 w-full pb-12">
            {renderMainContent()}
          </main>
        )}
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
