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
    logo: "https://ui-avatars.com/api/?name=Macro+Yetu&background=D4AF37&color=fff&size=128" 
};

// --- SUB-COMPONENTS FOR GAMES ---

const QuizGame = () => {
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
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
        if (isProcessing) return;
        
        setIsProcessing(true);
        setSelectedOpt(idx);

        setTimeout(() => {
            if (idx === questions[currentQ].ans) setScore(prev => prev + 1);
            
            if (currentQ < questions.length - 1) {
                setCurrentQ(prev => prev + 1);
                setSelectedOpt(null);
            } else {
                setFinished(true);
            }
            setIsProcessing(false);
        }, 500);
    };

    if (finished) return (
        <div className="text-center p-6 bg-green-50 rounded-xl">
            <h3 className="text-xl font-bold text-christmasGreen mb-2">Quiz Concluído!</h3>
            <p className="text-gray-800">Sua pontuação: {score} / {questions.length}</p>
            <button onClick={() => {setFinished(false); setCurrentQ(0); setScore(0); setSelectedOpt(null);}} className="mt-4 bg-christmasRed text-white px-4 py-2 rounded-lg font-bold">Jogar Novamente</button>
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
                {questions[currentQ].options.map((opt, idx) => {
                    let btnClass = "p-3 rounded-lg text-left font-medium border transition-colors ";
                    if (selectedOpt === idx) {
                        btnClass += "bg-christmasGold text-white border-christmasGold";
                    } else {
                        btnClass += "bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200";
                    }

                    return (
                        <button 
                            key={idx} 
                            onClick={() => handleAnswer(idx)} 
                            disabled={isProcessing}
                            className={btnClass}
                        >
                            {opt}
                        </button>
                    );
                })}
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
        { scrambled: "ONAVONA", real: "ANONOVO" }, 
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

// --- MAIN COMPONENT ---

export default function GroupView() {
  const { groupId } = useParams<{ groupId: string }>();
  const { user, groups, messages, sendMessage, startDraw, getGroupMessages, approveParticipant, rejectParticipant, toggleGroupApproval, toggleGroupVisibility, products } = useStore();
  const [activeTab, setActiveTab] = useState<'chat' | 'info' | 'activities' | 'settings' | 'shop'>('info');
  const [msgText, setMsgText] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  
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
     if (id === user.id) return user;
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
      if (myReceiverId) setOrderRecipient(myReceiverId);
      else setOrderRecipient(group.participants.find(p => p !== user.id) || '');
  };

  const sendOrderToWhatsApp = () => {
      if (!selectedProduct) return;
      const recipientUser = getParticipant(orderRecipient);
      
      const rawMessage = `*Olá ${VENDOR.name}!* 👋\n` +
        `Quero encomendar um presente pelo App *O KAMBA FIXE!* 🎁\n\n` +
        `🛍️ *Produto:* ${selectedProduct.name}\n` +
        `💰 *Valor:* ${selectedProduct.price} ${selectedProduct.currency}\n\n` +
        `👤 *Para o Kamba:* ${recipientUser.name}\n` +
        `🖼️ *Foto para Personalizar:* ${recipientUser.avatarUrl || 'Sem foto'}\n\n` +
        `📝 *Minhas Observações:* ${orderNotes ? orderNotes : 'Sem observações'}\n\n` +
        `Aguardo confirmação do pagamento!`;

      const whatsappUrl = `https://wa.me/${VENDOR.phone}?text=${encodeURIComponent(rawMessage)}`;

      window.open(whatsappUrl, '_blank');
      
      setSelectedProduct(null);
      setOrderNotes('');
  };

  // Helper styles for tabs - UPDATED TO FIXED FLEX LAYOUT (GRID-LIKE)
  const getTabClass = (tabName: string) => {
      const isActive = activeTab === tabName;
      return `
        flex-1 min-w-0
        py-2 md:px-4 md:py-3 
        rounded-xl transition-all cursor-pointer select-none
        flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2
        ${isActive ? 'bg-christmasRed text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}
      `;
  };

  return (
    <div className="h-full flex flex-col md:block space-y-4 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-t-4 border-christmasRed relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold font-header text-gray-800 leading-tight">{group.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Código:</span>
                    <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg text-gray-800 font-bold select-all text-sm border border-gray-200">{group.code}</span>
                </div>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
                 <button 
                    onClick={() => setShowInvite(!showInvite)}
                    className="flex-1 md:flex-none bg-christmasGold text-white px-4 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                >
                    <Share2 size={18} /> Convidar
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
                        <h3 className="font-bold text-christmasRed text-sm">Zona do Admin</h3>
                        <p className="text-xs text-gray-600">{group.participants.length} entraram.</p>
                    </div>
                    <button 
                        onClick={handleDraw}
                        className="bg-christmasRed text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-red-800 transition-colors flex items-center gap-2"
                    >
                        <Shuffle size={14} /> Sorteio
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* Navigation Tabs - OPTIMIZED GRID LAYOUT */}
      <div className="w-full bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex items-stretch gap-1 sticky top-0 z-30">
        <button onClick={() => setActiveTab('info')} className={getTabClass('info')}>
            <UserIcon size={20} className="md:w-5 md:h-5 w-4 h-4" /> 
            <span className="text-[10px] md:text-sm font-bold leading-none truncate w-full text-center">Membros</span>
        </button>
        <button onClick={() => setActiveTab('chat')} className={getTabClass('chat')}>
            <MessageCircle size={20} className="md:w-5 md:h-5 w-4 h-4" /> 
            <span className="text-[10px] md:text-sm font-bold leading-none truncate w-full text-center">Chat</span>
        </button>
        <button onClick={() => setActiveTab('activities')} className={getTabClass('activities')}>
            <Gamepad2 size={20} className="md:w-5 md:h-5 w-4 h-4" /> 
            <span className="text-[10px] md:text-sm font-bold leading-none truncate w-full text-center">Jogos</span>
        </button>
        <button onClick={() => setActiveTab('shop')} className={getTabClass('shop')}>
            <ShoppingBag size={20} className="md:w-5 md:h-5 w-4 h-4" /> 
            <span className="text-[10px] md:text-sm font-bold leading-none truncate w-full text-center">Loja</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={getTabClass('settings')}>
            <Settings size={20} className="md:w-5 md:h-5 w-4 h-4" /> 
            <span className="text-[10px] md:text-sm font-bold leading-none truncate w-full text-center">Config</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[400px]">
        
        {/* MEMBERS TAB */}
        {activeTab === 'info' && (
            <div className="p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Users size={20} className="text-christmasRed" /> Participantes
                </h3>
                <div className="space-y-3">
                    {group.participants.map(pid => {
                        const p = getParticipant(pid);
                        return (
                            <div key={pid} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <img src={p.avatarUrl} alt={p.name} className="w-10 h-10 rounded-full bg-white border border-gray-200" />
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">
                                            {p.name} {pid === user.id && '(Você)'}
                                        </p>
                                        <p className="text-xs text-gray-500">{pid === group.adminId ? 'Administrador' : 'Membro'}</p>
                                    </div>
                                </div>
                                {group.status === 'drawn' && pid === user.id && (
                                    <div className="bg-green-100 text-green-700 p-1.5 rounded-full" title="Você tem um par!">
                                        <Gift size={16} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        {/* CHAT TAB */}
        {activeTab === 'chat' && (
            <div className="flex flex-col h-[60vh] md:h-[500px]">
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50" ref={chatEndRef}>
                    {groupMessages.length === 0 ? (
                        <div className="text-center py-10 opacity-50">
                            <MessageCircle size={48} className="mx-auto mb-2 text-gray-300" />
                            <p className="text-gray-400 font-medium">O chat está silencioso como a neve...</p>
                        </div>
                    ) : (
                        groupMessages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-2xl p-3 shadow-sm ${msg.senderId === user.id ? 'bg-christmasRed text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>
                                    <p className={`text-[10px] mb-1 font-bold ${msg.senderId === user.id ? 'text-white/70' : 'text-christmasRed'}`}>
                                        {msg.senderName}
                                    </p>
                                    <p className="text-sm leading-snug break-words">{msg.text}</p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSendMsg} className="p-3 border-t bg-white flex gap-2 rounded-b-3xl">
                    <input 
                        type="text" 
                        value={msgText}
                        onChange={e => setMsgText(e.target.value)}
                        className="flex-1 bg-gray-100 rounded-xl px-4 py-3 border-0 focus:ring-2 focus:ring-christmasRed outline-none transition-all" 
                        placeholder="Digite uma mensagem..."
                    />
                    <button type="submit" disabled={!msgText.trim()} className="bg-christmasRed text-white p-3 rounded-xl hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
                        <Send size={20} />
                    </button>
                </form>
            </div>
        )}

        {/* GAMES TAB */}
        {activeTab === 'activities' && (
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <button className="bg-blue-50 p-5 rounded-2xl border border-blue-100 text-left hover:bg-blue-100 transition-colors group" onClick={() => window.scrollTo({top: 500, behavior: 'smooth'})}>
                         <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors">
                                <HelpCircle size={24} />
                            </div>
                            <h3 className="font-bold text-blue-900 text-lg">Quiz de Natal</h3>
                         </div>
                         <p className="text-sm text-blue-700/80">Teste seus conhecimentos festivos!</p>
                         <div className="mt-4"><QuizGame /></div>
                    </button>

                    <button className="bg-orange-50 p-5 rounded-2xl border border-orange-100 text-left hover:bg-orange-100 transition-colors group">
                         <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600 group-hover:bg-orange-200 transition-colors">
                                <Puzzle size={24} />
                            </div>
                            <h3 className="font-bold text-orange-900 text-lg">Anagrama</h3>
                         </div>
                         <p className="text-sm text-orange-700/80">Desembaralhe as palavras.</p>
                         <div className="mt-4"><AnagramGame /></div>
                    </button>
                </div>
            </div>
        )}

        {/* SHOP TAB */}
        {activeTab === 'shop' && (
            <div className="p-4">
                <div className="bg-white p-4 rounded-2xl border border-christmasGold shadow-sm mb-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-christmasGold flex items-center justify-center text-white font-bold text-lg shadow-inner">MY</div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">{VENDOR.name}</h3>
                        <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                            <Check size={12} /> Parceiro Oficial Kamba Fixe
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {products.map(product => (
                        <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col hover:border-christmasRed transition-colors">
                            <div className="aspect-square relative bg-gray-100">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {product.currency} {product.price.toLocaleString()}
                                </div>
                            </div>
                            <div className="p-3 flex flex-col flex-1">
                                <h4 className="font-bold text-xs md:text-sm text-gray-800 line-clamp-2 mb-1 flex-1">{product.name}</h4>
                                <button 
                                    onClick={() => handleBuyClick(product)}
                                    className="w-full mt-2 bg-christmasGreen text-white py-2 rounded-lg text-xs font-bold hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-1"
                                >
                                    <ShoppingBag size={14} /> Encomendar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
            <div className="p-6">
                {isAdmin ? (
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Settings size={20} /> Privacidade do Grupo
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Aprovação Necessária</p>
                                        <p className="text-xs text-gray-500">Admin deve aprovar novos membros</p>
                                    </div>
                                    <button 
                                        onClick={() => toggleGroupApproval(group.id, !group.approvalRequired)}
                                        className={`w-12 h-7 rounded-full transition-colors relative ${group.approvalRequired ? 'bg-christmasGreen' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${group.approvalRequired ? 'left-[26px]' : 'left-1'}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Grupo Público</p>
                                        <p className="text-xs text-gray-500">Aparece na busca e fila pública</p>
                                    </div>
                                    <button 
                                        onClick={() => toggleGroupVisibility(group.id, !group.isPublic)}
                                        className={`w-12 h-7 rounded-full transition-colors relative ${group.isPublic ? 'bg-christmasGreen' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${group.isPublic ? 'left-[26px]' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {group.pendingParticipants && group.pendingParticipants.length > 0 && (
                            <div className="bg-white border-2 border-dashed border-gray-200 p-4 rounded-xl">
                                <h3 className="font-bold text-gray-800 mb-2">Solicitações Pendentes</h3>
                                <div className="space-y-2">
                                    {group.pendingParticipants.map(pid => (
                                        <div key={pid} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                                                    {pid.substring(0,2)}
                                                </div>
                                                <span className="text-sm font-bold text-gray-700">{getParticipantName(pid)}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => approveParticipant(group.id, pid)} className="bg-green-100 text-green-700 p-1.5 rounded-lg hover:bg-green-200">
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={() => rejectParticipant(group.id, pid)} className="bg-red-100 text-red-700 p-1.5 rounded-lg hover:bg-red-200">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <div className="inline-block p-4 bg-gray-100 rounded-full mb-3">
                            <Settings size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-bold">Apenas o administrador pode alterar as configurações do grupo.</p>
                    </div>
                )}
            </div>
        )}
      </div>

      {/* SHOP ORDER MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md relative">
                <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
                <h3 className="text-xl font-bold font-header text-gray-800 mb-1">Confirmar Pedido</h3>
                <div className="flex items-center gap-3 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <img src={selectedProduct.image} className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                        <p className="font-bold text-sm text-gray-800 line-clamp-1">{selectedProduct.name}</p>
                        <p className="text-christmasRed font-bold">{selectedProduct.currency} {selectedProduct.price.toLocaleString()}</p>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Para quem é o presente?</label>
                        <select 
                            value={orderRecipient}
                            onChange={(e) => setOrderRecipient(e.target.value)}
                            className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl font-bold focus:border-christmasGreen outline-none"
                        >
                            <option value="" disabled>Selecione um Kamba...</option>
                            <option value={user.id}>Para mim mesmo (Eu mereço!)</option>
                            {group.participants.filter(p => p !== user.id).map(pid => (
                                <option key={pid} value={pid}>
                                    {getParticipantName(pid)} {myReceiverId === pid ? '(Seu Amigo Oculto)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                         <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Observações (Opcional)</label>
                        <textarea 
                            value={orderNotes}
                            onChange={(e) => setOrderNotes(e.target.value)}
                            rows={3} 
                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-christmasGreen resize-none" 
                            placeholder="Ex: Embrulhar para presente, adicionar cartão..."
                        />
                    </div>

                    <button 
                        onClick={sendOrderToWhatsApp}
                        className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Phone size={20} /> Enviar no WhatsApp
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}