import { Block } from "@/types";

interface IDayCell {
  day: number;
  dayBlocks?: Block[];
  date: Date;
}

const DayCell = ({ date, day, dayBlocks }: IDayCell) => {
  const blockCount = dayBlocks?.length || 0;

  const bgColor = blockCount > 0 ? "bg-sky-500/80" : "bg-slate-700/50";
  const hoverBgColor =
    blockCount > 0 ? "hover:bg-sky-400" : "hover:bg-slate-600";
  const tooltipTitle = dayBlocks ? `${blockCount} block(s)` : "No blocks";
  return (
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
};

export default DayCell;
