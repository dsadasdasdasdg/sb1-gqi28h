export interface User {
  id: string;
  username: string;
  email?: string;
  avatar: string;
  status: 'online' | 'offline' | 'idle' | 'dnd';
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  timestamp: number;
}

export interface Server {
  id: string;
  name: string;
  icon?: string;
  ownerId: string;
  members: string[];
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  serverId?: string;
}