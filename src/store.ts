import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from './firebase';
import { doc, setDoc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';

export type MacroType = 'Educational' | 'Entertainment' | 'High-Stress' | 'Brain-Rot';
export type MoodType = 'Calm' | 'Focused' | 'Anxious' | 'Drained' | 'Happy';

export interface ActivityLog {
  id: string;
  name: string;
  durationMinutes: number;
  macro: MacroType;
  mood?: MoodType;
  timestamp: string; // ISO string
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
  icon: string;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface NutritionState {
  logs: ActivityLog[];
  streak: number;
  lastLogDate: string | null;
  goals: Record<MacroType, number>;
  unlockedBadges: Badge[];
  user: UserProfile | null;
  isSyncing: boolean;
  addLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => Promise<void>;
  removeLog: (id: string) => Promise<void>;
  setGoal: (macro: MacroType, minutes: number) => Promise<void>;
  checkMilestones: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
  subscribeToCloud: (user: UserProfile) => () => void;
  clearData: () => void;
  purgeUserData: () => Promise<void>;
}

const INITIAL_GOALS = {
  Educational: 120,
  Entertainment: 60,
  'High-Stress': 30,
  'Brain-Rot': 15,
};

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      logs: [],
      streak: 0,
      lastLogDate: null,
      goals: INITIAL_GOALS,
      unlockedBadges: [],
      user: null,
      isSyncing: false,

      addLog: async (log) => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const newLog: ActivityLog = {
          ...log,
          id: crypto.randomUUID(),
          timestamp: now.toISOString(),
        };

        const state = get();
        let newStreak = state.streak;
        const lastDate = state.lastLogDate;

        if (!lastDate) {
          newStreak = 1;
        } else if (lastDate !== today) {
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (lastDate === yesterdayStr) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
        }

        const updatedLogs = [newLog, ...state.logs];
        
        set({
          logs: updatedLogs,
          streak: newStreak,
          lastLogDate: today,
        });

        if (state.user) {
          try {
            const userRef = doc(db, "users", state.user.uid);
            await setDoc(userRef, {
              logs: updatedLogs,
              streak: newStreak,
              lastLogDate: today,
              goals: state.goals,
              unlockedBadges: state.unlockedBadges
            }, { merge: true });
          } catch (e) {
            console.error("Cloud sync failed", e);
          }
        }

        get().checkMilestones();
      },

      removeLog: async (id) => {
        const state = get();
        const updatedLogs = state.logs.filter((l) => l.id !== id);
        set({ logs: updatedLogs });

        if (state.user) {
          try {
            const userRef = doc(db, "users", state.user.uid);
            await updateDoc(userRef, { logs: updatedLogs });
          } catch (e) {
            console.error("Cloud sync failed", e);
          }
        }
      },

      setGoal: async (macro, minutes) => {
        const state = get();
        const newGoals = { ...state.goals, [macro]: minutes };
        set({ goals: newGoals });

        if (state.user) {
          try {
            const userRef = doc(db, "users", state.user.uid);
            await updateDoc(userRef, { goals: newGoals });
          } catch (e) {
            console.error("Cloud sync failed", e);
          }
        }
      },

      setUser: (user) => {
        const currentUser = get().user;
        if (currentUser && (!user || currentUser.uid !== user.uid)) {
          get().clearData();
        }
        set({ user });
      },

      clearData: () => {
        set({
          logs: [],
          streak: 0,
          lastLogDate: null,
          goals: INITIAL_GOALS,
          unlockedBadges: [],
        });
      },

      purgeUserData: async () => {
        const state = get();
        if (state.user) {
          try {
            const userRef = doc(db, "users", state.user.uid);
            await deleteDoc(userRef);
          } catch (e) {
            console.error("Failed to purge cloud data", e);
          }
        }
        get().clearData();
      },

      subscribeToCloud: (userProfile) => {
        set({ isSyncing: true });
        const userRef = doc(db, "users", userProfile.uid);
        
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            set({
              logs: data.logs || [],
              streak: data.streak || 0,
              lastLogDate: data.lastLogDate || null,
              goals: data.goals || get().goals,
              unlockedBadges: data.unlockedBadges || [],
              isSyncing: false
            });
          } else {
            // First time login: initialize cloud with local data
            const state = get();
            setDoc(userRef, {
              logs: state.logs,
              streak: state.streak,
              lastLogDate: state.lastLogDate,
              goals: state.goals,
              unlockedBadges: state.unlockedBadges
            }).then(() => set({ isSyncing: false }));
          }
        }, (error) => {
          console.error("Cloud subscription error", error);
          set({ isSyncing: false });
        });

        return unsubscribe;
      },

      checkMilestones: async () => {
        const state = get();
        const newBadges: Badge[] = [...state.unlockedBadges];
        const now = new Date().toISOString();

        const totalEd = state.logs
          .filter(l => l.macro === 'Educational')
          .reduce((acc, curr) => acc + curr.durationMinutes, 0);
        
        if (totalEd >= 600 && !newBadges.find(b => b.id === 'deep-diver')) {
          newBadges.push({ id: 'deep-diver', name: 'Deep Diver', description: '10 hours of deep learning.', unlockedAt: now, icon: '🌊' });
        }

        if (state.streak >= 7 && !newBadges.find(b => b.id === 'the-monk')) {
          newBadges.push({ id: 'the-monk', name: 'The Monk', description: 'Maintained a 7-day consistency streak.', unlockedAt: now, icon: '🧘' });
        }

        const todayLogs = filterLogsByDate(state.logs, new Date());
        const hasDrained = todayLogs.some(l => l.mood === 'Drained');
        const hasFocused = todayLogs.some(l => l.mood === 'Focused');
        if (hasDrained && hasFocused && !newBadges.find(b => b.id === 'pattern-breaker')) {
          newBadges.push({ id: 'pattern-breaker', name: 'Pattern Breaker', description: 'Turned a drained day into a focused one.', unlockedAt: now, icon: '⚡' });
        }

        if (newBadges.length > state.unlockedBadges.length) {
          set({ unlockedBadges: newBadges });
          if (state.user) {
            const userRef = doc(db, "users", state.user.uid);
            await updateDoc(userRef, { unlockedBadges: newBadges });
          }
        }
      }
    }),
    {
      name: 'nutrition-storage',
      partialize: (state) => ({ 
        // Only persist these fields locally to prevent user overlap
        logs: state.user ? [] : state.logs, 
        streak: state.user ? 0 : state.streak,
        goals: state.goals,
        unlockedBadges: state.user ? [] : state.unlockedBadges,
        user: state.user,
        lastLogDate: state.lastLogDate
      }),
    }
  )
);

export const filterLogsByDate = (logs: ActivityLog[], date: Date) => {
  const dateString = date.toISOString().split('T')[0];
  return logs.filter((l) => l.timestamp.startsWith(dateString));
};

export const calculateScoreForLogs = (logs: ActivityLog[]) => {
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
};
