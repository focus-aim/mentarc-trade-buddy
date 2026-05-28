import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const REASON_TAGS = [
  "没理解需求",
  "内容不专业",
  "语气/表达不合适",
  "生成格式错乱",
];

type Rating = "up" | "down" | null;

export default function MessageFeedback() {
  const [rating, setRating] = useState<Rating>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [detail, setDetail] = useState("");

  const handleUp = () => {
    setRating((r) => (r === "up" ? null : "up"));
    if (rating !== "up") {
      toast({ description: "感谢您的反馈" });
    }
  };

  const handleDown = () => {
    setDialogOpen(true);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleSubmit = () => {
    setRating("down");
    setDialogOpen(false);
    setSelectedTags([]);
    setDetail("");
    toast({ description: "感谢您的反馈，我们会持续优化" });
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1 mt-3 pt-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleUp}
              className={cn(
                "p-1.5 rounded-md transition-colors hover:bg-muted",
                rating === "up" ? "text-primary bg-primary/10" : "text-muted-foreground"
              )}
              aria-label="点赞"
            >
              <ThumbsUp className={cn("h-3.5 w-3.5", rating === "up" && "fill-primary")} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">点赞</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleDown}
              className={cn(
                "p-1.5 rounded-md transition-colors hover:bg-muted",
                rating === "down" ? "text-destructive bg-destructive/10" : "text-muted-foreground"
              )}
              aria-label="点踩"
            >
              <ThumbsDown className={cn("h-3.5 w-3.5", rating === "down" && "fill-destructive")} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">点踩</TooltipContent>
        </Tooltip>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl p-5 gap-3">
          <DialogHeader>
            <DialogTitle className="text-base">反馈问题</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-2">请选择理由帮助我们做得更好</p>
              <div className="flex flex-nowrap gap-2">
                {REASON_TAGS.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm border transition-colors whitespace-nowrap",
                        active
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:border-primary/50"
                      )}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">补充说明（选填）</p>
              <Textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="请详细描述遇到的问题，便于我们优化"
                className="min-h-[72px] text-sm"
              />
            </div>
          </div>
          <DialogFooter className="mt-1">
            <Button onClick={handleSubmit}>提交反馈</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
