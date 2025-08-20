
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

export default function PersonalizedPaper({ userName, birthDate, onContinue }) {
  // Formatar a data para exibição brasileira
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="text-center py-8">
      {/* Carregar fonte Dancing Script */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
          Seus dados foram registrados no universo
        </h1>
        
        <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-md mx-auto">
          O cosmos agora conhece sua essência e está preparando sua conexão espiritual.
        </p>
      </motion.div>

      {/* Imagem com overlay de texto manuscrito */}
      <div className="relative mb-12 mx-auto max-w-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/523379acb_papel2.webp"
            alt="Mesa com papel e caneta"
            className="w-full h-auto rounded-lg shadow-lg"
            loading="lazy"
            decoding="async"
          />
          
          {/* Overlay com texto manuscrito no papel menor à direita */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div 
              className="absolute text-gray-800"
              style={{
                // Posicionamento no pequeno papel à direita
                top: '18%',
                right: '14%',
                width: '22%',
                height: '22%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1 }}
                style={{
                  fontFamily: 'Dancing Script, cursive',
                  fontWeight: '600',
                  fontSize: 'clamp(8px, 2.5vw, 14px)',
                  lineHeight: '1.4',
                  textAlign: 'center',
                  textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.1)',
                  filter: 'sepia(10%) contrast(1.1)',
                  transform: 'rotate(-1deg)'
                }}
              >
                <div style={{ marginBottom: '4px' }}>
                  {userName || '...'}
                </div>
                <div>
                  {formatDate(birthDate) || '...'}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="space-y-6"
      >
        <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-sm border border-purple-100">
          <Heart className="w-8 h-8 mx-auto text-purple-500 mb-3" />
          <p className="text-gray-700 text-lg leading-relaxed">
            Seus dados pessoais foram inscritos no livro do destino. 
            O universo agora está alinhando as energias para revelar 
            sua verdadeira conexão espiritual.
          </p>
        </div>

        <Button
          onClick={onContinue}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-12 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Desbloquear Minha Conexão Espiritual
        </Button>

        <p className="text-sm text-gray-500 mt-6">
          ✨ Sua alma gêmea está sendo preparada pelo universo
        </p>
      </motion.div>
    </div>
  );
}
