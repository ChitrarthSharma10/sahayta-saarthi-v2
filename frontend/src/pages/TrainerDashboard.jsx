import React, { useState, useEffect } from 'react';
import {
  Users,
  FileCheck2,
  CheckCircle2,
  Sparkles,
  Plus,
  BookOpen,
  FolderArchive,
  Upload,
  Presentation,
  Video,
  FileText,
  ExternalLink,
  Clock,
  TrendingUp,
  Tag,
  BarChart3,
  Target,
  ArrowLeft,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { QuestionnaireBuilderModal } from '../components/trainer/QuestionnaireBuilderModal';
import { LibraryUploaderModal } from '../components/trainer/LibraryUploaderModal';
import { StatisticsPanel } from '../components/coursue/StatisticsPanel';
import { useToast } from '../components/common/Toast';
import { FeedbackPanel } from '../components/common/FeedbackPanel';
import { TrainerProfileManagement } from '../components/trainer/TrainerProfileManagement';

/* ════════════════════════════════════════════════════════════════
   SUB-VIEWS
   ════════════════════════════════════════════════════════════════ */

/* ── 1. Dashboard Overview ───────────────────────────────────── */
const DashboardView = ({ user, courses, library, assessments, onOpenQuestionnaire, onOpenUploader }) => (
  <div className="space-y-6">
    {/* Hero */}
    <div className="relative rounded-3xl bg-gradient-to-br from-[#755BE8] to-[#6448DE] p-7 overflow-hidden shadow-xl shadow-[#755BE8]/20">
      <div className="absolute -right-8 -top-8 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-4 bottom-0 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-white/90 text-[10px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" /> Trainer Studio
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-white/80">{user?.name || 'Priya Nair'}</span>
          </h1>
          <p className="text-sm text-white/70 mt-1 max-w-lg">
            Design assessments, publish curriculum decks, and monitor student engagement in real-time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onOpenQuestionnaire}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#755BE8] text-xs font-bold shadow-lg hover:bg-[#F6F7FB] hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Questionnaire Builder
          </button>
          <button
            onClick={onOpenUploader}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/30 hover:scale-[1.02] transition-all"
          >
            <Upload className="w-4 h-4" /> Upload Resource
          </button>
        </div>
      </div>
    </div>

    {/* Stats Row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'Student Engagement', value: '187',          sub: '+24% this week',           icon: Users,       accent: 'bg-[#EEE9FB] text-[#755BE8]', trend: 'emerald' },
        { label: 'Course Submissions', value: '48',           sub: '12 pending review',         icon: FileCheck2,  accent: 'bg-amber-50 text-amber-500',   trend: 'amber'   },
        { label: 'Avg Passing Rate',   value: '91.4%',        sub: 'Baseline: 75%',             icon: CheckCircle2,accent: 'bg-emerald-50 text-emerald-500',trend: 'emerald' },
        { label: 'Published Resources',value: String(library.length || 0), sub: `Across ${courses.length} courses`, icon: FolderArchive, accent: 'bg-blue-50 text-blue-500', trend: 'blue' },
      ].map(({ label, value, sub, icon: Icon, accent }) => (
        <div key={label} className="p-5 rounded-2xl bg-white border border-[#EEEEF4] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#92929E]">{label}</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent}`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#19191F]">{value}</div>
          <p className="text-[11px] text-[#92929E] mt-1">{sub}</p>
        </div>
      ))}
    </div>

    {/* Recent Assessments preview */}
    <div className="bg-white rounded-3xl border border-[#EEEEF4] shadow-sm p-6">
      <h2 className="text-[15px] font-bold text-[#19191F] flex items-center gap-2 mb-4">
        <FileCheck2 className="w-4 h-4 text-[#755BE8]" /> Recent Questionnaires
      </h2>
      {assessments.length === 0 ? (
        <div className="py-8 text-center rounded-2xl bg-[#F6F7FB] border border-[#EEEEF4]">
          <p className="text-xs text-[#92929E]">No questionnaires yet — use the builder above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {assessments.slice(0, 4).map((a) => (
            <div key={a._id} className="p-4 rounded-2xl bg-[#F6F7FB] border border-[#EEEEF4] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#19191F]">{a.title}</p>
                <p className="text-[11px] text-[#92929E] mt-0.5">{a.questions?.length || 5} Questions · Passing: {a.passingScore}%</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold">Live</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

/* ── 2. Course Management ─────────────────────────────────────── */
const CourseManagementView = ({ courses, searchQuery, onOpenCourse }) => {
  const filtered = courses.filter((c) =>
    !searchQuery ||
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-[#19191F]">Course Management</h2>
        <p className="text-sm text-[#92929E] mt-1">All curriculum tracks available in the LMS</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-3 py-16 text-center rounded-3xl bg-white border border-[#EEEEF4]">
            <BookOpen className="w-10 h-10 text-[#92929E] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#19191F]">No courses found</p>
            <p className="text-xs text-[#92929E] mt-1">Try adjusting your search.</p>
          </div>
        ) : (
          filtered.map((course, idx) => (
            <div
              key={course._id || idx}
              onClick={() => onOpenCourse(course)}
              className="bg-white border border-[#EEEEF4] rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#755BE8]/30 transition-all group"
            >
              {/* Colour band */}
              <div
                className="h-2 w-full"
                style={{ background: idx % 3 === 0 ? '#755BE8' : idx % 3 === 1 ? '#22c55e' : '#f59e0b' }}
              />
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[13px] font-bold text-[#19191F] leading-snug group-hover:text-[#755BE8] transition-colors">
                    {course.title}
                  </h3>
                  <span className="text-[10px] shrink-0 font-bold px-2 py-0.5 rounded-full bg-[#EEE9FB] text-[#755BE8]">
                    {course.category || 'General'}
                  </span>
                </div>
                <p className="text-[11px] text-[#92929E] line-clamp-2">{course.description || 'No description provided.'}</p>
                <div className="flex items-center gap-3 pt-2 border-t border-[#EEEEF4] text-[11px] text-[#92929E]">
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {course.subject || 'General'}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration || 'Self-paced'}</span>
                </div>
                <button
                  type="button"
                  onClick={(event) => { event.stopPropagation(); onOpenCourse(course); }}
                  className="w-full rounded-xl bg-[#EEE9FB] py-2.5 text-xs font-bold text-[#755BE8] hover:bg-[#E3DCFA] transition-colors"
                >
                  Manage Course
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const TrainerCourseView = ({ course, resources, assessments, onBack, onUpload, onQuestionnaire }) => {
  const courseAssessments = assessments.filter((assessment) => assessment.courseId === course._id);

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#755BE8] hover:text-[#6448DE]"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Course Management
      </button>

      <div className="relative overflow-hidden rounded-3xl bg-[#19191F] min-h-[220px]">
        <img src={course.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#19191F] via-[#19191F]/85 to-transparent" />
        <div className="relative z-10 flex min-h-[220px] flex-col justify-end p-7">
          <span className="mb-3 w-fit rounded-lg bg-[#EEE9FB] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#755BE8]">
            Course workspace · {course.category || 'General'}
          </span>
          <h1 className="max-w-2xl text-2xl font-extrabold text-white">{course.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">{course.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-white/70">
            <span>{course.trainerName || 'Assigned trainer'}</span>
            <span>{course.duration || 'Self-paced'}</span>
            <span>{course.enrollmentCount || 0}/{course.maxEnrollment || 0} enrolled</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onUpload}
          className="inline-flex items-center gap-2 rounded-xl bg-[#755BE8] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#755BE8]/20 hover:bg-[#6448DE]"
        >
          <Upload className="w-4 h-4" /> Upload Resource or Video
        </button>
        <button
          type="button"
          onClick={onQuestionnaire}
          className="inline-flex items-center gap-2 rounded-xl border border-[#755BE8]/25 bg-[#EEE9FB] px-4 py-2.5 text-xs font-bold text-[#755BE8] hover:bg-[#E3DCFA]"
        >
          <Plus className="w-4 h-4" /> Create Questionnaire
        </button>
      </div>

      <section className="rounded-3xl border border-[#EEEEF4] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#19191F]">Published course content</h2>
            <p className="mt-1 text-xs text-[#92929E]">Manage the lectures, notes, decks, and assessments trainees see.</p>
          </div>
          <span className="rounded-full bg-[#F6F7FB] px-2.5 py-1 text-[10px] font-bold text-[#92929E]">
            {resources.length} resources
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {resources.length === 0 ? (
            <div className="rounded-2xl bg-[#F6F7FB] p-8 text-center text-xs text-[#92929E]">
              No resources published for this course yet.
            </div>
          ) : resources.map((resource) => (
            <div key={resource._id} className="flex items-center gap-3 rounded-2xl border border-[#EEEEF4] p-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${resource.type === 'video' ? 'bg-red-50 text-red-500' : 'bg-[#EEE9FB] text-[#755BE8]'}`}>
                {resource.type === 'video' ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-[#19191F]">{resource.title}</p>
                <p className="mt-0.5 text-[10px] uppercase font-semibold text-[#92929E]">{resource.type} · {resource.uploaderName || 'Trainer'}</p>
              </div>
              <a href={resource.url} target="_blank" rel="noreferrer" className="rounded-lg bg-[#F6F7FB] px-3 py-1.5 text-[10px] font-bold text-[#755BE8] hover:bg-[#EEE9FB]">
                Open
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[#EEEEF4] bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-[#19191F]">Course questionnaires</h2>
        <div className="mt-4 space-y-2">
          {courseAssessments.length === 0 ? (
            <p className="rounded-2xl bg-[#F6F7FB] p-5 text-center text-xs text-[#92929E]">No questionnaires published for this course.</p>
          ) : courseAssessments.map((assessment) => (
            <div key={assessment._id} className="flex items-center justify-between rounded-2xl border border-[#EEEEF4] p-3">
              <div>
                <p className="text-xs font-bold text-[#19191F]">{assessment.title}</p>
                <p className="mt-0.5 text-[10px] text-[#92929E]">{assessment.questions?.length || 0} questions · Passing {assessment.passingScore}%</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600">Published</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

/* ── 3. Questionnaire Builder tab ────────────────────────────── */
const QuestionnaireView = ({ assessments, courses, onOpen, onCreated }) => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-extrabold text-[#19191F]">Questionnaire Builder</h2>
        <p className="text-sm text-[#92929E] mt-1">MCQ assessments currently published to trainees</p>
      </div>
      <button
        onClick={onOpen}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#755BE8] hover:bg-[#6448DE] text-white text-xs font-bold shadow-md shadow-[#755BE8]/20 transition-all hover:scale-[1.02]"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" /> New Questionnaire
      </button>
    </div>

    <div className="space-y-3">
      {assessments.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white border border-[#EEEEF4]">
          <FileCheck2 className="w-10 h-10 text-[#92929E] mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#19191F]">No questionnaires yet</p>
          <p className="text-xs text-[#92929E] mt-1">Click "New Questionnaire" to create your first MCQ assessment.</p>
        </div>
      ) : (
        assessments.map((a) => (
          <div
            key={a._id}
            className="p-5 rounded-2xl bg-white border border-[#EEEEF4] hover:border-[#755BE8]/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#755BE8]">
                    Passing: {a.passingScore}%
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold">Live</span>
                </div>
                <h3 className="text-sm font-bold text-[#19191F]">{a.title}</h3>
                <p className="text-[11px] text-[#92929E] mt-0.5">{a.courseTitle || 'General Assessment'}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px] font-semibold text-[#19191F]">{a.questions?.length || 5} Questions</div>
                <div className="text-[10px] text-[#92929E] mt-0.5">
                  {a.deadline ? `Due: ${a.deadline}` : 'Self-Paced'}
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#EEEEF4] flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-[#92929E]" />
              <span className="text-[11px] text-[#92929E]">
                {a.attempts || 0} attempts · Avg score: {a.avgScore || '—'}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

/* ── 4. Content Library tab ───────────────────────────────────── */
const ContentLibraryView = ({ library, courses, searchQuery, onOpen }) => {
  const [libraryTab, setLibraryTab] = useState('all');

  const filtered = library.filter((item) => {
    const matchType = libraryTab === 'all' || item.type === libraryTab;
    const matchSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#19191F]">Content Library</h2>
          <p className="text-sm text-[#92929E] mt-1">Manage published presentations, recordings, and study guides</p>
        </div>
        <button
          onClick={onOpen}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#755BE8] hover:bg-[#6448DE] text-white text-xs font-bold shadow-md shadow-[#755BE8]/20 transition-all hover:scale-[1.02]"
        >
          <Upload className="w-4 h-4" /> Upload Resource
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center bg-white p-1 rounded-xl border border-[#EEEEF4] w-fit">
        {[{ id: 'all', label: 'All' }, { id: 'slides', label: 'Slides' }, { id: 'video', label: 'Videos' }, { id: 'pdf', label: 'PDFs' }].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setLibraryTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              libraryTab === tab.id ? 'bg-[#755BE8] text-white shadow-sm' : 'text-[#92929E] hover:text-[#19191F]'
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
            <p className="text-xs text-[#92929E] mt-1">Click "Upload Resource" to add one.</p>
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
                    {isVideo  && <Video       className="w-5 h-5" />}
                    {isSlides && <Presentation className="w-5 h-5" />}
                    {!isVideo && !isSlides && <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#19191F] group-hover:text-[#755BE8] transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#F6F7FB] text-[#92929E] border border-[#EEEEF4]">
                        {item.type}
                      </span>
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
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[10px] text-[#92929E]">{item.duration || item.fileSize || 'Standard'}</span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F6F7FB] hover:bg-[#EEE9FB] text-[#755BE8] text-xs font-semibold border border-[#EEEEF4] hover:border-[#755BE8]/30 transition-colors"
                  >
                    Open <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   MAIN TRAINER DASHBOARD (view switcher)
   ════════════════════════════════════════════════════════════════ */
export const TrainerDashboard = ({ activeTab = 'dashboard', searchQuery = '' }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [courses,     setCourses]     = useState([]);
  const [library,     setLibrary]     = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseResources, setSelectedCourseResources] = useState([]);

  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isUploaderOpen,      setIsUploaderOpen]      = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, libraryRes, assessmentsRes] = await Promise.all([
          api.getCourses(),
          api.getLibrary(),
          api.getAssessments(),
        ]);
        if (coursesRes?.courses)       setCourses(coursesRes.courses);
        if (libraryRes?.library)       setLibrary(libraryRes.library);
        if (assessmentsRes?.assessments) setAssessments(assessmentsRes.assessments);
      } catch (err) {
        console.warn('Error fetching trainer data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedCourse) {
      setSelectedCourseResources([]);
      return;
    }

    const loadCourseResources = () => {
      api.getLibrary({ courseId: selectedCourse._id })
        .then((response) => setSelectedCourseResources(response?.library || []))
        .catch((err) => console.warn('Error fetching course resources:', err));
    };

    loadCourseResources();
    const refreshInterval = window.setInterval(loadCourseResources, 5000);
    return () => window.clearInterval(refreshInterval);
  }, [selectedCourse]);

  const handleAssessmentCreated = (newAssessment) =>
    setAssessments((prev) => [newAssessment, ...prev]);

  const handleResourceUploaded = (newItem) => {
    setLibrary((prev) => [newItem, ...prev]);
    setSelectedCourseResources((prev) => [newItem, ...prev]);
  };

  /* ── View switcher ─────────────────────────────────────────── */
  const renderView = () => {
    switch (activeTab) {
      case 'courses-overview':
        return selectedCourse ? (
          <TrainerCourseView
            course={selectedCourse}
            resources={selectedCourseResources}
            assessments={assessments}
            onBack={() => setSelectedCourse(null)}
            onUpload={() => setIsUploaderOpen(true)}
            onQuestionnaire={() => setIsQuestionnaireOpen(true)}
          />
        ) : (
          <CourseManagementView
            courses={courses}
            searchQuery={searchQuery}
            onOpenCourse={setSelectedCourse}
          />
        );
      case 'assessments-builder':
        return (
          <QuestionnaireView
            assessments={assessments}
            courses={courses}
            onOpen={() => setIsQuestionnaireOpen(true)}
            onCreated={handleAssessmentCreated}
          />
        );
      case 'library-uploader':
        return (
          <ContentLibraryView
            library={library}
            courses={courses}
            searchQuery={searchQuery}
            onOpen={() => setIsUploaderOpen(true)}
          />
        );
      case 'feedback':
        return <FeedbackPanel />;
      case 'profile-management':
        return <TrainerProfileManagement />;
      case 'dashboard':
      default:
        return (
          <div className="flex flex-col xl:flex-row items-start gap-6">
            <div className="flex-1 min-w-0 w-full">
              <DashboardView
                user={user}
                courses={courses}
                library={library}
                assessments={assessments}
                onOpenQuestionnaire={() => setIsQuestionnaireOpen(true)}
                onOpenUploader={() => setIsUploaderOpen(true)}
              />
            </div>
            <StatisticsPanel
              variant="trainer"
              onAddMentor={() => addToast('Browse the mentor directory to add a trainer connection.', 'info')}
              onSeeAllMentors={() => addToast('Loading the full trainer network...', 'info')}
            />
          </div>
        );
    }
  };

  return (
    <div className="animate-in fade-in duration-200 max-w-7xl mx-auto">
      {renderView()}

      {/* ── Modals (always available regardless of active sub-view) ── */}
      {isQuestionnaireOpen && (
        <QuestionnaireBuilderModal
          courses={courses}
          initialCourseId={selectedCourse?._id}
          onClose={() => setIsQuestionnaireOpen(false)}
          onCreated={handleAssessmentCreated}
        />
      )}
      {isUploaderOpen && (
        <LibraryUploaderModal
          courses={courses}
          initialCourseId={selectedCourse?._id}
          onClose={() => setIsUploaderOpen(false)}
          onUploaded={handleResourceUploaded}
        />
      )}
    </div>
  );
};
