import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HybridQuizResult } from "@/entities/HybridQuizResult";
import { useTracking } from "@/hooks/useTracking";

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click",
};

const BUTTON_DELAY_SECONDS = 270;

export default function PaywallStep({ userName, birthDate, quizResultId }) {
  const { trackEndQuiz } = useTracking();
  const [showButton, setShowButton] = useState(false);

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
    const checkVideoTime = () => {
      const smartplayer = window.smartplayer;
      if (smartplayer && smartplayer.instances) {
        const playerInstance = smartplayer.instances[0];
        if (playerInstance) {
          playerInstance.on('timeupdate', (currentTime) => {
            if (currentTime >= BUTTON_DELAY_SECONDS && !showButton) {
              setShowButton(true);
            }
          });
        }
      }
    };

    const timer = setTimeout(() => {
      checkVideoTime();
    }, 2000);

    const fallbackTimer = setTimeout(() => {
      setShowButton(true);
    }, BUTTON_DELAY_SECONDS * 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [showButton]);

  const handleCheckout = async () => {

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
                      var s=document.createElement("script");
                      s.src="https://scripts.converteai.net/8f5333fd-fe8a-42cd-9840-10519ad6c7c7/players/68a204ee95de0adfa0e77121/v4/player.js";
                      s.async=true;
                      document.head.appendChild(s);
                    </script>
                  `
                }}
              />
            </div>
          </div>

          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full flex justify-center"
            >
              <button
                onClick={handleCheckout}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-12 rounded-2xl text-xl md:text-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                GET MY SOULMATE DRAWING NOW
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
