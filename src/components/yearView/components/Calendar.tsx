import { JSX } from "react";

interface ICalendar {
  dataByYear: number[];
  renderMonth: (year: number, month: number) => JSX.Element;
}

const Calendar = ({ dataByYear, renderMonth }: ICalendar) => {
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

export default Calendar;
