// app/Categorias/CrearCategorias.tsx
import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { insertCategory } from '../../DataBase/TablaCategoria';
import { MaterialIcons } from '@expo/vector-icons';
import { BannerAd, BannerAdSize, useForeground } from 'react-native-google-mobile-ads';
import { adUnitId } from '@/constants/addUnitId';

export default function CrearCategorias() {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>('shopping-cart');
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const bannerRef = useRef<BannerAd>(null);

  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  });

  const availableIcons = [
    'shopping-cart',
    'home',
    'star',
    'restaurant',
    'fitness-center',
    'local-cafe',
    'work',
    'school',
    'directions-car',
    'favorite',
    'local-hospital',
    'flight',
    'movie',
    'music-note',
    'phone',
    'laptop'
  ];

  const handleCreateCategory = async () => {
    if (!name.trim()) {
      Alert.alert("Campo requerido", "Por favor, ingresa un nombre para la categoría.");
      return;
    }
    try {
      await insertCategory(name.trim(), selectedIcon);
      Alert.alert("¡Éxito!", "Categoría creada correctamente.", [
        { text: "OK", onPress: () => router.back() }
      ]);
      setName('');
      setSelectedIcon('shopping-cart');
    } catch (error) {
      console.error("Error al insertar la categoría:", error);
      Alert.alert("Error", "No se pudo crear la categoría. Verifica que el nombre no se repita.");
    }
  };

  const renderIconItem = ({ item }: { item: string }) => {
    const isSelected = item === selectedIcon;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedIcon(item);
          setModalVisible(false);
        }}
        activeOpacity={0.7}
        className={`m-2 p-4 rounded-2xl ${isSelected
          ? 'bg-purple-100 border-2 border-purple-600'
          : 'bg-gray-100 border-2 border-transparent'
          }`}
      >
        <MaterialIcons name={item as any} size={32} color={isSelected ? '#A855F7' : '#6B7280'} />
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Banner fijo al final */}
        <View className="bg-white dark:bg-gray-800 items-center py-2">
          <BannerAd
            ref={bannerRef}
            unitId={adUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          />
        </View>

        {/* Header */}
        <View className="bg-purple-600 dark:bg-purple-800 pt-10 pb-6 px-4 rounded-b-[30px]">
          <View className="flex-row items-center mb-4">
            <View className="bg-white/20 p-3 rounded-full">
              <MaterialIcons name="add-circle" size={32} color="white" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-white text-3xl font-bold mb-1">Nueva Categoría</Text>
              <Text className="text-purple-100">Organiza tus movimientos</Text>
            </View>
          </View>
        </View>

        <View className="px-4 mt-4">
          {/* Card principal */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg mb-4">
            {/* Vista previa del icono */}
            <View className="items-center mb-4">
              <View className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full mb-2">
                <MaterialIcons name={selectedIcon as any} size={40} color="#A855F7" />
              </View>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                Icono seleccionado
              </Text>
            </View>

            {/* Input de nombre */}
            <View className="mb-4">
              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2 text-base">
                Nombre de la categoría
              </Text>
              <TextInput
                className="bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-4 text-gray-900 dark:text-white text-base"
                placeholder="Ej: Alimentos, Transporte..."
                value={name}
                onChangeText={setName}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Botón para seleccionar icono */}
            <View className="mb-4">
              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2 text-base">
                Selecciona un icono
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
                className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-4 flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <MaterialIcons name={selectedIcon as any} size={28} color="#A855F7" />
                  <Text className="ml-3 text-gray-900 dark:text-white font-medium">
                    Cambiar icono
                  </Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Botón crear */}
            <TouchableOpacity
              onPress={handleCreateCategory}
              activeOpacity={0.8}
              className="bg-purple-600 dark:bg-purple-700 py-4 rounded-xl flex-row items-center justify-center shadow-md"
            >
              <MaterialIcons name="check-circle" size={22} color="white" />
              <Text className="text-center text-white font-bold text-lg ml-2">
                Crear Categoría
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botón ver lista */}
          <TouchableOpacity
            onPress={() => router.push('/Categorias/ListarCategorias' as any)}
            activeOpacity={0.8}
            className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800 py-4 rounded-xl flex-row items-center justify-center mb-6"
          >
            <MaterialIcons name="list" size={22} color="#A855F7" />
            <Text className="text-center text-purple-600 dark:text-purple-400 font-bold text-base ml-2">
              Ver todas las categorías
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de selección de iconos */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end items-center bg-black/50">
          <View className="bg-white dark:bg-gray-800 w-full rounded-t-3xl p-4 shadow-2xl max-h-[70%]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                Selecciona un Icono
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full"
              >
                <MaterialIcons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={availableIcons}
              keyExtractor={(item) => item}
              renderItem={renderIconItem}
              numColumns={3}
              showsVerticalScrollIndicator={true}
              columnWrapperStyle={{ justifyContent: 'center' }}
              contentContainerStyle={{ paddingBottom: 10 }}
            />

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-purple-600 py-3 rounded-xl mt-4"
            >
              <Text className="text-white font-bold text-center text-base">Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
