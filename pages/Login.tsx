import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Gift, Mail, Github, Apple, Phone, Twitter } from 'lucide-react';

export default function Login() {
  const { login, user } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/app/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-christmasRed to-[#8a1c1c] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full relative z-10 border-4 border-christmasGold">
        <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-full bg-green-50 mb-4">
                <Gift size={48} className="text-christmasGreen" />
            </div>
            <div className="flex flex-col leading-none mb-2">
                <span className="font-header font-bold text-3xl text-christmasRed">O KAMBA</span>
                <span className="font-header font-bold text-4xl text-christmasGreen">FIXE!</span>
            </div>
            <p className="text-gray-500 font-body">A Plataforma Nº1 de Amigo Oculto em Angola</p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={login}
            className="w-full bg-[#4285F4] text-white p-3 rounded-xl font-bold flex items-center justify-center space-x-3 hover:opacity-90 transition-opacity shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"/></svg>
            <span>Continuar com Google</span>
          </button>
          
          <button 
             onClick={login}
             className="w-full bg-[#333] text-white p-3 rounded-xl font-bold flex items-center justify-center space-x-3 hover:opacity-90 transition-opacity shadow-sm"
          >
            <Github size={20} />
            <span>Continuar com GitHub</span>
          </button>

          <button 
             onClick={login}
             className="w-full bg-black text-white p-3 rounded-xl font-bold flex items-center justify-center space-x-3 hover:opacity-90 transition-opacity shadow-sm"
          >
            <Apple size={20} />
            <span>Continuar com Apple</span>
          </button>

          <button 
             onClick={login}
             className="w-full bg-[#1DA1F2] text-white p-3 rounded-xl font-bold flex items-center justify-center space-x-3 hover:opacity-90 transition-opacity shadow-sm"
          >
            <Twitter size={20} />
            <span>Continuar com X</span>
          </button>
        </div>
        
        <div className="mt-6 flex items-center justify-between text-gray-400">
            <span className="h-px bg-gray-200 w-full"></span>
            <span className="px-3 text-sm">OU</span>
            <span className="h-px bg-gray-200 w-full"></span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
            <button onClick={login} className="p-3 border-2 border-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-50">
                <Mail size={20} className="mr-2" /> Email
            </button>
            <button onClick={login} className="p-3 border-2 border-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-50">
                <Phone size={20} className="mr-2" /> Telefone
            </button>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
            Ao continuar, você concorda com nossos Termos e Política Festiva.
        </p>
      </div>
    </div>
  );
}
