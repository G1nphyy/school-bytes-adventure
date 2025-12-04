import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Radio, CheckCircle2, XCircle } from "lucide-react";

const networkQuestions = [
  {
    id: 1,
    question: "Który protokół służy do przesyłania stron internetowych?",
    options: ["FTP", "HTTP", "SMTP", "SSH"],
    correctAnswer: 1,
    explanation: "HTTP (HyperText Transfer Protocol) służy do przesyłania stron WWW.",
    hints: [
      "To protokół zaczynający się od 'H'",
      "Widzisz go w pasku adresu przeglądarki",
      "HTTP to protokół transferu hipertekstu",
    ],
  },
  {
    id: 2,
    question: "Jaki jest standardowy port dla HTTPS?",
    options: ["80", "443", "21", "22"],
    correctAnswer: 1,
    explanation: "Port 443 jest standardowym portem dla bezpiecznego protokołu HTTPS.",
    hints: [
      "Nie jest to port 80 (HTTP)",
      "To port w zakresie 400-500",
      "443 to port HTTPS",
    ],
  },
  {
    id: 3,
    question: "Co oznacza skrót LAN?",
    options: [
      "Large Area Network",
      "Local Area Network",
      "Long Access Network",
      "Limited Access Node",
    ],
    correctAnswer: 1,
    explanation: "LAN to Local Area Network - lokalna sieć komputerowa.",
    hints: [
      "Pierwsze słowo to 'Local'",
      "Dotyczy sieci w ograniczonym obszarze",
      "Local Area Network",
    ],
  },
  {
    id: 4,
    question: "Który adres IP jest prywatny?",
    options: ["8.8.8.8", "192.168.1.1", "1.1.1.1", "208.67.222.222"],
    correctAnswer: 1,
    explanation: "192.168.x.x to zakres adresów IP przeznaczonych do użytku w sieciach prywatnych.",
    hints: [
      "Adresy prywatne zaczynają się od 10, 172 lub 192",
      "Używane w domowych routerach",
      "192.168.1.1 to typowy adres routera",
    ],
  },
  {
    id: 5,
    question: "Co to jest DNS?",
    options: [
      "Data Network System",
      "Domain Name System",
      "Digital Network Service",
      "Direct Name Server",
    ],
    correctAnswer: 1,
    explanation: "DNS (Domain Name System) tłumaczy nazwy domen na adresy IP.",
    hints: [
      "Tłumaczy nazwy na adresy IP",
      "Drugie słowo to 'Name'",
      "Domain Name System",
    ],
  },
  {
    id: 6,
    question: "Która warstwa modelu OSI odpowiada za routing?",
    options: [
      "Warstwa łącza danych",
      "Warstwa sieciowa",
      "Warstwa transportowa",
      "Warstwa fizyczna",
    ],
    correctAnswer: 1,
    explanation: "Warstwa sieciowa (Network Layer - warstwa 3) odpowiada za routing pakietów.",
    hints: [
      "To warstwa 3 modelu OSI",
      "Routing działa na poziomie sieci",
      "Warstwa sieciowa",
    ],
  },
];

const KomunikacjaGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const question = networkQuestions[currentQuestion];

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
    if (currentQuestion < networkQuestions.length - 1) {
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
    const percentage = (score / networkQuestions.length) * 100;
    return (
      <Card className="bg-card border-4 border-border p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">
            {percentage >= 70 ? "🏆" : percentage >= 50 ? "📡" : "📚"}
          </div>
          <h2 className="text-2xl text-foreground mb-2">GRA UKOŃCZONA!</h2>
          <p className="text-lg text-primary mb-4">
            Twój wynik: {score}/{networkQuestions.length}
          </p>
          <p className="text-sm text-muted-foreground">
            {percentage >= 70
              ? "Doskonała znajomość sieci!"
              : percentage >= 50
              ? "Dobra robota! Jeszcze trochę nauki."
              : "Warto powtórzyć podstawy sieci!"}
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
        <Radio className="w-12 h-12 text-primary mx-auto mb-4 animate-pixel-pulse" />
        <h2 className="text-lg text-foreground mb-2">SIECI KOMPUTEROWE</h2>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>
            Pytanie {currentQuestion + 1}/{networkQuestions.length}
          </span>
          <span>Wynik: {score}</span>
        </div>
        <div className="h-2 bg-muted border-2 border-border">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / networkQuestions.length) * 100}%`,
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
          {currentQuestion < networkQuestions.length - 1 ? "NASTĘPNE PYTANIE →" : "ZOBACZ WYNIK"}
        </Button>
      )}
    </Card>
  );
};

export default KomunikacjaGame;
