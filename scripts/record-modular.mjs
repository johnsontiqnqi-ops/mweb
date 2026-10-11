import { chromium } from 'file:///C:/Users/Johnson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const page=await browser.newPage({viewport:{width:1512,height:982},deviceScaleFactor:1});
 await page.route('**/media/combo-hero*.webm',route=>route.abort());
 await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Skip intro'}).click();
 await page.locator('.hero-scene canvas').waitFor();
 const data=await page.evaluate(async()=>{
  const source=document.querySelector('.hero-scene canvas');const target=document.createElement('canvas');target.width=1200;target.height=Math.round(1200*source.height/source.width);const ctx=target.getContext('2d');let frame;
  const draw=()=>{ctx.fillStyle='#0b234b';ctx.fillRect(0,0,target.width,target.height);ctx.drawImage(source,0,0,target.width,target.height);frame=requestAnimationFrame(draw);};draw();
  const stream=target.captureStream(24);const recorder=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9',videoBitsPerSecond:4500000});const chunks=[];recorder.ondataavailable=e=>chunks.push(e.data);const stopped=new Promise(resolve=>recorder.onstop=resolve);recorder.start();await new Promise(resolve=>setTimeout(resolve,12000));recorder.stop();await stopped;cancelAnimationFrame(frame);stream.getTracks().forEach(t=>t.stop());const bytes=new Uint8Array(await new Blob(chunks).arrayBuffer());let binary='';for(const byte of bytes)binary+=String.fromCharCode(byte);return btoa(binary);
 });
 await fs.writeFile('public/media/combo-hero-blue.webm',Buffer.from(data,'base64'));
 console.log('Recorded new 12-second three-layer Combo assembly video.');
}finally{await browser.close();}
