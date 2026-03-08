window.CWUI = {

  linkify(text) {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlPattern);
    const fragment = document.createDocumentFragment();
    parts.forEach((part, i) => {
      if (i % 2 === 1) {
        const a = document.createElement("a");
        a.href = part;
        a.textContent = part;
        a.target = "_blank";
        a.rel = "noreferrer";
        a.style.cssText = "color: #1a73e8; word-break: break-all;";
        fragment.appendChild(a);
      } else {
        fragment.appendChild(document.createTextNode(part));
      }
    });
    return fragment;
  },

  translateButton() {
    const btn = document.createElement("button");
    btn.textContent = "翻訳";
    btn.className = "cw-translate-btn";
    btn.style.cssText = `
      margin-left: 6px;
      padding: 1px 8px;
      font-size: 11px;
      color: #888;
      background: transparent;
      border: 1px solid #ccc;
      border-radius: 10px;
      cursor: pointer;
      vertical-align: middle;
      line-height: 1.6;
    `;
    btn.onmouseenter = () => { btn.style.background = "#f5f5f5"; btn.style.color = "#555"; };
    btn.onmouseleave = () => { btn.style.background = "transparent"; btn.style.color = "#888"; };
    return btn;
  },

  loading() {
    const wrap = document.createElement("div");
    wrap.className = "cw-translation-wrap";

    const hr = document.createElement("hr");
    hr.style.cssText = "border: none; border-top: 1px solid #e8e8e8; margin: 8px 0;";

    const el = document.createElement("div");
    el.textContent = "翻訳中...";
    el.className = "cw-translating";
    el.style.cssText = "font-size: 13px; color: #aaa;";

    wrap.appendChild(hr);
    wrap.appendChild(el);
    return wrap;
  },

  result(content, stale, onRetranslate) {
    const wrap = document.createElement("div");
    wrap.className = "cw-translation-wrap";

    const hr = document.createElement("hr");
    hr.style.cssText = `border: none; border-top: 1px solid ${stale ? "#f0c060" : "#e8e8e8"}; margin: 8px 0;`;

    const body = document.createElement("div");
    body.style.cssText = "display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;";

    const textEl = document.createElement("div");
    textEl.className = "cw-translation-result";
    textEl.style.cssText = "font-size: 13px; color: #333; line-height: 1.6; flex: 1; min-width: 0;";

    if (typeof content === "string") {
      textEl.style.whiteSpace = "pre-wrap";
      textEl.appendChild(this.linkify(content));
    } else {
      textEl.appendChild(content);
    }

    const actions = document.createElement("div");
    actions.style.cssText = "display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0;";

    if (stale) {
      const notice = document.createElement("span");
      notice.textContent = "原文が変更されました";
      notice.style.cssText = "font-size: 11px; color: #c8964a;";
      actions.appendChild(notice);
    }

    const retranslateBtn = document.createElement("button");
    retranslateBtn.textContent = "再翻訳";
    retranslateBtn.style.cssText = `
      padding: 1px 7px;
      font-size: 11px;
      color: #888;
      background: transparent;
      border: 1px solid #ddd;
      border-radius: 10px;
      cursor: pointer;
      line-height: 1.6;
    `;
    retranslateBtn.onmouseenter = () => { retranslateBtn.style.background = "#f5f5f5"; retranslateBtn.style.color = "#555"; };
    retranslateBtn.onmouseleave = () => { retranslateBtn.style.background = "transparent"; retranslateBtn.style.color = "#888"; };
    retranslateBtn.onclick = (e) => { e.stopPropagation(); onRetranslate(); };
    actions.appendChild(retranslateBtn);

    body.appendChild(textEl);
    body.appendChild(actions);
    wrap.appendChild(hr);
    wrap.appendChild(body);
    return wrap;
  }
};
