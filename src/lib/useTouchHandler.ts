// helper: binduje onTouchStart + onClick i zapobiega podwójnemu wywołaniu akcji na urządzeniach dotykowych
import { useRef, useCallback } from "react";

export function useTouchHandler() {
  // flaga informująca, że action została już wywołana przez touchstart
  const touchTriggeredRef = useRef(false);

  const bind = useCallback((handler: (e?: any) => void) => {
    return {
      onTouchStart: (e: React.TouchEvent) => {
        // zapobiegamy domyślnej selekcji, ale nie zawsze trzeba
        try { e.preventDefault(); } catch {}
        touchTriggeredRef.current = true;
        handler(e);
      },
      onClick: (e: React.MouseEvent) => {
        // jeśli wcześniej było touchstart, ignorujemy click (unikamy double-call)
        if (touchTriggeredRef.current) {
          touchTriggeredRef.current = false;
          return;
        }
        handler(e);
      },
    };
  }, []);

  return bind;
}