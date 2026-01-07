import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import teacher0 from "@/assets/graphics/dsd/teacher0.png";
import teacher1 from "@/assets/graphics/dsd/teacher1.png";
import teacher2 from "@/assets/graphics/dsd/teacher2.png";
import teacher3 from "@/assets/graphics/dsd/teacher3.png";
import teacher4 from "@/assets/graphics/dsd/teacher4.png";
import teacher5 from "@/assets/graphics/dsd/teacher5.png";
import teacher6 from "@/assets/graphics/dsd/teacher6.png";
import teacher7 from "@/assets/graphics/dsd/teacher7.png";

import ask_me from "@/assets/graphics/dsd/ask_me.png";
import confident from "@/assets/graphics/dsd/confident.png";
import surprised from "@/assets/graphics/dsd/surprised.png";
import showing from "@/assets/graphics/dsd/showing.png";
import annoyed from "@/assets/graphics/dsd/annoyed.png";
import greetings from "@/assets/graphics/dsd/chill.png";
import thinking from "@/assets/graphics/dsd/thinking.png";

// --- KOMPONENT POMOCNICZY DO PŁYNNEGO LICZNIKA ---
function AnimatedCounter({ value }) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}
// -------------------------------------------------

export default function DSDGame() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [currentTeacher, setCurrentTeacher] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showDialog, setShowDialog] = useState(true);
  const [dialogPhase, setDialogPhase] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [currentDialogImage, setCurrentDialogImage] = useState(greetings);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [playerFinishedAt, setPlayerFinishedAt] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [displayedOptions, setDisplayedOptions] = useState([]);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [bots, setBots] = useState([]);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [hintText, setHintText] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [pointsAnim, setPointsAnim] = useState(null);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isAnswerCooldown, setIsAnswerCooldown] = useState(false); // Cooldown po odpowiedzi

  const simulationStarted = useRef(false);

  const teachers = [teacher0, teacher1, teacher2, teacher3, teacher4, teacher5, teacher6, teacher7];

  const firstPlayDialogs = [
    "Witaj! Dzisiaj wchodzisz do świata DSD I PRO – niemieckiego, który naprawdę się przydaje w życiu.",
    "W tym quizie liczy się refleks i wiedza… ale spokojnie, to nie podręcznikowe nudy. To niemiecki z praktyki: praca, praktyki, prawdziwe sytuacje.",
    "Pytania będą dotyczyć rzeczy, które faktycznie możesz powiedzieć w firmie, na praktykach albo w mailu do pracodawcy.",
    "Masz trzy podpowiedzi ode mnie. Używaj ich mądrze, bo czas leci, a w pracy nikt nie zatrzyma zegara!",
    "Gotowy, żeby sprawdzić, jak dobrze ogarniasz niemiecki z życia wzięty? Startujemy!"
  ];

  const restartDialogs = [
    "Wracasz do gry? W końcu DSD I PRO to praktyka, a praktyka czyni mistrza!",
    "Tym razem pójdzie jeszcze lepiej. W końcu te zwroty to rzeczy, które naprawdę wykorzystasz w pracy i na praktykach.",
    "Pamiętaj, że szybka i poprawna odpowiedź to klucz, tak jak w prawdziwych sytuacjach zawodowych.",
    "Podpowiedzi nadal masz, a język formalny i zawodowy zaraz będzie dla Ciebie bułką z masłem.",
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

  const [questions, setQuestions] = useState([]);

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

  // Polskie nazwy botów
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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  useEffect(() => {
    if (showDialog) {
      const initial = Math.random() > 0.5 ? 4 : 5;
      setCurrentTeacher(initial);
      const interval = setInterval(() => {
        setCurrentTeacher(6);
        setTimeout(() => setCurrentTeacher(Math.random() > 0.5 ? 4 : 5), 3000);
      }, 15000);
      return () => clearInterval(interval);
    } else if (gameStarted) {
      setCurrentTeacher(0);
    }
  }, [showDialog, gameStarted]);

  useEffect(() => {
    if (showResult) setCurrentTeacher(7);
  }, [showResult]);

  useEffect(() => {
    if (gameStarted && bots.length === 0) {
      const newBots = levels.map((level, index) => ({
        name: level,
        score: 0,
        answered: 0,
        finishedAt: null,
        logic: levelLogics[level],
        speedGroup: index < 5 ? 'fast' : 'slow'
      }));
      setBots(newBots);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (gameStarted && !showResult && currentQuestionIndex < questions.length && !isAnswerCooldown) {
      setTimeLeft(30);

      const timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            setCurrentTeacher((t) => Math.max(0, t - 1));

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

  useEffect(() => {
    if (gameStarted && questions.length > 0) {
      const q = questions[currentQuestionIndex];
      const allAnswers = [q.correct, ...q.wrongs];
      allAnswers.sort(() => Math.random() - 0.5);
      setDisplayedOptions(allAnswers);
    }
  }, [currentQuestionIndex, gameStarted, questions]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const keyUpper = e.key.toUpperCase();
      if (showDialog) {
        if (keyUpper === ' ') handleSkipOrNext();
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
  }, [isTyping, dialogPhase, showDialog, gameStarted, showResult, currentQuestionIndex, showCountdown, showHintDialog, isAnswerCooldown]);

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

  const handleAnswer = (letter) => {
    if (isAnswerCooldown) return;

    const assignedText = displayedOptions[['A', 'B', 'C', 'D'].indexOf(letter)];
    const correct = questions[currentQuestionIndex].correct;
    const isCorrect = assignedText === correct;
    const points = isCorrect ? timeLeft * 100 : 0;

    if (isCorrect) {
      setPlayerScore(prev => prev + points);
      setPointsAnim(points);
      setCurrentTeacher(prev => Math.min(3, prev + 1));
      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
        setPointsAnim(null);
      }, 1000);
    } else {
      setCurrentTeacher(prev => Math.max(0, prev - 1));
    }

    setIsAnswerCooldown(true);

    if (currentQuestionIndex < questions.length - 1) {
      // Natychmiast nowe pytanie
      setCurrentQuestionIndex(prev => prev + 1);
      // Cooldown 2s na odpowiedzi na nowym pytaniu
      setTimeout(() => {
        setIsAnswerCooldown(false);
      }, 2000);
    } else {
      // Dla ostatniego pytania – po 2s wynik
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
      setHintText(`Mhhhhhhhhm myślę że... ${correctLetter}`);
      setShowHintDialog(true);
      setCurrentDialogImage(thinking);
      setTimeout(() => setShowHintDialog(false), 3000);
    }
  };

  const sortParticipants = (a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const timeA = a.finishedAt || Infinity;
    const timeB = b.finishedAt || Infinity;
    return timeA - timeB;
  };

  const allParticipants = [...bots, { name: 'Ty', score: playerScore, answered: questions.length, finishedAt: playerFinishedAt }]
    .sort(sortParticipants);

  return (
    <div className="relative w-full min-h-[80vh] overflow-hidden bg-slate-950 font-sans text-slate-50">
      <Card className="h-screen w-full fixed top-0 left-0 bg-slate-900 overflow-hidden">
        <div className="relative h-full w-full flex items-center justify-center">
          <div className="w-[80%] md:w-[70%] h-[80%] ml-64 md:ml-96 bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg border-4 border-gray-400 shadow-2xl p-8 flex flex-col items-center justify-start relative overflow-hidden">
            {showCountdown ? (
              <motion.div
                key={countdownNumber}
                initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                animate={{ scale: 2, opacity: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring" }}
                className="text-9xl font-extrabold drop-shadow-2xl flex items-center justify-center w-full h-full text-blue-500 select-none"
              >
                {countdownNumber > 0 ? countdownNumber : 'Start!'}
              </motion.div>
            ) : gameStarted && !showDialog ? (
              showResult ? (
                <div className="w-full h-full flex flex-col items-center justify-start gap-8 py-8 px-4 overflow-hidden">
                  <div className="text-black text-4xl md:text-5xl font-bold text-center">
                    Twój wynik: <AnimatedCounter value={playerScore} /> pkt
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    <Button
                      onClick={restartGame}
                      className="bg-green-500 hover:bg-green-600 text-white text-xl px-10 py-6 rounded-xl shadow-lg"
                    >
                      Powtórz grę
                    </Button>

                    <Button
                      onClick={() => window.location.href = '/'}
                      className="bg-purple-500 hover:bg-purple-600 text-white text-xl px-10 py-6 rounded-xl shadow-lg"
                    >
                      Inne gry
                    </Button>
                  </div>

                  <div className="text-black text-3xl font-bold">
                    Ranking
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
                    <AnimatePresence>
                      {allParticipants.map((entry, index) => (
                        <motion.div
                          key={entry.name}
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                          className={`flex items-center justify-between px-6 py-4 rounded-lg shadow-md text-black font-semibold ${
                            index === 0 ? 'bg-yellow-200 text-2xl' :
                            index === 1 ? 'bg-gray-200 text-xl' :
                            index === 2 ? 'bg-orange-200 text-xl' :
                            'bg-white/80'
                          }`}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <span className="text-2xl font-bold flex-shrink-0">
                              {index + 1}.
                            </span>
                            <span className="truncate">{entry.name}</span>
                          </div>

                          <div className="flex items-center gap-4 flex-shrink-0">
                            <span className="text-xl font-bold">
                              <AnimatedCounter value={entry.score} /> pkt
                            </span>

                            <AnimatePresence mode="wait">
                              {entry.answered < questions.length && (
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                                  className="text-orange-600 italic"
                                >
                                  (odpowiada...)
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-between space-y-8 py-4 relative select-none">
                  {hintsLeft > 0 && (
                    <Button
                      onClick={handleHint}
                      className="absolute top-4 right-4 bg-yellow-400 text-black w-12 h-12 rounded-full flex items-center justify-center"
                    >
                      💡
                    </Button>
                  )}

                  <div className="text-black text-xl font-bold flex flex-col items-center gap-4">
                    <div>
                      Pytanie {currentQuestionIndex + 1}/{questions.length} | Twój wynik: <AnimatedCounter value={playerScore} />
                    </div>
                    <div className={`text-4xl font-extrabold ${timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-black'}`}>
                      Czas: {timeLeft}s
                    </div>
                  </div>

                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-black text-2xl md:text-4xl font-bold text-center select-none"
                    onMouseDown={preventCopy}
                    onContextMenu={preventCopy}
                  >
                    {questions[currentQuestionIndex]?.question}
                  </motion.div>

                  <motion.div
                    key={`options-${currentQuestionIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-2 gap-6 w-full max-w-4xl flex-1 mt-8 items-stretch relative select-none"
                  >
                    {['A', 'B', 'C', 'D'].map((letter, idx) => (
                      <Button
                        key={letter}
                        onClick={() => handleAnswer(letter)}
                        disabled={isAnswerCooldown}
                        className={`${optionColors[letter]} text-black text-lg md:text-2xl font-bold p-6 rounded-xl shadow-md flex flex-col items-center justify-center h-full text-center !whitespace-normal break-words ${isAnswerCooldown ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onMouseDown={preventCopy}
                        onContextMenu={preventCopy}
                      >
                        <span className="text-2xl md:text-3xl mb-2">{letter}</span>
                        <span className="text-base md:text-lg leading-tight">{displayedOptions[idx]}</span>
                      </Button>
                    ))}

                    <AnimatePresence>
                      {pointsAnim !== null && (
                        <motion.div
                          initial={{ y: 0, opacity: 1, scale: 1 }}
                          animate={{ y: -100, opacity: 0, scale: 1.5 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                          <span className="text-6xl font-extrabold text-green-600 drop-shadow-lg">
                            +{pointsAnim}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )
            ) : null}
          </div>

          <motion.div
            className={`absolute bottom-0 ${showResult ? '-left-20' : 'left-0'} z-0 pointer-events-none`}
            animate={isJumping ? { y: [-10, 0] } : {}}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <img
              src={teachers[currentTeacher]}
              alt="Nauczycielka"
              className="w-96 md:w-[800px] h-auto object-contain pointer-events-none"
            />
          </motion.div>
        </div>

        <AnimatePresence>
          {showHintDialog && (
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 120, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed bottom-0 left-0 w-full px-6 pb-8 z-[100] pointer-events-none"
            >
              <div className="pointer-events-auto w-full max-w-6xl mx-auto relative rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] bg-white/80 backdrop-blur-2xl border border-white/40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
                <div className="relative flex gap-6 items-start">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-300/40 to-purple-300/40 blur-xl" />
                    <img src={thinking} alt="Thinking" className="relative w-24 h-24 md:w-32 md:h-32 object-contain rounded-2xl border-2 border-white/50 shadow-xl" />
                  </div>
                  <div className="flex-1 text-slate-900 text-lg md:text-2xl leading-relaxed font-semibold drop-shadow-sm">
                    {hintText}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDialog && (
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 120, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed bottom-0 left-0 w-full px-6 pb-8 z-[100] pointer-events-none"
            >
              <div
                onClick={handleSkipOrNext}
                className="pointer-events-auto w-full max-w-6xl mx-auto relative rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] bg-white/80 backdrop-blur-2xl border border-white/40 overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
                <div className="relative flex gap-6 items-start">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-300/40 to-purple-300/40 blur-xl" />
                    <img src={currentDialogImage} alt="Dialog avatar" className="relative w-24 h-24 md:w-32 md:h-32 object-contain rounded-2xl border-2 border-white/50 shadow-xl" />
                  </div>
                  <div className="flex-1 text-slate-900 text-lg md:text-2xl leading-relaxed font-semibold drop-shadow-sm">
                    {displayText}
                    {isTyping && <span className="animate-pulse">|</span>}
                    <div className="mt-3 text-sm text-slate-600 font-bold">
                      {isTyping ? "Naciśnij spację lub kliknij, aby pominąć..." : dialogPhase < currentDialogs.length - 1 ? "Naciśnij spację lub kliknij, aby kontynuować..." : "Naciśnij spację lub kliknij, aby rozpocząć..."}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {isMobile && (
        <div className="fixed bottom-0 left-0 w-full bg-slate-950/95 p-4 flex justify-center space-x-2 z-[100]">
          {gameStarted && !showDialog && !showResult ? (
            <>
              <Button onClick={() => handleAnswer('A')} disabled={isAnswerCooldown} className="bg-blue-500">A</Button>
              <Button onClick={() => handleAnswer('B')} disabled={isAnswerCooldown} className="bg-blue-500">B</Button>
              <Button onClick={() => handleAnswer('C')} disabled={isAnswerCooldown} className="bg-blue-500">C</Button>
              <Button onClick={() => handleAnswer('D')} disabled={isAnswerCooldown} className="bg-blue-500">D</Button>
              {hintsLeft > 0 && <Button onClick={handleHint} className="bg-yellow-400 text-black">💡</Button>}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}