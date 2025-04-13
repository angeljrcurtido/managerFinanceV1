// components/Egresos/Dashboard.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";

interface MensualData {
  _id: string;
  totalMonto: number;
  cantidadEgresos: number;
}

interface Resumen7Dias {
  totalMonto: number;
  cantidadEgresos: number;
}

interface DiarioData {
  _id: string; // formato "YYYY-MM-DD"
  totalMonto: number;
  cantidadEgresos: number;
}

const Dashboard = () => {
  const [mensualData, setMensualData] = useState<MensualData[]>([]);
  const [resumen7Dias, setResumen7Dias] = useState<Resumen7Dias | null>(null);
  const [diarioData, setDiarioData] = useState<DiarioData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userId = await AsyncStorage.getItem("usuarioId");
        if (!userId) {
          console.error("No se encontró usuarioId en AsyncStorage");
          return;
        }

        const [resMensual, res7Dias, resDiario] = await Promise.all([
          fetch(`https://kjhjhkjhkj.shop/api/egresos/dashboard/mensual?userId=${userId}`),
          fetch(`https://kjhjhkjhkj.shop/api/egresos/dashboard/ultimos7dias?userId=${userId}`),
          fetch(`https://kjhjhkjhkj.shop/api/egresos/dashboard/dia?userId=${userId}`)
        ]);

        const dataMensual = await resMensual.json();
        const data7Dias = await res7Dias.json();
        const dataDiario = await resDiario.json();

        setMensualData(dataMensual?.data || []);
        setResumen7Dias(data7Dias?.data || { totalMonto: 0, cantidadEgresos: 0 });
        setDiarioData(dataDiario?.data || []);
      } catch (error) {
        console.error("Error al obtener datos para el dashboard de egresos: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text className="text-center text-3xl font-bold text-[#e74c3c] mb-5">
        Dashboard de Egresos
      </Text>

      {/* Sección: Egresos por Mes */}
      <View className="mb-5">
        <Text className="text-center text-2xl font-bold text-[#8f1406] mb-2">
          Egresos por Mes
        </Text>
        {mensualData.length > 0 ? (
          mensualData.map((item) => (
            <View
              key={item._id}
              className="bg-red-100 p-4 rounded-lg mb-2"
            >
              <Text className="text-lg font-semibold">Mes: {item._id}</Text>
              <Text>Total Monto: ${item.totalMonto.toFixed(2)}</Text>
              <Text>Cantidad de Egresos: {item.cantidadEgresos}</Text>
            </View>
          ))
        ) : (
          <Text className="text-center">No hay datos mensuales.</Text>
        )}
      </View>

      {/* Sección: Resumen de Egresos de los Últimos 7 Días */}
      <View className="mb-5">
        <Text className="text-center text-2xl font-bold text-[#8f1406] mb-2">
          Últimos 7 Días
        </Text>
        {resumen7Dias ? (
          <View className="bg-red-100 p-4 rounded-lg">
            <Text className="text-lg font-semibold">
              Total Monto: ${resumen7Dias.totalMonto.toFixed(2)}
            </Text>
            <Text className="text-lg">
              Cantidad de Egresos: {resumen7Dias.cantidadEgresos}
            </Text>
          </View>
        ) : (
          <Text className="text-center">No hay datos de los últimos 7 días.</Text>
        )}
      </View>

      {/* Sección: Egresos por Día (Últimos 7 Días) */}
      <View>
        <Text className="text-center text-2xl font-bold text-[#8f1406] mb-2">
          Egresos por Día (Últimos 7 Días)
        </Text>
        {diarioData.length > 0 ? (
          diarioData.map((item) => (
            <View
              key={item._id}
              className="bg-red-100 p-4 rounded-lg mb-2"
            >
              <Text className="text-lg font-semibold">Fecha: {item._id}</Text>
              <Text>Total Monto: ${item.totalMonto.toFixed(2)}</Text>
              <Text>Cantidad de Egresos: {item.cantidadEgresos}</Text>
            </View>
          ))
        ) : (
          <Text className="text-center">No hay datos diarios para mostrar.</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Dashboard;
