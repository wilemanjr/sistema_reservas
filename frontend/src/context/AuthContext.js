import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUsuario(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setUsuario(response.data.usuario);
      toast.success('¡Bienvenido!');
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Error al iniciar sesión';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const registro = async (userData) => {
    try {
      const response = await api.post('/auth/registro', userData);
      toast.success('Registro exitoso. Por favor inicia sesión.');
      return { success: true, data: response.data };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Error al registrarse';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
    toast.success('Sesión cerrada');
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  );
};