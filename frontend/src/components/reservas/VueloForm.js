import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../themes/ThemeContext';
import { ReservaBuilder } from '../../builders/ReservaBuilder';
import { ReservaDataFactory } from '../../factories/ReservaFactory';
import api from '../../services/api';
import toast from 'react-hot-toast';

function VueloForm() {
  const { usuario } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cliente: usuario?.nombre || '',
    aerolinea: '',
    numeroVuelo: '',
    origen: '',
    destino: '',
    fechaInicio: '',
    fechaFin: '',
    clase: 'ECONOMICA',
    numPasajeros: 1,
    idaVuelta: false,
    precioBase: 300
  });

  const [precioTotal, setPrecioTotal] = useState(0);

  const calcularPrecio = () => {
    let multiplicador = 1;
    if (formData.clase === 'EJECUTIVA') multiplicador = 2;
    if (formData.clase === 'PRIMERA') multiplicador = 3.5;
    
    let total = formData.precioBase * multiplicador * formData.numPasajeros;
    if (formData.idaVuelta) total *= 1.8;
    return total;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setTimeout(() => {
      setPrecioTotal(calcularPrecio());
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Usando Builder Pattern
      const builder = new ReservaBuilder();
      let builderInstance = builder
        .reset()
        .setTipo('VUELO')
        .setCliente(formData.cliente)
        .setFechas(formData.fechaInicio, formData.idaVuelta ? formData.fechaFin : null)
        .setPrecioBase(formData.precioBase)
        .setVueloData(
          formData.aerolinea,
          formData.numeroVuelo,
          formData.origen,
          formData.destino,
          formData.clase,
          formData.numPasajeros,
          formData.idaVuelta
        );
      
      const reservaData = builderInstance.build();
      
      // Usando Factory Method
      const dataToSend = ReservaDataFactory.crearDatos('VUELO', usuario, reservaData);
      
      console.log('🔨 [Builder] Datos construidos:', dataToSend);
      
      const response = await api.post('/reservas/vuelo', dataToSend);
      
      if (response.data) {
        toast.success('✅ Reserva de vuelo creada exitosamente!');
        setTimeout(() => {
          navigate('/historial');
        }, 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  const aerolineas = [
    { nombre: 'Aerolíneas Argentinas', precio: 300 },
    { nombre: 'Latam Airlines', precio: 350 },
    { nombre: 'American Airlines', precio: 400 },
    { nombre: 'United Airlines', precio: 420 },
    { nombre: 'Delta Air Lines', precio: 380 }
  ];

  const ciudades = [
    'Buenos Aires (EZE)',
    'Santiago (SCL)',
    'Lima (LIM)',
    'Bogotá (BOG)',
    'Madrid (MAD)',
    'Miami (MIA)',
    'Nueva York (JFK)'
  ];

  const handleAerolineaChange = (e) => {
    const aerolinea = aerolineas.find(a => a.nombre === e.target.value);
    setFormData(prev => ({
      ...prev,
      aerolinea: e.target.value,
      precioBase: aerolinea ? aerolinea.precio : 300
    }));
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const cardStyle = theme.createCardStyle();
  const buttonStyle = theme.createButtonStyle();

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <h1 style={{ color: theme.createTextColor() }} className="text-3xl font-bold mb-6">✈️ Reserva de Vuelo</h1>
      
      <form onSubmit={handleSubmit} style={cardStyle} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Nombre del pasajero</label>
            <input
              type="text"
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Aerolínea</label>
            <select
              name="aerolinea"
              value={formData.aerolinea}
              onChange={handleAerolineaChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Selecciona una aerolínea...</option>
              {aerolineas.map(a => (
                <option key={a.nombre} value={a.nombre}>
                  {a.nombre} - ${a.precio}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Número de vuelo</label>
            <input
              type="text"
              name="numeroVuelo"
              value={formData.numeroVuelo}
              onChange={handleChange}
              placeholder="Ej: AR1234"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Origen</label>
            <select
              name="origen"
              value={formData.origen}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Selecciona origen...</option>
              {ciudades.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <div>
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Destino</label>
            <select
              name="destino"
              value={formData.destino}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Selecciona destino...</option>
              {ciudades.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <div>
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Fecha y hora de salida</label>
            <input
              type="datetime-local"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleChange}
              min={getMinDateTime()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Clase</label>
            <select
              name="clase"
              value={formData.clase}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ECONOMICA">Económica</option>
              <option value="EJECUTIVA">Ejecutiva (+100%)</option>
              <option value="PRIMERA">Primera Clase (+250%)</option>
            </select>
          </div>
          
          <div>
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Número de pasajeros</label>
            <input
              type="number"
              name="numPasajeros"
              value={formData.numPasajeros}
              onChange={handleChange}
              min="1"
              max="9"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="idaVuelta"
                checked={formData.idaVuelta}
                onChange={handleChange}
                className="w-4 h-4"
              />
              ✈️ Es ida y vuelta (10% de descuento)
            </label>
          </div>
          
          {formData.idaVuelta && (
            <div className="col-span-2">
              <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Fecha y hora de regreso</label>
              <input
                type="datetime-local"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
                min={formData.fechaInicio || getMinDateTime()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required={formData.idaVuelta}
              />
            </div>
          )}
        </div>
        
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
          <h3 className="text-lg font-bold text-purple-700 mb-2">💰 Precio total estimado</h3>
          <p className="text-4xl font-bold text-purple-700">
            ${precioTotal.toLocaleString()}
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
          className="mt-8 w-full font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? 'Procesando...' : '🔍 Verificar Disponibilidad y Reservar Vuelo'}
        </button>
      </form>
    </div>
  );
}

export default VueloForm;

