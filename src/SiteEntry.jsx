import { createContext, useCallback, useEffect, useState } from 'react';
import IntroSequence from './IntroSequence';
import WaveBackdrop from './WaveBackdrop';

export const EntryReadyContext = createContext(true);

// Play on a fresh home-page visit; product deep links and in-app navigation remain direct.
export default function SiteEntry({ children }) {
  const [showIntro, setShowIntro] = useState(() =>
    window.location.pathname === '/' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [siteReady, setSiteReady] = useState(!showIntro);
  const [revealing, setRevealing] = useState(false);
  const beginReveal = useCallback(() => setRevealing(true), []);
  const reveal = useCallback(() => setSiteReady(true), []);
  const finish = useCallback(() => { setSiteReady(true); setShowIntro(false); }, []);
  useEffect(() => {
    if (showIntro) return;
    const frame = requestAnimationFrame(() => {
      const hash = window.location.hash.slice(1);
      const target = hash ? document.getElementById(hash) : document.querySelector('main h1');
      if (hash) target?.scrollIntoView({ behavior: 'instant' });
      if (target && document.activeElement === document.body) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [showIntro]);
  return <>
    <WaveBackdrop/>
    <div className={`site-content ${showIntro ? revealing ? 'site-content--revealing' : 'site-content--covered' : ''}`} inert={showIntro} aria-hidden={showIntro ? true : undefined}>
      {siteReady && <EntryReadyContext.Provider value={!showIntro}>{children}</EntryReadyContext.Provider>}
    </div>
    {showIntro && <IntroSequence onReveal={reveal} onExitStart={beginReveal} onFinish={finish}/>}
  </>;
}
