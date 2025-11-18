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
                  ✍️ Ultra-realistic, hand-drawn sketch of your soulmate, made by Master Aura.
                </li>
                <li>
                  💫 Uncover exclusive personality traits only your soulmate has
                </li>
                <li>🗓️ Date and context most favorable for the meeting</li>
                <li>
                  🔮 Receive deep, personalized insights into your love life.
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
