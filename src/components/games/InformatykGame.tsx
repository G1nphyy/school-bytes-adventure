import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, CheckCircle2, XCircle } from "lucide-react";

const securityQuestions = [
  {
    id: 1,
    question: "Które hasło jest najbezpieczniejsze?",
    options: ["password123", "P@ssw0rd!", "Tr3$#mK9@pL2", "qwerty"],
    correctAnswer: 2,
    explanation:
      "Silne hasło zawiera wielkie i małe litery, cyfry, znaki specjalne i ma co najmniej 12 znaków.",
    hints: [
      "Najdłuższe hasło zwykle jest najbezpieczniejsze",
      "Powinno zawierać wielkie litery, cyfry i znaki specjalne",
      "Tr3$#mK9@pL2 ma wszystkie elementy bezpiecznego hasła",
    ],
  },
  {
    id: 2,
    question: "Co to jest phishing?",
    options: [
      "Rodzaj wirusa komputerowego",
      "Próba wyłudzenia danych przez podszywanie się",
      "Typ zapory sieciowej",
      "Metoda szyfrowania danych",
    ],
    correctAnswer: 1,
    explanation:
      "Phishing to próba wyłudzenia poufnych informacji poprzez podszywanie się pod zaufane źródło.",
    hints: [
      "Związane z podszywaniem się pod inne osoby",
      "Często w formie fałszywych e-maili",
      "Wyłudzanie danych przez podszywanie",
    ],
  },
  {
    id: 3,
    question: "Co oznacza 'https' w adresie strony?",
    options: [
      "High Transfer Protocol System",
      "Połączenie jest szyfrowane",
      "Strona jest szybsza",
      "Strona wymaga logowania",
    ],
    correctAnswer: 1,
    explanation: "HTTPS oznacza, że połączenie jest szyfrowane i bezpieczne (HTTP + SSL/TLS).",
    hints: [
      "'S' na końcu oznacza 'Secure'",
      "Dotyczy szyfrowania połączenia",
      "Połączenie jest szyfrowane",
    ],
  },
  {
    id: 4,
    question: "Co to jest firewall?",
    options: [
      "Program do usuwania wirusów",
      "Zapora sieciowa kontrolująca ruch",
      "Narzędzie do tworzenia kopii zapasowych",
      "System operacyjny",
    ],
    correctAnswer: 1,
    explanation: "Firewall to zapora sieciowa, która kontroluje ruch sieciowy i chroni przed atakami.",
    hints: [
      "Ma związek z siecią",
      "Kontroluje przepływ danych",
      "Zapora sieciowa",
    ],
  },
  {
    id: 5,
    question: "Jak często należy aktualizować oprogramowanie?",
    options: [
      "Raz w roku",
      "Tylko gdy przestaje działać",
      "Regularnie, gdy są dostępne aktualizacje",
      "Nigdy, to zbędne",
    ],
    correctAnswer: 2,
    explanation:
      "Regularne aktualizacje są kluczowe dla bezpieczeństwa - łatają luki i dodają nowe zabezpieczenia.",
    hints: [
      "Bezpieczeństwo wymaga aktualnego oprogramowania",
      "Aktualizacje zawierają poprawki bezpieczeństwa",
      "Należy aktualizować regularnie",
    ],
  },
  {
    id: 6,
    question: "Co to jest malware?",
    options: [
      "Program do ochrony komputera",
      "Złośliwe oprogramowanie",
      "Typ przeglądarki internetowej",
      "System plików",
    ],
    correctAnswer: 1,
    explanation:
      "Malware to złośliwe oprogramowanie (malicious software) zaprojektowane do szkodzenia systemowi.",
    hints: [
      "'Mal-' oznacza 'zły' lub 'złośliwy'",
      "To oprogramowanie, które szkodzi",
      "Złośliwe oprogramowanie",
    ],
  },
];

const InformatykGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const question = securityQuestions[currentQuestion];

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
    if (currentQuestion < securityQuestions.length - 1) {
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
    const percentage = (score / securityQuestions.length) * 100;
    return (
      <Card className="bg-card border-4 border-border p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">
            {percentage >= 70 ? "🛡️" : percentage >= 50 ? "🔐" : "📚"}
          </div>
          <h2 className="text-2xl text-foreground mb-2">GRA UKOŃCZONA!</h2>
          <p className="text-lg text-primary mb-4">
            Twój wynik: {score}/{securityQuestions.length}
          </p>
          <p className="text-sm text-muted-foreground">
            {percentage >= 70
              ? "Doskonała znajomość cyberbezpieczeństwa!"
              : percentage >= 50
              ? "Dobra robota! Warto jeszcze poćwiczyć."
              : "Bezpieczeństwo IT wymaga więcej wiedzy!"}
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
    <Card className="bg-card border-4 border-border p-6">
      <div className="mb-6 text-center">
        <Shield className="w-12 h-12 text-primary mx-auto mb-4 animate-pixel-pulse" />
        <h2 className="text-lg text-foreground mb-2">CYBERBEZPIECZEŃSTWO</h2>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>
            Pytanie {currentQuestion + 1}/{securityQuestions.length}
          </span>
          <span>Wynik: {score}</span>
        </div>
        <div className="h-2 bg-muted border-2 border-border">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / securityQuestions.length) * 100}%`,
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
          {currentQuestion < securityQuestions.length - 1 ? "NASTĘPNE PYTANIE →" : "ZOBACZ WYNIK"}
        </Button>
      )}
    </Card>
  );
};

export default InformatykGame;
