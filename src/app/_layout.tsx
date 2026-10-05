import "../../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerTitleAlign: "center" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="schedule/new"
          options={{ presentation: "modal", title: "Nuevo horario" }}
        />
        <Stack.Screen
          name="schedule/[id]"
          options={{ presentation: "modal", title: "Editar horario" }}
        />
        <Stack.Screen
          name="tournament/[id]"
          options={{ title: "Torneo" }}
        />
        <Stack.Screen
          name="tournament/new"
          options={{ presentation: "modal", title: "Nuevo torneo" }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
