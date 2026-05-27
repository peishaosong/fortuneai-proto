/**
 * FortuneAI 分享海报组件
 * 生成命盘/姓名等分享图片
 */
import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

interface SharePosterProps {
  type: 'bazi' | 'names' | 'calendar' | 'fengshui' | 'guanyin';
  title: string;       // e.g. "AI运势报告"
  subtitle?: string;   // e.g. "裴韶松 · 1990年1月1日"
  score?: number;       // 姓名评分等
  grade?: string;       // e.g. "大吉"
  gradeColor?: string;
  content?: string;     // 简要内容描述
  wuxing?: { 木: number; 火: number; 土: number; 金: number; 水: number };
  baziPillars?: { year: string; month: string; day: string; hour: string };
  onClose?: () => void;
}

const EL_COLORS: Record<string, string> = {
  木: '#4ade80', 火: '#f87171', 土: '#fbbf24', 金: '#e2e8f0', 水: '#60a5fa',
};

export function SharePoster({
  type, title, subtitle, score, grade, gradeColor = '#fbbf24',
  content, wuxing, baziPillars, onClose,
}: SharePosterProps) {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!posterRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: '#0a0e1a',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `fortuneai-${type}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('生成失败', e);
    }
    setGenerating(false);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* 海报预览 */}
        <div
          ref={posterRef}
          className="bg-[#0a0e1a] rounded-2xl overflow-hidden border border-amber-700/30"
          style={{ fontFamily: 'serif' }}
        >
          {/* 顶部装饰 */}
          <div className="bg-gradient-to-br from-amber-900/80 to-amber-950/80 px-4 py-5 text-center">
            <div className="text-3xl mb-1">☯</div>
            <div className="text-amber-200 text-xs tracking-widest uppercase">FortuneAI</div>
          </div>

          {/* 标题 */}
          <div className="px-4 py-4 text-center border-b border-amber-900/20">
            <div className="text-amber-200 text-base font-serif">{title}</div>
            {subtitle && <div className="text-amber-500/60 text-xs mt-1">{subtitle}</div>}
          </div>

          {/* 内容区 */}
          <div className="px-4 py-4">
            {/* 评分圆环（姓名用） */}
            {score !== undefined && (
              <div className="flex flex-col items-center mb-4">
                <svg className="w-24 h-24" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1f2937" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={gradeColor}
                    strokeWidth="6"
                    strokeDasharray={`${(score / 100) * 251} 251`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{ filter: `drop-shadow(0 0 6px ${gradeColor}66)` }}
                  />
                  <text x="50" y="46" textAnchor="middle" fill={gradeColor} fontSize="22" fontWeight="bold">{score}</text>
                  <text x="50" y="60" textAnchor="middle" fill={gradeColor} fontSize="10">{grade}</text>
                </svg>
                <div className="text-amber-200 text-sm mt-2">{subtitle?.split('·')[0]?.trim()}</div>
              </div>
            )}

            {/* 八字柱（四柱） */}
            {baziPillars && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: '年柱', value: baziPillars.year },
                  { label: '月柱', value: baziPillars.month },
                  { label: '日柱', value: baziPillars.day },
                  { label: '时柱', value: baziPillars.hour },
                ].map((p) => (
                  <div key={p.label} className="text-center p-2 rounded-lg bg-gray-900/60 border border-amber-800/15">
                    <div className="text-[9px] text-amber-600/70">{p.label}</div>
                    <div className="text-amber-200 font-serif text-sm mt-0.5">{p.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* 五行柱状图 */}
            {wuxing && (
              <div className="mb-4">
                <div className="text-[10px] text-amber-600/60 text-center mb-2 uppercase tracking-widest">五行分布</div>
                <div className="flex gap-1">
                  {(['木','火','土','金','水'] as const).map((el) => {
                    const val = wuxing[el] || 0;
                    const h = Math.max(val * 10, val > 0 ? 8 : 4);
                    return (
                      <div key={el} className="flex-1 flex flex-col items-center">
                        <div className="w-full h-12 rounded-t flex items-end justify-center" style={{ background: EL_COLORS[el] + '20' }}>
                          <div className="w-full rounded-t" style={{ height: `${h}px`, background: EL_COLORS[el], opacity: 0.8 }} />
                        </div>
                        <div className="text-[9px] font-medium mt-1" style={{ color: EL_COLORS[el] }}>{el}</div>
                        <div className="text-[9px] text-gray-500">{val}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 简介文字 */}
            {content && (
              <div className="text-center text-amber-200/70 text-xs leading-relaxed px-2">
                {content}
              </div>
            )}
          </div>

          {/* 底部 */}
          <div className="px-4 py-3 border-t border-amber-900/20 text-center">
            <div className="text-[9px] text-amber-600/50 tracking-widest">fortuneai.cc</div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onClose?.()}
            className="flex-1 py-3 rounded-xl border border-amber-700/40 text-amber-400/70 text-sm hover:bg-amber-900/20 transition-all"
          >
            返回
          </button>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-900/70 to-amber-800/50 text-amber-100 text-sm font-medium hover:from-amber-800/80 hover:to-amber-700/60 transition-all disabled:opacity-50"
          >
            {generating ? '生成中...' : done ? '✓ 已保存' : '📤 保存图片'}
          </button>
        </div>
      </div>
    </div>
  );
}
