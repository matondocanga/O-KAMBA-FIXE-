import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Users, Search, ArrowRight, Gift, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, groups, createGroup, joinGroup, joinPublicQueue, queueCount } = useStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  
  // Create Form State
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [limit, setLimit] = useState(10000);

  // Join Form State
  const [joinCode, setJoinCode] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createGroup(groupName, groupDesc, isPublic, limit);
    setShowCreateModal(false);
    setGroupName('');
    setGroupDesc('');
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinGroup(joinCode)) {
      setShowJoinModal(false);
      setJoinCode('');
    } else {
      alert('Código inválido!');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Welcome Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-gray-800 font-header">Bem-vindo(a), {user?.name}! 🎄</h1>
            <p className="text-gray-500">Pronto para espalhar alegria hoje?</p>
        </div>
        <div className="bg-yellow-100 p-3 rounded-full text-christmasGold">
            <Gift size={32} />
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
            onClick={() => setShowCreateModal(true)}
            className="p-6 bg-christmasRed text-white rounded-3xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-left group"
        >
            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                <Plus size={24} />
            </div>
            <h3 className="text-xl font-bold font-header">Criar Grupo</h3>
            <p className="text-white/80 text-sm mt-1">Iniciar nova troca</p>
        </button>

        <button 
            onClick={() => setShowJoinModal(true)}
            className="p-6 bg-christmasGreen text-white rounded-3xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-left group"
        >
            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                <Search size={24} />
            </div>
            <h3 className="text-xl font-bold font-header">Entrar em Grupo</h3>
            <p className="text-white/80 text-sm mt-1">Insira o código do grupo</p>
        </button>

        <button 
            onClick={joinPublicQueue}
            className="p-6 bg-christmasGold text-white rounded-3xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-left group relative overflow-hidden"
        >
             <div className="absolute top-0 right-0 p-4 opacity-20">
                <Globe size={64} />
             </div>
            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform relative z-10">
                <Users size={24} />
            </div>
            <h3 className="text-xl font-bold font-header relative z-10">Fila Pública</h3>
            {queueCount > 0 ? (
                 <p className="text-white font-bold text-sm mt-1 relative z-10 animate-pulse">Procurando kambas... ({queueCount}/4)</p>
            ) : (
                <p className="text-white/90 text-sm mt-1 relative z-10">Combinação automática</p>
            )}
        </button>
      </div>

      {/* My Groups Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 font-header pl-2 border-l-4 border-christmasRed">Meus Grupos</h2>
        {groups.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400">Você ainda não entrou em nenhum grupo.</p>
            </div>
        ) : (
            <div className="grid gap-4">
                {groups.map(group => (
                    <Link key={group.id} to={`/app/group/${group.id}`} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-christmasRed transition-colors flex justify-between items-center group">
                        <div>
                            <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-lg text-gray-800">{group.name}</h3>
                                {group.isPublic && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Público</span>}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{group.participants.length} Participantes • Estado: <span className="capitalize font-medium text-christmasGreen">{group.status === 'recruiting' ? 'Recrutando' : group.status === 'drawn' ? 'Sorteado' : 'Concluído'}</span></p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-full group-hover:bg-red-50 group-hover:text-christmasRed transition-colors">
                            <ArrowRight size={20} />
                        </div>
                    </Link>
                ))}
            </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
                <h2 className="text-2xl font-bold font-header text-christmasRed mb-4">Criar Novo Grupo</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Grupo</label>
                        <input type="text" required value={groupName} onChange={e => setGroupName(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-christmasGreen text-gray-900 placeholder-gray-400" placeholder="ex: Natal em Família 2024" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea value={groupDesc} onChange={e => setGroupDesc(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-christmasGreen text-gray-900 placeholder-gray-400" placeholder="Breve descrição..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Limite de Valor do Presente (Kz)</label>
                        <input type="number" value={limit} onChange={e => setLimit(Number(e.target.value))} className="w-full p-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-christmasGreen text-gray-900 placeholder-gray-400" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" id="public" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="rounded text-christmasRed focus:ring-christmasRed" />
                        <label htmlFor="public" className="text-sm text-gray-700">Tornar grupo público</label>
                    </div>
                    <div className="flex space-x-3 pt-4">
                        <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 p-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100">Cancelar</button>
                        <button type="submit" className="flex-1 p-3 rounded-xl font-bold bg-christmasRed text-white hover:bg-red-700 shadow-md">Criar Grupo</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
                <h2 className="text-2xl font-bold font-header text-christmasGreen mb-4">Entrar no Grupo</h2>
                <form onSubmit={handleJoin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Código do Grupo</label>
                        <input type="text" required value={joinCode} onChange={e => setJoinCode(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-christmasGreen uppercase font-mono tracking-widest text-center text-lg text-gray-900 placeholder-gray-400" placeholder="XYZ123" />
                    </div>
                    <div className="flex space-x-3 pt-4">
                        <button type="button" onClick={() => setShowJoinModal(false)} className="flex-1 p-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100">Cancelar</button>
                        <button type="submit" className="flex-1 p-3 rounded-xl font-bold bg-christmasGreen text-white hover:bg-green-700 shadow-md">Entrar Agora</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}