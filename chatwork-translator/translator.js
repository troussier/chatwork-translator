window.CWTranslator = {

  _systemPrompt(lang) {
    return `You are a translator for workplace chat.
Translate the message into natural ${lang} used in casual workplace communication.

Rules:
- Avoid literal translation.
- Rewrite sentences so they sound natural in ${lang}.
- Remove Vietnamese pronouns like: anh, chị, em, mình.
- Do not translate names.
- Keep numbers, dates, URLs and technical terms unchanged.
- Prefer simple and natural expressions used between coworkers.
- Do not add explanations.
- Output only the translated sentence.`;
  },

  async _post(body) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${body.apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: body.messages
      })
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.error?.message || `API error ${res.status}`;
      throw new Error(msg);
    }
    return data.choices?.[0]?.message?.content?.trim();
  },

  async translate(text, apiKey, lang) {
    return this._post({
      apiKey,
      messages: [
        { role: "system", content: this._systemPrompt(lang) },
        { role: "user", content: text }
      ]
    });
  },

  // 複数テキストをJSON配列として一括翻訳し、翻訳後の配列を返す
  async translateParts(texts, apiKey, lang) {
    const systemPrompt = `You are a translator for workplace chat.
Translate each message part into natural ${lang} used in casual workplace communication.

Rules:
- Avoid literal translation.
- Rewrite sentences so they sound natural in ${lang}.
- Remove Vietnamese pronouns like: anh, chị, em, mình.
- Do not translate names.
- Keep numbers, dates, URLs and technical terms unchanged.
- Prefer simple and natural expressions used between coworkers.
- Do not add explanations.
- Input: a JSON array of strings.
- Output: a JSON array of translated strings in the same order.
- Output ONLY the JSON array, no other text.`;

    const content = await this._post({
      apiKey,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(texts) }
      ]
    });

    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length === texts.length) {
        return parsed;
      }
    } catch {}

    return texts.map(() => "");
  }
};
