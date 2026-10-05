import { useMemo } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSchedules } from "@/hooks/useSchedules";
import { useTournaments } from "@/hooks/useTournaments";
import { ScheduleCard } from "@/components/ScheduleCard";
import { TournamentCard } from "@/components/TournamentCard";

export default function HomeScreen() {
  const { schedules } = useSchedules();
  const { tournaments } = useTournaments();

  const { nextSchedules, nextTournaments } = useMemo(() => {
    const now = new Date();
    // Contamos como "próximo" todo lo de hoy en adelante (no solo lo que
    // falta por segundos), así un horario de hace 5 minutos sigue visible.
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();

    return {
      nextSchedules: schedules
        .filter((s) => new Date(s.dateTime).getTime() >= startOfToday)
        .slice(0, 3),
      nextTournaments: tournaments
        .filter((t) => new Date(t.startDate).getTime() >= startOfToday)
        .slice(0, 3),
    };
  }, [schedules, tournaments]);

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-6">
      <Text className="mb-1 text-2xl font-bold text-gray-900">
        Horario de Juegos
      </Text>
      <Text className="mb-6 text-sm text-gray-500">
        Organiza tus horarios de juego y torneos
      </Text>

      <View className="mb-6 flex-row gap-3">
        <Pressable
          onPress={() => router.push("/schedule/new")}
          className="flex-1 items-center rounded-xl bg-primary px-4 py-3 active:opacity-80"
        >
          <Text className="font-semibold text-white">+ Horario</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/tournament/new")}
          className="flex-1 items-center rounded-xl border border-primary px-4 py-3 active:opacity-80"
        >
          <Text className="font-semibold text-primary">+ Torneo</Text>
        </Pressable>
      </View>

      <Text className="mb-2 text-lg font-semibold text-gray-900">
        Próximos horarios
      </Text>
      {nextSchedules.length === 0 ? (
        <Text className="mb-6 text-sm text-gray-400">
          No tienes horarios próximos.
        </Text>
      ) : (
        <View className="mb-6">
          {nextSchedules.map((s) => (
            <ScheduleCard
              key={s.id}
              schedule={s}
              onPress={() => router.push(`/schedule/${s.id}`)}
            />
          ))}
        </View>
      )}

      <Text className="mb-2 text-lg font-semibold text-gray-900">
        Próximos torneos
      </Text>
      {nextTournaments.length === 0 ? (
        <Text className="mb-10 text-sm text-gray-400">
          No tienes torneos próximos.
        </Text>
      ) : (
        <View className="mb-10">
          {nextTournaments.map((t) => (
            <TournamentCard
              key={t.id}
              tournament={t}
              onPress={() => router.push(`/tournament/${t.id}`)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
