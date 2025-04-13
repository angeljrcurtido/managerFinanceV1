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

interface Egreso {
  _id: string;
  monto: number;
  descripcion: string;
  fecha: string;
  fecha_formateada: string;
}

const ListadoEgreso = () => {
  const [egresos, setEgresos] = useState<Egreso[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [deletedEgreso, setDeletedEgreso] = useState<Egreso | null>(null);
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

  const fetchEgresos = async (filterStartDate?: string, filterEndDate?: string) => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await axios.get('https://kjhjhkjhkj.shop/api/egresos', {
        params: {
          userId,
          startDate: filterStartDate,
          endDate: filterEndDate
        },
      });
      setEgresos(response.data.egresos);
    } catch (error) {
      console.error('Error al obtener egresos:', error);
      Alert.alert('Error', 'No se pudieron cargar los egresos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchEgresos();
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchEgresos();
      }
    }, [userId])
  );
  
  const handleFilter = () => {
    const isoStartDate = startDate ? convertToISO(startDate) : undefined;
    const isoEndDate = endDate ? convertToISO(endDate) : undefined;
    fetchEgresos(isoStartDate, isoEndDate);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`https://kjhjhkjhkj.shop/api/egresos/${id}`);
      setEgresos((prev) => prev.filter((egreso) => egreso._id !== id));
      setDeletedEgreso(response.data.egreso);
      setModalVisible(true);
    } catch (error) {
      console.error('Error al anular egreso:', error);
      Alert.alert('Error', 'No se pudo anular el egreso');
    }
  };

  const renderItem = ({ item }: { item: Egreso }) => (
    <View className="bg-white rounded-xl mb-4 shadow-md">
      <View className="bg-red-600 p-4 rounded-t-xl flex-row justify-between items-center">
        <Text className="text-xl font-bold text-white">💸 ${item.monto.toFixed(2)}</Text>
        <Pressable
          onPress={() => handleDelete(item._id)}
          className="bg-red-800 px-4 py-1 rounded-xl active:bg-red-900"
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
      <Text className="text-3xl font-bold text-center text-red-600 mb-6">📄 Lista de Egresos</Text>

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

      {/* Crear nuevo egreso */}
      <Pressable
        onPress={() => router.push('/Egresos/components/CrearEgreso')}
        className="bg-red-600 py-4 rounded-xl mb-4 shadow-md active:bg-red-700"
      >
        <Text className="text-white text-center font-bold text-base">➕ Crear Egreso</Text>
      </Pressable>

      {/* Lista o mensaje */}
      {loading ? (
        <ActivityIndicator size="large" color="#e74c3c" />
      ) : egresos.length === 0 ? (
        <Text className="text-center text-base text-gray-600 mt-4">No hay egresos registrados.</Text>
      ) : (
        <FlatList
          data={egresos}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}

      {/* Modal de confirmación */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-5">
          <View className="bg-white rounded-2xl p-6 w-full max-w-md">
            <Text className="text-2xl font-bold mb-4 text-center text-green-600">
              ✅ Egreso eliminado
            </Text>
            {deletedEgreso && (
              <View className="mb-4 space-y-1">
                <Text className="text-base font-semibold">💵 Monto: ${deletedEgreso.monto.toFixed(2)}</Text>
                <Text className="text-base">📝 {deletedEgreso.descripcion}</Text>
                <Text className="text-base">📅 {deletedEgreso.fecha_formateada}</Text>
              </View>
            )}
            <Pressable
              onPress={() => setModalVisible(false)}
              className="bg-blue-600 py-3 rounded-xl mt-2"
            >
              <Text className="text-white text-center font-bold text-base">Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ListadoEgreso;
