import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, CheckCircle2 } from "lucide-react";

interface Component {
  id: string;
  name: string;
  symbol: string;
  placed: boolean;
}

const components: Component[] = [
  { id: "battery", name: "Bateria", symbol: "⚡", placed: false },
  { id: "resistor", name: "Rezystor", symbol: "▭▭▭", placed: false },
  { id: "led", name: "Dioda LED", symbol: "►|", placed: false },
  { id: "switch", name: "Przełącznik", symbol: "⎓", placed: false },
];

const correctOrder = ["battery", "switch", "resistor", "led"];

const ElektronikGame = () => {
  const [availableComponents, setAvailableComponents] = useState<Component[]>([...components]);
  const [circuit, setCircuit] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);

  const hints = [
    "Każdy obwód potrzebuje źródła zasilania na początku",
    "Przełącznik pozwala kontrolować przepływ prądu",
    "Rezystor ogranicza prąd, aby chronić diodę LED",
    "Dioda LED świeci gdy przez nią przepływa prąd",
  ];

  const handleComponentSelect = (componentId: string) => {
    if (!isComplete) {
      const newCircuit = [...circuit, componentId];
      setCircuit(newCircuit);
      
      const updatedComponents = availableComponents.map((comp) =>
        comp.id === componentId ? { ...comp, placed: true } : comp
      );
      setAvailableComponents(updatedComponents);

      if (newCircuit.length === 4) {
        setIsComplete(true);
        setAttempts(attempts + 1);
        const correct = newCircuit.every((id, index) => id === correctOrder[index]);
        setIsCorrect(correct);
      }
    }
  };

  const handleReset = () => {
    setCircuit([]);
    setAvailableComponents(components.map((c) => ({ ...c, placed: false })));
    setIsComplete(false);
    setIsCorrect(false);
    setHintLevel(0);
  };

  const showHint = () => {
    if (hintLevel < hints.length) {
      setHintLevel(hintLevel + 1);
    }
  };

  const getComponentById = (id: string) => components.find((c) => c.id === id);

  return (
    <Card className="h-screen w-[35%] fixed left-0 top-0 border-r bg-card text-card-foreground flex flex-col p-6 overflow-y-auto">
      <div className="mb-6 text-center">
        <Zap className="w-12 h-12 text-primary mx-auto mb-4 animate-pixel-float" />
        <h2 className="text-lg text-foreground mb-2">OBWÓD ELEKTRYCZNY</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Ułóż komponenty w prawidłowej kolejności, aby zapalić LED
        </p>
      </div>

      {/* Circuit Display */}
      <div className="mb-8">
        <div className="bg-muted border-4 border-border p-6">
          <div className="text-xs text-muted-foreground mb-3 text-center">SCHEMAT OBWODU</div>
          <div className="flex items-center justify-center gap-2 min-h-[80px]">
            <div className="text-4xl">⊝</div>
            {circuit.length === 0 ? (
              <div className="text-muted-foreground text-xs">Wybierz komponenty...</div>
            ) : (
              <>
                {circuit.map((compId, index) => {
                  const comp = getComponentById(compId);
                  return (
                    <div key={index} className="flex items-center">
                      <div className="text-2xl px-2 animate-slide-in-up">{comp?.symbol}</div>
                      {index < circuit.length - 1 && (
                        <div className="text-muted-foreground">━━</div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
            <div className="text-4xl">⊕</div>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs">
            {circuit.map((compId) => {
              const comp = getComponentById(compId);
              return (
                <span key={compId} className="text-muted-foreground">
                  {comp?.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Available Components */}
      {!isComplete && (
        <>
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-3 text-center">
              Dostępne komponenty ({circuit.length}/4):
            </p>
            <div className="grid grid-cols-2 gap-3">
              {availableComponents.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => handleComponentSelect(comp.id)}
                  disabled={comp.placed}
                  className={`p-4 border-2 border-border arcade-button ${
                    comp.placed
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:border-primary cursor-pointer"
                  }`}
                >
                  <div className="text-2xl mb-2">{comp.symbol}</div>
                  <div className="text-xs text-foreground">{comp.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Hints */}
          {attempts > 0 && hintLevel < hints.length && (
            <div className="mb-4">
              <Button
                onClick={showHint}
                variant="outline"
                size="sm"
                className="w-full border-2 border-secondary text-secondary hover:bg-secondary/20"
              >
                💡 POKAŻ PODPOWIEDŹ ({hintLevel + 1}/{hints.length})
              </Button>
            </div>
          )}

          {hintLevel > 0 && (
            <div className="mb-4 space-y-2">
              {hints.slice(0, hintLevel).map((hint, index) => (
                <div
                  key={index}
                  className="p-3 border-2 border-secondary bg-secondary/20 text-secondary animate-slide-in-up"
                >
                  <p className="text-xs">
                    <span className="font-bold">Krok {index + 1}:</span> {hint}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Result */}
      {isComplete && (
        <div className="animate-slide-in-up">
          <div
            className={`p-6 border-4 mb-6 text-center ${
              isCorrect ? "border-accent bg-accent/20" : "border-destructive bg-destructive/20"
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-3" />
                <div className="text-4xl mb-3 animate-pixel-pulse">💡</div>
                <h3 className="text-lg text-accent mb-2">ŚWIETNIE!</h3>
                <p className="text-xs text-accent leading-relaxed">
                  Dioda LED świeci! Prawidłowo złożyłeś obwód elektryczny.
                  <br />
                  Próba {attempts}
                </p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">❌</div>
                <h3 className="text-lg text-destructive mb-2">NIEPRAWIDŁOWO</h3>
                <p className="text-xs text-destructive leading-relaxed">
                  Obwód nie działa. Sprawdź kolejność komponentów!
                  <br />
                  Próba {attempts}
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
    </Card>
  );
};

export default ElektronikGame;