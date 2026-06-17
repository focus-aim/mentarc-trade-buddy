import { useMemo, useState } from "react";
import {
  FileSpreadsheet,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Check,
  Download,
  Building2,
  Package,
  UserRound,
  Truck,
  Eye,
  Sparkles,
  Pencil,
} from "lucide-react";
import jsPDF from "jspdf";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

// ---------- Shared data ----------

export type QuoteTemplate = "company" | "business";

export const QUOTE_TEMPLATES: { id: QuoteTemplate; name: string; tagline: string }[] = [
  { id: "company", name: "公司展示型", tagline: "偏产品图册，适合展现公司品牌、产品和服务" },
  { id: "business", name: "商务标准版", tagline: "偏报价单表格，规范字段，便于报价审核" },
];

export interface QuoteInfo {
  productName: string;
  spec: string;
  unitPrice: string;
  qty: string;
  incoterm: string;
  leadTime: string;
  freight: string;
  payTerms: string;
  buyerCompany: string;
  buyerContact: string;
  buyerCountry: string;
  validUntil: string;
  qtyBasis: "moq" | "purchase";
}

export const DEFAULT_QUOTE_INFO: QuoteInfo = {
  productName: "5kW Hybrid Solar Inverter · UL1741 认证 · 含 WiFi 模块",
  spec: "UL1741 认证 / MPPT / 单相 / 含 WiFi 模块",
  unitPrice: "375",
  qty: "300",
  incoterm: "FOB",
  leadTime: "样品 5 天空运 / 量产 35 天",
  freight: "",
  payTerms: "30% T/T 预付，70% 见提单副本",
  buyerCompany: "TechSol US Renewable Distribution",
  buyerContact: "John Carter · Procurement Lead",
  buyerCountry: "美国 / 德州",
  validUntil: "2026-06-30",
  qtyBasis: "purchase",
};

// ---------- Step 1: confirm info ----------

// ---------- KB drawer: 公司实力 ----------

const STRENGTH_FIELDS: { label: string; value: string }[] = [
  { label: "公司名称", value: "宁波恒杯进出口有限公司" },
  { label: "公司官网", value: "https://www.example-trade.com" },
  {
    label: "公司简介",
    value: "成立于 2008 年，专注真空保温器皿研发与出口，累计服务全球 60+ 国家客户。",
  },
  {
    label: "产能与团队",
    value: "自有工厂 12,000㎡，注塑+焊接+喷涂全链；月产能 50 万 pcs，员工 280 人",
  },
  {
    label: "资质背书",
    value: "BSCI / SEDEX 工厂审核；FDA、LFGB、CE 认证；服务 Stanley、Contigo 等品牌",
  },
];

const STRENGTH_INSIGHTS = ["基础信息", "资质与实力", "客户案例", "售后与服务"];

const CompanyStrengthSheet = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-[520px]">
        <SheetHeader className="space-y-2 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10">
              <Building2 className="h-4.5 w-4.5" strokeWidth={2} />
            </div>
            <div className="min-w-0 text-left">
              <SheetTitle className="text-[16px] font-bold tracking-tight">公司实力</SheetTitle>
              <SheetDescription className="text-[12px] text-muted-foreground">
                公司背景、产能规模与资质背书 · 来自企业知识库
              </SheetDescription>
            </div>
            <span className="ml-auto inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 border border-emerald-500/20">
              掌握度 高
            </span>
          </div>
        </SheetHeader>

        <div className="mt-5 space-y-5">
          <div>
            <div className="text-[12px] font-semibold text-foreground mb-2">已沉淀信息</div>
            <div className="grid grid-cols-2 gap-1.5">
              {STRENGTH_INSIGHTS.map((it) => (
                <div
                  key={it}
                  className="inline-flex items-center gap-1.5 px-1 py-1 text-[12.5px] text-foreground/85"
                >
                  <Check className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={3} />
                  <span className="truncate">{it}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {STRENGTH_FIELDS.map((f) => (
              <div key={f.label} className="rounded-xl border border-border/60 bg-background/60 px-3 py-2.5">
                <div className="text-[11.5px] font-medium text-muted-foreground mb-1">{f.label}</div>
                <div className="text-[13px] text-foreground leading-relaxed">{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const QuoteConfirmStep = ({
  onNext,
  initialInfo,
  done,
  doneInfo,
  collapsible,
  onOpenTraining,
}: {
  onNext: (info: QuoteInfo) => void;
  initialInfo?: QuoteInfo;
  done?: boolean;
  doneInfo?: QuoteInfo;
  collapsible?: boolean;
  onOpenTraining?: () => void;
}) => {
  const [info, setInfo] = useState<QuoteInfo>(initialInfo || DEFAULT_QUOTE_INFO);
  const [collapsed, setCollapsed] = useState(false);
  const [kbOpen, setKbOpen] = useState(false);
  const display = done && doneInfo ? doneInfo : info;
  const incotermOptions = ["FOB", "EXW", "DDP"];

  return (
    <div className="rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-sm shadow-sm">
      <div className={`flex items-center justify-between px-4 py-3 ${collapsed ? "" : "border-b border-border/60"}`}>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/12 text-[11px] font-bold text-primary">1</span>
          <h4 className="text-[13.5px] font-semibold text-foreground">确认或补充关键信息（数据补漏）</h4>
        </div>
        <div className="flex items-center gap-2">
          {done && (
            <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-primary">
              <Check className="h-3.5 w-3.5" />
              已确认
            </span>
          )}
          {collapsible && (
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label={collapsed ? "展开" : "折叠"}
            >
              {collapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>
      {!collapsed && (
      <div className="px-4 py-3 space-y-3">
        <p className="text-[12.5px] text-muted-foreground leading-relaxed">
          以下信息已从知识库调取并自动填入，请<span className="text-foreground font-medium">确认或补充</span>缺失项。
        </p>
        <div className="space-y-2.5">
          {/* 买家名称 */}
          <div className="rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 flex items-center gap-3">
            <div className="flex items-center gap-1.5 w-[88px] shrink-0 text-[12px] font-semibold text-foreground">
              <UserRound className="h-3.5 w-3.5 text-primary" />
              买家名称
            </div>
            <input
              type="text"
              value={display.buyerCompany}
              disabled={done}
              onChange={(e) => setInfo({ ...info, buyerCompany: e.target.value })}
              className="flex-1 rounded-md border border-border/70 bg-background px-2 py-1.5 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:bg-muted/40 disabled:cursor-default"
            />
          </div>

          {/* 采购产品 */}
          <div className="rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 flex items-center gap-3">
            <div className="flex items-center gap-1.5 w-[88px] shrink-0 text-[12px] font-semibold text-foreground">
              <Package className="h-3.5 w-3.5 text-primary" />
              采购产品
            </div>
            <input
              type="text"
              value={display.productName}
              disabled={done}
              placeholder="产品名 + 基本要求"
              onChange={(e) => setInfo({ ...info, productName: e.target.value })}
              className="flex-1 rounded-md border border-border/70 bg-background px-2 py-1.5 text-[12px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:bg-muted/40 disabled:cursor-default truncate"
            />
          </div>


          {/* 我的公司和产品信息 */}
          <div className="rounded-xl border border-dashed border-primary/30 bg-primary/[0.04] px-3 py-2.5 flex items-center gap-3">
            <div className="flex items-center gap-1.5 w-[88px] shrink-0 text-[12px] font-semibold text-foreground">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              我的公司
            </div>
            <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
              <span className="text-[12px] text-muted-foreground truncate">
                公司知识库为空，补充后 AI 可自动调取公司与产品信息
              </span>
              <button
                type="button"
                onClick={() => (onOpenTraining ? onOpenTraining() : setKbOpen(true))}
                className="shrink-0 inline-flex items-center gap-0.5 rounded-md bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                去补充
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
        {!done && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => onNext(info)}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3.5 py-1.5 text-[12.5px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              下一步
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
      )}
      <CompanyStrengthSheet open={kbOpen} onOpenChange={setKbOpen} />
    </div>
  );
};

// ---------- Step 2: template select ----------

const TemplateThumb = ({ id }: { id: QuoteTemplate }) => {
  if (id === "company") {
    // 产品图册风格：顶部品牌条 + 大产品主图 + 缩略图行 + 卖点标签
    return (
      <div className="h-28 w-full rounded-lg bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-1.5 space-y-1 ring-1 ring-border/50">
        <div className="flex items-center gap-1.5 px-0.5">
          <div className="h-3 w-3 rounded-sm bg-primary/70" />
          <div className="h-1.5 w-14 rounded-full bg-foreground/35" />
          <div className="ml-auto h-1 w-8 rounded-full bg-foreground/15" />
        </div>
        <div className="relative h-14 w-full overflow-hidden rounded-md bg-gradient-to-br from-primary/25 via-primary/10 to-secondary/30 shadow-sm">
          <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-md bg-card/90 shadow ring-1 ring-primary/20" />
          <div className="absolute bottom-1 left-1 h-1 w-10 rounded-full bg-card/80" />
          <div className="absolute bottom-1 left-12 h-1 w-6 rounded-full bg-card/60" />
        </div>
        <div className="grid grid-cols-4 gap-1">
          <div className="h-5 rounded bg-card/90 shadow-sm ring-1 ring-border/50" />
          <div className="h-5 rounded bg-card/90 shadow-sm ring-1 ring-border/50" />
          <div className="h-5 rounded bg-card/90 shadow-sm ring-1 ring-border/50" />
          <div className="h-5 rounded bg-card/90 shadow-sm ring-1 ring-border/50" />
        </div>
        <div className="flex items-center gap-1 pt-0.5">
          <span className="h-1.5 w-8 rounded-full bg-primary/50" />
          <span className="h-1.5 w-6 rounded-full bg-secondary/70" />
          <span className="h-1.5 w-5 rounded-full bg-primary/30" />
        </div>
      </div>
    );
  }
  // 商务标准版：抬头 + 买卖双方区 + 规整报价表格 + 合计
  return (
    <div className="h-28 w-full rounded-lg bg-card border border-border/70 p-1.5 space-y-1 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="h-1.5 w-16 rounded-full bg-foreground/40" />
          <div className="h-1 w-10 rounded-full bg-foreground/15" />
        </div>
        <div className="h-4 w-8 rounded-sm bg-primary/20 ring-1 ring-primary/30" />
      </div>
      <div className="h-px bg-border/70" />
      <div className="grid grid-cols-2 gap-1 pt-0.5">
        <div className="space-y-0.5">
          <div className="h-1 w-10 rounded-full bg-foreground/25" />
          <div className="h-1 w-14 rounded-full bg-foreground/12" />
        </div>
        <div className="space-y-0.5">
          <div className="h-1 w-10 rounded-full bg-foreground/25" />
          <div className="h-1 w-14 rounded-full bg-foreground/12" />
        </div>
      </div>
      <div className="mt-1 rounded-sm border border-border/60 overflow-hidden">
        <div className="flex items-center gap-1 bg-primary/10 px-1 py-0.5">
          <div className="h-1 w-6 rounded-full bg-primary/60" />
          <div className="h-1 w-8 rounded-full bg-primary/40" />
          <div className="ml-auto h-1 w-5 rounded-full bg-primary/60" />
          <div className="h-1 w-6 rounded-full bg-primary/60" />
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-1 px-1 py-0.5 border-t border-border/40">
            <div className="h-1 w-6 rounded-full bg-foreground/20" />
            <div className="h-1 w-10 rounded-full bg-foreground/10" />
            <div className="ml-auto h-1 w-5 rounded-full bg-foreground/20" />
            <div className="h-1 w-6 rounded-full bg-foreground/25" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1 pt-0.5">
        <div className="h-1.5 w-8 rounded-full bg-foreground/25" />
        <div className="h-1.5 w-10 rounded-full bg-primary/50" />
      </div>
    </div>
  );
};

export const QuoteTemplateStep = ({
  onConfirm,
  done,
  selected,
  collapsible,
}: {
  onConfirm: (template: QuoteTemplate) => void;
  done?: boolean;
  selected?: QuoteTemplate | null;
  collapsible?: boolean;
}) => {
  const [picked, setPicked] = useState<QuoteTemplate>(selected || "business");
  const [collapsed, setCollapsed] = useState(false);
  const currentlySelected = done ? (selected as QuoteTemplate) : picked;

  return (
    <div className="rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-sm shadow-sm">
      <div className={`flex items-center justify-between px-4 py-3 ${collapsed ? "" : "border-b border-border/60"}`}>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/12 text-[11px] font-bold text-primary">2</span>
          <h4 className="text-[13.5px] font-semibold text-foreground">选择模板与排版预览</h4>
        </div>
        <div className="flex items-center gap-2">
          {done && (
            <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-primary">
              <Check className="h-3.5 w-3.5" />
              已确认
            </span>
          )}
          {collapsible && (
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label={collapsed ? "展开" : "折叠"}
            >
              {collapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>
      {!collapsed && (
      <div className="px-4 py-3 space-y-3">
        <div className="grid grid-cols-2 gap-2.5">
          {QUOTE_TEMPLATES.map((t) => {
            const active = currentlySelected === t.id;
            return (
              <button
                key={t.id}
                onClick={() => !done && setPicked(t.id)}
                disabled={done}
                className={`text-left rounded-xl border p-2.5 transition-all flex flex-col gap-2 ${
                  active
                    ? "border-primary/60 bg-primary/[0.06] ring-1 ring-primary/30"
                    : "border-border/60 bg-background/50 hover:border-primary/30 hover:bg-primary/[0.03]"
                } disabled:cursor-default`}
              >
                <div className="w-full">
                  <TemplateThumb id={t.id} />
                </div>
                <div className="min-w-0 w-full">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-semibold text-foreground">{t.name}</span>
                    {active && <Check className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground leading-relaxed">{t.tagline}</p>
                </div>
              </button>
            );
          })}
        </div>
        {!done && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => onConfirm(picked)}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3.5 py-1.5 text-[12.5px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              开始生成
            </button>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

// ---------- Result card + full dialog ----------

const QuotationPreview = ({
  info,
  items,
  subtotal,
  freight,
  grand,
  size = "full",
}: {
  info: QuoteInfo;
  items: { name: string; qty: number; unit: number; total: number }[];
  subtotal: number;
  freight: number;
  grand: number;
  size?: "thumb" | "full";
}) => {
  const compact = size === "thumb";
  const main = items[items.length - 1];
  const buyerFirst = info.buyerCompany.split(/[ ,.]/)[0] || "Buyer";
  const kpis = [
    { label: "数量", value: `${main.qty.toLocaleString()} pcs` },
    { label: "单价", value: `$${Number(info.unitPrice).toLocaleString()}` },
    { label: "交期", value: info.leadTime.split(/[/\s]/)[0] || "—" },
    { label: "合计", value: `$${grand.toLocaleString()}` },
  ];

  return (
    <div
      className={`bg-white border border-border/70 shadow-sm ${
        compact ? "rounded-md p-3" : "rounded-xl p-7"
      }`}
      style={{ fontFamily: "ui-sans-serif, system-ui" }}
    >
      {/* Top header row */}
      <div className="flex items-start justify-between">
        <div
          className={`tracking-[0.18em] font-semibold text-neutral-500 ${
            compact ? "text-[7px]" : "text-[11px]"
          }`}
        >
          QUOTATION
        </div>
        <div
          className={`font-extrabold tracking-wide ${
            compact ? "text-[9px]" : "text-[16px]"
          }`}
          style={{ color: "#D7261E" }}
        >
          MENTARC
        </div>
      </div>

      {/* Title */}
      <h1
        className={`font-extrabold text-neutral-900 leading-tight ${
          compact ? "text-[12px] mt-1.5" : "text-[26px] mt-3"
        }`}
      >
        Quotation for {buyerFirst}
      </h1>
      <div
        className={compact ? "mt-1 h-[1.5px] w-10" : "mt-2 h-[2px] w-20"}
        style={{ backgroundColor: "#D7261E" }}
      />

      {/* Body two-column */}
      <div className={`grid grid-cols-5 ${compact ? "gap-2 mt-2" : "gap-5 mt-5"}`}>
        {/* Left: paragraphs */}
        <div className={`col-span-3 text-neutral-700 ${compact ? "text-[7px] leading-snug space-y-1" : "text-[12px] leading-relaxed space-y-2.5"}`}>
          <p>
            <span className="font-semibold text-neutral-900">Mentarc Trading Co., Ltd.</span> 很荣幸为
            <span className="font-semibold text-neutral-900"> {info.buyerCompany}</span> 提供
            <span className="font-semibold text-neutral-900"> {info.productName}</span> 的正式报价。
            本次报价基于双方前期沟通的产品规格与采购量，{info.spec}。
          </p>
          <p>
            报价采用 {info.incoterm} 贸易术语，{info.payTerms}。
            {info.qtyBasis === "moq" ? "数量按 MOQ 计算，" : "数量按采购量计算，"}
            交期：{info.leadTime}。如需调整规格、追加 SKU 或议定其他付款方式，欢迎在有效期内回复确认。
          </p>
          {!compact && (
            <p>
              我司已通过 BSCI / SEDEX 工厂审核及 FDA、LFGB、CE 认证，月产能 50 万 pcs，能稳定支持北美与欧洲渠道的持续补货。
              欢迎安排样品确认与现场验厂。
            </p>
          )}
        </div>

        {/* Right: info boxes */}
        <div className={`col-span-2 ${compact ? "space-y-1" : "space-y-2"}`}>
          {[
            { title: "Buyer Info", body: `${info.buyerCompany} · ${info.buyerContact} · ${info.buyerCountry}` },
            { title: "Trade Terms", body: `${info.incoterm} · ${info.payTerms}` },
            { title: "Validity", body: `有效期至 ${info.validUntil}` },
          ].map((b) => (
            <div
              key={b.title}
              className={`bg-neutral-50 border-l-2 ${compact ? "px-1.5 py-1" : "px-3 py-2.5"}`}
              style={{ borderLeftColor: "#D7261E" }}
            >
              <div
                className={`font-bold text-neutral-900 ${compact ? "text-[7.5px]" : "text-[12.5px]"}`}
              >
                {b.title}
              </div>
              <div
                className={`text-neutral-600 ${compact ? "text-[6.5px] leading-tight mt-0.5" : "text-[11px] leading-snug mt-1"}`}
              >
                {b.body}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI tiles */}
      <div className={`grid grid-cols-4 ${compact ? "gap-1 mt-2" : "gap-2.5 mt-5"}`}>
        {kpis.map((k) => (
          <div
            key={k.label}
            className={compact ? "px-1.5 py-1 text-white" : "px-3 py-2.5 text-white"}
            style={{ backgroundColor: "#D7261E" }}
          >
            <div className={`font-extrabold leading-tight ${compact ? "text-[9px]" : "text-[18px]"}`}>
              {k.value}
            </div>
            <div className={`opacity-90 ${compact ? "text-[6px]" : "text-[10px]"}`}>{k.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const QuoteResultCard = ({
  template,
  info,
}: {
  template: QuoteTemplate;
  info: QuoteInfo;
}) => {
  const [open, setOpen] = useState(false);

  const templateMeta = QUOTE_TEMPLATES.find((t) => t.id === template) || QUOTE_TEMPLATES[1];

  const items = useMemo(() => {
    const unit = Number(info.unitPrice) || 0;
    const baseQty = Number(info.qty) || 0;
    const moq = 100;
    const qty = info.qtyBasis === "moq" ? moq : baseQty;
    const sample = { name: "Sample (空运)", qty: 1, unit: 420, total: 420 };
    const main = { name: info.productName, qty, unit, total: unit * qty };
    return [sample, main];
  }, [info]);

  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const freight = Number(info.freight) || 0;
  const grand = subtotal + freight;

  const fileBase = `Quotation_${info.buyerCompany.split(" ")[0] || "Buyer"}`;

  const downloadPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 48;
    let y = margin;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(215, 38, 30);
    doc.setFontSize(14);
    doc.text("MENTARC", 595 - margin, y, { align: "right" });
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("QUOTATION", margin, y);
    y += 28;
    doc.setFontSize(20);
    doc.setTextColor(20);
    doc.text(`Quotation for ${info.buyerCompany.split(/[ ,.]/)[0]}`, margin, y);
    y += 6;
    doc.setDrawColor(215, 38, 30);
    doc.setLineWidth(1.5);
    doc.line(margin, y, margin + 60, y);
    y += 22;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60);
    const paras = [
      `Buyer: ${info.buyerCompany}  (${info.buyerContact}, ${info.buyerCountry})`,
      `Product: ${info.productName}`,
      `Specification: ${info.spec}`,
      `Incoterm: ${info.incoterm}    Payment: ${info.payTerms}`,
      `Lead Time: ${info.leadTime}`,
      `Validity: ${info.validUntil}`,
    ];
    paras.forEach((p) => {
      const lines = doc.splitTextToSize(p, 595 - margin * 2);
      doc.text(lines, margin, y);
      y += lines.length * 14 + 4;
    });
    y += 10;
    doc.setDrawColor(220);
    doc.line(margin, y, 595 - margin, y);
    y += 18;
    doc.setFont("helvetica", "bold");
    doc.text("Items", margin, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    items.forEach((it, idx) => {
      doc.text(
        `${idx + 1}. ${it.name}  ×${it.qty}  @ $${it.unit}  =  $${it.total.toLocaleString()}`,
        margin,
        y
      );
      y += 14;
    });
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(215, 38, 30);
    doc.text(`Grand Total:  $${grand.toLocaleString()} USD`, margin, y);
    doc.save(`${fileBase}.pdf`);
  };

  const downloadWord = () => {
    const rowsHtml = items
      .map(
        (it, i) => `
      <tr>
        <td style="border:1px solid #ccc;padding:6px 10px;">${i + 1}</td>
        <td style="border:1px solid #ccc;padding:6px 10px;">${it.name}</td>
        <td style="border:1px solid #ccc;padding:6px 10px;text-align:right;">${it.qty}</td>
        <td style="border:1px solid #ccc;padding:6px 10px;text-align:right;">$${it.unit}</td>
        <td style="border:1px solid #ccc;padding:6px 10px;text-align:right;">$${it.total.toLocaleString()}</td>
      </tr>`
      )
      .join("");
    const html = `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Quotation</title></head><body style="font-family:Arial,sans-serif;color:#222;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:11px;letter-spacing:2px;color:#777;">QUOTATION</div>
        <div style="font-size:18px;font-weight:bold;color:#D7261E;letter-spacing:1px;">MENTARC</div>
      </div>
      <h1 style="font-size:26px;margin:14px 0 4px 0;">Quotation for ${info.buyerCompany.split(/[ ,.]/)[0]}</h1>
      <div style="height:2px;width:60px;background:#D7261E;margin-bottom:18px;"></div>
      <p><b>Buyer:</b> ${info.buyerCompany} — ${info.buyerContact} — ${info.buyerCountry}</p>
      <p><b>Product:</b> ${info.productName}</p>
      <p><b>Specification:</b> ${info.spec}</p>
      <p><b>Incoterm:</b> ${info.incoterm}　<b>Payment:</b> ${info.payTerms}</p>
      <p><b>Lead Time:</b> ${info.leadTime}　<b>Validity:</b> ${info.validUntil}</p>
      <table style="border-collapse:collapse;width:100%;margin-top:14px;font-size:13px;">
        <thead><tr style="background:#f5f5f5;">
          <th style="border:1px solid #ccc;padding:6px 10px;text-align:left;">No.</th>
          <th style="border:1px solid #ccc;padding:6px 10px;text-align:left;">Product</th>
          <th style="border:1px solid #ccc;padding:6px 10px;text-align:right;">Qty</th>
          <th style="border:1px solid #ccc;padding:6px 10px;text-align:right;">Unit (USD)</th>
          <th style="border:1px solid #ccc;padding:6px 10px;text-align:right;">Total (USD)</th>
        </tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      <p style="margin-top:18px;font-size:16px;color:#D7261E;"><b>Grand Total: $${grand.toLocaleString()} USD</b></p>
      </body></html>`;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileBase}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-[13.5px] font-semibold text-foreground truncate">
                报价单已生成 · {templateMeta.name}
              </h4>
            </div>
          </div>
        </div>
        <div className="px-4 py-3">
          <QuotationPreview
            info={info}
            items={items}
            subtotal={subtotal}
            freight={freight}
            grand={grand}
            size="thumb"
          />
        </div>
        <div className="px-4 pb-3 flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-card px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            查看报价单
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                <Download className="h-3.5 w-3.5" />
                下载
                <ChevronDown className="h-3 w-3 ml-0.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              <DropdownMenuItem onClick={downloadPDF}>下载为 PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={downloadWord}>下载为 Word</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-muted/40">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
              报价单预览 · {templateMeta.name}
            </DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            <QuotationPreview
              info={info}
              items={items}
              subtotal={subtotal}
              freight={freight}
              grand={grand}
              size="full"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={downloadPDF}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-4 py-2 text-[12.5px] font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Download className="h-4 w-4" />
                下载 PDF
              </button>
              <button
                onClick={downloadWord}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[12.5px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Download className="h-4 w-4" />
                下载 Word
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const QUOTE_GEN_PROMPT = "生成报价单";
export const isQuoteGenPrompt = (text?: string) => !!text && /生成.*报价单|报价单生成/.test(text);

// Silence unused import warning in some build configs
void Pencil;

// ---------- Combined Wizard (Step 1 + Step 2 in one card) ----------

export const QuoteWizard = ({
  onComplete,
  initialInfo,
  initialTemplate,
  onOpenTraining,
}: {
  onComplete: (info: QuoteInfo, template: QuoteTemplate) => void;
  initialInfo?: QuoteInfo;
  initialTemplate?: QuoteTemplate;
  onOpenTraining?: () => void;
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [collapsed, setCollapsed] = useState(false);
  const [info, setInfo] = useState<QuoteInfo>(initialInfo || DEFAULT_QUOTE_INFO);
  const [picked, setPicked] = useState<QuoteTemplate>(initialTemplate || "business");
  const [kbOpen, setKbOpen] = useState(false);
  const incotermOptions = ["FOB", "EXW", "DDP"];

  return (
    <div className="rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-sm shadow-sm">
      {/* Header with step indicator */}
      <div className={`flex items-center justify-between px-4 py-3 ${collapsed ? "" : "border-b border-border/60"}`}>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${step === 1 ? "bg-primary text-primary-foreground" : "bg-primary/12 text-primary"}`}>
              {step > 1 ? <Check className="h-3.5 w-3.5" /> : "1"}
            </span>
            <span className={`text-[12.5px] font-medium ${step === 1 ? "text-foreground" : "text-muted-foreground"}`}>确认关键信息</span>
          </div>
          <span className="h-px w-5 bg-border" />
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>2</span>
            <span className={`text-[12.5px] font-medium ${step === 2 ? "text-foreground" : "text-muted-foreground"}`}>选择模板</span>
          </div>
        </div>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label={collapsed ? "展开" : "折叠"}
        >
          {collapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </button>
      </div>

      {!collapsed && step === 1 && (
        <div className="px-4 py-3 space-y-3">
          <p className="text-[12.5px] text-muted-foreground leading-relaxed">
            以下信息已从知识库调取并自动填入，请<span className="text-foreground font-medium">确认或补充</span>缺失项。
          </p>
          <div className="space-y-2.5">
            {/* 买家名称 */}
            <div className="rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 flex items-center gap-3">
              <div className="flex items-center gap-1.5 w-[88px] shrink-0 text-[12px] font-semibold text-foreground">
                <UserRound className="h-3.5 w-3.5 text-primary" />
                买家名称
              </div>
              <input
                type="text"
                value={info.buyerCompany}
                onChange={(e) => setInfo({ ...info, buyerCompany: e.target.value })}
                className="flex-1 rounded-md border border-border/70 bg-background px-2 py-1.5 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>
            {/* 采购产品 */}
            <div className="rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 flex items-center gap-3">
              <div className="flex items-center gap-1.5 w-[88px] shrink-0 text-[12px] font-semibold text-foreground">
                <Package className="h-3.5 w-3.5 text-primary" />
                采购产品
              </div>
              <input
                type="text"
                value={info.productName}
                placeholder="产品名 + 基本要求"
                onChange={(e) => setInfo({ ...info, productName: e.target.value })}
                className="flex-1 rounded-md border border-border/70 bg-background px-2 py-1.5 text-[12px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40 truncate"
              />
            </div>
            {/* 我的公司 */}
            <div className="rounded-xl border border-dashed border-primary/30 bg-primary/[0.04] px-3 py-2.5 flex items-center gap-3">
              <div className="flex items-center gap-1.5 w-[88px] shrink-0 text-[12px] font-semibold text-foreground">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                我的公司
              </div>
              <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                <span className="text-[12px] text-muted-foreground truncate">
                  公司知识库为空，补充后 AI 可自动调取公司与产品信息
                </span>
                <button
                  type="button"
                  onClick={() => (onOpenTraining ? onOpenTraining() : setKbOpen(true))}
                  className="shrink-0 inline-flex items-center gap-0.5 rounded-md bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  去补充
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3.5 py-1.5 text-[12.5px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              下一步
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {!collapsed && step === 2 && (
        <div className="px-4 py-3 space-y-3">
          <p className="text-[12.5px] text-muted-foreground leading-relaxed">
            选择一个排版样式，AI 将按所选模板生成报价单。
          </p>
          <div className="grid gap-2.5 md:grid-cols-3">
            {QUOTE_TEMPLATES.map((t) => {
              const active = picked === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setPicked(t.id)}
                  className={`text-left rounded-xl border p-2.5 transition-all ${
                    active
                      ? "border-primary/60 bg-primary/[0.06] ring-1 ring-primary/30"
                      : "border-border/60 bg-background/50 hover:border-primary/30 hover:bg-primary/[0.03]"
                  }`}
                >
                  <TemplateThumb id={t.id} />
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="text-[12.5px] font-semibold text-foreground">{t.name}</span>
                    {active && <Check className="h-3 w-3 text-primary" />}
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">{t.tagline}</p>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-card px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              上一步
            </button>
            <button
              onClick={() => onComplete(info, picked)}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3.5 py-1.5 text-[12.5px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              开始生成
            </button>
          </div>
        </div>
      )}

      <CompanyStrengthSheet open={kbOpen} onOpenChange={setKbOpen} />
    </div>
  );
};

// ---------- User-side long info card (sent to chat on 开始生成) ----------

export const QuoteSummaryCard = ({
  info,
  template,
}: {
  info: QuoteInfo;
  template: QuoteTemplate;
}) => {
  const tpl = QUOTE_TEMPLATES.find((t) => t.id === template) || QUOTE_TEMPLATES[1];
  return (
    <div className="w-full rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/[0.08] via-primary/[0.04] to-secondary/[0.08] backdrop-blur-sm shadow-sm">
      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="text-[12.5px] font-semibold text-foreground">报价单信息已提交</span>
        </div>
        <dl className="mt-2 space-y-1 pl-8 text-[12px]">
          <div className="flex gap-2">
            <dt className="w-[72px] shrink-0 text-muted-foreground">买家公司</dt>
            <dd className="flex-1 text-foreground">{info.buyerCompany}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-[72px] shrink-0 text-muted-foreground">采购产品</dt>
            <dd className="flex-1 text-foreground">{info.productName}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-[72px] shrink-0 text-muted-foreground">报价单类型</dt>
            <dd className="flex-1 text-foreground">{tpl.name}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};