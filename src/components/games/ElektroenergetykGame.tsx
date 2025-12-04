import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cog, CheckCircle2, XCircle } from "lucide-react";

const electricalQuestions = [
  {
    id: 1,
    question: "Jakie napięcie jest w polskich gniazdkach domowych?",
    options: ["110V", "230V", "400V", "12V"],
    correctAnswer: 1,
    explanation: "W Polsce standardowe napięcie w gniazdkach domowych to 230V AC.",
    hints: [
      "To wartość powyżej 200V",
      "W USA jest 110V, w Polsce więcej",
      "230V to standard europejski",
    ],
  },
  {
    id: 2,
    question: "Jakim kolorem oznacza się przewód ochronny (uziemienie)?",
    options: ["Niebieski", "Brązowy", "Żółto-zielony", "Czarny"],
    correctAnswer: 2,
    explanation: "Przewód ochronny PE zawsze oznacza się kolorem żółto-zielonym.",
    hints: [
      "To charakterystyczna kombinacja dwóch kolorów",
      "Jeden kolor to żółty",
      "Żółto-zielony to uziemienie",
    ],
  },
  {
    id: 3,
    question: "Co chroni instalację przed przeciążeniem?",
    options: ["Wyłącznik różnicowo-prądowy", "Bezpiecznik/automat", "Przełącznik", "Gniazdo"],
    correctAnswer: 1,
    explanation: "Bezpieczniki i automaty chronią instalację przed przeciążeniem i zwarciem.",
    hints: [
      "To element zabezpieczający",
      "Wyłącza się przy zbyt dużym prądzie",
      "Bezpiecznik lub automat",
    ],
  },
  {
    id: 4,
    question: "Ile faz ma napięcie trójfazowe?",
    options: ["1", "2", "3", "4"],
    correctAnswer: 2,
    explanation: "Napięcie trójfazowe składa się z 3 faz (L1, L2, L3) plus przewód neutralny.",
    hints: [
      "Nazwa podpowiada liczbę",
      "Więcej niż 2",
      "Trójfazowe = 3 fazy",
    ],
  },
  {
    id: 5,
    question: "Co to jest wyłącznik różnicowo-prądowy (RCD)?",
    options: [
      "Chroni przed przepięciem",
      "Wykrywa różnice prądów i chroni przed porażeniem",
      "Zwiększa napięcie",
      "Zmienia prąd z AC na DC",
    ],
    correctAnswer: 1,
    explanation:
      "RCD wykrywa różnicę między prądem wpływającym i wypływającym, chroniąc przed porażeniem.",
    hints: [
      "Chroni życie człowieka",
      "Wykrywa upływ prądu",
      "Chroni przed porażeniem prądem",
    ],
  },
  {
    id: 6,
    question: "Jaki jest bezpieczny odstęp od linii wysokiego napięcia?",
    options: ["30 cm", "1 metr", "Co najmniej 3 metry", "Nie ma znaczenia"],
    correctAnswer: 2,
    explanation: "Bezpieczny odstęp od linii wysokiego napięcia to minimum 3 metry.",
    hints: [
      "To więcej niż metr",
      "Bezpieczeństwo wymaga dużej odległości",
      "Co najmniej 3 metry",
    ],
  },
];

const ElektroenergetykGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const question = electricalQuestions[currentQuestion];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === question.correctAnswer) {
      setScore(score + 1);
      setHintLevel(0);
      setWrongAttempts(0);
    } else {
      setWrongAttempts(wrongAttempts + 1);
    }
  };

  const showHint = () => {
    if (hintLevel < question.hints.length) {
      setHintLevel(hintLevel + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < electricalQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setHintLevel(0);
      setWrongAttempts(0);
    } else {
      setGameComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setGameComplete(false);
    setHintLevel(0);
    setWrongAttempts(0);
  };

  if (gameComplete) {
    const percentage = (score / electricalQuestions.length) * 100;
    return (
      <Card className="bg-card border-4 border-border p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">
            {percentage >= 70 ? "⚡" : percentage >= 50 ? "🔌" : "📚"}
          </div>
          <h2 className="text-2xl text-foreground mb-2">GRA UKOŃCZONA!</h2>
          <p className="text-lg text-primary mb-4">
            Twój wynik: {score}/{electricalQuestions.length}
          </p>
          <p className="text-sm text-muted-foreground">
            {percentage >= 70
              ? "Świetna znajomość elektroenergetyki!"
              : percentage >= 50
              ? "Nieźle! Jeszcze trochę nauki."
              : "Warto powtórzyć zasady BHP i elektryki!"}
          </p>
        </div>
        <Button
          onClick={handleRestart}
          className="bg-primary text-primary-foreground hover:bg-primary/90 arcade-button"
        >
          ZAGRAJ PONOWNIE
        </Button>
      </Card>
    );
  }

  return (
    <Card className="h-screen w-[35%] fixed left-0 top-0 border-r bg-card text-card-foreground flex flex-col p-6 overflow-y-auto">
      <div className="mb-6 text-center">
        <Cog className="w-12 h-12 text-primary mx-auto mb-4 animate-pixel-pulse" />
        <h2 className="text-lg text-foreground mb-2">ELEKTROENERGETYKA</h2>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>
            Pytanie {currentQuestion + 1}/{electricalQuestions.length}
          </span>
          <span>Wynik: {score}</span>
        </div>
        <div className="h-2 bg-muted border-2 border-border">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / electricalQuestions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-sm text-foreground mb-4">{question.question}</h3>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => !showResult && handleAnswer(index)}
              disabled={showResult}
              className={`w-full p-4 text-left text-xs border-2 transition-all arcade-button ${
                showCorrect
                  ? "border-accent bg-accent/20 text-accent"
                  : showWrong
                  ? "border-destructive bg-destructive/20 text-destructive"
                  : isSelected
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border bg-background text-foreground hover:border-primary"
              } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showCorrect && <CheckCircle2 className="w-5 h-5" />}
                {showWrong && <XCircle className="w-5 h-5" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Hints */}
      {!showResult && wrongAttempts > 0 && hintLevel < question.hints.length && (
        <div className="mb-6">
          <Button
            onClick={showHint}
            variant="outline"
            size="sm"
            className="w-full border-2 border-secondary text-secondary hover:bg-secondary/20"
          >
            💡 POKAŻ PODPOWIEDŹ ({hintLevel + 1}/{question.hints.length})
          </Button>
        </div>
      )}

      {hintLevel > 0 && !showResult && (
        <div className="mb-6 space-y-2">
          {question.hints.slice(0, hintLevel).map((hint, index) => (
            <div
              key={index}
              className="p-3 border-2 border-secondary bg-secondary/20 text-secondary animate-slide-in-up"
            >
              <p className="text-xs">
                <span className="font-bold">Podpowiedź {index + 1}:</span> {hint}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Result */}
      {showResult && (
        <div className="mb-6 animate-slide-in-up">
          <div
            className={`p-4 border-2 ${
              selectedAnswer === question.correctAnswer
                ? "border-accent bg-accent/20 text-accent"
                : "border-destructive bg-destructive/20 text-destructive"
            }`}
          >
            <p className="text-xs mb-2 font-bold">
              {selectedAnswer === question.correctAnswer ? "✓ PRAWIDŁOWO!" : "✗ NIEPRAWIDŁOWO"}
            </p>
            <p className="text-xs leading-relaxed">{question.explanation}</p>
          </div>
        </div>
      )}

      {/* Next Button */}
      {showResult && (
        <Button
          onClick={handleNext}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 arcade-button"
        >
          {currentQuestion < electricalQuestions.length - 1 ? "NASTĘPNE PYTANIE →" : "ZOBACZ WYNIK"}
        </Button>
      )}
    </Card>
  );
};

export default ElektroenergetykGame;
