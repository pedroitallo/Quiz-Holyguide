{
  const day = i + 1;
  return { value: day.toString().padStart(2, '0'), label: day.toString() };
});

// Generate years from 2007 back to 1940
const years = Array.from({ length: 2007 - 1939 }, (_, i) => {
  const year = 2007 - i;
  return { value: year.toString(), label: year.toString() };
});

const getZodiacSign = (dateString) => {
  if (!dateString) return \"Signo\"; // Placeholder if dateString is not provided
  const date = new Date(dateString);
  const day = date.getUTCDate(); // Use getUTCDate to avoid timezone issues
  const month = date.getUTCMonth() + 1; // Month is 0-indexed

  const signs = [
    { name: \"Capricorn\", start:, end: },
    { name: \"Aquarius\", start:, end: },
    { name: \"Pisces\", start:, end: },
    { name: \"Aries\", start:, end: },
    { name: \"Taurus\", start:, end: },
    { name: \"Gemini\", start:, end: },
    { name: \"Cancer\", start:, end: },
    { name: \"Leo\", start:, end: },
    { name: \"Virgo\", start:, end: },
    { name: \"Libra\", start:, end: },
    { name: \"Scorpio\", start:, end: },
    { name: \"Sagittarius\", start:, end: }
  ];


  for (let sign of signs) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    // Special handling for Capricorn as it spans across December and January
    if (sign.name === \"Capricorn\") {
      if (month === 12 && day >= 22 || month === 1 && day <= 19) {
        return sign.name;
      }
    } else {
      // For signs within the same calendar year
      if (month === startMonth && day >= startDay || month === endMonth && day <= endDay && month !== startMonth) {
        return sign.name;
      }
      // Edge case for signs starting and ending in the same month (e.g., if a sign was entirely within one month, though none are like that here)
      if (startMonth === endMonth && month === startMonth && day >= startDay && day <= endDay) {
        return sign.name;
      }
    }
  }
  return \"Unknown\"; // Fallback if no sign is found, though with the provided ranges, it should always find one.
};

export default function BirthDataCollection({ onSubmit }) {
  const [selectedDay, setSelectedDay] = useState(\"\");
  const [selectedMonth, setSelectedMonth] = useState(\"\");
  const [selectedYear, setSelectedYear] = useState(\"\");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTyping, setShowTyping] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSecondTyping, setShowSecondTyping] = useState(false);
  const [showSecondMessage, setShowSecondMessage] = useState(false);
  const [zodiacSign, setZodiacSign] = useState(\"\");

  useEffect(() => {
    // Show typing for 2 seconds, then show message and form
    const timer = setTimeout(() => {
      setShowTyping(false);
      setShowMessage(true);
      setShowForm(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDay || !selectedMonth || !selectedYear) return;

    trackButtonClick('Continue to Next Step (Birth Data)', 'BirthDataCollection'); // Tracking do botão 'Continue to Next Step'

    setIsSubmitting(true);
    setShowForm(false); // Hide the form once submitted

    const birthDate = `${selectedYear}-${selectedMonth}-${selectedDay}`;
    const sign = getZodiacSign(birthDate);
    setZodiacSign(sign);

    // Show second typing after a short delay (e.g., 500ms after form submit)
    // Reduzido para resposta mais rápida
    setTimeout(() => {
      setShowSecondTyping(true);
    }, 200); // Reduzido de 500 para 200ms

    // After typing, show the second message (e.g., 3 seconds after typing started)
    // Reduzido para resposta mais rápida
    setTimeout(() => {
      setShowSecondTyping(false);
      setShowSecondMessage(true);
    }, 1000); // Reduzido de 3000 para 1000ms

    // The onSubmit call is now triggered by the \"Continue\" button after the second message
  };

  const isFormValid = selectedDay && selectedMonth && selectedYear;

  return (
    <div className=\"text-center py-8\">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>

        <h1 className=\"text-violet-600 mb-6 text-base font-bold lowercase leading-tight\">in the next step, i will reveal everything i've just discovered about your soulmate!</h1>
      </motion.div>

      {/* Container fixo para primeira área de mensagem - evita layout shift */}
      <div className=\"min-h-[120px] mb-6\">
        {/* First typing indicator */}
        <div className={`transition-opacity duration-300 ${showTyping ? 'opacity-100' : 'opacity-0'} ${showMessage ? 'hidden' : ''}`}>
          <TypingIndicator />
        </div>

        {/* Mensagem da Madame Aura */}
        <div className={`transition-opacity duration-300 ${showMessage ? 'opacity-100' : 'opacity-0'} ${!showMessage ? 'hidden' : ''}`}>
          <div className=\"bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto\">
            <div className=\"flex items-start gap-3\">
              <img
                src=\"https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/adbb98955_Perfil.webp\"
                alt=\"Madame Aura\"
                className=\"w-10 h-10 rounded-full object-cover border-2 border-purple-200\" />
              <div className=\"text-left\">
                <p className=\"text-base text-gray-700 leading-relaxed\">
                  We all have a <strong>divine soul from the day we are born</strong>. So, please enter your date of birth below so that <strong>I can visualize your soul mate</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário - só aparece após a mensagem inicial e esconde após submissão */}
      {showForm &&
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className=\"max-w-sm mx-auto space-y-8\">

          {/* Seletores de Dia, Mês e Ano */}
          <div className=\"space-y-4\">
            <label className=\"block text-lg font-semibold text-gray-800\">
              Select your date of birth
            </label>

            <div className=\"grid grid-cols-3 gap-3\">
              {/* Seletor de Dia */}
              <div className=\"space-y-2\">
                <label className=\"block text-sm font-medium text-gray-600\">Day</label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger className=\"border-2 border-purple-200 focus:border-purple-400 rounded-xl py-3\">
                    <SelectValue placeholder=\"Day ↓\" />
                  </SelectTrigger>
                  <SelectContent className=\"max-h-48\">
                    <div className=\"text-xs text-gray-500 px-2 py-1 border-b\">
                      ↓ Scroll to find your day ↓
                    </div>
                    {days.map((day) =>
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Seletor de Mês */}
              <div className=\"space-y-2\">
                <label className=\"block text-sm font-medium text-gray-600\">Month</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className=\"border-2 border-purple-200 focus:border-purple-400 rounded-xl py-3\">
                    <SelectValue placeholder=\"Month ↓\" />
                  </SelectTrigger>
                  <SelectContent className=\"max-h-48\">
                    <div className=\"text-xs text-gray-500 px-2 py-1 border-b\">
                      ↓ Scroll to find your month ↓
                    </div>
                    {months.map((month) =>
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Seletor de Ano */}
              <div className=\"space-y-2\">
                <label className=\"block text-sm font-medium text-gray-600\">Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className=\"border-2 border-purple-200 focus:border-purple-400 rounded-xl py-3\">
                    <SelectValue placeholder=\"Year ↓\" />
                  </SelectTrigger>
                  <SelectContent className=\"max-h-48\">
                    <div className=\"text-xs text-gray-500 px-2 py-1 border-b\">
                      ↓ Scroll to find your birth year ↓
                    </div>
                    {years.map((year) =>
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
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
              type=\"submit\"
              disabled={!isFormValid || isSubmitting}
              className=\"btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed\">

              {isSubmitting ?
                <>
                  <div className=\"w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2\" />
                  Processing...
                </> :
                <>
                  Continue to Next Step
                  <Calendar className=\"w-5 h-5 ml-2\" />
                </>
              }
            </Button>
          </motion.div>
        </motion.form>
      }

      {/* Mensagem da data enviada pelo usuário - aparece após submissão */}
      {isSubmitting &&
        <div className=\"flex justify-end mb-4\">
          <div className=\"bg-purple-600 text-white p-3 rounded-xl max-w-xs mr-4\">
            <p className=\"text-base\">{selectedMonth}/{selectedDay}/{selectedYear}</p>
          </div>
        </div>
      }

      {/* Container fixo para segunda área de mensagem */}
      <div className=\"min-h-[120px] mt-6\">
        {/* Second typing indicator */}
        <div className={`transition-opacity duration-300 ${showSecondTyping ? 'opacity-100' : 'opacity-0'} ${showSecondMessage ? 'hidden' : ''}`}>
          <TypingIndicator />
        </div>

        {/* Second message with zodiac sign */}
        <div className={`transition-opacity duration-300 ${showSecondMessage ? 'opacity-100' : 'opacity-0'} ${!showSecondMessage ? 'hidden' : ''}`}>
          <div className=\"bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto\">
            <div className=\"flex items-start gap-3\">
              <img
                src=\"https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/adbb98955_Perfil.webp\"
                alt=\"Madame Aura\"
                className=\"w-10 h-10 rounded-full object-cover border-2 border-purple-200\" />
              <div className=\"text-left\">
                <p className=\"text-base text-gray-700 leading-relaxed\">
                  Wow, that's amazing! You're a <strong>{zodiacSign}</strong>{zodiacSign === 'Capricorn' ? ' just like me' : ''}! The <strong>{zodiacSign}</strong> is one of the few signs that has a special sensitivity and connection with their soulmate. <strong>I feel like you're on the right path to meeting your Divine Soul.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Botão Continue após a mensagem do signo */}
          <div className=\"mt-6\">
            <Button
              onClick={() => {
                onSubmit({
                  birth_date: `${selectedYear}-${selectedMonth}-${selectedDay}`,
                  birth_day: selectedDay,
                  birth_month: selectedMonth,
                  birth_year: selectedYear
                });
                trackButtonClick('Continue (Zodiac Message)', 'BirthDataCollection'); // Tracking do botão 'Continue'
              }}
              className=\"btn-primary\">
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>);

}
">