import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cable, CheckCircle2 } from "lucide-react";
import question4img from '@/assets/AutomatykZad4.png';
import question5img from '@/assets/AutomatykZad5.png';
import question6img from '@/assets/AutomatykZad6.png';
import question7img from '@/assets/AutomatykZad7.png';


// ---------------- QUIZ DATA ----------------
// Each question can have an image for question and images for answers
// For now placeholders; replace image URLs later
const quizQuestions = [
  // ------------------ PYTANIA 1–2 (schemat + tekst + odpowiedzi tekstowe) ------------------
  {
    id: 1,
    questionText: "Które urządzenie jest przykładem automatyki w domu?",
     hint: "Szukasz czegoś, co SAMO podejmuje decyzje – nie tylko włącza/wyłącza.",
     practical: "Automatyk musi rozróżniać „głupie” urządzenia od tych, które mają sprzętowy lub programowy układ decyzyjny – tylko wtedy można je wpiąć do systemu sterowania.",
     feedback: { good: "Dokładnie! Termostat to prawdziwy automat.", bad: "To nie jest automat – nie podejmuje decyzji." },
    answers: [
      { id: "a", text: "Zwykła żarówka", correct: false },
      { id: "b", text: "Kuchenka gazowa odpalana zapałką", correct: false },
      { id: "c", text: "Termostat sterujący ogrzewaniem", correct: true },
      { id: "d", text: "Nożyczki", correct: false },
    ],
  },
  {
    id: 2,
    questionText: "Co oznacza że obwód elektryczny jest „zamknięty”?",
    hint: "Zamknięty = prąd ma drogę powrotną do źródła.",
    practical: "Bez zamkniętego obwodu nie załączysy przekaźnika, silnika ani czujnika – to podstawa diagnostyki obwodów sterujących.",
    feedback: { good: "Tak! Prąd może płynąć.", bad: "To oznacza brak przepływu prądu." },
    answers: [
      { id: "a", text: "Prąd nie może płynąć", correct: false },
      { id: "b", text: "Prąd może płynąć", correct: true },
      { id: "c", text: "Bateria się wyładowała", correct: false},
      { id: "d", text: "Kable są odłączone", correct: false },
    ],
  },
    {
      id: 3,
      questionText: "Co to jest sterownik PLC",
      hint: "To specjalny komputer, który cały czas powtarza trzy kroki: odczyt wejść → wykonaj program → zapisz wyjścia.",
      practical: "PLC jest sercem każdej linii produkcyjnej – od pakowania czekoladek po sterowanie turbiną w elektrowni. Automatyk spędzi z nim większość kariery.",
      feedback: { good: "Dokładnie! PLC to mózg automatyki.", bad: "To nie jest poprawna definicja PLC." },
      answers: [
        { id: "a", text: "Komputer osobisty", correct: false },
        { id: "b", text: "Gra video", correct: false },
        { id: "c", text: "Nadajnik sieci bezprzewodowych Wi-Fi", correct: false },
        { id: "d", text: "Urządzenie elektroniczne, które na podstawie odebranych sygnałów na swoich wejściach, uruchamia odpowiednie sygnały na swoich wyjściach", correct: true },
      ],
    },
  // ------------------ PYTANIA 4–7 (tekst + zdjęcie, odpowiedzi tekstowe) ------------------
  {
    id: 4,
    questionText: "Przedstawiony schemat elektryczny pokazuje",
    questionImage: question4img,
    hint: "Spójrz na kontakt zwierny przekaźnika K1 – czy jest zwarty, czy rozwarty?",
    practical: "Umiejętność czytania schematów pozwala automatykowi szybko znaleźć, gdzie „ginie” sygnał i dlaczego silnik nie wystartuje.",
    feedback: { good: "Idealnie! To obwód otwarty, przekaźnik niezałączony.", bad: "Sprawdź jeszcze raz stan przekaźnika i obwodu." },
    answers: [
      { id: "a", text: "Obwód zamknięty gdzie przekaźnik K1 jest załączony", correct: false },
      { id: "b", text: "Obwód zamknięty gdzie przekaźnik K1 nie jest załączony", correct: false },
      { id: "c", text: "Obwód otwarty gdzie przekaźnik K1 jest załączony", correct: false },
      { id: "d", text: "Obwód otwarty gdzie przekaźnik K1 nie jest załączony", correct: true },
    ],
  },
  {
    id: 5,
    questionText: "Co przedstawia ten rysunek?",
    questionImage: question5img,
    hint: "Zwróć uwagę na symbol zaworu – prostokąt z kreską w środku to pneumatyka.",
    practical: "Pneumatyka jest wszędzie tam, gdzie potrzeba szybkiego i czystego ruchu – np. w fabrykach butelek, samochodów czy chipów. Automatyk musi umieć ją czytać jak elektrykę.",
    feedback: { good: "Tak! To schemat pneumatyki.", bad: "To nie ten rodzaj sterowania." },
    answers: [
      { id: "a", text: "Schemat sterowania elektrycznego", correct: false },
      { id: "b", text: "Schemat sterowania pneumatycznego", correct: true },
      { id: "c", text: "Schemat sterowania hydraulicznego", correct: false },
      { id: "d", text: "Schemat programowania sterownika PLC", correct: false },
    ],
  },
  {
    id: 6,
    questionText: "Kiedy w sterowniku PLC na wyjściu %Q0.1 pojawi się sygnał sterujący na podstawie poniższego programu",
    questionImage: question6img,
    hint: "Wykonaj program „po kolei”: sprawdź oba wejścia i zobacz, co daje kropka AND.",
    practical: "Rozumienie logiki PLC pozwala projektować bezpieczne interlocki – np. aby nie włączyć mieszadla bez wcześniejszego zamknięcia pokrywy.",
    feedback: { good: "Dokładnie! AND wymaga obu sygnałów.", bad: "Sprawdź logikę AND jeszcze raz." },
    answers: [
      { id: "a", text: "Gdy na wejściu %I0.0 oraz wejściu %I0.1 będzie brak sygnału sterującego", correct: false },
      { id: "b", text: "Gdy na wejściu %I0.0 oraz wejściu %I0.1 pojawi się sygnału sterującego ", correct: false },
      { id: "c", text: "Gdy na wejście %I0.0 pojawi się sygnał sterujący i na wejście %I0.1 będzie brak sygnału sterującego ", correct: false },
      { id: "d", text: "Gdy na wejście %I0.0 będzie brak sygnału sterującego i na wejście %I0.1 pojawi się sygnał sterujący ", correct: true },
    ],
  },
  {
    id: 7,
    questionText: "Do pomiaru przepływu gazu w rurociągu na przedstawionym rysunku, głównym elementem przetwornika jest",
    questionImage: question7img,
    hint: "Turbina kręci się proporcjonalnie do przepływu – impulsy można policzyć.",
    practical: "Czujniki przepływu są kluczowe w kotłowniach, klimatyzacji, gazowych turbinach. Automatyk dobiera je do zakresu mocy i dokładności linii.",
    feedback: { good: "Tak! Turbina to podstawa.", bad: "To nie ten element pomiarowy." },
    answers: [
      { id: "a", text: "Zwężka", correct: false },
      { id: "b", text: "Turbina", correct: true },
      { id: "c", text: "Kryza", correct: false },
      { id: "d", text: "Pływak", correct: false },
    ],
  },
];

// ---------------- GAME DATA ----------------

type CableColor = "orange" | "green" | "blue" | "brown" | "white" | "yellow";

interface CableType {
  id: number;
  color: CableColor;
  label: string;
}

const cables: CableType[] = [
  { id: 1, color: "orange", label: "TX+" },
  { id: 2, color: "green", label: "TX-" },
  { id: 3, color: "blue", label: "RX+" },
  { id: 4, color: "brown", label: "RX-" },
  { id: 5, color: "white", label: "NC" },
  { id: 6, color: "yellow", label: "NC" },
];

const correctOrder = [1, 2, 3, 4, 5, 6];

// ----------------------------------------------------
//                     MAIN COMPONENT
// ----------------------------------------------------

const AutomatykGame = () => {
  const [selectedCables, setSelectedCables] = useState<number[]>([]);
  const [availableCables, setAvailableCables] = useState<CableType[]>([...cables]);
  const [isComplete, setIsComplete] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // QUIZ STATES
  const [showQuizIntro, setShowQuizIntro] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [attemptNumber, setAttemptNumber] = useState<1 | 2>(1);
  
  useEffect(() => {
    setAvailableCables([...cables].sort(() => Math.random() - 0.5));
  }, []);

  const handleCableSelect = (cableId: number) => {
    if (selectedCables.length < 6 && !selectedCables.includes(cableId)) {
      const newSelected = [...selectedCables, cableId];
      setSelectedCables(newSelected);

      if (newSelected.length === 6) {
        setIsComplete(true);
        setAttempts(attempts + 1);
        const correct = newSelected.every((id, index) => id === correctOrder[index]);
        setIsCorrect(correct);
        if (correct) setShowQuizIntro(true);
      }
    }
  };

  const handleReset = () => {
    setSelectedCables([]);
    setIsComplete(false);
    setIsCorrect(false);
    setAvailableCables([...cables].sort(() => Math.random() - 0.5));
  };

  const getCableColor = (color: CableColor) => {
    const colorMap = {
      orange: "bg-orange-500",
      green: "bg-green-500",
      blue: "bg-blue-500",
      brown: "bg-amber-700",
      white: "bg-gray-300",
      yellow: "bg-yellow-400",
    };
    return colorMap[color];
  };

  // ---------------- QUIZ LOGIC ----------------

    const handleAnswerClick = (correct: boolean) => {
      setLastAnswerCorrect(correct);

      if (correct) {
        // dobra odpowiedź – dodaj punkty i przejdź dalej
        setScore(prev => prev + (attemptNumber === 1 ? 1 : 0.5));
        setTimeout(() => {
          setLastAnswerCorrect(null);
          nextQuestion();
        }, 3000);
      } else {
        // zła odpowiedź
        if (attemptNumber === 1) {
          // pierwsza porażka – pozwól spróbować jeszcze raz
          setAttemptNumber(2);
          setTimeout(() => setLastAnswerCorrect(null), 1500);
        } else {
          // druga porażka – 0 pkt, idź dalej
          setTimeout(() => {
            setLastAnswerCorrect(null);
            nextQuestion();
          }, 3000);
        }
      }
    };

    const nextQuestion = () => {
      if (currentQuestion + 1 < quizQuestions.length) {
        setCurrentQuestion(q => q + 1);
        setAttemptNumber(1);   // reset na nowe pytanie
        setShowHint(false);
      } else {
        setQuizFinished(true);
      }
    };

    const toggleHint = () => setShowHint(h => !h);

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setScore(0);
    setCurrentQuestion(0);
  };

  // ---------------- FEEDBACK TEXT ----------------
  const getFeedbackMessage = () => {
    if (score === 5) return "WOW! Perfekcyjnie! Masz talent do automatyki — widać, że to kierunek dla Ciebie!";
    if (score >= 3) return "Świetna robota! Widać, że masz do tego smykałkę. Z takimi podstawami daleko zajdziesz!";
    return "Nie przejmuj się! Każdy ekspert zaczynał od podstaw — masz potencjał, żeby zostać świetnym automatykiem!";
  };

    const CareerInfo = () => (
      <div className="mt-6 text-left text-sm text-muted-foreground space-y-2">
        <p><strong>Przedmioty rozszerzone:</strong> matematyka</p>
        <p><strong>Zdobywane kwalifikacje:</strong> ELM.01, ELM.04 – montaż, uruchamianie i eksploatacja automatyki przemysłowej.</p>
        <p><strong>Cele kształcenia:</strong> montaż, uruchamianie, obsługa, konserwacja i diagnostyka urządzeń automatyki.</p>
        <p><strong>Gwarancja pracy:</strong> rozwój Przemysłu 4.0 = rosnące zapotrzebowanie na techników automatyków (m.in. Volkswagen, Phoenix Contact, Fibaro).</p>
      </div>
    );

  return (
    <Card className="h-screen w-[35%] fixed left-0 top-0 border-r bg-card text-card-foreground flex flex-col p-6 overflow-y-auto">
      {/* QUIZ INTRO AFTER COMPLETING GAME */}
      {showQuizIntro && !quizStarted && !quizFinished && (
        <div className="animate-fade-in text-center mt-10">
          <h2 className="text-xl font-bold mb-4">GRATULACJE!</h2>
          <p className="text-sm mb-6">Prawidłowo wykonałeś okablowanie RJ‑45. Teraz sprawdź się w krótkim quizie!</p>
          <Button onClick={() => setQuizStarted(true)} className="w-full">Rozpocznij Quiz</Button>
          <CareerInfo />
        </div>
      )}

      {quizFinished && (
        <div className="text-center animate-fade-in">
          <h2 className="text-xl font-bold mb-4">Wynik: {score}/7</h2>
          <p className="text-sm mb-6">{getFeedbackMessage()}</p>
          <Button onClick={resetQuiz} className="w-full">Zagraj ponownie</Button>
          <CareerInfo />
        </div>
      )}

      {/* QUIZ */}
      {quizStarted && !quizFinished && (
        <div className="text-center">
          <h3 className="text-lg mb-2">
            Pytanie {currentQuestion + 1} / {quizQuestions.length}
          </h3>

          {/* OBRAZEK – większy, czytelny */}
          {quizQuestions[currentQuestion].questionImage && (
            <img
              src={quizQuestions[currentQuestion].questionImage}
              className="mx-auto w-64 md:w-80 rounded-lg shadow-md mb-4"
              alt="ilustracja pytania"
            />
          )}

          {/* TEKST PYTANIA */}
          <p className="text-xl mb-3">{quizQuestions[currentQuestion].questionText}</p>

          {/* PRZYCISK PODPOWIEDZI */}
          <div className="mb-4">
            <Button variant="outline" size="sm" onClick={toggleHint}>
              {showHint ? "Ukryj podpowiedź" : "Pokaż podpowiedź"}
            </Button>
            {showHint && (
              <div className="mt-2 text-sm text-muted-foreground italic">
                {quizQuestions[currentQuestion].hint}
              </div>
            )}

            {/* INFORMACJA O SZANSIE */}
            <div className="mt-2 text-xs text-muted-foreground">
              {attemptNumber === 1
                ? "Masz dwie szanse – za drugą dobrą odpowiedź dostaniesz 0,5 pkt."
                : "To Twoja ostatnia próba – brak punktów za błędną odpowiedź."}
            </div>
          </div>

          {/* PRAKTYCZNE ZASTOSOWANIE */}
          <details className="mb-4 text-left text-sm text-muted-foreground cursor-pointer">
            <summary className="font-semibold">Do czego mi się to przyda?</summary>
            <p className="mt-1">{quizQuestions[currentQuestion].practical}</p>
          </details>

          {/* NATYCHMIASTOWY FEEDBACK */}
          {lastAnswerCorrect !== null && (
            <div
              className={`mb-4 p-3 rounded-md border text-sm font-medium ${lastAnswerCorrect
                ? "bg-green-100 text-green-800 border-green-300"
                : "bg-red-100 text-red-800 border-red-300"
                }`}
            >
              {lastAnswerCorrect
                ? quizQuestions[currentQuestion].feedback.good
                : quizQuestions[currentQuestion].feedback.bad}
            </div>
          )}

          {/* ODPOWIEDZI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quizQuestions[currentQuestion].answers.map((ans) => (
              <button
                key={ans.id}
                onClick={() => handleAnswerClick(ans.correct)}
                className="border p-3 rounded-md hover:border-primary hover:bg-primary/5 transition"
              >
                {ans.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ORIGINAL GAME (Hidden when quiz starts) */}
      {!quizStarted && !showQuizIntro && !quizFinished && (
        <>
          <div className="mb-6 text-center">
            <Cable className="w-12 h-12 text-primary mx-auto mb-4 animate-pixel-float" />
            <h2 className="text-lg text-foreground mb-2">OKABLOWANIE RJ-45</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ułóż kable w prawidłowej kolejności zgodnie z normą T568B
            </p>
          </div>

          {/* RJ-45 CONNECTOR */}
          <div className="mb-8">
            <div className="bg-muted border-4 border-border p-6 mx-auto max-w-md">
              <div className="text-xs text-muted-foreground mb-2 text-center">ZŁĄCZE RJ-45</div>
              <div className="flex gap-1 justify-center">
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const cable = selectedCables[index]
                    ? cables.find((c) => c.id === selectedCables[index])
                    : null;
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div className={`w-8 h-24 border-2 border-border ${cable ? getCableColor(cable.color) : "bg-background"} transition-all duration-300`}>
                        {cable && (
                          <div className="h-full flex items-center justify-center">
                            <span className="text-[8px] text-black font-bold writing-mode-vertical transform rotate-180">
                              {cable.label}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-[8px] text-muted-foreground mt-1">{index + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Available Cables */}
          {!isComplete && (
            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-3 text-center">
                Wybierz kable w kolejności ({selectedCables.length}/6):
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {availableCables.map((cable) => (
                  <button
                    key={cable.id}
                    onClick={() => handleCableSelect(cable.id)}
                    disabled={selectedCables.includes(cable.id)}
                    className={`px-4 py-3 border-2 border-border arcade-button transition-all ${selectedCables.includes(cable.id) ? "opacity-30 cursor-not-allowed" : "hover:border-primary cursor-pointer"}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 ${getCableColor(cable.color)} border border-border`} />
                      <span className="text-xs text-foreground">{cable.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Result */}
          {isComplete && (
            <div className="animate-slide-in-up">
              <div className={`p-6 border-4 mb-6 text-center ${isCorrect ? "border-accent bg-accent/20" : "border-destructive bg-destructive/20"}`}>
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-3" />
                    <h3 className="text-lg text-accent mb-2">ŚWIETNIE!</h3>
                    <p className="text-xs text-accent leading-relaxed">
                      Prawidłowo okablowałeś złącze RJ-45!
                      <br />
                      Próba {attempts}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-3">❌</div>
                    <h3 className="text-lg text-destructive mb-2">NIEPRAWIDŁOWO</h3>
                    <p className="text-xs text-destructive leading-relaxed">
                      Kolejność kabli nie jest zgodna z normą T568B.
                      <br />
                      Spróbuj ponownie! (Próba {attempts})
                    </p>
                  </>
                )}
              </div>

              <Button
                onClick={handleReset}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 arcade-button"
              >
                {isCorrect ? "ZAGRAJ PONOWNIE" : "SPRÓBUJ JESZCZE RAZ"}
              </Button>
            </div>
          )}

          {!isComplete && attempts > 0 && (
            <div className="mt-4 p-3 bg-muted/50 border-2 border-border text-center">
              <p className="text-[10px] text-muted-foreground">
                💡 Wskazówka: Standard T568B to najpopularniejszy schemat okablowania
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default AutomatykGame;
