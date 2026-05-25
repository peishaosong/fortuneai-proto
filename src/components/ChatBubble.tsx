import type { ChatMessage } from '../types';

interface ChatBubbleProps {
  message: ChatMessage;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 30) return '刚刚';
  if (diffSec < 60) return `${diffSec}秒前`;
  if (diffMin < 60) return `${diffMin}分钟前`;
  if (diffHour < 24) return `${diffHour}小时前`;
  if (diffDay < 7) return `${diffDay}天前`;

  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  // Escape HTML, then apply markdown-like formatting
  const content = message.content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-200">$1</strong>')
    .replace(/\n/g, '<br/>');

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div
        className={`max-w-[90%] rounded-2xl px-4 py-3 ${
          isUser ? 'bubble-user bubble-decor-line-user' : 'bubble-ai bubble-decor-line-ai'
        }`}
        style={{
          paddingLeft: isUser ? undefined : '0.875rem',
          paddingRight: isUser ? '0.875rem' : undefined,
        }}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-900/20">
            <div
              className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-xs shadow-md"
              style={{ boxShadow: '0 0 8px rgba(201, 168, 76, 0.2)' }}
            >
              ☯
            </div>
            <span className="text-xs text-amber-400/80 font-medium">FortuneAI</span>
          </div>
        )}

        <div
          className={`text-sm leading-relaxed text-gray-200 break-words`}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <div className={`text-xs mt-2 flex items-center gap-1 ${isUser ? 'text-emerald-600/60' : 'text-gray-600'}`}>
          {isUser ? (
            <span className="inline-block w-1 h-1 rounded-full bg-emerald-500/50" />
          ) : (
            <span className="inline-block w-1 h-1 rounded-full bg-amber-500/50" />
          )}
          {formatRelativeTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}