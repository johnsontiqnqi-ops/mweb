export function ConfigurationControls({type,extension,setExtension,firmness,setFirmness}) {
  const moduleOnly=type==='extension';
  return <div className="configuration-controls">
    <div className="configuration-total"><span>{moduleOnly?'MODULE THICKNESS':'CONFIGURED HEIGHT'}</span><strong>{moduleOnly?'10':extension?'35':'25'}<small> cm</small></strong></div>
    <label className="configuration-toggle"><input type="checkbox" checked={extension} onChange={e=>setExtension(e.target.checked)}/><span>{moduleOnly?'Preview installed in Combo':'Add a 10cm extension'}<small>{moduleOnly?'See the complete 35cm assembly':'Fits between the middle and base layers'}</small></span></label>
    {(moduleOnly||extension)&&<fieldset className="firmness-options"><legend>EXTENSION FIRMNESS</legend>{['Medium','Firm'].map(value=><label key={value} className={firmness===value?'checked':''}><input type="radio" name="extension-firmness" value={value} checked={firmness===value} onChange={()=>setFirmness(value)}/>{value}</label>)}</fieldset>}
    {moduleOnly&&<p className="configuration-note">Extension module only. The Combo shown in the installation preview is separate.</p>}
    {!moduleOnly&&extension&&<p className="configuration-note">25cm Combo + one separately supplied 10cm extension.</p>}
  </div>;
}
export function LayerStory({type,extension,firmness}) {
  const standalone=type==='extension'&&!extension;
  const layers=standalone?[['+','10','Extension',firmness,'Zippers on both faces. Connects above and below.']]:[
    ['01','5','Comfort top','Soft','Button straps attach the top to the middle layer.'],
    ['02','10','Middle layer','Medium','A single connecting zipper on the lower face.'],
    ...(extension?[['+','10','Extension',firmness,'Double-sided zippers connect middle and base.']]:[]),
    ['03','10','Foundation','Firm','A single connecting zipper on the upper face.'],
  ];
  return <div className={`layer-story ${standalone?'standalone':''}`}><div className="layer-story-heading"><span className="eyebrow">{standalone?'TWO CONNECTIONS. ONE EXTRA LAYER.':'YOUR MATTRESS, LAYER BY LAYER'}</span><span>{standalone?'+10cm extension':extension?'5 + 10 + 10 + 10 = 35cm':'5 + 10 + 10 = 25cm'}</span></div><div className="layer-cards" style={{'--layer-columns':layers.length}}>{layers.map(([index,height,name,feel,description])=><article key={name} className={name==='Extension'?'extension-layer':''}><div className="layer-card-top"><span>{index}</span><strong>{height}<small> cm</small></strong></div><h4>{name} <span>{feel}</span></h4><p>{description}</p></article>)}</div></div>;
}
