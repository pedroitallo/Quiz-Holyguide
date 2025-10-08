import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto">
      <img
        src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
        alt="Madame Aura"
        className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
        loading="lazy"
        decoding="async"
      />
      <div className="flex flex-col pt-1">
        <p className="text-sm text-gray-600">Madame Aura is typing...</p>
      </div>
    </div>
  );
}