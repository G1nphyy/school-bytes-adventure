import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Cpu, 
  CircuitBoard, 
  Radio, 
  Code, 
  Cog,
  Train,
  RouteIcon,
  Flag,
  Clock
} from "lucide-react";
import ZSK_LOGO from '@/assets/ZSK_logOO.png';

const careers = [
  {
    id: "automatyk",
    name: "Technik automatyk",
    icon: Cpu,
    color: "from-primary to-accent",
    description: "Systemy sterowania",
  },
  {
    id: "elektronik",
    name: "Technik elektronik",
    icon: CircuitBoard,
    color: "from-accent to-secondary",
    description: "Układy elektroniczne",
  },
  {
    id: "komunikacja",
    name: "Technik komunikacji",
    icon: Radio,
    color: "from-secondary to-primary",
    description: "Sieci szerokopasmowe",
  },
  {
    id: "informatyk",
    name: "Technik informatyk",
    icon: Code,
    color: "from-primary to-secondary",
    description: "Dwujęzyczny",
  },
  {
    id: "programista",
    name: "Technik programista",
    icon: Code,
    color: "from-accent to-primary",
    description: "Dwujęzyczny",
  },
  {
    id: "elektroenergetyk",
    name: "Technik elektroenergetyk",
    icon: Cog,
    color: "from-secondary to-accent",
    description: "Transport szynowy",
  },
  {
    id: "transport",
    name: "Technik transportu",
    icon: Train,
    color: "from-primary to-accent",
    description: "Transport kolejowy",
  },
  {
      id: "schody",
      name: "Podczas przerwy",
      icon: Clock,
      color: "from-secondary to-accent",
      description: "Dasz radę przed dzwonkiem?",
  },
  {
     id: "niemiecki",
     name: "DSD",
     icon: Flag,
     color: "from-secondary to-primary",
     description: "Dodatkowe zajęcia językowe",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-in-up">
          <div className="inline-block mb-4 bg-primary/20 border-4 border-[#1f1559] pixel-glow rounded-full">
            <img className="logo w-32 h-32 text-primary inline-block animate-pixel-pulse" src={ZSK_LOGO}  alt="ZSK"/>
          </div>
          <h1 className="text-2xl md:text-4xl text-foreground mb-4 tracking-wider">
            Zespół Szkół Komunikacji
            <span className="block text-primary mt-2 text-lg md:text-xl">im. Hipolita Cegielskiego w Poznaniu</span>
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Poznaj kierunki zawodowe przez interaktywne mini-gry!
          </p>
        </div>

        {/* Career Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {careers.map((career, index) => {
            const Icon = career.icon;
            return (
              <Link
                key={career.id}
                to={`/career/${career.id}`}
                className="group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="bg-card border-4 border-border hover:border-primary transition-all duration-200 p-6 h-full arcade-button hover:pixel-glow">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${career.color} flex items-center justify-center border-4 border-border group-hover:animate-pixel-float`}>
                      <Icon className="w-8 h-8 text-background" />
                    </div>
                    <div>
                      <h3 className="text-xs md:text-sm text-foreground mb-2 leading-relaxed">
                        {career.name}
                      </h3>
                      <p className="text-[10px] text-muted-foreground">
                        {career.description}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      ZAGRAJ →
                    </Button>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-muted-foreground">
          <p className="animate-blink inline-block">▶ WYBIERZ KIERUNEK ABY ZACZĄĆ ◀</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
