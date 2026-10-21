import React, { useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return (
      <div className="card loading-card" style={{ marginTop: '3rem' }}>
        <div className="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return (
      <div className="card loading-card" style={{ marginTop: '3rem' }}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  return user ? <Navigate to="/" replace /> : children;
};

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="container">
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route path="/signup" element={<Navigate to="/register" replace />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
