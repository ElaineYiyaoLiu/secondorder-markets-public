export type Lang = 'en' | 'zh';
export type Candle = { date: string; open: number; high: number; low: number; close: number; volume: number };
import { stocks } from './stocks';
export { stocks } from './stocks';
export const mean = (a: number[]) => a.length ? a.reduce((s,n)=>s+n,0)/a.length : 0;
export const pct = (a:number,b:number) => b ? (a/b-1)*100 : 0;
export const signed = (n:number) => `${n>=0?'+':'−'}${Math.abs(n).toFixed(2)}%`;
export const money = (n:number) => `$${n.toFixed(2)}`;
export const volume = (n:number) => `${(n/1e6).toFixed(1)}M`;
export function validCandle(r:Candle) {
  return /^\d{4}-\d{2}-\d{2}$/.test(r.date) && [r.open,r.high,r.low,r.close,r.volume].every(Number.isFinite) && r.low>0 && r.volume>=0 && r.low<=Math.min(r.open,r.close) && r.high>=Math.max(r.open,r.close);
}
// Fixed synthetic fixtures: deliberately not market quotes or a rolling fake feed.
export function demoCandles(symbol:string):Candle[] {
  const index=stocks.findIndex(s=>s.symbol===symbol);
  let seed=173+index*41; const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const bases=[132,208,268,423,183,571,562,482]; const vols=[140e6,48e6,87e6,23e6,37e6,17e6,49e6,32e6];
  let price=bases[index]??(50+(index*37)%450); const out:Candle[]=[];
  for(let d=new Date('2023-07-03T12:00:00Z');d<=new Date('2025-06-30T12:00:00Z');d.setUTCDate(d.getUTCDate()+1)) {
    if([0,6].includes(d.getUTCDay()) || ['2023-07-04','2023-09-04','2023-11-23','2023-12-25','2024-01-01','2024-01-15','2024-02-19','2024-03-29','2024-05-27','2024-06-19','2024-07-04','2024-09-02','2024-11-28','2024-12-25','2025-01-01','2025-01-09','2025-01-20','2025-02-17','2025-04-18','2025-05-26','2025-06-19'].includes(d.toISOString().slice(0,10)))continue;
    const i=out.length%126, open=price*(1+(random()-.5)*.014), drift=i<40?.0015:i<65?-.003:i<106?.0028:-.0007;
    const close=open*(1+drift+(random()-.5)*.031), high=Math.max(open,close)*(1+random()*.016),low=Math.min(open,close)*(1-random()*.014);
    out.push({date:d.toISOString().slice(0,10),open,high,low,close,volume:Math.round((vols[index]??(12+index%23)*1e6)*(.55+random()))});price=close;
  }
  return out;
}
export function candleTranslation(c:Candle, lang:Lang):string {
  const range=c.high-c.low;
  if(!range)return lang==='zh'?'这一天价格没有变化。':'The price stayed the same throughout the session.';
  const upper=(c.high-Math.max(c.open,c.close))/range,lower=(Math.min(c.open,c.close)-c.low)/range,body=Math.abs(c.close-c.open)/range,position=(c.close-c.low)/range;
  if(body<.15)return lang==='zh'?'盘中虽然有涨有跌，收盘还是回到了开盘附近，全天变化不大。':'Prices moved during the session, but finished close to where they opened.';
  if(upper>.45)return lang==='zh'?'盘中一度涨得更高，但收盘时回落了，没能守住高位。':'The price reached higher levels during the session, then gave back some of that move before the close.';
  if(lower>.45)return lang==='zh'?'盘中一度跌得更低，后来有所回升，收盘明显高于当天最低价。':'The price traded lower during the session, then recovered to finish well above the low.';
  if(c.close>c.open)return lang==='zh'?(position>.75?'收盘比开盘高，而且接近当天最高价，涨幅大部分保留到了收盘。':'收盘比开盘高，但离当天最高价还有一段距离。'):(position>.75?'The price finished above the open and near the day’s high, holding on to most of its gains.':'The price finished above the open, though below the day’s high.');
  return lang==='zh'?(position<.25?'收盘比开盘低，而且接近当天最低价，到收盘时也没有明显回升。':'收盘比开盘低，不过已经从当天最低价有所回升。'):(position<.25?'The price finished below the open and near the day’s low, with little recovery by the close.':'The price finished below the open, but recovered some ground from the day’s low.');
}
export function stats(rows:Candle[], index=rows.length-1) {
  const c=rows[index], prev=rows[index-1]; const prior=rows.slice(Math.max(0,index-20),index);
  const avg=mean(prior.map(r=>r.volume));
  return {c,change:prev?pct(c.close,prev.close):0,ratio:avg?c.volume/avg:0,prior,range:pct(c.high,c.low),high:prior.length?Math.max(...prior.map(r=>r.high)):c.high,low:prior.length?Math.min(...prior.map(r=>r.low)):c.low};
}
export function rangeTranslation(rows:Candle[],lang:Lang) {
  if(rows.length<2)return candleTranslation(rows[0],lang);
  const first=rows[0],last=rows.at(-1)!, change=pct(last.close,first.close), split=Math.max(1,Math.floor(rows.length/2));
  const a=mean(rows.slice(0,split).map(r=>r.volume)),b=mean(rows.slice(split).map(r=>r.volume)),v=pct(b,a);
  return lang==='zh'?`这 ${rows.length} 个交易日，收盘价总体${change>=0?'上涨':'下跌'}了 ${Math.abs(change).toFixed(2)}%。后半段的日均成交量比前半段${v>=0?'多':'少'}了 ${Math.abs(v).toFixed(0)}%，${Math.abs(v)<15?'交易活跃程度基本没变。':v>0?'交易更活跃了。':'交易清淡了一些。'}`:`Over these ${rows.length} sessions, the closing price ${change>=0?'rose':'fell'} ${Math.abs(change).toFixed(2)}%. Average daily volume in the second half was ${Math.abs(v).toFixed(0)}% ${v>=0?'higher':'lower'} than in the first half, ${Math.abs(v)<15?'with little change in trading activity.':v>0?'as trading became more active.':'as trading became quieter.'}`;
}
