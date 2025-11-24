import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

const codeQuestions = [
  {
    id: 1,
    question: "Znajdź błąd w kodzie:",
    code: `function suma(a, b) {
  return a + b
}
console.log(suma(5, "3"));`,
    options: [
      "Brak średnika po return",
      'Dodawanie liczby i stringa da "53"',
      "Funkcja nie jest zadeklarowana poprawnie",
      "Console.log powinien być przed funkcją",
    ],
    correctAnswer: 1,
    explanation: 'W JavaScript dodanie liczby (5) i stringa ("3") zwróci "53" zamiast 8.',
  },
  {
    id: 2,
    question: "Co wypisze ten kod?",
    code: `let x = 10;
if (x > 5) {
  x = x * 2;
}
console.log(x);`,
    options: ["5", "10", "20", "15"],
    correctAnswer: 2,
    explanation: "x = 10, warunek 10 > 5 jest prawdziwy, więc x = 10 * 2 = 20",
  },
  {
    id: 3,
    question: "Która pętla jest poprawna?",
    code: `// Która pętla wypisze liczby 0-4?`,
    options: [
      "for (let i = 0; i <= 4; i++)",
      "for (let i = 0; i < 5; i++)",
      "for (let i = 1; i <= 5; i++)",
      "for (let i = 0; i < 4; i++)",
    ],
    correctAnswer: 1,
    explanation: "Pętla zaczyna od 0 i kończy przed 5, więc wypisze: 0, 1, 2, 3, 4",
  },
];

const ProgrammerGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const question = codeQuestions[currentQuestion];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < codeQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
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
  };

  if (gameComplete) {
    const percentage = (score / codeQuestions.length) * 100;
    return (
      <Card className="bg-card border-4 border-border p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">
            {percentage >= 70 ? "🏆" : percentage >= 50 ? "👍" : "📚"}
          </div>
          <h2 className="text-2xl text-foreground mb-2">GRA UKOŃCZONA!</h2>
          <p className="text-lg text-primary mb-4">
            Twój wynik: {score}/{codeQuestions.length}
          </p>
          <p className="text-sm text-muted-foreground">
            {percentage >= 70
              ? "Świetna robota! Masz talent do programowania!"
              : percentage >= 50
              ? "Nieźle! Jeszcze trochę praktyki."
              : "Nie martw się! Praktyka czyni mistrza."}
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
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Pytanie {currentQuestion + 1}/{codeQuestions.length}</span>
          <span>Wynik: {score}</span>
        </div>
        <div className="h-2 bg-muted border-2 border-border">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / codeQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-sm text-foreground mb-4">{question.question}</h3>
        <div className="bg-muted p-4 border-2 border-border font-mono text-xs overflow-x-auto mb-4">
          <pre className="text-accent">{question.code}</pre>
        </div>
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

      {/* Result & Explanation */}
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
          {currentQuestion < codeQuestions.length - 1 ? "NASTĘPNE PYTANIE →" : "ZOBACZ WYNIK"}
        </Button>
      )}
    </Card>
  );
};

export default ProgrammerGame;
