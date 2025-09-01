import React, { useEffect } from 'react';

export default function Up2SoulmatePage() {
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
    <div style={{
      fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
      color: '#1f1f1f',
      minHeight: '100vh',
      background: '#ffffff',
      display: 'grid',
      placeItems: 'center',
      padding: '28px'
    }}>
      <style>{`
        :root{
          --bg: #f3e8ff;           
          --card: #ffffff;
          --ink: #1f1f1f;
          --muted:#6b7280;
          --accent:#6d28d9;        
          --accent-soft:#ede9fe;
          --success:#22c55e;       
          --success-dark:#16a34a;
          --danger:#dc2626;        
          --danger-dark:#b91c1c;
        }
        .card{
          width:min(720px, 100%);
          background:var(--card);
          border-radius:20px;
          border:1px solid #efeafe;
          box-shadow:0 24px 60px rgba(61,39,120,.18);
          overflow:hidden;
        }
        .header{
          display:flex; align-items:center; gap:10px;
          padding:16px 20px;
          font-weight:800; letter-spacing:.2px;
          background:linear-gradient(90deg, var(--accent-soft), #faf5ff);
          border-bottom:1px solid #efeafe;
        }
        .dot{width:10px; height:10px; border-radius:999px; background:var(--accent); box-shadow:0 0 0 6px rgba(109,40,217,.12)}
        .hero{
          padding:24px 26px 8px 26px;
        }
        .hero h1{
          margin:0 0 10px; font-size:clamp(26px, 3.2vw, 38px); line-height:1.15; letter-spacing:-.2px;
        }
        .lede{
          margin:0 0 14px; color:var(--muted); line-height:1.55; font-size:16px;
        }
        .callout{
          margin:12px 0 0; padding:14px 16px; border-radius:12px;
          background:#faf5ff; border:1px dashed #e9d5ff; font-size:14px;
        }
        .message-wrap{
          margin:22px 24px; position:relative; border-radius:16px; overflow:hidden;
          background:radial-gradient(500px 260px at 20% 20%, #ffffff 0%, #f6f2ff 55%, #efe9ff 100%);
          border:1px solid #f1eaff;
          padding:28px;
        }
        .stars{
          position:absolute; inset:0; opacity:.45; pointer-events:none;
          background-image:
            radial-gradient(#fff 1px, transparent 1px),
            radial-gradient(#fff 1px, transparent 1px);
          background-size:100px 100px, 160px 160px;
          background-position:20px 40px, 60px 80px;
        }
        .message{
          position:relative; z-index:1;
          max-width:560px; margin:auto; text-align:left;
          background:rgba(255,255,255,.88);
          border:1px solid #efeafe; border-radius:16px;
          padding:18px 18px;
          box-shadow:0 12px 30px rgba(0,0,0,.06);
          filter:blur(6px);               
          user-select:none; pointer-events:none;
        }
        .message h3{margin:0 0 8px; color:var(--accent); font-size:20px}
        .message p{margin:0; color:#3f3f46; font-size:14px; line-height:1.55}
        .lock{
          position:absolute; inset:0; display:grid; place-items:center; z-index:2;
        }
        .lock .badge{
          display:inline-flex; align-items:center; gap:10px;
          background:rgba(255,255,255,.9);
          border:1px solid #efeafe; border-radius:999px;
          padding:10px 14px; font-weight:800; color:var(--accent);
          box-shadow:0 10px 26px rgba(0,0,0,.08);
        }
        .cta{
          padding:0 26px 28px; display:grid; gap:10px; justify-items:center; text-align:center;
        }
        .btn{
          display:inline-flex; align-items:center; justify-content:center; gap:10px;
          text-decoration:none; background:var(--success); color:#fff;
          font-weight:900; letter-spacing:.2px; border-radius:12px;
          padding:16px 22px; width:100%;
          box-shadow:0 16px 36px rgba(34,197,94,.28);
          transition:transform .05s ease, background .2s ease, box-shadow .2s ease;
        }
        .btn:hover{background:var(--success-dark); box-shadow:0 20px 42px rgba(22,163,74,.32)}
        .btn:active{transform:translateY(1px)}
        .btn-secondary{
          display:inline-flex; align-items:center; justify-content:center;
          text-decoration:none; background:var(--danger); color:#fff;
          font-weight:700; border-radius:8px;
          padding:10px 18px; font-size:14px;
          transition:background .2s ease; width:auto;
        }
        .btn-secondary:hover{background:var(--danger-dark);}
        .price-note{font-size:12px; color:var(--muted)}
        
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
        
        @media (min-width:640px){ .btn{width:auto; min-width:320px} }
      `}</style>

      <main className="card" role="dialog" aria-modal="true" aria-labelledby="title">
        <div className="header">
          <span className="dot" aria-hidden="true"></span>
          Urgent – I just channeled a message from your soulmate
        </div>

        <section className="hero">
          <h1 id="title">✨ Your Soulmate Is Trying to Speak to You…</h1>
          <p className="lede">As you read these words, a silent call is echoing through the universe. It's the voice of your Soulmate—charged with feelings that can no longer wait to reach you.</p>
          <div className="callout">
            ⚠️ <strong>But there's something you must know now:</strong> This message won't be available for long. Energies are shifting and if you don't listen <strong>TODAY</strong>, you could miss a sign that only appears once in a lifetime.
          </div>
        </section>

        <section className="message-wrap" aria-label="Locked preview">
          <div className="stars"></div>

          <div className="message">
            <h3>"A message crossing dimensions…"</h3>
            <p>Some doors open only once. When you feel the pull, answer it. The heart recognizes what the mind cannot explain.</p>
          </div>

          <div className="lock">
            <a href="#" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <span className="badge">🔒 Locked — unlock to reveal</span>
            </a>
          </div>
        </section>

        <section className="hero" aria-label="What you will discover">
          <ul style={{ margin: '0', paddingLeft: '18px' }}>
            <li><strong>The exact words</strong> your Soulmate wants you to hear right now.</li>
            <li>An <strong>urgent warning</strong> about the future of you two.</li>
            <li>A <strong>simple gesture</strong> that can bring the real-life meeting closer.</li>
          </ul>
          <p className="lede" style={{ marginTop: '12px' }}>
            Imagine holding in your hands the most intimate piece of this person's soul… feeling each word move through your heart—and realizing this connection is real and alive <em>right now</em> for only $3.9 in 12x
          </p>
        </section>
           
        <div className="price-note" style={{ textAlign: 'center', marginBottom: '10px' }}>
        </div>
      </main>

      {/* Hotmart Sales Funnel */}
      <div id="hotmart-sales-funnel"></div>
    </div>
  );
}