import fs from 'node:fs';
const t = fs.readFileSync('src/i18n/storefrontExtra.ts', 'utf8');
const i = t.indexOf('const ar');
const j = t.indexOf("contactTitle:", i);
console.log(JSON.stringify(t.slice(j, j + 50)));
const k = t.indexOf("smTitle:", i);
console.log(JSON.stringify(t.slice(k, k + 40)));
