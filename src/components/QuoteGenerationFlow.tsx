import { useMemo, useState } from "react";
import {
  FileSpreadsheet,
  ChevronRight,
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

// ---------- Shared data ----------

export type QuoteTemplate = "company" | "business" | "social";

export const QUOTE_TEMPLATES: { id: QuoteTemplate; name: string; tagline: string }[] = [
  { id: "company", name: "公司展示型", tagline: "强化品牌信息，附带工厂资质与认证" },
  { id: "business", name: "商务标准版", tagline: "通用 PI 报价模板，规范字段，便于审核" },
  { id: "social", name: "社媒简报版", tagline: "图文简洁，适合 WhatsApp / IG 等社媒发送" },
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
}

export const DEFAULT_QUOTE_INFO: QuoteInfo = {
  productName: "5kW Hybrid Solar Inverter",
  spec: "UL1741 认证 / MPPT / 单相 / 含 WiFi 模块",
  unitPrice: "375",
  qty: "300",
  incoterm: "FOB Shanghai",
  leadTime: "样品 5 天空运 / 量产 35 天",
  freight: "",
  payTerms: "30% T/T 预付，70% 见提单副本",
  buyerCompany: "TechSol US Renewable Distribution",
  buyerContact: "John Carter · Procurement Lead",
  buyerCountry: "美国 / 德州",
  validUntil: "2026-06-30",
};

// ---------- Step 1: confirm info ----------

export const QuoteConfirmStep = ({
  onNext,
  initialInfo,
  done,
  doneInfo,
}: {
  onNext: (info: QuoteInfo) => void;
  initialInfo?: QuoteInfo;
  done?: boolean;
  doneInfo?: QuoteInfo;
}) => {
  const [info, setInfo] = useState<QuoteInfo>(initialInfo || DEFAULT_QUOTE_INFO);
  const display = done && doneInfo ? doneInfo : info;

  const fieldGroups: { icon: typeof Package; title: string; fields: { key: keyof QuoteInfo; label: string; placeholder?: string; missing?: boolean }[] }[] = [
    {
      icon: Package,
      title: "产品参数",
      fields: [
        { key: "productName", label: "产品名称" },
        { key: "spec", label: "规格 / 认证" },
        { key: "unitPrice", label: "默认单价 (USD)" },
        { key: "qty", label: "数量 (PCS)" },
      ],
    },
    {
      icon: UserRound,
      title: "买家信息",
      fields: [
        { key: "buyerCompany", label: "公司名称" },
        { key: "buyerContact", label: "联系人" },
        { key: "buyerCountry", label: "国家 / 地区" },
      ],
    },
    {
      icon: Truck,
      title: "贸易条款",
      fields: [
        { key: "incoterm", label: "贸易术语" },
        { key: "leadTime", label: "交期" },
        { key: "freight", label: "预估运费 (USD)", placeholder: "知识库未填，请补充", missing: true },
        { key: "payTerms", label: "付款方式" },
        { key: "validUntil", label: "报价有效期" },
      ],
    },
  ];

  return (
    <div className="rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-sm shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/12 text-[11px] font-bold text-primary">1</span>
          <h4 className="text-[13.5px] font-semibold text-foreground">确认或补充关键信息（数据补漏）</h4>
        </div>
        {done && (
          <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-primary">
            <Check className="h-3.5 w-3.5" />
            已确认
          </span>
        )}
      </div>
      <div className="px-4 py-3 space-y-3">
        <p className="text-[12.5px] text-muted-foreground leading-relaxed">
          以下信息已从知识库调取并自动填入，请<span className="text-foreground font-medium">确认或补充</span>缺失项。
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {fieldGroups.map((g) => {
            const Icon = g.icon;
            return (
              <div key={g.title} className="rounded-xl border border-border/60 bg-background/60 p-3">
                <div className="flex items-center gap-1.5 mb-2 text-[12px] font-semibold text-foreground">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {g.title}
                </div>
                <div className="space-y-2">
                  {g.fields.map((f) => (
                    <div key={f.key} className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <label className="text-[11px] text-muted-foreground">{f.label}</label>
                        {f.missing && !display[f.key] && (
                          <span className="text-[10px] px-1 py-px rounded bg-amber-500/15 text-amber-600">待补充</span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={display[f.key]}
                        disabled={done}
                        placeholder={f.placeholder}
                        onChange={(e) => setInfo({ ...info, [f.key]: e.target.value })}
                        className="w-full rounded-md border border-border/70 bg-background px-2 py-1.5 text-[12px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:bg-muted/40 disabled:cursor-default"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
    </div>
  );
};

// ---------- Step 2: template select ----------

const TemplateThumb = ({ id }: { id: QuoteTemplate }) => {
  if (id === "company") {
    return (
      <div className="h-24 w-full rounded-lg bg-gradient-to-br from-primary/10 to-secondary/20 p-2.5 space-y-1.5">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-primary/60" />
          <div className="h-1.5 w-12 rounded-full bg-foreground/30" />
          <div className="ml-auto h-1 w-6 rounded-full bg-foreground/15" />
        </div>
        <div className="h-1 w-3/4 rounded-full bg-foreground/15" />
        <div className="grid grid-cols-3 gap-1 mt-1">
          <div className="h-3 rounded bg-card/80 shadow-sm" />
          <div className="h-3 rounded bg-card/80 shadow-sm" />
          <div className="h-3 rounded bg-card/80 shadow-sm" />
        </div>
        <div className="h-1 w-2/3 rounded-full bg-foreground/10" />
      </div>
    );
  }
  if (id === "business") {
    return (
      <div className="h-24 w-full rounded-lg bg-card border border-border/70 p-2.5 space-y-1">
        <div className="flex items-center justify-between">
          <div className="h-1.5 w-16 rounded-full bg-foreground/30" />
          <div className="h-1 w-8 rounded-full bg-foreground/15" />
        </div>
        <div className="h-px bg-border/70 my-1" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="h-1 w-1/3 rounded-full bg-foreground/15" />
            <div className="h-1 flex-1 rounded-full bg-foreground/8" />
            <div className="h-1 w-6 rounded-full bg-primary/40" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="h-24 w-full rounded-lg bg-gradient-to-br from-secondary/30 to-primary/10 p-2.5 flex gap-2">
      <div className="h-full w-2/5 rounded-md bg-card/80 shadow-sm" />
      <div className="flex-1 space-y-1.5">
        <div className="h-1.5 w-3/4 rounded-full bg-foreground/30" />
        <div className="h-1 w-full rounded-full bg-foreground/15" />
        <div className="h-1 w-2/3 rounded-full bg-foreground/15" />
        <div className="flex gap-1 mt-1">
          <span className="h-2 w-6 rounded-full bg-primary/40" />
          <span className="h-2 w-4 rounded-full bg-secondary/60" />
        </div>
      </div>
    </div>
  );
};

export const QuoteTemplateStep = ({
  onConfirm,
  done,
  selected,
}: {
  onConfirm: (template: QuoteTemplate) => void;
  done?: boolean;
  selected?: QuoteTemplate | null;
}) => {
  const [picked, setPicked] = useState<QuoteTemplate>(selected || "business");
  const currentlySelected = done ? (selected as QuoteTemplate) : picked;

  return (
    <div className="rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-sm shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/12 text-[11px] font-bold text-primary">2</span>
          <h4 className="text-[13.5px] font-semibold text-foreground">选择模板与排版预览</h4>
        </div>
        {done && (
          <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-primary">
            <Check className="h-3.5 w-3.5" />
            已确认
          </span>
        )}
      </div>
      <div className="px-4 py-3 space-y-3">
        <div className="grid gap-2.5 md:grid-cols-3">
          {QUOTE_TEMPLATES.map((t) => {
            const active = currentlySelected === t.id;
            return (
              <button
                key={t.id}
                onClick={() => !done && setPicked(t.id)}
                disabled={done}
                className={`text-left rounded-xl border p-2.5 transition-all ${
                  active
                    ? "border-primary/60 bg-primary/[0.06] ring-1 ring-primary/30"
                    : "border-border/60 bg-background/50 hover:border-primary/30 hover:bg-primary/[0.03]"
                } disabled:cursor-default`}
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
    const qty = Number(info.qty) || 0;
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
              收件人：{info.buyerCompany} · 有效期至 {info.validUntil}
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
                {info.qty} pcs × ${info.unitPrice}
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
export const isQuoteGenPrompt = (text?: string) => !!text && /生成报价单|报价单生成/.test(text);

// Silence unused import warning in some build configs
void Pencil;