import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Bem-vindo ao HolyGuide Soulmate
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Descubra seu amor divino através da nossa leitura espiritual
        </p>
        <Link to={createPageUrl('funnel-1')}>
          <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Iniciar Quiz
          </button>
        </Link>
      </div>
    </div>
  );
}