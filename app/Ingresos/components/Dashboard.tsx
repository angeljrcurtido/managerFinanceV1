// components/Ingresos/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MensualData {
  _id: string;
  totalMonto: number;
  cantidadIngresos: number;
}

interface Resumen7Dias {
  totalMonto: number;
  cantidadIngresos: number;
}

interface DiarioData {
  _id: string;
  totalMonto: number;
  cantidadIngresos: number;
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
        const responseMensual = await fetch(
          `https://kjhjhkjhkj.shop/api/ingresos/dashboard/mensual?userId=${userId}`
        );
        const dataMensual = await responseMensual.json();

        const response7Dias = await fetch(
          `https://kjhjhkjhkj.shop/api/ingresos/dashboard/ultimos7dias?userId=${userId}`
        );
        const data7Dias = await response7Dias.json();

        const responseDiario = await fetch(
          `https://kjhjhkjhkj.shop/api/ingresos/dashboard/dia?userId=${userId}`
        );
        const dataDiario = await responseDiario.json();

        setMensualData(dataMensual.data || []);
        setResumen7Dias(data7Dias.data || { totalMonto: 0, cantidadIngresos: 0 });
        setDiarioData(dataDiario.data || []);
      } catch (error) {
        console.error("Error al obtener datos del dashboard:", error);
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
      <Text className="text-center text-3xl font-bold text-[#20c062] mb-5">
        Dashboard de Ingresos
      </Text>

      {/* Sección: Ingresos por Mes */}
      <View className="mb-5">
        <Text className="text-center text-2xl font-bold text-[#20c062] mb-2">
          Ingresos por Mes
        </Text>
        {mensualData.length > 0 ? (
          mensualData.map((item) => (
            <View
              key={item._id}
              className="bg-green-100 p-4 rounded-lg mb-2"
            >
              <Text className="text-lg font-semibold">
                Mes: {item._id}
              </Text>
              <Text>Total Monto: ${item.totalMonto.toFixed(2)}</Text>
              <Text>Cantidad de Ingresos: {item.cantidadIngresos}</Text>
            </View>
          ))
        ) : (
          <Text className="text-center">No hay datos mensuales.</Text>
        )}
      </View>

      {/* Sección: Resumen de Ingresos Últimos 7 Días */}
      <View className="mb-5">
        <Text className="text-center text-2xl font-bold text-[#20c062] mb-2">
          Últimos 7 Días
        </Text>
        {resumen7Dias ? (
          <View className="bg-green-100 p-4 rounded-lg">
            <Text className="text-lg font-semibold">
              Total Monto: ${resumen7Dias.totalMonto.toFixed(2)}
            </Text>
            <Text>Cantidad de Ingresos: {resumen7Dias.cantidadIngresos}</Text>
          </View>
        ) : (
          <Text className="text-center">No hay datos de los últimos 7 días.</Text>
        )}
      </View>

      {/* Sección: Ingresos por Día (Últimos 7 Días) */}
      <View>
        <Text className="text-center text-2xl font-bold text-[#20c062] mb-2">
          Ingresos por Día (Últimos 7 Días)
        </Text>
        {diarioData.length > 0 ? (
          diarioData.map((item) => (
            <View
              key={item._id}
              className="bg-green-100 p-4 rounded-lg mb-2"
            >
              <Text className="text-lg font-semibold">
                Fecha: {item._id}
              </Text>
              <Text>Total Monto: ${item.totalMonto.toFixed(2)}</Text>
              <Text>Cantidad de Ingresos: {item.cantidadIngresos}</Text>
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
