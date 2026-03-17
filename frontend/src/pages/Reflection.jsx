import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Send, Sparkles, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MAX_CHARS = 500;

function TypingIndicator({ slow }) {
  return (
    <div className="flex items-center gap-2">
      {slow
        ? <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            Still thinking… the AI is processing your response
          </div>
        : <div className="flex gap-1 py-1">
            {[0, 150, 300].map(d => (
              <div key={d} className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
            ))}
          </div>
      }
    </div>
  );
}

export function Reflection() {
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [slowResponse, setSlowResponse] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const slowTimerRef   = useRef(null);
  const { user } = useAuth();

  const userName    = user?.user?.name || user?.name || 'there';
  const userInitial = userName[0]?.toUpperCase() || 'U';

  useEffect(() => { fetchConversations(); }, []);
  useEffect(() => {
    if (!initializing) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, initializing]);

  const fetchConversations = async () => {
    try {
      const res   = await api.get('/conversations/history');
      const convs = res.data?.data?.conversations || [];
      if (convs.length === 0) {
        setMessages([{
          role: 'assistant',
          content: `Hello ${userName}! I'm your AI career discovery assistant. Let's start by talking about what made you feel productive or excited today. What activities did you enjoy?`,
          timestamp: new Date(),
        }]);
      } else {
        const sorted = [...convs].reverse();
        setMessages(sorted.flatMap(c => [
          { role: 'user',      content: c.userMessage, timestamp: c.timestamp },
          { role: 'assistant', content: c.aiResponse,  timestamp: c.timestamp },
        ]));
      }
    } catch {
      setMessages([{
        role: 'assistant',
        content: `Hello! I'm your AI career discovery assistant. What activities did you enjoy today?`,
        timestamp: new Date(),
      }]);
    } finally {
      setInitializing(false);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: text, timestamp: new Date() }]);
    setInput('');
    setLoading(true);
    setSlowResponse(false);

    // Show "still thinking" after 5s
    slowTimerRef.current = setTimeout(() => setSlowResponse(true), 5000);

    try {
      const res     = await api.post('/conversations/message', { message: text });
      const data    = res.data?.data || res.data;
      const aiText  = data.conversation?.aiResponse || data.aiResponse || data.message;
      if (!aiText) throw new Error('No response');
      setMessages(prev => [...prev, { role: 'assistant', content: aiText, timestamp: new Date() }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      clearTimeout(slowTimerRef.current);
      setLoading(false);
      setSlowResponse(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const charsLeft = MAX_CHARS - input.length;

  return (
    <DashboardLayout title="AI Reflection">
      <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">

          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-700 rounded-full flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">AI Career Assistant</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Online · Reflecting on your journey</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {initializing ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400 dark:text-gray-500">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                  <p className="text-sm">Loading your conversations...</p>
                </div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                      msg.role === 'assistant'
                        ? 'bg-gradient-to-br from-primary to-indigo-700 text-white'
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                    }`}>
                      {msg.role === 'assistant' ? <Sparkles className="w-3.5 h-3.5" /> : userInitial}
                    </div>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      msg.role === 'assistant'
                        ? 'bg-slate-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-tl-sm'
                        : 'bg-primary text-white rounded-tr-sm'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${msg.role === 'assistant' ? 'text-gray-400 dark:text-gray-500' : 'text-white/60'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-indigo-700 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-2.5">
                      <TypingIndicator slow={slowResponse} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                  onKeyDown={handleKeyDown}
                  placeholder="Share your thoughts… (Enter to send)"
                  disabled={loading || initializing}
                  rows={1}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 resize-none text-sm bg-white dark:bg-slate-700 dark:text-gray-100 dark:placeholder-gray-400"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                {input.length > MAX_CHARS * 0.8 && (
                  <span className={`absolute right-3 bottom-2 text-[10px] ${charsLeft < 50 ? 'text-red-400' : 'text-gray-400'}`}>
                    {charsLeft}
                  </span>
                )}
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || loading || initializing}
                className="h-11 w-11 p-0 flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 pl-1">
              Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-slate-600 rounded text-[10px]">Enter</kbd> to send ·{' '}
              <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-slate-600 rounded text-[10px]">Shift+Enter</kbd> for new line
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
