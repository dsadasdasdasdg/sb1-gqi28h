import React, { useState, useRef } from 'react';
import { Send, Smile, Paperclip, Image, Video, Mic, Phone } from 'lucide-react';
import type { Message, User } from '../types';
import { VideoCall } from './VideoCall';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';

interface ChatProps {
  messages: Message[];
  currentUser: User;
  users: User[];
}

export function Chat({ messages, currentUser, users }: ChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.webm'],
      'audio/*': ['.mp3', '.wav']
    },
    onDrop: (acceptedFiles) => {
      // Handle file upload
      toast.success('File uploaded successfully!');
    }
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // Handle audio upload
        toast.success('Voice message recorded!');
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error recording audio:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-xl">#general</h2>
          <p className="text-sm text-gray-500">Welcome to the beginning of the #general channel!</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsVideoCallActive(true)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Phone className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const user = users.find((u) => u.id === message.userId);
          return (
            <div key={message.id} className="flex items-start gap-3">
              <img
                src={user?.avatar}
                alt={user?.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{user?.username}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-800">{message.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message input */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
          <div {...getRootProps()} className="flex gap-2">
            <input {...getInputProps()} />
            <button type="button" className="text-gray-500 hover:text-gray-700">
              <Paperclip className="w-6 h-6" />
            </button>
            <button type="button" className="text-gray-500 hover:text-gray-700">
              <Image className="w-6 h-6" />
            </button>
            <button type="button" className="text-gray-500 hover:text-gray-700">
              <Video className="w-6 h-6" />
            </button>
          </div>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent focus:outline-none"
          />
          
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`text-gray-500 hover:text-gray-700 ${
              isRecording ? 'text-red-500' : ''
            }`}
          >
            <Mic className="w-6 h-6" />
          </button>
          
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Smile className="w-6 h-6" />
          </button>
          
          <button
            type="submit"
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>

      {isVideoCallActive && (
        <VideoCall
          channelId="general"
          onClose={() => setIsVideoCallActive(false)}
        />
      )}
    </div>
  );
}