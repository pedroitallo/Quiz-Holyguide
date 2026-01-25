import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

const BUTTON_DELAY_SECONDS = 270;

export default function PaywallStep({ userName, birthDate, quizResultId }) {
  const { trackEndQuiz } = useTracking();
  const [timeLeft, setTimeLeft] = useState(BUTTON_DELAY_SECONDS);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    trackEndQuiz();

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
  }, [quizResultId, trackEndQuiz]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setButtonEnabled(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setButtonEnabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleCheckout = async () => {
    if (!buttonEnabled) return;

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
          localStorage.removeItem("holymind_quiz_state_vsl1");
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center py-8 max-w-3xl mx-auto px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="w-full bg-purple-100 text-purple-900 py-3 px-4 rounded-xl text-center shadow-sm">
            <p className="text-sm font-medium">
              Your soulmate reading is ready.
            </p>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold px-4 leading-tight">
            <span className="text-black">Watch this important message</span>
            <br />
            <span className="text-purple-600">About your soulmate reading</span>
          </h3>

          <div className="w-full max-w-2xl mx-auto">
            <div className="rounded-xl shadow-lg overflow-hidden bg-black">
              <div
                dangerouslySetInnerHTML={{
                  __html: `
                    <vturb-smartplayer
                      id="vid-68a204ee95de0adfa0e77121"
                      style="display: block; margin: 0 auto; width: 100%;"
                    ></vturb-smartplayer>
                    <script type="text/javascript">
                      (function() {
                        if (!document.querySelector('script[src*="68a204ee95de0adfa0e77121"]')) {
                          var s=document.createElement("script");
                          s.src="https://scripts.converteai.net/8f5333fd-fe8a-42cd-9840-10519ad6c7c7/players/68a204ee95de0adfa0e77121/v4/player.js";
                          s.async=true;
                          document.head.appendChild(s);
                        }
                      })();
                    </script>
                  `
                }}
              />
            </div>
          </div>

          {!buttonEnabled ? (
            <div className="w-full flex justify-center">
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl py-5 px-8 max-w-md">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Lock className="w-6 h-6 text-yellow-600" />
                  <p className="text-base font-bold text-yellow-800">
                    Watch the video to unlock
                  </p>
                </div>
                <p className="text-3xl font-bold text-yellow-900 text-center">
                  {formatTime(timeLeft)}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <button
                onClick={handleCheckout}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-12 rounded-2xl text-xl md:text-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                GET MY SOULMATE DRAWING NOW
              </button>
            </div>
          )}

          <div className="max-w-2xl mx-auto mt-6 px-4">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By accepting this offer, you agree to start a 7-day trial on the
              Auraly App. After the trial period ends, your subscription will
              automatically renew for just $39/m. You may cancel anytime by
              contacting us at contact@auralyapp.com
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
