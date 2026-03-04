window.CWDom = {

  extractText(messageNode) {
    const body = messageNode.querySelector("pre.sc-doOioq");
    if (!body) return "";

    const clone = body.cloneNode(true);
    clone.querySelectorAll("._replyMessage").forEach(e => e.remove());

    return clone.innerText.trim();
  },

  getMessages() {
    return document.querySelectorAll("._timeStamp");
  },

  getMessageNode(ts) {
    return ts.closest("._message");
  }
};