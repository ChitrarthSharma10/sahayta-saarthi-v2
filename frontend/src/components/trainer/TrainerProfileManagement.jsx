import React, { useState } from 'react';
import { Award, FileText, Plus, Save, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

const splitValues = (value) => value.split(',').map((item) => item.trim()).filter(Boolean);

export const TrainerProfileManagement = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [designation, setDesignation] = useState(user?.profile?.designation || '');
  const [department, setDepartment] = useState(user?.profile?.department || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [experience, setExperience] = useState(user?.profile?.experience || 0);
  const [skills, setSkills] = useState((user?.skills || []).join(', '));
  const [competencies, setCompetencies] = useState((user?.competencies || []).join(', '));
  const [qualifications, setQualifications] = useState(user?.qualifications || []);
  const [saving, setSaving] = useState(false);

  const updateQualification = (index, field, value) => {
    setQualifications((previous) => previous.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await api.updateTrainerProfile(user._id, {
        profile: { designation, department, bio, experience },
        skills: splitValues(skills),
        competencies: splitValues(competencies),
        qualifications,
      });
      if (response?.user) {
        updateUser(response.user);
        addToast('Trainer profile and qualifications saved.', 'success');
      }
    } catch (error) {
      addToast(error.message || 'Could not save trainer profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#19191F]">Profile Management</h2>
        <p className="mt-1 text-sm text-[#92929E]">Maintain your expertise and qualification evidence for competency mapping.</p>
      </div>
      <form onSubmit={handleSave} className="space-y-6">
        <section className="rounded-3xl border border-[#EEEEF4] bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-[#19191F]">Professional profile</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <input value={designation} onChange={(event) => setDesignation(event.target.value)} placeholder="Designation" className="rounded-xl border border-[#EEEEF4] bg-[#F6F7FB] px-3 py-2.5 text-xs outline-none focus:border-[#755BE8]" />
            <input value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="Department" className="rounded-xl border border-[#EEEEF4] bg-[#F6F7FB] px-3 py-2.5 text-xs outline-none focus:border-[#755BE8]" />
            <input type="number" min="0" value={experience} onChange={(event) => setExperience(event.target.value)} placeholder="Years of experience" className="rounded-xl border border-[#EEEEF4] bg-[#F6F7FB] px-3 py-2.5 text-xs outline-none focus:border-[#755BE8]" />
            <input value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="Skills, separated by commas" className="rounded-xl border border-[#EEEEF4] bg-[#F6F7FB] px-3 py-2.5 text-xs outline-none focus:border-[#755BE8]" />
          </div>
          <input value={competencies} onChange={(event) => setCompetencies(event.target.value)} placeholder="Competencies, separated by commas" className="mt-4 w-full rounded-xl border border-[#EEEEF4] bg-[#F6F7FB] px-3 py-2.5 text-xs outline-none focus:border-[#755BE8]" />
          <textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={4} placeholder="Describe your subject expertise and training experience" className="mt-4 w-full rounded-xl border border-[#EEEEF4] bg-[#F6F7FB] px-3 py-2.5 text-sm outline-none focus:border-[#755BE8]" />
        </section>

        <section className="rounded-3xl border border-[#EEEEF4] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div><h3 className="text-sm font-bold text-[#19191F]">Certificates and qualification documents</h3><p className="mt-1 text-xs text-[#92929E]">Add public Cloudinary, Drive, or other secure document links for admin verification.</p></div>
            <button type="button" onClick={() => setQualifications((previous) => [...previous, { title: '', issuer: '', type: 'Certificate', url: '' }])} className="inline-flex items-center gap-1 rounded-xl bg-[#EEE9FB] px-3 py-2 text-xs font-bold text-[#755BE8]"><Plus className="h-4 w-4" /> Add document</button>
          </div>
          <div className="mt-5 space-y-3">
            {qualifications.length === 0 && <p className="rounded-2xl bg-[#F6F7FB] p-5 text-center text-xs text-[#92929E]">No qualification documents added yet.</p>}
            {qualifications.map((item, index) => (
              <div key={`${item.title}-${index}`} className="grid grid-cols-1 gap-2 rounded-2xl border border-[#EEEEF4] p-4 md:grid-cols-[1fr_1fr_1fr_1.5fr_auto]">
                <input value={item.title} onChange={(event) => updateQualification(index, 'title', event.target.value)} placeholder="Certificate title" className="rounded-lg border border-[#EEEEF4] px-2.5 py-2 text-xs outline-none focus:border-[#755BE8]" />
                <input value={item.issuer} onChange={(event) => updateQualification(index, 'issuer', event.target.value)} placeholder="Issuer" className="rounded-lg border border-[#EEEEF4] px-2.5 py-2 text-xs outline-none focus:border-[#755BE8]" />
                <input value={item.type} onChange={(event) => updateQualification(index, 'type', event.target.value)} placeholder="Type" className="rounded-lg border border-[#EEEEF4] px-2.5 py-2 text-xs outline-none focus:border-[#755BE8]" />
                <input type="url" value={item.url} onChange={(event) => updateQualification(index, 'url', event.target.value)} placeholder="https://document-url" className="rounded-lg border border-[#EEEEF4] px-2.5 py-2 text-xs outline-none focus:border-[#755BE8]" />
                <button type="button" onClick={() => setQualifications((previous) => previous.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg p-2 text-[#92929E] hover:bg-rose-50 hover:text-rose-500" title="Remove document"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </section>
        <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#755BE8] px-5 py-3 text-xs font-bold text-white hover:bg-[#6448DE] disabled:opacity-50"><Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Profile'}</button>
      </form>
      <div className="flex items-center gap-2 text-xs text-[#92929E]"><Award className="h-4 w-4 text-[#755BE8]" /><FileText className="h-4 w-4 text-[#755BE8]" /> Approved profile data is used by the admin competency mapping engine.</div>
    </div>
  );
};
