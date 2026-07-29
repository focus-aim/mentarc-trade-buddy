import { useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  BookImage,
  ImageIcon,
  Star,
  MessageSquareText,
  RefreshCw,
  Sparkles,
  Video,
  Wand2,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type FileCat = "report" | "quote" | "album" | "image";
type MemoryKind = "skill" | "experience";

type ResFile = {
  name: string;
  category: FileCat;
  type: "xlsx" | "pdf" | "docx";
  size: string;
  session: string;
  date: string;
  url?: string;
};

type ResMemory = {
  name: string;
  kind: MemoryKind;
  desc: string;
  session: string;
  date: string;
  icon: typeof Sparkles;
  tone: string;
};

const FILES: ResFile[] = [
  { name: "Bergmann 询盘分析报告.pdf", category: "report", type: "pdf", size: "1.2 MB", session: "德国买家询盘跟进", date: "2026-07-19" },
  { name: "热门产品词_趋势报告.xlsx", category: "report", type: "xlsx", size: "310 KB", session: "产品热门词分析", date: "2026-07-18" },
  { name: "外贸报价单模板.xlsx", category: "quote", type: "xlsx", size: "42 KB", session: "德国买家询盘跟进", date: "2026-07-20" },
  { name: "Bergmann PI 报价单.pdf", category: "quote", type: "pdf", size: "680 KB", session: "价格谈判策略", date: "2026-07-16" },
  { name: "保温杯产品图册.pdf", category: "album", type: "pdf", size: "6.4 MB", session: "产品详情页生成", date: "2026-07-15" },
  { name: "公司实力介绍图册.pdf", category: "album", type: "pdf", size: "4.1 MB", session: "企业知识库训练", date: "2026-07-11" },
  { name: "产品海报主图", category: "image", type: "docx", size: "820 KB", session: "产品详情页生成", date: "2026-07-15", url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop" },
  { name: "细节参数图", category: "image", type: "docx", size: "640 KB", session: "产品详情页生成", date: "2026-07-15", url: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=300&h=300&fit=crop" },
  { name: "场景效果图", category: "image", type: "docx", size: "1.1 MB", session: "产品详情页生成", date: "2026-07-15", url: "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=300&h=300&fit=crop" },
  { name: "同行参考图", category: "image", type: "docx", size: "560 KB", session: "市场分析", date: "2026-07-10", url: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&h=300&fit=crop" },
];

const MEMORIES: ResMemory[] = [
  { name: "AI 麦可", kind: "skill", desc: "询盘响应话术与跟进策略生成", session: "德国买家询盘跟进", date: "2026-07-20", icon: Sparkles, tone: "text-primary bg-primary/10" },
  { name: "营销视频", kind: "skill", desc: "社媒热点挖掘、视频内容规划与生成", session: "产品详情页生成", date: "2026-07-15", icon: Video, tone: "text-emerald-600 bg-emerald-50" },
  { name: "报价单生成", kind: "skill", desc: "公司展示型模板，一键输出 PI 报价单", session: "价格谈判策略", date: "2026-07-12", icon: Wand2, tone: "text-amber-600 bg-amber-50" },
  { name: "强化 LED 产品卖点表达", kind: "experience", desc: "详情页首屏优先突出光效与能耗对比", session: "产品详情页生成", date: "2026-07-15", icon: Lightbulb, tone: "text-amber-600 bg-amber-50" },
  { name: "德国买家偏好系统化议价应对", kind: "experience", desc: "用阶梯报价 + 成本拆解回应压价", session: "价格谈判策略", date: "2026-07-13", icon: Lightbulb, tone: "text-amber-600 bg-amber-50" },
  { name: "样品寄送前先确认清关资料", kind: "experience", desc: "避免因 MSDS 缺失导致样品滞留", session: "德国买家询盘跟进", date: "2026-07-09", icon: Lightbulb, tone: "text-amber-600 bg-amber-50" },
];

const FILE_CATS: { key: FileCat | "all"; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "report", label: "分析报告" },
  { key: "quote", label: "报价单" },
  { key: "album", label: "图册" },
  { key: "image", label: "图片" },
];

const MEMORY_KINDS: { key: MemoryKind | "all"; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "skill", label: "技能" },
  { key: "experience", label: "经验" },
];

const ICONS = {
  xlsx: { icon: FileSpreadsheet, tone: "text-emerald-600 bg-emerald-50" },
  pdf: { icon: FileText, tone: "text-rose-600 bg-rose-50" },
  docx: { icon: ImageIcon, tone: "text-primary bg-primary/10" },
} as const;

const CAT_ICON: Record<FileCat, typeof FileText> = {
  report: FileSpreadsheet,
  quote: FileText,
  album: BookImage,
  image: ImageIcon,
};

const ResourceLibraryView = () => {
  const [tab, setTab] = useState<"file" | "memory">("file");
  const [fileCat, setFileCat] = useState<FileCat | "all">("all");
  const [memoryKind, setMemoryKind] = useState<MemoryKind | "all">("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const files = FILES.filter((f) => fileCat === "all" || f.category === fileCat);
  const memories = MEMORIES.filter((m) => memoryKind === "all" || m.kind === memoryKind);

  const toggleFavorite = (key: string) => {
    setFavorites((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      toast({ description: prev.includes(key) ? "已取消收藏" : "已标记收藏" });
      return next;
    });
  };

  const openSession = (session: string) => {
    toast({ description: `正在回溯会话「${session}」` });
  };

  const ActionButtons = ({ id, session }: { id: string; session: string }) => (
    <div className="flex items-center gap-0.5">
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => toggleFavorite(id)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors"
              aria-label="标记收藏"
            >
              <Star className={`h-4 w-4 ${favorites.includes(id) ? "fill-amber-400 text-amber-400" : ""}`} />
            </button>
          </TooltipTrigger>
          <TooltipContent>{favorites.includes(id) ? "取消收藏" : "标记收藏"}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => openSession(session)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors"
              aria-label="回溯会话"
            >
              <MessageSquareText className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>回溯到会话「{session}」</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  return (
    <main className="flex-1 h-screen overflow-y-auto scrollbar-thin bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">资源管理</h1>
            <p className="mt-2 text-sm text-muted-foreground">历史会话沉淀的文件与记忆，按主题统一归档。</p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 gap-1.5 rounded-full border-border/60 bg-card/80 backdrop-blur-sm">
            <RefreshCw className="h-3.5 w-3.5" />
            同步至MIC
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-1 rounded-full border border-border/60 bg-card/80 p-1 backdrop-blur-sm w-fit">
          {([
            { key: "file", label: `文件资源（${FILES.length}）` },
            { key: "memory", label: `记忆资源（${MEMORIES.length}）` },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-1.5 text-[13px] transition-colors ${
                tab === t.key ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 二级分类 */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {(tab === "file" ? FILE_CATS : MEMORY_KINDS).map((c) => {
            const active = tab === "file" ? fileCat === c.key : memoryKind === c.key;
            const count =
              tab === "file"
                ? c.key === "all"
                  ? FILES.length
                  : FILES.filter((f) => f.category === c.key).length
                : c.key === "all"
                  ? MEMORIES.length
                  : MEMORIES.filter((m) => m.kind === c.key).length;
            return (
              <button
                key={c.key}
                onClick={() => (tab === "file" ? setFileCat(c.key as FileCat | "all") : setMemoryKind(c.key as MemoryKind | "all"))}
                className={cn(
                  "rounded-full border px-3 py-1 text-[12px] transition-colors",
                  active
                    ? "border-primary/30 bg-primary/10 font-medium text-primary"
                    : "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {c.label}（{count}）
              </button>
            );
          })}
        </div>

        {tab === "file" ? (
          files.length === 0 ? (
            <EmptyState />
          ) : fileCat === "image" ? (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {files.map((img) => (
                <figure key={img.name} className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm">
                  <img src={img.url} alt={img.name} loading="lazy" className="h-32 w-full object-cover" />
                  <figcaption className="flex items-center gap-1 px-3 py-2">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] text-foreground">{img.name}</span>
                      <span className="mt-0.5 block truncate text-[12px] text-muted-foreground">{img.session} · {img.date}</span>
                    </span>
                    <ActionButtons id={img.name} session={img.session} />
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="mt-5 divide-y divide-border/60 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm">
              {files.map((f) => {
                const { icon: Icon, tone } = ICONS[f.type];
                const CatIcon = CAT_ICON[f.category];
                return (
                  <div key={f.name} className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/40">
                    {f.url ? (
                      <img src={f.url} alt={f.name} loading="lazy" className="h-9 w-9 shrink-0 rounded-lg object-cover" />
                    ) : (
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-[14px] text-foreground">{f.name}</p>
                        <span className="flex shrink-0 items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                          <CatIcon className="h-3 w-3" />
                          {FILE_CATS.find((c) => c.key === f.category)?.label}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                        来自「{f.session}」 · {f.date} · {f.size}
                      </p>
                    </div>
                    <ActionButtons id={f.name} session={f.session} />
                  </div>
                );
              })}
            </div>
          )
        ) : memories.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-5 divide-y divide-border/60 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm">
            {memories.map((m) => (
              <div key={m.name} className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/40">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${m.tone}`}>
                  <m.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-[14px] text-foreground">{m.name}</p>
                    <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                      {m.kind === "skill" ? "技能" : "经验"}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                    {m.desc} · 来自「{m.session}」 · {m.date}
                  </p>
                </div>
                <ActionButtons id={m.name} session={m.session} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

const EmptyState = () => (
  <div className="mt-5 rounded-2xl border border-dashed border-border/70 bg-card/50 px-6 py-14 text-center text-[13px] text-muted-foreground backdrop-blur-sm">
    该分类下暂无资源
  </div>
);

export default ResourceLibraryView;
