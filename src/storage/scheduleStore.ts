import {
  addSchedule,
  deleteSchedule,
  getSchedules,
  updateSchedule,
} from "./scheduleStorage";
import type { GameSchedule, GameScheduleInput } from "@/models/types";

type Listener = () => void;

let schedules: GameSchedule[] = [];
let loaded = false;
let loadingPromise: Promise<void> | null = null;
const listeners = new Set<Listener>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeSchedules(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSchedulesSnapshot(): GameSchedule[] {
  return schedules;
}

export function areSchedulesLoaded(): boolean {
  return loaded;
}

export async function loadSchedules(): Promise<void> {
  // Evita disparar múltiples lecturas concurrentes de AsyncStorage si varias
  // pantallas piden refrescar al mismo tiempo.
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const items = await getSchedules();
    schedules = items;
    loaded = true;
    emit();
  })();

  try {
    await loadingPromise;
  } finally {
    loadingPromise = null;
  }
}

export async function createSchedule(
  input: GameScheduleInput
): Promise<GameSchedule> {
  const created = await addSchedule(input);
  await loadSchedules();
  return created;
}

export async function editSchedule(
  id: string,
  input: Partial<GameScheduleInput>
): Promise<GameSchedule | undefined> {
  const updated = await updateSchedule(id, input);
  await loadSchedules();
  return updated;
}

export async function removeSchedule(id: string): Promise<void> {
  await deleteSchedule(id);
  await loadSchedules();
}
