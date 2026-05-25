import { useState } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="bg-gray-900/80 border border-amber-900/30 rounded-2xl flex items-end overflow-hidden">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="继续追问..."
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent px-4 py-3 text-sm text-gray-200 placeholder-gray-600
            focus:outline-none resize-none max-h-32"
          style={{ minHeight: '48px' }}
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="m-1.5 w-10 h-10 rounded-xl flex items-center justify-center
            bg-gradient-to-br from-amber-700/80 to-amber-900/80
            disabled:opacity-30 disabled:cursor-not-allowed
            hover:from-amber-600/80 hover:to-amber-800/80
            active:scale-95 transition-all duration-150"
        >
          <svg className="w-4 h-4 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </form>
  );
}

// ─── Animated typing indicator ───
export function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <div className="typing-dot" style={{ animationDelay: '0ms' }} />
      <div className="typing-dot" style={{ animationDelay: '160ms' }} />
      <div className="typing-dot" style={{ animationDelay: '320ms' }} />
    </div>
  );
}