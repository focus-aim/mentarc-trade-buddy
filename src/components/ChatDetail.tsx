import { useState, useCallback, useMemo, useEffect, useRef, ReactNode } from "react";
import { ChevronDown, FileText, History, Image as ImageIcon, UserRound, Sparkles, BarChart3, Clock, Check, Coins, Users, LogOut, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TeamManagementDialog from "./TeamManagementDialog";
import { ArrowLeft } from "lucide-react";

import ChatInput, { ChatAttachment } from "./ChatInput";
import MindFlowMessage, { RichStep } from "./MindFlowMessage";
import OperationResultMessage from "./OperationResultMessage";
import expertOperation from "@/assets/expert-operation.jpg";
import expertBusiness from "@/assets/expert-business.jpg";
import expertTraining from "@/assets/expert-training.jpg";
import ImageResultMessage from "./ImageResultMessage";
import UploadPromptMessage from "./UploadPromptMessage";
import DetailTypeSelector from "./DetailTypeSelector";
import DetailImageResult from "./DetailImageResult";
import InquiryResultMessage, { ChatQuote, InquiryFollowUpResult, BuyerBackgroundReport } from "./InquiryResultMessage";
import MessageFeedback from "./MessageFeedback";
import InquiryStrategyPrompt, { InquiryStrategyChoice } from "./InquiryStrategyPrompt";
import SecondFollowupPrompt, { SecondFollowupChoice } from "./SecondFollowupPrompt";
import BuyerProfileFloatingCard from "./BuyerProfileFloatingCard";
import KeywordGuidancePrompt, { KeywordGuidanceChoice } from "./KeywordGuidancePrompt";
import InquiryDetailSection from "./InquiryDetailSection";
import OperationGreeting from "./OperationGreeting";
import OperationDemoResult from "./OperationDemoResult";
import ResultDownloadButton from "./ResultDownloadButton";
import KeywordTrendResult from "./KeywordTrendResult";
import MarketResearchResult from "./MarketResearchResult";
import TrendCollectionResult from "./TrendCollectionResult";
import FollowupStrategyResult from "./FollowupStrategyResult";
import {
  QuoteWizard,
  QuoteSummaryCard,
  QuoteResultCard,
  isQuoteGenPrompt,
  type QuoteInfo,
  type QuoteTemplate,
  DEFAULT_QUOTE_INFO,
} from "./QuoteGenerationFlow";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const PLAIN_TEXT_DEMO_RESPONSE = `## 询盘拆解

### 公司/邮箱线索
- **发件人**：john.carter@techsol.us
- **公司线索**：TechSol
- **国家线索**：USA / 美国

### 产品需求
- **产品**：5kW hybrid inverter（5kW 混合逆变器）
- **认证**：UL1741
- **用途**：USA retail project（美国零售项目）

### 数量与价格
- **首单数量**：300 units
- **目标价**：FOB < USD 380/unit
- **价格导向**：明确、强烈，且有硬性目标价

### 交付与样品
- **样品**：需要空运发样
- **上市时间**：July（7 月上线/发售）
- **时效**：非常紧急

### 动作要求
- 希望尽快报价（Please quote fast）

## 🎯 买家意图判断

**意图类型：高意向、强采购信号**

- 这不是泛泛询价，而是已经给出型号级需求 + 数量 + 目标价 + 认证 + 时间表
- 说明买家大概率已在做供应商比价/筛选
- 目前阶段更接近：方案确认 + 快速比价 + 供应商初筛

**采购阶段**

- 偏向项目推进中的决策前期
- 需求已较清晰，但仍会看：认证、价格、交期、样品响应速度

**关注重点**

- 合规性：UL1741 是否可提供
- 价格竞争力：FOB 380 美金以下是否可达成
- 交付能力：300 台首单是否能按项目节点供货
- 样品速度：是否能快速寄样

**风险信号**

- 价格目标较明确，说明很可能在同时对比多家供应商
- 和 "Urgent" "Please quote fast" 搭配，买家对响应速度敏感，若回复慢容易流失
- 如果你没有 UL1741 认证或交期不稳，这单会有较高流失风险`;

const isPlainTextPrompt = (text?: string) => !!text && /纯文本输出/.test(text);

interface ChatDetailProps {
  moduleTitle: string;
  onBack: () => void;
  initialUserMessage?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  type?: "text" | "plain-text" | "mindflow" | "operation-result" | "inquiry-result" | "image-mindflow" | "image-result" | "upload-prompt" | "detail-type-select" | "detail-mindflow" | "detail-result" | "operation-greeting" | "demo-mindflow" | "demo-result" | "inquiry-strategy-prompt" | "inquiry-followup-result" | "buyer-background-mindflow" | "buyer-background-result" | "emails-mindflow" | "followup-strategy-mindflow" | "followup-strategy-result" | "keyword-mindflow" | "keyword-result" | "keyword-guidance" | "market-mindflow" | "market-result" | "trend-mindflow" | "trend-result" | "quote-summary" | "quote-gen-prep-mindflow" | "quote-mindflow" | "quote-result" | "second-followup-prompt";
  mindflowSteps?: string[];
  detailTypes?: string[];
  images?: string[];
  quote?: ChatQuote;
  strategy?: InquiryStrategyChoice;
  secondChoice?: SecondFollowupChoice;
  keywordChoice?: KeywordGuidanceChoice;
  quoteInfo?: QuoteInfo;
  quoteTemplate?: QuoteTemplate;
}

const INQUIRY_EMAIL = `Subject: Inquiry for Double Wall Insulated Beer Mug

Dear Sir/Madam,

We are a beverageware importer based in Germany, supplying bar and kitchen retailers across Europe. We are currently looking for double wall vacuum insulated beer mugs.

Could you please provide:

FOB price for 500 / 1000 pcs
Available sizes and customization options (logo, color)
Material specifications and certifications
Lead time and MOQ

Looking forward to your quotation.

Best regards,
Michael Schneider
Purchasing Manager
Bergmann Home Supplies GmbH`;

const INQUIRY_ATTACHMENT: ChatAttachment = {
  label: "询盘案例",
  preview: "Inquiry for Double Wall Insulated Beer Mug — Michael Schneider, Bergmann Home Supplies GmbH",
  fullContent: INQUIRY_EMAIL,
};

import defaultProductBike from "@/assets/default-product-bike.png";

const OPERATION_LINK_ATTACHMENT: ChatAttachment = {
  label: "同行产品参考",
  preview: "https://x.made-in-china.com/product/VJcYpPGdHOkg/detail",
  fullContent: "https://gravity.en.made-in-china.com/product/VJcYpPGdHOkg/China-24-Inch-48V-15ah-10ah-9-Speed-Cycle-Aluminum-Alloy-Fat-Tire-1000W-Electric-Bike.html",
};

const OPERATION_IMAGE_ATTACHMENT: ChatAttachment = {
  label: "产品原图",
  preview: "default-product-bike.png",
  fullContent: defaultProductBike,
  imageUrl: defaultProductBike,
};

const MODULE_CONFIG: Record<string, { taskName: string; greeting: string; defaultUserMessage: string; guidedReply: string; placeholder: string; defaultValue?: string; attachment?: ChatAttachment; attachments?: ChatAttachment[] }> = {
  "业务专家": {
    taskName: "跟单转化",
    greeting: "您好，我是您的询盘分析助手。",
    defaultUserMessage: "我收到一封新的询盘邮件，帮我分析一下买家背景和回复策略",
    guidedReply: "好的，请将询盘内容发送给我，我将为您：\n\n1. **解析询盘关键信息** — 提取产品需求、数量、交期等核心要素\n2. **评估买家质量** — 分析买家背景和采购意图\n3. **生成专业回复建议** — 匹配您的产品优势，提供报价策略\n\n您可以直接粘贴邮件内容，或通过下方输入框上传询盘文件。",
    placeholder: "输入消息…",
    defaultValue: "",
  },
  "运营专家": {
    taskName: "产品详情生成",
    greeting: "您好，我是您的产品运营助手。",
    defaultUserMessage: "帮我优化产品详情页，提升转化率",
    guidedReply: "",
    placeholder: "输入消息…",
    defaultValue: "",
    attachments: [OPERATION_IMAGE_ATTACHMENT, OPERATION_LINK_ATTACHMENT],
  },
  "培训专家": {
    taskName: "外贸知识咨询",
    greeting: "您好，我是您的AI外贸专家。",
    defaultUserMessage: "我想了解一些外贸实操中的常见问题",
    guidedReply: "没问题，我可以为您解答以下方面的外贸问题：\n\n• **市场趋势** — 各区域市场动态与选品建议\n• **平台运营** — 阿里国际站、独立站等运营技巧\n• **客户沟通** — 报价谈判、跟进话术\n• **交易流程** — 付款方式、物流安排、报关流程\n• **贸易合规** — 认证要求、知识产权、合规风险\n\n请直接提出您的具体问题，我会结合实际案例为您解答。",
    placeholder: "输入您的外贸问题…",
  },
  "市场专家": {
    taskName: "市场机会分析",
    greeting: "您好，我是您的AI市场专家。",
    defaultUserMessage: "帮我分析一下海外市场机会",
    guidedReply: "好的，我可以为您提供以下方向的市场分析：\n\n• **外贸市场调研** — 区域行情、合规与竞品全景\n• **热点趋势采集** — 海外社媒商机与需求监控\n• **机会日报** — 行业资讯、热点趋势与买家机会\n\n请直接告诉我目标产品与市场，我将为您输出专业分析。",
    placeholder: "输入您的市场分析需求…",
  },
};

const EXPERT_META: Record<string, { name: string; role: string; tagline: string; avatar: string; resultLabel: string }> = {
  "业务专家": { name: "业务专家", role: "Allen", tagline: "买家洞察 · 询盘转化 · 成交策略", avatar: expertBusiness, resultLabel: "询盘解析结果" },
  "运营专家": { name: "运营专家", role: "Bella", tagline: "卖点提炼 · 详情转化 · 素材生成", avatar: expertOperation, resultLabel: "产品分析结果" },
  "培训专家": { name: "培训专家", role: "Cici", tagline: "知识沉淀 · 案例答疑 · 实操指导", avatar: expertTraining, resultLabel: "知识参考" },
  "市场专家": { name: "市场专家", role: "Cici", tagline: "趋势识别 · 机会判断 · 区域策略", avatar: expertTraining, resultLabel: "市场调研结果" },
};

const IMAGE_MINDFLOW_STEPS = [
  "分析产品图特征",
  "读取高转化率图片技能指南",
  "生成产品图片",
];

const DETAIL_MINDFLOW_STEPS = [
  "解析所选详情图类型",
  "匹配产品特征与图片风格",
  "生成产品详情图",
];

const INQUIRY_RICH_STEPS: RichStep[] = [
  {
    label: "正在准备中",
    subSteps: [
      { plugin: "任务初始化", query: "加载询盘分析引擎与买家数据库", description: "正在初始化分析模块和知识库连接。" },
      { plugin: "上下文加载", query: "读取产品目录与报价模板", description: "准备产品信息和回复模板资源。" },
    ],
  },
  {
    label: "解析询盘内容",
    subSteps: [
      { plugin: "Web Search", query: "买家公司背景调查 — Bergmann Home Supplies GmbH", description: "正在检索买家企业信息与历史采购记录。" },
      { plugin: "文档解析", query: "提取询盘关键字段：产品、数量、交期、认证", description: "从询盘邮件中识别核心需求要素。" },
    ],
  },
  {
    label: "评估买家质量与需求",
    subSteps: [
      { plugin: "Web Search", query: "Bergmann Home Supplies 欧洲市场份额与渠道分析", description: "评估买家市场覆盖能力与合作价值。" },
      { plugin: "买家画像", query: "生成买家质量评分：需求明确度、匹配度、紧急度", description: "综合分析买家采购意图与合作潜力。" },
    ],
  },
  {
    label: "匹配产品方案",
    subSteps: [
      { plugin: "产品库匹配", query: "Double Wall Insulated Beer Mug — 规格与报价方案", description: "从产品目录中匹配最优 SKU 与阶梯价格。" },
    ],
  },
  {
    label: "生成回复建议",
    subSteps: [
      { plugin: "回复模板引擎", query: "生成专业询盘回复邮件与跟进策略", description: "结合买家画像与产品方案，生成个性化回复。" },
    ],
  },
];

const DEMO_MINDFLOW_STEPS = [
  "分析产品链接",
  "提取产品特征",
];

const KEYWORD_MINDFLOW_STEPS = [
  "锁定品类与目标市场",
  "采集近 30 天搜索数据",
  "聚类关键词与场景需求",
  "生成趋势报告",
];

const isKeywordPrompt = (text?: string) => {
  if (!text) return false;
  return /热门产品词|搜索词|关键词趋势|挖掘.*产品词/.test(text);
};

const MARKET_MINDFLOW_STEPS = [
  "锁定品类与目标区域",
  "采集海关 & Google Trends 数据",
  "对比合规与认证要求",
  "整合竞争与机会洞察",
  "生成市场调研报告",
];

const isMarketResearchPrompt = (text?: string) => {
  if (!text) return false;
  return /外贸市场调研|市场调研报告|出一份.*市场.*报告/.test(text);
};

const TREND_MINDFLOW_STEPS = [
  "锁定品类与目标市场",
  "采集 TikTok / IG / YouTube / Reddit 内容",
  "聚类标签、需求与痛点",
  "提炼用户原声与改进灵感",
  "生成热点趋势采集报告",
];

const QUOTE_GEN_PREP_STEPS = [
  "解析买家跟进上下文",
  "匹配产品与报价策略",
  "准备报价生成向导",
];

const QUOTE_GEN_STRATEGY_TEXT = "**当前买家跟进要点与报价策略**\n\n- 买家 TechSol US 已明确 5kW UL1741 逆变器需求，目标价 FOB <$380/unit。\n- 7 月上线，对样品速度与交期敏感，建议主动给出双交期方案。\n- 报价策略：在目标价基础上让出有限空间，突出认证齐全 + 一年质保 + 美西常备库存。";

const QUOTE_RICH_STEPS: RichStep[] = [
  {
    label: "信息整合",
    subSteps: [
      { plugin: "知识库", query: "调取产品规格、价格区间与认证清单", description: "汇总产品默认报价信息。" },
      { plugin: "买家画像", query: "读取 TechSol US 采购背景与目标价", description: "匹配最适合的报价策略。" },
    ],
  },
  {
    label: "条款 & 数据校验",
    subSteps: [
      { plugin: "校验引擎", query: "贸易术语 / 付款方式 / 交期一致性检查", description: "确认无遗漏字段。" },
    ],
  },
  {
    label: "模板渲染",
    subSteps: [
      { plugin: "模板引擎", query: "按所选模板排版生成报价单", description: "生成可下载的 Excel 报价单。" },
    ],
  },
];

const isTrendCollectionPrompt = (text?: string) => {
  if (!text) return false;
  return /热点趋势采集|采集.*海外社媒|海外社媒.*趋势|社媒.*商机|采集.*热点趋势/.test(text);
};

const isBuyerBackgroundPrompt = (text?: string) => {
  if (!text) return false;
  return /深度?背景调查|买家背调|生成买家背调报告|深度背调|公司画像.*采购实力|背景调查.*风险/.test(text);
};

const isFollowupStrategyPrompt = (text?: string) => {
  if (!text) return false;
  return /跟进策略|生成两版询盘回复邮件|节奏.*话术|话术.*下一步|跟进.*节奏|制定.*跟进/.test(text);
};

const isSecondFollowupPrompt = (text?: string) => {
  if (!text) return false;
  return /二次跟进|二轮跟进|再次跟进/.test(text);
};

const FOLLOWUP_STRATEGY_RICH_STEPS: RichStep[] = [
  {
    label: "买家阶段判定",
    subSteps: [
      { plugin: "买家画像", query: "判断当前沟通阶段与决策窗口", description: "结合询盘内容、回复速度评估推进时机。" },
    ],
  },
  {
    label: "节奏与通道规划",
    subSteps: [
      { plugin: "策略引擎", query: "邮件 / LinkedIn / 电话 三通道时间轴", description: "排布 14 天内关键触达节点。" },
    ],
  },
  {
    label: "话术模板生成",
    subSteps: [
      { plugin: "模板引擎", query: "首封回复 + LinkedIn 加温 + 电话开场", description: "针对不同通道生成匹配文案。" },
    ],
  },
  {
    label: "下一步动作清单",
    subSteps: [
      { plugin: "任务编排", query: "按优先级输出可执行 To-Do", description: "标注 P0/P1/P2 与负责动作。" },
    ],
  },
];

const BUYER_BG_RICH_STEPS: RichStep[] = [
  {
    label: "公司基础信息核查",
    subSteps: [
      { plugin: "Web Search", query: "TechSol US LLC 注册信息 / 工商档案", description: "正在核实公司注册地、规模与成立时间。" },
      { plugin: "官网解析", query: "techsol.us 主营业务与产品矩阵", description: "提取业务范围、品牌定位与销售渠道。" },
    ],
  },
  {
    label: "采购与进口足迹",
    subSteps: [
      { plugin: "海关数据", query: "TechSol 近 12 个月美国进口提单", description: "汇总采购品类、来源国与单票金额。" },
      { plugin: "竞品交叉", query: "同类买家与可能的备选供应商", description: "评估买家议价力与切换成本。" },
    ],
  },
  {
    label: "信用与履约调查",
    subSteps: [
      { plugin: "D&B / 同业评议", query: "邓白氏评级、付款记录与诉讼检索", description: "汇总信用评分、付款及风险事件。" },
    ],
  },
  {
    label: "决策链与关键人识别",
    subSteps: [
      { plugin: "LinkedIn 检索", query: "TechSol 采购 / 技术 / 高管关键人", description: "标记决策人、影响人与最终拍板人。" },
    ],
  },
  {
    label: "生成背调结论",
    subSteps: [
      { plugin: "风险综合", query: "整合数据，输出合作建议与风险提示", description: "形成可执行的合作策略。" },
    ],
  },
];

const EMAIL_GEN_RICH_STEPS: RichStep[] = [
  {
    label: "策略对比与取舍",
    subSteps: [
      { plugin: "策略引擎", query: "主动报价 vs 保守追问 — 适用条件分析", description: "根据询盘特征匹配两套跟进路径。" },
    ],
  },
  {
    label: "主动版邮件撰写",
    subSteps: [
      { plugin: "模板引擎", query: "认证 + 双交期 + 样品政策一次到位", description: "生成结构化报价邮件。" },
    ],
  },
  {
    label: "保守版邮件撰写",
    subSteps: [
      { plugin: "模板引擎", query: "3 个关键追问 + 样品钩子", description: "生成需求收敛型邮件。" },
    ],
  },
];


const BUYER_INQUIRY_RECORDS = [
  { date: "03/26", title: "保温啤酒杯阶梯报价询盘", summary: "关注 500 / 1000 pcs 报价、交期与认证文件。" },
  { date: "03/18", title: "厨房零售渠道补货沟通", summary: "询问定制 Logo、混色装箱与欧洲仓可用库存。" },
  { date: "02/27", title: "春季促销样品申请", summary: "曾索取样品政策、运费承担方式与测试周期。" },
];

const PRODUCT_ASSET_RECORDS = [
  { date: "素材", title: "智能电助力自行车主图", summary: "已沉淀白底图、场景图、细节图与卖点短文案。" },
  { date: "卖点", title: "1000W Fat Tire 核心卖点", summary: "续航、电机、避震、认证与欧美通勤场景表达。" },
  { date: "详情", title: "高转化详情页结构", summary: "首屏卖点、参数对比、认证背书、售后保障模块。" },
];

const MARKET_REPORT_RECORDS = [
  { date: "趋势", title: "欧洲电助力自行车需求简报", summary: "德国、荷兰、法国关注通勤、露营与城市短途代步。" },
  { date: "竞品", title: "Fat Tire E-bike 价格带分析", summary: "主流成交带集中在 $799-$1299，认证与电池容量影响询价质量。" },
  { date: "机会", title: "春夏户外出行选品机会", summary: "露营、海岸线骑行、城市共享出行内容热度上升。" },
];

const ChatDetail = ({ moduleTitle, onBack, initialUserMessage }: ChatDetailProps) => {
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const config = MODULE_CONFIG[moduleTitle] || MODULE_CONFIG["业务专家"];
  const initialMessage = initialUserMessage?.trim() || config.defaultUserMessage;
  const expertAvatar = useMemo(() => {
    const map: Record<string, string> = { "运营专家": expertOperation, "业务专家": expertBusiness, "培训专家": expertTraining, "市场专家": expertTraining };
    return map[moduleTitle] || expertBusiness;
  }, [moduleTitle]);

  const initialIsKeyword = moduleTitle === "运营专家" && isKeywordPrompt(initialUserMessage);
  const initialIsMarket = moduleTitle === "市场专家" && isMarketResearchPrompt(initialUserMessage);
  const initialIsTrend = moduleTitle === "市场专家" && isTrendCollectionPrompt(initialUserMessage);
  const initialIsBuyerBg = moduleTitle === "业务专家" && isBuyerBackgroundPrompt(initialUserMessage);
  const initialIsFollowup = moduleTitle === "业务专家" && isFollowupStrategyPrompt(initialUserMessage);
  const initialIsQuoteGen = moduleTitle === "业务专家" && isQuoteGenPrompt(initialUserMessage);
  const initialAssistantType: Message["type"] = initialIsMarket
    ? "market-mindflow"
    : initialIsTrend
      ? "trend-mindflow"
      : initialIsBuyerBg
        ? "buyer-background-mindflow"
        : initialIsFollowup
          ? "followup-strategy-mindflow"
          : moduleTitle === "培训专家"
            ? "text"
            : initialIsKeyword
              ? "keyword-mindflow"
              : "mindflow";
  const [messages, setMessages] = useState<Message[]>(() => initialUserMessage?.trim() ? (
    initialIsQuoteGen ? [
      { role: "user", content: initialMessage, type: "text" },
      { role: "assistant", content: "", type: "quote-gen-prep-mindflow" },
    ] : [
      { role: "user", content: initialMessage, type: "text" },
      { role: "assistant", content: "", type: initialAssistantType },
    ]
  ) : [
    { role: "user", content: initialMessage, type: "text" },
    { role: "assistant", content: config.guidedReply, type: moduleTitle === "运营专家" ? "operation-greeting" : "text" },
  ]);
  const [analyzed, setAnalyzed] = useState(!!initialUserMessage?.trim());
  const [productImages, setProductImages] = useState<string[]>([]);
  const [prefillValue, setPrefillValue] = useState(config.defaultValue || "");
  const [prefillKey, setPrefillKey] = useState(0);
  const [showingMindFlow, setShowingMindFlow] = useState(!!initialUserMessage?.trim() && moduleTitle !== "培训专家" && !initialIsBuyerBg && !initialIsFollowup && !initialIsQuoteGen);
  const [showingImageMindFlow, setShowingImageMindFlow] = useState(false);
  const [showingDetailMindFlow, setShowingDetailMindFlow] = useState(false);
  const [pendingDetailTypes, setPendingDetailTypes] = useState<string[]>([]);
  const [activeQuote, setActiveQuote] = useState<ChatQuote | null>(null);
  const [showCompetitorDialog, setShowCompetitorDialog] = useState(false);
  const [showingDemoMindFlow, setShowingDemoMindFlow] = useState(false);
  const [buyerPanelOpen, setBuyerPanelOpen] = useState(false);
  const [assetPanelOpen, setAssetPanelOpen] = useState(false);
  const [showingBuyerBgMindFlow, setShowingBuyerBgMindFlow] = useState(initialIsBuyerBg);
  const [showingEmailsMindFlow, setShowingEmailsMindFlow] = useState(false);
  const [showingFollowupStrategyMindFlow, setShowingFollowupStrategyMindFlow] = useState(initialIsFollowup);
  const [showingQuoteMindFlow, setShowingQuoteMindFlow] = useState(false);
  const [quoteWizardActive, setQuoteWizardActive] = useState<boolean>(false);
  const [latestResult, setLatestResult] = useState<ReactNode>(null);
  const [latestResultLabel, setLatestResultLabel] = useState<string>("");
  const [activeResultIdx, setActiveResultIdx] = useState<number | null>(null);
  const expertMeta = EXPERT_META[moduleTitle] || EXPERT_META["业务专家"];
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const resultContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, latestResult]);

  // Build the right-panel content for a given assistant message
  const buildResultFor = useCallback((m: Message): { node: ReactNode; label: string } | null => {
    if (m.type === "inquiry-followup-result") {
      return {
        node: <InquiryFollowUpResult />,
        label: "询盘回复邮件 · 两版对比",
      };
    }
    if (m.type === "followup-strategy-result") {
      return {
        node: <FollowupStrategyResult />,
        label: "跟进策略 · 节奏 / 话术 / 动作",
      };
    }
    if (m.type === "buyer-background-result") {
      return {
        node: <BuyerBackgroundReport />,
        label: "买家背调报告 · TechSol US",
      };
    }
    if (m.type === "inquiry-result") {
      return {
        node: <InquiryResultMessage onAction={handleAction} onQuote={setActiveQuote} onSendPrompt={(text) => handleSend(text)} expertAvatar={expertAvatar} onBackgroundCheck={handleBackgroundCheck} />,
        label: "询盘解析结果",
      };
    }
    if (m.type === "operation-result") {
      const hideDescription = /营销素材|多平台/.test(initialUserMessage || "");
      return {
        node: <OperationResultMessage onAction={handleAction} onQuote={setActiveQuote} onSendPrompt={(text) => handleSend(text)} expertAvatar={expertAvatar} hideDescription={hideDescription} />,
        label: "产品分析结果",
      };
    }
    if (m.type === "image-result") {
      return { node: <ImageResultMessage onAction={handleAction} />, label: "产品图生成结果" };
    }
    if (m.type === "detail-result") {
      return { node: <DetailImageResult types={m.detailTypes || []} />, label: "详情图生成结果" };
    }
    if (m.type === "demo-result") {
      return { node: <OperationDemoResult onSendPrompt={(text) => handleSend(text)} />, label: "过程示例结果" };
    }
    if (m.type === "keyword-result") {
      return { node: <KeywordTrendResult onSendPrompt={(text) => handleSend(text)} />, label: "关键词趋势分析报告" };
    }
    if (m.type === "market-result") {
      return { node: <MarketResearchResult onSendPrompt={(text) => handleSend(text)} />, label: "外贸市场调研报告" };
    }
    if (m.type === "trend-result") {
      return { node: <TrendCollectionResult onSendPrompt={(text) => handleSend(text)} />, label: "热点趋势采集报告" };
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expertAvatar]);

  // Lift the latest analysis result into the right panel
  useEffect(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (!m || m.role !== "assistant") continue;
      const built = buildResultFor(m);
      if (built) {
        setLatestResult(built.node);
        setLatestResultLabel(built.label);
        setActiveResultIdx(i);
        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, buildResultFor]);

  const restoreResult = useCallback((m: Message, idx: number) => {
    const built = buildResultFor(m);
    if (built) {
      setLatestResult(built.node);
      setLatestResultLabel(built.label);
      setActiveResultIdx(idx);
    }
  }, [buildResultFor]);

  // Derive archive list of generated results in chronological order
  const resultHistory = useMemo(() => {
    const labelMap = (m: Message): { label: string; kind: string } | null => {
      if (m.type === "inquiry-result") return { label: "询盘解析结果", kind: "解析" };
      if (m.type === "inquiry-followup-result") return { label: "询盘回复邮件 · 两版对比", kind: "邮件" };
      if (m.type === "followup-strategy-result") return { label: "跟进策略 · 节奏 / 话术 / 动作", kind: "策略" };
      if (m.type === "buyer-background-result") return { label: "买家背调报告 · TechSol US", kind: "背调" };
      if (m.type === "operation-result") return { label: "产品分析结果", kind: "分析" };
      if (m.type === "image-result") return { label: "产品图生成结果", kind: "生成" };
      if (m.type === "detail-result") return { label: "详情图生成结果", kind: "生成" };
      if (m.type === "demo-result") return { label: "过程示例结果", kind: "示例" };
      if (m.type === "keyword-result") return { label: "关键词趋势分析报告", kind: "趋势" };
      if (m.type === "market-result") return { label: "外贸市场调研报告", kind: "调研" };
      if (m.type === "trend-result") return { label: "热点趋势采集报告", kind: "趋势" };
      return null;
    };
    // Use stable, monotonically-increasing relative timestamps (most recent = "刚刚")
    const items = messages
      .map((m, idx) => ({ m, idx, meta: labelMap(m) }))
      .filter((x) => x.meta) as { m: Message; idx: number; meta: { label: string; kind: string } }[];
    const total = items.length;
    return items.map((it, i) => {
      const fromEnd = total - 1 - i;
      const time = fromEnd === 0 ? "刚刚" : fromEnd === 1 ? "1 分钟前" : `${fromEnd * 2} 分钟前`;
      return { ...it, label: it.meta.label, kind: it.meta.kind, time };
    });
  }, [messages]);




  const sideArchive = useMemo(() => {
    if (moduleTitle === "业务专家") {
      return { title: "买家档案", subtitle: "Bergmann Home Supplies GmbH", icon: UserRound, recordsTitle: "历史询盘记录", records: BUYER_INQUIRY_RECORDS };
    }
    if (moduleTitle === "运营专家") {
      return { title: "产品素材", subtitle: "智能电助力自行车素材档案", icon: ImageIcon, recordsTitle: "已归档产品素材", records: PRODUCT_ASSET_RECORDS };
    }
    if (moduleTitle === "市场专家") {
      return { title: "市场分析", subtitle: "欧洲电助力自行车市场档案", icon: FileText, recordsTitle: "已归档市场分析", records: MARKET_REPORT_RECORDS };
    }
    return null;
  }, [moduleTitle]);

  // Buyer profile floating card state (业务专家 only)
  const buyerCardState = useMemo(() => {
    if (moduleTitle !== "业务专家") return { visible: false, updated: false, stage: "" };
    const hasInquiryResult = messages.some((m) => m.type === "inquiry-result");
    const hasSecondFollowup = messages.some(
      (m) => m.type === "second-followup-prompt" || (m.role === "user" && /二次跟进|二轮跟进|再次跟进/.test(m.content))
    );
    return {
      visible: hasInquiryResult,
      updated: hasSecondFollowup,
      stage: hasSecondFollowup ? "二次跟进 · 决策摇摆期" : "首轮报价已发出",
    };
  }, [messages, moduleTitle]);

  const COMPETITOR_HIGHLIGHTS = [
    { title: "价格策略", desc: "阶梯报价清晰：1-9台 $899、10-49台 $829、50+台 $769，支持整柜议价" },
    { title: "认证优势", desc: "CE、ROHS、EN15194、FCC 四证齐全，附 SGS 检测报告链接" },
    { title: "定制能力", desc: "支持 OEM/ODM：自定义 LOGO、车架配色、电池容量（10Ah/15Ah/20Ah）" },
    { title: "信任背书", desc: "详情页展示工厂实拍视频、出货记录、欧美客户合影" },
  ];

  const operationStepLinks = useMemo(() => [
    { stepIndex: 3, label: "竞品卖点拆解", onClick: () => setShowCompetitorDialog(true) },
  ], []);

  const handleMindFlowComplete = useCallback(() => {
    setShowingMindFlow(false);
    if (moduleTitle === "业务专家") {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", type: "inquiry-result" },
      ]);
      // Append the strategy prompt shortly after the result lifts into the right panel
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "", type: "inquiry-strategy-prompt" },
        ]);
      }, 600);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", type: "operation-result" },
      ]);
    }
  }, [moduleTitle]);

  const handleStrategyPick = useCallback((choice: InquiryStrategyChoice) => {
    setMessages((prev) => {
      // mark the latest strategy-prompt message as selected
      const next = prev.map((m) =>
        m.type === "inquiry-strategy-prompt" && !m.strategy ? { ...m, strategy: choice } : m
      );
      const userText = choice === "background" ? "生成买家背调报告" : "生成两版询盘回复邮件";
      const userMsg: Message = { role: "user", content: userText, type: "text" };
      const aiMindFlow: Message = {
        role: "assistant",
        content: "",
        type: choice === "background" ? "buyer-background-mindflow" : "followup-strategy-mindflow",
      };
      return [...next, userMsg, aiMindFlow];
    });
    if (choice === "background") {
      setShowingBuyerBgMindFlow(true);
    } else {
      setShowingFollowupStrategyMindFlow(true);
    }
  }, []);

  const handleSecondFollowupConfirm = useCallback((choice: SecondFollowupChoice, label: string) => {
    setMessages((prev) => {
      const next = prev.map((m) =>
        m.type === "second-followup-prompt" && !m.secondChoice ? { ...m, secondChoice: choice } : m
      );
      return [
        ...next,
        { role: "user" as const, content: `确认应对方式：${label}，请生成下一步跟进话术。`, type: "text" as const },
        { role: "assistant" as const, content: "", type: "followup-strategy-mindflow" as const },
      ];
    });
    setShowingFollowupStrategyMindFlow(true);
  }, []);

  const handleBackgroundCheck = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: "深度背调公司 TechSol US", type: "text" },
      { role: "assistant", content: "", type: "buyer-background-mindflow" },
    ]);
    setShowingBuyerBgMindFlow(true);
  }, []);

  const handleBuyerBgMindFlowComplete = useCallback(() => {
    setShowingBuyerBgMindFlow(false);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", type: "buyer-background-result" },
    ]);
  }, []);

  const handleEmailsMindFlowComplete = useCallback(() => {
    setShowingEmailsMindFlow(false);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", type: "inquiry-followup-result" },
    ]);
  }, []);

  const handleFollowupStrategyMindFlowComplete = useCallback(() => {
    setShowingFollowupStrategyMindFlow(false);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", type: "followup-strategy-result" },
    ]);
  }, []);

  const handleQuoteWizardComplete = useCallback((info: QuoteInfo, template: QuoteTemplate) => {
    setQuoteWizardActive(false);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: "", type: "quote-summary", quoteInfo: info, quoteTemplate: template },
      { role: "assistant", content: "", type: "quote-mindflow", quoteInfo: info, quoteTemplate: template },
    ]);
    setShowingQuoteMindFlow(true);
  }, []);

  const handleQuoteMindFlowComplete = useCallback(() => {
    setShowingQuoteMindFlow(false);
    setMessages((prev) => {
      const lastMindflow = [...prev].reverse().find((m) => m.type === "quote-mindflow");
      const info = lastMindflow?.quoteInfo || DEFAULT_QUOTE_INFO;
      const template = lastMindflow?.quoteTemplate || "business";
      return [
        ...prev,
        {
          role: "assistant",
          content: "",
          type: "quote-result",
          quoteInfo: info,
          quoteTemplate: template,
        },
      ];
    });
  }, []);

  const handleKeywordMindFlowComplete = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", type: "keyword-result" },
      { role: "assistant", content: "", type: "keyword-guidance" },
    ]);
  }, []);

  const handleMarketMindFlowComplete = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", type: "market-result" },
    ]);
  }, []);

  const handleTrendMindFlowComplete = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", type: "trend-result" },
    ]);
  }, []);

  const handleKeywordGuidancePick = useCallback((choice: KeywordGuidanceChoice, prompt: string) => {
    setMessages((prev) => {
      const next = prev.map((m) =>
        m.type === "keyword-guidance" && !m.keywordChoice ? { ...m, keywordChoice: choice } : m
      );
      return [...next, { role: "user" as const, content: prompt, type: "text" as const }];
    });
  }, []);

  const handleImageMindFlowComplete = useCallback(() => {
    setShowingImageMindFlow(false);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", type: "image-result" },
    ]);
  }, []);

  const startImageGeneration = useCallback(() => {
    setShowingImageMindFlow(true);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", type: "image-mindflow" },
    ]);
  }, []);

  const handleDetailMindFlowComplete = useCallback(() => {
    setShowingDetailMindFlow(false);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", type: "detail-result", detailTypes: pendingDetailTypes },
    ]);
  }, [pendingDetailTypes]);

  const handleDetailTypeSubmit = useCallback((types: string[]) => {
    setPendingDetailTypes(types);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: `请生成：${types.join("、")}`, type: "text" },
    ]);
    setTimeout(() => {
      setShowingDetailMindFlow(true);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", type: "detail-mindflow" },
      ]);
    }, 300);
  }, []);

  const handleAction = useCallback((action: string) => {
    if (action === "生成多场景产品主图") {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: action, type: "text" },
      ]);

      if (productImages.length > 0) {
        setTimeout(() => startImageGeneration(), 300);
      } else {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "", type: "upload-prompt" },
          ]);
        }, 300);
      }
    } else if (action === "生成产品详情图") {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: action, type: "text" },
      ]);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "", type: "detail-type-select" },
        ]);
      }, 300);
    }
  }, [productImages.length, startImageGeneration]);

  const handlePrefill = useCallback((text: string) => {
    setPrefillValue(text);
    setPrefillKey((k) => k + 1);
  }, []);

  const handleStartDemo = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: "过程示例", type: "text" },
    ]);
    setTimeout(() => {
      setShowingDemoMindFlow(true);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", type: "demo-mindflow" },
      ]);
    }, 300);
  }, []);

  const handleDemoMindFlowComplete = useCallback(() => {
    setShowingDemoMindFlow(false);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", type: "demo-result" },
    ]);
  }, []);

  const handleUploadFromChat = useCallback((images: string[]) => {
    setProductImages((prev) => [...prev, ...images]);
    // Add confirmation then start generation
    setMessages((prev) => [
      ...prev,
      { role: "user", content: `已上传 ${images.length} 张产品原图`, type: "text", images },
    ]);
    setTimeout(() => startImageGeneration(), 500);
  }, [startImageGeneration]);

  const handleSend = (text: string, quote?: ChatQuote) => {
    const newMessages: Message[] = [...messages, { role: "user", content: text, type: "text", quote }];

    if (isPlainTextPrompt(text)) {
      setAnalyzed(true);
      newMessages.push({ role: "assistant", content: PLAIN_TEXT_DEMO_RESPONSE, type: "plain-text" });
      setMessages(newMessages);
      return;
    }


    if (!analyzed) {
      setAnalyzed(true);
      if (moduleTitle === "运营专家") {
        if (isKeywordPrompt(text)) {
          newMessages.push({ role: "assistant", content: "", type: "keyword-mindflow" });
        } else {
          newMessages.push({ role: "assistant", content: "", type: "mindflow" });
          setShowingMindFlow(true);
        }
      } else if (moduleTitle === "业务专家") {
        if (isQuoteGenPrompt(text)) {
          newMessages.push({
            role: "assistant",
            content: "**当前买家跟进要点与报价策略**\n\n- 买家 TechSol US 已明确 5kW UL1741 逆变器需求，目标价 FOB <$380/unit。\n- 7 月上线，对样品速度与交期敏感，建议主动给出双交期方案。\n- 报价策略：在目标价基础上让出有限空间，突出认证齐全 + 一年质保 + 美西常备库存。",
            type: "plain-text",
          });
          setQuoteWizardActive(true);
        } else if (isBuyerBackgroundPrompt(text)) {
          newMessages.push({ role: "assistant", content: "", type: "buyer-background-mindflow" });
          setShowingBuyerBgMindFlow(true);
        } else if (isSecondFollowupPrompt(text)) {
          newMessages.push({ role: "assistant", content: "", type: "second-followup-prompt" });
        } else if (isFollowupStrategyPrompt(text)) {
          newMessages.push({ role: "assistant", content: "", type: "followup-strategy-mindflow" });
          setShowingFollowupStrategyMindFlow(true);
        } else {
          newMessages.push({
            role: "assistant",
            content: "",
            type: "mindflow",
          });
          setShowingMindFlow(true);
        }
      } else if (moduleTitle === "市场专家" && isMarketResearchPrompt(text)) {
        newMessages.push({ role: "assistant", content: "", type: "market-mindflow" });
      } else if (moduleTitle === "市场专家" && isTrendCollectionPrompt(text)) {
        newMessages.push({ role: "assistant", content: "", type: "trend-mindflow" });
      } else {
        newMessages.push({
          role: "assistant",
          content: "收到，我会继续为您分析。",
          type: "text",
        });
      }
    } else if (moduleTitle === "运营专家" && isKeywordPrompt(text)) {
      newMessages.push({ role: "assistant", content: "", type: "keyword-mindflow" });
    } else if (moduleTitle === "业务专家" && isQuoteGenPrompt(text)) {
      newMessages.push({
        role: "assistant",
        content: "**当前买家跟进要点与报价策略**\n\n- 买家 TechSol US 已明确 5kW UL1741 逆变器需求，目标价 FOB <$380/unit。\n- 7 月上线，对样品速度与交期敏感，建议主动给出双交期方案。\n- 报价策略：在目标价基础上让出有限空间，突出认证齐全 + 一年质保 + 美西常备库存。",
        type: "plain-text",
      });
      setQuoteWizardActive(true);
    } else if (moduleTitle === "业务专家" && isBuyerBackgroundPrompt(text)) {
      newMessages.push({ role: "assistant", content: "", type: "buyer-background-mindflow" });
      setShowingBuyerBgMindFlow(true);
    } else if (moduleTitle === "业务专家" && isSecondFollowupPrompt(text)) {
      newMessages.push({ role: "assistant", content: "", type: "second-followup-prompt" });
    } else if (moduleTitle === "业务专家" && isFollowupStrategyPrompt(text)) {
      newMessages.push({ role: "assistant", content: "", type: "followup-strategy-mindflow" });
      setShowingFollowupStrategyMindFlow(true);
    } else if (moduleTitle === "市场专家" && isMarketResearchPrompt(text)) {
      newMessages.push({ role: "assistant", content: "", type: "market-mindflow" });
    } else if (moduleTitle === "市场专家" && isTrendCollectionPrompt(text)) {
      newMessages.push({ role: "assistant", content: "", type: "trend-mindflow" });
    } else {
      newMessages.push({
        role: "assistant",
        content: "收到，我会继续为您分析。",
        type: "text",
      });
    }

    setMessages(newMessages);
  };



  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <div className="flex items-center gap-2 px-6 pt-4 pb-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-2 py-1 -ml-2 rounded-lg text-base font-semibold text-foreground hover:bg-muted transition-colors active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          {config.taskName}
        </button>
        <div className="ml-auto flex items-center gap-3">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border/60 text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-muted-foreground" />
            <span>分享</span>
          </button>
          <button
            onClick={() => setTeamDialogOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/80 transition-colors cursor-pointer"
          >
            <Coins className="w-4 h-4 text-[hsl(45,100%,51%)]" />
            <span>1,280 点</span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 rounded-full hover:bg-muted/60 p-1 pr-2 transition-all duration-200 focus:outline-none">
                <Avatar className="h-8 w-8 ring-2 ring-border/40 transition-shadow hover:ring-primary/30">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    MC
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground transition-transform duration-200" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-lg border-border/50 p-1.5">
              <DropdownMenuItem
                className="gap-2.5 cursor-pointer rounded-lg px-3 py-3 text-sm"
                onSelect={() => setTeamDialogOpen(true)}
              >
                <Users className="w-4 h-4 text-muted-foreground" />
                团队管理
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-lg px-3 py-3 text-sm text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4" />
                退出账号
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <TeamManagementDialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen} />

      <BuyerProfileFloatingCard
        visible={buyerCardState.visible}
        updated={buyerCardState.updated}
        stage={buyerCardState.stage}
      />

      <div ref={chatScrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="mx-auto w-full max-w-4xl px-6 pt-2 pb-4 space-y-4">
            {messages.map((msg, i) => {
              const isResult =
                msg.type === "operation-result" ||
                msg.type === "inquiry-result" ||
                msg.type === "inquiry-followup-result" ||
                msg.type === "followup-strategy-result" ||
                msg.type === "buyer-background-result" ||
                msg.type === "image-result" ||
                msg.type === "detail-result" ||
                msg.type === "demo-result" ||
                msg.type === "keyword-result" ||
                msg.type === "market-result" ||
                msg.type === "trend-result";
              const isMindflow = msg.type && /mindflow$/.test(msg.type);
              const nextMsg = messages[i + 1];
              const isTurnEnd =
                msg.role === "assistant" &&
                !isMindflow &&
                (!nextMsg || nextMsg.role === "user");
              const feedbackNode = isTurnEnd ? <MessageFeedback /> : null;

              if (isResult) {
                const built = buildResultFor(msg);
                if (!built) return null;
                return (
                  <div key={i} className="w-full">
                    {built.node}
                    {feedbackNode}
                  </div>
                );
              }
              if (msg.type === "quote-summary") {
                return (
                  <div key={i} className="w-full">
                    <QuoteSummaryCard
                      info={msg.quoteInfo || DEFAULT_QUOTE_INFO}
                      template={msg.quoteTemplate || "business"}
                    />
                  </div>
                );
              }
              return (
              <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "ml-auto max-w-[78%] flex-row-reverse" : "w-full"}`}>
                <div
                  className={`text-[15px] leading-relaxed w-full ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-tr-md whitespace-pre-line"
                      : "text-foreground pt-1"
                  }`}
                >
                   {msg.type === "mindflow" ? (
                    <MindFlowMessage
                      richSteps={moduleTitle === "业务专家" ? INQUIRY_RICH_STEPS : undefined}
                      stepLinks={moduleTitle !== "业务专家" ? operationStepLinks : undefined}
                      onComplete={handleMindFlowComplete}
                    />
                   ) : msg.type === "buyer-background-mindflow" ? (
                    <MindFlowMessage richSteps={BUYER_BG_RICH_STEPS} onComplete={handleBuyerBgMindFlowComplete} />
                  ) : msg.type === "emails-mindflow" ? (
                    <MindFlowMessage richSteps={EMAIL_GEN_RICH_STEPS} onComplete={handleEmailsMindFlowComplete} />
                  ) : msg.type === "followup-strategy-mindflow" ? (
                    <MindFlowMessage richSteps={FOLLOWUP_STRATEGY_RICH_STEPS} onComplete={handleFollowupStrategyMindFlowComplete} />
                  ) : msg.type === "image-mindflow" ? (
                    <MindFlowMessage steps={IMAGE_MINDFLOW_STEPS} onComplete={handleImageMindFlowComplete} />
                  ) : msg.type === "inquiry-strategy-prompt" ? (
                    <InquiryStrategyPrompt onPick={handleStrategyPick} selected={msg.strategy || null} />
                  ) : msg.type === "second-followup-prompt" ? (
                    <SecondFollowupPrompt onConfirm={handleSecondFollowupConfirm} selected={msg.secondChoice || null} />
                  ) : msg.type === "detail-type-select" ? (
                    <DetailTypeSelector onSubmit={handleDetailTypeSubmit} />
                  ) : msg.type === "detail-mindflow" ? (
                    <MindFlowMessage steps={DETAIL_MINDFLOW_STEPS} onComplete={handleDetailMindFlowComplete} />
                   ) : msg.type === "upload-prompt" ? (
                    <UploadPromptMessage onImagesUploaded={handleUploadFromChat} />
                  ) : msg.type === "demo-mindflow" ? (
                    <MindFlowMessage steps={DEMO_MINDFLOW_STEPS} onComplete={handleDemoMindFlowComplete} />
                  ) : msg.type === "keyword-mindflow" ? (
                    <MindFlowMessage steps={KEYWORD_MINDFLOW_STEPS} onComplete={handleKeywordMindFlowComplete} />
                  ) : msg.type === "market-mindflow" ? (
                    <MindFlowMessage steps={MARKET_MINDFLOW_STEPS} onComplete={handleMarketMindFlowComplete} />
                  ) : msg.type === "trend-mindflow" ? (
                    <MindFlowMessage steps={TREND_MINDFLOW_STEPS} onComplete={handleTrendMindFlowComplete} />
                  ) : msg.type === "quote-mindflow" ? (
                    <MindFlowMessage richSteps={QUOTE_RICH_STEPS} onComplete={handleQuoteMindFlowComplete} />
                  ) : msg.type === "quote-result" ? (
                    <QuoteResultCard
                      template={msg.quoteTemplate || "business"}
                      info={msg.quoteInfo || DEFAULT_QUOTE_INFO}
                    />
                  ) : msg.type === "keyword-guidance" ? (
                    <KeywordGuidancePrompt onPick={handleKeywordGuidancePick} selected={msg.keywordChoice || null} />
                  ) : msg.type === "operation-greeting" ? (
                    <OperationGreeting onPrefill={handlePrefill} onStartDemo={handleStartDemo} />
                  ) : msg.type === "plain-text" ? (
                    <div className="prose prose-sm max-w-none text-foreground text-base leading-relaxed prose-headings:text-foreground prose-headings:font-semibold prose-h2:text-[18px] prose-h2:mt-4 prose-h2:mb-2 prose-h2:first:mt-0 prose-h3:text-[15px] prose-h3:mt-3 prose-h3:mb-1.5 prose-p:my-1.5 prose-p:text-base prose-strong:text-foreground prose-strong:font-semibold prose-ul:my-1.5 prose-ul:pl-5 prose-li:my-0.5 prose-li:text-base prose-li:marker:text-muted-foreground">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    </div>

                  ) : (
                    <div>
                      {msg.quote && (
                        <div className="flex items-center gap-1.5 mb-1.5 px-2.5 py-1 rounded-md bg-primary/8 border-l-2 border-primary/30">
                          <span className="text-[11px] font-medium text-primary">{msg.quote.moduleName}</span>
                          <span className="text-[11px] text-muted-foreground truncate max-w-[150px]">{msg.quote.preview}</span>
                        </div>
                      )}
                      <span className="whitespace-pre-line">{msg.content}</span>
                      {msg.images && msg.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {msg.images.map((src, idx) => (
                            <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                              <img src={src} alt={`上传图片${idx + 1}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {feedbackNode}
                </div>
              </div>
              );
            })}
        </div>
      </div>

      <div className="px-6 pt-3 pb-2">
        <div className="mx-auto w-full max-w-4xl">
          {quoteWizardActive && (
            <div className="mb-3">
              <QuoteWizard onComplete={handleQuoteWizardComplete} />
            </div>
          )}
          <ChatInput key={prefillKey} onSend={handleSend} placeholder={config.placeholder} defaultValue={prefillValue} attachment={config.attachment} attachments={config.attachments} quote={activeQuote} onClearQuote={() => setActiveQuote(null)} />
          <p className="text-[11px] text-muted-foreground text-center mt-1.5">
            AI 可能会产生错误信息，请核实重要内容。
          </p>
        </div>
      </div>

      <Dialog open={showCompetitorDialog} onOpenChange={setShowCompetitorDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">竞品卖点拆解</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            {COMPETITOR_HIGHLIGHTS.map((item) => (
              <div key={item.title} className="flex gap-2">
                <span className="text-[13px] font-medium text-foreground shrink-0">• {item.title}：</span>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatDetail;
