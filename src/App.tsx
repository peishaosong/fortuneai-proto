/**
 * FortuneAI - Responsive App
 * Mobile: bottom tabs
 * Desktop: left-aligned content (original layout) + left donation sidebar
 */
import { useState, useEffect } from 'react';
import { TabNav } from './components/TabNav';
import type { TabId } from './components/TabNav';
import { FortuneReport } from './components/FortuneReport';
import { NameInputCard } from './components/names/NameInputCard';
import { NameResult } from './components/names/NameResult';
import { SelectDate } from './components/SelectDate';
import { FengShui } from './components/FengShui';
import { Guanyin } from './components/Guanyin';
import { DonationSidebar } from './components/DonationSidebar';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

function AtmosphericBg() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    x: (i * 137.508) % 100, y: (i * 73.254) % 100,
    size: (i * 17) % 3 + 1,
    opacity: 0.1 + (i * 31) % 5 * 0.08,
    delay: (i * 1.3) % 4,
  }));
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#0d1220] to-[#080c18]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-900/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-orange-900/5 blur-3xl" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-yellow-900/3 blur-3xl" />
      {stars.map((s, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, opacity: s.opacity, animation: `twinkle ${3 + s.delay}s ease-in-out infinite alternate` }} />
      ))}
    </div>
  );
}

const TAB_TITLES: Record<TabId, string> = {
  report: 'AI运势报告', names: '姓名解析', calendar: '择日吉凶', fengshui: '风水堪舆', guanyin: '观音灵签',
};

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'report', label: '运势报告', icon: '📜' },
  { id: 'names', label: '姓名解析', icon: '✍️' },
  { id: 'calendar', label: '择日吉凶', icon: '📅' },
  { id: 'fengshui', label: '风水堪舆', icon: '🏠' },
  { id: 'guanyin', label: '观音灵签', icon: '🔮' },
];

// ─── Mobile Layout ───
function MobileLayout({ currentTab, onTabChange }: { currentTab: TabId; onTabChange: (t: TabId) => void }) {
  const [nameResult, setNameResult] = useState<any>(null);
  const [nameLoading, setNameLoading] = useState(false);
  const handleNameSubmit = async (data: { name: string; gender: '男' | '女' }) => {
    setNameLoading(true);
    try {
      const resp = await fetch('/api/names', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await resp.json();
      if (result.success) setNameResult(result.data);
    } catch {}
    setNameLoading(false);
  };
  return (
    <div className="relative min-h-screen bg-[#0a0e1a] text-white font-sans">
      <AtmosphericBg />
      <header className="relative z-10 flex items-center justify-center py-4 px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">☯</span>
          <span className="font-serif text-amber-200 text-base">{TAB_TITLES[currentTab]}</span>
        </div>
      </header>
      <main className="relative z-10 px-3 pb-24 max-w-md mx-auto">
        {currentTab === 'report' && <FortuneReport />}
        {currentTab === 'names' && (
          nameLoading ? <div className="flex justify-center items-center min-h-[50vh]"><div className="text-amber-400/70 text-sm animate-pulse">☯ 姓名解析中...</div></div>
          : nameResult ? <NameResult name={nameResult.name} score={nameResult} />
          : <NameInputCard onSubmit={handleNameSubmit} />
        )}
        {currentTab === 'calendar' && <SelectDate />}
        {currentTab === 'fengshui' && <FengShui />}
        {currentTab === 'guanyin' && <Guanyin />}
      </main>
      <TabNav activeTab={currentTab} onTabChange={onTabChange} />
      <DonationSidebar />
    </div>
  );
}

// ─── Desktop Layout — each tab = one page ───
function DesktopLayout({ currentTab, onTabChange }: { currentTab: TabId; onTabChange: (t: TabId) => void }) {
  const [nameResult, setNameResult] = useState<any>(null);
  const [nameLoading, setNameLoading] = useState(false);

  const handleNameSubmit = async (data: { name: string; gender: '男' | '女' }) => {
    setNameLoading(true);
    try {
      const resp = await fetch('/api/names', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await resp.json();
      if (result.success) setNameResult(result.data);
    } catch {}
    setNameLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0e1a] text-white font-sans">
      <AtmosphericBg />
      <DonationSidebar />

      {/* Top header */}
      <header className="relative z-20 flex items-center justify-center py-4 px-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">☯</span>
          <span className="font-serif text-amber-200 text-base">FortuneAI</span>
        </div>
      </header>

      {/* Top tab nav — centered */}
      <div className="relative z-20 flex justify-center px-4 mb-6">
        <nav className="flex items-center gap-1 bg-[#0d1525]/90 backdrop-blur-md border border-amber-900/30 rounded-full px-2 py-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { onTabChange(tab.id); setNameResult(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
                currentTab === tab.id
                  ? 'bg-amber-900/60 text-amber-300 border border-amber-700/40'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content — centered */}
      <div className="relative z-10 px-6 pb-8 flex justify-center">
        <div className="w-full" style={{ maxWidth: '860px' }}>
          {currentTab === 'report' && <FortuneReport />}
          {currentTab === 'names' && (
            nameLoading ? (
              <div className="flex justify-center items-center min-h-[50vh]"><div className="text-amber-400/70 text-sm animate-pulse">☯ 姓名解析中...</div></div>
            ) : nameResult ? (
              <NameResult name={nameResult.name} score={nameResult} />
            ) : (
              <NameInputCard onSubmit={handleNameSubmit} />
            )
          )}
          {currentTab === 'calendar' && <SelectDate />}
          {currentTab === 'fengshui' && <FengShui />}
          {currentTab === 'guanyin' && <Guanyin />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const isMobile = useIsMobile();
  const [currentTab, setCurrentTab] = useState<TabId>('report');
  return isMobile
    ? <MobileLayout currentTab={currentTab} onTabChange={setCurrentTab} />
    : <DesktopLayout currentTab={currentTab} onTabChange={setCurrentTab} />;
}
