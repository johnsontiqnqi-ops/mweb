import fs from 'node:fs/promises';
let source=await fs.readFile('src/main.jsx','utf8');
const replacements=[
  ["import MattressScene from './MattressScene';", "import MattressScene from './ModularScene';\nimport { ConfigurationControls, LayerStory } from './ModularDetails';"],
  ["import {brand,products} from './content';", "import {brand,products,getConfiguration} from './productContent';"],
  [" const product=products.find", " const [extension,setExtension]=useState(false);const [firmness,setFirmness]=useState('Medium');\n const product=products.find"],
  ["const current=product||products[selected];", "const current=product||products[selected];\n const configuration=getConfiguration(current,extension,firmness);\n const configurationProps={type:current.type,extension,setExtension,firmness,setFirmness};\n const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;"],
  ["setRoute(location.pathname);setMenu(false);};", "setRoute(location.pathname);setMenu(false);setExtension(false);setExploded(false);};"],
  ["setMenu(false);setExploded(false);window.scrollTo", "setMenu(false);setExploded(false);setExtension(false);setVideoReady(false);window.scrollTo"],
  ["Product: ${current.name}\\nSize:", "Product: ${current.name}\\nConfiguration: ${configuration}\\nSize:"],
  ['THE ART OF BETTER REST</div><h1>A better night.<br/><span>A different</span><br/><span>tomorrow.</span></h1><p>Thoughtfully designed mattresses.<br/>Expertly made. Ready for the world.</p>', 'A MODULAR APPROACH TO REST</div><h1>Your comfort.<br/><span>Layer by</span><br/><span>layer.</span></h1><p>Soft on top. Balanced in the middle. Firm below.<br/>Three layers. Connected by design.</p>'],
  ['<MattressScene hero/>', '<MattressScene hero active={!videoReady||reducedMotion}/>'],
  ['autoPlay muted loop playsInline', 'autoPlay={!reducedMotion} muted loop playsInline'],
  ['SIGNATURE HYBRID<br/><small>A new perspective on comfort</small>', 'THE MODULAR COMBO<br/><small>5cm soft / 10cm medium / 10cm firm</small>'],
  ['01 <span>/</span> 03', '01 <span>/</span> 02'],
  ['<span>Comfort, considered.</span><span>From material to mattress.</span><span>From our factory to your world.</span>', '<span>Three distinct comfort layers.</span><span>Button and zipper connections.</span><span>25cm. Or a little more.</span>'],
  ['<h2>Good sleep.<br/><span>By design.</span></h2></div><p>A closer look at comfort.<br/>Explore our concept collection, from the<br className="desktop-break"/> first layer to the final stitch.</p>', '<h2>One system.<br/><span>Built in layers.</span></h2></div><p>Start with the three-layer Combo.<br/>Add a double-sided zipper module<br className="desktop-break"/> when you want more height.</p>'],
  ['setSelected(i);setExploded(false);', 'setSelected(i);setExploded(false);setExtension(false);'],
  ['<span>INTERACTIVE PRODUCT STUDY</span>', '<span>{current.type===\'extension\'?\'DOUBLE-SIDED ZIPPER MODULE\':\'5CM SOFT + 10CM MEDIUM + 10CM FIRM\'}</span>'],
  ['<MattressScene exploded={exploded} color={current.color} resetKey={reset}/>', '<MattressScene exploded={exploded} type={current.type} extension={extension} firmness={firmness} resetKey={reset}/>'],
  ['<div className="spec-row"><div><small>PROFILE</small><strong>{current.height}</strong></div><div><small>COMFORT</small><strong>{current.feel}</strong></div></div>', '<ConfigurationControls {...configurationProps}/>'],
  ['Concept model · Specifications for illustration', 'Schematic 3D · Fabric and connection details are illustrative'],
  ['</div></div></section>\n <section className="company', '</div></div><LayerStory type={current.type} extension={extension} firmness={firmness}/></section>\n <section className="company'],
  ['<MattressScene color={product.color} exploded={exploded} resetKey={reset}/>', '<MattressScene type={product.type} extension={extension} firmness={firmness} exploded={exploded} resetKey={reset}/>'],
  ['{product.category} / CONCEPT EDITION', '{product.category}'],
  ['<p>{product.description}</p><div className="detail-price">', '<p>{product.description}</p><ConfigurationControls {...configurationProps}/><div className="detail-price">'],
  ['Final specifications, availability and pricing to be confirmed.', 'Size availability, lead times and pricing to be confirmed.'],
  ['`Illustrative ${product.height} profile with a ${product.feel.toLowerCase()} comfort concept. Materials and dimensions are placeholders pending the final product brief.`', 'product.construction'],
  ['</div></div></section>}\n <section className="contact"', '</div></div><LayerStory type={product.type} extension={extension} firmness={firmness}/></section>}\n <section className="contact"'],
  ['Brand name, imagery, product models and specifications are illustrative and will be replaced with approved company materials.', 'Product structure follows supplied specifications. Brand and company imagery remain placeholders; 3D fabric and hardware details are illustrative.'],
  ['<p>{current.name} · {size} · Quantity {quantity}</p>', '<p>{current.name} · {size} · Quantity {quantity}</p><p className="inquiry-configuration">{configuration}</p>'],
];
for(const [before,after] of replacements){if(!source.includes(before))throw new Error('Missing replacement: '+before);source=source.replace(before,after);}
await fs.writeFile('src/main.jsx',source);
console.log('Updated homepage, product detail pages and inquiry configurations.');
