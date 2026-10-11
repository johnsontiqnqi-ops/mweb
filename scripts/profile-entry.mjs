import fs from 'node:fs/promises';
import { chromium } from 'file:///C:/Users/Johnson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1440,height:900}});
await page.addInitScript(()=>{
 window.entryProfile={frames:[],longTasks:[],maxNodes:0};
 new PerformanceObserver(list=>list.getEntries().forEach(e=>window.entryProfile.longTasks.push({start:e.startTime,duration:e.duration}))).observe({type:'longtask',buffered:true});
 let last=0;const sample=t=>{const phase=document.querySelector('.site-intro')?.dataset.introPhase??'home';if(last)window.entryProfile.frames.push({time:t,delta:t-last,phase});last=t;window.entryProfile.maxNodes=Math.max(window.entryProfile.maxNodes,document.getElementsByTagName('*').length);if(t<10000)requestAnimationFrame(sample);};requestAnimationFrame(sample);
});
await page.goto('http://127.0.0.1:5173/');await page.waitForTimeout(10500);
const profile=await page.evaluate(()=>window.entryProfile);
const summary={maxNodes:profile.maxNodes,longTasks:profile.longTasks.map(t=>({start:Math.round(t.start),duration:Math.round(t.duration)})),phases:{}};
for(const phase of ['first','second','leaving','home']){const values=profile.frames.filter(f=>f.phase===phase&&f.time>500).map(f=>f.delta).sort((a,b)=>a-b);summary.phases[phase]={frames:values.length,p95:Math.round(values[Math.floor(values.length*.95)]??0),worst:Math.round(values.at(-1)??0),over50ms:values.filter(v=>v>50).length};}
console.log(JSON.stringify(summary,null,2));await fs.writeFile('Y:/mweb/entry-profile-'+(process.argv[2]||'latest')+'.json',JSON.stringify({summary,profile},null,2));await browser.close();
