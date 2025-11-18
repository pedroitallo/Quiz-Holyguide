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
          {/* Top Banner Offer */}
<div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
  <p className="text-sm font-medium">
    Secure your soulmate sketch with <strong>50% OFF</strong>
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
