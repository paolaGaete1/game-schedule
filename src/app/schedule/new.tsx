import { router } from "expo-router";
import { ScrollView } from "react-native";
import { ScheduleForm } from "@/components/ScheduleForm";
import { useSchedules } from "@/hooks/useSchedules";

export default function NewScheduleScreen() {
  const { create } = useSchedules();

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <ScheduleForm
        submitLabel="Crear horario"
        onSubmit={async (input) => {
          await create(input);
          router.back();
        }}
      />
    </ScrollView>
  );
}
