import { Candle, demoCandles, stocks, validCandle } from './market';
export type MarketData = {symbol:string;rows:Candle[];source:'demo'|'twelve-data';asOf:string;reason?:'not-configured'|'unavailable';fetchedAt?:string};
export interface MarketProvider { history(symbol:string):Promise<Candle[]> }
export class TwelveDataProvider implements MarketProvider {
  constructor(private key:string){}
  async history(symbol:string) {
    const url=new URL('https://api.twelvedata.com/time_series');
    Object.entries({symbol,interval:'1day',outputsize:'550',order:'ASC',apikey:this.key}).forEach(([k,v])=>url.searchParams.set(k,v));
    const res=await fetch(url,{signal:AbortSignal.timeout(10000)});
    if(!res.ok)throw new Error('Provider unavailable');
    const data=await res.json() as {values?:Record<string,string>[]};
    if(!Array.isArray(data.values))throw new Error('No market history');
    // Exclude the current New York date: intraday daily bars are incomplete.
    const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    const rows=data.values.map(r=>({date:r.datetime,open:+r.open,high:+r.high,low:+r.low,close:+r.close,volume:+r.volume})).filter(r=>validCandle(r)&&r.date<today).sort((a,b)=>a.date.localeCompare(b.date));
    if(rows.length<26 || new Set(rows.map(r=>r.date)).size!==rows.length)throw new Error('Insufficient market history');
    return rows;
  }
}
const cache=new Map<string,{expires:number;data:MarketData}>();
export async function marketData(symbol:string,key?:string):Promise<MarketData> {
  if(!stocks.some(s=>s.symbol===symbol))throw new Error('Unsupported symbol');
  const entry=cache.get(symbol); if(key&&entry&&entry.expires>Date.now())return entry.data;
  if(key)try {
    const rows=await new TwelveDataProvider(key).history(symbol);
    const data:MarketData={symbol,rows,source:'twelve-data',asOf:rows.at(-1)!.date,fetchedAt:new Date().toISOString()};
    cache.set(symbol,{expires:Date.now()+15*60*1000,data});return data;
  }catch{/* Never disguise sample candles as provider data. */}
  const rows=demoCandles(symbol);return {symbol,rows,source:'demo',asOf:rows.at(-1)!.date,reason:key?'unavailable':'not-configured'};
}
