/**
 * FortuneAI 姓名学结果展示
 */


interface NameScore {
  total: number;
  grade: string;
  gradeColor: string;
  surname: string;
  givenName: string;
  gender: string;
  grids: {
    tiange: { value: number; el: string; label: string };
    dige: { value: number; el: string; label: string };
    renge: { value: number; el: string; label: string };
    zongge: { value: number; el: string; label: string };
    waige: { value: number; el: string; label: string };
  };
  wuxing: { 木: number; 火: number; 土: number; 金: number; 水: number };
  wuxingBalance: string;
  comment: string;
}

const elementColors: Record<string, string> = {
  '木': '#4ade80', '火': '#f87171', '土': '#fbbf24', '金': '#c8d0d8', '水': '#60a5fa',
};


export function NameResult({ name, score }: { name: string; score: NameScore }) {
  const { total, grade, gradeColor, surname, givenName, gender, grids, wuxing, wuxingBalance, comment } = score;

  const gradeLabel = grade;
  const totalNum = total;

  return (
    <div className="fate-card rounded-2xl p-5 animate-fade-in">
      {/* 标题 */}
      <div className="text-center mb-5">
        <h3 className="font-serif text-lg text-amber-200 mb-1">「{name}」姓名解析</h3>
        <div className="yin-yang-divider"><span className="yin-yang-divider-icon">✍️</span></div>
        <p className="text-xs text-gray-500 mt-1">{gender}性 · 五格剖象法</p>
      </div>

      {/* 总评分圆环 */}
      <div className="flex justify-center mb-5">
        <div className="relative">
          <svg className="w-32 h-32" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#1f2937" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="50" fill="none"
              stroke={gradeColor}
              strokeWidth="8"
              strokeDasharray={`${(totalNum / 100) * 314} 314`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{ filter: `drop-shadow(0 0 8px ${gradeColor}66)` }}
            />
            <text x="60" y="55" textAnchor="middle" fill={gradeColor} fontSize="28" fontWeight="bold">{totalNum}</text>
            <text x="60" y="72" textAnchor="middle" fill={gradeColor} fontSize="12">{gradeLabel}</text>
            <text x="60" y="84" textAnchor="middle" fill="#6b7280" fontSize="8">分</text>
          </svg>
        </div>
      </div>

      {/* 姓名拆分 */}
      <div className="flex justify-center gap-6 mb-4">
        <div className="text-center">
          <div className="text-[10px] text-amber-600/60 uppercase tracking-wider">姓</div>
          <div className="font-serif text-2xl text-amber-300">{surname}</div>
          <div className="text-[10px] text-gray-500">{score.grids.tiange.value}划</div>
        </div>
        <div className="text-amber-800/40 flex items-center text-xl">/</div>
        <div className="text-center">
          <div className="text-[10px] text-amber-600/60 uppercase tracking-wider">名</div>
          <div className="font-serif text-2xl text-amber-300">{givenName}</div>
          <div className="text-[10px] text-gray-500">{score.grids.dige.value}划</div>
        </div>
      </div>

      {/* 五格面板 */}
      <div className="grid grid-cols-5 gap-1.5 mb-4">
        {Object.entries(grids).map(([key, g]) => (
          <div key={key} className="text-center p-2 rounded-xl bg-gray-900/50 border border-amber-800/15">
            <div className="text-[9px] text-amber-600/70 uppercase tracking-wider">{g.label}</div>
            <div className="font-serif text-lg font-bold text-amber-200 leading-tight">{g.value}</div>
            {g.el && (
              <div className="text-[10px] font-medium mt-0.5" style={{ color: elementColors[g.el] || '#9ca3af' }}>
                {g.el}行
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 五行柱状图 */}
      <div className="p-3 rounded-xl bg-gray-900/30 border border-amber-800/15 mb-3">
        <div className="text-[10px] text-amber-600/70 mb-2 uppercase tracking-widest text-center">五行指数</div>
        <div className="flex gap-1.5 text-[10px]">
          {(['木','火','土','金','水'] as const).map((el) => {
            const val = wuxing[el] || 0;
            const barH = Math.max(val * 16, val > 0 ? 8 : 4);
            return (
              <div key={el} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full h-14 rounded-lg flex items-end justify-center overflow-hidden" style={{ background: elementColors[el] + '15' }}>
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{ height: `${barH}px`, background: elementColors[el], opacity: 0.8 }}
                  />
                </div>
                <div className="font-bold text-xs" style={{ color: elementColors[el] }}>{el}</div>
                <div className="text-gray-500">{val}</div>
              </div>
            );
          })}
        </div>
        <div className="text-center text-[10px] text-gray-500 mt-2">五行：{wuxingBalance}</div>
      </div>

      {/* AI解读 */}
      <div className="p-3 rounded-xl bg-amber-900/10 border border-amber-700/20">
        <div className="text-[10px] text-amber-600/70 mb-1.5 uppercase tracking-widest">AI 姓名解读</div>
        <p className="text-sm text-gray-300 leading-relaxed">{comment}</p>
      </div>
    </div>
  );
}