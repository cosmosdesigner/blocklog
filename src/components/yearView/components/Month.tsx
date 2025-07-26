import { DAY_NAMES_SHORT, MONTH_NAMES } from "@/src/lib/const";
import { JSX } from "react";

interface IMonth {
  dayCells: JSX.Element[];
  month: number;
}
const Month = ({ dayCells, month }: IMonth) => {
  return (
    <div className="bg-slate-800/50 p-3 rounded-lg">
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

export default Month;
