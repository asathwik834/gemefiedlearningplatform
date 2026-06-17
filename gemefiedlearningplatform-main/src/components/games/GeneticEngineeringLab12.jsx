import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
const genes = [
  {
    name: "GFP (Green Fluorescent Protein)",
    sequence: "ATGAAAGGTGAAGAACTGTTTACCG",
    enzyme: "EcoRI",
    plasmidSite: "AATT",
    hint: "EcoRI generates 5' AATT overhangs."
  },
  {
    name: "LacZ (\u03B2-galactosidase)",
    sequence: "ATGACCATGATTACGGATTCACTG",
    enzyme: "HindIII",
    plasmidSite: "AGCT",
    hint: "HindIII leaves 5' AGCT overhangs."
  },
  {
    name: "Insulin (preproinsulin)",
    sequence: "ATGGCCCTGTGGATGCGCTGCTCT",
    enzyme: "BamHI",
    plasmidSite: "GATC",
    hint: "BamHI leaves 5' GATC overhangs."
  }
];
const enzymeCuts = {
  EcoRI: "GAATTC",
  // G^AATTC
  HindIII: "AAGCTT",
  // A^AGCTT
  BamHI: "GGATCC"
  // G^GATCC
};
const overhangs = {
  EcoRI: "AATT",
  HindIII: "AGCT",
  BamHI: "GATC"
};
const GeneticEngineeringLab12 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("genetic-engineering-lab12", scoreVal, { title: "Genetic Engineering Lab12", subject: "Biology" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [chosenEnzyme, setChosenEnzyme] = useState(null);
  const [chosenInsertSite, setChosenInsertSite] = useState(null);
  const g = genes[i];
  const cutOK = chosenEnzyme && enzymeCuts[chosenEnzyme] && chosenEnzyme === g.enzyme;
  const ligateOK = chosenInsertSite === g.plasmidSite;
  const next = () => {
    setI((i + 1) % genes.length);
    setChosenEnzyme(null);
    setChosenInsertSite(null);
    setFeedback(null);
  };
  const reset = () => {
    setI(0);
    setScore(0);
    setChosenEnzyme(null);
    setChosenInsertSite(null);
    setFeedback(null);
  };
  const assemble = () => {
    if (!chosenEnzyme) {
      setFeedback("Pick a restriction enzyme.");
      return;
    }
    if (!chosenInsertSite) {
      setFeedback("Pick a plasmid sticky-end to ligate.");
      return;
    }
    if (cutOK && ligateOK) {
      setScore((s) => s + 20);
      setFeedback("Transformation successful! +20 pts");
      next();
    } else if (!cutOK) {
      setFeedback(`Wrong enzyme. Hint: ${g.hint}`);
    } else {
      setFeedback("Sticky-ends do not match. Choose the complementary overhang.");
    }
  };
  return <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Genetic Engineering Lab (Grade 12)</h1><p className="text-gray-600 text-sm">Cut with enzymes and ligate into plasmids to express new traits.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-4 text-sm text-gray-700">Player: <span className="font-semibold">{currentUser ?? "You"}</span> • Score: <span className="font-semibold">{score}</span></div><div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="font-semibold mb-1">Gene: {g.name}</div><div className="mb-2 text-xs text-gray-600">Sequence (simplified): {g.sequence}</div><div className="mb-3"><div className="font-medium mb-1">Choose restriction enzyme:</div><div className="flex flex-wrap gap-2">{["EcoRI", "HindIII", "BamHI"].map((e) => <button key={e} onClick={() => setChosenEnzyme(e)} className={`px-3 py-2 rounded border ${chosenEnzyme === e ? "bg-indigo-600 text-white" : "bg-white"}`}>{e}</button>)}</div></div><div className="mb-3"><div className="font-medium mb-1">Choose plasmid sticky-end to ligate:</div><div className="flex flex-wrap gap-2">{["AATT", "AGCT", "GATC"].map((s) => <button key={s} onClick={() => setChosenInsertSite(s)} className={`px-3 py-2 rounded border ${chosenInsertSite === s ? "bg-emerald-600 text-white" : "bg-white"}`}>{s}</button>)}</div></div><button onClick={assemble} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Assemble Plasmid</button>{feedback && <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div><div className="text-sm text-gray-600">Notes: EcoRI cuts GAATTC producing AATT 5' overhangs; HindIII cuts AAGCTT producing AGCT; BamHI cuts GGATCC producing GATC.</div></div>
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
export default GeneticEngineeringLab12;
