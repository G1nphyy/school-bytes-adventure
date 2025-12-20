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

const cell = 85; // Import or define cell size here for consistency

function TrainHead({ x, y, frame, rotation }) {
    return (
        <div
            className="absolute"
            style={{
                width: 120,
                height: cell,
                left: 0,
                top: 0,
                transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`,
            }}
        >
            <img src={trainFrames[frame]} alt="Lokomotywa" className="w-full h-full object-contain" />
        </div>
    );
}

function Carriage({ x, y, frame, rotation }) {
    return (
        <div
            className="absolute"
            style={{
                width: 120,
                height: cell,
                left: 0,
                top: 0,
                transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`,
            }}
        >
            <img src={carriageFrames[frame]} alt="Wagon" className="w-full h-full object-contain" />
        </div>
    );
}

export default function TrainSet({ x, y, rotation = 0 }) {
    const [frame, setFrame] = useState(0);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        setHistory(prev => {
            // Dodajemy nową pozycję tylko jeśli pociąg faktycznie się poruszył
            if (prev.length > 0 && prev[0].x === x && prev[0].y === y) return prev;

            const newHistory = [{ x, y, rotation }, ...prev];
            return newHistory.slice(0, 500); // Większa historia dla pewności
        });
    }, [x, y, rotation]);

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame((prev) => (prev + 1) % carriageFrames.length);
        }, 200);
        return () => clearInterval(interval);
    }, []);

    // Funkcja szukająca pozycji w historii oddalonej o dany dystans (pixel-perfect)
    const getPositionAfterDistance = (startIndex, targetDistance) => {
        let currentDistance = 0;
        if (history.length <= startIndex + 1) return { pos: history[history.length - 1] || { x, y, rotation }, index: history.length - 1 };

        for (let i = startIndex + 1; i < history.length; i++) {
            const p1 = history[i - 1];
            const p2 = history[i];
            const segment = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

            if (currentDistance + segment >= targetDistance) {
                const ratio = (targetDistance - currentDistance) / segment;
                return {
                    pos: {
                        x: p1.x + (p2.x - p1.x) * ratio,
                        y: p1.y + (p2.y - p1.y) * ratio,
                        rotation: p2.rotation
                    },
                    index: i
                };
            }
            currentDistance += segment;
        }
        return { pos: history[history.length - 1], index: history.length - 1 };
    };

    // Parametry dystansu
    const baseSpacing = 120; // Stały odstęp na prostej
    const turnReduction = 5; // O ile skrócić dystans, gdy dany segment skręca

    // 1. Obliczamy pozycję 1. wagonu względem lokomotywy
    const dist1 = Math.abs(rotation) > 5 ? baseSpacing - turnReduction : baseSpacing;
    const result1 = getPositionAfterDistance(0, dist1);
    const carriage1 = result1.pos;

    // 2. Obliczamy pozycję 2. wagonu względem 1. wagonu
    const dist2 = Math.abs(carriage1.rotation) > 5 ? baseSpacing - turnReduction : baseSpacing;
    const result2 = getPositionAfterDistance(result1.index, dist2);
    const carriage2 = result2.pos;

    return (
        <>
            <TrainHead x={x} y={y} frame={frame % trainFrames.length} rotation={rotation} />
            <Carriage x={carriage1.x} y={carriage1.y} frame={frame} rotation={carriage1.rotation} />
            <Carriage x={carriage2.x} y={carriage2.y} frame={frame} rotation={carriage2.rotation} />
        </>
    );
}