import { useState } from "react";
import { ArrowLeft, UserRound, ListChecks, Brain, AlertTriangle, Star, Search, Compass, Mail, MessageCircle, CheckCircle2, Clock, Sparkles, Archive, ChevronRight } from "lucide-react";
import { BuyerBackgroundReport } from "./InquiryResultMessage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

// ============================================================
// Local helpers (mirroring InquiryResultMessage's compact style)
// ============================================================
const SectionCard = ({
  icon: Icon,
  title,
  accent = false,
  action,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  accent?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section
    className={`rounded-xl border p-3.5 ${
      accent ? "border-primary/20 bg-primary/[0.03]" : "border-border bg-background/40"
    }`}
  >
    <div className="flex items-center gap-1.5 mb-2">
      <Icon className={`w-3.5 h-3.5 ${accent ? "text-primary" : "text-muted-foreground"}`} />
      <h3 className="font-medium text-foreground text-[12.5px]">{title}</h3>
      {action && <span className="ml-auto">{action}</span>}
    </div>
    <div>{children}</div>
  </section>
);

const KV = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start gap-1.5 text-[12px] leading-[1.55]">
    <span className="text-muted-foreground shrink-0">{label}</span>
    <span className="text-foreground/85 flex-1">{value}</span>
  </div>
);

// ============================================================
// Mock data — keyed by buyer id
// ============================================================
type BuyerProfileData = {
  name: string;
  status: string;
  meta?: string;
  region: string;
  contact: string;
  inquiry: {
    expertTip: string;
    buyer: { company: string; contact: string; timezone: string; role: string; rating: string };
    demand: { product: string; quantity: string; targetPrice: string; leadTime: string; nextAction: string };
    judgment: { experience: string; priceSensitivity: string; pain: string; risks: string[] };
    strategy: string[];
  };
  followUps: { date: string; channel: string; summary: string; outcome: string; tone: "success" | "warn" | "info" }[];
};

const BUYER_DATA: Record<string, BuyerProfileData> = {
  b1: {
    name: "德国大型连锁健身房采购部",
    status: "跟进中",
    meta: "决策链 3 人 · 预算 €120K",
    region: "德国 · 慕尼黑",
    contact: "Michael Schneider · 采购总监",
    inquiry: {
      expertTip: "客户已明确预算与器械清单，先确认 EN957 认证 + 整店配送方案，避免被竞品以「整套打包价」抢单。",
      buyer: { company: "Bergmann Fitness Group", contact: "Michael Schneider", timezone: "欧洲中部（CET）", role: "连锁健身房采购总监", rating: "A 级" },
      demand: { product: "商用动感单车 + 划船机（整店方案）", quantity: "首批 60 台", targetPrice: "FOB ≤ €1,150 / 台", leadTime: "≤ 45 天，赶 Q1 新店开业", nextAction: "样机验机 → 整店采购框架协议" },
      judgment: { experience: "高", priceSensitivity: "中", pain: "认证 / 售后", risks: ["要求 24 个月质保 + 本地备件库", "需提供 3 家欧洲连锁参考案例"] },
      strategy: [
        "首封邮件突出 EN957 认证 + 已有 5 家欧洲连锁案例。",
        "提供整店方案报价（含安装、培训、首年备件包），而非单台报价。",
        "邀请买家访华验厂或寄一台样机到慕尼黑门店。",
      ],
    },
    followUps: [
      { date: "04-02", channel: "邮件", summary: "发送整店方案 PDF + 3 个欧洲参考案例", outcome: "买家已下载，转发给技术总监", tone: "success" },
      { date: "03-28", channel: "WhatsApp", summary: "确认器械清单与门店开业时间", outcome: "买家口头确认 Q1 开业，催样机", tone: "info" },
      { date: "03-26", channel: "展会", summary: "慕尼黑 ISPO 展会名片交换 + 现场试用", outcome: "买家对单车阻力系统给出正向反馈", tone: "success" },
    ],
  },
  b2: {
    name: "美国本土居家运动 DTC 品牌",
    status: "已建档",
    meta: "年采购量 8K 件 · 复购率高",
    region: "美国 · 加州",
    contact: "Sarah Lin · Head of Sourcing",
    inquiry: {
      expertTip: "DTC 品牌看重「独家定制 + 稳定交付」，不要一上来就拼价格，先用「联合开发 + 长期排产」绑住对方。",
      buyer: { company: "FlexHome Co.", contact: "Sarah Lin", timezone: "美西（PST）", role: "DTC 品牌采购负责人", rating: "A+ 级" },
      demand: { product: "可折叠走步机（定制款）", quantity: "全年 8,000 台分 4 批", targetPrice: "FOB ≤ $185 / 台", leadTime: "首批 30 天", nextAction: "ID 设计稿对齐 → 打样" },
      judgment: { experience: "高", priceSensitivity: "中低", pain: "ID 定制 / 包装", risks: ["要求独家设计 6 个月", "包装需通过亚马逊 ISTA-6 测试"] },
      strategy: [
        "签 NDA + 独家协议（限品类、限渠道、限期 6 个月）。",
        "提供 ID 联合开发 + 模具费分摊方案。",
        "首批排产前确认包装跌落测试报告。",
      ],
    },
    followUps: [
      { date: "04-10", channel: "Zoom", summary: "对齐美西 Q3 备货窗口与排产计划", outcome: "锁定 6 月底首批 2,000 台", tone: "success" },
      { date: "04-05", channel: "邮件", summary: "发送 NDA 草案 + ID 设计提案", outcome: "买家律师已 review，等回复", tone: "info" },
      { date: "03-28", channel: "邮件", summary: "竞对背调：买家原供应商交期延误", outcome: "买家主动寻求备选，机会窗口打开", tone: "success" },
    ],
  },
  b3: {
    name: "中东商用健身房连锁",
    status: "待报价",
    meta: "门店 12 家 · 整店采购",
    region: "阿联酋 · 迪拜",
    contact: "Ahmed Al-Rashid · Operations Director",
    inquiry: {
      expertTip: "中东买家对「质保年限 + 本地化售后」极敏感，建议绑定迪拜本地代理或承诺 48 小时上门服务。",
      buyer: { company: "Gulf Fit Holdings", contact: "Ahmed Al-Rashid", timezone: "海湾标准（GST）", role: "连锁运营总监", rating: "A 级" },
      demand: { product: "商用力量训练器械整店方案", quantity: "12 家门店分 3 期", targetPrice: "FOB（待对方反馈）", leadTime: "首店 60 天", nextAction: "递交整店报价 + 售后承诺函" },
      judgment: { experience: "中高", priceSensitivity: "中", pain: "售后 / 质保", risks: ["要求 36 个月质保", "需提供阿拉伯语说明书与培训"] },
      strategy: [
        "整店方案 + 阿拉伯语物料 + 3 年质保打包报价。",
        "对接迪拜本地服务商（已合作 2 家），承诺 48h 上门。",
        "邀请买家高层访华验厂（含周末安排）。",
      ],
    },
    followUps: [
      { date: "03-31", channel: "迪拜展会", summary: "现场名片交换 + 整店方案初步沟通", outcome: "买家索要详细报价单与售后承诺", tone: "info" },
    ],
  },
};

// ============================================================
// Inquiry overview card (mirrors InquiryResultMessage layout)
// ============================================================
const InquiryOverview = ({ data }: { data: BuyerProfileData }) => (
  <div className="space-y-2.5">
    <SectionCard icon={Sparkles} title="业务专家指点" accent>
      <p className="text-foreground/85 text-[12.5px] leading-[1.6]">{data.inquiry.expertTip}</p>
    </SectionCard>

    <div className="grid grid-cols-2 gap-2.5">
      <SectionCard icon={UserRound} title="买家画像">
        <div className="space-y-1">
          <KV label="公司" value={data.inquiry.buyer.company} />
          <KV label="联系人" value={data.inquiry.buyer.contact} />
          <KV label="时区" value={data.inquiry.buyer.timezone} />
          <KV label="角色" value={data.inquiry.buyer.role} />
          <KV
            label="评分"
            value={
              <span className="inline-flex items-center gap-1">
                <span className="inline-flex text-amber-500">
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                </span>
                <span className="px-1 py-0 text-[10px] rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 font-medium">{data.inquiry.buyer.rating}</span>
              </span>
            }
          />
        </div>
      </SectionCard>

      <SectionCard icon={ListChecks} title="需求摘要">
        <div className="space-y-1">
          <KV label="产品" value={data.inquiry.demand.product} />
          <KV label="数量" value={data.inquiry.demand.quantity} />
          <KV
            label="目标价"
            value={<span className="px-1 py-0 text-[10px] rounded border border-amber-500/20 bg-amber-500/10 text-amber-600 font-medium">{data.inquiry.demand.targetPrice}</span>}
          />
          <KV label="交期" value={data.inquiry.demand.leadTime} />
          <KV label="下一步" value={data.inquiry.demand.nextAction} />
        </div>
      </SectionCard>
    </div>

    <SectionCard icon={Brain} title="AI 关键判断">
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        <div className="rounded-md border border-border bg-muted/20 px-2 py-1.5">
          <p className="text-[10px] text-muted-foreground">采购经验</p>
          <p className="text-[12px] font-medium text-emerald-600">{data.inquiry.judgment.experience}</p>
        </div>
        <div className="rounded-md border border-border bg-muted/20 px-2 py-1.5">
          <p className="text-[10px] text-muted-foreground">价格敏感</p>
          <p className="text-[12px] font-medium text-amber-600">{data.inquiry.judgment.priceSensitivity}</p>
        </div>
        <div className="rounded-md border border-border bg-muted/20 px-2 py-1.5">
          <p className="text-[10px] text-muted-foreground">最大痛点</p>
          <p className="text-[11px] font-medium text-foreground leading-tight">{data.inquiry.judgment.pain}</p>
        </div>
      </div>
      <div className="space-y-1">
        {data.inquiry.judgment.risks.map((r, i) => (
          <div key={i} className="flex gap-1.5 items-start text-[11.5px] text-foreground/85 rounded bg-amber-500/[0.06] border border-amber-500/15 px-2 py-1">
            <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-[1.55]">{r}</p>
          </div>
        ))}
      </div>
    </SectionCard>

    <SectionCard icon={Compass} title="跟进策略要点">
      <div className="space-y-1">
        {data.inquiry.strategy.map((p, i) => (
          <div key={i} className="flex gap-2 text-[12px]">
            <span className="shrink-0 w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold mt-0.5">{i + 1}</span>
            <p className="flex-1 text-foreground/85 leading-[1.55]">{p}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  </div>
);

// ============================================================
// Follow-up archive timeline
// ============================================================
const FollowUpArchive = ({ items }: { items: BuyerProfileData["followUps"] }) => {
  const channelIcon = (ch: string) => {
    if (ch.includes("邮件")) return Mail;
    if (ch.includes("展会")) return Sparkles;
    return MessageCircle;
  };
  const toneClass = (tone: "success" | "warn" | "info") =>
    tone === "success"
      ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-600"
      : tone === "warn"
        ? "border-amber-500/20 bg-amber-500/[0.06] text-amber-600"
        : "border-primary/20 bg-primary/[0.05] text-primary";
  return (
    <div className="space-y-2">
      {items.map((it, i) => {
        const Icon = channelIcon(it.channel);
        return (
          <div key={i} className="rounded-lg border border-border bg-card/70 backdrop-blur-sm px-3 py-2.5 flex gap-3">
            <div className="flex flex-col items-center pt-0.5">
              <div className={`w-7 h-7 rounded-full border flex items-center justify-center ${toneClass(it.tone)}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              {i < items.length - 1 && <div className="flex-1 w-px bg-border my-1" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="font-medium text-foreground">{it.date}</span>
                <span className="px-1.5 py-0.5 rounded bg-muted text-[10px]">{it.channel}</span>
              </div>
              <p className="mt-1 text-[12.5px] font-medium text-foreground leading-snug">{it.summary}</p>
              <p className="mt-0.5 text-[11.5px] text-muted-foreground leading-snug flex items-start gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                <span>{it.outcome}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================
// Main detail page
// ============================================================
interface BuyerProfileDetailProps {
  buyerId: string;
  onBack: () => void;
}

const BuyerProfileDetail = ({ buyerId, onBack }: BuyerProfileDetailProps) => {
  const data = BUYER_DATA[buyerId];
  const [openKey, setOpenKey] = useState<string | null>(null);

  if (!data) {
    return (
      <main className="ambient-bg flex-1 h-screen overflow-y-auto bg-background">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> 返回买家档案
          </button>
          <p className="mt-6 text-sm text-muted-foreground">未找到该买家档案。</p>
        </div>
      </main>
    );
  }

  const taskCards = [
    {
      key: "background",
      label: "买家背调",
      desc: "深度背景调查结果归档",
      tag: "1 份报告",
      icon: Search,
      gradient: "from-primary/15 via-primary/8 to-transparent",
      iconBg: "bg-primary/15 text-primary",
      content: <BuyerBackgroundReport />,
    },
    {
      key: "inquiry",
      label: "分析询盘",
      desc: "由业务专家自动生成的询盘洞察",
      tag: "AI 洞察",
      icon: ListChecks,
      gradient: "from-emerald-500/15 via-emerald-500/8 to-transparent",
      iconBg: "bg-emerald-500/15 text-emerald-600",
      content: <InquiryOverview data={data} />,
    },
    {
      key: "strategy",
      label: "策略咨询",
      desc: "沟通策略与跟进记录",
      tag: `${data.followUps.length} 条记录`,
      icon: Compass,
      gradient: "from-amber-500/15 via-amber-500/8 to-transparent",
      iconBg: "bg-amber-500/15 text-amber-600",
      content: <FollowUpArchive items={data.followUps} />,
    },
  ];

  const active = taskCards.find((c) => c.key === openKey);

  return (
    <main className="ambient-bg relative flex-1 h-screen overflow-y-auto scrollbar-thin bg-background">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> 返回任务成果
        </button>

        <section className="mt-4 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm p-5 opacity-0 animate-fade-up" style={{ animationDelay: "60ms" }}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-semibold text-primary">
                <UserRound className="w-3 h-3" />
                买家档案
              </span>
              <h1 className="mt-2 text-xl font-bold text-foreground">{data.name}</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                {data.region}　·　{data.contact}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="rounded-md border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{data.status}</span>
              {data.meta && <span className="text-[11px] text-muted-foreground">{data.meta}</span>}
            </div>
          </div>
        </section>

        <button
          onClick={() => setOpenKey("background")}
          className="group mt-5 w-full text-left rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm p-5 opacity-0 animate-fade-up transition-all hover:border-primary/40 hover:shadow-md"
          style={{ animationDelay: "75ms" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Search className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground">买家背调报告</h2>
              </div>
              <p className="mt-1 text-[11.5px] text-muted-foreground leading-snug">公司概况、采购实力和风险提示</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
        </button>

        <section className="mt-5 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm p-5 opacity-0 animate-fade-up" style={{ animationDelay: "90ms" }}>
          <div className="mb-3 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <h2 className="text-sm font-bold text-foreground">关键跟进节点</h2>
            <span className="text-[11px] text-muted-foreground">共 {data.followUps.length} 个节点</span>
          </div>
          <div className="relative overflow-x-auto scrollbar-thin">
            <div className="absolute left-0 right-0 top-[18px] h-px bg-gradient-to-r from-primary/40 via-border to-border" />
            <ol className="relative flex min-w-full gap-4">
              {[...data.followUps].reverse().map((it, i, arr) => {
                const tone = it.tone === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                  : it.tone === "warn"
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-600"
                    : "border-primary/30 bg-primary/10 text-primary";
                const isLast = i === arr.length - 1;
                return (
                  <li key={i} className="relative flex min-w-[180px] flex-1 flex-col">
                    <div className="flex items-center gap-2">
                      <span className={`relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-background ${tone}`}>
                        {isLast ? <Sparkles className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span className="font-medium text-foreground">{it.date}</span>
                      <span className="px-1.5 py-0.5 rounded bg-muted text-[10px]">{it.channel}</span>
                    </div>
                    <p className="mt-1 text-[12.5px] font-medium text-foreground leading-snug">{it.summary}</p>
                    <p className="mt-0.5 text-[11.5px] text-muted-foreground leading-snug">{it.outcome}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <div className="mt-6 mb-3 flex items-center gap-2 opacity-0 animate-fade-up" style={{ animationDelay: "120ms" }}>
          <Archive className="w-3.5 h-3.5 text-muted-foreground" />
          <h2 className="text-sm font-bold text-foreground">历史买家档案</h2>
          <span className="text-[11px] text-muted-foreground">{taskCards.length} 类沉淀结果</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {taskCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <button
                key={card.key}
                onClick={() => setOpenKey(card.key)}
                className="group relative overflow-hidden text-left rounded-2xl border border-border/60 bg-card/85 backdrop-blur-sm shadow-card p-4 opacity-0 animate-fade-up transition-all hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
                style={{ animationDelay: `${180 + i * 80}ms` }}
              >
                <span aria-hidden className={`pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-gradient-to-br ${card.gradient} blur-2xl`} />
                <div className="relative flex items-start gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${card.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[14px] font-semibold text-foreground leading-tight">{card.label}</h3>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <p className="text-[11.5px] text-muted-foreground mt-1 leading-snug">{card.desc}</p>
                    <span className="mt-2 inline-flex items-center rounded-md border border-border/70 bg-background/60 px-1.5 py-0.5 text-[10.5px] text-muted-foreground">
                      {card.tag}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={openKey !== null} onOpenChange={(o) => !o && setOpenKey(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto scrollbar-thin">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${active.iconBg}`}>
                    <active.icon className="w-3.5 h-3.5" />
                  </span>
                  {active.label}
                </DialogTitle>
                <DialogDescription className="text-[12px]">{active.desc}</DialogDescription>
              </DialogHeader>
              <div className="mt-2">{active.content}</div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default BuyerProfileDetail;
