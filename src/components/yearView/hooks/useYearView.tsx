import { getDaysInRange } from "@/src/lib/utils";
import { Block } from "@/types";
import { useMemo } from "react";

export default function useYearView(blocks: Block[]) {
  const blocksByDay = useMemo(() => {
    const data = new Map<string, Block[]>();
    blocks.forEach((block) => {
      const start = new Date(block.created);
      const end = block.created ? new Date(block.resolved) : new Date();
      const range = getDaysInRange(start, end);
      range.forEach((day) => {
        const key = day.toISOString().split("T")[0]; // "YYYY-MM-DD"
        const existing = data.get(key) || [];
        if (!existing.some((b) => b.id === block.id)) {
          data.set(key, [...existing, block]);
        }
      });
    });
    return data;
  }, [blocks]);

  const dataByYear = useMemo(() => {
    const years: { [year: number]: boolean } = {};
    if (blocks.length === 0) {
      years[new Date().getFullYear()] = true;
    } else {
      blocks.forEach((block) => {
        years[new Date(block.created).getFullYear()] = true;
        if (block.resolved) {
          years[new Date(block.created).getFullYear()] = true;
        }
      });
    }
    return Object.keys(years)
      .map(Number)
      .sort((a, b) => b - a);
  }, [blocks]);

  return { blocksByDay, dataByYear };
}
