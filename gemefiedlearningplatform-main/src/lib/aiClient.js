function generateFallbackAnswer(subject, question) {
  const subj = subject ? subject.trim() : "General";
  const q = question.trim();
  const lower = q.toLowerCase();
  if (lower.startsWith("what is") || lower.startsWith("who is") || lower.startsWith("define")) {
    return [
      `Subject: ${subj}.`,
      `Here is a brief definition based on your question:`,
      `- ${q.replace(/^[Ww]hat is\s+|^[Ww]ho is\s+|^[Dd]efine\s+/, "")}: A term/topic that you can understand by identifying its key features, purpose, and a simple example.`,
      `Example: If you ask "What is friction?", you could say: "Friction is a force that opposes motion when two surfaces rub. Example: A box slowing down on the floor."`
    ].join(" ");
  }
  if (lower.includes("calculate") || /\b\d+\b/.test(lower) && (lower.includes("+") || lower.includes("-") || lower.includes("x") || lower.includes("\xF7") || lower.includes("multiply") || lower.includes("add") || lower.includes("subtract") || lower.includes("divide"))) {
    return [
      `Subject: ${subj}.`,
      `To calculate:`,
      `1) Identify the numbers and the operation.`,
      `2) Apply the operation step by step.`,
      `3) Check units (if any) and reasonableness.`,
      `Example: 12 + 7 = 19 (add the ones: 2+7=9; tens: 1+0=1 \u2192 19).`
    ].join(" ");
  }
  if (lower.startsWith("how to") || lower.startsWith("how do i") || lower.includes("steps")) {
    return [
      `Subject: ${subj}.`,
      `Here is a simple step-by-step approach:`,
      `1) Understand the goal in the question.`,
      `2) List the key facts or formulas you need.`,
      `3) Do the steps in order, checking each step.`,
      `Example: How to find area of a rectangle? Multiply length \xD7 width (e.g., 5 cm \xD7 3 cm = 15 cm\xB2).`
    ].join(" ");
  }
  return [
    `Subject: ${subj}.`,
    `Here is a brief, clear answer strategy:`,
    `- Identify what the question is asking.`,
    `- Recall a key definition or formula related to it.`,
    `- Apply it with a short example.`,
    `Example: If the question is about "speed", use speed = distance \xF7 time. If distance=100 m and time=20 s, speed=5 m/s.`
  ].join(" ");
}
export async function askOpenAI(subject, question, history) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("VITE_OPENAI_API_KEY not found. Using fallback answer.");
    return generateFallbackAnswer(subject, question);
  }
  const sys = [
    "You are a friendly Grade 6/7 study assistant. Answer clearly and briefly.",
    subject ? `Subject: ${subject}.` : "Subject: General.",
    "Use simple language. When useful, show 1 short example. Avoid unsafe content."
  ].join(" ");
  const historyMessages = (history || []).slice(-6).map((h) => ({ role: h.role, content: h.content }));
  const body = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: sys },
      ...historyMessages,
      { role: "user", content: question }
    ],
    temperature: 0.2,
    max_tokens: 200
  };
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`OpenAI error: ${res.status} ${text}`);
      return generateFallbackAnswer(subject, question);
    }
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content?.trim();
    return content || generateFallbackAnswer(subject, question);
  } catch (err) {
    console.error("OpenAI request failed, using fallback:", err);
    return generateFallbackAnswer(subject, question);
  }
}
