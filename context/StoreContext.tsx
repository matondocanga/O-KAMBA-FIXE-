import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Group, Message, Product, Activity } from '../types';

// Mock Data
const MOCK_USER: User = {
  id: 'user-1',
  name: 'João Manuel',
  email: 'joao@example.com',
  avatarUrl: 'https://picsum.photos/200',
  clothingSize: { shirt: 'L', pants: '40', shoes: '42' },
  preferences: 'Gadgets tecnológicos, Livros, Café',
  dislikes: 'Meias, Chaveiros',
  message: 'Ho ho ho! Mal posso esperar!',
};

const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Grãos de Café de Angola', price: 5000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=1', link: '#' },
  { id: 'p2', name: 'Caneca Personalizada "Kamba"', price: 2500, currency: 'Kz', image: 'https://picsum.photos/300/300?random=2', link: '#' },
  { id: 'p3', name: 'Cartão Presente Zango', price: 10000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=3', link: '#' },
  { id: 'p4', name: 'Coluna Bluetooth', price: 15000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=4', link: '#' },
  { id: 'p5', name: 'Máscara Artesanal Local', price: 8000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=5', link: '#' },
  { id: 'p6', name: 'Caixa de Chocolates', price: 4000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=6', link: '#' },
];

interface StoreContextType {
  user: User | null;
  groups: Group[];
  messages: Message[];
  products: Product[];
  queueCount: number;
  login: () => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  createGroup: (name: string, desc: string, isPublic: boolean, limit: number) => void;
  joinGroup: (code: string) => boolean;
  joinPublicQueue: () => void;
  startDraw: (groupId: string) => void;
  sendMessage: (groupId: string, text: string) => void;
  getGroupMessages: (groupId: string) => Message[];
  updateActivity: (groupId: string, activityId: string, response: string) => void;
  approveParticipant: (groupId: string, userId: string) => void;
  rejectParticipant: (groupId: string, userId: string) => void;
  toggleGroupApproval: (groupId: string, required: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [queueCount, setQueueCount] = useState(0);

  // Initialize with some data
  useEffect(() => {
    // Load local storage if we were real
  }, []);

  const login = () => {
    setUser(MOCK_USER);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const createGroup = (name: string, desc: string, isPublic: boolean, limit: number) => {
    if (!user) return;
    const newGroup: Group = {
      id: `g-${Date.now()}`,
      name,
      description: desc,
      adminId: user.id,
      isPublic,
      approvalRequired: false, // Default false
      maxMembers: 10,
      giftValueLimit: limit,
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdAt: new Date().toISOString(),
      participants: [user.id],
      pendingParticipants: [],
      pairings: {},
      status: 'recruiting',
    };
    setGroups([...groups, newGroup]);
  };

  const joinGroup = (code: string) => {
    if (!user) return false;
    const groupIndex = groups.findIndex(g => g.code === code);
    if (groupIndex > -1) {
      const updatedGroups = [...groups];
      const group = updatedGroups[groupIndex];
      
      // Check if already in
      if (group.participants.includes(user.id) || group.pendingParticipants.includes(user.id)) {
          return true;
      }

      if (group.approvalRequired) {
          group.pendingParticipants.push(user.id);
          alert("Pedido enviado! Aguarde a aprovação do Admin.");
      } else {
          group.participants.push(user.id);
      }
      setGroups(updatedGroups);
      return true;
    }
    return false;
  };

  const approveParticipant = (groupId: string, userId: string) => {
    const updatedGroups = groups.map(g => {
        if (g.id === groupId) {
            return {
                ...g,
                pendingParticipants: g.pendingParticipants.filter(id => id !== userId),
                participants: [...g.participants, userId]
            };
        }
        return g;
    });
    setGroups(updatedGroups);
  };

  const rejectParticipant = (groupId: string, userId: string) => {
    const updatedGroups = groups.map(g => {
        if (g.id === groupId) {
            return {
                ...g,
                pendingParticipants: g.pendingParticipants.filter(id => id !== userId)
            };
        }
        return g;
    });
    setGroups(updatedGroups);
  };

  const toggleGroupApproval = (groupId: string, required: boolean) => {
      const updatedGroups = groups.map(g => 
          g.id === groupId ? { ...g, approvalRequired: required } : g
      );
      setGroups(updatedGroups);
  };

  const joinPublicQueue = () => {
    setQueueCount(prev => prev + 1);
    // Simulate finding a match
    setTimeout(() => {
        if (user) {
            const newGroup: Group = {
                id: `g-public-${Date.now()}`,
                name: "Esquadrão Público de Natal 🎄",
                description: "Grupo automático para diversão rápida!",
                adminId: user.id, // User becomes admin by chance
                isPublic: true,
                approvalRequired: false,
                maxMembers: 4,
                giftValueLimit: 5000,
                code: "AUTO24",
                createdAt: new Date().toISOString(),
                participants: [user.id, 'bot-1', 'bot-2', 'bot-3'], // Simulate others
                pendingParticipants: [],
                pairings: {},
                status: 'recruiting'
            };
            setGroups(prev => [...prev, newGroup]);
            setQueueCount(0);
        }
    }, 2000);
  };

  const startDraw = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    // Simple pairing logic (Derangement)
    let participants = [...group.participants];
    // Shuffle
    for (let i = participants.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [participants[i], participants[j]] = [participants[j], participants[i]];
    }

    const pairings: Record<string, string> = {};
    for (let i = 0; i < participants.length; i++) {
        const santa = participants[i];
        const receiver = participants[(i + 1) % participants.length];
        pairings[santa] = receiver;
    }

    const updatedGroups = groups.map(g => 
        g.id === groupId ? { ...g, pairings, status: 'drawn' as const } : g
    );
    setGroups(updatedGroups);
  };

  const sendMessage = (groupId: string, text: string) => {
    if (!user) return;
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      groupId,
      senderId: user.id,
      senderName: user.name,
      text,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getGroupMessages = (groupId: string) => {
    return messages.filter(m => m.groupId === groupId).sort((a,b) => a.timestamp - b.timestamp);
  };

  const updateActivity = (groupId: string, activityId: string, response: string) => {
    // In a real app, we'd store activity state. 
    console.log(`Updated activity ${activityId} in ${groupId} with ${response}`);
  };

  return (
    <StoreContext.Provider value={{
      user,
      groups,
      messages,
      products: MOCK_PRODUCTS,
      queueCount,
      login,
      logout,
      updateUser,
      createGroup,
      joinGroup,
      joinPublicQueue,
      startDraw,
      sendMessage,
      getGroupMessages,
      updateActivity,
      approveParticipant,
      rejectParticipant,
      toggleGroupApproval
    }}>
      {children}
    </StoreContext.Provider>
  );
};