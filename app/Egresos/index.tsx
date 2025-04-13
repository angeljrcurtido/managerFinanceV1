// app/Egresos/index.tsx
import React from 'react';
import { View } from 'react-native';
import ListadoEgreso from './components/ListadoEgreso'; 

export default function EgresosIndex() {
  return (
    <View style={{ flex: 1 }}>
      <ListadoEgreso />
    </View>
  );
}
