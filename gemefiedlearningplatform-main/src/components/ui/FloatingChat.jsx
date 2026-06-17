import { useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { askOpenAI } from "../../lib/aiClient";
function answerFor(subject, question) {
  const q = question.toLowerCase();
  const s = (subject || "").toLowerCase();
  if (s.includes("math")) {
    if (q.includes("fraction") || q.includes("1/2") || q.includes("1/4")) {
      return "Tip: To add fractions with the same denominator, add numerators. For different denominators, find an LCM first.";
    }
    if (q.includes("ratio") || q.includes("proportion")) {
      return "Ratios compare two quantities. To scale a ratio, multiply or divide both parts by the same non-zero number.";
    }
    if (q.includes("area")) {
      return "Common areas: rectangle = l \xD7 w, triangle = (b \xD7 h)/2, square = a\xB2.";
    }
    if (q.includes("lcm")) {
      return "LCM tip: prime factorize each number and take the highest powers of all primes that appear.";
    }
    return "Math help: Tell me the topic (fractions, ratios, area, integers) and what part is confusing.";
  }
  if (s.includes("science") || s.includes("physics") || s.includes("chem") || s.includes("biology")) {
    if (q.includes("food chain")) {
      return "A food chain shows energy flow: producer \u2192 primary consumer \u2192 secondary consumer \u2192 tertiary consumer.";
    }
    if (q.includes("force") || q.includes("motion")) {
      return "Force changes motion. More net force means more acceleration (F = m \xD7 a). Opposing forces can balance to zero.";
    }
    if (q.includes("soluble") || q.includes("materials")) {
      return "Soluble substances dissolve in a solvent (like salt in water). Insoluble ones do not (like sand in water).";
    }
    return "Science help: Ask about food chains, body systems, forces, or materials and I will guide you.";
  }
  if (s.includes("civics") || s.includes("history") || s.includes("geography") || s.includes("social")) {
    if (q.includes("rights") || q.includes("duties")) {
      return "Civics: Fundamental rights protect freedoms; duties are responsibilities like respecting the Constitution and the environment.";
    }
    if (q.includes("timeline") || q.includes("chronolog")) {
      return "To build a timeline, arrange events by date from earliest to latest. Use BCE/CE or BC/AD consistently.";
    }
    if (q.includes("capital") || q.includes("state")) {
      return "Use map practice. Start with your region, then expand outward. Mnemonics help remember states and capitals!";
    }
    return "Social science help: Ask about civics (rights/duties), history timelines, or geography maps.";
  }
  if (s.includes("english") || s.includes("grammar") || s.includes("vocabulary")) {
    if (q.includes("synonym") || q.includes("antonym")) {
      return "Synonyms are words with similar meanings; antonyms have opposite meanings. Always check context to choose correctly.";
    }
    if (q.includes("grammar") || q.includes("tense") || q.includes("punct")) {
      return "Grammar tip: Keep subject-verb agreement and consistent tense. Add commas to separate items and clauses where needed.";
    }
    return "English help: Ask about grammar rules, synonyms/antonyms, spelling, or story building tips.";
  }
  if (q.includes("help") || q.includes("how")) {
    return "Tell me what part is tricky. I can give hints, steps, or an example problem.";
  }
  return "I'm here to help. Ask a question about the topic and I\u2019ll guide you step by step!";
}
const FloatingChat = ({ subject, userName }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const friendlySubject = subject ? subject : "your topic";
  const [msgs, setMsgs] = useState([
    { role: "assistant", text: `Hi! I can help with ${friendlySubject}. Ask a question or say "explain with example".`, ts: Date.now() }
  ]);
  const bottomRef = useRef(null);
  const [sending, setSending] = useState(false);
  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    const userMsg = { role: "user", text, ts: Date.now() };
    setMsgs((m) => [...m, userMsg, { role: "assistant", text: "Thinking\u2026", ts: Date.now() + 1 }]);
    setInput("");
    setSending(true);
    try {
      const isGreeting = /^(hi|hello|hey)\b/i.test(text);
      if (isGreeting) {
        const reply = `${userName ? userName + ", " : ""}hello! Great to see you. How can I help with ${friendlySubject}?`;
        setMsgs((m) => {
          const arr = [...m];
          const idx = arr.findIndex((mm, i) => i === arr.length - 1 && mm.role === "assistant" && mm.text.startsWith("Thinking"));
          if (idx >= 0) arr[idx] = { role: "assistant", text: reply, ts: Date.now() + 2 };
          else arr.push({ role: "assistant", text: reply, ts: Date.now() + 2 });
          return arr;
        });
        return;
      }
      const history = msgs.slice(-6).map((m) => ({ role: m.role, content: m.text }));
      const ai = await askOpenAI(subject, text, history);
      setMsgs((m) => {
        const arr = [...m];
        const idx = arr.findIndex((mm, i) => i === arr.length - 1 && mm.role === "assistant" && mm.text.startsWith("Thinking"));
        if (idx >= 0) arr[idx] = { role: "assistant", text: ai, ts: Date.now() + 2 };
        else arr.push({ role: "assistant", text: ai, ts: Date.now() + 2 });
        return arr;
      });
    } catch (e) {
      const fallback = answerFor(subject, text);
      setMsgs((m) => {
        const arr = [...m];
        const idx = arr.findIndex((mm, i) => i === arr.length - 1 && mm.role === "assistant" && mm.text.startsWith("Thinking"));
        const msg = fallback || "Sorry, I could not reach the AI right now. Please try again.";
        if (idx >= 0) arr[idx] = { role: "assistant", text: msg, ts: Date.now() + 2 };
        else arr.push({ role: "assistant", text: msg, ts: Date.now() + 2 });
        return arr;
      });
    } finally {
      setSending(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    }
  };
  return <div className="fixed bottom-4 right-4 z-50">{
    /* Toggle button */
  }{!open && <button
    onClick={() => setOpen(true)}
    className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg bg-blue-600 text-white hover:bg-blue-700"
    aria-label="Open help chat"
  ><MessageCircle className="w-5 h-5" /> Ask AI
        </button>}{open && <div className="w-80 sm:w-96 rounded-xl shadow-2xl bg-white border border-gray-200 overflow-hidden">{
    /* Header */
  }<div className="flex items-center justify-between px-3 py-2 bg-blue-600 text-white"><div className="text-sm font-semibold">Study Assistant {subject ? `\xB7 ${subject}` : ""}</div><button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-blue-500" aria-label="Close"><X className="w-4 h-4" /></button></div>{
    /* Messages */
  }<div className="max-h-72 overflow-y-auto px-3 py-2 space-y-2">{msgs.map((m, i) => <div key={i} className={`text-sm ${m.role === "user" ? "text-right" : "text-left"}`}><div className={`inline-block px-3 py-2 rounded-lg ${m.role === "user" ? "bg-blue-50 text-blue-800" : "bg-gray-100 text-gray-800"}`}>{m.text}</div></div>)}<div ref={bottomRef} /></div>{
    /* Input */
  }<div className="flex items-center gap-2 border-t px-3 py-2"><input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    }}
    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    placeholder={`Ask about ${friendlySubject} (Shift+Enter for newline)`}
  /><button
    onClick={send}
    disabled={sending}
    className={`p-2 rounded-lg text-white ${sending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
    aria-label="Send"
  ><Send className="w-4 h-4" /></button></div></div>}</div>;
};
export default FloatingChat;
