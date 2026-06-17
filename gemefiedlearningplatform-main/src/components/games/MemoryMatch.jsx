import { useRewards } from "../../contexts/RewardsContext";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
const EMOJIS = ["\u{1F34E}", "\u{1F34C}", "\u{1F347}", "\u{1F349}", "\u{1F34A}", "\u{1F353}", "\u{1F352}", "\u{1F34D}"];
function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const MemoryMatch = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("memory-match", scoreVal, { title: "Memory Match", subject: "Science" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const { t } = useTranslation();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [completed, setCompleted] = useState(false);
  const deck = useMemo(() => {
    const base = EMOJIS.slice(0, 8);
    const pairs = base.flatMap((e, idx) => [
      { id: idx * 2, value: e, matched: false },
      { id: idx * 2 + 1, value: e, matched: false }
    ]);
    return shuffle(pairs);
  }, []);
  useEffect(() => {
    setCards(deck);
  }, [deck]);
  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      setCompleted(true);
    }
  }, [cards]);
  const handleFlip = (index) => {
    if (disabled || completed) return;
    if (flipped.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setDisabled(true);
      setMoves((m) => m + 1);
      const [i1, i2] = newFlipped;
      const c1 = cards[i1];
      const c2 = cards[i2];
      if (c1.value === c2.value) {
        setTimeout(() => {
          setCards((prev) => prev.map((c, i) => i === i1 || i === i2 ? { ...c, matched: true } : c));
          setFlipped([]);
          setDisabled(false);
        }, 400);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 800);
      }
    }
  };
  const restart = () => {
    setCards(shuffle(deck.map((c) => ({ ...c, matched: false }))));
    setFlipped([]);
    setMoves(0);
    setCompleted(false);
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-3xl mx-auto">{
    /* Header */
  }<div className="flex items-center justify-between mb-6"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"><ArrowLeft className="w-5 h-5 mr-2" />{t("backToGames")}</button><div className="flex items-center space-x-4 text-gray-700"><div className="flex items-center"><Sparkles className="w-5 h-5 text-yellow-500 mr-2" /><span>{t("moves") || "Moves"}: {moves}</span></div><div className="hidden sm:block text-sm">{t("player") || "Player"}: {currentUser}</div></div></div>{
    /* Board */
  }<div className="bg-white rounded-xl shadow-sm p-6">{completed ? <div className="text-center"><div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"><Sparkles className="w-8 h-8 text-green-600" /></div><h2 className="text-2xl font-bold text-gray-900 mb-2">{t("gameComplete")}</h2><p className="text-gray-600 mb-6">{t("greatJob") || "Great job! You matched all pairs."}</p>
            <div className="mt-4 flex flex-col items-center justify-center gap-2">
              <button
                onClick={handleSubmitScore}
                disabled={submitted}
                className={`px-6 py-2 rounded-lg font-semibold text-white transition-all ${
                  submitted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md hover:shadow-lg"
                }`}
              >
                {submitted ? "Score Submitted!" : "Submit Score"}
              </button>
              {submitted && (
                <p className="text-sm font-medium text-emerald-600 animate-fade-in">
                  ✓ Progress successfully saved to MySQL database!
                </p>
              )}
            </div><div className="space-x-3"><button onClick={restart} className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium">{t("playAgain")}</button><button onClick={onBack} className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium">{t("backToGames")}</button></div></div> : <div className="grid grid-cols-4 gap-3 sm:gap-4">{cards.map((card, index) => {
    const isFlipped = flipped.includes(index) || card.matched;
    return <button
      key={card.id}
      onClick={() => handleFlip(index)}
      disabled={disabled || card.matched}
      className={`aspect-square rounded-lg border-2 text-2xl sm:text-3xl flex items-center justify-center transition-all duration-200 
                      ${card.matched ? "border-green-500 bg-green-50 text-green-700" : isFlipped ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-gray-50 text-transparent hover:bg-blue-50 hover:border-blue-300"}`}
    >{card.value}</button>;
  })}</div>}</div></div></div>;
};
export default MemoryMatch;
