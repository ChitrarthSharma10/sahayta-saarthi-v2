const getStorageKey = (userId) => {
  const safeId = (userId && typeof userId === 'string' && userId.trim()) ? userId.trim() : 'guest';
  return `capacity_connect_mcq_attempts_${safeId}`;
};

export const getStoredAttempts = (userId) => {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to parse attempts from localStorage', e);
    return [];
  }
};

export const recordMCQAttempt = (attempt, userId) => {
  try {
    const safeId = (userId && typeof userId === 'string' && userId.trim()) ? userId.trim() : 'guest';
    const current = getStoredAttempts(safeId);
    const newEntry = {
      id: attempt.id || `att-${Date.now()}`,
      title: attempt.title || 'MCQ Assessment',
      score: typeof attempt.score === 'number' ? Math.round(attempt.score) : 75,
      totalQuestions: attempt.total || attempt.totalQuestions || 5,
      passed: Boolean(attempt.passed),
      timestamp: Date.now(),
    };
    const updated = [...current, newEntry];
    localStorage.setItem(getStorageKey(safeId), JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent('capacity-connect-attempts-updated', {
        detail: { userId: safeId, attempts: updated },
      })
    );
    return updated;
  } catch (e) {
    console.warn('Failed to record attempt to localStorage', e);
    return getStoredAttempts(userId);
  }
};
