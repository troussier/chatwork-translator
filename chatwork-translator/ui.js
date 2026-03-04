window.CWUI = {

  loading() {
    const el = document.createElement("div");
    el.textContent = "🌐 Translating...";
    el.className = "cw-translating";
    el.style.fontSize = "12px";
    el.style.color = "#888";
    el.style.marginTop = "6px";
    return el;
  },

  result(text) {
    const el = document.createElement("div");
    el.className = "cw-translation-result";
    el.textContent = text;

    el.style.marginTop = "6px";
    el.style.padding = "8px";
    el.style.background = "#f6f8fa";
    el.style.borderRadius = "6px";
    el.style.borderLeft = "3px solid #4CAF50";
    el.style.whiteSpace = "pre-wrap";

    return el;
  }
};