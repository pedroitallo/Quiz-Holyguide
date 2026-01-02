import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import TypingIndicator from '../shared/TypingIndicator';

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

const dayColumn1 = Array.from({ length: 10 }, (_, i) => i + 1);
const dayColumn2 = Array.from({ length: 10 }, (_, i) => i + 11);
const dayColumn3 = Array.from({ length: 11 }, (_, i) => i + 21);

const monthColumn1 = months.slice(0, 4);
const monthColumn2 = months.slice(4, 8);
const monthColumn3 = months.slice(8, 12);

const getZodiacSign = (day, month) => {
  const zodiacSigns = [
    { sign: "Capricorn", dates: [[12, 22], [1, 19]] },
    { sign: "Aquarius", dates: [[1, 20], [2, 18]] },
    { sign: "Pisces", dates: [[2, 19], [3, 20]] },
    { sign: "Aries", dates: [[3, 21], [4, 19]] },
    { sign: "Taurus", dates: [[4, 20], [5, 20]] },
    { sign: "Gemini", dates: [[5, 21], [6, 20]] },
    { sign: "Cancer", dates: [[6, 21], [7, 22]] },
    { sign: "Leo", dates: [[7, 23], [8, 22]] },
    { sign: "Virgo", dates: [[8, 23], [9, 22]] },
    { sign: "Libra", dates: [[9, 23], [10, 22]] },
    { sign: "Scorpio", dates: [[10, 23], [11, 21]] },
    { sign: "Sagittarius", dates: [[11, 22], [12, 21]] }
  ];

  for (const { sign, dates } of zodiacSigns) {
    const [[startMonth, startDay], [endMonth, endDay]] = dates;
    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay)
    ) {
      return sign;
    }
  }
  return "Capricorn";
};

export default function BirthDateWithZodiac({ onSubmit }) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [zodiacSign, setZodiacSign] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timer;
    if (showComment) {
      setIsTyping(true);
      timer = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showComment]);

  const handleContinue = () => {
    if (day && month) {
      const dayNum = parseInt(day);
      const monthNum = parseInt(month);

      if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12) {
        const sign = getZodiacSign(dayNum, monthNum);
        setZodiacSign(sign);
        setShowComment(true);
      }
    }
  };

  const handleFinalContinue = () => {
    const birthDate = `${month}/${day}`;
    onSubmit({ birth_date: birthDate, zodiac_sign: zodiacSign });
  };

  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="space-y-4">
          <h1 className="text-lg md:text-xl font-bold text-gray-800 leading-tight px-4">
            From the day we are born, the universe has chosen a person for us: our soulmate
          </h1>
          <p className="text-purple-600 font-semibold text-base md:text-lg">
            What's your date of birth?
          </p>
        </div>

        {!showComment && (
          <div className="max-w-md mx-auto mt-6 px-4 space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 text-center uppercase tracking-wide">
                What day were you born?
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  {dayColumn1.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDay(d.toString().padStart(2, '0'))}
                      className={`w-full py-2 px-3 rounded-lg text-base font-medium transition-all duration-200 ${
                        day === d.toString().padStart(2, '0')
                          ? 'bg-purple-600 text-white shadow-md scale-105'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {dayColumn2.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDay(d.toString().padStart(2, '0'))}
                      className={`w-full py-2 px-3 rounded-lg text-base font-medium transition-all duration-200 ${
                        day === d.toString().padStart(2, '0')
                          ? 'bg-purple-600 text-white shadow-md scale-105'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {dayColumn3.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDay(d.toString().padStart(2, '0'))}
                      className={`w-full py-2 px-3 rounded-lg text-base font-medium transition-all duration-200 ${
                        day === d.toString().padStart(2, '0')
                          ? 'bg-purple-600 text-white shadow-md scale-105'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 text-center uppercase tracking-wide">
                What month were you born?
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  {monthColumn1.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMonth(m.value)}
                      className={`w-full py-2 px-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        month === m.value
                          ? 'bg-purple-600 text-white shadow-md scale-105'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {monthColumn2.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMonth(m.value)}
                      className={`w-full py-2 px-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        month === m.value
                          ? 'bg-purple-600 text-white shadow-md scale-105'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {monthColumn3.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMonth(m.value)}
                      className={`w-full py-2 px-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        month === m.value
                          ? 'bg-purple-600 text-white shadow-md scale-105'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={handleContinue}
              disabled={!day || !month}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Continue
            </Button>
          </div>
        )}

        {showComment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6"
          >
            {isTyping ? (
              <TypingIndicator />
            ) : (
              <>
                <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 mb-6 max-w-md mx-auto">
                  <div className="flex items-start gap-3">
                    <img
                      src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
                      alt="Master Aura"
                      className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                    />
                    <div className="text-left">
                      <p className="text-base text-gray-700 leading-relaxed">
                        Wow, you're a <span className="font-bold text-purple-600">{zodiacSign}</span>! The {zodiacSign} is one of the few signs that has a special sensitivity and connection with their soulmate. I feel like you're on the right path to meeting your Soulmate.
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleFinalContinue}
                  className="w-full max-w-sm md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl"
                >
                  Continue
                </Button>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
