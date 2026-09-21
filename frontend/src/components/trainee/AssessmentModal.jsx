import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  ChevronRight,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

export const AssessmentModal = ({ assessment, onClose, onCompleted }) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  if (!assessment) return null;

  const questions = assessment.questions || [];
  const currentQ = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  const handleSelectOption = (option) => {
    if (result) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  const handleSubmit = async () => {
    if (answeredCount < questions.length) {
      if (!window.confirm('You have not answered all questions. Submit anyway?')) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await api.submitAssessment(
        assessment._id,
        user?._id || 'demo-trainee',
        answers
      );

      if (res.success && res.result) {
        setResult(res.result);
        addToast(
          res.result.passed
            ? `🎉 Assessment passed! Score: ${res.result.score}%`
            : `Assessment submitted. Score: ${res.result.score}%`,
          res.result.passed ? 'success' : 'error'
        );
        if (onCompleted) onCompleted(res.result);
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit assessment.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#1c1d22] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-[#18191e]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400">
              Assessment In Progress
            </span>
            <h2 className="text-lg font-bold text-slate-100">{assessment.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{assessment.courseTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!result ? (
            /* Active Quiz Interface */
            <>
              {/* Progress and Question Counter */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-yellow-400">
                    Question {currentIdx + 1}
                  </span>
                  <span className="text-xs text-slate-400">of {questions.length}</span>
                </div>
                <div className="text-xs text-purple-300 font-medium">
                  Passing Score: {assessment.passingScore || 60}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-purple-500 transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              {currentQ && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-slate-100 leading-relaxed">
                    {currentQ.text}
                  </h3>

                  {/* Options List */}
                  <div className="space-y-2.5 pt-2">
                    {currentQ.options?.map((option, oIdx) => {
                      const isSelected = answers[currentQ.id] === option;
                      const letter = String.fromCharCode(65 + oIdx);

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleSelectOption(option)}
                          className={`w-full flex items-center gap-3.5 p-4 rounded-2xl text-left border transition-all duration-150 ${
                            isSelected
                              ? 'bg-yellow-400/10 border-yellow-400 text-yellow-200 shadow-md shadow-yellow-500/10'
                              : 'bg-[#121316] border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-yellow-400 text-slate-950'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {letter}
                          </div>
                          <span className="text-sm flex-1">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Results View */
            <div className="text-center py-4 space-y-6">
              <div
                className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xl ${
                  result.passed
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {result.passed ? (
                  <Award className="w-10 h-10" />
                ) : (
                  <AlertCircle className="w-10 h-10" />
                )}
              </div>

              <div>
                <span
                  className={`text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full border ${
                    result.passed
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {result.grade === 'Pass' ? 'Assessment Passed' : 'Needs Improvement'}
                </span>
                <h3 className="text-3xl font-extrabold text-white mt-3">
                  {result.score}%
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  You scored {result.correct} out of {result.total} questions correctly.
                  (Passing score required: {result.passingScore}%)
                </p>
              </div>

              {/* Detailed Breakdown */}
              <div className="text-left space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Question Breakdown
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {result.feedback?.map((fb, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs ${
                        fb.isCorrect
                          ? 'bg-emerald-500/5 border-emerald-500/20'
                          : 'bg-rose-500/5 border-rose-500/20'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {fb.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="font-semibold text-slate-200">{fb.questionText}</div>
                          <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
                            <span className="text-slate-400">
                              Your answer: <strong className={fb.isCorrect ? 'text-emerald-400' : 'text-rose-400'}>{fb.submitted || 'Not answered'}</strong>
                            </span>
                            {!fb.isCorrect && (
                              <span className="text-slate-400">
                                • Correct: <strong className="text-emerald-400">{fb.correctAnswer}</strong>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-slate-800 bg-[#18191e] flex items-center justify-between">
          {!result ? (
            <>
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-2">
                {!isLast ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
                  >
                    Next Question <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-bold shadow-lg shadow-yellow-500/20 transition-all"
                  >
                    {submitting ? 'Evaluating...' : 'Submit Answers'}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                  setCurrentIdx(0);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Retake Test
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-bold transition-all"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
