import React, { useMemo } from 'react';
import { useNutritionStore, filterLogsByDate, calculateScoreForLogs } from '../store';

export const ActivityHeatmap: React.FC = () => {
  const logs = useNutritionStore((state) => state.logs);

  const days = useMemo(() => {
    const today = new Date();
    const result = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayLogs = filterLogsByDate(logs, d);
      const score = calculateScoreForLogs(dayLogs);
      result.push({ date: d, score, hasData: dayLogs.length > 0 });
    }
    return result;
  }, [logs]);

  const getColor = (item: { score: number; hasData: boolean }) => {
    if (!item.hasData) return 'bg-zen-sand/20';
    if (item.score > 80) return 'bg-zen-sage';
    if (item.score > 50) return 'bg-zen-rose';
    return 'bg-zen-clay';
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-zen-sand shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-zen-slate/50 uppercase tracking-widest">Cognitive Garden</h3>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
             <div key={i} className={`w-2 h-2 rounded-sm ${i === 0 ? 'bg-zen-sage' : i === 1 ? 'bg-zen-rose' : 'bg-zen-clay'}`} />
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => (
          <div
            key={idx}
            title={`${day.date.toDateString()}: Score ${day.score}`}
            className={`aspect-square rounded-md transition-all duration-500 hover:scale-110 cursor-help ${getColor(day)}`}
          />
        ))}
      </div>
      
      <p className="text-[10px] text-zen-slate/40 text-center uppercase tracking-tighter">
        Last 28 Days of Mindful Consumption
      </p>
    </div>
  );
};
