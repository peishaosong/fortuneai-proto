/**
 * FortuneAI 姓名学 - 前端组件
 */
import { useState } from 'react';
import { type Lang, tv } from '../../i18n';

interface NameInputCardProps {
  onSubmit: (data: { name: string; gender: '男' | '女' }) => void;
  lang?: Lang;
}

export function NameInputCard({ onSubmit, lang = 'zh' }: NameInputCardProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'男' | '女'>('男');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length >= 2) {
      onSubmit({ name: name.trim(), gender });
    }
  };

  return (
    <div className="fate-card rounded-2xl p-5 animate-fade-in w-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-900/40 to-amber-950/60 border border-amber-700/40 flex items-center justify-center">
          <span className="text-xl">✍️</span>
        </div>
        <div>
          <h2 className="font-serif text-lg text-amber-200 leading-none">{tv({ zh: '姓名解析', en: 'Name Analysis' }, lang)}</h2>
          <p className="text-[10px] text-gray-500 mt-0.5">{tv({ zh: '输入姓名，获取姓名评分与五行分析', en: 'Get name score and Five Elements analysis' }, lang)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* 姓名输入 */}
        <div>
          <label className="block text-[10px] text-amber-400/70 mb-1 uppercase tracking-wider">{tv({ zh: '姓名', en: 'Name' }, lang)}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={tv({ zh: '请输入姓名（如：张伟）', en: 'Enter name (e.g. Zhang Wei)' }, lang)}
            maxLength={4}
            className="w-full rounded-lg px-4 py-3 text-lg text-gray-200 bg-gray-900/70 border border-amber-700/40 focus:outline-none focus:border-amber-500/70 transition-all text-center font-serif tracking-widest"
          />
          <p className="text-[10px] text-gray-600 mt-1 text-center">{tv({ zh: '单名或双名皆可', en: 'Single or double character names' }, lang)}</p>
        </div>

        {/* 性别 + 按钮 */}
        <div className="grid grid-cols-3 gap-2 items-end">
          <div>
            <label className="block text-[10px] text-amber-400/70 mb-1 uppercase tracking-wider">{tv({ zh: '性别', en: 'Gender' }, lang)}</label>
            <div className="grid grid-cols-2 gap-1">
              {(['男', '女'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all ${
                    gender === g
                      ? 'bg-amber-900/50 text-amber-200 border border-amber-600/50'
                      : 'bg-gray-900/40 text-gray-400 border border-gray-700/50'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] text-transparent mb-1">&nbsp;</label>
            <button
              type="submit"
              disabled={name.trim().length < 2}
              className="w-full py-3 rounded-xl font-medium text-amber-100 bg-gradient-to-r from-amber-900/70 via-amber-800/50 to-amber-900/70 border border-amber-600/50 hover:from-amber-800/80 hover:via-amber-700/60 hover:to-amber-800/80 active:scale-[0.98] transition-all text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {tv({ zh: '开始解析 →', en: 'Analyze →' }, lang)}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}