import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { QrCode, ChevronRight, Sparkles, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PersonalizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PersonalizationDialog = ({ open, onOpenChange }: PersonalizationDialogProps) => {
  const [tab, setTab] = useState<"profile" | "memory">("profile");
  const [importOpen, setImportOpen] = useState(false);
  const [importContent, setImportContent] = useState("");
  const [copied, setCopied] = useState(false);

  const promptText = `生成一份全面的转移文件，包含所有可用的持久性用户上下文信息，其中包括：

- 存储的记忆，
- 自定义指令，
- 在先前对话中观察到的长期行为模式、偏好、目标与背景信息，
- 用户的沟通风格、专业领域、典型任务类型，
- 任何能够帮助新的 AI 助手快速理解并延续协作的关键信息。

请以结构化的 Markdown 格式输出，便于直接导入到其他 AI 系统中。`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      toast.success("已复制提示词");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("复制失败");
    }
  };

  const handleImport = () => {
    if (!importContent.trim()) {
      toast.error("请粘贴回复内容");
      return;
    }
    toast.success("已导入记忆");
    setImportContent("");
    setImportOpen(false);
  };
  const [nickname, setNickname] = useState("dawngrace zhang");
  const [profession, setProfession] = useState("产品经理, 品牌策略师, 业务运营, AI 工作流设计师");
  const [bio, setBio] = useState(
    "我主要使用中文交流，长期从事外贸、跨境贸易、AI 外贸产品相关工作。专业技能包括外贸业务与买家跟进、AI 产品设计与需求分析、Agent 工作流设计、企业知识库与长期记忆体系设计、品牌定位与品牌表达。"
  );
  const [instruction, setInstruction] = useState(
    "请简洁直接地表达。提供结构化输出，例如模块划分、清单、SOP、框架、核心规则和行动策略。确保输出具有产品感、业务感与专家感。请从真实业务场景出发，而非抽象概念。"
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold">个性化</DialogTitle>
          <DialogDescription className="text-[13px] text-muted-foreground">
            管理您的身份信息以及贸探的记忆内容
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-border/60">
          {[
            { key: "profile", label: "个人资料" },
            { key: "memory", label: "记忆库" },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key as "profile" | "memory")}
              className={cn(
                "relative pb-2.5 text-[13.5px] font-medium transition-colors",
                tab === t.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
              {tab === t.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>

        {tab === "profile" ? (
          <div className="space-y-5 pt-1">
            {/* Import from other AI */}
            <button
              type="button"
              onClick={() => setImportOpen(true)}
              className="group flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-muted/40 px-4 py-3.5 text-left transition-colors hover:border-primary/30 hover:bg-muted/60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-card text-foreground/70 shadow-sm">
                <QrCode className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-foreground">从其他 AI 导入记忆</p>
                <p className="mt-0.5 text-[11.5px] text-muted-foreground">使用来自其他 AI 提供商的对话内容自动填写您的个人资料。</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Nickname + Profession */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-foreground">昵称</label>
                <Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="h-10 text-[13px]" />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-foreground">职业</label>
                <Input value={profession} onChange={(e) => setProfession(e.target.value)} className="h-10 text-[13px]" />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-foreground">更多关于您的信息</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                className="text-[13px] leading-relaxed resize-none"
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground">贸探使用此信息为所有任务定制响应。</p>
            </div>

            {/* Custom instructions */}
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-foreground">自定义指令</label>
              <Textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                rows={5}
                className="text-[13px] leading-relaxed resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>取消</Button>
              <Button size="sm" onClick={() => onOpenChange(false)} className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                保存
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-[13px] text-muted-foreground">暂无个人记忆内容</p>
            <p className="text-[11.5px] text-muted-foreground/70">贸探会在对话中持续记录与您相关的偏好与背景。</p>
          </div>
        )}
      </DialogContent>

      {/* Import Memory Sub-dialog */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="sm:max-w-[640px] sm:rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-bold">导入记忆</DialogTitle>
            <DialogDescription className="text-[13px] text-muted-foreground">
              将其他 AI 提供商关于您的记忆导入到贸探。
            </DialogDescription>
          </DialogHeader>

          <div className="relative pt-2">
            {/* Vertical connector line */}
            <div className="absolute left-[15px] top-10 bottom-4 w-px border-l border-dashed border-border/60" aria-hidden />

            {/* Step 1 */}
            <div className="relative flex gap-4 pb-6">
              <div className="z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-border/70 bg-card text-[12px] font-medium text-muted-foreground">
                1
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-foreground">复制此提示词</p>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">将其粘贴到您之前使用过的其他 AI 提供商中。</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 shrink-0 gap-1.5 rounded-lg bg-foreground text-background hover:bg-foreground/90"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "已复制" : "复制"}
                  </Button>
                </div>
                <div className="mt-3 max-h-[180px] overflow-y-auto rounded-xl border border-border/60 bg-muted/40 p-3.5 text-[13px] leading-relaxed text-foreground/80 whitespace-pre-wrap">
                  {promptText}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex gap-4">
              <div className="z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-border/70 bg-card text-[12px] font-medium text-muted-foreground">
                2
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-foreground">粘贴回复内容</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">贸探将用其填充您的个人资料。您可以随时编辑。</p>
                <Textarea
                  value={importContent}
                  onChange={(e) => setImportContent(e.target.value)}
                  placeholder="将回复粘贴到这里..."
                  rows={6}
                  className="mt-3 resize-none rounded-xl bg-muted/40 text-[13px] leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setImportOpen(false)}>取消</Button>
            <Button size="sm" onClick={handleImport} disabled={!importContent.trim()}>导入</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default PersonalizationDialog;