import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Lightbulb, ToggleLeft, ToggleRight, Settings2, Factory, AlertTriangle, ShieldCheck, Info, Briefcase, GraduationCap } from "lucide-react";

// --- IMPORTY OBRAZÓW (NIENARUSZONE) ---
import question4img from '@/assets/AutomatykZad4.png';
import question5img from '@/assets/AutomatykZad5.png';
import question6img from '@/assets/AutomatykZad6.png';
import question7img from '@/assets/AutomatykZad7.png';

// ---------------- PIERWOTNY QUIZ ----------------
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
    practical: "PLC jest sercem każdej linii produkcyjnej – od pakowania czekoladek po sterowanie turbiną w elektrowni.",
    feedback: { good: "Dokładnie! PLC to mózg automatyki.", bad: "To nie jest poprawna definicja PLC." },
    answers: [
      { id: "a", text: "Komputer osobisty", correct: false },
      { id: "b", text: "Gra video", correct: false },
      { id: "c", text: "Nadajnik Wi-Fi", correct: false },
      { id: "d", text: "Urządzenie elektroniczne, które na podstawie odebranych sygnałów na swoich wejściach, uruchamia odpowiednie sygnały na swoich wyjściach", correct: true },
    ],
  },
  {
    id: 4,
    questionText: "Przedstawiony schemat elektryczny pokazuje",
    questionImage: question4img,
    hint: "Spójrz na kontakt zwierny przekaźnika K1 – czy jest zwarty, czy rozwarty?",
    practical: "Umiejętność czytania schematów pozwala automatykowi szybko znaleźć, gdzie „ginie” sygnał.",
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
    questionText: "Do pomiaru przepływu gazu w rurociągu na przedstawionym rysunku, głównym elementem jest",
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
  { id: 1, color: "text-yellow-400", label: "ZASILANIE" },
  { id: 2, color: "text-cyan-400", label: "CHŁODZENIE" },
  { id: 3, color: "text-blue-500", label: "KOMUNIKACJA" },
  { id: 4, color: "text-orange-500", label: "NAPĘDY" },
  { id: 5, color: "text-green-500", label: "BEZPIECZEŃSTWO" },
];

const AutomatykGame = () => {
  const [gameState, setGameState] = useState<'quiz' | 'lore' | 'logic' | 'finish'>('quiz');
  const [switches, setSwitches] = useState(new Array(12).fill(false));
  const [activeLamps, setActiveLamps] = useState<number[]>([]);
  const [generatedLogic, setGeneratedLogic] = useState<{label: string, condition: (sw: boolean[]) => boolean, text: string}[]>([]);
  const [showSchoolInfo, setShowSchoolInfo] = useState(false);

  // --- STATE QUIZU ---
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [attemptNumber, setAttemptNumber] = useState<1 | 2>(1);

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

  const handleQuizAnswer = (correct: boolean) => {
    setLastAnswerCorrect(correct);
    if (correct) {
      setScore(prev => prev + (attemptNumber === 1 ? 1 : 0.5));
      setTimeout(() => {
        setLastAnswerCorrect(null);
        if (currentQuestion + 1 < quizQuestions.length) {
          setCurrentQuestion(q => q + 1);
          setAttemptNumber(1); setShowHint(false);
        } else {
          generateSolvableLogic();
          setGameState('lore');
        }
      }, 2000);
    } else {
      if (attemptNumber === 1) {
        setAttemptNumber(2);
        setTimeout(() => setLastAnswerCorrect(null), 1500);
      } else {
        setTimeout(() => {
          setLastAnswerCorrect(null);
          if (currentQuestion + 1 < quizQuestions.length) {
            setCurrentQuestion(q => q + 1);
            setAttemptNumber(1); setShowHint(false);
          } else {
            generateSolvableLogic();
            setGameState('lore');
          }
        }, 2000);
      }
    }
  };

  return (
    <Card className="h-screen w-[35%] fixed left-0 top-0 border-r bg-card flex flex-col p-6 overflow-y-auto">

      {/* --- ETAP 1: QUIZ --- */}
      {gameState === 'quiz' && (
        <div className="text-center animate-fade-in">
          <h3 className="text-lg mb-2 font-semibold">Pytanie {currentQuestion + 1} / {quizQuestions.length}</h3>
          {quizQuestions[currentQuestion].questionImage && (
            <img src={quizQuestions[currentQuestion].questionImage} className="mx-auto w-full max-h-48 object-contain rounded-lg shadow-md mb-4 bg-white p-2" alt="zadanie" />
          )}
          <p className="text-xl mb-4 font-bold leading-snug">{quizQuestions[currentQuestion].questionText}</p>
          <div className="mb-4 text-center">
            <Button variant="outline" size="sm" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Ukryj podpowiedź" : "Pokaż podpowiedź"}
            </Button>
            {showHint && <div className="mt-2 text-sm text-muted-foreground italic bg-muted p-2 rounded">{quizQuestions[currentQuestion].hint}</div>}
            <div className="mt-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              {attemptNumber === 1 ? "Dwie szanse (1 pkt)" : "Ostatnia szansa (0.5 pkt)"}
            </div>
          </div>
          <details className="mb-4 text-left text-sm text-muted-foreground cursor-pointer">
            <summary className="font-semibold">Do czego mi się to przyda?</summary>
            <p className="mt-1">{quizQuestions[currentQuestion].practical}</p>
          </details>
          <div className="grid grid-cols-1 gap-3">
            {quizQuestions[currentQuestion].answers.map((ans) => (
              <button key={ans.id} onClick={() => handleQuizAnswer(ans.correct)} className="border p-3 rounded-md hover:bg-accent text-sm text-left transition font-medium">
                {ans.text}
              </button>
            ))}
          </div>
          {lastAnswerCorrect !== null && (
            <div className={`mt-4 p-3 rounded-md border text-sm font-bold ${lastAnswerCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {lastAnswerCorrect ? quizQuestions[currentQuestion].feedback.good : quizQuestions[currentQuestion].feedback.bad}
            </div>
          )}
        </div>
      )}

      {/* --- ETAP 2: LORE --- */}
      {gameState === 'lore' && (
        <div className="flex flex-col h-full justify-center text-center animate-in zoom-in-95">
          <Factory className="w-20 h-20 mx-auto text-blue-600 mb-6" />
          <h2 className="text-3xl font-black mb-4">SYSTEM OFFLINE</h2>
          <p className="bg-slate-900 text-blue-100 p-6 rounded-2xl text-sm italic mb-8 border-b-4 border-blue-500">
            "Teoria zaliczona! Ale linia produkcyjna stoi. Musisz ustawić 12 przełączników zgodnie z nowym schematem PLC, aby przywrócić pracę. Każda sekcja musi dostać zielone światło!"
          </p>
          <Button onClick={() => setGameState('logic')} className="h-16 bg-blue-600 hover:bg-blue-700 text-xl font-bold">
            URUCHOM DIAGNOSTYKĘ
          </Button>
        </div>
      )}

      {/* --- ETAP 3: LOGIKA --- */}
      {gameState === 'logic' && (
        <div className="animate-in fade-in slide-in-from-right-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black flex items-center gap-2 text-blue-600"><Settings2 size={18}/> PLC LOGIC CORE</h3>
            <Button variant="ghost" size="sm" onClick={generateSolvableLogic} className="text-[9px] border h-6">REGENERUJ KOD</Button>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border-t-2 border-blue-500 mb-6 font-mono text-slate-300">
            <p className="text-blue-400 text-[9px] font-bold mb-2 tracking-widest uppercase">// PROCEDURAL_RECOVERY_SYS</p>
            <div className="text-[10px] space-y-1">
              {generatedLogic.map((line, idx) => {
                const parts = line.text.split(':');
                return (
                  <p key={idx}>
                    <span className="text-orange-400 font-bold">{parts[0]}</span>:
                    <span className="text-cyan-300 italic">{parts[1]}</span>
                  </p>
                )
              })}
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2 mb-8">
            {LAMPS_CONFIG.map((l) => {
              const active = activeLamps.includes(l.id);
              return (
                <div key={l.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${active ? `${l.color} border-current shadow-lg bg-slate-800` : 'bg-slate-100 text-slate-300 border-slate-200'}`}>
                    <Lightbulb size={18} fill={active ? "currentColor" : "none"} />
                  </div>
                  <span className="text-[6px] font-bold mt-1 text-center leading-tight uppercase">{l.label}</span>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {switches.map((val, i) => (
              <button key={i} onClick={() => {const n=[...switches]; n[i]=!n[i]; setSwitches(n);}} className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${val ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-slate-400'}`}>
                <span className="text-[10px] font-mono font-bold">P{i+1}</span>
                {val ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
              </button>
            ))}
          </div>
          {activeLamps.length === 5 && (
            <Button onClick={() => setGameState('finish')} className="w-full h-14 bg-green-600 mt-6 font-black animate-bounce shadow-lg">
              URUCHOM SYSTEM
            </Button>
          )}
        </div>
      )}

      {/* --- ETAP 4: KONIEC + INFO O ZAWODZIE --- */}
      {gameState === 'finish' && (
        <div className="text-center animate-in zoom-in-95 py-6">
          {!showSchoolInfo ? (
            <>
              <ShieldCheck className="w-20 h-20 mx-auto text-green-500 mb-6" />
              <h2 className="text-3xl font-black mb-2 uppercase">MISJA UDANA!</h2>
              <p className="text-sm text-slate-500 mb-8">System przywrócony. Twój wynik: <strong>{score}/7</strong></p>

              <div className="flex flex-col gap-3">
                <Button onClick={() => setShowSchoolInfo(true)} className="h-14 bg-blue-600 hover:bg-blue-700 font-bold flex gap-2 shadow-lg">
                  <Briefcase size={20} /> DLACZEGO WARTO BYĆ AUTOMATYKIEM?
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline" className="h-12">
                  ZAGRAJ PONOWNIE
                </Button>
              </div>
            </>
          ) : (
            <div className="text-left animate-in slide-in-from-bottom-4">
              <Button onClick={() => setShowSchoolInfo(false)} variant="ghost" className="mb-4 text-xs p-0 flex gap-1">← POWRÓT</Button>
              <h3 className="text-xl font-black text-blue-600 mb-4 border-b pb-2 uppercase tracking-tighter">TWOJA PRZYSZŁOŚĆ W ZAWODZIE</h3>

              <div className="space-y-4">
                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                    <GraduationCap size={14} className="text-blue-500"/> Kwalifikacje, które zdobędziesz:
                  </h4>
                  <div className="bg-slate-50 p-3 rounded-lg border text-[11px] font-bold text-slate-700 leading-tight">
                    • ELM.01. Montaż i uruchamianie urządzeń automatyki przemysłowej<br/>
                    • ELM.04. Eksploatacja układów automatyki przemysłowej
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                    <Briefcase size={14} className="text-blue-500"/> Gdzie znajdziesz pracę?
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed italic">
                    Wielkie firmy czekają na Ciebie: <strong>Volkswagen, Phoenix Contact, Fibaro czy Zakład Automatyki Kolejowej</strong>. Rynek potrzebuje specjalistów Przemysłu 4.0!
                  </p>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                    <Info size={14} className="text-blue-500"/> Możliwe ścieżki kariery:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-700">
                    <div className="bg-blue-50 p-2 rounded border border-blue-100 italic">Programista PLC</div>
                    <div className="bg-blue-50 p-2 rounded border border-blue-100 italic">Główny Technolog</div>
                    <div className="bg-blue-50 p-2 rounded border border-blue-100 italic">Kierownik Utrzymania Ruchu</div>
                    <div className="bg-blue-50 p-2 rounded border border-blue-100 italic">Projektant Smart Home</div>
                  </div>
                </section>

                <div className="bg-blue-600 text-white p-4 rounded-xl shadow-inner mt-4">
                   <p className="text-[10px] leading-relaxed text-center font-medium">
                     "Automatyka to branża, która wciąż się rozwija. Po ukończeniu szkoły możesz zostać nawet kierownikiem zakładu!"
                   </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-auto pt-4 border-t flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
        <span>Kierunek: Technik Automatyk</span>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>System Online</span>
        </div>
      </div>
    </Card>
  );
};

export default AutomatykGame;