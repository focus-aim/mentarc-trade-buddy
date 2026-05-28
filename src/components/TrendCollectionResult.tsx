import { Radar, Hash, AlertTriangle, MessageCircle, Sparkles } from "lucide-react";

interface TrendCollectionResultProps {
  onSendPrompt?: (text: string) => void;
}

const SectionCard = ({ icon: Icon, title, children }: {
  icon: typeof Radar;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-xl border border-border bg-card p-3.5">
    <div className="flex items-center gap-1.5 mb-2">
      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      <h3 className="font-medium text-foreground text-[12.5px]">{title}</h3>
    </div>
    <div>{children}</div>
  </section>
);

// 一、海外社媒流行趋势 — 平台 + 高频标签
const PLATFORM_TAGS: { plat: string; tags: string[] }[] = [
  { plat: "TikTok", tags: ["#backyardheating", "#patioheater", "#winterpartysetup"] },
  { plat: "Instagram", tags: ["#cafépatioheaters", "#outdoordining", "#cozybackyard"] },
  { plat: "YouTube", tags: ["patio heater review", "propane heater unboxing", "before & after"] },
  { plat: "Reddit", tags: ["r/AskUK · 户外加热禁令讨论", "r/australia · 暖感效果反馈"] },
];

// 二、关键需求 & 痛点（保留最重要 3 条）
const PAIN_POINTS: { dim: string; need: string; pain: string }[] = [
  { dim: "安全合规", need: "家庭 / 儿童 / 宠物周围、商业露台使用，需无明火、防倾倒、防风、合规", pain: "担心儿童触碰、密闭区使用风险、部分城市禁用" },
  { dim: "暖感效率", need: "快速升温、覆盖小型庭院 / 阳台 / 咖啡馆露台", pain: "只在正前方热、风一吹散掉、整体仍冷" },
  { dim: "环保趋势", need: "低排放、符合欧盟环保政策与城市法规", pain: "担心户外加热禁令、寻求电热替代方案" },
];

// 三、目标用户原声（保留最重要 3 条）
const VOICES: { plat: string; quote: string; focus: string }[] = [
  {
    plat: "Reddit",
    quote: "I love our patio heater, but I'm always worried when my kids run around near it.",
    focus: "家庭用户最关注儿童安全防护",
  },
  {
    plat: "Instagram",
    quote: "We bought 4 outdoor heaters for our rooftop bar, and our winter reservations increased by 30%.",
    focus: "商家关注延长冬季营业、提升预订率",
  },
  {
    plat: "YouTube",
    quote: "It's warm, but a bit noisy for an evening on the patio.",
    focus: "夜间使用场景对低噪音体验高度敏感",
  },
];

// 平台徽标配色
const PLATFORM_STYLE: Record<string, string> = {
  Reddit: "bg-[hsl(16_100%_50%/0.12)] text-[hsl(16_85%_45%)] border-[hsl(16_100%_50%/0.25)]",
  Instagram: "bg-[hsl(330_70%_55%/0.12)] text-[hsl(330_70%_45%)] border-[hsl(330_70%_55%/0.25)]",
  YouTube: "bg-[hsl(0_85%_55%/0.12)] text-[hsl(0_75%_48%)] border-[hsl(0_85%_55%/0.25)]",
  TikTok: "bg-foreground/10 text-foreground border-foreground/20",
};

// 四、改进灵感
const IMPROVEMENTS: { k: string; v: string }[] = [
  { k: "安全设计", v: "防护罩、防倾倒自动断气、儿童安全距离提醒" },
  { k: "热场优化", v: "更宽的出热范围、防风设计，适合风大地区" },
  { k: "低噪低耗", v: "降低燃烧噪音与耗气，推出 \"低噪音 · 低耗气\" 系列" },
  { k: "合规标识", v: "明确标注 CE / 欧盟排放标准，并准备电热替代方案说明" },
];

const TrendCollectionResult = (_props: TrendCollectionResultProps) => {
  return (
    <div className="space-y-3 text-base leading-relaxed">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-primary/15 bg-gradient-to-r from-primary/[0.06] to-transparent">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
          <Radar className="h-3.5 w-3.5" />
        </div>
        <p className="text-[13.5px] font-bold text-foreground leading-tight">
          户外燃气取暖器 · 海外社媒热点趋势采集
        </p>
      </div>

      {/* 一、海外社媒流行趋势 */}
      <SectionCard icon={Hash} title="一、海外社媒流行趋势">
        <p className="text-[11.5px] text-foreground/85 leading-relaxed mb-2">
          在 <span className="font-semibold text-foreground">TikTok / Instagram / YouTube / Reddit</span> 等平台成为 <span className="font-semibold text-foreground">"冬季户外生活升级"、"露台社交经济"</span> 的高频标签。内容形态以 <span className="font-semibold text-foreground">"使用前后对比"、"安装 / 开箱测评"、"环保与法规讨论"</span> 为主，情绪价值集中于 <span className="font-semibold text-foreground">温暖、安全、舒适</span> 与 <span className="font-semibold text-foreground">"冬季不关露台"</span> 的生活方式。
        </p>
        <div className="space-y-1 pt-2 border-t border-border/40">
          {PLATFORM_TAGS.map((p) => (
            <div key={p.plat} className="text-[11.5px] leading-snug">
              <span className="font-semibold text-foreground">{p.plat}</span>
              <span className="text-foreground/80"> — {p.tags.join("、")}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 二、关键需求 & 痛点 — 左右双栏对照 */}
      <SectionCard icon={AlertTriangle} title="二、关键需求与用户痛点">
        <div className="grid grid-cols-[64px_1fr_1fr] gap-x-2 gap-y-1.5 text-[11.5px] leading-snug">
          {/* 表头 */}
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">维度</div>
          <div className="text-[10px] font-semibold text-primary uppercase tracking-wide flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />核心需求
          </div>
          <div className="text-[10px] font-semibold text-destructive uppercase tracking-wide flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-destructive" />典型痛点
          </div>

          {PAIN_POINTS.map((p) => (
            <div key={p.dim} className="contents">
              <div className="font-semibold text-foreground self-start pt-1.5">{p.dim}</div>
              <div className="rounded-md bg-primary/[0.06] border border-primary/15 px-2 py-1.5 text-foreground/85">
                {p.need}
              </div>
              <div className="rounded-md bg-destructive/[0.06] border border-destructive/15 px-2 py-1.5 text-foreground/85">
                {p.pain}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 三、目标用户原声 — 平台标识 + 原声 + 关注点 */}
      <SectionCard icon={MessageCircle} title="三、目标市场用户原声">
        <div className="space-y-2.5">
          {VOICES.map((v, i) => (
            <div key={i} className="text-[11.5px] leading-snug">
              <div className="flex items-start gap-2">
                <span className={`shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-md border text-[10px] font-semibold tracking-wide ${PLATFORM_STYLE[v.plat] || "bg-muted text-foreground border-border"}`}>
                  {v.plat}
                </span>
                <p className="flex-1 text-foreground/85 italic text-[11.5px] leading-relaxed">
                  "{v.quote}"
                </p>
              </div>
              <p className="mt-1 ml-[52px] text-foreground/85">
                <span className="text-muted-foreground">关注点：</span>
                <span className="font-medium text-foreground">{v.focus}</span>
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 四、改进灵感 */}
      <SectionCard icon={Sparkles} title="四、对出口产品与内容的改进灵感">
        <div className="space-y-1.5">
          {IMPROVEMENTS.map((it) => (
            <div key={it.k} className="text-[11.5px] leading-snug">
              <span className="font-semibold text-primary">{it.k}：</span>
              <span className="text-foreground/85">{it.v}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default TrendCollectionResult;
