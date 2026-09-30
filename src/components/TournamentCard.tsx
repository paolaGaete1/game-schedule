import { Pressable, Text, View } from "react-native";
import type { Tournament } from "@/models/types";

interface TournamentCardProps {
  tournament: Tournament;
  onPress?: () => void;
}

export function TournamentCard({ tournament, onPress }: TournamentCardProps) {
  const startDateObj = new Date(tournament.startDate);
  const start = startDateObj.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const startTime = startDateObj.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm active:opacity-80"
    >
      <Text className="text-base font-semibold text-gray-900">
        {tournament.name}
      </Text>
      <Text className="mt-1 text-sm text-gray-500">
        {tournament.game} · Inicia {start} · {startTime}
      </Text>
      {tournament.location ? (
        <Text className="mt-1 text-xs text-gray-400">
          📍 {tournament.location}
        </Text>
      ) : null}
      <View className="mt-2 flex-row items-center">
        <Text className="text-xs font-medium text-primary">
          {tournament.rounds.length} ronda
          {tournament.rounds.length === 1 ? "" : "s"}
        </Text>
      </View>
    </Pressable>
  );
}
