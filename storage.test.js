import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from '../js/engine.js';
import {exportJson,parseImport,saveQuick,loadGame,saveGame} from '../js/storage.js';
const memory = new Map();
globalThis.localStorage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v))};
globalThis.window={};
test('save/load round-trip retains resources, work and progress',async()=>{
  memory.clear();const s=createGame(12,100);s.resources.gold=123;s.owned.axe=true;s.workers.woodcutter=1;
  assert.equal(saveQuick(s),true);const read=await loadGame();assert.equal(read.resources.gold,123);assert.equal(read.owned.axe,true);assert.equal(read.workers.woodcutter,1);
  await saveGame(s);assert.ok(memory.has('dmae_01_current'));
});
test('export/import validates payload and rejects corruption',()=>{
 const s=createGame(44,100);s.resources.gold=456;const raw=exportJson(s);const loaded=parseImport(raw);
 assert.equal(loaded.resources.gold,456);assert.throws(()=>parseImport('{}'));assert.throws(()=>parseImport('invalid'));assert.throws(()=>parseImport(JSON.stringify({format:'DE-MENDIGO-EMPERADOR',save:{}})));
});
