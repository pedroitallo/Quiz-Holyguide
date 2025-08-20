import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto">
      <img
        src="https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/adbb98955_Perfil.webp"
        alt="Madame Aura"
        className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
      />
      <div className="flex flex-col pt-1">
        <p className="text-sm text-gray-600">Madame Aura is typing...</p>
      </div>
    </div>
  );
}