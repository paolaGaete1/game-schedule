import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { useSchedules } from "@/hooks/useSchedules";
import { ScheduleCard } from "@/components/ScheduleCard";

export default function ScheduleScreen() {
  const { schedules, remove } = useSchedules();

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-6">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-900">
          Mis horarios
        </Text>
        <Pressable
          onPress={() => router.push("/schedule/new")}
          className="rounded-full bg-primary px-4 py-2 active:opacity-80"
        >
          <Text className="text-sm font-semibold text-white">+ Nuevo</Text>
        </Pressable>
      </View>

      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ScheduleCard
            schedule={item}
            onPress={() => router.push(`/schedule/${item.id}`)}
            onDelete={() => remove(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text className="mt-10 text-center text-sm text-gray-400">
            Aún no has creado ningún horario de juego.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
