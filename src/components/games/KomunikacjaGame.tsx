"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  RadioTower, Signal, Settings2, CheckCircle2, XCircle,
  Lightbulb, Trophy, Zap, Network, MonitorPlay, Info, Search,
  ChevronRight, Wifi, Wrench, Cpu
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
    hints: ["Zwróć uwagę na człon 'szerokopasmowa' – dotyczy szybkich łączy danych."],
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
    hints: ["To medium wykorzystuje impulsy światła zamiast prądu elektrycznego."],
    usefulness: ["Technologia FTTH (Fiber to the Home) to obecnie standard w branży."]
  },
  {
    id: 3,
    type: "multiple",
    questionText: "Jakie usługi przesyłane są w sieciach szerokopasmowych? (Zaznacz wszystkie poprawne)",
    answers: [
      { id: "a", text: "Szybki Internet (protokół IP)" },
      { id: "b", text: "Telewizja cyfrowa (VOD, HD)" },
      { id: "c", text: "Telefonia internetowa VoIP" },
      { id: "d", text: "Przesył prądu o wysokim napięciu" },
    ],
    correct: ["a", "b", "c"],
    hints: ["Szukaj usług cyfrowych. Sieci komunikacyjne nie służą do przesyłu energii energetycznej."],
    usefulness: ["Technik konfiguruje tzw. pakiety Triple Play (Internet + TV + Telefon)."]
  },
  {
    id: 4,
    type: "short",
    questionText: "Podaj symbol popularnej wtyczki sieciowej (8-pinowej) używanej w sieciach LAN:",
    correctText: "RJ-45",
    acceptable: ["rj45", "RJ45", "rj-45"],
    hints: ["Zaczyna się od liter 'RJ'. Ma 8 miedzianych styków."],
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
    hints: ["Jej paraboliczny kształt działa jak soczewka skupiająca słabe sygnały z orbity."],
    usefulness: ["Poprawny montaż i geometria czaszy to fundament odbioru sygnału."]
  },
  {
    id: 6,
    type: "single",
    questionText: "Co oznacza skrót IP w technologii sieciowej?",
    answers: [
      { id: "a", text: "Internet Protocol", correct: true },
      { id: "b", text: "Internal Power", correct: false },
      { id: "c", text: "Instalacja Przewodowa", correct: false },
      { id: "d", text: "Input Process", correct: false },
    ],
    hints: ["To zestaw zasad (protokół) rządzący adresowaniem danych w internecie."],
    usefulness: ["Wszystkie nowoczesne systemy komunikacji opierają się na warstwie IP."]
  },
  {
    id: 7,
    type: "multiple",
    questionText: "Które elementy znajdują się w profesjonalnej szafie technicznej RACK? (Zaznacz poprawne)",
    answers: [
      { id: "a", text: "Switch (Przełącznik sieciowy)" },
      { id: "b", text: "Patchpanel (Panel krosowy)" },
      { id: "c", text: "Router" },
      { id: "d", text: "Kocioł grzewczy" },
    ],
    correct: ["a", "b", "c"],
    hints: ["Skup się na elementach służących do dystrybucji sygnału i krosowania kabli."],
    usefulness: ["Organizacja szaf technicznych to wizytówka profesjonalnego technika."]
  },
] as const;

/* ----------------- WARSZTAT SATELITARNY ----------------- */
function SatelliteWorkshop({ onFinish, addScore }: { onFinish: () => void; addScore: (points: number) => void }) {
  const TARGET = { az: 180, el: 30, skew: -5 };
  const [params, setParams] = useState({ az: 135, el: 12, skew: -25 });
  const [signal, setSignal] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const azErr = Math.abs(params.az - TARGET.az);
    const elErr = Math.abs(params.el - TARGET.el);
    const skewErr = Math.abs(params.skew - TARGET.skew);
    const strength = Math.max(0, 100 - (azErr * 2.5 + elErr * 4 + skewErr * 1.5));
    setSignal(Math.round(strength));
  }, [params]);

  const handleFinish = () => {
    if (signal >= 96) {
      setIsLocked(true);
      addScore(70);
      setTimeout(onFinish, 2000);
    }
  };

  return (
    <Card className="p-8 border-4 border-slate-700 max-w-5xl w-full mx-auto bg-slate-900 text-slate-100 shadow-2xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-blue-400 flex items-center gap-2">
            <RadioTower className="w-8 h-8" /> KALIBRATOR SATELITARNY
          </h2>
          <p className="text-xs font-bold text-slate-400 italic text-left tracking-wider">MODUŁ PRAKTYCZNY: KONFIGURACJA LNB</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border-2 border-slate-700 min-w-[160px] text-center">
          <div className={`text-4xl font-mono font-black ${signal > 90 ? 'text-green-400' : signal > 50 ? 'text-yellow-400' : 'text-red-500'}`}>
            {signal}%
          </div>
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Jakość Sygnału</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="bg-black rounded-3xl p-10 border-4 border-slate-800 flex flex-col items-center justify-center relative overflow-hidden shadow-inner h-[350px]">
          <div className="absolute inset-0 opacity-20 pointer-events-none"
               style={{backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '30px 30px'}} />

          <motion.div
            animate={{ rotateY: (params.az - 180) / 2, rotateX: (params.el - 30) * -1, rotateZ: params.skew }}
            transition={{ type: "spring", stiffness: 45 }}
            className="relative"
          >
            <div className="w-44 h-44 rounded-full border-[12px] border-slate-500 bg-slate-400 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <div className="w-1 h-28 bg-slate-700 absolute bottom-1/2 origin-bottom rotate-6" />
              <div className="w-10 h-10 bg-slate-900 rounded-lg absolute -top-5 flex items-center justify-center border-2 border-slate-600">
                 <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-8 flex flex-col justify-center">
          {[
            { label: "Azymut (Poziom)", key: "az", min: 120, max: 240 },
            { label: "Elewacja (Pion)", key: "el", min: 0, max: 60 },
            { label: "Skręt LNB (Skew)", key: "skew", min: -45, max: 45 },
          ].map((s) => (
            <div key={s.key} className="space-y-3">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-300">
                <span>{s.label}</span>
                <span className="text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded font-mono">{params[s.key as keyof typeof params]}°</span>
              </div>
              <input
                type="range" min={s.min} max={s.max}
                value={params[s.key as keyof typeof params]}
                onChange={(e) => setParams({...params, [s.key]: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          ))}

          <Button
            disabled={signal < 96 || isLocked}
            onClick={handleFinish}
            className={`h-20 text-xl font-black transition-all border-b-4 ${isLocked ? 'bg-green-600 border-green-800' : 'bg-blue-600 border-blue-800 hover:bg-blue-500 shadow-xl'}`}
          >
            {isLocked ? "POŁĄCZENIE USTALONE" : signal >= 96 ? "ZATWIERDŹ POZYCJĘ" : "SZUKANIE SATELITY..."}
          </Button>
        </div>
      </div>
    </Card>
  );
}

/* ----------------- GŁÓWNY KOMPONENT ----------------- */
export default function KomunikacjaGame() {
  const [view, setView] = useState<"quiz" | "workshop" | "summary">("quiz");
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [workshopScore, setWorkshopScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<boolean>(false);
  const [showHints, setShowHints] = useState(false);
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const [summaryIndex, setSummaryIndex] = useState(0);

  const q = quizQuestions[qIndex];

  const reasons = [
    { title: "Gwarancja pracy", text: "Według prognoz to zawód deficytowy – specjaliści od światłowodów i sieci są poszukiwani u każdego operatora.", icon: Trophy },
    { title: "Nowoczesne technologie", text: "Praca ze spawarkami światłowodowymi, systemami 5G, IoT oraz profesjonalną telewizją cyfrową.", icon: Zap },
    { title: "Infrastruktura przyszłości", text: "Będziesz budować cyfrowe fundamenty pod Sztuczną Inteligencję i inteligentne miasta (Smart City).", icon: Network },
    { title: "Własny biznes", text: "Kierunek idealnie przygotowuje do prowadzenia własnej firmy instalacyjnej w branży teleinformatycznej.", icon: Wrench },
    { title: "Prestiżowe studia", text: "Dyplom technika otwiera drogę na wydziały Elektroniki i Telekomunikacji najlepszych politechnik.", icon: Cpu },
  ];

  const handleMultipleChoice = (id: string) => {
    if (showResult) return;
    setMultiSelect(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const check = (singleId?: string) => {
    if (showResult) return;

    let ok = false;
    if (q.type === "single") {
        ok = singleId === q.answers.find(a => a.correct)?.id;
        setMultiSelect([singleId!]);
    } else if (q.type === "short") {
        const input = (document.getElementById('ans-in') as HTMLInputElement).value;
        ok = [q.correctText, ...(q.acceptable || [])].map(s => s.toLowerCase()).includes(input.toLowerCase().trim());
    } else if (q.type === "multiple") {
        const sortedCorrect = [...q.correct].sort();
        const sortedUser = [...multiSelect].sort();
        ok = JSON.stringify(sortedCorrect) === JSON.stringify(sortedUser);
    }

    if (ok) setScore(s => s + 10);
    setFeedback(ok);
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] p-6 flex items-center justify-center font-sans text-slate-100">
      <AnimatePresence mode="wait">
        {view === "quiz" && (
          <motion.div key="quiz" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -50 }} className="w-full max-w-3xl">
            <Card className="p-8 border-4 border-slate-700 bg-slate-900 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                <div className="bg-blue-600 text-white px-4 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                  STAGE 01: TEST TEORETYCZNY
                </div>
                <div className="text-2xl font-mono font-black text-blue-400 tracking-tighter">PUNKTY: {score}</div>
              </div>

              <div className="mb-4 flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                <div className="flex gap-1">
                  {quizQuestions.map((_, i) => (
                    <div key={i} className={`h-1.5 w-6 rounded-full ${i <= qIndex ? 'bg-blue-500' : 'bg-slate-800'}`} />
                  ))}
                </div>
                <span>Pytanie {qIndex + 1}</span>
              </div>

              <h3 className="text-2xl font-black mb-10 leading-tight uppercase tracking-tighter border-l-8 border-blue-500 pl-6">
                {q.questionText}
              </h3>

              <div className="grid gap-3 mb-10">
                {q.type === "single" && q.answers.map(a => (
                  <Button key={a.id} variant="outline"
                    disabled={showResult}
                    onClick={() => check(a.id)}
                    className={`h-16 justify-start px-6 text-sm font-bold border-2 transition-all ${showResult && a.correct ? 'border-green-500 bg-green-500/10 text-green-400' : showResult && multiSelect.includes(a.id) ? 'border-red-500 bg-red-500/10 text-red-400' : 'bg-slate-800/50 border-slate-700 hover:border-blue-500'}`}>
                    <span className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center mr-4 text-[10px]">{a.id.toUpperCase()}</span>
                    {a.text}
                  </Button>
                ))}

                {q.type === "multiple" && q.answers.map(a => (
                  <div key={a.id}
                    onClick={() => handleMultipleChoice(a.id)}
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${multiSelect.includes(a.id) ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800/30'} ${showResult ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Checkbox checked={multiSelect.includes(a.id)} onCheckedChange={() => {}} disabled={showResult} />
                    <label className="font-bold text-sm cursor-pointer flex-1">{a.text}</label>
                  </div>
                ))}

                {q.type === "short" && !showResult && (
                  <Input id="ans-in" className="h-16 text-xl font-bold bg-slate-800 border-2 border-slate-700 text-blue-400 text-center" placeholder="Wpisz odpowiedź..." />
                )}
              </div>

              {!showResult ? (
                <div className="space-y-4">
                  {q.type !== "single" && (
                    <Button className="w-full h-14 bg-blue-600 font-black text-lg shadow-lg hover:bg-blue-500" onClick={() => check()} disabled={q.type === "multiple" && multiSelect.length === 0}>
                      SPRAWDŹ ODPOWIEDŹ
                    </Button>
                  )}
                  <Button variant="ghost" className="w-full text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-blue-400" onClick={() => setShowHints(!showHints)}>
                    <Search className="w-3 h-3 mr-2" /> {showHints ? "UKRYJ BAZĘ PODPOWIEDZI" : "DOSTĘP DO BAZY PODPOWIEDZI"}
                  </Button>
                  {showHints && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="p-4 bg-blue-500/5 rounded border border-blue-500/20">
                      <ul className="text-[11px] font-bold text-blue-300 list-disc pl-4 space-y-1 uppercase tracking-tight">
                        {q.hints.map((h, i) => <li key={i}>{h}</li>)}
                      </ul>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className={`p-6 rounded-xl border-2 animate-in zoom-in-95 ${feedback ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-red-900/20 border-red-500 text-red-400'}`}>
                  <div className="flex items-center gap-3 font-black uppercase text-sm italic mb-4">
                    {feedback ? <CheckCircle2 /> : <XCircle />}
                    {feedback ? "SYGNAŁ POPRAWNY. +10 PKT" : "BŁĄD TRANSMISJI. DANE USZKODZONE"}
                  </div>
                  <Button className="w-full h-12 bg-white text-slate-900 font-black hover:bg-blue-50" onClick={() => {
                    setShowResult(false);
                    setShowHints(false);
                    setMultiSelect([]);
                    if (qIndex < quizQuestions.length - 1) setQIndex(qIndex + 1);
                    else setView("workshop");
                  }}>KONTYNUUJ <ChevronRight className="ml-2 w-4 h-4" /></Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {view === "workshop" && <SatelliteWorkshop onFinish={() => setView("summary")} addScore={setWorkshopScore} />}

        {view === "summary" && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-5xl">
             <Card className="bg-slate-900 p-10 border-8 border-blue-600 rounded-[2rem] shadow-2xl relative overflow-hidden">
               <div className="text-center mb-10">
                 <Trophy size={64} className="mx-auto text-yellow-500 mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                 <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">MODUŁ UKOŃCZONY</h2>
                 <div className="text-7xl font-mono font-black text-blue-400 mb-4">{score + workshopScore} PKT</div>
               </div>

               <div className="grid lg:grid-cols-2 gap-8 items-start">
                  <div className="space-y-3">
                    <p className="text-xs font-black uppercase text-slate-500 mb-4 tracking-widest border-b border-slate-800 pb-2">Perspektywy zawodowe:</p>
                    {reasons.map((r, i) => (
                      <button key={i} onClick={() => setSummaryIndex(i)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${summaryIndex === i ? "border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(37,99,235,0.1)]" : "border-slate-800 hover:border-slate-700 hover:bg-slate-800/30"}`}>
                        <r.icon className={`w-6 h-6 ${summaryIndex === i ? "text-blue-400" : "text-slate-600"}`} />
                        <span className="text-xs font-bold uppercase tracking-tight">{r.title}</span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-800/50 rounded-2xl border-2 border-slate-700 p-8 min-h-[280px] flex flex-col justify-center shadow-inner relative">
                    <div className="absolute top-4 right-4 text-blue-500/20"><Info size={40} /></div>
                    <AnimatePresence mode="wait">
                      <motion.div key={summaryIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h4 className="text-xl font-black uppercase text-blue-400 italic mb-4 tracking-tight underline decoration-blue-500/30 underline-offset-8">{reasons[summaryIndex].title}</h4>
                        <p className="text-lg text-slate-300 leading-relaxed font-medium">{reasons[summaryIndex].text}</p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
               </div>

               <Button size="lg" className="w-full h-16 text-xl font-black bg-white text-slate-900 hover:bg-blue-100 mt-10 shadow-xl" onClick={() => window.location.reload()}>RESTART SYSTEMU</Button>
             </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}