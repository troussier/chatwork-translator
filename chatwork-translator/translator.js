const CW_LANG_NAMES = { ja: "Japanese", vi: "Vietnamese", en: "English" };

window.CWTranslator = {

  _systemPrompt(sourceLang, targetLang) {
    const target = CW_LANG_NAMES[targetLang] || targetLang;
    const sourceClause = (sourceLang && sourceLang !== "auto")
      ? `Translate the message from ${CW_LANG_NAMES[sourceLang] || sourceLang} into natural ${target}`
      : `Detect the language and translate the message into natural ${target}`;

    return `You are a translator for workplace chat.
${sourceClause} used in casual workplace communication.

Rules:
- Avoid literal translation.
- Rewrite sentences so they sound natural in ${target}.
- Remove Vietnamese pronouns like: anh, chị, em, mình.
- Do not translate names.
- Keep numbers, dates, URLs and technical terms unchanged.
- Prefer simple and natural expressions used between coworkers.
- Do not add explanations.
- Output only the translated sentence.`;
  },

  async _post(apiKey, messages) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({ model: "gpt-4.1-mini", messages })
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.error?.message || `API error ${res.status}`;
      throw new Error(msg);
    }
    return data.choices?.[0]?.message?.content?.trim();
  },

  async translate(text, apiKey, sourceLang, targetLang) {
    return this._post(apiKey, [
      { role: "system", content: this._systemPrompt(sourceLang, targetLang) },
      { role: "user", content: text }
    ]);
  },

  async translateParts(texts, apiKey, sourceLang, targetLang) {
    const systemPrompt = this._systemPrompt(sourceLang, targetLang)
      .replace("- Output only the translated sentence.", `- Input: a JSON array of strings.
- Output: a JSON array of translated strings in the same order.
- Output ONLY the JSON array, no other text.`);

    const content = await this._post(apiKey, [
      { role: "system", content: systemPrompt },
      { role: "user", content: JSON.stringify(texts) }
    ]);

    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length === texts.length) {
        return parsed;
      }
    } catch {}

    return texts.map(() => "");
  }
};
