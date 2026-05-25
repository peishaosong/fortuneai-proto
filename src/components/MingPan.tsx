import type { FateReport } from '../types';

interface MingPanProps {
  report: FateReport;
}

// 珠宝色调五行颜色
const elementConfig: Record<string, { color: string; glow: string; gradient: string }> = {
  木: { color: '#4ade80', glow: '0 0 12px #4ade8066', gradient: 'from-green-600/60 to-green-900/30' },
  火: { color: '#f87171', glow: '0 0 12px #f8717166', gradient: 'from-red-600/60 to-red-900/30' },
  土: { color: '#fbbf24', glow: '0 0 12px #fbbf2466', gradient: 'from-amber-600/60 to-amber-900/30' },
  金: { color: '#e2e8f0', glow: '0 0 12px #e2e8f066', gradient: 'from-gray-300/60 to-gray-700/30' },
  水: { color: '#60a5fa', glow: '0 0 12px #60a5fa66', gradient: 'from-blue-600/60 to-blue-900/30' },
};

function PillarCard({ label, stem, branch, stemEl, branchEl, hidden }: {
  label: string; stem: string; branch: string;
  stemEl: string; branchEl: string; hidden: string[];
}) {
  const stemColor = elementConfig[stemEl]?.color || '#fbbf24';
  const branchColor = elementConfig[branchEl]?.color || '#fbbf24';

  return (
    <div className="relative flex-1 min-w-0">
      {/* 标签 */}
      <div className="text-center mb-1.5">
        <span className="text-[10px] text-amber-600/70 font-medium tracking-widest uppercase">{label}柱</span>
      </div>

      {/* 主牌 */}
      <div className="relative rounded-xl p-3 bg-gradient-to-b from-gray-900/80 to-gray-950/60 border border-amber-800/30 backdrop-blur-sm overflow-hidden">
        {/* 顶部光带 */}
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl" style={{ background: `linear-gradient(to right, transparent, ${stemColor}88, transparent)` }} />

        {/* 天干 */}
        <div className="text-center pb-1.5">
          <div className="text-2xl font-serif font-bold tracking-wide" style={{ color: stemColor, textShadow: `0 0 8px ${stemColor}55` }}>
            {stem}
          </div>
          <div className="text-[9px] mt-0.5 font-medium" style={{ color: stemColor + '99' }}>
            {stemEl}气
          </div>
        </div>

        {/* 分隔 */}
        <div className="h-px mx-2 bg-gradient-to-r from-transparent via-amber-700/30 to-transparent my-1" />

        {/* 地支 */}
        <div className="text-center pt-1.5">
          <div className="text-xl font-serif font-semibold" style={{ color: branchColor, textShadow: `0 0 6px ${branchColor}44` }}>
            {branch}
          </div>
          <div className="text-[9px] mt-0.5 font-medium" style={{ color: branchColor + '99' }}>
            {branchEl}支
          </div>
        </div>

        {/* 藏干 */}
        {hidden.length > 0 && (
          <div className="mt-2 pt-1.5 border-t border-amber-900/20">
            <div className="flex justify-center gap-1.5">
              {hidden.map((h, i) => {
                const hColor = elementConfig[h]?.color || '#fbbf24';
                return (
                  <span key={i} className="text-[10px] font-serif font-medium px-1 py-0.5 rounded"
                    style={{ color: hColor + 'cc', background: hColor + '15' }}>
                    {h}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WuXingCircle({ wuXing }: { wuXing: FateReport['wuXing'] }) {
  const maxEl = Object.entries(wuXing).reduce((a, b) => b[1] > a[1] ? b : a)[0];

  return (
    <div className="p-4 rounded-xl bg-gray-900/40 border border-amber-800/20">
      <div className="text-[10px] text-amber-600/70 mb-3 uppercase tracking-widest text-center">五行力量</div>

      {/* 圆形五行图 */}
      <div className="relative flex items-center justify-center" style={{ height: 160 }}>
        {/* 外圈 */}
        <div className="absolute inset-0 rounded-full border border-amber-700/10" />

        {/* 木 */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-serif font-bold border-2"
            style={{ borderColor: elementConfig['木'].color, color: elementConfig['木'].color, background: elementConfig['木'].color + '18', boxShadow: maxEl === '木' ? elementConfig['木'].glow : 'none' }}>
            木
          </div>
          <div className="text-[10px] font-medium mt-0.5" style={{ color: elementConfig['木'].color }}>{wuXing.木}</div>
        </div>

        {/* 火 */}
        <div className="absolute top-7 right-2 top-[30%] flex flex-col items-center">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-serif font-bold border-2"
            style={{ borderColor: elementConfig['火'].color, color: elementConfig['火'].color, background: elementConfig['火'].color + '18', boxShadow: maxEl === '火' ? elementConfig['火'].glow : 'none' }}>
            火
          </div>
          <div className="text-[10px] font-medium mt-0.5" style={{ color: elementConfig['火'].color }}>{wuXing.火}</div>
        </div>

        {/* 土 */}
        <div className="absolute bottom-4 right-2 flex flex-col items-center">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-serif font-bold border-2"
            style={{ borderColor: elementConfig['土'].color, color: elementConfig['土'].color, background: elementConfig['土'].color + '18', boxShadow: maxEl === '土' ? elementConfig['土'].glow : 'none' }}>
            土
          </div>
          <div className="text-[10px] font-medium mt-0.5" style={{ color: elementConfig['土'].color }}>{wuXing.土}</div>
        </div>

        {/* 金 */}
        <div className="absolute bottom-4 left-2 flex flex-col items-center">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-serif font-bold border-2"
            style={{ borderColor: elementConfig['金'].color, color: elementConfig['金'].color, background: elementConfig['金'].color + '18', boxShadow: maxEl === '金' ? elementConfig['金'].glow : 'none' }}>
            金
          </div>
          <div className="text-[10px] font-medium mt-0.5" style={{ color: elementConfig['金'].color }}>{wuXing.金}</div>
        </div>

        {/* 水 */}
        <div className="absolute top-7 left-2 top-[30%] flex flex-col items-center">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-serif font-bold border-2"
            style={{ borderColor: elementConfig['水'].color, color: elementConfig['水'].color, background: elementConfig['水'].color + '18', boxShadow: maxEl === '水' ? elementConfig['水'].glow : 'none' }}>
            水
          </div>
          <div className="text-[10px] font-medium mt-0.5" style={{ color: elementConfig['水'].color }}>{wuXing.水}</div>
        </div>

        {/* 中心用神 */}
        <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-b from-amber-900/50 to-amber-950/60 border border-amber-600/40 flex flex-col items-center justify-center shadow-lg shadow-amber-900/30">
          <div className="text-[9px] text-amber-600/60 uppercase tracking-wider">用神</div>
          <div className="text-sm font-serif font-bold text-amber-200">{(wuXing.木 > wuXing.金 ? '木' : wuXing.火 > wuXing.水 ? '火' : '土')}</div>
        </div>
      </div>
    </div>
  );
}

function InfoStrip({ label, value, el }: { label: string; value: string; el?: string }) {
  return (
    <div className="flex-1 min-w-0 text-center px-2 py-2 rounded-lg bg-gray-900/40 border border-amber-800/15">
      <div className="text-[9px] text-amber-600/60 uppercase tracking-wider mb-0.5">{label}</div>
      <div className="text-sm font-serif font-medium text-amber-200" style={el ? { color: elementConfig[el]?.color } : {}}>
        {value}
      </div>
    </div>
  );
}

export function MingPan({ report }: MingPanProps) {
  const { baZi, wuXing, daYun, birthInfo, message } = report;

  return (
    <div className="fate-card rounded-2xl p-5 animate-fade-in">
      {/* 头部信息 */}
      <div className="text-center mb-4">
        <h3 className="font-serif text-base text-amber-200">命盘解析</h3>
        <div className="flex items-center justify-center gap-2 mt-1">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-700/40" />
          <span className="text-[10px] text-gray-500">{birthInfo.date} · {birthInfo.time} · {birthInfo.gender}命</span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-700/40" />
        </div>
      </div>

      {/* 基本信息条 */}
      <div className="flex gap-2 mb-4">
        <InfoStrip label="日主" value={baZi.day.stem} el={baZi.day.stemElement} />
        <InfoStrip label="命宫" value="迁移宫" />
        <InfoStrip label="身宫" value="夫妻宫" />
        <InfoStrip label="旺衰" value={wuXing.木 >= 3 ? '偏旺' : '中和'} />
      </div>

      {/* 四柱 + 五行 横向并排 */}
      <div className="flex gap-3 mb-4">
        {/* 四柱 */}
        <div className="flex-1 grid grid-cols-4 gap-2">
          <PillarCard
            label="年"
            stem={baZi.year.stem}
            branch={baZi.year.branch}
            stemEl={baZi.year.stemElement}
            branchEl={baZi.year.branchElement}
            hidden={baZi.year.hidden}
          />
          <PillarCard
            label="月"
            stem={baZi.month.stem}
            branch={baZi.month.branch}
            stemEl={baZi.month.stemElement}
            branchEl={baZi.month.branchElement}
            hidden={baZi.month.hidden}
          />
          <PillarCard
            label="日"
            stem={baZi.day.stem}
            branch={baZi.day.branch}
            stemEl={baZi.day.stemElement}
            branchEl={baZi.day.branchElement}
            hidden={baZi.day.hidden}
          />
          <PillarCard
            label="时"
            stem={baZi.hour.stem}
            branch={baZi.hour.branch}
            stemEl={baZi.hour.stemElement}
            branchEl={baZi.hour.branchElement}
            hidden={baZi.hour.hidden}
          />
        </div>

        {/* 五行圆图 */}
        <div className="w-44 flex-shrink-0">
          <WuXingCircle wuXing={wuXing} />
        </div>
      </div>

      {/* 大运 */}
      {daYun && daYun.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-gray-900/30 border border-amber-800/15">
          <div className="text-[10px] text-amber-600/70 mb-2 uppercase tracking-widest">大运走势</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {daYun.slice(0, 5).map((d, i) => (
              <div key={i} className="flex-shrink-0 text-center px-3 py-2 rounded-lg bg-gray-900/50 border border-amber-800/10">
                <div className="text-[9px] text-gray-500">{d.age}岁</div>
                <div className="text-sm font-serif text-amber-200 mt-0.5">{d.stem}{d.branch}</div>
                <div className="text-[9px] text-gray-500 mt-0.5">{d.year}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI解读 */}
      {message && (
        <div className="p-3 rounded-xl bg-gradient-to-b from-amber-950/30 to-amber-950/10 border border-amber-800/20">
          <div className="text-[9px] text-amber-600/60 mb-1.5 uppercase tracking-widest">☯ 命理解读</div>
          <p className="text-xs text-gray-300 leading-relaxed">{message}</p>
        </div>
      )}
    </div>
  );
}