// app/_layout.tsx
import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import { initIngresosTable } from '../DataBase/TablaIngresos';
import { initCategoriasTable } from '../DataBase/TablaCategoria';
import { initEgresosTable } from '../DataBase/TablaEgresos';
import mobileAds from "react-native-google-mobile-ads";
import "../global.css"

export default function Layout() {
  
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log("MobileAds inicializado correctamente:", adapterStatuses);
      })
      .catch(error => {
        console.error("Error al inicializar MobileAds", error);
      });
  }, []);

  async function initDatabase() {
    await initEgresosTable();
    await initCategoriasTable();
    await initIngresosTable();
  }

  useEffect(() => {
    (async () => {
      await initDatabase();
    })();
  }, []);

  return <Slot />;
}
