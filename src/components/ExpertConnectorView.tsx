import { useState } from "react";
import { Sparkles, Plug, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  code: string;
  name: string;
  tag: string;
  desc: string;
  color: string;
  enabled?: boolean;
  quota?: number;
};

/** 每个技能默认赠送的应用额度（次） */
const DEFAULT_SKILL_QUOTA = 5;

const EXPERTS: Item[] = [
  { code: "MI", name: "MIC 麦可", tag: "MIC 平台对接", desc: "对接 MIC 平台，读取数据、调用麦可能力、结果可暂存到麦可", color: "bg-blue-50 text-blue-500", enabled: true },
  { code: "社媒", name: "营销视频", tag: "社媒运营", desc: "社媒热点挖掘、视频内容规划、营销视频生成", color: "bg-pink-50 text-pink-500" },
  { code: "GE", name: "GEO 专家", tag: "独立站增长", desc: "独立站数据分析、独立站运营策略与优化建议", color: "bg-emerald-50 text-emerald-500" },
  { code: "单证", name: "单证专家", tag: "外贸单证", desc: "外贸单证审核、单证制作与合规检查", color: "bg-amber-50 text-amber-500" },
];

const CONNECTORS: Item[] = [
  { code: "MIC", name: "MIC 平台", tag: "数据对接", desc: "同步 MIC 平台询盘、买家与产品数据", color: "bg-blue-50 text-blue-500", enabled: true },
  { code: "WA", name: "WhatsApp", tag: "客户沟通", desc: "接入 WhatsApp 会话，跟进记录自动归档", color: "bg-emerald-50 text-emerald-500" },
  { code: "邮箱", name: "企业邮箱", tag: "邮件同步", desc: "同步往来邮件，自动识别询盘与跟进阶段", color: "bg-violet-50 text-violet-500" },
];

const Row = ({ item, showQuota }: { item: Item; showQuota?: boolean }) => {
  const [on, setOn] = useState(!!item.enabled);
  const quota = item.quota ?? DEFAULT_SKILL_QUOTA;
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card/80 px-5 py-4 backdrop-blur-sm transition-colors hover:border-primary/30">
      <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-semibold", item.color)}>
        {item.code}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{item.tag}</span>
          {showQuota && (
            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
              免费额度 {quota} 次
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-[13px] text-muted-foreground">{item.desc}</p>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={cn(
          "shrink-0 rounded-full px-5 py-1.5 text-[13px] font-medium transition-colors",
          on
            ? "bg-foreground text-background hover:bg-foreground/90"
            : "border border-border bg-card text-foreground hover:bg-muted",
        )}
      >
        {on ? "已启用" : "启用"}
      </button>
    </div>
  );
};

const ExpertConnectorView = () => {
  const [tab, setTab] = useState<"expert" | "connector">("expert");
  const items = tab === "expert" ? EXPERTS : CONNECTORS;

  return (
    <main className="flex-1 h-screen overflow-y-auto scrollbar-thin bg-background">
      <div className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/80 p-1 backdrop-blur-sm">
          {([
            { key: "expert", label: "技能\u00a0", icon: Sparkles },
            { key: "connector", label: "连接器", icon: Plug },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                tab === t.key
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        <h1 className="mt-8 text-2xl font-bold tracking-tight text-foreground">
          {tab === "expert" ? "附加技能" : "连接器"}
        </h1>
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          {tab === "expert"
            ? `启用后，技能将在发起任务时可选，每个技能默认赠送 ${DEFAULT_SKILL_QUOTA} 次应用额度`
            : "启用后，可在任务中读取和写入对应平台数据"}
        </p>

        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <Row key={item.name} item={item} showQuota={tab === "expert"} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default ExpertConnectorView;
