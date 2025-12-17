import { useState, useEffect } from "react";
import wagon1 from "@/assets/graphics/train/wagon1.png";
import wagon2 from "@/assets/graphics/train/wagon2.png";
import wagon3 from "@/assets/graphics/train/wagon3.png";

const frames = [wagon1, wagon2, wagon3];

export default function Carriage({ x, y, index }: { x: number; y: number; index: number }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % frames.length);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <img
      src={frames[frame]}
      alt="Wagon"
      className="absolute object-contain"
      style={{
        width: 120,
        height: 85,
        left: x - index * 120,
        top: y,
        transition: "left 0.2s, top 0.2s",
      }}
    />
  );
}
