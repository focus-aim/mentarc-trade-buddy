import { useState } from "react";
import { X, ChevronRight, ChevronUp, ChevronDown, FileSpreadsheet, FileCode2, FileText, ArrowRight } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { BuyerProfileSheetContent } from "@/components/BuyerProfileFloatingCard";

const VISIBLE_FIELD_KEYS = ["所在地", "邮箱"];

const KNOWLEDGE_REFS = [
  { title: "欧洲家居分销商询盘响应案例", meta: "外贸知识库 · 询盘跟进" },
  { title: "报价后客户沉默的破冰话术", meta: "外贸知识库 · 谈判策略" },
  { title: "CE / ROHS 认证材料准备清单", meta: "外贸知识库 · 单证合规" },
];

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

type StepStatus = "done" | "current" | "todo";

const FOLLOW_UP_STEPS: { title: string; desc: string; status: StepStatus; meta?: string }[] = [
  { title: "询盘分析", desc: "核心需求提取、风险识别", status: "done" },
  { title: "买家背调", desc: "画像分析、背景调查", status: "done" },
  { title: "跟进策略", desc: "询盘响应、客户沉默应对、破冰契机", status: "current", meta: "进行中" },
  { title: "动态跟踪", desc: "买家动态监测、跟进提醒", status: "todo" },
  { title: "报价材料", desc: "图册、PI 与单证制作", status: "todo" },
];

const CURRENT_STAGE = "跟进策略";
const NEXT_ACTION = "报价发出已满 48 小时未回复，建议以\u201c样品可先行寄送\u201d为切入点做第一次破冰跟进，并附上 CE / ROHS 认证与实测保温数据。";

const STATUS_STYLE: Record<StepStatus, { dot: string; title: string }> = {
  done: { dot: "bg-emerald-500", title: "text-foreground" },
  current: { dot: "bg-primary ring-4 ring-primary/15", title: "text-primary font-semibold" },
  todo: { dot: "bg-border", title: "text-muted-foreground" },
};

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
  const [detailBuyer, setDetailBuyer] = useState<ConversationBuyerRef | null>(null);
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
                {buyers.map((b, idx) => {
                  const fields = b.fields.filter((f) => VISIBLE_FIELD_KEYS.some((k) => f.startsWith(k)));
                  const secondary = idx > 0;
                  return (
                    <div
                      key={b.company}
                      className={`rounded-2xl border overflow-hidden ${
                        secondary ? "border-border/40 bg-background/30" : "border-border/60 bg-background/60"
                      }`}
                    >
                      <button
                        onClick={() => setDetailBuyer(b)}
                        className={`w-full flex items-start justify-between gap-3 text-left ${secondary ? "px-4 py-3" : "p-4"}`}
                      >
                        <span className="min-w-0">
                          <p
                            className={
                              secondary
                                ? "text-[14px] font-medium text-muted-foreground"
                                : "text-[15px] font-semibold text-foreground"
                            }
                          >
                            {b.company}
                          </p>
                          {secondary ? (
                            <span className="mt-1 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                              {b.stage}
                            </span>
                          ) : (
                            <>
                              <span className="mt-1.5 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[12px] font-medium text-emerald-600">
                                {b.stage}
                              </span>
                              <span className="mt-3 block space-y-1.5">
                                {fields.map((f) => (
                                  <span key={f} className="block text-[13px] text-muted-foreground">
                                    {f}
                                  </span>
                                ))}
                              </span>
                            </>
                          )}
                        </span>
                        <ChevronRight className={`w-4 h-4 shrink-0 mt-1 ${secondary ? "text-muted-foreground/50" : "text-muted-foreground"}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="px-5 pb-5">
              <SectionTitle
                title="跟进节奏"
                right={
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[12px] font-medium text-primary">
                    当前：{CURRENT_STAGE}
                  </span>
                }
              />
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                <div className="space-y-0">
                  {FOLLOW_UP_STEPS.map((s2, i) => {
                    const st = STATUS_STYLE[s2.status];
                    const last = i === FOLLOW_UP_STEPS.length - 1;
                    return (
                      <div key={s2.title} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span className={`mt-1.5 w-2 h-2 rounded-full ${st.dot}`} />
                          {!last && <span className="w-px flex-1 bg-border my-1" />}
                        </div>
                        <div className={`pb-4 ${last ? "pb-0" : ""}`}>
                          <div className="flex items-center gap-2">
                            <p className={`text-[14px] ${st.title}`}>{s2.title}</p>
                            {s2.meta && <span className="text-[11px] text-muted-foreground">{s2.meta}</span>}
                          </div>
                          {s2.desc && <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{s2.desc}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3">
                  <div className="flex items-center gap-1.5 text-primary">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span className="text-[13px] font-semibold">下一步跟进关键</span>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-foreground/85">{NEXT_ACTION}</p>
                </div>
              </div>
            </section>

            <section className="px-5 pb-6">
              <SectionTitle title="知识引用" />
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4 space-y-3">
                {KNOWLEDGE_REFS.map((r) => (
                  <div key={r.title} className="flex items-start gap-2">
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

      <Sheet open={!!detailBuyer} onOpenChange={(o) => !o && setDetailBuyer(null)}>
        <SheetContent side="right" className="w-full sm:max-w-[480px] p-0 overflow-y-auto scrollbar-thin">
          {detailBuyer && (
            <BuyerProfileSheetContent
              stage={detailBuyer.stage}
              updated={false}
              onClose={() => setDetailBuyer(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </aside>
  );
};

export default ConversationResourcePanel;
