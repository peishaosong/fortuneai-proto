/**
 * FortuneAI 底部Tab导航
 * 手机风格固定底部
 */
import { type Lang, tv } from '../i18n';

export type TabId = 'report' | 'names' | 'calendar' | 'fengshui' | 'guanyin';

const TABS = [
  { id: 'report' as TabId, icon: '📜' },
  { id: 'names' as TabId, icon: '✍️' },
  { id: 'calendar' as TabId, icon: '📅' },
  { id: 'fengshui' as TabId, icon: '🏠' },
  { id: 'guanyin' as TabId, icon: '🔮' },
];

const TAB_LABELS: Record<TabId, { zh: string; en: string }> = {
  report: { zh: '运势报告', en: 'Fortune Reading' },
  names: { zh: '姓名解析', en: 'Name Analysis' },
  calendar: { zh: '择日吉凶', en: 'Date Selection' },
  fengshui: { zh: '风水堪舆', en: 'Feng Shui' },
  guanyin: { zh: '观音灵签', en: 'Guanyin Divination' },
};

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  lang?: Lang;
}

export function TabNav({ activeTab, onTabChange, lang = 'zh' }: TabNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0e1a]/95 backdrop-blur-md border-t border-amber-900/30 safe-area-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center py-2 px-1 min-w-[60px] transition-all ${
              activeTab === tab.id
                ? 'text-amber-400'
                : 'text-gray-500 hover:text-gray-400'
            }`}
          >
            <span className="text-xl mb-0.5">{tab.icon}</span>
            <span className="text-[10px] tracking-wide">{tv(TAB_LABELS[tab.id], lang)}</span>
            {activeTab === tab.id && (
              <div className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}