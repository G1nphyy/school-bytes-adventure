"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  TrainFront, Zap, CheckCircle2, XCircle,
  Trophy, Network, Info, Search, ChevronRight,
  Gauge, HardHat, Lightbulb, Radio
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

/* ----------------- WARSZTAT: DIAGNOSTYKA ----------------- */
function PowerWorkshop({ onFinish, addScore }: { onFinish: () => void; addScore: (points: number) => void }) {
  const [userOrder, setUserOrder] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<"none" | "error" | "success">("none");
  const steps = [
    { id: 1, label: "SPRAWDŹ ZABEZPIECZENIA", icon: Search },
    { id: 2, label: "ODŁĄCZ USZKODZONĄ SEKCJĘ", icon: Zap },
    { id: 3, label: "ZAŁĄCZ ZASILANIE REZERWOWE", icon: Gauge },
  ];
  const correct = [1, 2, 3];

  const handleStep = (id: number) => {
    if (feedback === "success") return;
    const newOrder = [...userOrder, id];
    setUserOrder(newOrder);

    if (newOrder[newOrder.length - 1] !== correct[newOrder.length - 1]) {
      setFeedback("error");
      setTimeout(() => { setUserOrder([]); setFeedback("none"); }, 1500);
      return;
    }

    if (newOrder.length === correct.length) {
      setFeedback("success");
      addScore(50);
      setTimeout(onFinish, 1500);
    }
  };

  return (
      <Card className="p-6 md:p-8 border-4 max-w-4xl w-full mx-auto bg-card shadow-2xl relative overflow-hidden">
        <div className="text-center mb-8">
          <Zap className="w-12 h-12 text-blue-500 mx-auto mb-2 animate-pixel-float" />
          <h2 className="text-xl font-bold tracking-tight uppercase italic">ETAP 2: PROCEDURA AWARYJNA</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Uruchom zasilanie rezerwowe w poprawnej kolejności</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {steps.map((s) => (
              <Button
                  key={s.id}
                  disabled={userOrder.includes(s.id) || feedback !== "none"}
                  onClick={() => handleStep(s.id)}
                  className={`h-24 flex flex-col gap-2 arcade-button border-2 transition-all ${
                      userOrder.includes(s.id) ? "border-green-500 bg-green-500/10 text-green-600" : "border-border hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/20"
                  }`}
              >
                <s.icon size={24} />
                <span className="text-[10px] font-black uppercase text-center">{s.label}</span>
              </Button>
          ))}
        </div>

        {feedback === "error" && (
            <div className="p-4 bg-destructive/10 border-2 border-destructive text-destructive text-center font-bold animate-shake rounded-xl">
              BŁĄD PROCEDURY! RESET SYSTEMU...
            </div>
        )}
        {feedback === "success" && (
            <div className="p-4 bg-green-500/10 border-2 border-green-500 text-green-600 text-center font-bold animate-pulse rounded-xl">
              ZASILANIE PRZYWRÓCONE! +50 PKT
            </div>
        )}
      </Card>
  );
}


/* ----------------- GŁÓWNY KOMPONENT ----------------- */
export default function ElektroenergetykGame() {
  const [view, setView] = useState<"quiz" | "workshop" | "finished">("quiz");
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [showUsefulness, setShowUsefulness] = useState(false);
  const [locked, setLocked] = useState(false);
  const [summaryIndex, setSummaryIndex] = useState(0);

  const reasons = [
    { title: "Deficyt Specjalistów", text: "Brakuje tysięcy pracowników w sektorze energetycznym i kolejowym. To gwarancja stabilnej pracy i wysokich zarobków tuż po szkole.", icon: HardHat },
    { title: "Współpraca z KW", text: "Szkoła współpracuje z Kolejami Wielkopolskimi. Najlepsi uczniowie mają szansę na stypendia i pewny start zawodowy w Poznaniu.", icon: TrainFront },
    { title: "Uprawnienia SEP", text: "W ramach nauki zdobędziesz prestiżowe uprawnienia SEP uznawane w całej UE. To klucz do pracy przy wysokich napięciach.", icon: Zap },
    { title: "Zielona Energia", text: "Kolej to najbardziej ekologiczny transport. Pracując tutaj, realnie dbasz o środowisko, budując infrastrukturę przyszłości.", icon: Gauge },
  ];

  const q = quizQuestions[qIndex];

  const handleSingleChoice = (answerId: string) => {
    if (showResult || locked) return;
    setAnswers(prev => ({ ...prev, [q.id]: answerId }));
    setLocked(true);
    setShowResult(true);

    const isCorrect = answerId === q.answers.find(a => a.correct)?.id;
    if (isCorrect) {
      setScore(s => s + 10);
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
      setScore(s => s + 10);
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
    if (qIndex < quizQuestions.length - 1) setQIndex(i => i + 1);
    else setView("workshop");
  };

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
                    <h2 className="text-xl font-bold tracking-tight uppercase italic">SEKTOR: ELEKTROENERGETYKA</h2>
                    <p className="text-lg font-black text-blue-600 font-mono">PUNKTY: {score}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Pytanie {qIndex + 1} / {quizQuestions.length}</p>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg md:text-xl font-bold leading-tight border-l-4 border-blue-500 pl-4 uppercase italic">
                      {q.questionText}
                    </h3>

                    <div className="grid gap-3">
                      {q.type === "single" && q.answers.map(a => (
                          <Button
                              key={a.id}
                              variant="outline"
                              disabled={showResult}
                              onClick={() => handleSingleChoice(a.id)}
                              className={`h-auto p-4 justify-start text-left arcade-button border-2 transition-all hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/20 ${
                                  showResult && a.correct ? "border-accent bg-accent/20 text-accent font-bold" :
                                      showResult && answers[q.id] === a.id ? "border-destructive bg-destructive/20 text-destructive" :
                                          answers[q.id] === a.id ? "border-blue-500 bg-blue-500/20 text-blue-600 font-bold shadow-md shadow-blue-500/20" : "bg-background"
                              }`}
                          >
                            <span className="mr-3 opacity-50 font-mono font-black">{a.id.toUpperCase()}.</span>
                            {a.text}
                          </Button>
                      ))}

                      {q.type === "multiple" && q.answers.map(a => (
                          <div
                              key={a.id}
                              onClick={() => {
                                if (showResult) return;
                                const prev = answers[q.id] || [];
                                setAnswers({ ...answers, [q.id]: prev.includes(a.id) ? prev.filter((x: any) => x !== a.id) : [...prev, a.id] });
                              }}
                              className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer arcade-button transition-all hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/20 ${
                                  (answers[q.id] || []).includes(a.id) ? "border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/20" : "border-border bg-background"
                              } ${showResult ? "opacity-60 pointer-events-none" : ""}`}
                          >
                            <Checkbox checked={(answers[q.id] || []).includes(a.id)} onCheckedChange={() => {}} className="border-blue-500" />
                            <span className="text-sm font-bold uppercase tracking-tight">{a.text}</span>
                          </div>
                      ))}

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
                          </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {hintLevel < q.hints.length && !showResult && (
                          <Button
                              variant="outline" size="sm"
                              onClick={() => { setHintLevel(h => h + 1); setScore(s => s - 2); }}
                              className="w-full border-2 border-secondary text-secondary hover:bg-secondary/10 arcade-button py-4 font-black text-xs"
                          >
                            💡 ANALIZA TECHNICZNA ({hintLevel + 1}/{q.hints.length}) (KOSZT: 2 PKT)
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

          {view === "workshop" && <PowerWorkshop onFinish={() => setView("finished")} addScore={(p) => setScore(s => s + p)} />}

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
                              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left arcade-button ${
                                  summaryIndex === i
                                      ? "border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/20"
                                      : "border-border hover:border-blue-500/50 hover:bg-muted/50"
                              }`}
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
                      className="w-full h-16 text-xl font-black arcade-button bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
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