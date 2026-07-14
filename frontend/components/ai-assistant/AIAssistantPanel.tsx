"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  IconX,
  IconArrowsMaximize,
  IconChevronLeft,
} from "@tabler/icons-react";
import { useAIStore } from "@/lib/store/ui.store";
import {
  useCreateConversation,
  useCreateMessage,
} from "@/features/conversations/conversations.query";
import { ConversationList } from "./ConversationList";
import { ConversationView } from "./ConversationView";
import { AIInput } from "./AIInput";
import { useStreamingMessage } from "@/lib/store/conversations.store";
import { cn } from "@/lib/utils";

function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    const getFocusableElements = () =>
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    // Focus the first focusable element when the trap activates
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [containerRef, isActive]);
}

export function AIAssistantPanel() {
  const {
    activeAIConversationId,
    setAIAssistantOpen,
    setAIMode,
    setActiveAIConversationId,
  } = useAIStore();

  const [draft, setDraft] = useState("");
  const { mutate: createConversation, isPending: creating } =
    useCreateConversation();
  const { mutate: sendMessage, isPending: sending } = useCreateMessage();
  const streamingState = useStreamingMessage(
    activeAIConversationId ?? "__none__",
  );
  const isStreaming = !!streamingState?.isStreaming;

  const handleSubmit = () => {
    const content = draft.trim();
    if (!content) return;
    setDraft("");

    console.log("[AIPanel] handleSubmit called", { content, activeAIConversationId });

    if (!activeAIConversationId) {
      console.log("[AIPanel] No active conversation — creating one…");
      createConversation(undefined, {
        onSuccess: (res) => {
          console.log("[AIPanel] Conversation created:", res.conversationId);
          setActiveAIConversationId(res.conversationId);
          // Give ConversationView a tick to mount + subscribe to Pusher before sending
          setTimeout(() => {
            console.log("[AIPanel] Sending message after 300ms delay to:", res.conversationId);
            sendMessage({ conversationId: res.conversationId, content });
          }, 300);
        },
      });
    } else {
      console.log("[AIPanel] Sending message to existing conversation:", activeAIConversationId);
      sendMessage({ conversationId: activeAIConversationId, content });
    }
  };

  const hasConversation = !!activeAIConversationId;
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, true);

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className={cn(
        "fixed z-50 flex flex-col overflow-hidden",
        "border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#111009]",
        "shadow-2xl dark:shadow-none",
        // Mobile: full-width bottom sheet
        "inset-x-0 bottom-0 h-[88dvh] rounded-t-2xl rounded-b-none",
        // Desktop: floating panel
        "sm:inset-x-auto sm:bottom-20 sm:right-6 sm:w-115 sm:h-145 sm:rounded-2xl",
      )}
      style={{
        backdropFilter: "blur(24px) saturate(1.4)",
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.06), 0 32px 72px rgba(0,0,0,0.18), 0 4px 20px rgba(0,0,0,0.10)",
      }}
    >
      {/* Mobile drag handle */}
      <div className="sm:hidden flex justify-center pt-2.5 pb-0.5 shrink-0">
        <div className="w-9 h-1 rounded-full bg-neutral-300 dark:bg-white/15" />
      </div>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-neutral-100 dark:border-white/8 bg-neutral-50/80 dark:bg-[#0e0c0a] shrink-0">
        {hasConversation ? (
          <button
            onClick={() => setActiveAIConversationId(null)}
            className="p-1.5 rounded-lg text-neutral-400 dark:text-white/40 hover:text-neutral-600 dark:hover:text-white/80 hover:bg-neutral-100 dark:hover:bg-white/8 transition-all cursor-pointer"
            aria-label="Back to conversations"
          >
            <IconChevronLeft size={15} />
          </button>
        ) : (
          <div className="w-7 h-7 rounded-full overflow-hidden bg-[#f5f0e8] dark:bg-[#1e1b14] flex items-center justify-center shrink-0 ring-1 ring-black/8 dark:ring-white/10">
            <Image
              src="/logo.png"
              alt="AI"
              width={18}
              height={18}
              className="object-contain dark:invert"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-neutral-800 dark:text-white/90 truncate leading-snug">
            Ask anything about your emails
          </p>
          <p className="text-[11px] text-neutral-400 dark:text-white/40 leading-tight">
            Do or show anything using natural language
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setAIMode(true)}
            title="Open full view"
            className="p-1.5 rounded-lg text-neutral-400 dark:text-white/30 hover:text-neutral-600 dark:hover:text-white/70 hover:bg-neutral-100 dark:hover:bg-white/8 transition-all cursor-pointer"
          >
            <IconArrowsMaximize size={13} />
          </button>
          <button
            onClick={() => setAIAssistantOpen(false)}
            aria-label="Close"
            className="p-1.5 rounded-lg text-neutral-400 dark:text-white/30 hover:text-neutral-600 dark:hover:text-white/70 hover:bg-neutral-100 dark:hover:bg-white/8 transition-all cursor-pointer"
          >
            <IconX size={13} />
          </button>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {hasConversation ? (
          <motion.div
            key={`conv-${activeAIConversationId}`}
            className="flex-1 overflow-hidden flex flex-col"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.14 }}
          >
            <ConversationView
              conversationId={activeAIConversationId}
              footer={
                <AIInput
                  value={draft}
                  onChange={setDraft}
                  onSubmit={handleSubmit}
                  disabled={sending || creating || isStreaming}
                />
              }
            />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            className="flex-1 overflow-hidden flex flex-col"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.14 }}
          >
            {/* ── No-conversation empty state ──────────────────────────────── */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Hero only when there are no prior conversations — ConversationList
                  handles the empty check itself and shows SuggestedPrompts */}
              <ConversationList
                onPromptSelect={(p) => setDraft(p)}
                className="flex-1 overflow-hidden"
              />
            </div>

            {/* ── Input always visible ──────────────────────────────────────── */}
            <div className="px-3 pb-3 pt-1.5 shrink-0">
              <AIInput
                value={draft}
                onChange={setDraft}
                onSubmit={handleSubmit}
                disabled={sending || creating}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
