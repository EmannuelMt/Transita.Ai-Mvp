import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthChange } from './firebase/auth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Fretes from './pages/Fretes';
import Monitoramento from './pages/Monitoramento';
import Motoristas from './pages/Motoristas';
import Veiculos from './pages/Veiculos';
import Relatorios from './pages/Relatorios';
import Manutencao from './pages/Manutencao';
import Financeiro from './pages/Financeiro';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  const PublicRoute = ({ children }) => {
    return !user ? children : <Navigate to="/" />;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Carregando Transita.AI...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {user && (
        <Navbar
          user={user}
          onLogout={handleLogout}
        />
      )}

      <div className="app-content">
        <main className={`main-content ${user ? 'with-navbar' : ''}`}>
          <Routes>
            {/* Rotas Públicas */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login onLogin={handleLogin} />
                </PublicRoute>
              }
            />

            {/* Rotas Protegidas */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard user={user} />
                </ProtectedRoute>
              }
            />

            {/* Rotas do Sistema de Logística */}
            <Route
              path="/fretes"
              element={
                <ProtectedRoute>
                  <Fretes user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/monitoramento"
              element={
                <ProtectedRoute>
                  <Monitoramento user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/motoristas"
              element={
                <ProtectedRoute>
                  <Motoristas user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/veiculos"
              element={
                <ProtectedRoute>
                  <Veiculos user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/relatorios"
              element={
                <ProtectedRoute>
                  <Relatorios user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/manutencao"
              element={
                <ProtectedRoute>
                  <Manutencao user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/financeiro"
              element={
                <ProtectedRoute>
                  <Financeiro user={user} />
                </ProtectedRoute>
              }
            />

            {/* Rota padrão */}
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default App;
