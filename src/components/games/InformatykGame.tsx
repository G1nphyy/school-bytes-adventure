import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Cable, CheckCircle2, XCircle, Lightbulb, Cpu, MemoryStick, HardDrive, Trophy} from "lucide-react";
import RJ45_T568B from '@/assets/Utp_T568B.gif';

// DND IMPORTS
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "framer-motion";

// -------------------------- TYPY DND I DANE ---------------------------------

type CableColor = "orange_white" | "orange" | "green_white" | "green" | "blue_white" | "blue" | "brown_white" | "brown";

interface CableType {
  id: number;
  color: CableColor;
  label: string;
  label_short: string;
}

interface AssemblyComponentType {
  id: number;
  name: string;
  type: 'CPU' | 'RAM' | 'GPU' | 'COOLER';
  size: 'cpu' | 'ram' | 'gpu' | 'cooler';
  description: string;
}
interface RjCableItem {
  id: number;
  sourceSlotIndex: number;
  type: 'cable';
}

interface ComponentItem {
  id: number;
  sourceSlot: string | null;
  type: 'CPU' | 'RAM' | 'GPU' | 'COOLER';
}
const ItemTypes = {
  CABLE: 'cable',
  COMPONENT: 'component',
} as const;


// -------------------------- QUIZ DATA ---------------------------------
const securityQuestions = [
  {
    id: 1,
    question: "Które hasło jest najbezpieczniejsze?",
    options: ["password123", "P@ssw0rd!", "Tr3$#mK9@pL2", "qwerty"],
    correctAnswer: 2,
    explanation:
        "Silne hasło zawiera wielkie i małe litery, cyfry, znaki specjalne i ma co najmniej 12 znaków. Tr3$#mK9@pL2 spełnia te kryteria.",
    podpowiedzi: [
      "Najdłuższe hasło zwykle jest najbezpieczniejsze",
      "Powinno zawierać wielkie litery, cyfry i znaki specjalne",
      "Szukaj najdłuższego i najbardziej złożonego ciągu znaków",
    ],
    usefulness:
        "Wiedza o tworzeniu silnych haseł jest kluczowa w każdej pracy związanej z IT, a także w codziennym życiu, aby chronić dane klientów i własne systemy.",
  },
  {
    id: 2,
    question: "Co to jest phishing?",
    options: [
      "Rodzaj wirusa komputerowego",
      "Próba wyłudzenia danych przez podszywanie się",
      "Typ zapory sieciowej",
      "Metoda szyfrowania danych",
    ],
    correctAnswer: 1,
    explanation:
        "Phishing to próba wyłudzenia poufnych informacji (np. haseł, danych kart) poprzez podszywanie się pod zaufane źródło (np. bank, firmę kurierską).",
    podpowiedzi: [
      "Związane z podszywaniem się pod inne osoby/firmy",
      "Często w formie fałszywych e-maili",
      "Cel: wyłudzenie danych uwierzytelniających",
    ],
    usefulness:
        "Rozpoznawanie phishingu to podstawowa umiejętność każdego pracownika i informatyka. Jest to element modułu 'Bezpieczeństwo systemów' i pomaga chronić infrastrukturę firmy przed atakami socjotechnicznymi.",
  },
  {
    id: 3,
    question: "Co oznacza 'https' w adresie strony?",
    options: [
      "High Transfer Protocol System",
      "Połączenie jest szyfrowane",
      "Strona jest szybsza",
      "Strona wymaga logowania",
    ],
    correctAnswer: 1,
    explanation: "HTTPS oznacza, że połączenie jest szyfrowane i bezpieczne (HTTP + SSL/TLS), chroniąc dane przesyłane między użytkownikiem a serwerem.",
    podpowiedzi: [
      "'S' na końcu oznacza 'Secure'",
      "Dotyczy szyfrowania połączenia w przeglądarce",
      "Połączenie jest szyfrowane",
    ],
    usefulness:
        "Będziesz wykorzystywać tę wiedzę podczas projektowania bezpiecznych stron internetowych (np. w INF.03) oraz przy konfiguracji serwerów. Gwarantuje to poufność danych przesyłanych między klientem a serwerem.",
  },
  {
    id: 4,
    question: "Co to jest firewall?",
    options: [
      "Program do usuwania wirusów",
      "Zapora sieciowa kontrolująca ruch",
      "Narzędzie do tworzenia kopii zapasowych",
      "System operacyjny",
    ],
    correctAnswer: 1,
    explanation: "Firewall (zapora ogniowa) to system kontrolujący przychodzący i wychodzący ruch sieciowy, na podstawie ustalonych reguł bezpieczeństwa.",
    podpowiedzi: [
      "Ma związek z ochroną sieci",
      "Kontroluje przepływ danych",
      "To dosłownie 'ściana ogniowa' dla danych",
    ],
    usefulness:
        "Konfiguracja i zarządzanie zaporami sieciowymi to kluczowy element pracy administratora sieci. Jest to część zagadnień związanych z bezpieczeństwem sieci i systemów operacyjnych (np. w kwalifikacji INF.02).",
  },
  {
    id: 5,
    question: "Jak często należy aktualizować oprogramowanie?",
    options: [
      "Raz w roku",
      "Tylko gdy przestaje działać",
      "Regularnie, gdy są dostępne aktualizacje",
      "Nigdy, to zbędne",
    ],
    correctAnswer: 2,
    explanation:
        "Regularne aktualizacje są kluczowe dla bezpieczeństwa - łatają wykryte luki i dodają nowe zabezpieczenia, chroniąc przed atakami.",
    podpowiedzi: [
      "Bezpieczeństwo wymaga aktualnego oprogramowania",
      "Aktualizacje zawierają poprawki bezpieczeństwa",
      "Należy aktualizować regularnie",
    ],
    usefulness:
        "Zarządzanie łatkami bezpieczeństwa (patch management) to standardowa procedura w każdej firmie IT. W kursie na technika informatyka dowiesz się, jak tworzyć polityki aktualizacji i utrzymywać systemy bez luk.",
  },
  {
    id: 6,
    question: "Co to jest malware?",
    options: [
      "Program do ochrony komputera",
      "Złośliwe oprogramowanie",
      "Typ przeglądarki internetowej",
      "System plików",
    ],
    correctAnswer: 1,
    explanation:
        "Malware to skrót od 'malicious software' (złośliwe oprogramowanie), zaprojektowane do uszkodzenia, wyłączenia lub uzyskania dostępu do systemu komputerowego.",
    podpowiedzi: [
      "'Mal-' oznacza 'zły' lub 'złośliwy'",
      "To oprogramowanie, które szkodzi",
      "Złośliwe oprogramowanie",
    ],
    usefulness:
        "Wiedza o rodzajach złośliwego oprogramowania jest niezbędna, aby skutecznie je wykrywać i usuwać. Jest to podstawa diagnozowania i naprawy sprzętu i oprogramowania (INF.02).",
  },
];

// Shuffling options



// -------------------------- PC ASSEMBLY DATA ---------------------------------

const assemblyComponents: AssemblyComponentType[] = [
  { id: 101, name: "Procesor (CPU)", type: "CPU", size: "cpu", description: "Mózg komputera. Musi pasować do gniazda (socket) na płycie głównej." },
  { id: 102, name: "Pamięć RAM (A)", type: "RAM", size: "ram", description: "Pamięć robocza komputera. Slot DIMM." },
  { id: 103, name: "Pamięć RAM (B)", type: "RAM", size: "ram", description: "Pamięć robocza komputera. Slot DIMM." },
  { id: 104, name: "Karta Graficzna (GPU)", type: "GPU", size: "gpu", description: "Odpowiada za generowanie obrazu. Montowana w głównym slocie PCI-E x16." },
  { id: 105, name: "Chłodzenie CPU", type: "COOLER", size: "cooler", description: "Odprowadza ciepło z procesora. Musi być poprawnie zamontowane nad CPU." },
];

const assemblySlots = {
  CPU: { type: "CPU", label: "Gniazdo Procesora" },
  COOLER: { type: "COOLER", label: "Mocowanie Chłodzenia" },
  RAM1: { type: "RAM", label: "Slot RAM A1" },
  RAM2: { type: "RAM", label: "Slot RAM B1" },
  PCIEX16: { type: "GPU", label: "Slot PCI-E x16" },
};

const assemblyHintsData = [
  "Pamiętaj o prawidłowej kolejności montażu: najpierw CPU, potem RAM, na końcu GPU i Chłodzenie.",
  "Procesor (CPU) pasuje tylko do swojego gniazda. Uważaj na trójkąt kierunkowy.",
  "Pamięć RAM powinna być instalowana w slotach oznaczonych tym samym kolorem (dual-channel) lub w parze A1/B1.",
];

const assemblyUsefulness = "Umiejętność montażu podzespołów (CPU, RAM, GPU) w komputerze osobistym jest kluczową kompetencją praktyczną w kwalifikacji INF.02. Prawidłowy montaż gwarantuje stabilną pracę systemu i uniknięcie uszkodzenia sprzętu.";


// -------------------------- RJ GAME DATA ---------------------------------

const cables: CableType[] = [
  { id: 1, color: "orange_white", label: "Biało-Pomarańczowy", label_short: "W/O" },
  { id: 2, color: "orange", label: "Pomarańczowy", label_short: "O" },
  { id: 3, color: "green_white", label: "Biało-Zielony", label_short: "W/G" },
  { id: 4, color: "blue", label: "Niebieski", label_short: "B" },
  { id: 5, color: "blue_white", label: "Biało-Niebieski", label_short: "W/B" },
  { id: 6, color: "green", label: "Zielony", label_short: "G" },
  { id: 7, color: "brown_white", label: "Biało-Brązowy", label_short: "W/BR" },
  { id: 8, color: "brown", label: "Brązowy", label_short: "BR" },
];

const correctOrder = [1, 2, 3, 4, 5, 6, 7, 8];

const rj45Hints = [
  "Norma T568B jest najczęściej stosowana i ma kolorystykę inną niż T568A.",
  "Zacznij od par 'biało-kolorowych' i 'kolorowych'. Pamiętaj, że para pomarańczowa (1-2) i zielona (3-6) są kluczowe.",
  "Pełna kolejność to: Biało-Pomarańczowy, Pomarańczowy, Biało-Zielony, Niebieski, Biało-Niebieski, Zielony, Biało-Brązowy, Brązowy.",
];

const rjUsefulness = "Zaciskanie kabli według standardów T568B/A to podstawowa umiejętność technika. Błędne okablowanie jest najczęstszą przyczyną problemów z połączeniem w sieciach LAN, wymagana w kwalifikacji INF.02.";


// -------------------------- HELPER FUNCTIONS ---------------------------------

const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const prepareRandomizedQuestions = () => {
  const shuffledQ = shuffleArray(securityQuestions);
  return shuffledQ.map((q) => {
    const optionsWithIndex = q.options.map((opt: string, index: number) => ({
      text: opt,
      originalIndex: index
    }));
    const shuffledOptions = shuffleArray(optionsWithIndex);
    const newOptions = shuffledOptions.map((o: any) => o.text);
    const newCorrectAnswer = shuffledOptions.findIndex((o: any) => o.originalIndex === q.correctAnswer);

    return {
      ...q,
      options: newOptions,
      correctAnswer: newCorrectAnswer
    };
  });
};


const getCableById = (id: number) => cables.find(c => c.id === id);

const getAssemblyComponentById = (id: number) => assemblyComponents.find(c => c.id === id);

const getCableColor = (color: CableColor) => {
  const colorMap: Record<CableColor, string> = {
    orange_white: "bg-gray-100 border-r-4 border-orange-500",
    green_white: "bg-gray-100 border-r-4 border-green-500",
    blue_white: "bg-gray-100 border-r-4 border-blue-500",
    brown_white: "bg-gray-100 border-r-4 border-amber-700",
    orange: "bg-orange-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    brown: "bg-amber-700",
  };
  return colorMap[color];
};

// -------------------------- DND COMPONENTS (CABLE) ---------------------------------

interface DraggableCableProps {
  cable: CableType;
  currentSlotIndex: number;
  onRemove: (cableId: number, slotIndex: number) => void;
}

const DraggableCable: React.FC<DraggableCableProps> = ({ cable, currentSlotIndex, onRemove }) => {
  const [{ isDragging }, drag] = useDrag<RjCableItem, unknown, { isDragging: boolean }>(() => ({
    type: ItemTypes.CABLE,
    item: { id: cable.id, sourceSlotIndex: currentSlotIndex, type: ItemTypes.CABLE },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
      <motion.div
          ref={drag}
          style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={() => onRemove(cable.id, currentSlotIndex)}
          className={`w-full h-full border border-border ${getCableColor(cable.color)} absolute`}
      >
        <div className="h-full flex items-center justify-center">
                 <span className="text-[8px] text-black font-bold writing-mode-vertical transform">
                     {cable.label_short}
                 </span>
        </div>
      </motion.div>
  );
};

interface CableSlotProps {
  index: number;
  cableId: number | null;
  onDrop: (cableId: number, targetSlotIndex: number, sourceSlotIndex: number) => void;
  onRemove: (cableId: number, slotIndex: number) => void;
}

const CableSlot: React.FC<CableSlotProps> = ({ index, cableId, onDrop, onRemove }) => {
  const cable = cableId !== null ? getCableById(cableId) : null;

  const [{ isOver, canDrop }, drop] = useDrop<RjCableItem, unknown, { isOver: boolean; canDrop: boolean }>(() => ({
    accept: ItemTypes.CABLE,
    drop: (item, monitor) => onDrop(item.id, index, item.sourceSlotIndex),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = isOver && canDrop;

  return (
      <div key={index} className="flex flex-col items-center">
        <div
            ref={drop}
            className={`w-10 h-24 border-2 border-border relative transition-all duration-200 ${
                isActive ? "bg-primary/30" : "bg-background"
            } `}
        >
          <AnimatePresence>
            {cable && (
                <DraggableCable
                    cable={cable}
                    currentSlotIndex={index}
                    onRemove={onRemove}
                />
            )}
          </AnimatePresence>
        </div>
        <span className="text-[8px] text-muted-foreground mt-1">{index + 1}</span>
      </div>
  );
};

interface CableSourceProps {
  cable: CableType;
  isUsed: boolean;
}

const CableSource: React.FC<CableSourceProps> = ({ cable, isUsed }) => {
  const [{ isDragging }, drag] = useDrag<RjCableItem, unknown, { isDragging: boolean }>(() => ({
    type: ItemTypes.CABLE,
    item: { id: cable.id, sourceSlotIndex: -1, type: ItemTypes.CABLE },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const opacity = isDragging ? 0 : 1;
  const cursor = isUsed ? "not-allowed" : "grab";
  const className = `px-4 py-3 border-2 border-border arcade-button transition-all ${isUsed ? "opacity-30 cursor-not-allowed" : "hover:border-primary cursor-pointer"}`;

  if (isUsed) return null;

  return (
      <motion.button
          key={cable.id}
          ref={drag}
          style={{ opacity, cursor }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={className}
      >
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 ${getCableColor(cable.color)} border border-border`} />
          <span className="text-xs text-foreground">{cable.label}</span>
        </div>
      </motion.button>
  );
};


// -------------------------- DND COMPONENTS (PC ASSEMBLY) ---------------------------------

interface DraggableComponentProps {
  component: AssemblyComponentType;
  currentSlot: string | null;
  onRemove: (componentId: number, slotName: string) => void;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ component, currentSlot, onRemove }) => {
  const [{ isDragging }, drag] = useDrag<ComponentItem, unknown, { isDragging: boolean }>(() => ({
    type: ItemTypes.COMPONENT,
    item: { id: component.id, type: component.type, sourceSlot: currentSlot },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const ComponentIcon = component.type === 'CPU' ? Cpu : component.type === 'RAM' ? MemoryStick : component.type === 'GPU' ? HardDrive : Lightbulb;

  return (
      <motion.div
          ref={drag}
          style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={() => currentSlot && onRemove(component.id, currentSlot)}
          className={`p-1 border-2 text-center text-[10px] transition-all flex items-center justify-center font-bold ${currentSlot ? 'absolute w-full h-full bg-accent/80 text-black border-accent' : 'bg-background hover:border-primary'}`}
      >
        <ComponentIcon className="w-3 h-3 mr-1" />
        {component.name}
      </motion.div>
  );
};

interface ComponentDropZoneProps {
  slotName: string;
  slotData: { type: 'CPU' | 'RAM' | 'GPU' | 'COOLER', label: string };
  componentId: number | null;
  onDrop: (componentId: number, targetSlotName: string, sourceSlotName: string | null) => void;
  onRemove: (componentId: number, slotName: string) => void;
}

const ComponentDropZone: React.FC<ComponentDropZoneProps> = ({ slotName, slotData, componentId, onDrop, onRemove }) => {
  const component = componentId !== null ? getAssemblyComponentById(componentId) : null;
  const slotType = slotData.type;

  const [{ isOver, canDrop }, drop] = useDrop<ComponentItem, unknown, { isOver: boolean; canDrop: boolean }>(() => ({
    accept: ItemTypes.COMPONENT,
    canDrop: (item) => item.type === slotType && componentId === null,
    drop: (item) => onDrop(item.id, slotName, item.sourceSlot),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = isOver && canDrop;

  const slotClasses = {
    CPU: 'w-24 h-24 border-4 border-gray-700 bg-gray-900 absolute top-[25%] left-[25%]',
    COOLER: 'w-28 h-28 border-dashed border-2 border-red-400 bg-transparent absolute top-[25%] left-[25%]',
    RAM1: 'w-4 h-20 border-2 border-green-600 bg-gray-800 absolute top-[20%] right-[30%]',
    RAM2: 'w-4 h-20 border-2 border-green-600 bg-gray-800 absolute top-[20%] right-[20%]',
    PCIEX16: 'w-6 h-48 border-2 border-blue-600 bg-gray-800 absolute bottom-[15%] right-[25%]',
  };

  return (
      <div
          ref={drop}
          className={`${slotClasses[slotName as keyof typeof slotClasses]} relative transition-all duration-200 ${isActive ? 'bg-primary/30' : ''}`}
          style={{ opacity: 1 }}
      >
        <span className={`text-[8px] text-muted-foreground absolute -top-4 left-0 p-1 bg-card/80 rounded-sm`}>{slotData.label}</span>
        {component && (
            <DraggableComponent
                component={component}
                currentSlot={slotName}
                onRemove={onRemove}
            />
        )}
      </div>
  );
};


// -------------------------- GŁÓWNY KOMPONENT GRY ---------------------------------


const InformatykGame = () => {

  // QUIZ STATES
  const [shuffledQuestions, setShuffledQuestions] = useState(() => prepareRandomizedQuestions());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showUsefulness, setShowUsefulness] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const question = shuffledQuestions[currentQuestion];


  // PC ASSEMBLY STATES
  const [assemblyComplete, setAssemblyComplete] = useState(false);
  const [componentSlots, setComponentSlots] = useState<Record<string, number | null>>({
    CPU: null,
    RAM1: null,
    RAM2: null,
    PCIEX16: null,
    COOLER: null
  });
  const [assemblyScore, setAssemblyScore] = useState(0);
  const [showAssemblyResult, setShowAssemblyResult] = useState(false);
  const [assemblyAttempts, setAssemblyAttempts] = useState(0);
  const [assemblyHints, setAssemblyHints] = useState(0);
  const [showAssemblySummary, setShowAssemblySummary] = useState(false);


  // RJ GAME STATES
  const [cableSlots, setCableSlots] = useState<(number | null)[]>(new Array(correctOrder.length).fill(null));
  const [rjComplete, setRjComplete] = useState(false);
  const [rjCorrect, setRjCorrect] = useState(false);
  const [rjAttempts, setRjAttempts] = useState(0);
  const [showRjResult, setShowRjResult] = useState(false);
  const [rjHintLevel, setRjHintLevel] = useState(0);
  const [showRjSummary, setShowRjSummary] = useState(false);
  const [shuffledCables, setShuffledCables] = useState(shuffleArray(cables));


  // Wymagane
  const isRjReady = cableSlots.every(id => id !== null);
  const usedCableIds = cableSlots.filter((id): id is number => id !== null);

  const requiredComponentIds = assemblyComponents.map(c => c.id);
  const usedComponentIds = Object.values(componentSlots).filter(id => id !== null) as number[];
  const isAssemblyReady = requiredComponentIds.every(id => usedComponentIds.includes(id));

  // -------------------------- RESET & HELPERS ---------------------------------

  const handleRestart = () => {
    // Reset Quiz
    setShuffledQuestions(prepareRandomizedQuestions());
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowUsefulness(false);
    setQuizScore(0);
    setTotalScore(0);
    setQuizComplete(false);
    setHintLevel(0);

    // Reset PC Assembly
    setAssemblyComplete(false);
    setComponentSlots({ CPU: null, RAM1: null, RAM2: null, PCIEX16: null, COOLER: null });
    setAssemblyScore(0);
    setShowAssemblyResult(false);
    setAssemblyAttempts(0);
    setAssemblyHints(0);
    setShowAssemblySummary(false);

    // Reset RJ-45
    setRjComplete(false);
    setRjCorrect(false);
    setRjAttempts(0);
    setCableSlots(new Array(correctOrder.length).fill(null));
    setShowRjResult(false);
    setRjHintLevel(0);
    setShowRjSummary(false);
    setShuffledCables(shuffleArray(cables));
  };

  const toggleUsefulness = () => {
    setShowUsefulness(!showUsefulness);
  };

  const handleNext = () => {
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setHintLevel(0);
    setShowUsefulness(false);
  };

  // -------------------------- QUIZ LOGIC (UPROSZCZONA) ---------------------------------

  // ZMIENIONA: Sprawdza odpowiedź od razu po kliknięciu
  const handleAnswerClick = (index: number) => {
    if (showResult) return;

    setSelectedAnswer(index);
    setShowResult(true); // ODPALENIE WYNIKU OD RAZU
    setShowUsefulness(false);

    if (index === question.correctAnswer) {
      // Proste punktowanie: 10 punktów za poprawną odpowiedź
      const points = 10;
      setQuizScore(prev => prev + points);
      setTotalScore(prev => prev + points);
    }
  };


  const showQuizHint = () => {
    if (hintLevel < question.podpowiedzi.length) {
      setHintLevel(hintLevel + 1);
      setTotalScore(prev => prev - 2);
    }
  };

  // -------------------------- RJ GAME LOGIC ---------------------------------

  const handleRjDrop = useCallback((cableId: number, targetSlotIndex: number, sourceSlotIndex: number) => {
    if (showRjResult && !rjCorrect && rjAttempts >= 3) return;

    setCableSlots(prevSlots => {
      const newSlots = [...prevSlots];
      if (sourceSlotIndex !== -1 && sourceSlotIndex !== targetSlotIndex) {
        const targetCableId = newSlots[targetSlotIndex];
        if (targetCableId !== null) {
          newSlots[sourceSlotIndex] = targetCableId;
          newSlots[targetSlotIndex] = cableId;
        } else {
          newSlots[sourceSlotIndex] = null;
          newSlots[targetSlotIndex] = cableId;
        }
      } else if (sourceSlotIndex === -1) {
        if (newSlots[targetSlotIndex] === null) {
          newSlots[targetSlotIndex] = cableId;
        }
      }
      return newSlots;
    });
    setShowRjResult(false);
    setShowUsefulness(false);
  }, [showRjResult, rjCorrect, rjAttempts]);

  const handleRemoveCable = useCallback((cableId: number, slotIndex: number) => {
    if (showRjResult && !rjCorrect && rjAttempts >= 3) return;
    setCableSlots(prevSlots => {
      const newSlots = [...prevSlots];
      newSlots[slotIndex] = null;
      return newSlots;
    });
    setShowRjResult(false);
    setShowUsefulness(false);
  }, [showRjResult, rjCorrect, rjAttempts]);

  const handleCheckRjOrder = () => {
    if (showRjResult) {
      if (rjCorrect || rjAttempts >= 3) {
        setShowRjSummary(true);
      }
      return;
    }

    if (!isRjReady) return;

    const newAttempts = rjAttempts + 1;
    setRjAttempts(newAttempts);

    const isOrderCorrect = cableSlots.every((id, index) => id === correctOrder[index]);

    setRjCorrect(isOrderCorrect);
    setShowRjResult(true);
    setShowUsefulness(false);

    if (isOrderCorrect) {
      const rjPoints = newAttempts === 1 ? 30 : 15;
      const hintPenalty = rjHintLevel * 5;
      const finalRjPoints = rjPoints - hintPenalty;
      setTotalScore(prevScore => prevScore + Math.max(0, finalRjPoints));
    }

    if (isOrderCorrect || newAttempts >= 3) {
      setCableSlots(correctOrder);
      setTimeout(() => setShowRjSummary(true), 5000);
    }
  };


  const handleRjReset = () => {
    setCableSlots(new Array(correctOrder.length).fill(null));
    setShowRjResult(false);
    setShowUsefulness(false);
  };

  const showRjHint = () => {
    if (rjHintLevel < rj45Hints.length) {
      setRjHintLevel(rjHintLevel + 1);
      setTotalScore(prev => prev - 5);
    }
  };

  // -------------------------- PC ASSEMBLY LOGIC ---------------------------------
  // TODO: Zrobić żeby było można dropnąć element na każdy slot, nie tylko poprawny
  const handleAssemblyDrop = useCallback((componentId: number, targetSlotName: string, sourceSlotName: string | null) => {
    if (showAssemblyResult && assemblyAttempts >= 1) return;

    setComponentSlots(prevSlots => {
      const newSlots = { ...prevSlots };
      const component = getAssemblyComponentById(componentId);
      if (!component) return prevSlots;

      const targetSlotType = assemblySlots[targetSlotName as keyof typeof assemblySlots].type;

      if (component.type !== targetSlotType) {
        return prevSlots;
      }

      if (sourceSlotName) {
        newSlots[sourceSlotName] = null;
      }

      newSlots[targetSlotName] = componentId;
      return newSlots;
    });

    setShowAssemblyResult(false);
    setShowUsefulness(false);
  }, [showAssemblyResult, assemblyAttempts]);

  const handleRemoveComponent = useCallback((componentId: number, slotName: string) => {
    if (showAssemblyResult && assemblyAttempts >= 1) return;
    setComponentSlots(prevSlots => ({
      ...prevSlots,
      [slotName]: null
    }));
    setShowAssemblyResult(false);
    setShowUsefulness(false);
  }, [showAssemblyResult, assemblyAttempts]);

  const checkAssembly = () => {
    if (showAssemblyResult) {
      if (assemblyScore >= 25 || assemblyAttempts >= 3) {
        setShowAssemblySummary(true);
      }
      return;
    }

    if (!isAssemblyReady) return;


    setAssemblyAttempts(prev => prev + 1);

    // Weryfikacja (CPU, GPU, dwie różne kości RAM, COOLER na CPU)
    const isCpuCorrect = componentSlots.CPU === assemblyComponents.find(c => c.type === 'CPU')?.id;
    const ramSticks = assemblyComponents.filter(c => c.type === 'RAM').map(c => c.id);
    const isRamCorrect = componentSlots.RAM1 !== null && componentSlots.RAM2 !== null && componentSlots.RAM1 !== componentSlots.RAM2 && ramSticks.includes(componentSlots.RAM1!) && ramSticks.includes(componentSlots.RAM2!);

    const isGpuCorrect = componentSlots.PCIEX16 === assemblyComponents.find(c => c.type === 'GPU')?.id;
    const isCoolerCorrect = componentSlots.COOLER === assemblyComponents.find(c => c.type === 'COOLER')?.id && componentSlots.CPU !== null;

    const isCorrect = isCpuCorrect && isGpuCorrect && isCoolerCorrect && isRamCorrect;

    let score = 0;
    if (isCpuCorrect) score += 5;
    if (isGpuCorrect) score += 5;
    if (isCoolerCorrect) score += 5;
    if (isRamCorrect) score += 10;

    setAssemblyScore(score);
    setShowAssemblyResult(true);
    setShowUsefulness(false);

    if (isCorrect || assemblyAttempts >= 2) {
      const finalPoints = isCorrect ? (25 - assemblyHints * 5) : score; // Max 25 pkt
      setTotalScore(prev => prev + Math.max(0, finalPoints));

      setTimeout(() => setShowAssemblySummary(true), 5000);
    }
  }

  const handleAssemblyReset = () => {
    setComponentSlots({ CPU: null, RAM1: null, RAM2: null, PCIEX16: null, COOLER: null });
    setShowAssemblyResult(false);
    setShowUsefulness(false);
  }

  const showAssemblyHint = () => {
    if (assemblyHints < assemblyHintsData.length) {
      setAssemblyHints(assemblyHints + 1);
      setTotalScore(prev => prev - 5);
    }
  }


  // -------------------------- RENDER LOGIC ---------------------------------

  // 1. OSTATNI EKRAN (Quiz + Montaż + RJ Game skończone)
  if (quizComplete && assemblyComplete && rjComplete) {
    const maxQuizScore = securityQuestions.length * 10;
    const maxAssemblyScore = 25;
    const estimatedMaxScore = maxQuizScore + maxAssemblyScore + 30;

    const percentage = (totalScore / estimatedMaxScore) * 100;

    return (
        <div className="p-6 min-h-screen flex items-center justify-center bg-background/95">
          <Card className="p-8 max-w-4xl w-full text-center space-y-6 border-4 shadow-2xl animate-fade-in bg-card text-card-foreground mx-auto">
            {/* Header z Trofeum */}
            <div className="text-center mb-6 mt-4">
              <div className="relative inline-block">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-2 animate-bounce drop-shadow-md" />
              {percentage >= 70 && (
                  <div className="absolute -top-2 -right-4 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                    TOP WYNIK!
                  </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">GRATULACJE!</h2>
            <p className="text-muted-foreground text-sm uppercase tracking-widest">Ukończono ścieżkę Informatyka</p>
          </div>

          {/* Baner z wynikiem głównym */}
          <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6 text-center mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 blur-xl"></div>
            <span className="relative z-10 text-xs text-muted-foreground font-bold uppercase">Twój Wynik Końcowy</span>
            <div className="relative z-10 text-5xl font-black text-primary mt-2 drop-shadow-sm">{totalScore} <span className="text-xl font-medium text-foreground/60">PKT</span></div>
          </div>

          {/* Szczegółowe statystyki */}
          <div className="space-y-3 mb-8">
            <h3 className="text-xs font-bold text-muted-foreground ml-1 mb-2">SZCZEGÓŁY PUNKTACJI</h3>

            {/* Quiz Stat */}
            <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg bg-card hover:bg-accent/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-md border border-blue-500/20">
                  <Shield className="w-5 h-5 text-blue-500"/>
                </div>
                <div>
                  <p className="font-bold text-sm leading-none mb-1">Cyberbezpieczeństwo</p>
                  <p className="text-[10px] text-muted-foreground">Wiedza teoretyczna</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-foreground">{quizScore}</span>
                <span className="text-xs text-muted-foreground"> / {maxQuizScore}</span>
              </div>
            </div>

            {/* Assembly Stat */}
            <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg bg-card hover:bg-accent/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-md border border-purple-500/20">
                  <Cpu className="w-5 h-5 text-purple-500"/>
                </div>
                <div>
                  <p className="font-bold text-sm leading-none mb-1">Sprzęt Komputerowy</p>
                  <p className="text-[10px] text-muted-foreground">Montaż jednostki PC</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-foreground">{assemblyScore}</span>
                <span className="text-xs text-muted-foreground"> / {maxAssemblyScore}</span>
              </div>
            </div>

            {/* Network Stat */}
            <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg bg-card hover:bg-accent/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-md border border-orange-500/20">
                  <Cable className="w-5 h-5 text-orange-500"/>
                </div>
                <div>
                  <p className="font-bold text-sm leading-none mb-1">Sieci Komputerowe</p>
                  <p className="text-[10px] text-muted-foreground">Zarabianie kabla RJ-45</p>
                </div>
              </div>
              <div className="text-right">
                {rjCorrect ? (
                    <span className="text-green-500 font-bold text-xs flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                      <CheckCircle2 className="w-3 h-3"/> ZALICZONE
                    </span>
                ) : (
                    <span className="text-destructive font-bold text-xs flex items-center gap-1 bg-destructive/10 px-2 py-1 rounded-full border border-destructive/20">
                      <XCircle className="w-3 h-3"/> BŁĄD ({rjAttempts} próby)
                    </span>
                )}
              </div>
            </div>
          </div>

          {/* Feedback Text */}
          <div className="bg-muted/50 p-4 rounded-lg mb-6 text-xs leading-relaxed text-center border border-border/50 italic text-muted-foreground">
            {percentage >= 70
                ? "Wyśmienicie! Masz solidne podstawy do pracy jako Technik Informatyk. Świetnie radzisz sobie zarówno z teorią, jak i praktyką."
                : percentage >= 50
                    ? "Dobra robota! Masz potencjał, ale warto powtórzyć standardy sieciowe i zagadnienia z bezpieczeństwa, aby osiągnąć mistrzostwo."
                    : "Początki bywają trudne. Informatyka wymaga precyzji i cierpliwości. Spróbuj jeszcze raz, zwracając większą uwagę na podpowiedzi!"}
          </div>

            <div className="mt-auto">
              <Button
                  onClick={handleRestart}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 arcade-button h-12 text-sm uppercase tracking-wider font-bold shadow-lg shadow-primary/20"
              >
                Zagraj Ponownie
              </Button>
            </div>
          </Card>
        </div>
    );
  }

  // 2. EKRAN PODSUMOWANIA RJ-45
  if (quizComplete && assemblyComplete && showRjSummary) {
    const rjResultMsg = rjCorrect ? "SUKCES W OKABLOWANIU" : "BRAK SUKCESU W OKABLOWANIU";
    const finalSlots = correctOrder;

    return (
        <div className="p-6 min-h-screen flex items-center justify-center bg-background/95">
          <Card className="p-6 border-4 space-y-4 max-w-4xl w-full mx-auto shadow-2xl bg-card text-card-foreground overflow-y-auto animate-fade-in">
            <div className="mb-6 text-center">
              <Cable className={`w-12 h-12 ${rjCorrect ? "text-accent" : 'text-destructive' } mx-auto mb-4 animate-bounce`} />
            <h2 className="text-lg text-foreground mb-2">PODSUMOWANIE ETAPU RJ-45</h2>
            <p className={`text-xl font-bold ${rjCorrect ? 'text-accent' : 'text-destructive'}`}>
              {rjResultMsg}
            </p>
          </div>

          <div className="mb-8">
            <div className="bg-muted border-4 border-border p-6 mx-auto max-w-md">
              <div className="text-xs text-muted-foreground mb-2 text-center font-bold">
                PRAWIDŁOWA KOLEJNOŚĆ T568B (1-8)
              </div>
              {/* --------------------- ZDJĘCIE --------------------*/}
              <img src={RJ45_T568B} alt="T568B" className="w-full mb-4"/>
              {/* --------------- Ustawianie poprawnej kolejności kabli w rjtce ----------------- */}
              <div className="flex gap-2 justify-center opacity-70 pointer-events-none">
                {finalSlots.map((cableId, index) => {
                  const cable = getCableById(cableId);
                  if (!cable) return null;
                  return (
                      <div key={index} className="flex flex-col items-center">
                        <div className={`w-10 h-24 border-2 border-border relative bg-background`}>
                          <div className={`w-full h-full border border-border ${getCableColor(cable.color)} absolute`}>
                            <div className="h-full flex items-center justify-center">
                                          <span className="text-[8px] text-black font-bold writing-mode-vertical transform">
                                              {cable.label_short}
                                          </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[8px] text-muted-foreground mt-1">{index + 1}</span>
                      </div>
                  )
                })}
              </div>
              {/* ------------------------------------------------------------------------------------- */}
            </div>
          </div>

          <div className="mb-6 space-y-3">
            <Button
                onClick={toggleUsefulness}
                variant="outline"
                size="sm"
                className={`w-full border-2 ${showUsefulness ? 'border-primary/50 bg-primary/20' : 'border-border hover:border-primary/50'} text-foreground arcade-button hover:bg-primary/10 hover:text-primary-foreground h-auto py-3 whitespace-normal`}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              DO CZEGO PRZYDA MI SIĘ TA WIEDZA?
            </Button>
          </div>

          {showUsefulness && (
              <div className="mb-6 animate-slide-in-up">
                <div className="p-4 border-2 border-primary/50 bg-primary/10 text-primary-foreground">
                  <p className="text-xs leading-relaxed text-foreground/80 font-semibold">{rjUsefulness}</p>
                </div>
              </div>
          )}


          <div className="mb-6 animate-slide-in-up flex-grow">
            <div
                className={`p-4 border-2 ${
                    rjCorrect
                        ? "border-accent bg-accent/20 text-accent"
                        : "border-destructive bg-destructive/20 text-destructive"
                }`}
            >
              <p className="text-xs mb-2 font-bold">
                {rjCorrect ? "✓ WYNIK: PRAWIDŁOWO!" : "✗ WYNIK: NIEPRAWIDŁOWO"}
              </p>
              <p className="text-xs leading-relaxed">
                {rjCorrect
                    ? "Gratulacje! Norma T568B to standard stosowany w większości sieci."
                    : `Błąd. Prawidłowa kolejność T568B to: ${cables.map(c => c.label_short).join(', ')}. Konieczność nauki standardów to podstawa.`}
              </p>
              <p className="text-xs font-bold mt-2">
                Liczba prób: {rjAttempts}. Użyte podpowiedzi: {rjHintLevel}.
              </p>
            </div>
          </div>

            <Button
                onClick={() => {
                  setRjComplete(true);
                  setShowRjSummary(false);
                  setShowUsefulness(false);
                }}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 arcade-button h-12"
            >
              PRZEJDŹ DO EKRANU KOŃCOWEGO
            </Button>
          </Card>
        </div>
    );
  }

  // 3. RJ GAME (główny etap - jeśli Quiz i Assembly skończone)
  if (quizComplete && assemblyComplete) {
    const attemptsLeft = 3 - rjAttempts;
    const canAttempt = rjAttempts < 3;

    return (
        <DndProvider backend={HTML5Backend}>
          <div className="p-6 min-h-screen flex items-center justify-center bg-background/95">
            <Card className="p-6 border-4 space-y-4 max-w-4xl w-full mx-auto shadow-2xl bg-card text-card-foreground overflow-y-auto animate-fade-in">
              <div className="mb-6 text-center">
                <Cable className="w-12 h-12 text-primary mx-auto mb-4 animate-pixel-float" />
              <h2 className="text-lg text-foreground mb-2">ETAP 3: OKABLOWANIE RJ-45</h2>
              <p className="text-lg font-bold text-primary mb-2">Punkty: {totalScore}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Przeciągnij i upuść 8 kabli w złączu, zgodnie z normą T568B.
              </p>
            </div>

            <div className="mb-8">
              <div className="bg-muted border-4 border-border p-6 mx-auto max-w-md">
                <div className="text-xs text-muted-foreground mb-2 text-center">
                  ZŁĄCZE RJ-45 | Pozostałe próby: {attemptsLeft > 0 ? attemptsLeft : 0}
                </div>

                <div className="flex gap-2 justify-center">
                  {cableSlots.map((cableId, index) => (
                      <CableSlot
                          key={index}
                          index={index}
                          cableId={cableId}
                          onDrop={handleRjDrop}
                          onRemove={handleRemoveCable}
                      />
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6 flex-grow">
              <p className="text-xs text-muted-foreground mb-3 text-center">
                Dostępne kable: ({usedCableIds.length}/{correctOrder.length} użyte)
              </p>
              <motion.div layout className="flex flex-wrap gap-3 justify-center">
                <AnimatePresence>
                  {shuffledCables.map((cable) => (
                      <CableSource
                          key={cable.id}
                          cable={cable}
                          isUsed={usedCableIds.includes(cable.id)}
                      />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="space-y-4 animate-slide-in-up">
              {rjHintLevel < rj45Hints.length && canAttempt && (
                  <Button
                      onClick={showRjHint}
                      variant="outline"
                      size="sm"
                      className="w-full border-2 border-secondary text-secondary hover:bg-secondary/20 hover:text-white arcade-button h-auto py-3 whitespace-normal"
                  >
                    💡 POKAŻ PODPOWIEDŹ ({rjHintLevel + 1}/{rj45Hints.length}) (KOSZT: 5 PKT)
                  </Button>
              )}

              {rjHintLevel > 0 && (
                  <div className="space-y-2">
                    {rj45Hints.slice(0, rjHintLevel).map((hint, index) => (
                        <div
                            key={index}
                            className="p-3 border-2 border-secondary bg-secondary/20 text-secondary animate-slide-in-up"
                        >
                          <p className="text-xs">
                            <span className="font-bold">Podpowiedź {index + 1}:</span> {hint}
                          </p>
                        </div>
                    ))}
                  </div>
              )}

              {showRjResult && (
                  <div className={`p-4 border-4 mb-4 text-center ${rjCorrect ? "border-accent bg-accent/20" : "border-destructive bg-destructive/20"}`}>
                    {rjCorrect ? (
                        <>
                          <CheckCircle2 className="w-8 h-8 text-accent mx-auto mb-2" />
                          <h3 className="text-lg text-accent mb-1">PRAWIDŁOWO!</h3>
                          <p className="text-xs text-accent">Zaraz przejdziesz do podsumowania, aby zobaczyć wyjaśnienia.</p>
                        </>
                    ) : (
                        <>
                          <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                          <h3 className="text-lg text-destructive mb-1">BŁĄD W OKABLOWANIU</h3>
                          {attemptsLeft > 0 ? (
                              <p className="text-xs text-destructive">Spróbuj ponownie. Próba: {rjAttempts}/{3}</p>
                          ) : (
                              <p className="text-xs text-destructive font-bold">WYKORZYSTANO MAKSYMALNĄ LICZBĘ PRÓB (3). Przejdź do podsumowania, aby zobaczyć rozwiązanie.</p>
                          )}

                          <Button
                              onClick={handleRjReset}
                              disabled={!canAttempt}
                              className="mt-3 w-full bg-destructive/80 text-primary-foreground hover:bg-destructive"
                          >
                            {canAttempt ? "WYCZYŚĆ I SPRÓBUJ PONOWNIE" : " Nawet dla mnie to jest trudne... "}
                          </Button>
                        </>
                    )}
                  </div>
              )}

              <Button
                  onClick={handleCheckRjOrder}
                  disabled={!isRjReady && canAttempt}
                  className={`w-full bg-primary text-primary-foreground hover:bg-primary/90 arcade-button h-12 ${!isRjReady && canAttempt ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {rjCorrect ? "PRZEJDŹ DO PODSUMOWANIA " : (canAttempt ? "AKCEPTUJ KOLEJNOŚĆ" : "ZOBACZ PODSUMOWANIE ")}
              </Button>
            </div>
            </Card>
          </div>
        </DndProvider>
    );
  }

  // 4. EKRAN PODSUMOWANIA MONTAŻU PC
  if (quizComplete && showAssemblySummary) {
    const isPerfect = assemblyScore >= 25;
    const assemblyResultMsg = isPerfect ? "DOSKONAŁY MONTAŻ!" : "MONTAŻ WYMAGA POPRAWY";

    const getAssemblyExplanation = () => {
      if (isPerfect) return "Montaż komputera zakończony sukcesem. Wszystkie podzespoły zostały poprawnie osadzone w odpowiednich slotach!";

      let explanation = "Montaż nie był idealny. Elementy, które mogły być źle zamontowane:";
      if (componentSlots.CPU === null) explanation += " CPU nie zostało włożone do gniazda.";
      else if (componentSlots.COOLER === null) explanation += " Brak chłodzenia CPU.";
      else if (componentSlots.PCIEX16 === null) explanation += " Brak karty graficznej w PCI-E x16.";
      else if (componentSlots.RAM1 === null || componentSlots.RAM2 === null || componentSlots.RAM1 === componentSlots.RAM2) explanation += " Nieprawidłowa konfiguracja RAM (brak modułów lub ten sam moduł użyty dwa razy).";

      return explanation;
    };

    return (
        <div className="p-6 min-h-screen flex items-center justify-center bg-background/95">
          <Card className="p-6 border-4 space-y-4 max-w-4xl w-full mx-auto shadow-2xl bg-card text-card-foreground overflow-y-auto animate-fade-in">
            <div className="mb-6 text-center">
              <Cpu className={`w-12 h-12 ${isPerfect ? 'text-accent' : 'text-destructive'} mx-auto mb-4 animate-bounce`} />
            <h2 className="text-lg text-foreground mb-2">PODSUMOWANIE MONTAŻU PC</h2>
            <p className={`text-xl font-bold ${isPerfect ? 'text-accent' : 'text-destructive'}`}>
              {assemblyResultMsg}
            </p>
            <p className="text-3xl font-bold text-primary mt-2">{assemblyScore} PKT</p>
          </div>

          <div className="mb-6 space-y-3">
            <Button
                onClick={toggleUsefulness}
                variant="outline"
                size="sm"
                className={`w-full border-2 ${showUsefulness ? 'border-primary/50 bg-primary/20' : 'border-border hover:border-primary/50'} text-foreground arcade-button hover:bg-primary/10 hover:text-primary-foreground h-auto py-3 whitespace-normal`}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              DO CZEGO PRZYDA MI SIĘ TA WIEDZA?
            </Button>
          </div>

          {showUsefulness && (
              <div className="mb-6 animate-slide-in-up">
                <div className="p-4 border-2 border-primary/50 bg-primary/10 text-primary-foreground">
                  <p className="text-xs leading-relaxed text-foreground/80 font-semibold">{assemblyUsefulness}</p>
                </div>
              </div>
          )}


          <div className="mb-6 animate-slide-in-up flex-grow">
            <div
                className={`p-4 border-2 ${
                    isPerfect
                        ? "border-accent bg-accent/20 text-accent"
                        : "border-destructive bg-destructive/20 text-destructive"
                }`}
            >
              <p className="text-xs mb-2 font-bold">
                {isPerfect ? "✓ WYNIK: PRAWIDŁOWO!" : "✗ WYNIK: NIEPRAWIDŁOWO"}
              </p>
              <p className="text-xs leading-relaxed">
                {getAssemblyExplanation()}
              </p>
              <p className="text-xs font-bold mt-2">
                Liczba prób: {assemblyAttempts}. Użyte podpowiedzi: {assemblyHints}.
              </p>
            </div>
          </div>

            <Button
                onClick={() => {
                  setAssemblyComplete(true);
                  setShowAssemblySummary(false);
                  setShowUsefulness(false);
                }}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 arcade-button h-12"
            >
              PRZEJDŹ DO ETAPU RJ-45
            </Button>
          </Card>
        </div>
    );
  }

  // 5. PC ASSEMBLY GAME (główny etap - jeśli quizComplete jest true, ale Assembly nie jest zakończone)
  if (quizComplete) {
    const attemptsLeft = 3 - assemblyAttempts;
    const canAttempt = assemblyAttempts < 3;
    const assemblyHintsAvailable = assemblyHintsData.length;

    return (
          <DndProvider backend={HTML5Backend}>
            <div className="p-6 min-h-screen flex items-center justify-center bg-background/95">
              <Card className="p-6 border-4 space-y-4 max-w-4xl w-full mx-auto shadow-2xl bg-card text-card-foreground overflow-y-auto animate-fade-in">
                <div className="mb-6 text-center">
                  <Cpu className="w-12 h-12 text-primary mx-auto mb-4 animate-pixel-float" />
              <h2 className="text-lg text-foreground mb-2">ETAP 2: MONTAŻ PC</h2>
              <p className="text-lg font-bold text-primary mb-2">Punkty: {totalScore}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Przeciągnij i upuść podzespoły na płytę główną.
                Pozostałe próby: {attemptsLeft > 0 ? attemptsLeft : 0}
              </p>

            </div>

            {/* Płyta Główna (Mock-up) */}
            <div className="flex justify-center h-80 mb-8 p-4 bg-gray-600 relative border-8 border-gray-800 rounded-lg">
              {/* Renderowanie wszystkich slotów */}
              {Object.keys(assemblySlots).map((slotName) => (
                  <ComponentDropZone
                      key={slotName}
                      slotName={slotName}
                      slotData={assemblySlots[slotName as keyof typeof assemblySlots] as any} // Użycie 'any' dla uproszczenia
                      componentId={componentSlots[slotName]}
                      onDrop={handleAssemblyDrop}
                      onRemove={handleRemoveComponent}
                  />
              ))}
            </div>

            {/* Dostępne Komponenty */}
            <div className="mb-6 flex-grow">
              <p className="text-xs text-muted-foreground mb-3 text-center">
                Dostępne podzespoły:
              </p>
              {/*TODO: Zrobić napis "Wykorzystałeś wszystkie podzespoły !!!!!!"*/}
              <div className="flex flex-wrap gap-3 justify-center">
                {assemblyComponents.map((component) => {
                  // Sprawdzamy, czy ten komponent jest już użyty (w dowolnym slocie)
                  const isUsed = Object.values(componentSlots).includes(component.id);

                  if (isUsed) return null;

                  return (
                      <DraggableComponent
                          key={component.id}
                          component={component}
                          currentSlot={null}
                          onRemove={handleRemoveComponent}
                      />
                  );
                })}
              </div>
            </div>

            {/* Sekcja Akcji */}
            <div className="space-y-4 animate-slide-in-up">
              {assemblyHints < assemblyHintsAvailable && canAttempt && (
                  <Button
                      onClick={showAssemblyHint}
                      variant="outline"
                      size="sm"
                      className="w-full border-2 border-secondary text-secondary hover:bg-secondary/20 hover:text-white arcade-button h-auto py-3 whitespace-normal"
                  >
                    💡 POKAŻ PODPOWIEDŹ ({assemblyHints + 1}/{assemblyHintsAvailable}) (KOSZT: 5 PKT)
                  </Button>
              )}

              {assemblyHints > 0 && (
                  <div className="space-y-2">
                    {assemblyHintsData.slice(0, assemblyHints).map((hint, index) => (
                        <div
                            key={index}
                            className="p-3 border-2 border-secondary bg-secondary/20 text-secondary animate-slide-in-up"
                        >
                          <p className="text-xs">
                            <span className="font-bold">Podpowiedź {index + 1}:</span> {hint}
                          </p>
                        </div>
                    ))}
                  </div>
              )}

              {showAssemblyResult && (
                  <div className={`p-4 border-4 mb-4 text-center ${assemblyScore >= 25 ? "border-accent bg-accent/20" : "border-destructive bg-destructive/20"}`}>
                    {assemblyScore >= 25 ? (
                        <>
                          <CheckCircle2 className="w-8 h-8 text-accent mx-auto mb-2" />
                          <h3 className="text-lg text-accent mb-1">PRAWIDŁOWO!</h3>
                          <p className="text-xs text-accent">Zaraz przejdziesz do podsumowania, aby zobaczyć wyjaśnienia.</p>
                        </>
                    ) : (
                        <>
                          <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                          <h3 className="text-lg text-destructive mb-1">BŁĄD W MONTAŻU</h3>
                          {attemptsLeft > 0 ? (
                              <p className="text-xs text-destructive">Spróbuj ponownie. Próba: {assemblyAttempts}/{3}</p>
                          ) : (
                              <p className="text-xs text-destructive font-bold">WYKORZYSTANO MAKSYMALNĄ LICZBĘ PRÓB (3). Przejdź do podsumowania, aby zobaczyć rozwiązanie.</p>
                          )}

                          <Button
                              onClick={handleAssemblyReset}
                              disabled={!canAttempt}
                              className="mt-3 w-full bg-destructive/80 text-primary-foreground hover:bg-destructive"
                          >
                            {canAttempt ? "WYCZYŚĆ I SPRÓBUJ PONOWNIE" : "ZOBACZ PODSUMOWANIE "}
                          </Button>
                        </>
                    )}
                  </div>
              )}

              <Button
                  onClick={checkAssembly}
                  disabled={!isAssemblyReady && canAttempt}
                  className={`w-full bg-primary text-primary-foreground hover:bg-primary/90 arcade-button h-12`}
              >
                {assemblyScore >= 25 ? "PRZEJDŹ DO PODSUMOWANIA " : (canAttempt ? "ZATWIERDŹ MONTAŻ" : "ZOBACZ PODSUMOWANIE ")}
              </Button>
            </div>
              </Card>
            </div>
          </DndProvider>
          );
      }

  // 6. QUIZ (główny etap - renderowany tylko, jeśli quiz nie jest zakończony)

  return (
      <div className="p-6 min-h-screen flex items-center justify-center bg-background/95">
        <Card className="p-6 border-4 space-y-4 max-w-4xl w-full mx-auto shadow-2xl bg-card text-card-foreground overflow-y-auto animate-fade-in">
          <div className="mb-6 text-center">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4 animate-pixel-float" />
          <h2 className="text-lg text-foreground mb-2">ETAP 1: QUIZ BEZPIECZEŃSTWA</h2>
          <p className="text-lg font-bold text-primary mb-2">Punkty: {totalScore}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Pytanie {currentQuestion + 1}/{securityQuestions.length}. Poprawna odpowiedź: 10 PKT.
          </p>
        </div>


        <div className="mb-6 flex-grow">
          <h3 className="text-md font-semibold mb-4 text-foreground">
            {question.question}
          </h3>
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isCorrectAnswer = index === question.correctAnswer;
              const isSelected = selectedAnswer === index;
              const showCorrect = showResult && isCorrectAnswer;
              const showWrong = showResult && isSelected && !isCorrectAnswer;
              const baseClasses = "w-full justify-start text-left arcade-button transition-all rounded-xl duration-200 cursor-pointer p-4 text-sm h-auto whitespace-normal";

              let stateClasses = "border-border bg-background text-foreground hover:border-primary hover:shadow-md hover:shadow-primary/30";

              if (showResult) {
                if (showCorrect) {
                  stateClasses = "border-accent bg-accent/20 text-accent font-bold cursor-not-allowed";
                } else if (showWrong) {
                  stateClasses = "border-destructive bg-destructive/20 text-destructive font-bold cursor-not-allowed";
                } else if (isCorrectAnswer) {
                  stateClasses = "border-accent bg-accent/10 text-accent cursor-not-allowed";
                } else {
                  stateClasses = "border-border bg-background/50 text-muted-foreground opacity-60 cursor-not-allowed";
                }
              } else if (isSelected) {
                stateClasses = "border-primary bg-primary/20 text-primary font-bold";
              } else {
                stateClasses = "border-border bg-background text-foreground hover:border-primary hover:shadow-md hover:shadow-primary/30 hover:bg-background/5 hover:text-foreground";
              }

              return (
                  <Button
                      key={index}
                      onClick={() => handleAnswerClick(index)}
                      variant="outline"
                      disabled={showResult}
                      className={`${baseClasses} ${stateClasses}`}
                  >
                    <div className="flex items-center justify-between w-full">
                    <span className="flex-grow">
                        {option}
                    </span>
                      {showCorrect && <CheckCircle2 className="w-5 h-5 ml-2" />}
                      {showWrong && <XCircle className="w-5 h-5 ml-2" />}
                    </div>
                  </Button>
              );
            })}
          </div>
        </div>

          <div className="space-y-4 animate-slide-in-up">

            {hintLevel < question.podpowiedzi.length && !showResult && (
              <Button
                  onClick={showQuizHint}
                  variant="outline"
                  size="sm"
                  className="w-full border-2 border-secondary text-secondary hover:bg-secondary/20 hover:text-white arcade-button h-auto py-3 whitespace-normal"
              >
                💡 POKAŻ PODPOWIEDŹ ({hintLevel + 1}/{question.podpowiedzi.length}) (KOSZT: 2 PKT)
              </Button>
          )}

          {hintLevel > 0 && !showResult && (
              <div className="space-y-2">
                {question.podpowiedzi.slice(0, hintLevel).map((hint, index) => (
                    <div
                        key={index}
                        className="p-3 border-2 border-secondary bg-secondary/20 text-secondary animate-slide-in-up"
                    >
                      <p className="text-xs">
                        <span className="font-bold">Podpowiedź {index + 1}:</span> {hint}
                      </p>
                    </div>
                ))}
              </div>
          )}

          {showResult && (
              <>
                <div
                    className={`p-4 border-4 mb-4 text-center ${
                        selectedAnswer === question.correctAnswer
                            ? "border-accent bg-accent/20"
                            : "border-destructive bg-destructive/20"
                    }`}
                >
                  {selectedAnswer === question.correctAnswer ? (
                      <>
                        <CheckCircle2 className="w-8 h-8 text-accent mx-auto mb-2" />
                        <h3 className="text-lg text-accent mb-1">PRAWIDŁOWO!</h3>
                        <p className="text-xs text-accent">+10 pkt za odpowiedź.</p>
                      </>
                  ) : (
                      <>
                        <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                        <h3 className="text-lg text-destructive mb-1">BŁĄD!</h3>
                        <p className="text-xs text-destructive">Wyjaśnienie: {question.explanation}</p>
                      </>
                  )}
                </div>

                {/* PRZENIESIONY PRZYCISK I WIDOK 'USEFULNESS' */}
                <Button
                    onClick={toggleUsefulness}
                    variant="outline"
                    size="sm"
                    className={`w-full border-2 ${showUsefulness ? 'border-primary/50 bg-primary/20' : 'border-border hover:border-primary/50'} text-foreground arcade-button hover:bg-primary/10 hover:text-primary-foreground h-auto py-3 whitespace-normal`}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  DO CZEGO PRZYDA MI SIĘ TA WIEDZA?
                </Button>

                {showUsefulness && (
                    <div className="p-4 border-2 border-primary/50 bg-primary/10 text-primary-foreground animate-slide-in-up">
                      <p className="text-xs leading-relaxed text-foreground/80 font-semibold">{question.usefulness}</p>
                    </div>
                )}
              </>
          )}

          {showResult && (
              <Button
                  onClick={() => {
                    if (currentQuestion < securityQuestions.length - 1) {
                      handleNext();
                    } else {
                      setQuizComplete(true);
                      setSelectedAnswer(null);
                      setShowResult(false);
                      setShowUsefulness(false);
                      setHintLevel(0);
                    }
                  }}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 arcade-button h-12 text-md tracking-wider font-bold shadow-lg shadow-primary/20"
              >
                {currentQuestion < securityQuestions.length - 1 ? "NASTĘPNE PYTANIE " : "ZACZNIJ MONTAŻ PC "}
              </Button>
          )}
          </div>
        </Card>
      </div>
  );
};

export default InformatykGame;