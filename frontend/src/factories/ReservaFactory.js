import React from 'react';
import HotelForm from '../components/reservas/HotelForm';
import VueloForm from '../components/reservas/VueloForm';
import RestauranteForm from '../components/reservas/RestauranteForm';
import Historial from '../components/reservas/Historial';
import Dashboard from '../components/dashboard/Dashboard';

export class ReservaComponentFactory {
  static crearComponente(tipo, props = {}) {
    console.log(`🏭 [Factory Method] Creando componente: ${tipo}`);
    
    switch (tipo) {
      case 'HOTEL':
        return <HotelForm {...props} />;
      case 'VUELO':
        return <VueloForm {...props} />;
      case 'RESTAURANTE':
        return <RestauranteForm {...props} />;
      case 'HISTORIAL':
        return <Historial {...props} />;
      case 'DASHBOARD':
        return <Dashboard {...props} />;
      default:
        console.error(`Tipo no soportado: ${tipo}`);
        return <div>Error: Componente no encontrado</div>;
    }
  }
}

export class ReservaDataFactory {
  static crearDatos(tipo, usuario, formData) {
    console.log(`🏭 [Factory Method] Creando datos para: ${tipo}`);
    
    const baseData = {
      idUsuario: usuario.id,
      cliente: usuario.nombre,
    };
    
    switch (tipo) {
      case 'HOTEL':
        return {
          ...baseData,
          ...formData,
        };
      case 'VUELO':
        return {
          ...baseData,
          ...formData,
        };
      case 'RESTAURANTE':
        return {
          ...baseData,
          ...formData,
        };
      default:
        throw new Error(`Tipo de datos no soportado: ${tipo}`);
    }
  }
}