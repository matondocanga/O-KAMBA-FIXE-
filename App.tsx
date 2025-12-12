import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GroupView from './pages/GroupView';
import GiftShop from './pages/GiftShop';
import Profile from './pages/Profile';
import Layout from './components/Layout';

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useStore();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="group/:groupId" element={<GroupView />} />
        <Route path="shop" element={<GiftShop />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <Router>
        <AppRoutes />
      </Router>
    </StoreProvider>
  );
}