import React, { useEffect } from 'react';

export default function Up3SoulmatePage() {
  useEffect(() => {
    // Carregar script do Hotmart quando o componente montar
    const loadHotmartScript = () => {
      // Verificar se o script já existe
      if (document.querySelector('script[src*="hotmart-checkout-elements"]')) {
        // Se já existe, apenas inicializar
        if (window.checkoutElements) {
          try {
            window.checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel');
          } catch (error) {
            console.warn('Erro ao inicializar Hotmart checkout:', error);
          }
        }
        return;
      }

      // Criar e carregar o script
      const script = document.createElement('script');
      script.src = 'https://checkout.hotmart.com/lib/hotmart-checkout-elements.js';
      script.async = true;
      script.onload = () => {
        console.log('Script Hotmart carregado com sucesso');
        // Aguardar um pouco para garantir que o script foi processado
        setTimeout(() => {
          if (window.checkoutElements) {
            try {
              window.checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel');
              console.log('Hotmart checkout inicializado com sucesso');
            } catch (error) {
              console.error('Erro ao inicializar Hotmart checkout:', error);
            }
          } else {
            console.error('checkoutElements não está disponível');
          }
        }, 500);
      };
      script.onerror = () => {
        console.error('Erro ao carregar script do Hotmart');
      };
      document.head.appendChild(script);
    };

    loadHotmartScript();

    // Cleanup quando o componente for desmontado
    return () => {
      const hotmartContainer = document.getElementById('hotmart-sales-funnel');
      if (hotmartContainer) {
        hotmartContainer.innerHTML = '';
      }
    };
  }, []);

  return (
    <div>
      <style>{`
        :root{
          --bg: #F4F1FF;            
          --ink: #1A1523;           
          --muted:#5E5873;          
          --accent:#6B4CF6;         
          --accent-ink:#3A2AB0;     
          --success:#12B76A;        
          --border:#ECEAF6;
          --shadow: 0 10px 28px rgba(56, 33, 146, .10);
          --radius:18px;
          --price:"$24";
          --warn:#F97316;
        }

        *{box-sizing:border-box}
        body{
          margin:0;
          background: var(--bg);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
          color: var(--ink);
          line-height: 1.55;
          display:flex;
          align-items:flex-start;
          justify-content:center;
          padding: clamp(20px, 4vw, 56px) 16px;
        }

        .wrap{
          max-width: 820px;
          width:100%;
        }
        .stack{
          text-align:center;
          margin: 0 auto;
          padding: clamp(16px, 3vw, 28px);
          background:#fff;
          border:1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }

        h4{
          margin: 0 0 18px 0;
          font-size: clamp(20px, 3vw, 28px);
          font-weight: 900;
          letter-spacing:.2px;
        }
        h4 .wait{
          color: var(--warn);
          font-weight: 900;
        }

        .lead{
          font-size: clamp(16px, 2.2vw, 20px);
          color: var(--muted);
          margin: 4px 0 6px 0;
        }
        .stat{
          font-size: clamp(15px, 2.1vw, 18px);
          font-weight: 700;
          margin: 6px 0 26px 0;
        }

        .locks{
          margin: 0 auto 30px;
          padding: 0;
          list-style:none;
          display:grid;
          gap:12px;
          max-width:500px;
        }
        .lock-item{
          display:flex; 
          align-items:center; 
          gap:10px;
          padding:14px 16px;
          border:1px dashed rgba(107,76,246,.45);
          border-radius:12px;
          background: rgba(107,76,246,.06);
          font-weight:600;
          font-size:15px;
          justify-content:flex-start;
        }
        .lock-item .cta{
          margin-left: auto;
          color: var(--accent-ink);
          font-size:13px;
          font-weight:700;
        }

        .offer{
          margin: 8px auto 0;
          max-width: 640px;
          background: linear-gradient(180deg, rgba(107,76,246,.06), rgba(107,76,246,0));
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: clamp(14px, 2.6vw, 22px);
          text-align:center;
        }
        .offer p{
          margin: 0;
          color: var(--ink);
        }
        .benefit{
          margin: 0 0 18px 0;
          font-size: clamp(15px, 2vw, 18px);
        }

        .price-line{
          display:flex; align-items:center; justify-content:center; gap:12px; flex-wrap:wrap;
          margin: 10px 0 6px 0;
        }
        .price-badge{
          display:inline-flex; align-items:center; gap:8px;
          background: rgba(18,183,106,.12);
          border:1px solid rgba(18,183,106,.35);
          color: var(--success);
          font-weight:900; letter-spacing:.4px;
          padding:8px 12px; border-radius:999px;
        }
        .price-badge::after{
          content: var(--price);
          font-variant-numeric: tabular-nums;
          margin-left: 6px;
        }
        .one-time{
          font-size:13px; color: var(--muted);
          background:#fff; border:1px dashed var(--border);
          padding:6px 10px; border-radius:999px;
          margin-bottom: 6px;
          display:inline-block;
        }

        .tiny{
          margin-top:4px;
          font-size:12px; 
          color: var(--muted);
        }

        .footer{
          text-align:center;
          color: var(--muted);
          font-size:12px;
          margin-top: 10px;
        }

        #hotmart-sales-funnel {
          position: relative;
        }

        #hotmart-sales-funnel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 119px;
          width: 100%;
          background-color: white;
          z-index: 999;
          pointer-events: none;
        }
      `}</style>

      <main className="wrap">
        <section className="stack" aria-labelledby="headline">
          <h4 id="headline"><span className="wait">⚠️ WAIT!</span> IMPORTANT COMPATIBILITY REVELATION LOCKED</h4>

          <p className="lead"><em>Even if you know his face and the day you'll meet…</em></p>
          <p className="stat">👉 73% of women still confuse a soulmate with a false connection.</p>

          <ul className="locks">
            <li className="lock-item">
              <span>🔒 Compatibility Score</span>
              <span className="cta">unlock now</span>
            </li>
            <li className="lock-item">
              <span>🔒 Relationship Strengths</span>
              <span className="cta">unlock now</span>
            </li>
            <li className="lock-item">
              <span>🔒 Hidden Risks</span>
              <span className="cta">unlock now</span>
            </li>
          </ul>

          <div className="offer">
            <p className="benefit">
              This instant revelation gives you the certainty you need to recognize the right person — and avoid heartbreak or wasted years with the wrong one.
            </p>

            <div className="price-line">
              <span className="price-badge">Today only</span>
              <span className="one-time">one-time only</span>
            </div>

            <p className="tiny">
              Complete compatibility blueprint delivered instantly
            </p>
          </div>
        </section>
      </main>

      {/* Hotmart Sales Funnel */}
      <div id="hotmart-sales-funnel"></div>
    </div>
  );
}