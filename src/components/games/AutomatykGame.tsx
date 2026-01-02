import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  ToggleLeft,
  ToggleRight,
  Settings2,
  Factory,
  ShieldCheck,
  Info,
  Briefcase,
  GraduationCap,
  Cpu,
  Trophy
} from "lucide-react";

// --- IMPORTY OBRAZÓW ---
import question4img from '@/assets/AutomatykZad4.png';
import question5img from '@/assets/AutomatykZad5.png';
import question6img from '@/assets/AutomatykZad6.png';
import question7img from '@/assets/AutomatykZad7.png';

// ---------------- QUIZ DATA ----------------
const quizQuestions = [
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
    practical: "Bez zamkniętego obwodu nie załączysz przekaźnika, silnika ani czujnika – to podstawa diagnostyki obwodów sterujących.",
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
    questionText: "Co to jest sterownik PLC?",
    hint: "To specjalny komputer, który cały czas powtarza trzy kroki: odczyt wejść → wykonaj program → zapisz wyjścia.",
    practical: "PLC jest sercem każdej linii produkcyjnej – od pakowania czekoladek po sterowanie turbiną w elektrowni.",
    feedback: { good: "Dokładnie! PLC to mózg automatyki.", bad: "To nie jest poprawna definicja PLC." },
    answers: [
      { id: "a", text: "Komputer osobisty", correct: false },
      { id: "b", text: "Gra video", correct: false },
      { id: "c", text: "Nadajnik Wi-Fi", correct: false },
      { id: "d", text: "Urządzenie elektroniczne, które na podstawie odebranych sygnałów steruje wyjściami", correct: true },
    ],
  },
  {
    id: 4,
    questionText: "Przedstawiony schemat elektryczny pokazuje:",
    questionImage: question4img,
    hint: "Spójrz na kontakt zwierny przekaźnika K1 – czy jest zwarty, czy rozwarty?",
    practical: "Umiejętność czytania schematów pozwala automatykowi szybko znaleźć, gdzie „ginie” sygnał.",
    feedback: { good: "Idealnie! To obwód otwarty, przekaźnik niezałączony.", bad: "Sprawdź jeszcze raz stan przekaźnika i obwodu." },
    answers: [
      { id: "a", text: "Obwód zamknięty, przekaźnik K1 załączony", correct: false },
      { id: "b", text: "Obwód zamknięty, przekaźnik K1 niezałączony", correct: false },
      { id: "c", text: "Obwód otwarty, przekaźnik K1 załączony", correct: false },
      { id: "d", text: "Obwód otwarty, przekaźnik K1 niezałączony", correct: true },
    ],
  },
  {
    id: 5,
    questionText: "Co przedstawia ten rysunek?",
    questionImage: question5img,
    hint: "Zwróć uwagę na symbol zaworu – prostokąt z kreską w środku to pneumatyka.",
    practical: "Pneumatyka jest wszędzie tam, gdzie potrzeba szybkiego i czystego ruchu.",
    feedback: { good: "Tak! To schemat pneumatyki.", bad: "To nie ten rodzaj sterowania." },
    answers: [
      { id: "a", text: "Schemat sterowania elektrycznego", correct: false },
      { id: "b", text: "Schemat sterowania pneumatycznego", correct: true },
      { id: "c", text: "Schemat sterowania hydraulicznego", correct: false },
      { id: "d", text: "Schemat programowania PLC", correct: false },
    ],
  },
  {
    id: 6,
    questionText: "Kiedy w sterowniku PLC na wyjściu %Q0.1 pojawi się sygnał sterujący?",
    questionImage: question6img,
    hint: "Wykonaj program „po kolei”: sprawdź oba wejścia i zobacz, co daje kropka AND.",
    practical: "Rozumienie logiki PLC pozwala projektować bezpieczne blokady maszyn.",
    feedback: { good: "Dokładnie! AND wymaga obu sygnałów.", bad: "Sprawdź logikę AND jeszcze raz." },
    answers: [
      { id: "a", text: "Brak sygnału na obu wejściach", correct: false },
      { id: "b", text: "Sygnał na obu wejściach", correct: false },
      { id: "c", text: "Sygnał na %I0.0, brak na %I0.1", correct: false },
      { id: "d", text: "Brak na %I0.0, sygnał na %I0.1", correct: true },
    ],
  },
  {
    id: 7,
    questionText: "Głównym elementem pomiarowym na rysunku jest:",
    questionImage: question7img,
    hint: "Turbina kręci się proporcjonalnie do przepływu.",
    practical: "Czujniki przepływu są kluczowe w instalacjach przemysłowych i gazowych.",
    feedback: { good: "Tak! Turbina to podstawa.", bad: "To nie ten element pomiarowy." },
    answers: [
      { id: "a", text: "Zwężka", correct: false },
      { id: "b", text: "Turbina", correct: true },
      { id: "c", text: "Kryza", correct: false },
      { id: "d", text: "Pływak", correct: false },
    ],
  },
];

const LAMPS_CONFIG = [
  { id: 1, color: "text-blue-400", label: "ZASILANIE" },
  { id: 2, color: "text-cyan-400", label: "CHŁODZENIE" },
  { id: 3, color: "text-indigo-500", label: "KOMUNIKACJA" },
  { id: 4, color: "text-violet-500", label: "NAPĘDY" },
  { id: 5, color: "text-emerald-500", label: "BEZPIECZEŃSTWO" },
];

const AutomatykGame = () => {
  const [gameState, setGameState] = useState<'quiz' | 'lore' | 'logic' | 'finish'>('quiz');
  const [switches, setSwitches] = useState(new Array(12).fill(false));
  const [activeLamps, setActiveLamps] = useState<number[]>([]);
  const [generatedLogic, setGeneratedLogic] = useState<{label: string, condition: (sw: boolean[]) => boolean, text: string}[]>([]);
  const [showSchoolInfo, setShowSchoolInfo] = useState(false);
  const [totalScore, setTotalScore] = useState(10);
  const [logicStartTime, setLogicStartTime] = useState<number>(0);


  // --- STATE QUIZU ---
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showPractical, setShowPractical] = useState(false);

  const generateSolvableLogic = useCallback(() => {
    const targetState = new Array(12).fill(0).map(() => Math.random() > 0.5);
    const newLogic = LAMPS_CONFIG.map((lamp, idx) => {
      const p1 = Math.floor(Math.random() * 12);
      const p2 = (p1 + 1 + Math.floor(Math.random() * 10)) % 12;
      const p3 = (p2 + 1 + Math.floor(Math.random() * 9)) % 12;
      const isP1 = targetState[p1];
      const isP2 = targetState[p2];
      const isP3 = targetState[p3];
      const op = Math.random() > 0.5 ? "&" : "|";
      const condition = (sw: boolean[]) => {
        const v1 = isP1 ? sw[p1] : !sw[p1];
        const v2 = isP2 ? sw[p2] : !sw[p2];
        const v3 = isP3 ? sw[p3] : !sw[p3];
        return op === "&" ? (v1 && v2 && v3) : (v1 || (v2 && v3));
      };
      const text = `L${idx+1} [${lamp.label}]: ${isP1 ? '' : '!' }P${p1+1} ${op} ${isP2 ? '' : '!' }P${p2+1} ${op === '&' ? '&' : '|'} ${isP3 ? '' : '!' }P${p3+1}`;
      return { label: lamp.label, condition, text };
    });
    setGeneratedLogic(newLogic);
    setSwitches(new Array(12).fill(false));
  }, []);

  useEffect(() => {
    if (generatedLogic.length > 0) {
      const active = generatedLogic
          .map((l, idx) => l.condition(switches) ? idx + 1 : null)
          .filter(id => id !== null) as number[];
      setActiveLamps(active);
    }
  }, [switches, generatedLogic]);

  const handleQuizAnswer = (ansId: string, isCorrect: boolean) => {
    if (showResult) return;
    setSelectedAnswer(ansId);
    setShowResult(true);
    if (isCorrect) {
      setScore(prev => prev + 1);
      setTotalScore(prev => prev + 10);
    }
  };

  const handleShowHint = () => {
    if (!showHint && totalScore >= 2) {
      setTotalScore(prev => prev - 2);
      setShowHint(true);
    }
  };

  const handleStartLogic = () => {
    setGameState('logic');
    setLogicStartTime(Date.now());
  };

  const handleFinishLogic = () => {
    // Bonus za czas w logice (max 50 pkt, maleje z czasem)
    const timeTaken = (Date.now() - logicStartTime) / 1000;
    const timeBonus = Math.max(10, Math.floor(50 - timeTaken / 2));
    setTotalScore(prev => prev + timeBonus);
    setGameState('finish');
  };

  const nextStep = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    setShowPractical(false);
    setShowHint(false);

    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(q => q + 1);
    } else {
      generateSolvableLogic();
      setGameState('lore');
    }
  };

  return (
     <div className="p-6 min-h-[80vh] flex items-center justify-center bg-background/95">
        <Card className="w-full max-w-4xl animate-fade-in flex flex-col">
        {/* Kontener treści, który pcha stopkę w dół */}
        <div className="flex-grow pt-12">

          {/* --- ETAP 1: QUIZ --- */}
          {gameState === 'quiz' && (
              <div className="flex flex-col h-full animate-fade-in">
                <div className="mb-6 text-center">
                  <Cpu className="w-12 h-12 text-primary mx-auto mb-4 animate-pixel-float" />
                  <h2 className="text-lg text-foreground mb-1 uppercase tracking-tight font-bold">Etap 1: Teoria Sterowania</h2>
                  <p className="text-lg font-bold text-primary mb-1">Punkty: {totalScore}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Pytanie {currentQuestion + 1} / {quizQuestions.length}</p>
                </div>

                {quizQuestions[currentQuestion].questionImage && (
                    <div className="bg-white p-4 rounded-xl border-4 border-muted mb-6 shadow-inner">
                      <img src={quizQuestions[currentQuestion].questionImage} className="mx-auto max-h-40 object-contain" alt="zadanie" />
                    </div>
                )}

                <div className="mb-6 px-6">
                  <p className="text-lg font-bold leading-tight mb-6 text-foreground">{quizQuestions[currentQuestion].questionText}</p>

                  <div className="grid grid-cols-1 gap-3">
                    {quizQuestions[currentQuestion].answers.map((ans) => {
                      const isSelected = selectedAnswer === ans.id;
                      const isCorrect = ans.correct;
                      const showCorrect = showResult && isCorrect;
                      const showWrong = showResult && isSelected && !isCorrect;

                      let stateClasses = "border-border bg-background hover:border-primary/50";
                      if (showResult) {
                        if (showCorrect) stateClasses = "border-emerald-500 bg-emerald-500/10 text-emerald-600 font-bold";
                        else if (showWrong) stateClasses = "border-destructive bg-destructive/10 text-destructive font-bold";
                        else stateClasses = "opacity-50 grayscale-[0.5]";
                      } else if (isSelected) {
                        stateClasses = "border-primary bg-primary/10";
                      }

                      return (
                          <button
                              key={ans.id}
                              disabled={showResult}
                              onClick={() => handleQuizAnswer(ans.id, ans.correct)}
                              className={`flex items-center justify-between p-4 rounded-xl border-2 text-sm text-left transition-all arcade-button ${stateClasses}`}
                          >
                            <span>{ans.text}</span>
                            {showCorrect && <CheckCircle2 className="w-5 h-5 ml-2 shrink-0" />}
                            {showWrong && <XCircle className="w-5 h-5 ml-2 shrink-0" />}
                          </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4 mb-8 px-6">
                  {!showResult && (
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShowHint}
                          disabled={totalScore < 2}
                          className="w-full border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 arcade-button h-auto py-3 whitespace-normal"
                      >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        {showHint ? "PODPOWIEDŹ AKTYWNA" : `POKAŻ PODPOWIEDŹ (KOSZT: 2 PKT)`}
                      </Button>
                  )}

                  {showHint && !showResult && (
                      <div className="p-3 bg-indigo-50 border-2 border-indigo-100 rounded-lg text-xs italic text-indigo-700 animate-in slide-in-from-top-2">
                        {quizQuestions[currentQuestion].hint}
                      </div>
                  )}

                  {showResult && (
                      <div className="animate-in zoom-in-95">
                        <div className={`p-4 rounded-xl border-4 mb-4 text-center ${selectedAnswer === quizQuestions[currentQuestion].answers.find(a => a.correct)?.id ? "border-emerald-500 bg-emerald-50/50" : "border-destructive bg-destructive/5"}`}>
                          <p className="text-sm font-bold">{selectedAnswer === quizQuestions[currentQuestion].answers.find(a => a.correct)?.id ? quizQuestions[currentQuestion].feedback.good : quizQuestions[currentQuestion].feedback.bad}</p>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPractical(!showPractical)}
                            className="w-full text-xs text-muted-foreground hover:text-primary mb-2 h-auto py-3 whitespace-normal"
                        >
                          DO CZEGO MI SIĘ TO PRZYDA?
                        </Button>

                        {showPractical && (
                            <div className="p-4 bg-primary/5 border-2 border-primary/20 rounded-xl text-xs leading-relaxed mb-4 font-medium italic">
                              {quizQuestions[currentQuestion].practical}
                            </div>
                        )}

                        <Button onClick={nextStep} className="w-full h-12 bg-primary text-white font-bold arcade-button shadow-lg shadow-primary/20 uppercase tracking-wider">
                          {currentQuestion + 1 < quizQuestions.length ? "Następne pytanie" : "Przejdź do linii produkcyjnej"}
                        </Button>
                      </div>
                  )}
                </div>
              </div>
          )}

          {/* --- ETAP 2: LORE --- */}
          {gameState === 'lore' && (
              <div className="flex flex-col h-full justify-center text-center animate-in zoom-in-95 px-4 mb-8">
                <div className="relative mb-8">
                  <Factory className="w-24 h-24 mx-auto text-primary" />
                  <div className="absolute top-0 right-1/4 w-4 h-4 bg-destructive rounded-full animate-ping"></div>
                </div>
                <h2 className="text-4xl font-black mb-4 tracking-tighter text-foreground uppercase">System Halted</h2>
                <div className="bg-slate-900 text-blue-100 p-8 rounded-3xl text-sm italic mb-10 border-b-8 border-primary shadow-2xl relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-[10px] px-3 py-1 rounded-full font-bold not-italic tracking-widest uppercase">KRYTYCZNE POWIADOMIENIE</div>
                  "Teoria opanowana, ale linia produkcyjna właśnie przestała odpowiadać. Musisz ręcznie zrekonfigurować 12 węzłów logicznych w sterowniku PLC, aby przywrócić zasilanie i komunikację."
                </div>
                <Button onClick={handleStartLogic} className="h-20 bg-primary hover:bg-primary/90 text-2xl font-black arcade-button shadow-xl shadow-primary/30 uppercase tracking-tighter">
                  Uruchom diagnostykę
                </Button>
              </div>
          )}

          {/* --- ETAP 3: LOGIKA --- */}
          {gameState === 'logic' && (
              <div className="animate-in fade-in slide-in-from-right-4 mb-8 px-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-black flex items-center gap-2 text-primary uppercase tracking-widest"><Settings2 size={18}/> PLC Logic Core v2.1</h3>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-primary uppercase">Aktualne Punkty</p>
                    <p className="text-lg font-black text-foreground">{totalScore}</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border-l-4 border-primary mb-8 font-mono shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none"></div>
                  <p className="text-primary text-[10px] font-bold mb-4 tracking-widest uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Procedural_Recovery_Sys
                  </p>
                  <div className="text-[11px] space-y-2 relative z-10">
                    {generatedLogic.map((line, idx) => {
                      const parts = line.text.split(':');
                      return (
                          <p key={idx} className="border-b border-white/5 pb-1">
                            <span className="text-indigo-400 font-bold">{parts[0]}</span>:
                            <span className="text-cyan-300 italic">{parts[1]}</span>
                          </p>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-3 mb-10">
                  {LAMPS_CONFIG.map((l) => {
                    const active = activeLamps.includes(l.id);
                    return (
                        <div key={l.id} className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${active ? `${l.color} border-current shadow-[0_0_15px_rgba(59,130,246,0.5)] bg-slate-900 scale-110` : 'bg-slate-100 text-slate-300 border-slate-200'}`}>
                            <Lightbulb size={24} fill={active ? "currentColor" : "none"} />
                          </div>
                          <span className="text-[7px] font-black mt-2 text-center leading-tight uppercase tracking-tighter">{l.label}</span>
                        </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {switches.map((val, i) => (
                      <button
                          key={i}
                          onClick={() => {const n=[...switches]; n[i]=!n[i]; setSwitches(n);}}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all arcade-button shadow-sm ${
                              val
                                  ? 'bg-primary text-white border-primary shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                                  : 'bg-background text-slate-600 border-slate-300 hover:border-primary/50'
                          }`}
                      >
                        <span className="text-sm font-mono font-black tracking-tighter">NODE_P{i+1}</span>
                        {val ? <ToggleRight size={28} className="text-white" /> : <ToggleLeft size={28} className="text-slate-300" />}
                      </button>
                  ))}
                </div>

                {activeLamps.length === 5 && (
                    <Button onClick={handleFinishLogic} className="w-full h-16 bg-emerald-500 hover:bg-emerald-600 text-white mt-8 mb-4 font-black animate-bounce shadow-xl shadow-emerald-500/20 text-xl uppercase tracking-widest">
                      Uruchom System
                    </Button>
                )}
              </div>
          )}

          {/* --- ETAP 4: KONIEC + INFO O ZAWODZIE --- */}
          {gameState === 'finish' && (
              <div className="text-center animate-in zoom-in-95 py-6 mb-8 px-6">
                {!showSchoolInfo ? (
                    <>
                      <div className="relative inline-block mb-6">
                        <Trophy className="w-20 h-20 text-yellow-500 mx-auto drop-shadow-md animate-bounce" />
                      </div>
                      <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter text-foreground">Misja Udana!</h2>

                      <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6 text-center mb-8 relative overflow-hidden">
                        <span className="relative z-10 text-xs text-muted-foreground font-bold uppercase">Twój Wynik Końcowy</span>
                        <div className="relative z-10 text-5xl font-black text-primary mt-2 drop-shadow-sm">{totalScore} <span className="text-xl font-medium text-foreground/60">PKT</span></div>
                      </div>

                      <div className="space-y-3 mb-8 text-left">
                        <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg bg-card">
                          <span className="text-xs font-bold text-muted-foreground uppercase">Poprawne odpowiedzi:</span>
                          <span className="font-bold text-foreground">{score} / {quizQuestions.length}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg bg-card">
                          <span className="text-xs font-bold text-muted-foreground uppercase">Status Logiki PLC:</span>
                          <span className="text-emerald-500 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded-full">ZSYNCHRONIZOWANO</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <Button onClick={() => setShowSchoolInfo(true)} className="h-16 bg-primary hover:bg-primary/90 font-bold flex gap-2 shadow-lg shadow-primary/20 arcade-button uppercase">
                          <Briefcase size={20} /> Dlaczego warto być automatykiem?
                        </Button>
                        <Button onClick={() => window.location.reload()} variant="outline" className="h-12 arcade-button text-xs uppercase font-bold border-2">
                          Zagraj ponownie
                        </Button>
                      </div>
                    </>
                ) : (
                    <div className="text-left animate-in slide-in-from-bottom-4">
                      <Button onClick={() => setShowSchoolInfo(false)} variant="ghost" className="mb-6 text-xs p-0 flex gap-2 hover:bg-transparent hover:text-primary">
                        ← POWRÓT DO PODSUMOWANIA
                      </Button>
                      <h3 className="text-2xl font-black text-primary mb-6 border-b-4 border-primary/20 pb-2 uppercase tracking-tighter">Twoja przyszłość w branży</h3>

                      <div className="space-y-6">
                        <section>
                          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-2">
                            <GraduationCap size={16} className="text-primary"/> Zdobywane kwalifikacje:
                          </h4>
                          <div className="bg-muted p-4 rounded-xl border-l-4 border-primary text-[12px] font-bold text-foreground leading-snug shadow-sm">
                            • ELM.01. Montaż i uruchamianie urządzeń automatyki<br/>
                            • ELM.04. Eksploatacja układów automatyki przemysłowej
                          </div>
                        </section>

                        <section>
                          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-2">
                            <Briefcase size={16} className="text-primary"/> Gdzie znajdziesz pracę?
                          </h4>
                          <p className="text-[12px] text-muted-foreground leading-relaxed italic bg-primary/5 p-4 rounded-xl border border-primary/10">
                            Wielkie firmy czekają na Ciebie: <strong>Volkswagen, Phoenix Contact, Fibaro czy Zakład Automatyki Kolejowej</strong>. Rynek potrzebuje specjalistów Przemysłu 4.0!
                          </p>
                        </section>

                        <section>
                          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-2">
                            <Info size={16} className="text-primary"/> Możliwe ścieżki kariery:
                          </h4>
                          <div className="grid grid-cols-2 gap-3 text-[10px] font-bold">
                            <div className="bg-background p-3 rounded-lg border-2 border-primary/20 text-center uppercase tracking-tighter hover:border-primary transition-colors">Programista PLC</div>
                            <div className="bg-background p-3 rounded-lg border-2 border-primary/20 text-center uppercase tracking-tighter hover:border-primary transition-colors">Główny Technolog</div>
                            <div className="bg-background p-3 rounded-lg border-2 border-primary/20 text-center uppercase tracking-tighter hover:border-primary transition-colors">Kierownik Utrzymania</div>
                            <div className="bg-background p-3 rounded-lg border-2 border-primary/20 text-center uppercase tracking-tighter hover:border-primary transition-colors">Projektant Smart Home</div>
                          </div>
                        </section>

                        <div className="bg-primary text-primary-foreground p-5 rounded-2xl shadow-xl mt-6 relative overflow-hidden mb-8">
                          <div className="absolute top-0 right-0 opacity-10"><Factory size={80}/></div>
                          <p className="text-[11px] leading-relaxed text-center font-bold uppercase italic relative z-10">
                            "Automatyka to branża przyszłości. Po ukończeniu szkoły możesz zostać nawet kierownikiem zakładu!"
                          </p>
                        </div>
                      </div>
                    </div>
                )}
              </div>
          )}
        </div>

        {/* Stopka przypięta do dołu karty */}
        <div className="mt-auto p-6 border-t flex justify-between items-center text-[10px] text-muted-foreground font-black uppercase tracking-widest shrink-0">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            Technik Automatyk
          </span>
          <div className="flex gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>System Online</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AutomatykGame;