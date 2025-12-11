import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

const cell = 40;
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

    let dx = direction[0];
    let dy = direction[1];

    if (transitioning) {
      dx = targetDir[0];
      dy = targetDir[1];
    }

    let nx = x + dx;
    let ny = y + dy;
    const gx = Math.floor(nx / cell);
    const gy = Math.floor(ny / cell);

    if (!canMove(nx, ny)) {
      setGameOver(true);
      return;
    }

    if (transitioning && level[gy][gx] === "-") {
      setDirection([cell, 0]);
      setTransitioning(false);
      const snapY = gy * cell;
      nx = x + cell;
      ny = snapY;
    }

    if (level[gy][gx] === "T" && !transitioning) {
      const key = `${gx}-${gy}`;
      const state = switchDirs[key] || "straight";
      setTransitioning(true);
      setTargetDir([cell, state === 'up' ? -cell : state === 'down' ? cell : 0]);
    }

    if (level[gy][gx] === "P") {
      setScore(prev => prev + 1);
      level[gy][gx] = "-";
    }

    setX(nx);
    setY(ny);

    if (!transitioning) setDirection([cell, 0]);

    if (level[gy][gx] === "E") {
      nextLevel();
    }
  };

  useEffect(() => {
    const interval = setInterval(autoMove, 300);
    return () => clearInterval(interval);
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

      <Card className="p-2 border-4 bg-card w-full h-full overflow-x-scroll overflow-y-hidden" ref={mapRef}>
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

          <div
            className="absolute bg-red-600 w-10 h-10 rounded-sm z-20"
            style={{ left: x, top: y, transition: "left 0.2s, top 0.2s" }}
          />

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
