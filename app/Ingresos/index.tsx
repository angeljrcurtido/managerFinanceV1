// app/Ingresos/index.tsx
import React from 'react';
import { View } from 'react-native';
import ListadoIngreso from './components/ListadoIngreso'; 

export default function IngresosIndex() {
  return (
    <View style={{ flex: 1 }}>
      <ListadoIngreso />
    </View>
  );
}
