import { lazy, Suspense, useContext, useEffect, useRef, useState } from 'react';
import { EntryReadyContext } from './SiteEntry';

const ModularScene = lazy(() => import('./ModularScene'));

export default function DeferredMattressScene(props) {
  const ready = useContext(EntryReadyContext);
  const host = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ready || visible) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '120px' });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, [ready, visible]);
  return <div ref={host} className="deferred-mattress-scene">
    {ready && visible && <Suspense fallback={null}><ModularScene {...props}/></Suspense>}
  </div>;
}
