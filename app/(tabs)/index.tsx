import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 p-6">
        {/* Header */}
        <View className="mb-8">
          <View className="flex-row items-center gap-2 mb-4">
            <Text className="text-4xl font-bold text-gray-900 dark:text-white">
              Welcome! 👋
            </Text>
          </View>
          <Text className="text-lg text-gray-600 dark:text-gray-400">
            Test de NativeWind con Tailwind CSS
          </Text>
        </View>

        {/* Card 1 - Test de colores y estilos */}
        <View className="bg-blue-100 dark:bg-blue-900 rounded-2xl p-6 mb-4 shadow-lg">
          <View className="flex-row items-center gap-2 mb-3">
            <MaterialIcons name="palette" size={24} color="#3B82F6" />
            <Text className="text-xl font-bold text-blue-900 dark:text-blue-100">
              Test de Colores
            </Text>
          </View>
          <Text className="text-base text-blue-800 dark:text-blue-200 mb-4">
            Si ves este card con fondo azul claro (modo light) o azul oscuro (modo dark),
            ¡NativeWind está funcionando correctamente! 🎉
          </Text>
          <TouchableOpacity
            className="bg-blue-600 py-3 px-4 rounded-lg"
            onPress={() => alert('¡NativeWind funciona!')}
          >
            <Text className="text-white font-semibold text-center">
              Probar Interacción
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card 2 - Test de layouts */}
        <View className="bg-green-100 dark:bg-green-900 rounded-2xl p-6 mb-4 shadow-lg">
          <View className="flex-row items-center gap-2 mb-3">
            <MaterialIcons name="view-module" size={24} color="#22C55E" />
            <Text className="text-xl font-bold text-green-900 dark:text-green-100">
              Test de Layouts
            </Text>
          </View>
          <View className="flex-row gap-2 mb-4">
            <View className="flex-1 bg-green-600 h-16 rounded-lg items-center justify-center">
              <Text className="text-white font-medium">Flex 1</Text>
            </View>
            <View className="flex-1 bg-green-700 h-16 rounded-lg items-center justify-center">
              <Text className="text-white font-medium">Flex 1</Text>
            </View>
            <View className="flex-1 bg-green-800 h-16 rounded-lg items-center justify-center">
              <Text className="text-white font-medium">Flex 1</Text>
            </View>
          </View>
          <Text className="text-sm text-green-800 dark:text-green-200">
            Layout flexbox con gap funcionando ✓
          </Text>
        </View>

        {/* Card 3 - Test de espaciado */}
        <View className="bg-purple-100 dark:bg-purple-900 rounded-2xl p-6 mb-4 shadow-lg">
          <View className="flex-row items-center gap-2 mb-3">
            <MaterialIcons name="space-bar" size={24} color="#A855F7" />
            <Text className="text-xl font-bold text-purple-900 dark:text-purple-100">
              Test de Espaciado
            </Text>
          </View>
          <View className="space-y-2">
            <View className="bg-purple-600 p-4 rounded-lg">
              <Text className="text-white">Padding 4</Text>
            </View>
            <View className="bg-purple-700 p-6 rounded-lg">
              <Text className="text-white">Padding 6</Text>
            </View>
            <View className="bg-purple-800 p-8 rounded-lg">
              <Text className="text-white">Padding 8</Text>
            </View>
          </View>
        </View>

        {/* Card 4 - Navegación */}
        <View className="bg-orange-100 dark:bg-orange-900 rounded-2xl p-6 mb-4 shadow-lg">
          <View className="flex-row items-center gap-2 mb-3">
            <MaterialIcons name="explore" size={24} color="#F97316" />
            <Text className="text-xl font-bold text-orange-900 dark:text-orange-100">
              Navegación
            </Text>
          </View>
          <Text className="text-base text-orange-800 dark:text-orange-200 mb-4">
            Prueba la navegación a otras pantallas:
          </Text>
          <TouchableOpacity
            className="bg-orange-600 py-3 px-4 rounded-lg mb-2"
            onPress={() => router.push('/Ingresos/CrearIngreso')}
          >
            <Text className="text-white font-semibold text-center">
              Ir a Crear Ingreso
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-orange-700 py-3 px-4 rounded-lg"
            onPress={() => router.push('/modal')}
          >
            <Text className="text-white font-semibold text-center">
              Abrir Modal
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl">
          <Text className="text-center text-gray-600 dark:text-gray-400 text-sm">
            ✅ NativeWind v4 + Expo 54
          </Text>
          <Text className="text-center text-gray-500 dark:text-gray-500 text-xs mt-2">
            Tailwind CSS funcionando en React Native
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
