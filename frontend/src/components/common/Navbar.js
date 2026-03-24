import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../../themes/ThemeContext';
import { Menu, X, ChevronDown, LogOut, User, Calendar } from 'lucide-react';

function Navbar() {
  const { usuario, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const headerStyle = theme.createHeaderStyle();
  const textColor = theme.createTextColor();

  return (
    <nav 
      style={headerStyle}
      className={`sticky top-0 z-50 transition-all duration-300`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative text-3xl animate-float">🎫</span>
            </div>
            <span className="font-display font-bold text-xl bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 bg-clip-text text-transparent">
              ReservaPro
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {usuario ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md">
                      {usuario.nombre.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ color: textColor }} className="font-medium">{usuario.nombre}</span>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} style={{ color: textColor }} />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fadeIn">
                      <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{usuario.nombre}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{usuario.email}</p>
                      </div>
                      <Link
                        to="/historial"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Calendar size={18} className="text-blue-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Mis Reservas</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700"
                      >
                        <LogOut size={18} className="text-red-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Cerrar Sesión</span>
                      </button>
                    </div>
                  )}
                </div>
                <ThemeToggle />
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{ color: textColor }}
                  className="px-5 py-2.5 hover:text-blue-500 transition-colors font-medium"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="btn-primary px-6 py-2.5 text-sm"
                >
                  Registrarse Gratis
                </Link>
                <ThemeToggle />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <ThemeToggle />
            <button
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-gray-800 animate-fadeIn">
            {usuario ? (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {usuario.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{usuario.nombre}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{usuario.email}</p>
                  </div>
                </div>
                <Link
                  to="/historial"
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Calendar size={20} className="text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-300">Mis Reservas</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-red-600 dark:text-red-400"
                >
                  <LogOut size={20} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  to="/login"
                  className="px-4 py-3 text-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="btn-primary text-center px-4 py-3"
                  onClick={() => setIsOpen(false)}
                >
                  Registrarse Gratis
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
