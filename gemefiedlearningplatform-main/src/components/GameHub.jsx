import React, { useState, useEffect } from "react";
import { Play, Star, Clock, Users, Award, BookOpen, Target, Droplet, Shapes, Divide, Calculator, Zap, Sigma, Ruler, Percent, Minus, Lock, FlaskRound, Landmark, Triangle, Gauge, Beaker, ListOrdered } from "lucide-react";
import MathGame from "./games/MathGame";
import ScienceQuiz from "./games/ScienceQuiz";
import PhysicsSimulator from "./games/PhysicsSimulator";
import ChemMixer from "./games/ChemMixer";
import GeometryExplorer from "./games/GeometryExplorer";
import GradeSelector from "./GradeSelector";
import { useTranslation } from "../hooks/useTranslation";
import { useAdaptiveDifficultyContext } from "../contexts/AdaptiveDifficultyContext";
import DifficultyIndicator from "./ui/DifficultyIndicator";
import WaterSortPuzzle from "./games/WaterSortPuzzle";
import MemoryMatch from "./games/MemoryMatch";
import FractionsQuiz from "./games/FractionsQuiz";
import TimesTablesRush from "./games/TimesTablesRush";
import DecimalsPercentQuiz from "./games/DecimalsPercentQuiz";
import AreaPerimeterQuiz from "./games/AreaPerimeterQuiz";
import WordProblemSprint from "./games/WordProblemSprint";
import PrimeDetective from "./games/PrimeDetective";
import DivisionDash from "./games/DivisionDash";
import GeneralKnowledge6 from "./games/GeneralKnowledge6";
import CircuitBuilder from "./games/CircuitBuilder";
import AlgebraQuest7 from "./games/AlgebraQuest7";
import AngleExplorer7 from "./games/AngleExplorer7";
import ProportionLab7 from "./games/ProportionLab7";
import LinearGraphs7 from "./games/LinearGraphs7";
import IntegerOps7 from "./games/IntegerOps7";
import { useRewards } from "../contexts/RewardsContext";
import RewardsHUD from "./ui/RewardsHUD";
import FractionQuest6 from "./games/FractionQuest6";
import GeometryBuilder6 from "./games/GeometryBuilder6";
import SpeedMathRace6 from "./games/SpeedMathRace6";
import FloatingChat from "./ui/FloatingChat";
import DataStats7 from "./games/DataStats7";
import ProbabilitySpinner7 from "./games/ProbabilitySpinner7";
import ExponentsPowers8 from "./games/ExponentsPowers8";
import AlgebraAdventure8 from "./games/AlgebraAdventure8";
import GeometryBuilder8 from "./games/GeometryBuilder8";
import DataGraphExplorer8 from "./games/DataGraphExplorer8";
import PhysicsSim8 from "./games/PhysicsSim8";
import MoleculeBuilder8 from "./games/MoleculeBuilder8";
import BiologyQuest8 from "./games/BiologyQuest8";
import ExperimentLab8 from "./games/ExperimentLab8";
import HistoryTimeTravel8 from "./games/HistoryTimeTravel8";
import SetTheoryVenn from "./games/SetTheoryVenn";
import CoordinateRace from "./games/CoordinateRace";
import LawsOfMotionArena from "./games/LawsOfMotionArena";
import AlgebraMaster9 from "./games/AlgebraMaster9";
import GeometryTheorems9 from "./games/GeometryTheorems9";
import CoordinateGeometry9 from "./games/CoordinateGeometry9";
import StatisticsStarter9 from "./games/StatisticsStarter9";
import TrigonometryBasics9 from "./games/TrigonometryBasics9";
import PolynomialsLab9 from "./games/PolynomialsLab9";
import PhysicsKinematics9 from "./games/PhysicsKinematics9";
import ChemistryReactions9 from "./games/ChemistryReactions9";
import QuadraticEquations10 from "./games/QuadraticEquations10";
import TrigonometryApplications10 from "./games/TrigonometryApplications10";
import TrigTreasureHunt11 from "./games/TrigTreasureHunt11";
import QuadraticQuest11 from "./games/QuadraticQuest11";
import EquilibriumChallenge11 from "./games/EquilibriumChallenge11";
import EnergyPowerBattle11 from "./games/EnergyPowerBattle11";
import CoordinateGeoAdvanced11 from "./games/CoordinateGeoAdvanced11";
import OscillationRhythm11 from "./games/OscillationRhythm11";
import OrganicMoleculeQuest11 from "./games/OrganicMoleculeQuest11";
import ThermoLabEscape11 from "./games/ThermoLabEscape11";
import ArithmeticProgressions10 from "./games/ArithmeticProgressions10";
import ElectricityCircuits10 from "./games/ElectricityCircuits10";
import ProbabilityBasics10 from "./games/ProbabilityBasics10";
import RealNumbers10 from "./games/RealNumbers10";
import CoordinateGeometry10 from "./games/CoordinateGeometry10";
import LightOptics10 from "./games/LightOptics10";
import CalculusBridgeBuilder12 from "./games/CalculusBridgeBuilder12";
import RelativityTimeRace12 from "./games/RelativityTimeRace12";
import MolecularArchitectureVR12 from "./games/MolecularArchitectureVR12";
import GeneticEngineeringLab12 from "./games/GeneticEngineeringLab12";
import DifferentialEquationsRescue12 from "./games/DifferentialEquationsRescue12";
import EMFieldBuilder12 from "./games/EMFieldBuilder12";
import StatsInferenceLab12 from "./games/StatsInferenceLab12";
import ComplexNumbersCircuit12 from "./games/ComplexNumbersCircuit12";
import LinearAlgebraNetworkFlow12 from "./games/LinearAlgebraNetworkFlow12";
import OptimizationFactory12 from "./games/OptimizationFactory12";
import ProbabilityBayesLab12 from "./games/ProbabilityBayesLab12";
import NumericalMethodsRally12 from "./games/NumericalMethodsRally12";
const GameHub = ({ currentUser, initialGrade }) => {
  const { t } = useTranslation();
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(initialGrade ?? null);
  const { currentDifficulty, getRecommendedGrade, getSkillSuggestions } = useAdaptiveDifficultyContext();
  const rewards = useRewards();
  const recommendedGrade = getRecommendedGrade ? getRecommendedGrade() : { grade: 6, confidence: 0 };
  const skillSuggestions = getSkillSuggestions ? getSkillSuggestions() : [];
  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    console.log(`Selected grade: ${grade}`);
  };
  useEffect(() => {
    if (typeof initialGrade === "number" && initialGrade !== selectedGrade) {
      setSelectedGrade(initialGrade);
    }
  }, [initialGrade]);
  const handlePlayGame = (gameId) => {
    setSelectedGame(gameId);
  };
  const handleBackToHub = React.useCallback(() => {
    setSelectedGame(null);
  }, []);
  const games = [
    {
      id: "math-quest",
      title: t("mathQuest"),
      description: t("mathQuestDescription"),
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "15-20 min",
      points: 100,
      players: 1245,
      rating: 4.7,
      color: "bg-blue-100 text-blue-800",
      icon: <BookOpen className="w-6 h-6" />,
      grades: [6],
      topics: ["Algebra", "Geometry", "Arithmetic"]
    },
    {
      id: "science-quiz",
      title: t("scienceQuiz"),
      description: t("scienceQuizDescription"),
      subject: "Science",
      difficulty: "Medium",
      estimatedTime: "10-15 min",
      points: 80,
      players: 987,
      rating: 4.5,
      color: "bg-green-100 text-green-800",
      icon: <Award className="w-6 h-6" />,
      grades: [7, 8, 9, 10, 11],
      topics: ["Biology", "Chemistry", "Physics"]
    },
    {
      id: "physics-simulator",
      title: t("physicsSimulator"),
      description: t("physicsSimulatorDescription"),
      subject: "Physics",
      difficulty: "Hard",
      estimatedTime: "20-30 min",
      points: 150,
      players: 756,
      rating: 4.8,
      color: "bg-purple-100 text-purple-800",
      icon: <Target className="w-6 h-6" />,
      grades: [9, 10, 11],
      topics: ["Mechanics", "Electromagnetism", "Thermodynamics"]
    },
    {
      id: "chem-mixer",
      title: t("chemMixer"),
      description: t("chemMixerDescription"),
      subject: "Chemistry",
      difficulty: "Medium",
      estimatedTime: "15-25 min",
      points: 120,
      players: 543,
      rating: 4.6,
      color: "bg-yellow-100 text-yellow-800",
      icon: <Droplet className="w-6 h-6" />,
      grades: [8, 9, 10, 11],
      topics: ["Elements", "Compounds", "Reactions"]
    },
    {
      id: "geometry-explorer",
      title: t("geometryExplorer"),
      description: t("geometryExplorerDescription"),
      subject: "Mathematics",
      difficulty: "Easy",
      estimatedTime: "10-20 min",
      points: 90,
      players: 876,
      rating: 4.4,
      color: "bg-red-100 text-red-800",
      icon: <Shapes className="w-6 h-6" />,
      grades: [6, 7, 8, 9],
      topics: ["Shapes", "Angles", "Measurements"]
    },
    {
      id: "set-theory-venn",
      title: "Set Theory Puzzle",
      description: "Drag tokens into A, B, A\u2229B, or outside. Score points for correct placement.",
      subject: "Mathematics",
      difficulty: "Easy",
      estimatedTime: "6-10 min",
      points: 90,
      players: 100,
      rating: 4.6,
      color: "bg-indigo-100 text-indigo-800",
      icon: <Shapes className="w-6 h-6" />,
      grades: [6, 7, 8, 11],
      topics: ["Sets", "Venn Diagrams"]
    },
    {
      id: "water-sort",
      title: t("waterSortPuzzle"),
      description: t("waterSortPuzzleDescription"),
      subject: "Logic",
      difficulty: "Easy",
      estimatedTime: "5-15 min",
      points: 70,
      players: 1200,
      rating: 4.9,
      color: "bg-cyan-100 text-cyan-800",
      icon: <Droplet className="w-6 h-6" />,
      grades: [6, 7, 8, 9, 10, 11, 12],
      topics: ["Logic", "Patterns", "Problem Solving"]
    },
    {
      id: "memory-match",
      title: t("memoryMatch") || "Memory Match",
      description: t("memoryMatchDescription") || "Flip cards to find matching pairs and boost memory skills.",
      subject: "Logic",
      difficulty: "Easy",
      estimatedTime: "5-10 min",
      points: 60,
      players: 650,
      rating: 4.6,
      color: "bg-pink-100 text-pink-800",
      icon: <Star className="w-6 h-6" />,
      grades: [6, 7, 8, 9, 10, 11, 12],
      topics: ["Memory", "Focus", "Patterns"]
    },
    {
      id: "fractions-quiz",
      title: "Fractions & Basics",
      description: "Practice fractions, percentages, ratios and simple geometry.",
      subject: "Mathematics",
      difficulty: "Easy",
      estimatedTime: "8-12 min",
      points: 80,
      players: 420,
      rating: 4.7,
      color: "bg-emerald-100 text-emerald-800",
      icon: <Divide className="w-6 h-6" />,
      grades: [6],
      topics: ["Fractions", "Percentages", "Ratios"]
    },
    {
      id: "times-tables-rush",
      title: "Times Tables Rush",
      description: "Timed multiplication challenges to boost speed and accuracy.",
      subject: "Mathematics",
      difficulty: "Easy",
      estimatedTime: "3-5 min",
      points: 70,
      players: 560,
      rating: 4.8,
      color: "bg-orange-100 text-orange-800",
      icon: <Calculator className="w-6 h-6" />,
      grades: [6],
      topics: ["Multiplication", "Fluency"]
    },
    {
      id: "decimals-percent",
      title: "Decimals & Percent",
      description: "Practice converting between decimals and percentages and compare values.",
      subject: "Mathematics",
      difficulty: "Easy",
      estimatedTime: "6-10 min",
      points: 75,
      players: 310,
      rating: 4.6,
      color: "bg-teal-100 text-teal-800",
      icon: <Divide className="w-6 h-6" />,
      grades: [6],
      topics: ["Decimals", "Percentages"]
    },
    {
      id: "area-perimeter",
      title: "Area & Perimeter",
      description: "Find areas and perimeters of rectangles, squares, and basic shapes.",
      subject: "Mathematics",
      difficulty: "Easy",
      estimatedTime: "6-10 min",
      points: 75,
      players: 295,
      rating: 4.6,
      color: "bg-lime-100 text-lime-800",
      icon: <Shapes className="w-6 h-6" />,
      grades: [6],
      topics: ["Geometry", "Measurement"]
    },
    {
      id: "word-problem-sprint",
      title: "Word Problem Sprint",
      description: "Solve everyday math word problems quickly with hints.",
      subject: "Mathematics",
      difficulty: "Easy",
      estimatedTime: "6-10 min",
      points: 80,
      players: 330,
      rating: 4.7,
      color: "bg-violet-100 text-violet-800",
      icon: <BookOpen className="w-6 h-6" />,
      grades: [6],
      topics: ["Arithmetic", "Reasoning"]
    },
    {
      id: "prime-detective",
      title: "Prime Detective",
      description: "Spot primes, composite numbers, and prime factors.",
      subject: "Mathematics",
      difficulty: "Easy",
      estimatedTime: "6-10 min",
      points: 75,
      players: 260,
      rating: 4.6,
      color: "bg-rose-100 text-rose-800",
      icon: <Star className="w-6 h-6" />,
      grades: [6],
      topics: ["Prime Numbers", "Factors"]
    },
    {
      id: "division-dash",
      title: "Division Dash",
      description: "Quick-fire division practice with remainders.",
      subject: "Mathematics",
      difficulty: "Easy",
      estimatedTime: "5-8 min",
      points: 70,
      players: 245,
      rating: 4.6,
      color: "bg-sky-100 text-sky-800",
      icon: <Divide className="w-6 h-6" />,
      grades: [6],
      topics: ["Division", "Remainders"]
    },
    {
      id: "gk-6",
      title: "General Knowledge 6",
      description: "Non-repeating GK quiz: planets, festivals, capitals, science basics.",
      subject: "General Knowledge",
      difficulty: "Easy",
      estimatedTime: "6-10 min",
      points: 80,
      players: 410,
      rating: 4.7,
      color: "bg-indigo-100 text-indigo-800",
      icon: <Star className="w-6 h-6" />,
      grades: [6],
      topics: ["GK", "Science", "Geography"]
    },
    {
      id: "fraction-quest-6",
      title: "Fraction Quest",
      description: "Solve fraction puzzles to cross bridges in an adventure map.",
      subject: "Mathematics",
      difficulty: "Easy",
      estimatedTime: "6-10 min",
      points: 80,
      players: 260,
      rating: 4.6,
      color: "bg-emerald-100 text-emerald-800",
      icon: <Divide className="w-6 h-6" />,
      grades: [6],
      topics: ["Fractions"]
    },
    {
      id: "geometry-builder-6",
      title: "Geometry Builder",
      description: "Drag and drop shapes to build houses; answer angle/area questions to proceed.",
      subject: "Mathematics",
      difficulty: "Easy",
      estimatedTime: "8-12 min",
      points: 90,
      players: 240,
      rating: 4.7,
      color: "bg-lime-100 text-lime-800",
      icon: <Shapes className="w-6 h-6" />,
      grades: [6],
      topics: ["Geometry"]
    },
    {
      id: "speed-math-race-6",
      title: "Speed Math Race",
      description: "Quick arithmetic rounds to race a car\u2014addition, subtraction, multiplication, division.",
      subject: "Mathematics",
      difficulty: "Easy",
      estimatedTime: "3-6 min",
      points: 70,
      players: 300,
      rating: 4.6,
      color: "bg-red-100 text-red-800",
      icon: <Target className="w-6 h-6" />,
      grades: [6],
      topics: ["Arithmetic"]
    },
    {
      id: "circuit-builder",
      title: "Circuit Builder",
      description: "Drag batteries, bulbs, and resistors to complete a series circuit and see current/brightness.",
      subject: "Physics",
      difficulty: "Easy",
      estimatedTime: "8-15 min",
      points: 100,
      players: 180,
      rating: 4.8,
      color: "bg-yellow-100 text-yellow-800",
      icon: <Zap className="w-6 h-6" />,
      grades: [6],
      topics: ["Electricity", "Circuits"]
    },
    {
      id: "algebra-quest-7",
      title: "Algebra Quest 7",
      description: "Expressions, simple equations, and like terms.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
      points: 90,
      players: 210,
      rating: 4.6,
      color: "bg-purple-100 text-purple-800",
      icon: <Sigma className="w-6 h-6" />,
      grades: [7],
      topics: ["Algebra", "Expressions"]
    },
    {
      id: "angle-explorer-7",
      title: "Angle Explorer 7",
      description: "Angle types, triangle properties, complementary & supplementary.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
      points: 90,
      players: 190,
      rating: 4.5,
      color: "bg-emerald-100 text-emerald-800",
      icon: <Ruler className="w-6 h-6" />,
      grades: [7],
      topics: ["Geometry", "Angles"]
    },
    {
      id: "proportion-lab-7",
      title: "Proportion Lab 7",
      description: "Ratios, proportions, scale, and percentage applications.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
      points: 90,
      players: 175,
      rating: 4.6,
      color: "bg-teal-100 text-teal-800",
      icon: <Percent className="w-6 h-6" />,
      grades: [7],
      topics: ["Ratios", "Proportions", "Percentages"]
    },
    {
      id: "linear-graphs-7",
      title: "Linear Graphs 7",
      description: "Read coordinates, slopes, and intercepts. Basics of y = mx + b.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
      points: 90,
      players: 165,
      rating: 4.5,
      color: "bg-indigo-100 text-indigo-800",
      icon: <Target className="w-6 h-6" />,
      grades: [7],
      topics: ["Graphs", "Slope", "Intercept"]
    },
    {
      id: "integer-ops-7",
      title: "Integer Operations 7",
      description: "Practice operations with negative numbers.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "6-10 min",
      points: 90,
      players: 160,
      rating: 4.6,
      color: "bg-rose-100 text-rose-800",
      icon: <Minus className="w-6 h-6" />,
      grades: [7],
      topics: ["Integers", "Arithmetic"]
    },
    {
      id: "data-stats-7",
      title: "Data & Stats 7",
      description: "Mean, median, mode, range and reading simple graphs.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "6-10 min",
      points: 90,
      players: 150,
      rating: 4.5,
      color: "bg-cyan-100 text-cyan-800",
      icon: <Award className="w-6 h-6" />,
      grades: [7],
      topics: ["Data", "Statistics"]
    },
    {
      id: "probability-spinner-7",
      title: "Probability Spinner 7",
      description: "Spin a weighted spinner and compare theoretical vs empirical probability.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "6-10 min",
      points: 90,
      players: 145,
      rating: 4.6,
      color: "bg-yellow-100 text-yellow-800",
      icon: <Target className="w-6 h-6" />,
      grades: [7],
      topics: ["Probability"]
    },
    {
      id: "exponents-powers-8",
      title: "Exponents & Powers 8",
      description: "Practice exponent laws: product, quotient, power of a power, and zero exponent.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "6-10 min",
      points: 100,
      players: 120,
      rating: 4.7,
      color: "bg-purple-100 text-purple-800",
      icon: <Sigma className="w-6 h-6" />,
      grades: [8],
      topics: ["Exponents", "Powers"]
    },
    {
      id: "algebra-adventure-8",
      title: "Algebra Puzzle Adventure",
      description: "Solve equations to unlock doors and collect treasures.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
      points: 100,
      players: 110,
      rating: 4.7,
      color: "bg-indigo-100 text-indigo-800",
      icon: <Target className="w-6 h-6" />,
      grades: [8],
      topics: ["Linear Equations", "Simplification", "Word Problems"]
    },
    {
      id: "geometry-builder-8",
      title: "Geometry Builder 8",
      description: "Drag and draw shapes; answer angle, area, and perimeter questions.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
      points: 100,
      players: 105,
      rating: 4.6,
      color: "bg-lime-100 text-lime-800",
      icon: <Shapes className="w-6 h-6" />,
      grades: [8],
      topics: ["Geometry"]
    },
    {
      id: "data-graph-explorer-8",
      title: "Data & Graph Explorer 8",
      description: "Interpret bar charts, line graphs, and pie charts to progress.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "6-10 min",
      points: 90,
      players: 98,
      rating: 4.5,
      color: "bg-cyan-100 text-cyan-800",
      icon: <Award className="w-6 h-6" />,
      grades: [8],
      topics: ["Data", "Graphs"]
    },
    {
      id: "coordinate-race",
      title: "Coordinate Geometry Race",
      description: "Compute distance, slope, or midpoint to get speed boosts and win the race.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "6-10 min",
      points: 100,
      players: 90,
      rating: 4.6,
      color: "bg-indigo-100 text-indigo-800",
      icon: <Target className="w-6 h-6" />,
      grades: [8, 9, 11],
      topics: ["Distance", "Slope", "Midpoint"]
    },
    {
      id: "physics-sim-8",
      title: "Physics Simulation 8",
      description: "Simulate forces and motion; adjust mass, force, friction, and time.",
      subject: "Science",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
      points: 100,
      players: 97,
      rating: 4.7,
      color: "bg-yellow-100 text-yellow-800",
      icon: <Zap className="w-6 h-6" />,
      grades: [8],
      topics: ["Forces", "Motion"],
      minLevel: 2
    },
    {
      id: "laws-of-motion-arena",
      title: "Laws of Motion Arena",
      description: "Apply Newton\u2019s laws and friction to move a cart to the goal efficiently.",
      subject: "Physics",
      difficulty: "Medium",
      estimatedTime: "6-12 min",
      points: 110,
      players: 80,
      rating: 4.7,
      color: "bg-yellow-100 text-yellow-800",
      icon: <Gauge className="w-6 h-6" />,
      grades: [8, 9, 11],
      topics: ["Forces", "Friction"]
    },
    {
      id: "molecule-builder-8",
      title: "Molecule Builder 8",
      description: "Drag atoms to form valid molecules; check valency and bonding.",
      subject: "Science",
      difficulty: "Medium",
      estimatedTime: "6-10 min",
      points: 90,
      players: 95,
      rating: 4.6,
      color: "bg-rose-100 text-rose-800",
      icon: <Droplet className="w-6 h-6" />,
      grades: [8],
      topics: ["Chemistry"],
      minLevel: 2
    },
    {
      id: "biology-quest-8",
      title: "Biology Quest 8",
      description: "Explore organs and cell parts; answer quest questions to proceed.",
      subject: "Science",
      difficulty: "Medium",
      estimatedTime: "6-10 min",
      points: 90,
      players: 90,
      rating: 4.6,
      color: "bg-emerald-100 text-emerald-800",
      icon: <Award className="w-6 h-6" />,
      grades: [8],
      topics: ["Biology"],
      minLevel: 3
    },
    {
      id: "experiment-lab-8",
      title: "Experiment Lab 8",
      description: "Virtual experiments with safety; answer reaction questions.",
      subject: "Science",
      difficulty: "Medium",
      estimatedTime: "6-10 min",
      points: 90,
      players: 88,
      rating: 4.6,
      color: "bg-orange-100 text-orange-800",
      icon: <FlaskRound className="w-6 h-6" />,
      grades: [8],
      topics: ["Chemistry"],
      minLevel: 3
    },
    {
      id: "history-time-travel-8",
      title: "History Time Travel 8",
      description: "Travel across eras; answer history questions to unlock new times.",
      subject: "Social Science",
      difficulty: "Medium",
      estimatedTime: "6-10 min",
      points: 90,
      players: 85,
      rating: 4.6,
      color: "bg-indigo-100 text-indigo-800",
      icon: <Landmark className="w-6 h-6" />,
      grades: [8],
      topics: ["History"],
      minLevel: 3
    },
    // Grade 9 Unlocked
    {
      id: "algebra-master-9",
      title: "Algebra Master 9",
      description: "Quadratic basics (factorable), systems by elimination/substitution.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
      points: 100,
      players: 130,
      rating: 4.7,
      color: "bg-purple-100 text-purple-800",
      icon: <Sigma className="w-6 h-6" />,
      grades: [9],
      topics: ["Quadratics", "Systems"]
    },
    {
      id: "geometry-theorems-9",
      title: "Geometry Theorems 9",
      description: "Triangles, similarity, and Pythagoras applications.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
      points: 100,
      players: 120,
      rating: 4.6,
      color: "bg-emerald-100 text-emerald-800",
      icon: <Ruler className="w-6 h-6" />,
      grades: [9],
      topics: ["Triangles", "Similarity", "Pythagoras"]
    },
    {
      id: "coordinate-geometry-9",
      title: "Coordinate Geometry 9",
      description: "Distance, section formula, and slope interpretations.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "6-10 min",
      points: 90,
      players: 118,
      rating: 4.5,
      color: "bg-indigo-100 text-indigo-800",
      icon: <Target className="w-6 h-6" />,
      grades: [9],
      topics: ["Distance", "Slope", "Section"]
    },
    {
      id: "statistics-starter-9",
      title: "Statistics Starter 9",
      description: "Grouped data basics, mean/median, and charts.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "6-10 min",
      points: 90,
      players: 112,
      rating: 4.5,
      color: "bg-cyan-100 text-cyan-800",
      icon: <Award className="w-6 h-6" />,
      grades: [9],
      topics: ["Statistics"]
    },
    // Grade 9 Locked
    {
      id: "trigonometry-basics-9",
      title: "Trigonometry Basics 9",
      description: "sin/cos/tan on right triangles and identities.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "6-10 min",
      points: 100,
      players: 100,
      rating: 4.6,
      color: "bg-yellow-100 text-yellow-800",
      icon: <Triangle className="w-6 h-6" />,
      grades: [9],
      topics: ["Trigonometry"],
      minLevel: 2
    },
    {
      id: "polynomials-lab-9",
      title: "Polynomials Lab 9",
      description: "Identities, addition, and multiplication of polynomials.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "6-10 min",
      points: 100,
      players: 98,
      rating: 4.6,
      color: "bg-rose-100 text-rose-800",
      icon: <Shapes className="w-6 h-6" />,
      grades: [9],
      topics: ["Polynomials"],
      minLevel: 2
    },
    {
      id: "physics-kinematics-9",
      title: "Physics Kinematics 9",
      description: "Displacement, velocity, acceleration, and graphs.",
      subject: "Science",
      difficulty: "Medium",
      estimatedTime: "6-10 min",
      points: 100,
      players: 95,
      rating: 4.6,
      color: "bg-emerald-100 text-emerald-800",
      icon: <Gauge className="w-6 h-6" />,
      grades: [9],
      topics: ["Kinematics"],
      minLevel: 3
    },
    {
      id: "chemistry-reactions-9",
      title: "Chemistry Reactions 9",
      description: "Types of reactions and balancing equations.",
      subject: "Science",
      difficulty: "Medium",
      estimatedTime: "6-10 min",
      points: 100,
      players: 93,
      rating: 4.6,
      color: "bg-orange-100 text-orange-800",
      icon: <Beaker className="w-6 h-6" />,
      grades: [9],
      topics: ["Reactions", "Balancing"],
      minLevel: 3
    },
    // Grade 10
    {
      id: "quadratic-equations-10",
      title: "Quadratic Equations 10",
      description: "Discriminant, nature of roots, factorization, and sum/product relations.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-15 min",
      points: 120,
      players: 0,
      rating: 4.7,
      color: "bg-purple-100 text-purple-800",
      icon: <Sigma className="w-6 h-6" />,
      grades: [10],
      topics: ["Quadratic Equations", "Discriminant", "Roots"]
    },
    {
      id: "trigonometry-applications-10",
      title: "Trigonometry Applications 10",
      description: "Heights and distances, angles of elevation/depression, and identities.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-15 min",
      points: 120,
      players: 0,
      rating: 4.7,
      color: "bg-yellow-100 text-yellow-800",
      icon: <Triangle className="w-6 h-6" />,
      grades: [10],
      topics: ["Trigonometry", "Heights & Distances"]
    },
    {
      id: "arithmetic-progressions-10",
      title: "Arithmetic Progressions 10",
      description: "nth term, sum of n terms, and finding a, d, or n in real contexts.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
      points: 120,
      players: 0,
      rating: 4.7,
      color: "bg-emerald-100 text-emerald-800",
      icon: <ListOrdered className="w-6 h-6" />,
      grades: [10],
      topics: ["AP", "nth Term", "Sum of n Terms"]
    },
    {
      id: "electricity-circuits-10",
      title: "Electricity: Circuits 10",
      description: "Ohm's Law, equivalent resistance (series/parallel), power relations.",
      subject: "Physics",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
      points: 120,
      players: 0,
      rating: 4.7,
      color: "bg-yellow-100 text-yellow-800",
      icon: <Zap className="w-6 h-6" />,
      grades: [10],
      topics: ["Ohm's Law", "Series/Parallel", "Power"]
    },
    {
      id: "probability-basics-10",
      title: "Probability Basics 10",
      description: "Theoretical vs experimental probability, complementary events, simple outcomes.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "6-10 min",
      points: 120,
      players: 0,
      rating: 4.7,
      color: "bg-cyan-100 text-cyan-800",
      icon: <Gauge className="w-6 h-6" />,
      grades: [10],
      topics: ["Theoretical", "Experimental", "Complementary"]
    },
    // Grade 10 Locked (require higher level)
    {
      id: "real-numbers-10",
      title: "Real Numbers 10",
      description: "Euclid's lemma, FTA, HCF/LCM, irrationality basics.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
      points: 130,
      players: 0,
      rating: 4.7,
      color: "bg-purple-100 text-purple-800",
      icon: <Sigma className="w-6 h-6" />,
      grades: [10],
      topics: ["Euclid", "FTA", "HCF/LCM", "Irrationality"],
      minLevel: 4
    },
    // Grade 12
    {
      id: "calculus-bridge-builder-12",
      title: "Calculus Bridge Builder 12",
      description: "Build bridge segments by computing derivatives, integrals, and optimization values.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-15 min",
      points: 140,
      players: 0,
      rating: 4.8,
      color: "bg-blue-100 text-blue-800",
      icon: <Ruler className="w-6 h-6" />,
      grades: [12],
      topics: ["Derivatives", "Integrals", "Optimization"]
    },
    {
      id: "relativity-time-race-12",
      title: "Relativity Time Race 12",
      description: "Stabilize a near-light-speed ship by solving time dilation, length contraction, and E=mc\xB2.",
      subject: "Physics",
      difficulty: "Medium",
      estimatedTime: "8-15 min",
      points: 140,
      players: 0,
      rating: 4.8,
      color: "bg-indigo-100 text-indigo-800",
      icon: <Gauge className="w-6 h-6" />,
      grades: [12],
      topics: ["Relativity", "Time Dilation", "Length Contraction"]
    },
    {
      id: "molecular-architecture-vr-12",
      title: "Molecular Architecture VR 12",
      description: "Assemble complex organic molecules; correct bonds stabilize, mistakes collapse.",
      subject: "Chemistry",
      difficulty: "Medium",
      estimatedTime: "8-15 min",
      points: 140,
      players: 0,
      rating: 4.8,
      color: "bg-emerald-100 text-emerald-800",
      icon: <Beaker className="w-6 h-6" />,
      grades: [12],
      topics: ["Organic", "Polymers", "Aromatics"]
    },
    {
      id: "genetic-engineering-lab-12",
      title: "Genetic Engineering Lab 12",
      description: "Choose enzymes and ligate into plasmids to engineer new traits.",
      subject: "Biology",
      difficulty: "Medium",
      estimatedTime: "8-15 min",
      points: 140,
      players: 0,
      rating: 4.8,
      color: "bg-green-100 text-green-800",
      icon: <Award className="w-6 h-6" />,
      grades: [12],
      topics: ["Biotechnology", "Genetics"]
    },
    {
      id: "de-rescue-12",
      title: "Differential Equations Rescue 12",
      description: "Solve separable/linear ODEs and slope field prompts to guide a rescue drone.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-15 min",
      points: 140,
      players: 0,
      rating: 4.8,
      color: "bg-sky-100 text-sky-800",
      icon: <Ruler className="w-6 h-6" />,
      grades: [12],
      topics: ["ODEs", "Separable", "Integrating Factor"]
    },
    {
      id: "em-field-builder-12",
      title: "EM Field Builder 12",
      description: "Place charges to match target field magnitude at a point via superposition.",
      subject: "Physics",
      difficulty: "Medium",
      estimatedTime: "8-15 min",
      points: 140,
      players: 0,
      rating: 4.8,
      color: "bg-amber-100 text-amber-800",
      icon: <Zap className="w-6 h-6" />,
      grades: [12],
      topics: ["Coulomb", "Superposition", "Fields"]
    },
    {
      id: "stats-inference-lab-12",
      title: "Statistical Inference Lab 12",
      description: "Build confidence intervals and run hypothesis tests to manage experiments.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-15 min",
      points: 140,
      players: 0,
      rating: 4.8,
      color: "bg-teal-100 text-teal-800",
      icon: <Award className="w-6 h-6" />,
      grades: [12],
      topics: ["Confidence Intervals", "Hypothesis Tests"]
    },
    {
      id: "complex-numbers-circuit-12",
      title: "Complex Numbers Circuit 12",
      description: "Rotate/scale signals on the Argand plane with polar/rect conversions and De Moivre.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
      points: 140,
      players: 0,
      rating: 4.8,
      color: "bg-fuchsia-100 text-fuchsia-800",
      icon: <Gauge className="w-6 h-6" />,
      grades: [12],
      topics: ["Complex Numbers", "De Moivre"]
    },
    {
      id: "linear-algebra-network-flow-12",
      title: "Linear Algebra Network Flow 12",
      description: "Compose transforms (scale/rotate/shear) to repair the network using 2\xD72 matrices.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
      points: 140,
      players: 0,
      rating: 4.8,
      color: "bg-cyan-100 text-cyan-800",
      icon: <Ruler className="w-6 h-6" />,
      grades: [12],
      topics: ["Matrices", "Determinant"]
    },
    {
      id: "optimization-factory-12",
      title: "Optimization Factory 12",
      description: "Tune production via Lagrange multipliers and curve sketching under constraints.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
      points: 140,
      players: 0,
      rating: 4.8,
      color: "bg-rose-100 text-rose-800",
      icon: <Award className="w-6 h-6" />,
      grades: [12],
      topics: ["Optimization", "Lagrange Multipliers"]
    },
    {
      id: "probability-bayes-lab-12",
      title: "Probability Bayes Lab 12",
      description: "Update beliefs with Bayes and total probability; manage diagnostic/test scenarios.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
      points: 140,
      players: 0,
      rating: 4.8,
      color: "bg-yellow-100 text-yellow-800",
      icon: <Award className="w-6 h-6" />,
      grades: [12],
      topics: ["Bayes", "Conditional Probability"]
    },
    {
      id: "numerical-methods-rally-12",
      title: "Numerical Methods Rally 12",
      description: "Race using Newton-Raphson/bisection/Simpson\u2019s choices while avoiding divergence.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
      points: 140,
      players: 0,
      rating: 4.8,
      color: "bg-slate-100 text-slate-800",
      icon: <Gauge className="w-6 h-6" />,
      grades: [12],
      topics: ["Root Finding", "Numerical Integration"]
    },
    {
      id: "coordinate-geometry-10",
      title: "Coordinate Geometry 10",
      description: "Distance, section formula, area of triangle in coordinate plane.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
      points: 130,
      players: 0,
      rating: 4.7,
      color: "bg-indigo-100 text-indigo-800",
      icon: <Ruler className="w-6 h-6" />,
      grades: [10],
      topics: ["Distance", "Section", "Area"],
      minLevel: 4
    },
    {
      id: "light-optics-10",
      title: "Light & Optics 10",
      description: "Mirror/lens formulae, magnification, refractive index, TIR.",
      subject: "Physics",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
      points: 130,
      players: 0,
      rating: 4.7,
      color: "bg-rose-100 text-rose-800",
      icon: <Triangle className="w-6 h-6" />,
      grades: [10],
      topics: ["Reflection", "Refraction", "TIR"],
      minLevel: 5
    },
    // Grade 11 New Games
    {
      id: "trig-treasure-hunt-11",
      title: "Trig Treasure Hunt 11",
      description: "Solve trigonometric identities to unlock the next map location.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "6-12 min",
      points: 120,
      players: 0,
      rating: 4.7,
      color: "bg-fuchsia-100 text-fuchsia-800",
      icon: <Triangle className="w-6 h-6" />,
      grades: [11],
      topics: ["Trigonometry", "Identities"]
    },
    {
      id: "quadratic-quest-11",
      title: "Quadratic Quest 11",
      description: "Solve quadratic equations (including complex cases) to cross obstacles.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "6-12 min",
      points: 120,
      players: 0,
      rating: 4.7,
      color: "bg-purple-100 text-purple-800",
      icon: <Sigma className="w-6 h-6" />,
      grades: [11],
      topics: ["Quadratics", "Roots"]
    },
    {
      id: "equilibrium-challenge-11",
      title: "Equilibrium Challenge 11",
      description: "Adjust conditions and predict shifts using Le Chatelier\u2019s principle.",
      subject: "Chemistry",
      difficulty: "Medium",
      estimatedTime: "6-12 min",
      points: 120,
      players: 0,
      rating: 4.7,
      color: "bg-emerald-100 text-emerald-800",
      icon: <Beaker className="w-6 h-6" />,
      grades: [11],
      topics: ["Equilibrium", "Le Chatelier"]
    },
    {
      id: "energy-power-battle-11",
      title: "Energy & Power Battle 11",
      description: "Recharge shields by calculating work, kinetic energy, and power.",
      subject: "Physics",
      difficulty: "Medium",
      estimatedTime: "6-12 min",
      points: 120,
      players: 0,
      rating: 4.7,
      color: "bg-amber-100 text-amber-800",
      icon: <Zap className="w-6 h-6" />,
      grades: [11],
      topics: ["Work", "Energy", "Power"]
    },
    {
      id: "coordinate-geo-advanced-11",
      title: "Coordinate Geometry Race (Advanced) 11",
      description: "Answer distance, slope, midpoint, section formula, and triangle area questions.",
      subject: "Mathematics",
      difficulty: "Medium",
      estimatedTime: "6-12 min",
      points: 120,
      players: 0,
      rating: 4.7,
      color: "bg-indigo-100 text-indigo-800",
      icon: <Target className="w-6 h-6" />,
      grades: [11],
      topics: ["Coordinate Geometry"]
    },
    {
      id: "oscillation-rhythm-11",
      title: "Oscillation Rhythm 11",
      description: "Match wave equations, frequency, and phase to keep the rhythm.",
      subject: "Physics",
      difficulty: "Medium",
      estimatedTime: "6-12 min",
      points: 120,
      players: 0,
      rating: 4.7,
      color: "bg-pink-100 text-pink-800",
      icon: <Gauge className="w-6 h-6" />,
      grades: [11],
      topics: ["Waves", "Oscillations"]
    },
    {
      id: "organic-molecule-quest-11",
      title: "Organic Molecule Quest 11",
      description: "Identify functional groups, isomer types, and homologous series to progress.",
      subject: "Chemistry",
      difficulty: "Medium",
      estimatedTime: "6-12 min",
      points: 120,
      players: 0,
      rating: 4.7,
      color: "bg-emerald-100 text-emerald-800",
      icon: <Beaker className="w-6 h-6" />,
      grades: [11],
      topics: ["Functional Groups", "Isomerism"]
    },
    {
      id: "thermo-lab-escape-11",
      title: "Thermodynamics Lab Escape 11",
      description: "Solve heat, work, and efficiency puzzles to unlock doors and escape.",
      subject: "Physics",
      difficulty: "Medium",
      estimatedTime: "6-12 min",
      points: 120,
      players: 0,
      rating: 4.7,
      color: "bg-red-100 text-red-800",
      icon: <Beaker className="w-6 h-6" />,
      grades: [11],
      topics: ["Thermodynamics", "Heat & Work"],
      minLevel: 4
    }
  ];
  const gameComponents = {
    "math-quest": <MathGame onBack={handleBackToHub} currentUser={currentUser} />,
    "science-quiz": <ScienceQuiz onBack={handleBackToHub} currentUser={currentUser} />,
    "physics-simulator": <PhysicsSimulator onBack={handleBackToHub} currentUser={currentUser} />,
    "chem-mixer": <ChemMixer onBack={handleBackToHub} currentUser={currentUser} />,
    "geometry-explorer": <GeometryExplorer onBack={handleBackToHub} currentUser={currentUser} />,
    "set-theory-venn": <SetTheoryVenn onBack={handleBackToHub} currentUser={currentUser} hardMode={selectedGrade === 11} />,
    "coordinate-race": <CoordinateRace onBack={handleBackToHub} currentUser={currentUser} hardMode={selectedGrade === 11} />,
    "laws-of-motion-arena": <LawsOfMotionArena onBack={handleBackToHub} currentUser={currentUser} hardMode={selectedGrade === 11} />,
    "water-sort": <WaterSortPuzzle onBack={handleBackToHub} currentUser={currentUser} />,
    "memory-match": <MemoryMatch onBack={handleBackToHub} currentUser={currentUser} />,
    "fractions-quiz": <FractionsQuiz onBack={handleBackToHub} currentUser={currentUser} />,
    "times-tables-rush": <TimesTablesRush onBack={handleBackToHub} currentUser={currentUser} />,
    "decimals-percent": <DecimalsPercentQuiz onBack={handleBackToHub} currentUser={currentUser} />,
    "area-perimeter": <AreaPerimeterQuiz onBack={handleBackToHub} currentUser={currentUser} />,
    "word-problem-sprint": <WordProblemSprint onBack={handleBackToHub} currentUser={currentUser} />,
    "prime-detective": <PrimeDetective onBack={handleBackToHub} currentUser={currentUser} />,
    "division-dash": <DivisionDash onBack={handleBackToHub} currentUser={currentUser} />,
    "gk-6": <GeneralKnowledge6 onBack={handleBackToHub} currentUser={currentUser} />,
    "circuit-builder": <CircuitBuilder onBack={handleBackToHub} currentUser={currentUser} />,
    "algebra-quest-7": <AlgebraQuest7 onBack={handleBackToHub} currentUser={currentUser} />,
    "angle-explorer-7": <AngleExplorer7 onBack={handleBackToHub} currentUser={currentUser} />,
    "proportion-lab-7": <ProportionLab7 onBack={handleBackToHub} currentUser={currentUser} />,
    "linear-graphs-7": <LinearGraphs7 onBack={handleBackToHub} currentUser={currentUser} />,
    "integer-ops-7": <IntegerOps7 onBack={handleBackToHub} currentUser={currentUser} />,
    "data-stats-7": <DataStats7 onBack={handleBackToHub} currentUser={currentUser} />,
    "probability-spinner-7": <ProbabilitySpinner7 onBack={handleBackToHub} currentUser={currentUser} />,
    "exponents-powers-8": <ExponentsPowers8 onBack={handleBackToHub} currentUser={currentUser} />,
    "algebra-adventure-8": <AlgebraAdventure8 onBack={handleBackToHub} currentUser={currentUser} />,
    "geometry-builder-8": <GeometryBuilder8 onBack={handleBackToHub} currentUser={currentUser} />,
    "data-graph-explorer-8": <DataGraphExplorer8 onBack={handleBackToHub} currentUser={currentUser} />,
    "physics-sim-8": <PhysicsSim8 onBack={handleBackToHub} currentUser={currentUser} />,
    "molecule-builder-8": <MoleculeBuilder8 onBack={handleBackToHub} currentUser={currentUser} />,
    "biology-quest-8": <BiologyQuest8 onBack={handleBackToHub} currentUser={currentUser} />,
    "experiment-lab-8": <ExperimentLab8 onBack={handleBackToHub} currentUser={currentUser} />,
    "history-time-travel-8": <HistoryTimeTravel8 onBack={handleBackToHub} currentUser={currentUser} />,
    "algebra-master-9": <AlgebraMaster9 onBack={handleBackToHub} currentUser={currentUser} />,
    "geometry-theorems-9": <GeometryTheorems9 onBack={handleBackToHub} currentUser={currentUser} />,
    "coordinate-geometry-9": <CoordinateGeometry9 onBack={handleBackToHub} currentUser={currentUser} />,
    "statistics-starter-9": <StatisticsStarter9 onBack={handleBackToHub} currentUser={currentUser} />,
    "trigonometry-basics-9": <TrigonometryBasics9 onBack={handleBackToHub} currentUser={currentUser} />,
    "polynomials-lab-9": <PolynomialsLab9 onBack={handleBackToHub} currentUser={currentUser} />,
    "physics-kinematics-9": <PhysicsKinematics9 onBack={handleBackToHub} currentUser={currentUser} />,
    "chemistry-reactions-9": <ChemistryReactions9 onBack={handleBackToHub} currentUser={currentUser} />,
    "quadratic-equations-10": <QuadraticEquations10 onBack={handleBackToHub} currentUser={currentUser} />,
    "trigonometry-applications-10": <TrigonometryApplications10 onBack={handleBackToHub} currentUser={currentUser} />,
    "arithmetic-progressions-10": <ArithmeticProgressions10 onBack={handleBackToHub} currentUser={currentUser} />,
    "electricity-circuits-10": <ElectricityCircuits10 onBack={handleBackToHub} currentUser={currentUser} />,
    "probability-basics-10": <ProbabilityBasics10 onBack={handleBackToHub} currentUser={currentUser} />,
    "real-numbers-10": <RealNumbers10 onBack={handleBackToHub} currentUser={currentUser} />,
    "coordinate-geometry-10": <CoordinateGeometry10 onBack={handleBackToHub} currentUser={currentUser} />,
    "light-optics-10": <LightOptics10 onBack={handleBackToHub} currentUser={currentUser} />,
    "trig-treasure-hunt-11": <TrigTreasureHunt11 onBack={handleBackToHub} currentUser={currentUser} />,
    "quadratic-quest-11": <QuadraticQuest11 onBack={handleBackToHub} currentUser={currentUser} />,
    "equilibrium-challenge-11": <EquilibriumChallenge11 onBack={handleBackToHub} currentUser={currentUser} />,
    "energy-power-battle-11": <EnergyPowerBattle11 onBack={handleBackToHub} currentUser={currentUser} />,
    "coordinate-geo-advanced-11": <CoordinateGeoAdvanced11 onBack={handleBackToHub} currentUser={currentUser} />,
    "oscillation-rhythm-11": <OscillationRhythm11 onBack={handleBackToHub} currentUser={currentUser} />,
    "organic-molecule-quest-11": <OrganicMoleculeQuest11 onBack={handleBackToHub} currentUser={currentUser} />,
    "thermo-lab-escape-11": <ThermoLabEscape11 onBack={handleBackToHub} currentUser={currentUser} />,
    "calculus-bridge-builder-12": <CalculusBridgeBuilder12 onBack={handleBackToHub} currentUser={currentUser} />,
    "relativity-time-race-12": <RelativityTimeRace12 onBack={handleBackToHub} currentUser={currentUser} />,
    "molecular-architecture-vr-12": <MolecularArchitectureVR12 onBack={handleBackToHub} currentUser={currentUser} />,
    "genetic-engineering-lab-12": <GeneticEngineeringLab12 onBack={handleBackToHub} currentUser={currentUser} />,
    "de-rescue-12": <DifferentialEquationsRescue12 onBack={handleBackToHub} currentUser={currentUser} />,
    "em-field-builder-12": <EMFieldBuilder12 onBack={handleBackToHub} currentUser={currentUser} />,
    "stats-inference-lab-12": <StatsInferenceLab12 onBack={handleBackToHub} currentUser={currentUser} />,
    "complex-numbers-circuit-12": <ComplexNumbersCircuit12 onBack={handleBackToHub} currentUser={currentUser} />,
    "linear-algebra-network-flow-12": <LinearAlgebraNetworkFlow12 onBack={handleBackToHub} currentUser={currentUser} />,
    "optimization-factory-12": <OptimizationFactory12 onBack={handleBackToHub} currentUser={currentUser} />,
    "probability-bayes-lab-12": <ProbabilityBayesLab12 onBack={handleBackToHub} currentUser={currentUser} />,
    "numerical-methods-rally-12": <NumericalMethodsRally12 onBack={handleBackToHub} currentUser={currentUser} />,
    "fraction-quest-6": <FractionQuest6 onBack={handleBackToHub} currentUser={currentUser} />,
    "geometry-builder-6": <GeometryBuilder6 onBack={handleBackToHub} currentUser={currentUser} />,
    "speed-math-race-6": <SpeedMathRace6 onBack={handleBackToHub} currentUser={currentUser} />
  };
  if (selectedGame && gameComponents[selectedGame]) {
    const selected = games.find((g) => g.id === selectedGame);
    return <div className="min-h-screen bg-gray-50">{gameComponents[selectedGame]}<FloatingChat subject={selected?.subject} userName={currentUser} /></div>;
  }
  return <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-6 md:p-8"><div className="max-w-7xl mx-auto">{
    /* Header */
  }<div className="flex items-center justify-between mb-8"><h1 className="text-3xl font-bold text-gray-900">{t("games")}</h1><div className="flex items-center space-x-4"><RewardsHUD /><GradeSelector
    selectedGrade={selectedGrade}
    onGradeSelect={handleGradeSelect}
    recommendedGrade={recommendedGrade.grade}
  /><DifficultyIndicator difficulty={currentDifficulty} /></div></div>{
    /* Skill Suggestions */
  }{skillSuggestions.length > 0 && <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded"><h3 className="text-yellow-800 font-medium mb-2">{t("skillSuggestions")}</h3><div className="flex flex-wrap gap-2">{skillSuggestions.map((skill, index) => <span
    key={index}
    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full"
  >{skill}</span>)}</div></div>}{
    /* Games Grid or Empty State */
  }{selectedGrade ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{(() => {
    const filtered = games.filter((game) => {
      if (!selectedGrade) return false;
      if (!game.grades.includes(selectedGrade)) return false;
      const lowest = Math.min(...game.grades);
      return lowest === selectedGrade;
    });
    return filtered;
  })().map((game) => {
    const isLocked = game.minLevel !== void 0 && (rewards?.level ?? 1) < (game.minLevel ?? 1);
    return <div key={game.id} className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"><div className="p-6"><div className="flex items-start justify-between mb-4"><div className={`p-2 rounded-lg ${game.color}`}>{game.icon}</div><div className="flex items-center gap-2">{isLocked && <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-100 text-red-800"><Lock className="w-3 h-3 mr-1" /> Lvl {game.minLevel}</span>}<span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">{game.difficulty}</span></div></div><h3 className="text-xl font-semibold text-gray-900 mb-2">{game.title}</h3><p className="text-gray-600 mb-4">{game.description}</p><div className="flex items-center justify-between text-sm text-gray-500 mb-4"><span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{game.estimatedTime}</span><span className="flex items-center"><Users className="w-4 h-4 mr-1" />{game.players.toLocaleString()}</span><span className="flex items-center"><Star className="w-4 h-4 text-yellow-400 mr-1" />{game.rating}</span></div><button
      onClick={() => !isLocked && handlePlayGame(game.id)}
      disabled={isLocked}
      className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        ${isLocked ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"}`}
    >{isLocked ? <><Lock className="w-4 h-4 mr-2" /> Unlock at Level {game.minLevel}</> : <><Play className="w-4 h-4 mr-2" />{t("playNow")}</>}</button></div></div>;
  })}</div> : <div className="mt-6 bg-white rounded-xl shadow-sm p-6 text-center text-gray-700"><div className="text-lg font-semibold mb-1">Choose a State (Grade) or CBSE Class</div><div className="text-sm">Use the controls above to select a State (6–12) or open the CBSE panel to pick a Class. Games will appear here once selected.</div></div>}{
    /* Quick Stats */
  }<div className="bg-white rounded-xl shadow-sm p-6 mt-8"><h3 className="text-lg font-semibold text-gray-900 mb-6">{t("quickStats")}</h3><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><div className="text-center"><div className="text-2xl font-bold text-blue-600">24</div><div className="text-sm text-gray-600">{t("gamesPlayed")}</div></div><div className="text-center"><div className="text-2xl font-bold text-green-600">1,250</div><div className="text-sm text-gray-600">{t("totalPoints")}</div></div><div className="text-center"><div className="text-2xl font-bold text-purple-600">85%</div><div className="text-sm text-gray-600">{t("accuracy")}</div></div><div className="text-center"><div className="text-2xl font-bold text-orange-600">7</div><div className="text-sm text-gray-600">{t("streak")}</div></div></div></div></div>{
    /* Floating chat visible on hub as well */
  }<FloatingChat subject={selectedGrade ? `Grade ${selectedGrade}` : "Games"} userName={currentUser} /></div>;
};
export default GameHub;
