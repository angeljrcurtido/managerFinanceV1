import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function LoginUsuario() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!correo || !contraseña) {
      Alert.alert('Campos requeridos', 'Ingresá tu correo y contraseña.');
      return;
    }

    try {
      const response = await axios.post('https://kjhjhkjhkj.shop/api/usuarios/login', {
        correo,
        contraseña,
      });

      const { id } = response.data.usuario;
      await AsyncStorage.setItem('usuarioId', id);

      Alert.alert('Bienvenido', `Hola ${response.data.usuario.nombre}`);
      router.replace('/');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.mensaje || 'No se pudo iniciar sesión');
    }
  };

  return (
    <View className="flex-1 bg-gray-100 px-6 pt-10">
      <Text className="text-3xl font-bold text-center text-blue-600 mb-6">🔐 Iniciar Sesión</Text>

      <Text className="mb-1 text-gray-700 font-semibold">Correo electrónico:</Text>
      <TextInput
        className="bg-white border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-800"
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={setCorreo}
        placeholder="tucorreo@ejemplo.com"
      />

      <Text className="mb-1 text-gray-700 font-semibold">Contraseña:</Text>
      <TextInput
        className="bg-white border border-gray-300 rounded-xl px-4 py-3 mb-6 text-gray-800"
        secureTextEntry
        value={contraseña}
        onChangeText={setContraseña}
        placeholder="Ingresá tu contraseña"
      />

      <Pressable
        onPress={handleLogin}
        className="bg-blue-600 py-4 rounded-xl shadow-md active:bg-blue-700"
      >
        <Text className="text-white text-center font-bold text-base">Ingresar</Text>
      </Pressable>

      {/* Enlace a registro */}
      <View className="mt-6 flex-row justify-center">
        <Text className="text-gray-600">¿No tenés cuenta?</Text>
        <Pressable onPress={() => router.push('/Usuario/Registro')}>
          <Text className="text-blue-600 font-semibold ml-2 underline">Registrate</Text>
        </Pressable>
      </View>
    </View>
  );
}
