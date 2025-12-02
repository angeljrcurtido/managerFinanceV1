import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';

interface CustomDatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  label?: string;
}

export default function CustomDatePicker({ selectedDate, onDateChange, label = 'Fecha' }: CustomDatePickerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleSelectDate = (date: Date) => {
    onDateChange(date);
    setIsVisible(false);
  };

  const handleToday = () => {
    const today = new Date();
    onDateChange(today);
    setCurrentMonth(today);
    setIsVisible(false);
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    // Agregar días vacíos al inicio para alinear correctamente
    const startDayOfWeek = start.getDay();
    const emptyDays = Array(startDayOfWeek).fill(null);

    return [...emptyDays, ...days];
  };

  const renderDay = (day: Date | null, index: number) => {
    if (!day) {
      return <View key={`empty-${index}`} className="w-[14.28%] p-2" />;
    }

    const isSelected = isSameDay(day, selectedDate);
    const isToday = isSameDay(day, new Date());
    const isCurrentMonth = isSameMonth(day, currentMonth);

    return (
      <TouchableOpacity
        key={day.toISOString()}
        onPress={() => handleSelectDate(day)}
        className={`w-[14.28%] p-2 items-center justify-center ${
          isSelected ? 'bg-blue-600 rounded-full' : ''
        } ${isToday && !isSelected ? 'border border-blue-600 rounded-full' : ''}`}
      >
        <Text
          className={`text-base ${
            isSelected ? 'text-white font-bold' : isCurrentMonth ? 'text-gray-800' : 'text-gray-300'
          }`}
        >
          {format(day, 'd')}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        activeOpacity={0.8}
        className="border border-gray-300 rounded-md p-3 mb-4 flex-row justify-between items-center bg-white"
      >
        <Text className="text-gray-900">
          {label}: {format(selectedDate, 'dd/MM/yyyy', { locale: es })}
        </Text>
        <MaterialIcons name="calendar-today" size={20} color="#6B7280" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      >
        <Pressable
          className="flex-1 justify-center items-center bg-black/50"
          onPress={() => setIsVisible(false)}
        >
          <Pressable
            className="bg-white w-[90%] max-w-md rounded-2xl shadow-lg overflow-hidden"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header con navegación de mes */}
            <View className="bg-blue-600 p-4">
              <View className="flex-row justify-between items-center">
                <TouchableOpacity onPress={handlePreviousMonth} className="p-2">
                  <MaterialIcons name="chevron-left" size={28} color="white" />
                </TouchableOpacity>

                <Text className="text-white text-lg font-semibold">
                  {format(currentMonth, 'MMMM yyyy', { locale: es }).toUpperCase()}
                </Text>

                <TouchableOpacity onPress={handleNextMonth} className="p-2">
                  <MaterialIcons name="chevron-right" size={28} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Días de la semana */}
            <View className="flex-row bg-gray-50 border-b border-gray-200">
              {daysOfWeek.map((day) => (
                <View key={day} className="w-[14.28%] p-2">
                  <Text className="text-center text-gray-600 font-semibold text-xs">
                    {day}
                  </Text>
                </View>
              ))}
            </View>

            {/* Calendario */}
            <View className="p-2">
              <View className="flex-row flex-wrap">
                {getDaysInMonth().map((day, index) => renderDay(day, index))}
              </View>
            </View>

            {/* Botones de acción */}
            <View className="flex-row border-t border-gray-200 p-3">
              <TouchableOpacity
                onPress={handleToday}
                className="flex-1 bg-gray-100 py-3 rounded-md mr-2"
              >
                <Text className="text-center text-gray-800 font-semibold">Hoy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsVisible(false)}
                className="flex-1 bg-blue-600 py-3 rounded-md ml-2"
              >
                <Text className="text-center text-white font-semibold">Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
