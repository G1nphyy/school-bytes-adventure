# ZESPÓŁ SZKÓŁ KOMUNIKACJI - GRA EDUKACYJNA
**Opis projektu:**
Aplikacja została stworzona, aby zaprezentować uczniom szkół podstawowych wszystkie kierunki kształcenia Zespołu Szkół Komunikacji w roku szkolnym 2026/27 i zachęcić ich do wyboru naszej szkoły.  
Gra za pomocą krótkich quizów oraz zadania otwartego pokazuje zainteresowanym czego mogą nauczyć się na danym kierunku oraz pozwala im określić czy posiadają już podstawowe umiejętności związane z wybranym kierunkiem

## Cele projektu:
* zapoznanie uczniów szkół podstawowych z kierunkami kształcenia ZSK,
* przedstawienie praktycznych aspektów nauki na poszczególnych kierunkach,
* wsparcie uczniów w wyborze przyszłej szkoły,
* nauka poprzez interakcję i elementy grywalizacji.

## Grupa docelowa:
* uczniowie klas 7–8 szkół podstawowych,
* kandydaci do Zespołu Szkół Komunikacji,
* osoby zainteresowane kierunkami technicznymi.

## Główne funkcjonalności:
Gracz ma do wyboru siedem kafelków pod którymi znajduje się dwuetapowe gra edukacyjna oraz dwa kafelki z grami nawiązującymi do codziennego życia w szkole

* Interaktywne, w pełni działające menu przekierowujące do poszczególnych sekcji
* Przekierowywanie do neutralnych stron w razie wystąpienia błędów (404 Page not found)
* Gry związane z kierunkami
    * Quiz z 7 pytaniami (jednokrotny wybór, wielkrotny wybór, króka odpowiedź)
    * System podpowiedzi
    * Przy każdym pytaniu informacja _Do czego przyda ci się ta wiedza?_
    * Zadanie złożone otwarte spersonalalizowane pod kątem kierunku kształcenia
        * __Technik automatyk:__ Gra logiczna, w której gracz musi włączyć do działania wszystkie komponenty zgodnie z instrukcją
        * __Technik elektronik:__ Gra związana z Multimetrem - gracz musi dokonać pomiarów trzech elementów
        * __Technik szerokopasmowej komunikacji elektronicznej:__ gracz musi skalibrować satelitę, aby uzyskań min. 96% sygnału
        * __Technik informatyk:__ Gracz musi złożyć komputer z części za pomocą drag & drop elementów
        * __Technik programista:__ Gracz musi złożyć kod funkcji wyszukującej największy element tablicy z rozsypnaych linii kodu za pomocą drag & drop
        * __Technik elektroenergetyk transportu szynowego:__ (Borys tekst)
        * __Technik transportu kolejowego:__ Gracz musi przeprowadzić pociąg do celu, zmieniając tory jazdy, odpowiadając przy tym na pytania z quizu

* Gry związane z życiem codziennym w szkole
    * Gra _Schody_

     Gracz wciela się w ucznia, który podczas przerwy musi przedostać się z szatni aż na 5. piętro. Korytarze i klatki schodowe są zatłoczone, dlatego zadaniem gracza jest unikanie kolizji z innymi uczniami oraz sprawne manewrowanie w tłumie.
      Sterowanie na komputerze odbywa się spacją i shiftem, a na telefon są specjalne przyciski. Shift pełni funkcję sprintu i pozwala szybciej omijać uczniów bez konsekwencji kolizjii.
      Celem gry jest dotarcie na 5. piętro w wyznaczonym czasie, co umiętnego korzystania z przycisku sprintu.

   * Gra _DSD_

   Gra DSD to dynamiczny quiz językowy oparty na pytaniach wielokrotnego wyboru (A, B, C, D) w języku niemieckim. Gracz musi jak najszybciej udzielać poprawnych odpowiedzi. Im szybsza i trafniejsza reakcja, tym więcej punktów zdobywa.
      Rozgrywka ma formę wyścigu z innymi uczniami: celem jest uzyskanie jak największej liczby punktów i zajęcie pierwszego miejsca.
      Gra rozwija znajomość języka niemieckiego i zachęca do zapisania się na program DSD I Pro poprzez dynamiczny monolog na początku gry.

## Wykorzystane technologie:
* React + TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* HTML / CSS / JavaScript

## Użyte biblioteki

#### Framework i logika:
* React, React DOM
* React Router DOM
* React Query

#### Formularze i walidacja:
* React Hook Form + Zod

#### UI i komponenty:
* Radix UI primitives
* Tailwind CSS i narzędzia utility
* Framer Motion, Recharts, Day Picker

#### Narzędzia deweloperskie:
* Vite, TypeScript, ESLint

## Wymagania systemowe
**Do uruchomienia projektu potrzebne są:**
* Node.js (zalecane ≥ 18)
* npm / yarn / pnpm
* Nowoczesna przeglądarka (Chrome, Edge, Firefox)

## Instrukcja uruchomienia
Do uruchomienia będzie potrzebna konsola (cmd) oraz adres folderu z projektem
```
cmd
npm install
npm run dev
```
Gra występuję pod adresem `http://localhost:8080`

## Struktura projektu
```
src/
 ├─ assets/            # grafiki, dźwięki, zasoby statyczne
 ├─ components/        # komponenty wielokrotnego użytku (UI)
 ├─ games/             # logika i widoki gier
 ├─ pages/             # strony aplikacji (menu, wybór gry itp.)
 ├─ data/              # pytania quizowe i dane statyczne
 ├─ hooks/             # własne hooki React
 ├─ utils/             # funkcje pomocnicze
 ├─ styles/            # style globalne
 ├─ App.tsx            # główny komponent aplikacji
 └─ main.tsx           # punkt wejścia aplikacji
```
## Dostępność i UX
Aplikacja została zaprojektowana z myślą o uczniach klas 7–8 szkół podstawowych.

* Zastosowane rozwiązania UX i dostępności:
* proste i czytelne menu kafelkowe,
* intuicyjna nawigacja bez konieczności rejestracji,
* możliwość obsługi klawiaturą (np. gra Schody),
* czytelne komunikaty i jasne instrukcje,
* kontrastowe kolory i duże przyciski,
* język dostosowany do młodszych użytkowników.

## Obsługa błędów
Projekt zawiera mechanizmy zapobiegające nieoczekiwanym błędom.
* dedykowana strona 404 - Page not found
* bezpieczne przekierowanie w przypadku nieprawidłowych adresów
* zabezpieczenie przed niepoprawnym przebiegiem gry
* komunikaty informujące użytkownika o błędach lub zakończeniu gry

## Kierunki rozwoju
Projekt przez swoją strukturę jest łatwy w aktualizacji, można bez problemu dodawać/usuwać kierunki i przystosowywać go do nowych rekrutacji. Możliwa jest również rozbudowa bazy pytań oraz aktualizacja pytań otwartych względem wymagań dla danego kierunku.

## Autorzy
**Autorzy projektu:**
* Jan Sammler (gry kierunkowe, dokumentacja)
* Borys Kędziora (oprawa graficzna, gry kierunkowe)
* Maksym Demchenko (Grafiki, gry związane z codziennością w szkole)

**Rok szkolny: 2025/26**
