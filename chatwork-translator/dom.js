window.CWDom = {

  _extractNodeText(node) {
    const clone = node.cloneNode(true);

    const codeBlocks = [];
    clone.querySelectorAll("[data-cwopen='[code]']").forEach((el, i) => {
      const placeholder = `\u0000CODE${i}\u0000`;
      codeBlocks.push({ placeholder, text: el.innerText });
      el.replaceWith(document.createTextNode(placeholder));
    });

    clone.querySelectorAll("img[data-cwtag]").forEach(img => {
      if (img.alt) img.replaceWith(document.createTextNode(img.alt));
      else img.remove();
    });

    let text = clone.innerText.trim();
    text = text.replace(/\n?編集済み$/, "").trim();

    codeBlocks.forEach(({ placeholder, text: code }) => {
      text = text.replace(placeholder, `[code]${code}[/code]`);
    });

    return text;
  },

  extractText(messageNode) {
    const body = messageNode.querySelector("pre");
    if (!body) return "";

    const clone = body.cloneNode(true);
    clone.querySelectorAll("._replyMessage, .chatQuote, .chatInfo").forEach(e => e.remove());

    return this._extractNodeText(clone);
  },

  getMessages() {
    return document.querySelectorAll("._timeStamp");
  },

  getMessageNode(ts) {
    return ts.closest("._message");
  },

  getPreNode(messageNode) {
    return messageNode.querySelector("pre");
  },

  extractSpanText(el) {
    return this._extractNodeText(el);
  },

  // 翻訳対象要素を返す（直接子span＋引用内span）、ドキュメント順
  // data-cwtag付きのspanはリンク等の特殊ノードなので除外
  getTranslatableParts(pre) {
    return Array.from(pre.querySelectorAll(":scope > span:not([data-cwtag]), .chatQuote .quoteText span:not([data-cwtag])"));
  },

  // 翻訳表示用にpreをクローン。[rp]リプライUIを除去して返す
  clonePreForTranslation(pre) {
    const clone = pre.cloneNode(true);
    clone.querySelectorAll('[data-cwtag^="[rp"]').forEach(el => el.remove());
    return clone;
  }
};
