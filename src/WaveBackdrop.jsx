import { useEffect, useState } from 'react';
import GradientWaves from './GradientWaves';

export default function WaveBackdrop() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [compact, setCompact] = useState(() => matchMedia('(max-width: 760px)').matches);
  useEffect(() => {
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    const small=matchMedia('(max-width: 760px)');
    const updateMotion=()=>setReduced(motion.matches);
    const updateSize=()=>setCompact(small.matches);
    motion.addEventListener('change',updateMotion);small.addEventListener('change',updateSize);
    return()=>{motion.removeEventListener('change',updateMotion);small.removeEventListener('change',updateSize);};
  },[]);
  return <div className="site-wave-backdrop" aria-hidden="true">
    <GradientWaves horizonColor="#3B82F6" waveColor="#9fffe3" crestColor="#ffffff"
      speed={reduced?0:0.28} amplitude={2.5} waveScale={0.6} waveRatio={0.9}
      swell={35} turbulence={20} tilt={1.11} zoom={1} height={5.5} fogDepth={30}
      detail={compact?'low':'medium'} brightness={1} opacity={0.9}
      mouseInteraction={!reduced&&!compact} parallaxStrength={0.3}
      grain={!reduced} grainIntensity={0.025}/>
    <div className="wave-legibility-shade"/>
  </div>;
}
