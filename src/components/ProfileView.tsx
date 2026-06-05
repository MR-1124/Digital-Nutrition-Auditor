import React from 'react';
import { useNutritionStore } from '../store';
import { logout } from '../firebase';
import { LogOut, User, Trash2, Calendar, Award, Clock } from 'lucide-react';

interface ProfileViewProps {
  onBack: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onBack }) => {
  const user = useNutritionStore((state) => state.user);
  const logs = useNutritionStore((state) => state.logs);
  const streak = useNutritionStore((state) => state.streak);
  const badges = useNutritionStore((state) => state.unlockedBadges);
  const setUser = useNutritionStore((state) => state.setUser);
  const purgeUserData = useNutritionStore((state) => state.purgeUserData);
  const theme = useNutritionStore((state) => state.theme);
  const setTheme = useNutritionStore((state) => state.setTheme);

  const totalMinutes = logs.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    onBack();
  };

  const handlePurge = async () => {
    if (window.confirm("Are you absolutely sure? This will delete all your digital nutrition history permanently from both this device and the cloud.")) {
      await purgeUserData();
      alert("Data purged successfully.");
      onBack();
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 border border-zen-sand shadow-sm mb-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className="relative">
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full border-4 border-zen-sage shadow-md object-cover" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=9EB3A0&color=fff&size=128`;
              }}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-zen-sand flex items-center justify-center text-zen-slate">
              <User size={48} />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl font-serif font-medium text-zen-slate">
              {user?.displayName || 'Zen Auditor'}
            </h2>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-zen-sage/10 text-zen-sage text-[10px] font-bold uppercase tracking-widest border border-zen-sage/20">
              <span className="w-1.5 h-1.5 rounded-full bg-zen-sage animate-pulse" />
              Secure Session
            </div>
          </div>
          <p className="text-zen-slate/50 mb-4">{user?.email || 'Local User'}</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
             <button
              onClick={onBack}
              className="px-6 py-2 rounded-full border border-zen-sand text-zen-slate text-sm font-medium hover:bg-zen-bg transition-colors"
            >
              Back to Plate
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-zen-clay/10 text-zen-clay text-sm font-medium hover:bg-zen-clay hover:text-white transition-all"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Appearance Settings */}
        <div className="bg-white p-8 rounded-3xl border border-zen-sand shadow-sm">
          <h3 className="text-lg font-medium text-zen-slate mb-6">Atmosphere</h3>
          <div className="space-y-4">
            {[
              { id: 'zen', name: 'Zen Morning', desc: 'Soft whites and calming sage.', colors: ['bg-[#FDFCFB]', 'bg-[#9EB3A0]'] },
              { id: 'midnight', name: 'Midnight Deep', desc: 'Dark navy for focused nights.', colors: ['bg-[#0F172A]', 'bg-[#38BDF8]'] },
              { id: 'forest', name: 'Eternal Forest', desc: 'Earthy greens and wood tones.', colors: ['bg-[#1A2F1C]', 'bg-[#86EFAC]'] },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  theme === t.id ? 'border-zen-sage bg-zen-sage/5 ring-2 ring-zen-sage/20' : 'border-zen-sand hover:border-zen-sage/50'
                }`}
              >
                <div className="text-left">
                  <div className="font-bold text-sm text-zen-slate">{t.name}</div>
                  <div className="text-xs text-zen-slate/40">{t.desc}</div>
                </div>
                <div className="flex -space-x-2">
                  {t.colors.map((c, i) => (
                    <div key={i} className={`w-6 h-6 rounded-full border-2 border-white shadow-sm ${c}`} />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Lifetime Stats Card (Moved inside grid) */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-zen-sand shadow-sm flex items-center gap-4">
            <div className="p-3 bg-zen-sage/10 rounded-xl text-zen-sage">
              <Clock size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-zen-slate">{totalMinutes}m</div>
              <div className="text-[10px] font-medium text-zen-slate/40 uppercase tracking-widest">Lifetime Focus</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-zen-sand shadow-sm flex items-center gap-4">
            <div className="p-3 bg-zen-rose/10 rounded-xl text-zen-rose">
              <Calendar size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-zen-slate">{streak} Days</div>
              <div className="text-[10px] font-medium text-zen-slate/40 uppercase tracking-widest">Current Streak</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-zen-sand shadow-sm flex items-center gap-4">
            <div className="p-3 bg-zen-sage/10 rounded-xl text-zen-sage">
              <Award size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-zen-slate">{badges.length}</div>
              <div className="text-[10px] font-medium text-zen-slate/40 uppercase tracking-widest">Milestones Met</div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges List */}
      <div className="bg-white p-8 rounded-3xl border border-zen-sand shadow-sm mb-8">
        <h3 className="text-lg font-medium text-zen-slate mb-6 flex items-center gap-2">
          <Award size={20} className="text-zen-sage" />
          Achievement Gallery
        </h3>
        {badges.length === 0 ? (
          <p className="text-center text-zen-slate/30 italic py-12 border border-dashed border-zen-sand rounded-2xl">
            Your trophy cabinet is empty. Log more to unlock milestones!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map(badge => (
              <div key={badge.id} className="flex items-center gap-4 p-4 bg-zen-bg/50 rounded-2xl border border-zen-sand/50">
                <div className="text-4xl">{badge.icon}</div>
                <div>
                  <div className="font-bold text-zen-slate text-sm">{badge.name}</div>
                  <div className="text-xs text-zen-slate/50">{badge.description}</div>
                  <div className="text-[10px] text-zen-sage/60 mt-1 uppercase font-bold">
                    Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-zen-clay/5 p-8 rounded-3xl border border-zen-clay/20">
        <h3 className="text-zen-clay font-medium mb-4 flex items-center gap-2">
          <Trash2 size={18} />
          Privacy & Data
        </h3>
        <p className="text-sm text-zen-slate/60 mb-6">
          Removing your account or clearing data is permanent. This will erase all your logs, milestones, and streaks from this device.
        </p>
        <button 
          onClick={handlePurge}
          className="text-xs font-bold text-zen-clay hover:underline uppercase tracking-widest"
        >
          Purge all local and cloud data
        </button>
      </div>
    </div>
  );
};
