import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'luisa_app_state';

export interface Task {
  id: string;
  title: string;
  desc: string;
  cat: string;
  prio: 'high' | 'medium' | 'low';
  due: string;
  done: boolean;
  doneDate: string | null;
  quickTask: boolean;
  subtasks: { text: string; done: boolean }[];
  createdAt: number;
}

export interface ShopItem {
  id: string;
  name: string;
  qty: string;
  cat: string;
  checked: boolean;
}

export interface AppState {
  tasks: Task[];
  shopping: ShopItem[];
  customCategories: Record<string, any> | null;
  learnedKeywords: Record<string, string>;
  streak: { current: number; lastDate: string };
  completionLog: Record<string, number>;
  moodLog: Record<string, any>;
}

export const defaultState: AppState = {
  tasks: [],
  shopping: [],
  customCategories: null,
  learnedKeywords: {},
  streak: { current: 0, lastDate: '' },
  completionLog: {},
  moodLog: {},
};

export async function loadState(): Promise<AppState> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return { ...defaultState, ...JSON.parse(data) };
    }
  } catch (e) {
    console.warn('Failed to load state:', e);
  }
  return { ...defaultState };
}

export async function saveState(state: AppState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state:', e);
  }
}

export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}
