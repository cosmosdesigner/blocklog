// src/hooks/useRandomColor.ts
import { useCallback } from "react";

export default function () {
  const generateRandomHexColor = useCallback((): string => {
    let color: string;
    let luminance: number;

    do {
      color = Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0");

      // Calculate relative luminance
      const r = parseInt(color.slice(0, 2), 16);
      const g = parseInt(color.slice(2, 4), 16);
      const b = parseInt(color.slice(4, 6), 16);

      // Using formula for relative luminance (sRGB)
      luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    } while (luminance > 0.5); // Keep trying until the color is dark enough

    return `#${color}`;
  }, []);

  return { generateRandomHexColor };
}
