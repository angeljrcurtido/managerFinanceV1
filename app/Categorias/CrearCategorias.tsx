// app/Categorias/CrearCategorias.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { insertCategory } from '../../DataBase/TablaCategoria';

import { MaterialIcons } from '@expo/vector-icons';

export default function CrearCategorias() {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>('shopping-cart'); // Valor por defecto
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  // Array de iconos predefinidos (puedes agregar o quitar según lo requieras)
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
    'favorite'
  ];

  const handleCreateCategory = async () => {
    if (!name.trim()) {
      alert("Por favor, ingresa un nombre para la categoría.");
      return;
    }
    try {
      // Inserta la categoría con el nombre y la clave del icono seleccionado
      await insertCategory(name.trim(), selectedIcon);
      alert("Categoría creada correctamente.");
      setName('');
      setSelectedIcon('shopping-cart');
      router.back();
    } catch (error) {
      console.error("Error al insertar la categoría:", error);
      alert("No se pudo crear la categoría. Verifica que el nombre no se repita.");
    }
  };

  // Renderiza cada icono en el modal de selección
  const renderIconItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedIcon(item);
        setModalVisible(false);
      }}
      className="p-2 m-1 border border-gray-300 rounded"
    >
      <MaterialIcons name={item} size={32} color={item === selectedIcon ? 'blue' : 'black'} />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100 p-6">
      <BannerAd
        unitId={__DEV__ ? TestIds.BANNER : 'ca-app-pub-2555525398874365/1363242036'}
        size={BannerAdSize.BANNER}
        onAdFailedToLoad={(error) => console.error('Error al cargar el banner:', error)}
      />
      <Text className="text-2xl font-bold text-gray-800 mb-6">Crear Categoría</Text>

      <TextInput
        className="border border-gray-300 rounded-md p-3 mb-4 text-gray-900"
        placeholder="Nombre de la categoría"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#9CA3AF"
      />

      {/* Botón para Seleccionar Icono */}
      <Text className="mb-2 text-gray-800 font-medium">Icono:</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
        className="border border-gray-300 rounded-md p-3 bg-white flex-row items-center justify-between"
      >
        <MaterialIcons name={selectedIcon} size={24} color="black" />
        <Text className="ml-2 text-gray-900">Seleccionar Icono</Text>
      </TouchableOpacity>

      {/* Muestra el icono seleccionado */}
      <View className="flex-row items-center mt-2">
        <Text className="text-gray-700">Icono seleccionado: </Text>
        <MaterialIcons name={selectedIcon} size={24} color="black" />
      </View>

      {/* Botón para crear la categoría */}
      <TouchableOpacity
        onPress={handleCreateCategory}
        activeOpacity={0.8}
        className="bg-blue-600 py-3 rounded-md mt-6"
      >
        <Text className="text-center text-white font-semibold">Crear Categoría</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('Categorias/ListarCategorias')}
        activeOpacity={0.8}
        className="mt-6 bg-green-500 py-3 rounded-md"
      >
        <Text className="text-center text-white font-semibold">Lista de Categorias</Text>
      </TouchableOpacity>

      {/* Modal de selección de iconos */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/30">
          <View className="bg-white w-80 p-6 rounded-2xl shadow-lg">
            <Text className="text-xl font-semibold mb-4 text-gray-800">Selecciona un Icono</Text>
            <FlatList
              data={availableIcons}
              keyExtractor={(item) => item}
              renderItem={renderIconItem}
              numColumns={3}
              contentContainerStyle={{ alignItems: 'center' }}
            />
            <Pressable
              onPress={() => setModalVisible(false)}
              className="bg-red-500 px-4 py-2 rounded-md mt-4"
            >
              <Text className="text-white font-medium text-center">Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
