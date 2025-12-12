export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  clothingSize: {
    shirt: string;
    pants: string;
    shoes: string;
  };
  preferences: string; // "Likes"
  dislikes: string;
  message: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  adminId: string;
  isPublic: boolean;
  approvalRequired: boolean; // Novo: Requer aprovação do admin
  maxMembers: number;
  giftValueLimit: number;
  code: string;
  createdAt: string;
  participants: string[]; // User IDs
  pendingParticipants: string[]; // Novo: User IDs aguardando aprovação
  pairings: Record<string, string>; // Santa ID -> Receiver ID
  status: 'recruiting' | 'drawn' | 'completed';
}

export interface Message {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  link: string;
}

export interface OrderTracking {
  productId: string;
  status: 'ordered' | 'shipped' | 'delivered';
}

export interface Activity {
  id: string;
  type: 'icebreaker' | 'minigame' | 'question';
  content: string;
  responses: Record<string, string>; // userId -> response
}