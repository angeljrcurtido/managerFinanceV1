import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CrearIngreso = () => {
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const obtenerUserId = async () => {
      const id = await AsyncStorage.getItem('usuarioId');
      setUserId(id);
    };
    obtenerUserId();
  }, []);

  const formatDate = (text: string): string => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 2) {
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length > 5) {
      cleaned = cleaned.slice(0, 5) + '/' + cleaned.slice(5, 9);
    }
    return cleaned;
  };

  const handleCrearIngreso = async () => {
    if (!userId) {
      Alert.alert('⚠️ Error', 'Usuario no identificado.');
      return;
    }

    try {
      await axios.post('https://kjhjhkjhkj.shop/api/ingresos', {
        monto: parseFloat(monto),
        descripcion,
        fecha: fecha || new Date().toISOString(),
        userId
      });

      Alert.alert('✅ Éxito', 'Ingreso creado correctamente');
      setMonto('');
      setDescripcion('');
      setFecha('');
    } catch (error) {
      console.error('Error al crear ingreso:', error);
      Alert.alert('❌ Error', 'No se pudo crear el ingreso');
    }
  };

  return (
    <View className="flex-1 bg-gray-100 px-5 pt-10 pb-5">
      <Text className="text-3xl font-bold text-center text-green-600 mb-8">
        💰 Crear Ingreso
      </Text>

      <View className="bg-white p-5 rounded-2xl shadow-md space-y-4">
        <View>
          <Text className="text-gray-700 font-semibold mb-1">💵 Monto:</Text>
          <TextInput
            className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 text-gray-800"
            keyboardType="numeric"
            value={monto}
            onChangeText={setMonto}
            placeholder="Ingrese el monto"
          />
        </View>

        <View>
          <Text className="text-gray-700 font-semibold mb-1">📝 Descripción:</Text>
          <TextInput
            className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 text-gray-800"
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Ingrese una descripción"
          />
        </View>

        <View>
          <Text className="text-gray-700 font-semibold mb-1">📅 Fecha (opcional):</Text>
          <TextInput
            className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 text-gray-800"
            value={fecha}
            onChangeText={(text) => setFecha(formatDate(text))}
            placeholder="DD/MM/YYYY"
          />
        </View>

        <Pressable
          onPress={handleCrearIngreso}
          className="bg-green-600 py-4 rounded-xl mt-4 shadow-md active:bg-green-700"
        >
          <Text className="text-white text-center font-bold text-base">➕ Crear Ingreso</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/Ingresos/components/ListadoIngreso")}
          className="bg-gray-800 py-4 rounded-xl mt-2 shadow-md active:bg-gray-900"
        >
          <Text className="text-white text-center font-bold text-base">📋 Listado Ingresos</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CrearIngreso;
