import { useState } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useTournaments } from "@/hooks/useTournaments";
import { DateTimeField } from "@/components/DateTimeField";

export default function NewTournamentScreen() {
  const { create } = useTournaments();
  const [name, setName] = useState("");
  const [game, setGame] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState(new Date());

  const canSubmit = name.trim().length > 0 && game.trim().length > 0;

  async function handleSubmit() {
    if (!canSubmit) return;
    await create({
      name: name.trim(),
      game: game.trim(),
      startDate: startDate.toISOString(),
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    router.back();
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="gap-4">
        <View>
          <Text className="mb-1 text-sm font-medium text-gray-700">
            Nombre del torneo
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ej. Copa de Verano"
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base"
          />
        </View>

        <View>
          <Text className="mb-1 text-sm font-medium text-gray-700">Juego</Text>
          <TextInput
            value={game}
            onChangeText={setGame}
            placeholder="Ej. Valorant"
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base"
          />
        </View>

        <View className="flex-row gap-3">
          <DateTimeField
            label="Fecha de inicio"
            mode="date"
            value={startDate}
            onChange={setStartDate}
            className="flex-1"
          />
          <DateTimeField
            label="Hora de inicio"
            mode="time"
            value={startDate}
            onChange={setStartDate}
            className="flex-1"
          />
        </View>

        <View>
          <Text className="mb-1 text-sm font-medium text-gray-700">
            Ubicación (opcional)
          </Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Ej. Discord / LAN center"
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base"
          />
        </View>

        <View>
          <Text className="mb-1 text-sm font-medium text-gray-700">Notas</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Opcional"
            multiline
            numberOfLines={3}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base"
          />
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          className={`items-center rounded-xl px-4 py-3 ${
            canSubmit ? "bg-primary" : "bg-gray-300"
          }`}
        >
          <Text className="text-base font-semibold text-white">
            Crear torneo
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
