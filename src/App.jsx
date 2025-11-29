import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthChange } from './firebase/auth';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Multas from './pages/Multas/Multas';
import Monitoramento from './pages/Monitoramento/Monitoramento';
import Motoristas from './pages/Motorista/Motoristas';
import Veiculos from './pages/Veiculos/Veiculos';
import Relatorios from './pages/Relatorios/Relatorios';
import Manutencao from './pages/Manutencao/Manutencao';
import Financeiro from './pages/Financeiro/Financeiro';
import Dashboard from './components/Dashboard/NewDashboard';
import Login from './components/Auth/Login';
import Footer from './components/Footer/Footer';
import BackToTop from './components/BackToTop/BackToTop';
import Profile from './pages/Profile/Profile';
import Admin from './pages/Admin/Admin';
import AcceptInvite from './pages/AcceptInvite/AcceptInvite';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Loading overlay on initial load
  useEffect(() => {
    const t = setTimeout(() => setGlobalLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  // Show loading overlay on each route change briefly
  useEffect(() => {
    // skip initial load
    if (!globalLoading) {
      setGlobalLoading(true);
      const t = setTimeout(() => setGlobalLoading(false), 800);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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

  // Componente de layout para rotas públicas (ex.: Home)
  const PublicLayout = ({ children }) => {
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
            

            {/* Rota pública: Home */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <Home user={user} />
                </PublicLayout>
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

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Profile user={user} />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* Rota de Admin: apenas para o email específico */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  {user?.email === 'transitaaipro@gmail.com' ? (
                    <ProtectedLayout>
                      <Admin user={user} />
                    </ProtectedLayout>
                  ) : (
                    <Navigate to="/" />
                  )}
                </ProtectedRoute>
              }
            />

            {/* Rota para aceitar convite de admin */}
            <Route
              path="/accept-invite"
              element={<AcceptInvite user={user} />}
            />

            {/* Rota padrão */}
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
          </Routes>
        </main>
      </div>
      <BackToTop />
    </div>
  );
}

export default App;