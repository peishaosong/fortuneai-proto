/**
 * FortuneAI 打赏侧边栏
 */
import { type Lang, tv } from '../i18n';

interface DonationSidebarProps {
  lang?: Lang;
}

export function DonationSidebar({ lang = 'zh' }: DonationSidebarProps) {
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

  return (
    <aside className="fixed right-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-3">
      {/* 计数 */}
      <div className="flex flex-col items-center bg-[#0d1525]/90 backdrop-blur-md border border-amber-900/30 rounded-xl px-3 py-2.5">
        <div className="text-[10px] text-amber-600/70 uppercase tracking-widest">
          {tv({ zh: '今日已有', en: 'Readings today' }, lang)}
        </div>
        <div className="text-lg font-serif text-amber-300 leading-none font-bold">
          {yuanzhuCount.toLocaleString()}
        </div>
        <div className="text-[9px] text-amber-600/50">
          {tv({ zh: '位缘主解读命盘', en: 'generated' }, lang)}
        </div>
      </div>

      {/* 打赏 */}
      <div className="flex flex-col items-center bg-[#0d1525]/90 backdrop-blur-md border border-amber-900/30 rounded-xl px-3 py-2.5">
        <div className="text-[10px] text-amber-600/70 uppercase tracking-widest mb-1">
          {tv({ zh: '算得准就打赏', en: 'Tip if it resonated' }, lang)}
        </div>
        {/* 二维码占位 */}
        <div className="w-14 h-14 bg-gray-900/80 border border-amber-800/20 rounded-lg flex items-center justify-center mb-1">
          <div className="text-center">
            <div className="text-lg">☯</div>
            <div className="text-[8px] text-amber-600/60">{tv({ zh: '扫码打赏', en: 'Scan to tip' }, lang)}</div>
          </div>
        </div>
        <div className="text-[9px] text-amber-600/50 text-center leading-tight">
          {tv({ zh: '您的支持是我更新的动力', en: 'Your support fuels our updates' }, lang)}
        </div>
      </div>
    </aside>
  );
}