/** Główny punkt wejścia JavaScript: inicjalizuje Reacta, renderuje komponent <App /> w kontenerze DOM o id "root" oraz importuje globalne style CSS. */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
