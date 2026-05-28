import { Globe2, BarChart3, TrendingUp, ShieldCheck, Users, Target, Lightbulb } from "lucide-react";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

interface MarketResearchResultProps {
  onSendPrompt?: (text: string) => void;
}

const SectionCard = ({ icon: Icon, title, subtitle, children }: {
  icon: typeof Globe2;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-xl border border-border bg-card p-3.5">
    <div className="flex items-center gap-1.5 mb-2">
      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      <h3 className="font-medium text-foreground text-[12.5px]">{title}</h3>
      {subtitle && <span className="text-[10.5px] text-muted-foreground truncate">· {subtitle}</span>}
    </div>
    <div>{children}</div>
  </section>
);

// 一、概述
const OVERVIEW = [
  { k: "市场规模", v: "欧洲户外取暖器市场约 1.9 亿美元（2024），2026–2032 年 CAGR ≈ 5%，燃气类仍为主流" },
  { k: "主要国家", v: "德国、法国、意大利、西班牙、荷兰、英国" },
  { k: "销售旺季", v: "每年 9 月至次年 2 月，与庭院 / 餐厅户外经营周期高度匹配" },
];

// 二、目标买家画像
const BUYERS: { type: string; example: string; feature: string }[] = [
  { type: "专业取暖器进口商", example: "庭院燃气 / 电热设备专业商", feature: "多做 OEM/ODM，重价格、CE/GAR、防风防倾倒" },
  { type: "园艺 / 建材连锁", example: "Leroy Merlin、Bauhaus", feature: "外观现代、易安装、安全标识齐全，长期固定供应" },
  { type: "跨境电商卖家", example: "Amazon EU、eBay 卖家", feature: "重 CE / GPSR / WEEE、多语说明书、电商物流包装" },
];

const END_USER = [
  { tag: "商业场景", desc: "餐厅、酒吧、酒店室外区：大覆盖面积、防风、连续工作时间长，多为丙烷 / 天然气" },
  { tag: "家庭用户", desc: "中高收入家庭，有庭院 / 阳台：偏好外观现代、易移动、安全可靠的塔式 / 悬挂式" },
];

// 三、数据趋势：海关 + Google 合并图（按欧洲销售旺季月份排列）
const TREND_MONTHS = ["3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", "1月", "2月"];
const TREND_DATA = TREND_MONTHS.map((m, i) => ({
  month: m,
  出口额: [28, 32, 38, 46, 58, 72, 96, 118, 104, 82, 64, 48][i], // M USD（柱）
  搜索热度: [18, 22, 24, 28, 32, 42, 68, 88, 92, 76, 54, 36][i],   // 0-100（线）
}));

const TOP_MARKETS = [
  { c: "德国", v: "0.42 亿 / +9%" },
  { c: "法国", v: "0.31 亿 / +7%" },
  { c: "英国", v: "0.28 亿 / +4%" },
  { c: "意大利", v: "0.22 亿 / +6%" },
  { c: "西班牙", v: "0.18 亿 / +11%" },
  { c: "荷兰", v: "0.14 亿 / +8%" },
];

const KEYWORDS = [
  { trend: "↑", word: "patio gas heater", chg: "+28%" },
  { trend: "↑", word: "terrassenheizer gas", chg: "+24%" },
  { trend: "↑", word: "chauffage terrasse gaz", chg: "+19%" },
  { trend: "↓", word: "tabletop butane heater", chg: "-9%" },
  { trend: "↓", word: "ventless gas heater", chg: "-6%" },
];

// 四、合规
const COMPLIANCE: { mkt: string; cert: string; extra: string }[] = [
  { mkt: "燃气安全", cert: "GAR (EU) 2016/426 + CE", extra: "第三方检测，符合燃气器具安全要求" },
  { mkt: "电控部件", cert: "CE（LVD + EMC）· RoHS · REACH", extra: "含电子点火 / 控制板需满足" },
  { mkt: "电子电器", cert: "WEEE 注册", extra: "如含电控部件，按国家分别注册" },
  { mkt: "标签 / 说明书", cert: "多语标签 + 说明书", extra: "英、德、法、西、意：型号、燃气类型、功率、警告" },
  { mkt: "GPSR 责任人", cert: "EU Responsible Person", extra: "每款消费品须指定欧盟责任人，负责合规与文件保存" },
];

// 五、同行竞争者
const COMPETITORS: { type: string; rep: string; clients: string; trait: string }[] = [
  { type: "欧洲本土品牌", rep: "Planika 等", clients: "高端酒店、连锁餐厅", trait: "高设计感 / 高端，品牌强、服务好" },
  { type: "中国 / 亚洲 OEM", rep: "中国出口厂为主", clients: "进口商、建材商、电商", trait: "性价比高、款式多，成本低、产能灵活" },
  { type: "跨境电商品牌", rep: "电商自有品牌", clients: "个人消费者、小商户", trait: "入门级 / 基础功能，流量快、订单灵活" },
];

// 行动建议
const ACTIONS = [
  { k: "产品定位", v: "主推中端燃气塔式 / 悬挂取暖器，强调防风、防倾倒、安全结构，按 CE / GAR 设计" },
  { k: "目标客户优先", v: "欧洲专业户外取暖器进口商 → 建材 / 园艺连锁采购 → 有欧洲本地仓的跨境电商卖家" },
  { k: "提前准备", v: "完成 CE / GAR / RoHS / REACH 测试与文件；多语标签与说明书（英 / 德 / 法 / 西 / 意）" },
];

const TrendChart = () => (
  <div className="h-[210px] w-full -ml-1">
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={TREND_DATA} margin={{ top: 8, right: 4, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={28} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={28} />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
            fontSize: 11,
            padding: "6px 10px",
          }}
          labelStyle={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}
        />
        <Legend wrapperStyle={{ fontSize: 10, paddingTop: 4 }} iconSize={8} iconType="circle" />
        <Bar yAxisId="left" dataKey="出口额" fill="hsl(var(--primary))" fillOpacity={0.25} stroke="hsl(var(--primary))" strokeWidth={1} name="海关出口额 (M USD)" radius={[3, 3, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="搜索热度" stroke="hsl(var(--secondary))" strokeWidth={2} dot={false} activeDot={{ r: 3 }} name="Google 搜索热度 (0-100)" />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
);

const MarketResearchResult = (_props: MarketResearchResultProps) => {
  return (
    <div className="space-y-3 text-base leading-relaxed">
      {/* Header — 仅标题 */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-primary/15 bg-gradient-to-r from-primary/[0.06] to-transparent">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
          <Globe2 className="h-3.5 w-3.5" />
        </div>
        <p className="text-[13.5px] font-bold text-foreground leading-tight">
          户外燃气取暖器 · 出口欧洲 · 外贸市场调研报告
        </p>
      </div>

      {/* 一、概述 — 纯文字总结 */}
      <SectionCard icon={BarChart3} title="一、概述">
        <p className="text-[11.5px] text-foreground/85 leading-relaxed">
          欧洲户外取暖器市场约 <span className="font-semibold text-foreground">1.9 亿美元</span>（2024），2026–2032 年 CAGR ≈ <span className="font-semibold text-foreground">5%</span>，燃气类仍为主流。主要国家为<span className="font-semibold text-foreground">德国、法国、意大利、西班牙、荷兰、英国</span>；销售旺季为每年 <span className="font-semibold text-foreground">9 月至次年 2 月</span>，与庭院 / 餐厅户外经营周期高度匹配。
        </p>
      </SectionCard>

      {/* 二、目标买家画像 */}
      <SectionCard icon={Users} title="二、目标买家画像">
        <p className="text-[10.5px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">采购商类型</p>
        <div className="space-y-1">
          {BUYERS.map((b) => (
            <div key={b.type} className="text-[11.5px] leading-snug">
              <span className="font-semibold text-foreground">{b.type}</span>
              <span className="text-muted-foreground"> · {b.example}</span>
              <span className="text-foreground/80"> — {b.feature}</span>
            </div>
          ))}
        </div>
        <p className="text-[10.5px] font-semibold text-muted-foreground mt-3 mb-1.5 uppercase tracking-wide">终端用户</p>
        <div className="space-y-1">
          {END_USER.map((u) => (
            <div key={u.tag} className="text-[11.5px] leading-snug">
              <span className="font-semibold text-foreground">{u.tag}</span>
              <span className="text-foreground/80"> — {u.desc}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 三、数据趋势 */}
      <SectionCard icon={TrendingUp} title="三、数据与关键词趋势">
        <TrendChart />

        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
          <div>
            <p className="text-[10.5px] font-semibold text-muted-foreground mb-1 flex items-center gap-1 uppercase tracking-wide">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              欧洲 Top 进口国
            </p>
            <div className="space-y-0.5">
              {TOP_MARKETS.map((m) => (
                <div key={m.c} className="flex items-center justify-between text-[11px]">
                  <span className="text-foreground/90">{m.c}</span>
                  <span className="text-muted-foreground tabular-nums">{m.v}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10.5px] font-semibold text-muted-foreground mb-1 flex items-center gap-1 uppercase tracking-wide">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              Google 关键词趋势
            </p>
            <div className="space-y-0.5">
              {KEYWORDS.map((k) => (
                <div key={k.word} className="flex items-center gap-1.5 text-[11px]">
                  <span className={`shrink-0 w-3 text-center font-bold ${k.trend === "↑" ? "text-primary" : "text-destructive"}`}>{k.trend}</span>
                  <span className="flex-1 truncate font-mono text-[10px] text-foreground/85">{k.word}</span>
                  <span className={`tabular-nums font-semibold ${k.trend === "↑" ? "text-primary" : "text-destructive"}`}>{k.chg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* 四、合规与认证壁垒 */}
      <SectionCard icon={ShieldCheck} title="四、合规与认证壁垒">
        <div className="space-y-1.5">
          {COMPLIANCE.map((c) => (
            <div key={c.mkt} className="text-[11.5px] leading-snug">
              <span className="font-semibold text-foreground">{c.mkt}</span>
              <span className="text-foreground/85"> · {c.cert}</span>
              <span className="text-muted-foreground"> — {c.extra}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 五、同行竞争者 */}
      <SectionCard icon={Target} title="五、同行竞争者">
        <div className="space-y-1.5">
          {COMPETITORS.map((c) => (
            <div key={c.type} className="text-[11.5px] leading-snug">
              <span className="font-semibold text-foreground">{c.type}</span>
              <span className="text-muted-foreground"> · {c.rep}</span>
              <div className="text-foreground/80 mt-0.5">
                客户：{c.clients}<span className="text-muted-foreground"> · 优势：</span>{c.trait}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 简单行动建议 */}
      <SectionCard icon={Lightbulb} title="简单行动建议">
        <div className="space-y-1.5">
          {ACTIONS.map((it) => (
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

export default MarketResearchResult;
