window.CWCache = {
  key(id, lang) {
    return `cw_translation_${id}_${lang}`;
  },

  get(key) {
    const val = localStorage.getItem(key);
    if (!val) return null;
    try {
      const parsed = JSON.parse(val);
      // 旧フォーマット移行
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
  },

  // Firebase Realtime Database REST API
  async firebaseGet(key, dbUrl) {
    if (!dbUrl) return null;
    try {
      const res = await fetch(`${dbUrl}/translations/${key}.json`);
      if (!res.ok) return null;
      const data = await res.json();
      return data; // { translations, utm } or null
    } catch {
      return null;
    }
  },

  firebaseSet(key, translations, utm, dbUrl) {
    if (!dbUrl) return;
    fetch(`${dbUrl}/translations/${key}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ translations, utm })
    }).catch(() => {});
  },

  // localStorageを優先、なければFirebaseを参照してローカルにも保存
  async getWithFallback(key, dbUrl) {
    const local = this.get(key);
    if (local) return local;

    const remote = await this.firebaseGet(key, dbUrl);
    if (remote) {
      this.set(key, remote.translations, remote.utm);
    }
    return remote;
  }
};
