import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { ScheduleForm } from "@/components/ScheduleForm";
import { useSchedules } from "@/hooks/useSchedules";

export default function EditScheduleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { schedules, edit } = useSchedules();
  const schedule = schedules.find((s) => s.id === id);

  if (!schedule) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Text className="text-sm text-gray-400">Horario no encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <ScheduleForm
        initialValue={schedule}
        submitLabel="Guardar cambios"
        onSubmit={async (input) => {
          await edit(schedule.id, input);
          router.back();
        }}
      />
    </ScrollView>
  );
}
