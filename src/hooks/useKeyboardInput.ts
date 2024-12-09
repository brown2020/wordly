import { useEffect, useCallback } from "react";

export const useKeyboardInput = (handleKeyPress: (key: string) => void) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      handleKeyPress(e.key);
    },
    [handleKeyPress]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
};
