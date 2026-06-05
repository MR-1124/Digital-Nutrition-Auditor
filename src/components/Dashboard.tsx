import React, { useMemo, useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { useNutritionStore, filterLogsByDate } from '../store';
import type { MacroType } from '../store';
import { Leaf, Settings2, Check } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const allLogs = useNutritionStore((state) => state.logs);
  const goals = useNutritionStore((state) => state.goals);
  const setGoal = useNutritionStore((state) => state.setGoal);
  const [isEditingGoals, setIsEditingGoals] = useState(false);

  const logs = useMemo(() => filterLogsByDate(allLogs, new Date()), [allLogs]);

  const chartData = useMemo(() => {
    const data: Record<MacroType, number> = {
      Educational: 0,
      Entertainment: 0,
      'High-Stress': 0,
      'Brain-Rot': 0,
    };

    logs.forEach((log) => {
      data[log.macro] += log.durationMinutes;
    });

    return Object.entries(data).map(([key, value]) => ({
      subject: key,
      value: value,
      fullMark: Math.max(...Object.values(data), goals[key as MacroType] || 60),
    }));
  }, [logs, goals]);

  const score = useMemo(() => {
    if (logs.length === 0) return 0;
    
    let totalMinutes = 0;
    let weightedSum = 0;

    logs.forEach((log) => {
      totalMinutes += log.durationMinutes;
      switch (log.macro) {
        case 'Educational': weightedSum += log.durationMinutes * 1.5; break;
        case 'Entertainment': weightedSum += log.durationMinutes * 1.0; break;
        case 'High-Stress': weightedSum += log.durationMinutes * -0.5; break;
        case 'Brain-Rot': weightedSum += log.durationMinutes * -1.0; break;
      }
    });

    const baseScore = (weightedSum / totalMinutes) * 50 + 50;
    return Math.max(0, Math.min(100, Math.round(baseScore)));
  }, [logs]);

  const getScoreColor = (s: number) => {
    if (s > 80) return 'text-zen-sage';
    if (s > 50) return 'text-zen-rose';
    return 'text-zen-clay';
  };

  return (
    <div className="space-y-6">
      {/* Score Section */}
      <div className="bg-zen-surface p-8 rounded-3xl shadow-sm border border-zen-sand text-center relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <Leaf size={120} />
        </div>
        <h2 className="text-sm font-medium text-zen-slate/50 uppercase tracking-widest mb-2">Cognitive Score</h2>
        <div className={`text-7xl font-bold tracking-tighter ${getScoreColor(score)}`}>
          {score}
        </div>
        <p className="text-zen-slate/40 text-sm mt-4">
          {score > 80 ? 'Your mind is well-nourished.' : score > 50 ? 'A balanced digital diet.' : 'Heavy consumption detected.'}
        </p>
      </div>

      {/* Chart & Goals Section */}
      <div className="bg-zen-surface p-6 rounded-3xl shadow-sm border border-zen-sand flex flex-col items-center relative transition-colors">
        <div className="w-full flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-zen-slate/50 uppercase tracking-widest">Macro Balance</h3>
          <button 
            onClick={() => setIsEditingGoals(!isEditingGoals)}
            className="p-2 text-zen-slate/40 hover:text-zen-sage transition-colors"
          >
            {isEditingGoals ? <Check size={20} /> : <Settings2 size={20} />}
          </button>
        </div>

        {isEditingGoals ? (
          <div className="w-full space-y-4 py-4 animate-in fade-in zoom-in-95 duration-300">
            <h4 className="text-xs font-bold text-zen-slate/60 uppercase tracking-widest">Set Daily Limits (mins)</h4>
            {(Object.keys(goals) as MacroType[]).map((macro) => (
              <div key={macro} className="flex items-center gap-4">
                <span className="text-xs font-medium text-zen-slate/70 w-24">{macro}</span>
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="15"
                  value={goals[macro]}
                  onChange={(e) => setGoal(macro, parseInt(e.target.value))}
                  className="flex-1 accent-zen-sage h-1 bg-zen-sand rounded-full appearance-none"
                />
                <span className="text-xs font-bold text-zen-slate w-8">{goals[macro]}</span>
              </div>
            ))}
            <p className="text-[10px] text-zen-slate/40 italic pt-2">
              * Limits adjust the % Daily Value on your nutrition label.
            </p>
          </div>
        ) : (
          <div className="w-full aspect-square max-h-[400px] min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="var(--accent-sand)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: 'var(--text-primary)', fontSize: 10, fontWeight: 500 }}
                />
                <Radar
                  name="Minutes"
                  dataKey="value"
                  stroke="var(--accent-sage)"
                  fill="var(--accent-sage)"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
