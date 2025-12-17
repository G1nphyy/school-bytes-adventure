import { useState, useEffect } from "react";
import train0 from "@/assets/graphics/train/train0.png";
import train1 from "@/assets/graphics/train/train1.png";
import train2 from "@/assets/graphics/train/train2.png";
import train3 from "@/assets/graphics/train/train3.png";

import sprite0 from "@/assets/graphics/train/sprite_0.png";
import sprite1 from "@/assets/graphics/train/sprite_1.png";
import sprite2 from "@/assets/graphics/train/sprite_2.png";
import sprite3 from "@/assets/graphics/train/sprite_3.png";
import sprite4 from "@/assets/graphics/train/sprite_4.png";
import sprite5 from "@/assets/graphics/train/sprite_5.png";
import sprite6 from "@/assets/graphics/train/sprite_6.png";
import sprite7 from "@/assets/graphics/train/sprite_7.png";

const trainFrames = [train0, train1, train2, train3];
const carriageFrames = [sprite0, sprite1, sprite2, sprite3, sprite4, sprite5, sprite6, sprite7];

function TrainHead({ x, y, frame }) {
  return (
    <div
      className="absolute"
      style={{
        width: 120,
        height: 85,
        left: x,
        top: y,
        transition: "left 0.3s linear, top 0.3s linear",
      }}
    >
      <img src={trainFrames[frame]} alt="Lokomotywa" className="w-full h-full object-contain" />
    </div>
  );
}

function Carriage({ x, y, offset, frame }) {
  return (
    <div
      className="absolute"
      style={{
        width: 120,
        height: 85,
        left: x - offset,
        top: y,
        transition: "left 0.3s linear, top 0.3s linear",
      }}
    >
      <img src={carriageFrames[frame]} alt="Wagon" className="w-full h-full object-contain" />
    </div>
  );
}

export default function TrainSet({ x, y }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % carriageFrames.length);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <TrainHead x={x} y={y} frame={frame % trainFrames.length} />
      <Carriage x={x} y={y} offset={120} frame={frame} />
      <Carriage x={x} y={y} offset={240} frame={frame} />
    </>
  );
}

