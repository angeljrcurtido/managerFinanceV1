// app/Egresos/_layout.tsx
import { Stack, useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

export default function EgresosLayout() {
  const router = useRouter()
  return (
    <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Aquí definimos que el título de esta pantalla quede vacío */}
        <Stack.Screen name="index" options={{ title: "" }} />
        <Stack.Screen name="components/CrearEgreso" options={{ title: "" }} />
        <Stack.Screen name="components/ListadoEgreso" options={{ title: "" }} />
        {/* Puedes seguir agregando otros screens si los necesitás */}
      </Stack>
  );
}
