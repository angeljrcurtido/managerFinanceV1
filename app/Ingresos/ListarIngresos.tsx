// app/Ingresos/ListarIngresos.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { parse, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { fetchCategories } from '../../DataBase/TablaCategoria';
import { fetchIncomes, fetchIncomesByDate, softDeleteIncome } from '../../DataBase/TablaIngresos';

interface Income {
  id: number;
  amount: number;
  description: string;
  date: string;
  categoryId?: number;
  categoryName?: string;
}

export default function ListarIngresos() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const [incomes, setIncomes] = useState<Income[]>([]);

  // Para filtros con DateTimePicker, usamos Date o null
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const cats = await fetchCategories();
      setCategories(cats);
    };
    load();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      loadIncomes(); // solo cuando ya hay categorías
    }
  }, [categories]);

  const loadIncomes = async () => {
    try {
      const data = await fetchIncomes();

      // Enlazamos cada ingreso con su nombre de categoría
      const enrichedIncomes = data.map((income: any) => {
        const category = categories.find((cat) => cat.id === income.category_id);
        return {
          ...income,
          categoryId: income.category_id,
          categoryName: category ? category.name : "Sin categoría",
        };
      });

      setIncomes(enrichedIncomes);
    } catch (error) {
      console.error("Error al cargar ingresos:", error);
    }
  };

  const handleFilterIncomes = async () => {
    try {
      if (filterStartDate && filterEndDate) {
        const start = format(filterStartDate, 'yyyy-MM-dd');
        const end = format(filterEndDate, 'yyyy-MM-dd');
        let data = await fetchIncomesByDate(start, end);

        if (selectedCategoryId !== null) {
          data = data.filter((income) => income.category_id === selectedCategoryId);
        }

        const enriched = data.map((income: any) => {
          const category = categories.find((cat) => cat.id === income.category_id);
          return {
            ...income,
            categoryId: income.category_id,
            categoryName: category ? category.name : "Sin categoría",
          };
        });

        setIncomes(enriched);
      } else {
        Alert.alert("Filtros incompletos", "Por favor selecciona fecha inicio y fecha fin");
      }
    } catch (error) {
      console.error("Error al filtrar ingresos:", error);
    }
  };

  const clearFilters = async () => {
    setFilterStartDate(null);
    setFilterEndDate(null);
    loadIncomes();
  };

  const handleSoftDeleteIncome = async (id: number) => {
    Alert.alert(
      "Confirmar Anulación",
      "¿Estás seguro de anular este ingreso?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Anular",
          style: "destructive",
          onPress: async () => {
            await softDeleteIncome(id);
            loadIncomes();
          }
        }
      ]
    );
  };

  const renderIncome = ({ item }: { item: Income }) => {
    // Se asume que item.date viene en formato 'dd/MM/yyyy'
    const parsedDate = parse(item.date, 'dd/MM/yyyy', new Date());
    const formattedDate = format(parsedDate, 'dd/MM/yyyy', { locale: es });

    return (
      <View className="bg-white rounded-lg shadow p-4 mb-3">
        <Text className="text-xs italic text-gray-500">{item.categoryName || "Sin categoría"}</Text>
        <Text className="text-lg font-medium text-gray-800">{item.description}</Text>
        <Text className="text-gray-600">${item.amount}</Text>
        <Text className="text-gray-500 text-xs mt-1">
          {formattedDate}
        </Text>
        <TouchableOpacity
          onPress={() => handleSoftDeleteIncome(item.id)}
          activeOpacity={0.8}
          className="mt-2 bg-red-600 py-2 rounded-md"
        >
          <Text className="text-center text-white font-semibold">Anular</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-100 p-6">
      <BannerAd
        unitId={__DEV__ ? TestIds.BANNER : 'ca-app-pub-2555525398874365/1363242036'}
        size={BannerAdSize.BANNER}
        onAdFailedToLoad={(error) => console.error('Error al cargar el banner:', error)}
      />
      <Text className="text-2xl font-bold text-gray-800 mb-6">Listado de Ingresos</Text>

      {/* Sección de Filtros con DatePicker */}
      <View className="mb-4">
        <Text className="mb-2 text-gray-700 font-semibold">Filtrar por fechas</Text>

        <View className="flex-row mb-2">
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            activeOpacity={0.8}
            className="flex-1 border border-gray-300 rounded-md p-3 mr-2 bg-white"
          >
            <Text className="text-gray-800">
              {filterStartDate ? format(filterStartDate, 'dd/MM/yyyy', { locale: es }) : 'Fecha inicio'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            activeOpacity={0.8}
            className="flex-1 border border-gray-300 rounded-md p-3 ml-2 bg-white"
          >
            <Text className="text-gray-800">
              {filterEndDate ? format(filterEndDate, 'dd/MM/yyyy', { locale: es }) : 'Fecha fin'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* DateTimePicker para fecha inicio */}
        {showStartPicker && (
          <DateTimePicker
            testID="startDateTimePicker"
            value={filterStartDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartPicker(Platform.OS === 'ios');
              if (selectedDate) setFilterStartDate(selectedDate);
            }}
          />
        )}
        {/* DateTimePicker para fecha fin */}
        {showEndPicker && (
          <DateTimePicker
            testID="endDateTimePicker"
            value={filterEndDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndPicker(Platform.OS === 'ios');
              if (selectedDate) setFilterEndDate(selectedDate);
            }}
          />
        )}
        <Text className="mb-2 text-gray-700 font-semibold">Filtrar por categoría</Text>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                setSelectedCategoryId((prev) => (prev === item.id ? null : item.id))
              }
              className={`px-4 py-2 mr-2 rounded-full ${selectedCategoryId === item.id
                  ? 'bg-blue-600'
                  : 'bg-gray-300'
                }`}
            >
              <Text className="text-white font-medium">{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            onPress={handleFilterIncomes}
            activeOpacity={0.8}
            className="bg-blue-600 py-2 rounded-md flex-1 mr-2"
          >
            <Text className="text-center text-white font-semibold">Filtrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={clearFilters}
            activeOpacity={0.8}
            className="bg-gray-500 py-2 rounded-md flex-1 ml-2"
          >
            <Text className="text-center text-white font-semibold">Limpiar Filtro</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={incomes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderIncome}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Botón para volver a la vista de registro */}
      <TouchableOpacity
        onPress={() => router.back()}
        activeOpacity={0.8}
        className="mt-6 bg-blue-600 py-3 rounded-md"
      >
        <Text className="text-center text-white font-semibold">Volver a registrar ingreso</Text>
      </TouchableOpacity>
    </View>
  );
}
