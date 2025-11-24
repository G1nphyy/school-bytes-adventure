import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Train, CircleAlert } from "lucide-react";

type SignalState = "red" | "yellow" | "green" | "none";

interface Scenario {
  id: number;
  description: string;
  correctSignal: SignalState;
  explanation: string;
  hints: string[];
}

const scenarios: Scenario[] = [
  {
    id: 1,
    description: "Pociąg wjeżdża na tor, na którym stoi inny pociąg",
    correctSignal: "red",
    explanation: "Sygnał czerwony (Stój!) - zabrania wjazdu na zajęty tor",
    hints: [
      "To sytuacja niebezpieczna",
      "Pociąg musi się zatrzymać",
      "Czerwony sygnał oznacza zakaz przejazdu",
    ],
  },
  {
    id: 2,
    description: "Tor jest wolny, ale następny odcinek jest zajęty",
    correctSignal: "yellow",
    explanation: "Sygnał żółty (Jazda ostrożna) - następny sygnał będzie czerwony",
    hints: [
      "Tor jest wolny, ale trzeba uważać",
      "Następny odcinek może być zajęty",
      "Żółty sygnał to ostrzeżenie",
    ],
  },
  {
    id: 3,
    description: "Wszystkie tory są wolne, można jechać z pełną prędkością",
    correctSignal: "green",
    explanation: "Sygnał zielony (Jazda) - droga wolna",
    hints: [
      "Sytuacja bezpieczna",
      "Można jechać normalnie",
      "Zielony oznacza wolną drogę",
    ],
  },
  {
    id: 4,
    description: "Wykryto uszkodzenie toru przed pociągiem",
    correctSignal: "red",
    explanation: "Sygnał czerwony - uszkodzenie toru to zagrożenie bezpieczeństwa",
    hints: [
      "Uszkodzenie to niebezpieczeństwo",
      "Pociąg nie może jechać dalej",
      "Tylko czerwony gwarantuje bezpieczeństwo",
    ],
  },
  {
    id: 5,
    description: "Pociąg zbliża się do stacji, następny pociąg odjeżdża za 2 minuty",
    correctSignal: "yellow",
    explanation: "Sygnał żółty - pociąg powinien zwolnić, bo za chwilę będzie czerwony",
    hints: [
      "Trzeba przygotować się do zatrzymania",
      "To nie pełne czerwone, ale trzeba uważać",
      "Żółty to przygotowanie do stopu",
    ],
  },
];

const TransportGame = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedSignal, setSelectedSignal] = useState<SignalState>("none");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const scenario = scenarios[currentScenario];

  const handleSignalSelect = (signal: SignalState) => {
    setSelectedSignal(signal);
    setShowResult(true);

    if (signal === scenario.correctSignal) {
      setScore(score + 1);
      setHintLevel(0);
      setWrongAttempts(0);
    } else {
      setWrongAttempts(wrongAttempts + 1);
    }
  };

  const showHint = () => {
    if (hintLevel < scenario.hints.length) {
      setHintLevel(hintLevel + 1);
    }
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedSignal("none");
      setShowResult(false);
      setHintLevel(0);
      setWrongAttempts(0);
    } else {
      setGameComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    setSelectedSignal("none");
    setShowResult(false);
    setScore(0);
    setGameComplete(false);
    setHintLevel(0);
    setWrongAttempts(0);
  };

  if (gameComplete) {
    const percentage = (score / scenarios.length) * 100;
    return (
      <Card className="bg-card border-4 border-border p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">
            {percentage >= 80 ? "🚂" : percentage >= 60 ? "🚆" : "📚"}
          </div>
          <h2 className="text-2xl text-foreground mb-2">GRA UKOŃCZONA!</h2>
          <p className="text-lg text-primary mb-4">
            Twój wynik: {score}/{scenarios.length}
          </p>
          <p className="text-sm text-muted-foreground">
            {percentage >= 80
              ? "Doskonała znajomość sygnalizacji!"
              : percentage >= 60
              ? "Dobra robota! Jeszcze trochę praktyki."
              : "Warto lepiej poznać zasady sygnalizacji!"}
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

  const getSignalColor = (signal: SignalState) => {
    const colors = {
      red: "bg-destructive",
      yellow: "bg-arcade-yellow",
      green: "bg-accent",
      none: "bg-muted",
    };
    return colors[signal];
  };

  return (
    <Card className="bg-card border-4 border-border p-6">
      <div className="mb-6 text-center">
        <Train className="w-12 h-12 text-primary mx-auto mb-4 animate-pixel-float" />
        <h2 className="text-lg text-foreground mb-2">SYGNALIZACJA KOLEJOWA</h2>
        <p className="text-xs text-muted-foreground">Wybierz właściwy sygnał świetlny</p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>
            Scenariusz {currentScenario + 1}/{scenarios.length}
          </span>
          <span>Wynik: {score}</span>
        </div>
        <div className="h-2 bg-muted border-2 border-border">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentScenario + 1) / scenarios.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Scenario */}
      <div className="mb-6">
        <div className="p-4 bg-muted border-2 border-border">
          <CircleAlert className="w-6 h-6 text-primary mx-auto mb-3" />
          <p className="text-xs text-foreground text-center leading-relaxed">
            {scenario.description}
          </p>
        </div>
      </div>

      {/* Signal Selection */}
      {!showResult && (
        <>
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-4 text-center">
              Wybierz odpowiedni sygnał:
            </p>
            <div className="flex justify-center gap-4">
              {(["red", "yellow", "green"] as SignalState[]).map((signal) => (
                <button
                  key={signal}
                  onClick={() => handleSignalSelect(signal)}
                  className="flex flex-col items-center arcade-button"
                >
                  <div
                    className={`w-16 h-16 rounded-full ${getSignalColor(
                      signal
                    )} border-4 border-border animate-pixel-pulse`}
                  />
                  <span className="text-xs text-muted-foreground mt-2 capitalize">
                    {signal === "red" ? "Stój" : signal === "yellow" ? "Ostrożnie" : "Jedź"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Hints */}
          {wrongAttempts > 0 && hintLevel < scenario.hints.length && (
            <div className="mb-4">
              <Button
                onClick={showHint}
                variant="outline"
                size="sm"
                className="w-full border-2 border-secondary text-secondary hover:bg-secondary/20"
              >
                💡 POKAŻ PODPOWIEDŹ ({hintLevel + 1}/{scenario.hints.length})
              </Button>
            </div>
          )}

          {hintLevel > 0 && (
            <div className="mb-4 space-y-2">
              {scenario.hints.slice(0, hintLevel).map((hint, index) => (
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
        </>
      )}

      {/* Result */}
      {showResult && (
        <div className="mb-6 animate-slide-in-up">
          <div className="flex justify-center mb-4">
            <div
              className={`w-24 h-24 rounded-full ${getSignalColor(
                selectedSignal
              )} border-4 border-border`}
            />
          </div>
          <div
            className={`p-4 border-2 ${
              selectedSignal === scenario.correctSignal
                ? "border-accent bg-accent/20 text-accent"
                : "border-destructive bg-destructive/20 text-destructive"
            }`}
          >
            <p className="text-xs mb-2 font-bold text-center">
              {selectedSignal === scenario.correctSignal ? "✓ PRAWIDŁOWO!" : "✗ NIEPRAWIDŁOWO"}
            </p>
            <p className="text-xs leading-relaxed text-center">{scenario.explanation}</p>
          </div>
        </div>
      )}

      {/* Next Button */}
      {showResult && (
        <Button
          onClick={handleNext}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 arcade-button"
        >
          {currentScenario < scenarios.length - 1 ? "NASTĘPNY SCENARIUSZ →" : "ZOBACZ WYNIK"}
        </Button>
      )}
    </Card>
  );
};

export default TransportGame;
