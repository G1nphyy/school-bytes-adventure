// ElevatorGame.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/*******************************************************
 *  CONFIG – łatwo zmienić balans
 ******************************************************/
const FLOORS        = 7;        // -1 … 5  (6 poziomów do przebycia)
const TIME_LIMIT    = 5 * 60;   // 5 minut w sekundach
const STEP_TIME     = 0.8;      // sekundy na jeden ruch
const NPC_COUNT     = 18;       // liczba NPC
const TEACHER_COUNT = 4;        // liczba nauczycieli (blokują drogę)

type Entity = { id: number; floor: number; col: number; type: 'student' | 'teacher' };

export default function ElevatorGame() {
  /*******************************************************
   *  STAN
   ******************************************************/
  const [player, setPlayer]   = useState({ floor: -1, col: 3 });   // start: piwnica
  const [npc, setNpc]         = useState<Entity[]>([]);
  const [timeLeft, setTimeLeft]= useState(TIME_LIMIT);
  const [status, setStatus]   = useState<'play' | 'win' | 'lose'>('play');
  const [log, setLog]         = useState<string[]>([]);

  /*******************************************************
   *  INICJALIZACJA NPC
   ******************************************************/
  useEffect(() => {
    const initial: Entity[] = [];
    let id = 0;
    // uczniowie – przeszkadzają, ale da się przejść
    for (let i = 0; i < NPC_COUNT; i++) {
      initial.push({ id: id++, floor: randInt(0, FLOORS - 1), col: randInt(0, 6), type: 'student' });
    }
    // nauczyciele – stoją nieruchomo, blokują korytarz
    for (let i = 0; i < TEACHER_COUNT; i++) {
      initial.push({ id: id++, floor: randInt(1, FLOORS - 2), col: randInt(0, 6), type: 'teacher' });
    }
    setNpc(initial);
  }, []);

  /*******************************************************
   *  LICZNIK CZASU
   ******************************************************/
  useEffect(() => {
    if (status !== 'play') return;
    const tick = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { setStatus('lose'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [status]);

  /*******************************************************
   *  RUCH GRACZA
   ******************************************************/
  const move = useCallback(
    (dir: 'up' | 'down' | 'left' | 'right') => {
      if (status !== 'play') return;
      setPlayer((p) => {
        let { floor, col } = p;
        if (dir === 'up' && floor < FLOORS - 1) floor++;
        if (dir === 'down' && floor > -1) floor--;
        if (dir === 'left' && col > 0) col--;
        if (dir === 'right' && col < 6) col++;

        // czy nie wpadamy na nauczyciela?
        const blocked = npc.some((n) => n.floor === floor && n.col === col && n.type === 'teacher');
        if (blocked) {
          addLog('Nauczyciel zablokował drogę!');
          return p; // cofamy ruch
        }
        addLog(`Przeszedłeś na piętro ${floor}`);
        if (floor === FLOORS - 1) setStatus('win');
        return { floor, col };
      });
    },
    [status, npc]
  );

  /*******************************************************
   *  LOSOWE PORUSZANIE NPC (co krok)
   ******************************************************/
  useEffect(() => {
    if (status !== 'play') return;
    const int = setInterval(() => {
      setNpc((list) =>
        list.map((n) => {
          if (n.type === 'teacher') return n; // nauczyciel stoi
          // student – losowy krok w lewo/prawo
          const dir = Math.random() < 0.5 ? -1 : 1;
          const newCol = Math.max(0, Math.min(6, n.col + dir));
          return { ...n, col: newCol };
        })
      );
    }, STEP_TIME * 1000);
    return () => clearInterval(int);
  }, [status]);

  /*******************************************************
   *  OBSŁUGA KLAWIATURY
   ******************************************************/
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') move('up');
      if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') move('down');
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') move('left');
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') move('right');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move]);

  /*******************************************************
   *  POMOCNICZE
   ******************************************************/
  const addLog = (txt: string) => setLog((l) => [txt, ...l].slice(0, 4));
  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  /*******************************************************
   *  RENDER
   ******************************************************/
  return (
    <Card className="p-4 max-w-3xl mx-auto text-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="font-semibold">Piętro: {player.floor}  |  Kolumna: {player.col}</div>
        <div className={`font-bold ${timeLeft < 60 ? 'text-red-600' : ''}`}>Czas: {fmtTime(timeLeft)}</div>
      </div>

      {/* plansza – 7 pięter × 7 kolumn */}
      <div className="grid grid-cols-7 gap-1 mb-3 select-none">
        {[...Array(FLOORS)].map((_, f) => (
          <React.Fragment key={f}>
            {[...Array(7)].map((_, c) => {
              const isPlayer = player.floor === FLOORS - 1 - f && player.col === c;
              const ent = npc.find((n) => n.floor === FLOORS - 1 - f && n.col === c);
              const cell =
                isPlayer ? 'bg-blue-500 text-white' :
                ent?.type === 'teacher' ? 'bg-red-500 text-white' :
                ent ? 'bg-yellow-300' :
                'bg-gray-100';
              return (
                <div key={c} className={`h-12 flex items-center justify-center border rounded ${cell}`}>
                  {isPlayer ? 'TY' : ent?.type === 'teacher' ? 'N' : ent ? 'U' : ''}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* przyciski sterujące (opcjonalnie) */}
      <div className="grid grid-cols-3 gap-2 w-48 mx-auto mb-3">
        <div />
        <Button size="sm" onClick={() => move('up')}>Góra ↑</Button>
        <div />
        <Button size="sm" onClick={() => move('left')}>← Lewo</Button>
        <Button size="sm" onClick={() => move('down')}>Dół ↓</Button>
        <Button size="sm" onClick={() => move('right')}>Prawo →</Button>
      </div>

      {/* komunikaty */}
      {status === 'win' && <div className="text-green-700 font-bold mb-2">🎉 Dotarłeś na 6. piętro – wygrałeś!</div>}
      {status === 'lose' && <div className="text-red-700 font-bold mb-2">⏰ Czas minął – przegrałeś.</div>}

      {/* log akcji */}
      <div className="text-xs text-muted-foreground max-h-16 overflow-auto">
        {log.map((l, i) => (
          <div key={i}>• {l}</div>
        ))}
      </div>

      {/* reset */}
      <div className="mt-4 text-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setPlayer({ floor: -1, col: 3 });
            setTimeLeft(TIME_LIMIT);
            setStatus('play');
            setLog([]);
            setTaskOk(false);
            setIndex(0);
          }}
        >
          Nowa gra
        </Button>
      </div>
    </Card>
  );
}