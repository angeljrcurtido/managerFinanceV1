// app/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function IndexScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">

      {/* Título */}
      <Text className="text-3xl font-extrabold text-blue-800 mb-4">
        RegistroMovimientos
      </Text>
      <Text className="text-base text-gray-600 mb-10 text-center">
        Administra tus ingresos y egresos diarios de forma simple.
      </Text>

      {/* Botón: Registrar Ingreso */}
      <TouchableOpacity
        onPress={() => router.push('Ingresos/CrearIngreso')}
        className="w-full bg-blue-600 flex-row items-center justify-center py-4 rounded-xl mb-4"
      >
        <MaterialIcons name="trending-up" size={22} color="white" className="mr-2" />
        <Text className="text-white font-semibold text-base">Registrar Ingreso</Text>
      </TouchableOpacity>

      {/* Botón: Registrar Egreso */}
      <TouchableOpacity
        onPress={() => router.push('Egresos/CrearEgresos')}
        className="w-full bg-red-600 flex-row items-center justify-center py-4 rounded-xl"
      >
        <MaterialIcons name="trending-down" size={22} color="white" className="mr-2" />
        <Text className="text-white font-semibold text-base">Registrar Egreso</Text>
      </TouchableOpacity>
    </View>
  );
}
