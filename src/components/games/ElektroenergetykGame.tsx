"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { 
  TrainFront, Zap, CheckCircle2, XCircle, 
  Trophy, Network, Info, Search, ChevronRight, 
  Gauge, Activity, Settings, HardHat, Radio, AlertTriangle, Lightbulb
} from "lucide-react";

/* ----------------- DANE QUIZOWE (7 PYTAŃ) ----------------- */
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
    hints: ["To standardowe napięcie zasilające pociągi w Polsce.", "Pamiętaj, że w sieci PKP PLK używamy prądu stałego."],
    usefulness: ["Podstawa wiedzy o polskiej infrastrukturze kolejowej.", "Kluczowe dla bezpieczeństwa przy pracach serwisowych."]
  },
  {
    id: 2,
    type: "multiple",
    questionText: "Które elementy wchodzą w skład 'taboru szynowego'? (Zaznacz poprawne)",
    answers: [
      { id: "a", text: "Lokomotywy elektryczne" },
      { id: "b", text: "Elektryczne Zespoły Trakcyjne (EZT)" },
      { id: "c", text: "Słupy trakcyjne i liny nośne" },
      { id: "d", text: "Wagony pasażerskie i towarowe" },
    ],
    correct: ["a", "b", "d"],
    hints: ["Tabor to pojazdy, a nie stała infrastruktura nad torami.", "Pomyśl o tym, co faktycznie się porusza."],
    usefulness: ["Kwalifikacja TKO.06 dotyczy właśnie budowy i naprawy tych maszyn.", "Pozwala odróżnić infrastrukturę od taboru."]
  },
  {
    id: 3,
    type: "single",
    questionText: "Co jest głównym zadaniem podstacji trakcyjnej?",
    answers: [
      { id: "a", text: "Sprzedaż biletów elektronicznych", correct: false },
      { id: "b", text: "Przetwarzanie prądu z sieci energetycznej na prąd trakcyjny", correct: true },
      { id: "c", text: "Produkcja szyn kolejowych", correct: false },
      { id: "d", text: "Sterowanie ruchem pociągów towarowych", correct: false },
    ],
    hints: ["To 'serce' zasilania, które zmienia parametry prądu zmiennego na stały.", "Bez tego pociągi elektryczne nie ruszą."],
    usefulness: ["Zrozumiesz proces dystrybucji energii w transporcie.", "To podstawowy obiekt pracy elektroenergetyka."]
  },
  {
    id: 4,
    type: "short",
    questionText: "Zadanie proceduralne: Jako maszynista musisz zgłosić gotowość pociągu nr 405 do odjazdu przez radio. Uzupełnij pełną komendę: 'Pociąg cztery zero pięć...'",
    correctText: "gotowy do odjazdu",
    hints: ["Użyj dokładnie trzech słów.", "Pierwsze słowo to 'gotowy'.", "Pisz małymi literami bez kropek."],
    usefulness: ["Komunikacja radiowa to krytyczny element bezpieczeństwa ruchu.", "Uczysz się dyscypliny frazeologii kolejowej."]
  },
  {
    id: 5,
    type: "single",
    questionText: "Jakie ważne uprawnienia zawodowe może zdobyć uczeń tego kierunku, niezbędne do pracy z prądem?",
    answers: [
      { id: "a", text: "Prawo jazdy kat. C+E", correct: false },
      { id: "b", text: "Uprawnienia SEP (Stowarzyszenia Elektryków Polskich)", correct: true },
      { id: "c", text: "Certyfikat pilota drona", correct: false },
      { id: "d", text: "Licencję na sprzedaż nieruchomości", correct: false },
    ],
    hints: ["Chodzi o uprawnienia eksploatacyjne (E) do 1kV lub więcej.", "To certyfikat honorowany w całej Unii Europejskiej."],
    usefulness: ["SEP to 'bilet' do pracy przy wysokich napięciach.", "Zwiększa Twoją wartość rynkową już na starcie."]
  },
  {
    id: 6,
    type: "multiple",
    questionText: "Jakie korzyści daje praca w tym zawodzie według prognoz rynku?",
    answers: [
      { id: "a", text: "Gwarantowane zatrudnienie (braki kadrowe)", correct: true },
      { id: "b", text: "Możliwość darmowych lotów samolotem", correct: false },
      { id: "c", text: "Praca przy ekologicznym transporcie przyszłości", correct: true },
      { id: "d", text: "Stabilna ścieżka awansu w spółkach PKP", correct: true },
    ],
    correct: ["a", "c", "d"],
    hints: ["Kolej to najbardziej 'zielony' środek transportu.", "Brakuje tysięcy specjalistów w całej Polsce."],
    usefulness: ["Dowiesz się, dlaczego Koleje Wielkopolskie czekają na Ciebie.", "Planowanie stabilnej kariery długofalowej."]
  },
  {
    id: 7,
    type: "single",
    questionText: "Co oznacza skrót UTK w branży kolejowej?",
    answers: [
      { id: "a", text: "Uniwersalny Tor Kolejowy", correct: false },
      { id: "b", text: "Urząd Transportu Kolejowego", correct: true },
      { id: "c", text: "Układ Trakcji Kołowej", correct: false },
      { id: "d", text: "Urząd Techniki Kablowej", correct: false },
    ],
    hints: ["To regulator rynku, który wydaje m.in. licencje maszynisty.", "Odpowiada za nadzór nad bezpieczeństwem ruchu."],
    usefulness: ["Znajomość organów nadzorczych jest wymagana na egzaminie.", "To tam będziesz załatwiać formalności zawodowe."]
  }
];

/* ----------------- WARSZTAT: ZŁOŻONA ROZDZIELNIA ----------------- */

function AdvancedPowerWorkshop({
  onFinish,
  addScore,
}: {
  onFinish: () => void;
  addScore: (points: number) => void;
}) {
  const steps = [
    { id: 1, label: "Sprawdź zabezpieczenia nadprądowe", icon: Search },
    { id: 2, label: "Odłącz uszkodzoną sekcję zasilania", icon: AlertTriangle },
    { id: 3, label: "Załącz zasilanie rezerwowe", icon: Zap },
  ];

  const correctOrder = [1, 2, 3];

  const [userOrder, setUserOrder] = useState<number[]>([]);
  const [failed, setFailed] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (userOrder.length === 0) return;

    const currentIndex = userOrder.length - 1;
    if (userOrder[currentIndex] !== correctOrder[currentIndex]) {
      setFailed(true);
      setTimeout(() => {
        setUserOrder([]);
        setFailed(false);
      }, 2500);
    }

    if (userOrder.length === correctOrder.length) {
      setCompleted(true);
      addScore(80);
      setTimeout(onFinish, 3000);
    }
  }, [userOrder]);

  return (
    <Card className="p-10 border-4 border-zinc-700 max-w-4xl w-full mx-auto bg-zinc-900 text-zinc-100 shadow-2xl relative overflow-hidden animate-in fade-in duration-500">
      {failed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-red-600/70 backdrop-blur-md z-50 flex flex-col items-center justify-center"
        >
          <AlertTriangle size={120} className="mb-6 text-white animate-bounce" />
          <h2 className="text-4xl font-black text-white uppercase">
            BŁĘDNA PROCEDURA
          </h2>
          <p className="mt-4 text-sm font-bold uppercase tracking-widest text-white">
            Zrzut napięcia i reset rozdzielni
          </p>
        </motion.div>
      )}

      <div className="mb-10">
        <h2 className="text-3xl font-black uppercase text-yellow-500 flex items-center gap-3 italic">
          <Zap className="text-yellow-500" />
          Diagnostyka Rozdzielni 3kV DC
        </h2>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-2">
          Zadanie: wykonaj poprawną kolejność działań po wykryciu usterki
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step) => {
          const used = userOrder.includes(step.id);
          return (
            <Button
              key={step.id}
              disabled={used || completed}
              onClick={() =>
                setUserOrder((prev) => [...prev, step.id])
              }
              className={`h-24 flex flex-col gap-3 font-black text-sm border-2 transition-all ${
                used
                  ? "bg-green-500/20 border-green-500 text-green-400"
                  : "bg-zinc-800 border-zinc-700 hover:border-yellow-500/50"
              }`}
            >
              <step.icon size={28} />
              <span className="text-center leading-tight">
                {step.label}
              </span>
            </Button>
          );
        })}
      </div>

      <div className="mt-10 bg-black/40 p-6 rounded-2xl border border-zinc-800">
        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
          Aktualny przebieg procedury:
        </p>
        <p className="font-mono text-sm text-yellow-500">
          {userOrder.length === 0
            ? "— oczekiwanie na decyzję operatora —"
            : userOrder.map((id) => `#${id}`).join(" → ")}
        </p>
      </div>
    </Card>
  );
}


/* ----------------- GŁÓWNY KOMPONENT ----------------- */
export default function TransportSzynowyGame() {
  const [view, setView] = useState<"quiz" | "workshop" | "summary">("quiz");
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [workshopScore, setWorkshopScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<boolean>(false);
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const [summaryIndex, setSummaryIndex] = useState(0);

  const q = quizQuestions[qIndex];

  const reasons = [
    { title: "Deficyt Specjalistów", text: "Urząd Transportu Kolejowego alarmuje: brakuje tysięcy pracowników. To gwarancja stabilnej pracy i wysokich zarobków tuż po szkole.", icon: HardHat },
    { title: "Koleje Wielkopolskie", text: "Szkoła współpracuje z lokalnym przewoźnikiem. Najlepsi uczniowie mają szansę na stypendia i pewny start zawodowy w Poznaniu.", icon: TrainFront },
    { title: "Uprawnienia SEP", text: "Nauka tutaj to nie tylko dyplom, ale też prestiżowe uprawnienia elektryczne (SEP) uznawane w całej Unii Europejskiej.", icon: Zap },
    { title: "Nowoczesny Tabor", text: "Nie będziesz pracować tylko przy starych maszynach. Poznasz pociągi wodorowe i systemy ETCS oparte na AI.", icon: Network },
    { title: "Transport Przyszłości", text: "Kolej to najbardziej ekologiczny sposób przemieszczania się. Inwestycje w ten sektor to fundament gospodarki przyszłości.", icon: Gauge },
  ];

  const check = (singleId?: string) => {
    if (showResult) return;
    let ok = false;
    if (q.type === "single") {
      ok = singleId === q.answers?.find(a => a.correct)?.id;
      setMultiSelect([singleId!]);
    } else if (q.type === "short") {
      const input = (document.getElementById('ans-in') as HTMLInputElement).value;
      ok = input.toLowerCase().trim() === q.correctText.toLowerCase();
    } else if (q.type === "multiple") {
      const sortedCorrect = [...(q.correct || [])].sort();
      const sortedUser = [...multiSelect].sort();
      ok = JSON.stringify(sortedCorrect) === JSON.stringify(sortedUser);
    }

    if (ok) setScore(s => s + 10);
    setFeedback(ok);
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-[#09090b] p-6 flex items-center justify-center font-sans text-zinc-100 selection:bg-yellow-500/30">
      <AnimatePresence mode="wait">
        {view === "quiz" && (
          <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} className="w-full max-w-3xl">
            <Card className="p-10 border-4 border-zinc-800 bg-zinc-900 shadow-[0_0_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="absolute -top-10 -right-10 opacity-5">
                <TrainFront size={250} />
              </div>

              <div className="flex justify-between items-center mb-10 relative z-10">
                <div className="flex flex-col gap-1">
                  <div className="bg-yellow-600 text-black px-3 py-0.5 rounded-sm font-black text-[9px] uppercase tracking-widest w-fit">
                    SEKTOR: ELEKTROENERGETYKA
                  </div>
                  <div className="flex gap-1 mt-1">
                    {quizQuestions.map((_, i) => (
                      <div key={i} className={`h-1 w-6 rounded-full ${i <= qIndex ? 'bg-yellow-500' : 'bg-zinc-800'}`} />
                    ))}
                  </div>
                </div>
                <div className="text-3xl font-mono font-black text-yellow-500 italic drop-shadow-md">XP: {score}</div>
              </div>

              <h3 className="text-2xl font-black mb-10 border-l-8 border-yellow-500 pl-6 uppercase tracking-tighter italic leading-tight relative z-10">
                {q.questionText}
              </h3>

              <div className="grid gap-4 mb-10 relative z-10">
                {(q.type === "single" || q.type === "multiple") && q.answers?.map(a => (
                  <Button key={a.id} variant="outline" disabled={showResult}
                    onClick={() => q.type === "single" ? check(a.id) : setMultiSelect(p => p.includes(a.id) ? p.filter(x => x !== a.id) : [...p, a.id])}
                    className={`h-16 justify-start px-8 text-sm font-black border-2 transition-all duration-300 ${showResult && (q.type === "single" ? a.correct : q.correct?.includes(a.id)) ? 'border-green-500 bg-green-500/10 text-green-400' : showResult && multiSelect.includes(a.id) ? 'border-red-500 bg-red-500/10 text-red-400' : multiSelect.includes(a.id) ? 'border-yellow-500 bg-yellow-500/5 text-yellow-500' : 'bg-zinc-800 border-zinc-700 hover:border-yellow-500/50 hover:bg-zinc-800/80'}`}>
                    <span className="w-8 h-8 rounded-lg bg-zinc-700 mr-6 flex items-center justify-center text-[10px] font-black uppercase shadow-inner">{a.id}</span>
                    {a.text}
                  </Button>
                ))}

                {q.type === "short" && !showResult && (
                  <div className="space-y-6">
                    <Input id="ans-in" className="h-20 text-center text-2xl font-black bg-black border-2 border-zinc-800 text-yellow-500 uppercase tracking-widest rounded-2xl focus:border-yellow-500 transition-all" placeholder="KOMU..." />
                    <div className="p-6 bg-blue-500/5 border-2 border-dashed border-blue-500/20 rounded-2xl flex items-center gap-4">
                      <Radio className="text-blue-400 shrink-0" size={28} />
                      <p className="text-[11px] text-blue-300/80 font-bold uppercase tracking-tight leading-relaxed italic">System radiołączności VHF: Wpisz pełną frazę zgłoszenia gotowości pociągu 405 (np. gotowy do...).</p>
                    </div>
                  </div>
                )}
              </div>

              {!showResult ? (
                <div className="space-y-6 relative z-10">
                  {q.type !== "single" && (
                    <Button className="w-full h-16 bg-yellow-600 hover:bg-yellow-500 text-black font-black text-xl shadow-[0_8px_20px_rgba(202,138,4,0.3)] transition-all active:translate-y-1" onClick={() => check()} disabled={q.type === "multiple" && multiSelect.length === 0}>
                      AUTORYZUJ ODPOWIEDŹ
                    </Button>
                  )}
                  <div className="bg-zinc-800/40 p-5 rounded-2xl border border-zinc-700/50 flex gap-4">
                    <Lightbulb className="text-yellow-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase font-black mb-1">Analiza techniczna:</p>
                      <p className="text-xs text-zinc-300 italic leading-snug">{q.hints[0]}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-8 rounded-3xl border-2 relative z-10 ${feedback ? 'bg-green-950/30 border-green-500 text-green-400' : 'bg-red-950/30 border-red-500 text-red-400'}`}>
                   <div className="flex items-center gap-6 mb-6">
                     <div className={`p-4 rounded-full ${feedback ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {feedback ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
                     </div>
                     <div>
                       <p className="font-black uppercase text-lg tracking-tight">{feedback ? "DANE POPRAWNE" : "BŁĄD DANYCH"}</p>
                       <ul className="text-[10px] opacity-80 uppercase font-bold mt-1 list-disc ml-4">
                         {q.usefulness.map((u, i) => <li key={i}>{u}</li>)}
                       </ul>
                     </div>
                   </div>
                   <Button className="w-full h-14 bg-white text-black font-black hover:bg-yellow-500 transition-all rounded-xl shadow-xl" onClick={() => {
                     setShowResult(false); setMultiSelect([]);
                     if (qIndex < quizQuestions.length - 1) setQIndex(qIndex + 1);
                     else setView("workshop");
                   }}>NASTĘPNA INSTRUKCJA <ChevronRight className="ml-2 inline" /></Button>
                </motion.div>
              )}
            </Card>
          </motion.div>
        )}

        {view === "workshop" && <AdvancedPowerWorkshop onFinish={() => setView("summary")} addScore={setWorkshopScore} />}

        {view === "summary" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-5xl">
            <Card className="bg-zinc-900 p-12 border-[12px] border-yellow-600 rounded-[4rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-yellow-500 to-transparent animate-pulse" />
               <div className="text-center mb-12">
                 <Trophy size={100} className="mx-auto text-yellow-500 mb-6" />
                 <h2 className="text-6xl font-black uppercase tracking-tighter text-white italic drop-shadow-xl">SYSTEM ZWERYFIKOWANY</h2>
                 <div className="text-[150px] leading-none font-mono font-black text-yellow-500 my-6 drop-shadow-2xl">{score + workshopScore}</div>
                 <p className="text-zinc-500 font-black uppercase tracking-[0.5em] mt-4">Poziom Kompetencji: EKSPERT</p>
               </div>

               <div className="grid lg:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    {reasons.map((r, i) => (
                      <button key={i} onClick={() => setSummaryIndex(i)}
                        className={`w-full flex items-center gap-5 p-6 rounded-[2rem] border-2 transition-all text-left ${summaryIndex === i ? "border-yellow-500 bg-yellow-500/10 scale-[1.03] shadow-2xl" : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/50"}`}>
                        <div className={summaryIndex === i ? "text-yellow-500" : "text-zinc-600"}><r.icon size={32} /></div>
                        <span className="text-[11px] font-black uppercase tracking-widest">{r.title}</span>
                      </button>
                    ))}
                  </div>
                  <div className="bg-black/80 rounded-[3rem] border-2 border-zinc-800 p-12 flex flex-col justify-center min-h-[400px] shadow-inner relative">
                    <AnimatePresence mode="wait">
                      <motion.div key={summaryIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h4 className="text-3xl font-black uppercase text-yellow-500 mb-8 italic border-b-4 border-yellow-500/20 pb-4 inline-block">{reasons[summaryIndex].title}</h4>
                        <p className="text-2xl text-zinc-300 font-medium leading-relaxed tracking-tight">{reasons[summaryIndex].text}</p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
               </div>
               <Button size="lg" className="w-full h-24 text-3xl font-black bg-white text-black hover:bg-yellow-500 mt-14 rounded-3xl transition-all uppercase italic shadow-[0_15px_40px_rgba(255,255,255,0.1)] active:scale-95" onClick={() => window.location.reload()}>RESTART SYMULACJI</Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}