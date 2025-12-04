import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cable, CheckCircle2 } from "lucide-react";

type CableColor = "orange" | "green" | "blue" | "brown" | "white" | "yellow";

interface Cable {
  id: number;
  color: CableColor;
  label: string;
}

const cables: Cable[] = [
  { id: 1, color: "orange", label: "TX+" },
  { id: 2, color: "green", label: "TX-" },
  { id: 3, color: "blue", label: "RX+" },
  { id: 4, color: "brown", label: "RX-" },
  { id: 5, color: "white", label: "NC" },
  { id: 6, color: "yellow", label: "NC" },
];

// Correct RJ-45 T568B wiring order
const correctOrder = [1, 2, 3, 4, 5, 6]; // IDs in correct sequence

const AutomatykGame = () => {
  const [selectedCables, setSelectedCables] = useState<number[]>([]);
  const [availableCables, setAvailableCables] = useState<Cable[]>([...cables]);
  const [isComplete, setIsComplete] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    // Shuffle cables on mount
    setAvailableCables([...cables].sort(() => Math.random() - 0.5));
  }, []);

  const handleCableSelect = (cableId: number) => {
    if (selectedCables.length < 6 && !selectedCables.includes(cableId)) {
      const newSelected = [...selectedCables, cableId];
      setSelectedCables(newSelected);

      if (newSelected.length === 6) {
        setIsComplete(true);
        setAttempts(attempts + 1);
        // Check if order is correct
        const correct = newSelected.every((id, index) => id === correctOrder[index]);
        setIsCorrect(correct);
      }
    }
  };

  const handleReset = () => {
    setSelectedCables([]);
    setIsComplete(false);
    setIsCorrect(false);
    setAvailableCables([...cables].sort(() => Math.random() - 0.5));
  };

  const getCableColor = (color: CableColor) => {
    const colorMap = {
      orange: "bg-orange-500",
      green: "bg-green-500",
      blue: "bg-blue-500",
      brown: "bg-amber-700",
      white: "bg-gray-300",
      yellow: "bg-yellow-400",
    };
    return colorMap[color];
  };

  return (
    <Card className="h-screen w-[35%] fixed left-0 top-0 border-r bg-card text-card-foreground flex flex-col p-6 overflow-y-auto">
      <div className="mb-6 text-center">
        <Cable className="w-12 h-12 text-primary mx-auto mb-4 animate-pixel-float" />
        <h2 className="text-lg text-foreground mb-2">OKABLOWANIE RJ-45</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Ułóż kable w prawidłowej kolejności zgodnie z normą T568B
        </p>
      </div>

      {/* RJ-45 Connector Display */}
      <div className="mb-8">
        <div className="bg-muted border-4 border-border p-6 mx-auto max-w-md">
          <div className="text-xs text-muted-foreground mb-2 text-center">ZŁĄCZE RJ-45</div>
          <div className="flex gap-1 justify-center">
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const cable = selectedCables[index]
                ? cables.find((c) => c.id === selectedCables[index])
                : null;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-24 border-2 border-border ${
                      cable ? getCableColor(cable.color) : "bg-background"
                    } transition-all duration-300`}
                  >
                    {cable && (
                      <div className="h-full flex items-center justify-center">
                        <span className="text-[8px] text-black font-bold writing-mode-vertical transform rotate-180">
                          {cable.label}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-[8px] text-muted-foreground mt-1">{index + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Available Cables */}
      {!isComplete && (
        <div className="mb-6">
          <p className="text-xs text-muted-foreground mb-3 text-center">
            Wybierz kable w kolejności ({selectedCables.length}/6):
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {availableCables.map((cable) => (
              <button
                key={cable.id}
                onClick={() => handleCableSelect(cable.id)}
                disabled={selectedCables.includes(cable.id)}
                className={`px-4 py-3 border-2 border-border arcade-button transition-all ${
                  selectedCables.includes(cable.id)
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:border-primary cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 ${getCableColor(cable.color)} border border-border`} />
                  <span className="text-xs text-foreground">{cable.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {isComplete && (
        <div className="animate-slide-in-up">
          <div
            className={`p-6 border-4 mb-6 text-center ${
              isCorrect
                ? "border-accent bg-accent/20"
                : "border-destructive bg-destructive/20"
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-3" />
                <h3 className="text-lg text-accent mb-2">ŚWIETNIE!</h3>
                <p className="text-xs text-accent leading-relaxed">
                  Prawidłowo okablowałeś złącze RJ-45! 
                  <br />
                  Próba {attempts}
                </p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">❌</div>
                <h3 className="text-lg text-destructive mb-2">NIEPRAWIDŁOWO</h3>
                <p className="text-xs text-destructive leading-relaxed">
                  Kolejność kabli nie jest zgodna z normą T568B.
                  <br />
                  Spróbuj ponownie! (Próba {attempts})
                </p>
              </>
            )}
          </div>

          <Button
            onClick={handleReset}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 arcade-button"
          >
            {isCorrect ? "ZAGRAJ PONOWNIE" : "SPRÓBUJ JESZCZE RAZ"}
          </Button>
        </div>
      )}

      {/* Hint */}
      {!isComplete && attempts > 0 && (
        <div className="mt-4 p-3 bg-muted/50 border-2 border-border text-center">
          <p className="text-[10px] text-muted-foreground">
            💡 Wskazówka: Standard T568B to najpopularniejszy schemat okablowania
          </p>
        </div>
      )}
    </Card>
  );
};

export default AutomatykGame;
