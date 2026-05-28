import { useState } from "react";
import {
  Lightbulb,
  FileText,
  Copy,
  Check,
  TrendingUp,
  UserRound,
  ListChecks,
  Brain,
  Compass,
  AlertTriangle,
  Building2,
  Globe,
  CreditCard,
  ShieldCheck,
  Users,
  ShieldAlert,
  Mail,
  Zap,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export interface ChatQuote {
  moduleName: string;
  preview: string;
  fullContent: string;
}

interface InquiryResultMessageProps {
  onAction?: (action: string) => void;
  onQuote?: (quote: ChatQuote) => void;
  onSendPrompt?: (text: string) => void;
  expertAvatar?: string;
  onBackgroundCheck?: () => void;
}

// ============================================================
// Compact section card (tight padding for one-screen layout)
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
      accent ? "border-primary/20 bg-primary/[0.03]" : "border-border bg-card"
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
  <div className="flex items-start gap-1.5 text-[12.5px] leading-[1.6]">
    <span className="text-muted-foreground shrink-0">{label}</span>
    <span className="text-foreground/85 flex-1">{value}</span>
  </div>
);

const InlineKV = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <p className="text-base leading-[1.75] text-foreground/85">
    <span className="font-semibold text-foreground">{label}</span>
    {value}
  </p>
);

// ============================================================
// 询盘回复模板 — collapsible text block
// ============================================================
const REPLY_TEMPLATE = `Subject: Re: 5kW Hybrid Inverter (UL1741) — Cert, Lead Time & Sample Plan

Dear John,

Thanks for the detailed inquiry. This is [Your Name] from [Your Company]. We are a UL1741-certified manufacturer of residential hybrid inverters and have been supplying US distributors for 5+ years.

To address your priorities directly:

1) UL1741 certification
   — Please find attached the UL1741 certificate and the latest SGS test report.
   — Model: HBR-5K-US (5kW hybrid, 48V battery, US split-phase 120/240V).

2) Lead time — two options for 300 units
   — Standard production: 35–38 days ex-works.
   — Expedited production: 26–28 days ex-works (+3% fee).

3) Sample plan
   — We can air-ship 1–2 samples within 3 working days from stock.
   — Sample fee + air freight are 100% deductible from your bulk PO.

Best regards,
[Your Name]`;

const ReplyTemplateBlock = () => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(REPLY_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <section className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-1.5 px-3.5 py-3 border-b border-border/60">
        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
        <h3 className="font-medium text-foreground text-[12.5px]">询盘回复模板</h3>
        <button
          onClick={handleCopy}
          className="ml-auto p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/[0.08] transition-colors"
          title={copied ? "已复制" : "复制"}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <div className={`relative ${expanded ? "" : "max-h-[4.2em] overflow-hidden"}`}>
        <pre className="px-3.5 py-3 whitespace-pre-wrap text-[12px] text-foreground/85 leading-[1.4] font-sans">
          {REPLY_TEMPLATE}
        </pre>
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/90 to-transparent" />
        )}
      </div>
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full flex items-center justify-center gap-1 px-4 py-2 text-xs text-primary font-medium hover:bg-muted/50 transition-colors active:scale-[0.995] border-t border-border/60"
        >
          展开全部
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      )}
    </section>
  );
};

// ============================================================
// Main inquiry analysis report (compact, one-screen)
// ============================================================
const InquiryResultMessage = ({ expertAvatar, onBackgroundCheck, onSendPrompt }: InquiryResultMessageProps) => {
  return (
    <div className="space-y-2.5">
      {/* 业务专家指点 */}
      <section className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-3.5">
        <div className="flex items-center gap-1.5 mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-primary" />
          <h3 className="font-semibold text-foreground text-[13.5px]">业务专家指点</h3>
        </div>
        <div className="flex gap-2.5 items-start">
          {expertAvatar && (
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-border/60">
              <img src={expertAvatar} alt="业务专家" className="w-full h-full object-cover object-top" />
            </div>
          )}
          <p className="flex-1 text-foreground/85 text-[13.5px] leading-[1.65]">
            典型的北美中型渠道商跨行试水。对产品底层工艺不熟，但对<span className="text-primary font-medium">包装、物流和最终利润</span>要求极高。不要被他杂乱的定制需求带偏，<span className="text-primary font-medium">用成熟的电商现成方案去框住他</span>。
          </p>
        </div>
      </section>

      {/* 买家画像 + 需求摘要 */}
      <div className="grid grid-cols-2 gap-2.5">
        <section className="rounded-2xl border border-border bg-card p-3.5">
          <div className="flex items-center gap-1.5 mb-2">
            <UserRound className="w-3.5 h-3.5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground text-[13.5px]">买家画像</h3>
            <button
              onClick={onBackgroundCheck}
              className="ml-auto inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/[0.06] px-2 py-0.5 text-[11.5px] font-medium text-primary hover:bg-primary/10 transition-colors active:scale-[0.97]"
            >
              <Compass className="w-3 h-3" />
              深度背调
            </button>
          </div>
          <div className="space-y-1">
            <KV label="公司" value="GreenLife Home LLC." />
            <KV label="类型" value="亚马逊卖家 / 区域分销商" />
            <KV label="联系人" value="John Doe（Sourcing Manager）" />
            <KV label="地区" value="北美 - 美国（USA）" />
            <div className="flex items-center gap-1.5 text-[12.5px] pt-0.5">
              <span className="text-muted-foreground shrink-0">阶段</span>
              <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/[0.06] px-1.5 py-0.5 text-[11px] font-medium text-primary">
                寻源比价期 · 初期
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-3.5">
          <div className="flex items-center gap-1.5 mb-2">
            <ListChecks className="w-3.5 h-3.5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground text-[13.5px]">需求摘要</h3>
          </div>
          <div className="space-y-1">
            <KV label="产品" value="智能感应垃圾桶（电池 / 插电双模）" />
            <KV label="数量" value="1,000 units（初定首单量）" />
            <KV label="交期" value="极紧 · 10 月中旬到仓" />
            <KV label="关注" value="包装跌落测试、是否支持 FBA 贴标" />
            <div className="flex items-center gap-1.5 text-[12.5px] pt-0.5">
              <span className="text-muted-foreground shrink-0">匹配</span>
              <span className="inline-flex items-center rounded-md border border-emerald-500/25 bg-emerald-500/[0.08] px-1.5 py-0.5 text-[11px] font-medium text-emerald-600">
                与您主营产品高度相近
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* AI 关键判断 */}
      <section className="rounded-2xl border border-border bg-card p-3.5">
        <div className="flex items-center gap-1.5 mb-2">
          <Brain className="w-3.5 h-3.5 text-primary" />
          <h3 className="font-semibold text-foreground text-[13.5px]">AI 关键判断</h3>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-2.5">
          <div className="rounded-lg border border-primary/20 bg-primary/[0.04] px-2.5 py-2">
            <p className="text-[11.5px] text-muted-foreground mb-0.5">买家意向</p>
            <p className="text-[13px] font-semibold text-primary">高（High Intent）</p>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] px-2.5 py-2">
            <p className="text-[11.5px] text-muted-foreground mb-0.5">询盘真实性</p>
            <p className="text-[13px] font-semibold text-emerald-600">可靠 · 企业域名</p>
          </div>
          <div className="rounded-lg border border-orange-400/25 bg-orange-400/[0.06] px-2.5 py-2">
            <p className="text-[11.5px] text-muted-foreground mb-0.5">交易风险</p>
            <p className="text-[13px] font-semibold text-orange-500">中 · 交期极紧</p>
          </div>
        </div>
        <ul className="space-y-1.5">
          <li className="flex gap-2 text-[13.5px] leading-[1.65] text-foreground/85">
            <span className="mt-[7px] h-1 w-1 rounded-full bg-primary shrink-0" />
            <span><span className="font-semibold text-foreground">客户动机：</span>客户为电商卖家跨行采购，核心痛点并非电机参数，而是 "降低跨境物流破损率" 及 "准时赶上旺季大促"。</span>
          </li>
          <li className="flex gap-2 text-[13.5px] leading-[1.65] text-foreground/85">
            <span className="mt-[7px] h-1 w-1 rounded-full bg-primary shrink-0" />
            <span><span className="font-semibold text-foreground">行业动态：</span>北美市场近期对 "智能垃圾桶" 的搜索不仅看重感应，"异味控制 (Odor Control)" 正成为拉升 C 端客单价的新红利点。</span>
          </li>
          <li className="flex gap-2 text-[13.5px] leading-[1.65] text-foreground/85">
            <span className="mt-[7px] h-1 w-1 rounded-full bg-primary shrink-0" />
            <span><span className="font-semibold text-foreground">资质合规：</span>涉及带电及插电产品，出口美国务必在首封邮件确认对方是否需要 UL 认证或 FCC 认证，避免到港清关受阻。</span>
          </li>
        </ul>
      </section>

      {/* 跟进建议 */}
      <section className="rounded-2xl border border-border bg-card p-3.5">
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingUp className="w-3.5 h-3.5 text-primary" />
          <h3 className="font-semibold text-foreground text-[13.5px]">跟进建议</h3>
        </div>
        <ul className="space-y-1">
          <li className="flex gap-2 text-[13.5px] leading-[1.65] text-foreground/85">
            <span className="mt-[7px] h-1 w-1 rounded-full bg-primary shrink-0" />
            <span>忽略其不成熟的定制需求，直接主推已过 ISTA-6A 跌落测试的电商专供款，解决其包装安全痛点。</span>
          </li>
          <li className="flex gap-2 text-[13.5px] leading-[1.65] text-foreground/85">
            <span className="mt-[7px] h-1 w-1 rounded-full bg-primary shrink-0" />
            <span>明确告知距离黑五极限发船日仅剩 3 周，必须在本周内敲定订单，利用交期焦虑反向逼单。</span>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default InquiryResultMessage;

// ============================================================
// Email card with copy button (used by InquiryFollowUpResult)
// ============================================================
const EmailCard = ({
  badge,
  badgeTone,
  title,
  desc,
  email,
}: {
  badge: string;
  badgeTone: "primary" | "muted";
  title: string;
  desc: string;
  email: string;
}) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const isPrimary = badgeTone === "primary";
  return (
    <div className={`rounded-xl overflow-hidden border ${isPrimary ? "border-primary/25 bg-primary/[0.03]" : "border-border bg-card"}`}>
      <div className={`px-3.5 py-2.5 border-b flex items-start gap-2 ${isPrimary ? "border-primary/15" : "border-border bg-muted/30"}`}>
        <span
          className={`shrink-0 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-bold ${
            isPrimary
              ? "bg-primary/15 text-primary border border-primary/25"
              : "bg-muted text-muted-foreground border border-border"
          }`}
        >
          {isPrimary ? <Zap className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
          {badge}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-foreground leading-tight">{title}</p>
          <p className="text-[11.5px] text-muted-foreground mt-0.5 leading-[1.55]">{desc}</p>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/[0.08] transition-colors"
          title={copied ? "已复制" : "复制邮件"}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <pre className="px-3.5 py-3 whitespace-pre-wrap text-[12px] text-foreground/85 leading-[1.75] font-sans max-h-[280px] overflow-y-auto scrollbar-thin">
        {email}
      </pre>
    </div>
  );
};

// ============================================================
// Follow-up result — now ALWAYS renders BOTH email versions
// (active + conservative) side-by-side for comparison.
// ============================================================
export const InquiryFollowUpResult = () => {
  const activeEmail = `Subject: Re: 5kW Hybrid Inverter (UL1741) — Cert, Lead Time & Sample Plan

Dear John,

Thanks for the detailed inquiry. This is [Your Name] from [Your Company]. We are a UL1741-certified manufacturer of residential hybrid inverters and have been supplying US distributors for 5+ years.

To address your priorities directly:

1) UL1741 certification
   — Please find attached the UL1741 certificate and the latest SGS test report.
   — Model: HBR-5K-US (5kW hybrid, 48V battery, US split-phase 120/240V).

2) Lead time — two options for 300 units
   — Standard production: 35–38 days ex-works, in line with your July on-shelf target.
   — Expedited production: 26–28 days ex-works (+3% fee), buffer for shipping & customs.

3) Sample plan
   — We can air-ship 1–2 samples within 3 working days from stock.
   — Sample fee + air freight are 100% deductible from your bulk PO.

4) Indicative bulk price
   — FOB Ningbo, 300 units: USD [X.XX] / unit, EXW available on request.
   — Payment: 30% T/T deposit, 70% before shipment; LC at sight also acceptable.

To lock the July timeline, could you confirm:
- Preferred sample shipping address and courier account (if any)?
- Whether you'd like the standard or expedited production slot reserved?

Happy to jump on a 20-min call at your convenience (EST).

Best regards,
[Your Name]
[Your Company]`;

  const conservativeEmail = `Subject: Re: 5kW Hybrid Inverter (UL1741) — A Few Quick Questions Before Quotation

Dear John,

Thank you for reaching out. This is [Your Name] from [Your Company]. We manufacture UL1741-certified 5kW hybrid inverters for the US residential market.

Before sending the formal quotation and sample plan, could you please confirm:

1) UL1741 scope: do you require the standard UL1741 or UL1741-SA (rule 21 compliant)?
2) Target delivery: is the July deadline based on warehouse arrival or shipment date?
3) Sample logistics: do you prefer us to use your courier account (DHL / FedEx) or quote door-to-door?

On samples — we can air-ship 1–2 units from stock within 3 working days. Sample fee + freight are deductible from your first bulk order.

Once the above is confirmed, I will send:
- Full UL1741 certificate + SGS test report
- Two lead-time options (standard / expedited) for 300 units
- Indicative FOB price and payment terms

Looking forward to your reply.

Best regards,
[Your Name]
[Your Company]`;

  return (
    <div className="space-y-3">
      <SectionCard icon={Mail} title="询盘回复邮件 · 两版对比" accent>
        <p className="text-[12.5px] text-foreground/85 leading-[1.7]">
          已为本次询盘生成两版邮件方案，您可对比后择优发送：
          <span className="text-primary font-medium">主动报价版</span> 直接给认证 + 双交期 + 样品政策；
          <span className="text-foreground font-medium">保守追问版</span> 先用 3 个关键问题收敛需求，再给报价。
        </p>
      </SectionCard>

      <EmailCard
        badge="主动报价版"
        badgeTone="primary"
        title="锁认证 + 双交期 + 样品抵货款"
        desc="适合需求清晰、抓单效率优先；客户可一次拿到所有关键信息。"
        email={activeEmail}
      />
      <EmailCard
        badge="保守追问版"
        badgeTone="muted"
        title="先收敛需求，再给结构化报价"
        desc="适合品类级询盘或目标价偏低的场景，避免一次报散被压价。"
        email={conservativeEmail}
      />
    </div>
  );
};

// ============================================================
// Buyer Background Check Report — triggered by 「深度背调」
// ============================================================
export const BuyerBackgroundReport = () => {
  return (
    <div className="space-y-3">
      <SectionCard icon={Lightbulb} title="评估概要" accent>
        <p className="text-[12.5px] text-foreground/85 leading-[1.7]">
          这是一家具有 <span className="text-primary font-medium">15 年历史</span>的成熟型进口商，其产品线定价处于<span className="text-primary font-medium">市场中高段位</span>。这类客户的供应链通常相对稳定，他们对价格的敏感度排在第二位，第一诉求是 <span className="text-primary font-medium">"品质的一致性"</span> 和 <span className="text-primary font-medium">"交期的绝对保障"</span>。如果对方主动询盘，大概率是原有供应商出现了质量波动或产能瓶颈。
        </p>
      </SectionCard>

      <section className="rounded-xl border border-border bg-card p-4 space-y-4">
        <div className="flex items-center gap-1.5 pb-2 border-b border-border/60">
          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
          <h3 className="font-medium text-foreground text-[12.5px]">详细背调报告</h3>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
            <h4 className="font-medium text-foreground text-[12.5px]">公司概况</h4>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <KV label="公司名" value="TechSol US LLC" />
            <KV label="注册地" value="Austin, Texas, USA" />
            <KV label="成立时间" value="2010 年（约 15 年）" />
            <KV label="员工规模" value="80–120 人" />
            <KV label="组织形式" value="独立法人 · 私有制 LLC" />
            <KV label="经营状态" value={<span className="text-emerald-600">活跃 · 良好</span>} />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <h4 className="font-medium text-foreground text-[12.5px]">核心管理层</h4>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-start gap-2 text-[12px]">
              <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary">CEO</span>
              <p className="flex-1 text-foreground/85 leading-[1.6]">
                <span className="font-medium text-foreground">Sarah Wong</span> · 创始人 · 在职 15 年，主导战略与大额订单签批
              </p>
            </div>
            <div className="flex items-start gap-2 text-[12px]">
              <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">采购</span>
              <p className="flex-1 text-foreground/85 leading-[1.6]">
                <span className="font-medium text-foreground">John Carter</span> · Procurement Manager · 在职 6 年，对接中国工厂
              </p>
            </div>
            <div className="flex items-start gap-2 text-[12px]">
              <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">技术</span>
              <p className="flex-1 text-foreground/85 leading-[1.6]">
                <span className="font-medium text-foreground">Mark Liu</span> · 技术总监 · 决定认证、兼容性与样品验收
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            <h4 className="font-medium text-foreground text-[12.5px]">主营业务与核心产品</h4>
          </div>
          <div className="space-y-1">
            <KV label="主营业务" value="家用光伏 / 储能系统集成、安装与零售" />
            <KV label="核心品类" value="混合逆变器、储能电池柜、智能能源管理网关" />
            <KV label="目标市场" value="美国德州及周边州（ERCOT 电网区域）" />
            <KV label="品牌定位" value="中高端 · 终端零售均价 $4,500–$8,000" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
            <h4 className="font-medium text-foreground text-[12.5px]">采购行为与财务信号</h4>
          </div>
          <div className="space-y-1">
            <KV label="年采购额" value="≈ $2.5–4M（逆变器 + 电池柜）" />
            <KV label="主要供应商" value="深圳 × 2、宁波 × 1，另有韩国 LG-Chem 电芯直采" />
            <KV label="付款方式" value="30% T/T + 70% L/C 60 天，大单可接受 D/P" />
            <KV label="财务状况" value={<span className="text-emerald-600">D&B 评级 3A2 · 无欠款记录</span>} />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <h4 className="font-medium text-foreground text-[12.5px]">风险提示</h4>
          </div>
          <div className="space-y-1">
            <KV label="法律纠纷" value="无公开诉讼或仲裁记录" />
            <KV label="制裁 / 黑名单" value="未出现在 OFAC/BIS/EU 制裁清单中" />
            <KV label="潜在风险" value={<span className="text-amber-600">德州电网政策变动可能影响采购节奏</span>} />
          </div>
        </div>
      </section>
    </div>
  );
};
