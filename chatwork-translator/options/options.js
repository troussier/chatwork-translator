const apiKeyInput = document.getElementById("apiKey");
const sourceLangSelect = document.getElementById("sourceLang");
const targetLangSelect = document.getElementById("targetLang");
const firebaseDbUrlInput = document.getElementById("firebaseDbUrl");
const firebaseNotice = document.getElementById("firebaseNotice");
const status = document.getElementById("status");

function updateFirebaseNotice() {
  firebaseNotice.style.display = firebaseDbUrlInput.value.trim() ? "none" : "block";
}

firebaseDbUrlInput.addEventListener("input", updateFirebaseNotice);

document.getElementById("save").onclick = () => {
  chrome.storage.sync.set({
    apiKey: apiKeyInput.value,
    sourceLang: sourceLangSelect.value,
    targetLang: targetLangSelect.value,
    firebaseDbUrl: firebaseDbUrlInput.value.trim()
  }, () => {
    status.textContent = "Saved!";
    updateFirebaseNotice();
    setTimeout(() => status.textContent = "", 1500);
  });
};

chrome.storage.sync.get(
  ["apiKey", "sourceLang", "targetLang", "firebaseDbUrl"],
  (data) => {
    if (data.apiKey) apiKeyInput.value = data.apiKey;
    if (data.sourceLang) sourceLangSelect.value = data.sourceLang;
    if (data.targetLang) targetLangSelect.value = data.targetLang;
    if (data.firebaseDbUrl) firebaseDbUrlInput.value = data.firebaseDbUrl;
    updateFirebaseNotice();
  }
);
