window.CWDom = {

  extractText(messageNode) {
    const body = messageNode.querySelector("pre.sc-doOioq");
    if (!body) return "";

    const clone = body.cloneNode(true);

    // 返信元・引用・ファイル添付は翻訳対象外
    clone.querySelectorAll("._replyMessage, .chatQuote, .chatInfo").forEach(e => e.remove());

    // [code] ブロックはプレースホルダに置換（翻訳させない）
    const codeBlocks = [];
    clone.querySelectorAll("[data-cwopen='[code]']").forEach((el, i) => {
      const placeholder = `\u0000CODE${i}\u0000`;
      codeBlocks.push({ placeholder, text: el.innerText });
      el.replaceWith(document.createTextNode(placeholder));
    });

    // 絵文字画像を alt テキストに置換（innerText では消えるため）
    clone.querySelectorAll("img[data-cwtag]").forEach(img => {
      if (img.alt) img.replaceWith(document.createTextNode(img.alt));
      else img.remove();
    });

    let text = clone.innerText.trim();

    // Chatwork が挿入する「編集済み」を末尾から除去
    text = text.replace(/\n?編集済み$/, "").trim();

    // [code] プレースホルダを元の内容に戻す
    codeBlocks.forEach(({ placeholder, text: code }) => {
      text = text.replace(placeholder, `[code]${code}[/code]`);
    });

    return text;
  },

  getMessages() {
    return document.querySelectorAll("._timeStamp");
  },

  getMessageNode(ts) {
    return ts.closest("._message");
  },

  getPreNode(messageNode) {
    return messageNode.querySelector("pre.sc-doOioq");
  }
};