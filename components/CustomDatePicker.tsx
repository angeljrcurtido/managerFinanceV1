import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CustomDatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  label?: string;
}

export default function CustomDatePicker({ selectedDate, onDateChange, label }: CustomDatePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempYear, setTempYear] = useState(selectedDate.getFullYear());
  const [tempMonth, setTempMonth] = useState(selectedDate.getMonth());
  const [tempDay, setTempDay] = useState(selectedDate.getDate());

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const days = Array.from({ length: getDaysInMonth(tempYear, tempMonth) }, (_, i) => i + 1);

  const handleConfirm = () => {
    const newDate = new Date(tempYear, tempMonth, tempDay);
    onDateChange(newDate);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setTempYear(selectedDate.getFullYear());
    setTempMonth(selectedDate.getMonth());
    setTempDay(selectedDate.getDate());
    setModalVisible(false);
  };

  return (
    <View className="mb-4">
      {label && <Text className="text-gray-800 dark:text-gray-200 mb-2 font-medium">{label}</Text>}

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
        className="border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-800"
      >
        <Text className="text-gray-900 dark:text-white">
          {format(selectedDate, 'dd/MM/yyyy', { locale: es })}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white dark:bg-gray-800 w-80 p-6 rounded-2xl shadow-lg">
            <Text className="text-xl font-semibold mb-4 text-gray-800 dark:text-white text-center">
              Seleccionar Fecha
            </Text>

            {/* Selector de Año */}
            <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">Año:</Text>
            <FlatList
              data={years}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setTempYear(item)}
                  className={`px-4 py-2 mx-1 rounded-md ${
                    tempYear === item ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <Text className={`font-medium ${tempYear === item ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 10 }}
            />

            {/* Selector de Mes */}
            <Text className="text-gray-700 dark:text-gray-300 mb-2 mt-4 font-medium">Mes:</Text>
            <FlatList
              data={months}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => setTempMonth(index)}
                  className={`px-3 py-2 mx-1 rounded-md ${
                    tempMonth === index ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <Text className={`font-medium text-sm ${tempMonth === index ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                    {item.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 10 }}
            />

            {/* Selector de Día */}
            <Text className="text-gray-700 dark:text-gray-300 mb-2 mt-4 font-medium">Día:</Text>
            <FlatList
              data={days}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setTempDay(item)}
                  className={`px-3 py-2 mx-1 rounded-md ${
                    tempDay === item ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <Text className={`font-medium ${tempDay === item ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 10 }}
            />

            {/* Botones */}
            <View className="flex-row justify-between mt-6">
              <TouchableOpacity
                onPress={handleCancel}
                className="bg-gray-400 dark:bg-gray-600 px-6 py-2 rounded-md flex-1 mr-2"
              >
                <Text className="text-white font-medium text-center">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                className="bg-blue-600 px-6 py-2 rounded-md flex-1 ml-2"
              >
                <Text className="text-white font-medium text-center">Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
