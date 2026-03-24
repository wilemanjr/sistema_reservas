import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeContextProvider, useTheme } from './themes/ThemeContext';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import Registro from './components/auth/Registro';
import Navbar from './components/common/Navbar';
import HotelForm from './components/reservas/HotelForm';
import VueloForm from './components/reservas/VueloForm';
import RestauranteForm from './components/reservas/RestauranteForm';
import Historial from './components/reservas/Historial';
import './index.css';

function PrivateRoute({ children }) {
  const { usuario, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return usuario ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { theme } = useTheme();
  const isDark = theme.constructor.name === 'DarkThemeFactory';
  
  // Aplicar clase dark al body para estilos globales
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);
  
  const bgStyle = theme.createBackgroundStyle();
  
  return (
    <div style={bgStyle} className="min-h-screen transition-all duration-500">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/reservas/hotel" element={
            <PrivateRoute>
              <HotelForm />
            </PrivateRoute>
          } />
          <Route path="/reservas/vuelo" element={
            <PrivateRoute>
              <VueloForm />
            </PrivateRoute>
          } />
          <Route path="/reservas/restaurante" element={
            <PrivateRoute>
              <RestauranteForm />
            </PrivateRoute>
          } />
          <Route path="/historial" element={
            <PrivateRoute>
              <Historial />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <BrowserRouter>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
          <AppContent />
        </BrowserRouter>
      </ThemeContextProvider>
    </AuthProvider>
  );
}

export default App;
