import { useState } from "react";
import {
  Sparkles,
  MessageCircleHeart,
  BookOpen,
  Plus,
  Check,
  Wand2,
  X,
  Package,
  Target,
  Globe,
  FileUp,
  ShieldCheck,
  PenLine,
  TrendingUp,
  Users,
  Handshake,
  Megaphone,
  Lightbulb,
  Building2,
  Tags,
  Star,
  Briefcase,
  FlaskConical,
  Calculator,
  Wallet,
  ArrowRight,
  Loader2,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import operationAvatar from "@/assets/expert-operation.jpg";
import businessAvatar from "@/assets/expert-business.jpg";
import trainingAvatar from "@/assets/expert-training.jpg";

interface CompanyForm {
  // 公司实力
  companyName: string;
  website: string;
  companyProfile: string;
  capacityScale: string;
  trustEndorsement: string;
  // 产品服务
  mainProducts: string;
  productSelling: string;
  moqLeadtime: string;
  // 报价策略
  sampleRule: string;
  quoteRule: string;
  paymentRule: string;
  // 市场情报
  targetMarket: string;
  competitorIntel: string;
  marketTrend: string;
}

interface PreferenceItem {
  id: string;
  title: string;
  source: string;
  detectedAt: string;
  isNew?: boolean;
}

interface ExpertSkillEntry {
  name: string;
  desc: string;
  updatedAt: string;
  isRecent?: boolean;
}

interface ExpertSkillBlock {
  expert: { name: string; role: string; avatar: string; tasks: number; tagline: string };
  skills: ExpertSkillEntry[];
}

type KBModuleKey = "strength" | "product" | "pricing" | "market";

interface MaterialFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  /** Which modules AI dispatched insights to */
  modules: KBModuleKey[];
  /** AI summary of what was extracted */
  summary: string;
  /** Detailed extractions per module */
  extractions: { module: KBModuleKey; points: string[] }[];
}

interface PublicLink {
  id: string;
  title: string;
  url: string;
  addedAt: string;
  modules: KBModuleKey[];
  summary: string;
}

const initialPublicLinks: PublicLink[] = [
  {
    id: "l1",
    title: "公司官网 · About",
    url: "https://www.example-trade.com/about",
    addedAt: "1 周前",
    modules: ["strength"],
    summary: "公司发展历程、团队规模与全球客户分布。",
  },
  {
    id: "l2",
    title: "天猫国际店铺主页",
    url: "https://example.tmall.com",
    addedAt: "3 天前",
    modules: ["product", "market"],
    summary: "线上 SKU 矩阵、定价与热销榜单。",
  },
  {
    id: "l3",
    title: "行业报告 · 2024 户外保温杯白皮书",
    url: "https://example.com/report-2024",
    addedAt: "2 周前",
    modules: ["market"],
    summary: "欧美主要市场容量、品牌格局与趋势数据。",
  },
];

const initialMaterials: MaterialFile[] = [
  {
    id: "m1",
    name: "公司简介-2024.pdf",
    size: "2.4 MB",
    uploadedAt: "3 天前",
    modules: ["strength", "product"],
    summary: "公司发展历程、组织架构与主营品类介绍。",
    extractions: [
      { module: "strength", points: ["成立于 2008 年，员工 280 人", "服务全球 60+ 国家客户"] },
      { module: "product", points: ["主营双层不锈钢真空保温杯"] },
    ],
  },
  {
    id: "m2",
    name: "工厂实景与认证.zip",
    size: "18.6 MB",
    uploadedAt: "1 周前",
    modules: ["strength"],
    summary: "工厂车间实拍、产线说明及第三方认证报告。",
    extractions: [
      {
        module: "strength",
        points: ["自有工厂 12,000㎡，月产能 50 万 pcs", "通过 BSCI / SEDEX / FDA / CE 认证"],
      },
    ],
  },
  {
    id: "m3",
    name: "产品手册-2024.pdf",
    size: "5.8 MB",
    uploadedAt: "今天",
    modules: ["product", "pricing"],
    summary: "12 款 SKU 产品参数、卖点及标准报价。",
    extractions: [
      { module: "product", points: ["12 款 SKU，覆盖运动 / 商务 / 儿童系列", "核心卖点：12h 保温 · 316 食品级 · 防漏"] },
      { module: "pricing", points: ["FOB 宁波 USD 4.8–5.6 / pc"] },
    ],
  },
  {
    id: "m4",
    name: "SKU 清单.xlsx",
    size: "320 KB",
    uploadedAt: "5 天前",
    modules: ["product"],
    summary: "全 SKU 编码、规格、包装与海关编码清单。",
    extractions: [{ module: "product", points: ["MOQ 1,000 pcs，交期 25 天起"] }],
  },
  {
    id: "m5",
    name: "三档报价模板.xlsx",
    size: "180 KB",
    uploadedAt: "2 周前",
    modules: ["pricing"],
    summary: "标准 / 定制 / 品牌三档报价框架与付款规则。",
    extractions: [
      {
        module: "pricing",
        points: ["默认 FOB 宁波，三档报价框架", "T/T 30% 定金 + 70% 见提单副本"],
      },
    ],
  },
];

const KB_MODULES: {
  key: KBModuleKey;
  title: string;
  desc: string;
  icon: typeof Package;
  mastery: number;
  insights: { label: string; filled: boolean }[];
  fields: { label: string; key: keyof CompanyForm; textarea?: boolean }[];
}[] = [
  {
    key: "strength",
    title: "公司实力",
    desc: "公司背景、产能规模与资质背书",
    icon: Building2,
    mastery: 92,
    insights: [
      { label: "基础信息", filled: true },
      { label: "资质与实力", filled: true },
      { label: "客户案例", filled: true },
      { label: "售后与服务", filled: true },
    ],
    fields: [
      { label: "公司名称", key: "companyName" },
      { label: "公司官网", key: "website" },
      { label: "公司简介", key: "companyProfile", textarea: true },
      { label: "产能与团队", key: "capacityScale", textarea: true },
      { label: "资质背书", key: "trustEndorsement", textarea: true },
    ],
  },
  {
    key: "product",
    title: "产品服务",
    desc: "主营产品、卖点与交付条件",
    icon: Tags,
    mastery: 76,
    insights: [
      { label: "主营品类", filled: true },
      { label: "核心卖点", filled: true },
      { label: "起订与交期", filled: true },
      { label: "定制能力", filled: false },
    ],
    fields: [
      { label: "主营产品", key: "mainProducts", textarea: true },
      { label: "产品卖点", key: "productSelling", textarea: true },
      { label: "起订与交期", key: "moqLeadtime", textarea: true },
    ],
  },
  {
    key: "pricing",
    title: "报价策略",
    desc: "样品规则、报价框架与付款条件",
    icon: Wallet,
    mastery: 48,
    insights: [
      { label: "样品规则", filled: true },
      { label: "报价框架", filled: true },
      { label: "付款条件", filled: false },
      { label: "价格区间", filled: false },
    ],
    fields: [
      { label: "样品规则", key: "sampleRule", textarea: true },
      { label: "报价规则", key: "quoteRule", textarea: true },
      { label: "付款条件", key: "paymentRule", textarea: true },
    ],
  },
  {
    key: "market",
    title: "市场情报",
    desc: "目标市场、对标对手与趋势洞察",
    icon: TrendingUp,
    mastery: 35,
    insights: [
      { label: "目标市场", filled: true },
      { label: "对标对手", filled: false },
      { label: "趋势洞察", filled: false },
      { label: "价格带", filled: false },
    ],
    fields: [
      { label: "目标市场", key: "targetMarket", textarea: true },
      { label: "对标对手", key: "competitorIntel", textarea: true },
      { label: "趋势洞察", key: "marketTrend", textarea: true },
    ],
  },
];

const masteryStyle = (m: number) => {
  if (m >= 80) {
    return { label: "掌握度 高", cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", bar: "bg-emerald-500" };
  }
  if (m >= 55) {
    return { label: "掌握度 中", cls: "bg-amber-500/10 text-amber-600 border-amber-500/20", bar: "bg-amber-500" };
  }
  return { label: "待补充", cls: "bg-rose-500/10 text-rose-600 border-rose-500/20", bar: "bg-rose-500" };
};

const experts = [
  { name: "业务专家", role: "询盘到成交全流程", avatar: businessAvatar, tasks: 17, tagline: "询盘到成交全流程" },
  { name: "运营专家", role: "选品·内容·转化", avatar: operationAvatar, tasks: 13, tagline: "选品·内容·转化" },
  { name: "培训专家", role: "市场·合规·风控", avatar: trainingAvatar, tasks: 11, tagline: "市场·合规·风控" },
];

const initialCompanyForm: CompanyForm = {
  companyName: "宁波恒杯进出口有限公司",
  website: "https://www.example-trade.com",
  companyProfile: "成立于 2008 年，专注真空保温器皿研发与出口，累计服务全球 60+ 国家客户。",
  capacityScale: "自有工厂 12,000㎡，注塑+焊接+喷涂全链；月产能 50 万 pcs，员工 280 人",
  trustEndorsement: "BSCI / SEDEX 工厂审核；FDA、LFGB、CE 认证；服务 Stanley、Contigo 等品牌",
  mainProducts: "双层不锈钢真空保温杯（12 款 SKU，含运动、商务、儿童系列）",
  productSelling: "12h 长效保温、316 食品级内胆、防漏静音盖、可定制 Logo",
  moqLeadtime: "标准款 MOQ 1,000 pcs，交期 25 天；定制款 MOQ 3,000 pcs，交期 35–45 天",
  sampleRule: "免费样品 1–2 pcs，运费到付；定制样收 80–150 USD，可在大货中冲抵",
  quoteRule: "默认 FOB 宁波；MOQ 1,000 pcs；标准 / 定制 / 品牌三档报价",
  paymentRule: "T/T 30% 定金 + 70% 见提单副本；老客户支持 OA 30 天",
  targetMarket: "欧洲、北美、澳洲；DTC 品牌、垂直进口商",
  competitorIntel: "主要对标 Stanley、Contigo、YETI；价格带集中在 USD 12-28 FOB 区间",
  marketTrend: "户外露营与通勤场景持续增长；环保材质与定制礼品需求上升明显",
};

const initialPreferences: PreferenceItem[] = [
  {
    id: "p1",
    title: "回复风格更倾向克制专业，少用营销修辞",
    source: "归纳自近 8 次询盘回复",
    detectedAt: "今天",
    isNew: true,
  },
  {
    id: "p2",
    title: "详情图偏好居家实景叠加数据卖点",
    source: "归纳自 3 次详情页生成",
    detectedAt: "2 天前",
    isNew: true,
  },
  {
    id: "p3",
    title: "重点跟进欧洲、北美中大型采购方（≥1×40HQ）",
    source: "归纳自买家背调与跟进策略会话",
    detectedAt: "5 天前",
  },
  {
    id: "p4",
    title: "高频卖点：保温 12h、双层真空、防漏",
    source: "归纳自 12 次产品对话",
    detectedAt: "1 周前",
  },
];

interface InsightItem {
  headline: string;
  evidence: string;
  source: string;
}

// 专家实战经验：分两个子板块（精简，每组 2 条要点）
const expertExperienceGroups: {
  key: string;
  title: string;
  desc: string;
  items: string[];
}[] = [
  {
    key: "follow-up",
    title: "客户跟进技巧",
    desc: "1200+ 跟进会话沉淀",
    items: [
      "未回复客户 D+3 发「样品图 + 同类案例」，回复率提升 2 倍",
      "高意向客户走「样品 → 合同 → 试单」三步，2 周内锁单",
    ],
  },
  {
    key: "cases",
    title: "500+ 真实外贸案例",
    desc: "覆盖欧美、中东核心市场",
    items: [
      "德国 DTC · 保温杯 5000 pcs 首单，14 天锁单",
      "美亚卖家 · 试单 → 2×40HQ 复购，周期 45 天",
    ],
  },
];

// 团队经验技巧：标题 + 副标题 + 标签 + 来自业务员
interface TeamSkillItem {
  headline: string;
  subtitle: string;
  tags: string[];
  author: string;
}
const teamSkillItems: TeamSkillItem[] = [
  {
    headline: "刚询价且需求不清时先拆应用场景再引预算区间",
    subtitle: "客户刚询价但需求不明确时，不直接报完整价格，先用应用场景拆需求并引出预算区间再推进报价。",
    tags: ["询价", "报价跟进", "需求不清", "比价", "压价"],
    author: "Rita",
  },
  {
    headline: "首封回复先抛 3 个澄清问题，再给方案概览",
    subtitle: "首封回复不堆产品参数，先用 3 个高价值澄清问题锁定客户真实场景，再附上方案概览引导深聊。",
    tags: ["首封回复", "澄清问题", "意图判断", "节奏控制"],
    author: "Jason",
  },
  {
    headline: "报价用「标准 / 定制 / 品牌」三档组合替代单价",
    subtitle: "面对不确定预算的客户，用三档组合报价替代单一报价，引导客户主动选档，降低议价压力。",
    tags: ["报价策略", "三档组合", "议价", "客单价"],
    author: "Jason",
  },
  {
    headline: "详情页用使用场景替代技术参数堆砌",
    subtitle: "在详情页前两屏用真实使用场景图与短句替代参数列表，提升非专业买家的转化率。",
    tags: ["详情页", "使用场景", "转化率", "首屏"],
    author: "Cody",
  },
  {
    headline: "差异化卖点放首屏，认证背书收尾建立信任",
    subtitle: "首屏直击差异化卖点，结尾集中放置认证、检测报告与合作品牌，形成「卖点 → 信任」闭环。",
    tags: ["卖点", "首屏", "认证背书", "信任建立"],
    author: "Cody",
  },
  {
    headline: "未回复客户 D+3 改用「样品图 + 同类案例」",
    subtitle: "对 3 天未回复的客户切换沟通角度，用样品实拍 + 同类客户成交案例，回复率可提升 2 倍。",
    tags: ["跟进策略", "未回复", "样品", "案例触达"],
    author: "Rita",
  },
  {
    headline: "高意向客户走「样品 → 合同 → 试单」三步锁单",
    subtitle: "识别高意向信号后用三步流程压缩决策周期，2 周内可推进试单，避免反复议价。",
    tags: ["高意向", "锁单", "试单", "周期压缩"],
    author: "Jason",
  },
];
const TEAM_SKILLS_PER_PAGE = 5;

const expertSkillBlocks: ExpertSkillBlock[] = [
  {
    expert: experts[0],
    skills: [
      { name: "询盘意图分级与回复", desc: "识别采购真伪，匹配多语种回复模版", updatedAt: "今天", isRecent: true },
      { name: "买家背景调查", desc: "结合海关数据与公开资料，定位决策人", updatedAt: "1 周前" },
      { name: "报价与议价策略", desc: "FOB / CIF / DDP 组合报价与让价建议", updatedAt: "2 周前" },
    ],
  },
  {
    expert: experts[1],
    skills: [
      { name: "高转化详情页生成", desc: "首图、卖点、信任背书全链路结构", updatedAt: "今天", isRecent: true },
      { name: "多平台营销素材", desc: "Alibaba、Amazon、TikTok 图文与脚本", updatedAt: "3 天前" },
      { name: "SEO 标题优化", desc: "结合搜索热词与买家提问重写标题", updatedAt: "2 周前" },
    ],
  },
  {
    expert: experts[2],
    skills: [
      { name: "目标市场行情解读", desc: "需求周期、价格带与重点采购展会", updatedAt: "昨天", isRecent: true },
      { name: "出口合规与认证", desc: "FDA、CE、LFGB 等认证要点答疑", updatedAt: "1 周前" },
    ],
  },
];

type TabKey = "company" | "preference" | "skills";

const focusChips = ["保温杯", "户外水壶", "运动水杯", "儿童学饮杯", "礼品杯", "商务杯"];
const marketChips = ["欧洲", "北美", "澳洲", "中东", "东南亚", "拉美"];

const FOCUS_OPTIONS = ["内贸转外贸", "新市场开拓", "多渠道营销", "买家成交转化", "客户黏性运营"];

interface AIProfileDetailProps {
  onTrySimilar?: (prompt: string) => void;
}

const AIProfileDetail = ({ onTrySimilar }: AIProfileDetailProps = {}) => {
  const [activeTab, setActiveTab] = useState<TabKey>("company");
  const [company, setCompany] = useState<CompanyForm>(initialCompanyForm);
  const [draft, setDraft] = useState<CompanyForm>(initialCompanyForm);
  const [editingModule, setEditingModule] = useState<KBModuleKey | null>(null);
  const [retrainingModule, setRetrainingModule] = useState<KBModuleKey | null>(null);
  const [retrainProgress, setRetrainProgress] = useState(0);
  const [materials, setMaterials] = useState<MaterialFile[]>(initialMaterials);
  const [publicLinks, setPublicLinks] = useState<PublicLink[]>(initialPublicLinks);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [preferences, setPreferences] = useState<PreferenceItem[]>(initialPreferences);
  const [detailModule, setDetailModule] = useState<KBModuleKey | null>(null);
  const [activeMaterial, setActiveMaterial] = useState<MaterialFile | null>(null);
  const [teamSkillPage, setTeamSkillPage] = useState(1);
  const [activeTeamSkill, setActiveTeamSkill] = useState<TeamSkillItem | null>(null);
  const teamSkillTotalPages = Math.max(1, Math.ceil(teamSkillItems.length / TEAM_SKILLS_PER_PAGE));
  const teamSkillPageItems = teamSkillItems.slice(
    (teamSkillPage - 1) * TEAM_SKILLS_PER_PAGE,
    teamSkillPage * TEAM_SKILLS_PER_PAGE,
  );

  const newPreferenceCount = preferences.filter((p) => p.isNew).length;

  const startEditModule = (key: KBModuleKey) => {
    setDraft(company);
    setEditingModule(key);
  };
  const cancelEditModule = () => setEditingModule(null);

  const saveModule = (key: KBModuleKey) => {
    setCompany(draft);
    setEditingModule(null);
    triggerRetrain(key);
  };

  const triggerRetrain = (key: KBModuleKey) => {
    setRetrainProgress(0);
    setRetrainingModule(key);
    const timer = setInterval(() => {
      setRetrainProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => setRetrainingModule(null), 600);
          return 100;
        }
        return Math.min(100, p + 10);
      });
    }, 120);
  };

  const handleUpload = (file: File) => {
    const sizeKB = file.size / 1024;
    const sizeLabel = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB.toFixed(0)} KB`;
    setMaterials((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        name: file.name,
        size: sizeLabel,
        uploadedAt: "刚刚",
        modules: [],
        summary: "AI 正在分析中…",
        extractions: [],
      },
    ]);
  };
  const handleRemoveMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const dismissPreference = (id: string) =>
    setPreferences((prev) => prev.filter((p) => p.id !== id));
  const adoptPreference = (id: string) =>
    setPreferences((prev) => prev.map((p) => (p.id === id ? { ...p, isNew: false } : p)));

  const tabs: { key: TabKey; label: string; badge?: number }[] = [
    { key: "company", label: "企业知识" },
    { key: "preference", label: "团队经验", badge: newPreferenceCount },
    { key: "skills", label: "AI 技能" },
  ];

  return (
    <main className="flex-1 h-screen overflow-y-auto scrollbar-thin bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 pb-16 pt-12 sm:px-10 lg:px-14">
        {/* Eyebrow + display headline */}
        <section className="opacity-0 animate-fade-up" style={{ animationDelay: "60ms" }}>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground/80">专属专家进化历程</p>
          <h1 className="mt-3 text-[28px] font-bold leading-[1.1] tracking-tight text-foreground sm:text-[32px]">
            AI团队档案
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            档案承载企业文档资料、AI 在协作中沉淀的偏好，以及三位专家的专业能力图谱。
          </p>
        </section>


        {/* Tabs */}
        <section className="mt-10 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/70 p-1 backdrop-blur-sm">
            {tabs.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "relative inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                  {tab.badge && tab.badge > 0 ? (
                    <span
                      className={cn(
                        "inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold",
                        active
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-primary/12 text-primary"
                      )}
                    >
                      +{tab.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>

        {/* Module 1: 企业知识库 */}
        {activeTab === "company" && (
          <section className="mt-6 opacity-0 animate-fade-up" style={{ animationDelay: "220ms" }}>
            <ModuleHeader
              icon={BookOpen}
              title="企业知识库"
              sub="围绕公司实力、产品服务、报价策略、市场情报四大模块沉淀，AI 持续识别掌握程度"
              actions={
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                  <Sparkles className="h-3 w-3" />
                  整体掌握度 {Math.round(KB_MODULES.reduce((s, m) => s + m.mastery, 0) / KB_MODULES.length)}%
                </span>
              }
            />

            <TrainingLibraryBar
              fileCount={materials.length}
              linkCount={publicLinks.length}
              onOpen={() => setLibraryOpen(true)}
            />

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {KB_MODULES.map((mod) => (
                <CondensedModuleCard
                  key={mod.key}
                  mod={mod}
                  onOpen={() => setDetailModule(mod.key)}
                />
              ))}
            </div>

            {/* Module detail drawer */}
            <ModuleDetailSheet
              moduleKey={detailModule}
              company={company}
              draft={draft}
              setDraft={setDraft}
              editing={editingModule}
              retraining={retrainingModule}
              retrainProgress={retrainProgress}
              onClose={() => {
                setDetailModule(null);
                cancelEditModule();
              }}
              onStartEdit={() => detailModule && startEditModule(detailModule)}
              onCancelEdit={cancelEditModule}
              onSave={() => detailModule && saveModule(detailModule)}
              onRetrain={() => detailModule && triggerRetrain(detailModule)}
            />
          </section>
        )}

        {/* Module 2: 团队经验 */}
        {activeTab === "preference" && (
          <section className="mt-6 opacity-0 animate-fade-up" style={{ animationDelay: "220ms" }}>
            <div className="flex items-end justify-between gap-3">
              <p className="text-[12px] text-muted-foreground">AI 从历史会话中沉淀的市场认知与团队打法</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                <Sparkles className="h-3 w-3" />
                本周持续学习中
              </span>
            </div>

            {/* 上：团队经验技巧 — 可新增；下：专家实战经验 */}
            <div className="mt-4 space-y-4">
              {/* 团队经验技巧 */}
              <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-secondary/[0.04] shadow-sm transition-all hover:shadow-md">
                <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-secondary/8 blur-3xl" />
                <header className="relative flex items-center justify-between gap-3 border-b border-border/40 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
                      <Lightbulb className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-[13.5px] font-bold text-foreground">团队经验技巧</h3>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-success/10 px-1.5 py-0.5 text-[10px] font-semibold text-success">
                          <Check className="h-2.5 w-2.5" />
                          共 {teamSkillItems.length} 条
                        </span>
                      </div>
                      <p className="mt-0.5 text-[10.5px] text-muted-foreground">来自团队业务员沉淀</p>
                    </div>
                  </div>
                </header>

                <ul className="relative flex-1 divide-y divide-border/30 px-4 py-1">
                  {teamSkillPageItems.map((it) => (
                    <li
                      key={`team-${it.headline}`}
                      className="py-5"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveTeamSkill(it)}
                        className="group/item flex w-full items-start justify-between gap-3 text-left focus:outline-none"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[12.5px] font-bold text-foreground group-hover/item:text-primary transition-colors">
                              {it.headline}
                            </span>
                            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-all group-hover/item:translate-x-0.5 group-hover/item:text-primary" />
                          </div>
                          <p className="mt-2.5 text-[12px] leading-relaxed text-muted-foreground line-clamp-2">
                            {it.subtitle}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {it.tags.map((t) => (
                              <span
                                key={t}
                                className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="mt-0.5 shrink-0 whitespace-nowrap text-[10.5px] text-muted-foreground/70">
                          来自 {it.author}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                {teamSkillTotalPages > 1 && (
                  <footer className="relative flex items-center justify-between gap-2 border-t border-border/40 px-4 py-2.5">
                    <span className="text-[11px] text-muted-foreground">
                      第 {teamSkillPage} / {teamSkillTotalPages} 页
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setTeamSkillPage((p) => Math.max(1, p - 1))}
                        disabled={teamSkillPage === 1}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-background text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="上一页"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setTeamSkillPage((p) => Math.min(teamSkillTotalPages, p + 1))}
                        disabled={teamSkillPage === teamSkillTotalPages}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-background text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="下一页"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </footer>
                )}
              </div>

            </div>

            {/* 详情弹窗 */}
            <Dialog open={!!activeTeamSkill} onOpenChange={(o) => !o && setActiveTeamSkill(null)}>
              <DialogContent className="sm:max-w-[560px] sm:rounded-2xl">
                {activeTeamSkill && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="pr-6 text-[16px] leading-snug">
                        {activeTeamSkill.headline}
                      </DialogTitle>
                      <DialogDescription className="text-[13px] leading-relaxed text-foreground/75">
                        {activeTeamSkill.subtitle}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                      <div>
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">标签</p>
                        <div className="flex flex-wrap gap-1.5">
                          {activeTeamSkill.tags.map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center rounded-md bg-primary/8 px-2 py-0.5 text-[12px] font-medium text-primary"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/40 px-3 py-2 text-[12px] text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>来自 <span className="font-semibold text-foreground">{activeTeamSkill.author}</span> 的实战沉淀</span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end border-t border-border/50 pt-5">
                      <button
                        onClick={() => {
                          const prompt = `参考团队经验技巧「${activeTeamSkill.headline}」：${activeTeamSkill.subtitle}\n\n请帮我把这个打法应用到当前的客户场景中。`;
                          onTrySimilar?.(prompt);
                          setActiveTeamSkill(null);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98]"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        体验同款
                      </button>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </section>
        )}

        {/* Module 3: AI 专家技能 — 行业能力图谱 */}
        {activeTab === "skills" && (
          <section className="mt-6 opacity-0 animate-fade-up" style={{ animationDelay: "220ms" }}>
            <ModuleHeader
              icon={Wand2}
              title="AI 专家技能"
              sub="每位专家当前已具备的核心能力"
              actions={
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                  本周新增 3 项技能
                </span>
              }
            />

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {expertSkillBlocks.map(({ expert, skills }) => (
                <article
                  key={expert.name}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:border-primary/25 hover:shadow-md"
                >
                  <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />

                  <header className="relative flex items-center gap-3 border-b border-border/40 pb-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-card shadow-sm">
                      <img src={expert.avatar} alt={expert.name} className="h-full w-full object-cover object-top" loading="lazy" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-foreground truncate">{expert.name}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground truncate">{expert.role}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {skills.length} 项
                    </span>
                  </header>

                  <ul className="relative mt-3 space-y-2">
                    {skills.map((s) => (
                      <li key={s.name} className="rounded-xl border border-border/40 bg-background/50 px-3 py-2.5 transition-colors group-hover:bg-background/70">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[12.5px] font-semibold text-foreground leading-snug">{s.name}</p>
                          {s.isRecent && (
                            <span className="shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-primary">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">{s.desc}</p>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Material detail dialog */}
        <MaterialDetailDialog
          material={activeMaterial}
          onClose={() => setActiveMaterial(null)}
        />

        {/* Training library drawer */}
        <TrainingLibrarySheet
          open={libraryOpen}
          onOpenChange={setLibraryOpen}
          materials={materials}
          links={publicLinks}
          onUpload={handleUpload}
          onRemoveMaterial={handleRemoveMaterial}
          onRemoveLink={(id) => setPublicLinks((prev) => prev.filter((l) => l.id !== id))}
          onOpenMaterial={(m) => setActiveMaterial(m)}
        />
      </div>
    </main>
  );
};

const SubModule = ({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: typeof Package;
  title: string;
  desc: string;
  children: React.ReactNode;
}) => (
  <div className="pt-2">
    <header className="mb-4 flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-[15px] font-bold text-foreground">{title}</h3>
        <p className="mt-0.5 text-[11.5px] text-muted-foreground">{desc}</p>
      </div>
    </header>
    <div className="space-y-1">{children}</div>
  </div>
);

interface KnowledgeItem {
  label: string;
  value: string;
  draft: string;
  onChange: (v: string) => void;
  required?: boolean;
}

const KnowledgeCard = ({
  icon: Icon,
  title,
  desc,
  badge,
  editing,
  items,
}: {
  icon: typeof Package;
  title: string;
  desc: string;
  badge?: string;
  editing: boolean;
  items: KnowledgeItem[];
}) => (
  <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-primary/[0.04] shadow-sm transition-all hover:shadow-md">
    <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/8 blur-3xl" />
    <header className="relative flex items-center justify-between gap-3 border-b border-border/40 px-4 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-[13.5px] font-bold text-foreground">{title}</h3>
            {badge && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-success/10 px-1.5 py-0.5 text-[10px] font-semibold text-success">
                <Check className="h-2.5 w-2.5" />
                {badge}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[10.5px] text-muted-foreground">{desc}</p>
        </div>
      </div>
    </header>
    <ul className="relative flex-1 divide-y divide-border/30 px-4 py-1">
      {items.map((it) => (
        <li
          key={it.label}
          className="flex items-baseline gap-3 py-2.5 text-[12.5px] leading-relaxed"
        >
          <span className="w-24 shrink-0 text-[11.5px] font-medium text-muted-foreground">
            {it.label}
            {it.required && <span className="ml-0.5 text-destructive">*</span>}
          </span>
          {editing ? (
            <input
              value={it.draft}
              onChange={(e) => it.onChange(e.target.value)}
              placeholder="点击键入"
              className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1.5 py-0.5 text-foreground/90 transition-colors hover:border-border/60 hover:bg-background/60 focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/50"
            />
          ) : (
            <span className="min-w-0 flex-1 text-foreground/85 break-words">{it.value || <span className="text-muted-foreground/60">未填写</span>}</span>
          )}

        </li>
      ))}
    </ul>
  </div>
);

const FormRow = ({
  label,
  required,
  optional,
  value,
  placeholder,
  disabled,
  onChange,
  chips,
  onChipToggle,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  value: string;
  placeholder: string;
  disabled?: boolean;
  onChange: (v: string) => void;
  chips?: string[];
  onChipToggle?: (chip: string) => void;
}) => (
  <div className="group py-2">
    <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
      <span>{label}</span>
      {required && <span className="text-destructive">*</span>}
      {optional && <span className="text-muted-foreground/70">· 选填</span>}
    </div>
    {disabled ? (
      <p className="mt-1 text-[13px] leading-relaxed text-foreground/90 break-words">
        {value || <span className="text-muted-foreground/60">{placeholder}</span>}
      </p>
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full bg-transparent text-[13px] font-medium text-foreground placeholder:text-muted-foreground/60 placeholder:font-normal focus:outline-none border-b border-border/40 focus:border-primary/50 pb-1 transition-colors"
      />
    )}
    {chips && onChipToggle && (
      <div className="mt-2 flex flex-wrap gap-1.5">
        {chips.map((chip) => {
          const active = value.includes(chip);
          return (
            <button
              key={chip}
              type="button"
              onClick={() => onChipToggle(chip)}
              className={cn(
                "rounded-full border px-2 py-0.5 text-[11px] font-medium transition-all",
                active
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-background/60 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              {active && <span className="mr-0.5">✓</span>}{chip}
            </button>
          );
        })}
      </div>
    )}
  </div>
);

const ModuleHeader = ({
  icon: Icon,
  title,
  sub,
  actions,
}: {
  icon: typeof BookOpen;
  title: string;
  sub: string;
  actions?: React.ReactNode;
}) => (
  <div className="flex items-end justify-between gap-3">
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card text-foreground/70">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h2 className="text-[17px] font-bold tracking-tight text-foreground">{title}</h2>
        <p className="mt-0.5 text-[12px] text-muted-foreground">{sub}</p>
      </div>
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

export default AIProfileDetail;

// ===================== Training material library =====================

const TrainingLibraryBar = ({
  fileCount,
  linkCount,
  onOpen,
}: {
  fileCount: number;
  linkCount: number;
  onOpen: () => void;
}) => (
  <button
    type="button"
    onClick={onOpen}
    className="group relative mt-4 flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-r from-card/90 via-card/95 to-primary/[0.04] px-4 py-3 text-left backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_14px_36px_-20px_rgba(0,97,255,0.25)]"
  >
    <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-primary/[0.06] blur-3xl" />
    <div className="relative flex items-center gap-3 min-w-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10">
        <FileText className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-bold tracking-tight text-foreground">训练资料库</h3>
          <span className="text-[11px] text-muted-foreground">统一投喂 · AI 自动归类到四大模块</span>
        </div>
        <div className="mt-1 flex items-center gap-3 text-[12px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <FileText className="h-3 w-3 text-primary/70" />
            已提供
            <span className="font-semibold text-foreground tabular-nums">{fileCount}</span>
            份文档
          </span>
          <span className="h-3 w-px bg-border/70" />
          <span className="inline-flex items-center gap-1">
            <Globe className="h-3 w-3 text-primary/70" />
            <span className="font-semibold text-foreground tabular-nums">{linkCount}</span>
            条公开链接
          </span>
        </div>
      </div>
    </div>
    <span className="relative inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[12px] font-semibold text-primary transition-all group-hover:bg-primary/15 group-hover:gap-1.5">
      查看详情
      <ChevronRight className="h-3.5 w-3.5" />
    </span>
  </button>
);

const TrainingLibrarySheet = ({
  open,
  onOpenChange,
  materials,
  links,
  onUpload,
  onRemoveMaterial,
  onRemoveLink,
  onOpenMaterial,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materials: MaterialFile[];
  links: PublicLink[];
  onUpload: (file: File) => void;
  onRemoveMaterial: (id: string) => void;
  onRemoveLink: (id: string) => void;
  onOpenMaterial: (m: MaterialFile) => void;
}) => {
  const moduleTitle = (k: KBModuleKey) =>
    KB_MODULES.find((m) => m.key === k)?.title ?? k;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-[520px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-[16px]">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-3.5 w-3.5" />
            </span>
            训练资料库
          </SheetTitle>
          <SheetDescription className="text-[12.5px]">
            统一投喂，AI 自动识别并入库到「公司实力 / 产品服务 / 报价策略 / 市场情报」四大模块。
          </SheetDescription>
        </SheetHeader>

        {/* Upload */}
        <label className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-primary/30 bg-primary/[0.04] px-3 py-3 text-[12.5px] font-semibold text-primary transition-all hover:border-primary/50 hover:bg-primary/[0.07]">
          <FileUp className="h-3.5 w-3.5" />
          上传文档资料（PDF / Word / Excel / 图片 / 压缩包）
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.zip"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
              e.target.value = "";
            }}
          />
        </label>

        {/* Documents */}
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h4 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
              文档资料
            </h4>
            <span className="text-[11px] text-muted-foreground tabular-nums">{materials.length} 份</span>
          </div>
          {materials.length === 0 ? (
            <p className="mt-2 rounded-xl border border-dashed border-border/60 bg-background/40 px-3 py-6 text-center text-[12px] text-muted-foreground">
              暂无文档资料
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {materials.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => onOpenMaterial(m)}
                    className="group/file relative flex w-full items-start gap-3 rounded-xl border border-border/50 bg-background/70 p-3 text-left transition-all hover:border-primary/30 hover:bg-card hover:shadow-[0_10px_28px_-18px_rgba(0,97,255,0.25)]"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-semibold text-foreground">{m.name}</div>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-muted-foreground">
                        {m.summary}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        {m.modules.length > 0 ? (
                          m.modules.map((k) => (
                            <span
                              key={k}
                              className="inline-flex items-center rounded-md bg-primary/8 px-1.5 py-0.5 text-[10.5px] font-medium text-primary"
                            >
                              {moduleTitle(k)}
                            </span>
                          ))
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10.5px] font-medium text-amber-600">
                            <Loader2 className="h-2.5 w-2.5 animate-spin" />
                            分析中
                          </span>
                        )}
                        <span className="ml-auto text-[10.5px] text-muted-foreground/80">
                          {m.size} · {m.uploadedAt}
                        </span>
                      </div>
                    </div>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveMaterial(m.id);
                      }}
                      className="absolute right-2 top-2 cursor-pointer text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover/file:opacity-100"
                      aria-label="删除"
                    >
                      <X className="h-3.5 w-3.5" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Public Links */}
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h4 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
              公开链接
            </h4>
            <span className="text-[11px] text-muted-foreground tabular-nums">{links.length} 条</span>
          </div>
          {links.length === 0 ? (
            <p className="mt-2 rounded-xl border border-dashed border-border/60 bg-background/40 px-3 py-6 text-center text-[12px] text-muted-foreground">
              暂无公开链接
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {links.map((l) => (
                <li key={l.id} className="group/link relative flex items-start gap-3 rounded-xl border border-border/50 bg-background/70 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate text-[13px] font-semibold text-foreground hover:text-primary"
                    >
                      {l.title}
                    </a>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground/80">{l.url}</p>
                    <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-muted-foreground">
                      {l.summary}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      {l.modules.map((k) => (
                        <span
                          key={k}
                          className="inline-flex items-center rounded-md bg-primary/8 px-1.5 py-0.5 text-[10.5px] font-medium text-primary"
                        >
                          {moduleTitle(k)}
                        </span>
                      ))}
                      <span className="ml-auto text-[10.5px] text-muted-foreground/80">{l.addedAt}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveLink(l.id)}
                    className="absolute right-2 top-2 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover/link:opacity-100"
                    aria-label="删除"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </SheetContent>
    </Sheet>
  );
};

const MaterialDetailDialog = ({
  material,
  onClose,
}: {
  material: MaterialFile | null;
  onClose: () => void;
}) => {
  const moduleTitle = (k: KBModuleKey) =>
    KB_MODULES.find((m) => m.key === k)?.title ?? k;
  return (
    <Dialog open={!!material} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[600px] sm:rounded-2xl">
        {material && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 pr-6 text-[16px] leading-snug">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-3.5 w-3.5" />
                </span>
                {material.name}
              </DialogTitle>
              <DialogDescription className="text-[12.5px] text-muted-foreground">
                {material.size} · 上传于 {material.uploadedAt}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  AI 摘要
                </p>
                <p className="rounded-xl border border-border/50 bg-muted/30 px-3 py-2.5 text-[13px] leading-relaxed text-foreground/85">
                  {material.summary}
                </p>
              </div>

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  入库到 {material.extractions.length} 个模块
                </p>
                {material.extractions.length === 0 ? (
                  <p className="text-[12.5px] text-muted-foreground">AI 正在分析中…</p>
                ) : (
                  <div className="space-y-2.5">
                    {material.extractions.map((ex) => (
                      <div
                        key={ex.module}
                        className="rounded-xl border border-border/50 bg-background/60 p-3"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span className="text-[12.5px] font-semibold text-foreground">
                            {moduleTitle(ex.module)}
                          </span>
                        </div>
                        <ul className="mt-2 space-y-1.5">
                          {ex.points.map((p, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-[12.5px] leading-relaxed text-foreground/85"
                            >
                              <Check className="mt-[3px] h-3 w-3 shrink-0 text-primary" strokeWidth={3} />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const CondensedModuleCard = ({
  mod,
  onOpen,
}: {
  mod: (typeof KB_MODULES)[number];
  onOpen: () => void;
}) => {
  const Icon = mod.icon;
  const insightCount = mod.insights.length;
  // Map mastery → 1–4 dots + label
  const filledDots =
    mod.mastery >= 80 ? 4 : mod.mastery >= 60 ? 3 : mod.mastery >= 40 ? 2 : 1;
  const masteryLabel =
    filledDots === 4
      ? "训练完善"
      : filledDots === 3
        ? "训练良好"
        : filledDots === 2
          ? "初步成型"
          : "尚需补充";

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-white via-card/95 to-primary/[0.04] p-5 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_18px_44px_-22px_rgba(0,97,255,0.28)]"
      title={`AI 训练进度：${masteryLabel}`}
    >
      {/* Ambient accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-primary/[0.08] blur-3xl transition-opacity duration-500 group-hover:bg-primary/[0.12]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 -bottom-24 h-44 w-44 rounded-full bg-secondary/[0.06] blur-3xl"
      />

      {/* Header: icon + title/subtitle (left), mastery dots (right, subdued) */}
      <header className="relative flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10 transition-all group-hover:from-primary/20 group-hover:to-primary/8">
            <Icon className="h-4 w-4" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h3 className="text-[17px] font-bold tracking-tight text-foreground leading-tight">
              {mod.title}
            </h3>
            <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
              {mod.desc}
            </p>
          </div>
        </div>

        {/* Mastery dots — discrete side indicator */}
        <div
          className="flex shrink-0 items-center gap-1 pt-1.5"
          aria-label={`训练${masteryLabel}`}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                i < filledDots ? "bg-primary" : "bg-border",
              )}
            />
          ))}
        </div>
      </header>

      {/* Insights — main content body */}
      <div className="relative mt-4 grid grid-cols-2 gap-1.5">
        {mod.insights.map((it, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/60 px-2.5 py-1.5 text-[12px] font-medium text-foreground/85"
          >
            <span className="h-1 w-1 shrink-0 rounded-full bg-primary/70" />
            <span className="truncate">{it}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="relative mt-4 flex items-center justify-between border-t border-border/50 pt-3">
        <span className="text-[11.5px] text-muted-foreground">
          已涵盖 <span className="font-semibold text-foreground tabular-nums">{insightCount}</span> 个维度
        </span>
        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary transition-all group-hover:gap-1.5">
          查看详情
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  );
};

interface KnowledgeModuleCardProps {
  mod: (typeof KB_MODULES)[number];
  company: CompanyForm;
  draft: CompanyForm;
  setDraft: (v: CompanyForm) => void;
  editing: boolean;
  retraining: boolean;
  retrainProgress: number;
  materials: MaterialFile[];
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onRetrain: () => void;
  onOpenMaterial: (m: MaterialFile) => void;
}

const KnowledgeModuleCard = ({
  mod,
  company,
  draft,
  setDraft,
  editing,
  retraining,
  retrainProgress,
  materials,
  onStartEdit,
  onCancelEdit,
  onSave,
  onRetrain,
  onOpenMaterial,
}: KnowledgeModuleCardProps) => {
  const Icon = mod.icon;
  const style = masteryStyle(mod.mastery);

  return (
    <article className="relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
      <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/[0.06] blur-3xl" />

      {/* Header */}
      <header className="relative flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[14.5px] font-bold text-foreground leading-snug">{mod.title}</h3>
            <p className="mt-0.5 text-[11.5px] text-muted-foreground line-clamp-1">{mod.desc}</p>
          </div>
        </div>
        <span className={cn("shrink-0 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap", style.cls)}>
          {style.label} · {mod.mastery}%
        </span>
      </header>

      {/* Mastery bar */}
      <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
        <div className={cn("h-full transition-all", style.bar)} style={{ width: `${mod.mastery}%` }} />
      </div>

      {/* Retraining banner */}
      {retraining && (
        <div className="relative mt-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5">
          <div className="flex items-center gap-2 text-[12px] font-medium text-primary">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            正在重新训练 · {retrainProgress}%
          </div>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-primary/10">
            <div className="h-full bg-primary transition-all" style={{ width: `${retrainProgress}%` }} />
          </div>
        </div>
      )}

      {/* Fields */}
      <div className="relative mt-4 space-y-2.5">
        {mod.fields.map((f) => {
          const value = editing ? draft[f.key] : company[f.key];
          return (
            <div key={f.key} className="rounded-xl border border-border/40 bg-background/50 px-3 py-2">
              <div className="text-[11px] font-medium text-muted-foreground">{f.label}</div>
              {editing ? (
                f.textarea ? (
                  <textarea
                    value={draft[f.key]}
                    onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                    rows={2}
                    className="mt-1 w-full resize-none bg-transparent text-[12.5px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                    placeholder="点击键入"
                  />
                ) : (
                  <input
                    value={draft[f.key]}
                    onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                    className="mt-1 w-full bg-transparent text-[12.5px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                    placeholder="点击键入"
                  />
                )
              ) : (
                <p className="mt-1 text-[12.5px] leading-relaxed text-foreground/85 break-words">
                  {value || <span className="text-muted-foreground/60">未填写</span>}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Source materials (read-only — managed globally in 训练资料库) */}
      <div className="relative mt-4">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-[12px] font-semibold text-foreground">来源训练资料</span>
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {materials.length}
          </span>
        </div>
        {materials.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {materials.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => onOpenMaterial(m)}
                  className="flex w-full items-center gap-2 rounded-lg border border-border/40 bg-background/60 px-2.5 py-1.5 text-left transition-all hover:border-primary/30 hover:bg-primary/[0.03]"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <FileText className="h-3 w-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-medium text-foreground">{m.name}</div>
                    <div className="truncate text-[10.5px] text-muted-foreground">{m.summary}</div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-2 rounded-lg border border-dashed border-border/60 bg-background/30 px-3 py-3 text-center text-[11.5px] text-muted-foreground">
            该模块暂无来源资料，请在底部「训练资料库」上传
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="relative mt-4 flex items-center gap-2 border-t border-border/40 pt-3">
        {editing ? (
          <>
            <button
              onClick={onSave}
              disabled={retraining}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[12.5px] font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" />
              保存并重新训练
            </button>
            <button
              onClick={onCancelEdit}
              className="inline-flex items-center justify-center rounded-full border border-border bg-background/70 px-4 py-2 text-[12.5px] font-medium text-foreground hover:bg-accent transition-colors"
            >
              取消
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onStartEdit}
              disabled={retraining}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-[12px] font-semibold text-foreground hover:bg-accent transition-colors disabled:opacity-50"
            >
              <PenLine className="h-3.5 w-3.5" />
              编辑信息
            </button>
            <button
              onClick={onRetrain}
              disabled={retraining}
              className="ml-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-[12px] font-semibold text-primary hover:bg-primary/15 transition-colors disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              重新训练
            </button>
          </>
        )}
      </div>
    </article>
  );
};
