import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, XCircle, Train as TrainIcon, GraduationCap,
  Map as MapIcon, ShieldCheck, Lightbulb, HelpCircle, Info
} from "lucide-react";
import { motion } from "framer-motion";
import Train from "@/components/ui/train";
import rails from "@/assets/graphics/train/rail.png";
import switchImg from "@/assets/graphics/train/switch.png";
import switchToTop from "@/assets/graphics/train/switch_to_top.png";
import switchToBottom from "@/assets/graphics/train/switch_to_bottom.png";
import ground from "@/assets/graphics/train/ground.png";
import exitLevel from "@/assets/graphics/train/exit_level.png"
import enterLevel from "@/assets/graphics/train/enter_level.png"

const cell = 85;
const mapHeight = 10;

const levels = [
  {
    map: Array(mapHeight).fill(0).map(() => Array(40).fill(" ")).map((row, ry) => {
      if ([2, 4, 6].includes(ry)) for (let rx = 0; rx < 40 - 1; rx++) row[rx] = "-";
      return row;
    }),
    start: { x: -2, y: 2 },
    end: { x: 38, y: 4 },
    switches: [{ x: 10, y: 2 }, { x: 20, y: 4 }],
    points: [{ x: 5, y: 2 }, { x: 15, y: 4 }]
  },
  {
    map: Array(mapHeight).fill(0).map(() => Array(60).fill(" ")).map((row, ry) => {
      if ([1, 3, 5].includes(ry)) for (let rx = 0; rx < 60 - 1; rx++) row[rx] = "-";
      return row;
    }),
    start: { x: -2, y: 1 },
    end: { x: 58, y: 3 },
    switches: [{ x: 15, y: 1 }, { x: 30, y: 3 }, { x: 45, y: 1 }],
    points: [{ x: 10, y: 1 }, { x: 25, y: 3 }, { x: 40, y: 1 }]
  },
  {
    map: Array(mapHeight).fill(0).map(() => Array(80).fill(" ")).map((row, ry) => {
      if ([0, 2, 4, 6].includes(ry)) for (let rx = 0; rx < 80 - 1; rx++) row[rx] = "-";
      return row;
    }),
    start: { x: -2, y: 0 },
    end: { x: 78, y: 6 },
    switches: [{ x: 10, y: 0 }, { x: 25, y: 2 }, { x: 40, y: 4 }, { x: 55, y: 6 }],
    points: [{ x: 5, y: 0 }, { x: 15, y: 2 }, { x: 30, y: 4 }, { x: 45, y: 6 }]
  }
];

levels.forEach(levelObj => {
  levelObj.switches.forEach(sw => levelObj.map[sw.y][sw.x] = "T");
  levelObj.map[levelObj.end.y][levelObj.end.x] = "E";
  levelObj.points.forEach(pt => levelObj.map[pt.y][pt.x] = "P");
  levelObj.map[levelObj.start.y][levelObj.start.x + 2 ] = "S";
});

const railwayQuestions = [
  {
    question: "Jaki jest standardowy rozstaw szyn w Polsce na liniach magistralnych?",
    options: ["1520 mm", "1435 mm", "1000 mm", "1600 mm"],
    correct: 1,
    hint: "Szukaj wartości nazywanej 'normalnotorową', typową dla Europy Środkowej.",
    usefulness: "To podstawowa wiedza przy projektowaniu infrastruktury i utrzymaniu nawierzchni kolejowej (Kwalifikacja TKO.07)."
  },
  {
    question: "Co oznacza sygnał S1 na semaforze świetlnym?",
    options: ["Stój", "Wolna droga", "Zwolnij do 40 km/h", "Ostrożnie"],
    correct: 0,
    hint: "Jest to jedyne światło ciągłe w kolorze czerwonym.",
    usefulness: "Kluczowe dla bezpieczeństwa ruchu. Jako dyżurny ruchu musisz bezbłędnie interpretować sygnały na pulpicie nastawczym."
  },
  {
    question: "Urządzenie na dachu lokomotywy elektrycznej pobierające prąd to:",
    options: ["Odbierak", "Pantograf", "Kolektor", "Zwornik"],
    correct: 1,
    hint: "Nazwa pochodzi od greckiego słowa oznaczającego 'wszystko piszący', ze względu na kształt ramion.",
    usefulness: "Wiedza o budowie taboru jest niezbędna przy diagnostyce awarii sieci trakcyjnej."
  },
  {
    question: "Co to jest ETCS?",
    options: ["System biletowy", "Europejski System Sterowania Pociągiem", "Typ hamulca zespolonego", "Sygnał dźwiękowy"],
    correct: 1,
    hint: "To skrót od European Train Control System.",
    usefulness: "Nowoczesna technologia wdrażana na liniach dużych prędkości, pozwalająca na jazdę bez patrzenia na semafory przy torach."
  },
  {
    question: "SHP to urządzenie bezpieczeństwa, które oznacza:",
    options: ["System Hamowania Pociągu", "Samoczynne Hamowanie Pociągu", "Szybki Hamulec Pomocniczy", "Sygnalizacja Hamowania Przodów"],
    correct: 1,
    hint: "Działa automatycznie, gdy maszynista nie potwierdzi czujności przy rezonatorze torowym.",
    usefulness: "Podstawa bezpieczeństwa biernego na polskiej sieci kolejowej."
  },
  {
    question: "Do czego służy tarcza manewrowa?",
    options: ["Do informowania o pogodzie", "Do wydawania zgody na jazdy manewrowe", "Do ważenia wagonów", "Do oznaczania końca pociągu"],
    correct: 1,
    hint: "Ma niebieskie i białe światła, w przeciwieństwie do semaforów pociągowych.",
    usefulness: "Wykorzystywana codziennie podczas formowania składów towarowych na stacjach rozrządowych."
  },
  {
    question: "Co oznacza skrót PKP?",
    options: ["Polskie Koleje Państwowe", "Polska Komunikacja Pociągowa", "Państwowe Koleje Pasażerskie", "Przewozy Kolejowe Publiczne"],
    correct: 0,
    hint: "To narodowy przewoźnik i zarządca infrastruktury, którego historia sięga 1926 roku.",
    usefulness: "Znajomość struktury narodowego przewoźnika jest ważna dla orientacji w branży."
  },
  {
    question: "Który element toru pozwala pociągowi przejść z jednego toru na drugi?",
    options: ["Rozjazd (zwrotnica)", "Semafor", "Podkład", "Kozioł oporowy"],
    correct: 0,
    hint: "To właśnie tym urządzeniem sterujesz w tej grze!",
    usefulness: "Budowa i konserwacja rozjazdów to kluczowy element kwalifikacji TKO.07."
  },
  {
    question: "Co to jest 'czuwak aktywny'?",
    options: ["Urządzenie kontrolujące czujność maszynisty", "Przycisk do otwierania drzwi", "System klimatyzacji", "Typ hamulca ręcznego"],
    correct: 0,
    hint: "Maszynista musi go naciskać w regularnych odstępach czasu, aby pociąg nie zahamował automatycznie.",
    usefulness: "Zrozumienie systemów bezpieczeństwa czynnego w kabinie maszynisty."
  },
  {
    question: "Jak nazywa się osoba odpowiedzialna za przygotowanie i odprawienie pociągu na stacji?",
    options: ["Dyżurny ruchu", "Konduktor", "Toromistrz", "Rewident"],
    correct: 0,
    hint: "To kluczowe stanowisko w sterowaniu ruchem kolejowym.",
    usefulness: "Dyżurny ruchu to jedna z głównych ścieżek kariery po Techniku Transportu Kolejowego."
  },
  {
    question: "Z jaką maksymalną prędkością pociągi pasażerskie kursują obecnie w Polsce (np. Pendolino)?",
    options: ["120 km/h", "160 km/h", "200 km/h", "300 km/h"],
    correct: 2,
    hint: "Taka prędkość osiągana jest na odcinkach Centralnej Magistrali Kolejowej.",
    usefulness: "Wiedza o parametrach eksploatacyjnych linii kolejowych w kraju."
  },
  {
    question: "Co to jest 'tabor kolejowy'?",
    options: ["Wszystkie pojazdy poruszające się po szynach", "Tylko wagony towarowe", "Budynek dworca", "Zestaw narzędzi do naprawy torów"],
    correct: 0,
    hint: "Obejmuje lokomotywy, wagony, EZT-y i maszyny torowe.",
    usefulness: "Podstawowa terminologia używana w kwalifikacji TKO.08."
  }
];

export default function TransportGame() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [level, setLevel] = useState(levels[0].map.map(row => [...row]));
  const [x, setX] = useState(levels[0].start.x * cell);
  const [y, setY] = useState(levels[0].start.y * cell);
  const [rotation, setRotation] = useState(0);
  const [direction, setDirection] = useState([cell, 0]);
  const [switchDirs, setSwitchDirs] = useState({});
  const [activeSwitch, setActiveSwitch] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [targetDir, setTargetDir] = useState([0, 0]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [pointFrame, setPointFrame] = useState(0);

  // Stany quizu
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [pendingDirection, setPendingDirection] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [showUsefulness, setShowUsefulness] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mapWidth = level[0].length;

  // Kamera: Resetowanie scrolla na start poziomu
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [levelIndex]);

  const chooseDirection = (rx, ry) => {
    setActiveSwitch({ rx, ry });
  };

  const startDirectionQuiz = (dir) => {
    setPendingDirection(dir);
    const rawQuestion = railwayQuestions[Math.floor(Math.random() * railwayQuestions.length)];

    const correctText = rawQuestion.options[rawQuestion.correct];
    const shuffled = [...rawQuestion.options].sort(() => Math.random() - 0.5);
    const newCorrectIdx = shuffled.indexOf(correctText);


    setQuizQuestion({ ...rawQuestion, options: shuffled, correct: newCorrectIdx });
    setQuizFeedback(null);
    setShowHint(false);
    setShowUsefulness(false);
    setIsQuizActive(true);
  };

  const handleQuizAnswer = (optionIndex) => {
    if (optionIndex === quizQuestion.correct) {
      setQuizFeedback({ ok: true, msg: "Poprawnie! Kierunek ustawiony." });
      const key = `${activeSwitch.rx}-${activeSwitch.ry}`;
      setSwitchDirs(prev => ({ ...prev, [key]: pendingDirection }));
      setTimeout(() => {
        setIsQuizActive(false);
        setActiveSwitch(null);
      }, 1000);
    } else {
      setQuizFeedback({ ok: false, msg: "Błąd! Procedura bezpieczeństwa zablokowała zwrotnicę." });
      setScore(prev => Math.max(0, prev - 1));
      setTimeout(() => {
        setIsQuizActive(false);
        setActiveSwitch(null);
      }, 1500);
    }
  };

  const applyHint = () => {
    if (!showHint && score >= 2) {
      setScore(prev => prev - 2);
      setShowHint(true);
    }
  };

  const resetGame = (newLevelIndex = 0, fullReset = true) => {
    const nextLvl = levels[newLevelIndex];
    setLevelIndex(newLevelIndex);
    setLevel(nextLvl.map.map(row => [...row]));
    setX(nextLvl.start.x * cell);
    setY(nextLvl.start.y * cell);
    setDirection([cell, 0]);
    setTransitioning(false);
    setGameOver(false);
    setGameWon(false);
    setSwitchDirs({});
    setIsQuizActive(false);
    setActiveSwitch(null);
    if (fullReset) setScore(0);
  };

  const nextLevel = () => {
    if (levelIndex + 1 < levels.length) {
      resetGame(levelIndex + 1, false);
    } else {
      setGameWon(true);
    }
  };

  const autoMove = () => {
    if (!isGameStarted || gameOver || gameWon || isQuizActive) return;

    const speed = 1.3;
    let dx = direction[0];
    let dy = direction[1];

    if (transitioning) {
      dx = targetDir[0];
      dy = targetDir[1];
    }

    const distance = Math.sqrt(dx * dx + dy * dy);
    const moveX = (dx / distance) * speed;
    const moveY = (dy / distance) * speed;

    const nx = x + moveX;
    const ny = y + moveY;

    const gx = Math.floor((nx + cell / 2) / cell);
    const gy = Math.floor((ny + cell / 2) / cell);

    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    setRotation(angle);

    if (gx < -2 || gy < 0 || gx >= mapWidth || gy >= mapHeight) {
      setGameOver(true);
      return;
    }

    const tile = level[gy][gx];

    if ( (!transitioning && !["-", "T", "P", "E"].includes(tile) ) && !(gx >= -2 && gx <= 1) ) {
      setGameOver(true);
      return;
    }

    if (transitioning && tile === "-" && Math.abs(ny - gy * cell) < speed) {
      setTransitioning(false);
      setDirection([cell, 0]);
      setY(gy * cell);
    }

    if (tile === "T" && !transitioning && Math.abs(nx - gx * cell) < speed) {
      const key = `${gx}-${gy}`;
      const state = switchDirs[key] || "straight";
      setTransitioning(true);
      const targetYDir = state === 'up' ? -cell / 2.8 : state === 'down' ? cell / 2.8 : 0;
      setTargetDir([cell, targetYDir]);
    }

    if (tile === "P") {
      setScore(prev => prev + 1);
      const newLevel = level.map(row => [...row]);
      newLevel[gy][gx] = "-";
      setLevel(newLevel);
    }

    setX(nx);
    setY(ny);

    if (tile === "E") {
      nextLevel();
    }
  };

  useEffect(() => {
    let frameId: number;
    const loop = () => {
      autoMove();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [x, y, direction, switchDirs, transitioning, targetDir, gameOver, gameWon, levelIndex, isQuizActive, isGameStarted]);

  return (
      <div className="relative w-full h-[80vh] overflow-hidden bg-slate-950 font-sans text-slate-50">

        {/* HUD: Punkty */}
        <div className="fixed top-4 left-[64%] -translate-x-1/2 z-[100] pointer-events-none">
          <div className="bg-black/60 px-8 py-3 rounded-full border-2 border-primary/30 backdrop-blur-lg flex items-center gap-4 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <TrainIcon className="text-primary w-6 h-6" />
            <span className="text-2xl font-black uppercase tracking-tighter italic">Punkty: {score}</span>
          </div>
        </div>

        <Card className="h-screen w-[28%] fixed left-0 top-0 border-r border-white/5 bg-card/95 text-card-foreground flex flex-col p-6 overflow-hidden z-20">
          <div className="pt-12 flex-1 overflow-y-auto custom-scrollbar">
            <div className="mb-8 text-center bg-primary/5 p-6 rounded-3xl border border-primary/10">
              <GraduationCap className="w-14 h-14 text-primary mx-auto mb-4 animate-bounce" />
              <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2 text-foreground">Szkoła Kolejowa</h2>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-70">Symulator Dyżurnego Ruchu</p>
            </div>

            <div className="space-y-6">
              <section className="space-y-3">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <MapIcon size={14} /> Nawigacja Trasy
                </h4>
                <div className="grid grid-cols-2 gap-2 text-foreground">
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                    <span className="block text-[9px] font-bold text-muted-foreground mb-1">POZIOM:</span>
                    <span className="text-lg font-black">{levelIndex + 1} / {levels.length}</span>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                    <span className="block text-[9px] font-bold text-muted-foreground mb-1">STATUS:</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Operacyjny
                  </span>
                  </div>
                </div>
              </section>

              <section className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/20">
                <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <ShieldCheck size={14} /> Procedura Autoryzacji
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
                  Aby zmienić położenie zwrotnicy, musisz potwierdzić znajomość przepisów. Każda zmiana toru to egzamin czujności.
                </p>
              </section>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-4 bg-card">
            <div className="bg-muted/50 p-4 rounded-xl">
              <span className="text-[9px] font-black text-muted-foreground uppercase block mb-2">Specjalizacja:</span>
              <span className="text-xs font-bold flex items-center gap-2 text-foreground">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Technik Transportu Kolejowego
            </span>
            </div>
          </div>
        </Card>

        {/* QUIZ OVERLAY */}
        {isQuizActive && (
            <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in">
              <Card className="max-w-xl w-full p-8 border-4 border-primary/30 shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-in zoom-in-95 bg-slate-900 overflow-hidden relative text-white">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <TrainIcon size={200} />
                </div>

                <div className="text-center mb-8">
                  <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                    <ShieldCheck className="text-primary w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Autoryzacja Manewru</h3>
                  <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-60">Zabezpieczenie Trasy</p>
                </div>

                <div className="space-y-6">
                  <p className="text-xl font-bold text-center leading-tight mb-8">{quizQuestion.question}</p>

                  <div className="grid gap-3">
                    {quizQuestion.options.map((opt, i) => (
                        <Button
                            key={i}
                            variant="outline"
                            disabled={!!quizFeedback}
                            onClick={() => handleQuizAnswer(i)}
                            className="h-16 text-sm font-black border-2 rounded-2xl hover:bg-primary/10 transition-all whitespace-normal py-4 arcade-button"
                        >
                          {opt}
                        </Button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={showHint || score < 2 || !!quizFeedback}
                        onClick={applyHint}
                        className="rounded-xl border-2 h-12 text-[10px] font-black uppercase"
                    >
                      <Lightbulb className="w-4 h-4 mr-2 text-amber-400" />
                      Podpowiedź (-2 PKT)
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowUsefulness(!showUsefulness)}
                        disabled={!!quizFeedback}
                        className="rounded-xl border-2 text-[10px] font-black uppercase h-auto py-3 whitespace-normal"
                    >
                      <HelpCircle className="w-4 h-4 mr-2 text-blue-400" />
                      Zastosowanie
                    </Button>
                  </div>

                  {showHint && (
                      <div className="p-4 bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl animate-in slide-in-from-top-4">
                        <p className="text-xs font-bold italic text-amber-200 text-center uppercase tracking-wider mb-1">Wskazówka techniczna:</p>
                        <p className="text-sm text-center text-amber-100/80">{quizQuestion.hint}</p>
                      </div>
                  )}

                  {showUsefulness && (
                      <div className="p-4 bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl animate-in slide-in-from-top-4">
                        <div className="flex items-center gap-2 mb-1 justify-center">
                          <Info size={14} className="text-blue-400" />
                          <p className="text-xs font-black text-blue-200 uppercase">Praktyka zawodowa:</p>
                        </div>
                        <p className="text-sm text-center text-blue-100/80 leading-relaxed">{quizQuestion.usefulness}</p>
                      </div>
                  )}

                  {quizFeedback && (
                      <div className={`p-6 rounded-2xl border-4 text-center animate-in slide-in-from-bottom-4 shadow-2xl ${
                          quizFeedback.ok ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-red-500/20 border-red-500 text-red-400"
                      }`}>
                        <div className="flex items-center justify-center gap-3 mb-2">
                          {quizFeedback.ok ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                          <span className="font-black uppercase text-xl">{quizFeedback.ok ? "Autoryzowano" : "Odrzucono"}</span>
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest italic">{quizFeedback.msg}</p>
                      </div>
                  )}
                </div>
              </Card>
            </div>
        )}

        {/* MAPA Z DYNAMICZNĄ SZEROKOŚCIĄ */}
        <Card className="h-screen w-[72%] fixed right-0 top-0 border-l border-white/5 bg-slate-900 flex flex-col overflow-hidden shadow-2xl">
          <div
              ref={scrollContainerRef}
              className={`relative flex-1 cursor-crosshair custom-scrollbar ${isGameStarted ? 'overflow-auto' : 'overflow-hidden'}`}
          >
            <div
                className="relative bg-slate-800 shadow-inner rounded-sm overflow-hidden"
                style={{
                  width: mapWidth * cell,
                  height: mapHeight * cell,
                  backgroundImage: `url(${ground})`, // Tło ziemi jako powtarzalny obrazek
                  backgroundSize: `${cell}px ${cell}px`
                }}
            >
              {/* Renderujemy tło torów tylko dla wierszy, które je mają (znaczna poprawa wydajności) */}
              {level.map((row, ry) => {
                const hasRails = row.some(tile => tile === "-" || tile === "P" || tile === "T");
                if (!hasRails) return null;
                return (
                    <div
                        key={`rail-row-${ry}`}
                        className="absolute left-0 w-full opacity-90 pointer-events-none"
                        style={{
                          top: ry * cell,
                          height: cell,
                          backgroundImage: `url(${rails})`,
                          backgroundSize: `${cell}px ${cell}px`,
                          backgroundRepeat: 'repeat-x'
                        }}
                    />
                );
              })}

              {level.map((row, ry) =>
                  row.map((tile, rx) => {
                    if (tile === " " || tile === "-") return null; // NIE RENDERUJEMY PUSTYCH DIVÓW

                    const key = `${rx}-${ry}`;
                    const isSwitch = tile === "T";
                    const switchState = switchDirs[key] || "straight";

                    return (
                        <div
                            key={key}
                            onClick={isSwitch ? () => chooseDirection(rx, ry) : undefined}
                            className={
                              isSwitch
                                  ? "cursor-pointer transition-all border-4 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] z-20 bg-amber-500/10"
                                  : "z-10"
                            }
                            style={{
                              width: cell,
                              height: cell,
                              position: "absolute",
                              top: ry * cell,
                              left: rx * cell,
                            }}
                        >
                          {isSwitch && (
                              <img
                                  src={switchState === "up" ? switchToTop : switchState === "down" ? switchToBottom : switchImg}
                                  alt="switch"
                                  className="w-full h-full object-contain pixelated"
                              />
                          )}

                          {tile === "P" && (
                              <div className="w-full h-full flex items-center justify-center relative">
                                <div className="w-6 h-6 bg-primary rounded-full border-4 border-white shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-pulse" />
                              </div>
                          )}

                          {tile === "E" && <img src={exitLevel} className="w-full h-full object-contain pixelated" />}
                          {tile === "S" && <img src={enterLevel} className="w-full h-full object-contain pixelated" />}
                        </div>
                    );
                  })
              )}

              {/* POCIĄG NA SAMYM WIERZCHU */}
              <div className="relative z-50">
                <Train x={x} y={y} rotation={rotation} />
              </div>
            </div>

              {/* PANEL ZMIANY ZWROTNICY */}
              {activeSwitch && !isQuizActive && (
                <div
                  className="absolute bg-slate-900 p-5 border-4 border-primary z-[60] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 text-white"
                  style={{
                    top: activeSwitch.ry * cell + 40,
                    left: activeSwitch.rx * cell,
                  }}
                >
                  <p className="text-[10px] font-black mb-4 uppercase text-primary tracking-[0.3em] text-center border-b border-primary/20 pb-2">
                    Przestaw:
                  </p>
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-xs font-black arcade-button h-12 w-20"
                      onClick={() => startDirectionQuiz("up")}
                    >
                      Góra
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-xs font-black arcade-button h-12 w-20"
                      onClick={() => startDirectionQuiz("straight")}
                    >
                      Prosto
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-xs font-black arcade-button h-12 w-20"
                      onClick={() => startDirectionQuiz("down")}
                    >
                      Dół
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {!isGameStarted && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                <Button
                  onClick={() => setIsGameStarted(true)}
                  className="h-24 px-16 bg-primary hover:bg-primary/90 text-3xl font-black arcade-button shadow-[0_0_50px_rgba(59,130,246,0.4)] uppercase tracking-tighter italic"
                >
                  Start
                </Button>
              </div>
            )}
        </Card>


        {/* GAME OVER / WON */}
        {(gameOver || gameWon) && (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950/95 text-white z-[200] backdrop-blur-2xl p-12 text-center">
              <div className="max-w-2xl w-full">
                <h2 className="text-8xl font-black uppercase tracking-tighter mb-4 italic">
                  {gameWon ? "Trasa Zabezpieczona!" : "Katastrofa!"}
                </h2>
                <div className="bg-primary/10 border-2 border-primary/30 p-8 rounded-3xl mb-12">
                  <p className="text-xl text-muted-foreground uppercase tracking-widest mb-2 font-bold">Raport Końcowy Dyżurnego:</p>
                  <div className="text-6xl font-black text-primary italic drop-shadow-sm">{score} PKT</div>
                </div>
                <Button
                  onClick={() => {
                    resetGame(0, true);
                    setIsGameStarted(false);
                  }}
                  className="h-24 px-16 bg-primary hover:bg-primary/90 text-3xl font-black arcade-button shadow-[0_0_50px_rgba(59,130,246,0.4)] uppercase tracking-tighter italic"
                >
                  Spróbuj Ponownie
                </Button>
              </div>
            </div>
        )}
      </div>
  );
}