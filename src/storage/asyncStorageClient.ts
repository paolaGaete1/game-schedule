import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  schedules: "@game-schedule/schedules",
  tournaments: "@game-schedule/tournaments",
} as const;

async function readList<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch (error) {
    console.error(`[storage] Error leyendo ${key}`, error);
    return [];
  }
}

async function writeList<T>(key: string, items: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(items));
}

export const storageKeys = KEYS;
export { readList, writeList };
