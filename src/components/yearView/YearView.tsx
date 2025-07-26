import React from "react";
import { Block } from "../../../types";
import useYearView from "./hooks/useYearView";
import DayCell from "./components/dayCell";
import Month from "./components/Month";
import CalendarEmptyState from "./components/calendarEmptyState";
import Calendar from "./components/Calendar";

export const YearView: React.FC<{ blocks: Block[] }> = ({ blocks }) => {
  const { blocksByDay, dataByYear } = useYearView(blocks);

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

      dayCells.push(<DayCell day={day} dayBlocks={dayBlocks} date={date} />);
    }

    return <Month key={`${year}-${month}`} dayCells={dayCells} month={month} />;
  };

  if (blocks.length === 0 && dataByYear.length === 0) {
    return <CalendarEmptyState />;
  }

  return <Calendar dataByYear={dataByYear} renderMonth={renderMonth} />;
};
