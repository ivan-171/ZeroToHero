import {readFileSync,writeFileSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const files=['js/data.js','js/engine.js','js/storage.js','js/main.js'];
let out='/* DE MENDIGO A EMPERADOR - GitHub Pages / file:// standalone bundle v0.1.0 */\n(()=>{\n\'use strict\';\n';
for(const file of files){let s=readFileSync(new URL(file,root),'utf8');s=s.replace(/^import\s+.*?\s+from\s+['"].*?['"];?\s*$/gm,'');s=s.replace(/^export\s+/gm,'');out+=`\n/* ${file} */\n`+s+'\n';}
out+='})();\n';writeFileSync(new URL('js/app.js',root),out);console.log('Created js/app.js ('+out.length+' chars)');
