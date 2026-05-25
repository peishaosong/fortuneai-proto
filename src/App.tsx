import { useState, useRef, useEffect } from 'react';
import { BaZiInputCard } from './components/BaZiInputCard';
import { NameInputCard } from './components/names/NameInputCard';
import { NameResult } from './components/names/NameResult';
import { ChatBubble } from './components/ChatBubble';
import { MingPan } from './components/MingPan';
import { MessageInput, TypingIndicator } from './components/MessageInput';
import { AccessGate } from './components/AccessGate';
import type { FateReport, ChatMessage } from './types';

const API_BASE = '/api';

type View = 'entry' | 'bazi' | 'names';

async function fetchBaZiReport(date: string, time: string, gender: '男' | '女'): Promise<any> {
  const resp = await fetch(`${API_BASE}/bazi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ birth_date: date, birth_time: time, gender }),
  });
  const data = await resp.json();
  if (!data.success) throw new Error(data.detail || 'API error');
  return data.data;
}

async function fetchChat(message: string, birthInfo?: any, baziData?: any): Promise<string> {
  const resp = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, birth_info: birthInfo, bazi_data: baziData }),
  });
  const data = await resp.json();
  if (!data.success) return data.reply || '☯ 服务器繁忙...';
  return data.reply;
}

async function fetchNameAnalysis(name: string, gender: '男' | '女'): Promise<any> {
  const resp = await fetch(`${API_BASE}/names`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, gender }),
  });
  const data = await resp.json();
  if (!data.success) throw new Error(data.detail || 'API error');
  return data.data;
}

function convertToFateReport(apiData: any): FateReport {
  const baZi = apiData.ba_zi;
  const wuXing = apiData.wu_xing;
  const day = apiData.day_master;
  const gods = apiData.gods;
  const daYun = apiData.da_yun;
  const palace = apiData.palace;

  const stemElements: Record<string, string> = {
    甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土',
    庚: '金', 辛: '金', 壬: '水', 癸: '水',
  };

  const makePillar = (p: any) => ({
    stem: p.stem,
    branch: p.branch,
    stemElement: p.stem_element || stemElements[p.stem] || '土',
    branchElement: p.branch_element || '土',
    hidden: p.hidden || [],
  });

  return {
    name: '命运分析报告',
    birthInfo: {
      date: apiData.birth_info?.date || '',
      time: apiData.birth_info?.time || '',
      gender: apiData.birth_info?.gender || '男',
    },
    baZi: {
      year: makePillar(baZi.year),
      month: makePillar(baZi.month),
      day: makePillar(baZi.day),
      hour: makePillar(baZi.hour),
    },
    wuXing: {
      木: Math.round(wuXing.木),
      火: Math.round(wuXing.火),
      土: Math.round(wuXing.土),
      金: Math.round(wuXing.金),
      水: Math.round(wuXing.水),
    },
    dayMaster: {
      stem: day.stem,
      element: day.element,
      strength: day.strength,
    },
    gods: {
      useful: gods.useful || [],
      avoid: gods.avoid || [],
    },
    daYun: daYun.map((d: any) => ({
      age: d.age,
      year: d.year,
      stem: d.stem,
      branch: d.branch,
      description: d.trend || '大运平稳',
    })),
    palace: {
      life: palace?.life || '迁移宫',
      body: palace?.body || '夫妻宫',
    },
  } as unknown as FateReport;
}

// ─── Atmospheric Background ───
function AtmosphericBg() {
  return (
    <div className="atmospheric-root" aria-hidden="true">
      {/* Deep gradient layers */}
      <div className="atmospheric-layer-1" />
      <div className="atmospheric-layer-2" />
      <div className="atmospheric-layer-3" />

      {/* Radial glow orbs */}
      <div className="atmospheric-orb atmospheric-orb--1" />
      <div className="atmospheric-orb atmospheric-orb--2" />
      <div className="atmospheric-orb atmospheric-orb--3" />

      {/* Star field */}
      <StarField />

      {/* Subtle TaiJi pattern */}
      <div className="atmospheric-taiji" />
    </div>
  );
}

function StarField() {
  const stars = Array.from({ length: 80 }, (_, i) => {
    const x = ((i * 137.508) % 100);
    const y = ((i * 73.254) % 100);
    const size = ((i * 17) % 3) + 1;
    const opacity = 0.1 + ((i * 31) % 5) * 0.08;
    const delay = ((i * 1.3) % 4);
    return { x, y, size, opacity, delay };
  });

  return (
    <div className="starfield">
      {stars.map((s, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Header ───
function AppHeader({ onBack, showBack }: { onBack?: () => void; showBack?: boolean }) {
  return (
    <header className="app-header">
      <div className="flex items-center gap-3">
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-gray-800/50 border border-amber-700/30 flex items-center justify-center text-amber-400 hover:bg-amber-900/30 transition-all text-sm"
          >
            ←
          </button>
        )}
        <div className="app-logo">
          <div className="app-logo-icon">☯</div>
          <div className="app-logo-text">
            <span className="app-logo-name">FortuneAI</span>
            <span className="app-logo-badge">AI</span>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Entry Page ───
function EntryPage({
  onBaZiSubmit,
  onNamesSubmit,
}: {
  onBaZiSubmit: (data: { date: string; time: string; gender: '男' | '女' }) => void;
  onNamesSubmit: (data: { name: string; gender: '男' | '女' }) => void;
}) {
  return (
    <div className="entry-root">
      <BaZiInputCard onSubmit={onBaZiSubmit} />
      <NameInputCard onSubmit={onNamesSubmit} />

      {/* Bottom tagline */}
      <p className="entry-tagline">
        ☯ 命由天定，运由心生
      </p>
    </div>
  );
}

// ─── Main App ───
function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentReport, setCurrentReport] = useState<FateReport | null>(null);
  const [currentView, setCurrentView] = useState<View>('entry');
  const [nameResult, setNameResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleBack = () => {
    setCurrentView('entry');
    setMessages([]);
    setCurrentReport(null);
    setNameResult(null);
  };

  const handleBaZiSubmit = async (data: { date: string; time: string; gender: '男' | '女' }) => {
    setCurrentView('bazi');
    setMessages([{ id: 'loading', role: 'ai', content: '☯ 正在排盘分析，请稍候...', timestamp: new Date() }]);
    setIsLoading(true);

    try {
      const apiData = await fetchBaZiReport(data.date, data.time, data.gender);
      const report = convertToFateReport(apiData);
      setCurrentReport(report);

      setMessages([
        { id: Date.now().toString(), role: 'ai', content: '命盘已生成，继续追问。', timestamp: new Date(), report },
      ]);

      const initialReply = await fetchChat('请简要介绍一下这个命盘的特点', undefined, apiData);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'ai', content: initialReply, timestamp: new Date() },
      ]);
    } catch {
      setMessages([{ id: (Date.now() + 1).toString(), role: 'ai', content: '☯ 排盘失败，请稍后重试。', timestamp: new Date() }]);
    }
    setIsLoading(false);
  };

  const handleNamesSubmit = async (data: { name: string; gender: '男' | '女' }) => {
    setCurrentView('names');
    setIsLoading(true);

    try {
      const result = await fetchNameAnalysis(data.name, data.gender);
      setNameResult(result);
    } catch {
      setNameResult(null);
    }
    setIsLoading(false);
  };

  const handleSendMessage = async (message: string) => {
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: message, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const reply = await fetchChat(
        message,
        currentReport ? {
          date: currentReport.birthInfo.date,
          time: currentReport.birthInfo.time,
          gender: currentReport.birthInfo.gender,
        } : undefined,
        currentReport ? { ba_zi: { year: { stem: currentReport.baZi.year.stem, branch: currentReport.baZi.year.branch, hidden: currentReport.baZi.year.hidden }, month: { stem: currentReport.baZi.month.stem, branch: currentReport.baZi.month.branch, hidden: currentReport.baZi.month.hidden }, day: { stem: currentReport.baZi.day.stem, branch: currentReport.baZi.day.branch, hidden: currentReport.baZi.day.hidden }, hour: { stem: currentReport.baZi.hour.stem, branch: currentReport.baZi.hour.branch, hidden: currentReport.baZi.hour.hidden } }, wu_xing: currentReport.wuXing, day_master: { stem: currentReport.dayMaster.stem, element: currentReport.dayMaster.element, strength: currentReport.dayMaster.strength }, gods: currentReport.gods, da_yun: currentReport.daYun } : undefined
      );
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', content: reply, timestamp: new Date() }]);
    } catch {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', content: '☯ 分析失败。', timestamp: new Date() }]);
    }
    setIsLoading(false);
  };

  return (
    <AccessGate>
      <div className="app-root">
        {/* Atmospheric background — always present */}
        <AtmosphericBg />

        {/* Header overlay */}
        <AppHeader onBack={handleBack} showBack={currentView !== 'entry'} />

        {/* Main content */}
        <main className="app-main">
          {currentView === 'entry' ? (
            <EntryPage onBaZiSubmit={handleBaZiSubmit} onNamesSubmit={handleNamesSubmit} />
          ) : currentView === 'names' ? (
            <div className="chat-root">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="text-amber-400/70 text-sm animate-pulse">☯ 姓名解析中...</div>
                </div>
              ) : nameResult ? (
                <NameResult name={nameResult.name} score={nameResult} />
              ) : (
                <div className="text-center text-gray-500 py-20">解析失败，请返回重试</div>
              )}
            </div>
          ) : (
            <div className="chat-root">
              {messages.map((msg) => (
                <div key={msg.id}>
                  <ChatBubble message={msg} />
                  {msg.report && <MingPan report={msg.report} />}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bubble-ai rounded-2xl px-4 py-3 max-w-[85%]">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-900/20">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-xs">☯</div>
                      <span className="text-xs text-amber-400/80 font-medium">FortuneAI</span>
                    </div>
                    <TypingIndicator />
                    <div className="text-xs text-amber-500/60 mt-2">☯ AI分析中，请稍候...</div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Bottom input */}
        {currentView === 'bazi' && messages.length > 0 && (
          <div className="app-input-bar">
            <div className="app-input-inner">
              <MessageInput onSend={handleSendMessage} disabled={isLoading} />
            </div>
          </div>
        )}
      </div>
    </AccessGate>
  );
}

export default App;