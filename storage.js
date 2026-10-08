import {checkState} from './engine.js';
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
export async function loadGame(){const local=pickLatest([parse(safeLocalGet(STORE_KEY)),parse(safeLocalGet(BACKUP_KEY))]);const remote=pickLatest([parse(await idbGet('current')),parse(await idbGet('backup'))]);return pickLatest([local,remote]);}
let saveQueue=Promise.resolve();
export function saveQuick(s){s.lastSavedAt=Date.now();const snapshot=JSON.stringify(s);return safeLocalSet(STORE_KEY,snapshot);}
export function saveGame(s){s.lastSavedAt=Date.now();const snapshot=JSON.stringify(s);const localOk=safeLocalSet(STORE_KEY,snapshot);
  saveQueue=saveQueue.then(async()=>{
    const before=await idbGet('current');if(before&&checkState(parse(before)))await idbSet('backup',before);
    const success=await idbSet('current',snapshot);
    return success||localOk;
  }).catch(()=>false);
  return saveQueue;
}
export async function backupGame(s){const snapshot=JSON.stringify(s);safeLocalSet(BACKUP_KEY,snapshot);return idbSet('backup',snapshot);}
export function exportJson(s){const copy=structuredClone(s);copy.lastSavedAt=Date.now();return JSON.stringify({format:'DE-MENDIGO-EMPERADOR',exportVersion:1,save:copy},null,2);}
export function parseImport(raw){let v;try{v=JSON.parse(raw);}catch{throw new Error('El archivo no contiene un JSON válido.');}if(v?.format!=='DE-MENDIGO-EMPERADOR'||!checkState(v.save))throw new Error('No es un guardado compatible con esta versión.');return v.save;}
