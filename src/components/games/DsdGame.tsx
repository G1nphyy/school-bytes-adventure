import { useState } from "react";
// import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Flag } from "lucide-react";


const DsdGame = () => {

  return (
    <Card className="bg-card border-4 border-border p-6">
      <div className="mb-6 text-center">
        <Flag className="w-12 h-12 text-primary mx-auto mb-4 animate-pixel-pulse" />
        <h2 className="text-lg text-foreground mb-2">DSD</h2>
      </div>
      <div className="animate-pixel-pulse">
        Game in process <span className="text-sm">...</span> 📢⚠️
      </div>
    </Card>
  );
};

export default DsdGame;
