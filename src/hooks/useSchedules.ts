import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  subscribeSchedules,
  getSchedulesSnapshot,
  areSchedulesLoaded,
  loadSchedules,
  createSchedule,
  editSchedule,
  removeSchedule,
} from "@/storage/scheduleStore";
import type { GameScheduleInput } from "@/models/types";

export function useSchedules() {
  const schedules = useSyncExternalStore(
    subscribeSchedules,
    getSchedulesSnapshot,
    getSchedulesSnapshot
  );
  const loaded = useSyncExternalStore(
    subscribeSchedules,
    areSchedulesLoaded,
    areSchedulesLoaded
  );

  useEffect(() => {
    if (!areSchedulesLoaded()) {
      loadSchedules();
    }
  }, []);

  const refresh = useCallback(() => loadSchedules(), []);

  const create = useCallback(
    (input: GameScheduleInput) => createSchedule(input),
    []
  );

  const edit = useCallback(
    (id: string, input: Partial<GameScheduleInput>) => editSchedule(id, input),
    []
  );

  const remove = useCallback((id: string) => removeSchedule(id), []);

  return { schedules, loading: !loaded, refresh, create, edit, remove };
}
