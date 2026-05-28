import { useState, useEffect } from "react";
import { Image, Send, X, Link, MessageSquareQuote } from "lucide-react";
import type { ChatQuote } from "./InquiryResultMessage";

export interface ChatAttachment {
  label: string;
  preview: string;
  fullContent: string;
  imageUrl?: string;
}

interface ChatInputProps {
  onSend: (message: string, quote?: ChatQuote) => void;
  placeholder?: string;
  defaultValue?: string;
  attachment?: ChatAttachment;
  attachments?: ChatAttachment[];
  quote?: ChatQuote | null;
  onClearQuote?: () => void;
}

const ChatInput = ({
  onSend,
  placeholder = "输入您的外贸业务问题，或选择上方任务快速开始",
  defaultValue = "",
  attachment,
  attachments: attachmentsProp,
  quote,
  onClearQuote,
}: ChatInputProps) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (defaultValue) setValue(defaultValue);
  }, [defaultValue]);

  const initialAttachments = attachmentsProp || (attachment ? [attachment] : []);
  const [currentAttachments, setCurrentAttachments] = useState<ChatAttachment[]>(initialAttachments);

  const removeAttachment = (index: number) => {
    setCurrentAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (!value.trim() && currentAttachments.length === 0) return;
    const attachContent = currentAttachments.map((a) => a.fullContent).join("\n\n");
    const sendContent = attachContent
      ? `${value.trim()}\n\n${attachContent}`
      : value.trim();
    onSend(sendContent, quote || undefined);
    setValue("");
    setCurrentAttachments([]);
    onClearQuote?.();
  };

  const imageAttachments = currentAttachments.filter((a) => a.imageUrl);
  const linkAttachments = currentAttachments.filter((a) => !a.imageUrl);

  const hasAttachments = currentAttachments.length > 0;

  return (
    <div className="border border-border/70 rounded-2xl bg-card/90 backdrop-blur-md shadow-[0_8px_24px_-12px_hsl(var(--primary)/0.18),0_2px_6px_-2px_hsl(var(--primary)/0.08)] hover:shadow-[0_12px_32px_-12px_hsl(var(--primary)/0.22),0_3px_8px_-2px_hsl(var(--primary)/0.10)] focus-within:border-primary/40 focus-within:shadow-[0_16px_40px_-12px_hsl(var(--primary)/0.28),0_4px_12px_-2px_hsl(var(--primary)/0.14)] transition-all duration-300">
      {/* Quote reference */}
      {quote && (
        <div className="px-4 pt-3 pb-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/8 border border-primary/15 max-w-full">
            <MessageSquareQuote className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-xs font-medium text-primary">{quote.moduleName}</span>
            <span className="text-xs text-muted-foreground truncate max-w-[200px]">{quote.preview}</span>
            <button
              onClick={onClearQuote}
              className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder={placeholder}
        rows={2}
        className={`w-full resize-none bg-transparent px-5 pt-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none ${linkAttachments.length > 0 ? 'pb-0' : 'pb-2'}`}
      />

      {/* Link attachments inline after text */}
      {linkAttachments.length > 0 && (
        <div className="px-5 pb-2 flex flex-wrap items-center gap-2">
          {linkAttachments.map((att, i) => (
            <div key={`link-${i}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 max-w-full group">
              <Link className="w-3 h-3 text-primary/60 shrink-0" />
              <span className="text-xs text-primary/80 truncate max-w-[360px]">{att.preview}</span>
              <button
                onClick={() => removeAttachment(currentAttachments.indexOf(att))}
                className="p-0.5 rounded text-primary/40 hover:text-primary transition-colors shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between px-4 pb-3">
        <div className="flex items-center gap-2">
          {imageAttachments.length > 0 ? (
            imageAttachments.map((att, i) => (
              <div key={`img-${i}`} className="relative w-10 h-10 rounded-lg overflow-hidden border border-border shrink-0 group">
                <img src={att.imageUrl} alt={att.label} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeAttachment(currentAttachments.indexOf(att))}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))
          ) : (
            <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:scale-95">
              <Image className="w-5 h-5" />
            </button>
          )}
        </div>
        <button
          onClick={handleSend}
          disabled={!value.trim() && !hasAttachments}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 ${
            value.trim() || hasAttachments
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground disabled:opacity-40"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
