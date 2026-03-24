import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../themes/ThemeContext';
import { ReservaBuilder } from '../../builders/ReservaBuilder';
import { ReservaDataFactory } from '../../factories/ReservaFactory';
import api from '../../services/api';
import toast from 'react-hot-toast';

function HotelForm() {
  const { usuario } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cliente: usuario?.nombre || '',
    nombreHotel: '',
    fechaInicio: '',
    fechaFin: '',
    tipoHabitacion: 'SIMPLE',
    numeroHuespedes: 1,
    incluyeDesayuno: false,
    incluyeEstacionamiento: false,
    precioBase: 150
  });

  const [precioTotal, setPrecioTotal] = useState(0);

  const calcularPrecio = () => {
    if (!formData.fechaInicio || !formData.fechaFin) return 0;
    
    const inicio = new Date(formData.fechaInicio);
    const fin = new Date(formData.fechaFin);
    const noches = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
    
    let multiplicador = 1;
    if (formData.tipoHabitacion === 'DOBLE') multiplicador = 1.5;
    if (formData.tipoHabitacion === 'SUITE') multiplicador = 2.5;
    
    let precioNoche = formData.precioBase * multiplicador;
    if (formData.incluyeDesayuno) precioNoche += 15;
    if (formData.incluyeEstacionamiento) precioNoche += 10;
    
    return precioNoche * noches;
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
      const reservaData = builder
        .reset()
        .setTipo('HOTEL')
        .setCliente(formData.cliente)
        .setFechas(formData.fechaInicio, formData.fechaFin)
        .setPrecioBase(formData.precioBase)
        .setHotelData(
          formData.nombreHotel,
          formData.tipoHabitacion,
          formData.numeroHuespedes,
          formData.incluyeDesayuno,
          formData.incluyeEstacionamiento
        )
        .build();
      
      // Usando Factory Method para crear datos
      const dataToSend = ReservaDataFactory.crearDatos('HOTEL', usuario, reservaData);
      
      console.log('🔨 [Builder] Datos construidos:', dataToSend);
      
      const response = await api.post('/reservas/hotel', dataToSend);
      
      if (response.data) {
        toast.success('✅ Reserva de hotel creada exitosamente!');
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

  const hoteles = [
    { nombre: 'Gran Hotel Central', precio: 150 },
    { nombre: 'Beach Resort Paradise', precio: 250 },
    { nombre: 'Mountain Lodge', precio: 180 },
    { nombre: 'City Business Hotel', precio: 120 },
    { nombre: 'Luxury Palace', precio: 400 }
  ];

  const handleHotelChange = (e) => {
    const hotel = hoteles.find(h => h.nombre === e.target.value);
    setFormData(prev => ({
      ...prev,
      nombreHotel: e.target.value,
      precioBase: hotel ? hotel.precio : 150
    }));
  };

  const cardStyle = theme.createCardStyle();
  const buttonStyle = theme.createButtonStyle();

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <h1 style={{ color: theme.createTextColor() }} className="text-3xl font-bold mb-6">🏨 Reserva de Hotel</h1>
      
      <form onSubmit={handleSubmit} style={cardStyle} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Nombre del huésped</label>
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
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Hotel</label>
            <select
              name="nombreHotel"
              value={formData.nombreHotel}
              onChange={handleHotelChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Selecciona un hotel...</option>
              {hoteles.map(hotel => (
                <option key={hotel.nombre} value={hotel.nombre}>
                  {hotel.nombre} - ${hotel.precio}/noche
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Check-in</label>
            <input
              type="date"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Check-out</label>
            <input
              type="date"
              name="fechaFin"
              value={formData.fechaFin}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Tipo de habitación</label>
            <select
              name="tipoHabitacion"
              value={formData.tipoHabitacion}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="SIMPLE">Simple</option>
              <option value="DOBLE">Doble (+50%)</option>
              <option value="SUITE">Suite (+150%)</option>
            </select>
          </div>
          
          <div>
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Número de huéspedes</label>
            <input
              type="number"
              name="numeroHuespedes"
              value={formData.numeroHuespedes}
              onChange={handleChange}
              min="1"
              max="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="col-span-2">
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="incluyeDesayuno"
                  checked={formData.incluyeDesayuno}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                Incluir desayuno (+$15/noche)
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="incluyeEstacionamiento"
                  checked={formData.incluyeEstacionamiento}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                Incluir estacionamiento (+$10/noche)
              </label>
            </div>
          </div>
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
          {loading ? 'Procesando...' : '🔍 Verificar Disponibilidad y Reservar'}
        </button>
      </form>
    </div>
  );
}

export default HotelForm;
