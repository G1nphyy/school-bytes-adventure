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
    hints: [
      "Zwróć uwagę na typy danych w parametrach funkcji",
      "Co się stanie gdy dodasz liczbę do tekstu?",
      "JavaScript konwertuje liczbę na string przy dodawaniu",
    ],
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
    hints: [
      "Sprawdź czy warunek if jest prawdziwy",
      "Jeśli 10 > 5, to co się dzieje z x?",
      "x zostanie pomnożone przez 2",
    ],
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
    hints: [
      "Pętla powinna zacząć od 0",
      "Używamy < zamiast <= gdy kończymy przed wartością",
      "i < 5 oznacza: 0, 1, 2, 3, 4",
    ],
  },
  {
    id: 4,
    question: "Jaki błąd jest w tym kodzie?",
    code: `const arr = [1, 2, 3];
arr.push(4);
arr = [1, 2, 3, 4, 5];`,
    options: [
      "Nie można używać push na const",
      "Nie można przypisać nowej wartości do const",
      "Array nie ma metody push",
      "Kod jest poprawny",
    ],
    correctAnswer: 1,
    explanation: "Const pozwala modyfikować zawartość tablicy (push), ale nie pozwala na przypisanie nowej wartości.",
    hints: [
      "const blokuje ponowne przypisanie zmiennej",
      "push modyfikuje istniejącą tablicę",
      "Przypisanie '=' tworzy nową referencję",
    ],
  },
  {
    id: 5,
    question: "Co zwróci ta funkcja?",
    code: `function test() {
  return
    {
      value: 42
    }
}
console.log(test());`,
    options: ["{ value: 42 }", "42", "undefined", "Error"],
    correctAnswer: 2,
    explanation: "JavaScript automatycznie wstawia średnik po 'return', więc funkcja zwraca undefined.",
    hints: [
      "Zwróć uwagę na formatowanie kodu",
      "Return powinien być w tej samej linii co wartość",
      "JavaScript dodaje średnik po 'return'",
    ],
  },
  {
    id: 6,
    question: "Jaki będzie wynik?",
    code: `let a = [1, 2, 3];
let b = a;
b.push(4);
console.log(a.length);`,
    options: ["3", "4", "undefined", "Error"],
    correctAnswer: 1,
    explanation: "b jest referencją do tej samej tablicy co a, więc push(4) modyfikuje obie zmienne.",
    hints: [
      "Tablice są przekazywane przez referencję",
      "b i a wskazują na tę samą tablicę",
      "Zmiana b zmienia też a",
    ],
  },
  {
    id: 7,
    question: "Co wypisze console.log?",
    code: `console.log(typeof null);`,
    options: ["null", "object", "undefined", "number"],
    correctAnswer: 1,
    explanation: "To znany bug w JavaScript - typeof null zwraca 'object'.",
    hints: [
      "To jeden z najbardziej znanych bugów JavaScript",
      "null nie jest obiektem, ale...",
      "typeof null zwraca 'object'",
    ],
  },
  {
    id: 8,
    question: "Jaki będzie rezultat?",
    code: `console.log(0.1 + 0.2 === 0.3);`,
    options: ["true", "false", "undefined", "Error"],
    correctAnswer: 1,
    explanation: "Precyzja liczb zmiennoprzecinkowych sprawia że 0.1 + 0.2 = 0.30000000000000004",
    hints: [
      "Liczby zmiennoprzecinkowe mają problem z precyzją",
      "0.1 + 0.2 nie jest dokładnie 0.3",
      "Wynik to 0.30000000000000004",
    ],
  },
];

const ProgrammerGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const question = codeQuestions[currentQuestion];

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
    if (currentQuestion < codeQuestions.length - 1) {
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
    <Card className="h-screen w-[35%] fixed left-0 top-0 border-r bg-card text-card-foreground flex flex-col p-6 overflow-y-auto">
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

      {/* Hints System */}
      {!showResult && wrongAttempts > 0 && hintLevel < question.hints.length && (
        <div className="mb-6 animate-slide-in-up">
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

      {/* Display Hints */}
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
