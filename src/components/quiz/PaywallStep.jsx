import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar } from 'lucide-react';
import SalesSection from './SalesSection';

export default function PaywallStep({ userName, birthDate }) {
  const [showSales, setShowSales] = useState(false);

  // This useEffect handles timing for SalesSection
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSales(true);
    }, 275000); // 4 minutes and 35 seconds = 275000ms

    return () => clearTimeout(timer);
  }, []);

  const handleCheckout = async () => {
    try {
      // Corrected URL: removed extra '}'
      const checkoutUrl = "https://payments.holymind.life/products/map-of-the-divine-soul";
      const url = new URL(checkoutUrl);

      // Capturar e passar TODAS as UTMs da URL atual
      const currentUrl = new URL(window.location.href);
      
      // Parâmetros UTM padrão
      const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
      utmParams.forEach(param => {
        const value = currentUrl.searchParams.get(param);
        if (value) {
          url.searchParams.set(param, value);
        }
      });

      // Parâmetros específicos de tracking (fbclid, src, xcod, etc.)
      const specificParams = ['fbclid', 'src', 'xcod']; 
      specificParams.forEach(param => {
        const value = currentUrl.searchParams.get(param);
        if (value) {
          url.searchParams.set(param, value);
        }
      });

      console.log('Redirecting to checkout:', url.toString());
      // Limpar estado do quiz em andamento antes de redirecionar
      localStorage.removeItem('holymind_quiz_state');
      window.location.href = url.toString();
    } catch (error) {
      console.error("Erro ao construir URL de checkout:", error);
      // Fallback para garantir que o usuário seja redirecionado mesmo em caso de erro
      window.location.href = "https://payments.holymind.life/products/map-of-the-divine-soul";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Não informado";
    const [year, month, day] = dateString.split('-');
    if (day && month && year) {
        return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  useEffect(() => {
    // New script source and player ID - Updated VSL
    const scriptSrc = "https://scripts.converteai.net/8f5333fd-fe8a-42cd-9840-10519ad6c7c7/players/68a204ee95de0adfa0e77121/v4/player.js";
    const playerId = "vid-68a204ee95de0adfa0e77121";

    if (document.querySelector(`script[src="${scriptSrc}"]`)) {
      return;
    }

    console.log("Carregando script do VSL - PaywallStep montado");
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      console.log("Removendo script do VSL - PaywallStep desmontado");
      const scriptElements = document.querySelectorAll(`script[src="${scriptSrc}"]`);
      scriptElements.forEach((s) => {
        if (document.head.contains(s)) {
          document.head.removeChild(s);
        }
      });

      const playerContainer = document.getElementById(playerId);
      if (playerContainer) {
        playerContainer.innerHTML = "";
      }

      // Limpar variáveis globais do player se existirem
      if (window.smartplayer) {
        delete window.smartplayer;
      }
    };
  }, []);

  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8">

        <h1 className="text-purple-600 mb-4 text-lg font-bold md:text-3xl leading-tight">Your Revelation Is Ready! Discover Who Your Divine Soul Is</h1>
        
        <Card className="w-fit mx-auto bg-white/50 border-purple-100 shadow-md mb-6">
            <CardContent className="p-3 flex items-center justify-center gap-4 md:gap-6">
                <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-2 rounded-full">
                        <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="text-sm font-semibold text-gray-800">{userName || 'Not provided'}</p>
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

        <div className="mb-2 shadow-lg rounded-xl overflow-hidden bg-gray-200 min-h-[300px] flex items-center justify-center">
          <vturb-smartplayer
            id="vid-68a204ee95de0adfa0e77121"
            style={{
              display: 'block',
              margin: '0 auto',
              width: '100%',
              maxWidth: '400px',
              minHeight: '250px'
            }}>
          </vturb-smartplayer>
        </div>

        {showSales && (
          <SalesSection 
            userName={userName}
            birthDate={birthDate}
            onCheckout={handleCheckout}
          />
        )}
      </motion.div>
    </div>
  );
}