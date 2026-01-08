"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  TrainFront, Zap, CheckCircle2, XCircle,
  Trophy, Info, Gauge, HardHat, Lightbulb,
  Radio, Power, Activity, CableCar, ZapOff, Calculator
} from "lucide-react";

/* ----------------- DANE QUIZOWE ----------------- */
const quizQuestions = [
  {
    id: 1,
    type: "single",
    questionText: "Jakie napięcie prądu stałego (DC) dominuje w polskiej sieci trakcyjnej?",
    answers: [
      { id: "a", text: "230 V", correct: false },
      { id: "b", text: "1500 V", correct: false },
      { id: "c", text: "3000 V", correct: true },
      { id: "d", text: "25 000 V", correct: false },
    ],
    hints: [
      "To standardowe napięcie zasilające pociągi w Polsce.",
      "Większość lokomotyw w Polsce (np. EU07) pracuje właśnie na 3kV DC."
    ],
    usefulness: ["Kluczowa wiedza dla bezpieczeństwa przy pracach serwisowych na kolei."]
  },
  {
    id: 2,
    type: "multiple",
    questionText: "Które elementy wchodzą w skład 'taboru szynowego'? (wszystkie poprawne)",
    answers: [
      { id: "a", text: "Lokomotywy elektryczne" },
      { id: "b", text: "Elektryczne Zespoły Trakcyjne (EZT)" },
      { id: "c", text: "Słupy trakcyjne i liny nośne" },
      { id: "d", text: "Wagony pasażerskie i towarowe" },
    ],
    correct: ["a", "b", "d"],
    hints: [
      "Tabor to pojazdy, a nie stała infrastruktura nad torami.",
      "Jeśli coś może samodzielnie lub w składzie jechać po szynach, jest taborem."
    ],
    usefulness: ["Kwalifikacja TKO.06 dotyczy budowy i naprawy tych konkretnych maszyn."]
  },
  {
    id: 3,
    type: "single",
    questionText: "Co jest głównym zadaniem podstacji trakcyjnej?",
    answers: [
      { id: "a", text: "Sprzedaż biletów elektronicznych", correct: false },
      { id: "b", text: "Przetwarzanie prądu z sieci energetycznej na prąd trakcyjny", correct: true },
      { id: "c", text: "Produkcja szyn kolejowych", correct: false },
      { id: "d", text: "Sterowanie ruchem pociągów", correct: false },
    ],
    hints: [
      "To 'serce' zasilania, które zmienia parametry prądu zmiennego na stały.",
      "Podstacja obniża napięcie z sieci zawodowej i prostuje je do 3000V DC."
    ],
    usefulness: ["To podstawowy obiekt pracy elektroenergetyka transportu szynowego."]
  },
  {
    id: 4,
    type: "short",
    questionText: "Zadanie proceduralne: Uzupełnij komendę radiową: 'Pociąg 405...'",
    correctText: "gotowy do odjazdu",
    hints: [
      "Użyj dokładnie trzech słów.",
      "Pierwsze słowo to 'gotowy'. Frazeologia kolejowa musi być precyzyjna."
    ],
    usefulness: ["Komunikacja radiowa to krytyczny element bezpieczeństwa ruchu."]
  },
  {
    id: 5,
    type: "single",
    questionText: "Jakie uprawnienia zawodowe uczeń może zdobyć w szkole, niezbędne do pracy z prądem?",
    answers: [
      { id: "a", text: "Prawo jazdy kat. C+E", correct: false },
      { id: "b", text: "Uprawnienia SEP (Stowarzyszenia Elektryków Polskich)", correct: true },
      { id: "c", text: "Certyfikat pilota drona", correct: false },
      { id: "d", text: "Licencję na sprzedaż nieruchomości", correct: false },
    ],
    hints: [
      "Chodzi o uprawnienia eksploatacyjne (E) do 1kV lub więcej.",
      "To certyfikat honorowany w całej Unii Europejskiej."
    ],
    usefulness: ["Uprawnienia SEP to Twój bilet do pracy przy wysokich napięciach."]
  },
] as const;

/* ----------------- ETAP 2: DIAGNOSTYKA OBWODU (PRAW0 OHMA) ----------------- */
function DiagnosticMathGame({ onFinish, addScore }: { onFinish: () => void; addScore: (points: number) => void }) {
  // system kar – w energetyce błąd kosztuje, więc tutaj uciekają punkty.
  const [maxStagePoints, setMaxStagePoints] = useState(80);
  const [userInput, setUserInput] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  // Zadanie: Oblicz R (Rezystancję) jeśli U=3000V i I=500A (R = U/I = 6 Ohm)
  const targetValue = "6";

  const handleVerify = () => {
    if (userInput === targetValue) {
      setStatus("success");
      addScore(maxStagePoints);
      setTimeout(onFinish, 1200);
    } else {
      setStatus("error");
      setMaxStagePoints((prev) => Math.max(10, prev - 15));
      setTimeout(() => {
        setStatus("idle");
        setUserInput("");
      }, 1500);
    }
  };

  return (
    <Card className="p-6 md:p-8 border-4 max-w-4xl w-full mx-auto bg-card shadow-2xl relative">
      <div className="text-center mb-6">
        <Calculator className="w-12 h-12 text-blue-500 mx-auto mb-2 animate-pulse" />
        <h2 className="text-xl font-bold italic uppercase tracking-tight">ETAP 2: DIAGNOSTYKA OBWODU</h2>
        <p className="text-[10px] text-muted-foreground uppercase font-black">Oblicz wymaganą rezystancję opornika rozruchowego</p>
      </div>

      <div className="bg-muted/50 p-6 rounded-2xl border-2 border-dashed border-blue-500/30 mb-6 font-mono space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span>Napięcie (U):</span>
          <span className="text-blue-600 font-black">3000 V</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span>Natężenie (I):</span>
          <span className="text-blue-600 font-black">500 A</span>
        </div>
        <div className="h-px bg-border w-full" />
        <div className="flex justify-between items-center text-lg font-black italic">
          <span>Wymagana Rezystancja (R):</span>
          <span className="animate-pulse">? Ω</span>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          type="number"
          placeholder="WPISZ WYNIK (Ω)..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="h-16 text-center text-2xl font-black border-4 border-blue-500/50"
        />
        <Button onClick={handleVerify} disabled={status !== "idle"} className="w-full h-14 arcade-button bg-blue-600 text-white font-black uppercase">
          Zatwierdź obliczenia
        </Button>
      </div>

      <div className="mt-4 flex justify-between items-center text-[10px] font-bold uppercase text-muted-foreground">
        <span>Możliwe punkty: {maxStagePoints}</span>
        {status === "error" && <span className="text-destructive animate-bounce">BŁĘDNY WYNIK! (-15 PKT)</span>}
        {status === "success" && <span className="text-green-500">PARAMETRY POPRAWNE!</span>}
      </div>
    </Card>
  );
}

/* ----------------- ETAP 3: URUCHOMIENIE TRAKCJI (LOSOWY) ----------------- */
function ShuffledTrakcjaGame({ onFinish, addScore }: { onFinish: () => void; addScore: (points: number) => void }) {
  const [maxPoints, setMaxPoints] = useState(100);
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "success" | "failure">("idle");
  const [activatedIds, setActivatedIds] = useState<number[]>([]);

  const correctOrder = [1, 2, 3, 4];
  const elements = [
    { id: 1, name: "Podstacja trakcyjna", icon: Power },
    { id: 2, name: "Sieć zasilająca", icon: Activity },
    { id: 3, name: "Sieć trakcyjna", icon: CableCar },
    { id: 4, name: "Pociąg", icon: TrainFront },
  ];

  // Losowa kolejność przycisków na ekranie
  const shuffledButtons = useMemo(() => [...elements].sort(() => Math.random() - 0.5), []);

  // sprawdza, czy gracz klika elementy w kolejności technologicznej:
  // Podstacja -> Linia zasilająca -> Sieć jezdna -> Pociąg.
  const handleElementClick = (id: number) => {
    if (status !== "idle" || activatedIds.includes(id)) return;

    if (id === correctOrder[currentStep]) {
      const newActivated = [...activatedIds, id];
      setActivatedIds(newActivated);
      if (newActivated.length === elements.length) {
        setStatus("success");
        addScore(maxPoints);
        setTimeout(onFinish, 1200);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      setStatus("failure");
      setMaxPoints((prev) => Math.max(10, prev - 20));
      setTimeout(() => {
        setActivatedIds([]);
        setCurrentStep(0);
        setStatus("idle");
      }, 1200);
    }
  };

  return (
    <Card className="p-6 md:p-8 border-4 max-w-4xl w-full mx-auto bg-card shadow-2xl relative overflow-hidden">
      <div className="text-center mb-8">
        <Zap className={`w-12 h-12 mx-auto mb-2 ${status === "success" ? "text-green-500 animate-bounce" : "text-blue-500"}`} />
        <h2 className="text-xl font-bold tracking-tight uppercase italic">ETAP 3: URUCHOMIENIE TRAKCJI</h2>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Uwaga: Elementy są przemieszane!</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {shuffledButtons.map((el) => (
          <button
            key={el.id}
            onClick={() => handleElementClick(el.id)}
            className={`relative p-6 rounded-xl border-4 transition-all flex flex-col items-center gap-3 arcade-button
              ${activatedIds.includes(el.id) ? "border-green-500 bg-green-500/20 text-green-600" : "border-border bg-background hover:border-blue-500"}
              ${status === "failure" && !activatedIds.includes(el.id) ? "opacity-50" : "opacity-100"}
            `}
          >
            <el.icon size={32} />
            <span className="text-[9px] font-black uppercase tracking-tight leading-tight text-center">{el.name}</span>
          </button>
        ))}
      </div>

      <div className="h-12 flex items-center justify-between text-[10px] font-bold uppercase">
        <span className="text-muted-foreground">Krok: {currentStep + 1}/4</span>
        <span className="text-blue-600">Dostępne punkty: {maxPoints}</span>
        {status === "failure" && <span className="text-destructive animate-shake">BŁĄD! (-20 PKT)</span>}
      </div>
    </Card>
  );
}

/* ----------------- GŁÓWNY KOMPONENT ----------------- */
export default function ElektroenergetykGame() {
  const [view, setView] = useState<"quiz" | "diagnostic" | "trakcja" | "finished">("quiz");
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [showUsefulness, setShowUsefulness] = useState(false);
  const [locked, setLocked] = useState(false);
  const [summaryIndex, setSummaryIndex] = useState(0);

  // summaryIndex pozwala nam dynamicznie przełączać opisy,
  // żeby nie zasypać użytkownika ścianą tekstu na jednym ekranie.
  const reasons = [
    { title: "Deficyt Specjalistów", text: "Brakuje tysięcy pracowników w sektorze energetycznym i kolejowym. To gwarancja stabilnej pracy i wysokich zarobków tuż po szkole.", icon: HardHat },
    { title: "Współpraca z KW", text: "Szkoła współpracuje z Kolejami Wielkopolskimi. Najlepsi uczniowie mają szansę na stypendia i pewny start zawodowy w Poznaniu.", icon: TrainFront },
    { title: "Uprawnienia SEP", text: "W ramach nauki zdobędziesz prestiżowe uprawnienia SEP uznawane w całej UE. To klucz do pracy przy wysokimi napięciami.", icon: Zap },
    { title: "Zielona Energia", text: "Kolej to najbardziej ekologiczny transport. Pracując tutaj, realnie dbasz o środowisko, budując infrastrukturę przyszłości.", icon: Gauge },
  ];

  const q = quizQuestions[qIndex];

  // Mechanizm blokady, żeby uczeń nie mógł "wyklikać" wszystkich odpowiedzi na raz
  // zanim system (i animacja) przetworzy wynik.
  const handleSingleChoice = (answerId: string) => {
    if (showResult || locked) return;
    setAnswers((prev) => ({ ...prev, [q.id]: answerId }));
    setLocked(true);
    setShowResult(true);

    const isCorrect = answerId === q.answers.find((a) => a.correct)?.id;
    if (isCorrect) {
      setScore((s) => s + 10);
      setFeedback({ ok: true, msg: "AUTORYZACJA POPRAWNA! +10 PKT" });
    } else {
      setFeedback({ ok: false, msg: "BŁĄD SYSTEMU ZASILANIA!" });
    }
    setLocked(false);
  };

  const checkAction = () => {
    if (showResult || locked) return;
    const userVal = answers[q.id];
    if (!userVal || (Array.isArray(userVal) && userVal.length === 0)) return;

    setLocked(true);
    setShowResult(true);
    let ok = false;

    if (q.type === "multiple") {
      ok = JSON.stringify([...userVal].sort()) === JSON.stringify([...q.correct].sort());
    } else if (q.type === "short") {
      ok = userVal.toLowerCase().trim() === q.correctText.toLowerCase();
    }

    if (ok) {
      setScore((s) => s + 10);
      setFeedback({ ok: true, msg: "PARAMETRY POPRAWNE! +10 PKT" });
    } else {
      setFeedback({ ok: false, msg: "NIEZGODNOŚĆ DANYCH!" });
    }
    setLocked(false);
  };

  const handleNext = () => {
    setShowResult(false);
    setFeedback(null);
    setHintLevel(0);
    setShowUsefulness(false);
    if (qIndex < quizQuestions.length - 1) setQIndex((i) => i + 1);
    else setView("diagnostic");
  };

  // responsive tweak: make spacing friendlier on mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div className="p-4 md:p-6 min-h-[80vh] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {view === "quiz" && (
          <motion.div key="quiz" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-3xl">
            <Card className="p-6 md:p-8 border-4 space-y-6 bg-card shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <TrainFront size={120} />
              </div>

              <div className="text-center mb-4">
                <Zap className="w-12 h-12 text-blue-500 mx-auto mb-2 animate-pixel-float" />
                <h2 className="text-xl font-bold tracking-tight uppercase italic">ELEKTROENERGETYKA</h2>
                <p className="text-lg font-black text-blue-600 font-mono">PUNKTY: {score}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Pytanie {qIndex + 1} / {quizQuestions.length}</p>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg md:text-xl font-bold leading-tight pl-4">
                  {q.questionText}
                </h3>

                <div className="grid gap-3">
                  {q.type === "single" && q.answers.map((a) => (
                    <Button
                      key={a.id}
                      variant="outline"
                      disabled={showResult}
                      onClick={() => handleSingleChoice(a.id)}
                      className={`relative break-words whitespace-normal h-auto p-4 justify-start text-left arcade-button border-2 transition-all ${showResult && a.correct ? "border-accent bg-accent/20 text-accent font-bold" : showResult && answers[q.id] === a.id ? "border-destructive bg-destructive/20 text-destructive" : answers[q.id] === a.id ? "border-blue-500 bg-blue-500/20 text-blue-600 font-bold shadow-md shadow-blue-500/20" : "bg-background"}`}
                    >
                      {a.text}
                    </Button>
                  ))}

                  {q.type === "multiple" && q.answers.map((a) => {
                    const isSelected = (answers[q.id] || []).includes(a.id);
                    const isCorrectOption = (q.correct || []).includes(a.id);

                    let baseClass = `flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer arcade-button transition-all hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/20 ${isSelected ? "border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/20" : "border-border bg-background"}`;

                    if (showResult) {
                      if (isCorrectOption) baseClass = "flex items-center gap-3 p-4 border-2 rounded-xl arcade-button transition-all border-accent bg-accent/10 text-accent font-semibold";
                      else if (isSelected && !isCorrectOption) baseClass = "flex items-center gap-3 p-4 border-2 rounded-xl arcade-button transition-all border-destructive bg-destructive/10 text-destructive font-semibold";
                      else baseClass = "flex items-center gap-3 p-4 border-2 rounded-xl arcade-button transition-all border-border bg-background/50 text-muted-foreground opacity-70";
                    }

                    return (
                      <div
                        key={a.id}
                        onClick={() => {
                          if (showResult) return;
                          const prev = answers[q.id] || [];
                          setAnswers({ ...answers, [q.id]: prev.includes(a.id) ? prev.filter((x: any) => x !== a.id) : [...prev, a.id] });
                        }}
                        className={baseClass + (showResult ? " pointer-events-none" : "")}
                      >
                        <Checkbox checked={isSelected} onCheckedChange={() => {}} className="border-blue-500" />
                        <span className="text-sm font-bold uppercase tracking-tight">{a.text}</span>

                        {showResult && isCorrectOption && <CheckCircle2 className="w-5 h-5 ml-auto text-accent" />}
                        {showResult && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 ml-auto text-destructive" />}
                      </div>
                    );
                  })}

                  {q.type === "short" && (
                    <div className="space-y-4">
                      <Input
                        placeholder="WPISZ FRAZĘ..."
                        disabled={showResult}
                        className="h-16 text-xl font-black border-2 border-blue-500/50 text-center uppercase tracking-widest focus-visible:ring-0 focus-visible:border-blue-500"
                        value={answers[q.id] || ""}
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      />
                      <div className="p-4 bg-blue-500/5 border-2 border-dashed border-blue-500/20 rounded-xl flex items-center gap-4">
                        <Radio className="text-blue-500 animate-pulse" size={24} />
                        <p className="text-[10px] text-blue-600 font-bold uppercase italic leading-tight">Zgłoś gotowość pociągu nr 405 przez radio...</p>
                      </div>

                      {/* Po niepoprawnej odpowiedzi pokaż poprawną frazę i ewentualne wskazówki */}
                      {showResult && feedback && !feedback.ok && (
                        <div className="p-3 mt-2 border-2 border-secondary/40 bg-secondary/10 rounded text-xs">
                          <div className="font-bold mb-1">Poprawna fraza:</div>
                          <div className="ml-2">
                            <div className="font-mono">{q.correctText}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {hintLevel < (q.hints || []).length && !showResult && (
                    <Button
                      variant="outline" size="sm"
                      onClick={() => { setHintLevel((h) => h + 1); setScore((s) => s - 2); }}
                      className="w-full border-2 border-secondary text-secondary hover:bg-secondary/10 arcade-button py-4 font-black text-xs"
                    >
                      💡 ANALIZA TECHNICZNA ({hintLevel + 1}/{(q.hints || []).length}) (KOSZT: 2 PKT)
                    </Button>
                  )}
                  {hintLevel > 0 && !showResult && (
                    <div className="p-4 border-2 border-secondary bg-secondary/10 text-secondary text-xs rounded-xl animate-slide-in-up font-medium italic">
                      {q.hints.slice(0, hintLevel).map((h, i) => <p key={i} className="mb-1">• {h}</p>)}
                    </div>
                  )}
                </div>

                {showResult && (
                  <div className="space-y-4 animate-slide-in-up">
                    <div className={`p-4 border-4 text-center rounded-xl font-black uppercase ${feedback?.ok ? "border-accent bg-accent/20 text-accent" : "border-destructive bg-destructive/20 text-destructive"}`}>
                      {feedback?.msg}
                    </div>

                    {/* Jeśli pytanie wielokrotnego wyboru było błędne, pokaż listę poprawnych opcji */}
                    {q.type === "multiple" && feedback && !feedback.ok && (
                      <div className="p-3 mt-2 border-2 border-secondary/40 bg-secondary/10 rounded text-xs">
                        <strong>Poprawne odpowiedzi:</strong>
                        <div className="mt-1 ml-3">
                          {(q.correct || []).map((id: string) => {
                            const ans = q.answers.find((x: any) => x.id === id);
                            return <div key={id}>• {ans?.text}</div>;
                          })}
                        </div>
                      </div>
                    )}

                    <Button
                      variant="outline" className="w-full border-2 hover:bg-blue-500/10 arcade-button"
                      onClick={() => setShowUsefulness(!showUsefulness)}
                    >
                      <Lightbulb className="w-4 h-4 mr-2" /> DO CZEGO PRZYDA MI SIĘ TA WIEDZA?
                    </Button>
                    {showUsefulness && (
                      <div className="p-4 border-2 border-blue-500/30 bg-blue-500/5 rounded-xl text-xs italic font-medium animate-fade-in text-muted-foreground">
                        {q.usefulness}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2">
                  {!showResult && q.type !== "single" && (
                    <Button className="w-full h-14 arcade-button bg-blue-600 text-white font-black text-lg shadow-lg shadow-blue-600/20" onClick={checkAction}>
                      ZATWIERDŹ DANE
                    </Button>
                  )}
                  {showResult && (
                    <Button className="w-full h-14 arcade-button bg-blue-600 text-white font-black text-lg shadow-lg shadow-blue-600/20" onClick={handleNext}>
                      {qIndex < quizQuestions.length - 1 ? "NASTĘPNA INSTRUKCJA" : "PRZEJDŹ DO ETAPU 2"}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {view === "diagnostic" && <DiagnosticMathGame onFinish={() => setView("trakcja")} addScore={(p) => setScore((s) => s + p)} />}

        {view === "trakcja" && <ShuffledTrakcjaGame onFinish={() => setView("finished")} addScore={(p) => setScore((s) => s + p)} />}

        {view === "finished" && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-5xl mx-auto">
            <Card className="p-6 md:p-10 border-4 shadow-2xl bg-card space-y-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-500 animate-pulse" />

              <div className="text-center">
                <Trophy size={64} className="mx-auto text-blue-500 mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">System Zweryfikowany!</h2>
                <p className="text-muted-foreground uppercase tracking-[0.2em] text-sm font-bold">Technik Elektroenergetyk Transportu Szynowego</p>
              </div>

              <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-3xl p-8 text-center max-w-md mx-auto relative group">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-2 italic">Twój Wynik Operacyjny</p>
                <div className="text-7xl font-black text-blue-600 drop-shadow-sm">{score} <span className="text-2xl font-medium text-foreground/60">PKT</span></div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-start pt-4">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-[0.2em] border-b border-border pb-2 flex items-center gap-2">
                    <Info size={14} /> Perspektywy zawodowe:
                  </h4>
                  {reasons.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => setSummaryIndex(i)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left arcade-button ${summaryIndex === i ? "border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/20" : "border-border hover:border-blue-500/50 hover:bg-muted/50"}`}
                    >
                      <r.icon className={`w-6 h-6 ${summaryIndex === i ? "text-blue-600" : "text-muted-foreground"}`} />
                      <span className="text-[10px] font-black uppercase tracking-tight leading-none">{r.title}</span>
                    </button>
                  ))}
                </div>

                <div className="bg-background/50 rounded-2xl border-2 border-border p-8 min-h-[250px] flex flex-col justify-center shadow-inner relative animate-fade-in">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={summaryIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h4 className="text-xl font-black uppercase text-blue-600 italic underline decoration-blue-500/30 underline-offset-8">
                        {reasons[summaryIndex].title}
                      </h4>
                      <p className="text-lg text-muted-foreground leading-relaxed font-bold italic">
                        {reasons[summaryIndex].text}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <Button
                size="lg"
                className="relative break-words whitespace-normal w-full min-h-16 h-auto text-xl font-black arcade-button bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
                onClick={() => window.location.assign("/")}
              >
                POWRÓT DO CENTRUM DOWODZENIA
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}