import create from 'zustand';
import { User, Server, Channel, Message } from '../types';

interface Store {
  currentUser: User | null;
  servers: Server[];
  channels: Channel[];
  messages: Message[];
  onlineUsers: Set<string>;
  currentServer: Server | null;
  currentChannel: Channel | null;
  setCurrentUser: (user: User | null) => void;
  setServers: (servers: Server[]) => void;
  setChannels: (channels: Channel[]) => void;
  addMessage: (message: Message) => void;
  setOnlineUsers: (users: string[]) => void;
  setCurrentServer: (server: Server | null) => void;
  setCurrentChannel: (channel: Channel | null) => void;
}

export const useStore = create<Store>((set) => ({
  currentUser: null,
  servers: [],
  channels: [],
  messages: [],
  onlineUsers: new Set(),
  currentServer: null,
  currentChannel: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  setServers: (servers) => set({ servers }),
  setChannels: (channels) => set({ channels }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setOnlineUsers: (users) => set({ onlineUsers: new Set(users) }),
  setCurrentServer: (server) => set({ currentServer: server }),
  setCurrentChannel: (channel) => set({ currentChannel: channel }),
}));