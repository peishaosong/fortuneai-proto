/**
 * FortuneAI AI运势报告页面
 * 输入出生信息 → 生成完整人生规划报告
 */
import { useState } from 'react';
import { BaZiInputCard } from './BaZiInputCard';
import { SharePoster } from './SharePoster';

interface FortuneReportProps {
  initialData?: { date: string; time: string; gender: '男' | '女' };
}

interface ReportSection {
  title: string;
  icon: string;
  content: string;
}

export function FortuneReport(_props: FortuneReportProps) {
  const [reportData, setReportData] = useState<any>(null);
  const [reportSections, setReportSections] = useState<ReportSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'loading' | 'report'>('input');
  const [showPoster, setShowPoster] = useState(false);



  const handleSubmit = async (data: { date: string; time: string; gender: '男' | '女' }) => {
    setStep('loading');
    setLoading(true);

    try {
      // 1. 获取八字数据
      const baziResp = await fetch('/api/bazi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birth_date: data.date, birth_time: data.time, gender: data.gender }),
      });
      if (!baziResp.ok) {
        const txt = await baziResp.text();
        throw new Error('API错误 ' + baziResp.status + ': ' + txt.slice(0, 100));
      }
      const baziResult = await baziResp.json();
      if (!baziResult.success) throw new Error(baziResult.detail || '未知错误');
      const baziData = baziResult.data;

      // 2. 生成各维度报告
      const topics = [
        { q: '请根据以下命盘，写一段300字左右的命盘总论，语气专业但亲切，善用emoji结尾：', key: '命盘总论', icon: '📜' },
        { q: '请根据以下命盘分析事业运势：优势、适合职业、贵人方位、注意事项，200字左右，善用emoji：', key: '事业运势', icon: '💼' },
        { q: '请根据以下命盘分析感情姻缘：性格、桃花运势、适合对象类型、注意事项，200字左右，善用emoji：', key: '感情姻缘', icon: '💕' },
        { q: '请根据以下命盘分析财富运势：财运特点、理财建议、财位方向、注意事项，200字左右，善用emoji：', key: '财富运势', icon: '💰' },
        { q: '请根据以下命盘给出健康提醒：需要特别注意的身体部位、养生建议，150字左右，善用emoji：', key: '健康提醒', icon: '🧘' },
      ];

      const bz = baziData.ba_zi || {};
      const wx = baziData.wu_xing || {};
      const dm = baziData.day_master || {};
      const gods = baziData.gods || {};
      const baziDesc = `【命盘】${data.date} ${data.time} ${data.gender}命

四柱：${bz.year?.stem || ''}${bz.year?.branch || ''} | ${bz.month?.stem || ''}${bz.month?.branch || ''} | ${bz.day?.stem || ''}${bz.day?.branch || ''} | ${bz.hour?.stem || ''}${bz.hour?.branch || ''}
五行：木${wx.木||0} 火${wx.火||0} 土${wx.土||0} 金${wx.金||0} 水${wx.水||0}
日主：${dm.stem || ''}（${dm.element || ''}气，${dm.strength || ''}）
用神：${(gods.useful || []).join('、')} | 忌神：${(gods.avoid || []).join('、')}`;

      const sections: ReportSection[] = [];
      for (const t of topics) {
        const chatResp = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: t.q, birth_info: data, bazi_data: baziData }),
        });
        const chatResult = await chatResp.json();
        sections.push({
          title: t.key,
          icon: t.icon,
          content: chatResult.reply || '☯ 暂无解读',
        });
        // 小延迟避免API限流
        await new Promise(r => setTimeout(r, 300));
      }

      setReportData({ baziData, birthInfo: data, baziDesc });
      setReportSections(sections);
      setStep('report');
    } catch (e) {
      console.error('[FortuneReport] 生成失败:', e);
      setStep('input');
      setLoading(false);
      const errEl = document.getElementById('submit-error');
      if (errEl) { errEl.textContent = '生成失败：' + ((e as Error).message || '请稍后重试'); errEl.classList.remove('hidden'); setTimeout(() => errEl.classList.add('hidden'), 4000); }
      return;
    }
  };

  const yuanzhuCount = (() => {
    const stored = localStorage.getItem('fortune_yuanzhu_count');
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('fortune_yuanzhu_date');
    let count = stored ? parseInt(stored) : 1287;
    if (storedDate !== today) {
      count += Math.floor(Math.random() * 8) + 3;
      localStorage.setItem('fortune_yuanzhu_count', count.toString());
      localStorage.setItem('fortune_yuanzhu_date', today);
    }
    return count;
  })();

  // ── 输入步骤 ──
  if (step === 'input') {
    return (
      <>
      <div id="submit-error" className="hidden text-red-400 text-sm text-center py-2"></div>
      <div>
        <BaZiInputCard onSubmit={handleSubmit} />
      </div>
      </>
    );
  }

  // ── 加载中 ──
  if (step === 'loading') {
    return (
      <div className="page-root flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-5xl mb-4 animate-pulse">☯</div>
        <div className="text-amber-300 font-serif text-lg mb-2">命盘解读中...</div>
        <div className="text-amber-600/60 text-sm mb-6">AI正在分析您的命盘，请稍候</div>
        <div className="text-xs text-gray-500">{loading && '正在生成六大维度报告...'}</div>
      </div>
    );
  }

  // ── 报告结果 ──
  const bz = reportData?.baziData?.ba_zi || {};
  const wx = reportData?.baziData?.wu_xing || {};

  return (
    <div className="page-root pb-20">
      {showPoster && reportData && (
        <SharePoster
          type="bazi"
          title="AI运势报告"
          subtitle={`${reportData.birthInfo.gender} · ${reportData.birthInfo.date} ${reportData.birthInfo.time}`}
          content={`${bz.year?.stem || ''}${bz.year?.branch || ''} · ${bz.month?.stem || ''}${bz.month?.branch || ''} · ${bz.day?.stem || ''}${bz.day?.branch || ''} · ${bz.hour?.stem || ''}${bz.hour?.branch || ''}`}
          wuxing={wx}
          baziPillars={{
            year: `${bz.year?.stem || ''}${bz.year?.branch || ''}`,
            month: `${bz.month?.stem || ''}${bz.month?.branch || ''}`,
            day: `${bz.day?.stem || ''}${bz.day?.branch || ''}`,
            hour: `${bz.hour?.stem || ''}${bz.hour?.branch || ''}`,
          }}
          onClose={() => setShowPoster(false)}
        />
      )}

      {/* 命盘摘要 */}
      <div className="fate-card rounded-2xl p-4 mb-4 animate-fade-in">
        <div className="text-center mb-3">
          <h2 className="font-serif text-lg text-amber-200">AI运势报告</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {reportData?.birthInfo?.date} · {reportData?.birthInfo?.time} · {reportData?.birthInfo?.gender}命
          </p>
          <div className="text-[10px] text-amber-600/50 mt-0.5">已有 {yuanzhuCount.toLocaleString()} 位缘主解读命盘</div>
        </div>

        {/* 四柱 */}
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {[
            { label: '年', value: `${bz.year?.stem || ''}${bz.year?.branch || ''}` },
            { label: '月', value: `${bz.month?.stem || ''}${bz.month?.branch || ''}` },
            { label: '日', value: `${bz.day?.stem || ''}${bz.day?.branch || ''}` },
            { label: '时', value: `${bz.hour?.stem || ''}${bz.hour?.branch || ''}` },
          ].map((p) => (
            <div key={p.label} className="text-center p-1.5 rounded-lg bg-gray-900/60 border border-amber-800/15">
              <div className="text-[9px] text-amber-600/70">{p.label}柱</div>
              <div className="font-serif text-sm text-amber-200">{p.value}</div>
            </div>
          ))}
        </div>

        {/* 五行 */}
        <div className="flex gap-1 text-[10px]">
          {(['木','火','土','金','水'] as const).map((el) => {
            const colors: Record<string,string> = { 木:'#4ade80', 火:'#f87171', 土:'#fbbf24', 金:'#e2e8f0', 水:'#60a5fa' };
            const val = wx[el] || 0;
            return (
              <div key={el} className="flex-1 text-center">
                <div className="h-10 rounded flex items-end justify-center" style={{ background: colors[el]+'15' }}>
                  <div className="w-full rounded-t" style={{ height: `${Math.max(val*8,4)}px`, background: colors[el], opacity: 0.7 }} />
                </div>
                <div className="font-medium mt-0.5" style={{ color: colors[el] }}>{el}{val}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 六大维度报告 */}
      {reportSections.map((section, i) => (
        <div key={section.title} className="fate-card rounded-2xl p-4 mb-3 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{section.icon}</span>
            <h3 className="font-serif text-sm text-amber-200">{section.title}</h3>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{section.content}</p>
        </div>
      ))}

      {/* 分享按钮 */}
      <div className="mt-4 mb-2">
        <button
          onClick={() => setShowPoster(true)}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-900/60 to-amber-800/40 text-amber-200 text-sm font-medium border border-amber-700/40 hover:from-amber-800/70 hover:to-amber-700/50 transition-all"
        >
          📤 生成分享海报
        </button>
      </div>
    </div>
  );
}
