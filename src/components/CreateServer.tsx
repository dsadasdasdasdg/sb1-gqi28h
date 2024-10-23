import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

export function CreateServer({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<File | null>(null);
  const currentUser = useStore((state) => state.currentUser);
  const setServers = useStore((state) => state.setServers);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setIcon(acceptedFiles[0]);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      let iconUrl = '';
      if (icon) {
        const file = icon;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('server-icons')
          .upload(fileName, file);

        if (error) throw error;
        iconUrl = data.path;
      }

      const { data: server, error } = await supabase
        .from('servers')
        .insert([
          {
            name,
            icon_url: iconUrl,
            owner_id: currentUser.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Refresh servers list
      const { data: servers } = await supabase
        .from('servers')
        .select('*');

      if (servers) {
        setServers(servers);
      }

      onClose();
    } catch (error) {
      console.error('Error creating server:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create a Server</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Server Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Server Icon
            </label>
            <div
              {...getRootProps()}
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
            >
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <input {...getInputProps()} />
                  <p>Drag & drop an image here, or click to select</p>
                </div>
              </div>
            </div>
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
              Create Server
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}