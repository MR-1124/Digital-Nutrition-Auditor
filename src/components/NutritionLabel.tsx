import React, { useMemo, useRef } from 'react';
import { useNutritionStore, filterLogsByDate } from '../store';
import type { MacroType } from '../store';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';

export const NutritionLabel: React.FC = () => {
  const allLogs = useNutritionStore((state) => state.logs);
  const goals = useNutritionStore((state) => state.goals);
  const labelRef = useRef<HTMLDivElement>(null);

  const logs = useMemo(() => filterLogsByDate(allLogs, new Date()), [allLogs]);

  const stats = useMemo(() => {
    const totals: Record<MacroType, number> = {
      Educational: 0,
      Entertainment: 0,
      'High-Stress': 0,
      'Brain-Rot': 0,
    };
    logs.forEach((l) => (totals[l.macro] += l.durationMinutes));
    const totalMinutes = Object.values(totals).reduce((a, b) => a + b, 0);
    return { totals, totalMinutes };
  }, [logs]);

  const calculateDV = (value: number, limit: number) => {
    return Math.round((value / limit) * 100);
  };

  const handleExport = async () => {
    if (labelRef.current === null) return;
    
    try {
      const dataUrl = await toPng(labelRef.current, { cacheBust: true, backgroundColor: '#FDFCFB' });
      const link = document.createElement('a');
      link.download = `digital-nutrition-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div 
        ref={labelRef}
        className="bg-white p-4 border-2 border-black w-full max-w-[320px] font-sans text-black shadow-[8px_8px_0px_rgba(0,0,0,0.1)]"
      >
        <h1 className="text-4xl font-black border-b-8 border-black pb-1 leading-none uppercase">Digital Nutrition Facts</h1>
        <div className="border-b border-black py-1 text-sm font-bold">
          Serving Size: 1 Productive Day
        </div>
        <div className="border-b-4 border-black py-1 flex justify-between items-baseline">
          <div className="text-lg font-black">Mental Energy Consumed</div>
          <div className="text-2xl font-black">{stats.totalMinutes}m</div>
        </div>
        <div className="text-right text-xs font-bold py-1 border-b border-black">
          % Daily Value*
        </div>

        <div className="flex justify-between border-b border-black py-1">
          <div><span className="font-bold">Educational</span> {stats.totals['Educational']}m</div>
          <div className="font-bold">{calculateDV(stats.totals['Educational'], goals['Educational'])}%</div>
        </div>
        <div className="flex justify-between border-b border-black py-1 pl-4">
          <div>Deep Learning</div>
          <div>{Math.round(stats.totals['Educational'] * 0.4)}m</div>
        </div>

        <div className="flex justify-between border-b border-black py-1">
          <div><span className="font-bold">Entertainment</span> {stats.totals['Entertainment']}m</div>
          <div className="font-bold">{calculateDV(stats.totals['Entertainment'], goals['Entertainment'])}%</div>
        </div>

        <div className="flex justify-between border-b border-black py-1">
          <div>
            <span className={`font-bold ${calculateDV(stats.totals['High-Stress'], goals['High-Stress']) > 100 ? 'text-red-600' : ''}`}>
              High-Stress
            </span> {stats.totals['High-Stress']}m
          </div>
          <div className="font-bold">{calculateDV(stats.totals['High-Stress'], goals['High-Stress'])}%</div>
        </div>

        <div className="flex justify-between border-b-8 border-black py-1">
          <div>
            <span className={`font-bold ${calculateDV(stats.totals['Brain-Rot'], goals['Brain-Rot']) > 100 ? 'text-red-600' : ''}`}>
              Brain-Rot
            </span> {stats.totals['Brain-Rot']}m
          </div>
          <div className="font-bold">{calculateDV(stats.totals['Brain-Rot'], goals['Brain-Rot'])}%</div>
        </div>

        <div className="text-[10px] leading-tight pt-2">
          * The % Daily Value (DV) tells you how much a nutrient in a serving of digital content contributes to a daily mental diet. Limits are set based on your personal goals.
        </div>
      </div>

      <button
        onClick={handleExport}
        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg"
      >
        <Download size={18} />
        Export Nutrition Label
      </button>
    </div>
  );
};
