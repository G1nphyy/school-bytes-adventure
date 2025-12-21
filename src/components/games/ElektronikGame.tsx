"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Cpu, CheckCircle2, XCircle, Lightbulb, Trophy, Battery, Zap, Microchip, Wrench } from "lucide-react";

/* ----------------- dane quizowe (7 pytań) ----------------- */
const quizQuestions = [
  {
    id: 1,
    type: "single",
    questionText: "Czym zajmuje się technik elektronik?",
    answers: [
      { id: "a", text: "Programuje gry komputerowe", correct: false },
      { id: "b", text: "Projektuje, montuje i naprawia układy elektroniczne", correct: true },
      { id: "c", text: "Instaluje systemy operacyjne", correct: false },
      { id: "d", text: "Tworzy strony internetowe", correct: false },
    ],
    hints: [
      "Elektronik pracuje głównie ze sprzętem, a nie z oprogramowaniem.",
      "Układy elektroniczne to serce jego zawodu.",
    ],
    usefulness: [
      "Pozwala zrozumieć, czy to kierunek praktyczny dla Ciebie.",
      "To wiedza wykorzystywana w serwisach, fabrykach i automatyce.",
    ],
  },
  {
    id: 2,
    type: "single",
    questionText: "Który element ogranicza przepływ prądu w obwodzie?",
    answers: [
      { id: "a", text: "Kondensator", correct: false },
      { id: "b", text: "Tranzystor", correct: false },
      { id: "c", text: "Rezystor", correct: true },
      { id: "d", text: "Dioda LED", correct: false },
    ],
    hints: ["Jego wartość podaje się w omach (Ω)."],
    usefulness: [
      "Bez rezystorów elektronika nie istnieje.",
      "To absolutna podstawa zawodu technika elektronika – używasz ich w każdym projekcie i naprawie.",
    ],
  },
  {
    id: 3,
    type: "multiple",
    questionText: "Do czego służy multimetr? (zaznacz wszystkie poprawne)",
    answers: [
      { id: "a", text: "Pomiar napięcia" },
      { id: "b", text: "Pomiar prądu" },
      { id: "c", text: "Pomiar rezystancji" },
      { id: "d", text: "Programowanie mikrokontrolerów" },
    ],
    correct: ["a", "b", "c"],
    hints: [
      "Multimetr to przyrząd pomiarowy (miernik).",
      "Nie służy do pisania kodu.",
    ],
    usefulness: [
      "Multimetr to podstawowe narzędzie elektronika – używasz go codziennie przy diagnostyce i naprawach.",
      "Na egzaminie zawodowym ELM.02 i ELM.05 wymagana jest umiejętność pomiarów.",
    ],
  },
  {
    id: 4,
    type: "single",
    questionText: "Jakie napięcie jest w gniazdku sieciowym w Polsce?",
    answers: [
      { id: "a", text: "5 V", correct: false },
      { id: "b", text: "12 V", correct: false },
      { id: "c", text: "230 V", correct: true },
      { id: "d", text: "400 V", correct: false },
    ],
    hints: ["To napięcie prądu przemiennego (AC)."],
    usefulness: [
      "Znajomość napięcia sieciowego zapewnia bezpieczeństwo pracy.",
      "To podstawowa wiedza przy instalacjach i naprawach urządzeń zasilanych z sieci.",
    ],
  },
  {
    id: 5,
    type: "short",
    questionText: "Jak nazywa się element świecący po przepływie prądu? (skrót 3-literowy)",
    correctText: "LED",
    acceptable: ["led", "dioda led", "Dioda LED"],
    hints: ["To specjalny rodzaj diody świecącej."],
    usefulness: [
      "LED-y są wszędzie: w telewizorach, telefonach, oświetleniu, sygnalizacji.",
      "Projektujesz i naprawiasz obwody z LED-ami w większości nowoczesnych urządzeń.",
    ],
  },
  {
    id: 6,
    type: "single",
    questionText: "Który symbol oznacza rezystor na schemacie?",
    answers: [
      { id: "a", text: "Prostokąt lub zygzak", correct: true },
      { id: "b", text: "Trójkąt", correct: false },
      { id: "c", text: "Kółko z krzyżykiem", correct: false },
      { id: "d", text: "Strzałka", correct: false },
    ],
    hints: ["To charakterystyczny 'opornik'."],
    usefulness: [
      "Czytanie schematów to podstawowa umiejętność technika elektronika.",
      "Bez tego nie uruchomisz ani nie naprawisz żadnego urządzenia.",
    ],
  },
  {
    id: 7,
    type: "single",
    questionText: "Który zawód skupia się na budowie i serwisowaniu robotów oraz gadżetów?",
    answers: [
      { id: "a", text: "Technik informatyk", correct: false },
      { id: "b", text: "Technik elektronik", correct: true },
      { id: "c", text: "Logistyk", correct: false },
      { id: "d", text: "Administrator baz danych", correct: false },
    ],
    hints: ["To kierunek dla osób lubiących majsterkowanie ze sprzętem."],
    usefulness: [
      "Pomaga świadomie wybrać kierunek technikum.",
      "Roboty, drony, IoT – to wszystko opiera się na elektronice.",
    ],
  },
] as const;

type View = "quiz" | "workshop" | "whyWorth";

/* ----------------- Warsztat z multimetrem ----------------- */
const ITEMS = {
  battery: { name: "Bateria 9 V", icon: Battery, value: "9.15 V", unit: "V DC" },
  resistor: { name: "Rezystor 220 Ω", icon: Zap, value: "218 Ω", unit: "Ω" },
  regulator: { name: "Stabilizator 5 V", icon: Microchip, value: "5.02 V", unit: "V DC" },
};
const RANGES = ["OFF", "V DC", "Ω", "A DC"];

function MultimeterWorkshop({ onFinish, addScore }: { onFinish: () => void; addScore: (points: number) => void }) {
  const [blackWire, setBlackWire] = useState<string | null>(null);
  const [redWire, setRedWire] = useState<string | null>(null);
  const [itemOnDesk, setItemOnDesk] = useState<string | null>(null);
  const [range, setRange] = useState("OFF");
  const [result, setResult] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [hintsVisible, setHintsVisible] = useState(0);

  const hints = [
    "Do pomiaru napięcia (bateria, stabilizator) ustaw zakres V DC i podłącz czarny do COM, czerwony do VΩmA.",
    "Do pomiaru rezystancji ustaw Ω – polarność nie ma znaczenia.",
    "Zawsze najpierw ustaw zakres, potem podłącz element.",
  ];

  const handleMeasure = () => {
    setAttempts(a => a + 1);
    if (!blackWire || !redWire || !itemOnDesk || range === "OFF") {
      setResult("Ustaw wszystko: kable, element i zakres!");
      return;
    }
    const itemKey = itemOnDesk as keyof typeof ITEMS;
    const wantedUnit = ITEMS[itemKey].unit;
    const correctPort = wantedUnit === "Ω" ? redWire === "VΩmA" || redWire === "10A" : redWire === "VΩmA";
    if (range !== wantedUnit || blackWire !== "COM" || !correctPort) {
      setResult(`Błąd! Sprawdź zakres i podłączenie dla ${ITEMS[itemKey].name}.`);
      return;
    }

    setResult(`POPRAWNIE → ${ITEMS[itemKey].value}`);
    if (!done.includes(itemOnDesk)) {
      const newDone = [...done, itemOnDesk];
      setDone(newDone);
      const reward = attempts <= 1 ? 30 : 15;
      const penalty = hintsVisible * 5;
      const points = Math.max(0, reward - penalty);
      addScore(points);
    }

    if (done.length + 1 >= 3) {
      setTimeout(() => onFinish(), 2500);
    }
  };

  return (
    <Card className="p-6 border-4 space-y-6 max-w-5xl w-full mx-auto bg-card text-card-foreground">
      <div className="text-center mb-4">
        <Wrench className="w-12 h-12 text-primary mx-auto mb-2 animate-pixel-float" />
        <h2 className="text-xl font-bold tracking-tight">ETAP 2: WARSZTAT Z MULTIMETREM</h2>
        <p className="text-xs text-muted-foreground">Poprawnie zmierz wszystkie 3 elementy</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* LEWA: warsztat */}
        <div className="space-y-6">
          {/* MULTIMETR */}
          <div className="bg-slate-900 rounded-2xl p-6 border-2 border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-mono text-muted-foreground">MULTIMETR</span>
              <span className="text-2xl font-bold text-primary">{range}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {RANGES.map((r) => (
                <Button
                  key={r}
                  onClick={() => setRange(r)}
                  variant={range === r ? "default" : "outline"}
                  size="sm"
                  className="font-bold"
                >
                  {r}
                </Button>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 text-xs font-mono">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.getData("wire") === "black") setBlackWire("COM"); }}
                className={`h-16 flex flex-col items-center justify-center rounded-lg border-2 ${blackWire ? "bg-accent/20 border-accent" : "border-dashed border-border"}`}
              >
                COM<br />{blackWire ? "●" : "○"}
              </div>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.getData("wire") === "red") setRedWire("VΩmA"); }}
                className={`h-16 flex flex-col items-center justify-center rounded-lg border-2 ${redWire === "VΩmA" ? "bg-accent/20 border-accent" : "border-dashed border-border"}`}
              >
                VΩmA<br />{redWire === "VΩmA" ? "●" : "○"}
              </div>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.getData("wire") === "red") setRedWire("10A"); }}
                className={`h-16 flex flex-col items-center justify-center rounded-lg border-2 ${redWire === "10A" ? "bg-accent/20 border-accent" : "border-dashed border-border"}`}
              >
                10A<br />{redWire === "10A" ? "●" : "○"}
              </div>
            </div>
          </div>

          {/* PRZEWODY */}
          <div className="bg-muted/50 rounded-2xl p-4 border-2 border-border">
            <p className="text-sm mb-3 text-muted-foreground">Przeciągnij kable na gniazda:</p>
            <div className="flex gap-6 justify-center">
              <div
                draggable
                onDragStart={(e) => e.dataTransfer.setData("wire", "black")}
                className="cursor-grab active:cursor-grabbing bg-black text-white px-6 py-3 rounded-lg font-bold shadow-lg"
              >
                Czarny (COM)
              </div>
              <div
                draggable
                onDragStart={(e) => e.dataTransfer.setData("wire", "red")}
                className="cursor-grab active:cursor-grabbing bg-red-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg"
              >
                Czerwony
              </div>
            </div>
          </div>

          {/* ELEMENTY */}
          <div className="bg-muted/50 rounded-2xl p-4 border-2 border-border">
            <p className="text-sm mb-3 text-muted-foreground">Przeciągnij element na stanowisko:</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {Object.entries(ITEMS).map(([key, val]) => (
                <div
                  key={key}
                  draggable={!done.includes(key)}
                  onDragStart={(e) => e.dataTransfer.setData("item", key)}
                  className={`cursor-grab p-4 rounded-lg border-2 text-center transition-all ${done.includes(key) ? "opacity-50 border-border" : "border-primary/50 hover:border-primary hover:shadow-lg hover:shadow-primary/20"} bg-card`}
                >
                  <val.icon className="w-10 h-10 mx-auto mb-2 text-primary" />
                  <div className="text-xs font-bold">{val.name}</div>
                </div>
              ))}
            </div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const item = e.dataTransfer.getData("item"); if (item && !done.includes(item)) setItemOnDesk(item); }}
              className={`h-32 rounded-lg border-4 border-dashed flex items-center justify-center text-lg font-semibold ${itemOnDesk ? "border-primary bg-primary/10" : "border-border"}`}
            >
              {itemOnDesk ? (
                <>
                  {React.createElement(ITEMS[itemOnDesk as keyof typeof ITEMS].icon, { className: "w-10 h-10 mr-3 text-primary" })}
                  {ITEMS[itemOnDesk as keyof typeof ITEMS].name}
                </>
              ) : "Upuść element tutaj"}
            </div>
          </div>
        </div>

        {/* PRAWA: wyniki */}
        <div className="flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4">Wynik pomiaru</h3>
              <div className="bg-muted rounded-xl p-6 min-h-32 text-lg font-mono text-center">
                {result || "Gotowy do pomiaru…"}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Poprawnie zmierzone:</p>
              <div className="flex flex-wrap gap-3">
                {Object.entries(ITEMS).map(([k, v]) => (
                  <div key={k} className={`px-4 py-2 rounded-lg text-sm font-bold border-2 ${done.includes(k) ? "bg-accent/20 border-accent text-accent" : "border-border"}`}>
                    {v.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Podpowiedzi */}
            <div className="space-y-3">
              {hintsVisible < hints.length && (
                <Button
                  onClick={() => {
                    setHintsVisible(v => v + 1);
                    addScore(-5);
                  }}
                  variant="outline"
                  className="w-full border-2 border-secondary"
                >
                  💡 PODPOWIEDŹ ({hintsVisible + 1}/{hints.length}) (-5 PKT)
                </Button>
              )}
              {hintsVisible > 0 && (
                <div className="space-y-2">
                  {hints.slice(0, hintsVisible).map((h, i) => (
                    <div key={i} className="p-3 bg-secondary/10 border-2 border-secondary rounded text-sm">
                      <span className="font-bold">Podpowiedź {i + 1}:</span> {h}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button onClick={handleMeasure} size="lg" className="w-full h-14 text-lg font-bold shadow-lg">
            ZMIERZ
          </Button>
        </div>
      </div>
    </Card>
  );
}

/* ----------------- Plansza "Dlaczego warto być technikiem elektronikiem" ----------------- */
function WhyWorthPanel({ totalScore }: { totalScore: number }) {
  const reasons = [
    {
      title: "Gwarancja zatrudnienia",
      text: "Rynek pracy potrzebuje coraz więcej specjalistów z branży elektronicznej. Prognozy wskazują na stały wzrost zapotrzebowania w przemyśle, automatyce, kolejnictwie i serwisach.",
      icon: Trophy,
    },
    {
      title: "Praca z nowoczesną technologią",
      text: "Roboty, drony, IoT, smart home, elektronika samochodowa – codziennie pracujesz z najnowszymi gadżetami i rozwiązujesz realne problemy techniczne.",
      icon: Zap,
    },
    {
      title: "Wysokie zarobki i rozwój",
      text: "Technicy elektronicy są cenieni przez pracodawców. Możliwość szybkiego awansu na inżyniera lub specjalistę w firmach produkcyjnych i serwisowych.",
      icon: Cpu,
    },
    {
      title: "Praktyczne umiejętności",
      text: "Montujesz, naprawiasz, projektujesz układy – to zawód dla osób lubiących majsterkować i widzieć efekty swojej pracy.",
      icon: Wrench,
    },
    {
      title: "Kwalifikacje uznawane w całej UE",
      text: "Dyplom technika elektronika (ELM.02 + ELM.05) otwiera drzwi do pracy nie tylko w Polsce, ale i za granicą.",
      icon: Battery,
    },
  ];

  return (
    <Card className="p-8 max-w-5xl w-full mx-auto border-4 shadow-2xl bg-card text-card-foreground">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black tracking-tight uppercase">DLACZEGO WARTO BYĆ TECHNIKIEM ELEKTRONIKIEM?</h2>
        <p className="text-muted-foreground mt-2">Twoja przyszłość w nowoczesnej technologii</p>
        <p className="text-2xl font-bold text-primary mt-4">Twój wynik: {totalScore} PKT</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reasons.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6 text-center space-y-4 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            <r.icon className="w-16 h-16 text-primary mx-auto" />
            <h3 className="text-xl font-bold">{r.title}</h3>
            <p className="text-sm text-muted-foreground">{r.text}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button size="lg" className="h-14 text-lg font-bold shadow-lg" onClick={() => window.location.assign("/")}>
          WRÓĆ DO MENU GŁÓWNEGO
        </Button>
      </div>
    </Card>
  );
}

/* ==================================================================== */
/* ===================== GŁÓWNY KOMPONENT ============================= */
/* ==================================================================== */
export default function ElectronicsGame() {
  const [view, setView] = useState<View>("quiz");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [locked, setLocked] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [showUsefulness, setShowUsefulness] = useState(false);

  const q = quizQuestions[qIndex];

  const updateAnswer = (val: any) => {
    if (showResult) return;
    setAnswers((a) => ({ ...a, [q.id]: val }));
  };

  const handleSingleChoice = (answerId: string) => {
    if (showResult || locked) return;
    setAnswers((a) => ({ ...a, [q.id]: answerId }));
    setLocked(true);
    setShowResult(true);
    setShowUsefulness(false);

    const isCorrect = answerId === q.answers.find((x) => x.correct)?.id;
    if (isCorrect) {
      setTotalScore((s) => s + 10);
      setFeedback({ ok: true, msg: "PRAWIDŁOWO! +10 PKT" });
    } else {
      setFeedback({ ok: false, msg: "BŁĄD!" });
    }
    setLocked(false);
  };

  const check = () => {
    if (locked || showResult) return;
    const user = answers[q.id];
    if (!user || (Array.isArray(user) && user.length === 0)) return;

    setLocked(true);
    setShowResult(true);
    setShowUsefulness(false);

    let ok = false;
    if (q.type === "multiple") {
      ok = JSON.stringify((user || []).sort()) === JSON.stringify(q.correct?.sort());
    } else if (q.type === "short") {
      const accepted = [q.correctText, ...(q.acceptable || [])].map((x) => x.toLowerCase().trim());
      ok = accepted.includes((user || "").toLowerCase().trim());
    }

    if (ok) {
      setTotalScore((s) => s + 10);
      setFeedback({ ok: true, msg: "PRAWIDŁOWO! +10 PKT" });
    } else {
      setFeedback({ ok: false, msg: "BŁĄD!" });
    }
    setLocked(false);
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setFeedback(null);
    setHintLevel(0);
    setShowUsefulness(false);
    setLocked(false);

    if (qIndex < quizQuestions.length - 1) {
      setQIndex((i) => i + 1);
    } else {
      setView("workshop");
    }
  };

  function renderQuestionInputs() {
    const val = answers[q.id];

    if (q.type === "single") {
      return (
        <div className="space-y-3">
          {q.answers.map((a) => {
            const isCorrectAnswer = a.correct;
            const isSelected = val === a.id;
            const showCorrect = showResult && isCorrectAnswer;
            const showWrong = showResult && isSelected && !isCorrectAnswer;

            const baseClasses = "w-full justify-start text-left arcade-button transition-all duration-200 cursor-pointer p-4 text-sm border h-auto border-2 rounded-xl whitespace-normal";
            let stateClasses = "border-border bg-background text-foreground hover:border-primary hover:shadow-md hover:shadow-primary/30";

            if (showResult) {
              if (showCorrect) stateClasses = "border-accent bg-accent/20 text-accent font-bold cursor-not-allowed";
              else if (showWrong) stateClasses = "border-destructive bg-destructive/20 text-destructive font-bold cursor-not-allowed";
              else if (isCorrectAnswer) stateClasses = "border-accent bg-accent/10 text-accent cursor-not-allowed";
              else stateClasses = "border-border bg-background/50 text-muted-foreground opacity-60 cursor-not-allowed";
            } else if (isSelected) {
              stateClasses = "border-primary bg-primary/20 text-primary font-bold";
            }

            return (
              <Button
                key={a.id}
                onClick={() => handleSingleChoice(a.id)}
                variant="outline"
                disabled={showResult}
                className={`${baseClasses} ${stateClasses}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="flex-grow">{a.text}</span>
                  {showCorrect && <CheckCircle2 className="w-5 h-5 ml-2" />}
                  {showWrong && <XCircle className="w-5 h-5 ml-2" />}
                </div>
              </Button>
            );
          })}
        </div>
      );
    }

    if (q.type === "multiple") {
      return (
        <div className="space-y-3">
          {q.answers.map((a) => {
            const isSelected = (val || []).includes(a.id);
            const containerClass = isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 bg-background hover:shadow-md hover:shadow-primary/30";

            return (
              <div
                key={a.id}
                className={`flex items-center gap-3 p-4 border-2 rounded-xl arcade-button transition-all cursor-pointer h-auto whitespace-normal ${showResult ? "opacity-80 pointer-events-none" : ""} ${containerClass}`}
                onClick={() => {
                  if (showResult) return;
                  const arr = val || [];
                  updateAnswer(isSelected ? arr.filter((x: string) => x !== a.id) : [...arr, a.id]);
                }}
              >
                <Checkbox checked={isSelected} onCheckedChange={() => {}} className="data-[state=checked]:bg-primary border-primary" />
                <span className="text-xs">{a.text}</span>
              </div>
            );
          })}
        </div>
      );
    }

    if (q.type === "short") {
      return (
        <div className="space-y-2">
          <Input
            placeholder="Wpisz odpowiedź..."
            value={val || ""}
            onChange={(e) => updateAnswer(e.target.value)}
            disabled={showResult}
            className="border-2 border-primary/50 focus-visible:ring-0 focus-visible:border-primary text-lg p-6 rounded-xl"
          />
        </div>
      );
    }

    return null;
  }

  return (
    <div className="p-6 min-h-screen flex items-center justify-center bg-background/95">
      {view === "quiz" && (
        <Card className="p-6 border-4 space-y-4 max-w-4xl w-full mx-auto shadow-2xl bg-card text-card-foreground">
          <div className="text-center mb-6">
            <Cpu className="w-12 h-12 text-primary mx-auto mb-2 animate-pixel-float" />
            <h2 className="text-xl font-bold tracking-tight">ETAP 1: QUIZ ELEKTRONICZNY</h2>
            <p className="text-lg font-bold text-primary">Punkty: {totalScore}</p>
            <p className="text-xs text-muted-foreground">Pytanie {qIndex + 1}/{quizQuestions.length}</p>
          </div>

          <div className="space-y-4">
            <p className="font-semibold text-lg">{q.questionText}</p>
            {renderQuestionInputs()}
          </div>

          <div className="space-y-3 pt-4 border-t border-border/50">
            {hintLevel < q.hints.length && !showResult && (
              <Button
                onClick={() => {
                  setHintLevel(h => h + 1);
                  setTotalScore(s => s - 2);
                }}
                variant="outline"
                size="sm"
                className="w-full border-2 border-secondary text-secondary hover:bg-secondary/20 arcade-button h-auto py-3"
              >
                💡 POKAŻ PODPOWIEDŹ ({hintLevel + 1}/{q.hints.length}) (KOSZT: 2 PKT)
              </Button>
            )}

            {hintLevel > 0 && !showResult && (
              <div className="space-y-2 animate-slide-in-up">
                {q.hints.slice(0, hintLevel).map((h, i) => (
                  <div key={i} className="p-3 border-2 border-secondary bg-secondary/10 text-secondary text-xs rounded">
                    <span className="font-bold">Podpowiedź {i + 1}:</span> {h}
                  </div>
                ))}
              </div>
            )}
          </div>

          {showResult && feedback && (
            <div className="space-y-4 animate-slide-in-up">
              <div className={`p-4 border-4 text-center ${feedback.ok ? "border-accent bg-accent/20 text-accent" : "border-destructive bg-destructive/20 text-destructive"}`}>
                {feedback.ok ? <CheckCircle2 className="w-8 h-8 mx-auto mb-2" /> : <XCircle className="w-8 h-8 mx-auto mb-2" />}
                <h3 className="text-lg font-bold">{feedback.msg}</h3>
              </div>

              <Button
                onClick={() => setShowUsefulness(!showUsefulness)}
                variant="outline"
                className="w-full border-2 arcade-button"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                DO CZEGO PRZYDA MI SIĘ TA WIEDZA?
              </Button>

              {showUsefulness && (
                <div className="p-4 border-2 border-primary/50 bg-primary/10 rounded animate-slide-in-up">
                  <ul className="text-xs list-disc ml-5 space-y-1">
                    {q.usefulness.map((u, i) => (
                      <li key={i}>{u}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="pt-2">
            {!showResult && q.type !== "single" && (
              <Button className="w-full bg-primary h-12 font-bold shadow-lg" onClick={check} disabled={locked}>
                SPRAWDŹ ODPOWIEDŹ
              </Button>
            )}

            {showResult && (
              <Button className="w-full bg-primary h-12 font-bold shadow-lg" onClick={handleNextQuestion}>
                {qIndex < quizQuestions.length - 1 ? "NASTĘPNE PYTANIE" : "PRZEJDŹ DO WARSZTATU"}
              </Button>
            )}
          </div>
        </Card>
      )}

      {view === "workshop" && (
        <div className="w-full">
          <div className="text-center mb-6 bg-card p-4 rounded border-2 shadow-md mx-auto max-w-md">
            <p className="text-lg font-bold text-primary">Wynik z quizu: {totalScore} PKT</p>
          </div>
          <MultimeterWorkshop onFinish={() => setView("whyWorth")} addScore={(p) => setTotalScore(s => s + p)} />
        </div>
      )}

      {view === "whyWorth" && <WhyWorthPanel totalScore={totalScore} />}
    </div>
  );
}