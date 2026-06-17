import { useRewards } from "../../contexts/RewardsContext";
import { useMemo, useState } from "react";
import { ArrowLeft, Zap, Battery, Lightbulb, Minus } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
const DEFAULT_RESISTOR_VALUES = [5, 10, 20];
const DEFAULT_BULB_RESISTANCE = 10;
const DEFAULT_BATTERY_STEPS = [1.5, 3, 4.5];
const emptyPiece = { type: "empty", value: 0 };
const Slot = ({ index, piece, onDropPiece, onClear, onCycle }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    try {
      const parsed = JSON.parse(data);
      onDropPiece(index, parsed);
    } catch {
    }
  };
  const renderIcon = () => {
    switch (piece.type) {
      case "battery":
        return <Battery className="w-5 h-5 mr-2 text-orange-600" />;
      case "bulb":
        return <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />;
      case "resistor":
        return <Minus className="w-5 h-5 mr-2 text-rose-600" />;
      default:
        return null;
    }
  };
  const label = () => {
    switch (piece.type) {
      case "battery":
        return `${piece.value.toFixed(1)}V`;
      case "bulb":
        return `${piece.value}\u03A9`;
      case "resistor":
        return `${piece.value}\u03A9`;
      default:
        return "Empty";
    }
  };
  return <div
    className="aspect-square rounded-lg border-2 border-dashed bg-white flex flex-col items-center justify-center text-sm text-gray-700 select-none"
    onDragOver={handleDragOver}
    onDrop={handleDrop}
  >{piece.type === "empty" ? <span className="text-gray-400">Drop here</span> : <><div className="flex items-center mb-1">{renderIcon()}<span className="font-medium capitalize">{piece.type}</span></div><div className="text-gray-500 mb-2">{label()}</div><div className="flex gap-2"><button
    onClick={() => onCycle(index)}
    className="px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
    title="Change value"
  >
              Change
            </button><button
    onClick={() => onClear(index)}
    className="px-2 py-1 rounded bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
    title="Remove"
  >
              Clear
            </button></div></>}</div>;
};
const PaletteItem = ({ piece }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(piece));
    e.dataTransfer.effectAllowed = "copy";
  };
  const icon = piece.type === "battery" ? <Battery className="w-5 h-5 mr-2 text-orange-600" /> : piece.type === "bulb" ? <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" /> : <Minus className="w-5 h-5 mr-2 text-rose-600" />;
  const label = piece.type === "battery" ? `${piece.value.toFixed(1)}V` : `${piece.value}\u03A9`;
  return <div
    draggable
    onDragStart={handleDragStart}
    className="flex items-center justify-between px-3 py-2 rounded border bg-white hover:shadow cursor-move"
  ><div className="flex items-center"><span>{icon}</span><span className="capitalize">{piece.type}</span></div><span className="text-gray-500 text-sm">{label}</span></div>;
};
const CircuitBuilder = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("circuit-builder", scoreVal, { title: "Circuit Builder", subject: "Science" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const { t } = useTranslation();
  const [slots, setSlots] = useState(Array.from({ length: 6 }, () => emptyPiece));
  const totals = useMemo(() => {
    const totalV = slots.reduce((v, p) => p.type === "battery" ? v + p.value : v, 0);
    const totalR = slots.reduce((r, p) => p.type === "resistor" || p.type === "bulb" ? r + p.value : r, 0);
    const hasBattery = slots.some((p) => p.type === "battery");
    const hasBulb = slots.some((p) => p.type === "bulb");
    const isComplete = hasBattery && hasBulb;
    const current = isComplete && totalR > 0 ? totalV / totalR : 0;
    const brightness = Math.min(1, current / 0.3);
    return { totalV, totalR, current, brightness, isComplete };
  }, [slots]);
  const placePiece = (index, piece) => {
    setSlots((prev) => prev.map((p, i) => i === index ? { ...piece } : p));
  };
  const clearPiece = (index) => {
    setSlots((prev) => prev.map((p, i) => i === index ? emptyPiece : p));
  };
  const cyclePieceValue = (index) => {
    setSlots(
      (prev) => prev.map((p, i) => {
        if (i !== index) return p;
        if (p.type === "battery") {
          const idx = DEFAULT_BATTERY_STEPS.indexOf(p.value);
          const next = DEFAULT_BATTERY_STEPS[(idx + 1) % DEFAULT_BATTERY_STEPS.length];
          return { ...p, value: next };
        }
        if (p.type === "resistor") {
          const idx = DEFAULT_RESISTOR_VALUES.indexOf(p.value);
          const next = DEFAULT_RESISTOR_VALUES[(idx + 1) % DEFAULT_RESISTOR_VALUES.length];
          return { ...p, value: next };
        }
        if (p.type === "bulb") {
          const choices = [8, 10, 15];
          const idx = choices.indexOf(p.value);
          const next = choices[(idx + 1) % choices.length];
          return { ...p, value: next };
        }
        return p;
      })
    );
  };
  const reset = () => setSlots(Array.from({ length: 6 }, () => emptyPiece));
  const palette = [
    { type: "battery", value: 1.5 },
    { type: "bulb", value: DEFAULT_BULB_RESISTANCE },
    { type: "resistor", value: 5 },
    { type: "resistor", value: 10 },
    { type: "resistor", value: 20 }
  ];
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-5xl mx-auto">{
    /* Header */
  }<div className="flex items-center justify-between mb-6"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800"><ArrowLeft className="w-5 h-5 mr-2" /> {t("backToGames")}</button><div className="flex items-center space-x-4 text-gray-700"><div className="hidden sm:block text-sm">{t("player") || "Player"}: {currentUser}</div></div></div>{
    /* Content */
  }<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{
    /* Palette */
  }<div className="bg-white rounded-xl shadow-sm p-4"><div className="flex items-center mb-3 text-gray-800 font-semibold"><Zap className="w-5 h-5 mr-2" /> Components</div><div className="space-y-2">{palette.map((p, i) => <PaletteItem key={i} piece={p} />)}</div><div className="mt-4 p-3 rounded bg-blue-50 text-blue-800 text-sm">
              Drag a component into a slot. Click Change to adjust values. Add at least one battery and one bulb to complete the circuit.
            </div></div>{
    /* Board */
  }<div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4"><div className="flex items-center mb-3 text-gray-800 font-semibold"><Zap className="w-5 h-5 mr-2" /> Series Board (6 slots)</div><div className="grid grid-cols-3 sm:grid-cols-6 gap-3">{slots.map((piece, idx) => <Slot
    key={idx}
    index={idx}
    piece={piece}
    onDropPiece={placePiece}
    onClear={clearPiece}
    onCycle={cyclePieceValue}
  />)}</div>{
    /* Readouts */
  }<div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-center"><div className="bg-orange-50 rounded-lg p-3"><div className="text-xs text-gray-600">Total Voltage</div><div className="text-xl font-bold text-orange-600">{totals.totalV.toFixed(1)} V</div></div><div className="bg-rose-50 rounded-lg p-3"><div className="text-xs text-gray-600">Total Resistance</div><div className="text-xl font-bold text-rose-600">{totals.totalR.toFixed(1)} Ω</div></div><div className="bg-emerald-50 rounded-lg p-3"><div className="text-xs text-gray-600">Current</div><div className="text-xl font-bold text-emerald-600">{totals.current.toFixed(2)} A</div></div><div className="bg-yellow-50 rounded-lg p-3"><div className="text-xs text-gray-600">Bulb Brightness</div><div className="text-xl font-bold text-yellow-600">{Math.round(totals.brightness * 100)}%</div></div></div>{!totals.isComplete && <div className="mt-3 p-3 rounded bg-yellow-50 text-yellow-800 text-sm">
                Add at least one battery and one bulb to complete the circuit.
              </div>}<div className="mt-4 flex gap-3"><button onClick={reset} className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 border">Reset Board</button></div></div></div></div>
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
export default CircuitBuilder;
