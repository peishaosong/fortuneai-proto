/**
 * FortuneAI 打赏侧边栏
 * 桌面：左侧展开；手机：悬浮按钮点开弹层
 */
import { useState, useEffect } from 'react';

function getYuanZhuCount() {
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
}

export function DonationSidebar() {
  const [activeTab, setActiveTab] = useState<'wechat' | 'alipay' | 'paypal'>('wechat');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileQrTab, setMobileQrTab] = useState<'wechat' | 'alipay' | 'paypal' | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const yuanzhu = getYuanZhuCount();

  // 桌面端二维码
  const qrImages: Record<string, { src: string; alt: string }> = {
    wechat: { src: '/wechat-donate.jpg', alt: '微信收款' },
    alipay: { src: '/alipay-donate.jpg', alt: '支付宝收款' },
    paypal: { src: '/paypal-donate.png', alt: 'PayPal' },
  };

  // ── Mobile: 悬浮按钮点开弹层 ──
  if (isMobile) {
    // 显示二维码弹层
    if (mobileQrTab) {
      const qr = qrImages[mobileQrTab];
      return (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs fate-card rounded-2xl p-4 text-center">
            <div className="text-sm text-amber-200 mb-2 font-serif">{qr.alt}</div>
            <div className="bg-white rounded-xl p-3 mb-3">
              <img src={qr.src} alt={qr.alt} className="w-full rounded-lg" />
            </div>
            <p className="text-xs text-gray-500 mb-3">截图保存，用{activeTab === 'wechat' ? '微信' : activeTab === 'alipay' ? '支付宝' : 'PayPal'}扫码支付</p>
            <button onClick={() => setMobileQrTab(null)} className="w-full py-2.5 rounded-xl border border-amber-700/40 text-amber-400/70 text-sm hover:bg-amber-900/20 transition-all">
              返回
            </button>
          </div>
        </div>
      );
    }

    if (!mobileOpen) {
      return (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <div className="bg-gradient-to-b from-amber-900/90 to-amber-950/90 border border-amber-700/40 rounded-r-xl px-2 py-4 text-xs text-amber-300/80 shadow-lg backdrop-blur-sm hover:from-amber-800/90 hover:to-amber-900/90 transition-all">
            <span className="text-base">☺️</span>
            <span className="tracking-widest ml-1">打赏</span>
          </div>
        </button>
      );
    }
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-sm fate-card rounded-2xl p-5">
          <div className="text-center mb-3">
            <div className="text-2xl mb-1">☺️</div>
            <h3 className="font-serif text-base text-amber-200">算得准就打赏</h3>
            <p className="text-xs text-gray-500 mt-0.5">您的支持是我更新的动力</p>
          </div>
          <div className="text-center mb-3 px-2 py-2 rounded-xl bg-gradient-to-r from-amber-900/20 to-amber-900/10 border border-amber-700/20">
            <div className="text-[9px] text-amber-500/70 uppercase tracking-widest">今日已有</div>
            <div className="font-serif text-lg text-amber-300 font-bold" style={{ letterSpacing: '2px' }}>{yuanzhu.toLocaleString()}</div>
            <div className="text-[9px] text-amber-500/70 uppercase tracking-widest">位缘主解读命盘</div>
          </div>
          <div className="space-y-2 mb-3">
            <button onClick={() => setMobileQrTab('wechat')} className="w-full py-3 rounded-xl bg-green-900/60 text-green-200 text-sm font-medium border border-green-700/40 flex items-center justify-center gap-2">
              <span>💬</span><span>微信支付</span>
            </button>
            <button onClick={() => setMobileQrTab('alipay')} className="w-full py-3 rounded-xl bg-blue-900/60 text-blue-200 text-sm font-medium border border-blue-700/40 flex items-center justify-center gap-2">
              <span>💳</span><span>支付宝</span>
            </button>
            <button onClick={() => setMobileQrTab('paypal')} className="w-full py-3 rounded-xl bg-amber-900/60 text-amber-200 text-sm font-medium border border-amber-700/40 flex items-center justify-center gap-2">
              <span>🌍</span><span>PayPal</span>
            </button>
          </div>
          <button onClick={() => setMobileOpen(false)} className="w-full py-2 text-center text-gray-500 text-xs hover:text-gray-300">
            关闭
          </button>
        </div>
      </div>
    );
  }

  // ── Desktop: 左侧固定展开 ──
  if (!desktopOpen) {
    return (
      <button
        onClick={() => setDesktopOpen(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50"
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        <div className="bg-gradient-to-b from-amber-900/90 to-amber-950/90 border border-amber-700/40 rounded-r-xl px-2 py-4 text-xs text-amber-300/80 shadow-lg backdrop-blur-sm">
          <span className="text-base">☺️</span>
          <span className="tracking-widest ml-1">打赏</span>
        </div>
      </button>
    );
  }

  const tabs = [
    { key: 'wechat' as const, label: '微信', icon: '💬' },
    { key: 'alipay' as const, label: '支付宝', icon: '💳' },
    { key: 'paypal' as const, label: 'PayPal', icon: '🌍' },
  ];

  return (
    <>
      {/* 左侧悬浮收起按钮 */}
      <button
        onClick={() => setDesktopOpen(false)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50"
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        <div className="bg-gradient-to-b from-amber-900/90 to-amber-950/90 border border-amber-700/40 rounded-r-xl px-2 py-4 text-xs text-amber-300/80 shadow-lg backdrop-blur-sm">
          <span className="text-base">☺️</span>
          <span className="tracking-widest ml-1">打赏</span>
        </div>
      </button>

      {/* 侧边栏面板 */}
      <div className="fixed left-14 top-1/2 -translate-y-1/2 z-50 w-56">
        <div className="fate-card rounded-2xl p-4 shadow-2xl border border-amber-700/30">
          <div className="text-center mb-3">
            <div className="text-2xl mb-1">☺️</div>
            <h3 className="font-serif text-sm text-amber-200">算得准就打赏</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">您的支持是我更新的动力</p>
          </div>
          <div className="text-center mb-3 px-2 py-2 rounded-xl bg-gradient-to-r from-amber-900/20 via-amber-800/10 to-amber-900/20 border border-amber-700/20">
            <div className="text-[9px] text-amber-500/70 uppercase tracking-widest mb-0.5">今日已有</div>
            <div className="font-serif text-xl text-amber-300 font-bold" style={{ letterSpacing: '2px' }}>{yuanzhu.toLocaleString()}</div>
            <div className="text-[9px] text-amber-500/70 uppercase tracking-widest mt-0.5">位缘主解读命盘</div>
          </div>
          <div className="flex gap-1 mb-3 bg-gray-900/60 rounded-lg p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-1 py-1.5 rounded-md text-[10px] transition-all ${activeTab === t.key ? 'bg-amber-900/50 text-amber-300' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <div className="text-center">
            <div className="bg-white rounded-xl p-2 mb-2">
              {activeTab === 'wechat' && <img src="/wechat-donate.jpg" alt="微信收款" className="w-full rounded-lg" />}
              {activeTab === 'alipay' && <img src="/alipay-donate.jpg" alt="支付宝收款" className="w-full rounded-lg" />}
              {activeTab === 'paypal' && <img src="/paypal-donate.png" alt="PayPal" className="w-full rounded-lg" />}
            </div>
            <p className="text-[10px] text-gray-500">扫码打赏 · 任意金额</p>
          </div>
          <button
            onClick={() => setDesktopOpen(false)}
            className="absolute -right-2 -top-2 w-5 h-5 rounded-full bg-gray-800 border border-gray-600 text-gray-400 text-xs flex items-center justify-center hover:bg-gray-700"
          >
            ✕
          </button>
        </div>
      </div>
    </>
  );
}
