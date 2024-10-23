import React, { useState } from 'react';
import { Auth } from './components/Auth';
import { Sidebar } from './components/Sidebar';
import { Chat } from './components/Chat';
import type { User, Server, Channel, Message } from './types';

// Mock data
const mockServers: Server[] = [
  {
    id: '1',
    name: 'Gaming Hub',
    ownerId: '1',
    members: ['1', '2'],
  },
  {
    id: '2',
    name: 'Study Group',
    ownerId: '1',
    members: ['1', '2', '3'],
  },
];

const mockChannels: Channel[] = [
  { id: '1', name: 'general', type: 'text', serverId: '1' },
  { id: '2', name: 'voice-chat', type: 'voice', serverId: '1' },
];

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Welcome to LexChats! 🎉',
    userId: '1',
    timestamp: Date.now() - 1000 * 60 * 5,
  },
  {
    id: '2',
    content: 'Thanks! Excited to be here!',
    userId: '2',
    timestamp: Date.now() - 1000 * 60 * 2,
  },
];

const mockUsers: User[] = [
  {
    id: '1',
    username: 'LexMaster',
    avatar: 'https://imgs.search.brave.com/E_UWBRRxi_Mth0t2pKHhoYW5627CGE77wLMeEt6qDb0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvYmFz/aWMtZGVmYXVsdC1w/ZnAtcHhpNzdxdjVv/MHp1ejhqMy5qcGc',
    status: 'online',
  },
  {
    id: '2',
    username: 'ChatEnthusiast',
    avatar: 'https://imgs.search.brave.com/E_UWBRRxi_Mth0t2pKHhoYW5627CGE77wLMeEt6qDb0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvYmFz/aWMtZGVmYXVsdC1w/ZnAtcHhpNzdxdjVv/MHp1ejhqMy5qcGc',
    status: 'idle',
  },
];

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentServer, setCurrentServer] = useState<Server | null>(null);

  const handleAuth = ({ username, email, password }: { username: string; email?: string; password: string }) => {
    // In a real app, you'd handle authentication with a backend
    setCurrentUser({
      id: 'new-user',
      username,
      email,
      avatar: 'https://imgs.search.brave.com/E_UWBRRxi_Mth0t2pKHhoYW5627CGE77wLMeEt6qDb0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvYmFz/aWMtZGVmYXVsdC1w/ZnAtcHhpNzdxdjVv/MHp1ejhqMy5qcGc',
      status: 'online',
    });
  };

  if (!currentUser) {
    return <Auth onAuth={handleAuth} />;
  }

  return (
    <div className="flex">
      <Sidebar
        servers={mockServers}
        channels={mockChannels}
        currentServer={currentServer || undefined}
        onServerSelect={setCurrentServer}
        onChannelSelect={() => {}}
      />
      <Chat
        messages={mockMessages}
        currentUser={currentUser}
        users={mockUsers}
      />
    </div>
  );
}

export default App;