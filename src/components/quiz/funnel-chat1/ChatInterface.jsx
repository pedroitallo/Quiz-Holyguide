import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Heart, Users, Search, Check } from "lucide-react";
import { useTracking } from '@/hooks/useTracking';

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" }
];

const days = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  return { value: day.toString().padStart(2, '0'), label: day.toString() };
});

const loveSituationOptions = [
  { id: "single", label: "I am single", icon: Search, description: "Looking for love" },
  { id: "dating", label: "I am dating or talking to someone", icon: Users, description: "Exploring connections" },
  { id: "relationship_missing", label: "I am in a relationship, but I feel like something is missing", icon: Heart, description: "Seeking completeness" },
  { id: "happy_relationship", label: "I am in a happy relationship and want to confirm if this is my Soulmate", icon: Check, description: "Seeking confirmation" }
];

const getZodiacSign = (dateString) => {
  if (!dateString) return "Capricorn";
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;

  const signs = [
    { name: "Capricorn", start: [12, 22], end: [1, 19] },
    { name: "Aquarius", start: [1, 20], end: [2, 18] },
    { name: "Pisces", start: [2, 19], end: [3, 20] },
    { name: "Aries", start: [3, 21], end: [4, 19] },
    { name: "Taurus", start: [4, 20], end: [5, 20] },
    { name: "Gemini", start: [5, 21], end: [6, 20] },
    { name: "Cancer", start: [6, 21], end: [7, 22] },
    { name: "Leo", start: [7, 23], end: [8, 22] },
    { name: "Virgo", start: [8, 23], end: [9, 22] },
    { name: "Libra", start: [9, 23], end: [10, 22] },
    { name: "Scorpio", start: [10, 23], end: [11, 21] },
    { name: "Sagittarius", start: [11, 22], end: [12, 21] }
  ];

  for (let sign of signs) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;
    if (sign.name === "Capricorn") {
      if (month === 12 && day >= 22 || month === 1 && day <= 19) return sign.name;
    } else {
      if (month === startMonth && day >= startDay || month === endMonth && day <= endDay) return sign.name;
    }
  }
  return "Capricorn";
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex items-start gap-3 mb-4"
  >
    <img
      src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
      alt="Master Aura"
      className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
    />
    <div className="bg-gradient-to-br from-purple-50 to-white p-3 rounded-xl shadow-sm border border-purple-100 max-w-xs">
      <p className="text-sm text-gray-600">Master Aura is typing...</p>
    </div>
  </motion.div>
);

const MadameMessage = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ delay }}
    className="flex items-start gap-3 mb-4"
  >
    <img
      src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
      alt="Master Aura"
      className="w-10 h-10 rounded-full object-cover border-2 border-purple-200 flex-shrink-0"
    />
    <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-xs">
      {children}
    </div>
  </motion.div>
);

const UserMessage = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ delay }}
    className="flex justify-end mb-4"
  >
    <div className="bg-purple-600 text-white p-4 rounded-xl max-w-xs shadow-sm">
      {children}
    </div>
  </motion.div>
);

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
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-purple-100 w-full max-w-xs">
      <div className="flex items-center gap-4">
        <img
          src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
          alt="Master Aura"
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
    </div>
  );
};

export default function ChatInterface({ currentStep, formData, onNextStep, onDataUpdate }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [inputType, setInputType] = useState("none");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showLoveOptions, setShowLoveOptions] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [showRevelationImage, setShowRevelationImage] = useState(false);
  const messagesEndRef = useRef(null);
  const { trackStartQuiz, trackEndQuiz } = useTracking();

  const testimonials = [
    { imageUrl: "https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/14ed61e13_DEP1.webp" },
    { imageUrl: "https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/e858f01a6_DEP2.webp" },
    { imageUrl: "https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/80e6a766a_DEP3.webp" }
  ];


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showInput, showTestimonials, showLoveOptions, showAudio, showRevelationImage]);

  useEffect(() => {
    initializeStep();
  }, [currentStep]);

  const addMessage = (type, content, delay = 1500) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, { type, content }]);
          setTimeout(() => scrollToBottom(), 100);
          resolve();
        }, delay);
      }, 300);
    });
  };

  const initializeStep = async () => {
    setShowInput(false);
    setInputType("none");
    setShowTestimonials(false);
    setShowLoveOptions(false);
    setShowAudio(false);
    setShowRevelationImage(false);

    switch (currentStep) {
      case 1:
        await addMessage("madame", "Hello, I'm Master Aura and in a few minutes we'll discover the face of your soulmate! ✨", 1500);
        await addMessage("madame", "This Year Alone, I Have Connected With More Than 9,200 Soulmates Through My Drawings And Revelations 👇🏼", 1500);
        setShowTestimonials(true);
        setTimeout(() => {
          setInputType("button");
          setShowInput(true);
        }, 1000);
        break;

      case 2:
        await addMessage("madame", "Before We Begin This Sacred Journey Of Love, What Is Your Name?", 1500);
        setInputType("text");
        setShowInput(true);
        break;

      case 3:
        await addMessage("madame", `It is a great pleasure to have you here, ${formData.name}. ✨ I feel that a special connection is about to manifest in your life in the coming days!`, 1500);
        await addMessage("madame", "We all have a soulmate from the day we are born. So, please enter your date of birth below so that I can visualize your soulmate.", 1500);
        setInputType("date");
        setShowInput(true);
        break;

      case 4:
        const zodiac = getZodiacSign(formData.birth_date);
        await addMessage("madame", `Wow, that's amazing! You're a ${zodiac}${zodiac === 'Capricorn' ? ' just like me' : ''}! The ${zodiac} is one of the few signs that has a special sensitivity and connection with their soulmate. I feel like you're on the right path to meeting your Soulmate.`, 1500);
        await addMessage("madame", "HOW IS YOUR LOVE LIFE AT THIS MOMENT?", 1500);
        setShowLoveOptions(true);
        break;

      case 5:
        const zodiacSign = getZodiacSign(formData.birth_date);
        await addMessage("madame", `${formData.name}, I am delighted to hear that things are progressing in your life. People of the ${zodiacSign} sign tend to have a deeper romantic journey, and my vision indicates that you are about to have a transformative revelation!`, 1500);
        await addMessage("madame", `Wow ${formData.name}... The Results Of Your Birth Chart Were Surprising! I'll send you a short audio talking a little about your love destiny`, 1500);
        setShowAudio(true);
        setTimeout(() => {
          setInputType("button");
          setShowInput(true);
        }, 2000);
        break;

      case 6:
        await addMessage("madame", "Based on your birth chart, I am preparing a portrait of your soulmate. I'm starting right now 👇🔮", 1500);
        setShowRevelationImage(true);
        setTimeout(async () => {
          await addMessage("madame", `${formData.name}, something special is unfolding... Based on the reading of your destiny and your birth date, I've started to draw the face of your soulmate. Everything points to a meeting in your city — or somewhere very close. This person has a beautiful energy and is closer than you think… patiently waiting for you. ✨`, 1500);
          setInputType("button");
          setShowInput(true);
        }, 2000);
        break;
    }
  };

  const handleSubmit = async (value) => {
    setShowInput(false);

    if (currentStep === 1) {
      trackStartQuiz();
      setMessages(prev => [...prev, { type: "user", content: "Yes, I am ready!" }]);
      setTimeout(() => onNextStep(), 500);
    } else if (currentStep === 2) {
      setMessages(prev => [...prev, { type: "user", content: value }]);
      onDataUpdate({ name: value });
      setTimeout(() => onNextStep(), 500);
    } else if (currentStep === 3) {
      const birthDate = `${new Date().getFullYear()}-${selectedMonth}-${selectedDay}`;
      setMessages(prev => [...prev, { type: "user", content: `${selectedDay}/${selectedMonth}` }]);
      onDataUpdate({ birth_date: birthDate, birth_day: selectedDay, birth_month: selectedMonth });
      setTimeout(() => onNextStep(), 500);
    } else if (currentStep === 4) {
      const option = loveSituationOptions.find(opt => opt.id === value);
      setMessages(prev => [...prev, { type: "user", content: option.label }]);
      onDataUpdate({ love_situation: value });
      setTimeout(() => onNextStep(), 500);
    } else if (currentStep === 5) {
      setMessages(prev => [...prev, { type: "user", content: "Go to Full Disclosure Now" }]);
      setTimeout(() => onNextStep(), 500);
    } else if (currentStep === 6) {
      trackEndQuiz();
      setMessages(prev => [...prev, { type: "user", content: "Discover the face of my soulmate" }]);
      setTimeout(() => {
        window.location.href = '/funnel-1#paywall';
      }, 500);
    }
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
            {formData.name || ''}
          </div>
          <div>
            {formatDate(formData.birth_date) || '...'}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[600px]">
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            msg.type === "madame" ? (
              <MadameMessage key={index}>
                <p className="text-base text-gray-700 leading-relaxed">{msg.content}</p>
              </MadameMessage>
            ) : (
              <UserMessage key={index}>
                <p className="text-base">{msg.content}</p>
              </UserMessage>
            )
          ))}
        </AnimatePresence>


        {showTestimonials && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div className="relative">
              <img
                src={testimonials[currentTestimonial].imageUrl}
                alt="Testimonial"
                className="w-64 h-80 object-cover rounded-xl shadow-lg mx-auto"
              />
              <div className="flex justify-center gap-2 mt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentTestimonial ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {showLoveOptions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {loveSituationOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Card
                  key={option.id}
                  className="cursor-pointer transition-all duration-300 border-2 hover:border-purple-300"
                  onClick={() => handleSubmit(option.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-semibold text-gray-800">
                          {option.label}
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        )}

        {showAudio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-4"
          >
            <CustomAudioPlayer />
          </motion.div>
        )}

        {showRevelationImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 relative"
          >
            <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200 relative">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/b6f3d66de_image.png"
                alt="Preparing your revelation"
                className="w-full rounded-lg"
              />
              <TextOverlay />
            </div>
          </motion.div>
        )}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {showInput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-gray-200 bg-[#f9f5ff] p-4"
        >
          {inputType === "text" && (
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter your name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && inputValue.trim()) {
                    handleSubmit(inputValue.trim());
                    setInputValue("");
                  }
                }}
              />
              <Button
                onClick={() => {
                  if (inputValue.trim()) {
                    handleSubmit(inputValue.trim());
                    setInputValue("");
                  }
                }}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                Send
              </Button>
            </div>
          )}

          {inputType === "date" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">Day</label>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400 rounded-xl">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48">
                      {days.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">Month</label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400 rounded-xl">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48">
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={() => handleSubmit()}
                disabled={!selectedDay || !selectedMonth}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                Continue
              </Button>
            </div>
          )}

          {inputType === "button" && currentStep === 1 && (
            <Button
              onClick={() => handleSubmit()}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              Yes, I am ready!
            </Button>
          )}

          {inputType === "button" && currentStep === 5 && (
            <Button
              onClick={() => handleSubmit()}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              Go to Full Disclosure Now
            </Button>
          )}

          {inputType === "button" && currentStep === 6 && (
            <Button
              onClick={() => handleSubmit()}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              Discover the face of my soulmate
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}
