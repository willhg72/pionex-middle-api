/**
 * Local persistence utilities.
 * Wraps localStorage with JSON serialization and error handling.
 */

export const persistence = {
  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify({ ...data, _savedAt: Date.now() }));
    } catch (e) {
      console.warn('[persistence] save failed:', e);
    }
  },

  load(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('[persistence] load failed:', e);
      return null;
    }
  },

  remove(key) {
    try { localStorage.removeItem(key); } catch (e) { /* silent */ }
  },

  exportAll() {
    const result = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('capintel_')) {
          result[key] = JSON.parse(localStorage.getItem(key) || 'null');
        }
      }
    } catch (e) {
      console.warn('[persistence] export failed:', e);
    }
    return result;
  },

  importAll(data) {
    try {
      Object.entries(data).forEach(([key, val]) => {
        if (key.startsWith('capintel_')) {
          localStorage.setItem(key, JSON.stringify(val));
        }
      });
      return true;
    } catch (e) {
      console.warn('[persistence] import failed:', e);
      return false;
    }
  },
};
