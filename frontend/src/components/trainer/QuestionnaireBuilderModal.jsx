import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Clock,
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../common/Toast';

export const QuestionnaireBuilderModal = ({ courses, onClose, onCreated }) => {
  const { addToast } = useToast();

  const [courseId, setCourseId] = useState(courses[0]?._id || '');
  const [title, setTitle] = useState('');
  const [passingScore, setPassingScore] = useState(60);
  const [deadline, setDeadline] = useState('');
  const [saving, setSaving] = useState(false);

  const [questions, setQuestions] = useState([
    {
      id: 'q1',
      text: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: `q${prev.length + 1}`,
        text: '',
        options: ['', '', '', ''],
        correctAnswer: '',
      },
    ]);
  };

  const handleRemoveQuestion = (idx) => {
    if (questions.length <= 1) {
      addToast('Assessment must contain at least one question.', 'error');
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleQuestionTextChange = (idx, text) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[idx].text = text;
      return updated;
    });
  };

  const handleOptionChange = (qIdx, optIdx, val) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const oldVal = updated[qIdx].options[optIdx];
      updated[qIdx].options[optIdx] = val;

      // If this option was selected as the correct answer, update correctAnswer value
      if (updated[qIdx].correctAnswer === oldVal && oldVal !== '') {
        updated[qIdx].correctAnswer = val;
      }
      return updated;
    });
  };

  const handleCorrectAnswerSelect = (qIdx, optionVal) => {
    if (!optionVal.trim()) {
      addToast('Please enter text for this option first before marking it as correct.', 'error');
      return;
    }
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIdx].correctAnswer = optionVal;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseId) {
      addToast('Please choose an associated course.', 'error');
      return;
    }
    if (!title.trim()) {
      addToast('Please provide an assessment title.', 'error');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        addToast(`Question #${i + 1} is missing question text.`, 'error');
        return;
      }
      const emptyOptions = q.options.some((opt) => !opt.trim());
      if (emptyOptions) {
        addToast(`Question #${i + 1} must have all 4 options filled out.`, 'error');
        return;
      }
      if (!q.correctAnswer) {
        addToast(`Please select the correct answer for Question #${i + 1}.`, 'error');
        return;
      }
    }

    const selectedCourse = courses.find((c) => c._id === courseId);

    setSaving(true);
    try {
      const res = await api.createAssessment({
        courseId,
        courseTitle: selectedCourse?.title || '',
        title,
        passingScore: Number(passingScore) || 60,
        deadline: deadline || null,
        questions,
      });

      if (res.success) {
        addToast('Questionnaire created and published successfully!', 'success');
        if (onCreated) onCreated(res.assessment);
        onClose();
      }
    } catch (err) {
      addToast(err.message || 'Failed to create assessment questionnaire.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#1c1d22] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-[#18191e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-yellow-400 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Questionnaire & MCQ Builder</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure evaluations, MCQ options, passing criteria, and deadlines
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Top metadata grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-yellow-400" /> Target Course
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-yellow-400 text-slate-100 text-sm rounded-2xl px-3.5 py-2.5 outline-none"
                required
              >
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Assessment Title
              </label>
              <input
                type="text"
                placeholder="e.g. Cloud Architecture Chapter Quiz"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-yellow-400 text-slate-100 text-sm rounded-2xl px-3.5 py-2.5 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-purple-400" /> Passing Score (%)
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={passingScore}
                onChange={(e) => setPassingScore(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-yellow-400 text-slate-100 text-sm rounded-2xl px-3.5 py-2.5 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-yellow-400" /> Submission Deadline (Optional)
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-yellow-400 text-slate-100 text-sm rounded-2xl px-3.5 py-2.5 outline-none"
              />
            </div>
          </div>

          {/* MCQ Questions Builder */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Questions List ({questions.length})
              </span>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-yellow-400/15 hover:bg-yellow-400 text-yellow-400 hover:text-slate-950 text-xs font-bold transition-all border border-yellow-400/30"
              >
                <Plus className="w-3.5 h-3.5" /> Add Question
              </button>
            </div>

            {questions.map((q, qIdx) => (
              <div
                key={q.id || qIdx}
                className="p-5 rounded-2xl bg-[#121316] border border-slate-800 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-yellow-400">
                    Question #{qIdx + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Question Text */}
                <input
                  type="text"
                  placeholder="Enter the question prompt here..."
                  value={q.text}
                  onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-yellow-400 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 outline-none"
                  required
                />

                {/* 4 Options */}
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] text-slate-400">
                    Define options and click the radio circle on the right to mark the <strong className="text-yellow-400">Correct Answer</strong>:
                  </p>
                  {q.options.map((opt, optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const isCorrect = q.correctAnswer === opt && opt.trim() !== '';

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors ${
                          isCorrect
                            ? 'bg-yellow-400/10 border-yellow-400/50'
                            : 'bg-slate-800/60 border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                            isCorrect
                              ? 'bg-yellow-400 text-slate-950'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {letter}
                        </div>
                        <input
                          type="text"
                          placeholder={`Option ${letter} text`}
                          value={opt}
                          onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                          className="flex-1 bg-transparent border-none text-slate-100 text-xs outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => handleCorrectAnswerSelect(qIdx, opt)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1.5 shrink-0 ${
                            isCorrect
                              ? 'bg-yellow-400 text-slate-950 border-yellow-400'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          {isCorrect && <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />}
                          {isCorrect ? 'Correct Answer' : 'Set as Correct'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-bold shadow-lg shadow-yellow-500/20 transition-all"
            >
              {saving ? 'Publishing...' : 'Save & Publish Questionnaire'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
