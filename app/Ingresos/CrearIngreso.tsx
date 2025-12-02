// app/Ingresos/CrearIngresos.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { insertIncome } from '../../DataBase/TablaIngresos';
import { MaterialIcons } from '@expo/vector-icons';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { fetchCategories } from '../../DataBase/TablaCategoria';
import { Category } from '../Categorias/interface';
import CustomDatePicker from '../../components/CustomDatePicker';

export default function CrearIngresos() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  // Estado para la fecha seleccionada (por defecto: hoy)
  const [date, setDate] = useState(new Date());
  const [modalNoCategories, setModalNoCategories] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Modal de éxito
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false); // Modal para seleccionar categoría
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        console.log("Carga con exito:", data);
        setCategories(data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    loadCategories();
  }, []);

  const handleAddIncome = async () => {
    if (!amount || !description || !selectedCategory) {
      if (!amount) {
        alert("Por favor, ingresa un monto.");
        return;
      }
      if (!description) {
        alert("Por favor, ingresa una descripción.");
        return;
      }
      if (!selectedCategory) {
        alert("Por favor, selecciona una categoría.");
        return;
      }
    }
  
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return;

    // Utilizar la fecha elegida por el usuario
    const fechaFormateada = format(date, 'dd/MM/yyyy', { locale: es });

    await insertIncome(parsedAmount, description, fechaFormateada, selectedCategory.id);
    setAmount('');
    setDescription('');
    setSelectedCategory(null);

    // Mostrar modal de éxito
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
    }, 3000);
  };


  // Renderiza cada categoría en el modal de selección
  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedCategory(item);
        setModalCategoryVisible(false);
      }}
      className="border border-gray-300 rounded-md p-3 mb-2 bg-white flex-row items-center"
    >
      <MaterialIcons name={item.icon as any} size={24} color="black" />
      <Text className="text-gray-800">{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100 p-6">
                   <BannerAd
                   unitId={__DEV__ ? TestIds.BANNER : 'ca-app-pub-2555525398874365/1363242036'}
                   size={BannerAdSize.BANNER}
                   onAdFailedToLoad={(error) => console.error('Error al cargar el banner:', error)}
                 />
      {/* Modal de Éxito */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/30">
          <View className="bg-white w-80 p-6 rounded-2xl shadow-lg items-center">
            <Text className="text-green-600 text-lg font-semibold mb-3">
              ¡Ingreso registrado!
            </Text>
            <Pressable
              onPress={() => setModalVisible(false)}
              className="bg-green-500 px-4 py-2 rounded-md mt-2"
            >
              <Text className="text-white font-medium">Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal para Seleccionar Categoría */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalCategoryVisible}
        onRequestClose={() => setModalCategoryVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/30">
          <View className="bg-white w-80 p-6 rounded-2xl shadow-lg">
            <Text className="text-xl font-semibold mb-4 text-gray-800">
              Selecciona una Categoría
            </Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCategoryItem}
              contentContainerStyle={{ paddingBottom: 10 }}
            />
            <Pressable
              onPress={() => setModalCategoryVisible(false)}
              className="bg-red-500 px-4 py-2 rounded-md mt-2"
            >
              <Text className="text-white font-medium text-center">Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal de Advertencia - No hay categorías */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalNoCategories}
        onRequestClose={() => setModalNoCategories(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/30">
          <View className="bg-white w-80 p-6 rounded-2xl shadow-lg items-center">
            <Text className="text-red-600 text-lg font-semibold mb-3 text-center">
              ¡Se necesita crear una categoría!
            </Text>
            <Pressable
              onPress={() => {
                setModalNoCategories(false);
                router.push("/Categorias/CrearCategorias");
              }}
              className="bg-blue-600 px-4 py-2 rounded-md mt-2 w-full"
            >
              <Text className="text-white font-medium text-center">
                Ir a Crear Categoría
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setModalNoCategories(false)}
              className="mt-2"
            >
              <Text className="text-gray-600 underline text-sm">Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Tarjeta de Registro */}
      <View className="bg-white rounded-lg shadow p-6">
        <Text className="text-2xl font-semibold text-gray-800 mb-6">
          Registro de Ingresos
        </Text>
        <TextInput
          className="border border-gray-300 rounded-md p-3 mb-4 text-gray-900"
          placeholder="Monto"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
          placeholderTextColor="#9CA3AF"
        />
        <TextInput
          className="border border-gray-300 rounded-md p-3 mb-4 text-gray-900"
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor="#9CA3AF"
        />

        {/* Selector de Fecha */}
        <CustomDatePicker
          selectedDate={date}
          onDateChange={setDate}
        />

        {/* Selector de Categoría */}
        <View className="mb-4">
          <Text className="text-gray-800 mb-2 font-medium">Categoría:</Text>
          <TouchableOpacity
              onPress={() => {
                if (categories.length === 0) {
                  setModalNoCategories(true);
                } else {
                  setModalCategoryVisible(true);
                }
              }}
              activeOpacity={0.8}
              className="border border-gray-300 rounded-md p-3 bg-white"
            >
              <Text className="text-gray-900">
                Seleccionar Categoría
              </Text>
          </TouchableOpacity>
          {selectedCategory && (
            <View className=' flex-row items-center'>
             <MaterialIcons className='mt-2' name={selectedCategory.icon as any} size={18} color="#374151" />
            <Text className="mt-2 text-gray-700 italic">
              Categoría seleccionada: {selectedCategory.name}
            </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={handleAddIncome}
          activeOpacity={0.8}
          className="bg-blue-600 py-3 rounded-md"
        >
          <Text className="text-center text-white font-semibold">
            Añadir Ingreso
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botón para ver el listado */}
      <TouchableOpacity
        onPress={() => router.push('/Ingresos/ListarIngresos')}
        activeOpacity={0.8}
        className="mt-6 bg-green-500 py-3 rounded-md"
      >
        <Text className="text-center text-white font-semibold">
          Ver Listado de Ingresos
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/Categorias/CrearCategorias')}
        activeOpacity={0.8}
        className="mt-6 bg-green-500 py-3 rounded-md"
      >
        <Text className="text-center text-white font-semibold">
          Crear Categoria
        </Text>
      </TouchableOpacity>
    </View>
  );
}
