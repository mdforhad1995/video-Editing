import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Phone,
  Sparkles,
  ArrowRight,
  Minimize2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { CLIPPASIA_INFO } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface Message {
  id: string;
  sender: 'editor' | 'user';
  text: string;
  timestamp: string;
  actionButton?: {
    label: string;
    action: () => void;
  };
}

interface LiveChatModalProps {
  onBookService: (tierName?: string, notes?: string) => void;
  onClaimTestEdit: () => void;
}

export const LiveChatModal: React.FC<LiveChatModalProps> = ({
  onBookService,
  onClaimTestEdit
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasUnread, setHasUnread] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'editor',
      text: "Hey! 👋 I'm Arif, Lead Post-Production Supervisor at Clippasia. Looking to edit an eCommerce ad, YouTube long-form video, or viral TikTok reels?",
      timestamp: 'Just now'
    },
    {
      id: 'welcome-2',
      sender: 'editor',
      text: "Ask me anything about our 24-48h delivery SLAs, DaVinci Resolve color grading, or send your raw footage link for a zero-risk 1-minute test edit!",
      timestamp: 'Just now'
    }
  ]);

  const quickPrompts = [
    'How does the 1-minute free test edit work?',
    'What is your turnaround for YouTube videos?',
    'Can you grade Sony S-Log3 footage?',
    'I want to talk directly on WhatsApp'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Simulate smart editor response
    setTimeout(() => {
      setIsTyping(false);
      let replyText = '';
      let actionBtn: { label: string; action: () => void } | undefined = undefined;

      const lower = text.toLowerCase();

      if (lower.includes('free test') || lower.includes('test edit')) {
        replyText =
          "Our 1-minute test edit is 100% free with no credit card needed! Simply share a raw clip link via our form or chat, and our senior editing pod will return a polished cut within 24 hours.";
        actionBtn = {
          label: 'Claim Free Test Edit Now',
          action: () => {
            setIsOpen(false);
            onClaimTestEdit();
          }
        };
      } else if (lower.includes('turnaround') || lower.includes('time') || lower.includes('sla')) {
        replyText =
          "We operate on strict guaranteed SLAs: Short-form (Reels/TikTok/Shorts) takes 24 hours. Full-length YouTube videos (8-15 mins) and DTC ads take 48 hours. If you have an urgent deadline, priority 24h delivery is available.";
        actionBtn = {
          label: 'View Pricing & Turnaround SLAs',
          action: () => {
            setIsOpen(false);
            const el = document.getElementById('pricing');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        };
      } else if (lower.includes('log') || lower.includes('color') || lower.includes('davinci')) {
        replyText =
          "Yes! Our team works in DaVinci Resolve Studio. We calibrate Sony S-Log3, Canon C-Log, Apple Log, and RED RAW into rich Rec.709 or DCI-P3 color spaces with natural skin tone protection and custom 3D LUTs.";
      } else if (lower.includes('whatsapp') || lower.includes('phone') || lower.includes('call')) {
        replyText = `You can chat with our production desk directly on WhatsApp at ${CLIPPASIA_INFO.phoneWhatsApp} or email ${CLIPPASIA_INFO.primaryEmail}. We respond in under 5 minutes!`;
        actionBtn = {
          label: 'Open WhatsApp Chat',
          action: () => {
            window.open('https://wa.me/8801911862115', '_blank');
          }
        };
      } else if (lower.includes('drive') || lower.includes('dropbox') || lower.includes('http') || lower.includes('.com')) {
        replyText =
          "Got your footage link! I'm reviewing the file format now. To lock in your editor queue and delivery slot, submit this brief directly into our intake portal.";
        actionBtn = {
          label: 'Queue This Footage in Booking Form',
          action: () => {
            setIsOpen(false);
            onBookService('Growth eCommerce & YouTube', `Footage link shared via editor live chat: ${text}`);
          }
        };
      } else {
        replyText =
          "Thanks for reaching out! We specialize in high-retention cuts that eliminate viewer drop-off. Would you like a custom quote based on your monthly video volume or a free 1-minute test cut on your own raw clip?";
        actionBtn = {
          label: 'Book Service / Request Quote',
          action: () => {
            setIsOpen(false);
            onBookService('Growth eCommerce & YouTube', `Client inquiry from live chat: "${text}"`);
          }
        };
      }

      const editorReply: Message = {
        id: `editor-${Date.now()}`,
        sender: 'editor',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButton: actionBtn
      };

      setMessages((prev) => [...prev, editorReply]);
    }, 900);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right - offset cleanly on mobile above sticky bar) */}
      {!isOpen && (
        <div className="fixed bottom-20 right-3.5 sm:bottom-6 sm:right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 p-3 sm:px-4 sm:py-3 bg-gradient-to-r from-[#0C101A] via-[#101524] to-[#0A0D16] border border-cyan-500/40 hover:border-cyan-400 rounded-2xl shadow-2xl shadow-cyan-500/20 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/30 cursor-pointer"
            aria-label="Open Live Chat with an Editor"
          >
            {/* Editor Avatar with active status dot */}
            <div className="relative shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs font-mono shadow-md border-2 border-[#0C101A]">
                AR
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 border-2 border-[#0C101A] rounded-full" />
            </div>

            {/* Label and Status */}
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{t('chatButton')}</span>
                <span className="text-[10px] text-cyan-400 font-mono">{t('chatOnline')}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <span>{t('chatTypicallyReplies')}</span>
              </div>
            </div>

            {/* Chat Icon on Mobile */}
            <div className="sm:hidden text-cyan-400">
              <MessageSquare className="w-5 h-5" />
            </div>

            {/* Notification Badge if unread */}
            {hasUnread && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
                1
              </span>
            )}
          </button>
        </div>
      )}

      {/* Live Chat Window Overlay */}
      {isOpen && (
        <div className="fixed bottom-2 inset-x-2 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 w-auto sm:w-[400px] h-[540px] max-h-[85vh] bg-[#090C14] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl">
          
          {/* Header */}
          <div className="p-4 bg-[#0E1322] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs font-mono">
                  AR
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0E1322] rounded-full" />
              </div>

              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Arif R.</span>
                  <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800/40">
                    Lead Editor
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Clippasia Post-Production Desk · Online
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href="https://wa.me/8801911862115"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-emerald-400 hover:bg-slate-800 transition-colors"
                title="Chat on WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-none shadow-md'
                      : 'bg-[#121727] text-slate-200 border border-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}

                  {msg.actionButton && (
                    <div className="mt-2.5 pt-2 border-t border-slate-700/60">
                      <button
                        onClick={msg.actionButton.action}
                        className="w-full py-1.5 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>{msg.actionButton.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-500 font-mono mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-slate-400 text-xs p-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-mono ml-1 text-slate-400">Arif is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Suggestions */}
          <div className="px-3 py-2 bg-[#0C101A] border-t border-slate-800/80 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 text-[11px] font-mono text-slate-400 hover:text-cyan-300 bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#0B0E18] border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask an editor or paste a footage link..."
              className="flex-1 bg-slate-900/90 border border-slate-800 focus:border-cyan-500 text-white placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none transition-colors"
            />

            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white transition-all cursor-pointer shrink-0 shadow-md shadow-cyan-500/20"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Trust strip */}
          <div className="px-3 py-1.5 bg-[#080A10] border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Direct Post-Production Desk</span>
            <span>WhatsApp: {CLIPPASIA_INFO.phoneWhatsApp}</span>
          </div>

        </div>
      )}
    </>
  );
};
