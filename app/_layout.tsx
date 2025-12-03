import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { initIngresosTable } from '../DataBase/TablaIngresos';
import { initCategoriasTable } from '../DataBase/TablaCategoria';
import { initEgresosTable } from '../DataBase/TablaEgresos';

export const unstable_settings = {
  anchor: '/',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {

    // Inicializar base de datos
    async function initDatabase() {
      try {
        await initCategoriasTable();
        await initEgresosTable();
        await initIngresosTable();
        console.log("Base de datos inicializada correctamente");
      } catch (error) {
        console.error("Error al inicializar la base de datos:", error);
      }
    }

    initDatabase();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="Categorias/CrearCategorias" options={{ title: 'Crear Categoría' }} />
        <Stack.Screen name="Categorias/ListarCategorias" options={{ title: 'Lista de Categorías' }} />
        <Stack.Screen name="Egresos/CrearEgresos" options={{ title: 'Registrar Egreso' }} />
        <Stack.Screen name="Egresos/ListarEgresos" options={{ title: 'Lista de Egresos' }} />
        <Stack.Screen name="Ingresos/CrearIngreso" options={{ title: 'Registrar Ingreso' }} />
        <Stack.Screen name="Ingresos/ListarIngresos" options={{ title: 'Lista de Ingresos' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
