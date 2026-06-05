import React, { useMemo } from 'react';
import { useNutritionStore, filterLogsByDate } from '../store';
import { Flame, Info, Lightbulb } from 'lucide-react';

export const SmartAdvice: React.FC = () => {
  const allLogs = useNutritionStore((state) => state.logs);
  const streak = useNutritionStore((state) => state.streak);
  const goals = useNutritionStore((state) => state.goals);
  
  const logs = useMemo(() => filterLogsByDate(allLogs, new Date()), [allLogs]);

  const advice = useMemo(() => {
    const totals = {
      Educational: 0,
      Entertainment: 0,
      'High-Stress': 0,
      'Brain-Rot': 0,
    };
    logs.forEach((l) => (totals[l.macro] += l.durationMinutes));

    if (logs.length === 0) return "Ready to start your mindful journey? Log your first activity.";
    
    if (totals['Brain-Rot'] > goals['Brain-Rot']) {
      return `You've exceeded your ${goals['Brain-Rot']}m limit for 'Brain-Rot'. A quick digital detox might be needed.`;
    }
    if (totals['High-Stress'] > goals['High-Stress']) {
      return `Stress intake is high (${totals['High-Stress']}m). Try some 'Educational' content to ground your focus.`;
    }
    if (totals['Educational'] >= goals['Educational']) {
      return "Fantastic! You've met your learning goal for today. Your mind is sharp.";
    }
    if (totals['Educational'] < goals['Educational'] * 0.2 && totals['Entertainment'] > goals['Entertainment']) {
      return `You're high on entertainment but low on learning. Try 15 minutes of skill-building to balance the scales.`;
    }
    
    return "Your digital diet is looking balanced and within your set limits. Keep it up!";
  }, [logs, goals]);

  return (
    <div className="space-y-4">
      {/* Streak Badge */}
      <div className="bg-gradient-to-br from-zen-sage/20 to-zen-sand/20 p-4 rounded-2xl border border-zen-sage/30 flex items-center gap-4">
        <div className="bg-white p-2 rounded-full shadow-sm text-orange-500">
          <Flame size={24} fill="currentColor" />
        </div>
        <div>
          <div className="text-xs font-bold text-zen-slate/50 uppercase tracking-widest">Consistency</div>
          <div className="text-xl font-bold text-zen-slate">{streak} Day Streak</div>
        </div>
      </div>

      {/* Smart Tip */}
      <div className="bg-white p-6 rounded-2xl border border-zen-sand shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-zen-sage font-medium">
          <Lightbulb size={18} />
          <span>Smart Advice</span>
        </div>
        <p className="text-sm text-zen-slate/70 leading-relaxed">
          {advice}
        </p>
        <div className="flex items-center gap-2 text-[10px] text-zen-slate/30 bg-zen-bg px-2 py-1 rounded w-fit">
          <Info size={10} />
          <span>Personalized to your limits</span>
        </div>
      </div>
    </div>
  );
};
