import React, { useState } from 'react';
import {
  X,
  Upload,
  FileText,
  Video,
  Presentation,
  Tag,
  Link2,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

export const LibraryUploaderModal = ({ courses, onClose, onUploaded }) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('slides');
  const [url, setUrl] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?._id || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['curriculum', 'reference']);
  const [fileSize, setFileSize] = useState('3.5 MB');
  const [duration, setDuration] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^#/, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim() || !courseId) {
      addToast('Please provide Title, Resource URL, and Target Course.', 'error');
      return;
    }

    const selectedCourse = courses.find((c) => c._id === courseId);

    setSaving(true);
    try {
      const res = await api.addLibraryResource({
        title,
        description,
        type,
        url,
        courseId,
        courseTitle: selectedCourse?.title || '',
        uploadedBy: user?._id || 'trainer-demo',
        uploaderName: user?.name || 'Priya Nair',
        tags,
        ...(type === 'video' && duration ? { duration } : {}),
        ...(type !== 'video' && fileSize ? { fileSize } : {}),
      });

      if (res.success) {
        addToast('Resource successfully uploaded to Content Library!', 'success');
        if (onUploaded) onUploaded(res.item);
        onClose();
      }
    } catch (err) {
      addToast(err.message || 'Failed to upload resource.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#1c1d22] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-[#18191e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Content Library Uploader</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Publish slide presentations, recorded video lectures, and PDF study guides
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Resource Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Resource Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'slides', label: 'Presentation Deck', icon: Presentation },
                { id: 'video', label: 'Video Lecture', icon: Video },
                { id: 'pdf', label: 'Study PDF / Guide', icon: FileText },
              ].map((fmt) => {
                const isSelected = type === fmt.id;
                const Icon = fmt.icon;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setType(fmt.id)}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-purple-500/15 border-purple-400 text-white shadow-lg shadow-purple-500/10'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-purple-300' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold">{fmt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title & Course */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Resource Title
              </label>
              <input
                type="text"
                placeholder="e.g. AWS Core Services Architecture Deck"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-purple-400 text-slate-100 text-sm rounded-2xl px-3.5 py-2.5 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Linked Course
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-purple-400 text-slate-100 text-sm rounded-2xl px-3.5 py-2.5 outline-none"
                required
              >
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Resource URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-purple-400" /> Resource URL (Google Drive / YouTube / Storage)
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 focus:border-purple-400 text-slate-100 text-sm rounded-2xl px-3.5 py-2.5 outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description & Learning Objectives
            </label>
            <textarea
              rows={2}
              placeholder="Provide a brief synopsis of what trainees will learn from this material..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 focus:border-purple-400 text-slate-100 text-sm rounded-2xl px-3.5 py-2.5 outline-none"
            />
          </div>

          {/* Tags & Subject tagging */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-purple-400" /> Subject Tags (Press Enter to add)
            </label>
            <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-800 border border-slate-700 rounded-2xl">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="e.g. cloud, devops..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="bg-transparent border-none text-xs text-slate-100 placeholder-slate-500 outline-none flex-1 min-w-[120px] px-2 py-1"
              />
            </div>
          </div>

          {/* Conditional Duration / File Size */}
          <div className="grid grid-cols-2 gap-4">
            {type === 'video' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Video Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g. 45m or 1h 20m"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-purple-400 text-slate-100 text-sm rounded-2xl px-3.5 py-2.5 outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  File Size Estimate
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3.2 MB"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-purple-400 text-slate-100 text-sm rounded-2xl px-3.5 py-2.5 outline-none"
                />
              </div>
            )}
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
              className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition-all"
            >
              {saving ? 'Uploading...' : 'Publish to Resource Library'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
