import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Load Metrito script only in production
if (import.meta.env.PROD) {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://sst.holymind.life/mtrtprxy/tag?id=685d94c5b4f48be86e0eb114';
  document.head.appendChild(script);
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
) 