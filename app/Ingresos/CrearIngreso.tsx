// app/Ingresos/CrearIngresos.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  Alert
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { insertIncome } from '../../DataBase/TablaIngresos';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchCategories } from '../../DataBase/TablaCategoria';
import { Category } from '../Categorias/interface';
import CustomDatePicker from '../../components/CustomDatePicker';

export default function CrearIngresos() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  const loadCategories = useCallback(async () => {
    try {
      const data = await fetchCategories();
      console.log("Categorías cargadas:", data);
      setCategories(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  }, []);

  // Recargar categorías cada vez que la pantalla recibe el foco
  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [loadCategories])
  );

  const handleAddIncome = async () => {
    if (!amount || !description || !selectedCategory) {
      if (!amount) {
        Alert.alert("Campo requerido", "Por favor, ingresa un monto.");
        return;
      }
      if (!description) {
        Alert.alert("Campo requerido", "Por favor, ingresa una descripción.");
        return;
      }
      if (!selectedCategory) {
        Alert.alert("Campo requerido", "Por favor, selecciona una categoría.");
        return;
      }
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      Alert.alert("Error", "El monto debe ser un número válido.");
      return;
    }

    const fechaFormateada = format(date, 'dd/MM/yyyy', { locale: es });

    try {
      await insertIncome(parsedAmount, description, fechaFormateada, selectedCategory.id);
      Alert.alert("¡Éxito!", "Ingreso registrado correctamente.", [
        { text: "OK", onPress: () => {
          setAmount('');
          setDescription('');
          setSelectedCategory(null);
        }}
      ]);
    } catch (error) {
      Alert.alert("Error", "No se pudo registrar el ingreso.");
    }
  };

  const renderCategoryItem = ({ item }: { item: Category }) => {
    const isSelected = selectedCategory?.id === item.id;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedCategory(item);
          setModalCategoryVisible(false);
        }}
        activeOpacity={0.7}
        className={`rounded-2xl p-4 mb-2 flex-row items-center ${
          isSelected
            ? 'bg-green-100 border-2 border-green-600'
            : 'bg-gray-50 border-2 border-transparent'
        }`}
      >
        <View className={`p-3 rounded-full ${
          isSelected ? 'bg-green-200' : 'bg-gray-200'
        }`}>
          <MaterialIcons name={item.icon as any} size={24} color={isSelected ? '#10B981' : '#6B7280'} />
        </View>
        <Text className={`ml-3 text-base font-semibold ${
          isSelected ? 'text-green-700' : 'text-gray-800'
        }`}>
          {item.name}
        </Text>
        {isSelected && (
          <MaterialIcons name="check-circle" size={24} color="#10B981" style={{ marginLeft: 'auto' }} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-green-600 dark:bg-green-800 pt-12 pb-8 px-6 rounded-b-[40px]">
          <View className="flex-row items-center mb-4">
            <View className="bg-white/20 p-3 rounded-full">
              <MaterialIcons name="add-circle" size={32} color="white" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-white text-3xl font-bold mb-1">Nuevo Ingreso</Text>
              <Text className="text-green-100">Registra tus ganancias</Text>
            </View>
          </View>
        </View>

        <View className="px-6 mt-6">
          {/* Card principal */}
          <View className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg mb-6">
            {/* Monto */}
            <View className="mb-6">
              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2 text-base">
                Monto
              </Text>
              <View className="flex-row items-center bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4">
                <MaterialIcons name="attach-money" size={24} color="#10B981" />
                <TextInput
                  className="flex-1 py-4 text-gray-900 dark:text-white text-lg font-semibold"
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={setAmount}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Descripción */}
            <View className="mb-6">
              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2 text-base">
                Descripción
              </Text>
              <View className="flex-row items-center bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4">
                <MaterialIcons name="description" size={24} color="#6B7280" />
                <TextInput
                  className="flex-1 py-4 text-gray-900 dark:text-white text-base ml-2"
                  placeholder="Ej: Salario, Venta, Bonificación..."
                  value={description}
                  onChangeText={setDescription}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Fecha */}
            <View className="mb-6">
              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2 text-base">
                Fecha
              </Text>
              <CustomDatePicker
                selectedDate={date}
                onDateChange={setDate}
              />
            </View>

            {/* Categoría */}
            <View className="mb-6">
              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2 text-base">
                Categoría
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (categories.length === 0) {
                    Alert.alert(
                      "Sin categorías",
                      "Necesitas crear al menos una categoría primero.",
                      [
                        { text: "Cancelar", style: "cancel" },
                        { text: "Crear categoría", onPress: () => router.push("/Categorias/CrearCategorias" as any) }
                      ]
                    );
                  } else {
                    setModalCategoryVisible(true);
                  }
                }}
                activeOpacity={0.8}
                className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 flex-row items-center justify-between"
              >
                {selectedCategory ? (
                  <View className="flex-row items-center flex-1">
                    <View className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                      <MaterialIcons name={selectedCategory.icon as any} size={24} color="#10B981" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="text-gray-900 dark:text-white font-semibold">
                        {selectedCategory.name}
                      </Text>
                      <Text className="text-green-600 dark:text-green-400 text-xs">
                        Categoría seleccionada
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View className="flex-row items-center flex-1">
                    <MaterialIcons name="category" size={24} color="#10B981" />
                    <Text className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                      Seleccionar categoría
                    </Text>
                  </View>
                )}
                <MaterialIcons name="arrow-forward-ios" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Botón Guardar */}
            <TouchableOpacity
              onPress={handleAddIncome}
              activeOpacity={0.8}
              className="bg-green-600 dark:bg-green-700 py-4 rounded-xl flex-row items-center justify-center shadow-md"
            >
              <MaterialIcons name="check-circle" size={22} color="white" />
              <Text className="text-center text-white font-bold text-lg ml-2">
                Guardar Ingreso
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botones secundarios */}
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              onPress={() => router.push('/Ingresos/ListarIngresos' as any)}
              activeOpacity={0.8}
              className="flex-1 bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-800 py-3 rounded-xl flex-row items-center justify-center"
            >
              <MaterialIcons name="list" size={20} color="#10B981" />
              <Text className="text-green-600 dark:text-green-400 font-bold text-sm ml-2">
                Ver Ingresos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/Categorias/CrearCategorias' as any)}
              activeOpacity={0.8}
              className="flex-1 bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800 py-3 rounded-xl flex-row items-center justify-center"
            >
              <MaterialIcons name="category" size={20} color="#A855F7" />
              <Text className="text-purple-600 dark:text-purple-400 font-bold text-sm ml-2">
                Categorías
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal para Seleccionar Categoría */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalCategoryVisible}
        onRequestClose={() => setModalCategoryVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white dark:bg-gray-800 w-11/12 max-w-md rounded-3xl p-6 shadow-2xl">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                Selecciona una Categoría
              </Text>
              <TouchableOpacity
                onPress={() => setModalCategoryVisible(false)}
                className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full"
              >
                <MaterialIcons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-96">
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCategoryItem}
                scrollEnabled={false}
              />
            </ScrollView>

            <TouchableOpacity
              onPress={() => setModalCategoryVisible(false)}
              className="bg-green-600 py-3 rounded-xl mt-4"
            >
              <Text className="text-white font-bold text-center text-base">Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
