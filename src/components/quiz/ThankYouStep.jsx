import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Gift } from 'lucide-react';

export default function ThankYouStep({ userName }) {
    return (
        <div className="text-center py-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, type: 'spring' }}
            >
                <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-6" />
                <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
                    {userName ? `Obrigado, ${userName}!` : 'Obrigado!'}
                </h1>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-md mx-auto">
                    Sua leitura espiritual completa foi desbloqueada. O universo está agora conspirando a seu favor.
                </p>

                <div className="space-y-6 max-w-sm mx-auto">
                    <Button 
                        size="lg" 
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                    >
                        <Download className="mr-2 h-5 w-5" />
                        Baixar Minha Leitura Completa (PDF)
                    </Button>
                    <Button 
                        variant="outline"
                        size="lg"
                        className="w-full"
                    >
                        <Gift className="mr-2 h-5 w-5" />
                        Receber Bônus Exclusivo
                    </Button>
                </div>
                
                <p className="text-sm text-gray-500 mt-8">
                    Enviamos uma cópia para o seu e-mail. Que sua jornada seja iluminada! ✨
                </p>
            </motion.div>
        </div>
    );
}