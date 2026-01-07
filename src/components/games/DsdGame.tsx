import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import ask_me from "@/assets/graphics/dsd/ask_me.png";
import confident from "@/assets/graphics/dsd/confident.png";
import greetings from "@/assets/graphics/dsd/chill.png";
import teacher from "@/assets/graphics/dsd/teacher.png";

// --- KOMPONENT POMOCNICZY DO PŁYNNEGO LICZNIKA ---
function AnimatedCounter({ value }: { value: number }) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}
// -------------------------------------------------

export default function DSDGame() {
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showDialog, setShowDialog] = useState(true);
  const [dialogPhase, setDialogPhase] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [currentDialogImage, setCurrentDialogImage] = useState(greetings);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [playerFinishedAt, setPlayerFinishedAt] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [displayedOptions, setDisplayedOptions] = useState<string[]>([]);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [bots, setBots] = useState<any[]>([]);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [hintText, setHintText] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [pointsAnim, setPointsAnim] = useState<number | null>(null);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isAnswerCooldown, setIsAnswerCooldown] = useState(false);

  const simulationStarted = useRef(false);

  const firstPlayDialogs = [
    "Witaj! Dzisiaj wchodzisz do świata DSD I PRO – niemieckiego, który naprawdę się przydaje w życiu.",
    "W tym quizie liczy się refleks i wiedza… ale spokojnie, to nie podręcznikowe nudy. To niemiecki z praktyki: praca, praktyki, prawdziwe sytuacje.",
    "Pytania będą dotyczyć rzeczy, które faktycznie możesz powiedzieć w firmie, na praktykach albo w mailu do pracodawcy.",
    "Masz trzy podpowiedzi od nauczycielki. Używaj ich mądrze, bo czas leci, a w pracy nikt nie zatrzyma zegara!",
    "Gotowy, żeby sprawdzić, jak dobrze ogarniasz niemiecki z życia wzięty? Startujemy!"
  ];

  const restartDialogs = [
    "Wracasz do gry? W końcu DSD I PRO to praktyka, a praktyka czyni mistrza!",
    "Tym razem pójdzie jeszcze lepiej. W końcu te zwroty to rzeczy, które naprawdę wykorzystasz w pracy i na praktykach.",
    "Pamiętaj, że szybka i poprawna odpowiedź to klucz, tak jak w prawdziwych sytuacjach zawodowych.",
    "Podpowiedzi od nauczycielki nadal masz, a język formalny i zawodowy zaraz będzie dla Ciebie bułką z masłem.",
    "No to lecimy dalej po punkty, po refleks i po niemiecki, który naprawdę jest przydatny!"
  ];

  const currentDialogs = isRestarting ? restartDialogs : firstPlayDialogs;

  const dialogImages = [
    greetings,
    confident,
    greetings,
    ask_me,
    greetings
  ];

  const fullQuestions = [
    { question: "Jak wita się nowy praktykant?", correct: "Guten Morgen. Ich bin neu hier.", wrongs: ["Guten Abend. Ich bin neu hier.", "Hallo. Ich bin alt hier.", "Guten Tag. Ich bin nicht neu."] },
    { question: "Co mówi opiekun na powitanie?", correct: "Guten Morgen. Willkommen! Wie heißt du?", wrongs: ["Guten Morgen. Auf Wiedersehen!", "Guten Tag. Wer bist du?", "Hallo. Geh weg!"] },
    { question: "Jak praktykant podaje swoje imię?", correct: "Ich heiße Tom.", wrongs: ["Ich heiße Anna.", "Mein Name ist Peter.", "Ich bin Tom."] },
    { question: "Co pyta praktykant o obowiązki?", correct: "Was muss ich heute machen?", wrongs: ["Was darf ich heute machen?", "Was kann ich heute machen?", "Was will ich heute machen?"] },
    { question: "Co musi zrobić praktykant najpierw?", correct: "Zuerst musst du mir helfen.", wrongs: ["Zuerst musst du alleine arbeiten.", "Zuerst darfst du Pause machen.", "Zuerst musst du gehen."] },
    { question: "Co praktykant może zrobić później?", correct: "Danach darfst du die Aufgaben alleine machen.", wrongs: ["Danach musst du mir helfen.", "Danach darfst du nichts machen.", "Danach musst du Pause machen."] },
    { question: "Jak praktykant reaguje na plan dnia?", correct: "Das ist gut. Vielen Dank!", wrongs: ["Das ist schlecht. Auf Wiedersehen!", "Das ist egal. Bitte.", "Das ist super. Entschuldigung."] },
    { question: "Jak brzmi pytanie o telefon?", correct: "Darf man hier das Handy benutzen?", wrongs: ["Muss man hier das Handy benutzen?", "Kann man hier das Handy benutzen?", "Soll man hier das Handy benutzen?"] },
    { question: "Czy wolno używać telefonu?", correct: "Nein, das ist nicht erlaubt.", wrongs: ["Ja, das ist erlaubt.", "Ja, nur manchmal.", "Vielleicht."] },
    { question: "Dlaczego nie wolno używać telefonu?", correct: "Aus Sicherheitsgründen.", wrongs: ["Aus Spaßgründen.", "Weil es laut ist.", "Weil es teuer ist."] },
    { question: "Co trzeba zrobić z telefonem?", correct: "Man muss das Handy ausschalten.", wrongs: ["Man darf das Handy einschalten.", "Man muss das Handy laut stellen.", "Man darf das Handy benutzen."] },
    { question: "Jak praktykant reaguje na zasadę?", correct: "Alles klar.", wrongs: ["Nicht klar.", "Super!", "Schade."] },
    { question: "Jak praktykant pyta o wykonanie zadania?", correct: "Entschuldigung, habe ich meine Aufgabe richtig gemacht?", wrongs: ["Entschuldigung, habe ich meine Aufgabe falsch gemacht?", "Entschuldigung, muss ich die Aufgabe machen?", "Entschuldigung, darf ich Pause machen?"] },
    { question: "Co mówi opiekun o wykonaniu zadania?", correct: "Ja, das hast du gut gemacht.", wrongs: ["Nein, das hast du schlecht gemacht.", "Ja, mach es nochmal.", "Nein, das ist falsch."] },
    { question: "Co praktykant pyta o kolejne zadanie?", correct: "Soll ich jetzt etwas anderes machen?", wrongs: ["Muss ich jetzt etwas anderes machen?", "Darf ich jetzt etwas anderes machen?", "Kann ich jetzt etwas anderes machen?"] },
    { question: "Jakie jest kolejne zadanie?", correct: "Ja, bitte sortiere diese Unterlagen.", wrongs: ["Ja, bitte lies diese Unterlagen.", "Ja, bitte schreibe diese Unterlagen.", "Ja, bitte kopiere diese Unterlagen."] },
    { question: "Jak praktykant reaguje na nowe zadanie?", correct: "Gerne.", wrongs: ["Nicht gerne.", "Nein, danke.", "Vielleicht."] },
    { question: "Jak praktykant prosi o pomoc?", correct: "Kannst du mir bitte helfen?", wrongs: ["Musst du mir helfen?", "Darfst du mir helfen?", "Willst du mir helfen?"] },
    { question: "Jak kolega odpowiada na prośbę?", correct: "Ja, kein Problem.", wrongs: ["Nein, das ist ein Problem.", "Ja, aber später.", "Nein, keine Zeit."] },
    { question: "Dlaczego praktykant potrzebuje pomocy?", correct: "Ich verstehe diese Aufgabe nicht.", wrongs: ["Ich verstehe diese Aufgabe gut.", "Ich mag diese Aufgabe nicht.", "Diese Aufgabe ist zu leicht."] },
    { question: "Co proponuje kolega?", correct: "Wir machen das zusammen.", wrongs: ["Du machst das alleine.", "Ich mache das alleine.", "Wir machen das getrennt."] },
    { question: "Jak praktykant dziękuje za pomoc?", correct: "Danke, das ist sehr nett.", wrongs: ["Danke, das ist nicht nett.", "Bitte, das ist nett.", "Entschuldigung, das ist nett."] },
    { question: "Jakie pytanie pada o zawód?", correct: "Was möchtest du später machen?", wrongs: ["Was machst du jetzt?", "Was musst du machen?", "Was darfst du machen?"] },
    { question: "Co ktoś chce robić w przyszłości?", correct: "Ich möchte eine Ausbildung machen.", wrongs: ["Ich möchte studieren.", "Ich möchte sofort arbeiten.", "Ich möchte reisen."] },
    { question: "W jakim obszarze chce się kształcić?", correct: "Im technischen Bereich.", wrongs: ["Im kaufmännischen Bereich.", "Im medizinischen Bereich.", "Im kreativen Bereich."] },
    { question: "Dlaczego ten obszar jest dobry?", correct: "Das ist interessant.", wrongs: ["Das ist langweilig.", "Das ist teuer.", "Das ist einfach."] },
    { question: "Jak rozmówca reaguje na wybór?", correct: "Ja, das finde ich auch.", wrongs: ["Nein, das finde ich nicht.", "Vielleicht.", "Schade."] },
    { question: "Jaki problem zgłasza praktykant?", correct: "Ich habe ein Problem mit dem Computer.", wrongs: ["Ich habe ein Problem mit dem Handy.", "Ich habe ein Problem mit der Aufgabe.", "Ich habe ein Problem mit dem Kollegen."] },
    { question: "Co pyta opiekun o problem?", correct: "Was ist passiert?", wrongs: ["Wer ist passiert?", "Wo ist passiert?", "Warum ist passiert?"] },
    { question: "Co się dzieje z komputerem?", correct: "Er funktioniert nicht richtig.", wrongs: ["Er funktioniert sehr gut.", "Er ist neu.", "Er ist schnell."] },
    { question: "Co radzi opiekun zrobić?", correct: "Dann melde das bitte dem Kollegen.", wrongs: ["Dann melde das dem Chef.", "Dann melde das mir.", "Dann melde das der Firma."] },
    { question: "Jak praktykant reaguje na radę?", correct: "In Ordnung, danke.", wrongs: ["Nicht in Ordnung.", "Nein, danke.", "Vielleicht."] },
    { question: "Co ktoś właśnie pisze?", correct: "Eine E-Mail an die Firma.", wrongs: ["Einen Brief an die Firma.", "Eine SMS an die Firma.", "Einen Anruf an die Firma."] },
    { question: "Jakie pytanie pada o treść?", correct: "Worum geht es?", wrongs: ["Wer schreibt es?", "Wo geht es?", "Warum geht es?"] },
    { question: "O co pyta w e-mailu?", correct: "Ich frage nach einem Praktikum.", wrongs: ["Ich frage nach einem Job.", "Ich frage nach Geld.", "Ich frage nach Urlaub."] },
    { question: "Jak rozmówca ocenia pomysł?", correct: "Das ist eine gute Idee.", wrongs: ["Das ist eine schlechte Idee.", "Das ist egal.", "Das ist teuer."] }
  ];

  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (gameStarted && questions.length === 0) {
      const shuffled = [...fullQuestions].sort(() => 0.5 - Math.random());
      setQuestions(shuffled.slice(0, 15));
    }
  }, [gameStarted]);

  const optionColors = {
    A: 'bg-blue-200 hover:bg-blue-300',
    B: 'bg-green-200 hover:bg-green-300',
    C: 'bg-yellow-200 hover:bg-yellow-300',
    D: 'bg-red-200 hover:bg-red-300'
  };

  const levels = [
    "A1 Początkujący",
    "A2 Odkrywca",
    "B1 Średniozaawansowany",
    "B1 Legenda",
    "B2 Zaawansowany",
    "C1 Ekspert",
    "C2 Mistrz",
    "Rodowity Mówca",
    "Nowicjusz",
    "Profesjonalista"
  ];

  const levelLogics = {
    "A1 Początkujący": 'dumb',
    "A2 Odkrywca": 'average',
    "B1 Średniozaawansowany": 'average',
    "B1 Legenda": 'smart',
    "B2 Zaawansowany": 'average',
    "C1 Ekspert": 'smart',
    "C2 Mistrz": 'average',
    "Rodowity Mówca": 'perfect',
    "Nowicjusz": 'dumb',
    "Profesjonalista": 'smart'
  };

  const restartGame = () => {
    setIsRestarting(true);
    setGameStarted(false);
    setShowDialog(true);
    setDialogPhase(0);
    setDisplayText("");
    setTypingIndex(0);
    setIsTyping(true);
    setCurrentQuestionIndex(0);
    setPlayerScore(0);
    setPlayerFinishedAt(null);
    setShowResult(false);
    setShowCountdown(false);
    setCountdownNumber(3);
    setBots([]);
    setHintsLeft(3);
    setTimeLeft(30);
    setPointsAnim(null);
    setQuestions([]);
    setIsAnswerCooldown(false);
    simulationStarted.current = false;
  };

  const preventCopy = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Detekcja mobile + orientacji
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      const portrait = window.innerHeight > window.innerWidth;
      setIsMobile(mobile);
      setIsPortrait(portrait);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  // Typing effect
  useEffect(() => {
    if (isTyping && typingIndex < currentDialogs[dialogPhase].length) {
      const timeout = setTimeout(() => {
        const nextChar = currentDialogs[dialogPhase][typingIndex];
        setDisplayText(prevText => prevText + nextChar);
        setTypingIndex(prevIdx => prevIdx + 1);
      }, 20);
      return () => clearTimeout(timeout);
    } else if (typingIndex === currentDialogs[dialogPhase].length) {
      setIsTyping(false);
    }
  }, [typingIndex, isTyping, dialogPhase, currentDialogs]);

  useEffect(() => {
    setCurrentDialogImage(dialogImages[dialogPhase]);
    if (dialogPhase === 0) setCurrentDialogImage(greetings);
  }, [dialogPhase]);

  // Boty
  useEffect(() => {
    if (gameStarted && bots.length === 0) {
      const newBots = levels.map((level, index) => ({
        name: level,
        score: 0,
        answered: 0,
        finishedAt: null,
        logic: levelLogics[level as keyof typeof levelLogics],
        speedGroup: index < 5 ? 'fast' : 'slow'
      }));
      setBots(newBots);
    }
  }, [gameStarted]);

  // Timer pytania
  useEffect(() => {
    if (gameStarted && !showResult && currentQuestionIndex < questions.length && !isAnswerCooldown) {
      setTimeLeft(30);

      const timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);

            if (currentQuestionIndex < questions.length - 1) {
              setCurrentQuestionIndex((i) => i + 1);
            } else {
              setPlayerFinishedAt(Date.now());
              setShowResult(true);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [currentQuestionIndex, gameStarted, showResult, questions.length, isAnswerCooldown]);

  // Symulacja botów
  useEffect(() => {
    if (gameStarted && bots.length > 0 && !simulationStarted.current) {
      simulationStarted.current = true;

      bots.forEach((bot) => {
        let currentQuestion = 0;

        const answerNext = () => {
          if (currentQuestion >= questions.length) return;

          let isCorrect = false;
          if (bot.logic === 'perfect') isCorrect = true;
          else if (bot.logic === 'smart') isCorrect = Math.random() < 0.8;
          else if (bot.logic === 'average') isCorrect = Math.random() < 0.5;
          else if (bot.logic === 'dumb') isCorrect = Math.random() < 0.2;

          let minTime = 2;
          let maxTime = 28;
          if (bot.logic === 'perfect' || bot.logic === 'smart') minTime = 8;
          else if (bot.logic === 'average') minTime = 5;

          const assumedTimeLeft = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
          const points = isCorrect ? assumedTimeLeft * 100 : 0;

          setBots((prev) =>
            prev.map((b) => {
              if (b.name === bot.name) {
                const newAnswered = b.answered + 1;
                const finishedTime = newAnswered === questions.length ? Date.now() : b.finishedAt;
                return { ...b, score: b.score + points, answered: newAnswered, finishedAt: finishedTime };
              }
              return b;
            })
          );

          currentQuestion++;

          const baseDelay = bot.speedGroup === 'fast' ? 2000 : 4000;
          const randomExtra = Math.random() * 2000 + 1000;
          const nextDelay = baseDelay + randomExtra;

          setTimeout(answerNext, nextDelay);
        };

        const startDelay = Math.random() * 2000 + 1000;
        setTimeout(answerNext, startDelay);
      });
    }
  }, [gameStarted, bots, questions.length]);

  // Losowanie odpowiedzi
  useEffect(() => {
    if (gameStarted && questions.length > 0) {
      const q = questions[currentQuestionIndex];
      const allAnswers = [q.correct, ...q.wrongs];
      allAnswers.sort(() => Math.random() - 0.5);
      setDisplayedOptions(allAnswers);
    }
  }, [currentQuestionIndex, gameStarted, questions]);

  // Klawiatura
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyUpper = e.key.toUpperCase();

      if (showDialog) {
        if (!isMobile && keyUpper === ' ') handleSkipOrNext();
      } else if (gameStarted && !showResult && !showCountdown && !showHintDialog && !isAnswerCooldown) {
        let ans;
        if (keyUpper === 'A') ans = 'A';
        else if (keyUpper === 'B') ans = 'B';
        else if (keyUpper === 'C') ans = 'C';
        else if (keyUpper === 'D') ans = 'D';
        if (ans) handleAnswer(ans);
        else if (keyUpper === 'H') handleHint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, dialogPhase, showDialog, gameStarted, showResult, currentQuestionIndex, showCountdown, showHintDialog, isAnswerCooldown, isMobile]);

  const handleSkipOrNext = () => {
    if (isTyping) {
      setDisplayText(currentDialogs[dialogPhase]);
      setTypingIndex(currentDialogs[dialogPhase].length);
      setIsTyping(false);
    } else {
      if (dialogPhase < currentDialogs.length - 1) {
        setDialogPhase(prev => prev + 1);
        setDisplayText("");
        setTypingIndex(0);
        setIsTyping(true);
      } else {
        setShowDialog(false);
        setShowCountdown(true);
      }
    }
  };

  // Countdown
  useEffect(() => {
    if (showCountdown && countdownNumber > 0) {
      const timer = setTimeout(() => setCountdownNumber(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdownNumber === 0) {
      setTimeout(() => {
        setShowCountdown(false);
        setGameStarted(true);
      }, 1000);
    }
  }, [showCountdown, countdownNumber]);

  const handleAnswer = (letter: string) => {
    if (isAnswerCooldown) return;

    const assignedText = displayedOptions[['A', 'B', 'C', 'D'].indexOf(letter)];
    const correct = questions[currentQuestionIndex].correct;
    const isCorrect = assignedText === correct;
    const points = isCorrect ? timeLeft * 100 : 0;

    if (isCorrect) {
      setPlayerScore(prev => prev + points);
      setPointsAnim(points);
      setTimeout(() => {
        setPointsAnim(null);
      }, 1000);
    }

    setIsAnswerCooldown(true);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeout(() => {
        setIsAnswerCooldown(false);
      }, 2000);
    } else {
      setTimeout(() => {
        setPlayerFinishedAt(Date.now());
        setShowResult(true);
        setIsAnswerCooldown(false);
      }, 2000);
    }
  };

  const handleHint = () => {
    if (hintsLeft > 0) {
      setHintsLeft(prev => prev - 1);
      const correctLetter = ['A', 'B', 'C', 'D'].find(l => displayedOptions[['A', 'B', 'C', 'D'].indexOf(l)] === questions[currentQuestionIndex].correct);
      setHintText(`Sądzę, że poprawną odpowiedzią będzie ${correctLetter}.`);
      setShowHintDialog(true);
      setTimeout(() => setShowHintDialog(false), 3500);
    }
  };

  const sortParticipants = (a: any, b: any) => {
    if (b.score !== a.score) return b.score - a.score;
    const timeA = a.finishedAt || Infinity;
    const timeB = b.finishedAt || Infinity;
    return timeA - timeB;
  };

  const allParticipants = [...bots, { name: 'Ty', score: playerScore, answered: questions.length, finishedAt: playerFinishedAt }]
    .sort(sortParticipants);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-slate-950 font-sans text-slate-50">
      <Card className="h-screen w-full fixed top-0 left-0 bg-slate-900 overflow-hidden flex flex-col">

        <div className="relative flex-1 flex flex-col items-center justify-center">

          {/* TABLICA Z TREŚCIĄ */}
          <div className="relative w-full h-full bg-gradient-to-b from-gray-200 to-gray-300 rounded-none border-0 shadow-none p-4 md:p-8 flex flex-col items-center justify-start overflow-hidden">

            {showCountdown ? (
              <motion.div
                key={countdownNumber}
                initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                animate={{ scale: 2, opacity: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring" }}
                className="text-8xl md:text-9xl font-extrabold drop-shadow-2xl flex items-center justify-center w-full h-full text-blue-500 select-none"
              >
                {countdownNumber > 0 ? countdownNumber : 'Start!'}
              </motion.div>
            ) : gameStarted && !showDialog ? (
              showResult ? (
                <div className="w-full h-full flex flex-col items-center justify-start gap-6 py-8 px-4">
                  <div className="text-black text-3xl md:text-5xl font-bold text-center">
                    Twój wynik: <AnimatedCounter value={playerScore} /> pkt
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <Button onClick={restartGame} className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-5 rounded-xl shadow-lg flex-1">
                      Powtórz grę
                    </Button>
                    <Button onClick={() => window.location.href = '/'} className="bg-purple-500 hover:bg-purple-600 text-white text-lg px-8 py-5 rounded-xl shadow-lg flex-1">
                      Inne gry
                    </Button>
                  </div>

                  <div className="text-black text-2xl md:text-3xl font-bold mt-6">Ranking</div>

                  {/* Scrollowalny ranking */}
                  <div className="w-full max-w-2xl max-h-96 overflow-y-auto px-2 space-y-3">
                    <AnimatePresence>
                      {allParticipants.map((entry, index) => (
                        <motion.div
                          key={entry.name}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`
                            w-full px-5 py-4 rounded-xl shadow-md text-black font-semibold flex items-center justify-between
                            ${index === 0 ? 'bg-yellow-300 text-2xl' : index === 1 ? 'bg-gray-300' : index === 2 ? 'bg-orange-300' : 'bg-white/90'}
                          `}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold">{index + 1}.</span>
                            <span className="truncate max-w-40">{entry.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold"><AnimatedCounter value={entry.score} /> pkt</div>
                            {entry.answered < questions.length && <div className="text-sm text-orange-600 italic">odpowiada...</div>}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col justify-between select-none relative">

                  {/* Prawy górny przycisk podpowiedzi */}
                  <div className="absolute top-4 right-4 z-50">
                    <Button
                      onClick={handleHint}
                      disabled={hintsLeft === 0 || isAnswerCooldown}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-4 rounded-full text-2xl font-bold shadow-2xl disabled:opacity-50"
                    >
                      💡 {hintsLeft}
                    </Button>
                  </div>

                  {/* GÓRA: pytanie + info */}
                  <div className="flex flex-col items-center gap-4 mt-8">
                    <div className="text-black text-lg md:text-xl font-bold text-center">
                      Pytanie {currentQuestionIndex + 1}/{questions.length} | Twój wynik: <AnimatedCounter value={playerScore} />
                    </div>
                    <div className={`text-3xl md:text-4xl font-extrabold ${timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-black'}`}>
                      Czas: {timeLeft}s
                    </div>
                  </div>

                  {/* PYTANIE */}
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-black text-xl md:text-4xl font-bold text-center px-4 leading-tight break-words hyphens-auto"
                  >
                    {questions[currentQuestionIndex]?.question}
                  </motion.div>

                  {/* ODPOWIEDZI – większe kafelki + auto-skalowanie tekstu */}
                  <div className="w-full px-4 grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 mb-12">
                    {['A', 'B', 'C', 'D'].map((letter, idx) => (
                      <Button
                        key={letter}
                        onClick={() => handleAnswer(letter)}
                        disabled={isAnswerCooldown}
                        className={`
                          ${optionColors[letter as keyof typeof optionColors]}
                          text-black font-bold
                          p-10 md:p-12 rounded-3xl shadow-2xl
                          flex flex-col items-center justify-center
                          text-center whitespace-normal break-words leading-tight
                          min-h-48 md:min-h-56
                          ${isAnswerCooldown ? 'opacity-50' : 'hover:scale-105 transition-transform'}
                        `}
                        onMouseDown={preventCopy}
                        onContextMenu={preventCopy}
                      >
                        <span className="text-5xl md:text-6xl mb-6 font-extrabold">{letter}</span>
                        <span className="text-2xl md:text-3xl lg:text-4xl leading-snug clamp-text">
                          {displayedOptions[idx]}
                        </span>
                      </Button>
                    ))}
                  </div>

                  {/* Animacja punktów */}
                  <AnimatePresence>
                    {pointsAnim !== null && (
                      <motion.div
                        initial={{ y: 0, opacity: 1, scale: 1 }}
                        animate={{ y: -120, opacity: 0, scale: 1.8 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <span className="text-6xl font-extrabold text-green-600 drop-shadow-2xl">
                          +{pointsAnim}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            ) : null}
          </div>
        </div>

        {/* PODPOWIEDŹ – z nauczycielką i formalnym tekstem */}
        <AnimatePresence>
          {showHintDialog && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center px-6 pointer-events-none"
            >
              <div className="pointer-events-auto w-full max-w-2xl relative rounded-3xl p-8 shadow-2xl bg-white/90 backdrop-blur-xl border border-white/40">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
                <div className="relative flex gap-6 items-center">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-300/40 to-purple-300/40 blur-xl" />
                    <img src={teacher} alt="Nauczycielka" className="relative w-28 h-28 object-contain rounded-2xl border-2 border-white/50 shadow-xl" />
                  </div>
                  <div className="text-slate-900 text-2xl leading-relaxed font-bold drop-shadow-sm">
                    {hintText}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DIALOG POCZĄTKOWY – wyśrodkowany */}
        <AnimatePresence>
          {showDialog && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center px-6 pointer-events-none"
            >
              <div
                onClick={handleSkipOrNext}
                className="pointer-events-auto w-full max-w-2xl relative rounded-3xl p-8 shadow-2xl bg-white/90 backdrop-blur-xl border border-white/40 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
                <div className="relative flex gap-6 items-center">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-300/40 to-purple-300/40 blur-xl" />
                    <img src={currentDialogImage} alt="Nauczycielka" className="relative w-28 h-28 object-contain rounded-2xl border-2 border-white/50 shadow-xl" />
                  </div>
                  <div className="flex-1 text-slate-900 text-2xl leading-relaxed font-bold drop-shadow-sm">
                    {displayText}
                    {isTyping && <span className="animate-pulse">|</span>}
                    {!isMobile && (
                      <div className="mt-4 text-lg text-slate-600 font-bold">
                        {isTyping ? "Kliknij lub naciśnij spację, aby pominąć..." : "Kliknij lub naciśnij spację, aby kontynuować..."}
                      </div>
                    )}
                    {isMobile && (
                      <div className="mt-4 text-lg text-slate-600 font-bold">
                        Dotknij, aby kontynuować...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}