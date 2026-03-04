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

async function doTranslate(messageNode, id, utm, forceRetranslate) {

  const existing = messageNode.querySelector(".cw-translation-wrap");
  if (existing && !forceRetranslate) {
    existing.remove();
    return;
  }
  if (existing) existing.remove();

  chrome.storage.sync.get(
    ["apiKey", "targetLang"],
    async ({ apiKey, targetLang }) => {

      const pre = CWDom.getPreNode(messageNode);
      if (!pre) return;

      const key = CWCache.key(id, targetLang);
      const cached = CWCache.get(key);

      const insert = (el) => pre.insertAdjacentElement("afterend", el);

      if (cached && !forceRetranslate) {
        const stale = CWCache.isStale(key, utm);
        insert(CWUI.result(
          cached.translation,
          stale,
          () => doTranslate(messageNode, id, utm, true)
        ));
        return;
      }

      const loading = CWUI.loading();
      insert(loading);

      const text = CWDom.extractText(messageNode);
      const translated =
        await CWTranslator.translate(text, apiKey, targetLang);

      loading.remove();

      CWCache.set(key, translated, utm);
      insert(CWUI.result(
        translated,
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
