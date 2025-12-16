import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Cable, CheckCircle2, XCircle, Lightbulb } from "lucide-react";

// DND IMPORTS
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "framer-motion";

// -------------------------- QUIZ DATA (ZMODYFIKOWANE ZMIENNE: 'podpowiedzi' i 'usefulness') ---------------------------------
const securityQuestions = [
  {
    id: 1,
    question: "Które hasło jest najbezpieczniejsze?",
    options: ["password123", "P@ssw0rd!", "Tr3$#mK9@pL2", "qwerty"],
    correctAnswer: 2,
    explanation:
        "Silne hasło zawiera wielkie i małe litery, cyfry, znaki specjalne i ma co najmniej 12 znaków. Tr3$#mK9@pL2 spełnia te kryteria.",
    podpowiedzi: [
      "Najdłuższe hasło zwykle jest najbezpieczniejsze",
      "Powinno zawierać wielkie litery, cyfry i znaki specjalne",
      "Szukaj najdłuższego i najbardziej złożonego ciągu znaków",
    ],
    usefulness:
        "Wiedza o tworzeniu silnych haseł jest kluczowa w każdej pracy związanej z IT, a także w codziennym życiu, aby chronić dane klientów i własne systemy.",
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
        "Phishing to próba wyłudzenia poufnych informacji (np. haseł, danych kart) poprzez podszywanie się pod zaufane źródło (np. bank, firmę kurierską).",
    podpowiedzi: [
      "Związane z podszywaniem się pod inne osoby/firmy",
      "Często w formie fałszywych e-maili",
      "Cel: wyłudzenie danych uwierzytelniających",
    ],
    usefulness:
        "Rozpoznawanie phishingu to podstawowa umiejętność każdego pracownika i informatyka. Jest to element modułu 'Bezpieczeństwo systemów' i pomaga chronić infrastrukturę firmy przed atakami socjotechnicznymi.",
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
    explanation: "HTTPS oznacza, że połączenie jest szyfrowane i bezpieczne (HTTP + SSL/TLS), chroniąc dane przesyłane między użytkownikiem a serwerem.",
    podpowiedzi: [
      "'S' na końcu oznacza 'Secure'",
      "Dotyczy szyfrowania połączenia w przeglądarce",
      "Połączenie jest szyfrowane",
    ],
    usefulness:
        "Będziesz wykorzystywać tę wiedzę podczas projektowania bezpiecznych stron internetowych (np. w INF.03) oraz przy konfiguracji serwerów. Gwarantuje to poufność danych przesyłanych między klientem a serwerem.",
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
    explanation: "Firewall (zapora ogniowa) to system kontrolujący przychodzący i wychodzący ruch sieciowy, na podstawie ustalonych reguł bezpieczeństwa.",
    podpowiedzi: [
      "Ma związek z ochroną sieci",
      "Kontroluje przepływ danych",
      "To dosłownie 'ściana ogniowa' dla danych",
    ],
    usefulness:
        "Konfiguracja i zarządzanie zaporami sieciowymi to kluczowy element pracy administratora sieci. Jest to część zagadnień związanych z bezpieczeństwem sieci i systemów operacyjnych (np. w kwalifikacji INF.02).",
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
        "Regularne aktualizacje są kluczowe dla bezpieczeństwa - łatają wykryte luki i dodają nowe zabezpieczenia, chroniąc przed atakami.",
    podpowiedzi: [
      "Bezpieczeństwo wymaga aktualnego oprogramowania",
      "Aktualizacje zawierają poprawki bezpieczeństwa",
      "Należy aktualizować regularnie",
    ],
    usefulness:
        "Zarządzanie łatkami bezpieczeństwa (patch management) to standardowa procedura w każdej firmie IT. W kursie na technika informatyka dowiesz się, jak tworzyć polityki aktualizacji i utrzymywać systemy bez luk.",
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
        "Malware to skrót od 'malicious software' (złośliwe oprogramowanie), zaprojektowane do uszkodzenia, wyłączenia lub uzyskania dostępu do systemu komputerowego.",
    podpowiedzi: [
      "'Mal-' oznacza 'zły' lub 'złośliwy'",
      "To oprogramowanie, które szkodzi",
      "Złośliwe oprogramowanie",
    ],
    usefulness:
        "Wiedza o rodzajach złośliwego oprogramowania jest niezbędna, aby skutecznie je wykrywać i usuwać. Jest to podstawa diagnozowania i naprawy sprzętu i oprogramowania (INF.02).",
  },
];

// -------------------------- RJ GAME DATA ---------------------------------

const ItemTypes = {
  CABLE: 'cable',
};

// Typy kolorów uwzględniające kable 'biało-kolorowe'
type CableColor = "orange_white" | "orange" | "green_white" | "green" | "blue_white" | "blue" | "brown_white" | "brown";

interface CableType {
  id: number;
  color: CableColor;
  label: string;
  label_short: string;
}

const cables: CableType[] = [
  { id: 1, color: "orange_white", label: "Biało-Pomarańczowy", label_short: "W/O" },
  { id: 2, color: "orange", label: "Pomarańczowy", label_short: "O" },
  { id: 3, color: "green_white", label: "Biało-Zielony", label_short: "W/G" },
  { id: 4, color: "blue", label: "Niebieski", label_short: "B" },
  { id: 5, color: "blue_white", label: "Biało-Niebieski", label_short: "W/B" },
  { id: 6, color: "green", label: "Zielony", label_short: "G" },
  { id: 7, color: "brown_white", label: "Biało-Brązowy", label_short: "W/BR" },
  { id: 8, color: "brown", label: "Brązowy", label_short: "BR" },
];

// Prawidłowa kolejność T568B (ID kabli)
const correctOrder = [1, 2, 3, 4, 5, 6, 7, 8];

// Podpowiedzi do T568B
const rj45Hints = [
  "Norma T568B jest najczęściej stosowana i ma kolorystykę inną niż T568A.",
  "Zacznij od par 'biało-kolorowych' i 'kolorowych'. Pamiętaj, że para pomarańczowa (1-2) i zielona (3-6) są kluczowe.",
  "Pełna kolejność to: Biało-Pomarańczowy, Pomarańczowy, Biało-Zielony, Niebieski, Biało-Niebieski, Zielony, Biało-Brązowy, Brązowy.",
];


// Helper: Mapowanie ID na obiekt kabla
const getCableById = (id: number) => cables.find(c => c.id === id);

// Helper: Mapowanie koloru na klasę CSS
const getCableColor = (color: CableColor) => {
  const colorMap: Record<CableColor, string> = {
    // Kable biało-kolorowe: jasne tło z kolorową kreską
    orange_white: "bg-gray-100 border-r-4 border-orange-500",
    green_white: "bg-gray-100 border-r-4 border-green-500",
    blue_white: "bg-gray-100 border-r-4 border-blue-500",
    brown_white: "bg-gray-100 border-r-4 border-amber-700",

    // Kable jednokolorowe
    orange: "bg-orange-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    brown: "bg-amber-700",
  };
  return colorMap[color];
};

// -------------------------- DND COMPONENTS ---------------------------------

// Komponent kabla, który można przeciągać
const DraggableCable = ({ cable, currentSlotIndex, onRemove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CABLE,
    item: { id: cable.id, sourceSlotIndex: currentSlotIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
      <motion.div
          ref={drag}
          style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={() => onRemove(cable.id, currentSlotIndex)}
          className={`w-full h-full border border-border ${getCableColor(cable.color)} absolute`}
      >
        <div className="h-full flex items-center justify-center">
                 <span className="text-[8px] text-black font-bold writing-mode-vertical transform">
                     {cable.label_short}
                 </span>
        </div>
      </motion.div>
  );
};

// Komponent miejsca docelowego (slot w złączu RJ-45)
const CableSlot = ({ index, cableId, onDrop, onRemove }) => {
  const cable = cableId !== null ? getCableById(cableId) : null;

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.CABLE,
    drop: (item, monitor) => onDrop(item.id, index, item.sourceSlotIndex),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = isOver && canDrop;

  return (
      <div key={index} className="flex flex-col items-center">
        <div
            ref={drop}
            // POWIĘKSZONY ROZMIAR SLOTU: w-8 h-24
            className={`w-10 h-24 border-2 border-border relative transition-all duration-200 ${
                isActive ? "bg-primary/30" : "bg-background"
            } `}
        >
          <AnimatePresence>
            {cable && (
                <DraggableCable
                    cable={cable}
                    currentSlotIndex={index}
                    onRemove={onRemove}
                />
            )}
          </AnimatePresence>
        </div>
        <span className="text-[8px] text-muted-foreground mt-1">{index + 1}</span>
      </div>
  );
};


// Komponent źródła (dostępne kable)
const CableSource = ({ cable, isUsed, onDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CABLE,
    item: { id: cable.id, sourceSlotIndex: -1 }, // -1 oznacza, że jest ze źródła
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const opacity = isDragging ? 0 : 1;
  const cursor = isUsed ? "not-allowed" : "grab";
  // POWIĘKSZONY PADDING I ROZMIAR IKONY: px-4 py-3 i w-6 h-6
  const className = `px-4 py-3 border-2 border-border arcade-button transition-all ${isUsed ? "opacity-30 cursor-not-allowed" : "hover:border-primary cursor-pointer"}`;

  if (isUsed) return null; // Ukryj, jeśli jest użyty

  return (
      <motion.button
          key={cable.id}
          ref={drag}
          style={{ opacity, cursor }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={className}
      >
        <div className="flex items-center gap-2">
          {/* POWIĘKSZONY ROZMIAR KWADRATU KOLORU: w-6 h-6 */}
          <div className={`w-6 h-6 ${getCableColor(cable.color)} border border-border`} />
          <span className="text-xs text-foreground">{cable.label}</span>
        </div>
      </motion.button>
  );
};


// -----------------------------------------------------------------


const InformatykGame = () => {

  // QUIZ STATES
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0); // LICZBA POPRAWNYCH ODPOWIEDZI
  const [totalScore, setTotalScore] = useState(0); // ŁĄCZNA LICZBA PUNKTÓW
  const [quizComplete, setQuizComplete] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showUsefulness, setShowUsefulness] = useState(false); // Do quizu i RJ-45
  const question = securityQuestions[currentQuestion];

  // RJ GAME STATES
  const [cableSlots, setCableSlots] = useState<(number | null)[]>(new Array(correctOrder.length).fill(null));
  const [rjComplete, setRjComplete] = useState(false);
  const [rjCorrect, setRjCorrect] = useState(false);
  const [rjAttempts, setRjAttempts] = useState(0);
  const [showRjResult, setShowRjResult] = useState(false);
  const [rjHintLevel, setRjHintLevel] = useState(0); // STAN DLA PODPOWIEDZI RJ-45
  const [showRjSummary, setShowRjSummary] = useState(false); // NOWY STAN PODSUMOWANIA RJ-45

  // Wymagane, aby gra RJ-45 się nie kończyła automatycznie
  const isRjReady = cableSlots.every(id => id !== null);
  const usedCableIds = cableSlots.filter((id): id is number => id !== null);

  // Wyjaśnienie RJ-45
  const rjExplanation = rjCorrect
      ? "Gratulacje! Norma T568B to standard stosowany w większości sieci komputerowych do budowy połączeń prostych (straight-through)."
      : `Błąd. Prawidłowa kolejność T568B to: ${cables.map(c => c.label_short).join(', ')}. Konieczność nauki standardów to podstawa pracy sieciowca.`;

  const rjUsefulness = "Umiejętność prawidłowego zarabiania wtyków RJ-45 zgodnie z normami (T568A i T568B) jest podstawową, praktyczną kompetencją każdego technika informatyka (INF.02). Bez tego nie zbudujesz ani nie naprawisz żadnej sieci LAN.";
  // Używamy tagu Image, aby zasugerować diagram T568B

  // -------------------------- EFFECT ---------------------------------

  useEffect(() => {
    setCableSlots(new Array(correctOrder.length).fill(null));
  }, []);

  // -------------------------- QUIZ LOGIC ---------------------------------
  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    setShowUsefulness(false);

    // Obliczanie punktów
    if (answerIndex === question.correctAnswer) {
      setQuizScore(prevScore => prevScore + 1); // Zliczanie poprawnych odpowiedzi

      // Punktacja: +10 bazowych, minus 2 za każdą podpowiedź
      const points = 10 - (hintLevel * 2);
      setTotalScore(prevScore => prevScore + Math.max(0, points)); // Nie schodzimy poniżej 0 punktów za pytanie

      setHintLevel(0);
      setWrongAttempts(0);
    } else {
      setWrongAttempts(wrongAttempts + 1);
    }
  };

  const showHint = () => {
    if (hintLevel < question.podpowiedzi.length) {
      setHintLevel(hintLevel + 1);
    }
  };

  const toggleUsefulness = () => {
    setShowUsefulness(!showUsefulness);
  };

  const toggleRjUsefulness = () => {
    setShowUsefulness(!showUsefulness);
  };

  const handleNext = () => {
    if (currentQuestion < securityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowUsefulness(false);
      setHintLevel(0);
      setWrongAttempts(0);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowUsefulness(false);
    setQuizScore(0);
    setTotalScore(0); // RESETUJEMY TOTAL SCORE
    setQuizComplete(false);
    setRjComplete(false);
    setRjCorrect(false);
    setRjAttempts(0);
    setCableSlots(new Array(correctOrder.length).fill(null));
    setShowRjResult(false);
    setHintLevel(0);
    setWrongAttempts(0);
    setRjHintLevel(0); // Resetuj podpowiedzi RJ
    setShowRjSummary(false); // Resetuj podsumowanie RJ
  };

  // -------------------------- RJ GAME DND LOGIC ---------------------------------

  const handleDrop = useCallback((cableId: number, targetSlotIndex: number, sourceSlotIndex: number) => {
    // Blokujemy drop, jeśli już osiągnięto limit prób i wynik nie był poprawny.
    if (showRjResult && !rjCorrect && rjAttempts >= 3) return;

    setCableSlots(prevSlots => {
      const newSlots = [...prevSlots];

      // 1. Jeśli kabel pochodził ze slotu (przenoszenie wewnątrz)
      if (sourceSlotIndex !== -1 && sourceSlotIndex !== targetSlotIndex) {
        const targetCableId = newSlots[targetSlotIndex];

        // Jeśli cel jest zajęty, zamień kable miejscami
        if (targetCableId !== null) {
          newSlots[sourceSlotIndex] = targetCableId;
          newSlots[targetSlotIndex] = cableId;
        } else {
          // Jeśli cel jest pusty, po prostu przenieś
          newSlots[sourceSlotIndex] = null;
          newSlots[targetSlotIndex] = cableId;
        }
      }
      // 2. Jeśli kabel pochodził ze źródła (półki)
      else if (sourceSlotIndex === -1) {
        // Czy cel jest zajęty? Jeśli tak, nic nie rób
        if (newSlots[targetSlotIndex] === null) {
          newSlots[targetSlotIndex] = cableId;
        }
      }
      return newSlots;
    });
    setShowRjResult(false);
    setShowUsefulness(false); // Resetuj stan "Zastosowanie", aby był klikalny
  }, [showRjResult, rjCorrect, rjAttempts]);

  // Funkcja usuwająca kabel ze slotu i z powrotem do źródła
  const handleRemoveCable = useCallback((cableId: number, slotIndex: number) => {
    // Blokujemy usunięcie, jeśli już osiągnięto limit prób.
    if (showRjResult && !rjCorrect && rjAttempts >= 3) return;

    setCableSlots(prevSlots => {
      const newSlots = [...prevSlots];
      newSlots[slotIndex] = null;
      return newSlots;
    });
    setShowRjResult(false);
    setShowUsefulness(false);
  }, [showRjResult, rjCorrect, rjAttempts]);

  // Sprawdzenie poprawności po kliknięciu "Akceptuj"
  const handleCheckRjOrder = () => {
    if (!isRjReady || (showRjResult && !rjCorrect && rjAttempts >= 3)) return;

    const newAttempts = rjAttempts + 1;
    setRjAttempts(newAttempts);

    const isOrderCorrect = cableSlots.every((id, index) => id === correctOrder[index]);

    setRjCorrect(isOrderCorrect);
    setShowRjResult(true);
    setShowUsefulness(false); // Resetuj stan "Zastosowanie"

    if (isOrderCorrect) {
      // PUNKTACJA RJ-45
      let rjPoints = 0;
      if (newAttempts === 1) {
        rjPoints = 30; // 30 punktów za pierwszym razem
      } else {
        rjPoints = 15; // 15 punktów za drugim lub trzecim razem
      }

      // Kara za każdą użyta podpowiedź: -5 punktów
      const hintPenalty = rjHintLevel * 5;
      const finalRjPoints = rjPoints - hintPenalty;

      setTotalScore(prevScore => prevScore + Math.max(0, finalRjPoints)); // Aktualizacja Total Score
    }

    // ZMIANA LOGIKI: Po sukcesie LUB przekroczeniu limitu, przejdź do podsumowania RJ
    if (isOrderCorrect || newAttempts >= 3) {
      // Ustawienie poprawnej kolejności na podsumowaniu
      setCableSlots(correctOrder);
      setTimeout(() => setShowRjSummary(true), 1500);
    }
  };

  // Reset RJ-45 (po niepowodzeniu)
  const handleRjReset = () => {
    setCableSlots(new Array(correctOrder.length).fill(null));
    setShowRjResult(false);
    setShowUsefulness(false);
  };

  // Pokazywanie podpowiedzi RJ-45
  const showRjHint = () => {
    if (rjHintLevel < rj45Hints.length) {
      setRjHintLevel(rjHintLevel + 1);
    }
  };


  // -------------------------- RENDER LOGIC ---------------------------------

  // 1. OSTATNI EKRAN (Quiz + RJ Game skończone)
  if (quizComplete && rjComplete) {
    const percentage = (quizScore / securityQuestions.length) * 100;
    const rjSuccessMessage = rjCorrect
        ? `PRAWIDŁOWO w ${rjAttempts} próbach!`
        : `NIEPRAWIDŁOWO. Próby: ${rjAttempts}.`


    return (
        <Card className="bg-card border-4 border-border p-8 text-center animate-fade-in">
          <div className="mb-6">
            <div className="text-6xl mb-4">
              {rjCorrect ? "🏆" : "❌"}
            </div>
            <h2 className="text-2xl text-foreground mb-2">GRA UKOŃCZONA!</h2>
            <p className="text-xl font-bold text-accent mb-4">
              ŁĄCZNY WYNIK: {totalScore} PKT
            </p>
            <p className="text-lg text-primary mb-2">
              Wynik Poprawnych Odpowiedzi (Quiz): {quizScore}/{securityQuestions.length}
            </p>
            <p className={`text-lg mb-4 ${rjCorrect ? 'text-accent' : 'text-destructive'}`}>
              Wynik RJ-45: {rjSuccessMessage}
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              {percentage >= 70
                  ? "Doskonała znajomość cyberbezpieczeństwa i praktyczne umiejętności!"
                  : percentage >= 50
                      ? "Dobra robota! Warto jeszcze poćwiczyć teorię i kable."
                      : "Bezpieczeństwo IT i kable wymagają więcej wiedzy i praktyki!"}
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

  // 2. EKRAN PODSUMOWANIA RJ-45
  if (quizComplete && showRjSummary) {
    const rjResultMsg = rjCorrect ? "SUKCES W OKABLOWANIU" : "BRAK SUKCESU W OKABLOWANIU";

    // Uzupełnienie slotów poprawną kolejnością (zostało ustawione w handleCheckRjOrder)
    const finalSlots = correctOrder;

    return (
        <Card className="h-screen w-[35%] fixed left-0 top-0 border-r bg-card text-card-foreground flex flex-col p-6 overflow-y-auto animate-fade-in">
          <div className="mb-6 text-center">
            <Cable className="w-12 h-12 text-accent mx-auto mb-4 animate-bounce" />
            <h2 className="text-lg text-foreground mb-2">PODSUMOWANIE ETAPU RJ-45</h2>
            <p className={`text-xl font-bold ${rjCorrect ? 'text-accent' : 'text-destructive'}`}>
              {rjResultMsg}
            </p>
          </div>

          {/* Prawidłowa kolejność - ZABLOKOWANE */}
          <div className="mb-8">
            <div className="bg-muted border-4 border-border p-6 mx-auto max-w-md">
              <div className="text-xs text-muted-foreground mb-2 text-center font-bold">
                PRAWIDŁOWA KOLEJNOŚĆ T568B (1-8)
              </div>
              <div className="flex gap-2 justify-center opacity-70 pointer-events-none">
                {/* Używamy finalSlots (poprawna kolejność) do wyświetlenia */}
                {finalSlots.map((cableId, index) => {
                  const cable = getCableById(cableId);
                  return (
                      <div key={index} className="flex flex-col items-center">
                        <div className={`w-10 h-24 border-2 border-border relative bg-background`}>
                          <div className={`w-full h-full border border-border ${getCableColor(cable.color)} absolute`}>
                            <div className="h-full flex items-center justify-center">
                                          <span className="text-[8px] text-black font-bold writing-mode-vertical transform">
                                              {cable.label_short}
                                          </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[8px] text-muted-foreground mt-1">{index + 1}</span>
                      </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Wyjaśnienie i Zastosowanie */}
          <div className="mb-6 space-y-3">
            <Button
                onClick={toggleRjUsefulness}
                variant="outline"
                size="sm"
                className={`w-full border-2 ${showUsefulness ? 'border-primary/50 bg-primary/20' : 'border-border hover:border-primary/50'} text-foreground arcade-button`}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              DO CZEGO PRZYDA MI SIĘ TA WIEDZA?
            </Button>
          </div>

          {showUsefulness && (
              <div className="mb-6 animate-slide-in-up">
                <div className="p-4 border-2 border-primary/50 bg-primary/10 text-primary-foreground">
                  <p className="text-xs leading-relaxed text-foreground/80 font-semibold">{rjUsefulness}</p>
                </div>
              </div>
          )}


          {/* Rezultat */}
          <div className="mb-6 animate-slide-in-up flex-grow">
            <div
                className={`p-4 border-2 ${
                    rjCorrect
                        ? "border-accent bg-accent/20 text-accent"
                        : "border-destructive bg-destructive/20 text-destructive"
                }`}
            >
              <p className="text-xs mb-2 font-bold">
                {rjCorrect ? "✓ WYNIK: PRAWIDŁOWO!" : "✗ WYNIK: NIEPRAWIDŁOWO"}
              </p>
              <p className="text-xs leading-relaxed">{rjExplanation}</p>

              <p className="text-xs font-bold mt-2">
                Liczba prób: {rjAttempts}. Użyte podpowiedzi: {rjHintLevel}.
              </p>
            </div>
          </div>

          {/* Przycisk Końcowy */}
          <Button
              onClick={() => {
                setRjComplete(true);
                setShowRjSummary(false);
                setShowUsefulness(false);
              }}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 arcade-button"
          >
            PRZEJDŹ DO EKRANU KOŃCOWEGO →
          </Button>
        </Card>
    );
  }


  // 3. RJ GAME (główny etap - jeśli quizComplete jest true, ale showRjSummary jest false)
  if (quizComplete) {
    const attemptsLeft = 3 - rjAttempts;
    const canAttempt = rjAttempts < 3;

    return (
        <DndProvider backend={HTML5Backend}>
          <Card className="h-screen w-[35%] fixed left-0 top-0 border-r bg-card text-card-foreground flex flex-col p-6 overflow-y-auto animate-fade-in">
            <div className="mb-6 text-center">
              <Cable className="w-12 h-12 text-primary mx-auto mb-4 animate-pixel-float" />
              <h2 className="text-lg text-foreground mb-2">ETAP 2: OKABLOWANIE RJ-45</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Przeciągnij i upuść 8 kabli w złączu, zgodnie z normą T568B.
              </p>
            </div>

            {/* RJ-45 CONNECTOR (SLOTS) */}
            <div className="mb-8">
              <div className="bg-muted border-4 border-border p-6 mx-auto max-w-md">
                <div className="text-xs text-muted-foreground mb-2 text-center">
                  ZŁĄCZE RJ-45 | Pozostałe próby: {attemptsLeft > 0 ? attemptsLeft : 0}
                </div>

                {/* TUTAJ USUNIĘTO TAG Z OBRAZKIEM */}

                <div className="flex gap-2 justify-center">
                  {cableSlots.map((cableId, index) => (
                      <CableSlot
                          key={index}
                          index={index}
                          cableId={cableId}
                          onDrop={handleDrop}
                          onRemove={handleRemoveCable}
                      />
                  ))}
                </div>
              </div>
            </div>

            {/* Available Cables (SOURCE) */}
            <div className="mb-6 flex-grow">
              <p className="text-xs text-muted-foreground mb-3 text-center">
                Dostępne kable: ({usedCableIds.length}/{correctOrder.length} użyte)
              </p>
              <motion.div layout className="flex flex-wrap gap-3 justify-center">
                <AnimatePresence>
                  {cables.map((cable) => (
                      <CableSource
                          key={cable.id}
                          cable={cable}
                          isUsed={usedCableIds.includes(cable.id)}
                          onDrop={handleDrop}
                      />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* PODPOWIEDZI I AKCJA */}
            <div className="space-y-4 animate-slide-in-up">
              {/* Przycisk Podpowiedzi RJ-45 */}
              {rjHintLevel < rj45Hints.length && canAttempt && (
                  <Button
                      onClick={showRjHint}
                      variant="outline"
                      size="sm"
                      className="w-full border-2 border-secondary text-secondary hover:bg-secondary/20 arcade-button"
                  >
                    💡 POKAŻ PODPOWIEDŹ ({rjHintLevel + 1}/{rj45Hints.length}) (KOSZT: 5 PKT)
                  </Button>
              )}

              {/* Wyświetlanie Podpowiedzi RJ-45 */}
              {rjHintLevel > 0 && (
                  <div className="space-y-2">
                    {rj45Hints.slice(0, rjHintLevel).map((hint, index) => (
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

              {/* RESULT PANEL */}
              {showRjResult && (
                  <div className={`p-4 border-4 mb-4 text-center ${rjCorrect ? "border-accent bg-accent/20" : "border-destructive bg-destructive/20"}`}>
                    {rjCorrect ? (
                        <>
                          <CheckCircle2 className="w-8 h-8 text-accent mx-auto mb-2" />
                          <h3 className="text-lg text-accent mb-1">PRAWIDŁOWO!</h3>
                          <p className="text-xs text-accent">Zaraz przejdziesz do podsumowania, aby zobaczyć wyjaśnienia.</p>
                        </>
                    ) : (
                        <>
                          <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                          <h3 className="text-lg text-destructive mb-1">BŁĄD W OKABLOWANIU</h3>
                          {attemptsLeft > 0 ? (
                              <p className="text-xs text-destructive">Spróbuj ponownie. Próba: {rjAttempts}/{3}</p>
                          ) : (
                              <p className="text-xs text-destructive font-bold">WYKORZYSTANO MAKSYMALNĄ LICZBĘ PRÓB (3). Przejdź do podsumowania, aby zobaczyć rozwiązanie.</p>
                          )}

                          <Button
                              onClick={handleRjReset}
                              disabled={!canAttempt}
                              className="mt-3 w-full bg-destructive/80 text-primary-foreground hover:bg-destructive"
                          >
                            {canAttempt ? "WYCZYŚĆ I SPRÓBUJ PONOWNIE" : "ZOBACZ PODSUMOWANIE →"}
                          </Button>
                        </>
                    )}
                  </div>
              )}

              {/* ACTION BUTTON */}
              <Button
                  onClick={handleCheckRjOrder}
                  disabled={!isRjReady && canAttempt}
                  className={`w-full bg-primary text-primary-foreground hover:bg-primary/90 arcade-button ${!isRjReady && canAttempt ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {rjCorrect ? "PRZEJDŹ DO PODSUMOWANIA →" : (canAttempt ? "AKCEPTUJ KOLEJNOŚĆ" : "ZOBACZ PODSUMOWANIE →")}
              </Button>
            </div>
          </Card>
        </DndProvider>
    );
  }

  // 4. QUIZ (główny etap - renderowany tylko, jeśli quiz nie jest zakończony)
  return (
      <Card className="h-screen w-[35%] fixed left-0 top-0 border-r bg-card text-card-foreground flex flex-col p-6 overflow-y-auto">
        <div className="mb-6 text-center">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4 animate-pixel-pulse" />
          <h2 className="text-lg text-foreground mb-2">ETAP 1: CYBERBEZPIECZEŃSTWO</h2>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>
            Pytanie {currentQuestion + 1}/{securityQuestions.length}
          </span>
            <span>Łączny Wynik: {totalScore} PKT</span>
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

        {/* Hints & Usefulness Buttons */}
        <div className="mb-6 space-y-3">
          {/* Przycisk Podpowiedzi - Widoczny TYLKO jeśli nie udzielono odpowiedzi i były błędne próby */}
          {/* Używamy 'question.podpowiedzi.length' */}
          {!showResult && hintLevel < question.podpowiedzi.length && (
              <Button
                  onClick={showHint}
                  variant="outline"
                  size="sm"
                  className="w-full border-2 border-secondary text-secondary hover:bg-secondary/20 arcade-button"
              >
                💡 POKAŻ PODPOWIEDŹ ({hintLevel + 1}/{question.podpowiedzi.length}) (KOSZT: 2 PKT)
              </Button>
          )}

          {/* Wyświetlanie Podpowiedzi (jeśli kliknięto) */}
          {/* Używamy 'question.podpowiedzi' */}
          {hintLevel > 0 && !showResult && (
              <div className="space-y-2">
                {question.podpowiedzi.slice(0, hintLevel).map((hint, index) => (
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

          {/* Przycisk Zastosowania Wiedzy - Widoczny po udzieleniu odpowiedzi (showResult) */}
          {showResult && (
              <Button
                  onClick={toggleUsefulness}
                  variant="outline"
                  size="sm"
                  className={`w-full border-2 ${showUsefulness ? 'border-primary/50 bg-primary/20' : 'border-border hover:border-primary/50'} text-foreground arcade-button`}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                DO CZEGO PRZYDA MI SIĘ TA WIEDZA?
              </Button>
          )}
        </div>

        {/* Zastosowanie Wiedzy (Box) */}
        {/* Używamy 'question.usefulness' */}
        {showResult && showUsefulness && (
            <div className="mb-6 animate-slide-in-up">
              <div className="p-4 border-2 border-primary/50 bg-primary/10 text-primary-foreground">
                <p className="text-xs leading-relaxed text-foreground/80 font-semibold">{question.usefulness}</p>
              </div>
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
                <p className="text-xs font-bold mt-2">
                  Punkty za to pytanie: {Math.max(0, 10 - (hintLevel * 2))}
                </p>
              </div>
            </div>
        )}

        {/* Next Button */}
        {showResult && (
            <Button
                onClick={handleNext}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 arcade-button"
            >
              {currentQuestion < securityQuestions.length - 1 ? "NASTĘPNE PYTANIE →" : "ZACZNIJ RJ-45 →"}
            </Button>
        )}
      </Card>
  );
};

export default InformatykGame;