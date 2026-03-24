import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../themes/ThemeContext';
import { ReservaBuilder } from '../../builders/ReservaBuilder';
import { ReservaDataFactory } from '../../factories/ReservaFactory';
import api from '../../services/api';
import toast from 'react-hot-toast';

function RestauranteForm() {
  const { usuario } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cliente: usuario?.nombre || '',
    nombreRestaurante: '',
    fechaInicio: '',
    numeroPersonas: 2,
    tipoMesa: 'INTERIOR',
    ocasEspecial: 'NINGUNA',
    requiereMenuInfantil: false,
    restriccionesAlimenticias: '',
    precioBase: 50
  });

  const [precioTotal, setPrecioTotal] = useState(0);

  const calcularPrecio = () => {
    let multiplicador = 1;
    if (formData.tipoMesa === 'TERRAZA') multiplicador = 1.3;
    if (formData.tipoMesa === 'VIP') multiplicador = 2;
    
    let total = formData.precioBase * multiplicador * formData.numeroPersonas;
    if (formData.ocasEspecial !== 'NINGUNA') total += 50;
    if (formData.numeroPersonas > 8) total *= 0.9;
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

  const seleccionarOcasion = (ocasion) => {
    setFormData(prev => ({ ...prev, ocasEspecial: ocasion }));
    setTimeout(() => setPrecioTotal(calcularPrecio()), 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Usando Builder Pattern
      const builder = new ReservaBuilder();
      const reservaData = builder
        .reset()
        .setTipo('RESTAURANTE')
        .setCliente(formData.cliente)
        .setFechas(formData.fechaInicio, null)
        .setPrecioBase(formData.precioBase)
        .setRestauranteData(
          formData.nombreRestaurante,
          formData.numeroPersonas,
          formData.tipoMesa,
          formData.ocasEspecial,
          formData.requiereMenuInfantil,
          formData.restriccionesAlimenticias
        )
        .build();
      
      // Usando Factory Method para crear datos
      const dataToSend = ReservaDataFactory.crearDatos('RESTAURANTE', usuario, reservaData);
      
      console.log('🔨 [Builder] Datos construidos:', dataToSend);
      
      const response = await api.post('/reservas/restaurante', dataToSend);
      
      if (response.data) {
        toast.success('✅ Reserva de restaurante creada exitosamente!');
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

  const restaurantes = [
    { nombre: 'La Buena Mesa', precio: 50 },
    { nombre: 'Sabor Peruano', precio: 45 },
    { nombre: 'Trattoria Italia', precio: 55 },
    { nombre: 'Sushi Master', precio: 65 },
    { nombre: 'El Asador', precio: 60 },
    { nombre: 'Gourmet Experience', precio: 90 }
  ];

  const handleRestauranteChange = (e) => {
    const restaurante = restaurantes.find(r => r.nombre === e.target.value);
    setFormData(prev => ({
      ...prev,
      nombreRestaurante: e.target.value,
      precioBase: restaurante ? restaurante.precio : 50
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
      <h1 style={{ color: theme.createTextColor() }} className="text-3xl font-bold mb-6">🍽️ Reserva de Restaurante</h1>
      
      <form onSubmit={handleSubmit} style={cardStyle} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Nombre del cliente</label>
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
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Restaurante</label>
            <select
              name="nombreRestaurante"
              value={formData.nombreRestaurante}
              onChange={handleRestauranteChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Selecciona un restaurante...</option>
              {restaurantes.map(r => (
                <option key={r.nombre} value={r.nombre}>
                  {r.nombre} - ${r.precio}/persona
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Fecha y hora</label>
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
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Número de personas</label>
            <input
              type="number"
              name="numeroPersonas"
              value={formData.numeroPersonas}
              onChange={handleChange}
              min="1"
              max="20"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Tipo de mesa</label>
            <select
              name="tipoMesa"
              value={formData.tipoMesa}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="INTERIOR">Interior</option>
              <option value="TERRAZA">Terraza (+30%)</option>
              <option value="VIP">VIP (+100%)</option>
            </select>
          </div>
          
          <div className="col-span-2">
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Ocasión especial</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'NINGUNA', emoji: '😊', label: 'Ninguna' },
                { value: 'CUMPLEAÑOS', emoji: '🎂', label: 'Cumpleaños' },
                { value: 'ANIVERSARIO', emoji: '💑', label: 'Aniversario' },
                { value: 'NEGOCIOS', emoji: '💼', label: 'Negocios' }
              ].map(ocasion => (
                <button
                  key={ocasion.value}
                  type="button"
                  onClick={() => seleccionarOcasion(ocasion.value)}
                  className={`p-2 rounded-lg text-center transition ${
                    formData.ocasEspecial === ocasion.value 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-xl">{ocasion.emoji}</div>
                  <div className="text-sm">{ocasion.label}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="requiereMenuInfantil"
                checked={formData.requiereMenuInfantil}
                onChange={handleChange}
                className="w-4 h-4"
              />
              👶 Requiere menú infantil (menores de 12 años)
            </label>
          </div>
          
          <div className="col-span-2">
            <label style={{ color: theme.createTextColor() }} className="block font-semibold mb-2">Restricciones alimenticias / Alergias</label>
            <textarea
              name="restriccionesAlimenticias"
              value={formData.restriccionesAlimenticias}
              onChange={handleChange}
              rows="3"
              placeholder="Ej: Alérgico a frutos secos, sin gluten, vegetariano, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
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
          {loading ? 'Procesando...' : '🔍 Verificar Disponibilidad y Reservar Mesa'}
        </button>
      </form>
    </div>
  );
}

export default RestauranteForm;
