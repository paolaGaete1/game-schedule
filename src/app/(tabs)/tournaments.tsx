import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { useTournaments } from "@/hooks/useTournaments";
import { TournamentCard } from "@/components/TournamentCard";

export default function TournamentsScreen() {
  const { tournaments } = useTournaments();

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-6">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-900">Torneos</Text>
        <Pressable
          onPress={() => router.push("/tournament/new")}
          className="rounded-full bg-primary px-4 py-2 active:opacity-80"
        >
          <Text className="text-sm font-semibold text-white">+ Nuevo</Text>
        </Pressable>
      </View>

      <FlatList
        data={tournaments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TournamentCard
            tournament={item}
            onPress={() => router.push(`/tournament/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <Text className="mt-10 text-center text-sm text-gray-400">
            Aún no has creado ningún torneo.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
