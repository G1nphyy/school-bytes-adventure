// MultimeterWorkshop.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Battery, Zap, Microchip } from "lucide-react";

const ITEMS = {
  battery: { name: "Bateria 9 V", icon: Battery, value: "9.15 V", unit: "V DC" },
  resistor: { name: "Rezystor 220 Ω", icon: Zap, value: "218 Ω", unit: "Ω" },
  regulator: { name: "Stabilizator 5 V", icon: Microchip, value: "0 V", unit: "V DC" },
};

const RANGES = ["OFF", "V DC", "Ω", "A DC"];

export default function MultimeterWorkshop() {
  const [blackWire, setBlackWire] = useState(null);
  const [redWire, setRedWire] = useState(null);
  const [itemOnDesk, setItemOnDesk] = useState(null);
  const [range, setRange] = useState("OFF");
  const [result, setResult] = useState(null);
  const [done, setDone] = useState([]);

  const handleMeasure = () => {
    if (!blackWire || !redWire || !itemOnDesk || range === "OFF") {
      setResult("Ustaw wszystko: kable, element i zakres!");
      return;
    }
    const wantedUnit = ITEMS[itemOnDesk].unit;
    if (range !== wantedUnit) {
      setResult(`Zły zakres! Dla tego elementu potrzebujesz ${wantedUnit}.`);
      return;
    }
    setResult(`OK → ${ITEMS[itemOnDesk].value}`);
    if (!done.includes(itemOnDesk)) setDone([...done, itemOnDesk]);
  };

  const isFinished = done.length >= 2;

  return (
    <div className="p-4 min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 text-slate-200">
      <Card className="w-full max-w-5xl bg-slate-800/60 border-slate-700 shadow-2xl">
        <div className="p-6 grid md:grid-cols-2 gap-6">
          {/* LEWA: warsztat + drag-and-drop */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-cyan-400">Stanowisko pomiarowe</h2>

            {/* MULTIMETR */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-slate-400">MULTIMETR</span>
                <span className="text-xl font-bold text-cyan-300">{range}</span>
              </div>
              <div className="flex gap-2">
                {RANGES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-3 py-1 rounded-md text-xs font-bold border transition ${range === r ? "bg-cyan-500 text-black border-cyan-400" : "bg-slate-800 border-slate-600 hover:border-cyan-500"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] font-mono uppercase">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.getData("wire") === "black") setBlackWire("COM"); }}
                  className={`h-12 flex items-center justify-center rounded border ${blackWire ? "bg-green-500/20 border-green-500" : "bg-slate-800 border-slate-600"}`}
                >COM<br />{blackWire ? "●" : "○"}</div>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.getData("wire") === "red") setRedWire("VΩmA"); }}
                  className={`h-12 flex items-center justify-center rounded border ${redWire === "VΩmA" ? "bg-green-500/20 border-green-500" : "bg-slate-800 border-slate-600"}`}
                >VΩmA<br />{redWire === "VΩmA" ? "●" : "○"}</div>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.getData("wire") === "red") setRedWire("10A"); }}
                  className={`h-12 flex items-center justify-center rounded border ${redWire === "10A" ? "bg-green-500/20 border-green-500" : "bg-slate-800 border-slate-600"}`}
                >10A<br />{redWire === "10A" ? "●" : "○"}</div>
              </div>
            </div>

            {/* PRZEWODY */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700">
              <div className="text-xs text-slate-400 mb-2">Przeciągnij kable na odpowiednie gniazda:</div>
              <div className="flex gap-4">
                <div
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("wire", "black")}
                  className="cursor-grab active:cursor-grabbing bg-black text-white px-4 py-2 rounded-md border border-slate-600 text-xs font-bold"
                >Czarny (COM)</div>
                <div
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("wire", "red")}
                  className="cursor-grab active:cursor-grabbing bg-red-600 text-white px-4 py-2 rounded-md border border-red-400 text-xs font-bold"
                >Czerwony</div>
              </div>
            </div>

            {/* ELEMENTY */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700">
              <div className="text-xs text-slate-400 mb-2">Przeciągnij element na stanowisko:</div>
              <div className="flex gap-3">
                {Object.entries(ITEMS).map(([key, val]) => (
                  <div
                    key={key}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("item", key)}
                    className="cursor-grab active:cursor-grabbing bg-slate-800 border border-slate-600 rounded-lg p-3 text-center text-xs hover:border-cyan-500 transition"
                  >
                    <val.icon className="w-6 h-6 mx-auto mb-1 text-cyan-400" />
                    <div className="font-bold">{val.name}</div>
                  </div>
                ))}
              </div>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); setItemOnDesk(e.dataTransfer.getData("item")); }}
                className={`mt-3 h-20 rounded-lg border-2 border-dashed flex items-center justify-center text-sm ${itemOnDesk ? "border-cyan-400 bg-cyan-500/10" : "border-slate-600"}`}
              >
                {itemOnDesk ? (
                  <>
                    {React.createElement(ITEMS[itemOnDesk].icon, { className: "w-6 h-6 mr-2 text-cyan-400" })}
                    {ITEMS[itemOnDesk].name}
                  </>
                ) : "Upuść tutaj"}
              </div>
            </div>
          </div>

          {/* PRAWA: wyniki + przycisk */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-cyan-400 mb-4">Wynik pomiaru</h3>
              <div className="bg-black/50 rounded-xl p-4 min-h-[6rem] text-sm font-mono text-cyan-300">{result || "Czekam na pomiar…"}</div>

              <div className="mt-4 text-xs text-slate-400">Poprawnie zmierzone: <span className="font-bold text-cyan-400">{done.length}/3</span></div>
              <div className="mt-2 flex gap-2">
                {Object.keys(ITEMS).map((k) => (
                  <div key={k} className={`px-2 py-1 rounded text-[10px] border ${done.includes(k) ? "bg-green-500/20 border-green-500 text-green-400" : "bg-slate-800 border-slate-700 text-slate-500"}`}>{ITEMS[k].name}</div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={handleMeasure} className="w-full bg-cyan-600 hover:bg-cyan-500 font-bold">
                ZMIERZ
              </Button>
              {isFinished && (
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500 text-green-300 text-sm font-bold">
                  ✅ Zaliczone! Twój multimetr nie ma przed Tobą tajemnic.
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}