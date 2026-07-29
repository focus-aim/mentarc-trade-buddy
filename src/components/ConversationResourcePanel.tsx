import { useState } from "react";
import { X, ChevronRight, ChevronUp, ChevronDown, FileSpreadsheet, FileCode2, FileText, ArrowRight, ArrowUp, Check } from "lucide-react";
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

type ConvFile = { name: string; icon: typeof FileSpreadsheet; tone: string };
type ConvMemory = {
  date: string;
  topic: string;
  strategy: string;
  background: string;
  points: string[];
  demand: string;
  output: string;
  notes: string[];
};

const XLSX = "text-emerald-600 bg-emerald-50";
const DOC = "text-primary bg-primary/10";
const CODE = "text-foreground bg-muted";

const TOPIC_FILES: Record<string, ConvFile[]> = {
  keyword: [
    { name: "热门产品词_趋势报告.xlsx", icon: FileSpreadsheet, tone: XLSX },
    { name: "买家搜索词_长尾清单.xlsx", icon: FileSpreadsheet, tone: XLSX },
    { name: "关键词_竞品覆盖对比.md", icon: FileText, tone: DOC },
  ],
  detail: [
    { name: "产品详情页_文案初稿.md", icon: FileText, tone: DOC },
    { name: "卖点提炼_对照表.xlsx", icon: FileSpreadsheet, tone: XLSX },
  ],
  material: [
    { name: "多平台营销图文_文案包.md", icon: FileText, tone: DOC },
    { name: "发布排期_建议表.xlsx", icon: FileSpreadsheet, tone: XLSX },
  ],
  media: [
    { name: "社媒短视频_脚本.md", icon: FileText, tone: DOC },
    { name: "产品图_生成参数.json", icon: FileCode2, tone: CODE },
  ],
  default: [
    { name: "外贸报价单模板.xlsx", icon: FileSpreadsheet, tone: XLSX },
    { name: "create_quotation_template.py", icon: FileCode2, tone: CODE },
    { name: "add_data_validation.py", icon: FileCode2, tone: CODE },
  ],
};

const TOPIC_MEMORIES: Record<string, ConvMemory[]> = {
  keyword: [
    {
      date: "2026-07-28",
      topic: "产品热门词与买家搜索习惯",
      strategy: "高潜力词优先 + 长尾词补量",
      background: "品类聚焦便携储能 / 家用备电，目标市场以北美为主",
      points: [
        "solar generator for home backup 搜索量稳步上升，作为核心主词",
        "emergency power backup for fridge 转化意图强，适合详情页卖点承接",
        "避免与竞品高度重合的宽泛词，优先场景化长尾词",
        "词表按“主词 / 场景词 / 参数词”三层落地",
      ],
      demand: "输出可直接用于产品页与广告的关键词清单",
      output: "热门产品词_趋势报告.xlsx（含搜索量与竞争度）",
      notes: ["用户关注旺季前的词布局节奏", "偏好把关键词直接落到产品详情文案"],
    },
  ],
  detail: [
    {
      date: "2026-07-28",
      topic: "产品详情页内容生成",
      strategy: "场景化开头 + 参数可信化",
      background: "买家为海外零售与分销渠道，关注认证与实测数据",
      points: ["标题嵌入核心搜索词", "卖点按使用场景组织，而非罗列参数", "认证与实测数据放在首屏承接信任"],
      demand: "生成标题、卖点与描述全套文案",
      output: "产品详情页_文案初稿.md",
      notes: ["用户偏好简洁直给的表达", "需保留可替换的参数占位"],
    },
  ],
  material: [
    {
      date: "2026-07-28",
      topic: "多平台营销图文素材",
      strategy: "一稿多改，适配平台调性",
      background: "投放平台为 Facebook / Instagram / LinkedIn",
      points: ["同一卖点按平台改写语气与长度", "首图强调使用场景", "统一 CTA 引导至产品页"],
      demand: "生成可直接发布的图文素材包",
      output: "多平台营销图文_文案包.md",
      notes: ["用户希望配套发布排期建议"],
    },
  ],
  media: [
    {
      date: "2026-07-28",
      topic: "社媒图片与短视频素材",
      strategy: "痛点开场 + 15 秒内讲清一个卖点",
      background: "面向海外社媒推广，以短视频为主要形式",
      points: ["前 3 秒呈现停电场景痛点", "中段展示实测续航", "结尾统一品牌与 CTA"],
      demand: "输出短视频脚本与配图生成参数",
      output: "社媒短视频_脚本.md",
      notes: ["用户偏好可直接复用的分镜结构"],
    },
  ],
  default: [
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
  ],
};

type AiMemoryItem = { icon: "check" | "up"; text: string };
type AiMemoryGroup = { label: string; items: AiMemoryItem[] };

const TOPIC_AI_MEMORY: Record<string, AiMemoryGroup[]> = {
  keyword: [
    { label: "技能", items: [{ icon: "check", text: "关键词分层（主词 / 场景词 / 参数词）" }] },
    { label: "画像", items: [{ icon: "up", text: "关注旺季前的词布局节奏，偏好可直接落地的词表" }] },
    { label: "记忆", items: [
      { icon: "check", text: "主力市场：北美" },
      { icon: "check", text: "核心品类：便携储能 / 家用备电" },
    ] },
  ],
  detail: [
    { label: "技能", items: [{ icon: "check", text: "强化 LED 产品卖点表达" }] },
    { label: "画像", items: [{ icon: "up", text: "偏好简洁直给的表达，参数需保留占位" }] },
    { label: "记忆", items: [
      { icon: "check", text: "认证与实测数据放首屏" },
      { icon: "check", text: "标题需嵌入核心搜索词" },
    ] },
  ],
  material: [
    { label: "技能", items: [{ icon: "check", text: "一稿多改，适配平台调性" }] },
    { label: "画像", items: [{ icon: "up", text: "希望配套发布排期建议" }] },
    { label: "记忆", items: [
      { icon: "check", text: "投放平台：Facebook / Instagram / LinkedIn" },
      { icon: "check", text: "统一 CTA 引导至产品页" },
    ] },
  ],
  media: [
    { label: "技能", items: [{ icon: "check", text: "短视频分镜结构复用" }] },
    { label: "画像", items: [{ icon: "up", text: "偏好痛点开场、15 秒讲清一个卖点" }] },
    { label: "记忆", items: [
      { icon: "check", text: "结尾统一品牌与 CTA" },
      { icon: "check", text: "中段展示实测续航" },
    ] },
  ],
  default: [
    { label: "技能", items: [{ icon: "check", text: "强化 LED 产品卖点表达" }] },
    { label: "画像", items: [{ icon: "up", text: "专注精细化谈判策略，善于用系统化方法处理客户议价" }] },
    { label: "记忆", items: [
      { icon: "check", text: "默认报价币种：USD" },
      { icon: "check", text: "已保存邮件签名" },
    ] },
  ],
};

const ConversationResourcePanel = ({

  onClose,
  buyers,
  results,
  businessDisabled = false,
  topicKey = "default",
}: {
  onClose: () => void;
  buyers: ConversationBuyerRef[];
  results: ConversationResultRef[];
  memories?: ConversationMemoryRef[];
  businessDisabled?: boolean;
  topicKey?: string;
}) => {
  const [tab, setTab] = useState<"business" | "conversation">(
    businessDisabled ? "conversation" : "business",
  );
  const [detailBuyer, setDetailBuyer] = useState<ConversationBuyerRef | null>(null);
  const [filesOpen, setFilesOpen] = useState(true);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
  const conversationFiles = TOPIC_FILES[topicKey] ?? TOPIC_FILES.default;
  const aiMemoryGroups = TOPIC_AI_MEMORY[topicKey] ?? TOPIC_AI_MEMORY.default;

  return (
    <aside className="hidden lg:flex w-[400px] shrink-0 flex-col h-screen border-l border-border/60 bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-5 h-[60px] border-b border-border/60">
        <div className="flex items-center gap-4">
          {([
            { key: "business", label: "业务信息" },
            { key: "conversation", label: "对话信息" },
          ] as const)
            .filter((t) => !(businessDisabled && t.key === "business"))
            .map((t) => {
            const disabled = false;
            return (
              <button
                key={t.key}
                disabled={disabled}
                onClick={() => !disabled && setTab(t.key)}
                className={`text-[15px] transition-colors ${
                  disabled
                    ? "cursor-not-allowed text-muted-foreground/40"
                    : tab === t.key
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
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
              <SectionTitle
                title="知识引用"
                right={
                  <button
                    onClick={() => setKnowledgeOpen((v) => !v)}
                    className="p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors"
                    aria-label="展开或收起知识引用"
                  >
                    <ChevronUp className={`w-4 h-4 transition-transform ${knowledgeOpen ? "" : "rotate-180"}`} />
                  </button>
                }
              />
              {knowledgeOpen && (
                <div className="rounded-2xl border border-border/60 bg-background/60 p-4 space-y-3">
                  {KNOWLEDGE_REFS.map((r) => (
                    <div key={r.title} className="flex items-start gap-2">
                      <FileText className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      <div>
                        <p className="text-[14px] text-foreground">{r.title}</p>
                        <p className="mt-0.5 text-[12px] text-muted-foreground">{r.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <>
            <section className="px-5 py-5">
              <SectionTitle
                title={`关键成果（${conversationFiles.length}）`}
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
                  {conversationFiles.map((f) => (
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
              <SectionTitle title="AI 记忆" />
              <div className="space-y-4">
                {aiMemoryGroups.map((g) => (
                  <div key={g.label}>
                    <p className="mb-2 text-[13px] text-muted-foreground">
                      {g.label}（{g.items.length}）
                    </p>
                    <div className="space-y-2">
                      {g.items.map((it) => (
                        <div
                          key={it.text}
                          className="flex items-start gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2"
                        >
                          {it.icon === "up" ? (
                            <ArrowUp className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
                          ) : (
                            <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600" />
                          )}
                          <span className="text-[13px] leading-relaxed text-foreground">{it.text}</span>
                        </div>
                      ))}
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
