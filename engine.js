import {VERSION,TOOLS,WORKERS,QUESTS,EVENTS,ACHIEVEMENTS,CONTRACTS,BASE_PRICES,RESOURCES} from './data.js';

export const INITIAL_SEED = 84291;
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
export function levelForXp(xp){return 1+Math.floor(Math.sqrt(Math.max(0,xp)/36));}
export function maxEnergy(s){return 10+(s.owned.boots?4:0);}
export function caps(s){let m=s.owned.storage?2:1;return {gold:Infinity,food:70*m,wood:100*m,stone:50*m,herbs:40*m};}
export function workerSlots(s){return (s.owned.shelter?2:0)+(s.owned.hearth?2:0)+(s.owned.stall?2:0);}
export function totalWorkers(s){return Object.values(s.workers).reduce((a,b)=>a+b,0);}
export function workerCost(s,id){const w=WORKERS.find(x=>x.id===id);return Math.ceil(w.baseCost*Math.pow(1.58,s.workers[id]||0));}
export function currentStage(s){return s.owned.stall?3:s.owned.shelter?2:1;}
export function stageName(s){return ['','Mendigo','Trabajador','Comerciante'][currentStage(s)];}
export function marketPrice(s,id){const base=BASE_PRICES[id];if(!base)return 0;let phase = s.clock/80 + ['food','wood','stone','herbs'].indexOf(id)*1.31 + (s.seed%31)*.13;return Math.max(1,Math.round(base*(1+.17*Math.sin(phase)+.075*Math.cos(phase*.63))));}
export function buyPrice(s,id){return Math.ceil(marketPrice(s,id)*1.75)+2;}
export function canAfford(s,cost){return Object.entries(cost||{}).every(([r,q])=>r==='xp'||(s.resources[r]||0)+1e-8>=q);}
export function addResources(s, resources){for (const [r,amt] of Object.entries(resources||{})) {
  if(r==='xp'){s.xp=Math.max(0,s.xp+amt);continue;}
  if(!RESOURCES.includes(r))continue;
  const before=s.resources[r];
  s.resources[r]=clamp(before+amt,0,caps(s)[r]);
  const real = Math.max(0,s.resources[r]-before);
  if(real>0){let k=r+'Earned';s.stats[k]=(s.stats[k]||0)+real;}
}}
export function pay(s,cost){if(!canAfford(s,cost))return false;for(const [r,amt] of Object.entries(cost)){if(r==='xp')continue;s.resources[r]=Math.max(0,s.resources[r]-amt);}return true;}
export function record(s,message,type='normal'){s.log.unshift({message,type,at:s.clock});s.log=s.log.slice(0,24);}
function rand(s){s.rng = (Math.imul(1664525,s.rng>>>0)+1013904223)>>>0;return s.rng/4294967296;}
function makeContracts(s){const candidates=CONTRACTS.filter(c=>Object.keys(c.needs).every(r=>r!=='stone'||s.owned.pickaxe)).filter(c=>Object.keys(c.needs).every(r=>r!=='herbs'||s.stats.herbsEarned>0||s.clock>90));
  const idxs=candidates.map((_,i)=>i);for(let i=idxs.length-1;i>0;i--){const j=Math.floor(rand(s)*(i+1));[idxs[i],idxs[j]]=[idxs[j],idxs[i]];}
  s.contracts=idxs.slice(0,Math.min(3,candidates.length)).map((idx,i)=>({...candidates[idx],uid:`${s.contractBatch}-${idx}-${i}`}));
}
export function createGame(seed=INITIAL_SEED,now=Date.now()){
  const s={version:VERSION,seed:seed>>>0,rng:seed>>>0,createdAt:now,lastSavedAt:now,clock:0,resources:{gold:0,food:3,wood:0,stone:0,herbs:0},energy:10,hunger:80,restCooldown:0,xp:0,owned:{},workers:{woodcutter:0,forager:0,quarrier:0,trader:0},reserveWood:20,contracts:[],contractBatch:0,contractTimer:300,completed:[],seenEvents:[],pendingEvent:null,achievements:[],stats:{goldEarned:0,foodEarned:3,woodEarned:0,stoneEarned:0,herbsEarned:0,actions:0,contracts:0,manualSales:0},log:[]};
  makeContracts(s);record(s,'Tu historia comienza al borde de un camino. No tienes nada que perder.','story');return s;
}
export function checkState(s){
  if (!s || s.version!==VERSION||typeof s.resources!=='object'||!s.resources||typeof s.workers!=='object'||!s.workers||!Array.isArray(s.completed)||!Array.isArray(s.log)||!Array.isArray(s.contracts)||typeof s.stats!=='object'||!s.stats) return false;
  if(!RESOURCES.every(r=>Number.isFinite(s.resources[r])&&s.resources[r]>=0))return false;
  if(!Number.isFinite(s.clock)||s.clock<0||!Number.isFinite(s.energy)||!Number.isFinite(s.hunger)||!Number.isFinite(s.xp))return false;
  if(!WORKERS.every(w=>Number.isSafeInteger(s.workers[w.id])&&s.workers[w.id]>=0&&s.workers[w.id]<=1000))return false;
  if(!Array.isArray(s.seenEvents)||!Array.isArray(s.achievements)||!s.owned||typeof s.owned!=='object')return false;
  return true;
}
function finish(s,msg,ok=true){if(ok){updateAchievements(s);activateEvent(s);}return {ok,msg};}
export function action(s,id){
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
export function purchase(s,id){const t=TOOLS.find(x=>x.id===id);if(!t)return {ok:false,msg:'Mejora desconocida.'};if(s.owned[id])return {ok:false,msg:'Ya has adquirido esta mejora.'};if(currentStage(s)<t.tier)return {ok:false,msg:'Todavía no has desbloqueado esta mejora.'};if(!canAfford(s,t.cost))return {ok:false,msg:'No tienes los recursos necesarios.'};
  pay(s,t.cost);s.owned[id]=true;let m=`Adquirido: ${t.name}.`;
  if(id==='shelter'){m='¡Has dejado de ser mendigo! Ya puedes contratar trabajadores.';addResources(s,{xp:40});}
  if(id==='stall'){m='¡Ascendido a COMERCIANTE! Has completado el prólogo de la versión 0.1.';addResources(s,{xp:100});}
  record(s,m,'milestone');return finish(s,m);
}
export function hire(s,id){let w=WORKERS.find(x=>x.id===id);if(!w)return {ok:false,msg:'Oficio desconocido.'};if(!s.owned.shelter)return {ok:false,msg:'Primero necesitas construir un refugio.'};if(!s.owned[w.req])return {ok:false,msg:'Todavía no cumples los requisitos.'};if(totalWorkers(s)>=workerSlots(s))return {ok:false,msg:'No hay plazas libres. Amplía las instalaciones.'};const cost=workerCost(s,id);if(!pay(s,{gold:cost}))return {ok:false,msg:'No tienes suficientes monedas para contratar.'};s.workers[id]++;record(s,`Contrataste a un ${w.name.toLowerCase()}.`,'milestone');return finish(s,`Contratación realizada por ${cost} monedas.`);}
export function fire(s,id){if(!WORKERS.some(w=>w.id===id)||!(s.workers[id]>0))return {ok:false,msg:'No hay trabajadores de este oficio.'};s.workers[id]--;record(s,'Un trabajador ha abandonado el equipo.');return finish(s,'Trabajador despedido; no recuperas el coste de contratación.');}
export function trade(s,resource,kind,quantity){if(!BASE_PRICES[resource])return {ok:false,msg:'Mercancía desconocida.'};if(!['sell','buy'].includes(kind)||!['1','5','all'].includes(String(quantity)))return {ok:false,msg:'Transacción no válida.'};
  const price=kind==='buy'?buyPrice(s,resource):marketPrice(s,resource);
  const available=kind==='sell'?Math.floor(s.resources[resource]+1e-8):Math.floor(s.resources.gold/price);
  const room=kind==='buy'?Math.floor(caps(s)[resource]-s.resources[resource]+1e-8):Infinity;
  const wanted=quantity==='all'?(kind==='sell'?available:Math.min(available,room)):Number(quantity);
  const n=Math.max(0,Math.min(wanted,available,room));if(n<1)return {ok:false,msg:kind==='sell'?'No tienes suficientes mercancías.':'No tienes monedas o espacio suficiente.'};
  if(kind==='sell'){pay(s,{[resource]:n});addResources(s,{gold:price*n});s.stats.manualSales+=n;}else{pay(s,{gold:price*n});addResources(s,{[resource]:n});}
  let msg=`${kind==='sell'?'Vendidas':'Compradas'} ${n} unidades de ${resource==='wood'?'madera':resource==='food'?'comida':resource==='stone'?'piedra':'hierbas'} por ${n*price} monedas.`;
  record(s,msg);return finish(s,msg);
}
export function fulfill(s,uid){const c=s.contracts.find(c=>c.uid===uid);if(!c)return {ok:false,msg:'Este contrato ya no está disponible.'};if(!canAfford(s,c.needs))return {ok:false,msg:'Te faltan los materiales del encargo.'};pay(s,c.needs);addResources(s,{gold:c.reward,xp:15});s.stats.contracts++;s.contracts=s.contracts.filter(x=>x.uid!==uid);record(s,`Contrato completado: ${c.name}. +${c.reward} monedas.`,'milestone');return finish(s,`¡Encargo entregado! +${c.reward} monedas y 15 XP.`);}
export function claimQuest(s,id){const q=QUESTS.find(x=>x.id===id);if(!q||s.completed.includes(id))return {ok:false,msg:'Objetivo no disponible.'};if(!q.check(s))return {ok:false,msg:'Todavía no has cumplido el objetivo.'};s.completed.push(id);addResources(s,q.reward);record(s,`Objetivo completado: ${q.title}.`,'milestone');return finish(s,`Recompensa recibida: ${q.title}.`);}
function activateEvent(s){if(s.pendingEvent)return;const e=EVENTS.find(e=>!s.seenEvents.includes(e.id)&&e.requires(s));if(e){s.pendingEvent=e.id;record(s,`Nuevo acontecimiento: ${e.title}.`,'event');}}
export function chooseEvent(s,id,choiceIndex){if(s.pendingEvent!==id)return {ok:false,msg:'Este acontecimiento no está pendiente.'};const e=EVENTS.find(e=>e.id===id);const choice=e?.choices?.[choiceIndex];if(!choice)return {ok:false,msg:'Decisión desconocida.'};if(!canAfford(s,choice.cost))return {ok:false,msg:'No tienes los recursos necesarios para esa opción.'};pay(s,choice.cost);addResources(s,choice.reward);s.pendingEvent=null;s.seenEvents.push(id);record(s,choice.log,'story');return finish(s,choice.log);}
export function updateAchievements(s){for(const a of ACHIEVEMENTS){if(!s.achievements.includes(a.id)&&a.check(s)){s.achievements.push(a.id);record(s,`Logro desbloqueado: ${a.name}.`,'milestone');}}}
export function setReserve(s,value){const n=Number(value);if(!Number.isInteger(n)||n<0||n>caps(s).wood)return {ok:false,msg:'Reserva fuera de los límites.'};s.reserveWood=n;return {ok:true,msg:`Reserva de madera: ${n} unidades.`};}
export function rates(s){const out={gold:0,food:0,wood:0,stone:0,herbs:0};for(const w of WORKERS){const n=s.workers[w.id]||0;if(!n)continue;const rate=w.id==='trader'?Math.max(0,Math.min(.24*n, (s.resources.wood-s.reserveWood)/15)):0; if(w.id==='trader')out.gold+=rate*marketPrice(s,'wood')-w.wage*n;
    else{for(const [r,v] of Object.entries(w.output))out[r]+=v*n;out.gold-=w.wage*n;}}
  return out;
}
export function simulate(s,seconds,{offline=false}={}){
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
export function advanceOffline(s,elapsedRealSeconds){
  const real=clamp(Number(elapsedRealSeconds)||0,0,86400*30);
  const full=Math.min(real,7200);const reduced=Math.min(Math.max(0,real-7200),21600)*.25;
  const effective=full+reduced;
  const before={...s.resources};
  let remaining=effective;
  while(remaining>1e-6){const chunk=Math.min(30,remaining);simulate(s,chunk,{offline:true});remaining-=chunk;}
  const changes=Object.fromEntries(RESOURCES.map(r=>[r,s.resources[r]-before[r]]));
  return {real,effective,changes};
}
