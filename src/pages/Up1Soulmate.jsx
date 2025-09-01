import React from 'react';

export default function Up1SoulmatePage() {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      lineHeight: '1.6',
      color: '#333',
      background: '#fff',
      padding: '20px',
      maxWidth: '800px',
      margin: 'auto'
    }}>
      <style>{`
        .headline-red {
          color: #e74c3c;
          font-weight: 800;
          text-align: center;
          text-transform: uppercase;
          margin-bottom: 20px;
          font-size: clamp(1.3rem, 5vw, 1.8rem);
        }
        .subheadline {
          color: #2c3e50;
          font-weight: 700;
          text-align: center;
          margin-bottom: 28px;
          font-size: clamp(1.1rem, 4.6vw, 1.4rem);
        }
        .alert {
          color: #d63031;
          font-weight: 600;
          margin: 20px 0;
          background: #fff3cd;
          padding: 10px;
          border-left: 4px solid #e17055;
        }
        .locked-list {
          display: grid;
          gap: 12px;
          margin: 20px 0;
        }
        .locked-card {
          border: 1px solid #ebeaf5;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 10px 24px rgba(17, 24, 39, .08);
          padding: 14px 16px;
          display: grid;
          gap: 6px;
        }
        .locked-title {
          font-weight: 700;
          color: #2d3436;
          font-size: clamp(.95rem, 3.8vw, 1rem);
        }
        .locked-value {
          color: #636e72;
          filter: blur(5px);
          font-size: clamp(.9rem, 3.6vw, 1rem);
        }
        .lock-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .lock-emoji {
          flex: 0 0 auto;
        }
        @media (min-width: 640px) {
          .locked-card {
            grid-template-columns: 1fr auto;
            align-items: center;
          }
        }
      `}</style>

      <h4 className="headline-red">WAIT! DON'T LEAVE THIS PAGE</h4>
      <h5 className="subheadline">I DISCOVERED SOMETHING VERY IMPORTANT ABOUT YOUR SOULMATE</h5>
      
      <p>I have read your astrological chart again and discovered even stronger signs about your Soul Mate! This includes the name of this person, the place where you are destined to meet, and their characteristics.</p>
      
      <p>These revelations are right in front of you below, but they remain hidden until you unlock them.</p>
      
      <p className="alert">⚠️ Warning: this message may disappear at any moment, so find out everything about your soul mate while this page is still available.</p>

      <section className="locked-list">
        <div className="locked-card">
          <div className="lock-row">
            <div className="locked-title">Name of your Soulmate:</div>
          </div>
          <div className="locked-value">Alexander Johnson</div>
        </div>
        
        <div className="locked-card">
          <div className="lock-row">
            <div className="locked-title">Meeting Place:</div>
          </div>
          <div className="locked-value">Coffee shop downtown</div>
        </div>
        
        <div className="locked-card">
          <div className="lock-row">
            <div className="locked-title">Expected Date of Meeting:</div>
          </div>
          <div className="locked-value">Between March 15th and April 22nd, 2025</div>
        </div>
        
        <div className="locked-card">
          <div className="lock-row">
            <div className="locked-title">Age of Your Soulmate:</div>
          </div>
          <div className="locked-value">Between 28 and 35 years old</div>
        </div>
        
        <div className="locked-card">
          <div className="lock-row">
            <div className="locked-title">Main Characteristics of Your Soulmate:</div>
          </div>
          <div className="locked-value">Expressive brown eyes, warm smile, creative profession, loves animals and has a small scar on their right hand</div>
        </div>
      </section>

      <p style={{ fontStyle: 'italic', textAlign: 'center', margin: '20px 0' }}>
        ✨ This complete revelation will be sent to your email immediately after clicking the button below. I will also send you important new revelations about your soul mate every week through my personalized guidance. ✨
      </p>

      <p style={{ textAlign: 'center' }}>
        You will have access to all of this within my exclusive app called <strong>Holy Guide</strong>, which you will receive access to via email for free.
      </p>

      <p style={{ textAlign: 'center' }}>
        Click below to discover everything about your soul mate now. Available for just $29
      </p>
    </div>
  );
}