import React, { useMemo } from 'react';
import { useNutritionStore, filterLogsByDate } from '../store';
import { Trash2, Clock } from 'lucide-react';

export const ActivityList: React.FC = () => {
  const allLogs = useNutritionStore((state) => state.logs);
  const removeLog = useNutritionStore((state) => state.removeLog);

  const logs = useMemo(() => filterLogsByDate(allLogs, new Date()), [allLogs]);

  const getMacroColor = (macro: string) => {
    switch (macro) {
      case 'Educational': return 'bg-macro-educational';
      case 'Entertainment': return 'bg-macro-entertainment';
      case 'High-Stress': return 'bg-macro-stress';
      case 'Brain-Rot': return 'bg-macro-brainrot';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium text-zen-slate">Today's Intake</h2>
      {logs.length === 0 ? (
        <div className="bg-white/50 border border-dashed border-zen-sand rounded-2xl p-8 text-center text-zen-slate/40">
          No activities logged yet.
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-white p-4 rounded-2xl shadow-sm border border-zen-sand flex items-center justify-between group animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${getMacroColor(log.macro)}`} />
                <div>
                  <h3 className="font-medium text-zen-slate">{log.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-zen-slate/50 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {log.durationMinutes}m
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-zen-sand/50 uppercase tracking-wider">
                      {log.macro}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeLog(log.id)}
                className="p-2 text-zen-clay/0 group-hover:text-zen-clay transition-colors hover:bg-zen-clay/10 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
