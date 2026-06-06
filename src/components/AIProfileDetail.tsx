import { useState, type ReactNode } from "react";
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
  MoreHorizontal,
  Power,
  PowerOff,
  Trash2,
  Pencil,
  Brain,
  ImageIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
  companyLogo: string;
  coreAdvantage: string;
  foundedYear: string;
  companyScale: string;
  mainBusiness: string;
  mainMarkets: string;
  productionCapacity: string;
  tradeCapability: string;
  certifications: string;
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
  fields: { label: string; key: keyof CompanyForm; textarea?: boolean; group?: string }[];
}[] = [
  {
    key: "strength",
    title: "公司实力",
    desc: "公司背景、产能规模与资质背书",
    icon: Building2,
    mastery: 92,
    insights: [
      { label: "基本信息", filled: true },
      { label: "公司背景", filled: true },
      { label: "生产和贸易能力", filled: true },
      { label: "认证与资质", filled: true },
    ],
    fields: [
      { label: "公司名称", key: "companyName", group: "基本信息" },
      { label: "公司LOGO", key: "companyLogo", group: "基本信息" },
      { label: "核心优势", key: "coreAdvantage", group: "基本信息", textarea: true },
      { label: "成立年份", key: "foundedYear", group: "公司背景" },
      { label: "公司规模", key: "companyScale", group: "公司背景" },
      { label: "主营业务", key: "mainBusiness", group: "公司背景", textarea: true },
      { label: "主要市场", key: "mainMarkets", group: "公司背景" },
      { label: "生产能力", key: "productionCapacity", group: "生产和贸易能力", textarea: true },
      { label: "贸易能力", key: "tradeCapability", group: "生产和贸易能力", textarea: true },
      { label: "认证与资质", key: "certifications", group: "认证与资质", textarea: true },
    ],
  },
  {
    key: "product",
    title: "产品服务",
    desc: "主营产品、卖点与交付条件",
    icon: Tags,
    mastery: 76,
    insights: [
      { label: "产品概括", filled: true },
      { label: "主要产品", filled: true },
      { label: "服务保障", filled: false },
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
      { label: "报价信息", filled: false },
    ],
    fields: [
      { label: "样品规则", key: "sampleRule", textarea: true },
      { label: "报价规则", key: "quoteRule", textarea: true },
      { label: "付款条件", key: "paymentRule", textarea: true },
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
  companyLogo: "henbei-logo.png（已上传）",
  coreAdvantage:
    "18 年深耕保温器皿出口；自有工厂 + 研发团队；月产能 50 万 pcs；服务 Stanley、Contigo 等全球品牌",
  foundedYear: "2008 年",
  companyScale: "员工 280 人 · 自有工厂 12,000㎡",
  mainBusiness: "双层不锈钢真空保温杯研发、生产与出口（运动 / 商务 / 儿童 三大系列，12 款 SKU）",
  mainMarkets: "欧洲 35% · 北美 28% · 澳洲 12% · 其他 25%",
  productionCapacity:
    "月产能 50 万 pcs；注塑 + 焊接 + 喷涂全链自有产线；旺季可弹性扩产至 70 万 pcs",
  tradeCapability:
    "18 年外贸经验，累计服务 60+ 国家客户；支持 FOB / CIF / DDP；英语 + 西语 + 德语团队",
  certifications:
    "BSCI / SEDEX 工厂审核 · FDA / LFGB / CE 认证 · ISO 9001 质量管理体系",
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
  id: string;
  headline: string;
  subtitle: string;
  tags: string[];
  authors: string[];
  status: "active" | "disabled";
  callCount: number;
}
const initialSharedSkills: TeamSkillItem[] = [
  {
    id: "s-1",
    headline: "刚询价且需求不清时先拆应用场景再引预算区间",
    subtitle: "客户刚询价但需求不明确时，不直接报完整价格，先用应用场景拆需求并引出预算区间再推进报价。",
    tags: ["询价", "报价跟进", "需求不清", "比价"],
    authors: ["Rita", "Jason"],
    status: "active",
    callCount: 128,
  },
  {
    id: "s-2",
    headline: "首封回复先抛 3 个澄清问题，再给方案概览",
    subtitle: "首封回复不堆产品参数，先用 3 个高价值澄清问题锁定客户真实场景，再附上方案概览引导深聊。",
    tags: ["首封回复", "澄清问题", "意图判断"],
    authors: ["Jason"],
    status: "active",
    callCount: 96,
  },
  {
    id: "s-3",
    headline: "报价用「标准 / 定制 / 品牌」三档组合替代单价",
    subtitle: "面对不确定预算的客户，用三档组合报价替代单一报价，引导客户主动选档，降低议价压力。",
    tags: ["报价策略", "三档组合", "议价"],
    authors: ["Jason", "Cody"],
    status: "active",
    callCount: 74,
  },
  {
    id: "s-4",
    headline: "详情页用使用场景替代技术参数堆砌",
    subtitle: "在详情页前两屏用真实使用场景图与短句替代参数列表，提升非专业买家的转化率。",
    tags: ["详情页", "使用场景", "转化率"],
    authors: ["Cody"],
    status: "active",
    callCount: 53,
  },
  {
    id: "s-5",
    headline: "未回复客户 D+3 改用「样品图 + 同类案例」",
    subtitle: "对 3 天未回复的客户切换沟通角度，用样品实拍 + 同类客户成交案例，回复率可提升 2 倍。",
    tags: ["跟进策略", "未回复", "样品"],
    authors: ["Rita"],
    status: "active",
    callCount: 41,
  },
];

interface AIDiscoveredItem extends TeamSkillItem {
  confidence: number;
  discoveredAt: string;
}
const initialAIDiscoveries: AIDiscoveredItem[] = [
  {
    id: "ai-1",
    headline: "客户提到 \"lead time\" 时优先给排产档期而非笼统天数",
    subtitle: "从 23 段会话中发现：当买家明确提及交期，业务员给出具体排产档期（如 W42/W45）成单率较平均水平高 38%。",
    tags: ["交期", "排产", "成单率"],
    authors: ["Rita", "Jason"],
    status: "active",
    callCount: 36,
    confidence: 0,
    discoveredAt: "今天 11:20",
  },
  {
    id: "ai-2",
    headline: "提供 3 张同行业落地图比单纯发产品图回复率高 2.1×",
    subtitle: "AI 在跟进话术中识别出「同行业案例图集」这一隐性打法，建议沉淀为团队标准动作。",
    tags: ["跟进话术", "案例图", "复用"],
    authors: ["Cody"],
    status: "active",
    callCount: 22,
    confidence: 0,
    discoveredAt: "昨天 18:05",
  },
  {
    id: "ai-3",
    headline: "中东客户首次询盘附送斋月营销日历可显著提升回复",
    subtitle: "近 30 天 4 位业务员对中东客户附带营销节奏建议后，平均回复速度从 36h 缩短到 9h。",
    tags: ["中东", "节庆营销", "首次询盘"],
    authors: ["Rita", "Cody", "Jason"],
    status: "active",
    callCount: 18,
    confidence: 0,
    discoveredAt: "2 天前",
  },
];
const TEAM_SKILLS_PER_PAGE = 6;

// AI 经验发现 —— 来源业务员用脱敏手机号展示（用户133***7053）
const aiAuthorPhoneMap: Record<string, string> = {
  Rita: "13580129080",
  Jason: "13585679080",
  Cody: "13560129080",
};
function maskAuthorPhone(name: string): string {
  const phone = aiAuthorPhoneMap[name];
  if (!phone || phone.length < 7) return `用户${name}`;
  return `用户${phone.slice(0, 3)}***${phone.slice(-4)}`;
}

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
  onOpenTraining?: () => void;
  isRetraining?: boolean;
}

const AIProfileDetail = ({ onTrySimilar, onOpenTraining, isRetraining = false }: AIProfileDetailProps = {}) => {
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
  const [sharedSkills, setSharedSkills] = useState<TeamSkillItem[]>(initialSharedSkills);
  const [aiDiscoveries, setAiDiscoveries] = useState<AIDiscoveredItem[]>(initialAIDiscoveries);
  const [expTab, setExpTab] = useState<"shared" | "ai">("shared");
  const [teamSkillPage, setTeamSkillPage] = useState(1);
  const [activeTeamSkill, setActiveTeamSkill] = useState<TeamSkillItem | null>(null);
  const [editingSkill, setEditingSkill] = useState<
    | { kind: "shared" | "ai"; item: TeamSkillItem | AIDiscoveredItem }
    | null
  >(null);
  const [editDraft, setEditDraft] = useState<{ headline: string; subtitle: string; tags: string }>({
    headline: "",
    subtitle: "",
    tags: "",
  });
  const [addSkillOpen, setAddSkillOpen] = useState(false);
  const [addDraft, setAddDraft] = useState<{ headline: string; subtitle: string; tags: string; authors: string }>({
    headline: "",
    subtitle: "",
    tags: "",
    authors: "",
  });

  const currentList: TeamSkillItem[] = expTab === "shared" ? sharedSkills : aiDiscoveries;
  const teamSkillTotalPages = Math.max(1, Math.ceil(currentList.length / TEAM_SKILLS_PER_PAGE));
  const teamSkillPageItems = currentList.slice(
    (teamSkillPage - 1) * TEAM_SKILLS_PER_PAGE,
    teamSkillPage * TEAM_SKILLS_PER_PAGE,
  );

  const openEdit = (kind: "shared" | "ai", item: TeamSkillItem) => {
    setEditingSkill({ kind, item });
    setEditDraft({ headline: item.headline, subtitle: item.subtitle, tags: item.tags.join("、") });
  };
  const saveEdit = () => {
    if (!editingSkill) return;
    const next = {
      headline: editDraft.headline.trim() || editingSkill.item.headline,
      subtitle: editDraft.subtitle.trim() || editingSkill.item.subtitle,
      tags: editDraft.tags.split(/[、,，\s]+/).filter(Boolean),
    };
    if (editingSkill.kind === "shared") {
      setSharedSkills((prev) => prev.map((s) => (s.id === editingSkill.item.id ? { ...s, ...next } : s)));
    } else {
      setAiDiscoveries((prev) => prev.map((s) => (s.id === editingSkill.item.id ? { ...s, ...next } : s)));
    }
    setEditingSkill(null);
  };
  const toggleSharedStatus = (id: string) =>
    setSharedSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === "active" ? "disabled" : "active" } : s)),
    );
  const adoptDiscovery = (id: string) => {
    setAiDiscoveries((prev) => {
      const found = prev.find((s) => s.id === id);
      if (found) {
        const { confidence: _c, discoveredAt: _d, ...base } = found;
        setSharedSkills((cur) => [{ ...base, status: "active" }, ...cur]);
      }
      return prev.filter((s) => s.id !== id);
    });
  };
  const discardDiscovery = (id: string) =>
    setAiDiscoveries((prev) => prev.filter((s) => s.id !== id));
  const deleteSharedSkill = (id: string) =>
    setSharedSkills((prev) => prev.filter((s) => s.id !== id));
  const handleAddSkill = () => {
    const headline = addDraft.headline.trim();
    const subtitle = addDraft.subtitle.trim();
    if (!headline || !subtitle) return;
    const newSkill: TeamSkillItem = {
      id: `s-${Date.now()}`,
      headline,
      subtitle,
      tags: addDraft.tags.split(/[、,，\s]+/).filter(Boolean),
      authors: addDraft.authors.trim() ? [addDraft.authors.trim()] : ["我"],
      status: "active",
      callCount: 0,
    };
    setSharedSkills((prev) => [newSkill, ...prev]);
    setAddSkillOpen(false);
    setAddDraft({ headline: "", subtitle: "", tags: "", authors: "" });
    setTeamSkillPage(1);
  };

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
    { key: "preference", label: "团队经验", badge: aiDiscoveries.length },
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
              sub="沉淀企业知识，让AI真正理解你的业务，并在每次生成中持续应用"
            />

            <TrainingLibraryBar
              fileCount={materials.length}
              linkCount={publicLinks.length}
              onOpen={onOpenTraining ?? (() => setLibraryOpen(true))}
              retraining={isRetraining}
            />

            <div className="mt-4 grid gap-4 md:grid-cols-3">
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
              onFieldChange={(key, value) =>
                setCompany((prev) => ({ ...prev, [key]: value }))
              }
              onClose={() => {
                setDetailModule(null);
                cancelEditModule();
              }}
            />
          </section>
        )}

        {/* Module 2: 团队经验 */}
        {activeTab === "preference" && (
          <section className="mt-6 opacity-0 animate-fade-up" style={{ animationDelay: "220ms" }}>
            <div className="flex items-end justify-between gap-3">
              <p className="text-[12px] text-muted-foreground">已审核共享的团队经验，以及 AI 持续挖掘的隐性经验</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                <Sparkles className="h-3 w-3" />
                本周持续学习中
              </span>
            </div>

            {/* 子 Tab 切换 */}
            <div className="mt-4 inline-flex items-center gap-1 rounded-xl border border-border/60 bg-card/60 p-1 shadow-sm">
              {([
                { key: "shared", label: "团队共享经验", icon: Users, count: sharedSkills.length, accent: "secondary" },
                { key: "ai", label: "AI 经验发现", icon: Brain, count: aiDiscoveries.length, accent: "primary" },
              ] as const).map((t) => {
                const Icon = t.icon;
                const active = expTab === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => {
                      setExpTab(t.key);
                      setTeamSkillPage(1);
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-all",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {t.label}
                    <span
                      className={cn(
                        "ml-0.5 inline-flex min-w-[18px] items-center justify-center rounded-full px-1.5 py-0 text-[10px] font-bold",
                        active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {t.count}
                    </span>
                    {t.key === "ai" && t.count > 0 && (
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" aria-hidden />
                    )}
                  </button>
                );
              })}
            </div>

            {/* 列表卡片 */}
            <div className="mt-3 group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-secondary/[0.04] shadow-sm">
              <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-secondary/8 blur-3xl" />

              {expTab === "ai" && (
                <div className="relative flex items-center gap-2 border-b border-border/40 bg-primary/[0.04] px-4 py-2.5">
                  <Brain className="h-3.5 w-3.5 text-primary" />
                  <p className="text-[11.5px] text-foreground/80">
                    AI 从 <span className="font-bold text-primary">238 段</span> 会话中挖掘的隐性经验，审核启用后将沉淀到团队共享池。
                  </p>
                </div>
              )}

              {teamSkillPageItems.length === 0 ? (
                <div className="relative flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {expTab === "shared" ? <Lightbulb className="h-4 w-4 text-muted-foreground" /> : <Brain className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <p className="text-[12px] text-muted-foreground">
                    {expTab === "shared" ? "暂无已共享的团队经验" : "暂无待审核的 AI 发现"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2">
                  {teamSkillPageItems.map((it) => {
                    const isShared = expTab === "shared";
                    const ai = !isShared ? (it as AIDiscoveredItem) : null;
                    const disabled = isShared && (it as TeamSkillItem).status === "disabled";
                    return (
                      <div
                        key={it.id}
                        className={cn(
                          "group/card relative flex flex-col rounded-2xl border border-border/40 bg-card/70 p-4 backdrop-blur-sm shadow-card transition-all hover:border-primary/25 hover:shadow-glow/30",
                          disabled && "opacity-50"
                        )}
                      >
                        {/* Top row: headline + badges + menu */}
                        <div className="flex items-start justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveTeamSkill(it)}
                            className="min-w-0 flex-1 text-left focus:outline-none"
                          >
                            <h4 className="text-[13px] font-bold leading-snug text-foreground group-hover/card:text-primary transition-colors line-clamp-2">
                              {it.headline}
                            </h4>
                          </button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground focus:outline-none"
                                aria-label="更多操作"
                              >
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                              {!isShared && (
                                <DropdownMenuItem onClick={() => adoptDiscovery(it.id)}>
                                  <Check className="mr-2 h-3.5 w-3.5 text-primary" />
                                  启用
                                </DropdownMenuItem>
                              )}
                              {!isShared && (
                                <DropdownMenuItem onClick={() => openEdit("ai", it)}>
                                  <Pencil className="mr-2 h-3.5 w-3.5" />
                                  编辑
                                </DropdownMenuItem>
                              )}
                              {!isShared && <DropdownMenuSeparator />}
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => (isShared ? deleteSharedSkill(it.id) : discardDiscovery(it.id))}
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Tags */}
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {it.tags.map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center rounded-full bg-secondary/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Bottom meta */}
                        <div className="mt-auto flex items-center gap-3 pt-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-[12px] font-medium text-foreground/80">
                            来源：{maskAuthorPhone(it.authors[0])}
                          </span>
                          {disabled && (
                            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              已停用
                            </span>
                          )}
                          {ai && ai.confidence > 0 && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-bold text-primary">
                              置信 {(ai.confidence * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

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
                        <span className="text-muted-foreground">贡献人：</span>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          {activeTeamSkill.authors.map((name) => (
                            <span key={name} className="inline-flex items-center gap-1.5">
                              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-accent/30 text-[10px] font-semibold text-primary">
                                {name.slice(0, 1)}
                              </span>
                              <span className="text-[12px] font-semibold text-foreground">{name}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-2 border-t border-border/50 pt-5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const kind = sharedSkills.some((s) => s.id === activeTeamSkill.id) ? "shared" : "ai";
                          openEdit(kind, activeTeamSkill);
                          setActiveTeamSkill(null);
                        }}
                      >
                        <Pencil className="mr-1.5 h-3.5 w-3.5" />
                        编辑
                      </Button>
                      <button
                        onClick={() => {
                          const prompt = `参考团队经验「${activeTeamSkill.headline}」：${activeTeamSkill.subtitle}\n\n请帮我把这个打法应用到当前的客户场景中。`;
                          onTrySimilar?.(prompt);
                          setActiveTeamSkill(null);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-[13px] font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98]"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        体验同款
                      </button>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>

            {/* 编辑弹窗 */}
            <Dialog open={!!editingSkill} onOpenChange={(o) => !o && setEditingSkill(null)}>
              <DialogContent className="sm:max-w-[560px] sm:rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-[15px]">编辑经验</DialogTitle>
                  <DialogDescription className="text-[12px]">
                    修改后将更新到{editingSkill?.kind === "shared" ? "团队共享池" : "AI 发现池"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <p className="mb-1 text-[11.5px] font-semibold text-muted-foreground">标题</p>
                    <Input
                      value={editDraft.headline}
                      onChange={(e) => setEditDraft((d) => ({ ...d, headline: e.target.value }))}
                      className="text-[13px]"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-[11.5px] font-semibold text-muted-foreground">描述</p>
                    <Textarea
                      rows={4}
                      value={editDraft.subtitle}
                      onChange={(e) => setEditDraft((d) => ({ ...d, subtitle: e.target.value }))}
                      className="text-[13px]"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-[11.5px] font-semibold text-muted-foreground">标签（用顿号或逗号分隔）</p>
                    <Input
                      value={editDraft.tags}
                      onChange={(e) => setEditDraft((d) => ({ ...d, tags: e.target.value }))}
                      className="text-[13px]"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2 border-t border-border/50 pt-4">
                  <Button variant="outline" size="sm" onClick={() => setEditingSkill(null)}>
                    取消
                  </Button>
                  <Button size="sm" onClick={saveEdit}>
                    保存
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* 新增经验弹窗 */}
            <Dialog open={addSkillOpen} onOpenChange={(o) => !o && setAddSkillOpen(false)}>
              <DialogContent className="sm:max-w-[560px] sm:rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-[15px]">新增团队经验</DialogTitle>
                  <DialogDescription className="text-[12px]">
                    手动添加一条团队共享经验，审核通过后将沉淀到团队共享池
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <p className="mb-1 text-[11.5px] font-semibold text-muted-foreground">标题</p>
                    <Input
                      value={addDraft.headline}
                      onChange={(e) => setAddDraft((d) => ({ ...d, headline: e.target.value }))}
                      placeholder="请输入经验标题"
                      className="text-[13px]"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-[11.5px] font-semibold text-muted-foreground">描述</p>
                    <Textarea
                      rows={4}
                      value={addDraft.subtitle}
                      onChange={(e) => setAddDraft((d) => ({ ...d, subtitle: e.target.value }))}
                      placeholder="请输入经验描述"
                      className="text-[13px]"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-[11.5px] font-semibold text-muted-foreground">标签（用顿号或逗号分隔）</p>
                    <Input
                      value={addDraft.tags}
                      onChange={(e) => setAddDraft((d) => ({ ...d, tags: e.target.value }))}
                      placeholder="例如：询价、报价跟进、需求不清"
                      className="text-[13px]"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-[11.5px] font-semibold text-muted-foreground">贡献人</p>
                    <Input
                      value={addDraft.authors}
                      onChange={(e) => setAddDraft((d) => ({ ...d, authors: e.target.value }))}
                      placeholder="请输入贡献人姓名，留空则默认为“我”"
                      className="text-[13px]"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2 border-t border-border/50 pt-4">
                  <Button variant="outline" size="sm" onClick={() => setAddSkillOpen(false)}>
                    取消
                  </Button>
                  <Button size="sm" onClick={handleAddSkill}>
                    保存
                  </Button>
                </div>
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
  retraining = false,
}: {
  fileCount: number;
  linkCount: number;
  onOpen: () => void;
  retraining?: boolean;
}) => (
  <button
    type="button"
    onClick={retraining ? undefined : onOpen}
    disabled={retraining}
    className="group relative mt-4 flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-r from-card/90 via-card/95 to-primary/[0.04] px-4 py-3 text-left backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_14px_36px_-20px_rgba(0,97,255,0.25)] disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:border-border/60 disabled:hover:shadow-none"
  >
    <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-primary/[0.06] blur-3xl" />
    <div className="relative flex items-center gap-3 min-w-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10">
        <FileText className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-bold tracking-tight text-foreground">训练资料库</h3>
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
      {retraining ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          正在重新训练
        </>
      ) : (
        <>
          重新训练
          <ChevronRight className="h-3.5 w-3.5" />
        </>
      )}
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
  const filledInsights = mod.insights.filter((i) => i.filled).length;
  const totalInsights = mod.insights.length;
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
            className={cn(
              "inline-flex items-center gap-1.5 px-1 py-1 text-[12.5px] transition-colors",
              it.filled ? "text-foreground/85" : "text-muted-foreground/60",
            )}
          >
            {it.filled ? (
              <Check className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={3} />
            ) : (
              <span className="h-3 w-3 shrink-0 rounded-full border border-dashed border-muted-foreground/35" />
            )}
            <span className="truncate">{it.label}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="relative mt-4 flex items-center justify-end border-t border-border/50 pt-3">
        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary transition-all group-hover:gap-1.5">
          查看详情
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  );
};

const ModuleDetailSheet = ({
  moduleKey,
  company,
  onClose,
  onFieldChange,
}: {
  moduleKey: KBModuleKey | null;
  company: CompanyForm;
  onClose: () => void;
  onFieldChange: (key: keyof CompanyForm, value: string) => void;
}) => {
  const mod = moduleKey ? KB_MODULES.find((m) => m.key === moduleKey) ?? null : null;
  const style = mod ? masteryStyle(mod.mastery) : null;
  const Icon = mod?.icon;

  return (
    <Sheet open={!!mod} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-[560px]">
        {mod && Icon && style && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2.5 text-[16px]">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10">
                  <Icon className="h-4 w-4" />
                </span>
                {mod.title}
              </SheetTitle>
              <SheetDescription className="text-left text-[12.5px]">{mod.desc}</SheetDescription>
            </SheetHeader>

            {/* Product service uses a richer layout */}
            {mod.key === "product" ? (
              <ProductServiceDetail
                summary={company.mainProducts}
                onSummaryChange={(v) => onFieldChange("mainProducts", v)}
              />
            ) : mod.key === "pricing" ? (
              <PricingStrategyDetail
                sampleRule={company.sampleRule}
                onSampleRuleChange={(v) => onFieldChange("sampleRule", v)}
              />
            ) : (
            <div className="mt-4">
              {(() => {
                const groups: { name: string; items: typeof mod.fields }[] = [];
                mod.fields.forEach((f) => {
                  const name = f.group ?? "";
                  let g = groups.find((x) => x.name === name);
                  if (!g) {
                    g = { name, items: [] };
                    groups.push(g);
                  }
                  g.items.push(f);
                });
                return (
                  <div className="space-y-3">
                    {groups.map((g) => (
                      <div
                        key={g.name || "default"}
                        className="rounded-xl border border-border/40 bg-background/40 px-3 py-2.5"
                      >
                        {g.name && (
                          <div className="mb-2 flex items-center gap-1.5">
                            <span className="h-3 w-0.5 rounded-full bg-primary/70" />
                            <h5 className="text-[11.5px] font-semibold text-foreground">
                              {g.name}
                            </h5>
                          </div>
                        )}
                        <div className="divide-y divide-border/40">
                          {g.items
                            .filter((f) => f.key !== "companyLogo")
                            .map((f) => {
                            const value = company[f.key];
                            if (f.key === "companyName") {
                              return (
                                <div key={f.key} className="flex items-center gap-2 py-1.5">
                                  <div className="flex flex-1 items-center gap-2">
                                    <div className="w-[68px] shrink-0 text-[11.5px] text-muted-foreground">
                                      {f.label}
                                    </div>
                                    <input
                                      value={value}
                                      onChange={(e) => onFieldChange(f.key, e.target.value)}
                                      className="flex-1 bg-transparent text-[12.5px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                                      placeholder="点击键入"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-dashed border-border bg-background/50 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/[0.04] hover:text-primary"
                                    title="上传公司 LOGO"
                                  >
                                    <ImageIcon className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              );
                            }
                            return (
                              <div key={f.key} className="flex items-start gap-2 py-1.5">
                                <div className="w-[68px] shrink-0 pt-0.5 text-[11.5px] text-muted-foreground">
                                  {f.label}
                                </div>
                                {f.textarea ? (
                                  <textarea
                                    value={value}
                                    onChange={(e) => onFieldChange(f.key, e.target.value)}
                                    rows={2}
                                    className="flex-1 resize-none overflow-hidden bg-transparent text-[12.5px] leading-snug text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                                    placeholder="点击键入"
                                  />
                                ) : (
                                  <input
                                    value={value}
                                    onChange={(e) => onFieldChange(f.key, e.target.value)}
                                    className="flex-1 bg-transparent text-[12.5px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                                    placeholder="点击键入"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

// ============= 产品服务详情 =============
const CORE_PRODUCTS: {
  name: string;
  image: string;
  price: string;
  moq: string;
  spec: string;
}[] = [
  {
    name: "双层不锈钢真空保温杯 500ml",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=200&h=200&fit=crop",
    price: "FOB $4.80–$5.60",
    moq: "1,000 pcs",
    spec: "316 食品级内胆 / 12h 保温 / 防漏静音盖",
  },
  {
    name: "户外运动保温水壶 750ml",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=200&fit=crop",
    price: "FOB $6.20–$7.40",
    moq: "1,000 pcs",
    spec: "粉末喷涂 / 提手设计 / 适配户外冰水",
  },
  {
    name: "商务礼品保温杯 380ml",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200&h=200&fit=crop",
    price: "FOB $5.40–$6.30",
    moq: "2,000 pcs",
    spec: "支持 Logo 激光 / 礼盒包装 / 多色可选",
  },
  {
    name: "儿童吸管保温杯 300ml",
    image: "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=200&h=200&fit=crop",
    price: "FOB $3.90–$4.60",
    moq: "3,000 pcs",
    spec: "BPA Free / 双重防漏 / 软硅胶吸管",
  },
  {
    name: "车载咖啡随行杯 450ml",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop",
    price: "FOB $5.10–$5.90",
    moq: "1,000 pcs",
    spec: "适配车载杯托 / 单手开合 / 6h 保温",
  },
];

const PRODUCT_CERTS = ["FDA", "LFGB", "CE", "BSCI", "SEDEX", "ISO 9001"];

const AFTER_SALES =
  "12 个月质保，针对漏水、保温失效等品质问题免费补货；提供英文使用说明与电商售后话术包；大客户配备专属对接人，48 小时内响应海外售后咨询。";

const ProductServiceDetail = ({
  summary,
  onSummaryChange,
}: {
  summary: string;
  onSummaryChange: (v: string) => void;
}) => {
  const products = CORE_PRODUCTS.slice(0, 5);
  return (
    <div className="mt-4 space-y-3">
      {/* 产品概括 */}
      <GroupCard title="产品概括">
        <div className="flex items-start gap-2 py-1.5">
          <div className="w-[68px] shrink-0 pt-0.5 text-[11.5px] text-muted-foreground">
            产品线
          </div>
          <textarea
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            rows={2}
            className="flex-1 resize-none overflow-hidden bg-transparent text-[12.5px] leading-snug text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            placeholder="一句话描述主营产品线"
          />
        </div>
      </GroupCard>

      {/* 主要产品 */}
      <GroupCard
        title="主要产品"
        extra={
          <span className="text-[10.5px] font-medium text-muted-foreground">
            {products.length} / 5
          </span>
        }
      >
        <div className="divide-y divide-border/40">
          {products.map((p) => (
            <div
              key={p.name}
              className="flex gap-2.5 py-2 first:pt-1 last:pb-1"
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="truncate text-[12.5px] font-semibold text-foreground">
                  {p.name}
                </h5>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="rounded bg-muted px-1.5 py-0.5 font-medium text-foreground/80">
                    MOQ {p.moq}
                  </span>
                  <span className="font-semibold text-primary">{p.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GroupCard>

      {/* 服务保障 */}
      <GroupCard title="服务保障">
        <div className="divide-y divide-border/40">
          <div className="flex items-start gap-2 py-1.5">
            <div className="w-[68px] shrink-0 pt-0.5 text-[11.5px] text-muted-foreground">
              产品认证
            </div>
            <p className="flex-1 text-[12.5px] leading-snug text-foreground/85">
              {PRODUCT_CERTS.join(" · ")}
            </p>
          </div>
          <div className="flex items-start gap-2 py-1.5">
            <div className="w-[68px] shrink-0 pt-0.5 text-[11.5px] text-muted-foreground">
              售后服务
            </div>
            <p className="flex-1 text-[12.5px] leading-snug text-foreground/85">
              {AFTER_SALES}
            </p>
          </div>
        </div>
      </GroupCard>
    </div>
  );
};

const GroupCard = ({
  title,
  extra,
  children,
}: {
  title: string;
  extra?: ReactNode;
  children: ReactNode;
}) => (
  <div className="rounded-xl border border-border/40 bg-background/40 px-3 py-2.5">
    <div className="mb-2 flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-0.5 rounded-full bg-primary/70" />
        <h5 className="text-[11.5px] font-semibold text-foreground">{title}</h5>
      </div>
      {extra}
    </div>
    {children}
  </div>
);

const SectionLabel = ({
  icon: Icon,
  title,
  extra,
}: {
  icon: typeof Tags;
  title: string;
  extra?: ReactNode;
}) => (
  <div className="mb-2 flex items-center justify-between gap-2">
    <div className="flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <h4 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h4>
    </div>
    {extra}
  </div>
);

// ============= 报价策略详情 =============
const QUOTE_BASICS: { label: string; value: string }[] = [
  { label: "报价有效期", value: "自报价日起 15 天有效；汇率波动 >2% 时重新核价" },
  { label: "付款方式", value: "T/T 30% 定金 + 70% 见提单副本；老客户支持 OA 30 天 / L/C at sight" },
  { label: "交货期", value: "标准款 25 天 / 定制款 35–45 天；旺季顺延 5–7 天" },
  { label: "售后保证", value: "12 个月质保；品质问题免费补货；提供英文使用说明与售后话术" },
];

const SCENE_STRATEGIES: { scene: string; strategy: string }[] = [
  {
    scene: "新客户首次询盘",
    strategy: "报阶梯价（1k / 3k / 1×40HQ），主推标准款，附加免费样品政策建立信任。",
  },
  {
    scene: "老客户返单",
    strategy: "保留原 FOB 价 30 天；推荐搭配新品 SKU，老客户享 2% 返单折扣。",
  },
  {
    scene: "大客户 / 品牌商",
    strategy: "切换 FCA / DDP 报价；提供独家配色、专属包装、年度框架协议。",
  },
  {
    scene: "比价压价场景",
    strategy: "不直接降价，先拆分价值（认证 / 工艺 / 售后），再用 MOQ 上浮换取折让。",
  },
];

const PricingStrategyDetail = ({
  sampleRule,
  onSampleRuleChange,
}: {
  sampleRule: string;
  onSampleRuleChange: (v: string) => void;
}) => {
  const [basics, setBasics] = useState<Record<string, string>>(
    () => Object.fromEntries(QUOTE_BASICS.map((it) => [it.label, it.value])),
  );
  return (
    <div className="mt-4 space-y-3">
      {/* 样品规则 */}
      <GroupCard title="样品规则">
        <div className="flex items-start gap-2 py-1.5">
          <div className="w-[68px] shrink-0 pt-0.5 text-[11.5px] text-muted-foreground">
            样品规则
          </div>
          <textarea
            value={sampleRule}
            onChange={(e) => onSampleRuleChange(e.target.value)}
            rows={2}
            className="flex-1 resize-none overflow-hidden bg-transparent text-[12.5px] leading-snug text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            placeholder="点击键入"
          />
        </div>
      </GroupCard>

      {/* 报价信息 */}
      <GroupCard title="报价信息">
        <div className="divide-y divide-border/40">
          {QUOTE_BASICS.map((it) => (
            <div key={it.label} className="flex items-start gap-2 py-1.5">
              <div className="w-[68px] shrink-0 pt-0.5 text-[11.5px] text-muted-foreground">
                {it.label}
              </div>
              <textarea
                value={basics[it.label] ?? ""}
                onChange={(e) =>
                  setBasics((prev) => ({ ...prev, [it.label]: e.target.value }))
                }
                rows={2}
                className="flex-1 resize-none overflow-hidden bg-transparent text-[12.5px] leading-snug text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                placeholder="点击键入"
              />
            </div>
          ))}
        </div>
      </GroupCard>
    </div>
  );
};
