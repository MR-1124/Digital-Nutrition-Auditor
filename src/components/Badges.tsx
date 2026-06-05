import React from 'react';
import { useNutritionStore } from '../store';

export const Badges: React.FC = () => {
  const unlockedBadges = useNutritionStore((state) => state.unlockedBadges);

  if (unlockedBadges.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-zen-slate/50 uppercase tracking-widest text-center">Zen Milestones</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {unlockedBadges.map((badge) => (
          <div
            key={badge.id}
            className="group relative flex flex-col items-center p-4 bg-white rounded-2xl border border-zen-sand shadow-sm transition-all hover:border-zen-sage"
          >
            <div className="text-3xl mb-2 grayscale group-hover:grayscale-0 transition-all scale-100 group-hover:scale-110">
              {badge.icon}
            </div>
            <div className="text-[10px] font-bold text-zen-slate uppercase tracking-tight">
              {badge.name}
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-32 p-2 bg-zen-slate text-white text-[10px] rounded-lg text-center z-10 shadow-xl">
              {badge.description}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zen-slate" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
