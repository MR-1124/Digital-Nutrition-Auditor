import React, { useState } from 'react';
import { useNutritionStore } from '../store';
import type { MacroType, MoodType } from '../store';
import { PlusCircle, Smile, Frown, Zap, Coffee, Brain } from 'lucide-react';

const MACROS: { label: string; value: MacroType; color: string }[] = [
  { label: 'Educational', value: 'Educational', color: 'bg-macro-educational' },
  { label: 'Entertainment', value: 'Entertainment', color: 'bg-macro-entertainment' },
  { label: 'High-Stress', value: 'High-Stress', color: 'bg-macro-stress' },
  { label: 'Brain-Rot', value: 'Brain-Rot', color: 'bg-macro-brainrot' },
];

const MOODS: { label: string; value: MoodType; icon: React.ReactNode }[] = [
  { label: 'Calm', value: 'Calm', icon: <Coffee size={14} /> },
  { label: 'Focused', value: 'Focused', icon: <Brain size={14} /> },
  { label: 'Anxious', value: 'Anxious', icon: <Frown size={14} /> },
  { label: 'Drained', value: 'Drained', icon: <Zap size={14} /> },
  { label: 'Happy', value: 'Happy', icon: <Smile size={14} /> },
];

export const LogForm: React.FC = () => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('30');
  const [macro, setMacro] = useState<MacroType>('Entertainment');
  const [mood, setMood] = useState<MoodType>('Calm');
  const addLog = useNutritionStore((state) => state.addLog);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addLog({
      name,
      durationMinutes: parseInt(duration, 10),
      macro,
      mood,
    });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-zen-sand space-y-4">
      <h2 className="text-xl font-medium text-zen-slate mb-4">Log Activity</h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zen-slate/70">What did you consume?</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Reading documentation, Twitter, Netflix"
          className="w-full px-4 py-2 rounded-xl border border-zen-sand focus:outline-none focus:ring-2 focus:ring-zen-sage/30 bg-zen-bg/30"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-zen-slate/70">Duration (mins)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-zen-sand focus:outline-none focus:ring-2 focus:ring-zen-sage/30 bg-zen-bg/30"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zen-slate/70">Category</label>
        <div className="grid grid-cols-2 gap-2">
          {MACROS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMacro(m.value)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                macro === m.value
                  ? `${m.color} text-white border-transparent shadow-sm`
                  : 'bg-white text-zen-slate/60 border-zen-sand hover:border-zen-sage'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zen-slate/70">How do you feel now?</label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(m.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                mood === m.value
                  ? 'bg-zen-slate text-white border-transparent'
                  : 'bg-zen-sand/20 text-zen-slate/60 border-transparent hover:bg-zen-sand/40'
              }`}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-zen-slate text-white py-3 rounded-xl font-medium hover:bg-zen-slate/90 transition-colors mt-6"
      >
        <PlusCircle size={20} />
        Add to Plate
      </button>
    </form>
  );
};
