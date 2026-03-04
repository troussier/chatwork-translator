window.CWCache = {
  key(id, lang) {
    return `cw_translation_${id}_${lang}`;
  },

  get(key) {
    const val = localStorage.getItem(key);
    if (!val) return null;
    try {
      return JSON.parse(val);
    } catch {
      return null;
    }
  },

  set(key, translation, utm) {
    localStorage.setItem(key, JSON.stringify({ translation, utm }));
  },

  isStale(key, currentUtm) {
    const cached = this.get(key);
    if (!cached || !cached.utm) return false;
    return cached.utm !== currentUtm;
  }
};