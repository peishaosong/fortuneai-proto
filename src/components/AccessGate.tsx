import { useState, useEffect } from 'react';

const VALID_CODES = ['FORTUNE2026', 'TEST123', 'FREE'];

interface AccessGateProps {
  children: React.ReactNode;
}

export function AccessGate({ children }: AccessGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const saved = localStorage.getItem('fortune_access');
    if (saved && VALID_CODES.includes(saved)) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('请输入访问码');
      return;
    }

    setLoading(true);
    setError('');

    // 模拟验证延迟
    await new Promise(r => setTimeout(r, 500));

    if (VALID_CODES.includes(code.trim().toUpperCase())) {
      localStorage.setItem('fortune_access', code.trim().toUpperCase());
      setIsAuthenticated(true);
    } else {
      setError('访问码无效，请联系客服获取');
    }

    setLoading(false);
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-900/60 to-orange-900/40 flex items-center justify-center text-3xl">
            ☯
          </div>
          <h1 className="font-serif text-2xl text-amber-200 mb-2">FortuneAI</h1>
          <p className="text-gray-500 text-sm">AI命理智能体 · 限时体验</p>
        </div>

        {/* Access Form */}
        <div className="fate-card rounded-2xl p-6">
          <div className="text-center mb-4">
            <p className="text-amber-400/80 text-sm">
              输入访问码解锁服务
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="输入访问码"
                className="w-full bg-gray-900/60 border border-amber-900/40 rounded-lg px-4 py-3 text-center text-lg tracking-widest text-amber-200 placeholder-gray-600 focus:outline-none focus:border-amber-600/60 transition-all"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-medium text-amber-100 bg-gradient-to-r from-amber-900/60 via-amber-800/40 to-amber-900/60 border border-amber-700/40 hover:from-amber-800/70 hover:via-amber-700/50 hover:to-amber-800/70 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
            >
              {loading ? '验证中...' : '解锁服务 →'}
            </button>
          </form>

          {/* How to get code */}
          <div className="mt-6 pt-4 border-t border-amber-900/20">
            <p className="text-gray-500 text-xs text-center mb-3">如何获取访问码？</p>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-amber-600">①</span>
                <span>扫码关注公众号或加入社群</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-600">②</span>
                <span>支付 ¥9.9 获取访问码</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-600">③</span>
                <span>输入访问码即可体验全部功能</span>
              </div>
            </div>
          </div>

          {/* Free trial hint */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs">
              试用码：<span className="text-amber-700/60 cursor-pointer" onClick={() => setCode('FREE')}>FREE</span>
            </p>
          </div>
        </div>

        {/* Features preview */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {[
            { icon: '🀄', label: '八字精批' },
            { icon: '🏮', label: '风水堪舆' },
            { icon: '📝', label: '姓名吉凶' },
            { icon: '📅', label: '择日避凶' },
          ].map((f) => (
            <div key={f.label} className="text-center py-3 rounded-xl bg-white/5 border border-amber-900/10">
              <div className="text-lg mb-1">{f.icon}</div>
              <span className="text-xs text-gray-400">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}