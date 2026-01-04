"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  RadioTower, Signal, CheckCircle2, XCircle,
  Trophy, Info, Search, ChevronRight, Lightbulb, Network, Wrench, Cpu
} from "lucide-react";

/* ----------------- DANE QUIZOWE ----------------- */
const quizQuestions = [
  {
    id: 1,
    type: "single",
    questionText: "Czym głównie zajmuje się technik szerokopasmowej komunikacji elektronicznej?",
    answers: [
      { id: "a", text: "Naprawą domowego sprzętu AGD", correct: false },
      { id: "b", text: "Budową sieci światłowodowych i telewizyjnych", correct: true },
      { id: "c", text: "Pisaniem artykułów do gazet", correct: false },
      { id: "d", text: "Sprzedażą telefonów w salonie", correct: false },
    ],
    hints: [
      "Zwróć uwagę na człon 'szerokopasmowa' – dotyczy szybkich łączy danych.",
      "Technik ten buduje infrastrukturę, która pozwala Ci oglądać Netflixa czy grać online bez lagów."
    ],
    usefulness: ["Zrozumiesz, że to zawód łączący elektronikę z nowoczesną telekomunikacją."]
  },
  {
    id: 2,
    type: "single",
    questionText: "Które medium transmisyjne oferuje obecnie największą przepustowość danych?",
    answers: [
      { id: "a", text: "Kabel miedziany (skrętka)", correct: false },
      { id: "b", text: "Kabel koncentryczny", correct: false },
      { id: "c", text: "Światłowód", correct: true },
      { id: "d", text: "Fale radiowe AM", correct: false },
    ],
    hints: [
      "To medium wykorzystuje impulsy światła zamiast prądu elektrycznego.",
      "Jest odporne na zakłócenia elektromagnetyczne i pozwala na przesył z prędkością światła."
    ],
    usefulness: ["Technologia FTTH (Fiber to the Home) to obecnie standard w branży."]
  },
  {
    id: 3,
    type: "multiple",
    questionText: "Jakie usługi przesyłane są w sieciach szerokopasmowych? (wszystkie poprawne)",
    answers: [
      { id: "a", text: "Szybki Internet (protokół IP)" },
      { id: "b", text: "Telewizja cyfrowa (VOD, HD)" },
      { id: "c", text: "Telefonia internetowa VoIP" },
      { id: "d", text: "Przesył prądu o wysokim napięciu" },
    ],
    correct: ["a", "b", "c"],
    hints: [
      "Szukaj usług cyfrowych. Sieci komunikacyjne nie służą do przesyłu energii.",
      "Zastanów się, co oferują operatorzy w pakietach 'wszystko w jednym' (Triple Play)."
    ],
    usefulness: ["Technik konfiguruje tzw. pakiety Triple Play (Internet + TV + Telefon)."]
  },
  {
    id: 4,
    type: "short",
    questionText: "Podaj symbol popularnej wtyczki sieciowej (8-pinowej) używanej w sieciach LAN:",
    correctText: "RJ-45",
    acceptable: ["rj45", "RJ45", "rj-45"],
    hints: [
      "Zaczyna się od liter 'RJ'. Ma 8 miedzianych styków.",
      "Z pewnością widzisz ją codziennie z tyłu swojego komputera lub routera."
    ],
    usefulness: ["Zarabianie końcówek kabli to jedna z podstawowych czynności serwisowych."]
  },
  {
    id: 5,
    type: "single",
    questionText: "Jaka jest główna rola czaszy anteny satelitarnej?",
    answers: [
      { id: "a", text: "Bezpośrednie zasilanie telewizora", correct: false },
      { id: "b", text: "Skupianie sygnału z satelity w konwerterze", correct: true },
      { id: "c", text: "Odbijanie deszczu i śniegu", correct: false },
      { id: "d", text: "Służy jako ozdoba budynku", correct: false },
    ],
    hints: [
      "Jej paraboliczny kształt działa jak soczewka skupiająca sygnały.",
      "Sama czasza to tylko reflektor – właściwy odbiór dzieje się w małym elemencie z przodu (konwerterze)."
    ],
    usefulness: ["Poprawny montaż i geometria czaszy to fundament odbioru sygnału."]
  },
] as const;

/* ----------------- WARSZTAT SATELITARNY ----------------- */
function SatelliteWorkshop({ onFinish, addScore }: { onFinish: () => void; addScore: (points: number) => void }) {
  const TARGET = { az: 180, el: 30, skew: -5 };
  const [params, setParams] = React.useState({ az: 135, el: 12, skew: -25 });
  const [signal, setSignal] = React.useState(0);
  const [isLocked, setIsLocked] = React.useState(false);

  React.useEffect(() => {
    const azErr = Math.abs(params.az - TARGET.az);
    const elErr = Math.abs(params.el - TARGET.el);
    const skewErr = Math.abs(params.skew - TARGET.skew);
    const strength = Math.max(0, 100 - (azErr * 2.5 + elErr * 4 + skewErr * 1.5));
    setSignal(Math.round(strength));
  }, [params]);

  const handleFinish = () => {
    if (signal >= 96) {
      setIsLocked(true);
      addScore(50);
      setTimeout(onFinish, 1500);
    }
  };

  return (
      <Card className="p-6 border-4 max-w-4xl w-full mx-auto bg-card text-card-foreground shadow-2xl">
        <div className="text-center mb-6">
          <RadioTower className="w-12 h-12 text-primary mx-auto mb-2 animate-pixel-float" />
          <h2 className="text-xl font-bold tracking-tight uppercase">ETAP 2: KALIBRATOR SATELITARNY</h2>
          <p className="text-xs text-muted-foreground italic">Ustaw antenę, aby uzyskać min. 96% sygnału.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-slate-950 rounded-xl p-8 border-2 border-slate-800 flex flex-col items-center justify-center relative overflow-hidden h-[300px] shadow-inner">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px'}} />
            <motion.div
                animate={{ rotateY: (params.az - 180) / 2, rotateX: (params.el - 30) * -1, rotateZ: params.skew }}
                transition={{ type: "spring", stiffness: 45 }}
            >
              <div className="w-32 h-32 rounded-full border-8 border-slate-600 bg-slate-700/50 flex items-center justify-center relative">
                <div className="w-1 h-20 bg-slate-500 absolute bottom-1/2 origin-bottom rotate-6" />
                <div className={`w-3 h-3 rounded-full ${signal > 90 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              </div>
            </motion.div>
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 p-2 rounded border border-white/10 text-center">
              <span className="font-mono text-primary font-black text-2xl">{signal}%</span>
            </div>
          </div>

          <div className="space-y-6">
            {[
              { label: "Azymut", key: "az", min: 120, max: 240 },
              { label: "Elewacja", key: "el", min: 0, max: 60 },
              { label: "Skręt LNB", key: "skew", min: -45, max: 45 },
            ].map((s) => (
                <div key={s.key} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase">
                    <span>{s.label}</span>
                    <span className="text-primary font-mono">{params[s.key as keyof typeof params]}°</span>
                  </div>
                  <input
                      type="range" min={s.min} max={s.max}
                      value={params[s.key as keyof typeof params]}
                      onChange={(e) => setParams({...params, [s.key]: parseInt(e.target.value)})}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
            ))}
            <Button
                disabled={signal < 96 || isLocked}
                onClick={handleFinish}
                className="w-full h-14 arcade-button bg-primary text-primary-foreground font-bold"
            >
              {isLocked ? "POŁĄCZENIE USTALONE" : "ZATWIERDŹ POZYCJĘ"}
            </Button>
          </div>
        </div>
      </Card>
  );
}

/* ----------------- GŁÓWNY KOMPONENT ----------------- */
export default function KomunikacjaGame() {
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
    { title: "Gwarancja pracy", text: "Specjaliści od światłowodów i sieci 5G są poszukiwani u każdego operatora (Orange, Play, lokalni dostawcy). To zawód deficytowy.", icon: Trophy },
    { title: "Nowoczesność", text: "Praca ze spawarkami światłowodowymi, systemami 5G i IoT. Budujesz cyfrowe fundamenty dla Sztucznej Inteligencji.", icon: Network },
    { title: "Własna firma", text: "Kierunek idealnie przygotowuje do prowadzenia firmy instalacyjnej. Możesz pracować na własny rachunek jako certyfikowany instalator.", icon: Wrench },
    { title: "Dalszy rozwój", text: "Dyplom technika otwiera drogę na wydziały Elektroniki i Telekomunikacji najlepszych politechnik w kraju.", icon: Cpu },
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
      setFeedback({ ok: true, msg: "PRAWIDŁOWO! +10 PKT" });
    } else {
      setFeedback({ ok: false, msg: "BŁĄD TRANSMISJI!" });
    }
    setLocked(false);
  };

  const checkMultipleOrShort = () => {
    if (showResult || locked) return;
    const userVal = answers[q.id];
    if (!userVal || (Array.isArray(userVal) && userVal.length === 0)) return;

    setLocked(true);
    setShowResult(true);
    let ok = false;

    if (q.type === "multiple") {
      ok = JSON.stringify([...userVal].sort()) === JSON.stringify([...q.correct].sort());
    } else if (q.type === "short") {
      const accepted = [q.correctText, ...(q.acceptable || [])].map(v => v.toLowerCase().trim());
      ok = accepted.includes(userVal.toLowerCase().trim());
    }

    if (ok) {
      setScore(s => s + 10);
      setFeedback({ ok: true, msg: "PRAWIDŁOWO! +10 PKT" });
    } else {
      setFeedback({ ok: false, msg: "DANE USZKODZONE!" });
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
                <Card className="p-6 md:p-8 border-4 space-y-6 bg-card shadow-2xl">
                  <div className="text-center mb-4">
                    <Signal className="w-12 h-12 text-primary mx-auto mb-2 animate-pixel-float" />
                    <h2 className="text-xl font-bold tracking-tight">ETAP 1: TEST KOMUNIKACJI</h2>
                    <p className="text-lg font-black text-primary font-mono">PUNKTY: {score}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Pytanie {qIndex + 1} / {quizQuestions.length}</p>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg md:text-xl font-bold leading-tight pl-4">
                      {q.questionText}
                    </h3>

                    <div className="grid gap-3">
                      {q.type === "single" && q.answers.map(a => (
                          <Button
                              key={a.id}
                              variant="outline"
                              disabled={showResult}
                              onClick={() => handleSingleChoice(a.id)}
                              className={`h-auto p-4 justify-start text-left arcade-button border-2 transition-all hover:border-primary hover:shadow-md hover:shadow-primary/30 hover:bg-background hover:text-white ${
                                  showResult && a.correct ? "border-accent bg-accent/20 text-accent font-bold" :
                                      showResult && answers[q.id] === a.id ? "border-destructive bg-destructive/20 text-destructive" :
                                          answers[q.id] === a.id ? "border-primary bg-primary/20 text-primary font-bold shadow-md shadow-primary/30" : "bg-background text-foreground"
                              }`}
                          >
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
                              className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer arcade-button transition-all hover:border-primary hover:shadow-md hover:shadow-primary/30 hover:bg-background ${
                                  (answers[q.id] || []).includes(a.id) ? "border-primary bg-primary/20 shadow-md shadow-primary/30" : "border-border bg-background"
                              } ${showResult ? "opacity-60 pointer-events-none" : ""}`}
                          >
                            <Checkbox checked={(answers[q.id] || []).includes(a.id)} onCheckedChange={() => {}} className="border-primary" />
                            <span className="text-sm font-medium">{a.text}</span>
                          </div>
                      ))}

                      {q.type === "short" && (
                          <Input
                              placeholder="Wpisz odpowiedź..."
                              disabled={showResult}
                              className="h-14 text-lg font-bold border-2 border-primary/50 text-center uppercase focus-visible:ring-0 focus-visible:border-primary"
                              value={answers[q.id] || ""}
                              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                          />
                      )}
                    </div>

                    <div className="space-y-3">
                      {hintLevel < q.hints.length && !showResult && (
                          <Button
                              variant="outline" size="sm"
                              onClick={() => { setHintLevel(h => h + 1); setScore(s => s - 2); }}
                              className="w-full border-2 border-secondary text-secondary hover:bg-secondary/10 arcade-button py-4"
                          >
                            💡 PODPOWIEDŹ ({hintLevel + 1}/{q.hints.length}) (KOSZT: 2 PKT)
                          </Button>
                      )}
                      {hintLevel > 0 && !showResult && (
                          <div className="p-3 border-2 border-secondary bg-secondary/10 text-secondary text-xs rounded-lg animate-slide-in-up">
                            {q.hints.slice(0, hintLevel).map((h, i) => <p key={i}>• {h}</p>)}
                          </div>
                      )}
                    </div>

                    {showResult && feedback && (
                        <div className="space-y-4 animate-slide-in-up">
                          <div className={`p-4 border-4 text-center rounded-xl ${feedback.ok ? "border-accent bg-accent/20 text-accent" : "border-destructive bg-destructive/20 text-destructive"}`}>
                            <div className="flex items-center justify-center gap-2 font-black">
                              {feedback.ok ? <CheckCircle2 /> : <XCircle />}
                              {feedback.msg}
                            </div>
                          </div>
                          <Button
                              variant="outline" className="w-full border-2 hover:bg-primary/10"
                              onClick={() => setShowUsefulness(!showUsefulness)}
                          >
                            <Lightbulb className="w-4 h-4 mr-2" /> DO CZEGO MI SIĘ TO PRZYDA?
                          </Button>
                          {showUsefulness && (
                              <div className="p-4 border-2 border-primary/30 bg-primary/5 rounded-xl text-xs italic animate-fade-in">
                                {q.usefulness}
                              </div>
                          )}
                        </div>
                    )}

                    <div className="pt-2">
                      {!showResult && q.type !== "single" && (
                          <Button className="w-full h-12 arcade-button bg-primary text-primary-foreground font-bold" onClick={checkMultipleOrShort}>
                            SPRAWDŹ ODPOWIEDŹ
                          </Button>
                      )}
                      {showResult && (
                          <Button className="w-full h-12 arcade-button bg-primary text-primary-foreground font-bold shadow-lg" onClick={handleNext}>
                            {qIndex < quizQuestions.length - 1 ? "NASTĘPNE PYTANIE" : "PRZEJDŹ DO ETAPU 2"}
                          </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
          )}

          {view === "workshop" && <SatelliteWorkshop onFinish={() => setView("finished")} addScore={(p) => setScore(s => s + p)} />}

          {view === "finished" && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-5xl mx-auto">
                <Card className="p-6 md:p-10 border-4 shadow-2xl bg-card space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-primary animate-pulse" />

                  <div className="text-center">
                    <Trophy size={64} className="mx-auto text-yellow-500 mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">Misja Ukończona!</h2>
                    <p className="text-muted-foreground uppercase tracking-[0.2em] text-sm font-bold">Technik Komunikacji Elektronicznej</p>
                  </div>

                  <div className="bg-primary/10 border-2 border-primary/30 rounded-3xl p-8 text-center max-w-md mx-auto relative group">
                    <div className="absolute inset-0 bg-primary/5 blur-xl group-hover:bg-primary/10 transition-colors rounded-full" />
                    <p className="relative z-10 text-xs font-bold text-muted-foreground uppercase mb-2">Twój Wynik Końcowy</p>
                    <div className="relative z-10 text-7xl font-black text-primary drop-shadow-sm">{score} <span className="text-2xl font-medium text-foreground/60">PKT</span></div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8 items-start pt-4">
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-[0.2em] border-b border-border pb-2 flex items-center gap-2">
                        <Info size={14} /> Dlaczego warto wybrać ten zawód?
                      </h4>
                      {reasons.map((r, i) => (
                          <button
                              key={i}
                              onClick={() => setSummaryIndex(i)}
                              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left arcade-button ${
                                  summaryIndex === i
                                      ? "border-primary bg-primary/10 shadow-md shadow-primary/20"
                                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                              }`}
                          >
                            <r.icon className={`w-6 h-6 ${summaryIndex === i ? "text-primary" : "text-muted-foreground"}`} />
                            <span className="text-xs font-bold uppercase tracking-tight">{r.title}</span>
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
                          <h4 className="text-xl font-black uppercase text-primary italic underline decoration-primary/30 underline-offset-8">
                            {reasons[summaryIndex].title}
                          </h4>
                          <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                            {reasons[summaryIndex].text}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  <Button
                      size="lg"
                      className="w-full h-16 text-xl font-black arcade-button bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                      onClick={() => window.location.assign("/")}
                  >
                    WRÓĆ DO MENU GŁÓWNEGO
                  </Button>
                </Card>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}