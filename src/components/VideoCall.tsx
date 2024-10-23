import React, { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import { Camera, Monitor, Mic, MicOff, VideoOff } from 'lucide-react';
import { useStore } from '../store/useStore';

interface VideoCallProps {
  channelId: string;
  onClose: () => void;
}

export function VideoCall({ channelId, onClose }: VideoCallProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentUser = useStore((state) => state.currentUser);

  useEffect(() => {
    const startMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('Failed to get media devices:', err);
      }
    };

    startMedia();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
      }
      setIsScreenSharing(true);
      screenStream.getVideoTracks()[0].onended = () => {
        if (stream && videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsScreenSharing(false);
        }
      };
    } catch (err) {
      console.error('Failed to share screen:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-4xl">
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isMuted}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full ${
              isMuted ? 'bg-red-500' : 'bg-gray-200'
            }`}
          >
            {isMuted ? <MicOff /> : <Mic />}
          </button>
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${
              isVideoOff ? 'bg-red-500' : 'bg-gray-200'
            }`}
          >
            {isVideoOff ? <VideoOff /> : <Camera />}
          </button>
          <button
            onClick={startScreenShare}
            className={`p-3 rounded-full ${
              isScreenSharing ? 'bg-green-500' : 'bg-gray-200'
            }`}
          >
            <Monitor />
          </button>
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-red-500 text-white"
          >
            End Call
          </button>
        </div>
      </div>
    </div>
  );
}