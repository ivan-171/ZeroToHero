import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,checkState,action,purchase,hire,fire,trade,fulfill,claimQuest,chooseEvent,simulate,advanceOffline,caps,currentStage,workerSlots,totalWorkers,marketPrice,workerCost,setReserve} from '../js/engine.js';
import {QUESTS,EVENTS,RESOURCES} from '../js/data.js';
const g=()=>createGame(101,1000);
function assertSafe(s){assert.ok(checkState(s));for(const [r,n] of Object.entries(s.resources)){assert.ok(Number.isFinite(n)&&n>=0,`${r} is invalid: ${n}`);assert.ok(n<=caps(s)[r]+1e-5,`${r} exceeded cap`);}assert.ok(s.energy>=0);assert.ok(s.hunger>=0);}
test('new game is valid and does not have shops / workers unlocked',()=>{const s=g();assertSafe(s);assert.equal(currentStage(s),1);assert.equal(workerSlots(s),0);assert.equal(s.resources.gold,0);assert.equal(s.resources.food,3);});
test('manual actions require energy and grant appropriate resources',()=>{const s=g();let a=action(s,'beg');assert.equal(a.ok,true);assert.ok(s.resources.gold>0);assert.equal(s.energy,9);for(let i=0;i<20;i++)action(s,'wood');assert.ok(s.energy>=0);assert.equal(action(s,'stone').ok,false);assert.equal(action(s,'rest').ok,true);assertSafe(s);});
test('buying a tool once and respecting costs',()=>{const s=g();assert.equal(purchase(s,'axe').ok,false);s.resources.gold=100;assert.equal(purchase(s,'axe').ok,true);assert.equal(purchase(s,'axe').ok,false);assert.equal(action(s,'wood').ok,true);assert.ok(s.resources.wood>=4);assertSafe(s);});
test('progression to shelter and merchant stage',()=>{const s=g();s.resources.gold=5000;s.resources.wood=100;s.resources.stone=50;assert.equal(purchase(s,'stall').ok,false);assert.equal(purchase(s,'shelter').ok,true);assert.equal(currentStage(s),2);assert.equal(workerSlots(s),2);assert.equal(purchase(s,'stall').ok,true);assert.equal(currentStage(s),3);assert.equal(workerSlots(s),4);assertSafe(s);});
test('workers generate resources and never consume money below zero',()=>{const s=g();s.resources.gold=400;s.resources.wood=24;purchase(s,'shelter');assert.equal(hire(s,'woodcutter').ok,true);assert.equal(hire(s,'forager').ok,true);assert.equal(hire(s,'woodcutter').ok,false);let w=s.resources.wood;simulate(s,30);assert.ok(s.resources.wood>w);assertSafe(s);s.resources.gold=0;let prev=s.resources.wood;simulate(s,30);assert.equal(s.resources.wood,prev,'unpaid workers cannot produce');assertSafe(s);assert.equal(fire(s,'woodcutter').ok,true);});
test('market sales, purchases and caps',()=>{const s=g();s.resources.wood=80;const p=marketPrice(s,'wood');assert.equal(trade(s,'wood','sell','all').ok,true);assert.equal(s.resources.wood,0);assert.equal(s.resources.gold,80*p);assert.equal(trade(s,'wood','buy','1').ok,true);assert.equal(trade(s,'wood','buy','0').ok,false);assertSafe(s);});
test('contracts are consumed once, quests claimed once',()=>{const s=g();let c=s.contracts.find(x=>Object.keys(x.needs).every(r=>r!=='stone'));assert.ok(c);for(const [r,n]of Object.entries(c.needs))s.resources[r]=n;const was=s.resources.gold;assert.equal(fulfill(s,c.uid).ok,true);assert.ok(s.resources.gold>was);assert.equal(fulfill(s,c.uid).ok,false);s.stats.goldEarned=30;assert.equal(claimQuest(s,'feet').ok,true);assert.equal(claimQuest(s,'feet').ok,false);assertSafe(s);});
test('events cannot be claimed twice and only affordable choices are possible',()=>{const s=g();s.stats.foodEarned=10;action(s,'beg');assert.equal(s.pendingEvent,'stranger');assert.equal(chooseEvent(s,'stranger',0).ok,true);assert.equal(s.pendingEvent,null);assert.equal(chooseEvent(s,'stranger',0).ok,false);assertSafe(s);});
test('offline production caps at 2h full + 6h quarter',()=>{const s=g();s.resources.gold=10000;s.resources.wood=100;purchase(s,'shelter');hire(s,'forager');let a=advanceOffline(s,60*60*30);assert.equal(a.effective,7200+21600*.25);assert.ok(s.clock<=12600.001);assertSafe(s);});
test('randomized 10k action-economy operations never violate resource invariants',()=>{
 const s=g();s.resources.gold=1500;s.resources.wood=90;s.resources.stone=45;purchase(s,'shelter');purchase(s,'pickaxe');purchase(s,'hearth');hire(s,'woodcutter');hire(s,'quarrier');
 const actions=['beg','forage','wood','stone','errand','eat','rest'];
 for(let i=0;i<10000;i++){
   let mode=i%13;
   if(mode<=6)action(s,actions[(i*7+Math.floor(i/7))%actions.length]);
   else if(mode<=8)trade(s,['wood','food','stone','herbs'][i%4],'sell','1');
   else if(mode===9)trade(s,'food','buy','1');
   else if(mode===10)claimQuest(s,QUESTS[i%QUESTS.length].id);
   else if(mode===11)simulate(s,30);
   else if(s.pendingEvent){const e=EVENTS.find(e=>e.id===s.pendingEvent);chooseEvent(s,e.id,e.choices.length-1);}
   if(i%50===0)assertSafe(s);
 }
 assertSafe(s);
});
test('market cycle and contract clock stay inside their expected bounds',()=>{const s=g();for(let i=0;i<41;i++)simulate(s,30);assert.ok(s.contractTimer>0&&s.contractTimer<=300);assert.ok(s.contractBatch>=4);assertSafe(s);});
test('reserve setting rejects invalid values',()=>{const s=g();assert.equal(setReserve(s,-1).ok,false);assert.equal(setReserve(s,30).ok,true);assert.equal(s.reserveWood,30);});
test('resting has a ten-second cooldown and reduces hunger',()=>{const s=g();s.energy=1;s.hunger=60;assert.equal(action(s,'rest').ok,true);assert.equal(action(s,'rest').ok,false);assert.equal(s.hunger,57);simulate(s,10);s.energy=2;assert.equal(action(s,'rest').ok,true);});
test('automated vendor sells inventory above reserve and respects storage',()=>{const s=g();s.resources.gold=1000;s.resources.wood=100;s.resources.stone=50;purchase(s,'shelter');purchase(s,'stall');assert.equal(hire(s,'trader').ok,true);s.resources.wood=100;assert.equal(setReserve(s,60).ok,true);const before=s.resources.gold;simulate(s,30);assert.ok(s.resources.gold>before);assert.ok(s.resources.wood>=60);assertSafe(s);});
