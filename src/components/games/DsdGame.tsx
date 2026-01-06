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
  const [playerFinishedAt, setPlayerFinishedAt] = useState(null); // NOWE: Czas zakończenia gracza
  const [showResult, setShowResult] = useState(false);
  const [displayedOptions, setDisplayedOptions] = useState([]);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [bots, setBots] = useState([]);
  const [hintsLeft, setHintsLeft] = useState(1);
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [hintText, setHintText] = useState("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [pointsAnim, setPointsAnim] = useState(null);
  const [finalDialogType, setFinalDialogType] = useState(null);
  const [waitingForOthers, setWaitingForOthers] = useState(false);

  const simulationStarted = useRef(false);

  const teachers = [teacher0, teacher1, teacher2, teacher3, teacher4, teacher5, teacher6, teacher7];

  const dialogTexts = [
    "Witaj! Dzisiaj masz konkurencję. Zmierzysz się z innymi uczniami w kilkuminutowym quizie DSD!",
    "Zasady są takie, że liczy się nie tylko wiedza, ale i refleks. Im szybciej odpowiesz, tym więcej punktów zgarnisz!",
    "Pamiętaj, że za błędną odpowiedź dostajesz okrągłe zero, więc nie daj się zwieść prędkości.",
    "Raz mogę Ci podpowiedzieć, ale zegar wtedy nie staje... Wykorzystaj to mądrze.",
    "Gotowy, by pokazać im, kto tu najlepiej zna niemiecki? Startujemy!"
  ];

  const dialogImages = [
    greetings,
    surprised,
    confident,
    ask_me,
    greetings
  ];

  const questions = [
    {
      question: "Jak powiedzieć 'hello' po niemiecku?",
      correct: "Hallo",
      wrongs: ["Tschüss", "Danke", "Bitte"]
    },
    {
      question: "Jaka jest stolica Niemiec?",
      correct: "Berlin",
      wrongs: ["Paryż", "Londyn", "Madryt"]
    },
    {
      question: "Jak powiedzieć 'thank you' po niemiecku?",
      correct: "Danke",
      wrongs: ["Bitte", "Hallo", "Auf Wiedersehen"]
    },
    {
      question: "Co oznacza 'ja' po niemiecku?",
      correct: "Ja",
      wrongs: ["Nein", "Vielleicht", "Oder"]
    },
    {
      question: "Jaki kolor to 'rot' po angielsku?",
      correct: "Red",
      wrongs: ["Blue", "Green", "Yellow"]
    },
    {
      question: "Jak powiedzieć 'book' po niemiecku?",
      correct: "Buch",
      wrongs: ["Stuhl", "Tisch", "Fenster"]
    }
  ];

  const optionColors = {
    A: 'bg-blue-200 hover:bg-blue-300',
    B: 'bg-green-200 hover:bg-green-300',
    C: 'bg-yellow-200 hover:bg-yellow-300',
    D: 'bg-red-200 hover:bg-red-300'
  };

  const countdownColors = ['text-red-500', 'text-yellow-500', 'text-green-500', 'text-blue-500'];

  const levels = [
    "A1 Novice",
    "A2 Explorer",
    "B1 Intermediate",
    "B1 Legend",
    "B2 Advanced",
    "C1 Expert",
    "C2 Master",
    "Native Speaker",
    "Beginner",
    "Pro"
  ];

  const levelLogics = {
    "A1 Novice": 'dumb',
    "A2 Explorer": 'average',
    "B1 Intermediate": 'average',
    "B1 Legend": 'smart',
    "B2 Advanced": 'average',
    "C1 Expert": 'smart',
    "C2 Master": 'average',
    "Native Speaker": 'perfect',
    "Beginner": 'dumb',
    "Pro": 'smart'
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isTyping && typingIndex < dialogTexts[dialogPhase].length) {
      const timeout = setTimeout(() => {
        const nextChar = dialogTexts[dialogPhase][typingIndex];
        setDisplayText(prevText => prevText + nextChar);
        setTypingIndex(prevIdx => prevIdx + 1);
      }, 20);
      return () => clearTimeout(timeout);
    } else if (typingIndex === dialogTexts[dialogPhase].length) {
      setIsTyping(false);
    }
  }, [typingIndex, isTyping, dialogPhase]);

  useEffect(() => {
    setCurrentDialogImage(dialogImages[dialogPhase]);
    if (dialogPhase === 0) {
      setCurrentDialogImage(greetings);
    }
  }, [dialogPhase]);

  useEffect(() => {
    if (showDialog) {
      const initial = Math.random() > 0.5 ? 4 : 5;
      setCurrentTeacher(initial);

      const interval = setInterval(() => {
        setCurrentTeacher(6);
        setTimeout(() => {
          setCurrentTeacher(Math.random() > 0.5 ? 4 : 5);
        }, 3000);
      }, 15000);

      return () => clearInterval(interval);
    } else if (gameStarted) {
      setCurrentTeacher(0);
    }
  }, [showDialog, gameStarted]);

  useEffect(() => {
    if (showResult) {
      setCurrentTeacher(7);
    }
  }, [showResult]);

  useEffect(() => {
    if (gameStarted && bots.length === 0) {
      const newBots = levels.map((level, index) => ({
        name: level,
        score: 0,
        answered: 0,
        finishedAt: null, // NOWE: Init czasu
        logic: levelLogics[level],
        speedGroup: index < 5 ? 'fast' : 'slow'
      }));
      setBots(newBots);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (gameStarted && !showResult && currentQuestionIndex < questions.length) {
      setTimeLeft(10);

      const timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            setCurrentTeacher((t) => Math.max(0, t - 1));

            if (currentQuestionIndex < 5) {
              setCurrentQuestionIndex((i) => i + 1);
            } else {
              setPlayerFinishedAt(Date.now()); // Gracz skończył przez czas
              setShowResult(true);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [currentQuestionIndex, gameStarted, showResult]);

  // Logika botów (symulacja)
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
            let maxTime = 10;
            if (bot.logic === 'perfect' || bot.logic === 'smart') minTime = 6;
            else if (bot.logic === 'average') minTime = 4;

            const assumedTimeLeft = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
            const points = isCorrect ? assumedTimeLeft * 100 : 0;

            setBots((prev) =>
              prev.map((b) => {
                if (b.name === bot.name) {
                  const newAnswered = b.answered + 1;
                  // Jeśli to 6 odpowiedź, zapisujemy czas
                  const finishedTime = newAnswered === 6 ? Date.now() : b.finishedAt;

                  return {
                    ...b,
                    score: b.score + points,
                    answered: newAnswered,
                    finishedAt: finishedTime
                  };
                }
                return b;
              })
            );

            currentQuestion++;

            const baseDelay = bot.speedGroup === 'fast' ? 1500 : 3000;
            const randomExtra = Math.random() * 1500 + 500;
            const nextDelay = baseDelay + randomExtra;

            setTimeout(answerNext, nextDelay);
          };

          const startDelay = Math.random() * 1500 + 500;
          setTimeout(answerNext, startDelay);
      });
    }
  }, [gameStarted, bots]);

  useEffect(() => {
    if (gameStarted) {
      const q = questions[currentQuestionIndex];
      const allAnswers = [q.correct, ...q.wrongs];
      allAnswers.sort(() => Math.random() - 0.5);
      setDisplayedOptions(allAnswers);
    }
  }, [currentQuestionIndex, gameStarted]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const keyUpper = e.key.toUpperCase();
      if (showDialog) {
        if (keyUpper === ' ') {
          handleSkipOrNext();
        }
      } else if (gameStarted && !showResult && !showCountdown && !showHintDialog) {
        let ans;
        if (keyUpper === 'A') ans = 'A';
        else if (keyUpper === 'B') ans = 'B';
        else if (keyUpper === 'C') ans = 'C';
        else if (keyUpper === 'D') ans = 'D';
        if (ans) {
          handleAnswer(ans);
        } else if (keyUpper === 'H') {
          handleHint();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, dialogPhase, showDialog, gameStarted, showResult, currentQuestionIndex, showCountdown, showHintDialog]);

  const handleSkipOrNext = () => {
    if (isTyping) {
      setDisplayText(dialogTexts[dialogPhase]);
      setTypingIndex(dialogTexts[dialogPhase].length);
      setIsTyping(false);
    } else {
      if (dialogPhase < dialogTexts.length - 1) {
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
      const timer = setTimeout(() => {
        setCountdownNumber(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdownNumber === 0) {
      setTimeout(() => {
        setShowCountdown(false);
        setGameStarted(true);
      }, 1000);
    }
  }, [showCountdown, countdownNumber]);

  const handleAnswer = (letter) => {
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

    if (currentQuestionIndex < 5) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setPlayerFinishedAt(Date.now()); // Gracz skończył, zapisujemy czas
      setShowResult(true);
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

  // Funkcja sortująca
  const sortParticipants = (a, b) => {
    // 1. Priorytet: Punkty (malejąco)
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // 2. Priorytet: Czas zakończenia (rosnąco - kto wcześniej ten lepszy)
    // Jeśli ktoś jeszcze nie skończył (finishedAt is null/undefined), traktujemy jako "bardzo późno" (Infinity)
    const timeA = a.finishedAt || Infinity;
    const timeB = b.finishedAt || Infinity;
    return timeA - timeB;
  };

  useEffect(() => {
    if (showResult) {
      const allFinished = bots.every(bot => bot.answered === 6);
      if (!allFinished) {
        setWaitingForOthers(true);
      } else {
        setWaitingForOthers(false);
        const ranking = [...bots, { name: 'Ty', score: playerScore, answered: 6, finishedAt: playerFinishedAt }]
          .sort(sortParticipants);

        const playerPosition = ranking.findIndex(e => e.name === 'Ty') + 1;

        if (playerPosition === 1) setFinalDialogType('first');
        else if (playerPosition <= 3) setFinalDialogType('win');
        else setFinalDialogType('lose');
      }
    }
  }, [showResult, bots, playerScore, playerFinishedAt]);

  useEffect(() => {
    if (waitingForOthers) {
      const allFinished = bots.every(bot => bot.answered === 6);
      if (allFinished) {
        setWaitingForOthers(false);
        const ranking = [...bots, { name: 'Ty', score: playerScore, answered: 6, finishedAt: playerFinishedAt }]
          .sort(sortParticipants);

        const playerPosition = ranking.findIndex(e => e.name === 'Ty') + 1;

        if (playerPosition === 1) setFinalDialogType('first');
        else if (playerPosition <= 3) setFinalDialogType('win');
        else setFinalDialogType('lose');
      }
    }
  }, [bots, waitingForOthers, playerScore, playerFinishedAt]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans text-slate-50">
      <Card className="h-screen w-full fixed top-0 left-0 bg-slate-900 overflow-hidden">
        <div className="relative h-full w-full flex items-center justify-center">
          <div className="w-[80%] md:w-[70%] h-[80%] ml-64 md:ml-96 bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg border-4 border-gray-400 shadow-2xl p-8 flex flex-col items-center justify-start relative overflow-hidden">
            {showCountdown ? (
              <motion.div
                key={countdownNumber}
                initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                animate={{ scale: 2, opacity: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring" }}
                className={`text-9xl font-extrabold drop-shadow-2xl flex items-center justify-center w-full h-full ${countdownColors[3 - countdownNumber] || 'text-blue-500'} select-none`}
              >
                {countdownNumber > 0 ? countdownNumber : 'Start!'}
              </motion.div>
            ) : gameStarted && !showDialog ? (
              showResult ? (
                <div className="w-full h-full flex flex-col py-4">
                  <div className="flex flex-col space-y-4 overflow-y-auto scrollbar-hide p-2">
                    <AnimatePresence>
                    {[...bots, { name: 'Ty', score: playerScore, answered: 6, finishedAt: playerFinishedAt }]
                      .sort(sortParticipants)
                      .map((entry, index) => {
                        return (
                          <motion.div
                            layout
                            key={entry.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{
                              type: "spring",
                              stiffness: 60,
                              damping: 15
                            }}
                            className={`w-full rounded-xl flex items-center justify-between px-6 text-black text-2xl font-bold shadow-md ${
                              index === 0 ? 'h-32 bg-yellow-300 z-30' :
                              index === 1 ? 'h-28 bg-gray-300 z-20' :
                              index === 2 ? 'h-24 bg-orange-300 z-10' :
                              'h-20 bg-white/20'
                            }`}
                          >
                            <span>{index + 1}. {entry.name}</span>
                            <span className="flex items-center gap-3">
                              <span className="font-extrabold">
                                <AnimatedCounter value={entry.score} /> pkt
                              </span>

                              <AnimatePresence mode="wait">
                                {entry.answered < 6 && (
                                  <motion.span
                                    key="answering-text"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                                    transition={{ duration: 0.3 }}
                                    className="text-lg text-orange-600 font-medium"
                                  >
                                    (odpowiada...)
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </span>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-between space-y-8 py-4 relative">
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
                      Pytanie {currentQuestionIndex + 1}/6 | Twój wynik: <AnimatedCounter value={playerScore} />
                    </div>
                    <div className={`text-4xl font-extrabold ${timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-black'}`}>
                      Czas: {timeLeft}s
                    </div>
                  </div>

                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-black text-2xl md:text-4xl font-bold text-center"
                  >
                    {questions[currentQuestionIndex].question}
                  </motion.div>

                  <motion.div
                    key={`options-${currentQuestionIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-2 gap-6 w-full max-w-4xl flex-1 mt-8 items-stretch relative"
                  >
                    <Button
                      onClick={() => handleAnswer('A')}
                      className={`${optionColors.A} text-black text-lg md:text-2xl font-bold p-6 rounded-xl shadow-md flex items-center justify-center h-full`}
                    >
                      A: {displayedOptions[0]}
                    </Button>
                    <Button
                      onClick={() => handleAnswer('B')}
                      className={`${optionColors.B} text-black text-lg md:text-2xl font-bold p-6 rounded-xl shadow-md flex items-center justify-center h-full`}
                    >
                      B: {displayedOptions[1]}
                    </Button>
                    <Button
                      onClick={() => handleAnswer('C')}
                      className={`${optionColors.C} text-black text-lg md:text-2xl font-bold p-6 rounded-xl shadow-md flex items-center justify-center h-full`}
                    >
                      C: {displayedOptions[2]}
                    </Button>
                    <Button
                      onClick={() => handleAnswer('D')}
                      className={`${optionColors.D} text-black text-lg md:text-2xl font-bold p-6 rounded-xl shadow-md flex items-center justify-center h-full`}
                    >
                      D: {displayedOptions[3]}
                    </Button>

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
            ) : (
              <div className="text-black text-xl md:text-3xl font-bold text-center">
              </div>
            )}
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

        {/* Waiting / Final Dialog */}
        <AnimatePresence>
          {(waitingForOthers || finalDialogType) && (
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 120, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed bottom-0 left-0 w-full px-6 pb-8 z-[100] pointer-events-none"
            >
              <div className="
                pointer-events-auto
                w-full max-w-6xl mx-auto
                relative
                rounded-3xl
                p-6 md:p-8
                shadow-[0_20px_60px_rgba(0,0,0,0.45)]
                bg-white/80
                backdrop-blur-2xl
                border border-white/40
                overflow-hidden
              ">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />

                <div className="relative flex gap-6 items-start">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-300/40 to-purple-300/40 blur-xl" />
                    <img
                      src={greetings}
                      alt="Chill avatar"
                      className="relative w-24 h-24 md:w-32 md:h-32 object-contain rounded-2xl border-2 border-white/50 shadow-xl"
                    />
                  </div>

                  <div className="flex-1 text-slate-900 text-lg md:text-2xl leading-relaxed font-semibold drop-shadow-sm">
                    {waitingForOthers ? "Czekamy na pozostałych uczniów..." :
                     finalDialogType === 'first' ? "Gratuluję wygranej!! Pierwsze miejsce jest Twoje!" :
                     finalDialogType === 'win' ? "Brawo! Super się spisałeś i zająłeś miejsce w czołowej trójce!" :
                     "Dobra próba! Następnym razem na pewno Ci się uda lepiej."}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Initial Dialog */}
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
                className="
                  pointer-events-auto
                  w-full max-w-6xl mx-auto
                  relative
                  rounded-3xl
                  p-6 md:p-8
                  shadow-[0_20px_60px_rgba(0,0,0,0.45)]
                  bg-white/80
                  backdrop-blur-2xl
                  border border-white/40
                  overflow-hidden
                  cursor-pointer
                "
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />

                <div className="relative flex gap-6 items-start">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-300/40 to-purple-300/40 blur-xl" />
                    <img
                      src={currentDialogImage}
                      alt="Dialog avatar"
                      className="relative w-24 h-24 md:w-32 md:h-32 object-contain rounded-2xl border-2 border-white/50 shadow-xl"
                    />
                  </div>

                  <div className="flex-1 text-slate-900 text-lg md:text-2xl leading-relaxed font-semibold drop-shadow-sm">
                    {displayText}
                    {isTyping && <span className="animate-pulse">|</span>}

                    <div className="mt-3 text-sm text-slate-600 font-bold">
                      {isTyping
                        ? "Naciśnij spację lub kliknij, aby pominąć..."
                        : dialogPhase < dialogTexts.length - 1
                        ? "Naciśnij spację lub kliknij, aby kontynuować..."
                        : "Naciśnij spację lub kliknij, aby rozpocząć..."}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint Dialog */}
        <AnimatePresence>
          {showHintDialog && (
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 120, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed bottom-0 left-0 w-full px-6 pb-8 z-[100] pointer-events-none"
            >
              <div className="
                pointer-events-auto
                w-full max-w-6xl mx-auto
                relative
                rounded-3xl
                p-6 md:p-8
                shadow-[0_20px_60px_rgba(0,0,0,0.45)]
                bg-white/80
                backdrop-blur-2xl
                border border-white/40
                overflow-hidden
              ">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />

                <div className="relative flex gap-6 items-start">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-300/40 to-purple-300/40 blur-xl" />
                    <img
                      src={thinking}
                      alt="Thinking avatar"
                      className="relative w-24 h-24 md:w-32 md:h-32 object-contain rounded-2xl border-2 border-white/50 shadow-xl"
                    />
                  </div>

                  <div className="flex-1 text-slate-900 text-lg md:text-2xl leading-relaxed font-semibold drop-shadow-sm">
                    {hintText}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* MOBILE UI */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 w-full bg-slate-950/95 p-4 flex justify-center space-x-2 z-[100]">
          {gameStarted && !showDialog && !showResult ? (
            <>
              <Button onClick={() => handleAnswer('A')} className="bg-blue-500">A</Button>
              <Button onClick={() => handleAnswer('B')} className="bg-blue-500">B</Button>
              <Button onClick={() => handleAnswer('C')} className="bg-blue-500">C</Button>
              <Button onClick={() => handleAnswer('D')} className="bg-blue-500">D</Button>
              {hintsLeft > 0 && <Button onClick={handleHint} className="bg-yellow-400 text-black">💡</Button>}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}