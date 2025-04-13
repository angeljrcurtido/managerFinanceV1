import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
  Pressable,
  Modal,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Ingreso {
  _id: string;
  monto: number;
  descripcion: string;
  fecha: string;
  fecha_formateada: string;
}

const ListadoIngres = () => {
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [deletedIngreso, setDeletedIngreso] = useState<Ingreso | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // Al montar el componente, obtenemos el usuario
  useEffect(() => {
    const obtenerUserId = async () => {
      const id = await AsyncStorage.getItem('usuarioId');
      setUserId(id);
    };
    obtenerUserId();
  }, []);

  const formatDate = (text: string): string => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 2) cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    if (cleaned.length > 5) cleaned = cleaned.slice(0, 5) + '/' + cleaned.slice(5, 9);
    return cleaned;
  };

  const convertToISO = (dateStr: string): string => {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return dateStr;
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  };

  const fetchIngresos = async (filterStartDate?: string, filterEndDate?: string) => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await axios.get(`https://kjhjhkjhkj.shop/api/ingresos`, {
        params: {
          userId,
          startDate: filterStartDate,
          endDate: filterEndDate
        },
      });
      setIngresos(response.data.ingresos);
    } catch (error) {
      console.error('Error al obtener ingresos:', error);
      Alert.alert('Error', 'No se pudieron cargar los ingresos');
    } finally {
      setLoading(false);
    }
  };

  // Al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchIngresos();
      }
    }, [userId])
  );

  const handleFilter = () => {
    const isoStartDate = startDate ? convertToISO(startDate) : undefined;
    const isoEndDate = endDate ? convertToISO(endDate) : undefined;
    fetchIngresos(isoStartDate, isoEndDate);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`https://kjhjhkjhkj.shop/api/ingresos/${id}`);
      setIngresos((prev) => prev.filter((ingreso) => ingreso._id !== id));
      setDeletedIngreso(response.data.ingreso);
      setModalVisible(true);
    } catch (error) {
      console.error('Error al anular ingreso:', error);
      Alert.alert('Error', 'No se pudo anular el ingreso');
    }
  };

  const renderItem = ({ item }: { item: Ingreso }) => (
    <View className="bg-white rounded-xl mb-4 shadow-md">
      <View className="bg-green-600 p-4 rounded-t-xl flex-row justify-between items-center">
        <Text className="text-xl font-bold text-white">💰 ${item.monto.toFixed(2)}</Text>
        <Pressable
          onPress={() => handleDelete(item._id)}
          className="bg-red-600 px-4 py-1 rounded-xl active:bg-red-700"
        >
          <Text className="text-white font-semibold">Anular</Text>
        </Pressable>
      </View>
      <View className="p-4 space-y-1">
        <Text className="text-base font-semibold text-gray-800">📝 {item.descripcion}</Text>
        <Text className="text-sm text-gray-500">📅 {item.fecha_formateada}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 px-5 pt-10 pb-5">
      <Text className="text-3xl font-bold text-center text-green-600 mb-6">📄 Lista de Ingresos</Text>

      {/* Filtros */}
      <View className="mb-6">
        <TextInput
          className="bg-white rounded-xl px-4 py-3 border border-gray-200 mb-3 shadow-sm text-gray-800"
          placeholder="📅 Fecha inicio (DD/MM/YYYY)"
          value={startDate}
          onChangeText={(text) => setStartDate(formatDate(text))}
        />
        <TextInput
          className="bg-white rounded-xl px-4 py-3 border border-gray-200 mb-3 shadow-sm text-gray-800"
          placeholder="📅 Fecha fin (DD/MM/YYYY)"
          value={endDate}
          onChangeText={(text) => setEndDate(formatDate(text))}
        />
        <Pressable
          onPress={handleFilter}
          className="bg-indigo-500 py-3 rounded-xl shadow-md active:bg-indigo-600"
        >
          <Text className="text-white text-center font-bold text-base">🔎 Filtrar</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => router.push('/Ingresos/components/CrearIngreso')}
        className="bg-green-600 py-4 rounded-xl mb-4 shadow-md active:bg-green-700"
      >
        <Text className="text-white text-center font-bold text-base">➕ Crear Ingreso</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator size="large" color="#2ecc71" />
      ) : ingresos.length === 0 ? (
        <Text className="text-center text-base text-gray-600 mt-4">No hay ingresos registrados.</Text>
      ) : (
        <FlatList
          data={ingresos}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-5">
          <View className="bg-white rounded-2xl p-6 w-full max-w-md">
            <Text className="text-2xl font-bold mb-4 text-center text-green-600">
              ✅ Ingreso eliminado
            </Text>
            {deletedIngreso && (
              <View className="mb-4 space-y-1">
                <Text className="text-base font-semibold">💵 Monto: ${deletedIngreso.monto.toFixed(2)}</Text>
                <Text className="text-base">📝 {deletedIngreso.descripcion}</Text>
                <Text className="text-base">📅 {deletedIngreso.fecha_formateada}</Text>
              </View>
            )}
            <Pressable onPress={() => setModalVisible(false)} className="bg-blue-600 py-3 rounded-xl mt-2">
              <Text className="text-white text-center font-bold text-base">Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ListadoIngres;
