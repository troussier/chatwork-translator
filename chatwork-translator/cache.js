const CW_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30日

window.CWCache = {
  key(id, lang) {
    return `cw_translation_${id}_${lang}`;
  },

  _isExpired(entry) {
    return entry.createdAt && Date.now() - entry.createdAt > CW_CACHE_TTL_MS;
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
      // TTLチェック
      if (this._isExpired(parsed)) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  },

  set(key, translations, utm) {
    localStorage.setItem(key, JSON.stringify({ translations, utm, createdAt: Date.now() }));
  },

  isStale(key, currentUtm) {
    const cached = this.get(key);
    if (!cached || !cached.utm) return false;
    return cached.utm !== currentUtm;
  },

  async firebaseGet(key, dbUrl) {
    if (!dbUrl) return null;
    try {
      const res = await fetch(`${dbUrl}/translations/${key}.json`);
      if (!res.ok) return null;
      const data = await res.json();
      return data;
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

  async getWithFallback(key, dbUrl) {
    const local = this.get(key);
    if (local) return local;

    // FirebaseはTTLなし（永続保持）
    const remote = await this.firebaseGet(key, dbUrl);
    if (remote) {
      this.set(key, remote.translations, remote.utm);
      return remote;
    }
    return null;
  }
};
