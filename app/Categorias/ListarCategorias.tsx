import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchCategories } from '../../DataBase/TablaCategoria';
import { Category } from './interface';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
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
    <View className="bg-white rounded-lg shadow p-4 mb-3 flex-row items-center">
      {/* Renderiza el icono usando la clave almacenada en el campo icon */}
      <MaterialIcons name={item.icon} size={24} color="black" />
      <Text className="text-lg font-semibold text-gray-800 ml-2">{item.name}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 p-6">
      <BannerAd
        unitId={__DEV__ ? TestIds.BANNER : 'ca-app-pub-2555525398874365/1363242036'}
        size={BannerAdSize.BANNER}
        onAdFailedToLoad={(error) => console.error('Error al cargar el banner:', error)}
      />
      <Text className="text-2xl font-bold text-gray-800 mb-6">Listado de Categorías</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategory}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity
        onPress={() => router.back()}
        activeOpacity={0.8}
        className="mt-6 bg-blue-600 py-3 rounded-md"
      >
        <Text className="text-center text-white font-semibold">Volver</Text>
      </TouchableOpacity>
    </View>
  );
}