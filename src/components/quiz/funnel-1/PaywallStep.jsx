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
