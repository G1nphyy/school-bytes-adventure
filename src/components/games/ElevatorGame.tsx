import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Activity, Target, Clock, MapPin as MapPinIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import stairs_to_left from "@/assets/graphics/stairs/stairs_to_left.png";
import stairs_to_right from "@/assets/graphics/stairs/stairs_to_right.png";
import user_to_left from "@/assets/graphics/stairs/user_to_left.png";
import user_to_right from "@/assets/graphics/stairs/user_to_right.png";
import npc0_left from "@/assets/graphics/stairs/npc0_left.png";
import npc0_right from "@/assets/graphics/stairs/npc0_right.png";
import npc1_left from "@/assets/graphics/stairs/npc1_left.png";
import npc1_right from "@/assets/graphics/stairs/npc1_right.png";
import npc2_left from "@/assets/graphics/stairs/npc2_left.png";
import npc2_right from "@/assets/graphics/stairs/npc2_right.png";
import pinImg from "@/assets/graphics/stairs/pin.png";
import starImg from "@/assets/graphics/stairs/star.png";
const originalCell = 32;
const stairWidthRatio = 0.5;
const segmentsPerFloor = 2;
const stepsPerSegment = 8;
const floors = 6;
const stepsPerFloor = stepsPerSegment * segmentsPerFloor;
const totalSegments = floors * segmentsPerFloor;
const visualShiftX = 32;
const visualShiftY = 16;
const minMapWidth = 2048;
const npcGraphics: Record<number, { left: string, right: string }> = {
  0: { left: npc0_left, right: npc0_right },
  1: { left: npc1_left, right: npc1_right },
  2: { left: npc2_left, right: npc2_right },
};
const getPosForStep = (globalStepIndex: number, segments: any[]) => {
  if (!segments || segments.length === 0) return { x: 0, y: 0, isLeft: false };
  let segIdx = Math.floor(globalStepIndex / stepsPerSegment);
  if (segIdx >= segments.length) segIdx = segments.length - 1;
  const seg = segments[segIdx];
  const stepInSeg = globalStepIndex % stepsPerSegment;
  const fraction = (stepInSeg + 0.5) / stepsPerSegment;
  return {
    x: seg.startX + fraction * seg.dirX * seg.length,
    y: seg.startY + fraction * seg.dirY * seg.length,
    isLeft: seg.isLeft
  };
};
export default function ElevatorGame() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [mapWidth, setMapWidth] = useState(0);
  const [virtualMapWidth, setVirtualMapWidth] = useState(0);
  const [userStep, setUserStep] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timeOut, setTimeOut] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [jumpKey, setJumpKey] = useState(0);
  const [canJump, setCanJump] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [npcs, setNpcs] = useState<any[]>([]);
  const [initialSpawnDone, setInitialSpawnDone] = useState(false);
  const [segments, setSegments] = useState<any[]>([]);
  const [trafficJam, setTrafficJam] = useState(false);
  const [targetFloor, setTargetFloor] = useState(5);
  const [starStep, setStarStep] = useState(0);
  const [starCollected, setStarCollected] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isFinishing, setIsFinishing] = useState(false);
  const [triggeredFloors, setTriggeredFloors] = useState<number[]>([]);
  const [randomJamCount, setRandomJamCount] = useState(0);
  const [lastUserMoveTime, setLastUserMoveTime] = useState(Date.now());
  const [spawnedFloor1, setSpawnedFloor1] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const npcIdRef = useRef(0);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPaused = !isGameStarted || gameOver || gameWon || timeOut || isFinishing;
  // RESIZE HANDLING
  useEffect(() => {
    const updateDimensions = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        if (scrollContainerRef.current) {
          const newWidth = scrollContainerRef.current.clientWidth;
          setMapWidth(newWidth);
          setIsMobile(window.innerWidth < 768);
        }
      }, 50);
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, []);
  useEffect(() => {
    if (mapWidth > 0) {
        setVirtualMapWidth(minMapWidth);
    }
  }, [mapWidth, isMobile]);
  const cell = 128;
  const scale = cell / originalCell;
  const heightPerStep = cell;
  const heightPerSegment = stepsPerSegment * heightPerStep;
  const totalHeight = (floors * segmentsPerFloor * stepsPerSegment) * heightPerStep + cell * 4;
  const heroWidth = originalCell * scale;
  const heroHeight = 2 * originalCell * scale;
  const visualShiftXScaled = visualShiftX * scale;
  const visualShiftYScaled = visualShiftY * scale;
  // Recalculate positions immediately
  useEffect(() => {
    if (segments.length > 0) {
      const p = getPosForStep(userStep, segments);
      setX(p.x); setY(p.y);
      setNpcs(prev => prev.map(n => {
        const np = getPosForStep(n.currentStep, segments);
        return { ...n, x: np.x, y: np.y, isLeft: np.isLeft };
      }));
    }
  }, [virtualMapWidth, segments, userStep]);
  useEffect(() => {
    if (virtualMapWidth > 0) {
      const stairWidth = stairWidthRatio * virtualMapWidth;
      const centerX = virtualMapWidth / 2;
      const segs: any[] = [];
      let currentX = centerX + stairWidth / 2;
      let currentY = (floors * segmentsPerFloor * stepsPerSegment) * heightPerStep + cell * 2;
      let directionLeft = true;
      for (let i = 0; i < totalSegments; i++) {
        const dirX = directionLeft ? -stairWidth : stairWidth;
        const dirY = -heightPerSegment;
        const length = Math.sqrt(dirX ** 2 + dirY ** 2);
        const isLastSegment = i === totalSegments - 1;
        segs.push({
            startX: currentX,
            startY: currentY,
            dirX: dirX / length,
            dirY: dirY / length,
            length,
            isLeft: directionLeft,
            isHidden: isLastSegment
        });
        currentX += dirX; currentY += dirY; directionLeft = !directionLeft;
      }
      setSegments(segs);
      setStarStep(5 * stepsPerFloor);
    }
  }, [virtualMapWidth, cell]);
  // Traffic Jam Logic
  useEffect(() => {
    if (isPaused || !hasMoved) return;
    const currentFloor = Math.floor(userStep / stepsPerFloor);
    if ((currentFloor === 2 || currentFloor === 4) && !triggeredFloors.includes(currentFloor)) {
      setTrafficJam(true);
      setTriggeredFloors(prev => [...prev, currentFloor]);
      setTimeout(() => setTrafficJam(false), 5000);
    }
    if (randomJamCount < 2 && !trafficJam && Math.random() < 0.005) {
      setTrafficJam(true);
      setRandomJamCount(prev => prev + 1);
      setTimeout(() => setTrafficJam(false), 3000 + Math.random() * 2000);
    }
  }, [userStep, isPaused, hasMoved, trafficJam]);
  useEffect(() => {
    if (!timerActive || isPaused) return;
    if (timeLeft <= 0) { setTimeOut(true); return; }
    const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(t);
  }, [timerActive, isPaused, timeLeft]);
  // Camera follow
  useEffect(() => {
    if (contentRef.current && scrollContainerRef.current && isGameStarted) {
      const viewW = scrollContainerRef.current.clientWidth;
      const viewH = scrollContainerRef.current.clientHeight;
      const targetLeft = x - viewW / 2;
      const targetTop = y - viewH / 2;
      contentRef.current.style.transform = `translate3d(${-targetLeft}px, ${-targetTop}px, 0)`;
      if (!isReady && y > 0) {
        setTimeout(() => setIsReady(true), 1000);
      }
    }
  }, [x, y, isGameStarted, cell, isMobile, virtualMapWidth]);
  const handleJump = () => {
    if (isGameStarted && isReady && canJump && !isPaused) {
      if (!timerActive) setTimerActive(true);
      if (!hasMoved) setHasMoved(true);
      const nextStep = userStep + 1;
      if (nextStep >= starStep) {
        const p = getPosForStep(nextStep, segments);
        setX(p.x); setY(p.y); setUserStep(nextStep);
        setStarCollected(true); setIsFinishing(true);
        setTimeout(() => setGameWon(true), 800);
        return;
      }
      if (npcs.some(n => n.currentStep === nextStep && !n.isFinishing && !n.isGhost)) { setGameOver(true); return; }
      const nextPos = getPosForStep(nextStep, segments);
      setUserStep(nextStep); setX(nextPos.x); setY(nextPos.y);
      setJumpKey(prev => prev + 1); setCanJump(false);
      setLastUserMoveTime(Date.now());
      setTimeout(() => setCanJump(true), 400);
    }
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space') handleJump();
  };
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [userStep, isGameStarted, isReady, canJump, isPaused, npcs, segments, starStep, timerActive]);
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.game-area')) {
          e.preventDefault();
          handleJump();
      }
    };
    const gameElement = document.getElementById('game-touch-area');
    if (gameElement) {
        gameElement.addEventListener('touchstart', handleTouchStart, { passive: false });
        return () => gameElement.removeEventListener('touchstart', handleTouchStart);
    }
  }, [handleJump]);
  useEffect(() => {
    if (isPaused || !hasMoved) return;
    const moveInterval = setInterval(() => {
      setNpcs(prev => {
        const occupied = new Set(prev.map(n => n.currentStep));
        occupied.add(userStep);
        const now = Date.now();
        const lastRoundNpcs = prev.filter(n => n.exitStep === stepsPerFloor * 5 && !n.isFinishing);
        let avgLastRoundStep = 0;
        if (lastRoundNpcs.length > 0) {
          avgLastRoundStep = lastRoundNpcs.reduce((sum, n) => sum + n.currentStep, 0) / lastRoundNpcs.length;
        }
        return prev.map(npc => {
          const isLastRound = npc.exitStep === stepsPerFloor * 5;
          const isBoosted = isLastRound && !trafficJam && npc.currentStep < avgLastRoundStep - 3;
          const effectiveSpeed = isBoosted ? 400 : npc.speed;
          if (npc.isFinishing) return npc;
          if (now - npc.lastMoveTime < effectiveSpeed) return npc;
          const nextStep = npc.currentStep + 1;
          const isAtExit = npc.currentStep >= npc.exitStep;
          const isNextStepFree = !occupied.has(nextStep);
          if (trafficJam && !isAtExit && isNextStepFree) return { ...npc, sayingSorry: true };
          if (isAtExit) return { ...npc, isFinishing: true, sayingSorry: false };
          if (isNextStepFree) {
            const pos = getPosForStep(nextStep, segments);
            return { ...npc, currentStep: nextStep, x: pos.x, y: pos.y, isLeft: pos.isLeft, jumpKey: npc.jumpKey + 1, lastMoveTime: now, sayingSorry: false };
          }
          return { ...npc, sayingSorry: false };
        }).filter(npc => {
          if (npc.isFinishing && !npc.finishTime) npc.finishTime = now;
          return !(npc.isFinishing && now - (npc.finishTime || 0) > 800);
        });
      });
    }, 100);
    return () => clearInterval(moveInterval);
  }, [isPaused, hasMoved, trafficJam, userStep, segments]);
  useEffect(() => {
    if (isGameStarted && !initialSpawnDone && segments.length > 0) {
      const newNpcs = [];
      let lastType = -1;
      const createNpc = (i: number, exitStep: number) => {
        const pos = getPosForStep(i, segments);
        let npcType = Math.floor(Math.random() * 3);
        while (npcType === lastType) { npcType = Math.floor(Math.random() * 3); }
        lastType = npcType;
        return {
          id: npcIdRef.current++, currentStep: i, x: pos.x, y: pos.y, isLeft: pos.isLeft,
          exitStep: exitStep, speed: 600 + Math.random() * 400,
          lastMoveTime: Date.now(), jumpKey: 0, isFinishing: false, isGhost: false, sayingSorry: false,
          npcType: npcType
        };
      };
      [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].forEach(i => newNpcs.push(createNpc(i, stepsPerFloor * 4)));
      [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29].forEach(i => newNpcs.push(createNpc(i, stepsPerFloor * 3)));
      [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45].forEach(i => newNpcs.push(createNpc(i, stepsPerFloor * 4)));
      [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61].forEach(i => newNpcs.push(createNpc(i, stepsPerFloor * 5)));
      setNpcs(newNpcs);
      setInitialSpawnDone(true);
    }
  }, [isGameStarted, initialSpawnDone, segments]);
  useEffect(() => {
    if (isPaused || !hasMoved || spawnedFloor1) return;
    if (userStep >= stepsPerFloor * 2) {
      setNpcs(prev => {
        const newNpcs = [...prev];
        let lastType = -1;
        [stepsPerFloor + 1, stepsPerFloor + 3, stepsPerFloor + 5, stepsPerFloor + 7, stepsPerFloor + 9, stepsPerFloor + 11].forEach(i => {
           const pos = getPosForStep(i, segments);
           let npcType = Math.floor(Math.random() * 3);
           while (npcType === lastType) { npcType = Math.floor(Math.random() * 3); }
           lastType = npcType;
           newNpcs.push({
            id: npcIdRef.current++, currentStep: i, x: pos.x, y: pos.y, isLeft: pos.isLeft,
            exitStep: stepsPerFloor * 4, speed: 600 + Math.random() * 400,
            lastMoveTime: Date.now(), jumpKey: 0, isFinishing: false, isGhost: false, sayingSorry: false, npcType
           });
        });
        return newNpcs;
      });
      setSpawnedFloor1(true);
    }
  }, [userStep, isPaused, hasMoved, spawnedFloor1, segments]);
  const resetGame = () => {
    const startPos = getPosForStep(0, segments);
    setUserStep(0); setX(startPos.x); setY(startPos.y);
    setGameOver(false); setGameWon(false); setTimeOut(false); setIsFinishing(false);
    setJumpKey(0); setNpcs([]); setInitialSpawnDone(false);
    setIsReady(false); setHasMoved(false); setStarCollected(false); setTimeLeft(120);
    setTimerActive(false); setTriggeredFloors([]); setRandomJamCount(0);
    setTrafficJam(false); setLastUserMoveTime(Date.now());
    setSpawnedFloor1(false);
    if (contentRef.current) contentRef.current.style.transform = 'translate3d(0px, 0px, 0px)';
  };
  const currentFloor = Math.floor(userStep / stepsPerFloor);
  const currentFloorDisplay = currentFloor === 0 ? "PARTER" : currentFloor;
  const starPoint = segments.length > 0 ? getPosForStep(starStep, segments) : null;
  const centerX = virtualMapWidth / 2;
  const stairWidth = stairWidthRatio * virtualMapWidth;
  const leftWallX = centerX - stairWidth / 2 - 100;
  const rightWallX = centerX + stairWidth / 2 + 100;
  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans text-slate-50">
      {!isMobile && (
        <Card className="h-screen w-[28%] fixed left-0 top-0 border-r border-white/10 bg-slate-900/95 flex flex-col p-6 z-50">
          <div className="pt-8">
            <div className="mb-6 text-center bg-primary/10 p-4 rounded-2xl border border-primary/20">
              <GraduationCap className="w-10 h-10 text-primary mx-auto mb-1 animate-bounce" />
              <h2 className="text-lg font-black uppercase italic tracking-tighter">System HR</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${isPaused ? 'bg-slate-800 border-white/10' : (trafficJam ? 'bg-red-500/20 border-red-500' : 'bg-green-500/20 border-green-500')}`}>
                  <Activity className={`w-5 h-5 mb-1 ${trafficJam ? 'text-red-500' : 'text-green-500'}`} />
                  <span className="text-[10px] uppercase font-bold opacity-70">Status</span>
                  <div className="font-black text-sm">{isPaused ? "STOP" : (trafficJam ? "ZATOR" : "PŁYNNY")}</div>
                </div>
                <div className="p-4 rounded-xl border-2 border-primary/40 bg-primary/10 flex flex-col items-center justify-center">
                  <Target className="w-5 h-5 mb-1 text-primary" />
                  <span className="text-[10px] uppercase font-bold opacity-70">Cel</span>
                  <div className="font-black text-sm">PIĘTRO {targetFloor}</div>
                </div>
              </div>
              <div className="p-4 rounded-xl border-2 border-purple-500/40 bg-purple-500/10 flex flex-col items-center justify-center">
                <MapPinIcon className="w-5 h-5 mb-1 text-purple-500" />
                <span className="text-[10px] uppercase font-bold opacity-70">Aktualne Piętro</span>
                <div className="font-black text-sm">{currentFloorDisplay}</div>
              </div>
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className={`w-8 h-8 ${timeLeft < 20 ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
                  <div>
                    <span className="text-[10px] uppercase font-bold opacity-50 block">Timer (2:00)</span>
                    <div className="text-3xl font-black tabular-nums">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-sm opacity-80">
                Opis gry: Wspinaj się po schodach, skacząc spacją, unikaj kolizji z NPC. Dotrzyj do gwiazdy na piętrze 5 przed upływem czasu.
              </div>
            </div>
          </div>
        </Card>
      )}
      {/* GAME AREA */}
      <Card className={`h-screen fixed top-0 border-l border-white/10 bg-slate-900 overflow-hidden ${isMobile ? 'w-full left-0' : 'w-[72%] right-0'}`}>
        <div ref={scrollContainerRef} id="game-touch-area" className="relative h-full overflow-hidden game-area touch-none">
          <div ref={contentRef} className="absolute top-0 left-0 will-change-transform" style={{ width: virtualMapWidth, height: totalHeight }}>
            {/* ODSUNIĘTE ŚCIANY / TŁO PO BOKACH */}
            <div style={{ position: 'absolute', right: '100%', width: 2000, top: 0, bottom: 0, background: '#0f172a', zIndex: 5 }} />
            <div style={{ position: 'absolute', left: '100%', width: 2000, top: 0, bottom: 0, background: '#0f172a', zIndex: 5 }} />
            {/* STAIRS */}
            {segments.map((seg, idx) => (
              <div key={idx} className="z-10 relative">
                {Array.from({ length: stepsPerSegment }).map((_, j) => {
                  const currentGlobalStep = idx * stepsPerSegment + j;
                  if (currentGlobalStep >= starStep) return null;
                  const pos = getPosForStep(currentGlobalStep, segments);
                  if (seg.isHidden) return null;
                  return <img key={j} src={seg.isLeft ? stairs_to_left : stairs_to_right} alt="stair" style={{ position: 'absolute', left: pos.x - (cell/2), top: pos.y - (cell/2), width: cell, height: cell }} />;
                })}
              </div>
            ))}
            {Array.from({ length: floors }).map((_, f) => {
              const stepFull = (f + 1) * stepsPerFloor;
              const posFull = getPosForStep(stepFull, segments);
              const floorTop = posFull.y + cell / 2;
              const floorWidth = isMobile ? mapWidth : virtualMapWidth;
              const wallWidth = 24;
              const wallHeight = '200%';
              return (
                <div key={`floor-full-${f}`}>
                  {/* PODŁOGA */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: floorTop,
                      width: floorWidth,
                      height: cell,
                      background: '#020617',
                      zIndex: 1,
                    }}
                  />
                  {!isMobile && (
                    <>
                      {/* LEWA ŚCIANA */}
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: floorTop - wallHeight,
                          width: wallWidth,
                          height: wallHeight,
                          background: '#020617',
                          zIndex: 999,
                        }}
                      />
                      {/* PRAWA ŚCIANA */}
                      <div
                        style={{
                          position: 'absolute',
                          left: floorWidth - wallWidth,
                          top: floorTop - wallHeight,
                          width: wallWidth,
                          height: wallHeight,
                          background: '#020617',
                          zIndex: 1,
                        }}
                      />
                    </>
                  )}
                </div>
              );
            })}
            {/* PODŁOGA PÓŁPIĘTER */}
            {segments.length > 0 &&
              Array.from({ length: floors - 1 }).map((_, f) => {
                const stepHalf = (f + 1) * stepsPerFloor - stepsPerSegment;
                const posHalf = getPosForStep(stepHalf, segments);

                const smallWidth = virtualMapWidth * 0.4;
                const floorOffsetX = 60;
                const floorLeft = posHalf.x - smallWidth + floorOffsetX;

                return (
                  <div
                    key={`half-${f}`}
                    style={{
                      position: "absolute",
                      left: floorLeft,
                      top: posHalf.y + cell / 2,
                      width: smallWidth,
                      height: cell / 2,
                      background: "linear-gradient(to bottom, #111827, #020617)",
                      zIndex: 2,
                    }}
                  />
                );
              })}

            {/* PODŁOGA STARTOWA */}
            {segments.length > 0 && (() => {
              const startPos = getPosForStep(0, segments);
              const floorTop = startPos.y + cell / 2;
              return (
                <div key="start-floor">
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: floorTop,
                      width: isMobile ? '100%' : '200%',
                      height: '100%',
                      background: "linear-gradient(to bottom, #111827, #020617)",
                      zIndex: 2,
                    }}
                  />
                </div>
              );
            })()}
            {/* PODŁOGA NA OSTATNIM PIĘTRZE */}
            {segments.length > 0 && (() => {
              const lastPos = getPosForStep(starStep, segments);
              const floorTop = lastPos.y + cell / 2;
              return (
                <div key="last-floor">
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: floorTop,
                      width: isMobile ? '100%' : '200%',
                      height: cell,
                      background: '#020617',
                      zIndex: 1,
                    }}
                  />
                </div>
              );
            })()}
            {/* STAR */}
            <AnimatePresence>
              {starPoint && !starCollected && (
                <motion.img
                  src={starImg} className="absolute z-20"
                  style={{ left: starPoint.x - 40, top: starPoint.y - 120, width: 80, height: 'auto' }}
                  animate={{ y: [0, -20, 0], scale: [1, 1.2, 1], filter: ["drop-shadow(0 0 10px gold)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  exit={{ scale: 0, opacity: 0 }}
                />
              )}
            </AnimatePresence>
            {/* PLAYER - SKOK Z KODU B */}
            <motion.div
              key={`hero-${jumpKey}`}
              className="absolute z-50"
              style={{
                  top: y - heroHeight + visualShiftYScaled,
                  left: x - (heroWidth / 2) + (segments[Math.floor(userStep/stepsPerSegment)]?.isLeft ? visualShiftXScaled : -visualShiftXScaled)
              }}
              animate={isFinishing ? { x: 150, opacity: 0 } : { y: [-30, 0] }}
              transition={isFinishing ? { duration: 0.8, ease: "easeIn" } : { duration: 0.4, ease: "easeInOut" }}
            >
              <motion.img
                src={pinImg}
                className="absolute -top-28 left-1/2 -translate-x-1/2 w-12 h-12 pointer-events-none"
                animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ left: 'calc(50% - 8px)' }}
              />
              <img src={isFinishing ? user_to_right : (segments[Math.floor(userStep/stepsPerSegment)]?.isLeft ? user_to_left : user_to_right)} alt="hero" style={{ width: heroWidth, height: heroHeight }} />
            </motion.div>
            {/* NPCs - SKOK Z KODU B */}
            {npcs.map((npc) => (
              <motion.div
                key={`npc-container-${npc.id}-${npc.jumpKey}`}
                className="absolute z-40"
                style={{
                  top: npc.y - heroHeight + visualShiftYScaled,
                  left: npc.x - (heroWidth / 2) + (npc.isLeft ? visualShiftXScaled : -visualShiftXScaled),
                }}
                animate={npc.isFinishing ? { x: 150, opacity: 0 } : { y: [-30, 0] }}
                transition={npc.isFinishing ? { duration: 0.8, ease: "easeIn" } : { duration: 0.4, ease: "easeInOut" }}
              >
                <img
                  src={npc.isFinishing
                    ? npcGraphics[npc.npcType].right
                    : (npc.isLeft ? npcGraphics[npc.npcType].left : npcGraphics[npc.npcType].right)
                  }
                  alt="npc"
                  style={{ width: heroWidth, height: heroHeight }}
                />
              </motion.div>
            ))}
          </div>
        </div>
        {!isGameStarted && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-[100]">
            {isMobile ? (
              <Card className="w-4/5 max-w-md p-6 bg-slate-800/90 border border-primary/30 rounded-2xl shadow-2xl">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-primary mb-4 text-center">System HR</h2>
                <p className="text-white/90 mb-6 text-center">Wspinaj się po schodach, dotykając ekranu, unikaj kolizji z NPC. Dotrzyj do gwiazdy na piętrze 5 przed upływem czasu.</p>
                <Button onClick={() => setIsGameStarted(true)} className="w-full h-12 bg-primary text-xl font-black uppercase italic tracking-tighter">Graj</Button>
              </Card>
            ) : (
              <Button onClick={() => setIsGameStarted(true)} className="h-24 px-16 bg-primary text-3xl font-black uppercase italic tracking-tighter">Graj</Button>
            )}
          </div>
        )}
      </Card>
      {/* MOBILE BOTTOM UI */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 w-full bg-slate-900/95 border-t border-white/10 z-50 p-4 flex justify-around items-center text-sm">
          <div className="flex flex-col items-center">
            <Activity className={`w-5 h-5 ${trafficJam ? 'text-red-500' : 'text-green-500'}`} />
            <span className="font-bold">{trafficJam ? "ZATOR" : "PŁYNNY"}</span>
          </div>
          <div className="flex flex-col items-center">
            <Target className="w-5 h-5 text-primary" />
            <span className="font-bold">Cel: {targetFloor}</span>
          </div>
          <div className="flex flex-col items-center">
            <MapPinIcon className="w-5 h-5 text-purple-500" />
            <span className="font-bold">Piętro: {currentFloorDisplay}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className={`w-5 h-5 ${timeLeft < 20 ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
            <span className="font-black">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
      )}
      {(gameOver || gameWon || timeOut) && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950/95 text-white z-[200] p-4 sm:p-12 text-center">
          <motion.h2 initial={{ scale: 0.5 }} animate={{ scale: 1 }} className={`text-5xl sm:text-9xl font-black italic uppercase tracking-tighter mb-4 ${gameWon ? 'text-yellow-400' : 'text-red-500'}`}>
            {gameWon ? "WYGRANA" : (timeOut ? "CZAS MINĄŁ" : "KRAKSA")}
          </motion.h2>
          <Button onClick={resetGame} className="h-16 px-8 text-xl sm:h-20 sm:px-16 sm:text-2xl bg-white text-black font-black uppercase italic hover:bg-yellow-400 transition-colors">Ponów</Button>
        </div>
      )}
    </div>
  );
}