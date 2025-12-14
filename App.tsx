import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GroupView from './pages/GroupView';
import Profile from './pages/Profile';
import GiftShop from './pages/GiftShop';

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/app" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="group/:groupId" element={<GroupView />} />
            <Route path="profile" element={<Profile />} />
            <Route path="shop" element={<GiftShop />} />
          </Route>
          {/* Redirecionar qualquer rota desconhecida para o login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}
