import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import ProgrammerGame from "@/components/games/ProgrammerGame";
import AutomatykGame from "@/components/games/AutomatykGame";
import ElektronikGame from "@/components/games/ElektronikGame";
import KomunikacjaGame from "@/components/games/KomunikacjaGame";
import InformatykGame from "@/components/games/InformatykGame";
import ElektroenergetykGame from "@/components/games/ElektroenergetykGame";
import TransportGame from "@/components/games/TransportGame";
import ElevatorGame from "@/components/games/ElevatorGame";
import DsdGame from "@/components/games/DsdGame";

const careerGames: Record<string, { name: string; component: React.ComponentType }> = {
  programista: { name: "Technik programista", component: ProgrammerGame },
  automatyk: { name: "Technik automatyk", component: AutomatykGame },
  elektronik: { name: "Technik elektronik", component: ElektronikGame },
  komunikacja: { name: "Technik komunikacji", component: KomunikacjaGame },
  informatyk: { name: "Technik informatyk", component: InformatykGame },
  elektroenergetyk: { name: "Technik elektroenergetyk", component: ElektroenergetykGame },
  transport: { name: "Technik transportu", component: TransportGame },
  schody: { name: "Podczas przerwy", component: ElevatorGame },
  niemiecki: { name: "DSD", component: DsdGame },
};

const CareerGame = () => {
  const { careerId } = useParams<{ careerId: string }>();
  const career = careerId ? careerGames[careerId] : null;
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);

  if (!career) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl text-foreground mb-4">404</h1>
            <p className="text-sm text-muted-foreground mb-4">Nie znaleziono kierunku</p>
            <Link to="/">
              <Button variant="outline" className="border-2 border-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Powrót
              </Button>
            </Link>
          </div>
        </div>
    );
  }

  const GameComponent = career.component;

  return (
      <div className="min-h-screen bg-background relative overflow-y-auto custom-scrollbar">
        {/* Background stays fixed */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

        {/* FLOATING HEADER SYSTEM (Does not take space in layout) */}
        <div
            className="fixed top-0 left-0 w-full z-[100] flex flex-col items-center"
            onMouseEnter={() => setIsHeaderHovered(true)}
            onMouseLeave={() => setIsHeaderHovered(false)}
        >
          {/* Transparent activation area */}
          <div className="absolute top-0 h-10 w-full cursor-pointer" />

          {/* Pulsing Handle (Trigger) */}
          <motion.div
              initial={{ y: -50 }}
              animate={{
                y: isHeaderHovered ? -100 : 0,
                opacity: 1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.5 // Wejście po załadowaniu gry
              }}
              className="w-40 h-8 bg-primary/20 backdrop-blur-md rounded-b-2xl border-x border-b border-primary/40 shadow-[0_0_20px_rgba(59,130,246,0.3)] flex flex-col justify-center items-center group pointer-events-auto"
          >
            <div className="text-[7px] font-black text-primary uppercase tracking-[0.3em] mb-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
              System Menu
            </div>
            <ChevronDown className="w-3 h-3 text-primary animate-bounce" />

            {/* Subtle glow effect on the handle */}
            <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-b-2xl" />
          </motion.div>

          {/* Expanding Header Overlay */}
          <AnimatePresence>
            {isHeaderHovered && (
                <motion.header
                    initial={{ y: -150 }}
                    animate={{ y: 0 }}
                    exit={{ y: -150 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="w-full absolute top-0 bg-background/90 backdrop-blur-3xl border-b-2 border-primary/40 shadow-[0_30px_60px_rgba(0,0,0,0.8)] pointer-events-auto"
                >
                  <div className="container mx-auto px-4 h-24 flex items-center justify-center relative">
                    <Link to="/" className="absolute left-8">
                      <Button
                          variant="outline"
                          className="text-[10px] font-bold border-2 border-border hover:border-primary hover:bg-primary/10 hover:text-popover-foreground arcade-button h-10 px-4 group/btn"
                      >
                        <ArrowLeft className="w-3 h-3 mr-2 group-hover/btn:-translate-x-1 transition-transform" />
                        MENU
                      </Button>
                    </Link>

                    <div className="relative px-10 py-3 border-x-4 border-primary/50 flex items-center gap-6 italic font-black uppercase tracking-widest">
                      <div className="flex flex-col gap-1.5">
                        <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
                        <div className="w-1.5 h-1.5 bg-primary/20" />
                      </div>
                      <h1 className="text-lg md:text-2xl text-foreground text-center">
                        {career.name}
                      </h1>
                      <div className="flex flex-col gap-1.5">
                        <div className="w-1.5 h-1.5 bg-primary/20" />
                        <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
                      </div>
                    </div>
                  </div>
                </motion.header>
            )}
          </AnimatePresence>
        </div>

        {/* MAIN CONTENT (Starts from the top) */}
        <main className="relative z-10">
          <div className="max-w-5xl mx-auto px-4">
            <GameComponent />
          </div>
        </main>
      </div>
  );
};

export default CareerGame;