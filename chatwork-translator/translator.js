window.CWTranslator = {

  async translate(text, apiKey, lang) {

    const systemPrompt = `
You are a translator for workplace chat.

Translate the message into natural ${lang} used in casual workplace communication.

Rules:
- Avoid literal translation.
- Rewrite sentences so they sound natural in ${lang}.
- Remove Vietnamese pronouns like: anh, chị, em, mình.
- Do not translate names.
- Keep numbers, dates, URLs and technical terms unchanged.
- Prefer simple and natural expressions used between coworkers.
- Do not add explanations.
- Output only the translated sentence.
`;

    const res = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: text
            }
          ]
        })
      }
    );

    const data = await res.json();

    return data.choices?.[0]?.message?.content?.trim();
  }
};