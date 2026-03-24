import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../themes/ThemeContext';
import { Hotel, Plane, Utensils, Sparkles, TrendingUp, Shield, Clock, Star } from 'lucide-react';

function Dashboard() {
  const { usuario } = useAuth();
  const { theme } = useTheme();
  const textColor = theme.createTextColor();
  const cardStyle = theme.createCardStyle();

  const servicios = [
    {
      id: 'HOTEL',
      icon: Hotel,
      iconBg: 'from-rose-500 to-pink-500',
      title: 'Reserva de Hotel',
      description: 'Encuentra los mejores alojamientos con experiencias únicas',
      path: '/reservas/hotel',
      features: ['🏨 Habitaciones Premium', '🍳 Desayuno Incluido', '🚗 Estacionamiento Gratis', '✨ Servicio 24/7'],
      stats: '+150 hoteles disponibles',
      badge: 'Popular'
    },
    {
      id: 'VUELO',
      icon: Plane,
      iconBg: 'from-cyan-500 to-blue-500',
      title: 'Reserva de Vuelos',
      description: 'Destinos internacionales con las mejores aerolíneas',
      path: '/reservas/vuelo',
      features: ['✈️ Más de 50 destinos', '💺 Asientos Seleccionables', '🎫 Equipaje Incluido', '🔄 Cambios Flexibles'],
      stats: '+200 vuelos diarios',
      badge: 'Ofertas'
    },
    {
      id: 'RESTAURANTE',
      icon: Utensils,
      iconBg: 'from-amber-500 to-orange-500',
      title: 'Reserva de Restaurante',
      description: 'Los mejores restaurantes con la mejor gastronomía',
      path: '/reservas/restaurante',
      features: ['🍽️ Chef Estrella Michelin', '🍷 Carta de Vinos', '🎂 Eventos Especiales', '🌱 Opciones Veganas'],
      stats: '+80 restaurantes',
      badge: 'Nuevo'
    }
  ];

  const stats = [
    { icon: TrendingUp, label: 'Reservas Realizadas', value: '1,234+', color: 'text-emerald-500' },
    { icon: Star, label: 'Clientes Satisfechos', value: '98%', color: 'text-amber-500' },
    { icon: Clock, label: 'Soporte 24/7', value: 'Inmediato', color: 'text-blue-500' },
    { icon: Shield, label: 'Seguridad Garantizada', value: '100%', color: 'text-purple-500' },
  ];

  // Función para obtener delay de animación
  const getAnimationDelay = (index) => ({
    animationDelay: `${index * 100}ms`
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative mb-16 pt-8 lg:pt-12">
        <div className="relative text-center animate-slideUp">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full mb-6">
            <Sparkles size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-blue-600">Bienvenido de vuelta</span>
          </div>
          <h1 style={{ color: textColor }} className="text-4xl lg:text-6xl font-display font-bold mb-4">
            Hola, <span className="gradient-text">{usuario?.nombre}</span>!
          </h1>
          <p style={{ color: textColor }} className="text-xl max-w-2xl mx-auto opacity-80">
            ¿Qué aventura te espera hoy? Explora nuestros servicios y crea momentos inolvidables
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            style={cardStyle}
            className="p-6 text-center rounded-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <stat.icon size={32} className={`mx-auto mb-3 ${stat.color}`} />
            <div style={{ color: textColor }} className="text-2xl font-bold">{stat.value}</div>
            <div style={{ color: textColor }} className="text-sm opacity-70">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {servicios.map((servicio, index) => {
          const IconComponent = servicio.icon;
          return (
            <Link
              key={servicio.id}
              to={servicio.path}
              style={cardStyle}
              className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
            >
              {servicio.badge && (
                <div className="absolute top-4 right-4 z-10">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${servicio.iconBg} text-white shadow-md`}>
                    {servicio.badge}
                  </span>
                </div>
              )}
              
              <div className="p-8">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${servicio.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <IconComponent size={32} className="text-white" />
                </div>
                
                <h3 style={{ color: textColor }} className="text-2xl font-bold mb-3">
                  {servicio.title}
                </h3>
                <p style={{ color: textColor }} className="mb-4 leading-relaxed opacity-80">
                  {servicio.description}
                </p>
                
                <div className="space-y-2 mb-6">
                  {servicio.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm" style={{ color: textColor }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-60" style={{ color: textColor }}>{servicio.stats}</span>
                    <span className="text-sm font-medium text-blue-500 group-hover:translate-x-1 transition-transform inline-block">
                      Reservar ahora →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
