/**
 * FortuneAI 功能即将上线占位页
 */
interface ComingSoonProps {
  icon: string;
  title: string;
  description: string;
}

export function ComingSoon({ icon, title, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-fade-in">
      {/* 装饰圆环 */}
      <div className="relative mb-6">
        <div className="w-28 h-28 rounded-full border-2 border-dashed border-amber-700/40 flex items-center justify-center">
          <span className="text-5xl">{icon}</span>
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-900/60 border border-amber-700/40 flex items-center justify-center">
          <span className="text-base">🔒</span>
        </div>
      </div>

      {/* 标题 */}
      <h2 className="font-serif text-xl text-amber-200 mb-2">{title}</h2>

      {/* 副标题 */}
      <p className="text-amber-500/60 text-sm mb-6">{description}</p>

      {/* 预告列表 */}
      <div className="w-full max-w-xs space-y-2 text-left">
        {[
          'AI智能分析，精准解读',
          '一键生成完整报告',
          '可生成分享海报',
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-gray-400 bg-gray-900/40 rounded-lg px-3 py-2 border border-amber-900/10">
            <span className="text-amber-600">✦</span>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* 提示 */}
      <div className="mt-8 px-4 py-3 rounded-xl bg-amber-900/10 border border-amber-700/20 text-center">
        <p className="text-amber-400/80 text-xs">☺️ 功能开发中，即将上线</p>
        <p className="text-amber-600/60 text-[10px] mt-1">关注公众号，第一时间体验</p>
      </div>
    </div>
  );
}
