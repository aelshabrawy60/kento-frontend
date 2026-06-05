import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

/* ─── Confetti particle ─────────────────────────────────────────────────── */
function ConfettiParticle({ style }) {
  return <div style={style} className="confetti-particle" />;
}

/* ─── Success Page ───────────────────────────────────────────────────────── */
function SuccessView({ countdown, isTestMode }) {
  const particles = Array.from({ length: 60 });
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
  const shapes = ['circle', 'square', 'triangle'];

  return (
    <div className="payment-page payment-page--success">
      {/* Confetti */}
      <div className="confetti-container" aria-hidden="true">
        {particles.map((_, i) => {
          const color = colors[i % colors.length];
          const shape = shapes[i % shapes.length];
          const left = `${Math.random() * 100}%`;
          const delay = `${Math.random() * 3}s`;
          const duration = `${3 + Math.random() * 3}s`;
          const size = `${6 + Math.random() * 8}px`;
          return (
            <ConfettiParticle
              key={i}
              style={{
                left,
                animationDelay: delay,
                animationDuration: duration,
                width: size,
                height: size,
                backgroundColor: shape !== 'triangle' ? color : 'transparent',
                borderRadius: shape === 'circle' ? '50%' : shape === 'square' ? '2px' : '0',
                borderLeft: shape === 'triangle' ? `${parseInt(size) / 2}px solid transparent` : undefined,
                borderRight: shape === 'triangle' ? `${parseInt(size) / 2}px solid transparent` : undefined,
                borderBottom: shape === 'triangle' ? `${size} solid ${color}` : undefined,
              }}
            />
          );
        })}
      </div>

      {/* Card */}
      <div className="payment-card payment-card--success">
        <div className="payment-card__glow payment-card__glow--success" />

        {/* Icon */}
        <div className="payment-icon payment-icon--success">
          <svg viewBox="0 0 52 52" className="payment-check-svg" aria-hidden="true">
            <circle className="payment-check-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="payment-check-tick" fill="none" d="M14 27l8 8 16-16" />
          </svg>
        </div>

        <h1 className="payment-title payment-title--success">Payment Successful!</h1>
        <p className="payment-subtitle">Your booking has been confirmed and paid.</p>
        <p className="payment-hint">The photographer will be in touch soon to coordinate your session.</p>

        {/* Test mode badge */}
        {isTestMode && (
          <div className="payment-badge payment-badge--test">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
            </svg>
            <span>Test payment — <strong>no real charge</strong> was made to your card.</span>
          </div>
        )}

        {/* Divider */}
        <div className="payment-divider">
          <span className="payment-divider__line" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="payment-divider__icon" aria-hidden="true">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span className="payment-divider__line" />
        </div>

        {/* Countdown */}
        <div className="payment-redirect">
          <div className="payment-redirect__spinner" aria-hidden="true" />
          <span>Redirecting to your bookings in&nbsp;<strong className="payment-redirect__count">{countdown}s</strong></span>
        </div>

        <Link id="go-to-bookings-btn" to="/bookings" className="payment-btn payment-btn--primary">
          Go to My Bookings
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

/* ─── Failure Page ───────────────────────────────────────────────────────── */
function FailureView() {
  return (
    <div className="payment-page payment-page--failure">
      {/* Background blobs */}
      <div className="failure-blob failure-blob--1" aria-hidden="true" />
      <div className="failure-blob failure-blob--2" aria-hidden="true" />

      <div className="payment-card payment-card--failure">
        <div className="payment-card__glow payment-card__glow--failure" />

        {/* Shake icon */}
        <div className="payment-icon payment-icon--failure">
          <svg viewBox="0 0 52 52" className="payment-x-svg" aria-hidden="true">
            <circle className="payment-x-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="payment-x-line1" fill="none" d="M16 16 L36 36" />
            <path className="payment-x-line2" fill="none" d="M36 16 L16 36" />
          </svg>
        </div>

        <h1 className="payment-title payment-title--failure">Payment Failed</h1>
        <p className="payment-subtitle">Your payment could not be completed.</p>
        <p className="payment-hint">No charge was made to your account. Please try again or use a different payment method.</p>

        {/* Reasons list */}
        <div className="failure-reasons">
          <p className="failure-reasons__title">Common reasons:</p>
          <ul className="failure-reasons__list">
            <li>
              <span className="failure-reasons__dot" />
              Insufficient funds or card limit reached
            </li>
            <li>
              <span className="failure-reasons__dot" />
              Incorrect card details entered
            </li>
            <li>
              <span className="failure-reasons__dot" />
              Payment session timed out
            </li>
            <li>
              <span className="failure-reasons__dot" />
              Transaction declined by your bank
            </li>
          </ul>
        </div>

        <div className="failure-actions">
          <Link id="retry-payment-btn" to="/bookings" className="payment-btn payment-btn--primary">
            Try Again
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </Link>
          <Link id="go-home-btn" to="/" className="payment-btn payment-btn--ghost">
            Go Home
          </Link>
        </div>

        <p className="failure-support">
          Need help?{' '}
          <a href="mailto:support@kentograph.com" className="failure-support__link">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}

/* ─── Root Component ─────────────────────────────────────────────────────── */
function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(7);

  /*
   * Kashier appends these params to merchantRedirect on success or failure:
   *   ?paymentStatus=SUCCESS|FAILED
   *   &merchantOrderId=<your booking id>
   *   &orderId=<kashier internal id>
   *   &orderReference=<kashier reference>
   *   &cardDataToken=<tokenized card>
   *   &maskedCard=<masked PAN>
   *   &merchantId=<your MID>
   *   &mode=test|live
   *   &signature=<hmac>
   */
  const paymentStatus = searchParams.get('paymentStatus');
  const mode          = searchParams.get('mode');
  const merchantOrderId = searchParams.get('merchantOrderId') || searchParams.get('orderId');

  // Treat missing paymentStatus (direct page visit) as success for UX
  const isSuccess  = paymentStatus === 'SUCCESS' || paymentStatus === null;
  const isTestMode = mode === 'test';

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/bookings';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSuccess]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Layout ── */
        .payment-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .payment-page--success {
          background: radial-gradient(ellipse at 20% 10%, #d1fae5 0%, transparent 50%),
                      radial-gradient(ellipse at 80% 90%, #a7f3d0 0%, transparent 50%),
                      radial-gradient(ellipse at 60% 40%, #bfdbfe 0%, transparent 40%),
                      #f0fdf4;
        }
        .payment-page--failure {
          background: radial-gradient(ellipse at 20% 10%, #fee2e2 0%, transparent 50%),
                      radial-gradient(ellipse at 80% 90%, #fecaca 0%, transparent 50%),
                      radial-gradient(ellipse at 50% 50%, #fef3c7 0%, transparent 60%),
                      #fff5f5;
        }

        /* ── Card ── */
        .payment-card {
          position: relative;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 28px;
          padding: 48px 40px;
          max-width: 460px;
          width: 100%;
          text-align: center;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 24px 60px rgba(0,0,0,0.08);
          border: 1px solid rgba(255, 255, 255, 0.8);
          overflow: hidden;
          z-index: 10;
          animation: cardEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes cardEnter {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .payment-card__glow {
          position: absolute;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          width: 280px;
          height: 280px;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.25;
          pointer-events: none;
        }
        .payment-card__glow--success { background: #10b981; }
        .payment-card__glow--failure { background: #ef4444; }

        /* ── Typography ── */
        .payment-title {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }
        .payment-title--success { color: #064e3b; }
        .payment-title--failure { color: #7f1d1d; }

        .payment-subtitle {
          font-size: 15px;
          color: #6b7280;
          margin-bottom: 6px;
          font-weight: 500;
        }
        .payment-hint {
          font-size: 13px;
          color: #9ca3af;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        /* ── Success SVG check animation ── */
        .payment-icon {
          width: 96px;
          height: 96px;
          margin: 0 auto 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .payment-icon--success {
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          box-shadow: 0 0 0 12px rgba(16, 185, 129, 0.08);
          animation: iconPop 0.5s 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .payment-icon--failure {
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          box-shadow: 0 0 0 12px rgba(239, 68, 68, 0.08);
          animation: iconShake 0.5s 0.4s ease both;
        }
        @keyframes iconPop {
          from { opacity: 0; transform: scale(0.4); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes iconShake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-6px); }
          40%     { transform: translateX(6px); }
          60%     { transform: translateX(-4px); }
          80%     { transform: translateX(4px); }
        }

        .payment-check-svg, .payment-x-svg {
          width: 52px;
          height: 52px;
        }

        /* Check animation */
        .payment-check-circle {
          stroke: #10b981;
          stroke-width: 2;
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: drawCircle 0.6s 0.5s ease forwards;
        }
        .payment-check-tick {
          stroke: #10b981;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: drawTick 0.4s 1s ease forwards;
        }
        @keyframes drawCircle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes drawTick {
          to { stroke-dashoffset: 0; }
        }

        /* X animation */
        .payment-x-circle {
          stroke: #ef4444;
          stroke-width: 2;
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: drawCircle 0.6s 0.5s ease forwards;
        }
        .payment-x-line1, .payment-x-line2 {
          stroke: #ef4444;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-dasharray: 30;
          stroke-dashoffset: 30;
        }
        .payment-x-line1 { animation: drawTick 0.3s 1s ease forwards; }
        .payment-x-line2 { animation: drawTick 0.3s 1.15s ease forwards; }

        /* ── Test badge ── */
        .payment-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 12px;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 24px;
        }
        .payment-badge--test {
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #92400e;
        }

        /* ── Divider ── */
        .payment-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .payment-divider__line {
          flex: 1;
          height: 1px;
          background: #f3f4f6;
        }
        .payment-divider__icon { color: #d1d5db; }

        /* ── Redirect ── */
        .payment-redirect {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #f9fafb;
          border-radius: 12px;
          padding: 14px 20px;
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 20px;
        }
        .payment-redirect__spinner {
          width: 14px;
          height: 14px;
          border: 2px solid #e5e7eb;
          border-top-color: #10b981;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          flex-shrink: 0;
        }
        .payment-redirect__count {
          color: #10b981;
          font-weight: 700;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Buttons ── */
        .payment-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
          width: 100%;
        }
        .payment-btn--primary {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
        }
        .payment-btn--primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
        }
        .payment-btn--primary:active { transform: scale(0.98); }

        .payment-btn--ghost {
          background: transparent;
          border: 1.5px solid #e5e7eb;
          color: #6b7280;
        }
        .payment-btn--ghost:hover {
          background: #f9fafb;
          border-color: #d1d5db;
          color: #374151;
        }

        /* ── Failure specific ── */
        .failure-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.4;
        }
        .failure-blob--1 {
          width: 350px;
          height: 350px;
          background: #fee2e2;
          top: -100px;
          right: -100px;
        }
        .failure-blob--2 {
          width: 300px;
          height: 300px;
          background: #fef3c7;
          bottom: -100px;
          left: -100px;
        }
        .failure-reasons {
          background: #fff7f7;
          border: 1px solid #fee2e2;
          border-radius: 14px;
          padding: 16px 20px;
          text-align: left;
          margin-bottom: 24px;
        }
        .failure-reasons__title {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #9ca3af;
          margin-bottom: 10px;
        }
        .failure-reasons__list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .failure-reasons__list li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #6b7280;
        }
        .failure-reasons__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fca5a5;
          flex-shrink: 0;
        }
        .failure-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }
        .failure-support {
          font-size: 13px;
          color: #9ca3af;
        }
        .failure-support__link {
          color: #ef4444;
          font-weight: 500;
          text-decoration: none;
        }
        .failure-support__link:hover {
          text-decoration: underline;
        }

        /* ── Confetti ── */
        .confetti-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .confetti-particle {
          position: absolute;
          top: -20px;
          animation: confettiFall linear both;
        }
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }

        @media (max-width: 480px) {
          .payment-card { padding: 36px 24px; }
          .payment-title { font-size: 24px; }
        }
      `}</style>

      {isSuccess
        ? <SuccessView countdown={countdown} isTestMode={isTestMode} />
        : <FailureView />
      }
    </>
  );
}

export default PaymentSuccessPage;
