console.log("Chatwork Translator Loaded");

async function inject() {

  CWDom.getMessages().forEach((ts) => {

    if (ts.dataset.injected) return;

    const messageNode = CWDom.getMessageNode(ts);
    if (!messageNode) return;

    const id = messageNode.dataset.mid;
    const utm = ts.dataset.utm || ts.dataset.tm;

    const btn = CWUI.translateButton();
    btn.onclick = () => doTranslate(messageNode, id, utm, false);

    ts.appendChild(btn);
    ts.dataset.injected = "1";
  });
}

function buildTranslatedNode(pre, translations) {
  const clone = CWDom.clonePreForTranslation(pre);
  const parts = CWDom.getTranslatableParts(clone);

  parts.forEach((el, i) => {
    if (translations[i]) el.textContent = translations[i];
  });

  return clone;
}

async function doTranslate(messageNode, id, utm, forceRetranslate) {

  const existing = messageNode.querySelector(".cw-translation-wrap");
  if (existing && !forceRetranslate) {
    existing.remove();
    return;
  }
  if (existing) existing.remove();

  chrome.storage.sync.get(
    ["apiKey", "targetLang", "firebaseDbUrl"],
    async ({ apiKey, targetLang, firebaseDbUrl }) => {

      const pre = CWDom.getPreNode(messageNode);
      if (!pre) return;

      const key = CWCache.key(id, targetLang);
      const insert = (el) => pre.insertAdjacentElement("afterend", el);

      if (!forceRetranslate) {
        const cached = await CWCache.getWithFallback(key, firebaseDbUrl);
        if (cached) {
          const stale = CWCache.isStale(key, utm);
          insert(CWUI.result(
            buildTranslatedNode(pre, cached.translations),
            stale,
            () => doTranslate(messageNode, id, utm, true)
          ));
          return;
        }
      }

      const loading = CWUI.loading();
      insert(loading);

      const parts = CWDom.getTranslatableParts(pre);
      let translations;

      if (parts.length > 0) {
        const texts = parts.map(el => CWDom.extractSpanText(el));
        translations = await CWTranslator.translateParts(texts, apiKey, targetLang);
      } else {
        const text = CWDom.extractText(messageNode);
        const translated = await CWTranslator.translate(text, apiKey, targetLang);
        translations = [translated];
      }

      loading.remove();

      CWCache.set(key, translations, utm);
      CWCache.firebaseSet(key, translations, utm, firebaseDbUrl);

      insert(CWUI.result(
        buildTranslatedNode(pre, translations),
        false,
        () => doTranslate(messageNode, id, utm, true)
      ));
    }
  );
}

new MutationObserver(inject).observe(document.body, {
  childList: true,
  subtree: true
});
