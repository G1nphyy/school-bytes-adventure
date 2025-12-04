import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProgrammerGame from "@/components/games/ProgrammerGame";
import AutomatykGame from "@/components/games/AutomatykGame";
import ElektronikGame from "@/components/games/ElektronikGame";
import KomunikacjaGame from "@/components/games/KomunikacjaGame";
import InformatykGame from "@/components/games/InformatykGame";
import ElektroenergetykGame from "@/components/games/ElektroenergetykGame";
import TransportGame from "@/components/games/TransportGame";
import DsdGame from "@/components/games/DsdGame";

const careerGames: Record<string, { name: string; component: React.ComponentType }> = {
  programista: {
    name: "Technik programista",
    component: ProgrammerGame,
  },
  automatyk: {
    name: "Technik automatyk",
    component: AutomatykGame,
  },
  elektronik: {
    name: "Technik elektronik",
    component: ElektronikGame,
  },
  komunikacja: {
    name: "Technik komunikacji",
    component: KomunikacjaGame,
  },
  informatyk: {
    name: "Technik informatyk",
    component: InformatykGame,
  },
  elektroenergetyk: {
    name: "Technik elektroenergetyk",
    component: ElektroenergetykGame,
  },
  transport: {
    name: "Technik transportu",
    component: TransportGame,
  },
  niemiecki: {
    name: "DSD",
    component: DsdGame,
  },
};

const ComingSoon = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
    <div className="text-6xl mb-4 animate-pixel-pulse">🚧</div>
    <h2 className="text-xl text-foreground mb-2">{name}</h2>
    <p className="text-sm text-muted-foreground">Gra w przygotowaniu...</p>
  </div>
);

const CareerGame = () => {
  const { careerId } = useParams<{ careerId: string }>();
  const career = careerId ? careerGames[careerId] : null;

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button
              variant="outline"
              size="sm"
              className="fixed top-4 left-4 z-50 text-xs border-2 border-border hover:border-primary arcade-button"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              MENU
            </Button>
          </Link>
          <h1 className="text-sm md:text-xl text-center text-foreground">
            {career.name}
          </h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>

        {/* Game Component */}
        <div className="max-w-4xl mx-auto">
          <GameComponent />
        </div>
      </div>
    </div>
  );
};

export default CareerGame;
