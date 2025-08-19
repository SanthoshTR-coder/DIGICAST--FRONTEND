import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

// Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OTPVerification from './components/Auth/OTPVerification';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import VoterDashboard from './components/Dashboard/VoterDashboard';
import LoadingSpinner from './components/UI/LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/voter'} replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/voter'} /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/voter'} /> : <Register />} 
      />
      <Route 
        path="/verify-otp" 
        element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/voter'} /> : <OTPVerification />} 
      />
      
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/voter/*" 
        element={
          <ProtectedRoute requiredRole="voter">
            <VoterDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/" 
        element={
          user ? 
            <Navigate to={user.role === 'admin' ? '/admin' : '/voter'} /> : 
            <Navigate to="/login" />
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AuthProvider>
        <Router>
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;