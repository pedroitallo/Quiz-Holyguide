import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import TypingIndicator from './TypingIndicator';

// Move CustomAudioPlayer component outside to prevent recreation
const CustomAudioPlayer = ({ audioUrl, title = "Audio Message" }) => {
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
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />
    </motion.div>
  );
};

export default function LoadingRevelation({ onContinue, userName, birthDate, quizResultId }) {
  const [userCity, setUserCity] = useState("your city");
  const [showFirstTyping, setShowFirstTyping] = useState(true);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showSecondTyping, setShowSecondTyping] = useState(false);
  const [showSecondMessage, setShowSecondMessage] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showThirdTyping, setShowThirdTyping] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showSendingTyping, setShowSendingTyping] = useState(false);
  const [showBlurredCards, setShowBlurredCards] = useState(false);
  const [showAudioTyping, setShowAudioTyping] = useState(false);
  const [showAudioMessage, setShowAudioMessage] = useState(false);
  const [showRecordingAudio, setShowRecordingAudio] = useState(false);
  const [showFirstAudio, setShowFirstAudio] = useState(false);
  const [showSecondRecording, setShowSecondRecording] = useState(false);
  const [showSecondAudio, setShowSecondAudio] = useState(false);
  const [showGreenButton, setShowGreenButton] = useState(false);
  const [showFirstAudioMessageTyping, setShowFirstAudioMessageTyping] = useState(false);
  const [showFirstAudioMessage, setShowFirstAudioMessage] = useState(false);
  const [showSecondAudioMessageTyping, setShowSecondAudioMessageTyping] = useState(false);
  const [showSecondAudioMessage, setShowSecondAudioMessage] = useState(false);

  const imageUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/b6f3d66de_image.png";

  // Function to get user's location by IP
  const getUserLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.city) {
        setUserCity(data.city);
      }
    } catch (error) {
      console.warn('Failed to get user location:', error);
      // Keep default "your city"
    }
  };

  useEffect(() => {
    // Get user location when component mounts
    getUserLocation();
  }, []);

  useEffect(() => {
    const timers = [];

    // First typing (1s) then first message
    timers.push(setTimeout(() => {
      setShowFirstTyping(false);
      setShowFirstMessage(true);
    }, 1000));

    // Second typing after first message (1.5s)
    timers.push(setTimeout(() => {
      setShowSecondTyping(true);
    }, 2000));

    // Second message after second typing (1.5s)
    timers.push(setTimeout(() => {
      setShowSecondTyping(false);
      setShowSecondMessage(true);
    }, 3500));

    // Third typing after second message (1.5s)
    timers.push(setTimeout(() => {
      setShowThirdTyping(true);
    }, 5000));

    // Final message after third typing (1.5s)
    timers.push(setTimeout(() => {
      setShowThirdTyping(false);
      setShowFinalMessage(true);
    }, 6500));

    // Show blurred cards after final message
    timers.push(setTimeout(() => {
      setShowSendingTyping(true);
    }, 5500)); // 0.5s after final message

    // Show blurred cards after sending typing (1s typing)
    timers.push(setTimeout(() => {
      setShowSendingTyping(false);
      setShowBlurredCards(true);
    }, 6500));

    // Show button after blurred cards
    timers.push(setTimeout(() => {
      setShowAudioTyping(true);
    }, 11500));

    // Show audio message after typing (2s)
    timers.push(setTimeout(() => {
      setShowAudioTyping(false);
      setShowAudioMessage(true);
    }, 13500));

    // Show recording audio after message
    timers.push(setTimeout(() => {
      setShowRecordingAudio(true);
    }, 14000));

    // Show first audio after recording (3s)
    timers.push(setTimeout(() => {
      setShowRecordingAudio(false);
      setShowFirstAudio(true);
    }, 17000));

    // Show first audio message typing 25s after first audio starts
    timers.push(setTimeout(() => {
      setShowFirstAudioMessageTyping(true);
    }, 42000)); // 17000 + 25000 = 42000

    // Show first audio message after typing (1s) 
    timers.push(setTimeout(() => {
      setShowFirstAudioMessageTyping(false);
      setShowFirstAudioMessage(true);
    }, 43000)); // 42000 + 1000 = 43000

    // Show second recording 3s after first audio message
    timers.push(setTimeout(() => {
      setShowSecondRecording(true);
    }, 46000)); // 43000 + 3000 = 46000

    // Show second audio after second recording (3s)
    timers.push(setTimeout(() => {
      setShowSecondRecording(false);
      setShowSecondAudio(true);
    }, 49000)); // 46000 + 3000 = 49000

    // Show second audio message typing 15s after second audio starts
    timers.push(setTimeout(() => {
      setShowSecondAudioMessageTyping(true);
    }, 64000)); // 49000 + 15000 = 64000

    // Show second audio message after typing (1s)
    timers.push(setTimeout(() => {
      setShowSecondAudioMessageTyping(false);
      setShowSecondAudioMessage(true);
    }, 65000)); // 64000 + 1000 = 65000

    // Show green button after second audio message (1s)
    timers.push(setTimeout(() => {
      setShowGreenButton(true);
    }, 66000)); // 65000 + 1000 = 66000

    return () => timers.forEach(clearTimeout);
  }, []);


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
    window.metrito('checkout');
    window.open('https://payments.securitysacred.online/checkout/184553763:1', '_blank');
  };

  return (
    <div className="py-8 w-full max-w-lg mx-auto flex flex-col items-center gap-4">
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&display=swap"
        rel="stylesheet" />

      {/* First typing indicator */}
      <AnimatePresence>
        {showFirstTyping && <TypingIndicator />}
      </AnimatePresence>

      {/* First message */}
      <AnimatePresence>
        {showFirstMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full">
            <div className="flex items-start gap-3">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                alt="Madame Aura"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                loading="eager"
                decoding="async" />
              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  {userName ? <><span className="font-bold">{userName}</span>, I've already connected with the astrological chart between you and your soulmate. Everything points to a meeting in <strong>{userCity}</strong> — or somewhere very close.</> : "I've already connected with the astrological chart between you and your soulmate. Everything points to a meeting in your city — or somewhere very close."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Second typing indicator */}
      <AnimatePresence>
        {showSecondTyping && <TypingIndicator />}
      </AnimatePresence>

      {/* Second message */}
      <AnimatePresence>
        {showSecondMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full">
            <div className="flex items-start gap-3">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                alt="Madame Aura"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                loading="eager"
                decoding="async" />
              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  In this astrological chart, besides revealing the face of your soulmate... I will also reveal their <strong>name</strong>, <strong>age</strong>, <strong>date of the encounter</strong>, and <strong>unique characteristics</strong>. Take a look:
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Third typing indicator */}
      <AnimatePresence>
        {showThirdTyping && <TypingIndicator />}
      </AnimatePresence>

      {/* Sending details typing indicator */}
      <AnimatePresence>
        {showSendingTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full"
          >
            <div className="flex items-start gap-3">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                alt="Madame Aura"
                loading="eager"
                decoding="async"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
              />
              <div className="flex items-center gap-2 mt-2">
                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-500 ml-2">Sending details of your soulmate...</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blurred Cards */}
      <AnimatePresence>
        {showBlurredCards && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 w-full"
          >
            {/* Expected Date of Meeting */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="font-semibold text-gray-800 mb-2">Expected Date of Meeting:</div>
              <div className="text-gray-600">
                {userName} will meet <span className="blur-sm bg-gray-300 px-2 py-1 rounded">someone special</span> at <strong>{userCity}</strong> on <span className="blur-sm bg-gray-300 px-2 py-1 rounded">March 2025</span>.
              </div>
            </div>

            {/* Name of Soulmate */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="font-semibold text-gray-800 mb-2">Name of your Soulmate:</div>
              <div className="text-gray-600">
                The revealed name was <span className="blur-sm bg-gray-300 px-2 py-0.5 rounded">Alexander</span>, this person is closer than you can imagine.
              </div>
            </div>

            {/* Main Characteristics */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="font-semibold text-gray-800 mb-2">Main Characteristics of your Soulmate:</div>
              <div className="text-gray-600">
                {userName}, your soulmate has <span className="blur-sm bg-gray-300 px-2 py-0.5 rounded">brown</span> eyes, a remarkable smile, and a special mark <span className="blur-sm bg-gray-300 px-2 py-0.5 rounded">on their left hand</span>.
              </div>
            </div>
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
          />
        )}
      </AnimatePresence>

      {/* First Audio Message Typing */}
      <AnimatePresence>
        {showFirstAudioMessageTyping && <TypingIndicator />}
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

      {/* Second Recording audio indicator */}
      <AnimatePresence>
        {showSecondRecording && <RecordingAudioIndicator />}
      </AnimatePresence>

      {/* Second Audio Player */}
      <AnimatePresence>
        {showSecondAudio && (
          <CustomAudioPlayer
            key="second-audio"
            audioUrl="https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/public/68850befb229de9dd8e4dc73/b664913a8_Audio2.mp3"
            title="Second Audio Message"
          />
        )}
      </AnimatePresence>

      {/* Second Audio Message Typing */}
      <AnimatePresence>
        {showSecondAudioMessageTyping && <TypingIndicator />}
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

      {/* Continue button */}
      {showGreenButton && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8">

        <Button
          onClick={handleCheckoutRedirect}
          className="w-full max-w-sm md:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl mt-6"
        >
         YES! REVEAL MY SOULMATE NOW
        </Button>

        </motion.div>
      )}
    </div>);
}