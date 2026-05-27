/**
 * FortuneAI 风水堪舆页面
 */
import { useState } from 'react';

const roomTypes = [
  { key: 'living', label: '客厅', icon: '🛋️', desc: '影响全家财运与事业' },
  { key: 'bedroom', label: '卧室', icon: '🛏️', desc: '影响健康与感情运势' },
  { key: 'kitchen', label: '厨房', icon: '🍳', desc: '影响家宅健康与财运' },
  { key: 'office', label: '办公室', icon: '💼', desc: '影响事业与贵人运' },
  { key: 'entrance', label: '大门/玄关', icon: '🚪', desc: '影响整体气场与运势' },
  { key: 'bathroom', label: '卫生间', icon: '🚿', desc: '需注意化解污煞' },
];

const facingOptions = [
  '正东', '正南', '正西', '正北',
  '东南', '西南', '东北', '西北',
  '坐北朝南', '坐南朝北', '坐东朝西', '坐西朝东',
];

export function FengShui() {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [roomType, setRoomType] = useState('');
  const [facing, setFacing] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    if (!roomType) return;
    setStep('loading');

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `我需要风水堪舆分析，请根据以下信息给出专业建议：

【房屋信息】
- 房间类型：${roomTypes.find(r => r.key === roomType)?.label || roomType}
- 朝向/坐向：${facing || '未提供'}
- 补充描述：${description || '无'}

请从以下维度分析风水：
1. 整体吉凶判断
2. 财运位/事业位/桃花位/健康位分析
3. 需要注意的问题和化解方法
4. 最佳颜色/装饰/植物推荐
5. 趋吉避凶的具体建议

请用专业但亲切的语气，善用emoji，控制在500字以内。`,
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

  // ── 输入 ──
  if (step === 'input') {
    return (
      <div className="fate-portal">
        <div className="portal-glow-ring" />
        <div className="portal-header">
          <div className="portal-yin-yang">🏠</div>
          <h1 className="portal-title">风水堪舆</h1>
          <p className="portal-subtitle">输入户型信息，AI分析财运健康桃花位</p>
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
            分析房间
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
                <div className="font-serif text-sm text-amber-200">{r.label}</div>
                <div className="text-[9px] text-gray-500">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 朝向 */}
        <div className="mb-4">
          <label className="portal-label">
            <span className="portal-label-icon">🧭</span>
            朝向/坐向
          </label>
          <div className="portal-select-wrapper">
            <select
              value={facing}
              onChange={(e) => setFacing(e.target.value)}
              className="portal-input portal-select"
            >
              <option value="">选择朝向（选填）</option>
              {facingOptions.map((f) => (
                <option key={f} value={f} className="portal-option">{f}</option>
              ))}
            </select>
            <div className="portal-select-arrow">▼</div>
          </div>
        </div>

        {/* 补充描述 */}
        <div className="mb-4">
          <label className="portal-label">
            <span className="portal-label-icon">✏️</span>
            补充说明
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="如：门对窗、镜对床、梁压顶、采光不足、邻居情况等..."
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
            <span className="portal-submit-text">开始分析</span>
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
        <div className="text-amber-300 font-serif text-lg mb-2">风水分析中...</div>
        <div className="text-amber-600/60 text-sm">AI正在罗盘定位，请稍候</div>
      </div>
    );
  }

  // ── 结果 ──
  return (
    <div className="pb-16">
      <div className="fate-card rounded-2xl p-4 mb-4 text-center">
        <div className="text-3xl mb-2">
          {roomTypes.find(r => r.key === roomType)?.icon}
        </div>
        <h2 className="font-serif text-lg text-amber-200">
          {roomTypes.find(r => r.key === roomType)?.label}
        </h2>
        {facing && <p className="text-xs text-gray-500 mt-1">朝向：{facing}</p>}
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
        🏠 再分析一个
      </button>
    </div>
  );
}