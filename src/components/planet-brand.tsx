'use client';

import {useCallback,useEffect,useState,useSyncExternalStore} from 'react';
import {createPortal} from 'react-dom';
import Link from 'next/link';
import {Pause,Play} from 'lucide-react';

const motionPreference='(prefers-reduced-motion: reduce)';
function subscribeMotion(callback:()=>void){const media=window.matchMedia(motionPreference);media.addEventListener('change',callback);return ()=>media.removeEventListener('change',callback);}

export function PlanetBrand({children}:{children:React.ReactNode}){
 const [universe,setUniverse]=useState<HTMLElement|null>(null);
 const ref=useCallback((node:HTMLAnchorElement|null)=>setUniverse(node?.closest<HTMLElement>('.brand-universe')??null),[]);
 const [paused,setPaused]=useState(false);
 const reducedMotion=useSyncExternalStore(subscribeMotion,()=>window.matchMedia(motionPreference).matches,()=>true);

 useEffect(()=>{
  if(!universe)return;
  let visible=false;
  const update=()=>{
   universe.setAttribute('data-motion',!paused&&visible&&!document.hidden&&!reducedMotion?'running':'paused');
  };
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update();},{threshold:0.15});
  observer.observe(universe);
  document.addEventListener('visibilitychange',update);
  update();
  return ()=>{
   observer.disconnect();
   document.removeEventListener('visibilitychange',update);
   universe.removeAttribute('data-motion');
  };
 },[paused,reducedMotion,universe]);

 return <><Link ref={ref} href="/" className="brand brand-large" aria-label="Galáxia Camisetas — início">{children}</Link>{universe&&!reducedMotion&&createPortal(<button type="button" className="planet-motion-toggle" aria-label={paused?'Retomar animação do planeta':'Pausar animação do planeta'} onClick={()=>setPaused(value=>!value)}>{paused?<Play size={16}/>:<Pause size={16}/>}</button>,universe)}</>;
}
