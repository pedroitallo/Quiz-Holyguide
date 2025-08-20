
import React, { useState, useRef } from "react";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PalmReading({ onPhotoTaken }) { // Removed userCity from props
  const [isCapturing, setIsCapturing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [uploadError, setUploadError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const fileInputRef = useRef(null);

  const handlePhotoCapture = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPhotoUrl(localUrl);

    setIsCapturing(true);
    setUploadError(false);

    try {
      const { file_url } = await UploadFile({ file });
      setIsCapturing(false);

      setTimeout(() => {
        setIsScanning(true);
        setTimeout(() => {
          onPhotoTaken(file_url);
        }, 3000);
      }, 500);

    } catch (error) {
      console.warn("Erro ao fazer upload da foto, continuando sem salvar:", error);
      setIsCapturing(false);
      setUploadError(true);
      
      setTimeout(() => {
        setIsScanning(true);
        setTimeout(() => {
          onPhotoTaken(localUrl);
        }, 3000);
      }, 1000);
    }
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-purple-600 text-2xl mb-4 font-bold leading-tight">
          The Secrets To Revealing Your Divine Soul May Be In The Palm Of Your Hand
        </h1>
        
        <p className="text-gray-600 mb-12 mx-auto text-base leading-relaxed max-w-md">
          Through a proven spiritual analysis of your palm, we will reveal intimate and surprising details about who the universe has destined to be your other half
        </p>
      </motion.div>

      <div className="relative mb-12">
        <motion.div
          className="relative mx-auto w-80 h-96 bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl shadow-lg flex items-center justify-center overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Palma da mão do usuário"
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
              loading="eager"
            />
          ) : (
            <div className={`w-48 h-48 ${!imageLoaded ? 'lazy-placeholder' : ''} rounded-lg`}>
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/95061bf72_image-Photoroom1.png"
                alt="Ícone de leitura da palma da mão"
                className="w-48 h-48 object-contain"
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                decoding="async"
              />
            </div>
          )}

          {isScanning && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <motion.div
                className="w-full h-1.5 bg-cyan-300/80 shadow-[0_0_15px_5px_rgba(0,255,255,0.4)]"
                initial={{ y: -180 }}
                animate={{ y: 180 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoCapture}
        className="hidden"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Button
          onClick={triggerCamera}
          disabled={isCapturing || isScanning}
          className="btn-primary w-full max-w-sm md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCapturing ? (
            <>
              <Loader2 className="w-7 h-7 mr-3 animate-spin" />
              Processing...
            </>
          ) : isScanning ? (
            <>
              <div className="w-7 h-7 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing your palm...
            </>
          ) : (
            <>
              <Camera className="w-7 h-7 mr-3" />
              Click To Take Photo
            </>
          )}
        </Button>

        {uploadError && (
          <p className="text-sm text-orange-600 mt-2">
            ⚠️ Connection issue detected, but continuing analysis...
          </p>
        )}

        <p className="text-sm text-gray-500 mt-4">
          📱 Make sure to align your hand in the center of the screen and fit it perfectly into the photo with good visual quality.
        </p>
      </motion.div>
    </div>
  );
}
