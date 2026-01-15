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
  const [redtrackLoaded, setRedtrackLoaded] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(CHECKOUT_CONFIG.baseUrl);

  const scrollToPriceCard = () => {
    const priceCard = document.querySelector(".price-card-anchor");
    if (priceCard) {
      const yOffset = -200;
      const y =
        priceCard.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const buildCheckoutUrl = () => {
      try {
        const url = new URL(CHECKOUT_CONFIG.baseUrl);
        const currentUrl = new URL(window.location.href);

        let allUtms = {};

        if (typeof window !== "undefined" && window.utmify) {
          try {
            allUtms = window.utmify.getUtms() || {};
          } catch (error) {
            console.warn("Failed to get UTMs from UTMIFY:", error);
          }
        }

        if (Object.keys(allUtms).length === 0) {
          const utmParams = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
          utmParams.forEach((param) => {
            const value = currentUrl.searchParams.get(param);
            if (value) allUtms[param] = value;
          });

          const otherParams = ["fbclid", "gclid", "ttclid", "src", "xcod"];
          otherParams.forEach((param) => {
            const value = currentUrl.searchParams.get(param);
            if (value) allUtms[param] = value;
          });
        }

        Object.keys(allUtms).forEach((key) => {
          if (allUtms[key]) url.searchParams.set(key, allUtms[key]);
        });

        if (quizResultId && quizResultId !== "offline-mode" && quizResultId !== "admin-mode" && quizResultId !== "bot-mode") {
          url.searchParams.set("quiz_result_id", quizResultId);
        }

        setCheckoutUrl(url.toString());
      } catch (error) {
        console.error("Error building checkout URL:", error);
      }
    };

    // Load RedTrack script ONLY for funnel-gads2
    const redtrackScript = document.createElement('script');
    redtrackScript.type = 'text/javascript';
    redtrackScript.src = 'https://rdk.auralyapp.com/track.js?rtkcmpid=693c84f9ea09666661d1bbfa';
    redtrackScript.async = true;

    redtrackScript.onload = () => {
      console.log('✅ RedTrack script loaded and ready for funnel-gads2');
      setRedtrackLoaded(true);

      // Rebuild checkout URL after RedTrack loads (in case it adds rtk_clickid to URL)
      setTimeout(() => {
        buildCheckoutUrl();
      }, 500);
    };

    redtrackScript.onerror = () => {
      console.error('❌ Failed to load RedTrack script');
      setRedtrackLoaded(true);
      buildCheckoutUrl();
    };

    document.head.appendChild(redtrackScript);

    // Build initial checkout URL
    buildCheckoutUrl();

    console.log('🔄 Loading RedTrack script for funnel-gads2...');

    if (
      quizResultId &&
      quizResultId !== "offline-mode" &&
      quizResultId !== "admin-mode" &&
      quizResultId !== "bot-mode"
    ) {
      HybridQuizResult.update(quizResultId, {
        pitch_step_viewed: true,
      }).catch((e) =>
        console.warn("Failed to update pitch step view:", e)
      );
    }

    // Cleanup: remove script when component unmounts
    return () => {
      if (redtrackScript.parentNode) {
        redtrackScript.parentNode.removeChild(redtrackScript);
      }
    };
  }, [quizResultId]);

  const handleCheckout = async (e) => {
    console.log('🛒 Checkout link clicked - RedTrack loaded:', redtrackLoaded);
    trackEndQuiz();

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
        console.log("✅ Checkout click tracked successfully");
      } catch (error) {
        console.warn("⚠️ Failed to track checkout click:", error);
      }
    }

    console.log("🔄 Redirecting to checkout:", checkoutUrl);
    localStorage.removeItem("holymind_quiz_state_funnel_gads2");
    localStorage.setItem("holymind_last_quiz_id", quizResultId);
    window.location.href = checkoutUrl;
  };

  const faqs = [
    {
      question: "Does it really work?",
      answer:
        "We base predictions on the data you provide and recognized compatibility patterns. It's not guesswork; it's personalized analysis.",
    },
    {
      question: "I'm skeptical. Is this safe?",
      answer:
        "Your data are encrypted and used only to create your report. You risk nothing with our guarantee.",
    },
    {
      question: "What if I'm already in a relationship?",
      answer:
        "The report shows compatibility with your current partner and clarifies your future.",
    },
    {
      question: "Is the portrait real?",
      answer:
        "It's a representation generated from the most likely characteristics. Users report striking similarities.",
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
      text: "I'm so grateful for this app and for Master Aura! She's an amazing astrologer - detailed and calming. I can't wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned - like we were truly meant to meet. I'm beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn't sure if it was worth it, but seriously... no regrets! I'm having some amazing connections now 😍",
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
          {/* ======================= TOP HEADER ======================= */}
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

          {/* ======================= DRAWING IMAGE ======================= */}
          <div className="mb-6">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/QGBKNA0389427.jpeg"
              alt="Your True Love Preview"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          </div>

          {/* ======================= SCROLL BUTTON ======================= */}
          <div className="w-full flex justify-center mb-6">
            <button
              onClick={scrollToPriceCard}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 shadow-md"
            >
              SEE YOUR FULL READING
            </button>
          </div>

          {/* ======================= SECOND BANNER ======================= */}
          <div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl mb-6 text-center shadow-sm">
            <p className="text-sm font-medium">
              Your soulmate report is ready and includes a complete analysis of
              your soulmate.
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
                <strong>Thousands of consultations</strong> carried out.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-gray-300/70 my-4" />

          {/* ======================= INSIGHT CARD ======================= */}
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
                  "You're closer than you think."
                </span>{" "}
                Your birth chart indicates that your paths will cross{" "}
                <span className="font-semibold">within a year</span>, in a{" "}
                <span className="font-semibold">familiar setting</span>.
              </p>
            </div>

            {/* Details about your meeting – blurred */}
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

                {/* Overlay com cadeado */}
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

            {/* What this drawing reveals – blurred */}
            <div className="mb-4">
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

                {/* Overlay com cadeado */}
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

          {/* ======================= HOW YOU RECEIVE SECTION ======================= */}
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
                Master Aura - Auraly top psychic
              </p>
              <p className="text-xs text-gray-700 leading-snug">
                I've delivered over <strong>12,000 soulmate readings</strong>.
                Your full details and sketch will be revealed inside the
                <span className="font-semibold text-purple-700">
                  {" "}
                  Auraly App
                </span>
                .
              </p>
            </div>
          </div>

          {/* ======================= FIRST PRICING CARD + CTA + SECURE ======================= */}
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

              {/* CARD DE PREÇO com âncora para scroll */}
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
                        $49
                      </span>
                    </p>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2" />

                    {/* Total today */}
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
                        <span>Total today 80% OFF:</span>
                        <span className="text-green-600 text-xl font-extrabold">
                          $9
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
            GET MY DRAWING SOULMATE
          </button>

          {/* Secure Badge - quase colado no botão */}
          <div className="w-full flex justify-center mt-2 mb-1">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/MqWQAB5264462.png"
              alt="Guarantee Badge"
              className="w-[32%] max-w-[110px] mx-auto"
            />
          </div>

          {/* Disclaimer - quase colado no secure */}
          <div className="max-w-2xl mx-auto mt-1 px-4">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By accepting this offer, you agree to start a 7-day trial on the
              Auraly App. After the trial period ends, your subscription will
              automatically renew for just $49/m. You may cancel anytime by
              contacting us at contact@auralyapp.com
            </p>
          </div>

          {/* ======================= TRUSTED SECTION ======================= */}
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
                    $49
                  </span>
                </p>

                {/* Divider */}
                <div className="border-t border-gray-200 my-2" />

                {/* Total today */}
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between text-gray-900 text-sm font-bold">
                    <span>Total today 80% OFF:</span>
                    <span className="text-green-600 text-xl font-extrabold">
                      $9
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
            GET MY DRAWING SOULMATE
          </button>

          {/* ======================= FAQ ======================= */}
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
        </motion.div>
      </div>
    </div>
  );
}
