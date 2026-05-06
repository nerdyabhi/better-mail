"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minimize2, Maximize2, SendHorizontal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const suggestionChips = [
  "Recent design feedback",
  "Reply to Nick",
  "Find invoice from Adobe",
];

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const container = messagesEndRef.current?.parentElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "This is a demo interface. Sign up to unlock the real AI assistant! 🚀",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div
      id="ai"
      className="w-full relative flex items-center justify-center flex-col bg-white mx-auto px-4 py-8 md:py-12"
    >
      {/* Grid Pattern Overlay */}
      <div
        className="absolute z-0 inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)]"
        style={{
          backgroundSize: "50px 50px",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,1) 50%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,1) 60%, transparent 50%)",
        }}
      />
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center z-20 mb-8 md:mb-12"
      >
        <h1 className="bg-clip-text z-20 text-transparent bg-linear-to-b from-neutral-950 to-neutral-400 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-instrument leading-tight">
          Ask AI Anything
        </h1>

        <p className="text-neutral-600 text-base md:text-lg">
          Advanced AI model, understands you well.
        </p>
      </motion.div>

      {/* Chat Window - Fixed width */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white z-20 w-full max-w-lg rounded-2xl border border-neutral-200 overflow-hidden shadow-xl"
      >
        {/* Window Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
            >
              <X className="w-2 h-2 text-transparent" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"
            >
              <Minimize2 className="w-2 h-2 text-transparent" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
            >
              <Maximize2 className="w-2 h-2 text-transparent" />
            </motion.button>
          </div>

          <span className="text-sm text-neutral-600 font-medium">New chat</span>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(245, 245, 245, 1)",
              }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Plus className="w-4 h-4 text-neutral-600" />
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(245, 245, 245, 1)",
              }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Minimize2 className="w-4 h-4 text-neutral-600" />
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(245, 245, 245, 1)",
              }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Maximize2 className="w-4 h-4 text-neutral-600" />
            </motion.button>
          </div>
        </div>

        {/* Chat Content */}
        <div className="h-125 flex flex-col bg-gray-50/30">
          {messages.length === 0 ? (
            <EmptyState onSuggestionClick={handleSend} />
          ) : (
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <AnimatePresence>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </AnimatePresence>
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask Bettermail to do anything..."
                className="w-full bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 rounded-xl px-4 py-3 pr-12 outline-none border border-neutral-200 focus:border-neutral-300 focus:bg-white transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <SendHorizontal className="w-5 h-5 text-black" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function EmptyState({
  onSuggestionClick,
}: {
  onSuggestionClick: (text: string) => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      {/* Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.3,
        }}
        className="mb-8"
      >
        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-50 to-purple-50 border border-neutral-200 flex items-center justify-center shadow-sm">
          <Image
            src="/betterMailLogo.png"
            width={500}
            height={500}
            alt="AI"
            className="w-10 rounded-lg h-10"
          />
        </div>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center mb-8"
      >
        <h3 className="text-neutral-900 text-lg font-semibold mb-2">
          Ask anything about your emails
        </h3>
        <p className="text-neutral-500 text-sm">
          Ask to do or show anything using natural language
        </p>
      </motion.div>

      {/* Suggestion Chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex flex-wrap gap-2 justify-center max-w-2xl"
      >
        {suggestionChips.map((suggestion, index) => (
          <motion.button
            key={suggestion}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: 0.8 + index * 0.1,
              type: "spring",
              stiffness: 300,
            }}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(250, 250, 250, 1)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-4 py-2 bg-white hover:bg-neutral-50 text-neutral-700 text-sm rounded-lg border border-neutral-200 transition-colors shadow-sm"
          >
            {suggestion}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex items-start gap-3 ${
        message.isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0">
        <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center overflow-hidden shadow-sm">
          {message.isUser ? (
            <Image
              src="/abhisharma.webp"
              width={200}
              height={200}
              alt="User"
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src="/betterMailLogo.png"
              width={200}
              height={200}
              alt="AI"
              className="w-5 rounded-md h-5"
            />
          )}
        </div>
      </div>

      {/* Message Bubble + CTA */}
      <div className="flex flex-col gap-2 max-w-[70%]">
        <div
          className={`rounded-2xl px-4 py-3 ${
            message.isUser
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-neutral-900 border border-neutral-200 shadow-sm"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
          <p
            className={`text-[10px] mt-1 ${
              message.isUser ? "text-blue-100" : "text-neutral-400"
            }`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* CTA after bot response */}
        {!message.isUser && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.35, ease: "easeOut" }}
          >
            <Link
              href="/auth"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-950 text-white text-[11px] font-semibold hover:bg-neutral-700 transition-colors duration-200 shadow-sm active:scale-95"
            >
              Try it, it&apos;s free 🎉
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-start gap-3"
    >
      <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shadow-sm">
        <Image
          src="/betterMailLogo.png"
          width={20}
          height={20}
          alt="AI"
          className="w-5 h-5 rounded-lg"
        />
      </div>
      <div className="bg-white border border-neutral-200 rounded-2xl px-4 py-3 flex items-center gap-1 shadow-sm">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
            className="w-2 h-2 rounded-full bg-neutral-400"
          />
        ))}
      </div>
    </motion.div>
  );
}
