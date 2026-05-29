/**
 * FortuneAI 观音灵签页面
 */
import { useState } from 'react';
import { type Lang, tv, tf } from '../i18n';

interface GuanyinProps {
  lang?: Lang;
}

function generateSign(): { number: number; stem: string; text: string; level: string } {
  const num = Math.floor(Math.random() * 60) + 1;
  const stems = ['上上', '上吉', '中吉', '吉', '中平', '下吉', '下下'];
  const stemIdx = num <= 10 ? 0 : num <= 25 ? 1 : num <= 40 ? 2 : num <= 52 ? 3 : num <= 58 ? 5 : 6;
  const stem = stems[stemIdx];

  const texts: Record<string, string[]> = {
    '上上': [
      '云开日出正当晴，枯木逢春再发荣。万物枯残偏遇雨，片云散开见天明。求得此签真万金，暗中分明吉来临。',
      '上圣垂慈降吉祥，诚心一念感穹苍。祸去福来从天降，修身行善福寿长。',
    ],
    '上吉': [
      '一箭射红心，神明鉴尔真。求名求利事，俱得遂其心。',
      '龙虎榜中列姓名，红袍脱去换紫袍。曾经折桂登云路，衣锦归来耀祖宗。',
    ],
    '中吉': [
      '春雷震震起苍龙，大地回春万物生。日暖风和催百草，人安物阜乐升平。',
      '三合百福自然来，财官双美尽堪夸。绿杨深处黄鹂啭，最好风光在杏花。',
    ],
    '吉': [
      '枯木逢春再发枝，片云散开见天时。祸去福来终有日，且将心放宽莫疑。',
      '十年灯火后方开，此日青霄足可阶。大器晚成原有限，更期明岁步金阶。',
    ],
    '中平': [
      '云遮月色未为晴，十五圆时再放明。眼前且待风云会，枯木逢春再发荣。',
      '风前一箭坠江边，赢得当时兆眼前。不须更问前途事，且宜守旧应安然。',
    ],
    '下吉': [
      '莫恼春风志未伸，且宜守旧待明春。梅花冷落无消息，直到花开再问津。',
      '春来风浪正颠连，幸有慈悲俯听言。急去不当宽处去，且宜守旧待安然。',
    ],
    '下下': [
      '枯井无泉水，暗室不相见。莫信傍人言，祸福在眼前。',
      '枯木逢春不翼飞，暗云遮月影微微。枯井深深无水汲，且宜守旧莫妄为。',
    ],
  };

  const pool = texts[stem] || texts['中平'];
  const text = pool[Math.floor(Math.random() * pool.length)];

  return { number: num, stem, text, level: stem };
}

export function Guanyin({ lang = 'zh' }: GuanyinProps) {
  const [step, setStep] = useState<'shake' | 'reveal'>('shake');
  const [sign, setSign] = useState<{ number: number; stem: string; text: string; level: string } | null>(null);
  const [shaking, setShaking] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);

  const handleShake = () => {
    setShaking(true);
    setShakeCount(c => c + 1);

    setTimeout(() => {
      const s = generateSign();
      setSign(s);
      setShaking(false);
      setStep('reveal');
    }, 1500);
  };

  const handleReset = () => {
    setStep('shake');
    setSign(null);
  };

  const stemColors: Record<string, string> = {
    '上上': '#fbbf24', '上吉': '#f59e0b', '中吉': '#fb923c',
    '吉': '#34d399', '中平': '#9ca3af', '下吉': '#f87171', '下下': '#ef4444',
  };
  const stemBgColors: Record<string, string> = {
    '上上': 'from-amber-900/40 to-yellow-900/20',
    '上吉': 'from-amber-900/30 to-orange-900/20',
    '中吉': 'from-amber-900/20 to-orange-900/10',
    '吉': 'from-green-900/20 to-emerald-900/10',
    '中平': 'from-gray-800/40 to-gray-900/20',
    '下吉': 'from-red-900/20 to-red-900/10',
    '下下': 'from-red-900/40 to-red-950/20',
  };

  if (step === 'reveal' && sign) {
    const color = stemColors[sign.stem] || '#9ca3af';
    const bgGrad = stemBgColors[sign.stem] || 'from-gray-800/40 to-gray-900/20';
    const stemLabel = tv({ zh: sign.stem, en: getStemEn(sign.stem) }, lang);
    const signNum = lang === 'en' ? `No. ${sign.number}` : `第 ${sign.number} 签`;

    return (
      <div className="pb-16 animate-fade-in">
        <div className="text-center mb-4">
          <div className="text-amber-600/60 text-xs">{tv({ zh: '签筒已收 · 抽中第 ', en: 'Received · Drawn ' }, lang)}{sign.number}{tv({ zh: ' 签', en: '' }, lang)}</div>
        </div>

        <div className="fate-card rounded-2xl overflow-hidden mb-4">
          <div className={`bg-gradient-to-br ${bgGrad} px-6 py-5 text-center border-b border-amber-800/20`}>
            <div className="text-3xl mb-1">🔮</div>
            <div className="font-serif text-2xl font-bold mb-1" style={{ color }}>
              {stemLabel}
            </div>
            <div className="text-amber-200/70 text-sm">{signNum}</div>
          </div>

          <div className="px-6 py-5">
            <div className="text-[10px] text-amber-600/60 text-center mb-3 uppercase tracking-widest">
              {tv({ zh: '观音灵签 · 诗曰', en: 'Guanyin Divination · Poem' }, lang)}
            </div>
            <p className="text-center text-gray-300 leading-relaxed font-serif" style={{ fontSize: '0.95rem' }}>
              {sign.text}
            </p>
          </div>

          <div className="px-6 py-4 border-t border-amber-800/15">
            <button
              onClick={async () => {
                const enMsg = lang === 'en'
                  ? `I drew Guanyin Divination No. ${sign.number}, fortune level "${getStemEn(sign.stem)}". The poem reads: "${sign.text}". Please give me a detailed analysis including: 1) Overall fortune assessment 2) Guidance for your question 3) Remedies and precautions 4) Lucky directions/colors. Warm and friendly tone, use emoji.`
                  : `我抽到了观音灵签第${sign.number}签，签运为"${sign.stem}"。签诗为："${sign.text}"。请帮我详细解读这个签的含义，包括：1）整体运势分析 2）求事解惑 3）趋避建议 4）适合的吉方位/颜色。请用亲切的口吻，善用emoji。`;
                const resp = await fetch('/api/chat', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ message: enMsg, lang }),
                });
                const data = await resp.json();
                const explanationEl = document.getElementById('sign-explanation');
                if (explanationEl && data.reply) {
                  explanationEl.innerHTML = `<div class="text-[10px] text-amber-600/60 uppercase tracking-widest mb-2 text-center">${tv({ zh: '观音开示', en: 'Guanyin\'s Guidance' }, lang)}</div><p class="text-sm text-gray-300 leading-relaxed">${data.reply.replace(/\n/g, '<br/>')}</p>`;
                }
              }}
              id="explain-btn"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-900/40 to-amber-800/20 text-amber-300 text-sm border border-amber-700/30 hover:from-amber-900/60 hover:to-amber-800/40 transition-all"
            >
              {tv({ zh: '🙏 请观音菩萨指点', en: '🙏 Ask Guanyin for Guidance' }, lang)}
            </button>
            <div
              id="sign-explanation"
              className="mt-3 p-3 rounded-xl bg-gray-900/50 border border-amber-800/15"
            >
              <div className="text-center text-amber-600/40 text-xs py-4">
                {tv({ zh: '点击上方按钮，获取详细解签', en: 'Tap the button above for detailed reading' }, lang)}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="w-full py-3 rounded-xl border border-amber-700/40 text-amber-400/70 text-sm hover:bg-amber-900/20 transition-all"
        >
          {tv({ zh: '🔮 再抽一签', en: '🔮 Draw Another' }, lang)}
        </button>
      </div>
    );
  }

  const notices = [
    { zh: '心中默念所求之事，诚心摇动签筒', en: 'Mentally focus on your question, shake the tube devotionally' },
    { zh: '摇至签筒发出声响，落出一签为止', en: 'Shake until a stick falls out with a sound' },
    { zh: '抽得签文后，点击"请观音菩萨指点"获取详解', en: 'After drawing, tap "Ask Guanyin for Guidance" for full analysis' },
  ];

  return (
    <div className="fate-portal">
      <div className="portal-glow-ring" />
      <div className="portal-header">
        <div className="portal-yin-yang">🔮</div>
        <h1 className="portal-title">{tv({ zh: '观音灵签', en: 'Guanyin Divination' }, lang)}</h1>
        <p className="portal-subtitle">{tv({ zh: '诚心摇一签，菩萨为您指点迷津', en: 'Shake devotionally for Guanyin\'s guidance' }, lang)}</p>
      </div>
      <div className="portal-divider">
        <div className="portal-divider-line" />
        <div className="portal-divider-dot" />
        <div className="portal-divider-line" />
      </div>

      <div className="flex flex-col items-center mb-6">
        <div
          className={`relative cursor-pointer select-none transition-transform ${shaking ? 'animate-wobble' : ''}`}
          onClick={handleShake}
        >
          <div className="relative">
            <div className="w-28 h-36 bg-gradient-to-b from-amber-900/60 via-amber-900/40 to-amber-950/60 rounded-xl border-2 border-amber-700/50 flex items-center justify-center shadow-xl">
              <div className="text-4xl text-amber-300/60">📿</div>
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-20 bg-amber-100/20 rounded-full" />
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-20 bg-amber-100/20 rounded-full" />
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-gradient-to-b from-amber-800/80 to-amber-900/60 rounded-full border border-amber-600/40" />
          </div>
        </div>
        <p className="text-amber-600/60 text-xs mt-4 text-center">
          {tv({ zh: '点击签筒 · 心念所求 · 诚心摇动', en: 'Click the fortune stick · Focus your mind · Shake devotionally' }, lang)}
        </p>
        {shakeCount > 0 && (
          <p className="text-amber-500/50 text-[10px] mt-1">{tf(tv({ zh: '已摇 %d 次', en: 'Shaken %d times' }, lang), lang, shakeCount)}</p>
        )}
      </div>

      <div className="bg-gray-900/40 rounded-xl p-3 border border-amber-800/15 mb-4">
        <div className="text-[10px] text-amber-600/70 uppercase tracking-widest text-center mb-2">{tv({ zh: '摇签须知', en: 'How to Draw' }, lang)}</div>
        <div className="space-y-1 text-xs text-gray-400">
          {notices.map((n, i) => (
            <div key={i}>✦ {tv(n, lang)}</div>
          ))}
        </div>
      </div>

      <div className="portal-submit-wrap">
        <button
          onClick={handleShake}
          disabled={shaking}
          className="portal-submit-btn disabled:opacity-40"
        >
          <span className="portal-submit-text">{shaking ? tv({ zh: '摇动中...', en: 'Shaking...' }, lang) : tv({ zh: '诚心摇签', en: 'Shake Devotionally' }, lang)}</span>
          <span className="portal-submit-arrow">🙏</span>
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

function getStemEn(stem: string): string {
  const map: Record<string, string> = {
    '上上': 'Superior',
    '上吉': 'Upper Auspicious',
    '中吉': 'Moderately Auspicious',
    '吉': 'Auspicious',
    '中平': 'Moderate',
    '下吉': 'Lower Auspicious',
    '下下': 'Inauspicious',
  };
  return map[stem] || stem;
}