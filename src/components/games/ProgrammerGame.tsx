/* ------------------------------------------------------------------ */
/*  ProgrammerGame.tsx  – Styl InformatykGame + Centrowanie           */
/* ------------------------------------------------------------------ */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Code, CheckCircle2, XCircle, Lightbulb, Trophy, Terminal } from "lucide-react";

/* ----------------- dane quizowe (7 pytań) ----------------- */
let quizQuestions = [
  {
    id: 1,
    type: "single",
    questionText: "Które z poniższych zdań najlepiej opisuje, czym naprawdę zajmuje się programista?",
    answers: [
      { id: "a", text: "Tylko naprawia drukarki i ustawia antywirusa.", correct: false },
      { id: "b", text: "Wymyśla i pisze instrukcje, dzięki którym komputer robi to, co myślimy", correct: true },
      { id: "c", text: "Składa komputery", correct: false },
      { id: "d", text: "Maluje obrazki w Paincie", correct: false },
    ],
    hints: [
      "Programista to nie serwisant – nie ogranicza się do napraw.",
      "Jego głównym zadaniem jest pisanie instrukcji dla komputera.",
    ],
    usefulness: [
      "Zrozumienie roli programisty pomoże Ci świadomie wybrać kierunek dalszej nauki.",
      "To podstawa do rozmów kwalifikacyjnych i pracy w zawodzie.",
    ],
  },
  {
    id: 2,
    type: "multiple",
    questionText: "Co można zaprogramować w Pythonie, by rozwiązać codzienny problem? (wszystkie poprawne)",
    answers: [
      { id: "a", text: "Aplikacja z terminem lekcji WF-u" },
      { id: "b", text: "Gra z monetami i smokami" },
      { id: "c", text: "Algorytm rozpoznający kota lub psa na zdjęciu" },
      { id: "d", text: "Program naprawiający dziurę w spodniach" },
    ],
    correct: ["a", "b", "c"],
    hints: [
      "Python świetnie nadaje się do aplikacji, gier i sztucznej inteligencji.",
      "Nie da się jednak naprawić ubrań kodem – wyklucz odpowiedź D.",
    ],
    usefulness: [
      "Python to język pierwszego wyboru w AI, automatyzacji i szybkich prototypach.",
      "Znajomość go zwiększa szanse na praktyki i dobrze płatną pracę.",
    ],
  },
  {
    id: 3,
    type: "single",
    questionText: "Co robi instrukcja return w funkcji?",
    answers: [
      { id: "a", text: "Kończy działanie funkcji i przekazuje wybraną wartość do miejsca, z którego funkcja została wywołana.", correct: true },
      { id: "b", text: "Wyświetla wynik na ekranie i czeka na klawisz Enter.", correct: false },
      { id: "c", text: "Usuwa z pamięci wszystkie zmienne użyte w funkcji.", correct: false },
      { id: "d", text: "Tworzy nową funkcję o nazwie podanej po słowie return.", correct: false },
    ],
    hints: [
      "return przerywa dalsze wykonanie funkcji.",
      "Może jednocześnie „wynieść” wynik na zewnątrz.",
    ],
    usefulness: [
      "Bez return nie da się przekazać wyniku dalej – to podstawa każdej funkcji.",
      "Dobrze zrozumiesz błędy kompilatora i logikę programu.",
    ],
  },
  {
    id: 4,
    type: "multiple",
    questionText: "Które z poniższych nazw odpowiadają językom programowania? (wszystkie poprawne)",
    answers: [
      { id: "a", text: "CISCO" },
      { id: "b", text: "SQL" },
      { id: "c", text: "C++" },
      { id: "d", text: "INTEL" },
    ],
    correct: ["b", "c"],
    hints: [
      "SQL to język zapytań – używany w bazach danych.",
      "C++ to klasyczny język systemowo-aplikacyjny.",
      "CISCO i INTEL to nazwy firm, nie języki.",
    ],
    usefulness: [
      "Rozpoznawanie języków ułatwi czytanie ogłoszenia o pracę.",
      "Wiedza ta jest wymagana na rozmowach kwalifikacyjnych.",
    ],
  },
  {
    id: 5,
    type: "short",
    questionText: "W jakim języku programowania pisana jest struktura (fundament) strony internetowej?",
    correctText: "HTML",
    acceptable: ["html", "Html", "HyperText Markup Language"],
    hints: [
      "To nie jest język programowania w ścisłym sensie – opisuje strukturę.",
      "Skrót oznacza HyperText Markup Language.",
    ],
    usefulness: [
      "HTML to podstawa tworzenia stron WWW – pierwszy krok do frontendu.",
      "Znasz go już na egzamin INF.03.",
    ],
  },
  {
    id: 6,
    type: "short",
    questionText: "Jaka instrukcja pozwala rozpatrzeć różne przypadki w zależności od warunku?",
    correctText: "if",
    acceptable: ["If", "IF", "Jeżeli", "Jeśli", "jeżeli", "jeśli"],
    hints: [
      "Jest to najprostszy wybór: tak / nie.",
      "Występuje w każdym języku programowania.",
    ],
    usefulness: [
      "Bez instrukcji warunkowych nie istnieje logika aplikacji.",
      "To temat obowiązkowy na egzaminie zawodowym INF.03/04.",
    ],
  },
  {
    id: 7,
    type: "combo",
    questionText: "Do czego służy podany fragment kodu w języku C++? Co dokładnie zwróci ten kod (wartość)?",
    code: `int liczbaParzystych() {\n\tint licznik = 0;\n\tfor (int i = 1; i <= 10; ++i) {\n\t\tif (i % 2 == 0) {\n\t\t\t++licznik;\n\t\t}\n\t}\n\treturn licznik;\n}`,
    answers: [
      { id: "a", text: "Zwraca liczby parzyste od 1 do n", correct: false },
      { id: "b", text: "Zwraca sumę liczb parzystych od 1 do 10", correct: false },
      { id: "c", text: "Zwraca liczbę liczb parzystych w przedziale od 1 do 10", correct: true },
      { id: "d", text: "Funkcja nic nie zwraca", correct: false },
    ],
    correctText: "5",
    acceptable: ["pięć", "five", "Pięć", "Five"],
    hints: [
      "Spróbuj ręcznie policzyć: 2, 4, 6, 8, 10 – ile jest tych liczb?",
      "Funkcja zwraca tylko ich ilość, nie sumę.",
    ],
    usefulness: [
      "To klasyczne zadanie rekrutacyjne – sprawdza myślenie algorytmiczne.",
      "Znajdziesz je w INF.03 / INF.04 jako przykład pętli i warunku.",
    ],
  },
] as const;

const shuffle_questions = <T,>(arr: readonly T[]) => {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

quizQuestions = quizQuestions.map((q) =>
    "answers" in q
        ? { ...q, answers: shuffle_questions(q.answers) }
        : q
)


/* ----------------- mini-gra (edytor: rozsypany kod) ----------------- */
const editorTask = {
  lore: "Podczas rozmowy kwalifikacyjnej na kierunek Technik Programista rekruter poprosi Cię o krótką próbkę umiejętności. Klocki kodu zostały rozsypane — ułóż je tak, aby funkcja poprawnie działała.",
  question: "Ułóż funkcję zwracającą największą liczbę z tablicy:",
  pool: [
    "return max;",
    "if(x > max) max = x;",
    "for(const x of arr) {",
    "}",
    "let max = arr[0];",
    "function findMax(arr) {",
    "}",
  ],
  correct: [
    "function findMax(arr) {",
    "let max = arr[0];",
    "for(const x of arr) {",
    "if(x > max) max = x;",
    "}",
    "return max;",
    "}",
  ],
  hints: [
    "Zacznij od deklaracji funkcji: function nazwa(param)",
    "Ustaw wartość początkową (pierwszy element tablicy) przed pętlą",
    "Przejdź po wszystkich elementach (pętla), porównuj i aktualizuj max",
    "Na końcu zwróć zmienną max",
  ],
  usefulness: [
    "To typowe zadanie rekrutacyjne sprawdzające myślenie algorytmiczne.",
    "Elementy tego typu wykorzystasz w INF.03 / INF.04 (projektowanie i programowanie aplikacji).",
    "Przyda się w tworzeniu stron, aplikacji i testowaniu kodu.",
    "Na kierunku Technik Programista będziesz pracować z tymi zagadnieniami regularnie.",
  ],
};

/* ----------------- util ----------------- */
const ItemTypes = { BLOCK: "block" };
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ----------------- Block (drag) ----------------- */
function CodeBlock({ text, origin, index, dragId, isGhost }: any) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BLOCK,
    item: { origin, index, dragId },
    collect: (m) => ({ isDragging: !!m.isDragging() }),
  });

  return (
      <motion.div
          ref={drag}
          layout
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className={`px-3 py-2 m-1 border rounded cursor-move bg-white shadow text-black text-sm font-mono ${isGhost ? "opacity-60" : ""}`}
          style={{ opacity: isDragging ? 0.4 : 1, minWidth: 160 }}
      >
        <code>{text}</code>
      </motion.div>
  );
}

/* ----------------- RowSlot (dropped directly into numbered rows) ----------------- */
function RowSlot({ rowIndex, value, onDropToRow, onSwapRows, highlight }: any) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.BLOCK,
    collect: (m) => ({ isOver: !!m.isOver(), canDrop: !!m.canDrop() }),
    drop: (item: any) => {
      onDropToRow(item, rowIndex);
    },
  });

  return (
      <motion.div
          ref={drop}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.01 }}
          className={`flex items-start gap-3 px-2 py-1 rounded ${isOver ? "ring-2 ring-offset-1 ring-primary/50" : ""}`}
      >
        <div className="w-10 text-right pr-2 text-gray-400 select-none">{rowIndex + 1}</div>
        <div
            className={`flex-1 rounded-md border px-3 py-2 bg-[linear-gradient(180deg,#0f172a, #020617)] text-white shadow-sm min-h-[40px] font-mono text-sm relative overflow-hidden`}
            style={{ boxShadow: highlight ? "0 8px 30px rgba(37,99,235,0.12)" : undefined }}
        >
          <AnimatePresence>
            {value ? (
                <motion.div
                    key={value}
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                >
                  <CodeBlock text={value} origin={"row"} index={rowIndex} dragId={`row-${rowIndex}`} />
                </motion.div>
            ) : (
                <motion.div key={"empty-" + rowIndex} initial={{ opacity: 0.4 }} animate={{ opacity: 0.7 }} className="text-gray-300 italic text-xs">
                  Przeciągnij tutaj fragment kodu...
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
  );
}

/* ----------------- MiniGame component (in-editor dragging only) ----------------- */
function MiniGame({ onFinish, addScore }: { onFinish: () => void, addScore: (points: number) => void }) {
  return (
      <DndProvider backend={HTML5Backend}>
        <MiniGameInner onFinish={onFinish} addScore={addScore} />
      </DndProvider>
  );
}

function MiniGameInner({ onFinish, addScore }: { onFinish: () => void, addScore: (points: number) => void }) {
  const [pool, setPool] = useState(() => shuffle(editorTask.pool));
  const [rows, setRows] = useState(() => Array(editorTask.correct.length).fill(null));
  const [feedback, setFeedback] = useState<{ok: boolean, msg: string} | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hintsVisible, setHintsVisible] = useState(0);
  const [successPending, setSuccessPending] = useState(false);
  const successTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [usefulnessVisible, setUsefulnessVisible] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const dropFromPoolToRow = useCallback((poolIndex: number, rowIndex: number) => {
    if(completed) return;
    setPool((prevPool) => {
      const copy = [...prevPool];
      const [item] = copy.splice(poolIndex, 1);
      setRows((r) => {
        const nr = [...r];
        if (nr[rowIndex]) copy.push(nr[rowIndex]);
        nr[rowIndex] = item;
        return nr;
      });
      return copy;
    });
  }, [completed]);

  const moveRowToRow = useCallback((fromRow: number, toRow: number) => {
    if(completed) return;
    setRows((prev) => {
      const copy = [...prev];
      const tmp = copy[fromRow];
      copy[fromRow] = copy[toRow];
      copy[toRow] = tmp;
      return copy;
    });
  }, [completed]);

  const moveRowToPool = useCallback((rowIndex: number) => {
    if(completed) return;
    setRows((prev) => {
      const copy = [...prev];
      const item = copy[rowIndex];
      copy[rowIndex] = null;
      if (item) setPool((p) => [...p, item]);
      return copy;
    });
  }, [completed]);

  const handleDropToRow = useCallback(
      (item: any, targetRowIndex: number) => {
        const { origin, index } = item;
        if (origin === "pool") dropFromPoolToRow(index, targetRowIndex);
        else if (origin === "row") moveRowToRow(index, targetRowIndex);
      },
      [dropFromPoolToRow, moveRowToRow]
  );

  const [, dropToPool] = useDrop({
    accept: ItemTypes.BLOCK,
    drop: (item: any) => {
      if (item.origin === "row") moveRowToPool(item.index);
    },
  });

  const validate = useCallback(() => {
    const isCorrect = JSON.stringify(rows) === JSON.stringify(editorTask.correct)
    setAttempts((a) => a + 1)

    if (isCorrect) {
      setCompleted(true);
      const points = Math.max(0, 30 - (attempts * 5) - (hintsVisible * 5));
      // Prosta punktacja: max 30, kara za próby i podpowiedzi, ale w tym flow dajemy stałą nagrodę za sukces
      // W InformatykGame logika punktacji jest bardziej złożona, tu uprościmy:
      // Jeśli sukces w 1 próbie: 30 pkt. Jeśli w kolejnych: 15 pkt.
      const reward = attempts === 0 ? 30 : 15;
      const penalty = hintsVisible * 5;
      const finalScore = Math.max(0, reward - penalty);

      addScore(finalScore);

      let seconds = 3;
      setFeedback({ ok: true, msg: `PRAWIDŁOWO! Przejście za ${seconds} s…` });
      setSuccessPending(true);

      successTimerRef.current = setInterval(() => {
        seconds -= 1;
        if (seconds > 0) {
          setFeedback({ ok: true, msg: `PRAWIDŁOWO! Przejście za ${seconds} s…` });
        } else {
          clearInterval(successTimerRef.current!);
          onFinish();
        }
      }, 1000);

    } else {
      if (attempts >= 2) {
        // Ostatnia szansa / koniec prób - tu pozwalamy próbować do skutku ale z komunikatem błędu
        setFeedback({ ok: false, msg: "BŁĄD. Sprawdź podpowiedzi i spróbuj ponownie." });
      } else {
        setFeedback({ ok: false, msg: "BŁĄD. Kolejność instrukcji jest niepoprawna." });
      }
    }
  }, [rows, onFinish, attempts, hintsVisible, addScore]);


  const [lastDroppedRow, setLastDroppedRow] = useState<number | null>(null);
  useEffect(() => {
    if (lastDroppedRow !== null) {
      const t = setTimeout(() => setLastDroppedRow(null), 600);
      return () => clearTimeout(t);
    }
  }, [lastDroppedRow]);

  const onDropToRowWithHighlight = useCallback(
      (item: any, targetRow: number) => {
        handleDropToRow(item, targetRow);
        setLastDroppedRow(targetRow);
      },
      [handleDropToRow]
  );

  function PoolBlock({ text, idx }: { text: string; idx: number }) {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.BLOCK,
      item: { origin: "pool", index: idx },
      collect: (m) => ({ isDragging: !!m.isDragging() }),
    });
    return (
        <motion.div
            ref={drag}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-3 py-2 m-1 border rounded cursor-move bg-white shadow text-black text-sm font-mono"
            style={{ opacity: isDragging ? 0.5 : 1, minWidth: 160 }}
        >
          <code>{text}</code>
        </motion.div>
    );
  }

  const placedCount = rows.filter(Boolean).length;

  return (
      <Card className="p-6 border-4 space-y-4 max-w-3xl w-full mx-auto bg-card text-card-foreground">
        <div className="text-center mb-4">
          <Terminal className="w-10 h-10 text-primary mx-auto mb-2 animate-pixel-float" />
          <h2 className="text-lg font-bold">ETAP 2: MINI-GRA KODOWA</h2>
          <p className="text-xs text-muted-foreground">Ułóż rozsypany algorytm w poprawnej kolejności.</p>
        </div>

        <p className="text-sm italic text-center bg-muted/50 p-2 rounded">{editorTask.lore}</p>
        <p className="font-bold text-center">{editorTask.question}</p>

        {/* IDE-like editor */}
        <div className="mt-3">
          <div className="bg-slate-900 rounded-md p-4 border-2 border-slate-700">
            {rows.map((val, idx) => (
                <div key={idx} className="mb-2">
                  <RowSlot
                      rowIndex={idx}
                      value={val}
                      onDropToRow={onDropToRowWithHighlight}
                      onSwapRows={moveRowToRow}
                      highlight={lastDroppedRow === idx}
                  />
                </div>
            ))}
          </div>
        </div>

        {/* Pool */}
        <div className="mt-2">
          <h3 className="font-semibold text-sm mb-1">Dostępne fragmenty kodu</h3>
          <div ref={dropToPool} className="min-h-[80px] p-2 border-2 border-dashed border-primary/30 rounded bg-accent/5 flex flex-wrap gap-2 justify-center">
            {pool.length === 0 ? (
                <div className="text-xs italic text-muted-foreground self-center">Wszystkie fragmenty użyte</div>
            ) : (
                pool.map((t, i) => <PoolBlock key={i} text={t} idx={i} />)
            )}
          </div>
        </div>

        {/* Hints */}
        <div className="space-y-3 pt-2">
          {hintsVisible < editorTask.hints.length && !completed && (
              <Button
                  onClick={() => {
                    setHintsVisible(prev => prev + 1);
                    addScore(-5); // Penalizacja od razu przy odkryciu? W InformatykGame jest po prostu licznik, tu upraszczamy.
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full border-2 border-secondary text-secondary hover:bg-secondary/20 hover:text-white arcade-button"
              >
                💡 POKAŻ PODPOWIEDŹ ({hintsVisible + 1}/{editorTask.hints.length}) (KOSZT: 5 PKT)
              </Button>
          )}

          {hintsVisible > 0 && (
              <div className="space-y-2">
                {editorTask.hints.slice(0, hintsVisible).map((h, i) => (
                    <div key={i} className="text-xs p-3 bg-secondary/10 border-2 border-secondary text-secondary rounded animate-slide-in-up">
                      <span className="font-bold">Podpowiedź {i+1}:</span> {h}
                    </div>
                ))}
              </div>
          )}
        </div>

        {/* Feedback & Result */}
        {feedback && (
            <div className={`p-4 border-4 text-center animate-fade-in ${feedback.ok ? "border-accent bg-accent/20 text-accent" : "border-destructive bg-destructive/20 text-destructive"}`}>
              {feedback.ok ? <CheckCircle2 className="w-8 h-8 mx-auto mb-2"/> : <XCircle className="w-8 h-8 mx-auto mb-2"/>}
              <p className="font-bold">{feedback.msg}</p>
            </div>
        )}

        {/* Controls */}
        <div className="space-y-3 mt-4">
          {!completed && (
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 arcade-button h-12 text-md" onClick={validate} disabled={successPending}>
                SPRAWDŹ ROZWIĄZANIE
              </Button>
          )}

          {!completed && (
              <Button
                  className="w-full"
                  variant="ghost"
                  onClick={() => {
                    setPool(shuffle(editorTask.pool));
                    setRows(Array(editorTask.correct.length).fill(null));
                    setFeedback(null);
                    setHintsVisible(0);
                    setAttempts(0);
                  }}
              >
                Resetuj planszę
              </Button>
          )}
        </div>
      </Card>
  );
}

/* ==================================================================== */
/* ===================== GŁÓWNY KOMPONENT – QUIZ ====================== */
/* ==================================================================== */
type View = "quiz" | "minigame" | "finished";

export default function ProgrammerGame() {
  const [view, setView] = useState<View>("quiz");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string; explanation?: string } | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [locked, setLocked] = useState(false);

  // Hint states per question
  const [hintLevel, setHintLevel] = useState(0);
  const [showUsefulness, setShowUsefulness] = useState(false);

  const q = quizQuestions[qIndex];

  /* ------------ pomoc ------------ */
  const updateAnswer = (val: any) => {
    if(showResult) return;
    setAnswers((a) => ({ ...a, [q.id]: val }));
  }

  // Obsługa natychmiastowego kliknięcia dla pytań jednokrotnego wyboru
  const handleSingleChoice = (answerId: string) => {
    if (showResult || locked) return;

    // Zapisz odpowiedź
    setAnswers((a) => ({ ...a, [q.id]: answerId }));

    setLocked(true);
    setShowResult(true);
    setShowUsefulness(false);

    // Znajdź poprawną odpowiedź w danych
    const isCorrect = answerId === q.answers.find((x) => x.correct)?.id;

    if (isCorrect) {
      const points = 10;
      setQuizScore(s => s + points);
      setTotalScore(s => s + points);
      setFeedback({ ok: true, msg: "PRAWIDŁOWO! +10 PKT" });
    } else {
      setFeedback({ ok: false, msg: "BŁĄD!", explanation: "Sprawdź podpowiedzi lub spróbuj zrozumieć dlaczego." });
    }
    setLocked(false);
  };

  // Funkcja sprawdzająca (dla pozostałych typów pytań)
  const check = () => {
    if (locked || showResult) return;

    // Walidacja czy cokolwiek zaznaczono
    const user = answers[q.id];
    if (user === undefined || user === "" || (Array.isArray(user) && user.length === 0)) return;

    setLocked(true);
    setShowResult(true);
    setShowUsefulness(false);

    let ok = false;

    if (q.type === "multiple") {
      ok = JSON.stringify((user || []).sort()) === JSON.stringify(q.correct?.sort());
    }
    else if (q.type === "combo") {
      const textVal = answers[q.id + "_text"];
      const choiceVal = answers[q.id];
      const textAccepted = [q.correctText, ...(q.acceptable || [])]
          .map((x) => x.toLowerCase().trim());
      const textOk = textAccepted.includes((textVal || "").toLowerCase().trim());
      const choiceOk = choiceVal === "c";
      ok = textOk && choiceOk;
    }
    else if (q.type === "short") {
      const accepted = [q.correctText, ...(q.acceptable || [])]
          .map((x) => x.toLowerCase().trim());
      ok = accepted.includes((user || "").toLowerCase().trim());
    }

    if (ok) {
      const points = 10;
      setQuizScore(s => s + points);
      setTotalScore(s => s + points);
      setFeedback({ ok: true, msg: "PRAWIDŁOWO! +10 PKT" });
    } else {
      setFeedback({ ok: false, msg: "BŁĄD!", explanation: "Sprawdź podpowiedzi lub spróbuj zrozumieć dlaczego." });
    }
    setLocked(false);
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setFeedback(null);
    setHintLevel(0);
    setShowUsefulness(false);
    setLocked(false);

    if (qIndex < quizQuestions.length - 1) {
      setQIndex((i) => i + 1);
    } else {
      setView("minigame");
    }
  }

  /* ------------ render konkretnego pytania ------------ */
  function renderQuestionInputs() {
    const val = answers[q.id];

    if (q.type === "single") {
      return (
          <div className="space-y-3">
            {q.answers.map((a, index) => {
              const isCorrectAnswer = a.correct;
              const isSelected = val === a.id;
              const showCorrect = showResult && isCorrectAnswer;
              const showWrong = showResult && isSelected && !isCorrectAnswer;

              // Base styles from InformatykGame
              const baseClasses = "w-full justify-start text-left arcade-button transition-all duration-200 cursor-pointer p-4 text-sm border h-auto border-2 rounded-xl whitespace-normal";
              let stateClasses = "border-border bg-background text-foreground hover:border-primary hover:shadow-md hover:shadow-primary/30";

              if(showResult) {
                if (showCorrect) {
                  stateClasses = "border-accent bg-accent/20 text-accent font-bold cursor-not-allowed";
                } else if (showWrong) {
                  stateClasses = "border-destructive bg-destructive/20 text-destructive font-bold cursor-not-allowed";
                } else if (isCorrectAnswer) {
                  // Pokaż poprawną, jeśli użytkownik wybrał źle
                  stateClasses = "border-accent bg-accent/10 text-accent cursor-not-allowed";
                } else {
                  stateClasses = "border-border bg-background/50 text-muted-foreground opacity-60 cursor-not-allowed";
                }
              } else if (isSelected) {
                stateClasses = "border-primary bg-primary/20 text-primary font-bold";
              } else {
                // Default hover state
                stateClasses = "border-border bg-background text-foreground hover:border-primary hover:shadow-md hover:shadow-primary/30 hover:bg-background/5 hover:text-foreground";
              }

              return (
                  <Button
                      key={a.id}
                      onClick={() => handleSingleChoice(a.id)}
                      variant="outline"
                      disabled={showResult}
                      className={`${baseClasses} ${stateClasses}`}
                  >
                    <div className="flex items-center justify-between w-full">
                        <span className="flex-grow">
                             {a.text}
                        </span>
                      {showCorrect && <CheckCircle2 className="w-5 h-5 ml-2" />}
                      {showWrong && <XCircle className="w-5 h-5 ml-2" />}
                    </div>
                  </Button>
              )
            })}
          </div>
      );
    }
    if (q.type === "multiple") {
      return (
          <div className="space-y-3">
            {q.answers.map((a) => {
              const isSelected = (val || []).includes(a.id);
              // Stylizacja checkboxa
              const containerClass = isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 bg-background hover:shadow-md hover:shadow-primary/30";

              return (
                  <div key={a.id}
                       className={`flex items-center gap-3 p-4 border-2 rounded-xl arcade-button transition-all cursor-pointer h-auto whitespace-normal ${showResult ? 'opacity-80 pointer-events-none' : ''} ${containerClass}`}
                       onClick={() => {
                         if(showResult) return;
                         const arr = val || [];
                         updateAnswer(isSelected ? arr.filter((x: string) => x !== a.id) : [...arr, a.id]);
                       }}
                  >
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => {}} // handled by div click
                        className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-primary"
                    />
                    <span className="text-xs">{a.text}</span>
                  </div>
              )
            })}
          </div>
      );
    }
    if (q.type === "short") {
      return (
          <div className="space-y-2">
            <Input
                placeholder="Wpisz odpowiedź..."
                value={val || ""}
                onChange={(e) => updateAnswer(e.target.value)}
                disabled={showResult}
                className="border-2 border-primary/50 focus-visible:ring-0 focus-visible:border-primary text-lg p-6 rounded-xl"
            />
          </div>
      );
    }
    if (q.type === "combo") {
      return (
          <div className="space-y-4">
            {/* Input – osobny stan */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-bold uppercase">Wartość zwrotna:</label>
              <Input
                  placeholder="Wpisz wynik (np. 10)..."
                  value={answers[q.id + "_text"] || ""}
                  onChange={(e) => setAnswers((a) => ({...a, [q.id + "_text"]: e.target.value}))}
                  disabled={showResult}
                  className="border-2 border-primary/50 p-6 rounded-xl whitespace-normal"
              />
            </div>
            {/* Przyciski – osobny stan */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-bold uppercase">Opis działania:</label>
              <div className="grid grid-cols-1 gap-2">
                {q.answers.map((a, index) => (
                    <button
                        key={a.id}
                        onClick={() => updateAnswer(a.id)}
                        disabled={showResult}
                        className={`p-4 border rounded-xl h-auto whitespace-normal text-left text-sm transition-all arcade-button hover:shadow-md hover:shadow-primary/30 ${answers[q.id] === a.id ? "bg-primary/20 border-primary text-primary font-bold" : "bg-background border-border hover:border-primary"}`}
                    >
                      {a.text}
                    </button>
                ))}
              </div>
            </div>
          </div>
      );
    }
  }

  return (
      <div className="p-6 min-h-screen flex items-center justify-center bg-background/95">
        {view === "quiz" && (
            <Card className="p-6 border-4 space-y-4 max-w-3xl w-full mx-auto shadow-2xl bg-card text-card-foreground">
              <div className="text-center mb-6">
                <Code className="w-12 h-12 text-primary mx-auto mb-2 animate-pixel-float" />
                <h2 className="text-xl font-bold tracking-tight">ETAP 1: QUIZ PROGRAMISTYCZNY</h2>
                <p className="text-lg font-bold text-primary">Punkty: {totalScore}</p>
                <p className="text-xs text-muted-foreground">Pytanie {qIndex + 1}/{quizQuestions.length}. Poprawna odpowiedź: 10 PKT.</p>
              </div>

              <div className="space-y-4">
                {q.code && (
                    <div className="bg-slate-950 text-slate-100 p-4 rounded-md border-2 border-slate-800 overflow-x-auto text-sm font-mono shadow-inner">
                      <pre>{q.code}</pre>
                    </div>
                )}

                <p className="font-semibold text-lg">{q.questionText}</p>

                {renderQuestionInputs()}
              </div>

              {/* Sekcja Podpowiedzi */}
              <div className="space-y-3 pt-4 border-t border-border/50">
                {hintLevel < q.hints.length && !showResult && (
                    <Button
                        onClick={() => {
                          setHintLevel(h => h + 1);
                          setTotalScore(s => s - 2); // Koszt podpowiedzi
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full border-2 border-secondary text-secondary hover:bg-secondary/20 hover:text-white arcade-button"
                    >
                      💡 POKAŻ PODPOWIEDŹ ({hintLevel + 1}/{q.hints.length}) (KOSZT: 2 PKT)
                    </Button>
                )}

                {hintLevel > 0 && !showResult && (
                    <div className="space-y-2 animate-slide-in-up">
                      {q.hints.slice(0, hintLevel).map((h, i) => (
                          <div key={i} className="p-3 border-2 border-secondary bg-secondary/10 text-secondary text-xs rounded">
                            <span className="font-bold">Podpowiedź {i+1}:</span> {h}
                          </div>
                      ))}
                    </div>
                )}
              </div>


              {/* Result Block */}
              {showResult && feedback && (
                  <div className="space-y-4 animate-slide-in-up">
                    <div
                        className={`p-4 border-4 text-center ${
                            feedback.ok
                                ? "border-accent bg-accent/20 text-accent"
                                : "border-destructive bg-destructive/20 text-destructive"
                        }`}
                    >
                      {feedback.ok ? (
                          <>
                            <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                            <h3 className="text-lg font-bold">{feedback.msg}</h3>
                          </>
                      ) : (
                          <>
                            <XCircle className="w-8 h-8 mx-auto mb-2" />
                            <h3 className="text-lg font-bold">{feedback.msg}</h3>
                            {feedback.explanation && <p className="text-xs mt-1">{feedback.explanation}</p>}
                          </>
                      )}
                    </div>

                    <Button
                        onClick={() => setShowUsefulness(!showUsefulness)}
                        variant="outline"
                        size="sm"
                        className={`w-full border-2 ${showUsefulness ? 'border-primary/50 bg-primary/20' : 'border-border hover:border-primary/50'} text-foreground arcade-button hover:bg-primary/10 hover:text-primary-foreground`}
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      DO CZEGO PRZYDA MI SIĘ TA WIEDZA?
                    </Button>

                    {showUsefulness && (
                        <div className="p-4 border-2 border-primary/50 bg-primary/10 text-primary-foreground animate-slide-in-up rounded">
                          <ul className="text-xs list-disc ml-5 space-y-1">
                            {q.usefulness?.map((u, i) => (
                                <li key={i}>{u}</li>
                            ))}
                          </ul>
                        </div>
                    )}
                  </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                {/* Przycisk SPRAWDŹ pokazujemy tylko dla typów innych niż 'single', bo 'single' sprawdza się samo */}
                {!showResult && q.type !== "single" && (
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 arcade-button h-12 text-md tracking-wider font-bold shadow-lg shadow-primary/20" onClick={check} disabled={locked}>
                      SPRAWDŹ ODPOWIEDŹ
                    </Button>
                )}

                {showResult && (
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 arcade-button h-12 text-md tracking-wider font-bold shadow-lg shadow-primary/20" onClick={handleNextQuestion}>
                      {qIndex < quizQuestions.length - 1 ? "NASTĘPNE PYTANIE" : "PRZEJDŹ DO ETAPU 2"}
                    </Button>
                )}
              </div>
            </Card>
        )}

        {view === "minigame" && (
            <div className="flex flex-col items-center w-full">
              <div className="mb-4 text-center bg-card p-4 rounded border-2 border-border shadow-md">
                <p className="text-lg font-bold text-primary">Twój Wynik: {totalScore} PKT</p>
              </div>
              <MiniGame onFinish={() => setView("finished")} addScore={(points) => setTotalScore(s => s + points)} />
            </div>
        )}

        {view === "finished" && (
            <Card className="p-8 max-w-xl w-full text-center space-y-6 border-4 shadow-2xl animate-fade-in bg-card text-card-foreground mx-auto">
              <div className="relative inline-block">
                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce drop-shadow-md" />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">Świetna robota!</h1>
                <p className="text-muted-foreground uppercase tracking-widest text-sm">Ukończono ścieżkę Programisty</p>
              </div>

              <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-6 relative overflow-hidden">
                <span className="relative z-10 text-xs text-muted-foreground font-bold uppercase">Twój Wynik Końcowy</span>
                <div className="relative z-10 text-6xl font-black text-primary mt-2 drop-shadow-sm">{totalScore} <span className="text-2xl font-medium text-foreground/60">PKT</span></div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg text-sm border border-border/50 italic text-muted-foreground">
                {totalScore > ((quizQuestions.length * 10) + 20)
                    ? "Masz zadatki na seniora! Kod i logika nie mają przed Tobą tajemnic."
                    : "Dobre podstawy! Programowanie wymaga praktyki, więc nie poddawaj się."}
              </div>

              <Button
                  className="w-full h-12 text-lg font-bold arcade-button"
                  onClick={() => window.location.assign("/")}
              >
                WRÓĆ DO MENU
              </Button>
            </Card>
        )}
      </div>
  );
}