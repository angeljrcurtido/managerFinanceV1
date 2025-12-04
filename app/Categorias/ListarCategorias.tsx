import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchCategories } from '../../DataBase/TablaCategoria';
import { Category } from './interface';
import { MaterialIcons } from '@expo/vector-icons';

export default function ListarCategorias() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      console.log("Datos de categorías:", data);
      setCategories(data);
    } catch (error) {
      console.error("Error al cargar las categorías:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const renderCategory = ({ item }: { item: Category }) => (
    <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-3 shadow-md">
      <View className="flex-row items-center">
        {/* Icono en círculo con fondo púrpura */}
        <View className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full">
          <MaterialIcons name={item.icon as any} size={24} color="#A855F7" />
        </View>

        {/* Nombre de la categoría */}
        <View className="flex-1 ml-4">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            {item.name}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            Categoría personalizada
          </Text>
        </View>

        {/* Flecha indicadora */}
        <MaterialIcons name="arrow-forward-ios" size={18} color="#9CA3AF" />
      </View>
    </View>
  );

  return (
    <View className="bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-purple-600 dark:bg-purple-800 pt-12 pb-6 px-6">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold mb-1">Categorías</Text>
            <Text className="text-purple-100 text-sm">Organiza tus finanzas</Text>
          </View>
          <View className="bg-white/20 p-3 rounded-full">
            <MaterialIcons name="category" size={24} color="white" />
          </View>
        </View>

        {/* Total */}
        <View className="bg-white/10 rounded-2xl p-4 mt-2">
          <Text className="text-purple-100 text-xs mb-1">Total de Categorías</Text>
          <Text className="text-white text-xl font-bold">
            {categories.length}
          </Text>
          <Text className="text-purple-100 text-xs mt-1">
            {categories.length === 1 ? 'categoría creada' : 'categorías creadas'}
          </Text>
        </View>
      </View>

      {/* Lista */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategory}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <MaterialIcons name="category" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-4 text-lg">
              No hay categorías creadas
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 text-center mt-2">
              Crea tu primera categoría para organizar tus movimientos
            </Text>
          </View>
        }
      />

      {/* Botón flotante */}
      <View className="absolute bottom-6 right-6 left-6">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.9}
          className="bg-purple-600 dark:bg-purple-700 py-4 rounded-2xl shadow-lg flex-row items-center justify-center"
        >
          <MaterialIcons name="add-circle" size={24} color="white" />
          <Text className="text-white font-bold text-lg ml-2">Nueva Categoría</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}