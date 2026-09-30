import { readList, writeList, storageKeys } from "./asyncStorageClient";
import { generateId } from "@/utils/id";
import { scheduleReminder, cancelReminder } from "@/notifications/notifications";
import type { GameSchedule, GameScheduleInput } from "@/models/types";

function reminderBody(schedule: Pick<GameSchedule, "dateTime" | "friends">): string {
  const time = new Date(schedule.dateTime).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const withFriends =
    schedule.friends.length > 0 ? ` con ${schedule.friends.join(", ")}` : "";
  return `Empieza a las ${time}${withFriends}`;
}

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

  const notificationId = await scheduleReminder({
    title: `Recordatorio: ${input.game}`,
    body: reminderBody(input),
    dateTime: input.dateTime,
  });

  const newItem: GameSchedule = {
    ...input,
    id: generateId(),
    notificationId: notificationId ?? undefined,
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

    // Si cambia el juego, la fecha/hora o los amigos, el recordatorio anterior
    // queda desactualizado: lo cancelamos y programamos uno nuevo.
    await cancelReminder(item.notificationId);
    const merged = { ...item, ...input };
    const notificationId = await scheduleReminder({
      title: `Recordatorio: ${merged.game}`,
      body: reminderBody(merged),
      dateTime: merged.dateTime,
    });

    updated = {
      ...merged,
      notificationId: notificationId ?? undefined,
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
  const target = items.find((item) => item.id === id);
  if (target) {
    await cancelReminder(target.notificationId);
  }
  await writeList(
    storageKeys.schedules,
    items.filter((item) => item.id !== id)
  );
}
