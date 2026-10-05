import { readList, writeList, storageKeys } from "./asyncStorageClient";
import { generateId } from "@/utils/id";
import type { GameSchedule, GameScheduleInput } from "@/models/types";

export async function getSchedules(): Promise<GameSchedule[]> {
  const items = await readList<GameSchedule>(storageKeys.schedules);
  return items.sort(
    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  );
}

export async function getScheduleById(
  id: string
): Promise<GameSchedule | undefined> {
  const items = await getSchedules();
  return items.find((item) => item.id === id);
}

export async function addSchedule(
  input: GameScheduleInput
): Promise<GameSchedule> {
  const items = await readList<GameSchedule>(storageKeys.schedules);
  const now = new Date().toISOString();

  const newItem: GameSchedule = {
    ...input,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  await writeList(storageKeys.schedules, [...items, newItem]);
  return newItem;
}

export async function updateSchedule(
  id: string,
  input: Partial<GameScheduleInput>
): Promise<GameSchedule | undefined> {
  const items = await readList<GameSchedule>(storageKeys.schedules);
  let updated: GameSchedule | undefined;

  for (const item of items) {
    if (item.id !== id) continue;

    updated = {
      ...item,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    break;
  }

  if (!updated) return undefined;

  const next = items.map((item) => (item.id === id ? updated! : item));
  await writeList(storageKeys.schedules, next);
  return updated;
}

export async function deleteSchedule(id: string): Promise<void> {
  const items = await readList<GameSchedule>(storageKeys.schedules);
  await writeList(
    storageKeys.schedules,
    items.filter((item) => item.id !== id)
  );
}
