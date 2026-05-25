import type { FateFeature } from '../types';

interface HeaderProps {
  activeFeature: FateFeature;
  onFeatureChange: (feature: FateFeature) => void;
}

const features: { key: FateFeature; label: string; icon: string }[] = [
  { key: 'bazi', label: '八字排盘', icon: '☰' },
  { key: 'fengshui', label: '风水堪舆', icon: '☲' },
  { key: 'names', label: '姓名吉凶', icon: '✦' },
  { key: 'zairi', label: '择日避凶', icon: '日' },
];

export function Header({ activeFeature, onFeatureChange }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 fate-card border-b"
      style={{ borderBottom: '1px solid rgba(201, 168, 76, 0.25)' }}>
      {/* 金色分隔线 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 5%, rgba(201, 168, 76, 0.5) 30%, rgba(201, 168, 76, 0.5) 70%, transparent 95%)',
        }}
      />

      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-lg shadow-md"
              style={{ boxShadow: '0 0 12px rgba(201, 168, 76, 0.2)' }}
            >
              ☯
            </div>
            <span className="font-serif text-lg font-semibold text-amber-200">
              FortuneAI
            </span>
          </div>

          {/* 导航标签 */}
          <nav className="flex gap-1">
            {features.map((f) => (
              <button
                key={f.key}
                onClick={() => onFeatureChange(f.key)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  activeFeature === f.key
                    ? 'bg-amber-900/40 text-amber-200 border border-amber-700/50'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <span className="mr-1">{f.icon}</span>
                <span className="hidden sm:inline">{f.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}