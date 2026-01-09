"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Cpu, CheckCircle2, XCircle, Lightbulb, Trophy, Battery, Zap, Microchip, Wrench } from "lucide-react";


import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { MultiBackend, MouseTransition, TouchTransition } from "react-dnd-multi-backend";


/* ----------------- dane quizowe (7 pytań) ----------------- */
// Obsługuje trzy typy zadań:
// - 'single': wybór jednej poprawnej odpowiedzi
// - 'multi': wybór wielu poprawnych odpowiedzi
// - 'input': wpisanie konkretnej wartości liczbowej
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


const DnDItemTypes = {
  WIRE: "wire",
  ITEM: "item",
} as const;

// ---------- DRAGGABLE: PRZEWÓD ----------
function WireDraggable({
                         color, // 'black' | 'red'
                         children,
                       }: { color: 'black' | 'red'; children: React.ReactNode }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DnDItemTypes.WIRE,
    item: { color },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }), [color]);

  return (
      <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }} className="select-none">
        {children}
      </div>
  );
}

// ---------- DROP: PORT MIERNIKA ----------
function PortDrop({
                    portId,               // 'COM' | 'VΩmA' | '10A'
                    hasWire,              // string | null
                    colorClass,           // np. "bg-zinc-800"
                    onDropWire,
                    children,
                  }: {
  portId: 'COM' | 'VΩmA' | '10A';
  hasWire: string | null;
  colorClass: string;
  onDropWire: (wireColor: 'black' | 'red', portId: string) => void;
  children: React.ReactNode;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: DnDItemTypes.WIRE,
    drop: (item: { color: 'black' | 'red' }) => onDropWire(item.color, portId),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }), [portId, onDropWire]);

  return (
      <div
          ref={drop}
          className={`group relative h-20 flex flex-col items-center justify-center rounded-xl border-2 transition-all mx-auto w-full max-w-[220px] ${hasWire ? "border-primary bg-primary/10 shadow-[0_0_10px_rgba(var(--primary),0.2)]" : "border-dashed border-slate-700 hover:border-primary/50"} ${colorClass} ${isOver ? "ring-2 ring-primary/50" : ""}`}
      >
        {children}
      </div>
  );
}

// ---------- DRAGGABLE: ELEMENT (bateria/rezystor/stabilizator) ----------
function ItemDraggable({
                         itemKey, disabled, children,
                       }: {
  itemKey: keyof typeof ITEMS;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DnDItemTypes.ITEM,
    canDrag: !disabled,
    item: { itemKey },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }), [itemKey, disabled]);

  return (
      <div ref={drag} style={{ opacity: isDragging ? 0.6 : 1 }} className="select-none">
        {children}
      </div>
  );
}

// ---------- DROP: „Miejsce na komponent” ----------
function DeskDrop({
                    onPlaceItem,
                    itemOnDesk,
                    children,
                  }: {
  onPlaceItem: (key: keyof typeof ITEMS) => void;
  itemOnDesk: string | null;
  children: React.ReactNode;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: DnDItemTypes.ITEM,
    drop: (item: { itemKey: keyof typeof ITEMS }) => onPlaceItem(item.itemKey),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }), [onPlaceItem]);

  return (
      <div
          ref={drop}
          className={`h-32 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center ${itemOnDesk ? "border-primary bg-primary/5 shadow-inner" : "border-slate-300 bg-slate-50/50 hover:bg-slate-50"} ${isOver ? "ring-2 ring-primary/50" : ""}`}
      >
        {children}
      </div>
  );
}



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

  // DND FUNCTIONS
  const placeItemOnDesk = (key: keyof typeof ITEMS) => {
    if (key && !done.includes(key)) setItemOnDesk(key);
  };

  const handleWireDrop = (wire: 'black' | 'red', portId: string) => {
    if (wire === 'black' && portId === 'COM') setBlackWire('COM');
    if (wire === 'red') setRedWire(portId);
  };


  return (
    <Card className="p-6 border-4 space-y-6 max-w-5xl w-full mx-auto bg-card text-card-foreground">
      <div className="text-center mb-4">
        <Wrench className="w-12 h-12 text-primary mx-auto mb-2 animate-pixel-float" />
        <h2 className="text-xl font-bold tracking-tight">ETAP 2: WARSZTAT Z MULTIMETREM</h2>
        <p className="text-xs text-muted-foreground">Poprawnie zmierz wszystkie 3 elementy</p>
      </div>

      {/* mobile-first: jedna kolumna, na md dwie kolumny */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEWA: warsztat */}
        <div className="space-y-6">
          {/* MULTIMETR */}
          <div className="bg-slate-950 rounded-3xl p-6 md:p-8 border-4 border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            {/* header: na mobilkach kolumnowo i wycentrowane */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="text-[10px] font-bold text-primary/60 tracking-widest uppercase">Digital Multimeter</span>
                <span className="text-2xl font-mono font-bold text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]">
                  {range === "OFF" ? "0.00" : range}
                </span>
              </div>

              <div className="bg-black/50 px-4 py-2 rounded border border-primary/20 flex items-center justify-center">
                <span className="text-3xl font-mono font-bold text-primary animate-pulse">
                  {range === "OFF" ? "" : "⎓"}
                </span>
              </div>
            </div>

            {/* ranges: wycentrowane i responsywne */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6 justify-center">
              {RANGES.map((r) => (
                <Button
                  key={r}
                  onClick={() => setRange(r)}
                  variant={range === r ? "default" : "outline"}
                  size="sm"
                  className={`font-bold transition-all justify-center ${range === r ? "scale-105 shadow-[0_0_15px_rgba(var(--primary),0.4)]" : "opacity-70"}`}
                >
                  {r}
                </Button>
              ))}
            </div>

            {/* ports: na mobile single column, elementy wyśrodkowane i ograniczona szerokość */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: "COM", label: "COM", color: "bg-zinc-800", wire: blackWire, expected: "black" },
                { id: "VΩmA", label: "VΩmA", color: "bg-red-900/20", wire: redWire === "VΩmA" ? "red" : null, expected: "red" },
                { id: "10A", label: "10A", color: "bg-red-900/20", wire: redWire === "10A" ? "red" : null, expected: "red" }
              ].map((port) => (

                  <PortDrop
                      key={port.id}
                      portId={port.id as 'COM'|'VΩmA'|'10A'}
                      hasWire={port.wire as any}
                      colorClass={port.color}
                      onDropWire={handleWireDrop}
                  >
                    <span className="text-[10px] font-bold mb-1 text-slate-400">{port.label}</span>
                    <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-transform ${port.wire ? "scale-110 border-primary bg-slate-900" : "border-slate-800 bg-black"}`}>
                      {port.wire && (
                          <div className={`w-3 h-3 rounded-full shadow-inner ${port.wire === "black" ? "bg-zinc-400" : "bg-red-500"}`} />
                      )}
                    </div>
                  </PortDrop>
              ))}
            </div>
          </div>

          {/* PRZEWODY */}
          <div className="bg-muted/30 rounded-2xl p-6 border-2 border-border backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-wider mb-4 text-muted-foreground flex items-center justify-center">
              <Zap className="w-3 h-3 mr-2" /> Wybierz przewody pomiarowe
            </p>

            <div className="flex flex-col sm:flex-row gap-4">

              <WireDraggable color="black">
                <div className="w-full sm:flex-1 cursor-grab active:cursor-grabbing group">
                  <div className="bg-zinc-900 text-white p-3 rounded-xl border-2 border-zinc-700 group-hover:border-zinc-500 transition-all text-center font-bold text-sm shadow-md">
                    Czarny (COM)
                  </div>
                </div>
              </WireDraggable>



              <WireDraggable color="red">
                <div className="w-full sm:flex-1 cursor-grab active:cursor-grabbing group">
                  <div className="bg-red-600 text-white p-3 rounded-xl border-2 border-red-500 group-hover:border-red-400 transition-all text-center font-bold text-sm shadow-md">
                    Czerwony (+)
                  </div>
                </div>
              </WireDraggable>
            </div>
          </div>

          {/* ELEMENTY I STANOWISKO */}
          <div className="bg-muted/30 rounded-2xl p-6 border-2 border-border backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-wider mb-4 text-muted-foreground flex items-center justify-center">
              <Microchip className="w-3 h-3 mr-2" /> Komponenty do przetestowania
            </p>

            {/* komponenty: responsywnie 1/2/3 kolumny i elementy centered */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6 justify-center">
              {Object.entries(ITEMS).map(([key, val]) => (

                  <ItemDraggable itemKey={key as keyof typeof ITEMS} disabled={done.includes(key)}>
                    <div
                        key={key}
                        className={`group cursor-grab p-2 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center min-h-[100px] mx-auto w-full max-w-[180px] ${
                            done.includes(key) ? "opacity-40 grayscale bg-slate-100 border-slate-200" : "bg-card border-primary/20 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
                        }`}
                    >
                      <val.icon className={`w-8 h-8 mx-auto mb-1 flex-shrink-0 ${done.includes(key) ? "text-slate-400" : "text-primary"}`} />
                      <div className="text-[10px] font-bold leading-snug whitespace-normal break-words overflow-hidden text-center">
                        {val.name}
                      </div>
                    </div>
                  </ItemDraggable>
              ))}
            </div>


            <DeskDrop onPlaceItem={placeItemOnDesk} itemOnDesk={itemOnDesk}>
              {itemOnDesk ? (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                    {React.createElement(ITEMS[itemOnDesk as keyof typeof ITEMS].icon, { className: "w-12 h-12 text-primary mb-2" })}
                    <span className="text-sm font-bold text-primary">{ITEMS[itemOnDesk as keyof typeof ITEMS].name}</span>
                  </motion.div>
              ) : (
                  <div className="text-slate-400 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center mb-2">
                      <span className="text-xl">+</span>
                    </div>
                    <span className="text-[10px] font-medium uppercase tracking-normal">Miejsce na komponent</span>
                  </div>
              )}
            </DeskDrop>
          </div>
        </div>

        {/* PRAWA: wyniki */}
        <div className="flex flex-col justify-between items-center md:items-stretch">
          <div className="space-y-6 w-full max-w-2xl mx-auto">
            <div>
              <h3 className="text-xl font-bold mb-4 text-center md:text-left">Wynik pomiaru</h3>
              <div className="bg-muted rounded-xl p-6 min-h-32 text-lg font-mono text-center">
                {result || "Gotowy do pomiaru…"}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2 text-center md:text-left">Oczekiwane wyniki:</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
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
                  className="w-full border-2 border-secondary h-auto py-3 whitespace-normal text-center"
                >
                  💡 PODPOWIEDŹ ({hintsVisible + 1}/{hints.length}) (-5 PKT)
                </Button>
              )}
              {hintsVisible > 0 && (
                <div className="space-y-2">
                  {hints.slice(0, hintsVisible).map((h, i) => (
                    <div key={i} className="p-3 bg-secondary/10 border-2 border-secondary rounded text-sm text-center md:text-left">
                      <span className="font-bold">Podpowiedź {i + 1}:</span> {h}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button onClick={handleMeasure} size="lg" className="w-full h-14 text-lg font-bold shadow-lg mt-4">
            ZMIERZ
          </Button>
        </div>
      </div>
    </Card>
  );
}

/* ----------------- Plansza "Dlaczego warto być technikiem elektronikiem" ----------------- */
// Widok podsumowuje korzyści z wyboru kierunku w ZSK
function WhyWorthPanel({ totalScore, quizScore, workshopScore }: { totalScore: number; quizScore: number; workshopScore: number }) {
  const [activeIndex, setActiveIndex] = useState(0);

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
      <Card className="p-6 sm:p-8 max-w-5xl w-full mx-auto border-4 shadow-2xl bg-card text-card-foreground">
        <div className="text-center mb-6 mt-4">
          <div className="relative inline-block">
            <Trophy className="w-14 h-14 text-yellow-500 mx-auto mb-2 animate-bounce drop-shadow-md" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">GRATULACJE!</h2>
          <p className="text-muted-foreground mt-2 uppercase tracking-widest text-sm">Ukończono ścieżkę Technika Elektronika</p>
        </div>

        {/* Baner z wynikiem głównym */}
        <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-4 sm:p-6 text-center mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 blur-xl pointer-events-none" />
          <span className="relative z-10 text-xs text-muted-foreground font-bold uppercase tracking-tighter">Twój Wynik Końcowy</span>
          <div className="relative z-10 text-4xl sm:text-5xl font-black text-primary mt-2 drop-shadow-sm">
            {totalScore} <span className="text-lg sm:text-xl font-medium text-foreground/60">PKT</span>
          </div>
        </div>

        {/* Szczegółowe statystyki */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center justify-between p-4 border border-border/50 rounded-xl bg-card hover:bg-accent/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-md border border-blue-500/20">
                <Cpu className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-bold text-sm leading-none mb-1">Quiz Teoretyczny</p>
                <p className="text-[10px] text-muted-foreground">Podstawy elektroniki</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-foreground">{quizScore}</span>
              <span className="text-xs text-muted-foreground"> / 70</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-border/50 rounded-xl bg-card hover:bg-accent/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-md border border-orange-500/20">
                <Wrench className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="font-bold text-sm leading-none mb-1">Warsztat Pomiarowy</p>
                <p className="text-[10px] text-muted-foreground">Pomiary multimetrem</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-foreground">{workshopScore}</span>
              <span className="text-xs text-muted-foreground"> / 90</span>
            </div>
          </div>
        </div>

        <div className="mt-8 mb-6">
          <h3 className="text-lg sm:text-xl font-bold mb-6 flex items-center justify-center gap-2 text-primary">
            <CheckCircle2 className="w-5 h-5" /> DLACZEGO ELEKTRONIKA TO STRZAŁ W DZIESIĄTKĘ?
          </h3>

          {/* IMPORTANT: mobile-first layout — na mobile ikony będą rządkiem/centrowane, na lg zobaczymy 2/3 kolumnę */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
            {/* Nawigacja: na małych ekranach układ flex-wrap i wyśrodkowany */}
            <div className="lg:col-span-2 flex flex-wrap lg:flex-col gap-2 justify-center lg:justify-start">
              {reasons.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full sm:max-w-[420px] md:max-w-[320px] lg:w-auto ${
                    activeIndex === i ? "border-primary bg-primary/10 shadow-lg shadow-primary/10 scale-[1.02]" : "border-border/50 bg-card hover:border-primary/30"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                    activeIndex === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    <r.icon className="w-5 h-5" />
                  </div>

                  <span className={`text-sm font-bold uppercase tracking-normal text-left ${activeIndex === i ? "text-primary" : "text-muted-foreground"} break-words`}>
                    {r.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Prawa kolumna: opis — ograniczamy maksymalną szerokość tekstu i centrowanie na małych ekranach */}
            <div className="lg:col-span-3 min-h-[220px] bg-primary/5 rounded-2xl border-2 border-primary/20 p-5 sm:p-8 flex items-center relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  className="relative z-10 w-full"
                >
                  <div className="flex flex-col items-center lg:items-start gap-3">
                    <div className="flex items-center gap-3 text-primary">
                      {React.createElement(reasons[activeIndex].icon, { className: "w-8 h-8" })}
                      <h4 className="text-lg sm:text-2xl font-black uppercase italic text-center lg:text-left">
                        {reasons[activeIndex].title}
                      </h4>
                    </div>

                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-center lg:text-left max-w-prose whitespace-normal break-words">
                      {reasons[activeIndex].text}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* dekoracja: duża ikona, nie wpływa na layout dzięki absolute + pointer-events-none */}
              <div className="absolute -bottom-8 -right-8 opacity-5 pointer-events-none select-none">
                {React.createElement(reasons[activeIndex].icon, { className: "w-40 h-40" })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button
            size="lg"
            onClick={() => window.location.assign("/")}
            className="w-full box-border h-auto min-h-[3rem] py-2 px-4 text-sm sm:text-lg font-bold shadow-lg !whitespace-normal break-words text-center tracking-normal sm:tracking-widest uppercase"
          >
            <span className="block min-w-0 whitespace-normal break-words leading-tight">
              WRÓĆ DO MENU GŁÓWNEGO
            </span>
          </Button>
        </div>
      </Card>
    );
  }

/* ===================== GŁÓWNY KOMPONENT ============================= */
export default function ElectronicsGame() {
    // Kontrola widoku: quiz -> warsztat -> podsumowanie
  const [view, setView] = useState<View>("quiz");
  // Logika quizu: numer pytania, punkty, blokada po odpowiedzi
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [workshopScore, setWorkshopScore] = useState(0);
  const [locked, setLocked] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [showUsefulness, setShowUsefulness] = useState(false);

  const totalScore = quizScore + workshopScore;
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
      setQuizScore((s) => s + 10);
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
    // Logika sprawdzania zależy od typu pytania zdefiniowanego w obiekcie
    if (q.type === "multiple") {
        // Porównanie zaznaczonych checkboxów z poprawnymi odpowiedziami
      ok = JSON.stringify((user || []).sort()) === JSON.stringify(q.correct?.sort());
    } else if (q.type === "short") {
        // Porównanie wpisanej wartości tekstowej (ignoruje wielkość liter)
      const accepted = [q.correctText, ...(q.acceptable || [])].map((x) => x.toLowerCase().trim());
      ok = accepted.includes((user || "").toLowerCase().trim());
    }

    if (ok) {
      setQuizScore((s) => s + 10);
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

            if(showResult) {
              if (showCorrect) {
                stateClasses = "border-accent bg-accent/20 text-accent font-bold cursor-not-allowed";
              } else if (showWrong) {
                stateClasses = "border-destructive bg-destructive/20 text-destructive font-bold cursor-not-allowed";
              } else if (isCorrectAnswer) {
                // Pokaż poprawną, jeśli użytkownik wybrał źle
                stateClasses = "border-accent bg-accent/10 text-accent cursor-not-allowed";
              } else {
                stateClasses = "border-border bg-background/50 text-muted-foreground opacity-60 cursor-not-allowed";
              }
            } else if (isSelected) {
              stateClasses = "border-primary bg-primary/20 text-primary font-bold";
            } else {
                //defaultowo
              stateClasses = "border-border bg-background text-foreground hover:border-primary hover:shadow-md hover:shadow-primary/30 hover:bg-background/5 hover:text-foreground";
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
            const isCorrect = q.correct?.includes(a.id);
            const showSuccess = showResult && isCorrect;
            const showError = showResult && isSelected && !isCorrect;

            let containerClass = isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 bg-background hover:shadow-md hover:shadow-primary/30";

            if (showResult) {
              if (showSuccess) {
                containerClass = "border-accent bg-accent/20 text-accent font-bold";
              } else if (showError) {
                containerClass = "border-destructive bg-destructive/20 text-destructive font-bold";
              } else {
                containerClass = "border-border bg-background/50 text-muted-foreground opacity-60";
              }
            }

            return (
              <div
                key={a.id}
                className={`flex items-center gap-3 p-4 border-2 rounded-xl arcade-button transition-all cursor-pointer h-auto whitespace-normal ${showResult ? 'opacity-80 pointer-events-none' : ''} ${containerClass}`}
                onClick={() => {
                  if (showResult) return;
                  const arr = val || [];
                  updateAnswer(isSelected ? arr.filter((x: string) => x !== a.id) : [...arr, a.id]);
                }}
              >
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => {}}
                    className={`border-primary ${showResult && isCorrect ? "data-[state=checked]:bg-accent border-accent" : ""}`}
                />
                <span className="text-xs flex-grow">{a.text}</span>
                {showSuccess && <CheckCircle2 className="w-4 h-4 ml-2 shrink-0" />}
                {showError && <XCircle className="w-4 h-4 ml-2 shrink-0" />}
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
                className={`border-2 text-lg p-6 rounded-xl transition-all ${
                    showResult
                        ? feedback?.ok
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-destructive bg-destructive/10 text-destructive"
                        : "border-primary/50 focus-visible:ring-0 focus-visible:border-primary"
                }`}
            />
            {showResult && !feedback?.ok && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-accent/10 border-2 border-accent/30 rounded-lg text-accent text-sm font-bold flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Poprawna odpowiedź: {q.correctText}
                </motion.div>
            )}
          </div>
      );
    }

    return null;
  }

  return (
    <div className="p-6 min-h-[80vh] flex items-center justify-center bg-background/95">
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
                      setQuizScore(s => s - 2);
                    }}
                    variant="outline"
                size="sm"
                className="w-full border-2 border-secondary text-secondary hover:bg-secondary/20 arcade-button h-auto py-3 whitespace-normal"
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
                  size="sm"
                  className={`w-full border-2 ${showUsefulness ? 'border-primary/50 bg-primary/20' : 'border-border hover:border-primary/50'} text-foreground arcade-button hover:bg-primary/10 hover:text-primary-foreground h-auto py-3 whitespace-normal`}
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
              <Button
                onClick={handleNextQuestion}
                className="
                  w-full
                  h-auto
                  min-h-12
                  py-3
                  bg-primary
                  font-bold
                  shadow-lg
                  text-center
                  !whitespace-normal
                  break-words
                "
              >
                <span className="block leading-tight whitespace-normal">
                  {qIndex < quizQuestions.length - 1
                    ? "NASTĘPNE PYTANIE"
                    : "PRZEJDŹ DO WARSZTATU"}
                </span>
              </Button>
            )}
          </div>
        </Card>
      )}

      {view === "workshop" && (
          <div className="w-full">
            <div className="text-center mb-6 bg-card p-4 rounded border-2 shadow-md mx-auto max-w-md">
              <p className="text-lg font-bold text-primary">Wynik z quizu: {quizScore} PKT</p>
            </div>

            <DndProvider
                backend={MultiBackend}
                options={{
                  backends: [
                    { backend: HTML5Backend, preview: true, transition: MouseTransition },
                    {
                      backend: TouchBackend,
                      options: { enableMouseEvents: true, delayTouchStart: 120 }, // lepszy scroll + press-drag
                      preview: true,
                      transition: TouchTransition,
                    },
                  ],
                }}
            >
              <MultimeterWorkshop onFinish={() => setView("whyWorth")} addScore={(p) => setWorkshopScore(s => s + p)} />
            </DndProvider>
          </div>
      )}

      {view === "whyWorth" && <WhyWorthPanel totalScore={totalScore} quizScore={quizScore} workshopScore={workshopScore} />}
    </div>
  );
}