import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import teacher0 from "@/assets/graphics/dsd/teacher0.png";
import teacher1 from "@/assets/graphics/dsd/teacher1.png";
import teacher2 from "@/assets/graphics/dsd/teacher2.png";
import teacher3 from "@/assets/graphics/dsd/teacher3.png";
import teacher4 from "@/assets/graphics/dsd/teacher4.png";
import teacher5 from "@/assets/graphics/dsd/teacher5.png";
import teacher6 from "@/assets/graphics/dsd/teacher6.png";

import ask_me from "@/assets/graphics/dsd/ask_me.png";
import confident from "@/assets/graphics/dsd/confident.png";
import surprised from "@/assets/graphics/dsd/surprised.png";
import showing from "@/assets/graphics/dsd/showing.png";
import annoyed from "@/assets/graphics/dsd/annoyed.png";
import greetings from "@/assets/graphics/dsd/chill.png";

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

  const teachers = [teacher0, teacher1, teacher2, teacher3, teacher4, teacher5, teacher6];

  const dialogTexts = [
    "Witaj! Twoim zadaniem będzie odpowiedź na pytania z tablicy. Na szczęście to test ABCD, więc czysto teoretycznie masz 25% szans na sukces przy każdym pytaniu!",
    "Ale przecież nie jesteś tu po to, żeby tylko strzelać, prawda? Pokażmy na co Cię stać!",
    "Zasady są proste: żeby dostać plusika, musisz odpowiedzieć poprawnie na minimum 5 z 6 pytań.",
    "Jeśli zrobi się naprawdę ciężko, mogę Ci dwa razy podpowiedzieć. Ale tylko dwa!",
    "Gotowy na start?"
  ];

  const dialogImages = [
    greetings, // 0: chill
    surprised, // 1: surprised
    confident, // 2: confident
    ask_me,    // 3: ask me
    greetings  // 4: chill
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Typewriter effect with mid-phase image switch for phase 0
  useEffect(() => {
    if (isTyping && typingIndex < dialogTexts[dialogPhase].length) {
      const timeout = setTimeout(() => {
        const nextChar = dialogTexts[dialogPhase][typingIndex];
        setDisplayText(prev => prev + nextChar);
        setTypingIndex(prev => prev + 1);

        // For phase 0, switch to showing after "tablicy" (at typingIndex 59)
        if (dialogPhase === 0 && prev.length + 1 === 59) {
          setCurrentDialogImage(showing);
        }
      }, 20);
      return () => clearTimeout(timeout);
    } else if (typingIndex === dialogTexts[dialogPhase].length) {
      setIsTyping(false);
    }
  }, [typingIndex, isTyping, dialogPhase]);

  // Set initial image for new phase
  useEffect(() => {
    setCurrentDialogImage(dialogImages[dialogPhase]);
    // For phase 0, reset to chill if switching back or starting
    if (dialogPhase === 0) {
      setCurrentDialogImage(greetings);
    }
  }, [dialogPhase]);

  // Handle teacher animation during dialog
  useEffect(() => {
    if (showDialog) {
      // Start with 4 or 5 randomly
      const initial = Math.random() > 0.5 ? 4 : 5;
      setCurrentTeacher(initial);

      const interval = setInterval(() => {
        setCurrentTeacher(6); // Switch to 6 (checks time)
        setTimeout(() => {
          // Back to 4 or 5 randomly
          setCurrentTeacher(Math.random() > 0.5 ? 4 : 5);
        }, 3000); // Stay on 6 for 3 seconds
      }, 15000); // Every 15 seconds

      return () => clearInterval(interval);
    } else if (gameStarted) {
      // Reset to 0 when game starts
      setCurrentTeacher(0);
    }
  }, [showDialog, gameStarted]);

  const handleSkipOrNext = () => {
    if (isTyping) {
      // Skip typing and set image if mid-phase switch was pending
      setDisplayText(dialogTexts[dialogPhase]);
      setTypingIndex(dialogTexts[dialogPhase].length);
      setIsTyping(false);
      if (dialogPhase === 0 && dialogTexts[0].includes("tablicy")) {
        setCurrentDialogImage(showing);
      }
    } else {
      // Next phase or start game
      if (dialogPhase < dialogTexts.length - 1) {
        setDialogPhase(prev => prev + 1);
        setDisplayText("");
        setTypingIndex(0);
        setIsTyping(true);
      } else {
        setShowDialog(false);
        setGameStarted(true);
      }
    }
  };

  // Handle space key for skip or next
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && showDialog) {
        handleSkipOrNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, dialogPhase, showDialog]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans text-slate-50">
      {/* GAME AREA - FULLSCREEN */}
      <Card className="h-screen w-full fixed top-0 left-0 bg-slate-900 overflow-hidden">
        <div className="relative h-full w-full flex items-center justify-center">
          {/* CENTRALNY KONTENER */}
          <div className="w-[80%] md:w-[70%] h-[80%] ml-32 md:ml-48 bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg border-4 border-gray-400 shadow-2xl p-4 flex items-center justify-center relative overflow-hidden">
            <div className="text-black text-xl md:text-3xl font-bold text-center">
              {/* Placeholder */}
            </div>
          </div>

          {/* NAUCZYCIELKA */}
          <motion.div
            className="absolute bottom-0 left-10 z-10"
            animate={isJumping ? { y: [-10, 0] } : {}}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <img
              src={teachers[currentTeacher]}
              alt="Nauczycielka"
              className="w-96 md:w-[800px] h-auto object-contain"
            />
          </motion.div>
        </div>

        {/* DIALOG BOX - NA DOLE, PEŁNA SZEROKOŚĆ Z PADDINGIEM */}
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
                {/* Decorative glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

                {/* Top accent bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />

                <div className="relative flex gap-6 items-start">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-300/40 to-purple-300/40 blur-xl" />
                    <img
                      src={currentDialogImage}
                      alt="Dialog avatar"
                      className="relative w-24 h-24 md:w-32 md:h-32 object-contain rounded-2xl border-2 border-white/50 shadow-xl"
                    />
                  </div>

                  {/* Text */}
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
      </Card>

      {/* MOBILE UI - JEŚLI POTRZEBNE, NA RAZIE MINIMALNE */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 w-full bg-slate-950/95 p-4 flex justify-center">
          {/* Dodaj mobile kontrole jeśli potrzeba */}
        </div>
      )}
    </div>
  );
}