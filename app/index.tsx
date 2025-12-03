// app/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function IndexScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900" contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Header con gradiente */}
      <View className="bg-blue-600 dark:bg-blue-900 pt-12 pb-20 px-4 rounded-b-[30px]">
        <View className="items-center">
          <View className="bg-white/20 p-3 rounded-full mb-3">
            <MaterialIcons name="account-balance-wallet" size={40} color="white" />
          </View>
          <Text className="text-3xl font-extrabold text-white mb-1">
            ManagerFinance
          </Text>
          <Text className="text-blue-100 text-center text-sm">
            Controla tus finanzas de manera inteligente
          </Text>
        </View>
      </View>

      {/* Cards de acciones */}
      <View className="px-4 -mt-16">
        {/* Card Ingresos */}
        <TouchableOpacity
          onPress={() => router.push('/Ingresos/CrearIngreso' as any)}
          activeOpacity={0.9}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3 shadow-lg"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <View className="bg-green-100 dark:bg-green-900 p-3 rounded-full mr-3">
                  <MaterialIcons name="trending-up" size={24} color="#10B981" />
                </View>
                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                  Registrar Ingreso
                </Text>
              </View>
              <Text className="text-gray-600 dark:text-gray-400 ml-14">
                Añade tus ganancias y aumenta tu balance
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="#9CA3AF" />
          </View>
        </TouchableOpacity>

        {/* Card Egresos */}
        <TouchableOpacity
          onPress={() => router.push('/Egresos/CrearEgresos' as any)}
          activeOpacity={0.9}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3 shadow-lg"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <View className="bg-red-100 dark:bg-red-900 p-3 rounded-full mr-3">
                  <MaterialIcons name="trending-down" size={24} color="#EF4444" />
                </View>
                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                  Registrar Egreso
                </Text>
              </View>
              <Text className="text-gray-600 dark:text-gray-400 ml-14">
                Controla tus gastos y mantén tu presupuesto
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="#9CA3AF" />
          </View>
        </TouchableOpacity>

        {/* Card Categorías */}
        <TouchableOpacity
          onPress={() => router.push('/Categorias/CrearCategorias' as any)}
          activeOpacity={0.9}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3 shadow-lg"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <View className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mr-3">
                  <MaterialIcons name="category" size={24} color="#A855F7" />
                </View>
                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                  Categorías
                </Text>
              </View>
              <Text className="text-gray-600 dark:text-gray-400 ml-14">
                Organiza tus movimientos financieros
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="#9CA3AF" />
          </View>
        </TouchableOpacity>

        {/* Accesos rápidos */}
        <View className="bg-indigo-600 dark:bg-indigo-800 rounded-2xl p-4 mt-2 mb-4">
          <Text className="text-white font-bold text-base mb-3">Accesos Rápidos</Text>
          <View className="flex-row justify-around">
            <TouchableOpacity
              onPress={() => router.push('/Ingresos/ListarIngresos' as any)}
              className="items-center"
            >
              <View className="bg-white/20 p-3 rounded-xl mb-2">
                <MaterialIcons name="list" size={24} color="white" />
              </View>
              <Text className="text-white text-xs font-medium text-center">Ver Ingresos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/Egresos/ListarEgresos' as any)}
              className="items-center"
            >
              <View className="bg-white/20 p-3 rounded-xl mb-2">
                <MaterialIcons name="receipt-long" size={24} color="white" />
              </View>
              <Text className="text-white text-xs font-medium text-center">Ver Egresos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/Categorias/ListarCategorias' as any)}
              className="items-center"
            >
              <View className="bg-white/20 p-3 rounded-xl mb-2">
                <MaterialIcons name="label" size={24} color="white" />
              </View>
              <Text className="text-white text-xs font-medium text-center">Categorías</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
