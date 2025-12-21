import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Checkout() {
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(p => (p <= 0 ? 0 : p - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <>
      <Helmet>
        <title>Checkout - Auraly App</title>
      </Helmet>

      <div className="min-h-screen bg-white py-8 relative">

        {/* Banner visível apenas no mobile */}
        <div className="block sm:hidden relative w-full">
          {/* Fundo branco por trás */}
          <div
            className="
              absolute top-[225px] left-0 w-full h-[160px]
              bg-white pointer-events-none
            "
          />
          {/* Imagem lilás grande e centralizada */}
          <div className="absolute top-[180px] left-1/2 -translate-x-1/2 z-30 flex justify-center w-full">
            <img
              src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1764206229429-gnigxpllczc.png"
              alt="Your drawing soulmate"
              className="
                w-[95vw] max-w-[520px]
                h-auto object-contain
              "
            />
          </div>
        </div>

        {/* Botão de Compra */}
        <div className="max-w-3xl mx-auto px-4 mb-8">
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300 shadow-lg"
          >
            COMPLETE YOUR PURCHASE
          </button>
        </div>
      </div>

      {/* Modal de Pagamento */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Complete Your Payment</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[calc(90vh-80px)]">
            <iframe
              src="https://payments.auralyapp.com/"
              className="w-full h-full border-0"
              title="Payment Gateway"
              allow="payment"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
