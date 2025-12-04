import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

const cell = 40;
const mapWidth = 80;
const mapHeight = 10;

const level = [
  "################################################################################",
  "#....T.................T.................T.................................E....#",
  "#..............................................................................#",
  "#..............................................................................#",
  "#..............................................................................#",
  "#..............................................................................#",
  "#....T.................T.................T.....................................#",
  "#..............................................................................#",
  "#..............................................................................#",
  "################################################################################",
];

export default function TransportGame() {
  const [x, setX] = useState(1 * cell);
  const [y, setY] = useState(1 * cell);
  const [direction, setDirection] = useState([cell, 0]);
  const [switchDirs, setSwitchDirs] = useState({});
  const [activeSwitch, setActiveSwitch] = useState(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });

  const chooseDirection = (rx, ry) => {
    setActiveSwitch({ rx, ry });
    setPopupPos({ top: ry * cell, left: rx * cell });
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

  const autoMove = () => {
    let [dx, dy] = direction;
    let nx = x + dx;
    let ny = y + dy;

    const gx = Math.floor(nx / cell);
    const gy = Math.floor(ny / cell);

    if (level[gy][gx] === "T") {
      const key = `${gx}-${gy}`;
      const state = switchDirs[key];
      if (state) {
        const ndir = state === "up" ? [0, -cell] : [0, cell];
        dx = ndir[0];
        dy = ndir[1];
        nx = x + dx;
        ny = y + dy;
        setDirection(ndir);
      }
    }

    if (canMove(nx, ny)) {
      setX(nx);
      setY(ny);
    }

    if (level[Math.floor(ny / cell)][Math.floor(nx / cell)] === "E") {
      setX(1 * cell);
      setY(1 * cell);
      setDirection([cell, 0]);
    }
  };

  useEffect(() => {
    const interval = setInterval(autoMove, 300);
    return () => clearInterval(interval);
  }, [x, y, direction, switchDirs]);

  return (
    <Card className="p-2 border-4 bg-card relative w-full h-[450px] overflow-x-scroll overflow-y-hidden">
      <div
        className="absolute top-0 left-0"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${mapWidth}, ${cell}px)`,
          gridTemplateRows: `repeat(${mapHeight}, ${cell}px)`,
        }}
      >
        {level.map((row, ry) =>
          row.split("").map((tile, rx) => {
            const key = `${rx}-${ry}`;
            const isSwitch = tile === "T";
            const switchState = switchDirs[key] || "down";
            return (
              <div
                key={key}
                onClick={isSwitch ? () => chooseDirection(rx, ry) : undefined}
                className={
                  tile === "#"
                    ? "bg-gray-700 border border-black"
                    : tile === "E"
                    ? "bg-green-600 border border-black"
                    : isSwitch
                    ? switchState === "up"
                      ? "bg-yellow-300 border border-black cursor-pointer"
                      : "bg-yellow-600 border border-black cursor-pointer"
                    : "bg-card border border-border"
                }
              />
            );
          })
        )}
      </div>

      <div
        className="absolute bg-red-600 w-10 h-10 rounded-sm"
        style={{ left: x, top: y, transition: "left 0.2s, top 0.2s" }}
      />

      {activeSwitch && (
        <div
          className="absolute bg-primary p-4 border-2 border-black z-50"
          style={{ top: popupPos.top + cell, left: popupPos.left }}
        >
          <p>Wybierz kierunek ciuchci:</p>
          <button className="m-1 p-1 bg-green-400" onClick={() => selectDirection('up')}>Up</button>
          <button className="m-1 p-1 bg-red-400" onClick={() => selectDirection('down')}>Down</button>
        </div>
      )}
    </Card>
  );
}
