import { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { BaZiInputCard } from './components/BaZiInputCard';
import { ChatBubble } from './components/ChatBubble';
import { MingPan } from './components/MingPan';
import { MessageInput } from './components/MessageInput';
import { AccessGate } from './components/AccessGate';
import type { FateReport, ChatMessage, FateFeature } from './types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// 调用后端API获取八字命盘
async function fetchBaZiReport(date: string, time: string, gender: '男' | '女'): Promise<any> {
  const resp = await fetch(`${API_BASE}/api/bazi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ birth_date: date, birth_time: time, gender }),
  });
  const data = await resp.json();
  if (!data.success) throw new Error(data.detail || 'API error');
  return data.data;
}

// 调用后端AI对话
async function fetchChat(message: string, birthInfo?: any, topic?: string): Promise<string> {
  const resp = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      birth_info: birthInfo,
      topic,
    }),
  });
  const data = await resp.json();
  if (!data.success) return data.reply || '☯ 服务器繁忙，请稍后再试...';
  return data.reply;
}

// 转换后端数据为前端格式
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
      embryo: palace?.embryo || '',
    },
  } as unknown as FateReport;
}

const featureTitles: Record<FateFeature, { title: string; desc: string }> = {
  bazi: { title: '八字精批', desc: '剖析命局，洞悉人生起伏' },
  fengshui: { title: '风水堪舆', desc: '磁场分析，环境能量调理' },
  names: { title: '姓名吉凶', desc: '姓名五行，命运影响解析' },
  zairi: { title: '择日避凶', desc: '吉日良辰，事事顺遂' },
};

function App() {
  const [activeFeature, setActiveFeature] = useState<FateFeature>('bazi');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentReport, setCurrentReport] = useState<FateReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleBaZiSubmit = async (data: { date: string; time: string; gender: '男' | '女' }) => {
    // 添加用户消息
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: `出生于 ${data.date} ${data.time}，性别${data.gender}`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // 显示加载状态
    setIsLoading(true);
    const loadingMsg: ChatMessage = {
      id: 'loading',
      role: 'ai',
      content: '☯ 正在排盘分析，请稍候...',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMsg]);

    try {
      // 调用真实API
      const apiData = await fetchBaZiReport(data.date, data.time, data.gender);
      const report = convertToFateReport(apiData);
      setCurrentReport(report);

      // 替换加载消息
      setMessages((prev) => {
        const withoutLoading = prev.filter((m) => m.id !== 'loading');
        return [
          ...withoutLoading,
          {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            content: `命盘已生成，请查看下方分析结果。\n\n您可以继续追问关于此命局的任何问题。`,
            timestamp: new Date(),
            report,
          },
        ];
      });

      // 调用AI对命盘做初步解读
      const initialReply = await fetchChat('请简要介绍一下这个命盘的特点', apiData);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: 'ai',
          content: initialReply,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const withoutLoading = prev.filter((m) => m.id !== 'loading');
        return [
          ...withoutLoading,
          {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            content: '☯ 排盘失败，请稍后重试。',
            timestamp: new Date(),
          },
        ];
      });
    }
    setIsLoading(false);
  };

  const handleSendMessage = async (message: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setIsLoading(true);
    const loadingMsg: ChatMessage = {
      id: 'loading',
      role: 'ai',
      content: '☯ 正在分析...',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMsg]);

    try {
      const reply = await fetchChat(message, currentReport ? {
        date: currentReport.birthInfo.date,
        time: currentReport.birthInfo.time,
        gender: currentReport.birthInfo.gender,
      } : undefined);

      setMessages((prev) => {
        const withoutLoading = prev.filter((m) => m.id !== 'loading');
        return [
          ...withoutLoading,
          {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            content: reply,
            timestamp: new Date(),
          },
        ];
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const withoutLoading = prev.filter((m) => m.id !== 'loading');
        return [
          ...withoutLoading,
          {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            content: '☯ 分析失败，请稍后重试。',
            timestamp: new Date(),
          },
        ];
      });
    }
    setIsLoading(false);
  };

  return (
    <AccessGate>
    <div className="min-h-screen bg-[#0a0e1a] flex flex-col">
      <Header activeFeature={activeFeature} onFeatureChange={setActiveFeature} />

      <main className="flex-1 pt-14 pb-20 max-w-lg mx-auto w-full px-4">
        {/* 功能标题 */}
        <div className="py-4 text-center">
          <h1 className="font-serif text-xl text-amber-200 mb-0.5">
            {featureTitles[activeFeature].title}
          </h1>
          <p className="text-xs text-gray-500">{featureTitles[activeFeature].desc}</p>
        </div>

        {/* 对话区域 */}
        <div className="space-y-3 pb-4">
          {messages.map((msg) => (
            <div key={msg.id}>
              <ChatBubble message={msg} />
              {msg.report && <MingPan report={msg.report} />}
            </div>
          ))}

          {/* 显示当前报告（如果有但还没在消息里显示） */}
          {currentReport && messages.every((m) => !m.report) && (
            <MingPan report={currentReport} />
          )}

          {/* 输入卡片（当没有报告时显示） */}
          {!currentReport && messages.length === 0 && activeFeature === 'bazi' && (
            <BaZiInputCard onSubmit={handleBaZiSubmit} />
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* 底部输入 */}
      {messages.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a] to-transparent pt-6 pb-4 px-4">
          <div className="max-w-lg mx-auto">
            <MessageInput onSend={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      )}

      {/* 底部装饰 */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-900/30 to-transparent pointer-events-none" />
    </div>
    </AccessGate>
  );
}

export default App;