/* DE MENDIGO A EMPERADOR - GitHub Pages / file:// standalone bundle v0.1.0 */
(()=>{
'use strict';

/* js/data.js */
const VERSION = 1;
const RELEASE = '0.1.1';
const RESOURCES = ['gold','food','wood','stone','herbs'];
const RESOURCE_LABELS = {gold:'Monedas',food:'Comida',wood:'Madera',stone:'Piedra',herbs:'Hierbas'};
const RESOURCE_SYMBOLS = {gold:'◈',food:'◆',wood:'♠',stone:'⬟',herbs:'✿'};
const TOOLS = [
  {id:'blanket',name:'Manta remendada',desc:'Recuperas energía un 25% más rápido.',cost:{gold:18},tier:1,icon:'🧣'},
  {id:'basket',name:'Cesta resistente',desc:'+1 comida al buscar provisiones.',cost:{gold:25},tier:1,icon:'🧺'},
  {id:'axe',name:'Hacha de leñador',desc:'+2 madera por cada recolección.',cost:{gold:48},tier:1,icon:'🪓'},
  {id:'boots',name:'Botas de camino',desc:'+4 energía máxima y +10% a las ganancias de mendigar.',cost:{gold:65},tier:1,icon:'🥾'},
  {id:'pickaxe',name:'Pico de hierro',desc:'Desbloquea la extracción de piedra.',cost:{gold:90,wood:8},tier:1,icon:'⛏️'},
  {id:'campfire',name:'Hoguera protegida',desc:'El hambre crece un 35% más despacio.',cost:{gold:40,wood:8},tier:1,icon:'🔥'},
  {id:'shelter',name:'Refugio de madera',desc:'Asciendes a trabajador. Desbloqueas 2 plazas de empleados y mejoras tu descanso.',cost:{gold:120,wood:24},tier:1,icon:'🏕️'},
  {id:'hearth',name:'Hogar comunitario',desc:'+2 plazas de trabajadores y recuperación de energía mejorada.',cost:{gold:145,wood:20,stone:4},tier:2,icon:'🏠'},
  {id:'storage',name:'Cobertizo-almacén',desc:'Duplica la capacidad de todos los recursos materiales.',cost:{gold:145,wood:22,stone:8},tier:2,icon:'📦'},
  {id:'stall',name:'Puesto del mercado',desc:'¡Asciendes a comerciante! Desbloquea al vendedor automático y concluye el prólogo.',cost:{gold:310,wood:38,stone:12},tier:2,icon:'🏪'}
];
const WORKERS = [
  {id:'woodcutter',name:'Leñador',desc:'Recolecta madera de manera automática.',icon:'🪓',baseCost:85,wage:.035,output:{wood:.16},req:'shelter'},
  {id:'forager',name:'Recolectora',desc:'Recoge comida, ideal para vivir sin preocupaciones.',icon:'🌾',baseCost:75,wage:.032,output:{food:.13},req:'shelter'},
  {id:'quarrier',name:'Cantero',desc:'Extrae piedra para construir los siguientes edificios.',icon:'⛏️',baseCost:110,wage:.055,output:{stone:.10},req:'pickaxe'},
  {id:'trader',name:'Vendedor',desc:'Vende automáticamente la madera que exceda de la reserva indicada.',icon:'🧑‍💼',baseCost:170,wage:.065,output:{},req:'stall'}
];
const CONTRACTS = [
  {name:'Leña para la posada',needs:{wood:12},reward:85},
  {name:'Raciones de camino',needs:{food:10},reward:55},
  {name:'Remedios del boticario',needs:{herbs:4},reward:75},
  {name:'Piedras para el molino',needs:{stone:8},reward:94},
  {name:'La cocina del castillo',needs:{food:16},reward:94},
  {name:'Reparación de carromatos',needs:{wood:21},reward:160},
  {name:'Un encargo de la ermita',needs:{wood:6,food:5},reward:91},
  {name:'Obras del camino',needs:{stone:10,wood:8},reward:162},
  {name:'Herborista del camino',needs:{herbs:6,food:6},reward:145}
];
const QUESTS = [
  {id:'feet',title:'Primeras monedas',desc:'Consigue 25 monedas en total trabajando o vendiendo.',check:s=>s.stats.goldEarned>=25,reward:{gold:12,xp:10}},
  {id:'survive',title:'Una noche más',desc:'Reúne 8 raciones de comida y 10 de madera.',check:s=>s.stats.foodEarned>=8 && s.stats.woodEarned>=10,reward:{gold:20,xp:18}},
  {id:'tool',title:'Herramientas de verdad',desc:'Compra una cesta, un hacha o un pico.',check:s=>['basket','axe','pickaxe'].some(id=>s.owned[id]),reward:{food:8,xp:20}},
  {id:'home',title:'Un techo propio',desc:'Construye tu refugio de madera.',check:s=>!!s.owned.shelter,reward:{gold:65,food:10,xp:35}},
  {id:'partner',title:'Ya no estás solo',desc:'Contrata tu primer trabajador.',check:s=>Object.values(s.workers).reduce((a,b)=>a+b,0)>=1,reward:{gold:40,xp:40}},
  {id:'steady',title:'Un oficio que prospera',desc:'Consigue 750 monedas a lo largo de la partida.',check:s=>s.stats.goldEarned>=750,reward:{gold:100,xp:60}},
  {id:'merchant',title:'El primer negocio',desc:'Construye tu propio puesto del mercado.',check:s=>!!s.owned.stall,reward:{gold:250,xp:100}}
];
const EVENTS = [
  {id:'stranger',title:'El viajero cansado',text:'Un caminante hambriento te ofrece una pequeña bolsa a cambio de provisiones.',requires:s=>s.stats.foodEarned>=4,choices:[
    {title:'Darle 2 de comida',desc:'Pierdes provisiones, ganas 25 monedas y experiencia.',cost:{food:2},reward:{gold:25,xp:8},log:'El viajero te recuerda con gratitud.'},
    {title:'Desearle suerte',desc:'No gastas recursos.',cost:{},reward:{xp:2},log:'El viajero continúa su camino.'}
  ]},
  {id:'oldwoman',title:'La cabaña de la anciana',text:'Una anciana te pide ayuda para reparar su puerta antes del anochecer.',requires:s=>s.stats.woodEarned>=14,choices:[
    {title:'Compartir 5 de madera',desc:'Ganas 12 comida y algo de experiencia.',cost:{wood:5},reward:{food:12,xp:12},log:'La anciana comparte su despensa contigo.'},
    {title:'Pedir un pago',desc:'Entregas madera por 45 monedas.',cost:{wood:5},reward:{gold:45,xp:4},log:'Acepta tu precio, aunque sin entusiasmo.'},
    {title:'Seguir tu camino',desc:'Sin cambios.',cost:{},reward:{},log:'Has decidido no intervenir.'}
  ]},
  {id:'merchant',title:'Un trato sospechosamente bueno',text:'Un comerciante ambulante compra madera para una obra urgente.',requires:s=>s.stats.goldEarned>=240,choices:[
    {title:'Venderle 10 madera',desc:'Obtienes 90 monedas.',cost:{wood:10},reward:{gold:90,xp:10},log:'Cerráis un buen acuerdo.'},
    {title:'Pedir noticias del reino',desc:'Obtienes experiencia.',cost:{},reward:{xp:25},log:'Aprendes de los mercados y sus rutas.'}
  ]},
  {id:'storm',title:'La tormenta se acerca',text:'Las primeras lluvias fuertes amenazan la ruta comercial. Los vecinos te piden ayuda.',requires:s=>!!s.owned.shelter,choices:[
    {title:'Aportar 40 monedas',desc:'La comunidad te lo agradece. +45 XP y 5 hierbas.',cost:{gold:40},reward:{xp:45,herbs:5},log:'Ayudaste a asegurar el camino.'},
    {title:'Organizar provisiones',desc:'Entregas 6 comida a cambio de experiencia.',cost:{food:6},reward:{xp:30,gold:20},log:'La gente consigue proteger sus reservas.'},
    {title:'Quedarte en casa',desc:'Sin coste.',cost:{},reward:{},log:'Esperaste a que la tormenta pasara.'}
  ]},
  {id:'charter',title:'Permiso para vender',text:'Un funcionario ha oído hablar de tu crecimiento y te ofrece registrar tu nuevo puesto.',requires:s=>!!s.owned.stall,choices:[
    {title:'Registrar el puesto',desc:'Consigues un sello de reconocimiento. +80 XP.',cost:{gold:50},reward:{xp:80},log:'Tu puesto ha sido reconocido por la autoridad local.'},
    {title:'Vender por tu cuenta',desc:'Ganas 30 monedas, aunque sin licencia formal.',cost:{},reward:{gold:30},log:'Has decidido conservar tu independencia.'}
  ]}
];
const ACHIEVEMENTS = [
  {id:'first',name:'De la nada',desc:'Consigue tu primera moneda.',check:s=>s.stats.goldEarned>0},
  {id:'wood',name:'Astillas en las manos',desc:'Recoge 100 de madera en total.',check:s=>s.stats.woodEarned>=100},
  {id:'forage',name:'Experto en provisiones',desc:'Consigue 75 de comida en total.',check:s=>s.stats.foodEarned>=75},
  {id:'coins',name:'Bolsa pesada',desc:'Gana 1.000 monedas a lo largo de la partida.',check:s=>s.stats.goldEarned>=1000},
  {id:'shelter',name:'Dejar atrás el barro',desc:'Construye tu refugio.',check:s=>s.owned.shelter},
  {id:'team',name:'Un pequeño equipo',desc:'Contrata 3 trabajadores.',check:s=>Object.values(s.workers).reduce((a,b)=>a+b,0)>=3},
  {id:'cure',name:'Manos sanadoras',desc:'Reúne 10 hierbas a lo largo de la partida.',check:s=>s.stats.herbsEarned>=10},
  {id:'contracts',name:'De palabra',desc:'Completa 5 encargos.',check:s=>s.stats.contracts>=5},
  {id:'trader',name:'La primera tienda',desc:'Funda tu puesto comercial.',check:s=>s.owned.stall}
];
const BASE_PRICES = {food:5,wood:7,stone:10,herbs:15};
const ICONS = {gold:'🪙',food:'🍞',wood:'🪵',stone:'🪨',herbs:'🌿'};


/* js/engine.js */

const INITIAL_SEED = 84291;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
function levelForXp(xp){return 1+Math.floor(Math.sqrt(Math.max(0,xp)/36));}
function maxEnergy(s){return 10+(s.owned.boots?4:0);}
function caps(s){let m=s.owned.storage?2:1;return {gold:Infinity,food:70*m,wood:100*m,stone:50*m,herbs:40*m};}
function workerSlots(s){return (s.owned.shelter?2:0)+(s.owned.hearth?2:0)+(s.owned.stall?2:0);}
function totalWorkers(s){return Object.values(s.workers).reduce((a,b)=>a+b,0);}
function workerCost(s,id){const w=WORKERS.find(x=>x.id===id);return Math.ceil(w.baseCost*Math.pow(1.58,s.workers[id]||0));}
function currentStage(s){return s.owned.stall?3:s.owned.shelter?2:1;}
function stageName(s){return ['','Mendigo','Trabajador','Comerciante'][currentStage(s)];}
function marketPrice(s,id){const base=BASE_PRICES[id];if(!base)return 0;let phase = s.clock/80 + ['food','wood','stone','herbs'].indexOf(id)*1.31 + (s.seed%31)*.13;return Math.max(1,Math.round(base*(1+.17*Math.sin(phase)+.075*Math.cos(phase*.63))));}
function buyPrice(s,id){return Math.ceil(marketPrice(s,id)*1.75)+2;}
function canAfford(s,cost){return Object.entries(cost||{}).every(([r,q])=>r==='xp'||(s.resources[r]||0)+1e-8>=q);}
function addResources(s, resources){for (const [r,amt] of Object.entries(resources||{})) {
  if(r==='xp'){s.xp=Math.max(0,s.xp+amt);continue;}
  if(!RESOURCES.includes(r))continue;
  const before=s.resources[r];
  s.resources[r]=clamp(before+amt,0,caps(s)[r]);
  const real = Math.max(0,s.resources[r]-before);
  if(real>0){let k=r+'Earned';s.stats[k]=(s.stats[k]||0)+real;}
}}
function pay(s,cost){if(!canAfford(s,cost))return false;for(const [r,amt] of Object.entries(cost)){if(r==='xp')continue;s.resources[r]=Math.max(0,s.resources[r]-amt);}return true;}
function record(s,message,type='normal'){s.log.unshift({message,type,at:s.clock});s.log=s.log.slice(0,24);}
function rand(s){s.rng = (Math.imul(1664525,s.rng>>>0)+1013904223)>>>0;return s.rng/4294967296;}
function makeContracts(s){const candidates=CONTRACTS.filter(c=>Object.keys(c.needs).every(r=>r!=='stone'||s.owned.pickaxe)).filter(c=>Object.keys(c.needs).every(r=>r!=='herbs'||s.stats.herbsEarned>0||s.clock>90));
  const idxs=candidates.map((_,i)=>i);for(let i=idxs.length-1;i>0;i--){const j=Math.floor(rand(s)*(i+1));[idxs[i],idxs[j]]=[idxs[j],idxs[i]];}
  s.contracts=idxs.slice(0,Math.min(3,candidates.length)).map((idx,i)=>({...candidates[idx],uid:`${s.contractBatch}-${idx}-${i}`}));
}
function createGame(seed=INITIAL_SEED,now=Date.now()){
  const s={version:VERSION,seed:seed>>>0,rng:seed>>>0,createdAt:now,lastSavedAt:now,clock:0,resources:{gold:0,food:3,wood:0,stone:0,herbs:0},energy:10,hunger:80,restCooldown:0,xp:0,owned:{},workers:{woodcutter:0,forager:0,quarrier:0,trader:0},reserveWood:20,history:[],contracts:[],contractBatch:0,contractTimer:300,completed:[],seenEvents:[],pendingEvent:null,achievements:[],stats:{goldEarned:0,foodEarned:3,woodEarned:0,stoneEarned:0,herbsEarned:0,actions:0,contracts:0,manualSales:0},log:[]};
  makeContracts(s);record(s,'Tu historia comienza al borde de un camino. No tienes nada que perder.','story');return s;
}
function checkState(s){
  if (!s || s.version!==VERSION||typeof s.resources!=='object'||!s.resources||typeof s.workers!=='object'||!s.workers||!Array.isArray(s.completed)||!Array.isArray(s.log)||!Array.isArray(s.contracts)||typeof s.stats!=='object'||!s.stats) return false;
  if(!RESOURCES.every(r=>Number.isFinite(s.resources[r])&&s.resources[r]>=0))return false;
  if(!Number.isFinite(s.clock)||s.clock<0||!Number.isFinite(s.energy)||!Number.isFinite(s.hunger)||!Number.isFinite(s.xp))return false;
  if(!WORKERS.every(w=>Number.isSafeInteger(s.workers[w.id])&&s.workers[w.id]>=0&&s.workers[w.id]<=1000))return false;
  if(!Array.isArray(s.seenEvents)||!Array.isArray(s.achievements)||!s.owned||typeof s.owned!=='object')return false;
  return true;
}
function finish(s,msg,ok=true){if(ok){updateAchievements(s);activateEvent(s);}return {ok,msg};}
function action(s,id){
  const cost={beg:1,forage:1.5,wood:2,stone:2.5,errand:3.5}[id];
  if(id==='rest'){if((s.restCooldown||0)>0)return {ok:false,msg:`Necesitas esperar ${Math.ceil(s.restCooldown)} segundos antes de descansar otra vez.`};if(s.energy>=maxEnergy(s)-.02)return {ok:false,msg:'Ya tienes toda la energía.'};s.energy=clamp(s.energy+4.8,0,maxEnergy(s));s.hunger=clamp(s.hunger-3,0,100);s.restCooldown=10;record(s,'Descansas un momento y recuperas fuerzas.');return finish(s,'Has recuperado energía.');}
  if(id==='eat'){if(s.resources.food<1)return {ok:false,msg:'Necesitas comida para alimentarte.'};if(s.hunger>=99.9)return {ok:false,msg:'No tienes hambre.'};pay(s,{food:1});s.hunger=clamp(s.hunger+24,0,100);record(s,'Comes una ración y te encuentras mejor.');return finish(s,'Has comido una ración.');}
  if(!(id in {beg:1,forage:1,wood:1,stone:1,errand:1}))return {ok:false,msg:'Acción desconocida.'};
  if(id==='stone'&&!s.owned.pickaxe)return {ok:false,msg:'Necesitas un pico para extraer piedra.'};
  if(id==='errand'&&s.stats.goldEarned<75)return {ok:false,msg:'Los encargos se desbloquean tras ganar 75 monedas.'};
  if(s.energy+1e-8<cost)return {ok:false,msg:'No tienes energía suficiente. Descansa un poco.'};
  s.energy-=cost;s.hunger=clamp(s.hunger-(id==='errand'?1.6:.7),0,100);s.stats.actions++;
  const lvl=levelForXp(s.xp);let msg='';
  if(id==='beg'){
    const gold=Math.round((2+Math.floor(rand(s)*4))*(s.owned.boots?1.1:1));addResources(s,{gold,xp:3});msg=`Alguien te entrega ${gold} monedas.`;
  } else if(id==='forage'){
    const food=2+(s.owned.basket?1:0)+(rand(s)<.22?1:0);const herb=rand(s)<(.20+Math.min(.20,lvl*.018))?1:0;
    addResources(s,{food,herbs:herb,xp:4});msg=`Recoges ${food} comida${herb?' y 1 hierba medicinal':''}.`;
  } else if(id==='wood'){
    const wood=2+(s.owned.axe?2:0)+(rand(s)<.12?1:0);addResources(s,{wood,xp:4});msg=`Recoges ${wood} madera.`;
  } else if(id==='stone'){
    const stone=2+(rand(s)<.23?1:0);addResources(s,{stone,xp:5});msg=`Extraes ${stone} piedra.`;
  } else if(id==='errand'){
    const gold=15+Math.floor(rand(s)*9)+Math.floor(lvl/3);addResources(s,{gold,xp:8});msg=`Terminas un encargo y recibes ${gold} monedas.`;
  }
  record(s,msg);return finish(s,msg);
}
function purchase(s,id){const t=TOOLS.find(x=>x.id===id);if(!t)return {ok:false,msg:'Mejora desconocida.'};if(s.owned[id])return {ok:false,msg:'Ya has adquirido esta mejora.'};if(currentStage(s)<t.tier)return {ok:false,msg:'Todavía no has desbloqueado esta mejora.'};if(!canAfford(s,t.cost))return {ok:false,msg:'No tienes los recursos necesarios.'};
  pay(s,t.cost);s.owned[id]=true;let m=`Adquirido: ${t.name}.`;
  if(id==='shelter'){m='¡Has dejado de ser mendigo! Ya puedes contratar trabajadores.';addResources(s,{xp:40});}
  if(id==='stall'){m='¡Ascendido a COMERCIANTE! Has completado el prólogo de la versión 0.1.';addResources(s,{xp:100});}
  record(s,m,'milestone');return finish(s,m);
}
function hire(s,id){let w=WORKERS.find(x=>x.id===id);if(!w)return {ok:false,msg:'Oficio desconocido.'};if(!s.owned.shelter)return {ok:false,msg:'Primero necesitas construir un refugio.'};if(!s.owned[w.req])return {ok:false,msg:'Todavía no cumples los requisitos.'};if(totalWorkers(s)>=workerSlots(s))return {ok:false,msg:'No hay plazas libres. Amplía las instalaciones.'};const cost=workerCost(s,id);if(!pay(s,{gold:cost}))return {ok:false,msg:'No tienes suficientes monedas para contratar.'};s.workers[id]++;record(s,`Contrataste a un ${w.name.toLowerCase()}.`,'milestone');return finish(s,`Contratación realizada por ${cost} monedas.`);}
function fire(s,id){if(!WORKERS.some(w=>w.id===id)||!(s.workers[id]>0))return {ok:false,msg:'No hay trabajadores de este oficio.'};s.workers[id]--;record(s,'Un trabajador ha abandonado el equipo.');return finish(s,'Trabajador despedido; no recuperas el coste de contratación.');}
function trade(s,resource,kind,quantity){if(!BASE_PRICES[resource])return {ok:false,msg:'Mercancía desconocida.'};if(!['sell','buy'].includes(kind)||!['1','5','all'].includes(String(quantity)))return {ok:false,msg:'Transacción no válida.'};
  const price=kind==='buy'?buyPrice(s,resource):marketPrice(s,resource);
  const available=kind==='sell'?Math.floor(s.resources[resource]+1e-8):Math.floor(s.resources.gold/price);
  const room=kind==='buy'?Math.floor(caps(s)[resource]-s.resources[resource]+1e-8):Infinity;
  const wanted=quantity==='all'?(kind==='sell'?available:Math.min(available,room)):Number(quantity);
  const n=Math.max(0,Math.min(wanted,available,room));if(n<1)return {ok:false,msg:kind==='sell'?'No tienes suficientes mercancías.':'No tienes monedas o espacio suficiente.'};
  if(kind==='sell'){pay(s,{[resource]:n});addResources(s,{gold:price*n});s.stats.manualSales+=n;}else{pay(s,{gold:price*n});addResources(s,{[resource]:n});}
  let msg=`${kind==='sell'?'Vendidas':'Compradas'} ${n} unidades de ${resource==='wood'?'madera':resource==='food'?'comida':resource==='stone'?'piedra':'hierbas'} por ${n*price} monedas.`;
  record(s,msg);return finish(s,msg);
}
function fulfill(s,uid){const c=s.contracts.find(c=>c.uid===uid);if(!c)return {ok:false,msg:'Este contrato ya no está disponible.'};if(!canAfford(s,c.needs))return {ok:false,msg:'Te faltan los materiales del encargo.'};pay(s,c.needs);addResources(s,{gold:c.reward,xp:15});s.stats.contracts++;s.contracts=s.contracts.filter(x=>x.uid!==uid);record(s,`Contrato completado: ${c.name}. +${c.reward} monedas.`,'milestone');return finish(s,`¡Encargo entregado! +${c.reward} monedas y 15 XP.`);}
function claimQuest(s,id){const q=QUESTS.find(x=>x.id===id);if(!q||s.completed.includes(id))return {ok:false,msg:'Objetivo no disponible.'};if(!q.check(s))return {ok:false,msg:'Todavía no has cumplido el objetivo.'};s.completed.push(id);addResources(s,q.reward);record(s,`Objetivo completado: ${q.title}.`,'milestone');return finish(s,`Recompensa recibida: ${q.title}.`);}
function activateEvent(s){if(s.pendingEvent)return;const e=EVENTS.find(e=>!s.seenEvents.includes(e.id)&&e.requires(s));if(e){s.pendingEvent=e.id;record(s,`Nuevo acontecimiento: ${e.title}.`,'event');}}
function chooseEvent(s,id,choiceIndex){if(s.pendingEvent!==id)return {ok:false,msg:'Este acontecimiento no está pendiente.'};const e=EVENTS.find(e=>e.id===id);const choice=e?.choices?.[choiceIndex];if(!choice)return {ok:false,msg:'Decisión desconocida.'};if(!canAfford(s,choice.cost))return {ok:false,msg:'No tienes los recursos necesarios para esa opción.'};pay(s,choice.cost);addResources(s,choice.reward);s.pendingEvent=null;s.seenEvents.push(id);record(s,choice.log,'story');return finish(s,choice.log);}
function updateAchievements(s){for(const a of ACHIEVEMENTS){if(!s.achievements.includes(a.id)&&a.check(s)){s.achievements.push(a.id);record(s,`Logro desbloqueado: ${a.name}.`,'milestone');}}}
function setReserve(s,value){const n=Number(value);if(!Number.isInteger(n)||n<0||n>caps(s).wood)return {ok:false,msg:'Reserva fuera de los límites.'};s.reserveWood=n;return {ok:true,msg:`Reserva de madera: ${n} unidades.`};}
function rates(s){const out={gold:0,food:0,wood:0,stone:0,herbs:0};for(const w of WORKERS){const n=s.workers[w.id]||0;if(!n)continue;const rate=w.id==='trader'?Math.max(0,Math.min(.24*n, (s.resources.wood-s.reserveWood)/15)):0; if(w.id==='trader')out.gold+=rate*marketPrice(s,'wood')-w.wage*n;
    else{for(const [r,v] of Object.entries(w.output))out[r]+=v*n;out.gold-=w.wage*n;}}
  return out;
}
function simulate(s,seconds,{offline=false}={}){
  let time=Math.max(0,Math.min(30,seconds));if(!time)return;
  s.clock+=time;s.restCooldown=Math.max(0,(s.restCooldown||0)-time);
  const regen=(s.owned.shelter ? 0.34 : 0.24)*(s.owned.blanket ? 1.25 : 1)*(s.owned.hearth ? 1.15 : 1)*(s.hunger<14 ? 0.65 : 1);
  s.energy=clamp(s.energy+time*regen,0,maxEnergy(s));
  s.hunger=clamp(s.hunger-time*.012*(s.owned.campfire?.65:1),0,100);
  // Passive production only pays wages when output is actually created.
  for(const w of WORKERS){const n=s.workers[w.id]||0;if(n===0)continue;
    if(w.id==='trader'){
      const available=Math.max(0,s.resources.wood-s.reserveWood);
      const sold=Math.min(available,.24*n*time);
      const wage=w.wage*n*time*(sold>0?sold/(.24*n*time):0);
      if(s.resources.gold+sold*marketPrice(s,'wood')+1e-9<wage)continue;
      if(sold>0){s.resources.wood=Math.max(0,s.resources.wood-sold);addResources(s,{gold:sold*marketPrice(s,'wood')});s.resources.gold=Math.max(0,s.resources.gold-wage);}
    }else{
      const [r,perSec]=Object.entries(w.output)[0];const free=Math.max(0,caps(s)[r]-s.resources[r]);
      const created=Math.min(free,perSec*n*time);const wage=w.wage*n*time*(created>0?created/(perSec*n*time):0);
      if(created>0&&s.resources.gold+1e-9>=wage){s.resources.gold=Math.max(0,s.resources.gold-wage);addResources(s,{[r]:created});}
    }
  }
  s.contractTimer-=time;
  if(s.contractTimer<=0){s.contractBatch++;s.contractTimer+=300;makeContracts(s);if(!offline)record(s,'Hay nuevos encargos en el tablón.','normal');}
  updateAchievements(s);activateEvent(s);
}
function advanceOffline(s,elapsedRealSeconds){
  const real=clamp(Number(elapsedRealSeconds)||0,0,86400*30);
  const full=Math.min(real,7200);const reduced=Math.min(Math.max(0,real-7200),21600)*.25;
  const effective=full+reduced;
  const before={...s.resources};
  let remaining=effective;
  while(remaining>1e-6){const chunk=Math.min(30,remaining);simulate(s,chunk,{offline:true});remaining-=chunk;}
  const changes=Object.fromEntries(RESOURCES.map(r=>[r,s.resources[r]-before[r]]));
  return {real,effective,changes};
}


/* js/storage.js */

const STORE_KEY='dmae_01_current';
const BACKUP_KEY='dmae_01_backup';
const DB_NAME='dmae-saves';
const OBJECT_STORE='saves';
let dbPromise;
function openDb(){if(!('indexedDB' in window))return Promise.resolve(null);if(!dbPromise)dbPromise=new Promise(resolve=>{try{const req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(OBJECT_STORE))req.result.createObjectStore(OBJECT_STORE);};req.onsuccess=()=>resolve(req.result);req.onerror=()=>resolve(null);req.onblocked=()=>resolve(null);}catch{resolve(null);}});return dbPromise;}
async function idbGet(key){const db=await openDb();if(!db)return null;return new Promise(resolve=>{try{const tx=db.transaction(OBJECT_STORE,'readonly');const req=tx.objectStore(OBJECT_STORE).get(key);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>resolve(null);}catch{resolve(null);}});}
async function idbSet(key,value){const db=await openDb();if(!db)return false;return new Promise(resolve=>{try{const tx=db.transaction(OBJECT_STORE,'readwrite');tx.objectStore(OBJECT_STORE).put(value,key);tx.oncomplete=()=>resolve(true);tx.onerror=()=>resolve(false);tx.onabort=()=>resolve(false);}catch{resolve(false);}});}
function safeLocalGet(k){try{return localStorage.getItem(k);}catch{return null;}}
function safeLocalSet(k,value){try{localStorage.setItem(k,value);return true;}catch{return false;}}
function parse(raw){try{const obj=typeof raw==='string'?JSON.parse(raw):raw;if(checkState(obj))return obj;}catch{}return null;}
function pickLatest(candidates){return candidates.filter(Boolean).sort((a,b)=>(b.lastSavedAt||0)-(a.lastSavedAt||0))[0]||null;}
async function loadGame(){const local=pickLatest([parse(safeLocalGet(STORE_KEY)),parse(safeLocalGet(BACKUP_KEY))]);const remote=pickLatest([parse(await idbGet('current')),parse(await idbGet('backup'))]);return pickLatest([local,remote]);}
let saveQueue=Promise.resolve();
function saveQuick(s){s.lastSavedAt=Date.now();const snapshot=JSON.stringify(s);return safeLocalSet(STORE_KEY,snapshot);}
function saveGame(s){s.lastSavedAt=Date.now();const snapshot=JSON.stringify(s);const localOk=safeLocalSet(STORE_KEY,snapshot);
  saveQueue=saveQueue.then(async()=>{
    const before=await idbGet('current');if(before&&checkState(parse(before)))await idbSet('backup',before);
    const success=await idbSet('current',snapshot);
    return success||localOk;
  }).catch(()=>false);
  return saveQueue;
}
async function backupGame(s){const snapshot=JSON.stringify(s);safeLocalSet(BACKUP_KEY,snapshot);return idbSet('backup',snapshot);}
function exportJson(s){const copy=structuredClone(s);copy.lastSavedAt=Date.now();return JSON.stringify({format:'DE-MENDIGO-EMPERADOR',exportVersion:1,save:copy},null,2);}
function parseImport(raw){let v;try{v=JSON.parse(raw);}catch{throw new Error('El archivo no contiene un JSON válido.');}if(v?.format!=='DE-MENDIGO-EMPERADOR'||!checkState(v.save))throw new Error('No es un guardado compatible con esta versión.');return v.save;}


/* js/main.js */



let game,tab='home',modal=null,offlineResult=null,lastTick=Date.now(),lastDraw=0,lastSave=Date.now(),lastBackup=Date.now(),writeTimer=null,toastTimer=null,toastId=0,soundOn=false;
const ROOT=document.getElementById('app');
const fmt=v=>Math.floor(Math.max(0,v)+1e-8).toLocaleString('es-ES');
const compact=v=>Math.abs(v)>=100000?Intl.NumberFormat('es-ES',{notation:'compact',maximumFractionDigits:1}).format(v):fmt(v);
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const costText=(c,isReward=false)=>Object.entries(c||{}).map(([r,n])=>`<span class="costtag ${!isReward&&r!=='xp'&&game.resources[r]+1e-8<n?'not-enough':''}">${r==='xp'?'✦':ICONS[r]} ${fmt(n)} ${r==='xp'?'XP':RESOURCE_LABELS[r]?.toLowerCase()||r}</span>`).join('');
const btn=(label,d,klass='primary',disabled=false,extra='')=>`<button class="${klass}" data-do="${d}" ${disabled?'disabled':''} ${extra}>${label}</button>`;
const navs=[{id:'home',icon:'⌂',label:'Inicio'},{id:'work',icon:'⚒',label:'Oficios'},{id:'shop',icon:'▣',label:'Mejoras'},{id:'market',icon:'⚖',label:'Mercado'},{id:'chron',icon:'📜',label:'Crónica'}];
function navigation(mobile=false){return `<nav class="${mobile?'mobile-nav':'navlist'}" aria-label="Navegación principal">${navs.map(n=>`<button class="navbtn ${tab===n.id?'active':''}" aria-current="${tab===n.id?'page':'false'}" data-do="tab" data-id="${n.id}"><span class="nav-ico" aria-hidden="true">${n.icon}</span><span class="nav-label">${n.label}</span></button>`).join('')}</nav>`;}
function initShell(){ROOT.innerHTML=`<aside class="sidebar"><div class="brand"><div class="brand-mark">♛</div><div><h1>DE MENDIGO<br>A EMPERADOR</h1><small>CRÓNICAS DEL BARRO</small></div></div>${navigation(false)}<div class="sidebar-bottom"><span id="save-status">● Preparando guardado</span><br>Versión ${RELEASE} · Prólogo</div></aside><header class="topbar"><div class="top-title"><div><div class="eyebrow" style="font-size:9px">CRÓNICAS DEL BARRO · v${RELEASE}</div><div class="top-sub">Del polvo del camino a las primeras monedas</div></div><span id="stage-tag" class="stage-badge"></span></div><div id="resource-strip" class="statbar"></div></header><main id="page" class="content" tabindex="-1"></main>${navigation(true)}<div id="toasts" class="toast-wrap" aria-live="polite"></div><div id="modal-area"></div><input id="import-file" type="file" accept="application/json,.json" class="sr-only" aria-label="Importar archivo de partida">`;
  document.addEventListener('click',handleClick);
  document.getElementById('import-file').addEventListener('change',handleFile);
}
function ratesLabel(r){let n=rates(game)[r];if(Math.abs(n)<.001)return '';return `<span class="stat-rate" style="color:${n>=0?'var(--green)':'var(--red)'}">${n>=0?'+':''}${n.toFixed(2)}/s</span>`;}
function resourceStrip(){return ['gold','food','wood'].map(r=>`<div class="stat-pill ${r}"><div class="stat-name">${ICONS[r]} ${RESOURCE_LABELS[r]}</div><div class="stat-number">${compact(game.resources[r])}</div>${ratesLabel(r)}</div>`).join('');}
function progress(label,n,max,type=''){return `<div><div class="progress-label"><span>${label}</span><b>${fmt(n)} / ${fmt(max)}</b></div><div class="progress-track"><div class="progress-fill ${type}" style="width:${Math.max(0,Math.min(100,n/max*100))}%"></div></div></div>`;}
function moneyValue(s){return Math.round(s.resources.gold + ['food','wood','stone','herbs'].reduce((sum,id)=>sum+s.resources[id]*marketPrice(s,id),0));}
function trackHistory(force=false){
  if(!game)return;
  if(!Array.isArray(game.history))game.history=[];
  let h=game.history,last=h[h.length-1],stamp=Math.floor(game.clock);
  const total=moneyValue(game),earned=Math.floor(game.stats.goldEarned||0);
  if(!last||stamp-last.t>=14||(force&&(Math.abs(total-last.v)>=8||earned!==last.e))){
    h.push({t:stamp,v:total,e:earned});if(h.length>80)h.splice(0,h.length-80);
  }
}
function sparkline(points,color='#efc678'){
  const values=points.map(x=>Math.max(0,x));
  if(values.length<2)return `<div class="chart-empty">Tu gráfica empieza con tus primeras acciones.<span>⏳</span></div>`;
  let lo=Math.min(...values),hi=Math.max(...values),range=Math.max(1,hi-lo),n=values.length;
  const co=values.map((v,i)=>[12+i*356/Math.max(1,n-1),110-((v-lo)/range)*90]);
  const line=co.map((xy,i)=>(i?'L':'M')+xy.map(v=>v.toFixed(1)).join(' ')).join(' ');
  const area=line+` L 368 118 L 12 118 Z`;
  return `<svg class="real-chart" viewBox="0 0 380 130" role="img" aria-label="Gráfica real de ${values.length} muestras de tu partida" preserveAspectRatio="none"><defs><linearGradient id="chartfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".35"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><path d="M 12 118 L 368 118" stroke="#78908b" stroke-opacity=".22" stroke-dasharray="3 7"/><path d="${area}" fill="url(#chartfill)"/><path d="${line}" fill="none" stroke="${color}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${co[n-1][0]}" cy="${co[n-1][1]}" r="5" fill="${color}" stroke="#132e2c" stroke-width="2"/></svg>`;
}
function economyPanel(){
  const h=(game.history||[]).slice(-48),val=moneyValue(game),rt=rates(game),passive=Object.entries(rt).filter(([r,n])=>r!=='gold'&&n>0).map(([r,n])=>`${ICONS[r]} +${n.toFixed(2)}/s`);
  return `<section class="economy-panel"><div class="economy-title"><div><span class="eyebrow">TU FORTUNA EN MOVIMIENTO</span><h2>De cero a una fortuna</h2></div><span class="economy-pulse">● EN VIVO</span></div><div class="economy-main"><div><div class="economy-number">${fmt(val)} <small>🪙</small></div><div class="economy-caption">Valor total aproximado de tus recursos</div></div><div class="economy-delta">${rt.gold>=0?'+':''}${rt.gold.toFixed(2)} 🪙/s<br><small>Ingresos automáticos netos</small></div></div>${sparkline(h.map(x=>x.v))}<div class="economy-foot"><span>Historial real · ${Math.max(0,h.length)} muestras</span><span>${passive.length?passive.slice(0,2).join(' · '):'Contrata trabajadores para producir sin tocar nada'}</span></div></section>`;
}
function elapsedText(t){let m=Math.floor(Math.max(0,t)/60),h=Math.floor(m/60);return h?`${h} h ${m%60} min`:`${m} min`}
function eventBanner(){const e=EVENTS.find(e=>e.id===game.pendingEvent);return e?`<div class="event-banner"><div><strong>✉ ${esc(e.title)}</strong><p>Un acontecimiento está esperando tu decisión.</p></div>${btn('Decidir →','open-event','outline')}</div>`:'';}
function sceneSvg(){
 const shelter=!!game.owned.shelter,stall=!!game.owned.stall, workers=Math.min(4,totalWorkers(game));
 const trees=[[84,143,1.0],[154,114,.72],[233,155,.83],[628,138,.85],[722,157,1.15],[808,125,.83],[864,179,.9]].map(([x,y,sc])=>`<g transform="translate(${x} ${y}) scale(${sc})"><path d="M -5 17 h 10 v 35 h -10z" fill="#72513a"/><path d="M 0 -55 L -30 5 H 30Z" fill="#244d40"/><path d="M 0 -37 L -34 15 H 34Z" fill="#2e6950"/><path d="M 0 -13 L -37 30 H 37Z" fill="#347355"/><path d="M -10 -4 l 8 -14 l 8 9" stroke="#92b174" stroke-width="3" opacity=".4" fill="none"/></g>`).join('');
 const buildings=shelter?`<g class="building"><ellipse cx="465" cy="233" rx="121" ry="20" fill="#142e29" opacity=".4"/><rect x="398" y="124" width="134" height="113" rx="5" fill="#bc9464"/><rect x="406" y="135" width="119" height="87" fill="#b58d5d"/><path d="M 376 135 L 467 64 L 550 135Z" fill="#6c3730" stroke="#d2a26c" stroke-width="8" stroke-linejoin="round"/><path d="M 453 237 V 174 h 34 v 63" fill="#62442f" stroke="#3e2b26" stroke-width="4"/><rect x="413" y="155" width="22" height="28" fill="#ffd387" stroke="#59422f" stroke-width="5"/><path d="M 425 155 v28" stroke="#59422f" stroke-width="3"/><path d="M 515 91 l0 -34 l18 0 l0 47" fill="#75624b"/><path d="M 410 207 h 25 m 62 0 h 25" stroke="#d7b78a" stroke-width="5" opacity=".5"/></g>`:
 `<g class="building"><ellipse cx="463" cy="233" rx="105" ry="21" fill="#142e29" opacity=".5"/><path d="M 386 222 L 459 105 L 540 222 Z" fill="#c29d63" stroke="#e3c58c" stroke-width="5"/><path d="M 459 105 L 460 226 L 540 222 Z" fill="#987049"/><path d="M 459 106 L 459 224" stroke="#5e4435" stroke-width="4"/><path d="M 444 223 L 462 186 L 482 223" fill="#553b2d"/><path d="M 392 221 L 535 221" stroke="#5f4733" stroke-width="7"/><path d="M 403 226 v17 m 119 -17 v17" stroke="#987b59" stroke-width="5"/></g>`;
 const shop=stall?`<g class="building"><ellipse cx="686" cy="234" rx="90" ry="17" fill="#162f2b" opacity=".5"/><rect x="622" y="169" width="125" height="65" rx="4" fill="#99734d"/><path d="M 607 167 L 617 117 L 750 117 L 763 167 Z" fill="#cfb78e"/><path d="M 607 167 h156" stroke="#e5c88d" stroke-width="5"/><path d="M 617 119 v48 m 26 -48 v48 m 26 -48 v48 m 26 -48 v48 m 26 -48 v48 m 28 -48 v48" stroke="#934d38" stroke-width="12"/><path d="M 619 201 h128" stroke="#dbb27a" stroke-width="15"/><circle cx="660" cy="195" r="12" fill="#9bb865"/><circle cx="687" cy="196" r="9" fill="#eab262"/><circle cx="712" cy="194" r="12" fill="#b75546"/><rect x="614" y="225" width="7" height="30" fill="#67472d"/><rect x="743" y="225" width="7" height="30" fill="#67472d"/></g>`:'';
 const people=Array.from({length:workers},(_,i)=>{const x=335+i*66;const y=224+(i%2)*10;return `<g class="little-person" transform="translate(${x} ${y})"><ellipse cy="24" rx="15" ry="5" fill="#152b27" opacity=".35"/><path d="M -7 12 l-3 15 m 14-15 l 8 15" stroke="#313b35" stroke-width="5"/><path d="M -9 -2 h19 l5 20 h-28z" fill="${['#b18356','#446e64','#8b5c4b','#a79b65'][i]}"/><circle cy="-12" r="9" fill="#e1b789"/><path d="M -10 -17 q 10 -16 20 0" fill="#634839"/></g>`}).join('');
 const fire=game.owned.campfire?`<g transform="translate(294 222)"><ellipse rx="35" ry="12" fill="#1b2926"/><path d="M -13 7 L 10 -22 L 5 -2 L 18 -12 L 10 14 L -8 14Z" fill="#ffb14d" class="flame"/><path d="M -3 11 L 6 -13 L 6 11" fill="#ffe8a2"/><path d="M -25 11 L 24 14 M -21 17 L 20 9" stroke="#79553b" stroke-width="7"/></g>`:'';
 return `<svg class="world-art" viewBox="0 0 900 305" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Tu mundo: ${stall?'puesto comercial y refugio':shelter?'refugio de madera':'campamento humilde'}${workers?' con '+workers+' trabajadores':''}"><defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#6aa1a1"/><stop offset="1" stop-color="#d8d09c"/></linearGradient><linearGradient id="grassg" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#5c8661"/><stop offset="1" stop-color="#28554b"/></linearGradient></defs><path d="M0 0 H900 V305 H0Z" fill="url(#skyg)"/><circle cx="700" cy="56" r="41" fill="#fff1ad" opacity=".75"/><g class="moving-cloud" fill="#d9e8da" opacity=".65"><ellipse cx="145" cy="43" rx="70" ry="12"/><ellipse cx="196" cy="51" rx="38" ry="9"/><ellipse cx="760" cy="32" rx="75" ry="10"/></g><path d="M0 183 L102 123 L176 170 L286 65 L399 163 L496 91 L635 175 L735 89 L857 178 L900 129 V305H0" fill="#63857c" opacity=".8"/><path d="M0 197 L140 151 L270 196 L412 128 L549 194 L744 148 L900 198 V305 H0" fill="#4a796b"/><path d="M0 216 Q200 174 403 209 Q650 165 900 213 L900 305H0" fill="url(#grassg)"/><path d="M0 279 Q190 233 315 270 Q445 304 622 265 Q741 245 900 283 V305 H0" fill="#3c7155"/><path d="M0 306 Q 164 265 307 275 Q 423 309 900 239 L900 305Z" fill="#bc9d73" opacity=".85"/><path d="M0 305 Q 160 283 310 291 Q 530 308 900 262" stroke="#dec394" stroke-width="12" fill="none" opacity=".5"/>${trees}${buildings}${fire}${shop}${people}<g fill="#e0cd85" opacity=".65"><circle cx="55" cy="252" r="2"/><circle cx="204" cy="257" r="3"/><circle cx="576" cy="255" r="2"/><circle cx="824" cy="246" r="2"/><path d="M 210 234 v-8 m-5 5 h10 M 768 242 v-10 m-5 5 h10" stroke="#e0cd85" stroke-width="2"/></g></svg>`;
}
function hero(){const st=currentStage(game);const next=st===1?'De un par de monedas a tu primer refugio.':st===2?'Ahora levanta un puesto comercial.':'¡El primer negocio de tu futura dinastía!';
 return `<section class="hero game-world stage${st}"><div class="hero-top"><div><span class="pill">CAPÍTULO ${['','I','II','III'][st]} · ${stageName(game).toUpperCase()}</span><h2>${st===1?'Tu historia empieza aquí.':st===2?'Tu primer hogar.':'¡Nace tu primer negocio!'}</h2><p>${next}</p></div><div class="world-level"><span>✦ NIVEL ${levelForXp(game.xp)}</span><strong>${totalWorkers(game)} <small>trabajadores</small></strong></div></div><div class="world-frame">${sceneSvg()}<div class="scene-bottom"><span>✦ TU PEQUEÑO MUNDO</span><span>${st===1?'Un camino y una oportunidad':st===2?'El refugio cobra vida':'Primer puesto comercial'}</span></div></div><div class="scene-tap"><span class="tap-hint">JUEGA DIRECTAMENTE</span>${btn('🤲 Mendigar','work','tapbtn',game.energy<1,'data-id="beg"')}${btn('🌾 Comida','work','tapbtn',game.energy<1.5,'data-id="forage"')}${btn('🪵 Madera','work','tapbtn',game.energy<2,'data-id="wood"')}</div></section>`;
}
function questPanel(limit=3){const waiting=QUESTS.filter(q=>!game.completed.includes(q.id));const ready=waiting.filter(q=>q.check(game));let selected=[...ready,...waiting.filter(q=>!q.check(game))].slice(0,limit);
return `<div class="panel"><div class="row between"><h2>Tu camino</h2><span class="pill gray">${game.completed.length}/${QUESTS.length}</span></div><p class="panel-desc">Completa objetivos para obtener recursos y experiencia.</p>${selected.length?selected.map(q=>`<div class="quest-item"><div class="mark">${q.check(game)?'✦':'◇'}</div><div class="quest-body"><div class="quest-title">${q.title}</div><div class="quest-text">${q.desc}</div><div class="quest-reward">${costText(q.reward,true)}</div></div>${q.check(game)?btn('Cobrar','claim','secondary smallbtn',false,`data-id="${q.id}"`):''}</div>`).join(''):`<div class="notice">¡Has completado todos los objetivos disponibles de esta versión! 👑</div>`}</div>`;}
function recentLog(limit=5){return `<div class="panel"><div class="row between"><h2>Tu diario</h2><span class="subtle small">Sucesos recientes</span></div><div class="timeline">${game.log.slice(0,limit).map(x=>`<div class="timeline-item"><span class="timeline-time">${elapsedText(x.at)}</span><span class="timeline-text ${esc(x.type)}">${esc(x.message)}</span></div>`).join('')}</div></div>`;}
function meters(){const rate=rates(game);return `<div class="panel"><h2>Estado del viajero</h2><p class="panel-desc">Trabaja, come y descansa. El tiempo recupera tu energía.</p><div class="progress-group">${progress('⚡ Energía',game.energy,maxEnergy(game),'goldfill')}${progress('🍞 Saciedad',game.hunger,100,game.hunger<25?'redfill':'')}${progress('✦ Progreso de nivel',game.xp-Math.pow(levelForXp(game.xp)-1,2)*36, (2*levelForXp(game.xp)-1)*36)}</div><div class="row" style="margin-top:17px;flex-wrap:wrap">${btn((game.restCooldown||0)>0?`☕ ${Math.ceil(game.restCooldown)}s`:'☕ Descansar','work','secondary',(game.restCooldown||0)>0||game.energy>=maxEnergy(game)-.02,'data-id="rest"')}${btn('🍞 Comer 1 ración','work','outline',game.resources.food<1||game.hunger>=99.9,'data-id="eat"')}</div><div class="divider"></div><div class="row between"><span class="subtle">Experiencia total</span><strong>✦ ${fmt(game.xp)} XP</strong></div><div class="row between" style="margin-top:8px"><span class="subtle">Energía recuperada</span><span class="positive">${((game.owned.shelter ? 0.34 : 0.24)*(game.owned.blanket ? 1.25 : 1)*(game.owned.hearth ? 1.15 : 1)*(game.hunger<14 ? 0.65 : 1)).toFixed(2)}/s</span></div></div>`;}
function actionRows(compactMode=false){const actions=[{id:'beg',icon:'🤲',title:'Mendigar',description:'Habla con los viajeros y recoge unas monedas.',effect:'+2–5 monedas · +3 XP',cost:1},{id:'forage',icon:'🌾',title:'Buscar provisiones',description:'Recoge alimentos y, de vez en cuando, hierbas.',effect:`+${2+(game.owned.basket?1:0)}–${3+(game.owned.basket?1:0)} comida · +4 XP`,cost:1.5},{id:'wood',icon:'🪵',title:'Recoger madera',description:'Recoge ramas y vende la madera sobrante.',effect:`+${2+(game.owned.axe?2:0)}–${3+(game.owned.axe?2:0)} madera · +4 XP`,cost:2},{id:'stone',icon:'🪨',title:'Extraer piedra',description:'Necesitas un pico para trabajar en la cantera.',effect:'+2–3 piedra · +5 XP',cost:2.5,unlock:!!game.owned.pickaxe},{id:'errand',icon:'✉️',title:'Hacer un encargo',description:'Trabaja para un mercader del camino.',effect:'+15–23 monedas · +8 XP',cost:3.5,unlock:game.stats.goldEarned>=75}];
  return actions.filter(a=>a.unlock!==false||!compactMode).map(a=>`<div class="action-row ${a.unlock===false?'blocked':''}"><div class="action-emoji">${a.icon}</div><div class="action-info"><strong>${a.title}</strong><div class="item-desc">${compactMode?'':a.description}</div><div class="reward">${a.unlock===false?'🔒 Por desbloquear':a.effect}</div></div>${btn(a.unlock===false?'🔒':`−${a.cost} ⚡`,'work','primary smallbtn',a.unlock===false||game.energy+1e-8<a.cost,`data-id="${a.id}" aria-label="${a.title}"`)}</div>`).join('');}
function nextUnlock(){
 const next=game.owned.stall?null:game.owned.shelter?TOOLS.find(x=>x.id==='stall'):TOOLS.find(x=>x.id==='shelter');
 if(!next)return `<div class="next-unlock complete"><span>👑</span><div><b>¡Prólogo completado!</b><small>El próximo capítulo llega con los talleres y rutas de la v0.2.</small></div></div>`;
 const progressPercent=Math.min(100,Math.floor(Object.entries(next.cost).reduce((sum,[r,n])=>sum+Math.min(1,game.resources[r]/n),0)/Object.keys(next.cost).length*100));
 return `<div class="next-unlock"><div class="next-icon">${next.icon}</div><div class="next-body"><span class="eyebrow">PRÓXIMO GRAN DESBLOQUEO</span><b>${next.name}</b><div class="next-requirements">${Object.entries(next.cost).map(([r,n])=>`<span class="${game.resources[r]>=n?'ready':''}">${ICONS[r]} ${fmt(Math.min(n,game.resources[r]))}/${fmt(n)}</span>`).join('')}</div><div class="next-track"><span style="width:${progressPercent}%"></span></div></div>${btn('Ver','tab','unlock-go',false,'data-id="shop"')}</div>`;
}
function overview(){return `${eventBanner()}${hero()}${nextUnlock()}${economyPanel()}<div class="section-head"><h2 class="section-title">Tu jornada</h2><span>Acciones principales</span></div><div class="two-col"><div class="stack"><section class="panel"><div class="row between"><h2>Gánate la vida</h2><span class="pill gray">${game.stats.actions} acciones</span></div><p class="panel-desc">Cada acción mejora tu situación. No te preocupes: pronto podrás automatizarlas.</p><div class="action-list">${actionRows(true)}</div><div style="margin-top:14px">${btn('Ver todos los oficios →','tab','ghost full',false,'data-id="work"')}</div></section>${questPanel()}</div><div class="stack">${meters()}${recentLog(5)}</div></div>`;}
function workPage(){const slots=workerSlots(game),used=totalWorkers(game);return `${eventBanner()}<div class="dashboard-header"><h2>Oficios y trabajadores</h2><p>De tus manos nace la riqueza. Con ayuda, el trabajo continúa incluso cuando no juegas.</p></div><div class="two-col"><div class="stack"><section class="panel"><div class="row between"><h2>Trabajo manual</h2><span class="pill">✦ Nivel ${levelForXp(game.xp)}</span></div><p class="panel-desc">Consigue recursos, experiencia y dinero para tus primeras inversiones.</p><div class="action-list">${actionRows()}</div></section><section class="panel"><div class="row between"><h2>Tu equipo</h2><span class="pill ${game.owned.shelter?'green':'gray'}">${used}/${slots} plazas</span></div><p class="panel-desc">Los empleados generan recursos automáticamente y cobran salarios por la producción realizada.</p>${!game.owned.shelter?`<div class="locked-banner">🔒 Construye un refugio para contratar a tus primeros trabajadores.</div>`:`<div class="item-list">${WORKERS.map(w=>`<div class="item-row ${!game.owned[w.req]?'blocked':''}"><div class="action-emoji">${w.icon}</div><div class="item-info"><strong>${w.name}</strong><div class="item-desc">${w.desc}</div><div class="item-desc">Sueldo: ${w.wage.toFixed(3)} monedas/s por empleado</div>${w.id==='trader'?`<div class="item-desc">Reserva: ${fmt(game.reserveWood)} madera</div>`:''}</div><div class="item-right"><div class="worker-controls">${btn('−','fire','ghost smallbtn',!(game.workers[w.id]>0),`data-id="${w.id}" aria-label="Despedir ${w.name}"`)}<span class="count">${game.workers[w.id]}</span>${btn('+','hire','primary smallbtn',!game.owned[w.req]||used>=slots||game.resources.gold<workerCost(game,w.id),`data-id="${w.id}" aria-label="Contratar ${w.name}"`)}</div><span class="price">${fmt(workerCost(game,w.id))} 🪙</span></div></div>`).join('')}</div>`}${game.owned.stall?`<div class="divider"></div><div class="inputrow"><label for="reserve">Reserva de madera para el vendedor</label><input id="reserve" type="number" min="0" max="${caps(game).wood}" value="${fmt(game.reserveWood)}"><button class="secondary smallbtn" data-do="reserve">Aplicar</button></div>`:''}</section></div><div class="stack">${meters()}<section class="panel"><h2>Producción estimada</h2><p class="panel-desc">Ingresos y consumos de tus trabajadores, antes de límites de almacén.</p>${RESOURCES.map(r=>`<div class="row between" style="margin:9px 0"><span>${ICONS[r]} ${RESOURCE_LABELS[r]}</span><strong class="${rates(game)[r]>=0?'positive':'negative'}">${rates(game)[r]>=0?'+':''}${rates(game)[r].toFixed(3)}/s</strong></div>`).join('')}<p class="subtle tiny">Los trabajadores sin insumos, sin fondos o con el almacén lleno pueden detenerse.</p></section></div></div>`;}
function shopPage(){return `${eventBanner()}<div class="dashboard-header"><h2>Herramientas y construcciones</h2><p>Una buena inversión cambia lo que eres capaz de hacer. Cada mejora se compra una sola vez.</p></div><div class="shop-grid">${TOOLS.map(t=>{let locked=currentStage(game)<t.tier,owned=game.owned[t.id],afford=canAfford(game,t.cost);return `<div class="shop-card ${owned?'owned':''} ${locked?'blocked':''}"><div class="row between"><span class="shop-card-icon">${t.icon}</span><span class="pill ${owned?'green':'gray'}">${owned?'✓ Adquirido':locked?'🔒 Etapa II':t.tier===2?'TRABAJADOR':'MENDIGO'}</span></div><h3>${t.name}</h3><div class="item-desc">${t.desc}</div><div class="badges">${costText(t.cost)}</div><div class="btnrow">${btn(owned?'✓ Construido':locked?'Bloqueado':'Construir / comprar','purchase',owned?'ghost full':'primary full',locked||owned||!afford,`data-id="${t.id}"`)}</div></div>`}).join('')}</div><p class="footer-note">Consejo: vender madera suele ser más rentable que mendigar constantemente. Pero reserva materiales para tus construcciones.</p>`;}
function marketPage(){return `${eventBanner()}<div class="dashboard-header"><h2>Mercado y encargos</h2><p>Los precios cambian con el tiempo. Vende excedentes, compra lo que necesitas y completa contratos.</p></div><div class="section-head"><h2 class="section-title">Compra y vende</h2><span>Precios del mercado local</span></div><div class="market-grid">${['food','wood','stone','herbs'].map(r=>`<div class="market-item"><div class="row between"><h3>${ICONS[r]} ${RESOURCE_LABELS[r]}</h3><span class="pill gray">${fmt(game.resources[r])}/${fmt(caps(game)[r])}</span></div><div class="market-price">Venta: ${marketPrice(game,r)} 🪙 · Compra: ${buyPrice(game,r)} 🪙</div><div class="market-actions">${btn('Vender 1','trade','secondary smallbtn',game.resources[r]<1,`data-id="${r}" data-kind="sell" data-q="1"`)}${btn('Vender 5','trade','secondary smallbtn',game.resources[r]<1,`data-id="${r}" data-kind="sell" data-q="5"`)}${btn('Todo','trade','outline smallbtn',game.resources[r]<1,`data-id="${r}" data-kind="sell" data-q="all"`)}${btn('Comprar 1','trade','ghost smallbtn',game.resources.gold<buyPrice(game,r)||caps(game)[r]-game.resources[r]<1,`data-id="${r}" data-kind="buy" data-q="1"`)}</div></div>`).join('')}</div><div class="section-head"><h2 class="section-title">Tablón de encargos</h2><span>Nuevas ofertas en ${Math.ceil(game.contractTimer/60)} min</span></div><div class="three-col">${game.contracts.length?game.contracts.map(c=>`<div class="contract"><h3>✉ ${c.name}</h3><div class="contract-cost">${costText(c.needs)}</div><div class="contract-footer"><span class="reward">+${fmt(c.reward)} 🪙 · +15 XP</span>${btn('Entregar','contract','primary smallbtn',!canAfford(game,c.needs),`data-id="${c.uid}"`)}</div></div>`).join(''):`<div class="notice">No quedan encargos. El tablón se renovará pronto.</div>`}</div><div class="notice info" style="margin-top:16px">💡 Los contratos ofrecen pagos fijos y pueden ser muy rentables. Se renuevan periódicamente y no obligan a estar conectado.</div>`;}
function chronPage(){const level=levelForXp(game.xp);return `${eventBanner()}<div class="dashboard-header"><h2>Libro de las Crónicas</h2><p>Las grandes historias también empiezan con botas gastadas y un poco de suerte.</p></div><div class="panel"><div class="eyebrow">CAPÍTULO ACTUAL</div><h2 style="margin-top:8px">${currentStage(game)===3?'El primer comerciante':currentStage(game)===2?'Un oficio honrado':'El mendigo del camino'}</h2><p class="quote">«${currentStage(game)===3?'Con tu primer puesto comercial, tu nombre comienza a correr entre viajeros y gremios. El siguiente capítulo traerá talleres, rutas y negocios.':currentStage(game)===2?'Tu refugio ya no es solo un techo: es el principio de una comunidad que depende de tus decisiones.':'No poseías tierras, ni nombre, ni escudo. Aun así, decidiste construir algo que sobreviviera a tus primeros pasos.'}»</p></div><div class="section-head"><h2 class="section-title">Tu historia en cifras</h2></div><div class="chron-stats">${[{n:'Tiempo jugado',v:elapsedText(game.clock)},{n:'Monedas ganadas',v:fmt(game.stats.goldEarned)},{n:'Experiencia',v:`${fmt(game.xp)} XP`},{n:'Acciones manuales',v:fmt(game.stats.actions)},{n:'Contratos',v:fmt(game.stats.contracts)},{n:'Trabajadores',v:fmt(totalWorkers(game))}].map(x=>`<div class="chron-stat"><span>${x.n}</span><b>${x.v}</b></div>`).join('')}</div><div class="section-head"><h2 class="section-title">Logros</h2><span>${game.achievements.length} / ${ACHIEVEMENTS.length}</span></div><div class="achievement-grid">${ACHIEVEMENTS.map(a=>`<div class="achievement ${game.achievements.includes(a.id)?'earned':''}"><div class="achievement-icon">${game.achievements.includes(a.id)?'🏅':'🔒'}</div><div><strong>${a.name}</strong><p>${a.desc}</p></div></div>`).join('')}</div><div class="section-head"><h2 class="section-title">Objetivos y recompensas</h2></div>${questPanel(QUESTS.length)}<div class="section-head"><h2 class="section-title">Guardado y seguridad</h2></div><section class="panel"><p class="panel-desc">Tu partida se guarda automáticamente en este navegador. Exporta una copia para moverla entre dispositivos o protegerte si borras los datos de Safari.</p><div class="save-actions">${btn('↓ Exportar partida','export','secondary')}${btn('↑ Importar partida','import','outline')}${btn('Guardar ahora','save','ghost')}</div><div class="divider"></div><div class="row between wrap"><span class="subtle small">Autoguardado activo · v${RELEASE}</span>${btn('Reiniciar partida','reset','ghost smallbtn')}</div><p class="footer-note">GitHub Pages no sincroniza partidas entre PC y iPhone. Exporta el archivo para transferir tu progreso. No borres los datos del navegador sin copia de seguridad.</p></section><div class="section-head"><h2 class="section-title">Diario completo</h2></div>${recentLog(24)}`;}
function pageHtml(){return ({home:overview,work:workPage,shop:shopPage,market:marketPage,chron:chronPage}[tab]||overview)();}
function draw(){document.getElementById('stage-tag').textContent=`✦ ${stageName(game)}`;document.getElementById('resource-strip').innerHTML=resourceStrip();document.getElementById('page').innerHTML=pageHtml();document.querySelectorAll('.navbtn').forEach(b=>{b.classList.toggle('active',b.dataset.id===tab);b.setAttribute('aria-current',b.dataset.id===tab?'page':'false')});drawModal();lastDraw=Date.now();}
function rewardBurst(anchor,changes,major=false){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 let rect=anchor?.getBoundingClientRect?.();let cx=rect?rect.left+rect.width/2:window.innerWidth*.55,cy=rect?rect.top+rect.height/2:window.innerHeight*.35;
 const labels=Object.entries(changes).filter(([k,v])=>Math.abs(v)>=.5).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,3);
 labels.forEach(([id,d],i)=>{
   const p=document.createElement('div');p.className='reward-fly '+(d>=0?'gain':'spend');p.style.left=`${Math.min(window.innerWidth-60,Math.max(60,cx))+(i-1)*38}px`;p.style.top=`${Math.max(62,cy)-i*21}px`;
   p.textContent=`${d>=0?'+':'−'}${fmt(Math.abs(d))} ${ICONS[id]||'✦'}`;document.body.append(p);setTimeout(()=>p.remove(),1250);
 });
 if(major){
  const confetti=document.createElement('div');confetti.className='confetti-layer';confetti.setAttribute('aria-hidden','true');
  for(let i=0;i<28;i++){let f=document.createElement('i');f.style.setProperty('--x',`${(i*47)%96}%`);f.style.setProperty('--delay',`${(i%7)*.045}s`);f.style.setProperty('--rot',`${(i*61)%340}deg`);f.style.setProperty('--col',['#f2c875','#87bfa0','#f2a28a','#e4e1ba'][i%4]);confetti.append(f);}
  document.body.append(confetti);setTimeout(()=>confetti.remove(),1850);
  const banner=document.createElement('div');banner.className='level-banner';banner.textContent=major===true?'✦ ¡NUEVO HITO DESBLOQUEADO! ✦':major;document.body.append(banner);setTimeout(()=>banner.remove(),2600);
 }
}
function toast(message,isError=false){const c=document.getElementById('toasts');const elem=document.createElement('div');elem.className=`toast ${isError?'error':''}`;elem.textContent=message;c.prepend(elem);setTimeout(()=>elem.remove(),3500);}
function queueSave(){const ok=saveQuick(game);const el=document.getElementById('save-status');if(el)el.textContent=ok?'● Guardado local actualizado':'● Guardado local limitado';if(writeTimer)clearTimeout(writeTimer);writeTimer=setTimeout(async()=>{const good=await saveGame(game);if(el)el.textContent=good?'● Partida guardada':'● Guarda una copia exportada';},750);}
function eventModal(){const e=EVENTS.find(x=>x.id===game.pendingEvent);if(!e)return '';return `<div class="eyebrow">ACONTECIMIENTO</div><h2>${e.title}</h2><p>${e.text}</p>${e.choices.map((c,i)=>`<button class="choice-btn" data-do="choice" data-id="${e.id}" data-q="${i}" ${!canAfford(game,c.cost)?'disabled':''}><strong>${c.title}</strong><small>${c.desc}${Object.keys(c.cost).length?` · Requiere ${Object.entries(c.cost).map(([r,n])=>`${n} ${RESOURCE_LABELS[r]}`).join(', ')}`:''}</small></button>`).join('')}`;}
function drawModal(){const area=document.getElementById('modal-area');if(!modal){area.innerHTML='';return;}let content='';let closable=true;
 if(modal==='event'){content=eventModal();}
 if(modal==='welcome'){content=`<div class="eyebrow">TU PRIMERA HISTORIA</div><h2>Del barro a la corona</h2><p>Hoy eres un mendigo a la orilla del camino. Trabaja para ganar recursos, vende madera, compra herramientas y construye un refugio. Después podrás contratar gente que trabajará incluso cuando cierres el juego.</p><div class="notice info">Empieza en <b>Inicio</b> o <b>Oficios</b>. Los botones dorados son tus acciones. Los trabajos gastan energía, que vuelve sola; también puedes descansar.</div>`;}
 if(modal==='offline'&&offlineResult){let d=offlineResult;content=`<div class="eyebrow">BIENVENIDO DE VUELTA</div><h2>Tu equipo ha seguido trabajando</h2><p>Has estado fuera aproximadamente <strong>${elapsedText(d.real)}</strong>. Contabilizamos el equivalente a <strong>${elapsedText(d.effective)}</strong> de producción.</p><div class="item-list">${Object.entries(d.changes).filter(([r,x])=>Math.abs(x)>.1).map(([r,x])=>`<div class="row between"><span>${ICONS[r]} ${RESOURCE_LABELS[r]}</span><b class="${x>=0?'positive':'negative'}">${x>=0?'+':''}${fmt(Math.abs(x))}</b></div>`).join('')||'<p class="subtle">Todavía no tienes trabajadores produciendo recursos.</p>'}</div>`;}
 if(modal==='reset'){content=`<h2>¿Empezar desde cero?</h2><p>Esta acción sustituirá tu partida actual por una nueva historia. Antes de hacerlo, prepararemos una copia de seguridad local; te recomendamos exportar también tu guardado.</p><div class="row wrap">${btn('Sí, nueva historia','confirm-reset','primary')}${btn('Cancelar','close-modal','ghost')}</div>`;}
 if(modal==='import-confirm'){content=`<h2>¿Restaurar esta partida?</h2><p>La importación sustituirá el progreso actual. Conservaremos una copia local de seguridad de la partida que estás utilizando.</p><div class="row wrap">${btn('Importar y sustituir','confirm-import','primary')}${btn('Cancelar','close-modal','ghost')}</div>`;}
 if(modal==='complete'){content=`<div class="eyebrow">FIN DEL PRÓLOGO</div><h2>¡Te has convertido en comerciante!</h2><p>Empezaste sin nada, has levantado tu primer refugio, organizado trabajadores y fundado un puesto comercial.</p><p>En la <strong>versión 0.2</strong> llegarán los negocios, la fabricación de productos, talleres y rutas comerciales. Puedes seguir jugando y acumulando recursos hasta entonces.</p>`;}
 area.innerHTML=`<div class="modal-veil" data-do="backdrop"><div class="modal-card" role="dialog" aria-modal="true" aria-label="${esc(modal)}">${content}${closable?`<button class="ghost full modal-close" data-do="close-modal">${modal==='welcome'?'Empezar mi historia →':'Cerrar'}</button>`:''}</div></div>`;
}
let pendingImport=null;
async function handleFile(e){const file=e.target.files?.[0];e.target.value='';if(!file)return;if(file.size>3000000){toast('El archivo es demasiado grande.',true);return;}try{pendingImport=parseImport(await file.text());modal='import-confirm';drawModal();}catch(err){toast(err.message||'No se pudo leer el archivo.',true)}}
async function handleClick(e){let b=e.target.closest('[data-do]');if(!b||b.disabled)return;let op=b.dataset.do,id=b.dataset.id;
 if(op==='backdrop'){if(e.target!==b)return;modal=null;drawModal();return;}
 if(op==='tab'){tab=id;window.scrollTo({top:0,behavior:'instant'});draw();return;}
 if(op==='close-modal'){modal=null;drawModal();return;}
 if(op==='open-event'){modal='event';drawModal();return;}
 if(op==='import'){document.getElementById('import-file').click();return;}
 if(op==='export'){const json=exportJson(game);const blob=new Blob([json],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`mendigo-emperador-v${RELEASE}-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Archivo de partida generado.');return;}
 if(op==='save'){await saveGame(game);toast('Partida guardada.');return;}
 if(op==='reset'){modal='reset';drawModal();return;}
 if(op==='confirm-reset'){await backupGame(game);game=createGame((Date.now()>>>0)^0xD0F11);lastTick=Date.now();modal='welcome';queueSave();draw();toast('Una nueva historia comienza.');return;}
 if(op==='confirm-import'&&pendingImport){await backupGame(game);game=pendingImport;pendingImport=null;game.lastSavedAt=Date.now();lastTick=Date.now();modal=null;tab='home';await saveGame(game);draw();toast('Partida restaurada correctamente.');return;}
 let result;const before={...game.resources},beforeStage=currentStage(game),beforeXP=levelForXp(game.xp),beforeCompleted=game.completed.length,beforeAch=game.achievements.length;
 if(op==='work')result=action(game,id);
 else if(op==='purchase')result=purchase(game,id);
 else if(op==='hire')result=hire(game,id);
 else if(op==='fire')result=fire(game,id);
 else if(op==='trade')result=trade(game,id,b.dataset.kind,b.dataset.q);
 else if(op==='claim')result=claimQuest(game,id);
 else if(op==='contract')result=fulfill(game,id);
 else if(op==='choice'){result=chooseEvent(game,id,Number(b.dataset.q));if(result.ok)modal=null;}
 else if(op==='reserve'){result=setReserve(game,Number(document.getElementById('reserve')?.value));}
 if(result){if(!result.ok)toast(result.msg,true);if(result.ok){const diff=Object.fromEntries(RESOURCES.map(r=>[r,game.resources[r]-before[r]]));const major=currentStage(game)>beforeStage?'✦ ¡HAS ASCENDIDO A '+stageName(game).toUpperCase()+'! ✦':game.completed.length>beforeCompleted?'✦ ¡OBJETIVO COMPLETADO! ✦':game.achievements.length>beforeAch?'✦ ¡NUEVO LOGRO! ✦':false;rewardBurst(b,diff,major);if(op!=='work'||id==='rest'||id==='eat')toast(result.msg);trackHistory(true);queueSave();if(game.owned.stall&&!game.stats.completionModalShown){game.stats.completionModalShown=true;modal='complete';queueSave();}}draw();}
}
function tick(){if(!game)return;let now=Date.now(),elapsed=(now-lastTick)/1000;lastTick=now;
 if(elapsed>3){advanceOffline(game,elapsed)}else if(elapsed>0)simulate(game,Math.min(elapsed,3));
 if(now-lastDraw>2200&&!modal)draw();trackHistory();
 if(now-lastSave>10000){queueSave();lastSave=now;}
 if(now-lastBackup>90000){backupGame(game).catch(()=>{});lastBackup=now;}
}
async function boot(){try{game=await loadGame();const returning=!!game;
 if(!game)game=createGame((Date.now()>>>0)^0xF02A6);
 if(!checkState(game))throw new Error('La partida tiene un formato inesperado.');if(!Array.isArray(game.history))game.history=[];trackHistory(true);
 if(returning){const delta=Math.max(0,(Date.now()-game.lastSavedAt)/1000);if(delta>20)offlineResult=advanceOffline(game,delta);}
 lastTick=Date.now();lastSave=Date.now();lastBackup=Date.now();initShell();
 if(!returning)modal='welcome';else if(offlineResult&&offlineResult.real>60)modal='offline';
 draw();queueSave();setInterval(tick,250);
 window.addEventListener('pagehide',()=>{if(game)saveQuick(game);});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){saveQuick(game);saveGame(game).catch(()=>{});}else{let d=(Date.now()-lastTick)/1000;if(d>3)advanceOffline(game,d);lastTick=Date.now();draw();}});
 if('serviceWorker' in navigator&&location.protocol.startsWith('http')){navigator.serviceWorker.register('./service-worker.js').catch(()=>{});}
 }catch(err){ROOT.innerHTML=`<main style="max-width:500px;margin:20vh auto;padding:25px;background:#24383a;border-radius:14px"><h1>Error al iniciar la partida</h1><p>Se ha producido un error al abrir los datos del juego. Si tienes una exportación, no borres los archivos del navegador.</p><pre style="white-space:pre-wrap;color:#efb0a4">${esc(err.message)}</pre><button onclick="location.reload()">Reintentar</button></main>`;console.error(err);}}
boot();

})();
