/**
 * FortuneAI 择日吉凶页面
 */
import { useState } from 'react';

type EventType = 'marriage' | 'move' | 'business' | 'travel' | 'worship' | 'other';

const eventTypes = [
  { key: 'marriage' as const, label: '结婚嫁娶', icon: '💒', desc: '天喜红鸾，黄道吉日' },
  { key: 'move' as const, label: '搬家入宅', icon: '🏠', desc: '开日定日，紫微入宅' },
  { key: 'business' as const, label: '开业开市', icon: '🏪', desc: '天财入库，生意兴隆' },
  { key: 'travel' as const, label: '出行远行', icon: '✈️', desc: '甲子天恩，一路平安' },
  { key: 'worship' as const, label: '祭祀祈福', icon: '🕯️', desc: '天德月德，祈福顺利' },
  { key: 'other' as const, label: '其他事项', icon: '📋', desc: '综合择日，趋吉避凶' },
];

export function SelectDate() {
  const [step, setStep] = useState<'select' | 'loading' | 'result'>('select');
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [targetDate, setTargetDate] = useState('');
  const [zodiac, setZodiac] = useState('');
  const [requirements, setRequirements] = useState('');
  const [result, setResult] = useState('');

  const formatDate = (d: string) => {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${y}年${m}月${day}日`;
  };

  const handleSubmit = async () => {
    if (!selectedEvent) return;
    setStep('loading');

    try {
      const resp = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: selectedEvent,
          target_date: targetDate || undefined,
          zodiac: zodiac || undefined,
          requirements: requirements || undefined,
        }),
      });
      const data = await resp.json();
      setResult(data.reply || '☯ 暂无解读');
      setStep('result');
    } catch {
      setResult('☯ 服务器繁忙，请稍后再试');
      setStep('result');
    }
  };

  // ── 选择事项 ──
  if (step === 'select') {
    return (
      <div className="fate-portal">
        <div className="portal-glow-ring" />
        <div className="portal-header">
          <div className="portal-yin-yang">📅</div>
          <h1 className="portal-title">择日吉凶</h1>
          <p className="portal-subtitle">选择事项，AI为您挑选黄道吉日</p>
        </div>
        <div className="portal-divider">
          <div className="portal-divider-line" />
          <div className="portal-divider-dot" />
          <div className="portal-divider-line" />
        </div>

        {/* 事项选择 */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {eventTypes.map((e) => (
            <button
              key={e.key}
              onClick={() => setSelectedEvent(e.key)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedEvent === e.key
                  ? 'bg-amber-900/30 border-amber-600/50'
                  : 'bg-gray-900/40 border-amber-800/20 hover:border-amber-700/40'
              }`}
            >
              <div className="text-xl mb-1">{e.icon}</div>
              <div className="font-serif text-sm text-amber-200">{e.label}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{e.desc}</div>
            </button>
          ))}
        </div>

        {/* 目标日期 */}
        <div className="mb-3">
          <label className="portal-label">
            <span className="portal-label-icon">📆</span>
            目标日期（选填）
          </label>
          <input
            type="date"
            value={targetDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setTargetDate(e.target.value)}
            className="portal-input portal-input-date"
          />
          <div className="text-[10px] text-gray-500 mt-1 text-center">不填则推荐最近30天内的吉日</div>
        </div>

        {/* 属相 */}
        <div className="mb-3">
          <label className="portal-label">
            <span className="portal-label-icon">🐾</span>
            家人属相（选填）
          </label>
          <input
            type="text"
            value={zodiac}
            onChange={(e) => setZodiac(e.target.value)}
            placeholder="如：属鼠、属虎、属龙"
            className="portal-input"
          />
          <div className="text-[10px] text-gray-500 mt-1 text-center">可填多个，如：属鼠、属虎</div>
        </div>

        {/* 特殊要求 */}
        <div className="mb-4">
          <label className="portal-label">
            <span className="portal-label-icon">✏️</span>
            特殊要求（选填）
          </label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="希望是周末 / 避开雨天..."
            className="portal-input w-full min-h-[60px] resize-none py-2"
            rows={2}
          />
        </div>

        {/* 提交 */}
        <div className="portal-submit-wrap">
          <button
            onClick={handleSubmit}
            disabled={!selectedEvent}
            className="portal-submit-btn disabled:opacity-40"
          >
            <span className="portal-submit-text">开始择日</span>
            <span className="portal-submit-arrow">☯</span>
            <div className="portal-submit-shimmer" />
          </button>
        </div>

        <div className="portal-corner portal-corner--tl" />
        <div className="portal-corner portal-corner--tr" />
        <div className="portal-corner portal-corner--bl" />
        <div className="portal-corner portal-corner--br" />
      </div>
    );
  }

  // ── 加载中 ──
  if (step === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-5xl mb-4 animate-pulse">📅</div>
        <div className="text-amber-300 font-serif text-lg mb-2">择日分析中...</div>
        <div className="text-amber-600/60 text-sm">AI正在翻阅黄历，请稍候</div>
      </div>
    );
  }

  // ── 结果 ──
  return (
    <div className="pb-16">
      {/* 头部 */}
      <div className="fate-card rounded-2xl p-4 mb-4 text-center">
        <div className="text-3xl mb-2">
          {selectedEvent && eventTypes.find(e => e.key === selectedEvent)?.icon}
        </div>
        <h2 className="font-serif text-lg text-amber-200">
          {selectedEvent && eventTypes.find(e => e.key === selectedEvent)?.label}
        </h2>
        {targetDate && <p className="text-xs text-gray-500 mt-1">目标日期：{formatDate(targetDate)}</p>}
        {zodiac && <p className="text-xs text-gray-500 mt-0.5">家人属相：{zodiac}</p>}
      </div>

      {/* 结果 */}
      <div className="fate-card rounded-2xl p-5 mb-4">
        <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-sans"
          style={{ fontFamily: "'Space Grotesk', 'Noto Sans SC', sans-serif" }}>
          {result}
        </pre>
      </div>

      {/* 再测一次 */}
      <button
        onClick={() => { setStep('select'); setResult(''); }}
        className="w-full py-3 rounded-xl border border-amber-700/40 text-amber-400/70 text-sm hover:bg-amber-900/20 transition-all"
      >
        📅 再择一选
      </button>
    </div>
  );
}