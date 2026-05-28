import { useState } from "react";
import { Lightbulb, Target, ChevronDown, Globe2 } from "lucide-react";

interface KeywordTrendResultProps {
  onSendPrompt?: (text: string) => void;
}

const SectionCard = ({ icon: Icon, title, children }: {
  icon: typeof Lightbulb;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-xl border border-border bg-card p-4">
    <div className="flex items-center gap-1.5 mb-3">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <h3 className="font-semibold text-foreground text-[15px]">{title}</h3>
    </div>
    <div>{children}</div>
  </section>
);

type TrendTone = "up" | "down" | "flat";
const TREND_CLS: Record<TrendTone, string> = {
  up: "text-destructive",
  down: "text-success",
  flat: "text-muted-foreground",
};

const CORE_KEYWORDS: {
  category: string;
  keywords: string;
  trend: string;
  tone: TrendTone;
  markets: string;
}[] = [
  {
    category: "智能自动售货机",
    keywords: "Smart Vending Machine, Intelligent Vending Machine",
    trend: "+15%",
    tone: "up",
    markets: "东南亚、北美、欧洲",
  },
  {
    category: "综合机",
    keywords: "Combo Vending Machine",
    trend: "-8%",
    tone: "down",
    markets: "欧洲",
  },
  {
    category: "升降机",
    keywords: "Elevator Vending Machine",
    trend: "无明显波动",
    tone: "flat",
    markets: "中东",
  },
  {
    category: "格子自取生鲜柜",
    keywords: "Smart Locker, Refrigerated Locker",
    trend: "+22%",
    tone: "up",
    markets: "东南亚、南美、北美、欧洲",
  },
];

const PURCHASE_INTENT: { category: string; keywords: string; markets: string }[] = [
  {
    category: "智能自动售货机",
    keywords:
      "Vending machine supplier Malaysia; Wholesale smart vending machine price; Buy intelligent vending machine Europe",
    markets: "东南亚、北美、欧洲",
  },
  {
    category: "格子自取生鲜柜",
    keywords:
      "Smart locker manufacturer Singapore; Cost of refrigerated locker system; Fresh food locker for apartment building",
    markets: "东南亚、欧洲、北美",
  },
];

const FAQ_PHRASES: { category: string; keywords: string; markets: string }[] = [
  {
    category: "智能自动售货机",
    keywords:
      "How smart vending machines improve ROI?; What is an elevator vending machine?; Best vending machine for small business",
    markets: "东南亚、北美、欧洲、中东",
  },
  {
    category: "格子自取生鲜柜",
    keywords:
      "Smart lockers for last-mile delivery; How to choose a refrigerated locker?; Benefits of fresh food lockers",
    markets: "东南亚、南美、欧洲、北美",
  },
];

const LAYOUT_STRATEGY: { title: string; desc: string }[] = [
  {
    title: "独立站优化",
    desc: "核心词、功能词融入 TDK；场景词、问题短语用于解决方案和 FAQ。",
  },
  {
    title: "B2B 平台与本地化",
    desc: "标题结合核心词、功能词、采购长尾词；多语言内容精准融入本地化关键词。",
  },
  {
    title: "社媒与广告",
    desc: "趋势词作社媒话题；常见问题制作图文 / 视频；精准投放高转化关键词。",
  },
];


const MARKET_ROWS: {
  market: string;
  language: string;
  focus: string;
  behavior: string;
}[] = [
  {
    market: "东南亚",
    language: "英语（含本地化后缀）",
    focus: "智能互联、移动支付、运营效率",
    behavior: "偏好技术先进、能提升效率的解决方案；重视品牌信誉和售后服务。",
  },
  {
    market: "南美",
    language: "西班牙语 / 葡萄牙语",
    focus: "价格优势、产品耐用、本地支持",
    behavior: "对价格敏感，重视本地化支付和物流；倾向于寻找有本地化经验的供应商。",
  },
  {
    market: "欧洲",
    language: "英语 / 德语 / 法语",
    focus: "环保节能、法规合规、设计美学",
    behavior: "注重产品品质与认证，对创新和可持续性有较高要求。",
  },
];

const KeywordTrendResult = (_props: KeywordTrendResultProps) => {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div className="space-y-3 text-base leading-relaxed">
      {/* 模块 1：趋势概要 */}
      <SectionCard icon={Lightbulb} title="趋势概要">
        <div className="space-y-4">
          <div>
            <h4 className="text-[15px] font-semibold text-foreground mb-1.5">
              市场趋势概览
            </h4>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="inline-block w-1 h-3.5 rounded-full bg-primary" />
              <h5 className="text-[14px] font-semibold text-foreground">核心发现</h5>
            </div>
            <p className="text-[14px] text-foreground/85 leading-[1.75]">
              智能自动售货机市场呈现多元化趋势：<span className="font-medium text-foreground">东南亚</span>对智能化、无现金支付需求强劲，英语为主；
              <span className="font-medium text-foreground">南美</span>关注性价比、耐用性及本地化服务，西语 / 葡语是关键；
              <span className="font-medium text-foreground">欧洲</span>则强调环保节能、法规合规与设计美学。
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Globe2 className="w-3.5 h-3.5 text-primary" />
              <h5 className="text-[14px] font-semibold text-foreground">目标市场画像</h5>
            </div>
            <div className="overflow-hidden rounded-lg border border-border/60">
              <table className="w-full text-[12px] border-collapse">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground">
                    <th className="text-left font-medium px-3 py-2 w-[72px]">目标市场</th>
                    <th className="text-left font-medium px-3 py-2 w-[140px]">核心商业语言</th>
                    <th className="text-left font-medium px-3 py-2">市场主要关注点</th>
                    <th className="text-left font-medium px-3 py-2">采购行为特点</th>
                  </tr>
                </thead>
                <tbody>
                  {MARKET_ROWS.map((row, i) => (
                    <tr
                      key={row.market}
                      className={`border-t border-border/40 align-top ${i % 2 === 1 ? "bg-muted/15" : ""}`}
                    >
                      <td className="px-3 py-2 text-foreground font-semibold whitespace-nowrap">{row.market}</td>
                      <td className="px-3 py-2 text-foreground/85">{row.language}</td>
                      <td className="px-3 py-2 text-foreground/85">{row.focus}</td>
                      <td className="px-3 py-2 text-foreground/85 leading-[1.65]">{row.behavior}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* 模块 2：产品关键词分析报告（默认 5 行预览，支持展开全部） */}
      <section className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3">
          <Target className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground text-[15px]">产品关键词分析报告</h3>
          <span className="ml-2 text-[11px] text-muted-foreground">
            核心词 / 长尾词 / 布局策略
          </span>
        </div>

        <div className="relative border-t border-border/60">
          <div
            className={`overflow-hidden transition-[max-height] duration-300 ease-out ${reportOpen ? "max-h-[3000px]" : "max-h-[140px]"}`}
          >
            <div className="px-4 pb-4 pt-1 space-y-5">
            {/* 1. 核心关键词策略 */}
            <div className="pt-3 space-y-3">
              <h4 className="text-[14px] font-semibold text-foreground">核心关键词策略</h4>
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <h5 className="text-[13px] font-semibold text-foreground">产品核心词</h5>
                </div>
                <p className="text-[12px] text-foreground/80 leading-[1.7] mb-2">
                  <span className="text-muted-foreground">要点概括：</span>
                  识别与智能自动售货机直接相关的核心搜索词，了解其市场热度与主要分布。
                </p>
                <div className="overflow-hidden rounded-lg border border-border/60">
                  <table className="w-full text-[11.5px] border-collapse">
                    <thead>
                      <tr className="bg-muted/40 text-muted-foreground">
                        <th className="text-left font-medium px-2.5 py-1.5 w-[112px]">产品类型</th>
                        <th className="text-left font-medium px-2.5 py-1.5">关键词</th>
                        <th className="text-right font-medium px-2.5 py-1.5 w-[110px]">近30天趋势</th>
                        <th className="text-left font-medium px-2.5 py-1.5 w-[150px]">主要市场</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CORE_KEYWORDS.map((k, i) => (
                        <tr key={k.category} className={`border-t border-border/40 align-top ${i % 2 === 1 ? "bg-muted/15" : ""}`}>
                          <td className="px-2.5 py-1.5 text-foreground font-semibold whitespace-nowrap">{k.category}</td>
                          <td className="px-2.5 py-1.5 text-foreground/85">{k.keywords}</td>
                          <td className={`px-2.5 py-1.5 text-right font-semibold tabular-nums ${TREND_CLS[k.tone]}`}>{k.trend}</td>
                          <td className="px-2.5 py-1.5 text-foreground/85">{k.markets}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 2. 长尾关键词趋势 */}
            <div className="space-y-3">
              <h4 className="text-[14px] font-semibold text-foreground">
                长尾关键词趋势
              </h4>

              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <h5 className="text-[13px] font-semibold text-foreground">采购意图长尾词</h5>
                </div>
                <p className="text-[12px] text-foreground/80 leading-[1.7] mb-2">
                  <span className="text-muted-foreground">要点概括：</span>
                  捕捉潜在买家在寻找供应商、大宗采购或价格查询时使用的具体长尾词。
                </p>
                <div className="overflow-hidden rounded-lg border border-border/60">
                  <table className="w-full text-[11.5px] border-collapse">
                    <thead>
                      <tr className="bg-muted/40 text-muted-foreground">
                        <th className="text-left font-medium px-2.5 py-1.5 w-[140px]">产品 / 服务类别</th>
                        <th className="text-left font-medium px-2.5 py-1.5">长尾词</th>
                        <th className="text-left font-medium px-2.5 py-1.5 w-[150px]">主要市场</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PURCHASE_INTENT.map((k, i) => (
                        <tr key={k.category} className={`border-t border-border/40 align-top ${i % 2 === 1 ? "bg-muted/15" : ""}`}>
                          <td className="px-2.5 py-1.5 text-foreground font-semibold whitespace-nowrap">{k.category}</td>
                          <td className="px-2.5 py-1.5 text-foreground/85 leading-[1.7]">{k.keywords}</td>
                          <td className="px-2.5 py-1.5 text-foreground/85">{k.markets}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <h5 className="text-[13px] font-semibold text-foreground">常见问题与短语</h5>
                </div>
                <p className="text-[12px] text-foreground/80 leading-[1.7] mb-2">
                  <span className="text-muted-foreground">要点概括：</span>
                  分析用户对智能自动售货机的常见疑问，指导内容创作以满足信息需求。
                </p>
                <div className="overflow-hidden rounded-lg border border-border/60">
                  <table className="w-full text-[11.5px] border-collapse">
                    <thead>
                      <tr className="bg-muted/40 text-muted-foreground">
                        <th className="text-left font-medium px-2.5 py-1.5 w-[140px]">产品 / 服务类别</th>
                        <th className="text-left font-medium px-2.5 py-1.5">长尾词</th>
                        <th className="text-left font-medium px-2.5 py-1.5 w-[170px]">主要市场</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FAQ_PHRASES.map((k, i) => (
                        <tr key={k.category} className={`border-t border-border/40 align-top ${i % 2 === 1 ? "bg-muted/15" : ""}`}>
                          <td className="px-2.5 py-1.5 text-foreground font-semibold whitespace-nowrap">{k.category}</td>
                          <td className="px-2.5 py-1.5 text-foreground/85 leading-[1.7]">{k.keywords}</td>
                          <td className="px-2.5 py-1.5 text-foreground/85">{k.markets}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 3. 关键词布局策略 */}
            <div className="space-y-2">
              <h4 className="text-[14px] font-semibold text-foreground">
                关键词布局策略
              </h4>
              <p className="text-[12px] text-foreground/80 leading-[1.7]">
                为最大化营销资产可见性，以下是智能自动售货机市场的关键词布局建议：
              </p>
              <ol className="space-y-1.5">
                {LAYOUT_STRATEGY.map((s, i) => (
                  <li key={s.title} className="flex gap-2 text-[12.5px] leading-[1.7]">
                    <span className="shrink-0 mt-[2px] inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-primary/10 text-primary text-[10.5px] font-semibold">
                      {i + 1}
                    </span>
                    <span className="text-foreground/85">
                      <span className="font-semibold text-foreground">{s.title}：</span>
                      {s.desc}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="text-[10.5px] text-muted-foreground leading-[1.7] pt-1 border-t border-border/40">
              数据说明：本报告中"近30天搜索热度趋势"数据来源于 Google Trends，统计时间范围为 2026 年 04 月 10 日至 2026 年 05 月 10 日。
            </p>
            </div>
          </div>

          {!reportOpen && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card via-card/90 to-transparent" />
          )}

          <div className="flex justify-center px-4 py-2 border-t border-border/40 bg-card">
            <button
              onClick={() => setReportOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-[hsl(217,100%,50%)] hover:text-[hsl(217,100%,42%)] transition-colors"
            >
              {reportOpen ? "收起" : "展开全部"}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${reportOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KeywordTrendResult;
