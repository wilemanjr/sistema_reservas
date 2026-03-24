import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../themes/ThemeContext';
import { ReservaPrototypeManager } from '../../prototype/ReservaPrototype';
import api from '../../services/api';
import toast from 'react-hot-toast';

function Historial() {
  const { usuario } = useAuth();
  const { theme } = useTheme();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarReservas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario.id]);

  const cargarReservas = async () => {
    try {
      const response = await api.get(`/reservas/usuario/${usuario.id}`);
      setReservas(response.data);
      
      // Registrar prototipos para clonación (Prototype Pattern)
      response.data.forEach(reserva => {
        ReservaPrototypeManager.registrarPrototipo(
          `reserva_${reserva.id}`,
          reserva
        );
      });
    } catch (error) {
      toast.error('Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  const clonarReserva = async (id) => {
    try {
      // Usando Prototype Pattern para clonar
      const clon = ReservaPrototypeManager.clonarReserva(`reserva_${id}`, {
        id: null,
        estado: 'PENDIENTE',
        fechaReserva: new Date().toISOString()
      });
      
      console.log('📋 [Prototype] Clonando reserva:', clon);
      
      const response = await api.post(`/reservas/clonar/${id}`);
      
      if (response.data) {
        toast.success('✅ Reserva clonada exitosamente!');
        cargarReservas();
      }
    } catch (error) {
      console.error('Error al clonar:', error);
      toast.error('Error al clonar la reserva');
    }
  };

  const getIcono = (tipo) => {
    switch(tipo) {
      case 'HOTEL': return '🏨';
      case 'VUELO': return '✈️';
      case 'RESTAURANTE': return '🍽️';
      default: return '📋';
    }
  };

  const getColorEstado = (estado) => {
    switch(estado) {
      case 'CONFIRMADA': return 'bg-green-100 text-green-700';
      case 'CANCELADA': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const cardStyle = theme.createCardStyle();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      <h1 style={{ color: theme.createTextColor() }} className="text-3xl font-bold mb-6">📋 Historial de Reservas</h1>
      
      {reservas.length === 0 ? (
        <div style={cardStyle} className="p-12 text-center rounded-2xl">
          <div className="text-6xl mb-4">🎯</div>
          <p style={{ color: theme.createTextColor() }} className="text-lg">No tienes reservas aún</p>
          <a href="/" className="inline-block mt-4 text-purple-500 hover:underline">
            Hacer una reserva →
          </a>
        </div>
      ) : (
        <div className="grid gap-4">
          {reservas.map((reserva) => (
            <div key={reserva.id} style={cardStyle} className="p-6 rounded-2xl hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getIcono(reserva.tipo)}</span>
                  <h2 style={{ color: theme.createTextColor() }} className="text-xl font-bold">
                    {reserva.tipo}
                  </h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getColorEstado(reserva.estado)}`}>
                  {reserva.estado}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Cliente</p>
                  <p className="font-semibold">{reserva.cliente}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Fecha</p>
                  <p className="font-semibold text-sm">
                    {formatFecha(reserva.fechaInicio)}
                    {reserva.fechaFin && ` - ${formatFecha(reserva.fechaFin)}`}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Precio base</p>
                  <p className="font-bold text-purple-600">
                    ${reserva.precioBase?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Detalles</p>
                  <p className="text-sm">{reserva.detallesEspecificos}</p>
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => clonarReserva(reserva.id)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2"
                >
                  📋 Clonar reserva (Prototype)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Historial;
