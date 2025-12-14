/* ------------------------------------------------------------------ */
/*  ProgrammerGame.tsx  – działający DnD + kolor przycisku            */
/* ------------------------------------------------------------------ */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

/* ----------------- dane quizowe (7 pytań) ----------------- */
const quizQuestions = [
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
    code: `int liczbaParzystych() {
\tint licznik = 0;
\tfor (int i = 1; i <= 10; ++i) {
\t\tif (i % 2 == 0) {
\t\t\t++licznik;
\t\t}
\t}
\treturn licznik;
}`,
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
  ],
  correct: [
    "function findMax(arr) {",
    "let max = arr[0];",
    "for(const x of arr) {",
    "if(x > max) max = x;",
    "}",
    "return max;",
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
function MiniGame({ onFinish }: { onFinish: () => void }) {
  /* ============= UWAGA: DndProvider MUSI być tutaj, inaczej DnD nie działa ============= */
  return (
    <DndProvider backend={HTML5Backend}>
      <MiniGameInner onFinish={onFinish} />
    </DndProvider>
  );
}

function MiniGameInner({ onFinish }: { onFinish: () => void }) {
  const [pool, setPool] = useState(() => shuffle(editorTask.pool));
  const [rows, setRows] = useState(() => Array(editorTask.correct.length).fill(null));
  const [feedback, setFeedback] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hintsVisible, setHintsVisible] = useState(0);
  const [successPending, setSuccessPending] = useState(false);
  const successTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [usefulnessVisible, setUsefulnessVisible] = useState(false);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const dropFromPoolToRow = useCallback((poolIndex: number, rowIndex: number) => {
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
  }, []);

  const moveRowToRow = useCallback((fromRow: number, toRow: number) => {
    setRows((prev) => {
      const copy = [...prev];
      const tmp = copy[fromRow];
      copy[fromRow] = copy[toRow];
      copy[toRow] = tmp;
      return copy;
    });
  }, []);

  const moveRowToPool = useCallback((rowIndex: number) => {
    setRows((prev) => {
      const copy = [...prev];
      const item = copy[rowIndex];
      copy[rowIndex] = null;
      if (item) setPool((p) => [...p, item]);
      return copy;
    });
  }, []);

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
    const isCorrect = JSON.stringify(rows) === JSON.stringify(editorTask.correct);
    setAttempts((a) => a + 1);
    if (isCorrect) {
      setFeedback("✅ Poprawnie! Za 5 sekund przejdziesz dalej...");
      setSuccessPending(true);
      successTimerRef.current = setTimeout(() => {
        setFeedback("");
        setSuccessPending(false);
        onFinish();
      }, 5000);
    } else {
      setFeedback("❌ Kolejność nie jest poprawna — popraw i sprawdź ponownie.");
      setHintsVisible((h) => Math.min(editorTask.hints.length, h + 1));
    }
  }, [rows, onFinish]);

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
    <Card className="p-6 border-4 space-y-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold">Mini-gra: Rozsypany kod</h2>
      <p className="text-sm italic">{editorTask.lore}</p>
      <p className="font-semibold">{editorTask.question}</p>

      {/* IDE-like editor */}
      <div className="mt-3">
        <div className="bg-slate-800 rounded-md p-3">
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
        <div ref={dropToPool} className="min-h-[80px] p-2 border-2 border-dashed rounded bg-gray-100 flex flex-wrap">
          {pool.length === 0 ? (
            <div className="text-xs italic text-gray-500">Brak dostępnych fragmentów (wszystkie są umieszczone w wierszach)</div>
          ) : (
            pool.map((t, i) => <PoolBlock key={i} text={t} idx={i} />)
          )}
        </div>
      </div>

      {/* Hints */}
      <div className="mt-2">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">Podpowiedzi</h4>
          <div className="text-xs text-gray-400">pokazane: {hintsVisible}/{editorTask.hints.length}</div>
        </div>
        <div className="mt-2 space-y-1">
          {editorTask.hints.slice(0, hintsVisible).map((h, i) => (
            <div key={i} className="text-xs p-2 bg-yellow-50 border rounded text-gray-700">{h}</div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setHintsVisible((h) => Math.min(editorTask.hints.length, h + 1))}>
            Pokaż kolejną podpowiedź
          </Button>
          {/* ============= POPRAWIONY KOLOR ============= */}
          <Button size="sm" variant="secondary" onClick={() => setHintsVisible(0)}>
            Resetuj podpowiedzi
          </Button>
        </div>
      </div>

      {/* Usefulness – pokazywane / ukrywane */}
      <div className="mt-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setUsefulnessVisible((v) => !v)}
        >
          {usefulnessVisible ? "Ukryj" : "Pokaż"} – Do czego przyda mi się ta wiedza?
        </Button>

        <AnimatePresence>
          {usefulnessVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-2 p-3 bg-secondary/10 border rounded">
                <h4 className="font-semibold">Do czego przyda mi się ta wiedza?</h4>
                <ul className="text-xs list-disc ml-5 mt-2">
                  {editorTask.usefulness.map((u, i) => (
                    <li key={i}>{u}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feedback */}
      <div>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-2 rounded ${feedback.startsWith("✅") ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"}`}
          >
            {feedback}
          </motion.div>
        )}
        {!feedback && placedCount > 0 && <div className="text-xs text-gray-400 mt-1">Umieszczono {placedCount}/{rows.length} fragmentów</div>}
      </div>

      {/* Controls */}
      <div className="flex gap-2 mt-3">
        <Button className="w-full" onClick={validate} disabled={successPending}>
          Sprawdź
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => {
            setPool(shuffle(editorTask.pool));
            setRows(Array(editorTask.correct.length).fill(null));
            setFeedback("");
            setHintsVisible(0);
            setAttempts(0);
          }}
        >
          Resetuj
        </Button>
      </div>

      <div className="text-xs text-gray-500 mt-1">
        Jeśli odpowiedź jest niepoprawna — poprawiaj do skutku. Po poprawnym ułożeniu nastąpi 5-sekundowe opóźnienie, a następnie automatyczne przejście dalej.
      </div>
    </Card>
  );
}

/* ==================================================================== */
/* ===================== GŁÓWNY KOMPONENT – QUIZ ====================== */
/* ==================================================================== */

export default function ProgrammerGame() {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = quizQuestions[qIndex];

  /* ------------ pomoc ------------ */
  const updateAnswer = (val: any) => setAnswers((a) => ({ ...a, [q.id]: val }));

  const check = () => {
    const user = answers[q.id];
    let ok = false;

    if (q.type === "single") ok = user === q.answers.find((x) => x.correct)?.id;
    if (q.type === "multiple") ok = JSON.stringify((user || []).sort()) === JSON.stringify(q.correct?.sort());
    if (q.type === "short" || q.type === "combo") {
      const accepted = [q.correctText, ...(q.acceptable || [])].map((x) => x.toLowerCase().trim());
      ok = accepted.includes((user || "").toLowerCase().trim());
    }

    setFeedback({ ok, msg: ok ? "🎉 Dobrze!" : "❌ Źle – spróbuj ponownie." });

    if (ok && !answers[q.id + "_scored"]) {
      setScore((s) => s + 1);
      setAnswers((a) => ({ ...a, [q.id + "_scored"]: true }));
    }

    if (ok) {
      setTimeout(() => {
        if (qIndex < quizQuestions.length - 1) {
          setQIndex((i) => i + 1);
          setFeedback(null);
        } else {
          setFinished(true);
        }
      }, 1500);
    }
  };

  /* ------------ ekran końcowy ------------ */
  if (finished)
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-xl w-full text-center space-y-4">
          <h1 className="text-2xl font-bold">Quiz zakończony!</h1>
          <p className="text-lg">
            Twój wynik: <span className="font-semibold text-primary">{score}</span> / {quizQuestions.length}
          </p>
          <p className="text-sm text-gray-600">
            Liczone są tylko punkty za pierwszą poprawną odpowiedź.
          </p>
          <Button className="w-full" onClick={() => window.location.assign("/menu")}>
            Powrót do menu
          </Button>
        </Card>
      </div>
    );

  /* ------------ podpowiedzi & „do czego przyda mi się” ------------ */
  const [hintsOpen, setHintsOpen] = useState(false);
  const [useOpen, setUseOpen] = useState(false);

  /* ------------ render konkretnego pytania ------------ */
  function renderQuestion() {
    const val = answers[q.id];
    if (q.type === "single")
      return (
        <div className="grid grid-cols-2 gap-2">
          {q.answers.map((a) => (
            <button
              key={a.id}
              onClick={() => updateAnswer(a.id)}
              className={`p-3 border rounded text-left ${val === a.id ? "bg-primary/20 border-primary" : "bg-background border-border"}`}
            >
              {a.text}
            </button>
          ))}
        </div>
      );

    if (q.type === "multiple")
      return (
        <div className="space-y-2">
          {q.answers.map((a) => (
            <label key={a.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={(val || []).includes(a.id)}
                onCheckedChange={(chk) => {
                  const arr = val || [];
                  updateAnswer(chk ? [...arr, a.id] : arr.filter((x: string) => x !== a.id));
                }}
              />
              <span>{a.text}</span>
            </label>
          ))}
        </div>
      );

    if (q.type === "short" || q.type === "combo")
      return (
        <div className="space-y-3">
          <Input placeholder="Wpisz odpowiedź..." value={val || ""} onChange={(e) => updateAnswer(e.target.value)} />
          {q.type === "combo" && (
            <div className="grid grid-cols-2 gap-2">
              {q.answers.map((a) => (
                <button
                  key={a.id}
                  onClick={() => updateAnswer(a.id)}
                  className={`p-3 border rounded text-left ${val === a.id ? "bg-primary/20 border-primary" : "bg-background border-border"}`}
                >
                  {a.text}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    return null;
  }

  /* ------------ główny UI ------------ */
  return (
    <div className="p-6">
      <Card className="p-6 border-4 space-y-4 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold">Pytanie {qIndex + 1}/{quizQuestions.length}</h2>
        {q.code && (
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-md overflow-x-auto text-sm">
            <code>{q.code}</code>
          </pre>
        )}
        <p className="font-semibold">{q.questionText}</p>

        {renderQuestion()}

        {/* feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3 rounded border ${feedback.ok ? "bg-green-50 border-green-300 text-green-800" : "bg-red-50 border-red-300 text-red-800"}`}
            >
              {feedback.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* przyciski pomocy */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setHintsOpen((v) => !v)}>
            Podpowiedzi
          </Button>
          <Button size="sm" variant="outline" onClick={() => setUseOpen((v) => !v)}>
            Do czego przyda mi się ta wiedza?
          </Button>
        </div>

        {/* podpowiedzi */}
        <AnimatePresence>
          {hintsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 space-y-1">
                {q.hints?.map((h, i) => (
                  <div key={i} className="text-xs p-2 bg-yellow-50 border rounded text-gray-700">
                    {h}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* usefulness */}
        <AnimatePresence>
          {useOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 p-3 bg-secondary/10 border rounded">
                <h4 className="font-semibold">Do czego przyda mi się ta wiedza?</h4>
                <ul className="text-xs list-disc ml-5 mt-2">
                  {q.usefulness?.map((u, i) => (
                    <li key={i}>{u}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* sprawdź */}
        <div className="flex gap-2 mt-4">
          <Button className="w-full" onClick={check}>
            Sprawdź
          </Button>
        </div>
      </Card>
    </div>
  );
}