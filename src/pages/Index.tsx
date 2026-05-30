import { useState, useCallback, useEffect, useRef } from "react";
import {
  Briefcase,
  MessageCircle,
  HelpCircle,
  Sparkles,
  Search,
  ShieldCheck,
  FileText,
  Image,
  Coins,
  ChevronDown,
  Users,
  LogOut,
  Paperclip,
  Send,
  Clock,
  ChevronRight,
  Eye,
  Wand2,
  ArrowRight,
  ArrowLeft,
  Package,
  Globe,
  Target,
  FileUp,
  Loader2,
  Check,
  Pencil,
  Users as UsersIcon,
  Archive,
  TrendingUp,
  UserRound,
  FileSearch,
  Mail,
  MapPin,
  Boxes,
  Download,

} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppSidebar from "@/components/AppSidebar";
import ModuleCard from "@/components/ModuleCard";
import ChatInput, { ChatAttachment } from "@/components/ChatInput";
import ChatDetail from "@/components/ChatDetail";
import AIProfileDetail from "@/components/AIProfileDetail";
import TeamManagementDialog from "@/components/TeamManagementDialog";
import InquiryResultMessage, { BuyerBackgroundReport } from "@/components/InquiryResultMessage";
import BuyerProfileDetail from "@/components/BuyerProfileDetail";
import { BuyerProfileSheetContent } from "@/components/BuyerProfileFloatingCard";
import { Sheet, SheetContent } from "@/components/ui/sheet";

import { cn } from "@/lib/utils";
import operationAvatar from "@/assets/expert-operation.jpg";
import businessAvatar from "@/assets/expert-business.jpg";
import trainingAvatar from "@/assets/expert-training.jpg";
import leadsExpertAvatar from "@/assets/expert-leads-frank.jpg";
import brandExpertAvatar from "@/assets/expert-brand-eva.jpg";
import wechatServiceQr from "@/assets/wechat-service-qr.png";
import defaultProductBike from "@/assets/default-product-bike.png";

const modules = [
  {
    icon: MessageCircle,
    title: "业务专家",
    subtitle: "客户沟通 & 跟进策略",
    action: "提供询盘回复策略指导",
    color: "from-[hsl(217,100%,50%)] to-[hsl(174,100%,61%)]",
    expertAvatar: businessAvatar,
    expertName: "业务专家",
    expertTip: "秒懂买家意图，给你最优回复策略。",
  },
  {
    icon: Briefcase,
    title: "运营专家",
    subtitle: "产品优化 & 竞品分析",
    action: "复刻竞品，生成产品详情",
    color: "from-[hsl(217,100%,50%)] to-[hsl(217,100%,62%)]",
    expertAvatar: operationAvatar,
    expertName: "运营专家",
    expertTip: "一键生成高转化详情，让产品更会说话。",
  },
  {
    icon: HelpCircle,
    title: "培训专家",
    subtitle: "知识 & 案例建议",
    action: "立即咨询常见问题",
    color: "from-[hsl(190,100%,50%)] to-[hsl(174,100%,61%)]",
    expertAvatar: trainingAvatar,
    expertName: "培训专家",
    expertTip: "日常外贸问题，随时问随时答。",
  },
];

const archiveExperts = [
  {
    title: "产品专家",
    tagline: "高转化产品力",
    tags: ["卖点体系", "SEO优化", "B2B增长"],
    avatar: operationAvatar,
  },
  {
    title: "业务专家",
    tagline: "询盘到成交",
    tags: ["询盘转化", "客户策略", "成交路径"],
    avatar: businessAvatar,
  },
  {
    title: "培训专家",
    tagline: "外贸知识&建议",
    tags: ["市场趋势", "区域策略", "经验留存"],
    avatar: trainingAvatar,
  },
];

const PRODUCT_IMAGE_ATTACHMENT: ChatAttachment = {
  label: "产品原图",
  preview: "double-wall-insulated-beer-mug.jpg",
  fullContent: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400",
  imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400",
};

const EXAMPLE_PROMPTS: { label: string; prompt: string; icon: typeof Sparkles; attachment?: ChatAttachment }[] = [
  {
    label: "复刻Stanley保温杯产品详情页",
    prompt: "帮我复刻Stanley保温杯的产品详情页风格，生成同款产品描述",
    icon: FileText,
  },
  {
    label: "生成高转化率产品详情图",
    prompt: "帮我生成高转化率的产品详情图，突出产品卖点和使用场景",
    icon: Image,
    attachment: PRODUCT_IMAGE_ATTACHMENT,
  },
  { label: "欧洲地区买家询盘分析指点", prompt: "我收到一封欧洲买家的询盘，帮我分析买家背景和回复策略", icon: Search },
  {
    label: "LED工业灯具询盘回复策略",
    prompt: "帮我针对LED工业灯具的询盘，制定专业的回复策略和报价方案",
    icon: Sparkles,
  },
  {
    label: "新客户第一次下单，怎么降低风险？",
    prompt: "新客户第一次下单，怎么降低风险？有哪些常用的风控手段？",
    icon: ShieldCheck,
  },
  {
    label: "汽车零配件出口合规要点",
    prompt: "汽车零配件出口有哪些合规要求和认证标准？如何避免常见的贸易风险？",
    icon: HelpCircle,
  },
];

const TASK_TABS = [
  {
    avatar: businessAvatar,
    label: "跟单成交",
    expert: "业务专家",
    steps: [
      {
        title: "分析询盘",
        desc: "提取需求要点，识别买家意图",
        prompt: `帮我分析这封买家询盘，提取核心需求并判断买家意图：

From: john.carter@techsol.us
Subject: Urgent: Solar inverter 5kW for USA retail project

Dear Sirs, do you have 5kW hybrid inverter with UL1741? Need 300 units first, price target FOB <$380/unit. Can you send sample by air? We need to launch in July. Please quote fast.`,
      },
      {
        title: "背调买家",
        desc: "全网检索信息，输出买家画像",
        prompt: "帮我对这个买家做深度背景调查，输出公司画像、采购实力和风险提示",
      },
      {
        title: "​策略咨询",
        desc: "制定跟进节奏与话术路径",
        prompt: "帮我为这个买家制定一套跟进策略，包括节奏、话术和下一步动作",
      },
      {
        title: "生成报价单",
        desc: "智能生成报价单",
        prompt: "买家 GreenLife 采购 5kW hybrid inverter with UL1741 要求 Need 300 units first, price target FOB <$380/unit，生成个性化报价单",
        isNew: true,
      },
    ],
  },
  {
    avatar: operationAvatar,
    label: "产品转化",
    expert: "产品专家",
    steps: [
      {
        title: "热门产品词",
        desc: "挖掘搜索热词，锁定需求",
        prompt: "帮我挖掘这个品类的热门产品词和海外买家常用搜索词",
      },
      {
        title: "提炼卖点&SEO",
        desc: "提炼核心卖点，优化排行",
        prompt: "帮我提炼产品核心卖点，并优化标题、关键词和SEO描述",
      },
      { title: "营销素材生成", desc: "一键生成多平台营销图文", prompt: "帮我生成适合多平台发布的产品营销图文素材" },
    ],
  },
  {
    avatar: trainingAvatar,
    label: "业务沉淀",
    expert: "培训专家",
    steps: [
      {
        title: "外贸问题解答",
        desc: "实时回答外贸业务实操问题",
        prompt: "我在外贸业务中遇到一些具体问题，想请教 AI 专家给出实操建议",
      },
      {
        title: "企业知识库",
        desc: "AI 学习公司业务，沉淀企业画像",
        prompt: "",
      },
      {
        title: "经验资产沉淀",
        desc: "归档团队经验、案例与素材资产",
        prompt: "",
      },
    ],
  },
];

// 简约浅色案例示意图：根据 step.title 渲染不同的 SVG-like 视觉
const StepPreview = ({ title }: { title: string }) => {
  const baseWrap = "relative h-28 w-full overflow-hidden rounded-xl border border-border/60";

  switch (title) {
    case "分析询盘":
      return (
        <div className={cn(baseWrap, "bg-gradient-to-br from-primary/5 to-secondary/10 p-2")}>
          <div className="flex flex-wrap gap-1">
            <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[9px] font-medium text-primary">5kW</span>
            <span className="rounded-md bg-secondary/30 px-1.5 py-0.5 text-[9px] font-medium text-foreground/70">
              UL1741
            </span>
            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary/80">
              300pcs
            </span>
          </div>
          <div className="mt-2 space-y-1">
            <div className="h-1.5 w-full rounded-full bg-foreground/10" />
            <div className="h-1.5 w-3/4 rounded-full bg-foreground/10" />
            <div className="h-1.5 w-1/2 rounded-full bg-foreground/10" />
          </div>
        </div>
      );
    case "背调买家":
      return (
        <div className={cn(baseWrap, "bg-gradient-to-br from-secondary/10 to-primary/5 p-2")}>
          <div className="grid grid-cols-3 gap-1">
            <div className="rounded-md bg-card/80 p-1 text-center shadow-sm">
              <div className="text-[10px] font-bold text-primary">A+</div>
              <div className="text-[8px] text-muted-foreground">实力</div>
            </div>
            <div className="rounded-md bg-card/80 p-1 text-center shadow-sm">
              <div className="text-[10px] font-bold text-foreground/80">EU</div>
              <div className="text-[8px] text-muted-foreground">区域</div>
            </div>
            <div className="rounded-md bg-card/80 p-1 text-center shadow-sm">
              <div className="text-[10px] font-bold text-emerald-500">低</div>
              <div className="text-[8px] text-muted-foreground">风险</div>
            </div>
          </div>
          <div className="mt-2 space-y-1">
            <div className="h-1.5 w-2/3 rounded-full bg-foreground/15" />
            <div className="h-1.5 w-1/2 rounded-full bg-foreground/10" />
          </div>
        </div>
      );
    case "​策略咨询":
      return (
        <div className={cn(baseWrap, "bg-gradient-to-br from-primary/5 to-secondary/10 p-2")}>
          <div className="space-y-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary/15 text-[8px] font-bold text-primary">
                  {i}
                </div>
                <div className="h-1.5 flex-1 rounded-full bg-foreground/10" style={{ width: `${100 - i * 15}%` }} />
              </div>
            ))}
          </div>
        </div>
      );
    case "生成报价单":
      return (
        <div className={cn(baseWrap, "bg-gradient-to-br from-secondary/15 to-primary/5 p-2")}>
          <div className="space-y-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="h-1 flex-1 rounded-full bg-foreground/10" />
                <div className="h-1 w-5 rounded-full bg-primary/30" />
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[8px] text-muted-foreground">Total</span>
            <span className="text-[9px] font-bold text-primary">$112,920</span>
          </div>
        </div>
      );
    case "热门产品词":
      return (
        <div className={cn(baseWrap, "bg-gradient-to-br from-primary/5 to-secondary/10 p-3")}>
          <div className="flex flex-wrap gap-1.5">
            {[
              { t: "solar inverter", w: "text-sm" },
              { t: "5kW hybrid", w: "text-xs" },
              { t: "UL listed", w: "text-[10px]" },
              { t: "off-grid", w: "text-xs" },
              { t: "MPPT", w: "text-[10px]" },
              { t: "wholesale", w: "text-xs" },
            ].map((k) => (
              <span
                key={k.t}
                className={cn("rounded-md bg-card/80 px-1.5 py-0.5 font-medium text-primary/80 shadow-sm", k.w)}
              >
                {k.t}
              </span>
            ))}
          </div>
          <div className="absolute bottom-2 right-3 flex items-center gap-1 text-[9px] text-muted-foreground">
            <TrendingUp className="h-2.5 w-2.5" />
            热度 ↑
          </div>
        </div>
      );
    case "提炼卖点&SEO":
      return (
        <div className={cn(baseWrap, "bg-gradient-to-br from-secondary/10 to-primary/5 p-3")}>
          <div className="rounded-md bg-card/80 p-2 shadow-sm">
            <div className="h-1.5 w-3/4 rounded-full bg-primary/40" />
            <div className="mt-1.5 h-1 w-full rounded-full bg-foreground/10" />
            <div className="mt-1 h-1 w-5/6 rounded-full bg-foreground/10" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-600">
              <Check className="h-2.5 w-2.5" />
              SEO 92
            </div>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/10">
              <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-primary to-secondary" />
            </div>
          </div>
        </div>
      );
    case "营销素材生成":
      return (
        <div className={cn(baseWrap, "bg-gradient-to-br from-primary/5 to-secondary/10 p-3")}>
          <div className="grid grid-cols-3 gap-1.5">
            <div className="aspect-square rounded-md bg-gradient-to-br from-primary/20 to-primary/5 p-1.5">
              <Image className="h-3 w-3 text-primary/60" />
            </div>
            <div className="aspect-square rounded-md bg-gradient-to-br from-secondary/30 to-secondary/10 p-1.5">
              <Image className="h-3 w-3 text-foreground/40" />
            </div>
            <div className="aspect-square rounded-md bg-gradient-to-br from-primary/15 to-secondary/15 p-1.5">
              <Image className="h-3 w-3 text-primary/50" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="rounded-full bg-card/80 px-1.5 py-0.5 text-[9px] font-medium text-foreground/70 shadow-sm">
              FB
            </span>
            <span className="rounded-full bg-card/80 px-1.5 py-0.5 text-[9px] font-medium text-foreground/70 shadow-sm">
              IG
            </span>
            <span className="rounded-full bg-card/80 px-1.5 py-0.5 text-[9px] font-medium text-foreground/70 shadow-sm">
              LinkedIn
            </span>
          </div>
        </div>
      );
    case "企业知识画像":
      return (
        <div className={cn(baseWrap, "bg-gradient-to-br from-secondary/10 to-primary/5 p-3")}>
          <div className="flex items-center justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30" />
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/90 shadow-sm">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <span className="absolute -left-1 top-2 rounded-md bg-card/90 px-1.5 py-0.5 text-[8px] font-medium text-foreground/70 shadow-sm">
                产品
              </span>
              <span className="absolute -right-2 top-3 rounded-md bg-card/90 px-1.5 py-0.5 text-[8px] font-medium text-foreground/70 shadow-sm">
                优势
              </span>
              <span className="absolute -left-2 bottom-2 rounded-md bg-card/90 px-1.5 py-0.5 text-[8px] font-medium text-foreground/70 shadow-sm">
                服务
              </span>
              <span className="absolute -right-1 bottom-2 rounded-md bg-card/90 px-1.5 py-0.5 text-[8px] font-medium text-foreground/70 shadow-sm">
                行业
              </span>
            </div>
          </div>
        </div>
      );
    case "团队经验技巧":
      return (
        <div className={cn(baseWrap, "bg-gradient-to-br from-primary/5 to-secondary/10 p-3")}>
          <div className="space-y-1.5">
            {["Rita", "Jason", "Cody"].map((n, i) => (
              <div key={n} className="flex items-center gap-2 rounded-md bg-card/80 px-2 py-1 shadow-sm">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/15 text-[8px] font-bold text-primary">
                  {n[0]}
                </div>
                <div className="h-1.5 rounded-full bg-foreground/10" style={{ width: `${65 - i * 10}%` }} />
                <span className="ml-auto text-[8px] text-muted-foreground">{n}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case "外贸问题解答":
      return (
        <div className={cn(baseWrap, "bg-gradient-to-br from-primary/5 to-secondary/10 p-3")}>
          <div className="space-y-1.5">
            <div className="ml-auto max-w-[70%] rounded-lg rounded-tr-sm bg-muted/70 px-2 py-1.5">
              <div className="h-1.5 w-full rounded-full bg-foreground/15" />
              <div className="mt-1 h-1.5 w-3/4 rounded-full bg-foreground/10" />
            </div>
            <div className="max-w-[80%] rounded-lg rounded-tl-sm bg-card/90 px-2 py-1.5 shadow-sm">
              <div className="flex items-center gap-1 mb-1">
                <Sparkles className="h-2.5 w-2.5 text-primary" />
                <div className="h-1 w-10 rounded-full bg-primary/40" />
              </div>
              <div className="h-1.5 w-full rounded-full bg-foreground/10" />
              <div className="mt-1 h-1.5 w-5/6 rounded-full bg-foreground/10" />
            </div>
          </div>
        </div>
      );
    case "企业知识库":
      return (
        <div className={cn(baseWrap, "bg-gradient-to-br from-secondary/10 to-primary/5 p-3")}>
          <div className="flex items-center justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30" />
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/90 shadow-sm">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <span className="absolute -left-1 top-2 rounded-md bg-card/90 px-1.5 py-0.5 text-[8px] font-medium text-foreground/70 shadow-sm">产品</span>
              <span className="absolute -right-2 top-3 rounded-md bg-card/90 px-1.5 py-0.5 text-[8px] font-medium text-foreground/70 shadow-sm">优势</span>
              <span className="absolute -left-2 bottom-2 rounded-md bg-card/90 px-1.5 py-0.5 text-[8px] font-medium text-foreground/70 shadow-sm">服务</span>
              <span className="absolute -right-1 bottom-2 rounded-md bg-card/90 px-1.5 py-0.5 text-[8px] font-medium text-foreground/70 shadow-sm">行业</span>
            </div>
          </div>
        </div>
      );
    case "经验资产沉淀":
      return (
        <div className={cn(baseWrap, "bg-gradient-to-br from-primary/5 to-secondary/10 p-3")}>
          <div className="space-y-1.5">
            {["案例", "话术", "素材"].map((n, i) => (
              <div key={n} className="flex items-center gap-2 rounded-md bg-card/80 px-2 py-1 shadow-sm">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-primary/15 text-[8px] font-bold text-primary">
                  {n[0]}
                </div>
                <div className="h-1.5 rounded-full bg-foreground/10" style={{ width: `${65 - i * 10}%` }} />
                <span className="ml-auto text-[8px] text-muted-foreground">{n}</span>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return (
        <div className={cn(baseWrap, "bg-muted/40 p-4")}>
          <div className="h-2 w-3/4 rounded-full bg-border" />
          <div className="mt-3 h-2 w-1/2 rounded-full bg-border" />
          <div className="mt-3 h-8 rounded-xl bg-card shadow-sm" />
        </div>
      );
  }
};

type ResultCategory = "buyer" | "product" | "market";

const RESULT_CATEGORY_META: Record<ResultCategory, { label: string; icon: typeof Search }> = {
  buyer: { label: "买家档案", icon: Users },
  product: { label: "产品素材", icon: Image },
  market: { label: "市场分析", icon: FileText },
};

type ResultItem = {
  id: string;
  category: ResultCategory;
  name: string;
  status: string;
  // For buyer profiles, multiple session sources may exist
  sessions: string[];
  meta?: string;
};

const resultItems: ResultItem[] = [
  // 买家档案
  {
    id: "b1",
    category: "buyer",
    name: "德国大型连锁健身房采购部",
    status: "跟进中",
    sessions: ["慕尼黑展会名片清洗-0326", "德国采购意向跟进-0402"],
    meta: "决策链 3 人 · 预算 €120K",
  },
  {
    id: "b2",
    category: "buyer",
    name: "美国本土居家运动 DTC 品牌",
    status: "已建档",
    sessions: ["北美市场竞对背调-0328", "DTC 品牌私域获客拆解-0405", "美西采购窗口期分析-0410"],
    meta: "年采购量 8K 件 · 复购率高",
  },
  {
    id: "b3",
    category: "buyer",
    name: "中东商用健身房连锁",
    status: "待报价",
    sessions: ["迪拜健身展线索整理-0331"],
    meta: "门店 12 家 · 整店采购",
  },
  // 产品素材
  {
    id: "p1",
    category: "product",
    name: "智能动感单车详情主图（居家实景）",
    status: "可复用",
    sessions: ["详情页转化率优化-0321"],
  },
  {
    id: "p2",
    category: "product",
    name: "可折叠走步机短视频脚本（15秒核心卖点）",
    status: "可复用",
    sessions: ["TikTok 社媒矩阵生成-0325"],
  },
  {
    id: "p3",
    category: "product",
    name: "迷你椭圆机 A+ 详情页（亚马逊版）",
    status: "已上架",
    sessions: ["亚马逊 Listing 优化-0329"],
  },
  // 市场分析
  {
    id: "m1",
    category: "market",
    name: "欧洲居家健身器材需求趋势",
    status: "已更新",
    sessions: ["目标市场机会扫描-0329"],
  },
  {
    id: "m2",
    category: "market",
    name: "中东商用健身房采购路径拆解",
    status: "待复盘",
    sessions: ["新市场拓展策略-0330"],
  },
  {
    id: "m3",
    category: "market",
    name: "北美 DTC 渠道趋势观察",
    status: "已更新",
    sessions: ["北美渠道结构分析-0408"],
  },
];

const RESULT_TABS: { key: "all" | ResultCategory; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "buyer", label: "买家档案" },
  { key: "product", label: "产品素材" },
  { key: "market", label: "市场分析" },
];

const weeklySummary = {
  range: "10/21 - 10/27",
  metrics: [
    { label: "累计任务", value: "47", delta: "+12", icon: Sparkles },
    { label: "归档成果", value: "32", delta: "+9", icon: Archive },
    { label: "买家档案", value: "8", delta: "+3", icon: Users },
  ],
  highlights: [
    "完成 12 封高意向询盘策略回复，沉淀 2 套话术模板。",
    "生成 8 款产品详情页素材 + 3 份市场洞察报告，均已归档。",
  ],
};

const boardNews = [
  {
    title: "折叠式走步机搜索热度连续上涨",
    copy: "北美居家办公人群带动轻量健身设备需求，低噪音、可收纳成为核心卖点。",
    tag: "热品机会",
  },
  {
    title: "智能动感单车进入欧洲春季补货周期",
    copy: "德国、法国经销商更关注APP联动、售后配件与稳定交付能力。",
    tag: "采购信号",
  },
  { title: "商用健身房更新器械预算回升", copy: "中东市场对耐用结构、质保年限和成套方案询价更频繁。", tag: "市场趋势" },
  {
    title: "短视频平台带动迷你椭圆机曝光",
    copy: "TikTok内容更偏向办公室碎片化运动场景，建议准备15秒场景化素材。",
    tag: "内容灵感",
  },
  {
    title: "可穿戴心率联动成为详情页高频卖点",
    copy: "海外买家更关注数据同步、训练计划和家庭成员多人使用体验。",
    tag: "卖点优化",
  },
];

type InquiryBuyer = {
  id: string;
  company: string;
  products: string;
  contact: string;
  region: string;
  stage: string;
  stageTone: "primary" | "amber" | "emerald" | "muted";
  nextAction: { label: string };
  analyses: { title: string; date: string }[];
};

const INQUIRY_BUYERS: InquiryBuyer[] = [
  {
    id: "b1",
    company: "德国大型连锁健身房采购部 FitLine GmbH",
    products: "商用动感单车 / 智能跑步机",
    contact: "Markus Schneider · 采购总监",
    region: "德国 慕尼黑",
    stage: "深度跟进",
    stageTone: "primary",
    nextAction: { label: "跟进报价进展，确认整店方案反馈" },
    analyses: [
      { title: "慕尼黑展会名片清洗-0326", date: "03/26" },
      { title: "德国采购意向跟进-0402", date: "04/02" },
      { title: "决策链梳理 & 预算确认-0418", date: "04/18" },
    ],
  },
  {
    id: "b2",
    company: "美国本土居家运动 DTC 品牌 HomeFit Co.",
    products: "迷你椭圆机 / 可折叠走步机",
    contact: "Olivia Park · 品类经理",
    region: "美国 洛杉矶",
    stage: "已建档",
    stageTone: "emerald",
    nextAction: { label: "发起看厂邀请，推进 ID 联合开发落地" },
    analyses: [
      { title: "北美市场竞对背调-0328", date: "03/28" },
      { title: "DTC 品牌私域获客拆解-0405", date: "04/05" },
      { title: "美西采购窗口期分析-0410", date: "04/10" },
    ],
  },
  {
    id: "b3",
    company: "中东商用健身房连锁 Desert Gym",
    products: "整店成套器械 / 售后配件",
    contact: "Khalid Al-Mansoori · 创始人",
    region: "阿联酋 迪拜",
    stage: "待报价",
    stageTone: "amber",
    nextAction: { label: "深度买家背调，评估资金与决策链" },
    analyses: [{ title: "迪拜健身展线索整理-0331", date: "03/31" }],
  },
  {
    id: "b4",
    company: "TechSol US Renewable Distribution",
    products: "5kW 混合逆变器（UL1741）",
    contact: "John Carter · Procurement Lead",
    region: "美国 德州",
    stage: "首次询盘",
    stageTone: "primary",
    nextAction: { label: "获取买家动态更新，捕捉首单决策窗口" },
    analyses: [
      { title: "保温啤酒杯阶梯报价询盘分析", date: "04/22" },
      { title: "买家 TechSol US 背调", date: "04/24" },
    ],
  },
];

type ImageGroup = {
  createdAt: string;
  type: "产品套图" | "详情海报";
  images: string[];
};

type GeneratedProduct = {
  id: string;
  name: string;
  specs: string;
  imageGroups: ImageGroup[];
  tasks: { title: string; date: string }[];
};

const GENERATED_PRODUCTS: GeneratedProduct[] = [
  {
    id: "gp1",
    name: "1000W Fat Tire 电助力车",
    specs: "1000W 电机 · 48V 14Ah 电池 · 续航 60km · 载重 150kg · CE/EN15194 认证",
    imageGroups: [
      {
        createdAt: "2024/04/20 14:32",
        type: "产品套图",
        images: [
          "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=600&h=600&fit=crop",
        ],
      },
      {
        createdAt: "2024/04/18 10:05",
        type: "详情海报",
        images: [
          "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1591741535018-d042766c62eb?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1605705077310-d72d56b2b3eb?w=600&h=600&fit=crop",
        ],
      },
    ],
    tasks: [
      { title: "亚马逊 A+ 详情页生成", date: "04/20" },
      { title: "主图 5 张生成", date: "04/18" },
      { title: "卖点文案 EN/ES 翻译", date: "04/15" },
    ],
  },
  {
    id: "gp2",
    name: "智能动感单车（居家版）",
    specs: "磁控阻力 32 档 · 静音皮带传动 · 蓝牙连接 App · 承重 130kg · 折叠收纳",
    imageGroups: [
      {
        createdAt: "2024/04/16 16:48",
        type: "产品套图",
        images: [
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop",
        ],
      },
      {
        createdAt: "2024/04/12 09:20",
        type: "详情海报",
        images: [
          "https://images.unsplash.com/photo-1591741535018-d042766c62eb?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?w=600&h=600&fit=crop",
        ],
      },
    ],
    tasks: [
      { title: "独立站详情页生成", date: "04/16" },
      { title: "场景图 6 张生成", date: "04/12" },
      { title: "15s 短视频脚本", date: "04/10" },
    ],
  },
  {
    id: "gp3",
    name: "双层保温啤酒杯",
    specs: "40oz 304 不锈钢 · 真空双层 · 保冷 24h / 保温 12h · 防漏滑盖 · BPA free",
    imageGroups: [
      {
        createdAt: "2024/04/12 11:15",
        type: "产品套图",
        images: [
          "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&h=600&fit=crop",
        ],
      },
    ],
    tasks: [
      { title: "Listing 标题 + 五点描述", date: "04/12" },
      { title: "主图 4 张生成", date: "04/09" },
    ],
  },
  {
    id: "gp4",
    name: "可折叠迷你走步机",
    specs: "1.0–6.0km/h · 承重 120kg · 静音电机 · 遥控操作 · 折叠厚度 12.5cm",
    imageGroups: [
      {
        createdAt: "2024/04/08 15:42",
        type: "产品套图",
        images: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1434596922112-19c563067271?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=600&fit=crop",
        ],
      },
    ],
    tasks: [
      { title: "TikTok 短视频脚本", date: "04/08" },
      { title: "营销卖点文案", date: "04/05" },
    ],
  },
];

const INQUIRY_STAGE_STYLES: Record<InquiryBuyer["stageTone"], string> = {
  primary: "border-primary/25 bg-primary/10 text-primary",
  amber: "border-accent-amber/30 bg-accent-amber/15 text-accent-amber",
  emerald: "border-success/30 bg-success/15 text-success",
  muted: "border-border bg-muted text-muted-foreground",
};


const Index = () => {
  // Persisted training/partner state — new visitors see the launch page;
  // once trained, the configured state is restored on subsequent visits.
  const initialPartnerConfigured = (() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem("mentarc.partnerConfigured") === "1";
    } catch {
      return false;
    }
  })();

  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [chatInitialMessage, setChatInitialMessage] = useState("");
  const [showPartnerConfig, setShowPartnerConfig] = useState(!initialPartnerConfigured);
  const [showProfile, setShowProfile] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [inputKey, setInputKey] = useState(0);
  const [prefillValue, setPrefillValue] = useState("");
  const [prefillAttachment, setPrefillAttachment] = useState<ChatAttachment | undefined>(undefined);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [caseDialogOpen, setCaseDialogOpen] = useState(false);
  const [casePrompt, setCasePrompt] = useState("");
  const [followupDialogOpen, setFollowupDialogOpen] = useState(false);
  const [activeTaskTab, setActiveTaskTab] = useState(TASK_TABS[0].label);
  
  const [activeBuyerId, setActiveBuyerId] = useState<string | null>(null);
  const [expandedBuyerId, setExpandedBuyerId] = useState<string | null>(null);
  const [sheetBuyerId, setSheetBuyerId] = useState<string | null>(null);
  
  const [bgReportBuyerId, setBgReportBuyerId] = useState<string | null>(null);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [imageGalleryProductId, setImageGalleryProductId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const bgReportRef = useRef<HTMLDivElement>(null);
  const [bgReportDownloading, setBgReportDownloading] = useState(false);

  const handleDownloadBgReport = async () => {
    if (!bgReportRef.current || bgReportDownloading) return;
    setBgReportDownloading(true);
    try {
      const [{ toPng }, { default: jsPDF }] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ]);
      const dataUrl = await toPng(bgReportRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        cacheBust: true,
      });
      const img = document.createElement("img");
      img.src = dataUrl;
      await new Promise<void>((res) => {
        img.onload = () => res();
      });
      const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (img.height * imgW) / img.width;
      let remaining = imgH;
      let position = 0;
      while (remaining > 0) {
        pdf.addImage(dataUrl, "PNG", 0, position, imgW, imgH);
        remaining -= pageH;
        if (remaining > 0) {
          position -= pageH;
          pdf.addPage();
        }
      }
      const company = INQUIRY_BUYERS.find((b) => b.id === bgReportBuyerId)?.company || "buyer";
      pdf.save(`背调报告_${company}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setBgReportDownloading(false);
    }
  };

  const [partnerConfigured, setPartnerConfigured] = useState(initialPartnerConfigured);
  // Initialization training flow: idle | form | training | result
  const [trainingStage, setTrainingStage] = useState<"idle" | "form" | "training" | "result">("idle");
  const [trainingForm, setTrainingForm] = useState({
    mainProducts: "",
    targetMarket: "",
    companyName: "宁波启明智能科技有限公司",
    website: "",
    docName: "",
  });
  const [trainingProgress, setTrainingProgress] = useState(0);
  const selectedTaskTab = TASK_TABS.find((tab) => tab.label === activeTaskTab) ?? TASK_TABS[0];
  const selectedModuleTitle =
    selectedTaskTab.label === "产品转化" ? "运营专家" : selectedTaskTab.label === "业务沉淀" ? "培训专家" : "业务专家";

  const handleLogout = useCallback(() => {
    setPartnerConfigured(false);
    setShowPartnerConfig(false);
    setShowProfile(false);
    setShowResults(false);
    setShowBoard(false);
    setShowMarket(false);
    setActiveModule(null);
    setTrainingStage("idle");
  }, []);

  // Simulate AI training progress
  useEffect(() => {
    if (trainingStage !== "training") return;
    setTrainingProgress(0);
    const start = Date.now();
    const total = 3200;
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / total) * 100));
      setTrainingProgress(pct);
      if (pct >= 100) {
        clearInterval(id);
        setTimeout(() => setTrainingStage("result"), 350);
      }
    }, 80);
    return () => clearInterval(id);
  }, [trainingStage]);

  // Persist partner configured state
  useEffect(() => {
    try {
      if (partnerConfigured) {
        window.localStorage.setItem("mentarc.partnerConfigured", "1");
      } else {
        window.localStorage.removeItem("mentarc.partnerConfigured");
      }
    } catch {
      /* ignore */
    }
  }, [partnerConfigured]);

  const handleExampleClick = useCallback((item: (typeof EXAMPLE_PROMPTS)[0]) => {
    setPrefillValue(item.prompt);
    setPrefillAttachment(item.attachment);
    setInputKey((k) => k + 1);
  }, []);

  const handleUseCasePrompt = useCallback((prompt: string) => {
    setPrefillValue(prompt);
    setPrefillAttachment(undefined);
    setInputKey((k) => k + 1);
  }, []);

  const handleDirectFollowup = useCallback((buyer: InquiryBuyer) => {
    const prompt = `立即跟进买家「${buyer.company}」（${buyer.contact}）：${buyer.nextAction.label}。请基于该买家档案，帮我起草本次跟进的话术与下一步执行计划。`;
    setChatInitialMessage(prompt);
    setActiveModule("业务专家");
  }, []);

  const handleOpenProfile = useCallback(() => {
    setActiveModule(null);
    setShowResults(false);
    setShowBoard(false);
    setShowMarket(false);
    setShowPartnerConfig(false);
    setShowProfile(true);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        onNewTask={() => {
          setShowPartnerConfig(false);
          setShowProfile(false);
          setShowResults(false);
          setShowBoard(false);
          setShowMarket(false);
          setActiveModule(null);
        }}
        onBoardClick={() => {
          setActiveModule(null);
          setShowPartnerConfig(false);
          setShowProfile(false);
          setShowResults(false);
          setShowMarket(false);
          setShowBoard(true);
        }}
        onPartnerClick={() => {
          setActiveModule(null);
          setShowResults(false);
          setShowBoard(false);
          setShowMarket(false);
          if (partnerConfigured) {
            setShowPartnerConfig(false);
            setShowProfile(true);
          } else {
            setShowProfile(false);
            setShowPartnerConfig(true);
          }
        }}
        onResultsClick={() => {
          setActiveModule(null);
          setShowPartnerConfig(false);
          setShowProfile(false);
          setShowBoard(false);
          setShowMarket(false);
          setShowResults(true);
          setActiveBuyerId(null);
        }}
        onMarketClick={() => {
          setActiveModule(null);
          setShowPartnerConfig(false);
          setShowProfile(false);
          setShowBoard(false);
          setShowResults(false);
          setShowMarket(true);
        }}
        onLogout={handleLogout}
        partnerConfigured={partnerConfigured}
        collapsed={!!activeModule || (showPartnerConfig && trainingStage !== "idle")}
        activeView={showBoard ? "board" : showResults ? "results" : showMarket ? "market" : "new"}
      />

      {activeModule ? (
        <ChatDetail
          moduleTitle={activeModule}
          onBack={() => setActiveModule(null)}
          initialUserMessage={chatInitialMessage}
        />
      ) : showProfile ? (
        <AIProfileDetail
          onTrySimilar={(prompt) => {
            setPrefillValue(prompt);
            setPrefillAttachment(undefined);
            setInputKey((k) => k + 1);
            setShowProfile(false);
          }}
        />
      ) : showBoard ? (
        <main className="flex-1 h-screen overflow-y-auto scrollbar-thin bg-background">
          <div className="mx-auto w-full max-w-5xl px-4 pb-10 pt-10 sm:px-6 lg:px-8">
            <section>
              <h1 className="text-2xl font-bold text-foreground">今日待办推荐</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                今日已为您搜集5条行业热品资讯，建议优先分析以下机会点。
              </p>
            </section>

            <section className="mt-7 rounded-2xl border border-border/70 bg-muted/30 opacity-75 backdrop-blur-sm">
              <div className="flex items-center gap-4 border-b border-border/60 px-5 py-4">
                <img
                  src={defaultProductBike}
                  alt="智能健身热品示例"
                  className="h-16 w-20 rounded-xl object-cover grayscale opacity-60"
                  loading="lazy"
                />
                <div>
                  <span className="text-xs font-semibold text-muted-foreground">今日主推热品</span>
                  <h2 className="mt-1 text-base font-bold text-muted-foreground">智能居家健身设备组合</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    低噪音、可折叠、APP训练计划，是今日更值得跟进的内容方向。
                  </p>
                </div>
              </div>
              <div className="divide-y divide-border/60">
                {boardNews.map((item, index) => (
                  <article
                    key={item.title}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-muted-foreground">{item.title}</h3>
                          <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                            {item.tag}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.copy}</p>
                      </div>
                    </div>
                    <button
                      disabled
                      className="shrink-0 cursor-not-allowed rounded-full bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground opacity-70"
                    >
                      立即分析
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </main>
      ) : showResults ? (
        activeBuyerId ? (
          <BuyerProfileDetail buyerId={activeBuyerId} onBack={() => setActiveBuyerId(null)} />
        ) : (
          <main className="ambient-bg relative flex-1 h-screen overflow-y-auto scrollbar-thin bg-background">
            <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-10 pt-10 sm:px-6 lg:px-8">
              <section className="opacity-0 animate-fade-up" style={{ animationDelay: "60ms" }}>
                <h1 className="text-2xl font-bold tracking-tight">
                  <span className="text-aurora">买家档案</span>
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  根据历史对话自动归档的业务资产，可随时溯源到原对话继续推进。
                </p>
              </section>
                <section
                  className="mt-6 space-y-4 opacity-0 animate-fade-up"
                  style={{ animationDelay: "220ms" }}
                >
                  {INQUIRY_BUYERS.map((buyer, idx) => {
                    const isExpanded = expandedBuyerId === buyer.id;
                    return (
                      <div
                        key={buyer.id}
                        className="hover-glow group relative overflow-hidden rounded-2xl border border-border/60 bg-card/85 backdrop-blur-sm shadow-card transition-all hover:border-primary/40 opacity-0 animate-fade-up"
                        style={{ animationDelay: `${260 + idx * 50}ms` }}
                      >
                        <span
                          aria-hidden
                          className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-aurora opacity-10 blur-2xl transition-opacity group-hover:opacity-25"
                        />
                        <div className="relative px-5 py-4 sm:px-6 sm:py-5">
                          <div className="flex items-start justify-between gap-3">
                            <button
                              onClick={() => setSheetBuyerId(buyer.id)}
                              className="group/title flex min-w-0 flex-1 items-center gap-2 text-left"
                            >
                              <p className="truncate text-[15px] font-semibold leading-snug text-foreground transition-colors group-hover/title:text-primary">
                                {buyer.company}
                              </p>
                              <span
                                className={cn(
                                  "shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-semibold",
                                  INQUIRY_STAGE_STYLES[buyer.stageTone],
                                )}
                              >
                                {buyer.stage}
                              </span>
                            </button>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12.5px] text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                              <Boxes className="h-3.5 w-3.5 text-primary/70" />
                              <span className="text-foreground/80">{buyer.products}</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <UserRound className="h-3.5 w-3.5 text-muted-foreground/70" />
                              {buyer.contact}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                              {buyer.region}
                            </span>
                          </div>

                          <div className="mt-3.5 flex items-start gap-2 rounded-lg border border-primary/15 bg-primary/[0.04] px-3 py-2">
                            <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                            <div className="min-w-0 flex-1 text-[12.5px]">
                              <span className="font-semibold text-primary">下次动作 · </span>
                              <span className="text-foreground/85">{buyer.nextAction.label}</span>
                            </div>
                            <button
                              onClick={() => handleDirectFollowup(buyer)}
                              className="ml-1 inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90"
                            >
                              <Sparkles className="h-2.5 w-2.5" />
                              立即跟进
                            </button>
                          </div>
                        </div>


                        {/* Collapsible analyses */}
                        {isExpanded && (
                          <div className="relative border-t border-border/60 bg-muted/30 px-5 py-3 animate-fade-in">
                            <ul className="space-y-1.5">
                              {buyer.analyses.map((a, i) => (
                                <li key={i}>
                                  <button
                                    onClick={() => setActiveBuyerId(buyer.id)}
                                    className="group/item flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-card/80"
                                  >
                                    <span className="flex min-w-0 items-center gap-2">
                                      <span className="inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                                      <span className="truncate text-[13px] text-foreground/85 group-hover/item:text-primary">
                                        {a.title}
                                      </span>
                                    </span>
                                    <span className="shrink-0 text-[11px] text-muted-foreground">{a.date}</span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </section>
            </div>
          </main>
        )
      ) : showMarket ? (
        <main className="ambient-bg ambient-bg-violet relative flex-1 h-screen overflow-y-auto scrollbar-thin bg-background">
          <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-10 pt-10 sm:px-6 lg:px-8">
            <section className="opacity-0 animate-fade-up" style={{ animationDelay: "60ms" }}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-card/80 px-2.5 py-1 text-[11px] font-medium text-primary backdrop-blur-sm">
                <Sparkles className="h-3 w-3 animate-pulse-soft" />
                技能市场　·　即将上线
              </span>
              <h1 className="mt-3 text-2xl font-bold tracking-tight">
                <span className="text-aurora">加新技能 · 招新专家</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                给现有 AI 专家加装技能包，或者从市场招进新角色 —— 立刻入职、立刻可用。
              </p>
            </section>

            {/* Skill packs for existing experts */}
            <section className="mt-7">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-foreground">为现有 AI 专家加装技能</h2>
                  <p className="mt-1 text-xs text-muted-foreground">每位专家都有可选技能包，按需开启。</p>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {[
                  {
                    avatar: businessAvatar,
                    name: "业务专家的可装技能",
                    role: "Buyer Follow-up AI",
                    installed: 2,
                    total: 3,
                    skills: [
                      { name: "信用证（LC）审单技能", desc: "自动识别 LC 软条款与不符点风险", installed: true },
                      { name: "RFQ 智能比价", desc: "对比同行近期报价，给出报价区间建议", installed: true },
                      { name: "买家情绪识别", desc: "从邮件语气判断买家紧迫度与议价空间", installed: false },
                    ],
                  },
                  {
                    avatar: operationAvatar,
                    name: "运营专家的可装技能",
                    role: "Product Ops AI",
                    installed: 2,
                    total: 3,
                    skills: [
                      { name: "Alibaba SEO 包", desc: "针对国际站算法的标题与关键词优化", installed: true },
                      { name: "AI 图片美化", desc: "一键去背景、补光、生成场景图", installed: true },
                      { name: "Amazon FBA Listing 包", desc: "适配亚马逊 A+ 页面与 ST 关键词", installed: false },
                    ],
                  },
                  {
                    avatar: trainingAvatar,
                    name: "培训专家的可装技能",
                    role: "Market Insight AI",
                    installed: 1,
                    total: 3,
                    skills: [
                      { name: "区域市场调研包", desc: "目标市场容量、竞品格局与合规要点全景", installed: true },
                      {
                        name: "海外社媒趋势监听",
                        desc: "TikTok / Reddit / YouTube 热点与需求信号采集",
                        installed: false,
                      },
                      { name: "买家需求挖掘", desc: "从公开数据与社媒发言中识别真实采购需求", installed: false },
                    ],
                  },
                ].map((expert, idx) => (
                  <article
                    key={expert.name}
                    className="hover-glow rounded-2xl border border-border/70 bg-card/85 p-5 backdrop-blur-sm shadow-card hover:border-primary/30 opacity-0 animate-fade-up"
                    style={{ animationDelay: `${140 + idx * 80}ms` }}
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-primary/20 bg-accent shadow-sm">
                          <span
                            aria-hidden
                            className="absolute -inset-1 -z-10 rounded-full bg-gradient-aurora opacity-30 blur-md"
                          />
                          <img
                            src={expert.avatar}
                            alt={expert.name}
                            className="h-full w-full object-cover object-top"
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground">{expert.name}</h3>
                          <p className="mt-0.5 text-xs font-medium text-primary/80">{expert.role}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        已装 {expert.installed} / {expert.total}
                      </span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {expert.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className={cn(
                            "rounded-xl border px-4 py-3.5 transition-all",
                            skill.installed
                              ? "border-border/60 bg-background/65"
                              : "border-primary/25 bg-gradient-soft hover:border-primary/40",
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-bold text-foreground">{skill.name}</p>
                            {skill.installed ? (
                              <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                已装
                              </span>
                            ) : (
                              <span className="shrink-0 inline-flex items-center gap-0.5 rounded-md bg-gradient-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground shadow-sm">
                                + 加装
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{skill.desc}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Hire new experts */}
            <section className="mt-8">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-foreground">雇佣新的 AI 专家</h2>
                  <p className="mt-1 text-xs text-muted-foreground">团队还缺角色？从这里招进来，立刻入职。</p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {[
                  {
                    avatar: leadsExpertAvatar,
                    name: "拓客专家 Frank",
                    role: "Lead Discovery AI",
                    desc: "深耕海关与贸易数据 6 年，擅长基于全球海关数据挖掘隐藏买家与高潜线索。",
                    tags: ["海关数据洞察", "买家线索挖掘", "竞品溯源"],
                    hot: true,
                  },
                  {
                    avatar: brandExpertAvatar,
                    name: "品牌专家 Eva",
                    role: "Brand Marketing AI",
                    desc: "8 年 DTC 品牌操盘经验，擅长品牌营销素材生产与社媒内容到询盘的高效转化。",
                    tags: ["品牌营销素材", "社媒内容转化", "KOL 合作"],
                    hot: false,
                  },
                ].map((hire, idx) => (
                  <article
                    key={hire.name}
                    className="hover-glow group relative overflow-hidden rounded-2xl border border-border/70 bg-card/85 p-5 backdrop-blur-sm shadow-card hover:border-primary/30 opacity-0 animate-fade-up"
                    style={{ animationDelay: `${380 + idx * 80}ms` }}
                  >
                    {hire.hot && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-accent-amber/25 blur-2xl"
                      />
                    )}
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-primary/20 bg-accent shadow-sm">
                        <span
                          aria-hidden
                          className="absolute -inset-1 -z-10 rounded-full bg-gradient-aurora opacity-30 blur-md"
                        />
                        <img
                          src={hire.avatar}
                          alt={hire.name}
                          loading="lazy"
                          width={512}
                          height={512}
                          className="h-full w-full object-cover object-top"
                        />
                      </div>
                      {hire.hot && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-accent-amber/30 bg-accent-amber/10 px-2 py-0.5 text-[10px] font-bold text-accent-amber">
                          🔥 HOT
                        </span>
                      )}
                    </div>
                    <h3 className="relative mt-3 text-sm font-bold text-foreground">{hire.name}</h3>
                    <p className="relative mt-0.5 text-xs font-medium text-primary/80">{hire.role}</p>
                    <p className="relative mt-3 text-xs leading-relaxed text-muted-foreground">{hire.desc}</p>
                    <div className="relative mt-3 flex flex-wrap gap-1.5">
                      {hire.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-muted/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      disabled
                      className="relative mt-4 w-full cursor-not-allowed rounded-xl border border-border bg-background/65 px-4 py-2.5 text-sm font-medium text-muted-foreground"
                    >
                      雇佣 {hire.name.split(" ").pop()}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </main>
      ) : showPartnerConfig ? (
        <main className="flex-1 h-screen overflow-y-auto scrollbar-thin bg-background">
          <div className="w-full px-4 sm:px-6 lg:px-8 pt-5 flex items-center justify-between gap-3">
            {trainingStage === "idle" ? (
              <button
                className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="历史任务"
              >
                <Clock className="h-5 w-5" />
              </button>
            ) : (
              <div className="h-11" />
            )}
            <div className="flex items-center justify-end gap-3">
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

          <div
            className={cn(
              "relative mx-auto flex w-full flex-col overflow-hidden px-4 pb-10 sm:px-6 lg:px-8",
              trainingStage === "idle"
                ? "min-h-[calc(100vh-64px)] max-w-4xl justify-center pt-6"
                : "max-w-7xl justify-start pt-8",
            )}
          >
            {/* Ambient glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/3 h-[360px] w-[580px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 bottom-16 h-[220px] w-[380px] -translate-x-1/2 rounded-full bg-secondary/20 blur-3xl"
            />

            {trainingStage === "idle" && (
              /* Unified card containing the entire flow */
              <div
                className="relative rounded-3xl border border-border/60 bg-card/70 p-8 shadow-xl shadow-primary/5 backdrop-blur-md sm:p-10 opacity-0 animate-fade-up"
                style={{ animationDelay: "60ms" }}
              >
                <section className="relative text-center">
                  <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-[36px]">
                    简单训练，
                    <span className="bg-gradient-to-r from-primary to-[hsl(174,100%,45%)] bg-clip-text text-transparent">
                      一键启动
                    </span>
                    专属AI团队
                  </h1>
                  <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                    3 位专家随时待命，把你的业务经验沉淀为可复用资产。
                  </p>
                </section>

                <section className="relative mt-8 grid gap-4 sm:grid-cols-3">
                  {archiveExperts.map((expert, index) => (
                    <article
                      key={expert.title}
                      className="group relative flex flex-col items-center rounded-2xl border border-border/60 bg-background/60 px-4 py-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-background/85 hover:shadow-md hover:shadow-primary/10 opacity-0 animate-fade-up"
                      style={{ animationDelay: `${140 + index * 70}ms` }}
                    >
                      <div className="relative">
                        <div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-br from-primary/30 to-[hsl(174,100%,45%)]/30 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-primary/20 bg-accent shadow-sm shadow-primary/15 ring-2 ring-primary/5">
                          <img
                            src={expert.avatar}
                            alt={expert.title}
                            className="h-full w-full object-cover object-top"
                            loading="lazy"
                          />
                        </div>
                      </div>
                      <h2 className="mt-3.5 text-base font-bold text-foreground">{expert.title}</h2>
                      <p className="mt-1 text-[13px] font-medium text-primary/80">{expert.tagline}</p>
                      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                        {expert.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-muted/70 px-2 py-0.5 text-xs font-medium text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </section>

                <div
                  className="relative mt-8 flex flex-col items-center gap-2.5 opacity-0 animate-fade-up"
                  style={{ animationDelay: "380ms" }}
                >
                  <button
                    onClick={() => setTrainingStage("form")}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-[hsl(217,100%,58%)] px-10 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.99]"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    />
                    <Sparkles className="h-[18px] w-[18px]" />
                    立即启动
                    <ArrowRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                  <p className="text-sm text-muted-foreground">仅需 2 分钟，启动后可随时调整</p>
                </div>
              </div>
            )}

            {(trainingStage === "form" || trainingStage === "training" || trainingStage === "result") && (
              <div className="relative opacity-0 animate-fade-up" style={{ animationDelay: "60ms" }}>
                <button
                  onClick={() => setTrainingStage("idle")}
                  className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  返回
                </button>

                <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                  {/* LEFT: Conversational materials capture */}
                  <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card/85 via-card/75 to-primary/5 p-6 shadow-xl shadow-primary/5 backdrop-blur-md sm:p-8">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-secondary/15 blur-3xl"
                    />

                    <div className="relative">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                        <Sparkles className="h-3.5 w-3.5" />
                        初始化培训
                      </span>
                      <h1 className="mt-3 text-2xl font-bold leading-snug tracking-tight text-foreground">
                        让 AI 团队读懂你的业务
                      </h1>
                    </div>

                    <div className="relative mt-6 space-y-3">
                      {/* Website — company URL & B2B showrooms */}
                      <div className="group rounded-2xl border border-border/50 bg-background/70 px-4 py-3 transition-all duration-200 focus-within:border-primary/50 focus-within:bg-background focus-within:shadow-md focus-within:shadow-primary/10">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <Globe className="h-3.5 w-3.5" />
                          企业官网
                        </div>
                        <input
                          value={trainingForm.website}
                          onChange={(e) => setTrainingForm({ ...trainingForm, website: e.target.value })}
                          disabled={trainingStage !== "form"}
                          placeholder="公司网址、阿里 / Made-in-China 等 B2B 平台展示厅链接"
                          className="mt-1 w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground placeholder:font-normal focus:outline-none disabled:opacity-70"
                        />
                      </div>

                      {/* File upload — taller tile with explicit button */}
                      <label
                        className={cn(
                          "group relative flex min-h-[200px] cursor-pointer flex-col gap-3 rounded-2xl border border-dashed border-border/60 bg-background/40 px-5 py-5 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5",
                          trainingStage !== "form" && "pointer-events-none opacity-70",
                        )}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <FileText className="h-3.5 w-3.5" />
                            业务文档
                          </div>
                          <div
                            className={cn(
                              "mt-1 truncate text-sm",
                              trainingForm.docName
                                ? "font-medium text-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            {trainingForm.docName || "企业介绍、产品图册、报价资料等，拖拽到此或点击上传"}
                          </div>
                        </div>
                        <div className="mt-auto flex items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            <FileUp className="h-3.5 w-3.5" />
                            上传文档
                          </span>
                          <span className="text-xs text-muted-foreground">
                            支持 PDF / Word / Excel / PPT
                          </span>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setTrainingForm({ ...trainingForm, docName: file.name });
                          }}
                        />
                      </label>
                    </div>

                    <div className="relative mt-6 space-y-2">
                      {trainingStage === "form" ? (
                        <>
                          <button
                            onClick={() => setTrainingStage("training")}
                            className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-[hsl(217,100%,58%)] px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99]"
                          >
                            <span
                              aria-hidden
                              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                            />
                            <Sparkles className="h-[18px] w-[18px]" />
                            开始训练
                            <ArrowRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                          </button>
                          <button
                            onClick={() => setTrainingStage("training")}
                            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full px-6 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                          >
                            跳过，直接启动
                          </button>
                        </>
                      ) : trainingStage === "training" ? (
                        <button
                          disabled
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-muted px-6 py-3 text-base font-semibold text-muted-foreground"
                        >
                          <Loader2 className="h-[18px] w-[18px] animate-spin" />
                          训练中…
                        </button>
                      ) : (
                        <button
                          onClick={() => setTrainingStage("form")}
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-border bg-background/70 px-5 py-3 text-base font-medium text-foreground hover:bg-accent transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                          调整素材重新训练
                        </button>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: Mind-flow process / structured result */}
                  <div className="relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card/85 via-card/75 to-secondary/5 p-6 shadow-xl shadow-primary/5 backdrop-blur-md sm:p-8">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-secondary/15 blur-3xl"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl"
                    />

                    {/* Unified header (matches left chip + title + subtitle) */}
                    <div className="relative">
                      {trainingStage === "form" && (
                        <>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                            <Sparkles className="h-3.5 w-3.5" />
                            等待启动
                          </span>
                          <h1 className="mt-3 text-2xl font-bold leading-snug tracking-tight text-foreground">
                            AI 学习与画像预览
                          </h1>
                        </>
                      )}
                      {trainingStage === "training" && (
                        <>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            学习中 · {trainingProgress}%
                          </span>
                          <h1 className="mt-3 text-2xl font-bold leading-snug tracking-tight text-foreground">
                            AI 团队正在理解你的业务
                          </h1>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                            实时心流，正在解析素材并构建画像。
                          </p>
                        </>
                      )}
                      {trainingStage === "result" && (
                        <>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                            <Check className="h-3.5 w-3.5" />
                            画像已建立
                          </span>
                          <h1 className="mt-3 text-2xl font-bold leading-snug tracking-tight text-foreground">
                            你的专属 AI 团队已就绪
                          </h1>
                        </>
                      )}
                    </div>

                    {/* Body — aligned to left's mt-6 spacing */}
                    <div className="relative mt-6 flex-1">
                      {(trainingStage === "form" || trainingStage === "training") && (() => {
                        const steps = [
                          { label: "AI 理解业务文档", at: 30 },
                          { label: "构建企业画像", at: 65 },
                          { label: "明确跟进目标", at: 95 },
                        ];
                        const isForm = trainingStage === "form";
                        return (
                          <div className="flex h-full flex-col space-y-3">
                            <div
                              className={cn(
                                "rounded-2xl border px-4 py-3.5 transition-colors",
                                isForm ? "border-border/40 bg-background/40" : "border-border/50 bg-background/70",
                              )}
                            >
                              <div className="h-2 overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(174,100%,45%)] transition-all duration-150 ease-out"
                                  style={{ width: `${isForm ? 0 : trainingProgress}%` }}
                                />
                              </div>
                            </div>
                            <ul className="space-y-2.5">
                              {steps.map((step) => {
                                const done = !isForm && trainingProgress >= step.at;
                                const active = !isForm && !done && trainingProgress >= step.at - 30;
                                return (
                                  <li
                                    key={step.label}
                                    className={cn(
                                      "flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm transition-colors",
                                      isForm
                                        ? "border-border/40 bg-background/40 opacity-60"
                                        : done
                                          ? "border-primary/20 bg-primary/5"
                                          : active
                                            ? "border-primary/30 bg-primary/5"
                                            : "border-border/50 bg-background/60",
                                    )}
                                  >
                                    {isForm ? (
                                      <div className="h-4 w-4 rounded-full border border-border/70 shrink-0" />
                                    ) : done ? (
                                      <Check className="h-4 w-4 text-primary shrink-0" />
                                    ) : active ? (
                                      <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                                    ) : (
                                      <div className="h-4 w-4 rounded-full border border-border shrink-0" />
                                    )}
                                    <span
                                      className={
                                        isForm
                                          ? "text-muted-foreground"
                                          : done || active
                                            ? "text-foreground font-medium"
                                            : "text-muted-foreground"
                                      }
                                    >
                                      {step.label}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                            {isForm && (
                              <p className="pt-1 text-center text-xs text-muted-foreground/80">
                                点击「开始训练」后，AI 将依次完成以上三步
                              </p>
                            )}
                            {!isForm && (
                              <div className="mt-auto pt-3 space-y-2">
                                <p className="text-center text-xs text-muted-foreground">
                                  无需等待，AI 将在后台持续学习
                                </p>
                                <button
                                  onClick={() => {
                                    setPartnerConfigured(true);
                                    setShowPartnerConfig(false);
                                    setTrainingStage("idle");
                                  }}
                                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-[hsl(217,100%,58%)] px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99]"
                                >
                                  <span
                                    aria-hidden
                                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                                  />
                                  进入工作台
                                  <ArrowRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {trainingStage === "result" && (
                        <div className="space-y-3">
                          {/* 1. 查看AI团队档案详情 */}
                          <button
                            type="button"
                            onClick={() => {
                              setPartnerConfigured(true);
                              setShowPartnerConfig(false);
                              setTrainingStage("idle");
                              setShowProfile(true);
                            }}
                            className="group w-full text-left rounded-2xl border border-border/50 bg-background/70 px-4 py-3 opacity-0 animate-fade-up transition-all hover:border-primary/40 hover:bg-background hover:shadow-md hover:shadow-primary/10"
                            style={{ animationDelay: "80ms" }}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Package className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-medium text-muted-foreground">AI 团队档案</div>
                                <div className="mt-0.5 text-sm font-medium text-foreground">查看 AI 团队档案详情</div>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                            </div>
                          </button>

                          {/* 3. AI团队跟进目标 — overlapping avatars */}
                          <article
                            className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 via-background/70 to-secondary/8 px-4 py-3 opacity-0 animate-fade-up"
                            style={{ animationDelay: "220ms" }}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="flex shrink-0 -space-x-2">
                                {[
                                  { name: "产品专家", avatar: operationAvatar },
                                  { name: "业务专家", avatar: businessAvatar },
                                  { name: "市场专家", avatar: trainingAvatar },
                                ].map((expert, i) => (
                                  <div
                                    key={expert.name}
                                    className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-card ring-1 ring-primary/20 transition-transform hover:z-10 hover:scale-110"
                                    style={{ zIndex: 3 - i }}
                                    title={expert.name}
                                  >
                                    <img
                                      src={expert.avatar}
                                      alt={expert.name}
                                      className="h-full w-full object-cover object-top"
                                      loading="lazy"
                                    />
                                  </div>
                                ))}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-medium text-muted-foreground">AI 团队跟进目标</div>
                                <div className="text-sm font-bold text-foreground">3 位专家协同推进</div>
                              </div>
                            </div>
                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                              {["提升询盘转化", "挖掘高潜买家", "卖点与详情优化", "渠道与机会拓展"].map((goal) => (
                                <span
                                  key={goal}
                                  className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-card/70 px-2.5 py-1 text-[13px] font-medium text-foreground/85"
                                >
                                  <span className="h-1 w-1 rounded-full bg-primary/70" />
                                  {goal}
                                </span>
                              ))}
                            </div>
                          </article>

                        </div>
                      )}
                    </div>

                    {trainingStage === "result" && (
                      <button
                        onClick={() => {
                          setPartnerConfigured(true);
                          setShowPartnerConfig(false);
                          setTrainingStage("idle");
                        }}
                        className="group relative mt-6 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-[hsl(217,100%,58%)] px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99]"
                      >
                        <span
                          aria-hidden
                          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                        />
                        进入工作台
                        <ArrowRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      ) : (
        <main className="ambient-bg relative flex-1 flex flex-col h-screen overflow-y-auto scrollbar-thin bg-background">
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-5 flex items-center justify-between gap-3">
            <button
              className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="历史任务"
            >
              <Clock className="h-5 w-5" />
            </button>
            <div className="flex items-center justify-end gap-3">
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

          <div className="relative z-10 flex-1 flex flex-col px-4 sm:px-6 lg:px-8 pb-5">
            <section
              className="mx-auto w-full max-w-5xl pt-12 text-center opacity-0 animate-fade-up"
              style={{ animationDelay: "80ms" }}
            >
              <h1 className="text-3xl md:text-[34px] font-bold leading-tight tracking-tight text-foreground">
                发起一个任务，让 <span className="text-aurora">AI 专家</span> 帮你推进
              </h1>
            </section>

            <div
              className="mx-auto mt-8 w-full max-w-3xl opacity-0 animate-fade-up"
              style={{ animationDelay: "180ms" }}
            >
              <div className="rounded-2xl border border-border/70 bg-card/85 backdrop-blur-sm shadow-lg shadow-primary/8 p-3.5">
                <textarea
                  key={inputKey}
                  value={prefillValue}
                  onChange={(e) => setPrefillValue(e.target.value)}
                  placeholder="告诉外贸 AI 专家你想做什么，例如：帮我分析一封来自巴西客户的询盘..."
                  rows={3}
                  className="w-full resize-none bg-transparent px-1 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <div className="mt-1 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      aria-label="添加附件"
                    >
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {selectedTaskTab.label}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const isBuyerBg = /深度?背景调查|买家背调|生成买家背调报告|深度背调|公司画像.*采购实力|背景调查.*风险/.test(prefillValue);
                      const isFollowup = /跟进策略|生成两版询盘回复邮件|节奏.*话术|话术.*下一步|跟进.*节奏|制定.*跟进/.test(prefillValue);
                      setChatInitialMessage(prefillValue);
                      setActiveModule(isBuyerBg || isFollowup ? "业务专家" : selectedModuleTitle);
                    }}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors"
                    aria-label="发送"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-base font-semibold text-muted-foreground">
                {TASK_TABS.map((tab) => (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTaskTab(tab.label)}
                    className={cn(
                      "inline-flex items-center gap-3 rounded-full border px-5 py-2.5 transition-colors",
                      activeTaskTab === tab.label
                        ? "border-border bg-card text-foreground shadow-sm"
                        : "border-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <span className="h-8 w-8 overflow-hidden rounded-full border border-primary/15 bg-accent shadow-sm">
                      <img
                        src={tab.avatar}
                        alt={tab.expert}
                        className="h-full w-full object-cover object-top"
                        loading="lazy"
                      />
                    </span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <section
              className="mx-auto mt-6 w-full max-w-5xl opacity-0 animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                AI专家建议行动：
              </p>
              <div
                className={cn(
                  "grid gap-4",
                  selectedTaskTab.label === "跟单成交"
                    ? "md:grid-cols-2 lg:grid-cols-4"
                    : "md:grid-cols-3",
                )}
              >
                {selectedTaskTab.steps.map((step) => {
                  const isProfileLink = step.title === "企业知识库" || step.title === "经验资产沉淀" || step.title === "企业知识画像" || step.title === "团队经验技巧";
                  const isPromptFill = step.title === "外贸问题解答";
                  const stepAny = step as { soon?: boolean; isNew?: boolean };
                  return (
                    <article
                      key={step.title}
                      onClick={
                        isProfileLink
                          ? handleOpenProfile
                          : isPromptFill
                            ? () => handleUseCasePrompt(step.prompt)
                            : undefined
                      }
                      className={cn(
                        "group relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm shadow-primary/3",
                        stepAny.soon && "bg-muted/40 opacity-75",
                        (isProfileLink || isPromptFill) &&
                          "cursor-pointer transition-all hover:border-primary/50 hover:shadow-md hover:shadow-primary/10",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-foreground">{step.title}</h2>
                        {stepAny.isNew && (
                          <span className="rounded-full bg-[hsl(0,90%,55%)] px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                            New
                          </span>
                        )}
                        {stepAny.soon && (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                            即将上线
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                      <div className="mt-4">
                        <StepPreview title={step.title} />
                      </div>
                      {!stepAny.soon && !isProfileLink && !isPromptFill && (
                        <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-center gap-2 bg-card/90 px-4 py-4 opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                          <button
                            onClick={() => {
                              setCasePrompt(step.prompt);
                              setCaseDialogOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            查看详情
                          </button>
                          <button
                            onClick={() => handleUseCasePrompt(step.prompt)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-card px-3 py-2 text-xs font-semibold text-primary hover:bg-accent transition-colors"
                          >
                            <Wand2 className="h-3.5 w-3.5" />
                            做同款
                          </button>
                        </div>
                      )}
                      {isProfileLink && (
                        <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          查看档案
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      )}
                      {isPromptFill && (
                        <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          填入提示词
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        </main>
      )}
      <TeamManagementDialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen} />
      <Sheet open={!!sheetBuyerId} onOpenChange={(o) => !o && setSheetBuyerId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-[480px] p-0 overflow-y-auto scrollbar-thin">
          {sheetBuyerId && (
            <BuyerProfileSheetContent
              stage={INQUIRY_BUYERS.find((b) => b.id === sheetBuyerId)?.stage ?? ""}
              updated={false}
              onClose={() => setSheetBuyerId(null)}
            />
          )}
        </SheetContent>
      </Sheet>
      <Dialog open={followupDialogOpen} onOpenChange={setFollowupDialogOpen}>
        <DialogContent className="flex max-h-[86vh] max-w-2xl flex-col gap-0 overflow-hidden rounded-2xl p-0">
          <DialogHeader className="shrink-0 border-b border-border/70 bg-card/95 px-6 py-4 text-left backdrop-blur-md">
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              买家跟进节点 · 优先跟进建议
            </DialogTitle>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              AI 已基于买家档案分析跟进进度，以下 3 位买家需要优先动作。
            </p>
          </DialogHeader>
          <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
            {INQUIRY_BUYERS.slice(0, 3).map((buyer, idx) => {
              const priority = ["高优", "中优", "常规"][idx] ?? "常规";
              const priorityClass = idx === 0
                ? "border-rose-500/30 bg-rose-500/10 text-rose-600"
                : idx === 1
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-600"
                  : "border-primary/30 bg-primary/10 text-primary";
              return (
                <div
                  key={buyer.id}
                  className="rounded-2xl border border-border/60 bg-card/85 px-4 py-3 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cn("rounded-full border px-2 py-0.5 text-[10.5px] font-semibold", priorityClass)}>
                          {priority}
                        </span>
                        <p className="truncate text-[14px] font-semibold text-foreground">{buyer.company}</p>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <UserRound className="h-3 w-3" />
                          {buyer.contact}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {buyer.region}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-primary/15 bg-primary/[0.04] px-3 py-2">
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1 text-[12.5px]">
                      <span className="font-semibold text-primary">下次动作 · </span>
                      <span className="text-foreground/85">{buyer.nextAction.label}</span>
                    </div>
                    <button
                      onClick={() => {
                        handleDirectFollowup(buyer);
                        setFollowupDialogOpen(false);
                      }}
                      className="ml-1 inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90"
                    >
                      <Sparkles className="h-3 w-3" />
                      立即跟进
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={caseDialogOpen} onOpenChange={setCaseDialogOpen}>
        <DialogContent className="flex max-h-[86vh] max-w-3xl flex-col gap-0 overflow-hidden rounded-2xl p-0">
          <DialogHeader className="shrink-0 border-b border-border/70 bg-card/95 px-6 py-4 text-left backdrop-blur-md">
            <DialogTitle className="text-base font-semibold text-foreground">询盘分析案例效果</DialogTitle>
          </DialogHeader>
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <section className="ml-auto max-w-[86%] rounded-2xl rounded-tr-md bg-muted px-4 py-3 text-sm leading-relaxed text-foreground">
              <p className="font-medium">用户发送的询盘</p>
              <p className="mt-2 whitespace-pre-line text-foreground/80">
                Subject: Looking for Artist Acrylic Paint and Brushes Hi, We are a mural studio in Canada and are
                looking for artist quality acrylic paint, paint brushes and related art accessories. Please send price,
                MOQ, lead time and sample policy. Best regards, Adrienne Turcotte
              </p>
            </section>
            <section className="max-w-[92%] rounded-2xl border border-border/70 bg-card/80 p-4">
              <InquiryResultMessage expertAvatar={businessAvatar} onSendPrompt={handleUseCasePrompt} />
            </section>
          </div>
          <div className="shrink-0 flex items-center justify-end gap-2 border-t border-border/70 bg-card/95 px-6 py-3 backdrop-blur-md">
            <button
              onClick={() => {
                if (casePrompt) handleUseCasePrompt(casePrompt);
                setCaseDialogOpen(false);
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90"
            >
              <Wand2 className="h-4 w-4" />
              做同款
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="max-w-xs rounded-2xl p-6 text-center">
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">添加企微专属客服</h3>
            <p className="text-sm text-muted-foreground">扫描下方二维码，添加专属客服了解更多权益</p>
            <img
              src={wechatServiceQr}
              alt="企微客服二维码"
              className="w-48 h-48 mx-auto rounded-lg"
              loading="lazy"
              width={192}
              height={192}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={imageGalleryProductId !== null} onOpenChange={(o) => !o && setImageGalleryProductId(null)}>
        <DialogContent className="flex max-h-[86vh] max-w-3xl flex-col gap-0 overflow-hidden rounded-2xl p-0">
          <DialogHeader className="shrink-0 border-b border-border/70 bg-card/95 px-6 py-4 text-left backdrop-blur-md">
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Image className="h-4 w-4 text-primary" />
              图片素材
              {imageGalleryProductId && (
                <span className="text-[12.5px] font-normal text-muted-foreground">
                  · {GENERATED_PRODUCTS.find((p) => p.id === imageGalleryProductId)?.name}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {imageGalleryProductId &&
              GENERATED_PRODUCTS.find((p) => p.id === imageGalleryProductId)?.imageGroups.map((group, gi) => (
                <div key={gi} className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      {group.type}
                    </span>
                    <span className="text-[12px] text-muted-foreground">生成时间：{group.createdAt}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {group.images.map((src, i) => (
                      <div
                        key={i}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-border/70 bg-muted/30"
                      >
                        <img
                          src={src}
                          alt={`${group.type} ${i + 1}`}
                          className="h-full w-full cursor-zoom-in object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                          onClick={() => setLightboxImage(src)}
                        />
                        <a
                          href={src}
                          download={`${group.type}-${group.createdAt.replace(/[/: ]/g, "-")}-${i + 1}.jpg`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/85 text-foreground/80 opacity-0 shadow-card backdrop-blur-sm transition-opacity hover:text-primary group-hover:opacity-100"
                          title="下载"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={bgReportBuyerId !== null} onOpenChange={(o) => !o && setBgReportBuyerId(null)}>
        <DialogContent className="flex max-h-[86vh] max-w-3xl flex-col gap-0 overflow-hidden rounded-2xl p-0">
          <DialogHeader className="shrink-0 border-b border-border/70 bg-card/95 px-6 py-4 text-left backdrop-blur-md">
            <div className="flex items-center justify-between gap-3 pr-8">
              <DialogTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                <FileSearch className="h-4 w-4 text-primary" />
                背调结果
                {bgReportBuyerId && (
                  <span className="text-[12.5px] font-normal text-muted-foreground">
                    · {INQUIRY_BUYERS.find((b) => b.id === bgReportBuyerId)?.company}
                  </span>
                )}
              </DialogTitle>
              <button
                onClick={handleDownloadBgReport}
                disabled={bgReportDownloading}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-3 py-1.5 text-[12px] font-semibold text-foreground/85 transition-all hover:border-primary/40 hover:bg-primary/[0.06] hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                {bgReportDownloading ? "生成中…" : "下载报告"}
              </button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div ref={bgReportRef} className="bg-background">
              <BuyerBackgroundReport />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={lightboxImage !== null} onOpenChange={(o) => !o && setLightboxImage(null)}>
        <DialogContent className="max-w-5xl border-none bg-transparent p-0 shadow-none">
          {lightboxImage && (
            <div className="relative">
              <img src={lightboxImage} alt="预览" className="max-h-[85vh] w-full rounded-2xl object-contain" />
              <a
                href={lightboxImage}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-[12px] font-semibold text-foreground shadow-card backdrop-blur-sm hover:text-primary"
              >
                <Download className="h-3.5 w-3.5" />
                下载
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>

  );
};

export default Index;
