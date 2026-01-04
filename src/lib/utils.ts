/** * Narzędzie pomocnicze do warunkowego łączenia klas Tailwind CSS. Rozwiązuje konflikty klas i pozwala na czyste formatowanie. */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
