// app/Egresos/ListarEgresos.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { parse, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { fetchCategories } from '../../DataBase/TablaCategoria';
import { fetchExpenses, fetchExpensesByDate, softDeleteExpense } from '../../DataBase/TablaEgresos';
import CustomDatePicker from '../../components/CustomDatePicker';
import { MaterialIcons } from '@expo/vector-icons';

interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
  categoryId?: number;
  categoryName?: string;
}

export default function ListarEgresos() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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
      loadExpenses();
    }
  }, [categories]);

  const loadExpenses = async () => {
    try {
      const data = await fetchExpenses();
      const enrichedExpenses = data.map((expense: any) => {
        const category = categories.find((cat) => cat.id === expense.category_id);
        return {
          ...expense,
          categoryId: expense.category_id,
          categoryName: category ? category.name : "Sin categoría",
        };
      });
      setExpenses(enrichedExpenses);
    } catch (error) {
      console.error("Error al cargar egresos:", error);
    }
  };

  const handleFilterExpenses = async () => {
    try {
      if (filterStartDate && filterEndDate) {
        const start = format(filterStartDate, 'yyyy-MM-dd');
        const end = format(filterEndDate, 'yyyy-MM-dd');
        let data = await fetchExpensesByDate(start, end);

        if (selectedCategoryId !== null) {
          data = data.filter((expense) => expense.category_id === selectedCategoryId);
        }

        const enriched = data.map((expense: any) => {
          const category = categories.find((cat) => cat.id === expense.category_id);
          return {
            ...expense,
            categoryId: expense.category_id,
            categoryName: category ? category.name : "Sin categoría",
          };
        });

        setExpenses(enriched);
      } else {
        Alert.alert("Filtros incompletos", "Por favor selecciona fecha inicio y fecha fin");
      }
    } catch (error) {
      console.error("Error al filtrar egresos:", error);
    }
  };

  const clearFilters = async () => {
    setFilterStartDate(null);
    setFilterEndDate(null);
    setSelectedCategoryId(null);
    loadExpenses();
  };

  const handleSoftDeleteExpense = async (id: number) => {
    Alert.alert(
      "Confirmar Anulación",
      "¿Estás seguro de anular este egreso?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Anular",
          style: "destructive",
          onPress: async () => {
            await softDeleteExpense(id);
            loadExpenses();
          }
        }
      ]
    );
  };

  // Calcular total
  const totalEgresos = expenses.reduce((sum, item) => sum + item.amount, 0);

  const renderExpense = ({ item }: { item: Expense }) => {
    const parsedDate = parse(item.date, 'dd/MM/yyyy', new Date());
    const formattedDate = format(parsedDate, "dd 'de' MMM", { locale: es });

    return (
      <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-2 shadow-md">
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1">
            {/* Categoría */}
            <View className="flex-row items-center mb-2">
              <View className="bg-red-100 dark:bg-red-900 px-3 py-1 rounded-full">
                <Text className="text-red-700 dark:text-red-300 text-xs font-semibold">
                  {item.categoryName || "Sin categoría"}
                </Text>
              </View>
            </View>

            {/* Descripción */}
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {item.description}
            </Text>

            {/* Fecha */}
            <View className="flex-row items-center">
              <MaterialIcons name="schedule" size={14} color="#9CA3AF" />
              <Text className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                {formattedDate}
              </Text>
            </View>
          </View>

          {/* Monto */}
          <View className="items-end">
            <Text className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${item.amount.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Botón Anular */}
        <TouchableOpacity
          onPress={() => handleSoftDeleteExpense(item.id)}
          activeOpacity={0.7}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 py-2 rounded-xl flex-row items-center justify-center"
        >
          <MaterialIcons name="cancel" size={18} color="#EF4444" />
          <Text className="text-red-600 dark:text-red-400 font-semibold ml-2">Anular Egreso</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-red-600 dark:bg-red-800 pt-10 pb-4 px-4">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold mb-1">Egresos</Text>
            <Text className="text-red-100 text-sm">Historial de gastos</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            className="bg-white/20 p-3 rounded-full"
          >
            <MaterialIcons name="filter-list" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Total */}
        <View className="bg-white/10 rounded-xl p-3 mt-2">
          <Text className="text-red-100 text-xs mb-1">Total de Egresos</Text>
          <Text className="text-white text-xl font-bold">
            ${totalEgresos.toLocaleString()}
          </Text>
          <Text className="text-red-100 text-xs mt-1">
            {expenses.length} {expenses.length === 1 ? 'registro' : 'registros'}
          </Text>
        </View>
      </View>

      {/* Filtros */}
      {showFilters && (
        <View className="bg-white dark:bg-gray-800 p-4 shadow-lg">
          <Text className="font-bold text-gray-900 dark:text-white mb-3 text-lg">Filtros</Text>

          {/* Fechas */}
          <View className="flex-row mb-3">
            <View className="flex-1 mr-2">
              <CustomDatePicker
                selectedDate={filterStartDate || new Date()}
                onDateChange={(date) => setFilterStartDate(date)}
                label="Fecha inicio"
              />
            </View>
            <View className="flex-1 ml-2">
              <CustomDatePicker
                selectedDate={filterEndDate || new Date()}
                onDateChange={(date) => setFilterEndDate(date)}
                label="Fecha fin"
              />
            </View>
          </View>

          {/* Categorías */}
          <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Categorías</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            {categories.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  setSelectedCategoryId((prev) => (prev === item.id ? null : item.id))
                }
                className={`px-4 py-2 mr-2 rounded-full ${
                  selectedCategoryId === item.id
                    ? 'bg-red-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <Text className={`font-medium ${
                  selectedCategoryId === item.id
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Botones */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleFilterExpenses}
              activeOpacity={0.8}
              className="bg-red-600 py-3 rounded-xl flex-1 flex-row items-center justify-center"
            >
              <MaterialIcons name="search" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Aplicar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={clearFilters}
              activeOpacity={0.8}
              className="bg-gray-300 dark:bg-gray-700 py-3 rounded-xl flex-1 flex-row items-center justify-center"
            >
              <MaterialIcons name="clear" size={20} color="#6B7280" />
              <Text className="text-gray-700 dark:text-gray-300 font-bold ml-2">Limpiar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Lista */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExpense}
        contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <MaterialIcons name="receipt-long" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-4 text-lg">
              No hay egresos registrados
            </Text>
          </View>
        }
      />

      {/* Botón flotante */}
      <View className="absolute bottom-4 right-4 left-4">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.9}
          className="bg-red-600 dark:bg-red-700 py-3 rounded-xl shadow-lg flex-row items-center justify-center"
        >
          <MaterialIcons name="add-circle" size={22} color="white" />
          <Text className="text-white font-bold text-base ml-2">Nuevo Egreso</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
