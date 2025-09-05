import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import TypingIndicator from './TypingIndicator';

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

const getZodiacSign = (month, day) => {
  const monthNum = parseInt(month);
  const dayNum = parseInt(day);

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
      if (monthNum === 12 && dayNum >= 22 || monthNum === 1 && dayNum <= 19) {
        return sign.name;
      }
    } else {
      if (monthNum === startMonth && dayNum >= startDay || monthNum === endMonth && dayNum <= endDay) {
        return sign.name;
      }
    }
  }
  return "Capricorn";
};

export default function NameCollection({ onNameSubmit }) {
  const [name, setName] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  
  // Flow control states
  const [showFirstTyping, setShowFirstTyping] = useState(true);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showBeforeTyping, setShowBeforeTyping] = useState(false);
  const [showBeforeMessage, setShowBeforeMessage] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [showGreatTyping, setShowGreatTyping] = useState(false);
  const [showGreatMessage, setShowGreatMessage] = useState(false);
  const [showReadyButton, setShowReadyButton] = useState(false);
  const [showWeAllTyping, setShowWeAllTyping] = useState(false);
  const [showWeAllMessage, setShowWeAllMessage] = useState(false);
  const [showDateInput, setShowDateInput] = useState(false);
  const [dateSubmitted, setDateSubmitted] = useState(false);
  const [showWowTyping, setShowWowTyping] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  useEffect(() => {
    // First typing (1s) then first message
    const timer1 = setTimeout(() => {
      setShowFirstTyping(false);
      setShowFirstMessage(true);
      
      // Start "Before" typing after first message
      setTimeout(() => {
        setShowBeforeTyping(true);
      }, 500);
    }, 1000);

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  useEffect(() => {
    if (showBeforeTyping) {
      // Before typing (1s) then before message
      const timer = setTimeout(() => {
        setShowBeforeTyping(false);
        setShowBeforeMessage(true);
        setShowNameInput(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showBeforeTyping]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setNameSubmitted(true);
    setShowNameInput(false);
    
    // Show "great" typing after name submission
    setTimeout(() => {
      setShowGreatTyping(true);
    }, 500);
  };

  useEffect(() => {
    if (showGreatTyping) {
      // Great typing (1s) then great message
      const timer = setTimeout(() => {
        setShowGreatTyping(false);
        setShowGreatMessage(true);
        setShowReadyButton(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showGreatTyping]);

  const handleReadyClick = () => {
    setShowReadyButton(false);
    
    // Show "We all have" typing
    setTimeout(() => {
      setShowWeAllTyping(true);
    }, 500);
  };

  useEffect(() => {
    if (showWeAllTyping) {
      // We all typing (1.5s) then we all message
      const timer = setTimeout(() => {
        setShowWeAllTyping(false);
        setShowWeAllMessage(true);
        setShowDateInput(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [showWeAllTyping]);

  const handleDateSubmit = (e) => {
    e.preventDefault();
    if (!selectedDay || !selectedMonth) return;
    
    setDateSubmitted(true);
    setShowDateInput(false);
    
    // Show "Wow" typing after date submission
    setTimeout(() => {
      setShowWowTyping(true);
    }, 500);
  };

  useEffect(() => {
    if (showWowTyping) {
      // Wow typing (1s) then final message
      const timer = setTimeout(() => {
        setShowWowTyping(false);
        setShowFinalMessage(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showWowTyping]);

  const handleFinalContinue = () => {
    const zodiacSign = getZodiacSign(selectedMonth, selectedDay);
    const birthDate = `2000-${selectedMonth}-${selectedDay}`; // Using 2000 as default year
    
    onNameSubmit({
      name: name.trim(),
      birth_date: birthDate,
      birth_day: selectedDay,
      birth_month: selectedMonth,
      birth_year: "2000",
      zodiac_sign: zodiacSign
    });
  };

  const zodiacSign = selectedDay && selectedMonth ? getZodiacSign(selectedMonth, selectedDay) : "";

  return (
    <div className="text-center py-8 min-h-[600px]">
      {/* CONTAINER FIXO PARA PRIMEIRA MENSAGEM */}
      <div className="min-h-[120px] mb-6">
        {/* First typing */}
        <div className={`transition-opacity duration-300 ${showFirstTyping ? 'opacity-100' : 'opacity-0'} ${showFirstMessage ? 'hidden' : ''}`}>
          <TypingIndicator />
        </div>

        {/* First message */}
        <div className={`transition-opacity duration-300 ${showFirstMessage ? 'opacity-100' : 'opacity-0'} ${!showFirstMessage ? 'hidden' : ''}`}>
          <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <img
                src="https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/adbb98955_Perfil.webp"
                alt="Madame Aura"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />
              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  In the next step, I will reveal everything I've just discovered about your soulmate!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BEFORE TYPING */}
      <div className="min-h-[120px] mb-6">
        <div className={`transition-opacity duration-300 ${showBeforeTyping ? 'opacity-100' : 'opacity-0'} ${showBeforeMessage ? 'hidden' : ''}`}>
          <TypingIndicator />
        </div>

        {/* BEFORE MESSAGE AND NAME INPUT */}
        <div className={`transition-opacity duration-300 ${showBeforeMessage ? 'opacity-100' : 'opacity-0'} ${!showBeforeMessage ? 'hidden' : ''}`}>
          <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto mb-6">
            <div className="flex items-start gap-3">
              <img
                src="https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/adbb98955_Perfil.webp"
                alt="Madame Aura"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />
              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  Before We Begin This Sacred Journey Of Love, <strong>What Is Your Name?</strong>
                </p>
              </div>
            </div>
          </div>

          {/* NAME INPUT SECTION */}
          {showNameInput && !nameSubmitted && (
            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-500 mb-2 font-bold">
                  Enter your name below to find your divine soul 👇
                </p>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg py-4 px-6 rounded-full border-2 border-purple-300 focus:border-purple-500 text-center w-full max-w-md h-14 bg-white placeholder:text-gray-400 placeholder:text-sm"
                  required
                  autoFocus />
              </div>
              <Button
                type="submit"
                disabled={!name.trim()}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 px-12 py-4 text-xl disabled:opacity-50 disabled:cursor-not-allowed">
                Send
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* USER'S NAME MESSAGE */}
      <AnimatePresence>
        {nameSubmitted && (
          <div className="flex justify-end mb-2">
            <div className="bg-purple-600 text-white p-3 rounded-xl max-w-xs mr-4">
              <p className="text-base">{name.trim()}</p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* GREAT TYPING */}
      <div className="min-h-[120px] mb-6">
        <div className={`transition-opacity duration-300 ${showGreatTyping ? 'opacity-100' : 'opacity-0'} ${showGreatMessage ? 'hidden' : ''}`}>
          <TypingIndicator />
        </div>

        {/* GREAT MESSAGE */}
        <div className={`transition-opacity duration-300 ${showGreatMessage ? 'opacity-100' : 'opacity-0'} ${!showGreatMessage ? 'hidden' : ''}`}>
          <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto mb-6">
            <div className="flex items-start gap-3">
              <img
                src="https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/adbb98955_Perfil.webp"
                alt="Madame Aura"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />
              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  It is a great pleasure to have you here, {name}. 
                  <br /><br />
                  ✨ I feel that a <strong>special connection is about to manifest in your life</strong> in the coming days!
                </p>
              </div>
            </div>
          </div>

          {/* YES BUTTON */}
          {showReadyButton && (
            <Button
              onClick={handleReadyClick}
              className="w-full max-w-sm md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl"
            >
              YES! I am Ready!
            </Button>
          )}
        </div>
      </div>

      {/* WE ALL TYPING */}
      <div className="min-h-[120px] mb-6">
        <div className={`transition-opacity duration-300 ${showWeAllTyping ? 'opacity-100' : 'opacity-0'} ${showWeAllMessage ? 'hidden' : ''}`}>
          <TypingIndicator />
        </div>

        {/* WE ALL MESSAGE */}
        <div className={`transition-opacity duration-300 ${showWeAllMessage ? 'opacity-100' : 'opacity-0'} ${!showWeAllMessage ? 'hidden' : ''}`}>
          <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto mb-6">
            <div className="flex items-start gap-3">
              <img
                src="https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/adbb98955_Perfil.webp"
                alt="Madame Aura"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />
              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  We all have a <strong>divine soul from the day we are born</strong>. So, please enter your date of birth below so that <strong>I can visualize your soul mate</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* DATE INPUT SECTION */}
          {showDateInput && !dateSubmitted && (
            <motion.form
              onSubmit={handleDateSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-sm mx-auto space-y-8"
            >
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800">
                  Select your date of birth
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Day selector */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">Day</label>
                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                      <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400 rounded-xl py-3">
                        <SelectValue placeholder="Day ↓" />
                      </SelectTrigger>
                      <SelectContent className="max-h-48">
                        <div className="text-xs text-gray-500 px-2 py-1 border-b">
                          ↓ Scroll to find your day ↓
                        </div>
                        {days.map((day) => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Month selector */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">Month</label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400 rounded-xl py-3">
                        <SelectValue placeholder="Month ↓" />
                      </SelectTrigger>
                      <SelectContent className="max-h-48">
                        <div className="text-xs text-gray-500 px-2 py-1 border-b">
                          ↓ Scroll to find your month ↓
                        </div>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!selectedDay || !selectedMonth}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Next Step
              </Button>
            </motion.form>
          )}
        </div>
      </div>

      {/* USER'S DATE MESSAGE */}
      <AnimatePresence>
        {dateSubmitted && (
          <div className="flex justify-end mb-4">
            <div className="bg-purple-600 text-white p-3 rounded-xl max-w-xs mr-4">
              <p className="text-base">{selectedMonth}/{selectedDay}</p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* WOW TYPING */}
      <div className="min-h-[120px] mb-6">
        <div className={`transition-opacity duration-300 ${showWowTyping ? 'opacity-100' : 'opacity-0'} ${showFinalMessage ? 'hidden' : ''}`}>
          <TypingIndicator />
        </div>

        {/* FINAL MESSAGE WITH ZODIAC SIGN */}
        <div className={`transition-opacity duration-300 ${showFinalMessage ? 'opacity-100' : 'opacity-0'} ${!showFinalMessage ? 'hidden' : ''}`}>
          <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto mb-6">
            <div className="flex items-start gap-3">
              <img
                src="https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/adbb98955_Perfil.webp"
                alt="Madame Aura"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />
              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  Wow, that's amazing! You're a <strong>{zodiacSign}</strong>{zodiacSign === 'Capricorn' ? ' just like me' : ''}! The <strong>{zodiacSign}</strong> is one of the few signs that has a special sensitivity and connection with their soulmate. <strong>I feel like you're on the right path to meeting your Divine Soul.</strong>
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleFinalContinue}
            id="btn-step4"
            className="w-full max-w-sm md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}