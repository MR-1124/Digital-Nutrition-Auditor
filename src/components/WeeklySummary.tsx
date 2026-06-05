import React, { useMemo } from 'react';
import { useNutritionStore, calculateScoreForLogs } from '../store';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const WeeklySummary: React.FC = () => {
  const logs = useNutritionStore((state) => state.logs);

  const stats = useMemo(() => {
    const today = new Date();
    
    const getLogsForRange = (startDaysAgo: number, endDaysAgo: number) => {
      const start = new Date(today);
      start.setDate(start.getDate() - startDaysAgo);
      start.setHours(23, 59, 59, 999);
      
      const end = new Date(today);
      end.setDate(end.getDate() - endDaysAgo);
      end.setHours(0, 0, 0, 0);

      return logs.filter(l => {
        const d = new Date(l.timestamp);
        return d <= start && d >= end;
      });
    };

    const currentWeekLogs = getLogsForRange(0, 6);
    const prevWeekLogs = getLogsForRange(7, 13);

    const currentScore = calculateScoreForLogs(currentWeekLogs);
    const prevScore = calculateScoreForLogs(prevWeekLogs);
    const diff = currentScore - prevScore;

    const getMacroTotal = (l: any[], macro: string) => 
      l.filter(item => item.macro === macro).reduce((a, b) => a + b.durationMinutes, 0);

    return {
      currentScore,
      prevScore,
      diff,
      currentEd: getMacroTotal(currentWeekLogs, 'Educational'),
      prevEd: getMacroTotal(prevWeekLogs, 'Educational'),
      currentRot: getMacroTotal(currentWeekLogs, 'Brain-Rot'),
      prevRot: getMacroTotal(prevWeekLogs, 'Brain-Rot'),
    };
  }, [logs]);

  if (logs.length < 5) return null; // Only show after some data exists

  return (
    <div className="bg-zen-surface p-6 rounded-3xl border border-zen-sand shadow-sm space-y-6 transition-colors">
      <h3 className="text-sm font-medium text-zen-slate/50 uppercase tracking-widest text-center">Weekly Reflection</h3>
      
      <div className="flex justify-around items-center">
        <div className="text-center">
          <div className="text-xs text-zen-slate/40 uppercase mb-1">Weekly Score</div>
          <div className="text-3xl font-bold text-zen-slate">{stats.currentScore}</div>
        </div>
        <div className="flex flex-col items-center">
          {stats.diff > 0 ? (
            <div className="text-zen-sage flex items-center gap-1 font-bold">
              <TrendingUp size={20} />
              +{stats.diff}
            </div>
          ) : stats.diff < 0 ? (
            <div className="text-zen-clay flex items-center gap-1 font-bold">
              <TrendingDown size={20} />
              {stats.diff}
            </div>
          ) : (
            <div className="text-zen-slate/30 flex items-center gap-1 font-bold">
              <Minus size={20} />
              0
            </div>
          )}
          <div className="text-[10px] text-zen-slate/30 uppercase">vs Last Week</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-zen-sage/10 rounded-2xl border border-zen-sage/20 text-center">
          <div className="text-[10px] font-bold text-zen-sage uppercase mb-1">Learning</div>
          <div className="text-lg font-bold text-zen-slate">{stats.currentEd}m</div>
          <div className="text-[10px] text-zen-slate/40">Prev: {stats.prevEd}m</div>
        </div>
        <div className="p-3 bg-zen-clay/10 rounded-2xl border border-zen-clay/20 text-center">
          <div className="text-[10px] font-bold text-zen-clay uppercase mb-1">Brain-Rot</div>
          <div className="text-lg font-bold text-zen-slate">{stats.currentRot}m</div>
          <div className="text-[10px] text-zen-slate/40">Prev: {stats.prevRot}m</div>
        </div>
      </div>
    </div>
  );
};
