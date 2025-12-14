import { useState } from "react";
// import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Flag } from "lucide-react";


const DsdGame = () => {
  return (
    <>
      <Card className="h-screen w-[25%] fixed left-0 top-0 border-r bg-card text-card-foreground flex flex-col p-6 overflow-y-auto">
        <div className="mb-6 text-center">
          <Flag className="w-12 h-12 text-primary mx-auto mb-4 animate-pixel-pulse" />
          <h2 className="text-lg text-foreground mb-2">DSD</h2>
        </div>
        <div className="animate-pixel-pulse">
          W tej grze wcielasz się w ucznia, który odpowiada na pytania
          wyświetlane na tablicy. Nauczycielka prowadzi quiz, a Ty wybierasz
          odpowiedź A, B lub C. Każda poprawna odpowiedź daje punkty, a błędna
          wywołuje reakcję klasy.
        </div>
      </Card>

      <Card className="h-screen w-[75%] fixed right-0 top-0 border-l bg-card text-card-foreground flex flex-col p-6 overflow-y-auto">
        <h2 className="text-lg text-foreground mb-4">Gra</h2>
        <p>Tu pojawi się tablica, nauczycielka i uczniowie w pixel arcie.</p>
      </Card>
    </>
  );
};


export default DsdGame;
