import React, { useState } from 'react';
import { Hash, Volume2, Plus, Settings, Search, Users, Bell } from 'lucide-react';
import type { Server, Channel } from '../types';
import { CreateServer } from './CreateServer';
import { UserProfile } from './UserProfile';

interface SidebarProps {
  servers: Server[];
  channels: Channel[];
  currentServer?: Server;
  onServerSelect: (server: Server) => void;
  onChannelSelect: (channel: Channel) => void;
}

export function Sidebar({
  servers,
  channels,
  currentServer,
  onServerSelect,
  onChannelSelect,
}: SidebarProps) {
  const [showCreateServer, setShowCreateServer] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Servers sidebar */}
      <div className="w-20 bg-gray-900 p-3 flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
          LC
        </div>

        <div className="w-8 h-px bg-gray-700" />

        {servers.map((server) => (
          <button
            key={server.id}
            onClick={() => onServerSelect(server)}
            className={`w-12 h-12 rounded-full bg-gray-700 hover:bg-indigo-600 transition-colors flex items-center justify-center text-white font-bold relative ${
              currentServer?.id === server.id ? 'bg-indigo-600' : ''
            }`}
          >
            {server.icon ? (
              <img
                src={server.icon}
                alt={server.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              server.name[0].toUpperCase()
            )}
            <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
          </button>
        ))}

        <button
          onClick={() => setShowCreateServer(true)}
          className="w-12 h-12 rounded-full bg-gray-700 hover:bg-green-600 transition-colors flex items-center justify-center text-white"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Channels sidebar */}
      <div className="w-60 bg-gray-800 text-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="font-bold text-white">{currentServer?.name || 'Direct Messages'}</h2>
        </div>

        <div className="p-2">
          <div className="px-2 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 p-2 bg-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {filteredChannels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => onChannelSelect(channel)}
              className="w-full p-2 rounded flex items-center gap-2 hover:bg-gray-700 transition-colors group"
            >
              {channel.type === 'text' ? (
                <Hash className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
              {channel.name}
              <span className="ml-auto opacity-0 group-hover:opacity-100">
                <Users className="w-4 h-4" />
              </span>
            </button>
          ))}
        </div>

        <div className="mt-auto p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowUserProfile(true)}
              className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded-md transition-colors"
            >
              <img
                src="https://imgs.search.brave.com/E_UWBRRxi_Mth0t2pKHhoYW5627CGE77wLMeEt6qDb0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvYmFz/aWMtZGVmYXVsdC1w/ZnAtcHhpNzdxdjVv/MHp1ejhqMy5qcGc"
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">Username</span>
            </button>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-700 rounded-md">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-md">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCreateServer && (
        <CreateServer onClose={() => setShowCreateServer(false)} />
      )}

      {showUserProfile && (
        <UserProfile onClose={() => setShowUserProfile(false)} />
      )}
    </div>
  );
}