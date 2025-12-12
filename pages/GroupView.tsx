import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
    Send, User as UserIcon, Settings, MessageCircle, Gift, Shuffle, 
    Share2, Copy, Check, X, Gamepad2, HelpCircle, Puzzle, Users, PartyPopper,
    ShoppingBag, MapPin, Phone, ExternalLink
} from 'lucide-react';
import { Product } from '../types';

// --- MACRO YETU DATA ---
const VENDOR = {
    name: "Macro Yetu",
    phone: "244943831033", // Formato internacional para API WhatsApp
    displayPhone: "943 831 033",
    address: "Kifica, rua 22, rua directa do BFA; Benfica",
    logo: "https://ui-avatars.com/api/?name=Macro+Yetu&background=D4AF37&color=fff&size=128" // Placeholder logo
};

// --- SUB-COMPONENTS FOR GAMES ---

const QuizGame = () => {
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    
    const questions = [
        { q: "Onde o Papai Noel vive?", options: ["Luanda", "Pólo Norte", "Huambo", "Benguela"], ans: 1 },
        { q: "Qual rena tem o nariz vermelho?", options: ["Rudolph", "Dasher", "Comet", "Cupid"], ans: 0 },
        { q: "O que deixamos para o Papai Noel?", options: ["Funge", "Bolachas e Leite", "Churrasco", "Gasosa"], ans: 1 },
        { q: "Quantas renas puxam o trenó tradicionalmente?", options: ["6", "8", "9", "12"], ans: 2 },
        { q: "Qual dia se celebra o Natal?", options: ["24 Dezembro", "25 Dezembro", "31 Dezembro", "1 Janeiro"], ans: 1 },
        { q: "Qual é o doce em forma de bengala?", options: ["Brigadeiro", "Bengala Doce", "Chocotone", "Paçoca"], ans: 1 },
        { q: "No filme 'Esqueceram de Mim', onde a família vai?", options: ["Paris", "Londres", "Nova York", "Flórida"], ans: 0 },
        { q: "Qual cor, além do vermelho, representa o Natal?", options: ["Azul", "Roxo", "Verde", "Laranja"], ans: 2 },
        { q: "O que se coloca no topo da árvore de Natal?", options: ["Uma bola", "Uma estrela", "Um sapato", "Um laço"], ans: 1 },
        { q: "Como se diz 'Feliz Natal' em Inglês?", options: ["Happy New Year", "Merry Christmas", "Good Holidays", "Jingle Bells"], ans: 1 },
    ];

    const handleAnswer = (idx: number) => {
        if (idx === questions[currentQ].ans) setScore(score + 1);
        if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
        else setFinished(true);
    };

    if (finished) return (
        <div className="text-center p-6 bg-green-50 rounded-xl">
            <h3 className="text-xl font-bold text-christmasGreen mb-2">Quiz Concluído!</h3>
            <p className="text-gray-800">Sua pontuação: {score} / {questions.length}</p>
            <button onClick={() => {setFinished(false); setCurrentQ(0); setScore(0)}} className="mt-4 bg-christmasRed text-white px-4 py-2 rounded-lg font-bold">Jogar Novamente</button>
        </div>
    );

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex justify-between mb-4">
                <span className="font-bold text-gray-500">Questão {currentQ + 1}/{questions.length}</span>
                <span className="font-bold text-christmasRed">Pontos: {score}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">{questions[currentQ].q}</h3>
            <div className="grid gap-2">
                {questions[currentQ].options.map((opt, idx) => (
                    <button key={idx} onClick={() => handleAnswer(idx)} className="p-3 bg-gray-50 hover:bg-christmasGold/20 text-gray-800 rounded-lg text-left font-medium border border-gray-200 transition-colors">
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

const AnagramGame = () => {
    const words = [
        { scrambled: "LATAN", real: "NATAL" },
        { scrambled: "ETNESERP", real: "PRESENTE" },
        { scrambled: "AILIMAF", real: "FAMILIA" },
        { scrambled: "ALOBRA", real: "ARVORE" },
        { scrambled: "ONAVONA", real: "ANONOVO" }, // Simplificado sem espaço para o jogo
        { scrambled: "ALEERST", real: "ESTRELA" },
        { scrambled: "ANER", real: "RENA" },
        { scrambled: "OIGAM", real: "AMIGO" },
        { scrambled: "ATSEF", real: "FESTA" },
        { scrambled: "OVREP", real: "PERU" }
    ];
    const [idx, setIdx] = useState(0);
    const [input, setInput] = useState("");
    const [msg, setMsg] = useState("");

    const check = () => {
        // Remove spaces for comparison if needed, currently works on direct match
        if (input.toUpperCase().replace(/\s/g, '') === words[idx].real) {
            setMsg("Correto! 🎉");
            setTimeout(() => {
                setMsg("");
                setInput("");
                setIdx((idx + 1) % words.length);
            }, 1000);
        } else {
            setMsg("Tente novamente!");
        }
    };

    return (
        <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
            <h3 className="text-orange-800 font-bold mb-2">Desembaralhe a Palavra</h3>
            <div className="text-3xl font-mono font-bold text-gray-800 tracking-widest mb-4 bg-white p-4 rounded-lg shadow-sm">
                {words[idx].scrambled}
            </div>
            <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                className="w-full p-3 border-2 border-christmasGreen bg-green-100 rounded-lg text-center text-christmasGreen font-bold uppercase mb-2 placeholder-green-700/50"
                placeholder="SUA RESPOSTA AQUI"
            />
            <button onClick={check} className="w-full bg-orange-500 text-white font-bold py-2 rounded-lg mb-2 hover:bg-orange-600 transition-colors">Verificar</button>
            <p className="h-6 font-bold text-christmasGreen">{msg}</p>
        </div>
    );
};

const RandomGenerator = ({ options, title }: { options: string[], title: string }) => {
    const [result, setResult] = useState("");
    const spin = () => {
        setResult("...");
        setTimeout(() => {
            setResult(options[Math.floor(Math.random() * options.length)]);
        }, 500);
    };
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
            <h3 className="font-bold text-gray-800 mb-4">{title}</h3>
            <div className="min-h-[100px] flex items-center justify-center p-4 bg-gray-50 rounded-lg mb-4 border border-gray-100">
                <p className="text-xl font-bold text-christmasRed leading-relaxed">{result || "Toque para sortear"}</p>
            </div>
            <button onClick={spin} className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-black transition-colors">Sortear</button>
        </div>
    );
};

// --- MAIN COMPONENT ---

export default function GroupView() {
  const { groupId } = useParams<{ groupId: string }>();
  const { user, groups, messages, sendMessage, startDraw, getGroupMessages, approveParticipant, rejectParticipant, toggleGroupApproval, toggleGroupVisibility, products } = useStore();
  const [activeTab, setActiveTab] = useState<'chat' | 'info' | 'activities' | 'settings' | 'shop'>('info');
  const [msgText, setMsgText] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  
  // Shop State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderRecipient, setOrderRecipient] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  const group = groups.find(g => g.id === groupId);
  const groupMessages = getGroupMessages(groupId || '');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [groupMessages, activeTab]);

  if (!group || !user) return <div className="text-center p-10">Grupo não encontrado</div>;

  const isAdmin = group.adminId === user.id;
  const myReceiverId = group.pairings[user.id];

  // User Lookup Helpers
  const getParticipant = (id: string) => {
     // In real app, search in global user list. Mocking here.
     if (id === user.id) return user;
     // Return dummy user for others
     return { id, name: id.startsWith('bot') ? `Elfo ${id.split('-')[1]}` : 'Kamba Amigo', avatarUrl: `https://ui-avatars.com/api/?name=${id}&background=random` };
  };

  const getParticipantName = (id: string) => {
    const p = getParticipant(id);
    return p.name;
  };

  const handleDraw = () => {
    if (group.participants.length < 4) {
        alert("Precisa de pelo menos 4 participantes!");
        return;
    }
    if (confirm("Tem certeza? Isso não pode ser desfeito.")) {
        startDraw(group.id);
    }
  };

  const handleSendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (msgText.trim()) {
        sendMessage(group.id, msgText);
        setMsgText('');
    }
  };

  const copyInvite = () => {
      const link = `https://kambafixe.app/join/${group.code}`;
      navigator.clipboard.writeText(link);
      alert("Link copiado!");
  };

  // --- ORDER VIA WHATSAPP LOGIC ---
  const handleBuyClick = (product: Product) => {
      setSelectedProduct(product);
      // Auto select secret santa receiver if known
      if (myReceiverId) setOrderRecipient(myReceiverId);
      else setOrderRecipient(group.participants.find(p => p !== user.id) || '');
  };

  const sendOrderToWhatsApp = () => {
      if (!selectedProduct) return;
      const recipientUser = getParticipant(orderRecipient);
      
      const message = `*Olá ${VENDOR.name}!* 👋%0A` +
        `Quero encomendar um presente pelo App *O KAMBA FIXE!* 🎁%0A%0A` +
        `🛍️ *Produto:* ${selectedProduct.name}%0A` +
        `💰 *Valor:* ${selectedProduct.price} ${selectedProduct.currency}%0A%0A` +
        `👤 *Para o Kamba:* ${recipientUser.name}%0A` +
        `🖼️ *Foto para Personalizar:* ${recipientUser.avatarUrl || 'Sem foto'}%0A%0A` +
        `📝 *Minhas Observações:* ${orderNotes || 'Sem observações'}%0A%0A` +
        `Aguardo confirmação do pagamento!`;

      window.open(`https://wa.me/${VENDOR.phone}?text=${message}`, '_blank');
      setSelectedProduct(null);
      setOrderNotes('');
  };

  return (
    <div className="h-full flex flex-col md:block space-y-4">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-t-4 border-christmasRed relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold font-header text-gray-800">{group.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">Código:</span>
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-800 font-bold select-all text-sm">{group.code}</span>
                </div>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
                 <button 
                    onClick={() => setShowInvite(!showInvite)}
                    className="flex-1 md:flex-none bg-christmasGold text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                >
                    <Share2 size={16} /> Convidar Kambas
                </button>
            </div>
        </div>

        {/* Invite Modal */}
        {showInvite && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-2xl border border-yellow-200 animate-in slide-in-from-top-2">
                <h3 className="font-bold text-gray-800 mb-2">Convite Rápido</h3>
                <p className="text-sm text-gray-600 mb-3">Compartilhe este link com seus amigos e família.</p>
                <div className="flex gap-2">
                    <input readOnly value={`https://kambafixe.app/join/${group.code}`} className="flex-1 p-2 rounded-lg border text-sm bg-white text-gray-800" />
                    <button onClick={copyInvite} className="bg-gray-800 text-white p-2 rounded-lg"><Copy size={16} /></button>
                </div>
            </div>
        )}

        {/* Secret Santa Reveal */}
        {group.status === 'drawn' && myReceiverId && activeTab !== 'shop' && (
            <div className="mt-6 bg-gradient-to-r from-christmasGreen to-green-800 rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <p className="opacity-80 text-sm font-medium mb-1">O seu amigo oculto é...</p>
                    <h2 className="text-3xl font-header font-bold animate-pulse">{getParticipantName(myReceiverId)}</h2>
                    <button onClick={() => setActiveTab('shop')} className="inline-block mt-4 bg-white text-christmasGreen px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                        Encontrar Presente
                    </button>
                </div>
                <Gift className="absolute -bottom-4 -right-4 text-white/10 w-32 h-32" />
            </div>
        )}

        {/* Admin Draw Trigger */}
        {isAdmin && group.status === 'recruiting' && (
            <div className="mt-4 p-4 bg-red-50 rounded-2xl border border-red-100">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-christmasRed">Zona do Admin</h3>
                        <p className="text-xs text-gray-600">{group.participants.length} participantes entraram.</p>
                    </div>
                    <button 
                        onClick={handleDraw}
                        className="bg-christmasRed text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-red-800 transition-colors flex items-center gap-2"
                    >
                        <Shuffle size={16} /> Realizar Sorteio
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <button onClick={() => setActiveTab('info')} className={`flex-1 py-3 px-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap flex justify-center gap-2 ${activeTab === 'info' ? 'bg-christmasRed text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            <UserIcon size={18} /> <span className="hidden sm:inline">Participantes</span>
        </button>
        <button onClick={() => setActiveTab('chat')} className={`flex-1 py-3 px-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap flex justify-center gap-2 ${activeTab === 'chat' ? 'bg-christmasRed text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            <MessageCircle size={18} /> Chat
        </button>
        <button onClick={() => setActiveTab('activities')} className={`flex-1 py-3 px-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap flex justify-center gap-2 ${activeTab === 'activities' ? 'bg-christmasRed text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Gamepad2 size={18} /> Atividades
        </button>
        <button onClick={() => setActiveTab('shop')} className={`flex-1 py-3 px-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap flex justify-center gap-2 ${activeTab === 'shop' ? 'bg-christmasRed text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            <ShoppingBag size={18} /> Loja
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex-1 py-3 px-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap flex justify-center gap-2 ${activeTab === 'settings' ? 'bg-christmasRed text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Settings size={18} /> <span className="hidden sm:inline">Config</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 overflow-hidden min-h-[400px] flex flex-col">
        
        {/* CHAT TAB */}
        {activeTab === 'chat' && (
            <>
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
                    {groupMessages.length === 0 && (
                        <div className="text-center text-gray-400 py-10">Sem mensagens. Diga Olá! 👋</div>
                    )}
                    {groupMessages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-2xl p-3 shadow-sm ${msg.senderId === user.id ? 'bg-christmasRed text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>
                                <p className="text-xs opacity-70 mb-1">{msg.senderName}</p>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSendMsg} className="p-3 border-t bg-white flex gap-2">
                    <input 
                        type="text" 
                        value={msgText}
                        onChange={e => setMsgText(e.target.value)}
                        placeholder="Digite uma mensagem..."
                        className="flex-1 bg-gray-100 rounded-xl px-4 py-3 border-0 focus:ring-2 focus:ring-christmasRed outline-none text-gray-900 placeholder-gray-500"
                    />
                    <button type="submit" className="bg-christmasRed text-white p-3 rounded-xl hover:bg-red-800 transition-colors">
                        <Send size={20} />
                    </button>
                </form>
            </>
        )}

        {/* PARTICIPANTS TAB */}
        {activeTab === 'info' && (
            <div className="p-6">
                <h3 className="font-bold text-gray-800 mb-4">Participantes ({group.participants.length})</h3>
                <div className="space-y-3">
                    {group.participants.map(pid => (
                        <div key={pid} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-christmasGold/20 flex items-center justify-center text-christmasGold font-bold">
                                    {getParticipantName(pid).charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{getParticipantName(pid)}</p>
                                    <p className="text-xs text-gray-500">{pid === group.adminId ? 'Admin do Grupo' : 'Membro'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* SHOP TAB (NEW) */}
        {activeTab === 'shop' && (
            <div className="p-4 bg-gray-50 min-h-full">
                {/* Vendor Profile Card */}
                <div className="bg-white p-4 rounded-2xl border border-christmasGold shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center md:items-start relative overflow-hidden">
                    <div className="w-16 h-16 rounded-full bg-christmasGold flex items-center justify-center text-white text-2xl font-bold font-header shrink-0">
                        MY
                    </div>
                    <div className="text-center md:text-left flex-1 relative z-10">
                        <h3 className="text-xl font-bold font-header text-gray-800">{VENDOR.name}</h3>
                        <p className="text-sm text-gray-500 mb-2 flex items-center justify-center md:justify-start gap-1">
                            <MapPin size={14} /> {VENDOR.address}
                        </p>
                        <p className="text-sm text-christmasGreen font-bold flex items-center justify-center md:justify-start gap-1">
                             <Phone size={14} /> {VENDOR.displayPhone}
                        </p>
                        <div className="mt-2 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg inline-block border border-green-200">
                            Parceiro Oficial O Kamba Fixe!
                        </div>
                    </div>
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                         <ShoppingBag size={150} />
                    </div>
                </div>

                <h3 className="font-bold text-gray-800 mb-4 ml-1">Presentes Disponíveis</h3>
                <div className="grid grid-cols-2 gap-3">
                     {products.map(product => (
                        <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col">
                            <div className="aspect-square relative">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg font-bold">
                                    {product.price.toLocaleString()} {product.currency}
                                </div>
                            </div>
                            <div className="p-3 flex flex-col flex-1">
                                <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1">{product.name}</h4>
                                <div className="mt-auto pt-2">
                                    <button 
                                        onClick={() => handleBuyClick(product)}
                                        className="w-full bg-christmasGreen text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-green-700"
                                    >
                                        <MessageCircle size={14} /> Encomendar
                                    </button>
                                </div>
                            </div>
                        </div>
                     ))}
                </div>

                {/* ORDER MODAL */}
                {selectedProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200 relative">
                            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                            
                            <h3 className="text-xl font-bold font-header text-gray-800 mb-1">Confirmar Pedido</h3>
                            <p className="text-sm text-gray-500 mb-4">Enviar pedido para {VENDOR.name} via WhatsApp</p>

                            <div className="bg-gray-50 p-3 rounded-xl flex gap-3 items-center mb-4 border border-gray-200">
                                <img src={selectedProduct.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{selectedProduct.name}</p>
                                    <p className="text-christmasRed font-bold text-sm">{selectedProduct.price} {selectedProduct.currency}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Para quem é o presente?</label>
                                    <select 
                                        value={orderRecipient}
                                        onChange={e => setOrderRecipient(e.target.value)}
                                        className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-800 focus:border-christmasGreen outline-none"
                                    >
                                        <option value="">Selecione um Kamba...</option>
                                        {group.participants.map(pid => (
                                            <option key={pid} value={pid}>
                                                {getParticipantName(pid)} {pid === user.id ? '(Eu mesmo)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                        <Check size={12} /> A foto do perfil será enviada para personalização.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Observações (Tamanho, Cor, etc)</label>
                                    <textarea 
                                        rows={3}
                                        value={orderNotes}
                                        onChange={e => setOrderNotes(e.target.value)}
                                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-gray-200 text-gray-800 text-sm"
                                        placeholder="Ex: Quero embrulho vermelho, tamanho M..."
                                    />
                                </div>

                                <button 
                                    onClick={sendOrderToWhatsApp}
                                    disabled={!orderRecipient}
                                    className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold shadow-md hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <MessageCircle size={20} /> Enviar no WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* ACTIVITIES TAB - NEW 5 GAMES */}
        {activeTab === 'activities' && (
            <div className="p-6">
                {!activeGame ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button onClick={() => setActiveGame('quiz')} className="bg-blue-50 p-5 rounded-2xl border border-blue-100 text-left hover:bg-blue-100 transition-colors">
                            <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-blue-600 mb-3 shadow-sm"><HelpCircle size={20} /></div>
                            <h3 className="font-bold text-blue-900">Quiz de Natal</h3>
                            <p className="text-xs text-blue-700">Teste seus conhecimentos festivos.</p>
                        </button>
                        <button onClick={() => setActiveGame('anagram')} className="bg-orange-50 p-5 rounded-2xl border border-orange-100 text-left hover:bg-orange-100 transition-colors">
                            <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-orange-600 mb-3 shadow-sm"><Puzzle size={20} /></div>
                            <h3 className="font-bold text-orange-900">Anagrama Festivo</h3>
                            <p className="text-xs text-orange-700">Desembaralhe as palavras.</p>
                        </button>
                        <button onClick={() => setActiveGame('likely')} className="bg-purple-50 p-5 rounded-2xl border border-purple-100 text-left hover:bg-purple-100 transition-colors">
                            <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-purple-600 mb-3 shadow-sm"><Users size={20} /></div>
                            <h3 className="font-bold text-purple-900">Quem é mais provável?</h3>
                            <p className="text-xs text-purple-700">Votação em grupo divertida.</p>
                        </button>
                        <button onClick={() => setActiveGame('truth')} className="bg-pink-50 p-5 rounded-2xl border border-pink-100 text-left hover:bg-pink-100 transition-colors">
                            <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-pink-600 mb-3 shadow-sm"><PartyPopper size={20} /></div>
                            <h3 className="font-bold text-pink-900">Verdade ou Desafio</h3>
                            <p className="text-xs text-pink-700">Ousadia natalina.</p>
                        </button>
                        <button onClick={() => setActiveGame('fortune')} className="sm:col-span-2 bg-yellow-50 p-5 rounded-2xl border border-yellow-100 text-left hover:bg-yellow-100 transition-colors">
                            <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-yellow-600 mb-3 shadow-sm"><Gift size={20} /></div>
                            <h3 className="font-bold text-yellow-900">Biscoito da Sorte</h3>
                            <p className="text-xs text-yellow-700">Tire uma mensagem para 2024.</p>
                        </button>
                    </div>
                ) : (
                    <div>
                        <button onClick={() => setActiveGame(null)} className="mb-4 text-sm font-bold text-gray-500 hover:text-gray-800">← Voltar para Jogos</button>
                        {activeGame === 'quiz' && <QuizGame />}
                        {activeGame === 'anagram' && <AnagramGame />}
                        {activeGame === 'likely' && <RandomGenerator title="Quem é mais provável de..." options={[
                            "Comer todo o bolo", 
                            "Esquecer o presente", 
                            "Dormir antes da meia-noite", 
                            "Chorar ao receber o presente", 
                            "Usar a roupa mais feia",
                            "Beber demais o vinho",
                            "Ser o primeiro a chegar",
                            "Quebrar um enfeite da árvore",
                            "Cantar mais alto nas músicas",
                            "Vestir-se de Papai Noel"
                        ]} />}
                        {activeGame === 'truth' && <RandomGenerator title="Verdade ou Desafio" options={[
                            "Verdade: Pior presente que já recebeu?", 
                            "Desafio: Imite o Papai Noel por 1 min", 
                            "Verdade: Você acredita em renas voadoras?", 
                            "Desafio: Cante Jingle Bells operático",
                            "Verdade: Já reciclou um presente?",
                            "Desafio: Dê um abraço na pessoa à sua direita",
                            "Verdade: Qual sua comida de natal favorita?",
                            "Desafio: Dance a Macarena natalina",
                            "Verdade: O que você quer ganhar este ano?",
                            "Desafio: Fale como um duende por 2 rodadas"
                        ]} />}
                        {activeGame === 'fortune' && <RandomGenerator title="Sorte de Natal" options={[
                            "2024 será o seu ano!", 
                            "Amor à vista!", 
                            "Dinheiro inesperado vai cair na conta.", 
                            "Muitas viagens te aguardam.",
                            "Uma grande surpresa está chegando.",
                            "A sorte favorece os audazes.",
                            "Você fará novas amizades incríveis.",
                            "Um sonho antigo se realizará.",
                            "Saúde e paz dominarão seu lar.",
                            "Promoção no trabalho é provável."
                        ]} />}
                    </div>
                )}
            </div>
        )}

        {/* SETTINGS TAB - NEW */}
        {activeTab === 'settings' && (
            <div className="p-6 space-y-6">
                
                {/* Admin Controls */}
                {isAdmin ? (
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-4">Privacidade do Grupo</h3>
                            
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="font-bold text-gray-700 text-sm">Aprovação Necessária</p>
                                    <p className="text-xs text-gray-500">Admin deve aprovar novos membros</p>
                                </div>
                                <button 
                                    onClick={() => toggleGroupApproval(group.id, !group.approvalRequired)}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${group.approvalRequired ? 'bg-christmasGreen' : 'bg-gray-300'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${group.approvalRequired ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-gray-700 text-sm">Visibilidade do Grupo</p>
                                    <p className="text-xs text-gray-500">
                                        {group.isPublic ? 'Público (Qualquer um pode ver/entrar)' : 'Privado (Apenas convite/código)'}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => toggleGroupVisibility(group.id, !group.isPublic)}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${group.isPublic ? 'bg-christmasGreen' : 'bg-gray-300'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${group.isPublic ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>

                        {/* Pending Requests */}
                        {group.approvalRequired && (
                            <div className="bg-white border-2 border-dashed border-gray-200 p-4 rounded-xl">
                                <h3 className="font-bold text-gray-800 mb-2">Solicitações Pendentes ({group.pendingParticipants?.length || 0})</h3>
                                {(!group.pendingParticipants || group.pendingParticipants.length === 0) ? (
                                    <p className="text-sm text-gray-400 italic">Nenhuma solicitação no momento.</p>
                                ) : (
                                    <div className="space-y-2 mt-2">
                                        {group.pendingParticipants.map(pid => (
                                            <div key={pid} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                                                <span className="text-sm font-bold text-gray-700">{getParticipantName(pid)}</span>
                                                <div className="flex gap-2">
                                                    <button onClick={() => approveParticipant(group.id, pid)} className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200"><Check size={16} /></button>
                                                    <button onClick={() => rejectParticipant(group.id, pid)} className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200"><X size={16} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                             <h3 className="font-bold text-gray-800 mb-4">Editar Informações</h3>
                             <div className="space-y-3">
                                 <div>
                                     <label className="text-xs font-bold text-gray-500 uppercase">Nome</label>
                                     <input type="text" defaultValue={group.name} className="w-full mt-1 p-2 rounded border text-gray-900 font-bold" />
                                 </div>
                                 <div>
                                     <label className="text-xs font-bold text-gray-500 uppercase">Descrição</label>
                                     <textarea defaultValue={group.description} className="w-full mt-1 p-2 rounded border text-gray-900 text-sm" />
                                 </div>
                                 <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold w-full">Salvar Alterações</button>
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>Apenas o administrador pode alterar as configurações do grupo.</p>
                    </div>
                )}
                
                <div className="pt-4 border-t">
                    <button className="w-full text-red-600 font-bold text-sm py-3 hover:bg-red-50 rounded-xl transition-colors">
                        Sair do Grupo
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}