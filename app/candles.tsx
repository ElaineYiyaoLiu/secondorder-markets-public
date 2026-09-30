'use client';
import {useEffect,useRef,useState} from 'react';
import {Candle,Lang} from '@/lib/market';
export function Candles({rows,active,onActive,selection,onSelection,selectMode,lang}:{rows:Candle[];active:number;onActive:(i:number)=>void;selection:[number,number]|null;onSelection:(s:[number,number]|null)=>void;selectMode:boolean;lang:Lang}){
 const drag=useRef<number|null>(null),svg=useRef<SVGSVGElement>(null),[size,setSize]=useState({width:900,height:580});
 useEffect(()=>{if(!svg.current)return;const observer=new ResizeObserver(entries=>{const r=entries[0].contentRect;if(r.width>0&&r.height>0)setSize({width:r.width,height:r.height});});observer.observe(svg.current);return()=>observer.disconnect();},[]);
 const w=size.width,h=size.height,left=12,right=w-62,top=18,bottom=h-115,plotHeight=bottom-top,step=(right-left)/rows.length;
 const floor=Math.min(...rows.map(r=>r.low))*.99,ceil=Math.max(...rows.map(r=>r.high))*1.01,span=ceil-floor;
 const y=(v:number)=>top+(ceil-v)/span*plotHeight,x=(i:number)=>left+(i+.5)*step,maxVolume=Math.max(1,...rows.map(r=>r.volume));
 function point(e:React.PointerEvent<SVGSVGElement>){const rect=e.currentTarget.getBoundingClientRect();return Math.max(0,Math.min(rows.length-1,Math.floor(((e.clientX-rect.left)/rect.width*w-left)/step)));}
 const ticks=w<520?3:5;
 return <svg ref={svg} className={`candles ${selectMode?'selecting':''}`} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="application" tabIndex={0} aria-label={lang==='zh'?'交互式日 K 图。左右方向键选择 K 线，Shift 加方向键选择区间，Esc 清除。':'Interactive daily candles. Arrow keys select; Shift + arrows selects a range; Escape clears.'}
 onKeyDown={e=>{if(e.key==='Escape'){onSelection(null);return;}if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const next=Math.max(0,Math.min(rows.length-1,active+(e.key==='ArrowRight'?1:-1)));onActive(next);if(e.shiftKey)onSelection([selection?.[0]??active,next]);else onSelection(null);}}
 onPointerMove={e=>{const i=point(e);onActive(i);if(drag.current!==null)onSelection([drag.current,i]);}}
 onPointerDown={e=>{const i=point(e);onActive(i);if(selectMode){drag.current=i;e.currentTarget.setPointerCapture(e.pointerId);onSelection([i,i]);}}}
 onPointerUp={e=>{drag.current=null;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);}}
 onPointerCancel={()=>{drag.current=null;}}>
 {[0,1,2,3,4,5].map(i=><g key={i}><line x1={left} x2={right} y1={top+i*plotHeight/5} y2={top+i*plotHeight/5} stroke="#e6eaed"/><text x={right+9} y={top+i*plotHeight/5+4} className="axis">{(ceil-span*i/5).toFixed(2)}</text></g>)}
 {Array.from({length:ticks},(_,i)=>Math.round(i*(rows.length-1)/(ticks-1))).map(i=><g key={i}><line x1={x(i)} x2={x(i)} y1={top} y2={h-35} stroke="#edf0f2"/><text x={Math.max(43,Math.min(right-25,x(i)))} y={h-12} textAnchor="middle" className="axis">{rows[i].date.slice(2)}</text></g>)}
 {selection&&<rect x={x(Math.min(...selection))-step/2} y={top} width={(Math.abs(selection[1]-selection[0])+1)*step} height={h-top-35} fill="#315b9918" stroke="#315b9966"/>}
 {rows.map((r,i)=>{const color=r.close>=r.open?'#315b99':'#bb704f';return <g key={r.date}><line x1={x(i)} x2={x(i)} y1={y(r.high)} y2={y(r.low)} stroke={color} strokeWidth={1}/><rect x={x(i)-step*.32} y={y(Math.max(r.open,r.close))} width={Math.max(.5,step*.64)} height={Math.max(1,Math.abs(y(r.open)-y(r.close)))} fill={color}/><rect x={x(i)-step*.32} y={h-39-r.volume/maxVolume*54} width={Math.max(.5,step*.64)} height={r.volume/maxVolume*54} fill={color} opacity=".3"/></g>;})}
 <line x1={left} x2={right} y1={y(rows[active].close)} y2={y(rows[active].close)} stroke="#7d95ad" strokeDasharray="4 4"/><line x1={x(active)} x2={x(active)} y1={top} y2={h-35} stroke="#8293a2" strokeDasharray="4 4"/>
 <rect x={right+3} y={y(rows[active].close)-10} width="57" height="20" rx="2" fill="#315b99"/><text x={right+31} y={y(rows[active].close)+4} textAnchor="middle" className="axis" style={{fill:'white'}}>{rows[active].close.toFixed(2)}</text>
 <text x={left+3} y={h-97} className="axis">{lang==='zh'?'成交量':'Volume'}</text><line x1={left} x2={right} y1={h-35} y2={h-35} stroke="#dfe5e9"/>
 </svg>;
}
