console.log("Chatwork Translator Loaded");

async function inject() {

  CWDom.getMessages().forEach((ts) => {

    if (ts.dataset.injected) return;

    const messageNode = CWDom.getMessageNode(ts);
    if (!messageNode) return;

    const id = messageNode.dataset.mid;
    const utm = ts.dataset.utm || ts.dataset.tm;

    const btn = document.createElement("button");
    btn.textContent = "🌐";

    btn.onclick = () => {

      chrome.storage.sync.get(
        ["apiKey", "targetLang"],
        async ({ apiKey, targetLang }) => {

          const key = CWCache.key(id, utm, targetLang);
          const cached = CWCache.get(key);

          if (cached) {
            messageNode.appendChild(CWUI.result(cached));
            return;
          }

          const loading = CWUI.loading();
          messageNode.appendChild(loading);

          const text = CWDom.extractText(messageNode);

          const translated =
            await CWTranslator.translate(text, apiKey, targetLang);

          loading.remove();

          CWCache.set(key, translated);
          messageNode.appendChild(CWUI.result(translated));
        }
      );
    };

    ts.appendChild(btn);
    ts.dataset.injected = "1";
  });
}

new MutationObserver(inject).observe(document.body, {
  childList: true,
  subtree: true
});