import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Gift, User, LogOut, Menu, X, Users } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Layout() {
  const { logout, user } = useStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const navItems = [
    { icon: <Home size={20} />, label: 'Painel', path: '/app/dashboard' },
    { icon: <Gift size={20} />, label: 'Loja', path: '/app/shop' },
    { icon: <User size={20} />, label: 'Perfil', path: '/app/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative overflow-hidden">
      {/* Snowflakes Container */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="snowflake">❄</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❄</div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-christmasRed text-white p-4 flex justify-between items-center z-20 shadow-lg">
         <div className="flex flex-col leading-none">
            <span className="font-header font-bold text-lg text-christmasGold">O KAMBA</span>
            <span className="font-header font-bold text-xl text-white">FIXE!</span>
         </div>
        <button onClick={toggleSidebar}>
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 bg-christmasRed text-center hidden md:block">
            <div className="flex flex-col leading-none py-4 border-4 border-christmasGold rounded-lg bg-christmasRed shadow-lg">
                <span className="font-header font-bold text-2xl text-christmasGold drop-shadow-md">O KAMBA</span>
                <span className="font-header font-bold text-3xl text-white drop-shadow-md">FIXE!</span>
            </div>
        </div>

        <div className="p-4 flex items-center space-x-3 border-b border-gray-100 bg-gray-50">
            <img src={user?.avatarUrl} alt="Profile" className="w-10 h-10 rounded-full border-2 border-christmasGreen" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                <p className="text-xs text-christmasGreen truncate">Online</p>
            </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                location.pathname === item.path
                  ? 'bg-christmasRed text-white shadow-md'
                  : 'text-gray-600 hover:bg-red-50 hover:text-christmasRed'
              }`}
            >
              {item.icon}
              <span className="font-semibold">{item.label}</span>
            </Link>
          ))}
          
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-christmasRed transition-colors mt-8"
          >
            <LogOut size={20} />
            <span className="font-semibold">Sair</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen z-10">
        <div className="max-w-4xl mx-auto">
            <Outlet />
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}