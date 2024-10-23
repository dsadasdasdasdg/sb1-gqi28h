import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

export function UserProfile({ onClose }: { onClose: () => void }) {
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const [username, setUsername] = useState(currentUser?.username || '');
  const [status, setStatus] = useState(currentUser?.status || 'online');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (!currentUser) return;
      
      try {
        const file = acceptedFiles[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('avatars')
          .upload(fileName, file);

        if (error) throw error;

        const { data: userData, error: updateError } = await supabase
          .from('users')
          .update({ avatar_url: data.path })
          .eq('id', currentUser.id)
          .select()
          .single();

        if (updateError) throw updateError;
        if (userData) {
          setCurrentUser({ ...currentUser, avatar: userData.avatar_url });
        }
      } catch (error) {
        console.error('Error updating avatar:', error);
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          username,
          status,
        })
        .eq('id', currentUser.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setCurrentUser({ ...currentUser, username: data.username, status: data.status });
      }
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <div {...getRootProps()} className="relative cursor-pointer">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.username}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <input {...getInputProps()} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="online">Online</option>
              <option value="idle">Idle</option>
              <option value="dnd">Do Not Disturb</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}