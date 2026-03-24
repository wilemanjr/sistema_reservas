import api from './api';

export const reservaService = {
  crearHotel: async (data) => {
    const response = await api.post('/reservas/hotel', data);
    return response.data;
  },
  
  crearVuelo: async (data) => {
    const response = await api.post('/reservas/vuelo', data);
    return response.data;
  },
  
  crearRestaurante: async (data) => {
    const response = await api.post('/reservas/restaurante', data);
    return response.data;
  },
  
  getByUsuario: async (idUsuario) => {
    const response = await api.get(`/reservas/usuario/${idUsuario}`);
    return response.data;
  },
  
  clonar: async (id) => {
    const response = await api.post(`/reservas/clonar/${id}`);
    return response.data;
  }
};