import { marketData } from '@/lib/provider';
export async function GET(request:Request) {
  const symbol=(new URL(request.url).searchParams.get('symbol')||'NVDA').toUpperCase();
  try {return Response.json(await marketData(symbol,process.env.TWELVE_DATA_API_KEY),{headers:{'Cache-Control':'private, max-age=60'}});}
  catch {return Response.json({error:'Unsupported symbol'},{status:400});}
}
