import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
}

const ChatMessage = ({ role, content, isTyping }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "bg-[hsl(var(--chat-user))] text-[hsl(var(--chat-user-foreground))] ml-auto max-w-[80%]" : "bg-[hsl(var(--chat-ai))] text-[hsl(var(--chat-ai-foreground))] mr-auto max-w-[85%]"
      )}
    >
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser ? "bg-white/20" : "bg-primary/10"
      )}>
        {isUser ? (
          <User className="w-5 h-5" />
        ) : (
          <Bot className="w-5 h-5 text-primary" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="whitespace-pre-wrap break-words">
          {content}
          {isTyping && (
            <span className="inline-flex ml-1">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse animation-delay-200">●</span>
              <span className="animate-pulse animation-delay-400">●</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
