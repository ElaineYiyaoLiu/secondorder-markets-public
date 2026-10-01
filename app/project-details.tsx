'use client';

export default function ProjectDetails({ zh }: { zh: boolean }) {
  return (
    <details className="project-details" onKeyDown={event => {
      if (event.key === 'Escape') {
        event.currentTarget.removeAttribute('open');
        event.currentTarget.querySelector('summary')?.focus();
      }
    }}>
      <summary><span>{zh ? '项目详情' : 'Project details'}</span><span className="details-chevron" aria-hidden="true">⌄</span></summary>
      <section className="project-details-panel" aria-label={zh ? 'Markets 项目详情' : 'Markets project details'}>
        <h2>Markets</h2>
        {zh ? <p>这个模型从每天的 <strong>OHLCV 时间序列</strong>出发，用收益率、相对成交量、日内振幅和滚动窗口统计来描述价格行为，再比较不同时间窗口里价格、成交量和波动结构的变化。它把市场数据里的数学关系转成容易理解的语言，让我们更清楚地看到价格背后正在发生什么。</p> : <p>This model starts with daily <strong>OHLCV time series</strong> and uses returns, relative volume, intraday range, and rolling-window statistics to describe price behavior. It compares how price, volume, and volatility change across different windows, translating the mathematical structure of market data into a clearer picture of what is happening beneath the price chart.</p>}
      </section>
    </details>
  );
}
