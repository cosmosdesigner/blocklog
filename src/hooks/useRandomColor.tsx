// src/hooks/useRandomColor.ts
import { useCallback } from "react";

export default function () {
  const generateRandomHexColor = useCallback((): string => {
    // Generate a random number between 0 and 16777215 (FFFFFF in decimal)
    // Convert it to a hexadecimal string, and pad with leading zeros if necessary
    // to ensure it's always 6 characters long.
    return (
      "#" +
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")
    );
    [6, 9, 10, 11, 12];
  }, []); // The empty dependency array ensures this function is memoized and doesn't change on re-renders.

  return { generateRandomHexColor };
}
