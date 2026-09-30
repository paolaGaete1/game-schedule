import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import type { GameScheduleInput } from "@/models/types";
import { DateTimeField } from "@/components/DateTimeField";

interface ScheduleFormProps {
  initialValue?: Partial<GameScheduleInput>;
  onSubmit: (input: GameScheduleInput) => void | Promise<void>;
  submitLabel?: string;
}

export function ScheduleForm({
  initialValue,
  onSubmit,
  submitLabel = "Guardar",
}: ScheduleFormProps) {
  const [game, setGame] = useState(initialValue?.game ?? "");
  const [notes, setNotes] = useState(initialValue?.notes ?? "");
  const [friendsText, setFriendsText] = useState(
    initialValue?.friends?.join(", ") ?? "",
  );
  const [dateTime, setDateTime] = useState<Date>(
    initialValue?.dateTime ? new Date(initialValue.dateTime) : new Date(),
  );

  const canSubmit = game.trim().length > 0;

  function handleSubmit() {
    if (!canSubmit) return;
    const friends = friendsText
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    onSubmit({
      game: game.trim(),
      dateTime: dateTime.toISOString(),
      notes: notes.trim() || undefined,
      friends,
    });
  }

  return (
    <View className="gap-4">
      <View>
        <Text className="mb-1 text-sm font-medium text-gray-700">Juego</Text>
        <TextInput
          value={game}
          onChangeText={setGame}
          placeholder="Ej. Valorant, Ajedrez, Smash..."
          className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base"
        />
      </View>

      <View className="flex-row gap-3">
        <DateTimeField
          label="Fecha"
          mode="date"
          value={dateTime}
          onChange={setDateTime}
          className="flex-1"
        />
        <DateTimeField
          label="Hora"
          mode="time"
          value={dateTime}
          onChange={setDateTime}
          className="flex-1"
        />
      </View>

      <View>
        <Text className="mb-1 text-sm font-medium text-gray-700">Amigos</Text>
        <TextInput
          value={friendsText}
          onChangeText={setFriendsText}
          placeholder="Ej. Ana, Luis"
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
          {submitLabel}
        </Text>
      </Pressable>
    </View>
  );
}
