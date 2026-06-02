import { Archive, ArrowRight, CheckCircle2, Mail, UserRound } from "lucide-react";

interface InquiryItem {
  channel: string;
  buyer: string;
  region: string;
  product: string;
  intent: "高" | "中" | "低";
  receivedAt: string;
}

const ITEMS: InquiryItem[] = [
  {
    channel: "阿里国际站",
    buyer: "FitLine GmbH · Markus",
    region: "德国 慕尼黑",
    product: "商用动感单车 / 智能跑步机",
    intent: "高",
    receivedAt: "周一 10:22",
  },
  {
    channel: "独立站表单",
    buyer: "HomeFit Co. · Olivia",
    region: "美国 洛杉矶",
    product: "迷你椭圆机 / 可折叠走步机",
    intent: "高",
    receivedAt: "周二 09:48",
  },
  {
    channel: "邮件直发",
    buyer: "TechSol US · John",
    region: "美国 德州",
    product: "5kW 混合逆变器（UL1741）",
    intent: "高",
    receivedAt: "周三 16:05",
  },
  {
    channel: "Made-in-China",
    buyer: "Desert Gym · Khalid",
    region: "阿联酋 迪拜",
    product: "整店成套器械 / 售后配件",
    intent: "中",
    receivedAt: "周四 11:30",
  },
  {
    channel: "LinkedIn",
    buyer: "Nordic Sport AB · Lars",
    region: "瑞典 斯德哥尔摩",
    product: "户外健身器材采购",
    intent: "中",
    receivedAt: "周四 18:12",
  },
  {
    channel: "展会名片",
    buyer: "Bergmann Home Supplies · Michael",
    region: "德国 汉堡",
    product: "保温啤酒杯 500ml 定制",
    intent: "低",
    receivedAt: "周五 09:15",
  },
];

const intentClass = (i: InquiryItem["intent"]) =>
  i === "高"
    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    : i === "中"
      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
      : "bg-muted text-muted-foreground border-border";

interface InquirySummaryResultProps {
  onSendPrompt?: (text: string) => void;
}

const InquirySummaryResult = ({ onSendPrompt }: InquirySummaryResultProps) => {
  const total = ITEMS.length;
  const high = ITEMS.filter((i) => i.intent === "高").length;
  const channels = Array.from(new Set(ITEMS.map((i) => i.channel))).length;

  return (
    <div className="space-y-4 text-foreground">
      {/* 概要 */}
      <p className="text-base leading-relaxed">
        本周共收到 <span className="font-semibold text-primary">{total} 条</span> 询盘，分布在
        <span className="font-semibold text-foreground"> {channels} 个 </span>渠道，其中
        <span className="font-semibold text-emerald-600"> {high} 条 </span>买家意向较高，主要集中在欧美健身器材与户外运动品类。
        建议优先处理意向高的德国与美国买家，并在 24 小时内完成首轮报价回应。
      </p>

      {/* 询盘清单 */}
      <div className="rounded-2xl border border-border/70 bg-card/80 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60 bg-muted/40">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-primary" />
            <h3 className="text-[14px] font-semibold text-foreground">本周询盘清单</h3>
          </div>
          <span className="text-xs text-muted-foreground">共 {total} 条</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-muted/30 text-muted-foreground">
              <tr className="text-left">
                <th className="px-4 py-2 font-medium">渠道</th>
                <th className="px-4 py-2 font-medium">买家</th>
                <th className="px-4 py-2 font-medium">区域</th>
                <th className="px-4 py-2 font-medium">产品需求</th>
                <th className="px-4 py-2 font-medium">意向</th>
                <th className="px-4 py-2 font-medium">接收时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {ITEMS.map((it, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 text-foreground/90">{it.channel}</td>
                  <td className="px-4 py-2.5 font-medium text-foreground">{it.buyer}</td>
                  <td className="px-4 py-2.5 text-foreground/80">{it.region}</td>
                  <td className="px-4 py-2.5 text-foreground/80">{it.product}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${intentClass(it.intent)}`}>
                      {it.intent}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{it.receivedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 入档确认 */}
      <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] px-3.5 py-2.5">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
        <p className="text-[13.5px] text-foreground/90 leading-relaxed">
          已将上述 <span className="font-semibold">{total} 位买家</span> 自动归档至
          <span className="font-semibold text-emerald-700"> 买家档案模块</span>，可随时查看跟进进度与历史沟通记录。
        </p>
      </div>

      {/* 下一步行动引导 */}
      <div className="space-y-2">
        <p className="text-[13.5px] font-semibold text-foreground/85">建议下一步：</p>
        <div className="grid gap-2 sm:grid-cols-3">
          <button
            onClick={() => onSendPrompt?.("针对本周意向高的德国买家 FitLine GmbH，帮我起草首轮跟进邮件")}
            className="group flex items-start gap-2.5 rounded-xl border border-border bg-card/60 px-3 py-2.5 text-left hover:border-primary/40 hover:bg-primary/[0.04] transition-all"
          >
            <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-foreground">优先回复高意向买家</div>
              <div className="text-[12px] text-muted-foreground mt-0.5">为德国 / 美国买家生成首轮回复</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/60 ml-auto mt-1 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={() => onSendPrompt?.("对本周新增的买家 TechSol US 做深度背景调查")}
            className="group flex items-start gap-2.5 rounded-xl border border-border bg-card/60 px-3 py-2.5 text-left hover:border-primary/40 hover:bg-primary/[0.04] transition-all"
          >
            <UserRound className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-foreground">深度背调新买家</div>
              <div className="text-[12px] text-muted-foreground mt-0.5">评估采购实力与合作风险</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/60 ml-auto mt-1 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={() => onSendPrompt?.("把本周询盘按渠道贡献和买家质量做一份汇总周报")}
            className="group flex items-start gap-2.5 rounded-xl border border-border bg-card/60 px-3 py-2.5 text-left hover:border-primary/40 hover:bg-primary/[0.04] transition-all"
          >
            <Archive className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-foreground">生成本周询盘周报</div>
              <div className="text-[12px] text-muted-foreground mt-0.5">渠道贡献 + 买家质量分布</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/60 ml-auto mt-1 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquirySummaryResult;