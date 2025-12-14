import React, { Component, ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GroupView from './pages/GroupView';
import Profile from './pages/Profile';
import GiftShop from './pages/GiftShop';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

// Componente simples para capturar erros fatais (Tela Branca/Preta)
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Ops! Algo deu errado.</h1>
          <p className="text-gray-600 mb-4">Ocorreu um erro ao carregar o O Kamba Fixe.</p>
          <div className="bg-white p-4 rounded shadow text-left text-xs font-mono overflow-auto max-w-lg w-full border border-red-200">
             {this.state.error?.message || "Erro desconhecido"}
             <br/>
             Tente recarregar a página.
          </div>
          <button onClick={() => window.location.reload()} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Tentar Novamente
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}