import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  View,
  Pressable,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Dashboard from "./Ingresos/components/Dashboard";
import DashboardEgresos from "./Egresos/components/Dashboard";

export default function Index() {
  const router = useRouter();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      const userId = await AsyncStorage.getItem("usuarioId");

      if (!userId) {
        // Si no hay sesión iniciada, redirigimos al login
        router.replace("/Usuario/Login");
      } else {
        setCargando(false);
      }
    };

    verificarSesion();
  }, []);

  if (cargando) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3498db" />
        <Text className="mt-4 text-gray-500">Cargando...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/fondobg.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 10,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require("../assets/logotipo.jpg")}
          style={{ width: 128, height: 128, marginBottom: 16 }}
          className="rounded-full"
          resizeMode="contain"
        />

        <Text
          style={{
            fontSize: 32,
            color: "white",
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Bienvenido a tu Dashboard Financiero
        </Text>

        <Pressable
          onPress={async () => {
            await AsyncStorage.removeItem("usuarioId");
            router.replace("/Usuario/Login");
          }}
          style={{
            backgroundColor: "#34495e",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            🚪 Cerrar sesión
          </Text>
        </Pressable>
      
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
            marginBottom: 16,
          }}
        >
          <Pressable
            style={{
              backgroundColor: "#2ecc71",
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
              marginRight: 8,
            }}
            onPress={() => router.push("/Ingresos")}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Ingresos</Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: "#e74c3c",
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
              marginLeft: 8,
            }}
            onPress={() => router.push("/Egresos")}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Egresos</Text>
          </Pressable>
        </View>

        <View style={{ width: "100%", marginBottom: 24 }}>
          <Text className="text-[#2ecc71] text-3xl font-bold text-center">
            Resumen Ingresos
          </Text>
          <Dashboard />
        </View>

        <View style={{ width: "100%" }}>
          <Text className="text-[#e74c3c] text-3xl font-bold text-center">
            Resumen Egresos
          </Text>
          <DashboardEgresos />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
