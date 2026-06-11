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
import * as XLSX from "xlsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
}: {
  onNext: (info: QuoteInfo) => void;
  initialInfo?: QuoteInfo;
  done?: boolean;
  doneInfo?: QuoteInfo;
  collapsible?: boolean;
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
          <div className="rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 flex items-center gap-3">
            <div className="flex items-center gap-1.5 w-[88px] shrink-0 text-[12px] font-semibold text-foreground">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              我的公司
            </div>
            <div className="flex-1 text-[12px] text-foreground/80 truncate">
              我的公司和产品信息
              <button
                type="button"
                onClick={() => setKbOpen(true)}
                className="ml-1.5 inline-flex items-center gap-0.5 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10.5px] font-medium text-primary hover:bg-primary/15 transition-colors"
              >
                已从知识库调取
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

  const downloadExcel = () => {
    const rows: (string | number)[][] = [
      ["Quotation / 报价单"],
      [`Template: ${templateMeta.name}`],
      [],
      ["Buyer", info.buyerCompany],
      ["Contact", info.buyerContact],
      ["Country", info.buyerCountry],
      ["Valid Until", info.validUntil],
      [],
      ["No.", "Product", "Spec", "Qty", "Unit Price (USD)", "Total (USD)"],
      [1, items[0].name, "Air sample", items[0].qty, items[0].unit, items[0].total],
      [2, items[1].name, info.spec, items[1].qty, items[1].unit, items[1].total],
      [],
      ["Subtotal", "", "", "", "", subtotal],
      ["Freight (Est.)", "", "", "", "", freight],
      ["Grand Total", "", "", "", "", grand],
      [],
      ["Incoterms", info.incoterm],
      ["Lead Time", info.leadTime],
      ["Payment", info.payTerms],
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [{ wch: 16 }, { wch: 30 }, { wch: 28 }, { wch: 8 }, { wch: 16 }, { wch: 14 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Quotation");
    XLSX.writeFile(wb, `Quotation_${info.buyerCompany.split(" ")[0] || "Buyer"}.xlsx`);
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
            <p className="text-[11.5px] text-muted-foreground truncate">
              &nbsp;
            </p>
          </div>
        </div>
        <div className="px-4 py-3">
          <div className="rounded-xl border border-border/60 bg-background/60 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">产品</span>
              <span className="text-[12.5px] font-medium text-foreground">{info.productName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">数量 × 单价</span>
              <span className="text-[12.5px] font-medium text-foreground">
                {items[1].qty} pcs{info.qtyBasis === "moq" ? "（MOQ）" : "（采购量）"} × ${info.unitPrice}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">贸易术语</span>
              <span className="text-[12.5px] text-foreground">{info.incoterm}</span>
            </div>
            <div className="border-t border-border/60 pt-2 flex items-center justify-between">
              <span className="text-[12px] font-medium text-foreground">合计 (USD)</span>
              <span className="text-[15px] font-bold text-primary">${grand.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-3 flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-card px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            查看完整报价单
          </button>
          <button
            onClick={downloadExcel}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            下载 Excel
          </button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
              完整报价单 · {templateMeta.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="rounded-xl border border-border/70 bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    供应商
                  </div>
                  <div className="mt-0.5 text-[14px] font-semibold text-foreground">Mentarc Trading Co., Ltd.</div>
                  <div className="text-[11.5px] text-muted-foreground">Shanghai, China · sales@mentarc.com</div>
                </div>
                <div className="text-right">
                  <div className="text-[11.5px] text-muted-foreground">Quotation No.</div>
                  <div className="text-[13px] font-semibold text-foreground">PI-{new Date().getFullYear()}-0428</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">有效期：{info.validUntil}</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-[12px]">
                <div className="rounded-lg bg-muted/40 p-2.5">
                  <div className="text-muted-foreground mb-1">买家</div>
                  <div className="font-medium text-foreground">{info.buyerCompany}</div>
                  <div className="text-muted-foreground">{info.buyerContact}</div>
                  <div className="text-muted-foreground">{info.buyerCountry}</div>
                </div>
                <div className="rounded-lg bg-muted/40 p-2.5">
                  <div className="text-muted-foreground mb-1">条款</div>
                  <div className="text-foreground">{info.incoterm}</div>
                  <div className="text-foreground">{info.payTerms}</div>
                  <div className="text-foreground">{info.leadTime}</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/70 overflow-hidden">
              <table className="w-full text-[12.5px]">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium">No.</th>
                    <th className="text-left px-3 py-2 font-medium">Product</th>
                    <th className="text-left px-3 py-2 font-medium">Spec</th>
                    <th className="text-right px-3 py-2 font-medium">Qty</th>
                    <th className="text-right px-3 py-2 font-medium">Unit (USD)</th>
                    <th className="text-right px-3 py-2 font-medium">Total (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border/60">
                    <td className="px-3 py-2">1</td>
                    <td className="px-3 py-2">{items[0].name}</td>
                    <td className="px-3 py-2 text-muted-foreground">Air sample</td>
                    <td className="px-3 py-2 text-right">{items[0].qty}</td>
                    <td className="px-3 py-2 text-right">${items[0].unit}</td>
                    <td className="px-3 py-2 text-right">${items[0].total}</td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <td className="px-3 py-2">2</td>
                    <td className="px-3 py-2">{items[1].name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{info.spec}</td>
                    <td className="px-3 py-2 text-right">{items[1].qty}</td>
                    <td className="px-3 py-2 text-right">${items[1].unit}</td>
                    <td className="px-3 py-2 text-right">${items[1].total.toLocaleString()}</td>
                  </tr>
                  <tr className="border-t border-border/60 bg-muted/30">
                    <td colSpan={5} className="px-3 py-2 text-right text-muted-foreground">Subtotal</td>
                    <td className="px-3 py-2 text-right">${subtotal.toLocaleString()}</td>
                  </tr>
                  <tr className="border-t border-border/60 bg-muted/30">
                    <td colSpan={5} className="px-3 py-2 text-right text-muted-foreground">Freight (Est.)</td>
                    <td className="px-3 py-2 text-right">${freight.toLocaleString()}</td>
                  </tr>
                  <tr className="border-t border-border/60 bg-primary/[0.06]">
                    <td colSpan={5} className="px-3 py-2 text-right font-semibold text-foreground">Grand Total</td>
                    <td className="px-3 py-2 text-right font-bold text-primary">${grand.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-border/70 bg-muted/30 p-3 text-[12px] text-muted-foreground leading-relaxed">
              <div className="font-medium text-foreground mb-1">Remarks</div>
              本报价基于当前 UL1741 合规版本，含一年质保。运费为预估值，最终以指定货代为准。如需修改条款或追加 SKU，请回复本邮件。
            </div>

            <div className="flex justify-end">
              <button
                onClick={downloadExcel}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[12.5px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Download className="h-4 w-4" />
                下载为 Excel
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
}: {
  onComplete: (info: QuoteInfo, template: QuoteTemplate) => void;
  initialInfo?: QuoteInfo;
  initialTemplate?: QuoteTemplate;
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
            <div className="rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 flex items-center gap-3">
              <div className="flex items-center gap-1.5 w-[88px] shrink-0 text-[12px] font-semibold text-foreground">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                我的公司
              </div>
              <div className="flex-1 text-[12px] text-foreground/80 truncate">
                我的公司和产品信息
                <button
                  type="button"
                  onClick={() => setKbOpen(true)}
                  className="ml-1.5 inline-flex items-center gap-0.5 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10.5px] font-medium text-primary hover:bg-primary/15 transition-colors"
                >
                  已从知识库调取
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
  const items: { icon: typeof UserRound; label: string; value: string }[] = [
    { icon: UserRound, label: "买家", value: info.buyerCompany },
    { icon: Package, label: "产品", value: info.productName },
    {
      icon: Truck,
      label: "参数",
      value: `${info.incoterm} · ${info.qtyBasis === "moq" ? "按 MOQ" : "按采购量"}`,
    },
    { icon: FileSpreadsheet, label: "模板", value: tpl.name },
  ];
  return (
    <div className="w-full rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/[0.08] via-primary/[0.04] to-secondary/[0.08] backdrop-blur-sm shadow-sm overflow-hidden">
      <div className="px-4 py-2.5 flex items-center gap-2 border-b border-primary/15 bg-white/40">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <span className="text-[12.5px] font-semibold text-foreground">开始生成报价单</span>
      </div>
      <div className="px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.label} className="min-w-0 flex items-start gap-1.5">
              <Icon className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10.5px] text-muted-foreground leading-tight">{it.label}</div>
                <div className="text-[12.5px] font-medium text-foreground truncate" title={it.value}>{it.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};