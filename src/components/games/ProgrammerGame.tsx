// ProgrammerGame.tsx
import React, { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/* 6 zadań – szkolne lore */
const tasks = [
  {
    id: 1,
    type: 'drag-code-blocks',
    lore: 'Na lekcji informatyki układasz własną funkcję. Przeciągnij klocki, aby stworzyć kod zwracający sumę dwóch liczb.',
    question: 'Ułóż klocki tak, aby powstała funkcja sumująca dwa argumenty',
    pool: ['return a + b;', 'function suma(a, b)', '{', '}'],
    correct: ['function suma(a, b)','{', 'return a + b;', '}'],
    hints: ['Zacznij od słowa kluczowego function', 'Nazwa funkcji to „suma”', 'Na końcu musi być zamykający nawias klamrowy'],
  },
  {
    id: 2,
    type: 'pseudo-select',
    lore: 'Na sprawdzianie z algorytmów musisz wybrać właściwy pseudokod pętli.',
    question: 'Wybierz pseudokod wypisujący liczby 1‑5',
    options: ['Dla i od 1 do 5 wykonaj: wypisz i', 'Dla i od 0 do 4 wykonaj: wypisz i', 'Dla i od 1 do 10 wykonaj: wypisz i'],
    correct: 0,
    hints: ['Pętla musi zaczynać się od 1', 'Kończyć się na 5', 'To dokładnie 5 powtórzeń'],
  },
  {
    id: 3,
    type: 'choice',
    lore: 'Na lekcji JavaScript nauczyciel pyta o typ danych.',
    question: 'Co zwróci typeof null ?',
    options: ['null', 'object', 'undefined', 'string'],
    correct: 1,
    hints: ['To pułapka egzaminacyjna', 'Wynik to „object”', 'Taka specyfika JS'],
  },
  {
    id: 4,
    type: 'fill-missing',
    lore: 'Masz niedokończony skrypt – brakuje fragmentu warunku.',
    question: 'Uzupełnij kod, aby funkcja zwracała true tylko dla liczb parzystych',
    codeTemplate: 'function isEven(num) {\n  return /* MISSING */;\n}',
    answers: ['num % 2 === 0', 'num / 2', 'num == 2'],
    correct: 'num % 2 === 0',
    hints: ['% to reszta z dzielenia', 'Parzysta = reszta 0', 'Porównujemy do 0'],
  },
  {
    id: 5,
    type: 'order',
    lore: 'Sortowanie bąbelkowe – układasz kroki w prawidłowej kolejności.',
    question: 'Ułóż kroki algorytmu sortowania bąbelkowego',
    steps: ['Porównaj sąsiednie elementy', 'Powtarzaj aż lista będzie posortowana', 'Jeśli elementy są w złej kolejności – zamień je', 'Przejdź po liście od początku do końca'],
    correctOrder: [1, 3, 0, 2],
    hints: ['Najpierw ogólna idea', 'Potem przejście', 'Porównanie', 'Ewentualna zamiana'],
  },
  {
    id: 6,
    type: 'drag-pseudocode-blocks',
    lore: 'Ostatnie zadanie – tworzysz algorytm znajdowania maksimum z tablicy.',
    question: 'Przeciągnij klocki, aby powstał algorytm max z tablicy',
    pool: ['ustaw max na pierwszy element', 'dla każdego elementu w tablicy', 'jeśli element > max, ustaw max = element', 'zwróć max'],
    correct: ['ustaw max na pierwszy element', 'dla każdego elementu w tablicy', 'jeśli element > max, ustaw max = element', 'zwróć max'],
    hints: ['Najpierw musisz mieć wartość startową', 'Potem przejrzyj wszystkie', 'Porównuj i ewentualnie zamień', 'Zwróć wynik'],
  },
];

/* utils */
const ItemTypes = { BLOCK: 'block' };
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* klocek */
function Block({ text, index, moveBlock, parent }: { text: string; index: number; moveBlock: (d: number, h: number) => void; parent: string }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BLOCK,
    item: { text, index, parent },
    collect: (m) => ({ isDragging: !!m.isDragging() }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.BLOCK,
    hover(item: any) {
      if (item.parent === parent && item.index !== index) {
        moveBlock(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} className="px-3 py-2 m-1 border rounded cursor-move bg-white shadow text-black" style={{ opacity: isDragging ? 0.4 : 1 }}>
      {text}
    </div>
  );
}

/* komponent z klockami */
function DragBlocksTask({ task, onResult }: { task: any; onResult: (ok: boolean) => void }) {
  const [pool, setPool] = useState(() => shuffle([...task.pool]));
  const [user, setUser] = useState<string[]>([]);

  const [, dropToUser] = useDrop({ accept: ItemTypes.BLOCK, drop(item: any) { if (item.parent === 'pool' && !user.includes(item.text)) { setUser((u) => [...u, item.text]); setPool((p) => p.filter((t) => t !== item.text)); } } });
  const [, dropToPool] = useDrop({ accept: ItemTypes.BLOCK, drop(item: any) { if (item.parent === 'user') { setPool((p) => [...p, item.text]); setUser((u) => u.filter((t) => t !== item.text)); } } });

  const ok = JSON.stringify(user) === JSON.stringify(task.correct);
  React.useEffect(() => { if (user.length === task.correct.length) onResult(ok); }, [user, ok, task.correct, onResult]);

  return (
    <div className="space-y-4">
      <div className="text-xs text-muted-foreground">Przeciągnij klocki poniżej, aby ułożyć kod:</div>
      <div ref={dropToPool} className="min-h-[60px] p-2 border-2 border-dashed rounded bg-gray-50 flex flex-wrap">
        {pool.map((t, i) => <Block key={i} text={t} index={i} moveBlock={(a, b) => { const dragBlock = pool[a]; const newPool = [...pool]; newPool.splice(a, 1); newPool.splice(b, 0, dragBlock); setPool(newPool); }} parent="pool" />)}
      </div>
      <div ref={dropToUser} className="min-h-[60px] p-2 border-2 border-dashed rounded bg-green-50 flex flex-wrap">
        {user.map((t, i) => <Block key={i} text={t} index={i} moveBlock={(a, b) => { const dragBlock = user[a]; const newUser = [...user]; newUser.splice(a, 1); newUser.splice(b, 0, dragBlock); setUser(newUser); }} parent="user" />)}
      </div>
      {user.length === task.correct.length && (
        <p className="text-sm">{ok ? <span className="text-green-600 font-semibold">✅ Dobrze! Możesz iść dalej.</span> : <span className="text-red-600 font-semibold">❌ Źle – spróbuj ponownie!</span>}</p>
      )}
    </div>
  );
}

/* główny komponent */
export default function ProgrammerGame() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<any>(null);
  const [ordered, setOrdered] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [taskOk, setTaskOk] = useState(false);

  const task = tasks[index];

  const checkAnswer = () => {
    let ok = false;
    if (task.type === 'drag-code-blocks' || task.type === 'drag-pseudocode-blocks') ok = taskOk;
    else if (task.type === 'order') ok = JSON.stringify(ordered) === JSON.stringify(task.correctOrder);
    else ok = selected === task.correct;
    setShowResult(true);
    if (!ok) setTimeout(() => setShowResult(false), 1200);
  };

  const next = () => {
    if (index < tasks.length - 1) { setIndex(index + 1); setSelected(null); setOrdered([]); setHintLevel(0); setShowResult(false); setTaskOk(false); }
  };

  /* ----------- RENDER ----------- */
  return (
    <DndProvider backend={HTML5Backend}> {}
      <Card className="p-6 border-4 border-border space-y-4 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-primary">Zadanie {index + 1}/6</h2>
        <p className="text-sm italic text-muted-foreground">{task.lore}</p>
        <h3 className="font-semibold">{task.question}</h3>

        {/* zad 1 i 6 (zrobiłem co mogłem) */}
        {(task.type === 'drag-code-blocks' || task.type === 'drag-pseudocode-blocks') && (
          <DragBlocksTask task={task} onResult={setTaskOk} />
        )}

        {/* zad2 (takie basic) */}
        {task.type === 'pseudo-select' && (
          <div className="space-y-2">
            {task.options.map((o, i) => <button key={i} onClick={() => setSelected(i)} className={`p-2 w-full border text-left text-xs rounded ${selected === i ? 'bg-primary/20 border-primary' : 'bg-background border-border'}`}>{o}</button>)}
            {showResult && <p className="text-sm">{selected === task.correct ? '🎉 Brawo!' : '❌ Zła odpowiedź'}</p>}
          </div>
        )}

        {/* zad3 (zdecydowanie do wymiany) */}
        {task.type === 'choice' && (
          <div className="space-y-2">
            {task.options.map((o, i) => <button key={i} onClick={() => setSelected(i)} className={`p-2 w-full border text-left text-xs rounded ${selected === i ? 'bg-primary/20 border-primary' : 'bg-background border-border'}`}>{o}</button>)}
            {showResult && <p className="text-sm">{selected === task.correct ? '🌟 Dobrze!' : '❌ Niepoprawnie'}</p>}
          </div>
        )}

        {/* zad4 (też bym wymienił idk) */}
        {task.type === 'fill-missing' && (
          <div>
            <pre className="p-3 bg-muted border-2 border-border text-xs mb-2 rounded">{task.codeTemplate}</pre>
            <div className="flex gap-2 flex-wrap">{task.answers.map((a) => <button key={a} onClick={() => setSelected(a)} className={`px-3 py-2 border rounded text-xs ${selected === a ? 'bg-primary/20 border-primary' : 'bg-background border-border'}`}>{a}</button>)}</div>
            {showResult && <p className="mt-3 text-sm">{selected === task.correct ? '✔️ Poprawnie' : '❌ Błędnie'}</p>}
          </div>
        )}

        {/* zad5 (to akurat fajne zadanie) */}
        {task.type === 'order' && (
          <div>
            <p className="text-xs mb-2">Kliknij kroki w odpowiedniej kolejności:</p>
            <div className="flex flex-col gap-2">{task.steps.map((step, i) => <button key={i} onClick={() => setOrdered((prev) => (prev.includes(i) ? prev : [...prev, i]))} className={`p-2 border text-xs text-left rounded ${ordered.includes(i) ? 'bg-primary/20 border-primary' : 'bg-background border-border'}`}>{step}</button>)}</div>
            {showResult && <p className="mt-3 text-sm">{JSON.stringify(ordered) === JSON.stringify(task.correctOrder) ? '🏆 Idealna kolejność!' : '❌ Kolejność niepoprawna'}</p>}
          </div>
        )}

        {/* Podpowiedzi */}
        {!showResult && hintLevel < task.hints.length && <Button size="sm" variant="outline" className="w-full" onClick={() => setHintLevel(hintLevel + 1)}>💡 Podpowiedź ({hintLevel}/{task.hints.length})</Button>}
        {hintLevel > 0 && !showResult && <div className="space-y-1">{task.hints.slice(0, hintLevel).map((h, i) => <p key={i} className="text-xs bg-secondary/20 p-2 border border-secondary rounded">👉 {h}</p>)}</div>}

        {/*Przyciski*/}
        <div className="flex gap-2 mt-4">
          {!showResult && <Button className="w-full" onClick={checkAnswer}>SPRAWDŹ</Button>}
          {showResult && (index < tasks.length - 1 ? <Button className="w-full" onClick={next}>DALEJ →</Button> : <Button className="w-full" onClick={() => alert('Gratulacje! 🎉 Rozwiązałeś wszystkie zadania.')}>KONIEC</Button>)}
        </div>
      </Card>
    </DndProvider>
  );
}