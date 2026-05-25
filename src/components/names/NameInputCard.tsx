/**
 * FortuneAI 姓名学 - 前端组件
 */

import { useState } from 'react';

interface NameInputCardProps {
  onSubmit: (data: { name: string; gender: '男' | '女' }) => void;
}


export function NameInputCard({ onSubmit }: NameInputCardProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'男' | '女'>('男');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length >= 2) {
      onSubmit({ name: name.trim(), gender });
    }
  };

  return (
    <div className="fate-card rounded-2xl p-5 animate-fade-in w-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-900/40 to-amber-950/60 border border-amber-700/40 flex items-center justify-center">
          <span className="text-xl">✍️</span>
        </div>
        <div>
          <h2 className="font-serif text-lg text-amber-200 leading-none">姓名解析</h2>
          <p className="text-[10px] text-gray-500 mt-0.5">输入姓名，获取姓名评分与五行分析</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* 姓名输入 */}
        <div>
          <label className="block text-[10px] text-amber-400/70 mb-1 uppercase tracking-wider">姓名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入姓名（如：张伟）"
            maxLength={4}
            className="w-full rounded-lg px-4 py-3 text-lg text-gray-200 bg-gray-900/70 border border-amber-700/40 focus:outline-none focus:border-amber-500/70 transition-all text-center font-serif tracking-widest"
          />
          <p className="text-[10px] text-gray-600 mt-1 text-center">单名或双名皆可</p>
        </div>

        {/* 性别 + 按钮 */}
        <div className="grid grid-cols-3 gap-2 items-end">
          <div>
            <label className="block text-[10px] text-amber-400/70 mb-1 uppercase tracking-wider">性别</label>
            <div className="grid grid-cols-2 gap-1">
              {(['男', '女'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all ${
                    gender === g
                      ? 'bg-amber-900/50 text-amber-200 border border-amber-600/50'
                      : 'bg-gray-900/40 text-gray-400 border border-gray-700/50'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] text-transparent mb-1">&nbsp;</label>
            <button
              type="submit"
              disabled={name.trim().length < 2}
              className="w-full py-3 rounded-xl font-medium text-amber-100 bg-gradient-to-r from-amber-900/70 via-amber-800/50 to-amber-900/70 border border-amber-600/50 hover:from-amber-800/80 hover:via-amber-700/60 hover:to-amber-800/80 active:scale-[0.98] transition-all text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              开始解析 →
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ─── Name Score Display ───
interface NameScoreDisplayProps {
  name: string;
  score: any;
  gender: '男' | '女';
}

const elementColors: Record<string, string> = {
  '木': '#4ade80', '火': '#f87171', '土': '#fbbf24', '金': '#e2e8f0', '水': '#60a5fa',
};

export function NameScoreDisplay({ name, score, gender }: NameScoreDisplayProps) {
  const total = score.total;
  const grade = total >= 90 ? '大吉' : total >= 80 ? '吉' : total >= 70 ? '中吉' : total >= 60 ? '中' : total >= 50 ? '平' : '凶';
  const gradeColor = total >= 80 ? '#4ade80' : total >= 60 ? '#fbbf24' : '#f87171';

  const ges = [
    { label: '天格', value: score.tiange, el: score.tian },
    { label: '地格', value: score.dige, el: score.di },
    { label: '人格', value: score.renge, el: score.ren },
    { label: '总格', value: score.zongge, el: score.zong },
    { label: '外格', value: score.waige, el: '' },
  ];

  return (
    <div className="fate-card rounded-2xl p-5 animate-fade-in">
      <div className="text-center mb-5">
        <h3 className="font-serif text-lg text-amber-200 mb-1">「{name}」姓名分析</h3>
        <div className="yin-yang-divider"><span className="yin-yang-divider-icon">✍️</span></div>
        <p className="text-xs text-gray-500 mt-1">{gender}性 · 五格剖象法</p>
      </div>

      {/* 总评分 */}
      <div className="text-center mb-5">
        <div className="relative inline-block">
          <svg className="w-28 h-28" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#1f2937" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="50" fill="none"
              stroke={gradeColor}
              strokeWidth="8"
              strokeDasharray={`${(total / 100) * 314} 314`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{ filter: `drop-shadow(0 0 6px ${gradeColor}66)` }}
            />
            <text x="60" y="55" textAnchor="middle" className="text-3xl font-bold" fill={gradeColor} fontSize="32">{total}</text>
            <text x="60" y="72" textAnchor="middle" className="text-sm" fill={gradeColor} fontSize="14">{grade}</text>
          </svg>
        </div>
        <p className="text-sm mt-2 text-gray-400">{score.comment || '姓名评分完成'}</p>
      </div>

      {/* 五格 */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {ges.map((g) => (
          <div key={g.label} className="text-center p-2 rounded-xl bg-gray-900/40 border border-amber-800/15">
            <div className="text-[9px] text-amber-600/70 uppercase tracking-wider mb-1">{g.label}</div>
            <div className="text-lg font-serif font-bold text-amber-200">{g.value}</div>
            {g.el && <div className="text-[10px] font-medium mt-0.5" style={{ color: elementColors[g.el] }}>{g.el}行</div>}
          </div>
        ))}
      </div>

      {/* 五行均衡 */}
      <div className="p-3 rounded-xl bg-gray-900/30 border border-amber-800/15">
        <div className="text-[10px] text-amber-600/70 mb-2 uppercase tracking-widest text-center">五行指数</div>
        <div className="flex gap-2 text-xs">
          {(['木','火','土','金','水'] as const).map((el) => {
            const val = score.wuxing?.[el] || 0;
            return (
              <div key={el} className="flex-1 text-center">
                <div className="h-12 rounded-lg flex items-end justify-center" style={{ background: elementColors[el] + '20' }}>
                  <div className="w-full rounded-lg" style={{ height: `${Math.min(val * 20, 100)}%`, background: elementColors[el], opacity: 0.7 }} />
                </div>
                <div className="mt-1 font-medium" style={{ color: elementColors[el] }}>{el}</div>
                <div className="text-[10px] text-gray-500">{val}</div>
              </div>
            );
          })}
        </div>
        <div className="text-center text-[10px] text-gray-500 mt-2">五行均衡：{score.wuxing_balance || '待分析'}</div>
      </div>
    </div>
  );
}