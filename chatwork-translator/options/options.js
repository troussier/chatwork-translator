const apiKeyInput = document.getElementById("apiKey");
const langSelect = document.getElementById("targetLang");
const status = document.getElementById("status");


// 保存
document.getElementById("save").onclick = () => {

  chrome.storage.sync.set({
    apiKey: apiKeyInput.value,
    targetLang: langSelect.value
  }, () => {
    status.textContent = "Saved!";
    setTimeout(() => status.textContent = "", 1500);
  });
};


// 初期ロード
chrome.storage.sync.get(
  ["apiKey", "targetLang"],
  (data) => {
    if (data.apiKey) apiKeyInput.value = data.apiKey;
    if (data.targetLang) langSelect.value = data.targetLang;
  }
);