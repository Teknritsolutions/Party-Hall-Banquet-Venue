
const assert = require('node:assert/strict');
const {chromium} = require('D:/Hobby & Board Games Store/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({channel:'chrome',headless:true});
 const p=await b.newPage({reducedMotion:'reduce'});
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 for(const width of [1440,1024,820,390,320]) {
  await p.setViewportSize({width,height:1000});
  await p.goto('http://127.0.0.1:4173/index.html');
  const reference=await p.evaluate(()=>({heading:getComputedStyle(document.querySelector('.section-heading h2')).fontSize,body:getComputedStyle(document.body).fontSize,space:getComputedStyle(document.querySelector('main>.section')).paddingTop}));
  await p.goto('http://127.0.0.1:4173/pages/home2.html');
  for(const section of await p.locator('main>section').all()) {await section.scrollIntoViewIfNeeded();await p.waitForTimeout(80);}
  await p.evaluate(()=>document.fonts.ready);
  const m=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,headings:[...document.querySelectorAll('main h2')].map(e=>getComputedStyle(e).fontSize),body:getComputedStyle(document.body).fontSize,spaces:[...document.querySelectorAll('main>.section')].map(e=>getComputedStyle(e).paddingTop),images:[...document.querySelectorAll('main img')].filter(e=>!e.complete||!e.naturalWidth).map(e=>e.src),clipped:[...document.querySelectorAll('main h1,main h2,main h3,main p')].filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.textContent)}));
  assert.equal(m.overflow,false,'overflow at '+width);assert.equal(m.body,reference.body);assert(m.headings.every(v=>v===reference.heading),'heading scale at '+width);assert(m.spaces.every(v=>v===reference.space),'section rhythm');assert.deepEqual(m.images,[]);assert.deepEqual(m.clipped,[]);
  if(width===1440||width===390){await p.screenshot({path:"tests/screenshots/reviews/" + 'homepage2-after-'+width+'.png',fullPage:true});}
  console.log(width+'px: type, section spacing, images and text fit passed');
 }
 for(const mode of ['dark','rtl']){await p.evaluate(mode=>{document.documentElement.setAttribute(mode==='rtl'?'dir':'data-theme',mode==='rtl'?'rtl':'dark');},mode);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
 assert.deepEqual(errors,[]);await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
