
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ChevronRight } from "lucide-react";
import TypingIndicator from '../shared/TypingIndicator';

const months = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" }
];

const days = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  return { value: day.toString().padStart(2, '0'), label: day.toString() };
});

const getZodiacSign = (dateString) => {
  if (!dateString) return "Signo";
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;

  const signs = [
    { name: "Capricornio", start: [12, 22], end: [1, 19] },
    { name: "Acuario", start: [1, 20], end: [2, 18] },
    { name: "Piscis", start: [2, 19], end: [3, 20] },
    { name: "Aries", start: [3, 21], end: [4, 19] },
    { name: "Tauro", start: [4, 20], end: [5, 20] },
    { name: "Géminis", start: [5, 21], end: [6, 20] },
    { name: "Cáncer", start: [6, 21], end: [7, 22] },
    { name: "Leo", start: [7, 23], end: [8, 22] },
    { name: "Virgo", start: [8, 23], end: [9, 22] },
    { name: "Libra", start: [9, 23], end: [10, 22] },
    { name: "Escorpio", start: [10, 23], end: [11, 21] },
    { name: "Sagitario", start: [11, 22], end: [12, 21] }
  ];

  for (let sign of signs) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    if (sign.name === "Capricornio") {
      if (month === 12 && day >= 22 || month === 1 && day <= 19) {
        return sign.name;
      }
    } else {
      if (month === startMonth && day >= startDay || month === endMonth && day <= endDay && month !== startMonth) {
        return sign.name;
      }
      if (startMonth === endMonth && month === startMonth && day >= startDay && day <= endDay) {
        return sign.name;
      }
    }
  }
  return "Desconocido";
};

export default function BirthDataCollection({ onSubmit }) {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTyping, setShowTyping] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSecondTyping, setShowSecondTyping] = useState(false);
  const [showSecondMessage, setShowSecondMessage] = useState(false);
  const [zodiacSign, setZodiacSign] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTyping(false);
      setShowMessage(true);
      setShowForm(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDay || !selectedMonth) return;

    setIsSubmitting(true);
    setShowForm(false);

    const currentYear = new Date().getFullYear();
    const birthDate = `${currentYear}-${selectedMonth}-${selectedDay}`;
    const sign = getZodiacSign(birthDate);
    setZodiacSign(sign);

    setTimeout(() => {
      setShowSecondTyping(true);
    }, 200);

    setTimeout(() => {
      setShowSecondTyping(false);
      setShowSecondMessage(true);
    }, 1000);
  };

  const isFormValid = selectedDay && selectedMonth;

  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>

        <h1 className="text-violet-600 mb-6 text-base font-bold lowercase leading-tight">¡en el siguiente paso, revelaré todo lo que acabo de descubrir sobre tu alma gemela!</h1>
      </motion.div>

      <div className="min-h-[120px] mb-6">
        <div className={`transition-opacity duration-300 ${showTyping ? 'opacity-100' : 'opacity-0'} ${showMessage ? 'hidden' : ''}`}>
          <TypingIndicator />
        </div>

        <div className={`transition-opacity duration-300 ${showMessage ? 'opacity-100' : 'opacity-0'} ${!showMessage ? 'hidden' : ''}`}>
          <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <img
                src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
                alt="Master Aura"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />
              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  Todos tenemos una <strong>alma gemela desde el día en que nacemos</strong>. Por favor, ingresa tu fecha de nacimiento a continuación para que <strong>pueda visualizar a tu alma gemela</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm &&
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-sm mx-auto space-y-8">

          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-800">
              Selecciona tu fecha de nacimiento
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Día</label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400 rounded-xl py-3">
                    <SelectValue placeholder="Día ↓" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    <div className="text-xs text-gray-500 px-2 py-1 border-b">
                      ↓ Desliza para encontrar tu día ↓
                    </div>
                    {days.map((day) =>
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Mes</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400 rounded-xl py-3">
                    <SelectValue placeholder="Mes ↓" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    <div className="text-xs text-gray-500 px-2 py-1 border-b">
                      ↓ Desliza para encontrar tu mes ↓
                    </div>
                    {months.map((month) =>
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}>

            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">

              {isSubmitting ?
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Procesando...
                </> :
                <>
                  Continuar al Siguiente Paso
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              }
            </Button>
          </motion.div>
        </motion.form>
      }

      {isSubmitting &&
        <div className="flex justify-end mb-4">
          <div className="bg-purple-600 text-white p-3 rounded-xl max-w-xs mr-4">
            <p className="text-base">{selectedDay}/{selectedMonth}</p>
          </div>
        </div>
      }

      <div className="min-h-[120px] mt-6">
        <div className={`transition-opacity duration-300 ${showSecondTyping ? 'opacity-100' : 'opacity-0'} ${showSecondMessage ? 'hidden' : ''}`}>
          <TypingIndicator />
        </div>

        <div className={`transition-opacity duration-300 ${showSecondMessage ? 'opacity-100' : 'opacity-0'} ${!showSecondMessage ? 'hidden' : ''}`}>
          <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <img
                src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
                alt="Master Aura"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />
              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  ¡Wow, eso es increíble! ¡Eres <strong>{zodiacSign}</strong>{zodiacSign === 'Capricornio' ? ' al igual que yo' : ''}! <strong>{zodiacSign}</strong> es uno de los pocos signos que tiene una sensibilidad especial y conexión con su alma gemela. <strong>Siento que estás en el camino correcto para conocer a tu Alma Gemela.</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={() => {
                const currentYear = new Date().getFullYear();
                onSubmit({
                  birth_date: `${currentYear}-${selectedMonth}-${selectedDay}`,
                  birth_day: selectedDay,
                  birth_month: selectedMonth,
                  birth_year: currentYear.toString()
                });
              }}
              className="btn-primary">
              Continuar
            </Button>
          </div>
        </div>
      </div>
    </div>);

}
