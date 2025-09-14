import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto">
      <img
        src="https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/public/68850befb229de9dd8e4dc73/7f64f63b1_CapturadeTela2025-09-07as232549.png"
        alt="Madame Aura"
        className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
        loading="eager"
        decoding="async"
        fetchpriority="high"
        width="40"
        height="40"
      />
      <div className="flex flex-col pt-1">
        <p className="text-sm text-gray-600">Madame Aura is typing...</p>
      </div>
    </div>
  );
}