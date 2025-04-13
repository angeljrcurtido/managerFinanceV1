import { Stack, useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

export default function IngresosLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerBackVisible: false,
      }}
    >
      {/* Aquí definimos que el título de esta pantalla quede vacío */}
      <Stack.Screen name="index" options={{ title: "" }} />
      <Stack.Screen name="components/CrearIngreso" options={{ title: "" }} />
      <Stack.Screen name="components/ListadoIngreso" options={{ title: "" }} />
      {/* Puedes seguir agregando otros screens si los necesitás */}
    </Stack>
  );
}
