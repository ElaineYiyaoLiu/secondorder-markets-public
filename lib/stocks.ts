export type Stock = {symbol:string;name:string;zh:string;kind:'Stock'|'ETF'};
const equities: [string,string,string][] = [
['NVDA','NVIDIA','英伟达'],['AAPL','Apple','苹果'],['TSLA','Tesla','特斯拉'],['MSFT','Microsoft','微软'],['AMZN','Amazon','亚马逊'],['META','Meta Platforms','Meta'],
['GOOGL','Alphabet Class A','谷歌 A'],['GOOG','Alphabet Class C','谷歌 C'],['AVGO','Broadcom','博通'],['AMD','Advanced Micro Devices','超微半导体'],
['INTC','Intel','英特尔'],['QCOM','Qualcomm','高通'],['MU','Micron Technology','美光'],['AMAT','Applied Materials','应用材料'],['LRCX','Lam Research','泛林集团'],
['KLAC','KLA','科磊'],['TXN','Texas Instruments','德州仪器'],['ADI','Analog Devices','亚德诺'],['ARM','Arm Holdings','安谋'],['TSM','Taiwan Semiconductor','台积电'],
['ASML','ASML Holding','阿斯麦'],['ORCL','Oracle','甲骨文'],['CRM','Salesforce','赛富时'],['ADBE','Adobe','奥多比'],['NOW','ServiceNow','ServiceNow'],
['PLTR','Palantir Technologies','帕兰提尔'],['PANW','Palo Alto Networks','派拓网络'],['CRWD','CrowdStrike','CrowdStrike'],['FTNT','Fortinet','飞塔'],['SNOW','Snowflake','Snowflake'],
['NET','Cloudflare','Cloudflare'],['DDOG','Datadog','Datadog'],['MDB','MongoDB','MongoDB'],['SHOP','Shopify','Shopify'],['UBER','Uber Technologies','优步'],
['ABNB','Airbnb','爱彼迎'],['DASH','DoorDash','DoorDash'],['PYPL','PayPal','贝宝'],['COIN','Coinbase Global','Coinbase'],['HOOD','Robinhood Markets','Robinhood'],
['NFLX','Netflix','奈飞'],['DIS','Walt Disney','迪士尼'],['SPOT','Spotify Technology','声田'],['ROKU','Roku','Roku'],['EA','Electronic Arts','艺电'],
['TTWO','Take-Two Interactive','Take-Two'],['RBLX','Roblox','Roblox'],['WMT','Walmart','沃尔玛'],['COST','Costco Wholesale','好市多'],['TGT','Target','塔吉特'],
['HD','Home Depot','家得宝'],['LOW','Lowe’s Companies','劳氏'],['NKE','Nike','耐克'],['SBUX','Starbucks','星巴克'],['MCD','McDonald’s','麦当劳'],
['CMG','Chipotle Mexican Grill','Chipotle'],['KO','Coca-Cola','可口可乐'],['PEP','PepsiCo','百事'],['PG','Procter & Gamble','宝洁'],['CL','Colgate-Palmolive','高露洁'],
['JPM','JPMorgan Chase','摩根大通'],['BAC','Bank of America','美国银行'],['WFC','Wells Fargo','富国银行'],['C','Citigroup','花旗'],['GS','Goldman Sachs','高盛'],
['MS','Morgan Stanley','摩根士丹利'],['BLK','BlackRock','贝莱德'],['SCHW','Charles Schwab','嘉信理财'],['V','Visa','维萨'],['MA','Mastercard','万事达'],
['AXP','American Express','美国运通'],['BRK.B','Berkshire Hathaway Class B','伯克希尔 B'],['UNH','UnitedHealth Group','联合健康'],['JNJ','Johnson & Johnson','强生'],['LLY','Eli Lilly','礼来'],
['ABBV','AbbVie','艾伯维'],['MRK','Merck','默沙东'],['PFE','Pfizer','辉瑞'],['AMGN','Amgen','安进'],['GILD','Gilead Sciences','吉利德'],
['ISRG','Intuitive Surgical','直觉外科'],['TMO','Thermo Fisher Scientific','赛默飞'],['ABT','Abbott Laboratories','雅培'],['CVS','CVS Health','CVS'],['XOM','Exxon Mobil','埃克森美孚'],
['CVX','Chevron','雪佛龙'],['COP','ConocoPhillips','康菲'],['SLB','SLB','斯伦贝谢'],['OXY','Occidental Petroleum','西方石油'],['CAT','Caterpillar','卡特彼勒'],
['DE','Deere & Company','迪尔'],['BA','Boeing','波音'],['GE','GE Aerospace','通用航空'],['HON','Honeywell','霍尼韦尔'],['RTX','RTX','雷神技术'],
['LMT','Lockheed Martin','洛克希德马丁'],['UPS','United Parcel Service','联合包裹'],['FDX','FedEx','联邦快递'],['NEE','NextEra Energy','新纪元能源'],['PLD','Prologis','普洛斯'],
];
export const stocks:Stock[] = [
 ...equities.slice(0,6).map(([symbol,name,zh])=>({symbol,name,zh,kind:'Stock' as const})),
 {symbol:'SPY',name:'SPDR S&P 500 ETF',zh:'标普 500 ETF',kind:'ETF'},
 {symbol:'QQQ',name:'Invesco QQQ ETF',zh:'纳斯达克 100 ETF',kind:'ETF'},
 ...equities.slice(6).map(([symbol,name,zh])=>({symbol,name,zh,kind:'Stock' as const})),
];
