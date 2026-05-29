/**
 * FortuneAI 择日吉凶页面
 */
import { useState } from 'react';
import { type Lang, tv } from '../i18n';

interface SelectDateProps {
  lang?: Lang;
}

type EventType = 'marriage' | 'move' | 'business' | 'travel' | 'worship' | 'other';

const eventTypes = [
  { key: 'marriage' as const, label: { zh: '结婚嫁娶', en: 'Marriage/Wedding' }, icon: '💒', desc: { zh: '天喜红鸾，黄道吉日', en: 'Tian Xi Hong Luan, auspicious day' } },
  { key: 'move' as const, label: { zh: '搬家入宅', en: 'Moving/Home Relocation' }, icon: '🏠', desc: { zh: '开日定日，紫微入宅', en: 'Kai day, Zi Wei enters home' } },
  { key: 'business' as const, label: { zh: '开业开市', en: 'Business Opening' }, icon: '🏪', desc: { zh: '天财入库，生意兴隆', en: 'Tian Cai enters treasury, prosperity ahead' } },
  { key: 'travel' as const, label: { zh: '出行远行', en: 'Travel' }, icon: '✈️', desc: { zh: '甲子天恩，一路平安', en: 'Jia Zi Tian En, safe journey' } },
  { key: 'worship' as const, label: { zh: '祭祀祈福', en: 'Worship & Prayer' }, icon: '🕯️', desc: { zh: '天德月德，祈福顺利', en: 'Tian De Yue De, prayers answered' } },
  { key: 'other' as const, label: { zh: '其他事项', en: 'Other' }, icon: '📋', desc: { zh: '综合择日，趋吉避凶', en: 'General date selection, seek fortune avoid misfortune' } },
];

export function SelectDate({ lang = 'zh' }: SelectDateProps) {
  const [step, setStep] = useState<'select' | 'loading' | 'result'>('select');
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [targetDate, setTargetDate] = useState('');
  const [zodiac, setZodiac] = useState('');
  const [requirements, setRequirements] = useState('');
  const [result, setResult] = useState('');

  const currentEvent = eventTypes.find(e => e.key === selectedEvent);

  const formatDate = (d: string) => {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return lang === 'en' ? `${y}-${m}-${day}` : `${y}年${m}月${day}日`;
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
      setResult(data.reply || tv({ zh: '☯ 暂无解读', en: '☯ No reading available' }, lang));
      setStep('result');
    } catch {
      setResult(tv({ zh: '☯ 服务器繁忙，请稍后再试', en: '☯ Server busy, please try again' }, lang));
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
          <h1 className="portal-title">{tv({ zh: '择日吉凶', en: 'Date Selection' }, lang)}</h1>
          <p className="portal-subtitle">{tv({ zh: '选择事项，AI为您挑选黄道吉日', en: 'Select an event type for an auspicious date' }, lang)}</p>
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
              <div className="font-serif text-sm text-amber-200">{tv(e.label, lang)}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{tv(e.desc, lang)}</div>
            </button>
          ))}
        </div>

        {/* 目标日期 */}
        <div className="mb-3">
          <label className="portal-label">
            <span className="portal-label-icon">📆</span>
            {tv({ zh: '目标日期（选填）', en: 'Target Date (optional)' }, lang)}
          </label>
          <input
            type="date"
            value={targetDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setTargetDate(e.target.value)}
            className="portal-input portal-input-date"
          />
          <div className="text-[10px] text-gray-500 mt-1 text-center">{tv({ zh: '不填则推荐最近30天内的吉日', en: 'Leave blank to find the best date within 30 days' }, lang)}</div>
        </div>

        {/* 属相 */}
        <div className="mb-3">
          <label className="portal-label">
            <span className="portal-label-icon">🐾</span>
            {tv({ zh: '家人属相（选填）', en: 'Family Zodiac (optional)' }, lang)}
          </label>
          <input
            type="text"
            value={zodiac}
            onChange={(e) => setZodiac(e.target.value)}
            placeholder={tv({ zh: '如：属鼠、属虎、属龙', en: 'e.g. Rat, Tiger, Dragon' }, lang)}
            className="portal-input"
          />
          <div className="text-[10px] text-gray-500 mt-1 text-center">{tv({ zh: '可填多个，如：属鼠、属虎', en: 'Multiple allowed, e.g. Rat, Tiger' }, lang)}</div>
        </div>

        {/* 特殊要求 */}
        <div className="mb-4">
          <label className="portal-label">
            <span className="portal-label-icon">✏️</span>
            {tv({ zh: '特殊要求（选填）', en: 'Special Requirements (optional)' }, lang)}
          </label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder={tv({ zh: '希望是周末 / 避开雨天...', en: 'Weekend preferred / Avoid rainy days...' }, lang)}
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
            <span className="portal-submit-text">{tv({ zh: '开始择日', en: 'Find Auspicious Dates' }, lang)}</span>
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
        <div className="text-amber-300 font-serif text-lg mb-2">{tv({ zh: '择日分析中...', en: 'Selecting auspicious dates...' }, lang)}</div>
        <div className="text-amber-600/60 text-sm">{tv({ zh: 'AI正在翻阅黄历，请稍候', en: 'Consulting the almanac...' }, lang)}</div>
      </div>
    );
  }

  // ── 结果 ──
  return (
    <div className="pb-16">
      {/* 头部 */}
      <div className="fate-card rounded-2xl p-4 mb-4 text-center">
        <div className="text-3xl mb-2">{currentEvent?.icon}</div>
        <h2 className="font-serif text-lg text-amber-200">{tv(currentEvent?.label || { zh: '', en: '' }, lang)}</h2>
        {targetDate && <p className="text-xs text-gray-500 mt-1">{tv({ zh: '目标日期：', en: 'Target: ' }, lang)}{formatDate(targetDate)}</p>}
        {zodiac && <p className="text-xs text-gray-500 mt-0.5">{tv({ zh: '家人属相：', en: 'Zodiac: ' }, lang)}{zodiac}</p>}
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
        {tv({ zh: '📅 再择一选', en: '📅 Select another date' }, lang)}
      </button>
    </div>
  );
}