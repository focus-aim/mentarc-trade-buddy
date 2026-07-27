import { useState } from "react";
import { X, ChevronRight, ChevronUp, FileSpreadsheet, FileCode2, FileText } from "lucide-react";

export type ConversationBuyerRef = {
  company: string;
  stage: string;
  fields: string[];
};

export type ConversationResultRef = {
  title: string;
  meta: string;
};

export type ConversationMemoryRef = {
  title: string;
  desc: string;
};

const SectionTitle = ({ title, right }: { title: string; right?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
    {right}
  </div>
);

const FOLLOW_UP_STEPS = [
  { title: "询盘分析", desc: "" },
  { title: "买家背调", desc: "" },
  { title: "跟进策略", desc: "询盘响应、客户沉默应对、破冰契机" },
  { title: "单证制作", desc: "" },
];

const CONVERSATION_FILES = [
  { name: "外贸报价单模板.xlsx", icon: FileSpreadsheet, tone: "text-emerald-600 bg-emerald-50" },
  { name: "create_quotation_template.py", icon: FileCode2, tone: "text-foreground bg-muted" },
  { name: "add_data_validation.py", icon: FileCode2, tone: "text-foreground bg-muted" },
];

const CONVERSATION_MEMORIES = [
  {
    date: "2026-07-20",
    topic: "外贸价格谈判策略",
    strategy: "价格梯度 + 选择性让步",
    background: "客户要求所有产品打折（Case 2 & 20）",
    points: [
      "不做全面降价",
      "利用价格梯度，在 PI（形式发票）中选一两款作为\u201c牺牲款\u201d大幅降价",
      "其余款保持原价，保住整体利润",
      "用折扣当试探针，判断客户是门外汉还是行家",
    ],
    demand: "将策略整理成谈判话术库",
    output: "negotiation-scripts.md（谈判话术库文档）",
    notes: ["客户可能从事外贸跟单或业务工作", "专注精细化谈判策略，善于用系统化方法处理客户议价", "本次生成了完整的谈判话术库文档"],
  },
];

const ConversationResourcePanel = ({
  onClose,
  buyers,
  results,
}: {
  onClose: () => void;
  buyers: ConversationBuyerRef[];
  results: ConversationResultRef[];
  memories?: ConversationMemoryRef[];
}) => {
  const [tab, setTab] = useState<"business" | "conversation">("business");
  const [filesOpen, setFilesOpen] = useState(true);

  return (
    <aside className="hidden lg:flex w-[400px] shrink-0 flex-col h-screen border-l border-border/60 bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-5 h-[60px] border-b border-border/60">
        <div className="flex items-center gap-4">
          {([
            { key: "business", label: "业务信息" },
            { key: "conversation", label: "对话信息" },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-[15px] transition-colors ${
                tab === t.key ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          aria-label="关闭会话资源"
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {tab === "business" ? (
          <>
            <section className="px-5 py-5">
              <SectionTitle title="买家档案" />
              <div className="space-y-3">
                {buyers.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-border/60 bg-background/40 p-6 text-center text-[13px] text-muted-foreground">
                    暂无买家档案
                  </div>
                )}
                {buyers.map((b) => (
                  <div key={b.company} className="rounded-2xl border border-border/60 bg-background/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[15px] font-semibold text-foreground">{b.company}</p>
                      <span className="shrink-0 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[12px] font-medium text-emerald-600">
                        {b.stage}
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {b.fields.map((f) => (
                        <div key={f} className="text-[13px] text-foreground">
                          {f}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex justify-end">
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="px-5 pb-5">
              <SectionTitle title="买家跟进节奏" />
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                <div className="border-l border-border pl-4 space-y-4">
                  {FOLLOW_UP_STEPS.map((s) => (
                    <div key={s.title}>
                      <p className="text-[14px] font-medium text-foreground">{s.title}</p>
                      {s.desc && <p className="mt-1 text-[12px] text-muted-foreground">{s.desc}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="px-5 pb-6">
              <SectionTitle title="知识引用" />
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4 space-y-3">
                {results.length === 0 && (
                  <p className="text-[13px] text-muted-foreground">暂无引用内容</p>
                )}
                {results.map((r, i) => (
                  <div key={`${r.title}-${i}`} className="flex items-start gap-2">
                    <FileText className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                    <div>
                      <p className="text-[14px] font-medium text-foreground">{r.title}</p>
                      <p className="mt-0.5 text-[12px] text-muted-foreground">{r.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="px-5 py-5">
              <SectionTitle
                title={`文件（${CONVERSATION_FILES.length}）`}
                right={
                  <button
                    onClick={() => setFilesOpen((v) => !v)}
                    className="p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors"
                    aria-label="展开或收起文件"
                  >
                    <ChevronUp className={`w-4 h-4 transition-transform ${filesOpen ? "" : "rotate-180"}`} />
                  </button>
                }
              />
              {filesOpen && (
                <div className="space-y-2">
                  {CONVERSATION_FILES.map((f) => (
                    <div key={f.name} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-muted/60 transition-colors">
                      <span className={`w-7 h-7 rounded-md flex items-center justify-center ${f.tone}`}>
                        <f.icon className="w-4 h-4" />
                      </span>
                      <span className="text-[13px] text-foreground truncate">{f.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="px-5 pb-6">
              <SectionTitle title={`记忆（${CONVERSATION_MEMORIES.length + 4}）`} />
              <div className="space-y-3">
                {CONVERSATION_MEMORIES.map((m) => (
                  <div key={m.date} className="rounded-2xl bg-muted/60 border border-border/60 p-4 text-[13px] leading-relaxed">
                    <p className="text-foreground font-medium">{m.date}</p>
                    <p className="mt-2 text-foreground"><span className="font-medium">主题：</span>{m.topic}</p>
                    <p className="mt-1 text-foreground"><span className="font-medium">核心策略：</span>{m.strategy}</p>
                    <p className="mt-1 text-muted-foreground"><span className="font-medium text-foreground">客户背景：</span>{m.background}</p>
                    <p className="mt-2 font-medium text-foreground">应对核心：</p>
                    <ul className="mt-1 space-y-1 list-disc pl-4 text-muted-foreground">
                      {m.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-muted-foreground"><span className="font-medium text-foreground">用户要求：</span>{m.demand}</p>
                    <p className="mt-1 text-muted-foreground"><span className="font-medium text-foreground italic">产出：</span>{m.output}</p>
                    <div className="mt-3 pt-3 border-t border-border/60">
                      <p className="font-medium text-foreground">记录人备注</p>
                      <ul className="mt-1 space-y-1 list-disc pl-4 text-muted-foreground">
                        {m.notes.map((n) => (
                          <li key={n}>{n}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </aside>
  );
};

export default ConversationResourcePanel;
