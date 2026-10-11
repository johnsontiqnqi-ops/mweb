import { useCallback, useEffect, useRef, useState } from 'react';
import PixelSwap from './PixelSwap';
import './IntroSequence.css';

const HOME_REVEAL_MS = 2600;

export default function IntroSequence({ onReveal, onExitStart, onFinish }) {
  const [active, setActive] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [message, setMessage] = useState('ARHAT');
  const timers = useRef(new Set());
  const ending = useRef(false);
  const schedule = useCallback((callback, delay) => {
    const timer = window.setTimeout(() => {
      timers.current.delete(timer);
      callback();
    }, delay);
    timers.current.add(timer);
    return timer;
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current.clear();
  }, []);
  const exit = useCallback((immediate = false) => {
    if (ending.current) {
      if (immediate) { clearTimers(); onFinish(); }
      return;
    }
    ending.current = true;
    clearTimers();
    onReveal();
    onExitStart();
    setLeaving(true);
    if (immediate) onFinish();
    else schedule(onFinish, HOME_REVEAL_MS);
  }, [clearTimers, onReveal, onExitStart, onFinish, schedule]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    schedule(() => setActive(true), 1100);
    // Ensure the homepage remains reachable even if animation completion fails.
    schedule(() => exit(), 6500);
    const keydown = event => {
      if (event.key === 'Escape') exit(true);
    };
    window.addEventListener('keydown', keydown);
    return () => {
      clearTimers();
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', keydown);
    };
  }, [clearTimers, exit, schedule]);

  const complete = useCallback(isSecond => {
    if (!isSecond || ending.current) return;
    setMessage('Build Your Own Sleep');
    // Warm up the homepage and product video behind the opaque second screen.
    onReveal();
    schedule(() => exit(), 1400);
  }, [exit, onReveal, schedule]);

  return <section className={`site-intro ${leaving ? 'site-intro--leaving' : ''}`}
    style={{ '--intro-reveal-duration': `${HOME_REVEAL_MS}ms` }} role="dialog" aria-modal="true" aria-label="Welcome to ARHAT" data-intro-phase={leaving ? 'leaving' : active ? 'second' : 'first'}>
    <span className="intro-sr-only" role="status" aria-live="polite">{message}</span>
    <PixelSwap
      className="intro-pixel-swap"
      firstContent={<div className="intro-frame intro-frame--brand"><div className="intro-frame-center"><p className="intro-kicker">A MODULAR APPROACH TO REST</p><span className="intro-brand">ARHAT</span><span className="intro-rule"/></div></div>}
      secondContent={<div className="intro-frame intro-frame--promise"><div className="intro-frame-center"><p className="intro-kicker">COMFORT, ON YOUR TERMS</p><span className="intro-promise">Build Your<br/>Own Sleep</span><span className="intro-rule"/></div></div>}
      lightweight pixelSize={64} gap={0} pixelRadius={0} pixelSpin={0} pixelScale={0.35}
      duration={1400} pixelDuration={450} pattern="random" randomness={0} fade
      trigger="manual" active={active} onComplete={complete}
      style={{ height: '100%', aspectRatio: 'auto' }}
    />
    <div className="intro-footer">
      <span>ARHAT <span className="intro-footer-separator">/</span> MODULAR SLEEP</span>
      <button type="button" onClick={() => exit(true)} autoFocus>Skip intro <span aria-hidden="true">↗</span></button>
    </div>
  </section>;
}
