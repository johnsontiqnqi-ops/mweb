import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Procedural quilted ivory fabric; the reference advertisement is not reused as a texture.
function quiltTexture(repeatX, repeatY) {
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#d4cfc4';ctx.fillRect(0,0,256,256);
  for(let row=-1;row<6;row++)for(let col=-1;col<6;col++){
    const x=col*64+(row%2)*32,y=row*64;
    const gradient=ctx.createRadialGradient(x+28,y+25,3,x+32,y+32,43);
    gradient.addColorStop(0,'#fffdf5');gradient.addColorStop(.66,'#f1eee4');gradient.addColorStop(1,'#d4cfc4');
    ctx.fillStyle=gradient;ctx.beginPath();ctx.moveTo(x+32,y);ctx.quadraticCurveTo(x+58,y+6,x+64,y+32);ctx.quadraticCurveTo(x+57,y+58,x+32,y+64);ctx.quadraticCurveTo(x+6,y+58,x,y+32);ctx.quadraticCurveTo(x+6,y+6,x+32,y);ctx.fill();
    ctx.strokeStyle='rgba(114,107,92,.10)';ctx.lineWidth=.8;ctx.stroke();
  }
  for(let y=0;y<256;y+=2){ctx.fillStyle='rgba(92,86,74,.025)';ctx.fillRect(0,y,256,1);}
  const texture=new THREE.CanvasTexture(canvas);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(repeatX,repeatY);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;return texture;
}
function perimeter(y) {
  const points=[];const radius=.14;
  for(const [x,z,start] of [[1.78-radius,2.38-radius,0],[-1.78+radius,2.38-radius,Math.PI/2],[-1.78+radius,-2.38+radius,Math.PI],[1.78-radius,-2.38+radius,Math.PI*1.5]]){
    for(let i=0;i<=12;i++){const angle=start+i*Math.PI/24;points.push(new THREE.Vector3(x+Math.cos(angle)*radius,y,z+Math.sin(angle)*radius));}
  }
  return new THREE.CatmullRomCurve3(points,true,'centripetal');
}
export default function ModularScene({hero=false,exploded=false,type='combo',extension=false,firmness='Medium',resetKey=0,active=true}) {
  const mount=useRef();const state=useRef();const [failed,setFailed]=useState(false);
  const standalone=type==='extension'&&!extension;
  useEffect(()=>{
    const element=mount.current;let renderer;
    try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:hero});}catch{setFailed(true);return;}
    setFailed(false);renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.98;
    element.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label',standalone?'10cm extension mattress with upper and lower zippers':'Modular mattress with 5cm soft top, 10cm medium middle and 10cm firm base');
    const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(35,1,.1,100);const initial=new THREE.Vector3(hero?7.1:6.8,hero?5.3:4.9,hero?8.6:8.3);camera.position.copy(initial);
    const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.enableDamping=true;controls.enableZoom=!hero;controls.minDistance=5.8;controls.maxDistance=14;controls.maxPolarAngle=Math.PI/2.05;controls.target.set(0,.4,0);controls.enabled=!hero;
    scene.add(new THREE.HemisphereLight(0xfff8e9,0x7d8473,2));
    const key=new THREE.DirectionalLight(0xfff5df,2.6);key.position.set(-4,6,2);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-6,right:6,top:7,bottom:-6});key.shadow.bias=-.0005;key.shadow.normalBias=.025;scene.add(key);
    const fill=new THREE.DirectionalLight(0xdce5f2,1.2);fill.position.set(4,3,-4);scene.add(fill);
    const group=new THREE.Group();group.rotation.y=-.22;scene.add(group);
    const topTex=quiltTexture(5,6.7),sideTex=quiltTexture(5,1.15);
    const sideMat=new THREE.MeshStandardMaterial({color:'#e9e3d3',map:sideTex,bumpMap:sideTex,bumpScale:.035,roughness:.98});
    const topMat=new THREE.MeshStandardMaterial({color:'#f4efdf',map:topTex,bumpMap:topTex,bumpScale:.05,roughness:.98});
    const bottomMat=sideMat.clone();bottomMat.color.set('#ccc8b9');
    const seamMat=new THREE.MeshStandardMaterial({color:'#c9c2b0',roughness:1});
    const zipMat=new THREE.MeshStandardMaterial({color:'#8e8d83',roughness:.6,metalness:.25});
    const tapeMat=new THREE.MeshStandardMaterial({color:'#c2beb0',roughness:1});
    const strapMat=new THREE.MeshStandardMaterial({color:'#e3dccb',roughness:1});
    const buttonMat=new THREE.MeshStandardMaterial({color:'#f9f5e7',roughness:.4});
    const layers=[];
    const definitions=standalone?[{id:'extension',cm:10,zip:['top','bottom']}]:[
      {id:'base',cm:10,zip:['top']},
      ...(extension?[{id:'extension',cm:10,zip:['top','bottom']}]:[]),
      {id:'middle',cm:10,zip:['bottom']},
      {id:'top',cm:5,zip:[]},
    ];
    let level=standalone?-.22:-.60;
    const addZipper=(mesh,y)=>{
      const curve=perimeter(y);mesh.add(new THREE.Mesh(new THREE.TubeGeometry(curve,180,.020,5,true),tapeMat));
      const teeth=new THREE.InstancedMesh(new THREE.BoxGeometry(.026,.018,.012),zipMat,320);const dummy=new THREE.Object3D();
      for(let i=0;i<320;i++){const t=i/320;dummy.position.copy(curve.getPointAt(t));const tangent=curve.getTangentAt(t);dummy.rotation.set(0,-Math.atan2(tangent.z,tangent.x),0);dummy.updateMatrix();teeth.setMatrixAt(i,dummy.matrix);}mesh.add(teeth);
      const slider=new THREE.Group();slider.add(new THREE.Mesh(new RoundedBoxGeometry(.075,.04,.055,2,.012),zipMat));const pull=new THREE.Mesh(new THREE.TorusGeometry(.037,.009,6,16),zipMat);pull.scale.y=1.8;pull.position.set(0,-.063,.022);slider.add(pull);slider.position.set(1.40,y,2.407);mesh.add(slider);
    };
    definitions.forEach(({id,cm,zip})=>{
      const height=cm*.044;
      const mesh=new THREE.Mesh(new RoundedBoxGeometry(3.6,height,4.8,6,Math.min(height*.36,.135)),[sideMat,sideMat,topMat,bottomMat,sideMat,sideMat]);
      mesh.position.y=level+height/2;mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);layers.push({mesh,base:mesh.position.y,id});level+=height+.018;
      for(const edge of [-1,1])mesh.add(new THREE.Mesh(new THREE.TubeGeometry(perimeter(edge*(height/2-.037)),180,.007,4,true),seamMat));
      for(const face of zip)addZipper(mesh,face==='top'?height/2-.06:-height/2+.06);
      if(id==='top')for(const x of [-1.15,1.15])for(const side of [-1,1]){
        const strap=new THREE.Mesh(new RoundedBoxGeometry(.14,.33,.025,5,.012),strapMat);strap.position.set(x,-.14,side*2.405);strap.rotation.x=side*.045;mesh.add(strap);
        const button=new THREE.Mesh(new THREE.CylinderGeometry(.043,.043,.016,24),buttonMat);button.rotation.x=Math.PI/2;button.position.set(x,-.23,side*2.43);mesh.add(button);
        for(const offset of [-.01,.01]){const hole=new THREE.Mesh(new THREE.SphereGeometry(.0035,5,5),seamMat);hole.position.set(x+offset,-.23,side*2.44);mesh.add(hole);}
      }
    });
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(50,50),new THREE.ShadowMaterial({opacity:.28}));floor.rotation.x=-Math.PI/2;floor.position.y=standalone?-.26:-.63;floor.receiveShadow=true;scene.add(floor);
    state.current={exploded,active,camera,controls,initial};
    const resize=()=>{const {width,height}=element.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/Math.max(height,1);camera.updateProjectionMatrix();};const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(element);resize();
    let visible=true;const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});intersection.observe(element);
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const start=performance.now();let frame;
    const render=()=>{
      frame=requestAnimationFrame(render);if(!visible||!state.current?.active)return;
      const time=(performance.now()-start)/1000;
      const spread=hero&&!reduced?Math.pow((1-Math.cos(time/12*Math.PI*2))/2,1.6):state.current.exploded?1:0;
      layers.forEach(({mesh,base},i)=>{const target=base+i*.60*spread;mesh.position.y=reduced?target:THREE.MathUtils.lerp(mesh.position.y,target,.09);});
      if(hero)group.rotation.y=-.22+(reduced?0:Math.sin(time/12*Math.PI*2)*.12);
      controls.update();renderer.render(scene,camera);
    };render();
    return()=>{cancelAnimationFrame(frame);intersection.disconnect();resizeObserver.disconnect();controls.dispose();const geometries=new Set(),materials=new Set();scene.traverse(object=>{if(object.geometry)geometries.add(object.geometry);if(object.material)(Array.isArray(object.material)?object.material:[object.material]).forEach(m=>materials.add(m));});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());topTex.dispose();sideTex.dispose();renderer.dispose();renderer.domElement.remove();state.current=null;};
  },[hero,standalone,extension]);
  useEffect(()=>{if(state.current)state.current.exploded=exploded;},[exploded]);
  useEffect(()=>{if(state.current)state.current.active=active;},[active]);
  useEffect(()=>{if(state.current){state.current.camera.position.copy(state.current.initial);state.current.controls.target.set(0,.4,0);state.current.controls.update();}},[resetKey]);
  return <div className={`mattress-scene ${hero?'hero-scene':''}`} ref={mount} data-layer-count={standalone?1:extension?4:3} data-total-height={standalone?10:extension?35:25} data-extension-firmness={firmness}>{failed&&<div className="webgl-fallback"><div className="fallback-mattress"/><p>3D preview requires a browser with WebGL enabled. Layer specifications are listed below.</p></div>}</div>;
}
