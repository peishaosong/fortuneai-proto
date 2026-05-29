/**
 * FortuneAI 风水堪舆页面
 */
import { useState } from 'react';
import { type Lang, tv } from '../i18n';

interface FengShuiProps {
  lang?: Lang;
}

const roomTypes = [
  { key: 'living', label: { zh: '客厅', en: 'Living Room' }, icon: '🛋️', desc: { zh: '影响全家财运与事业', en: 'Affects family wealth & career' } },
  { key: 'bedroom', label: { zh: '卧室', en: 'Bedroom' }, icon: '🛏️', desc: { zh: '影响健康与感情运势', en: 'Affects health & relationships' } },
  { key: 'kitchen', label: { zh: '厨房', en: 'Kitchen' }, icon: '🍳', desc: { zh: '影响家宅健康与财运', en: 'Affects home health & wealth' } },
  { key: 'office', label: { zh: '办公室', en: 'Office' }, icon: '💼', desc: { zh: '影响事业与贵人运', en: 'Affects career & luck' } },
  { key: 'entrance', label: { zh: '大门/玄关', en: 'Entrance/Hallway' }, icon: '🚪', desc: { zh: '影响整体气场与运势', en: 'Affects overall energy flow' } },
  { key: 'bathroom', label: { zh: '卫生间', en: 'Bathroom' }, icon: '🚿', desc: { zh: '需注意化解污煞', en: 'Needs cleansing for negative energy' } },
];

const facingOptions = [
  { zh: '正东', en: 'East' },
  { zh: '正南', en: 'South' },
  { zh: '正西', en: 'West' },
  { zh: '正北', en: 'North' },
  { zh: '东南', en: 'Southeast' },
  { zh: '西南', en: 'Southwest' },
  { zh: '东北', en: 'Northeast' },
  { zh: '西北', en: 'Northwest' },
  { zh: '坐北朝南', en: 'Facing South' },
  { zh: '坐南朝北', en: 'Facing North' },
  { zh: '坐东朝西', en: 'Facing West' },
  { zh: '坐西朝东', en: 'Facing East' },
];

export function FengShui({ lang = 'zh' }: FengShuiProps) {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [roomType, setRoomType] = useState('');
  const [facing, setFacing] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState('');

  const currentRoom = roomTypes.find(r => r.key === roomType);
  const currentFacing = facingOptions.find(f => f.zh === facing);

  const handleSubmit = async () => {
    if (!roomType) return;
    setStep('loading');

    const roomLabel = currentRoom ? tv(currentRoom.label, lang) : roomType;
    const facingLabel = currentFacing ? tv(currentFacing, lang) : facing || tv({ zh: '未提供', en: 'not provided' }, lang);
    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: lang === 'en'
            ? `I need a Feng Shui analysis. Please provide professional advice based on:

【Property Info】
- Room type: ${roomLabel}
- Facing/Direction: ${facingLabel}
- Additional notes: ${description || 'none'}

Please analyze from:
1. Overall auspiciousness assessment
2. Wealth/Career/Love/Health positions
3. Issues to watch and remedies
4. Best colors/decorations/plants recommended
5. Specific advice for attracting fortune and avoiding misfortune

Professional yet warm tone, use emoji, keep under 500 words.`
            : `我需要风水堪舆分析，请根据以下信息给出专业建议：

【房屋信息】
- 房间类型：${roomLabel}
- 朝向/坐向：${facingLabel}
- 补充描述：${description || '无'}

请从以下维度分析风水：
1. 整体吉凶判断
2. 财运位/事业位/桃花位/健康位分析
3. 需要注意的问题和化解方法
4. 最佳颜色/装饰/植物推荐
5. 趋吉避凶的具体建议

请用专业但亲切的语气，善用emoji，控制在500字以内。`,
          lang,
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

  // ── 输入 ──
  if (step === 'input') {
    return (
      <div className="fate-portal">
        <div className="portal-glow-ring" />
        <div className="portal-header">
          <div className="portal-yin-yang">🏠</div>
          <h1 className="portal-title">{tv({ zh: '风水堪舆', en: 'Feng Shui' }, lang)}</h1>
          <p className="portal-subtitle">{tv({ zh: '输入户型信息，AI分析财运健康桃花位', en: 'Enter your floor plan for wealth, health & love analysis' }, lang)}</p>
        </div>
        <div className="portal-divider">
          <div className="portal-divider-line" />
          <div className="portal-divider-dot" />
          <div className="portal-divider-line" />
        </div>

        {/* 房间选择 */}
        <div className="mb-4">
          <label className="portal-label">
            <span className="portal-label-icon">🏠</span>
            {tv({ zh: '分析房间', en: 'Room to Analyze' }, lang)}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {roomTypes.map((r) => (
              <button
                key={r.key}
                onClick={() => setRoomType(r.key)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  roomType === r.key
                    ? 'bg-amber-900/30 border-amber-600/50'
                    : 'bg-gray-900/40 border-amber-800/20 hover:border-amber-700/40'
                }`}
              >
                <div className="text-lg mb-0.5">{r.icon}</div>
                <div className="font-serif text-sm text-amber-200">{tv(r.label, lang)}</div>
                <div className="text-[9px] text-gray-500">{tv(r.desc, lang)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 朝向 */}
        <div className="mb-4">
          <label className="portal-label">
            <span className="portal-label-icon">🧭</span>
            {tv({ zh: '朝向/坐向', en: 'Facing/Direction' }, lang)}
          </label>
          <div className="portal-select-wrapper">
            <select
              value={facing}
              onChange={(e) => setFacing(e.target.value)}
              className="portal-input portal-select"
            >
              <option value="">{tv({ zh: '选择朝向（选填）', en: 'Select facing (optional)' }, lang)}</option>
              {facingOptions.map((f) => (
                <option key={f.zh} value={f.zh} className="portal-option">{tv(f, lang)}</option>
              ))}
            </select>
            <div className="portal-select-arrow">▼</div>
          </div>
        </div>

        {/* 补充描述 */}
        <div className="mb-4">
          <label className="portal-label">
            <span className="portal-label-icon">✏️</span>
            {tv({ zh: '补充说明', en: 'Additional Notes' }, lang)}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={tv({ zh: '如：门对窗、镜对床、梁压顶、采光不足、邻居情况等...', en: 'e.g. door facing window, mirror opposite bed, beam overhead, poor lighting...' }, lang)}
            className="portal-input w-full min-h-[70px] resize-none py-2"
            rows={3}
          />
        </div>

        {/* 提交 */}
        <div className="portal-submit-wrap">
          <button
            onClick={handleSubmit}
            disabled={!roomType}
            className="portal-submit-btn disabled:opacity-40"
          >
            <span className="portal-submit-text">{tv({ zh: '开始分析', en: 'Analyze' }, lang)}</span>
            <span className="portal-submit-arrow">🏠</span>
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

  // ── 加载 ──
  if (step === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-5xl mb-4 animate-pulse">🏠</div>
        <div className="text-amber-300 font-serif text-lg mb-2">{tv({ zh: '风水分析中...', en: 'Analyzing feng shui...' }, lang)}</div>
        <div className="text-amber-600/60 text-sm">{tv({ zh: 'AI正在罗盘定位，请稍候', en: 'The compass is spinning...' }, lang)}</div>
      </div>
    );
  }

  // ── 结果 ──
  return (
    <div className="pb-16">
      <div className="fate-card rounded-2xl p-4 mb-4 text-center">
        <div className="text-3xl mb-2">{currentRoom?.icon}</div>
        <h2 className="font-serif text-lg text-amber-200">{tv(currentRoom?.label || { zh: '', en: '' }, lang)}</h2>
        {facing && <p className="text-xs text-gray-500 mt-1">{tv({ zh: '朝向：', en: 'Facing: ' }, lang)}{tv(facingOptions.find(f => f.zh === facing) || { zh: facing, en: facing }, lang)}</p>}
      </div>

      <div className="fate-card rounded-2xl p-5 mb-4">
        <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-sans"
          style={{ fontFamily: "'Space Grotesk', 'Noto Sans SC', sans-serif" }}>
          {result}
        </pre>
      </div>

      <button
        onClick={() => { setStep('input'); setResult(''); }}
        className="w-full py-3 rounded-xl border border-amber-700/40 text-amber-400/70 text-sm hover:bg-amber-900/20 transition-all"
      >
        {tv({ zh: '🏠 再分析一个', en: '🏠 Analyze another' }, lang)}
      </button>
    </div>
  );
}