import { useState } from 'react';

interface BaZiInputCardProps {
  onSubmit: (data: { date: string; time: string; gender: '男' | '女' }) => void;
}

const timeOptions = [
  '子时 (23:00-00:59)', '丑时 (01:00-02:59)', '寅时 (03:00-04:59)',
  '卯时 (05:00-06:59)', '辰时 (07:00-08:59)', '巳时 (09:00-10:59)',
  '午时 (11:00-12:59)', '未时 (13:00-14:59)', '申时 (15:00-16:59)',
  '酉时 (17:00-18:59)', '戌时 (19:00-20:59)', '亥时 (21:00-22:59)',
];

export function BaZiInputCard({ onSubmit }: BaZiInputCardProps) {
  const [date, setDate] = useState('1990-01-01');
  const [time, setTime] = useState(timeOptions[0]);
  const [gender, setGender] = useState<'男' | '女'>('男');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ date, time, gender });
  };

  return (
    <div className="fate-card rounded-2xl p-5 animate-fade-in cloud-pattern-bg">
      {/* 云纹装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse 70% 50% at 15% 25%, rgba(201, 168, 76, 0.06) 0%, transparent 70%),
              radial-gradient(ellipse 55% 40% at 80% 70%, rgba(201, 168, 76, 0.05) 0%, transparent 70%),
              radial-gradient(ellipse 45% 55% at 55% 50%, rgba(201, 168, 76, 0.04) 0%, transparent 65%)
            `,
          }}
        />
      </div>

      {/* 金色描边 */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          border: '1px solid rgba(201, 168, 76, 0.2)',
          boxShadow: '0 0 18px rgba(201, 168, 76, 0.06), inset 0 0 18px rgba(201, 168, 76, 0.03)',
        }}
      />

      {/* 标题区 - 阴阳☯装饰 */}
      <div className="relative text-center mb-5">
        {/* 装饰性天干字符 */}
        <div className="absolute inset-0 flex justify-between items-start px-2 opacity-20 pointer-events-none">
          <span className="stem-decorative">甲乙丙丁</span>
          <span className="stem-decorative">壬癸</span>
        </div>

        <div className="relative">
          <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-gradient-to-br from-amber-900/40 to-amber-950/60 border border-amber-700/40 flex items-center justify-center shadow-lg"
            style={{ boxShadow: '0 0 20px rgba(201, 168, 76, 0.15), inset 0 1px 0 rgba(201, 168, 76, 0.2)' }}>
            <span className="text-3xl text-amber-300/90">☯</span>
          </div>
          <h2 className="font-serif text-xl text-amber-200 mb-1">八字精批</h2>
          <div className="yin-yang-divider">
            <span className="yin-yang-divider-icon">☯</span>
          </div>
          <p className="text-xs text-gray-500">输入出生信息，获取命盘分析</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 relative">
        {/* 出生日期 */}
        <div>
          <label className="block text-xs text-amber-400/70 mb-1.5 uppercase tracking-wider">
            出生日期
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 text-sm text-gray-200
              bg-gray-900/70 border border-amber-700/40
              focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30
              hover:border-amber-600/50
              transition-all duration-200
              cursor-pointer
              [color-scheme:dark]"
            style={{
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4), 0 0 8px rgba(201, 168, 76, 0.05)',
            }}
          />
        </div>

        {/* 出生时辰 */}
        <div>
          <label className="block text-xs text-amber-400/70 mb-1.5 uppercase tracking-wider">
            出生时辰
          </label>
          <div className="relative">
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-200
                bg-gray-900/70 border border-amber-700/40
                focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30
                hover:border-amber-600/50
                transition-all duration-200 appearance-none cursor-pointer"
              style={{
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4), 0 0 8px rgba(201, 168, 76, 0.05)',
              }}
            >
              {timeOptions.map((t) => (
                <option key={t} value={t} className="bg-gray-900 text-gray-200">
                  {t}
                </option>
              ))}
            </select>
            {/* 下拉箭头 */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-amber-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* 性别 */}
        <div>
          <label className="block text-xs text-amber-400/70 mb-1.5 uppercase tracking-wider">
            性别
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['男', '女'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                  gender === g
                    ? 'bg-amber-900/50 text-amber-200'
                    : 'bg-gray-900/40 text-gray-400 border border-gray-700/50 hover:border-gray-600'
                }`}
                style={
                  gender === g
                    ? {
                        border: '1px solid rgba(201, 168, 76, 0.6)',
                        boxShadow: '0 0 12px rgba(201, 168, 76, 0.2), inset 0 1px 0 rgba(201, 168, 76, 0.15)',
                      }
                    : {}
                }
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          className="w-full mt-6 py-3 rounded-xl font-medium text-amber-100 btn-gold-glow
            bg-gradient-to-r from-amber-900/70 via-amber-800/50 to-amber-900/70
            border border-amber-600/50
            hover:from-amber-800/80 hover:via-amber-700/60 hover:to-amber-800/80
            hover:scale-[1.02]
            active:scale-[0.98]
            transition-all duration-200"
          style={{
            boxShadow: `
              0 4px 16px rgba(201, 168, 76, 0.15),
              0 0 20px rgba(201, 168, 76, 0.08),
              inset 0 1px 0 rgba(201, 168, 76, 0.2)
            `,
          }}
        >
          开始排盘 →
        </button>
      </form>

      {/* 底部装饰 */}
      <div className="mt-5 pt-4 border-t border-amber-900/20 flex justify-center gap-1">
        {['✦', '◆', '✦'].map((s, i) => (
          <span key={i} className="text-amber-700/50 text-xs">{s}</span>
        ))}
      </div>

      {/* 地支装饰 */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 opacity-10 pointer-events-none">
        <span className="branch-decorative text-[10px]">子丑寅卯辰巳</span>
        <span className="branch-decorative text-[10px]">午未申酉戌亥</span>
      </div>
    </div>
  );
}