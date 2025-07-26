import React, { useMemo } from "react";
import { Block } from "../types";
import { getDaysInRange } from "../lib/utils";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const YearView: React.FC<{ blocks: Block[] }> = ({ blocks }) => {
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

  const renderMonth = (year: number, month: number) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dayCells = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      dayCells.push(<div key={`pad-${month}-${i}`} className="w-9 h-9"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayKey = date.toISOString().split("T")[0];
      const dayBlocks = blocksByDay.get(dayKey);
      const blockCount = dayBlocks?.length || 0;

      const bgColor = blockCount > 0 ? "bg-sky-500/80" : "bg-slate-700/50";
      const hoverBgColor =
        blockCount > 0 ? "hover:bg-sky-400" : "hover:bg-slate-600";
      const tooltipTitle = dayBlocks ? `${blockCount} block(s)` : "No blocks";

      dayCells.push(
        <div key={day} className="group relative flex justify-center">
          <div
            className={`w-9 h-9 flex items-center justify-center text-xs font-medium rounded-md ${bgColor} ${hoverBgColor} transition-colors cursor-default`}
          >
            {day}
          </div>
          <div className="absolute bottom-full mb-2 w-56 p-2 bg-slate-900 border border-slate-600 text-white text-xs rounded-lg shadow-2xl z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <p className="font-bold text-slate-200 pb-1 border-b border-slate-700 mb-2">
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="font-semibold mb-1">{tooltipTitle}</p>
            {dayBlocks && (
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {dayBlocks.map((b) => (
                  <li key={b.id}>{b.title}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );
    }

    return (
      <div key={`${year}-${month}`} className="bg-slate-800/50 p-3 rounded-lg">
        <h4 className="font-bold text-center mb-3 text-slate-200">
          {MONTH_NAMES[month]}
        </h4>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 mb-2">
          {DAY_NAMES_SHORT.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-slate-200">{dayCells}</div>
      </div>
    );
  };

  if (blocks.length === 0 && dataByYear.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-slate-400">
        <p>No block data to display. Log a new block to see the calendar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 mt-4">
      {dataByYear.map((year) => (
        <div key={year}>
          <h3 className="text-3xl font-bold text-white mb-6 text-center">
            {year}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => renderMonth(year, i))}
          </div>
        </div>
      ))}
    </div>
  );
};
