import { Pressable, Text, View } from "react-native";
import type { GameSchedule } from "@/models/types";

function formatDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
}

interface ScheduleCardProps {
  schedule: GameSchedule;
  onPress?: () => void;
  onDelete?: () => void;
}

export function ScheduleCard({ schedule, onPress, onDelete }: ScheduleCardProps) {
  const { date, time } = formatDateTime(schedule.dateTime);

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm active:opacity-80"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-2">
          <Text className="text-base font-semibold text-gray-900">
            {schedule.game}
          </Text>
          <Text className="mt-1 text-sm text-gray-500">
            {date} · {time}
          </Text>
          {schedule.friends.length > 0 ? (
            <Text className="mt-1 text-xs text-primary">
              Con: {schedule.friends.join(", ")}
            </Text>
          ) : null}
          {schedule.notes ? (
            <Text className="mt-1 text-xs text-gray-400">{schedule.notes}</Text>
          ) : null}
        </View>
        {onDelete ? (
          <Pressable
            onPress={onDelete}
            hitSlop={8}
            className="rounded-full bg-red-50 px-2 py-1"
          >
            <Text className="text-xs font-medium text-red-500">Borrar</Text>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}
