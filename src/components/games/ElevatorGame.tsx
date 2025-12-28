import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Map as MapIcon, ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import stairs_to_left from "@/assets/graphics/stairs/stairs_to_left.png";
import stairs_to_right from "@/assets/graphics/stairs/stairs_to_right.png";
import user_to_left from "@/assets/graphics/stairs/user_to_left.png";
import user_to_right from "@/assets/graphics/stairs/user_to_right.png";

const originalCell = 32;
const cell = 128;
const scale = cell / originalCell;
const mapWidthCells = 10;
const mapWidth = mapWidthCells * cell;
const stairWidthRatio = 0.8;
const stairWidth = stairWidthRatio * mapWidth;
const centerX = mapWidth / 2;
const segmentsPerFloor = 2;
const stepsPerSegment = 8;
const floors = 6;
const totalSegments = floors * segmentsPerFloor;
const heightPerStep = cell;
const heightPerSegment = stepsPerSegment * heightPerStep;

// Proceduralne generowanie segmentów (logika bez zmian)
const segments: any[] = [];
let currentX = centerX + stairWidth / 2;
let currentY = (floors * segmentsPerFloor * stepsPerSegment) * heightPerStep + cell * 2; // start at bottom
let directionLeft = true;

for (let i = 0; i < totalSegments; i++) {
  const dirX = directionLeft ? -stairWidth : stairWidth;
  const dirY = -heightPerSegment;
  const length = Math.sqrt(dirX ** 2 + dirY ** 2);
  const unitDirX = dirX / length;
  const unitDirY = dirY / length;

  segments.push({
    startX: currentX,
    startY: currentY,
    dirX: unitDirX,
    dirY: unitDirY,
    length,
    isLeft: directionLeft,
  });

  currentX += dirX;
  currentY += dirY;
  directionLeft = !directionLeft;
}

const totalHeight = (floors * segmentsPerFloor * stepsPerSegment) * heightPerStep + cell * 4;

// --- KONFIGURACJA KOLORÓW TŁA ---
// 3 zestawy kolorów, które będą się powtarzać.
// Każdy zestaw ma 'light' (1. półpiętro) i 'dark' (2. półpiętro)
const segmentPalette = [
  // Zestaw 1: Bardzo jasny żółty (kremowy)
  { light: '#FEFCE8', dark: '#FEF9C3' },
  // Zestaw 2: Bardziej nasycony żółty
  { light: '#FDE047', dark: '#FACC15' },
  // Zestaw 3: Wpadający w złoto/pomarańcz
  { light: '#FFEDD5', dark: '#FED7AA' },
];

export default function ElevatorGame() {
  const [currentSegment, setCurrentSegment] = useState(0);
  const [progress, setProgress] = useState(0);
  const [x, setX] = useState(segments[0].startX);
  const [y, setY] = useState(segments[0].startY);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [jumpKey, setJumpKey] = useState(0);
  const [canJump, setCanJump] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Kamera podąża za bohaterem
  useEffect(() => {
    if (scrollContainerRef.current && isGameStarted) {
      const viewH = scrollContainerRef.current.clientHeight;
      const targetScroll = Math.max(0, y - viewH * 0.75 + cell / 2);
      scrollContainerRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }, [y, isGameStarted]);

  useEffect(() => {
    if (isGameStarted) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isGameStarted]);

  const stepSize = segments[0].length / stepsPerSegment;
  const jumpDuration = 0.4;
  const extraDelay = 0.05;
  const jumpInterval = (jumpDuration + extraDelay) * 1000;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' && isGameStarted && isReady && canJump && !gameOver && !gameWon) {
      const newProgress = progress + stepSize;

      if (newProgress >= segments[currentSegment].length - 1e-6) {
        if (currentSegment + 1 >= totalSegments) {
          setGameWon(true);
          return;
        }
        setCurrentSegment(currentSegment + 1);
        setProgress(0);
        setX(segments[currentSegment + 1].startX);
        setY(segments[currentSegment + 1].startY);
      } else {
        setProgress(newProgress);
        const seg = segments[currentSegment];
        setX(seg.startX + seg.dirX * newProgress);
        setY(seg.startY + seg.dirY * newProgress);
      }

      setJumpKey(prev => prev + 1);
      setCanJump(false);
      setTimeout(() => {
        setCanJump(true);
      }, jumpInterval);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSegment, progress, isGameStarted, isReady, canJump, gameOver, gameWon]);

  const resetGame = () => {
    setCurrentSegment(0);
    setProgress(0);
    setX(segments[0].startX);
    setY(segments[0].startY);
    setGameOver(false);
    setGameWon(false);
    setJumpKey(0);
    setCanJump(true);
    setIsReady(false);
    if (scrollContainerRef.current) {
      const viewH = scrollContainerRef.current.clientHeight;
      scrollContainerRef.current.scrollTo({ top: totalHeight - viewH, behavior: 'smooth' });
    }
  };

  const offsetValue = 8 * scale;
  const offset = segments[currentSegment].isLeft ? offsetValue : -offsetValue;
  const heroWidth = originalCell * scale;
  const heroHeight = 2 * originalCell * scale;
  const jumpAmount = -30 * scale;
  const indicatorSize = 20 * scale;
  const indicatorOffsetY = -indicatorSize - 10 * scale;
  const indicatorOffsetX = (heroWidth / 2) - (indicatorSize / 2);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans text-slate-50">

      {/* PANEL BOCZNY (UI) */}
      <Card className="h-screen w-[28%] fixed left-0 top-0 border-r border-white/5 bg-card/95 text-card-foreground flex flex-col p-6 overflow-hidden z-20">
        <div className="pt-12 flex-1 overflow-y-auto custom-scrollbar">
          <div className="mb-8 text-center bg-primary/5 p-6 rounded-3xl border border-primary/10">
            <GraduationCap className="w-14 h-14 text-primary mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2 text-foreground">Gra o Schodach</h2>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-70">Symulator Wspinaczki</p>
          </div>

          <div className="space-y-6">
            <section className="space-y-3">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                <MapIcon size={14} /> Nawigacja Trasy
              </h4>
              <div className="grid grid-cols-2 gap-2 text-foreground">
                <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                  <span className="block text-[9px] font-bold text-muted-foreground mb-1">PIĘTRO:</span>
                  <span className="text-lg font-black">{Math.floor(currentSegment / 2) + 1} / {floors}</span>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                  <span className="block text-[9px] font-bold text-muted-foreground mb-1">STATUS:</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Wspinaczka
                  </span>
                </div>
              </div>
            </section>

            <section className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/20">
              <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                <ShieldCheck size={14} /> Procedura Wspinaczki
              </h4>
              <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
                Naciśnij SPACJĘ, aby skoczyć po schodach. Kamera podąża za bohaterem.
              </p>
            </section>
          </div>
        </div>
      </Card>

      {/* MAPA */}
      <Card className="h-screen w-[72%] fixed right-0 top-0 border-l border-white/5 bg-slate-900 flex flex-col overflow-hidden shadow-2xl">
        <div
          ref={scrollContainerRef}
          className={`relative flex-1 pointer-events-none custom-scrollbar overflow-auto flex justify-center scrollbar-hide`}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          <div
            className="relative bg-slate-800 shadow-inner rounded-sm overflow-hidden"
            style={{
              width: mapWidth,
              height: totalHeight,
            }}
          >
            {/* NOWY SYSTEM TŁA:
              Renderujemy tło dla każdego segmentu (półpiętra) osobno.
            */}
            {segments.map((_, idx) => {
              // 1. Obliczanie pozycji Y diva (top-down)
              // idx = 0 to pierwszy segment na dole
              // top = totalHeight - padding - (idx+1)*height
              const segmentTopY = totalHeight - (cell * 2) - ((idx + 1) * heightPerSegment);

              // 2. Obliczanie kolorów
              const floorIndex = Math.floor(idx / segmentsPerFloor);
              const isFirstHalf = idx % 2 === 0;
              const paletteIndex = floorIndex % segmentPalette.length;
              const colors = segmentPalette[paletteIndex];
              const bgColor = isFirstHalf ? colors.light : colors.dark;

              // 3. Linie oddzielające (opcjonalne, dla estetyki)
              const borderStyle = isFirstHalf
                ? 'none' // Brak linii między 1 a 2 półpiętrem tego samego piętra (lub delikatna)
                : '2px solid rgba(255,255,255,0.3)'; // Linia oddzielająca piętra

              return (
                <div
                  key={`bg-segment-${idx}`}
                  style={{
                    position: 'absolute',
                    top: segmentTopY,
                    left: 0,
                    width: mapWidth,
                    height: heightPerSegment,
                    backgroundColor: bgColor,
                    borderTop: borderStyle,
                    zIndex: 0, // Za schodami
                  }}
                />
              );
            })}

            {/* Render schodów (na wierzchu teł) */}
            {segments.map((seg, idx) => (
              <div key={`stairs-cont-${idx}`} style={{ zIndex: 10 }}>
                {Array.from({ length: stepsPerSegment }).map((_, j) => {
                  const fraction = (j + 0.5) / stepsPerSegment;
                  const posX = seg.startX + fraction * seg.dirX * seg.length - (cell / 2);
                  const posY = seg.startY + fraction * seg.dirY * seg.length - (cell / 2);
                  const src = seg.isLeft ? stairs_to_left : stairs_to_right;
                  return (
                    <img
                      key={`${idx}-${j}`}
                      src={src}
                      alt="stair step"
                      style={{
                        position: 'absolute',
                        left: posX,
                        top: posY,
                        width: cell,
                        height: cell,
                        zIndex: 10
                      }}
                    />
                  );
                })}
              </div>
            ))}

            {/* Bohater */}
            <motion.div
              key={jumpKey}
              initial={{ y: 0 }}
              animate={{ y: [jumpAmount, 0] }}
              transition={{ duration: jumpDuration, ease: "easeOut" }}
              className="absolute z-50"
              style={{
                top: y - heroHeight,
                left: x - (heroWidth / 2) + offset,
              }}
            >
              <img
                src={segments[currentSegment].isLeft ? user_to_left : user_to_right}
                alt="hero"
                style={{
                  width: heroWidth,
                  height: heroHeight
                }}
              />
              <motion.div
                style={{
                  position: 'absolute',
                  top: indicatorOffsetY,
                  left: indicatorOffsetX,
                  width: indicatorSize,
                  height: indicatorSize,
                  borderRadius: '50%',
                  backgroundColor: '#FFFF00',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </motion.div>
          </div>
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
              {gameWon ? "Szczyt Osiągnięty!" : "Upadek!"}
            </h2>
            <div className="bg-primary/10 border-2 border-primary/30 p-8 rounded-3xl mb-12">
              <p className="text-xl text-muted-foreground uppercase tracking-widest mb-2 font-bold">Raport Końcowy:</p>
              <div className="text-6xl font-black text-primary italic drop-shadow-sm">Sukces</div>
            </div>
            <Button
              onClick={() => {
                resetGame();
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