// app/Usuario/Registro/_layout.tsx
import { Stack, useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';

export default function RegistroLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: '' }} />
    </Stack>
  );
}
