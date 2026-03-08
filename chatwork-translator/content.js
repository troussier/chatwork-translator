console.log("Chatwork Translator Loaded");

function resolveTargetLang(targetLang) {
  if (targetLang !== "auto") return targetLang;
  const lang = (navigator.language || "ja").split("-")[0].toLowerCase();
  return ["ja", "vi", "en"].includes(lang) ? lang : "ja";
}

function inject() {

  CWDom.getMessages().forEach((ts) => {

    if (ts.dataset.injected) return;

    const messageNode = CWDom.getMessageNode(ts);
    if (!messageNode) return;

    const id = messageNode.dataset.mid;
    const utm = ts.dataset.utm || ts.dataset.tm;

    const btn = CWUI.translateButton();
    btn.onclick = async () => {
      btn.disabled = true;
      await doTranslate(messageNode, id, utm, false);
      btn.disabled = false;
    };

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

  const { apiKey, sourceLang = "auto", targetLang = "ja", firebaseDbUrl } =
    await chrome.storage.sync.get(["apiKey", "sourceLang", "targetLang", "firebaseDbUrl"]);

  const pre = CWDom.getPreNode(messageNode);
  if (!pre) return;

  const resolvedTarget = resolveTargetLang(targetLang);
  const key = CWCache.key(id, resolvedTarget);
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

  if (!apiKey) {
    const optionsUrl = chrome.runtime.getURL("options/options.html");
    insert(CWUI.error(
      `APIキーが未設定です。<a href="${optionsUrl}" target="_blank" style="color:#c0392b;">設定画面</a>から登録してください。`
    ));
    return;
  }

  const loading = CWUI.loading();
  insert(loading);

  try {
    const parts = CWDom.getTranslatableParts(pre);
    let translations;

    if (parts.length > 0) {
      const texts = parts.map(el => CWDom.extractSpanText(el));
      translations = await CWTranslator.translateParts(texts, apiKey, sourceLang, resolvedTarget);
    } else {
      const text = CWDom.extractText(messageNode);
      const translated = await CWTranslator.translate(text, apiKey, sourceLang, resolvedTarget);
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
  } catch (e) {
    loading.remove();
    insert(CWUI.error(
      `翻訳に失敗しました: ${e.message}`,
      () => doTranslate(messageNode, id, utm, forceRetranslate)
    ));
  }
}

new MutationObserver(inject).observe(document.body, {
  childList: true,
  subtree: true
});
