import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

export default function PaywallStep({ userName, birthDate, quizResultId }) {
  const { trackEndQuiz } = useTracking();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const scrollToPriceCard = () => {
    const priceCard = document.querySelector('.price-card-anchor');
    if (priceCard) {
      const yOffset = -200;
      const y = priceCard.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    if (
      quizResultId &&
      quizResultId !== "offline-mode" &&
      quizResultId !== "admin-mode" &&
      quizResultId !== "bot-mode"
    ) {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(
        (e) => console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    trackEndQuiz();

    const trackCheckout = async () => {
      if (
        quizResultId &&
        quizResultId !== "offline-mode" &&
        quizResultId !== "admin-mode" &&
        quizResultId !== "bot-mode"
      ) {
        try {
          await HybridQuizResult.update(quizResultId, {
            checkout_step_clicked: true,
          });
          console.log("Checkout click tracked successfully");
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout()
      .then(() => {
        try {
          const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
          const url = new URL(checkoutUrl);

          let allUtms = {};

          if (typeof window !== "undefined" && window.utmify) {
            try {
              allUtms = window.utmify.getUtms() || {};
              console.log("UTMs from UTMIFY:", allUtms);
            } catch (error) {
              console.warn("Failed to get UTMs from UTMIFY:", error);
            }
          }

          if (Object.keys(allUtms).length === 0) {
            const currentUrl = new URL(window.location.href);
            const utmParams = [
              "utm_source",
              "utm_medium",
              "utm_campaign",
              "utm_content",
              "utm_term",
            ];

            utmParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });

            const otherParams = ["fbclid", "gclid", "ttclid", "src", "xcod"];
            otherParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });
          }

          Object.keys(allUtms).forEach((key) => {
            if (allUtms[key]) {
              url.searchParams.set(key, allUtms[key]);
            }
          });

          if (
            quizResultId &&
            quizResultId !== "offline-mode" &&
            quizResultId !== "admin-mode" &&
            quizResultId !== "bot-mode"
          ) {
            url.searchParams.set("quiz_result_id", quizResultId);
          }

          console.log("Redirecting to checkout:", url.toString());
          localStorage.removeItem("holymind_quiz_state");
          localStorage.setItem("holymind_last_quiz_id", quizResultId);
          window.location.href = url.toString();
        } catch (error) {
          console.error("Erro ao construir URL de checkout:", error);
          window.location.href = CHECKOUT_CONFIG.baseUrl;
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao rastrear checkout, mas redirecionando mesmo assim:",
          error
        );
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      });
  };

  const faqs = [
    {
      question: "Does it really work?",
      answer:
        "We base predictions on the data you provide and recognized compatibility patterns. It’s not guesswork; it’s personalized analysis.",
    },
    {
      question: "I’m skeptical. Is this safe?",
      answer:
        "Your data are encrypted and used only to create your report. You risk nothing with our guarantee.",
    },
    {
      question: "What if I’m already in a relationship?",
      answer:
        "The report shows compatibility with your current partner and clarifies your future.",
    },
    {
      question: "Is the portrait real?",
      answer:
        "It’s a representation generated from the most likely characteristics. Users report striking similarities.",
    },
    {
      question: "Can I cancel?",
      answer:
        "Yes. The report is a one-time purchase; the monthly subscription can be canceled at any time.",
    },
  ];

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar:
        "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center py-8 max-w-3xl mx-auto px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {/* Top Banner Offer */}
<div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
  <p className="text-sm font-medium">
  Your soulmate reading is ready.
  </p>
</div>

        <h3 className="text-2xl md:text-3xl font-bold px-4 leading-tight mb-6">
  <span className="text-black">Your reading is ready.</span>
  <br />
  <span className="text-purple-600">See your soulmate today!</span>
</h3>


          {/* Imagem do desenho */}
          <div className="mb-6">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/QGBKNA0389427.jpeg"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div>
          {/* Botão para scroll */}
<div className="w-full flex justify-center mb-6">
  <button
    onClick={scrollToPriceCard}
    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 shadow-md"
  >
    SEE YOUR FULL READING
  </button>
</div>
       {/* Top Banner Offer */}
<div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
  <p className="text-sm font-medium">
    Your soulmate report is ready and includes a complete analysis of your soulmate
  </p>
</div>
               {/* Bullets de confiança */}
          <div className="w-full max-w-md mx-auto mt-4 space-y-4 text-left">
            {/* Bullet 1 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
                  alt="Users icon"
                  className="w-5 h-5"
                />
              </div>

              <p className="text-gray-900 text-sm md:text-base">
                <strong>9200 women</strong> found their soulmate.
              </p>
            </div>

            {/* Bullet 2 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2462/2462719.png"
                  alt="Chat icon"
                  className="w-5 h-5"
                />
              </div>

              <p className="text-gray-900 text-sm md:text-base">
                <strong>Thousands of consultations</strong> carried out
              </p>
            </div>
          </div>
          <div className="w-full h-px bg-gray-300/70 my-4"></div>

           {/* Título + imagem grande */}
          <h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-2 px-4">
          We uncovered key details about your soulmate. 👇🏼
          </h2>
          <div className="max-w-xl mx-auto mt-6 bg-white/90 border border-purple-100 rounded-3xl shadow-xl p-6 md:p-7 text-left">
  {/* Header */}
  <div className="mb-4">
    <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold">
      Personalized Soulmate Insight
    </p>
    <h3 className="text-lg md:text-xl font-bold text-gray-900 mt-1">
      Precise information about your soulmate
    </h3>
  </div>

  {/* Personality Traits */}
  <div className="mb-5">
    <p className="text-sm font-semibold text-gray-800 mb-2">
      Personality Traits:
    </p>

    <div className="space-y-2">
      {[
        "Deeply loyal",
        "Protective",
        "Playfully romantic",
      ].map((trait, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 bg-purple-50/80 rounded-2xl px-3 py-2"
        >
          <div className="w-7 h-7 rounded-full bg-purple-200 flex items-center justify-center">
            <span className="text-xs text-purple-800">♥</span>
          </div>
          <p className="text-sm text-gray-800">{trait}</p>
        </div>
      ))}
    </div>
  </div>

  {/* Proximity of the Meeting */}
  <div className="mb-4">
    <p className="text-sm font-semibold text-gray-800 mb-1">
     📍 Proximity of the Meeting:
    </p>
    <p className="text-sm md:text-base text-gray-700">
      <span className="font-semibold text-purple-700">
        “You’re closer than you think.”
      </span>{" "}
      Your birth chart indicates that your paths will cross{" "}
      <span className="font-semibold">within a year</span>, in a{" "}
      <span className="font-semibold">familiar setting</span>.
    </p>
  </div>

 {/* Details about your meeting – borrado */}
<div className="mb-4">
  <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
    <span className="text-pink-500">💕</span> Details about your meeting:
  </p>

  <div className="relative rounded-xl bg-gray-100/70 p-3 overflow-hidden">

    {/* Conteúdo borrado */}
    <p className="text-sm text-gray-600 blur-sm select-none opacity-70">
      This section contains specific details about how, where and under which
      circumstances your first encounter will happen.
    </p>

    {/* Overlay com cadeado */}
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className="bg-white/70 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
        <span className="text-gray-700 text-sm">🔒</span>
        <span className="text-gray-700 text-sm font-semibold">Locked</span>
      </div>
    </div>

  </div>
</div>

{/* What this drawing reveals – borrado */}
<div className="mb-4">
  <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
    <span className="text-blue-600">👤</span> What this drawing reveals:
  </p>

  <div className="relative rounded-xl bg-gray-100/70 p-3 overflow-hidden">

    {/* Conteúdo borrado */}
    <p className="text-sm text-gray-600 blur-sm select-none opacity-70">
      This section reveals deeper emotional information, the bond between you two,
      and how this connection will transform your love life.
    </p>

    {/* Overlay com cadeado */}
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className="bg-white/70 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
        <span className="text-gray-700 text-sm">🔒</span>
        <span className="text-gray-700 text-sm font-semibold">Locked</span>
      </div>
    </div>

  </div>
</div>
</div>
         {/* Headline afastada do card de cima */}
<h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-10 mb-5 text-center">
  How will your drawing be made available?
</h3>
{/* Mini-card da Master Aura */}
<div className="w-full max-w-md mx-auto flex items-center gap-4 bg-purple-50 border border-purple-200 rounded-2xl p-4 mt-2 mb-8 shadow-sm">
  {/* Foto */}
  <img
    src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
    alt="Master Aura"
    className="w-14 h-14 rounded-full object-cover border border-purple-300"
  />

  {/* Texto */}
  <div className="text-left">
    <p className="text-sm font-semibold text-gray-900">
      Master Aura — Auraly top psychic
    </p>
    <p className="text-xs text-gray-700 leading-snug">
      I’ve delivered over <strong>12,000 soulmate readings</strong>. Your full
      details and sketch will be revealed inside the
      <span className="font-semibold text-purple-700"> Auraly App</span>.
    </p>
  </div>
</div>

          {/* PITCH DE PREÇO */}
          <Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
            <CardContent className="p-6 space-y-4">
              {/* Imagem pequena acima do título */}
              <div className="w-full flex justify-center mb-3">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/zlmLXK5905984.png"
                  alt="Auraly App Preview"
                  className="w-[35%] max-w-[120px] mx-auto rounded-xl"
                />
              </div>

              {/* Título centralizado */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
                Discover the face of your soulmate with the Auraly App.
              </h3>

              {/* Imagem menor e centralizada */}
              <div className="w-full flex justify-center mb-2">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png"
                  alt="Soulmate Offer Highlight"
                  className="w-[55%] max-w-xs mx-auto rounded-xl"
                />
              </div>

              {/* Bullets */}
              <ul className="space-y-2 text-sm md:text-base text-gray-800">
                <li>
                  ✍️ <strong>Ultra-realistic</strong> hand-drawn sketch of your
                  soulmate, made by Master Aura.
                </li>
                <li>
                  💫 <strong>Uncover exclusive personality traits</strong> only
                  your soulmate has.
                </li>
                <li>
                  🗓️ <strong>Date and context</strong> most favorable for the
                  meeting.
                </li>
                <li>
                  🔮 <strong>Receive deep, personalized insights</strong> into
                  your love life.
                </li>
              </ul>

              {/* Bônus */}
              <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Synchronicity Calendar (From
                  $19, free)
                </p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Emotional Healing Guide (From
                  $9, free)
                </p>
              </div>

              {/* Texto antes do preço */}
              <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800 text-center">
                <p>
                  All this for a <strong>symbolic price</strong> to finally
                  discover who your true love is.
                </p>
              </div>

              {/* CARD DE PREÇO */}
              <div className="max-w-md mx-auto mt-2 price-card-anchor">
                <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
                  {/* Topo Roxo */}
                  <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
                    Special offer 50% OFF Today
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 space-y-4">
                    {/* Texto principal */}
                    <p className="text-center text-lg font-semibold text-gray-900">
                      The original price is{" "}
                      <span className="text-gray-500 line-through font-normal">
                        $29
                      </span>
                    </p>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2" />

                    {/* Total today */}
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
                        <span>Total today 50% OFF:</span>
                        <span className="text-green-600 text-xl font-extrabold">
                          $19
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

         
Você disse:
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function BirthChartResults({ onContinue, birthDate }) {
  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl font-bold text-center text-purple-600 leading-tight px-4 mb-6"
          >
            The Results Of Your Birth Chart Reading Were Surprising!
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="px-4 max-w-2xl mx-auto mb-6"
          >
            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-6 md:p-8 space-y-5 text-left">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="font-semibold text-lg text-gray-800 leading-relaxed">
                    Your birth chart shows a very fascinating energy.
                  </p>
                </div>

                <p className="text-base text-gray-700 leading-relaxed pl-13">
                  I was so happy to see that you'll have a love story that transcends the ordinary.
                </p>

                <p className="text-base text-gray-700 leading-relaxed pl-13">
                  Your Soulmate is someone of illuminating beauty, with a magnetic presence that attracts and an unwavering protective instinct.
                </p>

                <p className="text-base text-gray-700 leading-relaxed pl-13">
                  I feel that he will bring not only passion, but a deep sense of security, opening paths to prosperity that you will build together.
                </p>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-600 p-4 rounded-r-lg mt-6">
                  <p className="font-semibold text-base text-purple-700 leading-relaxed">
                    There is a secret, an even greater revelation, waiting for you. I am almost finished with the complete reading, so let's continue.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Button
            onClick={onContinue}
            className="w-full max-w-sm md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl"
          >
            Continue
          </Button>
      </motion.div>
    </div>
  );
} nesse HTML adicione essa imagem em src: https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/GyxQIW2116735.png?quality=88#714997 abaixo de  Your birth chart shows a very fascinating energy.
O ChatGPT disse:
Aqui está o mesmo componente, com a imagem adicionada exatamente abaixo da frase:

“Your birth chart shows a very fascinating energy.”

Mantive tudo no mesmo padrão de design, centralizado e responsivo, e coloquei a imagem com bordas arredondadas para combinar com o layout.

✅ Código atualizado
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function BirthChartResults({ onContinue, birthDate }) {
  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl font-bold text-center text-purple-600 leading-tight px-4 mb-6"
        >
          The Results Of Your Birth Chart Reading Were Surprising!
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="px-4 max-w-2xl mx-auto mb-6"
        >
          <Card className="bg-white shadow-xl border-0">
            <CardContent className="p-6 md:p-8 space-y-5 text-left">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <p className="font-semibold text-lg text-gray-800 leading-relaxed">
                  Your birth chart shows a very fascinating energy.
                </p>
              </div>

              {/* 🔮 Imagem adicionada aqui */}
              <div className="w-full flex justify-center mt-2">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/GyxQIW2116735.png?quality=88#714997"
                  alt="Birth Chart Illustration"
                  className="rounded-lg w-full max-w-md shadow-md"
                />
              </div>

              <p className="text-base text-gray-700 leading-relaxed pl-13">
                I was so happy to see that you'll have a love story that transcends the ordinary.
              </p>

              <p className="text-base text-gray-700 leading-relaxed pl-13">
                Your Soulmate is someone of illuminating beauty, with a magnetic presence that attracts and an unwavering protective instinct.
              </p>

              <p className="text-base text-gray-700 leading-relaxed pl-13">
                I feel that he will bring not only passion, but a deep sense of security, opening paths to prosperity that you will build together.
              </p>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-600 p-4 rounded-r-lg mt-6">
                <p className="font-semibold text-base text-purple-700 leading-relaxed">
                  There is a secret, an even greater revelation, waiting for you. I am almost finished with the complete reading, so let's continue.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Button
          onClick={onContinue}
          className="w-full max-w-sm md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
}
Se quiser, posso:

✔ ajustar tamanho, bordas ou sombra da imagem
✔ colocar animação na imagem
✔ colocar a imagem antes do texto inteiro
✔ deixar mais místico ou mais minimalista

Quer que eu ajuste mais alguma coisa?

Você disse:
inda nesse html, coloque algumas palvras importantes em negrito em:   <p className="text-base text-gray-700 leading-relaxed pl-13">
                I was so happy to see that you'll have a love story that transcends the ordinary.
              </p>

              <p className="text-base text-gray-700 leading-relaxed pl-13">
                Your Soulmate is someone of illuminating beauty, with a magnetic presence that attracts and an unwavering protective instinct.
              </p>

              <p className="text-base text-gray-700 leading-relaxed pl-13">
                I feel that he will bring not only passion, but a deep sense of security, opening paths to prosperity that you will build together.
              </p>
O ChatGPT disse:
Aqui está a versão com as palavras destacadas em negrito, sem quebrar o design e mantendo o texto emocional e forte:

✅ Trechos atualizados com <strong>
Use exatamente este bloco para substituir no seu componente:

<p className="text-base text-gray-700 leading-relaxed pl-13">
  I was so happy to see that you'll have a <strong>love story</strong> that 
  <strong> transcends the ordinary</strong>.
</p>

<p className="text-base text-gray-700 leading-relaxed pl-13">
  Your <strong>Soulmate</strong> is someone of <strong>illuminating beauty</strong>, 
  with a <strong>magnetic presence</strong> that attracts and an 
  <strong> unwavering protective instinct</strong>.
</p>

<p className="text-base text-gray-700 leading-relaxed pl-13">
  I feel that he will bring not only <strong>passion</strong>, but a deep sense of 
  <strong>security</strong>, opening paths to <strong>prosperity</strong> that you will build together.
</p>
Se quiser, posso deixar ainda mais emocional, mais místico ou ajustar o ritmo de leitura. Quer que eu refine mais?

Você disse:
import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function SocialProof({ onContinue }) {
  const handleContinue = () => {
    if (typeof window !== 'undefined' && window.uetq) {
      window.uetq.push('event', 'endquiz', {});
    }
    onContinue();
  };

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg"
    },
     {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg"
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar: "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto px-4 py-8"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.2 }}
              className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{testimonial.name}</h3>
                    <p className="text-gray-400 text-sm">{testimonial.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-gray-800 text-xl">{testimonial.title}</h4>
                <p className="text-gray-600 text-base leading-relaxed">
                  {testimonial.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white text-lg font-bold py-4 px-8 rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Go To Full Revelation
        </motion.button>
      </div>
    </motion.div>
  );
} nesse html coloque os depoimentos em slide alternando automaticamente a cada 4 segundos. coloque setas de passagem esqeurda e direita
O ChatGPT disse:
Aqui está o componente ajustado com slider automático a cada 4s e setas esquerda/direita:

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SocialProof({ onContinue }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleContinue = () => {
    if (typeof window !== "undefined" && window.uetq) {
      window.uetq.push("event", "endquiz", {});
    }
    onContinue();
  };

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar: "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg",
    },
  ];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  // Auto slide every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const current = testimonials[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto px-4 py-8"
    >
      <div className="space-y-6">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {current.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{current.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">
                      ⭐
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-gray-800 text-xl">
                  {current.title}
                </h4>
                <p className="text-gray-600 text-base leading-relaxed">
                  {current.text}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
          <button
            type="button"
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white/90 border border-gray-200 rounded-full p-2 shadow-md hover:bg-gray-50 transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <button
            type="button"
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white/90 border border-gray-200 rounded-full p-2 shadow-md hover:bg-gray-50 transition"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white text-lg font-bold py-4 px-8 rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Go To Full Revelation
        </motion.button>
      </div>
    </motion.div>
  );
}
Se quiser, dá pra colocar bullets de quantos depoimentos (tipo 1/3, 2/3, 3/3) ou pequenos dots embaixo do card pra reforçar prova social. Quer que eu aprofunde mais?

Você disse:
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import TypingIndicator from './TypingIndicator';
import { useTracking } from '@/hooks/useTracking';

export default function LoadingRevelation({ onContinue, userName, birthDate, quizResultId }) {
  const { trackEndQuiz, trackFacebookEvent } = useTracking();
  const [userCity, setUserCity] = useState("your city");
  const [showFirstTyping, setShowFirstTyping] = useState(true);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showSecondTyping, setShowSecondTyping] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  const imageUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/b6f3d66de_image.png";

  const handleContinue = () => {
    // Rastrear fim do quiz
    trackEndQuiz();
    
    // Continuar com a lógica original
    onContinue();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const TextOverlay = () =>
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
      }}>
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
        }}>
          <div style={{ marginBottom: '2px' }}>
            {userName || ''}
          </div>
          <div>
            {formatDate(birthDate) || '...'}
          </div>
        </div>
      </div>
    </div>;

  useEffect(() => {
    const timers = [];

    // First typing (1s) then first message
    timers.push(setTimeout(() => {
      setShowFirstTyping(false);
      setShowFirstMessage(true);
    }, 1000));

    // Show image immediately after first message
    timers.push(setTimeout(() => {
      setShowImage(true);
    }, 1500));

    // Start second typing after image appears
    timers.push(setTimeout(() => {
      setShowSecondTyping(true);
    }, 2000));

    // Second typing (1s) then final message
    timers.push(setTimeout(() => {
      setShowSecondTyping(false);
      setShowFinalMessage(true);
    }, 3000));

    // Show button after final message
    timers.push(setTimeout(() => {
      setShowNextButton(true);
    }, 3500));

    return () => timers.forEach(clearTimeout);
  }, []);

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
        {showFirstMessage &&
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full">

            <div className="flex items-start gap-3">
              <img
              src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
              alt="Master Aura"
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />

              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">Based on your birth chart, I am preparing a portrait of your soulmate. I'm starting right now👇🔮
              </p>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Image */}
      <AnimatePresence>
        {showImage &&
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-2 shadow-sm border border-gray-200 mb-4 relative w-full">

            <img
            src={imageUrl}
            alt="Preparing your revelation"
            className="w-full rounded-lg"
            style={{
              loading: 'lazy',
              decoding: 'async',
              imageRendering: 'crisp-edges',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }} />

            <TextOverlay />
          </motion.div>
        }
      </AnimatePresence>

      {/* Second typing indicator */}
      <AnimatePresence>
        {showSecondTyping && <TypingIndicator />}
      </AnimatePresence>

      {/* Final message */}
      <AnimatePresence>
        {showFinalMessage &&
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full">

            <div className="flex items-start gap-3">
              <img
              src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
              alt="Master Aura"
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />

              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  {userName ? <><span className="font-bold">{userName}</span>, something special is unfolding...</> : "Something special is unfolding..."}
                  <br /><br />
                  Based on the reading of your destiny and your birth date, I've started to draw the face of your soulmate. Everything points to a meeting in <span className="font-bold">{userCity}</span> — or somewhere very close.
                  <br /><br />
                  This person has a beautiful energy and is closer than you think… patiently waiting for you. ✨
                </p>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Continue button */}
      {showNextButton &&
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8">

          <button
          onClick={handleContinue}
          className="btn-primary w-full max-w-sm md:w-auto">
            Discover the face of my soulmate
          </button>
        </motion.div>
      }
    </div>);
} nesse html, no lugar da imagem atual, apenas subtitua por essa imagem src: https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/tXMSzr3464284.png
O ChatGPT disse:
Aqui está a substituição limpa e direta, sem alterar nenhuma lógica do componente.

Apenas troque a linha do img da seção de imagem por esta nova versão com o novo src:

🔄 Substituição do bloco da imagem
Encontre este trecho no seu código:

<img
  src={imageUrl}
  alt="Preparing your revelation"
  className="w-full rounded-lg"
  style={{
    loading: 'lazy',
    decoding: 'async',
    imageRendering: 'crisp-edges',
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)'
  }}
/>
E substitua por este aqui:

<img
  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/tXMSzr3464284.png"
  alt="Preparing your revelation"
  className="w-full rounded-lg"
  style={{
    loading: 'lazy',
    decoding: 'async',
    imageRendering: 'crisp-edges',
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)'
  }}
/>
⚠️ Nada mais precisa mudar
O componente continua funcionando idêntico, com overlay, animações e timing intactos — apenas a imagem foi trocada.

Se quiser, posso:

• ajustar tamanho, borda, brilho ou cor da imagem
• colocar uma leve animação (fade-in, zoom, glow, aura mística)
• ajustar o overlay para encaixar perfeito na nova imagem

Quer algum refinamento?

Você disse:
nesse html verifique o que tem de errado: import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import TypingIndicator from './TypingIndicator';
import { useTracking } from '@/hooks/useTracking';

export default function LoadingRevelation({ onContinue, userName, birthDate, quizResultId }) {
  const { trackEndQuiz, trackFacebookEvent } = useTracking();
  const [userCity, setUserCity] = useState("your city");
  const [showFirstTyping, setShowFirstTyping] = useState(true);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showSecondTyping, setShowSecondTyping] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  const imageUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/b6f3d66de_image.png";

  const handleContinue = () => {
    // Rastrear fim do quiz
    trackEndQuiz();
    
    // Continuar com a lógica original
    onContinue();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const TextOverlay = () =>
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
      }}>
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
        }}>
          <div style={{ marginBottom: '2px' }}>
            {userName || ''}
          </div>
          <div>
            {formatDate(birthDate) || '...'}
          </div>
        </div>
      </div>
    </div>;

  useEffect(() => {
    const timers = [];

    // First typing (1s) then first message
    timers.push(setTimeout(() => {
      setShowFirstTyping(false);
      setShowFirstMessage(true);
    }, 1000));

    // Show image immediately after first message
    timers.push(setTimeout(() => {
      setShowImage(true);
    }, 1500));

    // Start second typing after image appears
    timers.push(setTimeout(() => {
      setShowSecondTyping(true);
    }, 2000));

    // Second typing (1s) then final message
    timers.push(setTimeout(() => {
      setShowSecondTyping(false);
      setShowFinalMessage(true);
    }, 3000));

    // Show button after final message
    timers.push(setTimeout(() => {
      setShowNextButton(true);
    }, 3500));

    return () => timers.forEach(clearTimeout);
  }, []);

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
        {showFirstMessage &&
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full">

            <div className="flex items-start gap-3">
              <img
              src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
              alt="Master Aura"
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />

              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">Based on your birth chart, I am preparing a portrait of your soulmate. I'm starting right now👇🔮
              </p>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Image */}
      <AnimatePresence>
        {showImage &&
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-2 shadow-sm border border-gray-200 mb-4 relative w-full">

          <img
  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/tXMSzr3464284.png?quality=83#875227"
  alt="Preparing your revelation"
  className="w-full rounded-lg"
  style={{
    loading: 'lazy',
    decoding: 'async',
    imageRendering: 'crisp-edges',
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)'
  }}
/>
      {/* Continue button */}
      {showNextButton &&
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8">

          <button
          onClick={handleContinue}
          className="btn-primary w-full max-w-sm md:w-auto">
            Discover the face of my soulmate
          </button>
        </motion.div>
      }
    </div>);
}
O ChatGPT disse:

Pensou por 11s
O problema principal aí não é de lógica, é de JSX quebrado:

Você abriu <motion.div> dentro do bloco da imagem e não fechou
Depois do <img /> não tem </motion.div>.

O <AnimatePresence> da imagem também não foi fechado
Você abre {showImage && <motion.div ...>, mas nunca fecha o <AnimatePresence>.

O bloco da imagem e o bloco do botão estão misturados
O comentário {/* Continue button */} vem antes de fechar o <motion.div> e o <AnimatePresence>, então o botão está sendo renderizado “dentro” da imagem, o que quebra a sintaxe.

imageUrl ficou sem uso (não quebra o código, mas gera warning).

Vou te mandar o componente corrigido, com a imagem nova, tudo fechado certinho:

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TypingIndicator from "./TypingIndicator";
import { useTracking } from "@/hooks/useTracking";

export default function LoadingRevelation({
  onContinue,
  userName,
  birthDate,
  quizResultId,
}) {
  const { trackEndQuiz } = useTracking();
  const [userCity, setUserCity] = useState("your city");
  const [showFirstTyping, setShowFirstTyping] = useState(true);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showSecondTyping, setShowSecondTyping] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  const handleContinue = () => {
    trackEndQuiz();
    onContinue();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const TextOverlay = () => (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div
        className="absolute"
        style={{
          top: "22%",
          right: "13%",
          width: "18%",
          height: "18%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontFamily: "Dancing Script, cursive",
            fontWeight: "600",
            fontSize: "clamp(7px, 2.2vw, 11px)",
            lineHeight: "1.3",
            textAlign: "center",
            color: "#4a4a4a",
            textShadow: "0.5px 0.5px 1px rgba(0,0,0,0.1)",
            filter: "sepia(10%) contrast(1.1)",
            transform: "rotate(-1deg)",
          }}
        >
          <div style={{ marginBottom: "2px" }}>{userName || ""}</div>
          <div>{formatDate(birthDate) || "..."}</div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const timers = [];

    timers.push(
      setTimeout(() => {
        setShowFirstTyping(false);
        setShowFirstMessage(true);
      }, 1000)
    );

    timers.push(
      setTimeout(() => {
        setShowImage(true);
      }, 1500)
    );

    timers.push(
      setTimeout(() => {
        setShowSecondTyping(true);
      }, 2000)
    );

    timers.push(
      setTimeout(() => {
        setShowSecondTyping(false);
        setShowFinalMessage(true);
      }, 3000)
    );

    timers.push(
      setTimeout(() => {
        setShowNextButton(true);
      }, 3500)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="py-8 w-full max-w-lg mx-auto flex flex-col items-center gap-4">
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

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
            className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full"
          >
            <div className="flex items-start gap-3">
              <img
                src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
                alt="Master Aura"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
              />
              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  Based on your birth chart, I am preparing a portrait of your
                  soulmate. I'm starting right now👇🔮
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image */}
      <AnimatePresence>
        {showImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-2 shadow-sm border border-gray-200 mb-4 relative w-full"
          >
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/tXMSzr3464284.png?quality=83#875227"
              alt="Preparing your revelation"
              className="w-full rounded-lg"
              style={{
                loading: "lazy",
                decoding: "async",
                imageRendering: "crisp-edges",
                backfaceVisibility: "hidden",
                transform: "translateZ(0)",
              }}
            />
            <TextOverlay />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Second typing indicator */}
      <AnimatePresence>
        {showSecondTyping && <TypingIndicator />}
      </AnimatePresence>

      {/* Final message */}
      <AnimatePresence>
        {showFinalMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full"
          >
            <div className="flex items-start gap-3">
              <img
                src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
                alt="Master Aura"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
              />
              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  {userName ? (
                    <>
                      <span className="font-bold">{userName}</span>, something
                      special is unfolding...
                    </>
                  ) : (
                    "Something special is unfolding..."
                  )}
                  <br />
                  <br />
                  Based on the reading of your destiny and your birth date, I've
                  started to draw the face of your soulmate. Everything points
                  to a meeting in{" "}
                  <span className="font-bold">{userCity}</span> — or somewhere
                  very close.
                  <br />
                  <br />
                  This person has a beautiful energy and is closer than you
                  think… patiently waiting for you. ✨
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue button */}
      {showNextButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <button
            onClick={handleContinue}
            className="btn-primary w-full max-w-sm md:w-auto"
          >
            Discover the face of my soulmate
          </button>
        </motion.div>
      )}
    </div>
  );
}
Se quiser, posso limpar ainda mais (remover imports não usados, extrair timings pra const, etc.). Quer que eu aprofunde mais?

Você disse:
eu nao quero mais essa segunda mensagem debaixo. abaixo da imagem ja coloque o botao
O ChatGPT disse:
Fechado. Vou remover completamente a segunda parte (typing 2 + mensagem final), manter só:

Typing 1

Mensagem 1

Imagem

Botão

E otimizar removendo os estados e timers que ficaram inúteis.

Aqui está o código limpo e funcionando:

✅ Versão ajustada (sem segunda mensagem)
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TypingIndicator from "./TypingIndicator";
import { useTracking } from "@/hooks/useTracking";

export default function LoadingRevelation({
  onContinue,
  userName,
  birthDate,
}) {
  const { trackEndQuiz } = useTracking();

  const [showFirstTyping, setShowFirstTyping] = useState(true);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  const handleContinue = () => {
    trackEndQuiz();
    onContinue();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const TextOverlay = () => (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div
        className="absolute"
        style={{
          top: "22%",
          right: "13%",
          width: "18%",
          height: "18%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontFamily: "Dancing Script, cursive",
            fontWeight: "600",
            fontSize: "clamp(7px, 2.2vw, 11px)",
            lineHeight: "1.3",
            textAlign: "center",
            color: "#4a4a4a",
            textShadow: "0.5px 0.5px 1px rgba(0,0,0,0.1)",
            filter: "sepia(10%) contrast(1.1)",
            transform: "rotate(-1deg)",
          }}
        >
          <div style={{ marginBottom: "2px" }}>{userName || ""}</div>
          <div>{formatDate(birthDate) || "..."}</div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const t1 = setTimeout(() => {
      setShowFirstTyping(false);
      setShowFirstMessage(true);
    }, 1000);

    const t2 = setTimeout(() => {
      setShowImage(true);
    }, 1500);

    const t3 = setTimeout(() => {
      setShowNextButton(true);
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="py-8 w-full max-w-lg mx-auto flex flex-col items-center gap-4">
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Typing 1 */}
      <AnimatePresence>
        {showFirstTyping && <TypingIndicator />}
      </AnimatePresence>

      {/* Mensagem 1 */}
      <AnimatePresence>
        {showFirstMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full"
          >
            <div className="flex items-start gap-3">
              <img
                src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
                alt="Master Aura"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
              />
              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  Based on your birth chart, I am preparing a portrait of your
                  soulmate. I'm starting right now👇🔮
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Imagem */}
      <AnimatePresence>
        {showImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-2 shadow-sm border border-gray-200 mb-4 relative w-full"
          >
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/tXMSzr3464284.png?quality=83#875227"
              alt="Preparing your revelation"
              className="w-full rounded-lg"
              style={{
                loading: "lazy",
                decoding: "async",
                imageRendering: "crisp-edges",
                backfaceVisibility: "hidden",
                transform: "translateZ(0)",
              }}
            />
            <TextOverlay />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão */}
      {showNextButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4"
        >
          <button
            onClick={handleContinue}
            className="btn-primary w-full max-w-sm md:w-auto"
          >
            Discover the face of my soulmate
          </button>
        </motion.div>
      )}
    </div>
  );
}
🎯 Resultado final
✔ Remove toda a segunda mensagem.
✔ Remove segundo typing.
✔ Após a imagem, aparece direto o botão.
✔ Timings ajustados para fluxo mais rápido e limpo.

Se quiser, posso deixar a imagem com animação glow, colocar efeito místico, ou mudar a copy inicial. Quer que eu ajuste algo?

Você disse:
nesse html, esta puxando algum elemento de data acima da imagem, ne isso? retire-o
O ChatGPT disse:
Sim — o elemento que aparece por cima da imagem é exatamente o TextOverlay(), que imprime:

userName

birthDate formatada

E ele está sendo renderizado dentro do bloco da imagem:

<TextOverlay />
Se você não quer mais nada sobreposto na imagem, basta remover totalmente o TextOverlay().

Aqui está o trecho corrigido, sem overlay:

✅ Substituição do bloco da imagem (limpo)
{/* Imagem */}
<AnimatePresence>
  {showImage && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-2 shadow-sm border border-gray-200 mb-4 relative w-full"
    >
      <img
        src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/tXMSzr3464284.png?quality=83#875227"
        alt="Preparing your revelation"
        className="w-full rounded-lg"
        style={{
          loading: "lazy",
          decoding: "async",
          imageRendering: "crisp-edges",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
        }}
      />
    </motion.div>
  )}
</AnimatePresence>
❌ O que foi removido
Todo o componente TextOverlay

A chamada <TextOverlay />

Isso elimina qualquer nome/data sobre a imagem.

Se quiser, posso também:

✔ aumentar a sombra
✔ adicionar efeito de luz mística
✔ colocar animação suave na imagem
✔ melhorar o timing das transições

Quer que eu ajuste algo mais?

Você disse:
mande completo, alem disso, aproxime o botao de discover mais para perto da imagem e coloque um pouco maior
O ChatGPT disse:
Aqui está o componente completo, já com:

✔ TextOverlay totalmente removido (não aparece nome/data em cima da imagem)
✔ Botão mais próximo da imagem (reduzi o margin-top)
✔ Botão maior (padding + fonte maiores)
✔ Código limpo, sem estados inúteis

Tudo pronto pra copiar e colar.

✅ Componente FINAL Atualizado
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TypingIndicator from "./TypingIndicator";
import { useTracking } from "@/hooks/useTracking";

export default function LoadingRevelation({
  onContinue,
  userName,
  birthDate
}) {
  const { trackEndQuiz } = useTracking();

  const [showFirstTyping, setShowFirstTyping] = useState(true);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  const handleContinue = () => {
    trackEndQuiz();
    onContinue();
  };

  useEffect(() => {
    const t1 = setTimeout(() => {
      setShowFirstTyping(false);
      setShowFirstMessage(true);
    }, 1000);

    const t2 = setTimeout(() => {
      setShowImage(true);
    }, 1500);

    const t3 = setTimeout(() => {
      setShowNextButton(true);
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="py-8 w-full max-w-lg mx-auto flex flex-col items-center gap-4">
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Typing 1 */}
      <AnimatePresence>
        {showFirstTyping && <TypingIndicator />}
      </AnimatePresence>

      {/* Primeiro texto */}
      <AnimatePresence>
        {showFirstMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full"
          >
            <div className="flex items-start gap-3">
              <img
                src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
                alt="Master Aura"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
              />
              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  Based on your birth chart, I am preparing a portrait of your
                  soulmate. I'm starting right now👇🔮
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Imagem */}
      <AnimatePresence>
        {showImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-2 shadow-sm border border-gray-200 w-full"
          >
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/tXMSzr3464284.png?quality=83#875227"
              alt="Preparing your revelation"
              className="w-full rounded-lg"
              style={{
                loading: "lazy",
                decoding: "async",
                imageRendering: "crisp-edges",
                backfaceVisibility: "hidden",
                transform: "translateZ(0)"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão próximo da imagem e maior */}
      {showNextButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-2 w-full flex justify-center"
        >
          <button
            onClick={handleContinue}
            className="btn-primary w-full max-w-sm md:w-auto text-lg md:text-xl font-bold py-4 px-10 rounded-full"
          >
            Discover the face of my soulmate
          </button>
        </motion.div>
      )}
    </div>
  );
}
🔍 Alterações feitas
❌ Removido TextOverlay (não aparece nome/data sobre a imagem)

❌ Removido todo código relacionado à segunda mensagem

✔ Botão agora fica coladinho à imagem (mt-2)

✔ Botão agora é maior (text-xl + py-4 + px-10)

✔ Código mais leve e limpo

Se quiser, posso:

⭐ transformar a imagem em um leve "fade-in + glow"
⭐ adicionar um mini texto abaixo da imagem tipo “Preparing your soulmate…”
⭐ mudar a copy para ficar mais emocional

Quer algum ajuste?

Você disse:
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar } from 'lucide-react';
import { HybridQuizResult } from '@/entities/HybridQuizResult';
import { useTracking } from '@/hooks/useTracking';
import SalesSection from '../funnel-1/SalesSection';

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click"
};

export default function PaywallStep({ userName, birthDate, quizResultId, src }) {
  const [showSales, setShowSales] = useState(true);
  const { trackEndQuiz } = useTracking();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (quizResultId && quizResultId !== 'offline-mode' && quizResultId !== 'admin-mode' && quizResultId !== 'bot-mode') {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(e =>
        console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    trackEndQuiz();

    const trackCheckout = async () => {
      if (quizResultId && quizResultId !== 'offline-mode' && quizResultId !== 'admin-mode' && quizResultId !== 'bot-mode') {
        try {
          await HybridQuizResult.update(quizResultId, { checkout_step_clicked: true });
          console.log('Checkout click tracked successfully');
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout().then(() => {
      try {
        const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
        const url = new URL(checkoutUrl);

        let allUtms = {};

        if (typeof window !== 'undefined' && window.utmify) {
          try {
            allUtms = window.utmify.getUtms() || {};
            console.log('UTMs from UTMIFY:', allUtms);
          } catch (error) {
            console.warn('Failed to get UTMs from UTMIFY:', error);
          }
        }

        if (Object.keys(allUtms).length === 0) {
          const currentUrl = new URL(window.location.href);
          const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

          utmParams.forEach(param => {
            const value = currentUrl.searchParams.get(param);
            if (value) {
              allUtms[param] = value;
            }
          });

          const otherParams = ['fbclid', 'gclid', 'ttclid', 'src', 'xcod'];
          otherParams.forEach(param => {
            const value = currentUrl.searchParams.get(param);
            if (value) {
              allUtms[param] = value;
            }
          });
        }

        Object.keys(allUtms).forEach((key) => {
          if (allUtms[key]) {
            url.searchParams.set(key, allUtms[key]);
          }
        });

        if (quizResultId && quizResultId !== 'offline-mode' && quizResultId !== 'admin-mode' && quizResultId !== 'bot-mode') {
          url.searchParams.set('quiz_result_id', quizResultId);
        }

        console.log('Redirecting to checkout:', url.toString());
        localStorage.removeItem('holymind_quiz_state');
        localStorage.setItem('holymind_last_quiz_id', quizResultId);
        window.location.href = url.toString();
      } catch (error) {
        console.error("Erro ao construir URL de checkout:", error);
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      }
    }).catch((error) => {
      console.error("Erro ao rastrear checkout, mas redirecionando mesmo assim:", error);
      window.location.href = CHECKOUT_CONFIG.baseUrl;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Não informado";
    const [year, month, day] = dateString.split('-');
    if (day && month) {
        return ${day}/${month};
    }
    return dateString;
  };

  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8">

        <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 px-4">
          Your Birth Chart Reading Is Ready!
        </h2>

        <Card className="w-fit mx-auto bg-white/50 border-purple-100 shadow-md mb-6">
            <CardContent className="p-3 flex items-center justify-center gap-4 md:gap-6">
                <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-2 rounded-full">
                        <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="text-sm font-semibold text-gray-800">{userName || ''}</p>
                    </div>
                </div>
                <div className="h-8 w-px bg-purple-200"></div>
                <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-2 rounded-full">
                        <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-gray-500">Date of Birth</p>
                        <p className="text-sm font-semibold text-gray-800">{formatDate(birthDate)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <h1 className="text-purple-600 mb-6 text-xl font-semibold md:text-2xl leading-tight px-4">
          HERE'S YOUR SOULMATE'S DRAWING
        </h1>

        <div className="mb-6">
          <img
            src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759873292152-ltl34v44ham.png"
            alt="Your True Love Preview"
            className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
          />
        </div>
<h3 className="text-lg md:text-xl font-semibold text-purple-600 mb-4 px-4 uppercase tracking-wide">
          See Who Your True Love Is👇🏼
        </h3>
        <Card className="max-w-md mx-auto bg-white/80 border-purple-100 shadow-md mb-6">
          <CardContent className="p-6 text-center space-y-3">
            <p className="text-sm md:text-base text-gray-700 flex items-center justify-center gap-2">
              <span className="text-green-600">✔</span>
              <span><strong>Name:</strong> ******</span>
            </p>
            <p className="text-sm md:text-base text-gray-700 flex items-center justify-center gap-2">
              <span className="text-green-600">✔</span>
              <span><strong>Date of meeting:</strong> **/**/2025</span>
            </p>
            <p className="text-sm md:text-base text-gray-700 flex items-center justify-center gap-2">
              <span className="text-green-600">✔</span>
              <span><strong>Your Soulmate's Vibe:</strong> Warm and caring</span>
            </p>
            <p className="text-sm md:text-base text-gray-700 flex items-center justify-center gap-2">
              <span className="text-green-600">✔</span>
              <span><strong>Special Trait:</strong> very self-confident</span>
            </p>
            <p className="text-sm md:text-base text-gray-600 mt-4 leading-relaxed">
              Your soulmate's drawing is already done and will be sent directly to your email as soon as you confirm your access on the button below.
            </p>
            <div className="mt-4 space-y-1">
              <p className="text-sm md:text-base text-gray-600">
                from <span className="line-through text-red-600 font-semibold">$29</span>
              </p>
              <p className="text-lg md:text-xl text-green-600 font-bold">
                for only $19
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3 mb-6 px-4">
          <p className="text-gray-700 text-sm font-bold">Click Below To Secure Your Drawing👇🏻</p>
          <button
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-12 rounded-full text-lg shadow-2xl transform transition-all duration-300 hover:scale-105 leading-tight"
            style={{ minHeight: '70px' }}
          >
            <span className="block text-center leading-tight">YES! Claim My Divine<br/>Soul Drawing</span>
          </button>
        </div>

        <Card className="max-w-md mx-auto bg-purple-50/80 border-purple-200 shadow-md mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3 mb-3">
                <img src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png" alt="Master Aura" className="w-12 h-12 rounded-full object-cover border-2 border-purple-200" />
                <p className="font-semibold text-gray-800 text-lg">Master Aura</p>
              </div>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed text-left">
         When you join, you'll receive exclusive access to my app — <strong>the Auraly App</strong> 💫, where you'll get to see the <strong>drawing of your soulmate</strong> 🎨💖
              </p>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed text-left mt-3">
Plus, every month you'll <strong>receive intuitive and insightful readings</strong> 🔮, offering powerful guidance about your love life and showing you how to <strong>connect energetically with your soulmate</strong> 💌💞
              </p>
            </div>
          </CardContent>
        </Card>

        {showSales && (
          <SalesSection
            userName={userName}
            birthDate={birthDate}
            quizResultId={quizResultId}
            src={src}
            onCheckout={handleCheckout}
          />
        )}
      </motion.div>
    </div>
  );
} vamos refazer esse paywall. abaixo irei lhe mandar as instrucoes, ok?
O ChatGPT disse:
Fechado, manda as instruções que eu refaço esse paywall do zero em cima delas. 💻✨

Você disse:
Imagem carregada
Imagem carregada
coloque o background de todo paywall na cor branca. adicione um pitch de preço exatamente igual essa imagem anexada, com: Descubra o Rosto da sua alma gemea com o Auraly App, as bullets e presente sao: ✍️Ultra-realistic hand-drawn sketch of your soul mate made by a renowned astrologer 
💫Uncover exclusive personality traits only your soulmate has
​​🗓️Date and context most favorable for the meeting
🔮 Receive deep, personalized insights decoded through your unique birth chart and spiritual profile
💕 Feel the emotional connection before even meeting — you’ll know why he’s "the one"
dentro da caixa de presente na cor lilas igual da imagem: 🎁2 Free Bonuses: Synchronicity Calendar (From $19, for free) + Emotional Healing Guide (From $19, for free) 
💎 Updates and new reports every day.
All this for just $19 today — a symbolic price to finally discover who your true love is.
50% OFF – Ends Today!
Unlock your soulmate sketch for only $19 (normally $39). alem disso adicione como ultima sessao um faq igual o da imagem anexada, com faq expandivel.Does it really work? We base predictions on the data you provide and recognized compatibility patterns. It’s not guesswork; it’s personalized analysis.


I’m skeptical. Is this safe? Your data are encrypted and used only to create your report. You risk nothing with our guarantee.


What if I’m already in a relationship? The report shows compatibility with your current partner and clarifies your future.


Is the portrait real? It’s a representation generated from the most likely characteristics. Users report striking similarities.


Can I cancel? Yes. The report is a one‑time purchase; the monthly subscription can be canceled at any time.. 
O ChatGPT disse:

Pensou por 29s
Segue o componente refeito com:

Background total branco

Seção de preço no estilo do Hint, com:

título: Descubra o Rosto da sua alma gemea com o Auraly App

bullets exatamente como você mandou

caixa de presente lilás com texto de bônus

copy completa de preço e desconto

Botão de checkout reaproveitando handleCheckout

FAQ expansível no final, igual o modelo da imagem, com as perguntas/respostas que você passou

Mantive o card com Nome/Data e a imagem do desenho, pois faz sentido com a promessa

Você pode substituir o componente antigo por este:

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { User, Calendar, ChevronRight } from "lucide-react";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";
import SalesSection from "../funnel-1/SalesSection";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

export default function PaywallStep({ userName, birthDate, quizResultId, src }) {
  const [showSales, setShowSales] = useState(true);
  const { trackEndQuiz } = useTracking();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (
      quizResultId &&
      quizResultId !== "offline-mode" &&
      quizResultId !== "admin-mode" &&
      quizResultId !== "bot-mode"
    ) {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(
        (e) => console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    trackEndQuiz();

    const trackCheckout = async () => {
      if (
        quizResultId &&
        quizResultId !== "offline-mode" &&
        quizResultId !== "admin-mode" &&
        quizResultId !== "bot-mode"
      ) {
        try {
          await HybridQuizResult.update(quizResultId, {
            checkout_step_clicked: true,
          });
          console.log("Checkout click tracked successfully");
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout()
      .then(() => {
        try {
          const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
          const url = new URL(checkoutUrl);

          let allUtms = {};

          if (typeof window !== "undefined" && window.utmify) {
            try {
              allUtms = window.utmify.getUtms() || {};
              console.log("UTMs from UTMIFY:", allUtms);
            } catch (error) {
              console.warn("Failed to get UTMs from UTMIFY:", error);
            }
          }

          if (Object.keys(allUtms).length === 0) {
            const currentUrl = new URL(window.location.href);
            const utmParams = [
              "utm_source",
              "utm_medium",
              "utm_campaign",
              "utm_content",
              "utm_term",
            ];

            utmParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });

            const otherParams = ["fbclid", "gclid", "ttclid", "src", "xcod"];
            otherParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });
          }

          Object.keys(allUtms).forEach((key) => {
            if (allUtms[key]) {
              url.searchParams.set(key, allUtms[key]);
            }
          });

          if (
            quizResultId &&
            quizResultId !== "offline-mode" &&
            quizResultId !== "admin-mode" &&
            quizResultId !== "bot-mode"
          ) {
            url.searchParams.set("quiz_result_id", quizResultId);
          }

          console.log("Redirecting to checkout:", url.toString());
          localStorage.removeItem("holymind_quiz_state");
          localStorage.setItem("holymind_last_quiz_id", quizResultId);
          window.location.href = url.toString();
        } catch (error) {
          console.error("Erro ao construir URL de checkout:", error);
          window.location.href = CHECKOUT_CONFIG.baseUrl;
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao rastrear checkout, mas redirecionando mesmo assim:",
          error
        );
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Não informado";
    const [year, month, day] = dateString.split("-");
    if (day && month) {
      return `${day}/${month}`;
    }
    return dateString;
  };

  const faqs = [
    {
      question: "Does it really work?",
      answer:
        "We base predictions on the data you provide and recognized compatibility patterns. It’s not guesswork; it’s personalized analysis.",
    },
    {
      question: "I’m skeptical. Is this safe?",
      answer:
        "Your data are encrypted and used only to create your report. You risk nothing with our guarantee.",
    },
    {
      question: "What if I’m already in a relationship?",
      answer:
        "The report shows compatibility with your current partner and clarifies your future.",
    },
    {
      question: "Is the portrait real?",
      answer:
        "It’s a representation generated from the most likely characteristics. Users report striking similarities.",
    },
    {
      question: "Can I cancel?",
      answer:
        "Yes. The report is a one-time purchase; the monthly subscription can be canceled at any time.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center py-8 max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 px-4">
            Your Birth Chart Reading Is Ready!
          </h2>

          {/* Card com nome e data */}
          <Card className="w-fit mx-auto bg-white border-purple-100 shadow-md mb-6">
            <CardContent className="p-3 flex items-center justify-center gap-4 md:gap-6">
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded-full">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {userName || ""}
                  </p>
                </div>
              </div>
              <div className="h-8 w-px bg-purple-200" />
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Date of Birth</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {formatDate(birthDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h1 className="text-purple-600 mb-4 text-xl font-semibold md:text-2xl leading-tight px-4 uppercase tracking-wide">
            HERE&apos;S YOUR SOULMATE&apos;S DRAWING
          </h1>

          {/* Imagem do desenho */}
          <div className="mb-6">
            <img
              src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759873292152-ltl34v44ham.png"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div>

          {/* PITCH DE PREÇO ESTILO HINT */}
          <Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Descubra o Rosto da sua alma gemea com o Auraly App
              </h3>

              <ul className="space-y-2 text-sm md:text-base text-gray-800">
                <li>✍️ Ultra-realistic hand-drawn sketch of your soul mate made by a renowned astrologer</li>
                <li>💫 Uncover exclusive personality traits only your soulmate has</li>
                <li>🗓️ Date and context most favorable for the meeting</li>
                <li>🔮 Receive deep, personalized insights decoded through your unique birth chart and spiritual profile</li>
                <li>💕 Feel the emotional connection before even meeting — you’ll know why he’s &quot;the one&quot;</li>
              </ul>

              {/* Caixa de presente lilás */}
              <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>2 Free Bonuses:</strong> Synchronicity Calendar (From $19, for free) + Emotional Healing Guide (From $19, for free)
                </p>
                <p>💎 Updates and new reports every day.</p>
              </div>

              {/* Preço */}
              <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  All this for just <strong>$19 today</strong> — a symbolic price to finally discover who your true love is.
                </p>
                <p className="text-red-600 font-semibold">50% OFF – Ends Today!</p>
                <p className="text-lg md:text-xl font-bold text-green-600">
                  Unlock your soulmate sketch for only $19{" "}
                  <span className="text-sm md:text-base text-gray-500 line-through align-middle">
                    (normally $39)
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="space-y-3 mb-6 px-4">
            <p className="text-gray-700 text-sm font-bold">
              Click Below To Secure Your Drawing 👇🏻
            </p>
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-12 rounded-full text-lg md:text-xl shadow-2xl transform transition-all duration-300 hover:scale-105 leading-tight"
              style={{ minHeight: "70px" }}
            >
              <span className="block text-center leading-tight">
                YES! Claim My Divine
                <br />
                Soul Drawing
              </span>
            </button>
          </div>

          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-8 text-left">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              FAQ
            </h2>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left py-3 flex items-center justify-between gap-2"
                  >
                    <span className="text-sm md:text-base text-gray-800">
                      {item.question}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                    {isOpen && (
                      <div className="w-full mt-2 col-span-2">
                        <p className="text-sm text-gray-600 mt-1">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seção de vendas extra (mantida) */}
          {showSales && (
            <SalesSection
              userName={userName}
              birthDate={birthDate}
              quizResultId={quizResultId}
              src={src}
              onCheckout={handleCheckout}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
Se quiser, no próximo passo posso:

Ajustar tipografia e espaçamentos pra ficar idêntico ao Hint

Colocar “Total due” / “Total devido” com valor cortado e verde embaixo

Testar uma variação só com trial (7 dias) + mensalidade

Quer que eu refine mais algum detalhe visual ou de copy?

Você disse:
os titulos do faq coloque em negrito e ao clicar para wxpandir o tituloo deve ficar em cima e a descricao abaixo. alem disso, coloque todo, absolutamento todo background em branco. retire o card superior de name/date. alem disso, adicione os depoimentos de social proof que fizemos acima do faq:const testimonials = [ { name: "Rebecca", date: "August 19, 2025", title: "It changed my life.!", text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!", avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg" }, { name: "Lily Morgan", date: "November 9, 2025", title: "I am very happy.", text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!", avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg" }, { name: "Emily Carter", date: "August 29, 2025", title: "After years of searching, I finally found true love.", text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍", avatar: "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg" } ]; return ( <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-4xl mx-auto px-4 py-8" > <div className="space-y-6"> <div className="space-y-4"> {testimonials.map((testimonial, index) => ( <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.2 }} className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200" > <div className="flex items-start justify-between mb-4"> <div className="flex items-center gap-3"> <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover" /> <div> <h3 className="font-bold text-gray-800 text-lg">{testimonial.name}</h3> <p className="text-gray-400 text-sm">{testimonial.date}</p> </div> </div> <div className="flex gap-0.5"> {[...Array(5)].map((_, i) => ( <span key={i} className="text-yellow-400 text-xl">⭐</span> ))} </div> </div>
O ChatGPT disse:

Pensou por 25s
Segue o paywall com tudo que você pediu:

Fundo 100% branco na página.

Removido o card superior de Name/Date.

Pitch de preço mantido como antes.

Social proof com os 3 depoimentos logo acima do FAQ, usando o layout que você mandou.

FAQ:

título em negrito

ao clicar, o título fica em cima e a descrição aparece abaixo, separada.

Aqui está o componente completo pra você colar:

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";
import SalesSection from "../funnel-1/SalesSection";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

export default function PaywallStep({ userName, birthDate, quizResultId, src }) {
  const [showSales, setShowSales] = useState(true);
  const { trackEndQuiz } = useTracking();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (
      quizResultId &&
      quizResultId !== "offline-mode" &&
      quizResultId !== "admin-mode" &&
      quizResultId !== "bot-mode"
    ) {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(
        (e) => console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    trackEndQuiz();

    const trackCheckout = async () => {
      if (
        quizResultId &&
        quizResultId !== "offline-mode" &&
        quizResultId !== "admin-mode" &&
        quizResultId !== "bot-mode"
      ) {
        try {
          await HybridQuizResult.update(quizResultId, {
            checkout_step_clicked: true,
          });
          console.log("Checkout click tracked successfully");
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout()
      .then(() => {
        try {
          const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
          const url = new URL(checkoutUrl);

          let allUtms: Record<string, string> = {};

          if (typeof window !== "undefined" && (window as any).utmify) {
            try {
              allUtms = (window as any).utmify.getUtms() || {};
              console.log("UTMs from UTMIFY:", allUtms);
            } catch (error) {
              console.warn("Failed to get UTMs from UTMIFY:", error);
            }
          }

          if (Object.keys(allUtms).length === 0) {
            const currentUrl = new URL(window.location.href);
            const utmParams = [
              "utm_source",
              "utm_medium",
              "utm_campaign",
              "utm_content",
              "utm_term",
            ];

            utmParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });

            const otherParams = ["fbclid", "gclid", "ttclid", "src", "xcod"];
            otherParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });
          }

          Object.keys(allUtms).forEach((key) => {
            if (allUtms[key]) {
              url.searchParams.set(key, allUtms[key]);
            }
          });

          if (
            quizResultId &&
            quizResultId !== "offline-mode" &&
            quizResultId !== "admin-mode" &&
            quizResultId !== "bot-mode"
          ) {
            url.searchParams.set("quiz_result_id", quizResultId);
          }

          console.log("Redirecting to checkout:", url.toString());
          localStorage.removeItem("holymind_quiz_state");
          localStorage.setItem("holymind_last_quiz_id", quizResultId);
          window.location.href = url.toString();
        } catch (error) {
          console.error("Erro ao construir URL de checkout:", error);
          window.location.href = CHECKOUT_CONFIG.baseUrl;
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao rastrear checkout, mas redirecionando mesmo assim:",
          error
        );
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      });
  };

  const faqs = [
    {
      question: "Does it really work?",
      answer:
        "We base predictions on the data you provide and recognized compatibility patterns. It’s not guesswork; it’s personalized analysis.",
    },
    {
      question: "I’m skeptical. Is this safe?",
      answer:
        "Your data are encrypted and used only to create your report. You risk nothing with our guarantee.",
    },
    {
      question: "What if I’m already in a relationship?",
      answer:
        "The report shows compatibility with your current partner and clarifies your future.",
    },
    {
      question: "Is the portrait real?",
      answer:
        "It’s a representation generated from the most likely characteristics. Users report striking similarities.",
    },
    {
      question: "Can I cancel?",
      answer:
        "Yes. The report is a one-time purchase; the monthly subscription can be canceled at any time.",
    },
  ];

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar: "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center py-8 max-w-3xl mx-auto px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 px-4">
            Your Birth Chart Reading Is Ready!
          </h2>

          <h1 className="text-purple-600 mb-4 text-xl font-semibold md:text-2xl leading-tight px-4 uppercase tracking-wide">
            HERE&apos;S YOUR SOULMATE&apos;S DRAWING
          </h1>

          {/* Imagem do desenho */}
          <div className="mb-6">
            <img
              src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759873292152-ltl34v44ham.png"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div>

          {/* PITCH DE PREÇO */}
          <Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Descubra o Rosto da sua alma gemea com o Auraly App
              </h3>

              <ul className="space-y-2 text-sm md:text-base text-gray-800">
                <li>
                  ✍️ Ultra-realistic hand-drawn sketch of your soul mate made by
                  a renowned astrologer
                </li>
                <li>
                  💫 Uncover exclusive personality traits only your soulmate has
                </li>
                <li>🗓️ Date and context most favorable for the meeting</li>
                <li>
                  🔮 Receive deep, personalized insights decoded through your
                  unique birth chart and spiritual profile
                </li>
                <li>
                  💕 Feel the emotional connection before even meeting — you’ll
                  know why he’s &quot;the one&quot;
                </li>
              </ul>

              <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>2 Free Bonuses:</strong> Synchronicity Calendar
                  (From $19, for free) + Emotional Healing Guide (From $19, for
                  free)
                </p>
                <p>💎 Updates and new reports every day.</p>
              </div>

              <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  All this for just <strong>$19 today</strong> — a symbolic
                  price to finally discover who your true love is.
                </p>
                <p className="text-red-600 font-semibold">
                  50% OFF – Ends Today!
                </p>
                <p className="text-lg md:text-xl font-bold text-green-600">
                  Unlock your soulmate sketch for only $19{" "}
                  <span className="text-sm md:text-base text-gray-500 line-through align-middle">
                    (normally $39)
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="space-y-3 mb-8 px-4">
            <p className="text-gray-700 text-sm font-bold">
              Click Below To Secure Your Drawing 👇🏻
            </p>
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-12 rounded-full text-lg md:text-xl shadow-2xl transform transition-all duration-300 hover:scale-105 leading-tight"
              style={{ minHeight: "70px" }}
            >
              <span className="block text-center leading-tight">
                YES! Claim My Divine
                <br />
                Soul Drawing
              </span>
            </button>
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto px-0 py-4"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.2 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="text-yellow-400 text-xl"
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <h4 className="font-bold text-gray-800 text-xl">
                        {testimonial.title}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              FAQ
            </h2>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full py-3 flex items-center justify-between gap-2"
                    >
                      <span className="text-sm md:text-base text-gray-800 font-semibold">
                        {item.question}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3 px-1">
                        <p className="text-sm text-gray-600">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seção extra de vendas (se quiser manter) */}
          {showSales && (
            <SalesSection
              userName={userName}
              birthDate={birthDate}
              quizResultId={quizResultId}
              src={src}
              onCheckout={handleCheckout}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
Se quiser, no próximo passo a gente pode:

Ajustar spacing pra ficar pixel perfect com o Hint

Criar uma versão mobile-first (ainda mais compacta)

Testar variações de copy no preço / CTA

Quer que eu mexa em mais algum detalhe visual ou de texto?

Você disse:
ta com erro: revie e retire sessao extra de veendas: import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";
import SalesSection from "../funnel-1/SalesSection";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

export default function PaywallStep({ userName, birthDate, quizResultId, src }) {
  const [showSales, setShowSales] = useState(true);
  const { trackEndQuiz } = useTracking();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (
      quizResultId &&
      quizResultId !== "offline-mode" &&
      quizResultId !== "admin-mode" &&
      quizResultId !== "bot-mode"
    ) {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(
        (e) => console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    trackEndQuiz();

    const trackCheckout = async () => {
      if (
        quizResultId &&
        quizResultId !== "offline-mode" &&
        quizResultId !== "admin-mode" &&
        quizResultId !== "bot-mode"
      ) {
        try {
          await HybridQuizResult.update(quizResultId, {
            checkout_step_clicked: true,
          });
          console.log("Checkout click tracked successfully");
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout()
      .then(() => {
        try {
          const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
          const url = new URL(checkoutUrl);

          let allUtms: Record<string, string> = {};

          if (typeof window !== "undefined" && (window as any).utmify) {
            try {
              allUtms = (window as any).utmify.getUtms() || {};
              console.log("UTMs from UTMIFY:", allUtms);
            } catch (error) {
              console.warn("Failed to get UTMs from UTMIFY:", error);
            }
          }

          if (Object.keys(allUtms).length === 0) {
            const currentUrl = new URL(window.location.href);
            const utmParams = [
              "utm_source",
              "utm_medium",
              "utm_campaign",
              "utm_content",
              "utm_term",
            ];

            utmParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });

            const otherParams = ["fbclid", "gclid", "ttclid", "src", "xcod"];
            otherParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });
          }

          Object.keys(allUtms).forEach((key) => {
            if (allUtms[key]) {
              url.searchParams.set(key, allUtms[key]);
            }
          });

          if (
            quizResultId &&
            quizResultId !== "offline-mode" &&
            quizResultId !== "admin-mode" &&
            quizResultId !== "bot-mode"
          ) {
            url.searchParams.set("quiz_result_id", quizResultId);
          }

          console.log("Redirecting to checkout:", url.toString());
          localStorage.removeItem("holymind_quiz_state");
          localStorage.setItem("holymind_last_quiz_id", quizResultId);
          window.location.href = url.toString();
        } catch (error) {
          console.error("Erro ao construir URL de checkout:", error);
          window.location.href = CHECKOUT_CONFIG.baseUrl;
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao rastrear checkout, mas redirecionando mesmo assim:",
          error
        );
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      });
  };

  const faqs = [
    {
      question: "Does it really work?",
      answer:
        "We base predictions on the data you provide and recognized compatibility patterns. It’s not guesswork; it’s personalized analysis.",
    },
    {
      question: "I’m skeptical. Is this safe?",
      answer:
        "Your data are encrypted and used only to create your report. You risk nothing with our guarantee.",
    },
    {
      question: "What if I’m already in a relationship?",
      answer:
        "The report shows compatibility with your current partner and clarifies your future.",
    },
    {
      question: "Is the portrait real?",
      answer:
        "It’s a representation generated from the most likely characteristics. Users report striking similarities.",
    },
    {
      question: "Can I cancel?",
      answer:
        "Yes. The report is a one-time purchase; the monthly subscription can be canceled at any time.",
    },
  ];

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar: "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center py-8 max-w-3xl mx-auto px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 px-4">
            Your Birth Chart Reading Is Ready!
          </h2>

          <h1 className="text-purple-600 mb-4 text-xl font-semibold md:text-2xl leading-tight px-4 uppercase tracking-wide">
            HERE&apos;S YOUR SOULMATE&apos;S DRAWING
          </h1>

          {/* Imagem do desenho */}
          <div className="mb-6">
            <img
              src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759873292152-ltl34v44ham.png"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div>

          {/* PITCH DE PREÇO */}
          <Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Descubra o Rosto da sua alma gemea com o Auraly App
              </h3>

              <ul className="space-y-2 text-sm md:text-base text-gray-800">
                <li>
                  ✍️ Ultra-realistic hand-drawn sketch of your soul mate made by
                  a renowned astrologer
                </li>
                <li>
                  💫 Uncover exclusive personality traits only your soulmate has
                </li>
                <li>🗓️ Date and context most favorable for the meeting</li>
                <li>
                  🔮 Receive deep, personalized insights decoded through your
                  unique birth chart and spiritual profile
                </li>
                <li>
                  💕 Feel the emotional connection before even meeting — you’ll
                  know why he’s &quot;the one&quot;
                </li>
              </ul>

              <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>2 Free Bonuses:</strong> Synchronicity Calendar
                  (From $19, for free) + Emotional Healing Guide (From $19, for
                  free)
                </p>
                <p>💎 Updates and new reports every day.</p>
              </div>

              <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  All this for just <strong>$19 today</strong> — a symbolic
                  price to finally discover who your true love is.
                </p>
                <p className="text-red-600 font-semibold">
                  50% OFF – Ends Today!
                </p>
                <p className="text-lg md:text-xl font-bold text-green-600">
                  Unlock your soulmate sketch for only $19{" "}
                  <span className="text-sm md:text-base text-gray-500 line-through align-middle">
                    (normally $39)
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="space-y-3 mb-8 px-4">
            <p className="text-gray-700 text-sm font-bold">
              Click Below To Secure Your Drawing 👇🏻
            </p>
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-12 rounded-full text-lg md:text-xl shadow-2xl transform transition-all duration-300 hover:scale-105 leading-tight"
              style={{ minHeight: "70px" }}
            >
              <span className="block text-center leading-tight">
                YES! Claim My Divine
                <br />
                Soul Drawing
              </span>
            </button>
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto px-0 py-4"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.2 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="text-yellow-400 text-xl"
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <h4 className="font-bold text-gray-800 text-xl">
                        {testimonial.title}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              FAQ
            </h2>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full py-3 flex items-center justify-between gap-2"
                    >
                      <span className="text-sm md:text-base text-gray-800 font-semibold">
                        {item.question}
                      </span>
                      <ChevronRight
                        className={w-4 h-4 text-gray-500 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3 px-1">
                        <p className="text-sm text-gray-600">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
      </div>
    </div>
  );
}
O ChatGPT disse:

Pensou por 44s
O erro aí é de JSX não fechado (faltou </motion.div>) e você ainda está com alguns trechos em TypeScript num arquivo JS (useState<number | null>, Record<string,string>, etc.), além da importação da SalesSection que você não usa mais.

Já ajustei tudo isso pra você:

Removi SalesSection e o state showSales.

Corrigi o fechamento do </motion.div>.

Tirei todas as anotações de tipo (number | null, Record, as any) pra funcionar em JS normal.

Mantive todo o layout que você pediu (pitch, social proof, FAQ, fundo branco).

Segue o componente revisado e pronto:

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

export default function PaywallStep({ userName, birthDate, quizResultId }) {
  const { trackEndQuiz } = useTracking();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (
      quizResultId &&
      quizResultId !== "offline-mode" &&
      quizResultId !== "admin-mode" &&
      quizResultId !== "bot-mode"
    ) {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(
        (e) => console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    trackEndQuiz();

    const trackCheckout = async () => {
      if (
        quizResultId &&
        quizResultId !== "offline-mode" &&
        quizResultId !== "admin-mode" &&
        quizResultId !== "bot-mode"
      ) {
        try {
          await HybridQuizResult.update(quizResultId, {
            checkout_step_clicked: true,
          });
          console.log("Checkout click tracked successfully");
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout()
      .then(() => {
        try {
          const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
          const url = new URL(checkoutUrl);

          let allUtms = {};

          if (typeof window !== "undefined" && window.utmify) {
            try {
              allUtms = window.utmify.getUtms() || {};
              console.log("UTMs from UTMIFY:", allUtms);
            } catch (error) {
              console.warn("Failed to get UTMs from UTMIFY:", error);
            }
          }

          if (Object.keys(allUtms).length === 0) {
            const currentUrl = new URL(window.location.href);
            const utmParams = [
              "utm_source",
              "utm_medium",
              "utm_campaign",
              "utm_content",
              "utm_term",
            ];

            utmParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });

            const otherParams = ["fbclid", "gclid", "ttclid", "src", "xcod"];
            otherParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });
          }

          Object.keys(allUtms).forEach((key) => {
            if (allUtms[key]) {
              url.searchParams.set(key, allUtms[key]);
            }
          });

          if (
            quizResultId &&
            quizResultId !== "offline-mode" &&
            quizResultId !== "admin-mode" &&
            quizResultId !== "bot-mode"
          ) {
            url.searchParams.set("quiz_result_id", quizResultId);
          }

          console.log("Redirecting to checkout:", url.toString());
          localStorage.removeItem("holymind_quiz_state");
          localStorage.setItem("holymind_last_quiz_id", quizResultId);
          window.location.href = url.toString();
        } catch (error) {
          console.error("Erro ao construir URL de checkout:", error);
          window.location.href = CHECKOUT_CONFIG.baseUrl;
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao rastrear checkout, mas redirecionando mesmo assim:",
          error
        );
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      });
  };

  const faqs = [
    {
      question: "Does it really work?",
      answer:
        "We base predictions on the data you provide and recognized compatibility patterns. It’s not guesswork; it’s personalized analysis.",
    },
    {
      question: "I’m skeptical. Is this safe?",
      answer:
        "Your data are encrypted and used only to create your report. You risk nothing with our guarantee.",
    },
    {
      question: "What if I’m already in a relationship?",
      answer:
        "The report shows compatibility with your current partner and clarifies your future.",
    },
    {
      question: "Is the portrait real?",
      answer:
        "It’s a representation generated from the most likely characteristics. Users report striking similarities.",
    },
    {
      question: "Can I cancel?",
      answer:
        "Yes. The report is a one-time purchase; the monthly subscription can be canceled at any time.",
    },
  ];

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar: "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center py-8 max-w-3xl mx-auto px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 px-4">
            Your Birth Chart Reading Is Ready!
          </h2>

          <h1 className="text-purple-600 mb-4 text-xl font-semibold md:text-2xl leading-tight px-4 uppercase tracking-wide">
            HERE&apos;S YOUR SOULMATE&apos;S DRAWING
          </h1>

          {/* Imagem do desenho */}
          <div className="mb-6">
            <img
              src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759873292152-ltl34v44ham.png"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div>

          {/* PITCH DE PREÇO */}
          <Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Descubra o Rosto da sua alma gemea com o Auraly App
              </h3>

              <ul className="space-y-2 text-sm md:text-base text-gray-800">
                <li>
                  ✍️ Ultra-realistic hand-drawn sketch of your soul mate made by
                  a renowned astrologer
                </li>
                <li>
                  💫 Uncover exclusive personality traits only your soulmate has
                </li>
                <li>🗓️ Date and context most favorable for the meeting</li>
                <li>
                  🔮 Receive deep, personalized insights decoded through your
                  unique birth chart and spiritual profile
                </li>
                <li>
                  💕 Feel the emotional connection before even meeting — you’ll
                  know why he’s &quot;the one&quot;
                </li>
              </ul>

              <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>2 Free Bonuses:</strong> Synchronicity Calendar
                  (From $19, for free) + Emotional Healing Guide (From $19, for
                  free)
                </p>
                <p>💎 Updates and new reports every day.</p>
              </div>

              <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  All this for just <strong>$19 today</strong> — a symbolic
                  price to finally discover who your true love is.
                </p>
                <p className="text-red-600 font-semibold">
                  50% OFF – Ends Today!
                </p>
                <p className="text-lg md:text-xl font-bold text-green-600">
                  Unlock your soulmate sketch for only $19{" "}
                  <span className="text-sm md:text-base text-gray-500 line-through align-middle">
                    (normally $39)
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="space-y-3 mb-8 px-4">
            <p className="text-gray-700 text-sm font-bold">
              Click Below To Secure Your Drawing 👇🏻
            </p>
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-12 rounded-full text-lg md:text-xl shadow-2xl transform transition-all duration-300 hover:scale-105 leading-tight"
              style={{ minHeight: "70px" }}
            >
              <span className="block text-center leading-tight">
                YES! Claim My Divine
                <br />
                Soul Drawing
              </span>
            </button>
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto px-0 py-4"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.2 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <h4 className="font-bold text-gray-800 text-xl">
                        {testimonial.title}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              FAQ
            </h2>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full py-3 flex items-center justify-between gap-2"
                    >
                      <span className="text-sm md:text-base text-gray-800 font-semibold">
                        {item.question}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3 px-1">
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
Se der mais algum erro agora provavelmente é de import/caminho (ex.: HybridQuizResult ou useTracking). A parte de JSX em si está fechada certinha.

Quer que a gente faça uma versão B desse paywall (ex: com trial de 7 dias ou outro preço) pra testar em A/B?

Você disse:
 {/* PITCH DE PREÇO */}
          <Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
               Discover the face of your soulmate with the Auraly App.
              </h3>

              <ul className="space-y-2 text-sm md:text-base text-gray-800">
                <li>
                  ✍️ Ultra-realistic, hand-drawn sketch of your soulmate, made by Master Aura.
                </li>
                <li> abaixo do disover adicione esse src: https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png
O ChatGPT disse:
Perfeito, é só inserir a imagem logo abaixo do título dentro do CardContent.

Segue o bloco do PITCH DE PREÇO já ajustado, pronto pra substituir no teu código:

{/* PITCH DE PREÇO */}
<Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
  <CardContent className="p-6 space-y-4">
    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
      Discover the face of your soulmate with the Auraly App.
    </h3>

    {/* Imagem logo abaixo do título */}
    <div className="w-full flex justify-center mb-2">
      <img
        src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png"
        alt="Soulmate Offer Highlight"
        className="w-full max-w-md mx-auto rounded-xl"
      />
    </div>

    <ul className="space-y-2 text-sm md:text-base text-gray-800">
      <li>
        ✍️ Ultra-realistic, hand-drawn sketch of your soulmate, made by Master Aura.
      </li>
      <li>
        💫 Uncover exclusive personality traits only your soulmate has.
      </li>
      <li>🗓️ Date and context most favorable for the meeting.</li>
      <li>
        🔮 Receive deep, personalized insights decoded through your unique birth chart and spiritual profile.
      </li>
      <li>
        💕 Feel the emotional connection before even meeting — you’ll know why he’s “the one”.
      </li>
    </ul>

    {/* ...resto do conteúdo de preço / bônus que você já tinha */}
  </CardContent>
</Card>
Isso já coloca a imagem exatamente onde você pediu, sem quebrar layout.
Se quiser, posso ajustar tamanho, borda ou deixar essa imagem com um leve glow/efeito de destaque. Quer que eu mexa mais algo aí?

Você disse:
coloque o discover centralizado e essa imagem menor
O ChatGPT disse:
Aqui está o trecho ajustado com:

Título centralizado

Imagem menor (max-width reduzido)

Mantido o espaçamento elegante e alinhamento perfeito no card

Substitui esse bloco no seu código:

{/* PITCH DE PREÇO */}
<Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
  <CardContent className="p-6 space-y-4">

    {/* Título centralizado */}
    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
      Discover the face of your soulmate with the Auraly App.
    </h3>

    {/* Imagem menor e centralizada */}
    <div className="w-full flex justify-center mb-2">
      <img
        src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png"
        alt="Soulmate Offer Highlight"
        className="w-[55%] max-w-xs mx-auto rounded-xl"
      />
    </div>

    <ul className="space-y-2 text-sm md:text-base text-gray-800">
      <li>
        ✍️ Ultra-realistic, hand-drawn sketch of your soulmate, made by Master Aura.
      </li>
      <li>💫 Uncover exclusive personality traits only your soulmate has.</li>
      <li>🗓️ Date and context most favorable for the meeting.</li>
      <li>
        🔮 Receive deep, personalized insights decoded through your unique birth chart and spiritual profile.
      </li>
      <li>
        💕 Feel the emotional connection before even meeting — you’ll know why he’s “the one”.
      </li>
    </ul>

  </CardContent>
</Card>
Se quiser posso também:

colocar um glow suave nessa imagem

dar um efeito de float animation

ou colocar a imagem dentro de um card lilás suave tipo o Hint

Quer personalizar mais?

Você disse:
coloque centralizado: <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                All this for a <strong>symbolic price</strong> to finally discover who your true love is.
                </p>
O ChatGPT disse:
Aqui está o trecho centralizado corretamente, mantendo o estilo e sem quebrar o layout:

<div className="pt-3 space-y-1 text-sm md:text-base text-gray-800 text-center">
  <p>
    All this for a <strong>symbolic price</strong> to finally discover who your true love is.
  </p>
</div>
Basta substituir pelo bloco acima.

Se quiser também posso ajustar espaçamento, peso da fonte, cor ou deixar mais persuasivo. Quer refinar mais?

Você disse:
Imagem carregada
<p className="text-green-600 font-semibold">
                  30% OFF – Ends Today!
                </p>
                <p className="text-lg md:text-xl font-bold text-green-600">
                  Unlock your soulmate sketch for only $19{" "}
                  <span className="text-sm md:text-base text-gray-500 line-through align-middle">
                    (normally $29) coloque esse pitch de preço em um card extamente igual esse, special offer e total today: $19
O ChatGPT disse:
Aqui está um card de preço idêntico ao modelo da imagem — mesmo formato, mesma hierarquia visual, mesma estrutura:

Topo roxo com "Special offer"

Texto central “Personalized reading for $19”

Linha separadora

Total today: $19

Bordas arredondadas iguais

Pronto para colar no seu paywall:

{/* PRICE BOX IGUAL AO MODELO */}
<div className="max-w-md mx-auto mt-4 mb-6">
  <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
    
    {/* Topo Roxo */}
    <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
      Special offer
    </div>

    {/* Conteúdo */}
    <div className="p-5 space-y-3">

      {/* Texto principal */}
      <p className="text-center text-lg font-semibold text-gray-900">
        Personalized reading for{" "}
        <span className="text-purple-600 font-bold">$19</span>
      </p>

      {/* Divider */}
      <div className="border-t border-gray-200 my-2"></div>

      {/* Total today */}
      <div className="flex items-center justify-between text-gray-800 text-sm font-medium">
        <span>Total today:</span>
        <span className="font-bold">$19</span>
      </div>
    </div>
  </div>
</div>
Como encaixar no seu layout
Coloque esse card abaixo do pitch e acima do CTA, substituindo estes trechos:

<p className="text-green-600 font-semibold">
  30% OFF – Ends Today!
</p>
<p className="text-lg md:text-xl font-bold text-green-600">
  Unlock your soulmate sketch for only $19...
Isso cria um paywall muito mais confiável e clean, igual ao Hint.

Quer que eu coloque variações A/B do card (ex.: cor lilás, versão premium, versão trial)?

Você disse:
me mande substituindo aqui:        {/* PITCH DE PREÇO */}
          <Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
  <CardContent className="p-6 space-y-4">

    {/* Título centralizado */}
    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
      Discover the face of your soulmate with the Auraly App.
    </h3>

    {/* Imagem menor e centralizada */}
    <div className="w-full flex justify-center mb-2">
      <img
        src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png"
        alt="Soulmate Offer Highlight"
        className="w-[55%] max-w-xs mx-auto rounded-xl"
      />
    </div>

              <ul className="space-y-2 text-sm md:text-base text-gray-800">
                <li>
                  ✍️ <strong> Ultra-realistic</strong> , hand-drawn sketch of your soulmate, made by Master Aura.
                </li>
                <li>
                  💫 <strong> Uncover exclusive personality</strong>  traits only your soulmate has
                </li>
                <li>🗓️ <strong> Date and context</strong>  most favorable for the meeting</li>
                <li>
                  🔮 <strong> Receive deep, personalized insights</strong>  into your love life.
                </li>
              </ul>

              <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonuses:</strong> Synchronicity Calendar
                  (From $19, for free)
                </p>
              </div>
<div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonuses:</strong> Emotional Healing Guide (From $9, for
                  free)
                </p>
              </div>
              <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800 text-center">
<div className="pt-3 space-y-1 text-sm md:text-base text-gray-800 text-center">
  <p>
    All this for a <strong>symbolic price</strong> to finally discover who your true love is.
  </p>
</div>
                <p className="text-green-600 font-semibold">
                  30% OFF – Ends Today!
                </p>
                <p className="text-lg md:text-xl font-bold text-green-600">
                  Unlock your soulmate sketch for only $19{" "}
                  <span className="text-sm md:text-base text-gray-500 line-through align-middle">
                    (normally $29)
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
O ChatGPT disse:
Aqui está exatamente o mesmo bloco, mas agora substituído pelo card de preço no estilo da imagem (“Special offer”) e mantendo tudo o que já existia — título, imagem, bullets e bônus — apenas trocando o pitch final pelo card estilizado.

👉 Pode colar direto no lugar do seu PITCH DE PREÇO atual.

✅ BLOCO COMPLETO SUBSTITUÍDO
{/* PITCH DE PREÇO */}
<Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
  <CardContent className="p-6 space-y-4">

    {/* Título centralizado */}
    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
      Discover the face of your soulmate with the Auraly App.
    </h3>

    {/* Imagem menor e centralizada */}
    <div className="w-full flex justify-center mb-2">
      <img
        src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png"
        alt="Soulmate Offer Highlight"
        className="w-[55%] max-w-xs mx-auto rounded-xl"
      />
    </div>

    {/* Bullets */}
    <ul className="space-y-2 text-sm md:text-base text-gray-800">
      <li>
        ✍️ <strong>Ultra-realistic</strong> hand-drawn sketch of your soulmate, made by Master Aura.
      </li>
      <li>
        💫 <strong>Uncover exclusive personality traits</strong> only your soulmate has.
      </li>
      <li>
        🗓️ <strong>Date and context</strong> most favorable for the meeting.
      </li>
      <li>
        🔮 <strong>Receive deep, personalized insights</strong> into your love life.
      </li>
    </ul>

    {/* Bônus */}
    <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
      <p>
        🎁 <strong>Free Bonus:</strong> Synchronicity Calendar (From $19, free)
      </p>
    </div>

    <div className="bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
      <p>
        🎁 <strong>Free Bonus:</strong> Emotional Healing Guide (From $9, free)
      </p>
    </div>

    {/* Texto antes do preço */}
    <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800 text-center">
      <p>
        All this for a <strong>symbolic price</strong> to finally discover who your true love is.
      </p>
    </div>

    {/* CARD DE PREÇO IGUAL AO MODELO DA IMAGEM */}
    <div className="max-w-md mx-auto mt-2">
      <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">

        {/* Topo roxo */}
        <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
          Special offer
        </div>

        {/* Conteúdo interno */}
        <div className="p-5 space-y-3">

          <p className="text-center text-lg font-semibold text-gray-900">
            Personalized reading for{" "}
            <span className="text-purple-600 font-bold">$19</span>
          </p>

          <div className="border-t border-gray-200 my-2"></div>

          <div className="flex items-center justify-between text-gray-800 text-sm font-medium">
            <span>Total today:</span>
            <span className="font-bold">$19</span>
          </div>

        </div>
      </div>
    </div>

  </CardContent>
</Card>
Se quiser, posso:

🔥 Criar a versão mobile do card 100% igual ao Hint
🎨 Aplicar o mesmo raio de borda, sombra e espessura de linha pixel-perfect
🟪 Substituir por uma versão lilás igual a do Hint/Palmistry
🧪 Criar mais 2 variantes A/B do preço

Quer alguma dessas melhorias?

Você disse:
em Personalize reading for $19 (coloque o $19 cinza riscado) o $19 debaixo coloque pouco maior e na cor verde e abaixo de total today coloque abaixo bem pequeno entre parenteses (30 days bonus)
O ChatGPT disse:
Pronto — aqui está exatamente o card atualizado, com:

✅ “Personalized reading for $19” → $19 riscado em cinza
✅ “Total today” → valor maior, verde, bold
✅ Linha extra pequena abaixo: (30 days bonus) em cinza claro
✅ Mantido o mesmo layout do Hint

Basta substituir apenas o card de preço pelo bloco abaixo:

🔥 CARD DE PREÇO ATUALIZADO (pronto para colar)
{/* CARD DE PREÇO IGUAL AO MODELO, ATUALIZADO */}
<div className="max-w-md mx-auto mt-2">
  <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">

    {/* Topo roxo */}
    <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
      Special offer
    </div>

    {/* Conteúdo interno */}
    <div className="p-5 space-y-4">

      {/* Texto principal */}
      <p className="text-center text-lg font-semibold text-gray-900">
        Personalized reading for{" "}
        <span className="text-gray-500 line-through font-normal">$19</span>
      </p>

      {/* Divider */}
      <div className="border-t border-gray-200 my-2"></div>

      {/* Total today */}
      <div className="flex flex-col items-end text-gray-800 text-sm font-medium">
        <div className="flex w-full justify-between">
          <span>Total today:</span>
          <span className="text-green-600 text-xl font-extrabold">$19</span>
        </div>

        {/* Linha pequena embaixo */}
        <span className="text-[10px] text-gray-400 mt-1">(30 days bonus)</span>
      </div>
    </div>
  </div>
</div>
Se quiser, posso deixar:

✨ A cor roxa exatamente igual ao app Hint (versão HEX precisa)
✨ O card com border-radius idêntico ao original
✨ Uma versão com “🔥 Limited Time Deal”
✨ Uma variação testada para A/B de conversão

Quer ajustar mais alguma coisa visual?

Você disse:
Imagem carregada
coloque o 30 days abaixo do texto total today. e coloque total today em negrito
O ChatGPT disse:
Aqui está o card exatamente como na imagem, com:

“Total today:” em negrito

$19 verde, do mesmo tamanho

“(30 days bonus)” imediatamente abaixo, alinhado à direita e mais próximo do preço

Espaçamento ajustado para ficar pixel-perfect igual ao seu screenshot

Cole esse bloco no lugar do card atual:

✅ CARD DE PREÇO AJUSTADO
{/* PRICE BOX ATUALIZADO */}
<div className="max-w-md mx-auto mt-2">
  <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">

    {/* Topo Roxo */}
    <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
      Special offer
    </div>

    {/* Conteúdo */}
    <div className="p-5 space-y-4">

      {/* Texto principal */}
      <p className="text-center text-lg font-semibold text-gray-900">
        Personalized reading for{" "}
        <span className="text-gray-500 line-through font-normal">$19</span>
      </p>

      {/* Divider */}
      <div className="border-t border-gray-200 my-2"></div>

      {/* Total today */}
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
          <span>Total today:</span>
          <span className="text-green-600 text-xl font-extrabold">$19</span>
        </div>

        {/* (30 days bonus) */}
        <div className="flex justify-end mt-1">
          <span className="text-[11px] text-gray-400">
            (30 days bonus)
          </span>
        </div>
      </div>

    </div>
  </div>
</div>
Se quiser deixo:

✨ A borda exatamente igual ao Hint (espessura + cor exata)
✨ A sombra idêntica (drop shadow 0 4px 6px rgba(0,0,0,.08))
✨ Uma versão com trial de 7 dias
✨ Uma versão com preço maior/menor para testes A/B

Quer que eu refine ainda mais?

Você disse:
onde ta o erro:    {/* Divider */}
      <div className="border-t border-gray-200 my-2"></div>

      {/* Total today */}
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
          <span>Total today:</span>
          <span className="text-green-600 text-xl font-extrabold">$19</span>
        </div>
        </div>
      </div>

    </div>
  </div>
</div>
O ChatGPT disse:
O erro é estrutura de <div> aberta e não fechada corretamente.
Você abriu 3 divs, mas fechou 4, causando quebra no JSX.

Vamos olhar exatamente o que você mandou:

{/* Divider */}
<div className="border-t border-gray-200 my-2"></div>

{/* Total today */}
<div className="flex flex-col w-full">
  <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
    <span>Total today:</span>
    <span className="text-green-600 text-xl font-extrabold">$19</span>
  </div>
</div>
</div>   ❌ EXTRA — NÃO DEVERIA EXISTIR

</div>
</div>
</div>
❌ Problema
Tem um </div> sobrando logo após fechar o bloco de "Total today".

Esse </div> extra quebra a hierarquia e gera o erro de JSX.

✅ CORREÇÃO
Aqui está a estrutura correta, sem fechar divs a mais:

{/* Divider */}
<div className="border-t border-gray-200 my-2"></div>

{/* Total today */}
<div className="flex flex-col w-full">
  <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
    <span>Total today:</span>
    <span className="text-green-600 text-xl font-extrabold">$19</span>
  </div>

  {/* (30 days bonus) */}
  <div className="flex justify-end mt-1">
    <span className="text-[11px] text-gray-400">(30 days bonus)</span>
  </div>
</div>
Apenas 1 fechamento depois do bloco.

Se quiser, posso revisar todo o seu PaywallStep para limpar a estrutura completa.
Quer que eu revise o arquivo inteiro?

Você disse:
nao quero mais o 30 day
O ChatGPT disse:
Perfeito — só remover o bloco referente ao “30 days bonus”.

Aqui está exatamente como deve ficar sem o 30 days e com a estrutura correta:

{/* Divider */}
<div className="border-t border-gray-200 my-2"></div>

{/* Total today */}
<div className="flex flex-col w-full">
  <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
    <span>Total today:</span>
    <span className="text-green-600 text-xl font-extrabold">$19</span>
  </div>
</div>
✔ Sem erro de div extra
✔ Mantém layout intacto
✔ Mantém “Total today” em negrito e valor em verde

Se quiser deixar ainda mais parecido com o layout do exemplo, posso ajustar spacing, borda ou fonte. Quer que eu refine mais?

Você disse:
ainda ta dando erro, revise:      {/* Texto principal */}
      <p className="text-center text-lg font-semibold text-gray-900">
        Personalized reading for{" "}
        <span className="text-gray-500 line-through font-normal">$19</span>
      </p>

    {/* Divider */}
<div className="border-t border-gray-200 my-2"></div>

{/* Total today */}
<div className="flex flex-col w-full">
  <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
    <span>Total today:</span>
    <span className="text-green-600 text-xl font-extrabold">$19</span>
  </div>
</div>
        </div>
      </div>

    </div>
  </div>
</div>

  </CardContent>
</Card>
O ChatGPT disse:

Pensou por 24s
Você disse:
verifique o erro: import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

export default function PaywallStep({ userName, birthDate, quizResultId }) {
  const { trackEndQuiz } = useTracking();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (
      quizResultId &&
      quizResultId !== "offline-mode" &&
      quizResultId !== "admin-mode" &&
      quizResultId !== "bot-mode"
    ) {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(
        (e) => console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    trackEndQuiz();

    const trackCheckout = async () => {
      if (
        quizResultId &&
        quizResultId !== "offline-mode" &&
        quizResultId !== "admin-mode" &&
        quizResultId !== "bot-mode"
      ) {
        try {
          await HybridQuizResult.update(quizResultId, {
            checkout_step_clicked: true,
          });
          console.log("Checkout click tracked successfully");
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout()
      .then(() => {
        try {
          const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
          const url = new URL(checkoutUrl);

          let allUtms = {};

          if (typeof window !== "undefined" && window.utmify) {
            try {
              allUtms = window.utmify.getUtms() || {};
              console.log("UTMs from UTMIFY:", allUtms);
            } catch (error) {
              console.warn("Failed to get UTMs from UTMIFY:", error);
            }
          }

          if (Object.keys(allUtms).length === 0) {
            const currentUrl = new URL(window.location.href);
            const utmParams = [
              "utm_source",
              "utm_medium",
              "utm_campaign",
              "utm_content",
              "utm_term",
            ];

            utmParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });

            const otherParams = ["fbclid", "gclid", "ttclid", "src", "xcod"];
            otherParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });
          }

          Object.keys(allUtms).forEach((key) => {
            if (allUtms[key]) {
              url.searchParams.set(key, allUtms[key]);
            }
          });

          if (
            quizResultId &&
            quizResultId !== "offline-mode" &&
            quizResultId !== "admin-mode" &&
            quizResultId !== "bot-mode"
          ) {
            url.searchParams.set("quiz_result_id", quizResultId);
          }

          console.log("Redirecting to checkout:", url.toString());
          localStorage.removeItem("holymind_quiz_state");
          localStorage.setItem("holymind_last_quiz_id", quizResultId);
          window.location.href = url.toString();
        } catch (error) {
          console.error("Erro ao construir URL de checkout:", error);
          window.location.href = CHECKOUT_CONFIG.baseUrl;
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao rastrear checkout, mas redirecionando mesmo assim:",
          error
        );
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      });
  };

  const faqs = [
    {
      question: "Does it really work?",
      answer:
        "We base predictions on the data you provide and recognized compatibility patterns. It’s not guesswork; it’s personalized analysis.",
    },
    {
      question: "I’m skeptical. Is this safe?",
      answer:
        "Your data are encrypted and used only to create your report. You risk nothing with our guarantee.",
    },
    {
      question: "What if I’m already in a relationship?",
      answer:
        "The report shows compatibility with your current partner and clarifies your future.",
    },
    {
      question: "Is the portrait real?",
      answer:
        "It’s a representation generated from the most likely characteristics. Users report striking similarities.",
    },
    {
      question: "Can I cancel?",
      answer:
        "Yes. The report is a one-time purchase; the monthly subscription can be canceled at any time.",
    },
  ];

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar: "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center py-8 max-w-3xl mx-auto px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 px-4">
            Your Birth Chart Reading Is Ready!
          </h2>

          <h1 className="text-purple-600 mb-4 text-xl font-semibold md:text-2xl leading-tight px-4 uppercase tracking-wide">
            HERE&apos;S YOUR SOULMATE&apos;S DRAWING
          </h1>

          {/* Imagem do desenho */}
          <div className="mb-6">
            <img
              src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759873292152-ltl34v44ham.png"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div>

   {/* PITCH DE PREÇO */}
<Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
  <CardContent className="p-6 space-y-4">

    {/* Título centralizado */}
    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
      Discover the face of your soulmate with the Auraly App.
    </h3>

    {/* Imagem menor e centralizada */}
    <div className="w-full flex justify-center mb-2">
      <img
        src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png"
        alt="Soulmate Offer Highlight"
        className="w-[55%] max-w-xs mx-auto rounded-xl"
      />
    </div>

    {/* Bullets */}
    <ul className="space-y-2 text-sm md:text-base text-gray-800">
      <li>
        ✍️ <strong>Ultra-realistic</strong> hand-drawn sketch of your soulmate, made by Master Aura.
      </li>
      <li>
        💫 <strong>Uncover exclusive personality traits</strong> only your soulmate has.
      </li>
      <li>
        🗓️ <strong>Date and context</strong> most favorable for the meeting.
      </li>
      <li>
        🔮 <strong>Receive deep, personalized insights</strong> into your love life.
      </li>
    </ul>

    {/* Bônus */}
    <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
      <p>
        🎁 <strong>Free Bonus:</strong> Synchronicity Calendar (From $19, free)
      </p>
    </div>

    <div className="bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
      <p>
        🎁 <strong>Free Bonus:</strong> Emotional Healing Guide (From $9, free)
      </p>
    </div>

    {/* Texto antes do preço */}
    <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800 text-center">
      <p>
        All this for a <strong>symbolic price</strong> to finally discover who your true love is.
      </p>
    </div>

    {/* CARD DE PREÇO IGUAL AO MODELO DA IMAGEM */}
    <div className="max-w-md mx-auto mt-2">
  <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">

    {/* Topo Roxo */}
    <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
      Special offer
    </div>

    {/* Conteúdo */}
    <div className="p-5 space-y-4">

      {/* Texto principal */}
      <p className="text-center text-lg font-semibold text-gray-900">
        Personalized reading for{" "}
        <span className="text-gray-500 line-through font-normal">$19</span>
      </p>

    {/* Divider */}
<div className="border-t border-gray-200 my-2"></div>

{/* Total today */}
<div className="flex flex-col w-full">
  <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
    <span>Total today:</span>
    <span className="text-green-600 text-xl font-extrabold">$19</span>
  </div>
</div>
        </div>
      </div>

    </div>
  </div>
</div>

  </CardContent>
</Card>

            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-12 rounded-full text-lg md:text-xl shadow-2xl transform transition-all duration-300 hover:scale-105 leading-tight"
              style={{ minHeight: "70px" }}
            >
              <span className="block text-center leading-tight">
              Get your soulmate drawing now.
              </span>
            </button>
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto px-0 py-4"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.2 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <h4 className="font-bold text-gray-800 text-xl">
                        {testimonial.title}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              FAQ
            </h2>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full py-3 flex items-center justify-between gap-2"
                    >
                      <span className="text-sm md:text-base text-gray-800 font-semibold">
                        {item.question}
                      </span>
                      <ChevronRight
                        className={w-4 h-4 text-gray-500 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3 px-1">
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
O ChatGPT disse:

Pensou por 1m 9s
Beleza, vamos direto ao ponto.

O erro aí não é “mágico”: é estrutura de JSX quebrada na região do card de preço. Ficou tudo meio bagunçado com </div> a mais / a menos, então é mais rápido e seguro te mandar o componente inteiro já revisado, com o card 100% certo.

Segue o PaywallStep completo, pronto pra substituir o seu arquivo:

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

export default function PaywallStep({ userName, birthDate, quizResultId }) {
  const { trackEndQuiz } = useTracking();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (
      quizResultId &&
      quizResultId !== "offline-mode" &&
      quizResultId !== "admin-mode" &&
      quizResultId !== "bot-mode"
    ) {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(
        (e) => console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    trackEndQuiz();

    const trackCheckout = async () => {
      if (
        quizResultId &&
        quizResultId !== "offline-mode" &&
        quizResultId !== "admin-mode" &&
        quizResultId !== "bot-mode"
      ) {
        try {
          await HybridQuizResult.update(quizResultId, {
            checkout_step_clicked: true,
          });
          console.log("Checkout click tracked successfully");
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout()
      .then(() => {
        try {
          const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
          const url = new URL(checkoutUrl);

          let allUtms = {};

          if (typeof window !== "undefined" && window.utmify) {
            try {
              allUtms = window.utmify.getUtms() || {};
              console.log("UTMs from UTMIFY:", allUtms);
            } catch (error) {
              console.warn("Failed to get UTMs from UTMIFY:", error);
            }
          }

          if (Object.keys(allUtms).length === 0) {
            const currentUrl = new URL(window.location.href);
            const utmParams = [
              "utm_source",
              "utm_medium",
              "utm_campaign",
              "utm_content",
              "utm_term",
            ];

            utmParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });

            const otherParams = ["fbclid", "gclid", "ttclid", "src", "xcod"];
            otherParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });
          }

          Object.keys(allUtms).forEach((key) => {
            if (allUtms[key]) {
              url.searchParams.set(key, allUtms[key]);
            }
          });

          if (
            quizResultId &&
            quizResultId !== "offline-mode" &&
            quizResultId !== "admin-mode" &&
            quizResultId !== "bot-mode"
          ) {
            url.searchParams.set("quiz_result_id", quizResultId);
          }

          console.log("Redirecting to checkout:", url.toString());
          localStorage.removeItem("holymind_quiz_state");
          localStorage.setItem("holymind_last_quiz_id", quizResultId);
          window.location.href = url.toString();
        } catch (error) {
          console.error("Erro ao construir URL de checkout:", error);
          window.location.href = CHECKOUT_CONFIG.baseUrl;
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao rastrear checkout, mas redirecionando mesmo assim:",
          error
        );
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      });
  };

  const faqs = [
    {
      question: "Does it really work?",
      answer:
        "We base predictions on the data you provide and recognized compatibility patterns. It’s not guesswork; it’s personalized analysis.",
    },
    {
      question: "I’m skeptical. Is this safe?",
      answer:
        "Your data are encrypted and used only to create your report. You risk nothing with our guarantee.",
    },
    {
      question: "What if I’m already in a relationship?",
      answer:
        "The report shows compatibility with your current partner and clarifies your future.",
    },
    {
      question: "Is the portrait real?",
      answer:
        "It’s a representation generated from the most likely characteristics. Users report striking similarities.",
    },
    {
      question: "Can I cancel?",
      answer:
        "Yes. The report is a one-time purchase; the monthly subscription can be canceled at any time.",
    },
  ];

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar:
        "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center py-8 max-w-3xl mx-auto px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 px-4">
            Your Birth Chart Reading Is Ready!
          </h2>

          <h1 className="text-purple-600 mb-4 text-xl font-semibold md:text-2xl leading-tight px-4 uppercase tracking-wide">
            HERE&apos;S YOUR SOULMATE&apos;S DRAWING
          </h1>

          {/* Imagem do desenho */}
          <div className="mb-6">
            <img
              src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759873292152-ltl34v44ham.png"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div>

          {/* PITCH DE PREÇO */}
          <Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
            <CardContent className="p-6 space-y-4">
              {/* Título centralizado */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
                Discover the face of your soulmate with the Auraly App.
              </h3>

              {/* Imagem menor e centralizada */}
              <div className="w-full flex justify-center mb-2">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png"
                  alt="Soulmate Offer Highlight"
                  className="w-[55%] max-w-xs mx-auto rounded-xl"
                />
              </div>

              {/* Bullets */}
              <ul className="space-y-2 text-sm md:text-base text-gray-800">
                <li>
                  ✍️ <strong>Ultra-realistic</strong> hand-drawn sketch of your
                  soulmate, made by Master Aura.
                </li>
                <li>
                  💫 <strong>Uncover exclusive personality traits</strong> only
                  your soulmate has.
                </li>
                <li>
                  🗓️ <strong>Date and context</strong> most favorable for the
                  meeting.
                </li>
                <li>
                  🔮 <strong>Receive deep, personalized insights</strong> into
                  your love life.
                </li>
              </ul>

              {/* Bônus */}
              <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Synchronicity Calendar (From
                  $19, free)
                </p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Emotional Healing Guide (From
                  $9, free)
                </p>
              </div>

              {/* Texto antes do preço */}
              <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800 text-center">
                <p>
                  All this for a <strong>symbolic price</strong> to finally
                  discover who your true love is.
                </p>
              </div>

              {/* CARD DE PREÇO */}
              <div className="max-w-md mx-auto mt-2">
                <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
                  {/* Topo Roxo */}
                  <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
                    Special offer
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 space-y-4">
                    {/* Texto principal */}
                    <p className="text-center text-lg font-semibold text-gray-900">
                      Personalized reading for{" "}
                      <span className="text-gray-500 line-through font-normal">
                        $19
                      </span>
                    </p>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2"></div>

                    {/* Total today */}
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
                        <span>Total today:</span>
                        <span className="text-green-600 text-xl font-extrabold">
                          $19
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-12 rounded-full text-lg md:text-xl shadow-2xl transform transition-all duration-300 hover:scale-105 leading-tight"
            style={{ minHeight: "70px" }}
          >
            <span className="block text-center leading-tight">
              Get your soulmate drawing now.
            </span>
          </button>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto px-0 py-4"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.2 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <h4 className="font-bold text-gray-800 text-xl">
                        {testimonial.title}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              FAQ
            </h2>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full py-3 flex items-center justify-between gap-2"
                    >
                      <span className="text-sm md:text-base text-gray-800 font-semibold">
                        {item.question}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3 px-1">
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
Se ainda der erro depois disso, aí quase certeza que é:

caminho de import (@/components/ui/card, HybridQuizResult, useTracking)

ou o arquivo está como .js num projeto TypeScript com configs mais rígidas

Mas estruturalmente o JSX agora está redondo.
Quer que a gente faça uma versão B desse paywall depois que isso compilar?

Você disse:
acima do discover the face coloque uma imagem src: https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/zlmLXK5905984.png
O ChatGPT disse:
Show, bora direto no código.

Aqui está o PITCH DE PREÇO com a nova imagem acima do “Discover the face…”, mantendo o resto igual:

{/* PITCH DE PREÇO */}
<Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
  <CardContent className="p-6 space-y-4">

    {/* Imagem nova acima do título */}
    <div className="w-full flex justify-center mb-3">
      <img
        src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/zlmLXK5905984.png"
        alt="Auraly App Preview"
        className="w-full max-w-md mx-auto rounded-xl"
      />
    </div>

    {/* Título centralizado */}
    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
      Discover the face of your soulmate with the Auraly App.
    </h3>

    {/* Imagem menor e centralizada */}
    <div className="w-full flex justify-center mb-2">
      <img
        src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png"
        alt="Soulmate Offer Highlight"
        className="w-[55%] max-w-xs mx-auto rounded-xl"
      />
    </div>

    {/* Bullets */}
    <ul className="space-y-2 text-sm md:text-base text-gray-800">
      <li>
        ✍️ <strong>Ultra-realistic</strong> hand-drawn sketch of your
        soulmate, made by Master Aura.
      </li>
      <li>
        💫 <strong>Uncover exclusive personality traits</strong> only your
        soulmate has.
      </li>
      <li>
        🗓️ <strong>Date and context</strong> most favorable for the meeting.
      </li>
      <li>
        🔮 <strong>Receive deep, personalized insights</strong> into your love
        life.
      </li>
    </ul>

    {/* Bônus */}
    <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
      <p>
        🎁 <strong>Free Bonus:</strong> Synchronicity Calendar (From $19,
        free)
      </p>
    </div>

    <div className="bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
      <p>
        🎁 <strong>Free Bonus:</strong> Emotional Healing Guide (From $9,
        free)
      </p>
    </div>

    {/* Texto antes do preço */}
    <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800 text-center">
      <p>
        All this for a <strong>symbolic price</strong> to finally discover
        who your true love is.
      </p>
    </div>

    {/* CARD DE PREÇO */}
    <div className="max-w-md mx-auto mt-2">
      <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
        {/* Topo Roxo */}
        <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
          Special offer
        </div>

        {/* Conteúdo */}
        <div className="p-5 space-y-4">
          {/* Texto principal */}
          <p className="text-center text-lg font-semibold text-gray-900">
            Personalized reading for{" "}
            <span className="text-gray-500 line-through font-normal">
              $19
            </span>
          </p>

          {/* Divider */}
          <div className="border-t border-gray-200 my-2"></div>

          {/* Total today */}
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
              <span>Total today:</span>
              <span className="text-green-600 text-xl font-extrabold">
                $19
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </CardContent>
</Card>
É só trocar esse bloco dentro do componente.
Se quiser, a gente pode testar tirar a segunda imagem (a menor) e deixar só a nova hero em cima pra ficar mais clean. Quer enxugar ou deixar mais “stacked” mesmo?

Você disse:
coloque essa imagem bem menor. mande somente codigo dela
O ChatGPT disse:
Aqui está somente o código da imagem, agora bem menor, ideal para ficar sutil acima do título:

<div className="w-full flex justify-center mb-3">
  <img
    src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/zlmLXK5905984.png"
    alt="Auraly App Preview"
    className="w-[35%] max-w-[120px] mx-auto rounded-xl"
  />
</div>
Se quiser ainda menor ou com borda mais suave, só avisar.

Você disse:
Imagem carregada
o CTA:   {/* CTA */}
          <button
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-12 rounded-full text-lg md:text-xl shadow-2xl transform transition-all duration-300 hover:scale-105 leading-tight"
            style={{ minHeight: "70px" }}
          >
            <span className="block text-center leading-tight">
              Get your soulmate drawing now.
            </span>
          </button> coloque um botao igual esse da imagem anexada, mas na cor verde
O ChatGPT disse:
Aqui está o CTA exatamente igual ao modelo da imagem, porém na cor verde, com cantos arredondados, altura correta e fonte centralizada:

<button
  onClick={handleCheckout}
  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
>
  GET MY RESULTS
</button>
Se quiser deixar mais largo, mais arredondado ou com sombra suave igual app-style, é só pedir. Quer ajustar mais?

Você disse:
onde esta o erro: import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

export default function PaywallStep({ userName, birthDate, quizResultId }) {
  const { trackEndQuiz } = useTracking();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (
      quizResultId &&
      quizResultId !== "offline-mode" &&
      quizResultId !== "admin-mode" &&
      quizResultId !== "bot-mode"
    ) {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(
        (e) => console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    trackEndQuiz();

    const trackCheckout = async () => {
      if (
        quizResultId &&
        quizResultId !== "offline-mode" &&
        quizResultId !== "admin-mode" &&
        quizResultId !== "bot-mode"
      ) {
        try {
          await HybridQuizResult.update(quizResultId, {
            checkout_step_clicked: true,
          });
          console.log("Checkout click tracked successfully");
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout()
      .then(() => {
        try {
          const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
          const url = new URL(checkoutUrl);

          let allUtms = {};

          if (typeof window !== "undefined" && window.utmify) {
            try {
              allUtms = window.utmify.getUtms() || {};
              console.log("UTMs from UTMIFY:", allUtms);
            } catch (error) {
              console.warn("Failed to get UTMs from UTMIFY:", error);
            }
          }

          if (Object.keys(allUtms).length === 0) {
            const currentUrl = new URL(window.location.href);
            const utmParams = [
              "utm_source",
              "utm_medium",
              "utm_campaign",
              "utm_content",
              "utm_term",
            ];

            utmParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });

            const otherParams = ["fbclid", "gclid", "ttclid", "src", "xcod"];
            otherParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });
          }

          Object.keys(allUtms).forEach((key) => {
            if (allUtms[key]) {
              url.searchParams.set(key, allUtms[key]);
            }
          });

          if (
            quizResultId &&
            quizResultId !== "offline-mode" &&
            quizResultId !== "admin-mode" &&
            quizResultId !== "bot-mode"
          ) {
            url.searchParams.set("quiz_result_id", quizResultId);
          }

          console.log("Redirecting to checkout:", url.toString());
          localStorage.removeItem("holymind_quiz_state");
          localStorage.setItem("holymind_last_quiz_id", quizResultId);
          window.location.href = url.toString();
        } catch (error) {
          console.error("Erro ao construir URL de checkout:", error);
          window.location.href = CHECKOUT_CONFIG.baseUrl;
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao rastrear checkout, mas redirecionando mesmo assim:",
          error
        );
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      });
  };

  const faqs = [
    {
      question: "Does it really work?",
      answer:
        "We base predictions on the data you provide and recognized compatibility patterns. It’s not guesswork; it’s personalized analysis.",
    },
    {
      question: "I’m skeptical. Is this safe?",
      answer:
        "Your data are encrypted and used only to create your report. You risk nothing with our guarantee.",
    },
    {
      question: "What if I’m already in a relationship?",
      answer:
        "The report shows compatibility with your current partner and clarifies your future.",
    },
    {
      question: "Is the portrait real?",
      answer:
        "It’s a representation generated from the most likely characteristics. Users report striking similarities.",
    },
    {
      question: "Can I cancel?",
      answer:
        "Yes. The report is a one-time purchase; the monthly subscription can be canceled at any time.",
    },
  ];

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar:
        "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center py-8 max-w-3xl mx-auto px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 px-4">
            Your Birth Chart Reading Is Ready!
          </h2>

          <h1 className="text-purple-600 mb-4 text-xl font-semibold md:text-2xl leading-tight px-4 uppercase tracking-wide">
            HERE&apos;S YOUR SOULMATE&apos;S DRAWING
          </h1>

          {/* Imagem do desenho */}
          <div className="mb-6">
            <img
              src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759873292152-ltl34v44ham.png"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div>

          {/* PITCH DE PREÇO */}
          <Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
            <CardContent className="p-6 space-y-4">
               {/* Imagem nova acima do título */}
<div className="w-full flex justify-center mb-3">
  <img
    src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/zlmLXK5905984.png"
    alt="Auraly App Preview"
    className="w-[35%] max-w-[120px] mx-auto rounded-xl"
  />
</div>

              {/* Título centralizado */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
                Discover the face of your soulmate with the Auraly App.
              </h3>

              {/* Imagem menor e centralizada */}
              <div className="w-full flex justify-center mb-2">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png"
                  alt="Soulmate Offer Highlight"
                  className="w-[55%] max-w-xs mx-auto rounded-xl"
                />
              </div>

              {/* Bullets */}
              <ul className="space-y-2 text-sm md:text-base text-gray-800">
                <li>
                  ✍️ <strong>Ultra-realistic</strong> hand-drawn sketch of your
                  soulmate, made by Master Aura.
                </li>
                <li>
                  💫 <strong>Uncover exclusive personality traits</strong> only
                  your soulmate has.
                </li>
                <li>
                  🗓️ <strong>Date and context</strong> most favorable for the
                  meeting.
                </li>
                <li>
                  🔮 <strong>Receive deep, personalized insights</strong> into
                  your love life.
                </li>
              </ul>

              {/* Bônus */}
              <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Synchronicity Calendar (From
                  $19, free)
                </p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Emotional Healing Guide (From
                  $9, free)
                </p>
              </div>

              {/* Texto antes do preço */}
              <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800 text-center">
                <p>
                  All this for a <strong>symbolic price</strong> to finally
                  discover who your true love is.
                </p>
              </div>

              {/* CARD DE PREÇO */}
              <div className="max-w-md mx-auto mt-2">
                <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
                  {/* Topo Roxo */}
                  <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
                    Special offer 50% OFF Today
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 space-y-4">
                    {/* Texto principal */}
                    <p className="text-center text-lg font-semibold text-gray-900">
                      The original price is{" "}
                      <span className="text-gray-500 line-through font-normal">
                        $29
                      </span>
                    </p>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2"></div>

                    {/* Total today */}
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
                        <span>Total today 50% OFF:</span>
                        <span className="text-green-600 text-xl font-extrabold">
                          $19
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        <button
  onClick={handleCheckout}
  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
>
  GET MY RESULTS
</button>
<div className="w-full flex justify-center mb-3">
  <img
    src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/MqWQAB5264462.png"
    alt="Auraly App Preview"
    className="w-[35%] max-w-[120px] mx-auto rounded-xl"
  />
</div>
<div className="max-w-2xl mx-auto mt-0 px-4">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            By accepting this offer, you agree to start a 30-day trial on the Auraly App.
            After the trial period ends, your subscription will automatically renew for just $29/m.
            You may cancel anytime by contacting us at contact@auralyapp.com
          </p>
  </div>
            {/* Imagem nova acima do título */}
    <div className="w-full flex justify-center mb-3">
      <img
        src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/YuivNF7917669.png"
        alt="Auraly App Preview"
        className="w-full max-w-md mx-auto rounded-xl"
      />
          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto px-0 py-4"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.2 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <h4 className="font-bold text-gray-800 text-xl">
                        {testimonial.title}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              FAQ
            </h2>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full py-3 flex items-center justify-between gap-2"
                    >
                      <span className="text-sm md:text-base text-gray-800 font-semibold">
                        {item.question}
                      </span>
                      <ChevronRight
                        className={w-4 h-4 text-gray-500 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3 px-1">
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
O ChatGPT disse:

Pensou por 27s
O erro tá bem no finalzinho, na região depois do texto de termos e antes do Social Proof.

Você abriu essa <div>:

{/* Imagem nova acima do título */}
<div className="w-full flex justify-center mb-3">
  <img
    src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/YuivNF7917669.png"
    alt="Auraly App Preview"
    className="w-full max-w-md mx-auto rounded-xl"
  />
…e nunca fechou (</div>). Em seguida você já entra no:

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            ...
Isso quebra o JSX.

Arruma assim:

<button
  onClick={handleCheckout}
  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
>
  GET MY RESULTS
</button>

<div className="w-full flex justify-center mb-3">
  <img
    src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/MqWQAB5264462.png"
    alt="Auraly App Preview"
    className="w-[35%] max-w-[120px] mx-auto rounded-xl"
  />
</div>

<div className="max-w-2xl mx-auto mt-0 px-4">
  <p className="text-xs text-gray-500 text-center leading-relaxed">
    By accepting this offer, you agree to start a 30-day trial on the Auraly App.
    After the trial period ends, your subscription will automatically renew for just $29/m.
    You may cancel anytime by contacting us at contact@auralyapp.com
  </p>
</div>

{/* Imagem nova acima do título */}
<div className="w-full flex justify-center mb-3">
  <img
    src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/YuivNF7917669.png"
    alt="Auraly App Preview"
    className="w-full max-w-md mx-auto rounded-xl"
  />
</div>

{/* Social Proof */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="w-full max-w-4xl mx-auto px-0 py-4"
>
  ...
</motion.div>
Fechando essa <div> extra o JSX volta a compilar normal.
Se ainda der erro depois disso, me manda exatamente a mensagem do compilador que eu destrincho linha por linha. Quer que eu limpe e compacte esse componente inteiro depois?

Você disse:
mande todo, ainda com erro: import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

export default function PaywallStep({ userName, birthDate, quizResultId }) {
  const { trackEndQuiz } = useTracking();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (
      quizResultId &&
      quizResultId !== "offline-mode" &&
      quizResultId !== "admin-mode" &&
      quizResultId !== "bot-mode"
    ) {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(
        (e) => console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    trackEndQuiz();

    const trackCheckout = async () => {
      if (
        quizResultId &&
        quizResultId !== "offline-mode" &&
        quizResultId !== "admin-mode" &&
        quizResultId !== "bot-mode"
      ) {
        try {
          await HybridQuizResult.update(quizResultId, {
            checkout_step_clicked: true,
          });
          console.log("Checkout click tracked successfully");
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout()
      .then(() => {
        try {
          const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
          const url = new URL(checkoutUrl);

          let allUtms = {};

          if (typeof window !== "undefined" && window.utmify) {
            try {
              allUtms = window.utmify.getUtms() || {};
              console.log("UTMs from UTMIFY:", allUtms);
            } catch (error) {
              console.warn("Failed to get UTMs from UTMIFY:", error);
            }
          }

          if (Object.keys(allUtms).length === 0) {
            const currentUrl = new URL(window.location.href);
            const utmParams = [
              "utm_source",
              "utm_medium",
              "utm_campaign",
              "utm_content",
              "utm_term",
            ];

            utmParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });

            const otherParams = ["fbclid", "gclid", "ttclid", "src", "xcod"];
            otherParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });
          }

          Object.keys(allUtms).forEach((key) => {
            if (allUtms[key]) {
              url.searchParams.set(key, allUtms[key]);
            }
          });

          if (
            quizResultId &&
            quizResultId !== "offline-mode" &&
            quizResultId !== "admin-mode" &&
            quizResultId !== "bot-mode"
          ) {
            url.searchParams.set("quiz_result_id", quizResultId);
          }

          console.log("Redirecting to checkout:", url.toString());
          localStorage.removeItem("holymind_quiz_state");
          localStorage.setItem("holymind_last_quiz_id", quizResultId);
          window.location.href = url.toString();
        } catch (error) {
          console.error("Erro ao construir URL de checkout:", error);
          window.location.href = CHECKOUT_CONFIG.baseUrl;
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao rastrear checkout, mas redirecionando mesmo assim:",
          error
        );
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      });
  };

  const faqs = [
    {
      question: "Does it really work?",
      answer:
        "We base predictions on the data you provide and recognized compatibility patterns. It’s not guesswork; it’s personalized analysis.",
    },
    {
      question: "I’m skeptical. Is this safe?",
      answer:
        "Your data are encrypted and used only to create your report. You risk nothing with our guarantee.",
    },
    {
      question: "What if I’m already in a relationship?",
      answer:
        "The report shows compatibility with your current partner and clarifies your future.",
    },
    {
      question: "Is the portrait real?",
      answer:
        "It’s a representation generated from the most likely characteristics. Users report striking similarities.",
    },
    {
      question: "Can I cancel?",
      answer:
        "Yes. The report is a one-time purchase; the monthly subscription can be canceled at any time.",
    },
  ];

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar:
        "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center py-8 max-w-3xl mx-auto px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 px-4">
            Your Birth Chart Reading Is Ready!
          </h2>

          <h1 className="text-purple-600 mb-4 text-xl font-semibold md:text-2xl leading-tight px-4 uppercase tracking-wide">
            HERE&apos;S YOUR SOULMATE&apos;S DRAWING
          </h1>

          {/* Imagem do desenho */}
          <div className="mb-6">
            <img
              src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759873292152-ltl34v44ham.png"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div>

          {/* PITCH DE PREÇO */}
          <Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
            <CardContent className="p-6 space-y-4">
               {/* Imagem nova acima do título */}
<div className="w-full flex justify-center mb-3">
  <img
    src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/zlmLXK5905984.png"
    alt="Auraly App Preview"
    className="w-[35%] max-w-[120px] mx-auto rounded-xl"
  />
</div>

              {/* Título centralizado */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
                Discover the face of your soulmate with the Auraly App.
              </h3>

              {/* Imagem menor e centralizada */}
              <div className="w-full flex justify-center mb-2">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png"
                  alt="Soulmate Offer Highlight"
                  className="w-[55%] max-w-xs mx-auto rounded-xl"
                />
              </div>

              {/* Bullets */}
              <ul className="space-y-2 text-sm md:text-base text-gray-800">
                <li>
                  ✍️ <strong>Ultra-realistic</strong> hand-drawn sketch of your
                  soulmate, made by Master Aura.
                </li>
                <li>
                  💫 <strong>Uncover exclusive personality traits</strong> only
                  your soulmate has.
                </li>
                <li>
                  🗓️ <strong>Date and context</strong> most favorable for the
                  meeting.
                </li>
                <li>
                  🔮 <strong>Receive deep, personalized insights</strong> into
                  your love life.
                </li>
              </ul>

              {/* Bônus */}
              <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Synchronicity Calendar (From
                  $19, free)
                </p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Emotional Healing Guide (From
                  $9, free)
                </p>
              </div>

              {/* Texto antes do preço */}
              <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800 text-center">
                <p>
                  All this for a <strong>symbolic price</strong> to finally
                  discover who your true love is.
                </p>
              </div>

              {/* CARD DE PREÇO */}
              <div className="max-w-md mx-auto mt-2">
                <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
                  {/* Topo Roxo */}
                  <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
                    Special offer 50% OFF Today
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 space-y-4">
                    {/* Texto principal */}
                    <p className="text-center text-lg font-semibold text-gray-900">
                      The original price is{" "}
                      <span className="text-gray-500 line-through font-normal">
                        $29
                      </span>
                    </p>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2"></div>

                    {/* Total today */}
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
                        <span>Total today 50% OFF:</span>
                        <span className="text-green-600 text-xl font-extrabold">
                          $19
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

       <button
  onClick={handleCheckout}
  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
>
  GET MY RESULTS
</button>

<div className="w-full flex justify-center mb-3">
  <img
    src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/MqWQAB5264462.png"
    alt="Auraly App Preview"
    className="w-[35%] max-w-[120px] mx-auto rounded-xl"
  />
</div>

<div className="max-w-2xl mx-auto mt-0 px-4">
  <p className="text-xs text-gray-500 text-center leading-relaxed">
    By accepting this offer, you agree to start a 30-day trial on the Auraly App.
    After the trial period ends, your subscription will automatically renew for just $29/m.
    You may cancel anytime by contacting us at contact@auralyapp.com
  </p>
</div>

{/* Imagem nova acima do título */}
<div className="w-full flex justify-center mb-3">
  <img
    src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/YuivNF7917669.png"
    alt="Auraly App Preview"
    className="w-full max-w-md mx-auto rounded-xl"
  />
</div>
          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto px-0 py-4"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.2 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <h4 className="font-bold text-gray-800 text-xl">
                        {testimonial.title}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              FAQ
            </h2>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full py-3 flex items-center justify-between gap-2"
                    >
                      <span className="text-sm md:text-base text-gray-800 font-semibold">
                        {item.question}
                      </span>
                      <ChevronRight
                        className={w-4 h-4 text-gray-500 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3 px-1">
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
O ChatGPT disse:

Pensou por 32s
Vamos limpar tudo e te mandar o componente inteiro já corrigido, com JSX fechado certinho e mantendo tudo o que você pediu (pitch, CTA verde, imagens, social proof e FAQ).

Usa esse código no lugar do atual:

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

export default function PaywallStep({ userName, birthDate, quizResultId }) {
  const { trackEndQuiz } = useTracking();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (
      quizResultId &&
      quizResultId !== "offline-mode" &&
      quizResultId !== "admin-mode" &&
      quizResultId !== "bot-mode"
    ) {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(
        (e) => console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    trackEndQuiz();

    const trackCheckout = async () => {
      if (
        quizResultId &&
        quizResultId !== "offline-mode" &&
        quizResultId !== "admin-mode" &&
        quizResultId !== "bot-mode"
      ) {
        try {
          await HybridQuizResult.update(quizResultId, {
            checkout_step_clicked: true,
          });
          console.log("Checkout click tracked successfully");
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout()
      .then(() => {
        try {
          const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
          const url = new URL(checkoutUrl);

          let allUtms = {};

          if (typeof window !== "undefined" && (window as any).utmify) {
            try {
              allUtms = (window as any).utmify.getUtms() || {};
              console.log("UTMs from UTMIFY:", allUtms);
            } catch (error) {
              console.warn("Failed to get UTMs from UTMIFY:", error);
            }
          }

          if (Object.keys(allUtms).length === 0) {
            const currentUrl = new URL(window.location.href);
            const utmParams = [
              "utm_source",
              "utm_medium",
              "utm_campaign",
              "utm_content",
              "utm_term",
            ];

            utmParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                (allUtms as any)[param] = value;
              }
            });

            const otherParams = ["fbclid", "gclid", "ttclid", "src", "xcod"];
            otherParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                (allUtms as any)[param] = value;
              }
            });
          }

          Object.keys(allUtms).forEach((key) => {
            if ((allUtms as any)[key]) {
              url.searchParams.set(key, (allUtms as any)[key]);
            }
          });

          if (
            quizResultId &&
            quizResultId !== "offline-mode" &&
            quizResultId !== "admin-mode" &&
            quizResultId !== "bot-mode"
          ) {
            url.searchParams.set("quiz_result_id", quizResultId);
          }

          console.log("Redirecting to checkout:", url.toString());
          localStorage.removeItem("holymind_quiz_state");
          localStorage.setItem("holymind_last_quiz_id", quizResultId);
          window.location.href = url.toString();
        } catch (error) {
          console.error("Erro ao construir URL de checkout:", error);
          window.location.href = CHECKOUT_CONFIG.baseUrl;
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao rastrear checkout, mas redirecionando mesmo assim:",
          error
        );
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      });
  };

  const faqs = [
    {
      question: "Does it really work?",
      answer:
        "We base predictions on the data you provide and recognized compatibility patterns. It’s not guesswork; it’s personalized analysis.",
    },
    {
      question: "I’m skeptical. Is this safe?",
      answer:
        "Your data are encrypted and used only to create your report. You risk nothing with our guarantee.",
    },
    {
      question: "What if I’m already in a relationship?",
      answer:
        "The report shows compatibility with your current partner and clarifies your future.",
    },
    {
      question: "Is the portrait real?",
      answer:
        "It’s a representation generated from the most likely characteristics. Users report striking similarities.",
    },
    {
      question: "Can I cancel?",
      answer:
        "Yes. The report is a one-time purchase; the monthly subscription can be canceled at any time.",
    },
  ];

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar:
        "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center py-8 max-w-3xl mx-auto px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 px-4">
            Your Birth Chart Reading Is Ready!
          </h2>

          <h1 className="text-purple-600 mb-4 text-xl font-semibold md:text-2xl leading-tight px-4 uppercase tracking-wide">
            HERE&apos;S YOUR SOULMATE&apos;S DRAWING
          </h1>

          {/* Imagem do desenho */}
          <div className="mb-6">
            <img
              src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759873292152-ltl34v44ham.png"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div>

          {/* PITCH DE PREÇO */}
          <Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
            <CardContent className="p-6 space-y-4">
              {/* Imagem pequena acima do título */}
              <div className="w-full flex justify-center mb-3">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/zlmLXK5905984.png"
                  alt="Auraly App Preview"
                  className="w-[35%] max-w-[120px] mx-auto rounded-xl"
                />
              </div>

              {/* Título centralizado */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
                Discover the face of your soulmate with the Auraly App.
              </h3>

              {/* Imagem menor e centralizada */}
              <div className="w-full flex justify-center mb-2">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png"
                  alt="Soulmate Offer Highlight"
                  className="w-[55%] max-w-xs mx-auto rounded-xl"
                />
              </div>

              {/* Bullets */}
              <ul className="space-y-2 text-sm md:text-base text-gray-800">
                <li>
                  ✍️ <strong>Ultra-realistic</strong> hand-drawn sketch of your
                  soulmate, made by Master Aura.
                </li>
                <li>
                  💫 <strong>Uncover exclusive personality traits</strong> only
                  your soulmate has.
                </li>
                <li>
                  🗓️ <strong>Date and context</strong> most favorable for the
                  meeting.
                </li>
                <li>
                  🔮 <strong>Receive deep, personalized insights</strong> into
                  your love life.
                </li>
              </ul>

              {/* Bônus */}
              <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Synchronicity Calendar (From
                  $19, free)
                </p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Emotional Healing Guide (From
                  $9, free)
                </p>
              </div>

              {/* Texto antes do preço */}
              <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800 text-center">
                <p>
                  All this for a <strong>symbolic price</strong> to finally
                  discover who your true love is.
                </p>
              </div>

              {/* CARD DE PREÇO */}
              <div className="max-w-md mx-auto mt-2">
                <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
                  {/* Topo Roxo */}
                  <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
                    Special offer 50% OFF Today
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 space-y-4">
                    {/* Texto principal */}
                    <p className="text-center text-lg font-semibold text-gray-900">
                      The original price is{" "}
                      <span className="text-gray-500 line-through font-normal">
                        $29
                      </span>
                    </p>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2" />

                    {/* Total today */}
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
                        <span>Total today 50% OFF:</span>
                        <span className="text-green-600 text-xl font-extrabold">
                          $19
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
          >
            GET MY RESULTS
          </button>

          {/* Badge/garantia verde abaixo do botão */}
          <div className="w-full flex justify-center mb-3 mt-4">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/MqWQAB5264462.png"
              alt="Guarantee Badge"
              className="w-[35%] max-w-[120px] mx-auto rounded-xl"
            />
          </div>

          {/* Texto de trial */}
          <div className="max-w-2xl mx-auto mt-0 px-4">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By accepting this offer, you agree to start a 30-day trial on the
              Auraly App. After the trial period ends, your subscription will
              automatically renew for just $29/m. You may cancel anytime by
              contacting us at contact@auralyapp.com
            </p>
          </div>

          {/* Imagem grande abaixo do texto */}
          <div className="w-full flex justify-center mb-3 mt-4">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/YuivNF7917669.png"
              alt="Auraly App Preview"
              className="w-full max-w-md mx-auto rounded-xl"
            />
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto px-0 py-4"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.2 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <h4 className="font-bold text-gray-800 text-xl">
                        {testimonial.title}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              FAQ
            </h2>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full py-3 flex items-center justify-between gap-2"
                    >
                      <span className="text-sm md:text-base text-gray-800 font-semibold">
                        {item.question}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3 px-1">
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
Agora não tem div faltando nem JSX solto.
Se ainda aparecer erro, provavelmente vai ser mensagem de TypeScript (tipo do window ou do openFaqIndex); aí me manda a mensagem exata do console/terminal que eu ajusto em cima dela.

Quer que eu faça uma versão “lite” desse mesmo paywall pra testar A/B depois?

Você disse:
Imagem carregada
aproxime o by accepting do icon de segure.  sepae mais o Trusted By Over 1,000,000 Transformed Lives do disclaimer de by accepting e aproxime mais da imagens abaixo:   {/* Badge/garantia verde abaixo do botão */}
          <div className="w-full flex justify-center mb-3 mt-4">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/MqWQAB5264462.png"
              alt="Guarantee Badge"
              className="w-[35%] max-w-[120px] mx-auto rounded-xl"
            />
          </div>

          {/* Texto de trial */}
          <div className="max-w-2xl mx-auto mt-8 px-4">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By accepting this offer, you agree to start a 30-day trial on the
              Auraly App. After the trial period ends, your subscription will
              automatically renew for just $29/m. You may cancel anytime by
              contacting us at contact@auralyapp.com
            </p>
          </div>
<h2 className="text-2xl md:text-3xl font-bold text-black mb-0 px-4">
            Trusted By Over 1,000,000 Transformed Lives
          </h2>
          {/* Imagem grande abaixo do texto */}
          <div className="w-full flex justify-center mb-3 mt-4">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/YuivNF7917669.png"
              alt="Auraly App Preview"
              className="w-full max-w-md mx-auto rounded-xl"
            />
          </div>
O ChatGPT disse:

Pensou por 10s
Troca esse bloco pelo abaixo:

{/* Badge/garantia verde abaixo do botão */}
<div className="w-full flex justify-center mb-2 mt-4">
  <img
    src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/MqWQAB5264462.png"
    alt="Guarantee Badge"
    className="w-[35%] max-w-[120px] mx-auto rounded-xl"
  />
</div>

{/* Texto de trial – mais perto do ícone */}
<div className="max-w-2xl mx-auto mt-2 px-4">
  <p className="text-xs text-gray-500 text-center leading-relaxed">
    By accepting this offer, you agree to start a 30-day trial on the
    Auraly App. After the trial period ends, your subscription will
    automatically renew for just $29/m. You may cancel anytime by
    contacting us at contact@auralyapp.com
  </p>
</div>

{/* Título – mais distante do disclaimer e mais perto da imagem */}
<h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-2 px-4">
  Trusted By Over 1,000,000 Transformed Lives
</h2>

{/* Imagem grande abaixo do texto */}
<div className="w-full flex justify-center mb-3 mt-1">
  <img
    src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/YuivNF7917669.png"
    alt="Auraly App Preview"
    className="w-full max-w-md mx-auto rounded-xl"
  />
</div>
Quer que eu ajuste também para desktop (breakpoints diferentes de spacing)?

Você disse:
Imagem carregada
crie esses 2 icon bullet abaixo das imagens {/* Imagem grande abaixo do texto */}
<div className="w-full flex justify-center mb-3 mt-1">
  <img
    src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/YuivNF7917669.png"
    alt="Auraly App Preview"
    className="w-full max-w-md mx-auto rounded-xl"
  />
</div>
O ChatGPT disse:
Aqui estão os dois bullets exatamente no estilo da imagem, prontos para colar logo abaixo da imagem grande.

🔹 Código completo do bloco de bullets
{/* Bullets de confiança */}
<div className="w-full max-w-md mx-auto mt-4 space-y-4">

  {/* Bullet 1 */}
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
      <img
        src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
        alt="Users icon"
        className="w-6 h-6 opacity-80"
      />
    </div>
    <p className="text-gray-900 text-sm md:text-base">
      <strong>900+ usuários</strong> viram a sua alma gêmea hoje.
    </p>
  </div>

  {/* Bullet 2 */}
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
      <img
        src="https://cdn-icons-png.flaticon.com/512/1380/1380338.png"
        alt="Chat icon"
        className="w-6 h-6 opacity-80"
      />
    </div>

    <div>
      <p className="text-gray-900 text-sm md:text-base">
        Confiado por mais de <strong>25 milhões</strong> de pessoas.
      </p>

      {/* Estrelas */}
      <div className="flex gap-0.5 mt-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-lg">⭐</span>
        ))}
      </div>
    </div>
  </div>

</div>
Se quiser, posso trocar os ícones por versões roxas, verdes ou outline para combinar com o Auraly. Quer outra estética?

Você disse:
Imagem carregada
coloque na cor lilas e retire as estrelas e coloque posicionados a esquerda
O ChatGPT disse:
Aqui está o bloco ajustado:

✔ Ícones lilás
✔ Sem estrelas
✔ Tudo alinhado à esquerda
✔ Mesmo estilo da imagem enviada

Código pronto para substituir:
{/* Bullets de confiança */}
<div className="w-full max-w-md mx-auto mt-4 space-y-4 text-left">

  {/* Bullet 1 */}
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
      <img
        src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
        alt="Users icon"
        className="w-5 h-5 opacity-90"
      />
    </div>

    <p className="text-gray-900 text-sm md:text-base">
      <strong>900+ usuários</strong> viram a sua alma gêmea hoje.
    </p>
  </div>

  {/* Bullet 2 */}
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2462/2462719.png"
        alt="Chat icon"
        className="w-5 h-5 opacity-90"
      />
    </div>

    <p className="text-gray-900 text-sm md:text-base">
      Confiado por mais de <strong>25 milhões</strong> de pessoas.
    </p>
  </div>

</div>
Se quiser deixo os ícones outline, sólido, mais grossos ou no estilo iOS. Quer uma versão alternativa?

Você disse:
esse ta cinza e nao preto, o icon: {/* Bullet 1 */}
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
      <img
        src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
        alt="Users icon"
        className="w-5 h-5 opacity-90"
      />
    </div>
O ChatGPT disse:
Aqui está o mesmo bloco, mas agora com o ícone totalmente preto (sem cinza) — removi o opacity-90 e usei um SVG preto nativo (garante preto 100%):

Código corrigido (ícone preto real):
{/* Bullet 1 */}
<div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
    <img
      src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
      alt="Users icon"
      className="w-5 h-5"
    />
  </div>

  <p className="text-gray-900 text-sm md:text-base">
    <strong>900+ usuários</strong> viram a sua alma gêmea hoje.
  </p>
</div>
Caso queira manter o mesmo ícone original, mas 100% preto:
<img
  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
  alt="Users icon"
  className="w-5 h-5"
  style={{ filter: "invert(0%) brightness(0%)" }}
/>
Esse filter força a cor preta mesmo que o arquivo seja cinza.

Quer que eu aplique isso também no segundo ícone?

Você disse:
verifique onde ta o erro: import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

export default function PaywallStep({ userName, birthDate, quizResultId }) {
  const { trackEndQuiz } = useTracking();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (
      quizResultId &&
      quizResultId !== "offline-mode" &&
      quizResultId !== "admin-mode" &&
      quizResultId !== "bot-mode"
    ) {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(
        (e) => console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    trackEndQuiz();

    const trackCheckout = async () => {
      if (
        quizResultId &&
        quizResultId !== "offline-mode" &&
        quizResultId !== "admin-mode" &&
        quizResultId !== "bot-mode"
      ) {
        try {
          await HybridQuizResult.update(quizResultId, {
            checkout_step_clicked: true,
          });
          console.log("Checkout click tracked successfully");
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout()
      .then(() => {
        try {
          const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
          const url = new URL(checkoutUrl);

          let allUtms = {};

          if (typeof window !== "undefined" && window.utmify) {
            try {
              allUtms = window.utmify.getUtms() || {};
              console.log("UTMs from UTMIFY:", allUtms);
            } catch (error) {
              console.warn("Failed to get UTMs from UTMIFY:", error);
            }
          }

          if (Object.keys(allUtms).length === 0) {
            const currentUrl = new URL(window.location.href);
            const utmParams = [
              "utm_source",
              "utm_medium",
              "utm_campaign",
              "utm_content",
              "utm_term",
            ];

            utmParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });

            const otherParams = ["fbclid", "gclid", "ttclid", "src", "xcod"];
            otherParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });
          }

          Object.keys(allUtms).forEach((key) => {
            if (allUtms[key]) {
              url.searchParams.set(key, allUtms[key]);
            }
          });

          if (
            quizResultId &&
            quizResultId !== "offline-mode" &&
            quizResultId !== "admin-mode" &&
            quizResultId !== "bot-mode"
          ) {
            url.searchParams.set("quiz_result_id", quizResultId);
          }

          console.log("Redirecting to checkout:", url.toString());
          localStorage.removeItem("holymind_quiz_state");
          localStorage.setItem("holymind_last_quiz_id", quizResultId);
          window.location.href = url.toString();
        } catch (error) {
          console.error("Erro ao construir URL de checkout:", error);
          window.location.href = CHECKOUT_CONFIG.baseUrl;
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao rastrear checkout, mas redirecionando mesmo assim:",
          error
        );
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      });
  };

  const faqs = [
    {
      question: "Does it really work?",
      answer:
        "We base predictions on the data you provide and recognized compatibility patterns. It’s not guesswork; it’s personalized analysis.",
    },
    {
      question: "I’m skeptical. Is this safe?",
      answer:
        "Your data are encrypted and used only to create your report. You risk nothing with our guarantee.",
    },
    {
      question: "What if I’m already in a relationship?",
      answer:
        "The report shows compatibility with your current partner and clarifies your future.",
    },
    {
      question: "Is the portrait real?",
      answer:
        "It’s a representation generated from the most likely characteristics. Users report striking similarities.",
    },
    {
      question: "Can I cancel?",
      answer:
        "Yes. The report is a one-time purchase; the monthly subscription can be canceled at any time.",
    },
  ];

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar:
        "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center py-8 max-w-3xl mx-auto px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 px-4">
            Your Birth Chart Reading Is Ready!
          </h2>

          <h1 className="text-purple-600 mb-4 text-xl font-semibold md:text-2xl leading-tight px-4 uppercase tracking-wide">
            HERE&apos;S YOUR SOULMATE&apos;S DRAWING
          </h1>

          {/* Imagem do desenho */}
          <div className="mb-6">
            <img
              src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759873292152-ltl34v44ham.png"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div>

          {/* PITCH DE PREÇO */}
          <Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
            <CardContent className="p-6 space-y-4">
              {/* Imagem pequena acima do título */}
              <div className="w-full flex justify-center mb-3">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/zlmLXK5905984.png"
                  alt="Auraly App Preview"
                  className="w-[35%] max-w-[120px] mx-auto rounded-xl"
                />
              </div>

              {/* Título centralizado */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
                Discover the face of your soulmate with the Auraly App.
              </h3>

              {/* Imagem menor e centralizada */}
              <div className="w-full flex justify-center mb-2">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png"
                  alt="Soulmate Offer Highlight"
                  className="w-[55%] max-w-xs mx-auto rounded-xl"
                />
              </div>

              {/* Bullets */}
              <ul className="space-y-2 text-sm md:text-base text-gray-800">
                <li>
                  ✍️ <strong>Ultra-realistic</strong> hand-drawn sketch of your
                  soulmate, made by Master Aura.
                </li>
                <li>
                  💫 <strong>Uncover exclusive personality traits</strong> only
                  your soulmate has.
                </li>
                <li>
                  🗓️ <strong>Date and context</strong> most favorable for the
                  meeting.
                </li>
                <li>
                  🔮 <strong>Receive deep, personalized insights</strong> into
                  your love life.
                </li>
              </ul>

              {/* Bônus */}
              <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Synchronicity Calendar (From
                  $19, free)
                </p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Emotional Healing Guide (From
                  $9, free)
                </p>
              </div>

              {/* Texto antes do preço */}
              <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800 text-center">
                <p>
                  All this for a <strong>symbolic price</strong> to finally
                  discover who your true love is.
                </p>
              </div>

              {/* CARD DE PREÇO */}
              <div className="max-w-md mx-auto mt-2">
                <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
                  {/* Topo Roxo */}
                  <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
                    Special offer 50% OFF Today
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 space-y-4">
                    {/* Texto principal */}
                    <p className="text-center text-lg font-semibold text-gray-900">
                      The original price is{" "}
                      <span className="text-gray-500 line-through font-normal">
                        $29
                      </span>
                    </p>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2" />

                    {/* Total today */}
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
                        <span>Total today 50% OFF:</span>
                        <span className="text-green-600 text-xl font-extrabold">
                          $19
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
          >
            GET MY RESULTS
          </button>

        {/* Badge/garantia verde abaixo do botão */}
<div className="w-full flex justify-center mb-2 mt-4">
  <img
    src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/MqWQAB5264462.png"
    alt="Guarantee Badge"
    className="w-[35%] max-w-[120px] mx-auto rounded-xl"
  />
</div>

{/* Texto de trial – mais perto do ícone */}
<div className="max-w-2xl mx-auto mt-2 px-4">
  <p className="text-xs text-gray-500 text-center leading-relaxed">
    By accepting this offer, you agree to start a 30-day trial on the
    Auraly App. After the trial period ends, your subscription will
    automatically renew for just $29/m. You may cancel anytime by
    contacting us at contact@auralyapp.com
  </p>
</div>

{/* Título – mais distante do disclaimer e mais perto da imagem */}
<h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-2 px-4">
  Trusted By Over 1,000,000 Transformed Lives
</h2>

{/* Imagem grande abaixo do texto */}
<div className="w-full flex justify-center mb-3 mt-1">
  <img
    src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/YuivNF7917669.png"
    alt="Auraly App Preview"
    className="w-full max-w-md mx-auto rounded-xl"
  />
</div>
{/* Bullets de confiança */}
<div className="w-full max-w-md mx-auto mt-4 space-y-4 text-left">

  {/* Bullet 1 */}
<div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
    <img
      src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
      alt="Users icon"
      className="w-5 h-5"
    />
  </div>

  <p className="text-gray-900 text-sm md:text-base">
    <strong>9200 women</strong> found their soulmate.
  </p>
</div>


  {/* Bullet 2 */}
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2462/2462719.png"
        alt="Chat icon"
        className="w-5 h-5 opacity-90"
      />
    </div>

    <p className="text-gray-900 text-sm md:text-base">
      <strong>Thousands of consultations</strong> carried out
    </p>
  </div>

</div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto px-0 py-4"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.2 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <h4 className="font-bold text-gray-800 text-xl">
                        {testimonial.title}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        {/* CARD DE PREÇO */}
              <div className="max-w-md mx-auto mt-2">
                <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
                  {/* Topo Roxo */}
                  <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
                    Special offer 50% OFF Today
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 space-y-4">
                    {/* Texto principal */}
                    <p className="text-center text-lg font-semibold text-gray-900">
                      The original price is{" "}
                      <span className="text-gray-500 line-through font-normal">
                        $29
                      </span>
                    </p>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2" />

                    {/* Total today */}
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
                        <span>Total today 50% OFF:</span>
                        <span className="text-green-600 text-xl font-extrabold">
                          $19
                        </span>
                      </div>
                    </div>
   {/* CTA */}
          <button
            onClick={handleCheckout}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
          >
            GET MY RESULTS
          </button>
          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              FAQ
            </h2>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full py-3 flex items-center justify-between gap-2"
                    >
                      <span className="text-sm md:text-base text-gray-800 font-semibold">
                        {item.question}
                      </span>
                      <ChevronRight
                        className={w-4 h-4 text-gray-500 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3 px-1">
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
O ChatGPT disse:

Pensou por 23s
O erro está nessa parte final onde você duplicou o card de preço, CTA e FAQ e deixou tags <div> / <button> sem fechamento correto. Isso quebra o JSX.

Abaixo está o arquivo corrigido e limpo, com:

Apenas um card de preço (lá em cima, dentro do <Card>).

CTA + badge + disclaimer + “Trusted by…” + imagem + bullets.

Social proof.

FAQ uma vez só.

Todas as tags fechadas corretamente.

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

export default function PaywallStep({ userName, birthDate, quizResultId }) {
  const { trackEndQuiz } = useTracking();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (
      quizResultId &&
      quizResultId !== "offline-mode" &&
      quizResultId !== "admin-mode" &&
      quizResultId !== "bot-mode"
    ) {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(
        (e) => console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    trackEndQuiz();

    const trackCheckout = async () => {
      if (
        quizResultId &&
        quizResultId !== "offline-mode" &&
        quizResultId !== "admin-mode" &&
        quizResultId !== "bot-mode"
      ) {
        try {
          await HybridQuizResult.update(quizResultId, {
            checkout_step_clicked: true,
          });
          console.log("Checkout click tracked successfully");
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout()
      .then(() => {
        try {
          const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
          const url = new URL(checkoutUrl);

          let allUtms = {};

          if (typeof window !== "undefined" && window.utmify) {
            try {
              allUtms = window.utmify.getUtms() || {};
              console.log("UTMs from UTMIFY:", allUtms);
            } catch (error) {
              console.warn("Failed to get UTMs from UTMIFY:", error);
            }
          }

          if (Object.keys(allUtms).length === 0) {
            const currentUrl = new URL(window.location.href);
            const utmParams = [
              "utm_source",
              "utm_medium",
              "utm_campaign",
              "utm_content",
              "utm_term",
            ];

            utmParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });

            const otherParams = ["fbclid", "gclid", "ttclid", "src", "xcod"];
            otherParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });
          }

          Object.keys(allUtms).forEach((key) => {
            if (allUtms[key]) {
              url.searchParams.set(key, allUtms[key]);
            }
          });

          if (
            quizResultId &&
            quizResultId !== "offline-mode" &&
            quizResultId !== "admin-mode" &&
            quizResultId !== "bot-mode"
          ) {
            url.searchParams.set("quiz_result_id", quizResultId);
          }

          console.log("Redirecting to checkout:", url.toString());
          localStorage.removeItem("holymind_quiz_state");
          localStorage.setItem("holymind_last_quiz_id", quizResultId);
          window.location.href = url.toString();
        } catch (error) {
          console.error("Erro ao construir URL de checkout:", error);
          window.location.href = CHECKOUT_CONFIG.baseUrl;
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao rastrear checkout, mas redirecionando mesmo assim:",
          error
        );
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      });
  };

  const faqs = [
    {
      question: "Does it really work?",
      answer:
        "We base predictions on the data you provide and recognized compatibility patterns. It’s not guesswork; it’s personalized analysis.",
    },
    {
      question: "I’m skeptical. Is this safe?",
      answer:
        "Your data are encrypted and used only to create your report. You risk nothing with our guarantee.",
    },
    {
      question: "What if I’m already in a relationship?",
      answer:
        "The report shows compatibility with your current partner and clarifies your future.",
    },
    {
      question: "Is the portrait real?",
      answer:
        "It’s a representation generated from the most likely characteristics. Users report striking similarities.",
    },
    {
      question: "Can I cancel?",
      answer:
        "Yes. The report is a one-time purchase; the monthly subscription can be canceled at any time.",
    },
  ];

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar:
        "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center py-8 max-w-3xl mx-auto px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 px-4">
            Your Birth Chart Reading Is Ready!
          </h2>

          <h1 className="text-purple-600 mb-4 text-xl font-semibold md:text-2xl leading-tight px-4 uppercase tracking-wide">
            HERE&apos;S YOUR SOULMATE&apos;S DRAWING
          </h1>

          {/* Imagem do desenho */}
          <div className="mb-6">
            <img
              src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759873292152-ltl34v44ham.png"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div>

          {/* PITCH DE PREÇO */}
          <Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
            <CardContent className="p-6 space-y-4">
              {/* Imagem pequena acima do título */}
              <div className="w-full flex justify-center mb-3">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/zlmLXK5905984.png"
                  alt="Auraly App Preview"
                  className="w-[35%] max-w-[120px] mx-auto rounded-xl"
                />
              </div>

              {/* Título centralizado */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
                Discover the face of your soulmate with the Auraly App.
              </h3>

              {/* Imagem menor e centralizada */}
              <div className="w-full flex justify-center mb-2">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png"
                  alt="Soulmate Offer Highlight"
                  className="w-[55%] max-w-xs mx-auto rounded-xl"
                />
              </div>

              {/* Bullets */}
              <ul className="space-y-2 text-sm md:text-base text-gray-800">
                <li>
                  ✍️ <strong>Ultra-realistic</strong> hand-drawn sketch of your
                  soulmate, made by Master Aura.
                </li>
                <li>
                  💫 <strong>Uncover exclusive personality traits</strong> only
                  your soulmate has.
                </li>
                <li>
                  🗓️ <strong>Date and context</strong> most favorable for the
                  meeting.
                </li>
                <li>
                  🔮 <strong>Receive deep, personalized insights</strong> into
                  your love life.
                </li>
              </ul>

              {/* Bônus */}
              <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Synchronicity Calendar (From
                  $19, free)
                </p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Emotional Healing Guide (From
                  $9, free)
                </p>
              </div>

              {/* Texto antes do preço */}
              <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800 text-center">
                <p>
                  All this for a <strong>symbolic price</strong> to finally
                  discover who your true love is.
                </p>
              </div>

              {/* CARD DE PREÇO */}
              <div className="max-w-md mx-auto mt-2">
                <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
                  {/* Topo Roxo */}
                  <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
                    Special offer 50% OFF Today
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 space-y-4">
                    {/* Texto principal */}
                    <p className="text-center text-lg font-semibold text-gray-900">
                      The original price is{" "}
                      <span className="text-gray-500 line-through font-normal">
                        $29
                      </span>
                    </p>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2" />

                    {/* Total today */}
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
                        <span>Total today 50% OFF:</span>
                        <span className="text-green-600 text-xl font-extrabold">
                          $19
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
          >
            GET MY RESULTS
          </button>

          {/* Badge/garantia verde abaixo do botão */}
          <div className="w-full flex justify-center mb-2 mt-4">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/MqWQAB5264462.png"
              alt="Guarantee Badge"
              className="w-[35%] max-w-[120px] mx-auto rounded-xl"
            />
          </div>

          {/* Texto de trial */}
          <div className="max-w-2xl mx-auto mt-2 px-4">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By accepting this offer, you agree to start a 30-day trial on the
              Auraly App. After the trial period ends, your subscription will
              automatically renew for just $29/m. You may cancel anytime by
              contacting us at contact@auralyapp.com
            </p>
          </div>

          {/* Título + imagem grande */}
          <h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-2 px-4">
            Trusted By Over 1,000,000 Transformed Lives
          </h2>

          <div className="w-full flex justify-center mb-3 mt-1">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/YuivNF7917669.png"
              alt="Auraly App Preview"
              className="w-full max-w-md mx-auto rounded-xl"
            />
          </div>

          {/* Bullets de confiança */}
          <div className="w-full max-w-md mx-auto mt-4 space-y-4 text-left">
            {/* Bullet 1 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
                  alt="Users icon"
                  className="w-5 h-5"
                />
              </div>

              <p className="text-gray-900 text-sm md:text-base">
                <strong>9200 women</strong> found their soulmate.
              </p>
            </div>

            {/* Bullet 2 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2462/2462719.png"
                  alt="Chat icon"
                  className="w-5 h-5"
                />
              </div>

              <p className="text-gray-900 text-sm md:text-base">
                <strong>Thousands of consultations</strong> carried out
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto px-0 py-4"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.2 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <h4 className="font-bold text-gray-800 text-xl">
                        {testimonial.title}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              FAQ
            </h2>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full py-3 flex items-center justify-between gap-2"
                    >
                      <span className="text-sm md:text-base text-gray-800 font-semibold">
                        {item.question}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3 px-1">
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
O problema principal era tags JSX desbalanceadas e um segundo card de preço + CTA + FAQ enfiado dentro da hierarquia errada. Com o código acima isso some.

Quer que eu aprofunde mais em como evitar esse tipo de erro de JSX (como sempre conferir pares de tags, indentação, etc.)?

Você disse:
Imagem carregada
eu quero o card de preço e o botao abaixo de social proof
O ChatGPT disse:

Pensou por 15s
Beleza, é só questão de ordem dos blocos.

Hoje o card de preço e o botão estão logo depois do <Card> (pitch) e antes do Social Proof.
Você precisa:

Remover o bloco do card de preço + botão da parte de cima.

Colar esse mesmo bloco logo depois do Social Proof e antes do FAQ.

Segue o trecho já pronto pra você colocar abaixo do Social Proof:

{/* Social Proof */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="w-full max-w-4xl mx-auto px-0 py-4"
>
  <div className="space-y-6">
    <div className="space-y-4">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + index * 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  {testimonial.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {testimonial.date}
                </p>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">
                  ⭐
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-left">
            <h4 className="font-bold text-gray-800 text-xl">
              {testimonial.title}
            </h4>
            <p className="text-gray-600 text-base leading-relaxed">
              {testimonial.text}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</motion.div>

{/* CARD DE PREÇO ABAIXO DO SOCIAL PROOF */}
<div className="max-w-md mx-auto mt-4">
  <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
    {/* Topo Roxo */}
    <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
      Special offer 50% OFF Today
    </div>

    {/* Conteúdo */}
    <div className="p-5 space-y-4">
      {/* Texto principal */}
      <p className="text-center text-lg font-semibold text-gray-900">
        The original price is{" "}
        <span className="text-gray-500 line-through font-normal">
          $29
        </span>
      </p>

      {/* Divider */}
      <div className="border-t border-gray-200 my-2" />

      {/* Total today */}
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
          <span>Total today 50% OFF:</span>
          <span className="text-green-600 text-xl font-extrabold">
            $19
          </span>
        </div>
      </div>
    </div>
  </div>
</div>

{/* CTA ABAIXO DO CARD DE PREÇO */}
<button
  onClick={handleCheckout}
  className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
>
  GET MY RESULTS
</button>

{/* FAQ (mantém depois disso) */}
<div className="max-w-xl mx-auto mt-6 text-left">
  {/* ... resto do FAQ ... */}
</div>
Importante: apaga o card de preço e o botão que estão logo depois do <Card> lá em cima, senão fica duplicado.

Quer que eu reorganize o componente inteiro já com essa ordem final copiada e colável?

Você disse:
Imagem carregada
na parte superior do paywall coloque um card roxo claro centralizado com seguinte texto: Garanta o desenho da sua alma gemea com 50% de desconto e cronometro de 15 minutos . me mande apenas esse codigo
O ChatGPT disse:
Aqui está somente o código do card superior solicitado — roxo claro, centralizado, com texto + contador de 15 minutos:

{/* Top Banner Offer */}
<div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
  <p className="text-sm font-medium">
    Garanta o desenho da sua alma gêmea com <strong>50% de desconto</strong>
  </p>
  <p className="text-xs mt-1">
    Oferta válida pelos próximos <span className="font-bold">15:00</span>
  </p>
</div>
Se quiser que o cronômetro funcione de verdade (contando ao vivo), me avise que eu te mando ele já integrado ao React. Quer que eu coloque o timer real?

Você disse:
coloque em ingles e coloque o cronometro descrescente
O ChatGPT disse:
Aqui está apenas o código do banner em inglês + com cronômetro regressivo real (15 minutos → contando até 00:00).

Coloque isso dentro do componente, antes do return:

// Countdown timer (15 minutes)
const [timeLeft, setTimeLeft] = useState(15 * 60);

useEffect(() => {
  const interval = setInterval(() => {
    setTimeLeft((t) => (t > 0 ? t - 1 : 0));
  }, 1000);

  return () => clearInterval(interval);
}, []);

const minutes = Math.floor(timeLeft / 60);
const seconds = String(timeLeft % 60).padStart(2, "0");
E aqui está apenas o card pronto para colocar no topo do paywall:

{/* Top Banner Offer */}
<div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
  <p className="text-sm font-medium">
    Secure your soulmate sketch with <strong>50% OFF</strong>
  </p>
  <p className="text-xs mt-1">
    Offer ends in <span className="font-bold">{minutes}:{seconds}</span>
  </p>
</div>
Se quiser que eu já encaixe isso no seu código completo, só pedir. Quer que eu coloque exatamente na posição correta do paywall?

Você disse:
coloque completo
O ChatGPT disse:
Perfeito. Aqui está o banner COMPLETO já integrado, pronto para colar no topo do seu <return> — com cronômetro funcionando, estilização em roxo claro, centralizado, igual ao que você pediu.

Inclui toda a lógica + JSX totalmente pronto.

✅ CÓDIGO COMPLETO (INSERIR NO COMPONENTE)
1. Adicione os hooks acima do return
// Countdown timer (15 minutes)
const [timeLeft, setTimeLeft] = useState(15 * 60);

useEffect(() => {
  const interval = setInterval(() => {
    setTimeLeft((t) => (t > 0 ? t - 1 : 0));
  }, 1000);

  return () => clearInterval(interval);
}, []);

const minutes = Math.floor(timeLeft / 60);
const seconds = String(timeLeft % 60).padStart(2, "0");
2. Agora cole ESTE bloco logo após <div className="bg-white min-h-screen"> ou antes do título principal
{/* Top Offer Banner */}
<div className="w-full max-w-3xl mx-auto px-4">
  <div className="bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-md border border-purple-200">
    <p className="text-sm md:text-base font-semibold">
      Secure your soulmate drawing with <strong>50% OFF</strong>
    </p>
    <p className="text-xs md:text-sm mt-1">
      Offer expires in <span className="font-bold">{minutes}:{seconds}</span>
    </p>
  </div>
</div>
🔧 Onde exatamente colocar
Coloque logo abaixo da abertura do layout, assim:

return (
  <div className="bg-white min-h-screen">

    {/* Top Offer Banner */}
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-md border border-purple-200">
        <p className="text-sm md:text-base font-semibold">
          Secure your soulmate drawing with <strong>50% OFF</strong>
        </p>
        <p className="text-xs md:text-sm mt-1">
          Offer expires in <span className="font-bold">{minutes}:{seconds}</span>
        </p>
      </div>
    </div>

    <div className="text-center py-8 max-w-3xl mx-auto px-4 bg-white">
      ...
Se quiser, posso estilizar esse banner exatamente no estilo iOS, mais chamativo, mais premium, ou com barra de progresso animada.
Quer que eu deixe ainda mais bonito?

Você disse:
abaixo desse texto: h2 className="text-2xl md:text-3xl font-bold text-black mb-6 px-4">
            Your drawing is ready
          </h2> acrescente: See your soulmate today! so que na cor roxa t
O ChatGPT disse:
Aqui está somente o código, exatamente como pediu, para colocar logo abaixo do seu <h2>.

✅ CÓDIGO PARA INSERIR
<h2 className="text-2xl md:text-3xl font-bold text-black mb-2 px-4">
  Your drawing is ready
</h2>

<p className="text-purple-600 text-lg font-semibold mb-6 px-4">
  See your soulmate today!
</p>
Pronto, já fica alinhado, estilizado e com espaçamento correto.
Quer que eu incremente com animação suave (fade-in / slide)?

Você disse:
deve fazer parte do mesmo tesxto. mesma font e mesmo tamanho, somente na linha abaixo
O ChatGPT disse:
Perfeito — segue somente o código, mantendo mesma fonte, mesmo tamanho, mesmo peso, apenas mudando a cor para roxo e colocando na linha de baixo:

✅ CÓDIGO EXATO
<h2 className="text-2xl md:text-3xl font-bold px-4 leading-tight mb-6">
  <span className="text-black">Your drawing is ready</span>
  <br />
  <span className="text-purple-600">See your soulmate today!</span>
</h2>
Fica tudo como um único título, visualmente contínuo, só mudando a cor da segunda linha. Quer ajustar o tom do roxo?

Você disse:
crie um card animado e personalizado com informações precisas da alma gemea. coloque bulltes com icon e deixe os elementos borrado: Personality Traits:
Deeply loyal


Protective


Very confident


Secure and grounded


Playfully romantic
Proximity of the Meeting: “You’re closer than you think.” Your birth chart indicates that your paths will cross within a year, in a familiar setting.
Details about your meeting: [borrado]
What this drawing reveals: [borrado]
O ChatGPT disse:

Pensou por 13s
Segue um card completo, animado com Framer Motion, bullets com ícone e campos “borrados” onde você marcou.

Você pode usar como um componente separado (SoulmateInsightCard) ou só colar o <motion.div> onde quiser no paywall.

import { motion } from "framer-motion";
import { Heart, Shield, Sparkles, MapPin } from "lucide-react";

function SoulmateInsightCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-xl mx-auto mt-6 bg-white/80 backdrop-blur-md border border-purple-100 rounded-3xl shadow-xl p-6 md:p-7 text-left"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold">
            Personalized Soulmate Insight
          </p>
          <h3 className="text-lg md:text-xl font-bold text-gray-900">
            What your soulmate drawing reveals about him
          </h3>
        </div>
      </div>

      {/* Personality Traits */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-500" />
          Personality Traits
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            "Deeply loyal",
            "Protective",
            "Very confident",
            "Secure and grounded",
            "Playfully romantic",
          ].map((trait, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-purple-50/70 rounded-2xl px-3 py-2 backdrop-blur-sm"
            >
              <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center">
                <Shield className="w-3 h-3 text-purple-700" />
              </div>
              <p className="text-xs md:text-sm text-gray-800">{trait}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Proximity of the Meeting */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-purple-500" />
          Proximity of the Meeting
        </p>
        <p className="text-sm md:text-base text-gray-700">
          <span className="font-semibold text-purple-700">
            “You’re closer than you think.”
          </span>{" "}
          Your birth chart indicates that your paths will cross{" "}
          <span className="font-semibold">within a year</span>, in a{" "}
          <span className="font-semibold">familiar setting</span> where you feel
          naturally comfortable and safe.
        </p>
      </div>

      {/* Blurred sections */}
      <div className="space-y-3 mt-4">
        {/* Details about your meeting */}
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-1">
            Details about your meeting
          </p>
          <div className="relative">
            <p className="text-sm md:text-base text-gray-700 blur-sm select-none">
              You’ll first notice his presence through a small but meaningful
              coincidence. A familiar place, an unexpected time, and a subtle
              sign from the universe will make you feel that this encounter was
              never random.
            </p>
            <div className="absolute inset-0 rounded-xl bg-white/10 backdrop-blur-sm pointer-events-none" />
          </div>
        </div>

        {/* What this drawing reveals */}
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-1">
            What this drawing reveals
          </p>
          <div className="relative">
            <p className="text-sm md:text-base text-gray-700 blur-sm select-none">
              Beyond physical features, this drawing mirrors his emotional
              essence — how he loves, protects, and shows up for you. It
              reflects the version of him that is already aligned with your
              destiny, not just who he is now.
            </p>
            <div className="absolute inset-0 rounded-xl bg-white/10 backdrop-blur-sm pointer-events-none" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default SoulmateInsightCard;
Você pode agora só chamar:

<SoulmateInsightCard />
logo abaixo da imagem do desenho ou acima do pitch de preço no seu paywall.

Quer que eu adapte esse card para mobile-first (mais compacto) ou com um micro “tap to reveal” desbloqueando o blur?

Você disse:
nao quero nada animado, so quero um card bonito
O ChatGPT disse:

Pensou por 6s
Boa, vamos fazer um card estático, bonito e sem animação.

Aqui vai um card completo em JSX, só layout (sem motion), com bullets com ícone e os dois últimos blocos borrados:

<div className="max-w-xl mx-auto mt-6 bg-white/90 border border-purple-100 rounded-3xl shadow-xl p-6 md:p-7 text-left">
  {/* Header */}
  <div className="mb-4">
    <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold">
      Personalized Soulmate Insight
    </p>
    <h3 className="text-lg md:text-xl font-bold text-gray-900 mt-1">
      Precise information about your soulmate
    </h3>
  </div>

  {/* Personality Traits */}
  <div className="mb-5">
    <p className="text-sm font-semibold text-gray-800 mb-2">
      Personality Traits:
    </p>

    <div className="space-y-2">
      {[
        "Deeply loyal",
        "Protective",
        "Very confident",
        "Secure and grounded",
        "Playfully romantic",
      ].map((trait, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 bg-purple-50/80 rounded-2xl px-3 py-2"
        >
          <div className="w-7 h-7 rounded-full bg-purple-200 flex items-center justify-center">
            <span className="text-xs text-purple-800">♥</span>
          </div>
          <p className="text-sm text-gray-800">{trait}</p>
        </div>
      ))}
    </div>
  </div>

  {/* Proximity of the Meeting */}
  <div className="mb-4">
    <p className="text-sm font-semibold text-gray-800 mb-1">
      Proximity of the Meeting:
    </p>
    <p className="text-sm md:text-base text-gray-700">
      <span className="font-semibold text-purple-700">
        “You’re closer than you think.”
      </span>{" "}
      Your birth chart indicates that your paths will cross{" "}
      <span className="font-semibold">within a year</span>, in a{" "}
      <span className="font-semibold">familiar setting</span>.
    </p>
  </div>

  {/* Details about your meeting – borrado */}
  <div className="mb-3">
    <p className="text-sm font-semibold text-gray-800 mb-1">
      Details about your meeting:
    </p>
    <div className="relative rounded-xl bg-gray-100/80 p-3">
      <p className="text-sm text-gray-600 blur-sm select-none">
        This section contains specific details about how, where and under which
        circumstances your first encounter will happen.
      </p>
      <div className="absolute inset-0 rounded-xl bg-white/30 backdrop-blur-sm pointer-events-none" />
    </div>
  </div>

  {/* What this drawing reveals – borrado */}
  <div>
    <p className="text-sm font-semibold text-gray-800 mb-1">
      What this drawing reveals:
    </p>
    <div className="relative rounded-xl bg-gray-100/80 p-3">
      <p className="text-sm text-gray-600 blur-sm select-none">
        This section reveals deeper information about his emotional energy, the
        bond between you two, and how this connection will transform your love
        life.
      </p>
      <div className="absolute inset-0 rounded-xl bg-white/30 backdrop-blur-sm pointer-events-none" />
    </div>
  </div>
</div>
Se quiser, depois a gente coloca um mini “Tap to reveal” destravando esses dois blocos borrados. Quer que eu adapte esse card para mobile bem estreito (tipo 320px) e ainda ficar bonito?

Você disse:
Imagem carregada
no centro desses card desfocado coloque um cadeado com texto locked
O ChatGPT disse:
Aqui está o código ajustado, adicionando um cadeado central + texto “Locked”, perfeitamente alinhado e por cima do bloco desfocado — igual ao estilo da sua imagem:

{/* Details about your meeting – borrado */}
<div className="mb-4">
  <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
    <span className="text-pink-500">💕</span> Details about your meeting:
  </p>

  <div className="relative rounded-xl bg-gray-100/70 p-3 overflow-hidden">

    {/* Conteúdo borrado */}
    <p className="text-sm text-gray-600 blur-sm select-none opacity-70">
      This section contains specific details about how, where and under which
      circumstances your first encounter will happen.
    </p>

    {/* Overlay com cadeado */}
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className="bg-white/70 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
        <span className="text-gray-700 text-sm">🔒</span>
        <span className="text-gray-700 text-sm font-semibold">Locked</span>
      </div>
    </div>

  </div>
</div>

{/* What this drawing reveals – borrado */}
<div className="mb-4">
  <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
    <span className="text-blue-600">👤</span> What this drawing reveals:
  </p>

  <div className="relative rounded-xl bg-gray-100/70 p-3 overflow-hidden">

    {/* Conteúdo borrado */}
    <p className="text-sm text-gray-600 blur-sm select-none opacity-70">
      This section reveals deeper emotional information, the bond between you two,
      and how this connection will transform your love life.
    </p>

    {/* Overlay com cadeado */}
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className="bg-white/70 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
        <span className="text-gray-700 text-sm">🔒</span>
        <span className="text-gray-700 text-sm font-semibold">Locked</span>
      </div>
    </div>

  </div>
</div>
✔ Fundo blur suave
✔ Cadeado centralizado
✔ Box translúcido com borda
✔ Texto “Locked” limpo e elegante

Se quiser, eu deixo esse card com um efeito de leve “glassmorphism” para ficar mais premium. Quer que eu refine?

Você disse:
ta com erro, verifique: import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

export default function PaywallStep({ userName, birthDate, quizResultId }) {
  const { trackEndQuiz } = useTracking();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (
      quizResultId &&
      quizResultId !== "offline-mode" &&
      quizResultId !== "admin-mode" &&
      quizResultId !== "bot-mode"
    ) {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(
        (e) => console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    trackEndQuiz();

    const trackCheckout = async () => {
      if (
        quizResultId &&
        quizResultId !== "offline-mode" &&
        quizResultId !== "admin-mode" &&
        quizResultId !== "bot-mode"
      ) {
        try {
          await HybridQuizResult.update(quizResultId, {
            checkout_step_clicked: true,
          });
          console.log("Checkout click tracked successfully");
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout()
      .then(() => {
        try {
          const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
          const url = new URL(checkoutUrl);

          let allUtms = {};

          if (typeof window !== "undefined" && window.utmify) {
            try {
              allUtms = window.utmify.getUtms() || {};
              console.log("UTMs from UTMIFY:", allUtms);
            } catch (error) {
              console.warn("Failed to get UTMs from UTMIFY:", error);
            }
          }

          if (Object.keys(allUtms).length === 0) {
            const currentUrl = new URL(window.location.href);
            const utmParams = [
              "utm_source",
              "utm_medium",
              "utm_campaign",
              "utm_content",
              "utm_term",
            ];

            utmParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });

            const otherParams = ["fbclid", "gclid", "ttclid", "src", "xcod"];
            otherParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });
          }

          Object.keys(allUtms).forEach((key) => {
            if (allUtms[key]) {
              url.searchParams.set(key, allUtms[key]);
            }
          });

          if (
            quizResultId &&
            quizResultId !== "offline-mode" &&
            quizResultId !== "admin-mode" &&
            quizResultId !== "bot-mode"
          ) {
            url.searchParams.set("quiz_result_id", quizResultId);
          }

          console.log("Redirecting to checkout:", url.toString());
          localStorage.removeItem("holymind_quiz_state");
          localStorage.setItem("holymind_last_quiz_id", quizResultId);
          window.location.href = url.toString();
        } catch (error) {
          console.error("Erro ao construir URL de checkout:", error);
          window.location.href = CHECKOUT_CONFIG.baseUrl;
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao rastrear checkout, mas redirecionando mesmo assim:",
          error
        );
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      });
  };

  const faqs = [
    {
      question: "Does it really work?",
      answer:
        "We base predictions on the data you provide and recognized compatibility patterns. It’s not guesswork; it’s personalized analysis.",
    },
    {
      question: "I’m skeptical. Is this safe?",
      answer:
        "Your data are encrypted and used only to create your report. You risk nothing with our guarantee.",
    },
    {
      question: "What if I’m already in a relationship?",
      answer:
        "The report shows compatibility with your current partner and clarifies your future.",
    },
    {
      question: "Is the portrait real?",
      answer:
        "It’s a representation generated from the most likely characteristics. Users report striking similarities.",
    },
    {
      question: "Can I cancel?",
      answer:
        "Yes. The report is a one-time purchase; the monthly subscription can be canceled at any time.",
    },
  ];

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar:
        "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center py-8 max-w-3xl mx-auto px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {/* Top Banner Offer */}
<div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
  <p className="text-sm font-medium">
    Reports on your soulmate are ready.
  </p>
</div>

        <h2 className="text-2xl md:text-3xl font-bold px-4 leading-tight mb-6">
  <span className="text-black">Your drawing is ready</span>
  <br />
  <span className="text-purple-600">See your soulmate today!</span>
</h2>


          {/* Imagem do desenho */}
          <div className="mb-6">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/QGBKNA0389427.jpeg"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div>
       {/* Top Banner Offer */}
<div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
  <p className="text-sm font-medium">
    Your soulmate report is ready and includes a complete analysis of your soulmate
  </p>
</div>
           {/* Título + imagem grande */}
          <h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-2 px-4">
           We found complete details and insight into your soulmate.👇🏼
          </h2>
          <div className="max-w-xl mx-auto mt-6 bg-white/90 border border-purple-100 rounded-3xl shadow-xl p-6 md:p-7 text-left">
  {/* Header */}
  <div className="mb-4">
    <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold">
      Personalized Soulmate Insight
    </p>
    <h3 className="text-lg md:text-xl font-bold text-gray-900 mt-1">
      Precise information about your soulmate
    </h3>
  </div>

  {/* Personality Traits */}
  <div className="mb-5">
    <p className="text-sm font-semibold text-gray-800 mb-2">
      Personality Traits:
    </p>

    <div className="space-y-2">
      {[
        "Deeply loyal",
        "Protective",
        "Very confident",
        "Secure and grounded",
        "Playfully romantic",
      ].map((trait, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 bg-purple-50/80 rounded-2xl px-3 py-2"
        >
          <div className="w-7 h-7 rounded-full bg-purple-200 flex items-center justify-center">
            <span className="text-xs text-purple-800">♥</span>
          </div>
          <p className="text-sm text-gray-800">{trait}</p>
        </div>
      ))}
    </div>
  </div>

  {/* Proximity of the Meeting */}
  <div className="mb-4">
    <p className="text-sm font-semibold text-gray-800 mb-1">
     📍 Proximity of the Meeting:
    </p>
    <p className="text-sm md:text-base text-gray-700">
      <span className="font-semibold text-purple-700">
        “You’re closer than you think.”
      </span>{" "}
      Your birth chart indicates that your paths will cross{" "}
      <span className="font-semibold">within a year</span>, in a{" "}
      <span className="font-semibold">familiar setting</span>.
    </p>
  </div>

 {/* Details about your meeting – borrado */}
<div className="mb-4">
  <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
    <span className="text-pink-500">💕</span> Details about your meeting:
  </p>

  <div className="relative rounded-xl bg-gray-100/70 p-3 overflow-hidden">

    {/* Conteúdo borrado */}
    <p className="text-sm text-gray-600 blur-sm select-none opacity-70">
      This section contains specific details about how, where and under which
      circumstances your first encounter will happen.
    </p>

    {/* Overlay com cadeado */}
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className="bg-white/70 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
        <span className="text-gray-700 text-sm">🔒</span>
        <span className="text-gray-700 text-sm font-semibold">Locked</span>
      </div>
    </div>

  </div>
</div>

{/* What this drawing reveals – borrado */}
<div className="mb-4">
  <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
    <span className="text-blue-600">👤</span> What this drawing reveals:
  </p>

  <div className="relative rounded-xl bg-gray-100/70 p-3 overflow-hidden">

    {/* Conteúdo borrado */}
    <p className="text-sm text-gray-600 blur-sm select-none opacity-70">
      This section reveals deeper emotional information, the bond between you two,
      and how this connection will transform your love life.
    </p>

    {/* Overlay com cadeado */}
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className="bg-white/70 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
        <span className="text-gray-700 text-sm">🔒</span>
        <span className="text-gray-700 text-sm font-semibold">Locked</span>
      </div>
    </div>

  </div>
</div>

          {/* PITCH DE PREÇO */}
          <Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
            <CardContent className="p-6 space-y-4">
              {/* Imagem pequena acima do título */}
              <div className="w-full flex justify-center mb-3">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/zlmLXK5905984.png"
                  alt="Auraly App Preview"
                  className="w-[35%] max-w-[120px] mx-auto rounded-xl"
                />
              </div>

              {/* Título centralizado */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
                Discover the face of your soulmate with the Auraly App.
              </h3>

              {/* Imagem menor e centralizada */}
              <div className="w-full flex justify-center mb-2">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png"
                  alt="Soulmate Offer Highlight"
                  className="w-[55%] max-w-xs mx-auto rounded-xl"
                />
              </div>

              {/* Bullets */}
              <ul className="space-y-2 text-sm md:text-base text-gray-800">
                <li>
                  ✍️ <strong>Ultra-realistic</strong> hand-drawn sketch of your
                  soulmate, made by Master Aura.
                </li>
                <li>
                  💫 <strong>Uncover exclusive personality traits</strong> only
                  your soulmate has.
                </li>
                <li>
                  🗓️ <strong>Date and context</strong> most favorable for the
                  meeting.
                </li>
                <li>
                  🔮 <strong>Receive deep, personalized insights</strong> into
                  your love life.
                </li>
              </ul>

              {/* Bônus */}
              <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Synchronicity Calendar (From
                  $19, free)
                </p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Emotional Healing Guide (From
                  $9, free)
                </p>
              </div>

              {/* Texto antes do preço */}
              <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800 text-center">
                <p>
                  All this for a <strong>symbolic price</strong> to finally
                  discover who your true love is.
                </p>
              </div>

              {/* CARD DE PREÇO */}
              <div className="max-w-md mx-auto mt-2">
                <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
                  {/* Topo Roxo */}
                  <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
                    Special offer 50% OFF Today
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 space-y-4">
                    {/* Texto principal */}
                    <p className="text-center text-lg font-semibold text-gray-900">
                      The original price is{" "}
                      <span className="text-gray-500 line-through font-normal">
                        $29
                      </span>
                    </p>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2" />

                    {/* Total today */}
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
                        <span>Total today 50% OFF:</span>
                        <span className="text-green-600 text-xl font-extrabold">
                          $19
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
          >
            GET MY RESULTS
          </button>

          {/* Badge/garantia verde abaixo do botão */}
          <div className="w-full flex justify-center mb-2 mt-4">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/MqWQAB5264462.png"
              alt="Guarantee Badge"
              className="w-[35%] max-w-[120px] mx-auto rounded-xl"
            />
          </div>

          {/* Texto de trial */}
          <div className="max-w-2xl mx-auto mt-2 px-4">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By accepting this offer, you agree to start a 30-day trial on the
              Auraly App. After the trial period ends, your subscription will
              automatically renew for just $29/m. You may cancel anytime by
              contacting us at contact@auralyapp.com
            </p>
          </div>

          {/* Título + imagem grande */}
          <h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-2 px-4">
            Trusted By Over 1,000,000 Transformed Lives
          </h2>

          <div className="w-full flex justify-center mb-3 mt-1">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/YuivNF7917669.png"
              alt="Auraly App Preview"
              className="w-full max-w-md mx-auto rounded-xl"
            />
          </div>

          {/* Bullets de confiança */}
          <div className="w-full max-w-md mx-auto mt-4 space-y-4 text-left">
            {/* Bullet 1 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
                  alt="Users icon"
                  className="w-5 h-5"
                />
              </div>

              <p className="text-gray-900 text-sm md:text-base">
                <strong>9200 women</strong> found their soulmate.
              </p>
            </div>

            {/* Bullet 2 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2462/2462719.png"
                  alt="Chat icon"
                  className="w-5 h-5"
                />
              </div>

              <p className="text-gray-900 text-sm md:text-base">
                <strong>Thousands of consultations</strong> carried out
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto px-0 py-4"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.2 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <h4 className="font-bold text-gray-800 text-xl">
                        {testimonial.title}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
{/* CARD DE PREÇO ABAIXO DO SOCIAL PROOF */}
<div className="max-w-md mx-auto mt-4">
  <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
    {/* Topo Roxo */}
    <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
      Special offer 50% OFF Today
    </div>

    {/* Conteúdo */}
    <div className="p-5 space-y-4">
      {/* Texto principal */}
      <p className="text-center text-lg font-semibold text-gray-900">
        The original price is{" "}
        <span className="text-gray-500 line-through font-normal">
          $29
        </span>
      </p>

      {/* Divider */}
      <div className="border-t border-gray-200 my-2" />

      {/* Total today */}
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
          <span>Total today 50% OFF:</span>
          <span className="text-green-600 text-xl font-extrabold">
            $19
          </span>
        </div>
      </div>
    </div>
  </div>
</div>

{/* CTA ABAIXO DO CARD DE PREÇO */}
<button
  onClick={handleCheckout}
  className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
>
  GET MY RESULTS
</button>
          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              FAQ
            </h2>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full py-3 flex items-center justify-between gap-2"
                    >
                      <span className="text-sm md:text-base text-gray-800 font-semibold">
                        {item.question}
                      </span>
                      <ChevronRight
                        className={w-4 h-4 text-gray-500 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3 px-1">
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
O ChatGPT disse:

Pensou por 20s
O erro é só tag <div> não fechada no card de “Precise information about your soulmate”.

Você abriu este bloco:

<div className="max-w-xl mx-auto mt-6 bg-white/90 border border-purple-100 rounded-3xl shadow-xl p-6 md:p-7 text-left">
  {/* ...conteúdo todo do card... */}
  {/* What this drawing reveals – borrado */}
  <div className="mb-4">
    ...
  </div>

  {/* AQUI FALTAVA FECHAR O CARD */}
E logo depois já veio o comentário do PITCH:

          {/* PITCH DE PREÇO */}
          <Card className="max-w-xl mx-auto ...
Então o React reclama que falta o </div> correspondente.

Basta adicionar essa linha antes do comentário {/* PITCH DE PREÇO */}:

{/* What this drawing reveals – borrado */}
<div className="mb-4">
  ...
</div>

</div>   {/* <<< fecha o card de soulmate insight */}

{/* PITCH DE PREÇO */}
<Card className="max-w-xl mx-auto bg-white ...
Se quiser, é só procurar pelo /* What this drawing reveals – borrado */ e colocar esse </div> logo depois do bloco. Isso resolve o erro de JSX. Quer que eu te mande o componente inteiro já formatado com esse ajuste?

Você disse:
mande ai corrigido: {/* Overlay com cadeado */}
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className="bg-white/70 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
        <span className="text-gray-700 text-sm">🔒</span>
        <span className="text-gray-700 text-sm font-semibold">Locked</span>
      </div>
    </div>

  </div>
O ChatGPT disse:
Aqui está o trecho corrigido e completo, sem erro de fechamento:

{/* Overlay com cadeado */}
<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
  <div className="bg-white/70 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
    <span className="text-gray-700 text-sm">🔒</span>
    <span className="text-gray-700 text-sm font-semibold">Locked</span>
  </div>
</div>
</div> {/* <- fecha corretamente o card borrado */}
Se quiser, posso te mandar o bloco completo do card totalmente revisado. Quer?

Você disse:
ta com erro, mande completo e ao clicar no cadeado nao deve acontecer nada, ok? import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

export default function PaywallStep({ userName, birthDate, quizResultId }) {
  const { trackEndQuiz } = useTracking();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (
      quizResultId &&
      quizResultId !== "offline-mode" &&
      quizResultId !== "admin-mode" &&
      quizResultId !== "bot-mode"
    ) {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(
        (e) => console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    trackEndQuiz();

    const trackCheckout = async () => {
      if (
        quizResultId &&
        quizResultId !== "offline-mode" &&
        quizResultId !== "admin-mode" &&
        quizResultId !== "bot-mode"
      ) {
        try {
          await HybridQuizResult.update(quizResultId, {
            checkout_step_clicked: true,
          });
          console.log("Checkout click tracked successfully");
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout()
      .then(() => {
        try {
          const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
          const url = new URL(checkoutUrl);

          let allUtms = {};

          if (typeof window !== "undefined" && window.utmify) {
            try {
              allUtms = window.utmify.getUtms() || {};
              console.log("UTMs from UTMIFY:", allUtms);
            } catch (error) {
              console.warn("Failed to get UTMs from UTMIFY:", error);
            }
          }

          if (Object.keys(allUtms).length === 0) {
            const currentUrl = new URL(window.location.href);
            const utmParams = [
              "utm_source",
              "utm_medium",
              "utm_campaign",
              "utm_content",
              "utm_term",
            ];

            utmParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });

            const otherParams = ["fbclid", "gclid", "ttclid", "src", "xcod"];
            otherParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });
          }

          Object.keys(allUtms).forEach((key) => {
            if (allUtms[key]) {
              url.searchParams.set(key, allUtms[key]);
            }
          });

          if (
            quizResultId &&
            quizResultId !== "offline-mode" &&
            quizResultId !== "admin-mode" &&
            quizResultId !== "bot-mode"
          ) {
            url.searchParams.set("quiz_result_id", quizResultId);
          }

          console.log("Redirecting to checkout:", url.toString());
          localStorage.removeItem("holymind_quiz_state");
          localStorage.setItem("holymind_last_quiz_id", quizResultId);
          window.location.href = url.toString();
        } catch (error) {
          console.error("Erro ao construir URL de checkout:", error);
          window.location.href = CHECKOUT_CONFIG.baseUrl;
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao rastrear checkout, mas redirecionando mesmo assim:",
          error
        );
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      });
  };

  const faqs = [
    {
      question: "Does it really work?",
      answer:
        "We base predictions on the data you provide and recognized compatibility patterns. It’s not guesswork; it’s personalized analysis.",
    },
    {
      question: "I’m skeptical. Is this safe?",
      answer:
        "Your data are encrypted and used only to create your report. You risk nothing with our guarantee.",
    },
    {
      question: "What if I’m already in a relationship?",
      answer:
        "The report shows compatibility with your current partner and clarifies your future.",
    },
    {
      question: "Is the portrait real?",
      answer:
        "It’s a representation generated from the most likely characteristics. Users report striking similarities.",
    },
    {
      question: "Can I cancel?",
      answer:
        "Yes. The report is a one-time purchase; the monthly subscription can be canceled at any time.",
    },
  ];

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar:
        "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center py-8 max-w-3xl mx-auto px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {/* Top Banner Offer */}
<div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
  <p className="text-sm font-medium">
    Reports on your soulmate are ready.
  </p>
</div>

        <h2 className="text-2xl md:text-3xl font-bold px-4 leading-tight mb-6">
  <span className="text-black">Your drawing is ready</span>
  <br />
  <span className="text-purple-600">See your soulmate today!</span>
</h2>


          {/* Imagem do desenho */}
          <div className="mb-6">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/QGBKNA0389427.jpeg"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div>
       {/* Top Banner Offer */}
<div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
  <p className="text-sm font-medium">
    Your soulmate report is ready and includes a complete analysis of your soulmate
  </p>
</div>
           {/* Título + imagem grande */}
          <h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-2 px-4">
           We found complete details and insight into your soulmate.👇🏼
          </h2>
          <div className="max-w-xl mx-auto mt-6 bg-white/90 border border-purple-100 rounded-3xl shadow-xl p-6 md:p-7 text-left">
  {/* Header */}
  <div className="mb-4">
    <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold">
      Personalized Soulmate Insight
    </p>
    <h3 className="text-lg md:text-xl font-bold text-gray-900 mt-1">
      Precise information about your soulmate
    </h3>
  </div>

  {/* Personality Traits */}
  <div className="mb-5">
    <p className="text-sm font-semibold text-gray-800 mb-2">
      Personality Traits:
    </p>

    <div className="space-y-2">
      {[
        "Deeply loyal",
        "Protective",
        "Playfully romantic",
      ].map((trait, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 bg-purple-50/80 rounded-2xl px-3 py-2"
        >
          <div className="w-7 h-7 rounded-full bg-purple-200 flex items-center justify-center">
            <span className="text-xs text-purple-800">♥</span>
          </div>
          <p className="text-sm text-gray-800">{trait}</p>
        </div>
      ))}
    </div>
  </div>

  {/* Proximity of the Meeting */}
  <div className="mb-4">
    <p className="text-sm font-semibold text-gray-800 mb-1">
     📍 Proximity of the Meeting:
    </p>
    <p className="text-sm md:text-base text-gray-700">
      <span className="font-semibold text-purple-700">
        “You’re closer than you think.”
      </span>{" "}
      Your birth chart indicates that your paths will cross{" "}
      <span className="font-semibold">within a year</span>, in a{" "}
      <span className="font-semibold">familiar setting</span>.
    </p>
  </div>

 {/* Details about your meeting – borrado */}
<div className="mb-4">
  <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
    <span className="text-pink-500">💕</span> Details about your meeting:
  </p>

  <div className="relative rounded-xl bg-gray-100/70 p-3 overflow-hidden">

    {/* Conteúdo borrado */}
    <p className="text-sm text-gray-600 blur-sm select-none opacity-70">
      This section contains specific details about how, where and under which
      circumstances your first encounter will happen.
    </p>

    {/* Overlay com cadeado */}
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className="bg-white/70 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
        <span className="text-gray-700 text-sm">🔒</span>
        <span className="text-gray-700 text-sm font-semibold">Locked</span>
      </div>
    </div>

  </div>
</div>

{/* What this drawing reveals – borrado */}
<div className="mb-4">
  <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
    <span className="text-blue-600">👤</span> What this drawing reveals:
  </p>

  <div className="relative rounded-xl bg-gray-100/70 p-3 overflow-hidden">

    {/* Conteúdo borrado */}
    <p className="text-sm text-gray-600 blur-sm select-none opacity-70">
      This section reveals deeper emotional information, the bond between you two,
      and how this connection will transform your love life.
    </p>

    {/* Overlay com cadeado */}
<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
  <div className="bg-white/70 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
    <span className="text-gray-700 text-sm">🔒</span>
    <span className="text-gray-700 text-sm font-semibold">Locked</span>
  </div>
</div>
</div> {/* <- fecha corretamente o card borrado */}

          {/* PITCH DE PREÇO */}
          <Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
            <CardContent className="p-6 space-y-4">
              {/* Imagem pequena acima do título */}
              <div className="w-full flex justify-center mb-3">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/zlmLXK5905984.png"
                  alt="Auraly App Preview"
                  className="w-[35%] max-w-[120px] mx-auto rounded-xl"
                />
              </div>

              {/* Título centralizado */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
                Discover the face of your soulmate with the Auraly App.
              </h3>

              {/* Imagem menor e centralizada */}
              <div className="w-full flex justify-center mb-2">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png"
                  alt="Soulmate Offer Highlight"
                  className="w-[55%] max-w-xs mx-auto rounded-xl"
                />
              </div>

              {/* Bullets */}
              <ul className="space-y-2 text-sm md:text-base text-gray-800">
                <li>
                  ✍️ <strong>Ultra-realistic</strong> hand-drawn sketch of your
                  soulmate, made by Master Aura.
                </li>
                <li>
                  💫 <strong>Uncover exclusive personality traits</strong> only
                  your soulmate has.
                </li>
                <li>
                  🗓️ <strong>Date and context</strong> most favorable for the
                  meeting.
                </li>
                <li>
                  🔮 <strong>Receive deep, personalized insights</strong> into
                  your love life.
                </li>
              </ul>

              {/* Bônus */}
              <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Synchronicity Calendar (From
                  $19, free)
                </p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Emotional Healing Guide (From
                  $9, free)
                </p>
              </div>

              {/* Texto antes do preço */}
              <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800 text-center">
                <p>
                  All this for a <strong>symbolic price</strong> to finally
                  discover who your true love is.
                </p>
              </div>

              {/* CARD DE PREÇO */}
              <div className="max-w-md mx-auto mt-2">
                <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
                  {/* Topo Roxo */}
                  <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
                    Special offer 50% OFF Today
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 space-y-4">
                    {/* Texto principal */}
                    <p className="text-center text-lg font-semibold text-gray-900">
                      The original price is{" "}
                      <span className="text-gray-500 line-through font-normal">
                        $29
                      </span>
                    </p>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2" />

                    {/* Total today */}
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
                        <span>Total today 50% OFF:</span>
                        <span className="text-green-600 text-xl font-extrabold">
                          $19
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
          >
            GET MY RESULTS
          </button>

          {/* Badge/garantia verde abaixo do botão */}
          <div className="w-full flex justify-center mb-2 mt-4">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/MqWQAB5264462.png"
              alt="Guarantee Badge"
              className="w-[35%] max-w-[120px] mx-auto rounded-xl"
            />
          </div>

          {/* Texto de trial */}
          <div className="max-w-2xl mx-auto mt-2 px-4">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By accepting this offer, you agree to start a 30-day trial on the
              Auraly App. After the trial period ends, your subscription will
              automatically renew for just $29/m. You may cancel anytime by
              contacting us at contact@auralyapp.com
            </p>
          </div>

          {/* Título + imagem grande */}
          <h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-2 px-4">
            Trusted By Over 1,000,000 Transformed Lives
          </h2>

          <div className="w-full flex justify-center mb-3 mt-1">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/YuivNF7917669.png"
              alt="Auraly App Preview"
              className="w-full max-w-md mx-auto rounded-xl"
            />
          </div>

          {/* Bullets de confiança */}
          <div className="w-full max-w-md mx-auto mt-4 space-y-4 text-left">
            {/* Bullet 1 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
                  alt="Users icon"
                  className="w-5 h-5"
                />
              </div>

              <p className="text-gray-900 text-sm md:text-base">
                <strong>9200 women</strong> found their soulmate.
              </p>
            </div>

            {/* Bullet 2 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2462/2462719.png"
                  alt="Chat icon"
                  className="w-5 h-5"
                />
              </div>

              <p className="text-gray-900 text-sm md:text-base">
                <strong>Thousands of consultations</strong> carried out
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto px-0 py-4"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.2 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <h4 className="font-bold text-gray-800 text-xl">
                        {testimonial.title}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
{/* CARD DE PREÇO ABAIXO DO SOCIAL PROOF */}
<div className="max-w-md mx-auto mt-4">
  <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
    {/* Topo Roxo */}
    <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
      Special offer 50% OFF Today
    </div>

    {/* Conteúdo */}
    <div className="p-5 space-y-4">
      {/* Texto principal */}
      <p className="text-center text-lg font-semibold text-gray-900">
        The original price is{" "}
        <span className="text-gray-500 line-through font-normal">
          $29
        </span>
      </p>

      {/* Divider */}
      <div className="border-t border-gray-200 my-2" />

      {/* Total today */}
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
          <span>Total today 50% OFF:</span>
          <span className="text-green-600 text-xl font-extrabold">
            $19
          </span>
        </div>
      </div>
    </div>
  </div>
</div>

{/* CTA ABAIXO DO CARD DE PREÇO */}
<button
  onClick={handleCheckout}
  className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
>
  GET MY RESULTS
</button>
          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              FAQ
            </h2>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full py-3 flex items-center justify-between gap-2"
                    >
                      <span className="text-sm md:text-base text-gray-800 font-semibold">
                        {item.question}
                      </span>
                      <ChevronRight
                        className={w-4 h-4 text-gray-500 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3 px-1">
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
O ChatGPT disse:

Pensou por 1m 7s
O erro é que o card grande de insights (<div className="max-w-xl mx-auto mt-6 ...">) não estava sendo fechado. Abaixo vai o componente inteiro já corrigido, com o bloco borrado + cadeado funcionando e sem nenhum onClick no cadeado (ou seja, ele não faz nada ao clicar):

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

export default function PaywallStep({ userName, birthDate, quizResultId }) {
  const { trackEndQuiz } = useTracking();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (
      quizResultId &&
      quizResultId !== "offline-mode" &&
      quizResultId !== "admin-mode" &&
      quizResultId !== "bot-mode"
    ) {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(
        (e) => console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    trackEndQuiz();

    const trackCheckout = async () => {
      if (
        quizResultId &&
        quizResultId !== "offline-mode" &&
        quizResultId !== "admin-mode" &&
        quizResultId !== "bot-mode"
      ) {
        try {
          await HybridQuizResult.update(quizResultId, {
            checkout_step_clicked: true,
          });
          console.log("Checkout click tracked successfully");
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout()
      .then(() => {
        try {
          const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
          const url = new URL(checkoutUrl);

          let allUtms: Record<string, string> = {};

          if (typeof window !== "undefined" && (window as any).utmify) {
            try {
              allUtms = (window as any).utmify.getUtms() || {};
              console.log("UTMs from UTMIFY:", allUtms);
            } catch (error) {
              console.warn("Failed to get UTMs from UTMIFY:", error);
            }
          }

          if (Object.keys(allUtms).length === 0) {
            const currentUrl = new URL(window.location.href);
            const utmParams = [
              "utm_source",
              "utm_medium",
              "utm_campaign",
              "utm_content",
              "utm_term",
            ];

            utmParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });

            const otherParams = ["fbclid", "gclid", "ttclid", "src", "xcod"];
            otherParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });
          }

          Object.keys(allUtms).forEach((key) => {
            if (allUtms[key]) {
              url.searchParams.set(key, allUtms[key]);
            }
          });

          if (
            quizResultId &&
            quizResultId !== "offline-mode" &&
            quizResultId !== "admin-mode" &&
            quizResultId !== "bot-mode"
          ) {
            url.searchParams.set("quiz_result_id", quizResultId);
          }

          console.log("Redirecting to checkout:", url.toString());
          localStorage.removeItem("holymind_quiz_state");
          localStorage.setItem("holymind_last_quiz_id", quizResultId);
          window.location.href = url.toString();
        } catch (error) {
          console.error("Erro ao construir URL de checkout:", error);
          window.location.href = CHECKOUT_CONFIG.baseUrl;
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao rastrear checkout, mas redirecionando mesmo assim:",
          error
        );
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      });
  };

  const faqs = [
    {
      question: "Does it really work?",
      answer:
        "We base predictions on the data you provide and recognized compatibility patterns. It’s not guesswork; it’s personalized analysis.",
    },
    {
      question: "I’m skeptical. Is this safe?",
      answer:
        "Your data are encrypted and used only to create your report. You risk nothing with our guarantee.",
    },
    {
      question: "What if I’m already in a relationship?",
      answer:
        "The report shows compatibility with your current partner and clarifies your future.",
    },
    {
      question: "Is the portrait real?",
      answer:
        "It’s a representation generated from the most likely characteristics. Users report striking similarities.",
    },
    {
      question: "Can I cancel?",
      answer:
        "Yes. The report is a one-time purchase; the monthly subscription can be canceled at any time.",
    },
  ];

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar:
        "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center py-8 max-w-3xl mx-auto px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {/* Top Banner Offer */}
          <div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
            <p className="text-sm font-medium">
              Reports on your soulmate are ready.
            </p>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold px-4 leading-tight mb-6">
            <span className="text-black">Your drawing is ready</span>
            <br />
            <span className="text-purple-600">See your soulmate today!</span>
          </h2>

          {/* Imagem do desenho */}
          <div className="mb-6">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/QGBKNA0389427.jpeg"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div>

          {/* Segundo banner */}
          <div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
            <p className="text-sm font-medium">
              Your soulmate report is ready and includes a complete analysis of
              your soulmate.
            </p>
          </div>

          {/* Card de insights da alma gêmea */}
          <h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-2 px-4">
            We found complete details and insight into your soulmate.👇🏼
          </h2>

          <div className="max-w-xl mx-auto mt-6 bg-white/90 border border-purple-100 rounded-3xl shadow-xl p-6 md:p-7 text-left">
            {/* Header */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold">
                Personalized Soulmate Insight
              </p>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mt-1">
                Precise information about your soulmate
              </h3>
            </div>

            {/* Personality Traits */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-800 mb-2">
                Personality Traits:
              </p>

              <div className="space-y-2">
                {["Deeply loyal", "Protective", "Playfully romantic"].map(
                  (trait, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-purple-50/80 rounded-2xl px-3 py-2"
                    >
                      <div className="w-7 h-7 rounded-full bg-purple-200 flex items-center justify-center">
                        <span className="text-xs text-purple-800">♥</span>
                      </div>
                      <p className="text-sm text-gray-800">{trait}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Proximity of the Meeting */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-800 mb-1">
                📍 Proximity of the Meeting:
              </p>
              <p className="text-sm md:text-base text-gray-700">
                <span className="font-semibold text-purple-700">
                  “You’re closer than you think.”
                </span>{" "}
                Your birth chart indicates that your paths will cross{" "}
                <span className="font-semibold">within a year</span>, in a{" "}
                <span className="font-semibold">familiar setting</span>.
              </p>
            </div>

            {/* Details about your meeting – borrado */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                <span className="text-pink-500">💕</span> Details about your
                meeting:
              </p>

              <div className="relative rounded-xl bg-gray-100/70 p-3 overflow-hidden">
                {/* Conteúdo borrado */}
                <p className="text-sm text-gray-600 blur-sm select-none opacity-70">
                  This section contains specific details about how, where and
                  under which circumstances your first encounter will happen.
                </p>

                {/* Overlay com cadeado (sem ação de clique) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="bg-white/70 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
                    <span className="text-gray-700 text-sm">🔒</span>
                    <span className="text-gray-700 text-sm font-semibold">
                      Locked
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* What this drawing reveals – borrado */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                <span className="text-blue-600">👤</span> What this drawing
                reveals:
              </p>

              <div className="relative rounded-xl bg-gray-100/70 p-3 overflow-hidden">
                {/* Conteúdo borrado */}
                <p className="text-sm text-gray-600 blur-sm select-none opacity-70">
                  This section reveals deeper emotional information, the bond
                  between you two, and how this connection will transform your
                  love life.
                </p>

                {/* Overlay com cadeado (sem ação de clique) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="bg-white/70 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
                    <span className="text-gray-700 text-sm">🔒</span>
                    <span className="text-gray-700 text-sm font-semibold">
                      Locked
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <-- fecha o card grande de insights */}

          {/* PITCH DE PREÇO */}
          <Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 mt-8 text-left">
            <CardContent className="p-6 space-y-4">
              {/* Imagem pequena acima do título */}
              <div className="w-full flex justify-center mb-3">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/zlmLXK5905984.png"
                  alt="Auraly App Preview"
                  className="w-[35%] max-w-[120px] mx-auto rounded-xl"
                />
              </div>

              {/* Título centralizado */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
                Discover the face of your soulmate with the Auraly App.
              </h3>

              {/* Imagem menor e centralizada */}
              <div className="w-full flex justify-center mb-2">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png"
                  alt="Soulmate Offer Highlight"
                  className="w-[55%] max-w-xs mx-auto rounded-xl"
                />
              </div>

              {/* Bullets */}
              <ul className="space-y-2 text-sm md:text-base text-gray-800">
                <li>
                  ✍️ <strong>Ultra-realistic</strong> hand-drawn sketch of your
                  soulmate, made by Master Aura.
                </li>
                <li>
                  💫 <strong>Uncover exclusive personality traits</strong> only
                  your soulmate has.
                </li>
                <li>
                  🗓️ <strong>Date and context</strong> most favorable for the
                  meeting.
                </li>
                <li>
                  🔮 <strong>Receive deep, personalized insights</strong> into
                  your love life.
                </li>
              </ul>

              {/* Bônus */}
              <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Synchronicity Calendar (From
                  $19, free)
                </p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Emotional Healing Guide (From
                  $9, free)
                </p>
              </div>

              {/* Texto antes do preço */}
              <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800 text-center">
                <p>
                  All this for a <strong>symbolic price</strong> to finally
                  discover who your true love is.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA principal (acima de badge/trial/trust/social proof) */}
          <button
            onClick={handleCheckout}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
          >
            GET MY RESULTS
          </button>

          {/* Badge/garantia verde abaixo do botão */}
          <div className="w-full flex justify-center mb-2 mt-4">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/MqWQAB5264462.png"
              alt="Guarantee Badge"
              className="w-[35%] max-w-[120px] mx-auto rounded-xl"
            />
          </div>

          {/* Texto de trial */}
          <div className="max-w-2xl mx-auto mt-2 px-4">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By accepting this offer, you agree to start a 30-day trial on the
              Auraly App. After the trial period ends, your subscription will
              automatically renew for just $29/m. You may cancel anytime by
              contacting us at contact@auralyapp.com
            </p>
          </div>

          {/* Título + imagem grande */}
          <h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-2 px-4">
            Trusted By Over 1,000,000 Transformed Lives
          </h2>

          <div className="w-full flex justify-center mb-3 mt-1">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/YuivNF7917669.png"
              alt="Auraly App Preview"
              className="w-full max-w-md mx-auto rounded-xl"
            />
          </div>

          {/* Bullets de confiança */}
          <div className="w-full max-w-md mx-auto mt-4 space-y-4 text-left">
            {/* Bullet 1 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
                  alt="Users icon"
                  className="w-5 h-5"
                />
              </div>

              <p className="text-gray-900 text-sm md:text-base">
                <strong>9200 women</strong> found their soulmate.
              </p>
            </div>

            {/* Bullet 2 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2462/2462719.png"
                  alt="Chat icon"
                  className="w-5 h-5"
                />
              </div>

              <p className="text-gray-900 text-sm md:text-base">
                <strong>Thousands of consultations</strong> carried out.
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto px-0 py-4"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.2 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <h4 className="font-bold text-gray-800 text-xl">
                        {testimonial.title}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              FAQ
            </h2>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full py-3 flex items-center justify-between gap-2"
                    >
                      <span className="text-sm md:text-base text-gray-800 font-semibold">
                        {item.question}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3 px-1">
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
Agora está tudo fechado certinho e o cadeado é só visual (sem clique).
Quer que eu mexa em estrutura/ordem dos blocos também ou só isso resolve?

Você disse:
 We found complete details and insight into your soulmate.👇🏼 mande algumas alternativas aqui abaixo de texto, pouco mais curtos 
O ChatGPT disse:
Algumas variações mais curtas:

We found powerful insights about your soulmate. 👇🏼

We uncovered key details about your soulmate. 👇🏼

We found who your soulmate really is. 👇🏼

We discovered deep truths about your soulmate. 👇🏼

We revealed what you need to know about your soulmate. 👇🏼

We uncovered your soulmate’s secrets and patterns. 👇🏼

We found what truly connects you to your soulmate. 👇🏼

We discovered what makes your soulmate unique to you. 👇🏼

Só cuidado para não usar algo muito “dramático” em todas as variações; vale testar uma versão mais neutra também, tipo “We found personalized insights about your soulmate. 👇🏼” pra evitar soar exagerado em alguns públicos.

Quer que eu aprofunde mais?

Você disse:
para esse agora:   Reports on your soulmate are ready.
O ChatGPT disse:
Aqui vão variações curtas, diretas e no mesmo tom:

Your soulmate report is ready.

Your soulmate insights are ready.

Your private soulmate report is prepared.

Your personalized soulmate report is ready.

Your soulmate reading is ready.

Your soulmate analysis is ready.

Your full soulmate report is ready.

Your soulmate information is ready.

Your completed soulmate report is ready.

Your soulmate results are ready.

Todas funcionam bem no topo do paywall.

Quer que eu aprofunde mais?

Você disse:
nesse div coloqu o cornometro de 15 minutos (nesse div mesmo, sem ser em JS) <div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
  <p className="text-sm font-medium">
  Your soulmate reading is ready.
  </p>
</div>
O ChatGPT disse:
Mande esse div assim, com o “cronômetro” estático de 15:00 (sem JS):

<div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
  <p className="text-sm font-medium">
    Your soulmate reading is ready.
  </p>

  <div className="mt-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 text-xs font-semibold text-purple-800">
    <span>⏳</span>
    <span>
      Reserved for the next{" "}
      <span className="tabular-nums">15:00</span>
    </span>
  </div>
</div>
Quer que eu aprofunde mais?

Você disse:
COLOQUE DECRESCENTE
O ChatGPT disse:
Aqui vai o mesmo card, mas agora com contador REAL decrescente de 15 minutos, já funcionando dentro do próprio componente.

✅ Pronto para colar — inclui o useEffect + JSX
1. Adicione o estado + lógica do cronômetro no topo do componente:
const [timeLeft, setTimeLeft] = useState(15 * 60);

useEffect(() => {
  const interval = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) return 0;
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, []);

const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
const seconds = String(timeLeft % 60).padStart(2, "0");
2. Aqui está o DIV completo com o cronômetro decrescente:
<div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
  <p className="text-sm font-medium">
    Your soulmate reading is ready.
  </p>

  <div className="mt-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 text-xs font-semibold text-purple-800">
    <span>⏳</span>
    <span>
      Reserved for the next{" "}
      <span className="tabular-nums">
        {minutes}:{seconds}
      </span>
    </span>
  </div>
</div>
Se quiser que o contador pisque nos últimos 60 segundos, ou mude de cor quando chegar no final, posso adicionar também. Quer que eu aprofunde mais?

Você disse:
mand um codigo com linha fina cinza de divisor
O ChatGPT disse:
Segue um divisor fino cinza, pronto pra colar onde quiser no layout:

Código simples
<div className="w-full h-px bg-gray-200 my-4"></div>
Mais elegante (com leve transparência)
<div className="w-full h-px bg-gray-300/70 my-4"></div>
Com espaçamento menor
<div className="w-full h-px bg-gray-200 my-2"></div>
Quer que eu gere variações (pontilhado, borda dupla, 50% da largura, centralizado etc.)?

Você disse:
 {/* Imagem do desenho */}
          <div className="mb-6">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/QGBKNA0389427.jpeg"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div> abaixo dessa imagem adicione botao roxo e ao clicar scroll ate o card de preço. 
O ChatGPT disse:
Aqui está o código pronto, já com o botão roxo logo abaixo da imagem e o scroll automático até o card de preço quando clicar.

Basta colar exatamente assim — funciona direto em React + Tailwind.

✅ 1. Adicione o botão abaixo da imagem
{/* Imagem do desenho */}
<div className="mb-6">
  <img
    src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/QGBKNA0389427.jpeg"
    alt="Your True Love Preview"
    className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
  />
</div>

{/* Botão para scroll */}
<div className="w-full flex justify-center mb-6">
  <button
    onClick={scrollToPriceCard}
    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 shadow-md"
  >
    SEE YOUR FULL READING
  </button>
</div>
✅ 2. Adicione a ref + função de scroll no topo do componente
Coloque logo antes do return:

const priceCardRef = React.useRef(null);

const scrollToPriceCard = () => {
  if (priceCardRef.current) {
    priceCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
✅ 3. Envolva o card de preço com a ref
Encontre seu card de preço e substitua assim:

<div ref={priceCardRef} className="max-w-md mx-auto mt-4">
  <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
    <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
      Special offer 50% OFF Today
    </div>

    <div className="p-5 space-y-4">
      <p className="text-center text-lg font-semibold text-gray-900">
        The original price is{" "}
        <span className="text-gray-500 line-through font-normal">$29</span>
      </p>

      <div className="border-t border-gray-200 my-2" />

      <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
        <span>Total today 50% OFF:</span>
        <span className="text-green-600 text-xl font-extrabold">$19</span>
      </div>
    </div>
  </div>
</div>
Pronto.
O botão fica logo abaixo da imagem e faz scroll suave até o preço.

Quer que eu deixe o botão com gradiente, ícone, animação ou estilo igual o da seção de baixo?

Você disse:
paywall ficou todo branco, verifique qual o erro: import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

export default function PaywallStep({ userName, birthDate, quizResultId }) {
  const { trackEndQuiz } = useTracking();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (
      quizResultId &&
      quizResultId !== "offline-mode" &&
      quizResultId !== "admin-mode" &&
      quizResultId !== "bot-mode"
    ) {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(
        (e) => console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    trackEndQuiz();

    const trackCheckout = async () => {
      if (
        quizResultId &&
        quizResultId !== "offline-mode" &&
        quizResultId !== "admin-mode" &&
        quizResultId !== "bot-mode"
      ) {
        try {
          await HybridQuizResult.update(quizResultId, {
            checkout_step_clicked: true,
          });
          console.log("Checkout click tracked successfully");
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout()
      .then(() => {
        try {
          const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
          const url = new URL(checkoutUrl);

          let allUtms = {};

          if (typeof window !== "undefined" && window.utmify) {
            try {
              allUtms = window.utmify.getUtms() || {};
              console.log("UTMs from UTMIFY:", allUtms);
            } catch (error) {
              console.warn("Failed to get UTMs from UTMIFY:", error);
            }
          }

          if (Object.keys(allUtms).length === 0) {
            const currentUrl = new URL(window.location.href);
            const utmParams = [
              "utm_source",
              "utm_medium",
              "utm_campaign",
              "utm_content",
              "utm_term",
            ];

            utmParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });

            const otherParams = ["fbclid", "gclid", "ttclid", "src", "xcod"];
            otherParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });
          }

          Object.keys(allUtms).forEach((key) => {
            if (allUtms[key]) {
              url.searchParams.set(key, allUtms[key]);
            }
          });

          if (
            quizResultId &&
            quizResultId !== "offline-mode" &&
            quizResultId !== "admin-mode" &&
            quizResultId !== "bot-mode"
          ) {
            url.searchParams.set("quiz_result_id", quizResultId);
          }

          console.log("Redirecting to checkout:", url.toString());
          localStorage.removeItem("holymind_quiz_state");
          localStorage.setItem("holymind_last_quiz_id", quizResultId);
          window.location.href = url.toString();
        } catch (error) {
          console.error("Erro ao construir URL de checkout:", error);
          window.location.href = CHECKOUT_CONFIG.baseUrl;
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao rastrear checkout, mas redirecionando mesmo assim:",
          error
        );
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      });
  };

  const faqs = [
    {
      question: "Does it really work?",
      answer:
        "We base predictions on the data you provide and recognized compatibility patterns. It’s not guesswork; it’s personalized analysis.",
    },
    {
      question: "I’m skeptical. Is this safe?",
      answer:
        "Your data are encrypted and used only to create your report. You risk nothing with our guarantee.",
    },
    {
      question: "What if I’m already in a relationship?",
      answer:
        "The report shows compatibility with your current partner and clarifies your future.",
    },
    {
      question: "Is the portrait real?",
      answer:
        "It’s a representation generated from the most likely characteristics. Users report striking similarities.",
    },
    {
      question: "Can I cancel?",
      answer:
        "Yes. The report is a one-time purchase; the monthly subscription can be canceled at any time.",
    },
  ];

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar:
        "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center py-8 max-w-3xl mx-auto px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {/* Top Banner Offer */}
<div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
  <p className="text-sm font-medium">
  Your soulmate reading is ready.
  </p>
</div>

        <h3 className="text-2xl md:text-3xl font-bold px-4 leading-tight mb-6">
  <span className="text-black">Your reading is ready.</span>
  <br />
  <span className="text-purple-600">See your soulmate today!</span>
</h3>


          {/* Imagem do desenho */}
          <div className="mb-6">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/QGBKNA0389427.jpeg"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div>
          {/* Botão para scroll */}
<div className="w-full flex justify-center mb-6">
  <button
    onClick={scrollToPriceCard}
    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 shadow-md"
  >
    SEE YOUR FULL READING
  </button>
</div>
       {/* Top Banner Offer */}
<div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
  <p className="text-sm font-medium">
    Your soulmate report is ready and includes a complete analysis of your soulmate
  </p>
</div>
               {/* Bullets de confiança */}
          <div className="w-full max-w-md mx-auto mt-4 space-y-4 text-left">
            {/* Bullet 1 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
                  alt="Users icon"
                  className="w-5 h-5"
                />
              </div>

              <p className="text-gray-900 text-sm md:text-base">
                <strong>9200 women</strong> found their soulmate.
              </p>
            </div>

            {/* Bullet 2 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2462/2462719.png"
                  alt="Chat icon"
                  className="w-5 h-5"
                />
              </div>

              <p className="text-gray-900 text-sm md:text-base">
                <strong>Thousands of consultations</strong> carried out
              </p>
            </div>
          </div>
          <div className="w-full h-px bg-gray-300/70 my-4"></div>

           {/* Título + imagem grande */}
          <h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-2 px-4">
          We uncovered key details about your soulmate. 👇🏼
          </h2>
          <div className="max-w-xl mx-auto mt-6 bg-white/90 border border-purple-100 rounded-3xl shadow-xl p-6 md:p-7 text-left">
  {/* Header */}
  <div className="mb-4">
    <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold">
      Personalized Soulmate Insight
    </p>
    <h3 className="text-lg md:text-xl font-bold text-gray-900 mt-1">
      Precise information about your soulmate
    </h3>
  </div>

  {/* Personality Traits */}
  <div className="mb-5">
    <p className="text-sm font-semibold text-gray-800 mb-2">
      Personality Traits:
    </p>

    <div className="space-y-2">
      {[
        "Deeply loyal",
        "Protective",
        "Playfully romantic",
      ].map((trait, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 bg-purple-50/80 rounded-2xl px-3 py-2"
        >
          <div className="w-7 h-7 rounded-full bg-purple-200 flex items-center justify-center">
            <span className="text-xs text-purple-800">♥</span>
          </div>
          <p className="text-sm text-gray-800">{trait}</p>
        </div>
      ))}
    </div>
  </div>

  {/* Proximity of the Meeting */}
  <div className="mb-4">
    <p className="text-sm font-semibold text-gray-800 mb-1">
     📍 Proximity of the Meeting:
    </p>
    <p className="text-sm md:text-base text-gray-700">
      <span className="font-semibold text-purple-700">
        “You’re closer than you think.”
      </span>{" "}
      Your birth chart indicates that your paths will cross{" "}
      <span className="font-semibold">within a year</span>, in a{" "}
      <span className="font-semibold">familiar setting</span>.
    </p>
  </div>

 {/* Details about your meeting – borrado */}
<div className="mb-4">
  <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
    <span className="text-pink-500">💕</span> Details about your meeting:
  </p>

  <div className="relative rounded-xl bg-gray-100/70 p-3 overflow-hidden">

    {/* Conteúdo borrado */}
    <p className="text-sm text-gray-600 blur-sm select-none opacity-70">
      This section contains specific details about how, where and under which
      circumstances your first encounter will happen.
    </p>

    {/* Overlay com cadeado */}
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className="bg-white/70 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
        <span className="text-gray-700 text-sm">🔒</span>
        <span className="text-gray-700 text-sm font-semibold">Locked</span>
      </div>
    </div>

  </div>
</div>

{/* What this drawing reveals – borrado */}
<div className="mb-4">
  <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
    <span className="text-blue-600">👤</span> What this drawing reveals:
  </p>

  <div className="relative rounded-xl bg-gray-100/70 p-3 overflow-hidden">

    {/* Conteúdo borrado */}
    <p className="text-sm text-gray-600 blur-sm select-none opacity-70">
      This section reveals deeper emotional information, the bond between you two,
      and how this connection will transform your love life.
    </p>

    {/* Overlay com cadeado */}
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className="bg-white/70 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
        <span className="text-gray-700 text-sm">🔒</span>
        <span className="text-gray-700 text-sm font-semibold">Locked</span>
      </div>
    </div>

  </div>
</div>
</div>

          {/* PITCH DE PREÇO */}
          <Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
            <CardContent className="p-6 space-y-4">
              {/* Imagem pequena acima do título */}
              <div className="w-full flex justify-center mb-3">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/zlmLXK5905984.png"
                  alt="Auraly App Preview"
                  className="w-[35%] max-w-[120px] mx-auto rounded-xl"
                />
              </div>

              {/* Título centralizado */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
                Discover the face of your soulmate with the Auraly App.
              </h3>

              {/* Imagem menor e centralizada */}
              <div className="w-full flex justify-center mb-2">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png"
                  alt="Soulmate Offer Highlight"
                  className="w-[55%] max-w-xs mx-auto rounded-xl"
                />
              </div>

              {/* Bullets */}
              <ul className="space-y-2 text-sm md:text-base text-gray-800">
                <li>
                  ✍️ <strong>Ultra-realistic</strong> hand-drawn sketch of your
                  soulmate, made by Master Aura.
                </li>
                <li>
                  💫 <strong>Uncover exclusive personality traits</strong> only
                  your soulmate has.
                </li>
                <li>
                  🗓️ <strong>Date and context</strong> most favorable for the
                  meeting.
                </li>
                <li>
                  🔮 <strong>Receive deep, personalized insights</strong> into
                  your love life.
                </li>
              </ul>

              {/* Bônus */}
              <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Synchronicity Calendar (From
                  $19, free)
                </p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Emotional Healing Guide (From
                  $9, free)
                </p>
              </div>

              {/* Texto antes do preço */}
              <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800 text-center">
                <p>
                  All this for a <strong>symbolic price</strong> to finally
                  discover who your true love is.
                </p>
              </div>

              {/* CARD DE PREÇO */}
              <div className="max-w-md mx-auto mt-2">
                <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
                  {/* Topo Roxo */}
                  <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
                    Special offer 50% OFF Today
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 space-y-4">
                    {/* Texto principal */}
                    <p className="text-center text-lg font-semibold text-gray-900">
                      The original price is{" "}
                      <span className="text-gray-500 line-through font-normal">
                        $29
                      </span>
                    </p>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2" />

                    {/* Total today */}
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
                        <span>Total today 50% OFF:</span>
                        <span className="text-green-600 text-xl font-extrabold">
                          $19
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
          >
            GET MY RESULTS
          </button>

          {/* Badge/garantia verde abaixo do botão */}
          <div className="w-full flex justify-center mb-2 mt-4">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/MqWQAB5264462.png"
              alt="Guarantee Badge"
              className="w-[35%] max-w-[120px] mx-auto rounded-xl"
            />
          </div>

          {/* Texto de trial */}
          <div className="max-w-2xl mx-auto mt-2 px-4">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By accepting this offer, you agree to start a 30-day trial on the
              Auraly App. After the trial period ends, your subscription will
              automatically renew for just $29/m. You may cancel anytime by
              contacting us at contact@auralyapp.com
            </p>
          </div>

          {/* Título + imagem grande */}
          <h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-2 px-4">
            Trusted By Over 1,000,000 Transformed Lives
          </h2>

          <div className="w-full flex justify-center mb-3 mt-1">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/YuivNF7917669.png"
              alt="Auraly App Preview"
              className="w-full max-w-md mx-auto rounded-xl"
            />
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto px-0 py-4"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.2 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <h4 className="font-bold text-gray-800 text-xl">
                        {testimonial.title}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CARD DE PREÇO ABAIXO DO SOCIAL PROOF */}
          <div className="max-w-md mx-auto mt-4">
            <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
              {/* Topo Roxo */}
              <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
                Special offer 50% OFF Today
              </div>

              {/* Conteúdo */}
              <div className="p-5 space-y-4">
                {/* Texto principal */}
                <p className="text-center text-lg font-semibold text-gray-900">
                  The original price is{" "}
                  <span className="text-gray-500 line-through font-normal">
                    $29
                  </span>
                </p>

                {/* Divider */}
                <div className="border-t border-gray-200 my-2" />

                {/* Total today */}
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
                    <span>Total today 50% OFF:</span>
                    <span className="text-green-600 text-xl font-extrabold">
                      $19
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA ABAIXO DO CARD DE PREÇO */}
          <button
            onClick={handleCheckout}
            className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
          >
            GET MY RESULTS
          </button>
          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              FAQ
            </h2>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full py-3 flex items-center justify-between gap-2"
                    >
                      <span className="text-sm md:text-base text-gray-800 font-semibold">
                        {item.question}
                      </span>
                      <ChevronRight
                        className={w-4 h-4 text-gray-500 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3 px-1">
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
O ChatGPT disse:

Pensou por 18s
O problema principal aí é que você está usando scrollToPriceCard no botão, mas não declarou essa função nem a ref do card de preço. Isso quebra o componente em runtime e a página fica toda branca.

Segue o código corrigido e completo, já com:

useRef importado

priceCardRef criado

scrollToPriceCard declarado

ref aplicado no card de preço de baixo

É só colar:

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

export default function PaywallStep({ userName, birthDate, quizResultId }) {
  const { trackEndQuiz } = useTracking();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // 👉 ref para o card de preço (lá embaixo)
  const priceCardRef = useRef<HTMLDivElement | null>(null);

  const scrollToPriceCard = () => {
    if (priceCardRef.current) {
      priceCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    if (
      quizResultId &&
      quizResultId !== "offline-mode" &&
      quizResultId !== "admin-mode" &&
      quizResultId !== "bot-mode"
    ) {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(
        (e) => console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    trackEndQuiz();

    const trackCheckout = async () => {
      if (
        quizResultId &&
        quizResultId !== "offline-mode" &&
        quizResultId !== "admin-mode" &&
        quizResultId !== "bot-mode"
      ) {
        try {
          await HybridQuizResult.update(quizResultId, {
            checkout_step_clicked: true,
          });
          console.log("Checkout click tracked successfully");
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout()
      .then(() => {
        try {
          const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
          const url = new URL(checkoutUrl);

          let allUtms: Record<string, string> = {};

          if (typeof window !== "undefined" && (window as any).utmify) {
            try {
              allUtms = (window as any).utmify.getUtms() || {};
              console.log("UTMs from UTMIFY:", allUtms);
            } catch (error) {
              console.warn("Failed to get UTMs from UTMIFY:", error);
            }
          }

          if (Object.keys(allUtms).length === 0) {
            const currentUrl = new URL(window.location.href);
            const utmParams = [
              "utm_source",
              "utm_medium",
              "utm_campaign",
              "utm_content",
              "utm_term",
            ];

            utmParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });

            const otherParams = ["fbclid", "gclid", "ttclid", "src", "xcod"];
            otherParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });
          }

          Object.keys(allUtms).forEach((key) => {
            const v = allUtms[key];
            if (v) {
              url.searchParams.set(key, v);
            }
          });

          if (
            quizResultId &&
            quizResultId !== "offline-mode" &&
            quizResultId !== "admin-mode" &&
            quizResultId !== "bot-mode"
          ) {
            url.searchParams.set("quiz_result_id", quizResultId);
          }

          console.log("Redirecting to checkout:", url.toString());
          localStorage.removeItem("holymind_quiz_state");
          localStorage.setItem("holymind_last_quiz_id", quizResultId || "");
          window.location.href = url.toString();
        } catch (error) {
          console.error("Erro ao construir URL de checkout:", error);
          window.location.href = CHECKOUT_CONFIG.baseUrl;
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao rastrear checkout, mas redirecionando mesmo assim:",
          error
        );
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      });
  };

  const faqs = [
    {
      question: "Does it really work?",
      answer:
        "We base predictions on the data you provide and recognized compatibility patterns. It’s not guesswork; it’s personalized analysis.",
    },
    {
      question: "I’m skeptical. Is this safe?",
      answer:
        "Your data are encrypted and used only to create your report. You risk nothing with our guarantee.",
    },
    {
      question: "What if I’m already in a relationship?",
      answer:
        "The report shows compatibility with your current partner and clarifies your future.",
    },
    {
      question: "Is the portrait real?",
      answer:
        "It’s a representation generated from the most likely characteristics. Users report striking similarities.",
    },
    {
      question: "Can I cancel?",
      answer:
        "Yes. The report is a one-time purchase; the monthly subscription can be canceled at any time.",
    },
  ];

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar:
        "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center py-8 max-w-3xl mx-auto px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {/* Top Banner Offer */}
          <div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
            <p className="text-sm font-medium">Your soulmate reading is ready.</p>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold px-4 leading-tight mb-6">
            <span className="text-black">Your reading is ready.</span>
            <br />
            <span className="text-purple-600">See your soulmate today!</span>
          </h3>

          {/* Imagem do desenho */}
          <div className="mb-6">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/QGBKNA0389427.jpeg"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div>

          {/* Botão para scroll */}
          <div className="w-full flex justify-center mb-6">
            <button
              onClick={scrollToPriceCard}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 shadow-md"
            >
              SEE YOUR FULL READING
            </button>
          </div>

          {/* Second banner */}
          <div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
            <p className="text-sm font-medium">
              Your soulmate report is ready and includes a complete analysis of
              your soulmate
            </p>
          </div>

          {/* Bullets de confiança */}
          <div className="w-full max-w-md mx-auto mt-4 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
                  alt="Users icon"
                  className="w-5 h-5"
                />
              </div>
              <p className="text-gray-900 text-sm md:text-base">
                <strong>9200 women</strong> found their soulmate.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2462/2462719.png"
                  alt="Chat icon"
                  className="w-5 h-5"
                />
              </div>
              <p className="text-gray-900 text-sm md:text-base">
                <strong>Thousands of consultations</strong> carried out
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-gray-300/70 my-4" />

          {/* Insight card */}
          <h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-2 px-4">
            We uncovered key details about your soulmate. 👇🏼
          </h2>

          <div className="max-w-xl mx-auto mt-6 bg-white/90 border border-purple-100 rounded-3xl shadow-xl p-6 md:p-7 text-left">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold">
                Personalized Soulmate Insight
              </p>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mt-1">
                Precise information about your soulmate
              </h3>
            </div>

            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-800 mb-2">
                Personality Traits:
              </p>

              <div className="space-y-2">
                {["Deeply loyal", "Protective", "Playfully romantic"].map(
                  (trait, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-purple-50/80 rounded-2xl px-3 py-2"
                    >
                      <div className="w-7 h-7 rounded-full bg-purple-200 flex items-center justify-center">
                        <span className="text-xs text-purple-800">♥</span>
                      </div>
                      <p className="text-sm text-gray-800">{trait}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-800 mb-1">
                📍 Proximity of the Meeting:
              </p>
              <p className="text-sm md:text-base text-gray-700">
                <span className="font-semibold text-purple-700">
                  “You’re closer than you think.”
                </span>{" "}
                Your birth chart indicates that your paths will cross{" "}
                <span className="font-semibold">within a year</span>, in a{" "}
                <span className="font-semibold">familiar setting</span>.
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                <span className="text-pink-500">💕</span> Details about your
                meeting:
              </p>

              <div className="relative rounded-xl bg-gray-100/70 p-3 overflow-hidden">
                <p className="text-sm text-gray-600 blur-sm select-none opacity-70">
                  This section contains specific details about how, where and
                  under which circumstances your first encounter will happen.
                </p>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="bg-white/70 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
                    <span className="text-gray-700 text-sm">🔒</span>
                    <span className="text-gray-700 text-sm font-semibold">
                      Locked
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-0">
              <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                <span className="text-blue-600">👤</span> What this drawing
                reveals:
              </p>

              <div className="relative rounded-xl bg-gray-100/70 p-3 overflow-hidden">
                <p className="text-sm text-gray-600 blur-sm select-none opacity-70">
                  This section reveals deeper emotional information, the bond
                  between you two, and how this connection will transform your
                  love life.
                </p>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="bg-white/70 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
                    <span className="text-gray-700 text-sm">🔒</span>
                    <span className="text-gray-700 text-sm font-semibold">
                      Locked
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PITCH DE PREÇO (primeiro card) */}
          <Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left mt-6">
            <CardContent className="p-6 space-y-4">
              <div className="w-full flex justify-center mb-3">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/zlmLXK5905984.png"
                  alt="Auraly App Preview"
                  className="w-[35%] max-w-[120px] mx-auto rounded-xl"
                />
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
                Discover the face of your soulmate with the Auraly App.
              </h3>

              <div className="w-full flex justify-center mb-2">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png"
                  alt="Soulmate Offer Highlight"
                  className="w-[55%] max-w-xs mx-auto rounded-xl"
                />
              </div>

              <ul className="space-y-2 text-sm md:text-base text-gray-800">
                <li>
                  ✍️ <strong>Ultra-realistic</strong> hand-drawn sketch of your
                  soulmate, made by Master Aura.
                </li>
                <li>
                  💫 <strong>Uncover exclusive personality traits</strong> only
                  your soulmate has.
                </li>
                <li>
                  🗓️ <strong>Date and context</strong> most favorable for the
                  meeting.
                </li>
                <li>
                  🔮 <strong>Receive deep, personalized insights</strong> into
                  your love life.
                </li>
              </ul>

              <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Synchronicity Calendar (From
                  $19, free)
                </p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Emotional Healing Guide (From
                  $9, free)
                </p>
              </div>

              <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800 text-center">
                <p>
                  All this for a <strong>symbolic price</strong> to finally
                  discover who your true love is.
                </p>
              </div>

              <div className="max-w-md mx-auto mt-2">
                <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
                  <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
                    Special offer 50% OFF Today
                  </div>

                  <div className="p-5 space-y-4">
                    <p className="text-center text-lg font-semibold text-gray-900">
                      The original price is{" "}
                      <span className="text-gray-500 line-through font-normal">
                        $29
                      </span>
                    </p>

                    <div className="border-t border-gray-200 my-2" />

                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
                        <span>Total today 50% OFF:</span>
                        <span className="text-green-600 text-xl font-extrabold">
                          $19
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
          >
            GET MY RESULTS
          </button>

          <div className="w-full flex justify-center mb-2 mt-4">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/MqWQAB5264462.png"
              alt="Guarantee Badge"
              className="w-[35%] max-w-[120px] mx-auto rounded-xl"
            />
          </div>

          <div className="max-w-2xl mx-auto mt-2 px-4">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By accepting this offer, you agree to start a 30-day trial on the
              Auraly App. After the trial period ends, your subscription will
              automatically renew for just $29/m. You may cancel anytime by
              contacting us at contact@auralyapp.com
            </p>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-2 px-4">
            Trusted By Over 1,000,000 Transformed Lives
          </h2>

          <div className="w-full flex justify-center mb-3 mt-1">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/YuivNF7917669.png"
              alt="Auraly App Preview"
              className="w-full max-w-md mx-auto rounded-xl"
            />
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto px-0 py-4"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.2 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <h4 className="font-bold text-gray-800 text-xl">
                        {testimonial.title}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CARD DE PREÇO ABAIXO DO SOCIAL PROOF (ancora do scroll) */}
          <div ref={priceCardRef} className="max-w-md mx-auto mt-4">
            <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
              <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
                Special offer 50% OFF Today
              </div>

              <div className="p-5 space-y-4">
                <p className="text-center text-lg font-semibold text-gray-900">
                  The original price is{" "}
                  <span className="text-gray-500 line-through font-normal">
                    $29
                  </span>
                </p>

                <div className="border-t border-gray-200 my-2" />

                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
                    <span>Total today 50% OFF:</span>
                    <span className="text-green-600 text-xl font-extrabold">
                      $19
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA ABAIXO DO CARD DE PREÇO */}
          <button
            onClick={handleCheckout}
            className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
          >
            GET MY RESULTS
          </button>

          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              FAQ
            </h2>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full py-3 flex items-center justify-between gap-2"
                    >
                      <span className="text-sm md:text-base text-gray-800 font-semibold">
                        {item.question}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3 px-1">
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
Isso deve parar o “tela branca” e o scroll vai funcionar certinho.

Quer que a gente limpe esse componente (porque ele tá bem grande) em seções menores, tipo subcomponentes TopBanner, InsightCard, SocialProof, etc., pra ficar mais fácil de manter?

Você disse:
crie uma copy: Eu sou a Master Aura, top physic de hollywood, ja entreguei mais de 12mil desenhos em meu aplicativo auraly app. você receberá todos detalhes da sua alma gemea e esboço em um aplicativo na plama da sua mao
O ChatGPT disse:
Aqui vai uma versão objetiva, forte e com mais credibilidade — mas também com um contraponto sutil para não soar exagerado demais:

Copy sugerida:

Eu sou a Master Aura, uma das top psychics procuradas por celebridades em Hollywood. Já entreguei mais de 12.000 desenhos e leituras dentro do meu aplicativo, o Auraly App.

Hoje, você vai receber todos os detalhes revelados sobre a sua alma gêmea — personalidade, energia, momento do encontro — junto com um esboço exclusivo, direto no app, na palma da sua mão.

Por que funciona:
– Reforça autoridade → “top psychic de Hollywood”
– Prova social forte → “12.000 desenhos”
– Clareza da entrega → “detalhes + esboço + dentro do app”
– Evita exagero que geraria desconfiança

Quer mais versões?

Você disse:
me dê ideia, qual elemento e em qual desing podemos colocar isso em nosso aoywal de forma que nao fique tao grande, fique bonito e tenha a foto da master aura: https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png
O ChatGPT disse:
Aqui estão ideias práticas e rápidas para encaixar essa apresentação da Master Aura no seu paywall sem ficar grande, sem pesar o layout e mantendo alto impacto visual.

✅ Melhores Formatos para Inserir a Master Aura no Paywall
A lógica: autoridade + credibilidade + proximidade → mas em um bloco pequeno e elegante.

Vou te dar 4 formatos prontos para você escolher.

1) Mini-Card Horizontal (o melhor)
Design: card fino, horizontal, com foto pequena à esquerda e texto curto à direita.
Benefícios: não quebra o fluxo, não fica grande, parece “assinatura oficial”.

Estrutura recomendada:

------------------------------
| [Foto pequena redonda]     |
| Master Aura                |
| “+12.000 leituras entregues”
------------------------------
Onde colocar:
➡️ Abaixo do título “Your reading is ready”
➡️ OU acima da imagem do desenho

Impacto: reforça autoridade sem interrupção visual.

2) Assinatura com Selo (estilo badge de confiança)
Um selo pequeno com foto + nome + “12k readings”.

Design:
– Foto dentro de um círculo
– Borda lilás suave
– Texto ao lado “Master Aura — 12,000 soulmate readings delivered”

Tamanho: 80–120px de altura no máximo.

Onde colocar:
➡️ Entre os bullets de confiança e o primeiro bloco da leitura.

Impacto: passa profissionalismo e autenticidade.

3) Card Flutuante com Borda Roxa (estilo testimonial curto)
Parece um micro-testemunho vindo da própria especialista.

Modelo:

Foto (pequena)
“Eu sou a Master Aura, psychic de Hollywood. Já entreguei mais de 12.000 leituras.”

Onde colocar:
➡️ Antes do pitch de preço.

Benefício: contextualiza a autoridade antes do momento do pagamento → aumenta conversão.

4) Linha com Avatar + Frase (ultra-minimalista)
A solução mais discreta.

Design:

[Foto 32px] Master Aura — 12k soulmate readings delivered
Onde colocar:
➡️ logo abaixo do “See your soulmate today!”
➡️ ou no rodapé do card da leitura

Vibe: clean, elegante, sem poluir.

📸 Foto da Master Aura (sua foto enviada)
Use ela com fundo removido ou com máscara circular, para manter visual premium.

🎨 Cores e estilo recomendados
Background branco ou lilás claro #F3E8FF

Foto com borda lilás #C6B2FF (1px)

Texto cinza escuro (#2D2D2D)

Fonte igual ao restante (Inter ou sua fonte padrão)

🟣 Minha recomendação final (melhor custo-benefício):
Formato 1 — mini-card horizontal logo abaixo do título.
É o mais discreto, bonito e passa autoridade instantânea sem ocupar espaço.

Se quiser, eu já te entrego o código React/Tailwind pronto desse card com a foto dela dentro. Quer?

Você disse:
1) Mini-Card Horizontal (o melhor)

faça esse. e adicione a mensagem que entrgar;a pelo Auraly app com todos detalhes e esboco
O ChatGPT disse:
Aqui está o mini-card horizontal exatamente no estilo que você pediu — discreto, elegante, com foto da Master Aura, texto curto e já com a frase reforçando que a entrega será pelo Auraly App com todos os detalhes e esboço.

Pronto para colar no seu paywall.

✅ Código do Mini-Card Horizontal (React + Tailwind)
Pode colocar logo abaixo do título “See your soulmate today!”

{/* Mini-card da Master Aura */}
<div className="w-full max-w-md mx-auto flex items-center gap-4 bg-purple-50 border border-purple-200 rounded-2xl p-4 mt-2 shadow-sm">
  
  {/* Foto */}
  <img
    src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
    alt="Master Aura"
    className="w-14 h-14 rounded-full object-cover border border-purple-300"
  />

  {/* Texto */}
  <div className="text-left">
    <p className="text-sm font-semibold text-gray-900">
      Master Aura — Hollywood’s top psychic
    </p>

    <p className="text-xs text-gray-700 leading-snug">
      I’ve delivered over <strong>12,000 soulmate readings</strong>.
      Your full details and sketch will be revealed inside the 
      <span className="font-semibold text-purple-700"> Auraly App</span>.
    </p>
  </div>
</div>
🔥 Por que esse card funciona?
Passa autoridade instantânea sem poluir o layout.

A foto cria prova visual de especialista real.

O texto curto reforça credibilidade + entrega premium.

A menção ao app já prepara o usuário para a lógica da oferta.

Quer que eu encaixe esse card no seu paywall atual e te envie o trecho já com o posicionamento certo?

Você disse:
crie uma headline curiosa: Como você irá receber, tipo isso
O ChatGPT disse:
Aqui vão opções curtas, curiosas e diretas, perfeitas pro paywall:

🔥 Headlines sugeridas
Como você irá receber seu desenho e leitura?

Veja como sua revelação será entregue…

Como seu retrato será disponibilizado?

Descubra como sua leitura chega até você…

Aqui está como tudo será enviado para você…

Como a Master Aura entregará sua revelação?

Veja onde sua leitura completa será liberada…

Como receber seu desenho com segurança?

Como sua alma gêmea aparecerá para você?

O que acontece depois: como você recebe tudo?

Se quiser algo mais emocional, mais misterioso ou mais direto de VSL, posso ajustar. Quer que eu refine mais?

Você disse:
Imagem carregada
retire sombra do card de precise infomation e coloque a headline How will your drawing be made available? um pouco mais afastadada do card de cima
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

export default function PaywallStep({ userName, birthDate, quizResultId }) {
  const { trackEndQuiz } = useTracking();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const scrollToPriceCard = () => {
    const priceCard = document.querySelector('.price-card-anchor');
    if (priceCard) {
      const yOffset = -100;
      const y = priceCard.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    if (
      quizResultId &&
      quizResultId !== "offline-mode" &&
      quizResultId !== "admin-mode" &&
      quizResultId !== "bot-mode"
    ) {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(
        (e) => console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    trackEndQuiz();

    const trackCheckout = async () => {
      if (
        quizResultId &&
        quizResultId !== "offline-mode" &&
        quizResultId !== "admin-mode" &&
        quizResultId !== "bot-mode"
      ) {
        try {
          await HybridQuizResult.update(quizResultId, {
            checkout_step_clicked: true,
          });
          console.log("Checkout click tracked successfully");
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout()
      .then(() => {
        try {
          const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
          const url = new URL(checkoutUrl);

          let allUtms = {};

          if (typeof window !== "undefined" && window.utmify) {
            try {
              allUtms = window.utmify.getUtms() || {};
              console.log("UTMs from UTMIFY:", allUtms);
            } catch (error) {
              console.warn("Failed to get UTMs from UTMIFY:", error);
            }
          }

          if (Object.keys(allUtms).length === 0) {
            const currentUrl = new URL(window.location.href);
            const utmParams = [
              "utm_source",
              "utm_medium",
              "utm_campaign",
              "utm_content",
              "utm_term",
            ];

            utmParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });

            const otherParams = ["fbclid", "gclid", "ttclid", "src", "xcod"];
            otherParams.forEach((param) => {
              const value = currentUrl.searchParams.get(param);
              if (value) {
                allUtms[param] = value;
              }
            });
          }

          Object.keys(allUtms).forEach((key) => {
            if (allUtms[key]) {
              url.searchParams.set(key, allUtms[key]);
            }
          });

          if (
            quizResultId &&
            quizResultId !== "offline-mode" &&
            quizResultId !== "admin-mode" &&
            quizResultId !== "bot-mode"
          ) {
            url.searchParams.set("quiz_result_id", quizResultId);
          }

          console.log("Redirecting to checkout:", url.toString());
          localStorage.removeItem("holymind_quiz_state");
          localStorage.setItem("holymind_last_quiz_id", quizResultId);
          window.location.href = url.toString();
        } catch (error) {
          console.error("Erro ao construir URL de checkout:", error);
          window.location.href = CHECKOUT_CONFIG.baseUrl;
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao rastrear checkout, mas redirecionando mesmo assim:",
          error
        );
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      });
  };

  const faqs = [
    {
      question: "Does it really work?",
      answer:
        "We base predictions on the data you provide and recognized compatibility patterns. It’s not guesswork; it’s personalized analysis.",
    },
    {
      question: "I’m skeptical. Is this safe?",
      answer:
        "Your data are encrypted and used only to create your report. You risk nothing with our guarantee.",
    },
    {
      question: "What if I’m already in a relationship?",
      answer:
        "The report shows compatibility with your current partner and clarifies your future.",
    },
    {
      question: "Is the portrait real?",
      answer:
        "It’s a representation generated from the most likely characteristics. Users report striking similarities.",
    },
    {
      question: "Can I cancel?",
      answer:
        "Yes. The report is a one-time purchase; the monthly subscription can be canceled at any time.",
    },
  ];

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar:
        "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center py-8 max-w-3xl mx-auto px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {/* Top Banner Offer */}
<div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
  <p className="text-sm font-medium">
  Your soulmate reading is ready.
  </p>
</div>

        <h3 className="text-2xl md:text-3xl font-bold px-4 leading-tight mb-6">
  <span className="text-black">Your reading is ready.</span>
  <br />
  <span className="text-purple-600">See your soulmate today!</span>
</h3>


          {/* Imagem do desenho */}
          <div className="mb-6">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/QGBKNA0389427.jpeg"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div>
          {/* Botão para scroll */}
<div className="w-full flex justify-center mb-6">
  <button
    onClick={scrollToPriceCard}
    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 shadow-md"
  >
    SEE YOUR FULL READING
  </button>
</div>
       {/* Top Banner Offer */}
<div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
  <p className="text-sm font-medium">
    Your soulmate report is ready and includes a complete analysis of your soulmate
  </p>
</div>
               {/* Bullets de confiança */}
          <div className="w-full max-w-md mx-auto mt-4 space-y-4 text-left">
            {/* Bullet 1 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
                  alt="Users icon"
                  className="w-5 h-5"
                />
              </div>

              <p className="text-gray-900 text-sm md:text-base">
                <strong>9200 women</strong> found their soulmate.
              </p>
            </div>

            {/* Bullet 2 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2462/2462719.png"
                  alt="Chat icon"
                  className="w-5 h-5"
                />
              </div>

              <p className="text-gray-900 text-sm md:text-base">
                <strong>Thousands of consultations</strong> carried out
              </p>
            </div>
          </div>
          <div className="w-full h-px bg-gray-300/70 my-4"></div>

           {/* Título + imagem grande */}
          <h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-2 px-4">
          We uncovered key details about your soulmate. 👇🏼
          </h2>
          <div className="max-w-xl mx-auto mt-6 bg-white/90 border border-purple-100 rounded-3xl shadow-xl p-6 md:p-7 text-left">
  {/* Header */}
  <div className="mb-4">
    <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold">
      Personalized Soulmate Insight
    </p>
    <h3 className="text-lg md:text-xl font-bold text-gray-900 mt-1">
      Precise information about your soulmate
    </h3>
  </div>

  {/* Personality Traits */}
  <div className="mb-5">
    <p className="text-sm font-semibold text-gray-800 mb-2">
      Personality Traits:
    </p>

    <div className="space-y-2">
      {[
        "Deeply loyal",
        "Protective",
        "Playfully romantic",
      ].map((trait, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 bg-purple-50/80 rounded-2xl px-3 py-2"
        >
          <div className="w-7 h-7 rounded-full bg-purple-200 flex items-center justify-center">
            <span className="text-xs text-purple-800">♥</span>
          </div>
          <p className="text-sm text-gray-800">{trait}</p>
        </div>
      ))}
    </div>
  </div>

  {/* Proximity of the Meeting */}
  <div className="mb-4">
    <p className="text-sm font-semibold text-gray-800 mb-1">
     📍 Proximity of the Meeting:
    </p>
    <p className="text-sm md:text-base text-gray-700">
      <span className="font-semibold text-purple-700">
        “You’re closer than you think.”
      </span>{" "}
      Your birth chart indicates that your paths will cross{" "}
      <span className="font-semibold">within a year</span>, in a{" "}
      <span className="font-semibold">familiar setting</span>.
    </p>
  </div>

 {/* Details about your meeting – borrado */}
<div className="mb-4">
  <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
    <span className="text-pink-500">💕</span> Details about your meeting:
  </p>

  <div className="relative rounded-xl bg-gray-100/70 p-3 overflow-hidden">

    {/* Conteúdo borrado */}
    <p className="text-sm text-gray-600 blur-sm select-none opacity-70">
      This section contains specific details about how, where and under which
      circumstances your first encounter will happen.
    </p>

    {/* Overlay com cadeado */}
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className="bg-white/70 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
        <span className="text-gray-700 text-sm">🔒</span>
        <span className="text-gray-700 text-sm font-semibold">Locked</span>
      </div>
    </div>

  </div>
</div>

{/* What this drawing reveals – borrado */}
<div className="mb-4">
  <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
    <span className="text-blue-600">👤</span> What this drawing reveals:
  </p>

  <div className="relative rounded-xl bg-gray-100/70 p-3 overflow-hidden">

    {/* Conteúdo borrado */}
    <p className="text-sm text-gray-600 blur-sm select-none opacity-70">
      This section reveals deeper emotional information, the bond between you two,
      and how this connection will transform your love life.
    </p>

    {/* Overlay com cadeado */}
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className="bg-white/70 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
        <span className="text-gray-700 text-sm">🔒</span>
        <span className="text-gray-700 text-sm font-semibold">Locked</span>
      </div>
    </div>

  </div>
</div>
</div>
          {/* Título centralizado */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-5 text-center">
                How will your drawing be made available?
              </h3>
{/* Mini-card da Master Aura */}
<div className="w-full max-w-md mx-auto flex items-center gap-4 bg-purple-50 border border-purple-200 rounded-2xl p-4 mt-2 shadow-sm">
  
  {/* Foto */}
  <img
    src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
    alt="Master Aura"
    className="w-14 h-14 rounded-full object-cover border border-purple-300"
  />

  {/* Texto */}
  <div className="text-left">
    <p className="text-sm font-semibold text-gray-900">
      Master Aura — Hollywood’s top psychic
    </p>

    <p className="text-xs text-gray-700 leading-snug">
      I’ve delivered over <strong>12,000 soulmate readings</strong>.
      Your full details and sketch will be revealed inside the 
      <span className="font-semibold text-purple-700"> Auraly App</span>.
    </p>
  </div>
</div>

          {/* PITCH DE PREÇO */}
          <Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
            <CardContent className="p-6 space-y-4">
              {/* Imagem pequena acima do título */}
              <div className="w-full flex justify-center mb-3">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/zlmLXK5905984.png"
                  alt="Auraly App Preview"
                  className="w-[35%] max-w-[120px] mx-auto rounded-xl"
                />
              </div>

              {/* Título centralizado */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
                Discover the face of your soulmate with the Auraly App.
              </h3>

              {/* Imagem menor e centralizada */}
              <div className="w-full flex justify-center mb-2">
                <img
                  src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/btldwX5786311.png"
                  alt="Soulmate Offer Highlight"
                  className="w-[55%] max-w-xs mx-auto rounded-xl"
                />
              </div>

              {/* Bullets */}
              <ul className="space-y-2 text-sm md:text-base text-gray-800">
                <li>
                  ✍️ <strong>Ultra-realistic</strong> hand-drawn sketch of your
                  soulmate, made by Master Aura.
                </li>
                <li>
                  💫 <strong>Uncover exclusive personality traits</strong> only
                  your soulmate has.
                </li>
                <li>
                  🗓️ <strong>Date and context</strong> most favorable for the
                  meeting.
                </li>
                <li>
                  🔮 <strong>Receive deep, personalized insights</strong> into
                  your love life.
                </li>
              </ul>

              {/* Bônus */}
              <div className="mt-4 bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Synchronicity Calendar (From
                  $19, free)
                </p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 space-y-1 text-sm md:text-base text-gray-800">
                <p>
                  🎁 <strong>Free Bonus:</strong> Emotional Healing Guide (From
                  $9, free)
                </p>
              </div>

              {/* Texto antes do preço */}
              <div className="pt-3 space-y-1 text-sm md:text-base text-gray-800 text-center">
                <p>
                  All this for a <strong>symbolic price</strong> to finally
                  discover who your true love is.
                </p>
              </div>

              {/* CARD DE PREÇO */}
              <div className="max-w-md mx-auto mt-2 price-card-anchor">
                <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
                  {/* Topo Roxo */}
                  <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
                    Special offer 50% OFF Today
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 space-y-4">
                    {/* Texto principal */}
                    <p className="text-center text-lg font-semibold text-gray-900">
                      The original price is{" "}
                      <span className="text-gray-500 line-through font-normal">
                        $29
                      </span>
                    </p>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2" />

                    {/* Total today */}
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
                        <span>Total today 50% OFF:</span>
                        <span className="text-green-600 text-xl font-extrabold">
                          $19
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
          >
            GET MY RESULTS
          </button>

          {/* Badge/garantia verde abaixo do botão */}
          <div className="w-full flex justify-center mb-2 mt-4">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/MqWQAB5264462.png"
              alt="Guarantee Badge"
              className="w-[35%] max-w-[120px] mx-auto rounded-xl"
            />
          </div>

          {/* Texto de trial */}
          <div className="max-w-2xl mx-auto mt-2 px-4">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By accepting this offer, you agree to start a 30-day trial on the
              Auraly App. After the trial period ends, your subscription will
              automatically renew for just $29/m. You may cancel anytime by
              contacting us at contact@auralyapp.com
            </p>
          </div>

          {/* Título + imagem grande */}
          <h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-2 px-4">
            Trusted By Over 1,000,000 Transformed Lives
          </h2>

          <div className="w-full flex justify-center mb-3 mt-1">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/YuivNF7917669.png"
              alt="Auraly App Preview"
              className="w-full max-w-md mx-auto rounded-xl"
            />
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto px-0 py-4"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.2 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <h4 className="font-bold text-gray-800 text-xl">
                        {testimonial.title}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CARD DE PREÇO ABAIXO DO SOCIAL PROOF */}
          <div className="max-w-md mx-auto mt-4">
            <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
              {/* Topo Roxo */}
              <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
                Special offer 50% OFF Today
              </div>

              {/* Conteúdo */}
              <div className="p-5 space-y-4">
                {/* Texto principal */}
                <p className="text-center text-lg font-semibold text-gray-900">
                  The original price is{" "}
                  <span className="text-gray-500 line-through font-normal">
                    $29
                  </span>
                </p>

                {/* Divider */}
                <div className="border-t border-gray-200 my-2" />

                {/* Total today */}
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
                    <span>Total today 50% OFF:</span>
                    <span className="text-green-600 text-xl font-extrabold">
                      $19
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA ABAIXO DO CARD DE PREÇO */}
          <button
            onClick={handleCheckout}
            className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
          >
            GET MY RESULTS
          </button>
          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              FAQ
            </h2>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full py-3 flex items-center justify-between gap-2"
                    >
                      <span className="text-sm md:text-base text-gray-800 font-semibold">
                        {item.question}
                      </span>
                      <ChevronRight
                        className={w-4 h-4 text-gray-500 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3 px-1">
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
O ChatGPT disse:

Pensou por 14s
O erro não é de sintaxe, é só ajuste de classes mesmo. Aqui vai o trecho já corrigido:

{/* Título + card de informações */}
<h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-2 px-4">
  We uncovered key details about your soulmate. 👇🏼
</h2>

<div className="max-w-xl mx-auto mt-6 bg-white/90 border border-purple-100 rounded-3xl p-6 md:p-7 text-left">
  {/* Header */}
  <div className="mb-4">
    <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold">
      Personalized Soulmate Insight
    </p>
    <h3 className="text-lg md:text-xl font-bold text-gray-900 mt-1">
      Precise information about your soulmate
    </h3>
  </div>

  {/* Personality Traits */}
  <div className="mb-5">
    <p className="text-sm font-semibold text-gray-800 mb-2">
      Personality Traits:
    </p>

    <div className="space-y-2">
      {["Deeply loyal", "Protective", "Playfully romantic"].map((trait, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 bg-purple-50/80 rounded-2xl px-3 py-2"
        >
          <div className="w-7 h-7 rounded-full bg-purple-200 flex items-center justify-center">
            <span className="text-xs text-purple-800">♥</span>
          </div>
          <p className="text-sm text-gray-800">{trait}</p>
        </div>
      ))}
    </div>
  </div>

  {/* Proximity of the Meeting */}
  <div className="mb-4">
    <p className="text-sm font-semibold text-gray-800 mb-1">
      📍 Proximity of the Meeting:
    </p>
    <p className="text-sm md:text-base text-gray-700">
      <span className="font-semibold text-purple-700">
        “You’re closer than you think.”
      </span>{" "}
      Your birth chart indicates that your paths will cross{" "}
      <span className="font-semibold">within a year</span>, in a{" "}
      <span className="font-semibold">familiar setting</span>.
    </p>
  </div>

  {/* ... (resto do card borrado igual estava) */}
</div>

{/* Headline afastada do card de cima */}
<h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-10 mb-5 text-center">
  How will your drawing be made available?
</h3>
Removi shadow-xl do card de “Precise information…” (sem sombra agora).

Coloquei mt-10 na headline "How will your drawing be made available?" pra ficar mais afastada do card de cima.

Quer que eu aprofunde mais?

Você disse:
Imagem carregada
 coloque afastamento entre mini card da aura e card do pricing tbm
O ChatGPT disse:
Pra afastar é só dar mais margem entre o mini-card e o Card de pricing.
Segue o trecho ajustado (repare no mb-8 no mini-card e mt-2→mt-0 você pode manter ou mudar, o importante é o mb-8):

{/* Mini-card da Master Aura */}
<div className="w-full max-w-md mx-auto flex items-center gap-4 bg-purple-50 border border-purple-200 rounded-2xl p-4 mt-2 mb-8 shadow-sm">
  {/* Foto */}
  <img
    src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
    alt="Master Aura"
    className="w-14 h-14 rounded-full object-cover border border-purple-300"
  />

  {/* Texto */}
  <div className="text-left">
    <p className="text-sm font-semibold text-gray-900">
      Master Aura — Auraly top psychic
    </p>
    <p className="text-xs text-gray-700 leading-snug">
      I’ve delivered over <strong>12,000 soulmate readings</strong>. Your full
      details and sketch will be revealed inside the
      <span className="font-semibold text-purple-700"> Auraly App</span>.
    </p>
  </div>
</div>

{/* PITCH DE PREÇO */}
<Card className="max-w-xl mx-auto bg-white border-purple-100 shadow-md mb-6 text-left">
  {/* ...resto igual */}
</Card>
Se quiser ainda mais espaço, troca mb-8 por mb-10 ou mb-12.
Quer que eu ajuste mais algum espaçamento do paywall?

Você disse:
Imagem carregada
quero o secute bem emabixo do botao quase colado e o disclaimer quase colado no secure
O ChatGPT disse:
Segue exatamente como você pediu: secure quase colado no botão, disclaimer quase colado no secure.
Basta substituir seu bloco atual por este:

{/* CTA */}
<button
  onClick={handleCheckout}
  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
>
  GET MY RESULTS
</button>

{/* Secure Badge — quase colado no botão */}
<div className="w-full flex justify-center mt-2 mb-1">
  <img
    src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/MqWQAB5264462.png"
    alt="Guarantee Badge"
    className="w-[32%] max-w-[110px] mx-auto"
  />
</div>

{/* Disclaimer — quase colado no secure */}
<div className="max-w-2xl mx-auto mt-1 px-4">
  <p className="text-xs text-gray-500 text-center leading-relaxed">
    By accepting this offer, you agree to start a 30-day trial on the Auraly App.
    After the trial period ends, your subscription will automatically renew for
    just $29/m. You may cancel anytime by contacting us at
    contact@auralyapp.com
  </p>
</div>

          {/* Título + imagem grande */}
          <h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-2 px-4">
            Trusted By Over 1,000,000 Transformed Lives
          </h2>

          <div className="w-full flex justify-center mb-3 mt-1">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/YuivNF7917669.png"
              alt="Auraly App Preview"
              className="w-full max-w-md mx-auto rounded-xl"
            />
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto px-0 py-4"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.2 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <h4 className="font-bold text-gray-800 text-xl">
                        {testimonial.title}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CARD DE PREÇO ABAIXO DO SOCIAL PROOF */}
          <div className="max-w-md mx-auto mt-4">
            <div className="rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-white">
              {/* Topo Roxo */}
              <div className="bg-[#4B4BA8] text-white text-center py-2 text-sm font-semibold">
                Special offer 50% OFF Today
              </div>

              {/* Conteúdo */}
              <div className="p-5 space-y-4">
                {/* Texto principal */}
                <p className="text-center text-lg font-semibold text-gray-900">
                  The original price is{" "}
                  <span className="text-gray-500 line-through font-normal">
                    $29
                  </span>
                </p>

                {/* Divider */}
                <div className="border-t border-gray-200 my-2" />

                {/* Total today */}
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
                    <span>Total today 50% OFF:</span>
                    <span className="text-green-600 text-xl font-extrabold">
                      $19
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA ABAIXO DO CARD DE PREÇO */}
          <button
            onClick={handleCheckout}
            className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300"
          >
            GET MY RESULTS
          </button>
          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              FAQ
            </h2>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full py-3 flex items-center justify-between gap-2"
                    >
                      <span className="text-sm md:text-base text-gray-800 font-semibold">
                        {item.question}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3 px-1">
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
