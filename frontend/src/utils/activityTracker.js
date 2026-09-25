const STORAGE_KEY = 'capacity_connect_mcq_attempts_v2';

export const getStoredAttempts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse attempts from localStorage', e);
    return [];
  }
};

export const recordMCQAttempt = (attempt) => {
  try {
    const current = getStoredAttempts();
    const newEntry = {
      id: attempt.id || `att-${Date.now()}`,
      title: attempt.title || 'MCQ Assessment',
      score: typeof attempt.score === 'number' ? Math.round(attempt.score) : 75,
      totalQuestions: attempt.total || attempt.totalQuestions || 5,
      passed: Boolean(attempt.passed),
      timestamp: Date.now(),
    };
    const updated = [...current, newEntry];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('capacity-connect-attempts-updated', { detail: updated }));
    return updated;
  } catch (e) {
    console.warn('Failed to record attempt to localStorage', e);
    return getStoredAttempts();
  }
};
