import { useState } from "react";
import { UserRound, Building2, Package, Workflow, CheckCircle2, ChevronRight, X, Mail, Phone, MapPin, Star, Clock } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface BuyerProfileFloatingCardProps {
  visible: boolean;
  updated: boolean;
  stage: string;
}

const BuyerProfileFloatingCard = ({ visible, updated, stage }: BuyerProfileFloatingCardProps) => {
  const [open, setOpen] = useState(false);

  if (!visible) return null;

  const company = "Bergmann Home Supplies GmbH";
  const product = "Double Wall Insulated Beer Mug";

  return (
    <>
      <div
        className="pointer-events-auto fixed right-6 top-24 z-30 w-[260px] animate-fade-up"
        style={{ animationDuration: "260ms" }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group block w-full text-left rounded-2xl border border-primary/20 bg-card/85 backdrop-blur-md shadow-[0_8px_28px_-12px_hsl(var(--primary)/0.25)] hover:shadow-[0_12px_32px_-10px_hsl(var(--primary)/0.32)] hover:border-primary/35 transition-all overflow-hidden"
        >
          <div className="px-3.5 pt-3 pb-2.5 border-b border-border/50 bg-gradient-to-br from-primary/[0.06] to-transparent">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 items-center justify-center">
                <CheckCircle2 className="w-3 h-3" />
              </span>
              <span className="text-[12.5px] font-semibold text-foreground">
                {updated ? "已更新买家档案" : "已生成买家档案"}
              </span>
              <ChevronRight className="w-3.5 h-3.5 ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
          <div className="px-3.5 py-3 space-y-2">
            <Field icon={Building2} label="公司名称" value={company} />
            <Field icon={Package} label="采购产品" value={product} />
            <Field icon={Workflow} label="跟进阶段" value={stage} highlight={updated} />
          </div>
        </button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[480px] p-0 overflow-y-auto scrollbar-thin">
          <BuyerProfileSheetContent stage={stage} updated={updated} onClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
};

const Field = ({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex items-start gap-2">
    <Icon className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
    <div className="min-w-0 flex-1">
      <p className="text-[10.5px] text-muted-foreground leading-none mb-1">{label}</p>
      <p
        className={`text-[12.5px] leading-snug truncate ${
          highlight ? "text-primary font-semibold" : "text-foreground/90 font-medium"
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);

// ============================================================
// Drawer content — compact buyer detail
// ============================================================
export const BuyerProfileSheetContent = ({
  stage,
  updated,
  onClose,
}: {
  stage: string;
  updated: boolean;
  onClose: () => void;
}) => {
  const analyses = [
    {
      date: "今日",
      channel: "二次跟进策略",
      summary: "Bergmann 二次跟进 · 化解低价竞品顾虑",
      active: updated,
    },
    {
      date: "14 天前",
      channel: "报价单生成",
      summary: "Bergmann 双层啤酒杯 · 首轮个性化报价",
    },
    {
      date: "15 天前",
      channel: "询盘分析",
      summary: "Bergmann 500ml 双层保温啤酒杯询盘解析",
    },
  ];

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border bg-gradient-to-br from-primary/[0.05] to-transparent relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-semibold text-primary">
          <UserRound className="w-3 h-3" />
          买家档案
        </span>
        <h2 className="mt-2.5 text-lg font-bold text-foreground leading-tight">
          Bergmann Home Supplies GmbH
        </h2>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Michael Schneider · 采购经理
        </p>
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-primary/10 text-primary border border-primary/20">
            {stage}
          </span>
          {updated && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              刚刚更新
            </span>
          )}
        </div>
      </div>

      {/* Basic info */}
      <section className="px-5 py-4 space-y-2.5 border-b border-border">
        <h3 className="text-[12.5px] font-semibold text-foreground flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-primary" />
          基础信息
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          <Info icon={MapPin} label="所在地" value="德国 · 慕尼黑" />
          <Info icon={Star} label="买家等级" value="A 级" />
          <Info icon={Mail} label="邮箱" value="m.schneider@bergmann.de" />
          <Info icon={Phone} label="时区" value="CET (UTC+1)" />
        </div>
      </section>

      {/* Procurement intent */}
      <section className="px-5 py-4 space-y-2.5 border-b border-border">
        <h3 className="text-[12.5px] font-semibold text-foreground flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5 text-primary" />
          采购意向
        </h3>
        <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1.5">
          <Row label="产品" value="500ml 双层不锈钢啤酒杯" />
          <Row label="数量" value="5,000 pcs（首单试单）" />
          <Row label="目标价" value="FOB $3.50–$4.20 / pc" />
          <Row label="交期" value="≤ 45 天" />
          <Row label="定制要求" value="Logo 激光雕刻 + 礼盒装" />
        </div>
      </section>

      {/* Analysis records */}
      <section className="px-5 py-4">
        <h3 className="text-[12.5px] font-semibold text-foreground flex items-center gap-1.5 mb-3">
          <Clock className="w-3.5 h-3.5 text-primary" />
          分析记录
        </h3>
        <div className="space-y-2">
          {analyses.map((it, i) => (
            <div
              key={i}
              className={`rounded-lg border px-3 py-2.5 ${
                it.active
                  ? "border-primary/30 bg-primary/[0.04]"
                  : "border-border bg-card/70"
              }`}
            >
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground">{it.date}</span>
                <span className="px-1.5 py-0.5 rounded bg-muted text-[10px]">
                  {it.channel}
                </span>
                {it.active && (
                  <span className="ml-auto px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">
                    进行中
                  </span>
                )}
              </div>
              <p className="mt-1 text-[12.5px] text-foreground/90 leading-snug">
                {it.summary}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Info = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) => (
  <div className="rounded-lg border border-border bg-muted/15 px-2.5 py-2">
    <div className="flex items-center gap-1 text-[10.5px] text-muted-foreground">
      <Icon className="w-3 h-3" />
      {label}
    </div>
    <p className="mt-0.5 text-[12px] font-medium text-foreground truncate">{value}</p>
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start gap-2 text-[12px] leading-snug">
    <span className="text-muted-foreground shrink-0 w-14">{label}</span>
    <span className="text-foreground/90 flex-1">{value}</span>
  </div>
);

export default BuyerProfileFloatingCard;