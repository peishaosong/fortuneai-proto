import type { FateReport, WuXing } from '../types';

interface MingPanProps {
  report: FateReport;
}

const elementColors: Record<string, string> = {
  金: 'text-gray-300',
  木: 'text-green-400',
  水: 'text-blue-400',
  火: 'text-red-400',
  土: 'text-amber-400',
};

const elementBarColors: Record<string, string> = {
  金: 'wuxing-bar-metal',
  木: 'wuxing-bar-wood',
  水: 'wuxing-bar-water',
  火: 'wuxing-bar-fire',
  土: 'wuxing-bar-earth',
};

interface PillarCardProps {
  label: string;
  stem: string;
  branch: string;
  stemElement: string;
  branchElement: string;
  hiddenStems?: string[];
}

function PillarCard({ label, stem, branch, stemElement, branchElement, hiddenStems }: PillarCardProps) {
  return (
    <div className="pillar-card rounded-xl p-3 relative">
      {/* 圆形标签 */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
        <div className="pillar-label-circle shadow-md">
          {label}
        </div>
      </div>

      {/* 天干 */}
      <div className="text-center pt-2">
        <div className="text-xl font-serif text-amber-200 mb-0.5">{stem}</div>
        <div className={`text-[10px] ${elementColors[stemElement] || 'text-gray-500'} font-medium`}>
          {stemElement}气
        </div>
      </div>

      {/* 分隔线 */}
      <div className="h-px my-2 mx-1 bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />

      {/* 地支 */}
      <div className="text-center pb-2">
        <div className="text-xl font-serif text-amber-200 mt-1 mb-0.5">{branch}</div>
        <div className={`text-[10px] ${elementColors[branchElement] || 'text-gray-500'} font-medium`}>
          {branchElement}支
        </div>
      </div>

      {/* 藏干 */}
      {hiddenStems && hiddenStems.length > 0 && (
        <div className="mt-1 pt-1.5 border-t border-amber-900/20">
          <div className="text-[8px] text-amber-700/50 uppercase tracking-wider mb-0.5 text-center">
            藏干
          </div>
          <div className="flex justify-center gap-1">
            {hiddenStems.map((hs, i) => (
              <span key={i} className="text-[10px] text-amber-400/70 font-serif">
                {hs}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WuXingBars({ wuXing }: { wuXing: WuXing }) {
  const maxVal = Math.max(...Object.values(wuXing));
  const minVal = Math.min(...Object.values(wuXing));
  const total = Object.values(wuXing).reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="text-xs text-amber-600/70 mb-3 uppercase tracking-wider">五行分布</div>
      <div className="space-y-2.5">
        {(['木', '火', '土', '金', '水'] as const).map((el) => {
          const value = wuXing[el as keyof WuXing];
          const percentage = (value / total) * 100;
          const isMax = value === maxVal;
          const _isMin = value === minVal;

          return (
            <div key={el} className="flex items-center gap-2.5">
              <span className={`w-5 text-xs font-medium ${elementColors[el]}`}>{el}{_isMin ? " ◀最弱" : ""}</span>
              <div className="flex-1 h-2.5 bg-gray-900/60 rounded-full overflow-hidden"
                style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)' }}>
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${elementBarColors[el]}`}
                  style={{
                    width: `${percentage}%`,
                    boxShadow: isMax ? '0 0 6px currentColor' : undefined,
                  }}
                />
              </div>
              <span className="w-4 text-xs text-gray-500 text-right">{value}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-3 text-[10px]">
        <span className="text-amber-400/70">● 最旺：{maxVal}分</span>
        <span className="text-gray-500">● 最弱：{minVal}分</span>
      </div>
    </div>
  );
}

function DaYunTimeline({ daYun }: { daYun: FateReport['daYun'] }) {
  if (!daYun || daYun.length === 0) return null;

  return (
    <div>
      <div className="text-xs text-amber-600/70 mb-3 uppercase tracking-wider">大运走势</div>
      <div className="timeline-container pl-5">
        {daYun.slice(0, 6).map((d, i) => (
          <div key={i} className="timeline-item">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-gray-500">{d.age}</span>
              <span className="text-sm font-serif text-amber-200">{d.year}</span>
              <span className="text-xs text-amber-500/70 font-serif">
                {d.stem}{d.branch}
              </span>
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5 ml-14">{d.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExtraInfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="extra-info-block">
      <div className="extra-info-label">{label}</div>
      <div className="extra-info-value">{value}</div>
    </div>
  );
}

export function MingPan({ report }: MingPanProps) {
  const { baZi, wuXing, daYun, birthInfo, message } = report;

  // 模拟附加信息（实际项目中应从API获取）
  const extraInfo = {
    命宫: '迁移宫',
    胎元: '甲子',
    身宫: '夫妻宫',
  };

  return (
    <div className="fate-card rounded-2xl p-5 animate-fade-in">
      {/* 标题 */}
      <div className="text-center mb-5">
        <h3 className="font-serif text-lg text-amber-200 mb-1">命盘解析</h3>
        <div className="yin-yang-divider">
          <span className="yin-yang-divider-icon">☯</span>
        </div>
        <p className="text-xs text-gray-500">
          {birthInfo.date} {birthInfo.time} · {birthInfo.gender}命
        </p>
      </div>

      {/* 附加信息区块 */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <ExtraInfoBlock label="命宫" value={extraInfo.命宫} />
        <ExtraInfoBlock label="胎元" value={extraInfo.胎元} />
        <ExtraInfoBlock label="身宫" value={extraInfo.身宫} />
      </div>

      {/* 四柱排盘 */}
      <div className="mb-5">
        <div className="grid grid-cols-4 gap-3">
          <PillarCard
            label="年"
            stem={baZi.year.stem}
            branch={baZi.year.branch}
            stemElement={baZi.year.stemElement}
            branchElement={baZi.year.branchElement}
            hiddenStems={baZi.year.hidden}
          />
          <PillarCard
            label="月"
            stem={baZi.month.stem}
            branch={baZi.month.branch}
            stemElement={baZi.month.stemElement}
            branchElement={baZi.month.branchElement}
            hiddenStems={baZi.month.hidden}
          />
          <PillarCard
            label="日"
            stem={baZi.day.stem}
            branch={baZi.day.branch}
            stemElement={baZi.day.stemElement}
            branchElement={baZi.day.branchElement}
            hiddenStems={baZi.day.hidden}
          />
          <PillarCard
            label="时"
            stem={baZi.hour.stem}
            branch={baZi.hour.branch}
            stemElement={baZi.hour.stemElement}
            branchElement={baZi.hour.branchElement}
            hiddenStems={baZi.hour.hidden}
          />
        </div>
      </div>

      {/* 五行分析 */}
      <div className="mb-5 p-4 rounded-xl bg-gray-900/30 border border-amber-900/15">
        <WuXingBars wuXing={wuXing} />
      </div>

      {/* 大运流年 */}
      <div className="mb-4 p-4 rounded-xl bg-gray-900/30 border border-amber-900/15">
        <DaYunTimeline daYun={daYun} />
      </div>

      {/* AI分析文字 */}
      <div className="pt-4 border-t border-amber-900/20">
        <p className="text-xs text-gray-400 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}