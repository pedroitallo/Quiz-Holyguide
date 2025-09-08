import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";
import TypingIndicator from './TypingIndicator';

// Move CustomAudioPlayer component outside to prevent recreation
const CustomAudioPlayer = ({ audioUrl, title = "Audio Message", onPlay, isOtherPlaying }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Pause this audio if another one is playing
  useEffect(() => {
    if (isOtherPlaying && isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isOtherPlaying, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Notify parent that this audio is starting to play
        onPlay && onPlay();
        audioRef.current.play();
        setIsPlaying(true);
      }
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
        src={audioUrl}
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
                <div className="w-5 h-5 text-red-500 animate-pulse">🎤</div>
                <span className="text-sm text-gray-500 ml-2">Madame Aura is recording an audio...</span>
            </div>
        </div>
    </motion.div>
);

const BirthChartMessage = ({ userName }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}/${month}`;
    };

    const TextOverlay = () => (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div
                className="absolute"
                style={{
                    top: '22%',
                    right: '13%',
                    width: '18%',
                    height: '18%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >
                <div
                    style={{
                        fontFamily: 'Dancing Script, cursive',
                        fontWeight: '600',
                        fontSize: 'clamp(7px, 2.2vw, 11px)',
                        lineHeight: '1.3',
                        textAlign: 'center',
                        color: '#4a4a4a',
                        textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.1)',
                        filter: 'sepia(10%) contrast(1.1)',
                        transform: 'rotate(-1deg)'
                    }}
                >
                    <div style={{ marginBottom: '2px' }}>
                        {userName || ''}
                    </div>
                    <div>
                        {formatDate(new Date()) || '...'}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-4"
        >
            <link
                href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&display=swap"
                rel="stylesheet"
            />
            
            {/* Message */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full">
                <div className="flex items-start gap-3">
                    <img
                        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                        alt="Madame Aura"
                        loading="lazy"
                        decoding="async"
                        className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                    />
                    <div className="text-left">
                        <p className="text-base text-gray-700 leading-relaxed">
                            Based on your birth chart, <strong>I am preparing a drawing of your soulmate</strong>. I'm starting right now👇🔮
                        </p>
                    </div>
                </div>
            </div>

            {/* Image with overlay */}
            <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200 relative w-full">
                <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/b6f3d66de_image.png"
                    alt="Preparing your revelation"
                    className="w-full rounded-lg"
                    onLoad={() => setImageLoaded(true)}
                    loading="eager"
                    decoding="async"
                    style={{
                        imageRendering: 'crisp-edges',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)'
                    }}
                />
                <TextOverlay />
            </div>

        </motion.div>
    );
};

export default function PalmReadingResults({ onContinue, userName }) {
    const [showTyping, setShowTyping] = useState(true);
    const [showMessage, setShowMessage] = useState(false);
    const [showRecording, setShowRecording] = useState(false);
    const [showAudio, setShowAudio] = useState(false);
    const [showBirthChart, setShowBirthChart] = useState(false);
    const [showThroughTyping, setShowThroughTyping] = useState(false);
    const [showThroughMessage, setShowThroughMessage] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [showAudioTyping, setShowAudioTyping] = useState(false);
    const [showAudioMessage, setShowAudioMessage] = useState(false);
    const [showRecordingAudio, setShowRecordingAudio] = useState(false);
    const [showFirstAudio, setShowFirstAudio] = useState(false);
    const [showFirstAudioMessage, setShowFirstAudioMessage] = useState(false);
    const [showSecondAudio, setShowSecondAudio] = useState(false);
    const [showSecondAudioMessage, setShowSecondAudioMessage] = useState(false);
    const [showCheckoutButton, setShowCheckoutButton] = useState(false);
    const [currentPlayingAudio, setCurrentPlayingAudio] = useState(null);

    const handleAudioPlay = (audioId) => {
        setCurrentPlayingAudio(audioId);
    };

    const RecordingAudioIndicator = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full"
        >
            <div className="flex items-start gap-3">
                <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                    alt="Madame Aura"
                    loading="lazy"
                    decoding="async"
                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                />
                <div className="flex items-center gap-2 mt-2">
                    <div className="w-5 h-5 text-red-500 animate-pulse">🎤</div>
                    <span className="text-sm text-gray-500 ml-2">Madame Aura is recording an audio...</span>
                </div>
            </div>
        </motion.div>
    );

    const handleCheckoutRedirect = () => {
        try {
            // Track checkout event if metrito is available
            if (typeof window !== 'undefined' && window.metrito && typeof window.metrito.track === 'function') {
                window.metrito.track('checkout');
            }
            
            // Redirect to checkout page
            window.location.href = 'https://payments.securitysacred.online/checkout/184553763:1';
        } catch (error) {
            console.error('Error during checkout redirect:', error);
            // Fallback redirect even if tracking fails
            window.location.href = 'https://payments.securitysacred.online/checkout/184553763:1';
        }
    };

    useEffect(() => {
        const timers = [];
        
        // Typing for 2s, then show message
        timers.push(setTimeout(() => {
            setShowTyping(false);
            setShowMessage(true);
        }, 1500)); // Changed from 2000 to 1500
        
        // After showing message, start recording indicator
        timers.push(setTimeout(() => {
            setShowRecording(true);
        }, 2000)); // 0.5s after message appears

        // Recording for 8s, then hide it and show audio
        timers.push(setTimeout(() => {
            setShowRecording(false);
            setShowAudio(true);
        }, 2000 + 3000));

        // Show birth chart message after audio appears (0.5s after audio appears)
        timers.push(setTimeout(() => {
            setShowBirthChart(true);
        }, 2000 + 3000 + 500));
        
        // Show "Through reading" typing 5s after birth chart appears
        timers.push(setTimeout(() => {
            setShowThroughTyping(true);
        }, 2000 + 3000 + 500 + 5000)); // 5s after birth chart
        
        // Show "Through reading" message after 1.5s of typing
        timers.push(setTimeout(() => {
            setShowThroughTyping(false);
            setShowThroughMessage(true);
        }, 2000 + 3000 + 500 + 5000 + 1500));
        
        // Show button after "Through reading" message
        timers.push(setTimeout(() => {
            setShowButton(true);
        }, 2000 + 3000 + 500 + 5000 + 1500 + 500));

        // Show audio typing 1s after button appears
        timers.push(setTimeout(() => {
            setShowAudioTyping(true);
        }, 2000 + 3000 + 500 + 5000 + 1500 + 500 + 1000));

        // Show audio message after typing (2s)
        timers.push(setTimeout(() => {
            setShowAudioTyping(false);
            setShowAudioMessage(true);
        }, 2000 + 3000 + 500 + 5000 + 1500 + 500 + 1000 + 2000));

        // Show recording audio after message
        timers.push(setTimeout(() => {
            setShowRecordingAudio(true);
        }, 2000 + 3000 + 500 + 5000 + 1500 + 500 + 1000 + 2000 + 500));

        // Show first audio after recording (3s)
        timers.push(setTimeout(() => {
            setShowRecordingAudio(false);
            setShowFirstAudio(true);
        }, 2000 + 3000 + 500 + 5000 + 1500 + 500 + 1000 + 2000 + 500 + 3000));

        // Show all remaining messages 5s after first audio starts
        timers.push(setTimeout(() => {
            setShowFirstAudioMessage(true);
            setShowSecondAudio(true);
            setShowSecondAudioMessage(true);
            setShowCheckoutButton(true);
        }, 2000 + 3000 + 500 + 5000 + 1500 + 500 + 1000 + 2000 + 500 + 3000 + 5000));

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
                {showAudio && <CustomAudioPlayer audioUrl="https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/c02056bf8_NovoAudio.mp3" />}
            </AnimatePresence>

            <AnimatePresence>
                {showBirthChart && <BirthChartMessage userName={userName} />}
            </AnimatePresence>

            {/* Through reading typing */}
            <AnimatePresence>
                {showThroughTyping && <TypingIndicator />}
            </AnimatePresence>

            {/* Through reading message */}
            <AnimatePresence>
                {showThroughMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full"
                    >
                        <div className="flex items-start gap-3">
                            <img
                                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                                alt="Madame Aura"
                                loading="lazy"
                                decoding="async"
                                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                            />
                            <div className="text-left">
                                <p className="text-base text-gray-700 leading-relaxed">
                                    Through this reading, I was able to deeply connect with the <strong>energy of your soulmate</strong>... and I've already discovered <strong>surprising details</strong> about them.✨
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
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
                            id="btn-step7"
                            className="w-full max-w-sm md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl"
                            onClick={() => {
                                // Scroll to top before moving to next step
                                setTimeout(() => {
                                    window.scrollTo({ 
                                        top: 0, 
                                        behavior: 'smooth' 
                                    });
                                }, 50);
                                onContinue();
                            }}
                        >
                            Go to Full Disclosure Now
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Audio typing indicator */}
            <AnimatePresence>
                {showAudioTyping && <TypingIndicator />}
            </AnimatePresence>

            {/* Audio message */}
            <AnimatePresence>
                {showAudioMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full">
                        <div className="flex items-start gap-3">
                            <img
                                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                                alt="Madame Aura"
                                loading="eager"
                                decoding="async"
                                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />
                            <div className="text-left">
                                <p className="text-base text-gray-700 leading-relaxed">
                                    listen to the following short audio to understand how <strong>you can access this complete revelation.</strong>👇🏼
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Recording audio indicator */}
            <AnimatePresence>
                {showRecordingAudio && <RecordingAudioIndicator />}
            </AnimatePresence>

            {/* First Audio Player */}
            <AnimatePresence>
                {showFirstAudio && (
                    <CustomAudioPlayer
                        key="first-audio"
                        audioUrl="https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/public/68850befb229de9dd8e4dc73/1f01ac4a5_Audio1.mp3"
                        title="First Audio Message"
                        onPlay={() => handleAudioPlay('first')}
                        isOtherPlaying={currentPlayingAudio === 'second'}
                    />
                )}
            </AnimatePresence>

            {/* First Audio Message */}
            <AnimatePresence>
                {showFirstAudioMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full">
                        <div className="flex items-start gap-3">
                            <img
                                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                                alt="Madame Aura"
                                loading="eager"
                                decoding="async"
                                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />
                            <div className="text-left">
                                <p className="text-base text-gray-700 leading-relaxed">
                                    The fee to unlock this revelation is only <strong>$19</strong>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Second Audio Player */}
            <AnimatePresence>
                {showSecondAudio && (
                    <CustomAudioPlayer
                        key="second-audio"
                        audioUrl="https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/public/68850befb229de9dd8e4dc73/b664913a8_Audio2.mp3"
                        title="Second Audio Message"
                        onPlay={() => handleAudioPlay('second')}
                        isOtherPlaying={currentPlayingAudio === 'first'}
                    />
                )}
            </AnimatePresence>

            {/* Second Audio Message */}
            <AnimatePresence>
                {showSecondAudioMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full">
                        <div className="flex items-start gap-3">
                            <img
                                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                                alt="Madame Aura"
                                loading="eager"
                                decoding="async"
                                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />
                            <div className="text-left">
                                <p className="text-base text-gray-700 leading-relaxed">
                                    I will leave a button below for you to make the payment.
                                    <br /><br />
                                    After that, the drawing and all the <strong>information about your soul mate will be instantly sent by email</strong>, as well as my own personal guidance so that you can meet your soul mate more quickly.
                                    <br /><br />
                                    <strong>Click the button below</strong> ⬇️
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Checkout button */}
            <AnimatePresence>
                {showCheckoutButton && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-4 w-full flex justify-center"
                    >
                        <Button
                            onClick={handleCheckoutRedirect}
                            className="w-full max-w-sm md:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl"
                        >
                            YES! REVEAL MY SOULMATE NOW
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}