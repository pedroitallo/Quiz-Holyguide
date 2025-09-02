
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Mic } from "lucide-react";
import TypingIndicator from './TypingIndicator';

const CustomAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 rounded-2xl shadow-sm border border-purple-100 w-full"
    >
      <div className="flex items-center gap-4">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c8fa6c6f1_image.png"
          alt="Madame Aura"
          loading="lazy"
          decoding="async"
          className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
        />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
            </button>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src="https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/c02056bf8_NovoAudio.mp3"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />
    </motion.div>
  );
};

const ChatBubble = ({ userName }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full"
    >
        <div className="flex items-start gap-3">
            <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c8fa6c6f1_image.png"
                alt="Madame Aura"
                loading="lazy"
                decoding="async"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
            />
            <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                    {userName ? <>Wow {userName}...</> : "Wow..."} <strong>The Results Of Your Birth Chart Were Surprising!</strong> I'll send you a short audio talking a little about your love destiny
                </p>
            </div>
        </div>
    </motion.div>
);

const RecordingIndicator = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full"
    >
        <div className="flex items-start gap-3">
            <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c8fa6c6f1_image.png"
                alt="Madame Aura"
                loading="lazy"
                decoding="async"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
            />
            <div className="flex items-center gap-2 mt-2">
                <Mic className="w-5 h-5 text-red-500 animate-pulse" />
                <span className="text-sm text-gray-500 ml-2">Madame Aura is recording an audio...</span>
            </div>
        </div>
    </motion.div>
);


export default function PalmReadingResults({ onContinue, userName }) {
    const [showTyping, setShowTyping] = useState(true);
    const [showMessage, setShowMessage] = useState(false);
    const [showRecording, setShowRecording] = useState(false);
    const [showAudio, setShowAudio] = useState(false);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const timers = [];
        
        // Typing for 2s, then show message
        timers.push(setTimeout(() => {
            setShowTyping(false);
            setShowMessage(true);
        }, 2000)); // Changed from 3000 to 2000
        
        // After showing message, start recording indicator
        timers.push(setTimeout(() => {
            setShowRecording(true);
        }, 2500)); // 0.5s after message appears

        // Recording for 8s, then hide it and show audio
        timers.push(setTimeout(() => {
            setShowRecording(false);
            setShowAudio(true);
        }, 2500 + 8000));

        // Show button after audio appears (0.5s after audio appears)
        timers.push(setTimeout(() => {
            setShowButton(true);
        }, 2500 + 8000 + 500));

        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className="py-8 w-full max-w-lg mx-auto flex flex-col items-center gap-4">
            <AnimatePresence>
                {showTyping && <TypingIndicator />}
            </AnimatePresence>
            
            <AnimatePresence>
                {showMessage && <ChatBubble userName={userName} />}
            </AnimatePresence>
            
            <AnimatePresence>
                {showRecording && <RecordingIndicator />}
            </AnimatePresence>
            
            <AnimatePresence>
                {showAudio && <CustomAudioPlayer />}
            </AnimatePresence>

            {/* BOTÃO APARECE APENAS APÓS O ÁUDIO */}
            <AnimatePresence>
                {showButton && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-4 w-full flex justify-center"
                    >
                        <Button
                            onClick={onContinue}
                            className="w-full max-w-sm md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl"
                        >
                            Go to Full Disclosure Now
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
