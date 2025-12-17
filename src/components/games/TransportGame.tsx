import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import Train from "@/components/ui/train";

const cell = 85;
const mapWidth = 80;
const mapHeight = 10;

const levels = [
  {
    map: Array(mapHeight).fill(0).map(() => Array(mapWidth).fill(" ")).map((row, ry) => {
      if ([2, 4, 6].includes(ry)) for (let rx = 1; rx < mapWidth - 1; rx++) row[rx] = "-";
      return row;
    }),
    start: { x: 1, y: 2 },
    end: { x: mapWidth - 2, y: 4 },
    switches: [{ x: 10, y: 2 }, { x: 20, y: 4 }],
    points: [{ x: 5, y: 2 }, { x: 15, y: 4 }]
  },
  {
    map: Array(mapHeight).fill(0).map(() => Array(mapWidth).fill(" ")).map((row, ry) => {
      if ([1, 3, 5].includes(ry)) for (let rx = 1; rx < mapWidth - 1; rx++) row[rx] = "-";
      return row;
    }),
    start: { x: 1, y: 1 },
    end: { x: mapWidth - 2, y: 3 },
    switches: [{ x: 15, y: 1 }, { x: 25, y: 3 }],
    points: [{ x: 10, y: 1 }, { x: 20, y: 3 }]
  },
  {
    map: Array(mapHeight).fill(0).map(() => Array(mapWidth).fill(" ")).map((row, ry) => {
      if ([0, 2, 4, 6].includes(ry)) for (let rx = 1; rx < mapWidth - 1; rx++) row[rx] = "-";
      return row;
    }),
    start: { x: 1, y: 0 },
    end: { x: mapWidth - 2, y: 6 },
    switches: [{ x: 10, y: 0 }, { x: 20, y: 2 }, { x: 30, y: 4 }, { x: 40, y: 6 }],
    points: [{ x: 5, y: 0 }, { x: 15, y: 2 }, { x: 25, y: 4 }, { x: 35, y: 6 }]
  }
];

levels.forEach(levelObj => {
  levelObj.switches.forEach(sw => levelObj.map[sw.y][sw.x] = "T");
  levelObj.map[levelObj.end.y][levelObj.end.x] = "E";
  levelObj.points.forEach(pt => levelObj.map[pt.y][pt.x] = "P");
});

export default function TransportGame() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [level, setLevel] = useState(levels[0].map);
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

  const mapRef = useRef(null);

  const chooseDirection = (rx, ry) => {
    setActiveSwitch({ rx, ry });
  };

  const selectDirection = (dir) => {
    if (activeSwitch) {
      const key = `${activeSwitch.rx}-${activeSwitch.ry}`;
      setSwitchDirs(prev => ({ ...prev, [key]: dir }));
      setActiveSwitch(null);
    }
  };

  const canMove = (nx, ny) => {
    const gx = Math.floor(nx / cell);
    const gy = Math.floor(ny / cell);
    if (gx < 0 || gy < 0 || gx >= mapWidth || gy >= mapHeight) return false;
    return level[gy][gx] !== "#";
  };

  const resetGame = (newLevelIndex = 0, fullReset = true) => {
    setLevelIndex(newLevelIndex);
    setLevel(levels[newLevelIndex].map);
    setX(levels[newLevelIndex].start.x * cell);
    setY(levels[newLevelIndex].start.y * cell);
    setDirection([cell, 0]);
    setTransitioning(false);
    setGameOver(false);
    setGameWon(false);
    setSwitchDirs({});
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
    if (gameOver || gameWon) return;

    const speed = 2;
    let dx = direction[0];
    let dy = direction[1];

    if (transitioning) {
      dx = targetDir[0];
      dy = targetDir[1];
    }

    // Normalizacja wektora ruchu dla stałej prędkości
    const distance = Math.sqrt(dx * dx + dy * dy);
    const moveX = (dx / distance) * speed;
    const moveY = (dy / distance) * speed;

    const nx = x + moveX;
    const ny = y + moveY;

    const gx = Math.floor((nx + cell / 2) / cell);
    const gy = Math.floor((ny + cell / 2) / cell);

    // Obliczanie rotacji (w stopniach)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    setRotation(angle);

    if (gx < 0 || gy < 0 || gx >= mapWidth || gy >= mapHeight) {
      setGameOver(true);
      return;
    }

    const tile = level[gy][gx];

    // Wykrywanie wyjścia z trybu skręcania (powrót na prosty tor)
    if (transitioning && tile === "-" && Math.abs(ny - gy * cell) < speed) {
      setTransitioning(false);
      setDirection([cell, 0]);
      setY(gy * cell); // Snap do środka toru
    }

    // Wykrywanie zwrotnicy
    if (tile === "T" && !transitioning && Math.abs(nx - gx * cell) < speed) {
      const key = `${gx}-${gy}`;
      const state = switchDirs[key] || "straight";
      setTransitioning(true);
      const targetYDir = state === 'up' ? -cell : state === 'down' ? cell : 0;
      setTargetDir([cell, targetYDir]);
    }

    if (tile === "P") {
      setScore(prev => prev + 1);
      const newLevel = [...level];
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
  }, [x, y, direction, switchDirs, transitioning, targetDir, gameOver, gameWon, levelIndex]);

  const getPopupStyle = () => {
    if (!activeSwitch || !mapRef.current) return { top: 0, left: 0 };

    const { scrollLeft, scrollTop } = mapRef.current;
    return {
      top: activeSwitch.ry * cell,
      left: activeSwitch.rx * cell - scrollLeft,
    };
  };

  return (

    <div className="relative w-full h-[450px]">
      <div className="absolute top-2 left-2 text-white font-bold z-50 pointer-events-none">
        Punkty: {score}
      </div>
    <Card className="h-screen w-[35%] fixed left-0 top-0 border-r bg-card text-card-foreground flex flex-col p-6 overflow-y-auto">
        {/* POLECENIE */}
        <h1>Coś tu będzie</h1>
    </Card>

     <Card className="h-screen w-[75%] fixed right-0 top-0 border-l bg-card text-card-foreground flex flex-col p-6 overflow-y-auto" ref={mapRef}>
        <div className="relative" style={{ width: mapWidth * cell, height: mapHeight * cell }}>
          {level.map((row, ry) =>
            row.map((tile, rx) => {
              const key = `${rx}-${ry}`;
              const isSwitch = tile === "T";
              const switchState = switchDirs[key] || "straight";
              return (
                <div
                  key={key}
                  onClick={isSwitch ? () => chooseDirection(rx, ry) : undefined}
                  className={
                    tile === "#"
                      ? "bg-gray-700 border border-black"
                      : tile === "E"
                      ? "bg-green-600 border border-black"
                      : tile === "P"
                      ? "bg-pink-500 border border-black"
                      : isSwitch
                      ? switchState === "up"
                        ? "bg-yellow-300 border border-black cursor-pointer"
                        : switchState === "down"
                        ? "bg-yellow-600 border border-black cursor-pointer"
                        : "bg-yellow-400 border border-black cursor-pointer"
                      : tile === "-"
                      ? "bg-gray-400 border border-black"
                      : "bg-card border border-border"
                  }
                  style={{ width: cell, height: cell, position: "absolute", top: ry * cell, left: rx * cell }}
                />
              );
            })
          )}

          <Train x={x} y={y} rotation={rotation} />


          {activeSwitch && (
            <div
              className="absolute bg-primary p-2 border-2 border-black z-30 rounded"
              style={{
                top: activeSwitch.ry * cell + 40,
                left: activeSwitch.rx * cell
              }}
            >
              <p className="text-sm font-bold mb-1">Wybierz kierunek:</p>
              <div className="flex gap-1">
                <button className="p-1 bg-green-400 rounded" onClick={() => selectDirection('up')}>Up</button>
                <button className="p-1 bg-red-400 rounded" onClick={() => selectDirection('down')}>Down</button>
                <button className="p-1 bg-blue-400 rounded" onClick={() => selectDirection('straight')}>Straight</button>
              </div>
            </div>
          )}

        </div>
      </Card>

      {(gameOver || gameWon) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white text-4xl z-40">
          {gameWon ? `Wygrałeś! Punkty: ${score}` : `Przegrałeś! Punkty: ${score}`}
          <button className="mt-4 p-2 bg-blue-500 rounded text-lg" onClick={() => resetGame(0, true)}>Zagraj ponownie</button>
        </div>
      )}
    </div>
  );
}

