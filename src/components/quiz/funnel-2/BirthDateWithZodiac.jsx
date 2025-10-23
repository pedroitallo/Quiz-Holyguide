import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

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
    const birthDate = `${month.padStart(2, '0')}/${day.padStart(2, '0')}`;
    onSubmit({ birth_date: birthDate, zodiac_sign: zodiacSign });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto px-4 py-8"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <AnimatePresence mode="wait">
          {!showComment ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <Sparkles className="w-12 h-12 text-purple-500 mx-auto" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                  From the day we are born, the universe has chosen a person for us: our soulmate
                </h2>
                <p className="text-xl text-purple-600 font-semibold">
                  What's your date of birth?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 text-center">
                    DAY
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    placeholder="1-31"
                    className="w-full px-4 py-4 text-center text-lg border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 text-center">
                    MONTH
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="1-12"
                    className="w-full px-4 py-4 text-center text-lg border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={!day || !month}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white text-lg font-bold py-4 px-8 rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Continue
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="comment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4 bg-purple-50 rounded-2xl p-6">
                <img
                  src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
                  alt="Master Aura"
                  className="w-12 h-12 rounded-full flex-shrink-0 border-2 border-purple-300"
                />
                <div className="flex-1 space-y-3">
                  <p className="text-lg text-gray-800 leading-relaxed">
                    Wow, you're a <span className="font-bold text-purple-600">{zodiacSign}</span>! The {zodiacSign} is one of the few signs that has a special sensitivity and connection with their soulmate.
                  </p>
                  <p className="text-lg text-gray-800 leading-relaxed">
                    I feel like you're on the right path to meeting your Soulmate.
                  </p>
                </div>
              </div>

              <button
                onClick={handleFinalContinue}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white text-lg font-bold py-4 px-8 rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Continue
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
