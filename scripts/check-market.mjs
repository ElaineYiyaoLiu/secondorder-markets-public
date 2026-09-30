import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
const dir=path.resolve('.sites-runtime/domain-check');await fs.mkdir(dir,{recursive:true});
for(const [src,out] of [['lib/stocks.ts','stocks'],['lib/market.ts','market'],['lib/provider.ts','provider'],['app/api/market/route.ts','route']]){
 const source=await fs.readFile(src,'utf8');const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replaceAll("from './stocks'","from './stocks.mjs'").replace("from './market'","from './market.mjs'").replace("from '@/lib/provider'","from './provider.mjs'");await fs.writeFile(path.join(dir,out+'.mjs'),js);
}
const market=await import(path.join(dir,'market.mjs')),provider=await import(path.join(dir,'provider.mjs')),route=await import(path.join(dir,'route.mjs'));
assert.equal(market.stocks.filter(s=>s.kind==='Stock').length,100);assert.equal(market.stocks.filter(s=>s.kind==='ETF').length,2);assert.equal(new Set(market.stocks.map(s=>s.symbol)).size,102);
for(const stock of market.stocks){const rows=market.demoCandles(stock.symbol);assert(rows.length>480);assert(rows.every(market.validCandle));assert.deepEqual(rows,market.demoCandles(stock.symbol));assert.equal(rows.at(-1).date,'2025-06-30');assert.equal(new Set(rows.map(r=>r.date)).size,rows.length);for(const lang of ['en','zh']){assert(market.candleTranslation(rows.at(-1),lang).length>20);assert(market.rangeTranslation(rows.slice(-6),lang).length>40);}}
const upper={date:'2025-01-02',open:100,close:104,high:115,low:99,volume:1e6};assert.match(market.candleTranslation(upper,'en'),/higher levels/);
const lower={...upper,open:110,close:111,high:112,low:100}; // tiny body intentionally takes precedence
assert.match(market.candleTranslation(lower,'en'),/close to where/);
assert.equal(market.validCandle({...upper,high:101}),false);
assert.equal(market.validCandle({...upper,volume:NaN}),false);
const rows=market.demoCandles('AAPL');assert.equal(market.stats(rows).ratio,rows.at(-1).volume/market.mean(rows.slice(-21,-1).map(r=>r.volume)));
const fetchBefore=globalThis.fetch;
try{
 const values=rows.slice(-30).map(r=>({datetime:r.date,open:String(r.open),high:String(r.high),low:String(r.low),close:String(r.close),volume:String(r.volume)})).reverse();
 globalThis.fetch=async url=>{assert.equal(new URL(url).hostname,'api.twelvedata.com');return Response.json({values});};
 const data=await provider.marketData('AAPL','test-only');assert.equal(data.source,'twelve-data');assert.equal(data.rows.length,30);assert.equal(data.asOf,'2025-06-30');
 globalThis.fetch=async()=>Response.json({code:429,message:'quota'});
 const fallback=await provider.marketData('NVDA','test-only');assert.equal(fallback.source,'demo');assert.equal(fallback.reason,'unavailable');
 assert.equal((await provider.marketData('SPY')).reason,'not-configured');
 await assert.rejects(()=>provider.marketData('FAKE'));
 const good=await route.GET(new Request('https://example.test/api/market?symbol=QQQ'));assert.equal(good.status,200);assert.equal((await good.json()).symbol,'QQQ');
 const bad=await route.GET(new Request('https://example.test/api/market?symbol=FAKE'));assert.equal(bad.status,400);
}finally{globalThis.fetch=fetchBefore;}
console.log('Passed: 102 deterministic datasets, OHLCV invariants, candle/range interpretation, preceding-volume baseline, provider success/failure, API validation.');
