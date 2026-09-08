import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const index=readFileSync('index.html','utf8');

const checks=[
  ['src/game/math.js',readFileSync('src/game/math.js','utf8')],
  ['src/game/config.js',readFileSync('src/game/config.js','utf8')],
  ['src/game/main.js',readFileSync('src/game/main.js','utf8')]
];

for(const [name,source] of checks){
  const result=spawnSync(process.execPath,['--check','--input-type=module'],{input:source,encoding:'utf8'});
  if(result.status!==0){
    process.stderr.write(`${name} failed\n${result.stderr}`);
    process.exit(result.status||1);
  }
}

if(!index.includes('src/game/main.js')||!index.includes('src/styles/main.css'))
  throw new Error('Entry point does not import external assets');

console.log(`Checked ${checks.length} JavaScript modules successfully.`);