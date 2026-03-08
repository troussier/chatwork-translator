window.CWCache = {
  key(id, lang) {
    return `cw_translation_${id}_${lang}`;
  },

  get(key) {
    const val = localStorage.getItem(key);
    if (!val) return null;
    try {
      const parsed = JSON.parse(val);
      // 旧フォーマット（translation: string）の移行
      if (parsed.translation && !parsed.translations) {
        parsed.translations = [parsed.translation];
      }
      return parsed;
    } catch {
      return null;
    }
  },

  set(key, translations, utm) {
    localStorage.setItem(key, JSON.stringify({ translations, utm }));
  },

  isStale(key, currentUtm) {
    const cached = this.get(key);
    if (!cached || !cached.utm) return false;
    return cached.utm !== currentUtm;
  }
};
