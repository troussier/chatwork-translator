window.CWCache = {
  key(id, utm, lang) {
    return `cw_translation_${id}_${utm}_${lang}`;
  },

  get(key) {
    return localStorage.getItem(key);
  },

  set(key, value) {
    localStorage.setItem(key, value);
  }
};