const apiKeyInput = document.getElementById("apiKey");
const langSelect = document.getElementById("targetLang");
const firebaseDbUrlInput = document.getElementById("firebaseDbUrl");
const status = document.getElementById("status");

document.getElementById("save").onclick = () => {
  chrome.storage.sync.set({
    apiKey: apiKeyInput.value,
    targetLang: langSelect.value,
    firebaseDbUrl: firebaseDbUrlInput.value.trim()
  }, () => {
    status.textContent = "Saved!";
    setTimeout(() => status.textContent = "", 1500);
  });
};

chrome.storage.sync.get(
  ["apiKey", "targetLang", "firebaseDbUrl"],
  (data) => {
    if (data.apiKey) apiKeyInput.value = data.apiKey;
    if (data.targetLang) langSelect.value = data.targetLang;
    if (data.firebaseDbUrl) firebaseDbUrlInput.value = data.firebaseDbUrl;
  }
);
