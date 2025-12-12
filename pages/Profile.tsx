import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Save } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useStore();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    preferences: user?.preferences || '',
    dislikes: user?.dislikes || '',
    shirt: user?.clothingSize.shirt || '',
    pants: user?.clothingSize.pants || '',
    shoes: user?.clothingSize.shoes || '',
    message: user?.message || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
        name: formData.name,
        preferences: formData.preferences,
        dislikes: formData.dislikes,
        clothingSize: {
            shirt: formData.shirt,
            pants: formData.pants,
            shoes: formData.shoes
        },
        message: formData.message
    });
    alert('Perfil Atualizado!');
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-4 mb-8">
        <img src={user.avatarUrl} alt="Profile" className="w-20 h-20 rounded-full border-4 border-christmasGold" />
        <div>
            <h1 className="text-2xl font-bold font-header text-gray-800">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nome de Exibição</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-christmasRed outline-none text-gray-900" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Gostos / Interesses</label>
                <textarea name="preferences" rows={3} value={formData.preferences} onChange={handleChange} className="w-full p-3 bg-green-50 rounded-xl border border-green-100 focus:ring-2 focus:ring-christmasGreen outline-none text-gray-900 placeholder-gray-500" placeholder="O que te faz sorrir?" />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">O que não gosta</label>
                <textarea name="dislikes" rows={3} value={formData.dislikes} onChange={handleChange} className="w-full p-3 bg-red-50 rounded-xl border border-red-100 focus:ring-2 focus:ring-christmasRed outline-none text-gray-900 placeholder-gray-500" placeholder="O que evitar?" />
            </div>
        </div>

        <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Tamanhos</h3>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Camisa</label>
                    <input type="text" name="shirt" value={formData.shirt} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Calças</label>
                    <input type="text" name="pants" value={formData.pants} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Sapatos</label>
                    <input type="text" name="shoes" value={formData.shoes} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" />
                </div>
            </div>
        </div>

        <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mensagem para seu Amigo Oculto</label>
            <textarea name="message" rows={2} value={formData.message} onChange={handleChange} className="w-full p-3 bg-yellow-50 rounded-xl border border-yellow-100 focus:ring-2 focus:ring-christmasGold outline-none text-gray-900 placeholder-gray-500" placeholder="Alguma nota especial?" />
        </div>

        <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2">
            <Save size={20} /> Salvar Alterações
        </button>
      </form>
    </div>
  );
}