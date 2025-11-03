import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthChange } from './firebase/auth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Multas from './pages/Multas';
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

  // Componente de layout para rotas protegidas
  const ProtectedLayout = ({ children }) => {
    return (
      <>
        {children}
        <Footer />
      </>
    );
  };

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
                  <ProtectedLayout>
                    <Home user={user} />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Dashboard user={user} />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* Rotas do Sistema de Logística */}
            <Route
              path="/Multas"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Multas user={user} />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/monitoramento"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Monitoramento user={user} />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/motoristas"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Motoristas user={user} />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/veiculos"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Veiculos user={user} />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/relatorios"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Relatorios user={user} />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/manutencao"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Manutencao user={user} />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/financeiro"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Financeiro user={user} />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* Rota padrão */}
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;