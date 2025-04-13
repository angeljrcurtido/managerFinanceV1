import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function RegistroUsuario() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const router = useRouter();

  const handleRegistro = async () => {
    if (!nombre || !correo || !contraseña) {
      Alert.alert('Campos requeridos', 'Por favor completá todos los campos.');
      return;
    }

    try {
      // Llamada al backend para registrar usuario
      await axios.post('https://kjhjhkjhkj.shop/api/usuarios/registro', {
        nombre,
        correo: correo,
        contraseña: contraseña,
      });

      // Guardar flag en AsyncStorage
      await AsyncStorage.setItem('usuarioRegistrado', 'true');

      Alert.alert('Registro exitoso', 'Ya podés utilizar la aplicación.');

      // Limpiar formulario
      setNombre('');
      setCorreo('');
      setContraseña('');

      // Redirigir al dashboard
      router.replace('/');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.mensaje || 'No se pudo registrar');
    }
  };

  return (
    <View className="flex-1 bg-gray-100 px-6 pt-10">
      <Text className="text-3xl font-bold text-center text-blue-600 mb-6">📝 Registro</Text>

      <Text className="mb-1 text-gray-700 font-semibold">Nombre completo:</Text>
      <TextInput
        className="bg-white border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-800"
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ingresá tu nombre"
      />

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
        placeholder="Ingresá una contraseña"
      />

      <Pressable
        onPress={handleRegistro}
        className="bg-blue-600 py-4 rounded-xl shadow-md active:bg-blue-700"
      >
        <Text className="text-white text-center font-bold text-base">Registrarme</Text>
      </Pressable>
    </View>
  );
}
