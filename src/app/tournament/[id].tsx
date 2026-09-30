import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useTournaments } from "@/hooks/useTournaments";
import { DateTimeField } from "@/components/DateTimeField";

export default function TournamentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tournaments, addRound } = useTournaments();
  const tournament = tournaments.find((t) => t.id === id);

  const [roundName, setRoundName] = useState("");
  const [roundDate, setRoundDate] = useState(new Date());

  if (!tournament) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Text className="text-sm text-gray-400">Torneo no encontrado.</Text>
      </View>
    );
  }

  async function handleAddRound() {
    if (!roundName.trim()) return;
    await addRound(tournament!.id, {
      name: roundName.trim(),
      dateTime: roundDate.toISOString(),
    });
    setRoundName("");
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-gray-900">
        {tournament.name}
      </Text>
      <Text className="mt-1 text-sm text-gray-500">
        {tournament.game} · Inicia{" "}
        {new Date(tournament.startDate).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </Text>
      {tournament.location ? (
        <Text className="mt-1 text-xs text-gray-400">
          📍 {tournament.location}
        </Text>
      ) : null}
      {tournament.notes ? (
        <Text className="mt-2 text-sm text-gray-600">{tournament.notes}</Text>
      ) : null}

      <Text className="mb-2 mt-6 text-lg font-semibold text-gray-900">
        Rondas
      </Text>
      {tournament.rounds.length === 0 ? (
        <Text className="mb-4 text-sm text-gray-400">
          Sin rondas todavía.
        </Text>
      ) : (
        <View className="mb-4">
          {tournament.rounds.map((round) => (
            <View
              key={round.id}
              className="mb-2 rounded-xl border border-gray-200 bg-white p-3"
            >
              <Text className="font-medium text-gray-900">{round.name}</Text>
              <Text className="text-xs text-gray-500">
                {new Date(round.dateTime).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      <Text className="mb-2 text-base font-semibold text-gray-900">
        Agregar ronda
      </Text>
      <View className="gap-3">
        <TextInput
          value={roundName}
          onChangeText={setRoundName}
          placeholder="Ej. Ronda 1 - Octavos"
          className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base"
        />
        <View className="flex-row gap-3">
          <DateTimeField
            label="Fecha"
            mode="date"
            value={roundDate}
            onChange={setRoundDate}
            className="flex-1"
          />
          <DateTimeField
            label="Hora"
            mode="time"
            value={roundDate}
            onChange={setRoundDate}
            className="flex-1"
          />
        </View>
        <Pressable
          onPress={handleAddRound}
          disabled={!roundName.trim()}
          className={`items-center rounded-xl px-4 py-3 ${
            roundName.trim() ? "bg-primary" : "bg-gray-300"
          }`}
        >
          <Text className="text-base font-semibold text-white">
            Agregar ronda
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
