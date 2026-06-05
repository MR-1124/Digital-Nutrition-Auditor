import { useEffect, useState } from 'react';
import { LogForm } from './components/LogForm';
import { ActivityList } from './components/ActivityList';
import { Dashboard } from './components/Dashboard';
import { SmartAdvice } from './components/SmartAdvice';
import { ActivityHeatmap } from './components/ActivityHeatmap';
import { Badges } from './components/Badges';
import { WeeklySummary } from './components/WeeklySummary';
import { NutritionLabel } from './components/NutritionLabel';
import { ProfileView } from './components/ProfileView';
import { Sparkles, User as UserIcon, LogIn } from 'lucide-react';
import { auth, signInWithGoogle } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNutritionStore } from './store';

function App() {
  const [view, setView] = useState<'home' | 'profile'>('home');
  const user = useNutritionStore((state) => state.user);
  const setUser = useNutritionStore((state) => state.setUser);
  const isSyncing = useNutritionStore((state) => state.isSyncing);
  const subscribeToCloud = useNutritionStore((state) => state.subscribeToCloud);

  // Inactivity Timer (60 minutes)
  useEffect(() => {
    if (!user) return;

    let timeoutId: number;

    const resetTimer = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(async () => {
        await auth.signOut();
        alert("Session expired due to inactivity.");
        setView('home');
      }, 60 * 60 * 1000); // 60 minutes
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      window.clearTimeout(timeoutId);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [user]);

  useEffect(() => {
    let cloudUnsubscribe: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const avatarUrl = firebaseUser.photoURL || 
          `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || firebaseUser.email || 'U')}&background=9EB3A0&color=fff`;
        
        const profile = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: avatarUrl,
        };
        
        setUser(profile);
        // Start real-time cloud sync
        cloudUnsubscribe = subscribeToCloud(profile);
      } else {
        setUser(null);
        if (cloudUnsubscribe) cloudUnsubscribe();
      }
    });

    return () => {
      unsubscribeAuth();
      if (cloudUnsubscribe) cloudUnsubscribe();
    };
  }, [setUser, subscribeToCloud]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-zen-bg selection:bg-zen-sage/20">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center text-center relative">
        <div className="absolute top-8 right-6">
          {user ? (
            <button 
              onClick={() => setView(view === 'home' ? 'profile' : 'home')}
              className="flex items-center gap-2 p-1 pr-4 rounded-full bg-white border border-zen-sand shadow-sm hover:border-zen-sage transition-all"
            >
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full object-cover" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=9EB3A0&color=fff`;
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-zen-sand flex items-center justify-center text-zen-slate">
                  <UserIcon size={16} />
                </div>
              )}
              <span className="text-xs font-bold text-zen-slate uppercase tracking-tight">
                {view === 'home' ? 'Profile' : 'Close'}
              </span>
            </button>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-zen-slate text-white text-xs font-bold uppercase tracking-widest hover:bg-zen-slate/90 transition-all shadow-md"
            >
              <LogIn size={16} />
              Sign In
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-zen-sage mb-4 bg-zen-sage/10 px-4 py-1 rounded-full text-sm font-medium">
          <Sparkles size={16} className={isSyncing ? "animate-pulse" : ""} />
          <span>{isSyncing ? "Syncing Garden..." : "Mindful Consumption"}</span>
        </div>
        <h1 className="text-5xl font-serif font-medium text-zen-slate tracking-tight mb-4">
          Digital Nutrition Auditor
        </h1>
        <p className="text-zen-slate/50 max-w-lg text-lg leading-relaxed">
          Reframing your digital habits as mental fuel. Track what you consume and find your cognitive balance.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        {view === 'profile' ? (
          <ProfileView onBack={() => setView('home')} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-700">
            
            {/* Left Column: Logging & List */}
            <div className="lg:col-span-4 space-y-12">
              <LogForm />
              <ActivityList />
            </div>

            {/* Center Column: Dashboard & Heatmap */}
            <div className="lg:col-span-4 space-y-12">
              <SmartAdvice />
              <Dashboard />
              <ActivityHeatmap />
            </div>

            {/* Right Column: Nutrition Facts & Summary */}
            <div className="lg:col-span-4 space-y-12">
              <div className="sticky top-12 space-y-12 w-full">
                <div className="space-y-4">
                  <h2 className="text-sm font-medium text-zen-slate/50 uppercase tracking-widest text-center">Summary Label</h2>
                  <NutritionLabel />
                </div>
                <WeeklySummary />
                <Badges />
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zen-sand py-12 text-center text-zen-slate/30 text-sm">
        &copy; 2026 Digital Nutrition Auditor. {user ? `Signed in as ${user.email}` : 'Private & Local-First.'}
      </footer>
    </div>
  );
}

export default App;
