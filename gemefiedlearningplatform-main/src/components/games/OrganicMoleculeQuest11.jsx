import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
const bank = [
  // Functional group identification
  { type: "functionalGroup", prompt: "Identify the functional group in: Ethanol", choices: ["Alkene", "Aldehyde", "Alcohol", "Ketone"], answer: "Alcohol", hint: "Ends with -ol" },
  { type: "functionalGroup", prompt: "Identify the functional group in: Propanone", choices: ["Carboxylic acid", "Ester", "Ketone", "Alcohol"], answer: "Ketone", hint: "Propan-one" },
  { type: "functionalGroup", prompt: "Identify the functional group in: Ethanoic acid", choices: ["Carboxylic acid", "Aldehyde", "Amine", "Alkene"], answer: "Carboxylic acid", hint: "Ends with -oic acid" },
  { type: "functionalGroup", prompt: "Identify the functional group in: Butanal", choices: ["Aldehyde", "Alcohol", "Alkyne", "Ketone"], answer: "Aldehyde", hint: "Ends with -al" },
  { type: "functionalGroup", prompt: "Identify the functional group in: Ethyl ethanoate", choices: ["Ester", "Amide", "Alcohol", "Alkene"], answer: "Ester", hint: "\u2026yl \u2026oate" },
  // Isomer type
  { type: "isomerType", prompt: "Pentane vs. 2-methylbutane are what kind of isomers?", choices: ["Position isomers", "Functional isomers", "Chain isomers", "Geometric isomers"], answer: "Chain isomers", hint: "Same molecular formula, different carbon skeleton" },
  { type: "isomerType", prompt: "Propanol vs. Methoxyethane are what kind of isomers?", choices: ["Functional isomers", "Chain isomers", "Position isomers", "Optical isomers"], answer: "Functional isomers", hint: "Alcohol vs ether" },
  { type: "isomerType", prompt: "1-propanol vs. 2-propanol are what kind of isomers?", choices: ["Chain isomers", "Position isomers", "Functional isomers", "Cis-trans isomers"], answer: "Position isomers", hint: "Same functional group, different position" },
  // Homologous series
  { type: "homologousSeries", prompt: "Which is the next member after Propanoic acid in its homologous series?", choices: ["Ethanoic acid", "Butanoic acid", "Pentanoic acid", "Methanoic acid"], answer: "Butanoic acid", hint: "+CH2 per step" },
  { type: "homologousSeries", prompt: "Next member after Propene in the alkene series?", choices: ["Butene", "Ethyne", "Propane", "Butane"], answer: "Butene", hint: "+CH2, same functional group" }
];
function pickIdx(exclude) {
  const candidates = bank.map((_, i) => i).filter((i) => !exclude.has(i));
  return candidates[Math.floor(Math.random() * candidates.length)] ?? 0;
}
const OrganicMoleculeQuest11 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("organic-molecule-quest11", scoreVal, { title: "Organic Molecule Quest11", subject: "Chemistry" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [used, setUsed] = useState(/* @__PURE__ */ new Set());
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selected, setSelected] = useState(null);
  const q = bank[idx];
  const submit = () => {
    if (!selected) {
      setFeedback("Pick an option.");
      return;
    }
    if (selected === q.answer) {
      setScore((s) => s + 10);
      setFeedback("Correct!");
      const nextUsed = new Set(used).add(idx);
      setUsed(nextUsed);
      if (nextUsed.size === bank.length) {
        setFeedback("Quest complete! \u{1F389}");
      } else {
        setIdx(pickIdx(nextUsed));
      }
      setSelected(null);
    } else {
      setFeedback(`Try again. Hint: ${q.hint}`);
    }
  };
  const reset = () => {
    setUsed(/* @__PURE__ */ new Set());
    setIdx(0);
    setScore(0);
    setSelected(null);
    setFeedback(null);
  };
  return <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-lime-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Organic Molecule Quest (Grade 11)</h1><p className="text-gray-600 text-sm">Identify functional groups, isomer types, and homologous series.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-4 text-sm text-gray-700">Score: <span className="font-semibold">{score}</span> • Player: {currentUser ?? "You"}</div><div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="font-semibold mb-3">{q.prompt}</div><div className="grid grid-cols-1 md:grid-cols-2 gap-2">{q.choices.map((choice) => <label key={choice} className={`flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-gray-100 ${selected === choice ? "ring-2 ring-indigo-400" : ""}`}><input type="radio" name="omq" value={choice} checked={selected === choice} onChange={() => setSelected(choice)} /><span>{choice}</span></label>)}</div><button onClick={submit} className="mt-3 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Confirm</button>{feedback && <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div><div className="text-sm text-gray-600">Tips: Naming patterns often reveal functional groups: -ol (alcohol), -al (aldehyde), -one (ketone), -oic acid (carboxylic acid).</div></div>
      {((typeof score !== "undefined" ? score > 0 : (typeof moves !== "undefined" ? moves > 0 : true))) && (
        <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-xl shadow-lg border border-gray-200 max-w-xs animate-fade-in flex flex-col gap-2">
          <div className="text-sm font-semibold text-gray-800">
            Submit Score ({(typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100))} pts)
          </div>
          <button
            onClick={handleSubmitScore}
            disabled={submitted}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all ${
              submitted ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 active:scale-95"
            }`}
          >
            {submitted ? "Score Submitted!" : "Submit Score"}
          </button>
          {submitted && (
            <p className="text-xs text-emerald-600 font-medium">
              ✓ Progress successfully saved to MySQL database!
            </p>
          )}
        </div>
      )}
</div>;
};
export default OrganicMoleculeQuest11;
