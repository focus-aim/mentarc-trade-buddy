import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquarePlus, PanelLeft, Archive, LogOut, SlidersHorizontal, Store, MessageSquare, FolderArchive } from "lucide-react";
import { cn } from "@/lib/utils";
import mentarcIcon from "@/assets/mentarc-icon.png";

interface AppSidebarProps {
  onNewTask: () => void;
  onBoardClick?: () => void;
  onPartnerClick?: () => void;
  onResultsClick?: () => void;
  onMarketClick?: () => void;
  onLogout?: () => void;
  partnerConfigured?: boolean;
  collapsed?: boolean;
  activeView?: "new" | "board" | "results" | "market";
}

const navItems = [
  { icon: MessageSquarePlus, label: "发起任务", key: "new" },
  { icon: FolderArchive, label: "任务成果", key: "results" },
];

const RECENT_CONVERSATIONS = [
  "保温啤酒杯阶梯报价询盘分析",
  "1000W Fat Tire 电助力车详情页生成",
  "TikTok 户外露营趋势采集",
  "美国市场 FDA 认证流程咨询",
  "买家 TechSol US 背调",
  "欧洲电助力自行车市场调研报告",
  "阿里国际站热门关键词挖掘",
];

const AppSidebar = ({ onNewTask, onBoardClick, onPartnerClick, onResultsClick, onMarketClick, onLogout, partnerConfigured = false, collapsed = false, activeView = "new" }: AppSidebarProps) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const partnerMetrics = [
    { label: "业务理解力", value: 3 },
    { label: "任务执行力", value: 1 },
  ];

  useEffect(() => {
    if (collapsed) setIsCollapsed(true);
  }, [collapsed]);

  if (isCollapsed) {
    return (
      <aside className="w-16 shrink-0 border-r border-border bg-sidebar-background flex flex-col h-screen items-center py-4 transition-all duration-300">
        <div className="relative w-9 h-9 mb-6 group">
           <button onClick={() => navigate("/")} className="w-9 h-9 rounded-lg overflow-hidden transition-opacity group-hover:opacity-0">
            <img src={mentarcIcon} alt="Mentarc" className="w-full h-full object-cover" />
          </button>
          <button
            onClick={() => setIsCollapsed(false)}
            className="absolute inset-0 w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all opacity-0 group-hover:opacity-100"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={item.key === "new" ? onNewTask : item.key === "board" ? onBoardClick : item.key === "results" ? onResultsClick : item.key === "market" ? onMarketClick : undefined}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-lg transition-colors",
                activeView === item.key
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={item.label}
            >
              <item.icon className="w-[18px] h-[18px]" />
            </button>
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <aside className="w-[284px] shrink-0 border-r border-border/70 bg-sidebar-background/95 backdrop-blur-sm flex flex-col h-screen transition-all duration-300">
      {/* Logo + collapse */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="px-5 pt-5 flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity focus-visible:outline-none"
        aria-label="返回贸探首页"
      >
        <img src={mentarcIcon} alt="贸探" className="h-7 w-7 rounded-lg" />
        <span className="text-xl font-bold">贸探</span>
      </button>

      <div
        role="button"
        tabIndex={0}
        onClick={onPartnerClick ?? (() => navigate("/"))}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            (onPartnerClick ?? (() => navigate("/")))();
          }
        }}
        className={cn("mx-4 mt-5 cursor-pointer rounded-2xl border px-4 py-4 text-foreground shadow-sm backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", partnerConfigured ? "border-primary/20 bg-gradient-to-br from-primary/10 via-card/80 to-accent/70 shadow-primary/10" : "border-border/70 bg-muted/45 shadow-primary/5")}
      >
        <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3 text-left transition-opacity">
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight text-foreground">AI团队档案</p>
            <p className={cn("mt-1 text-xs", partnerConfigured ? "text-success" : "text-muted-foreground")}>{partnerConfigured ? "运行中" : "待启动"}</p>
          </div>
        </div>
        <button
          onClick={(event) => {
            event.stopPropagation();
            setIsCollapsed(true);
          }}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
        </div>
        <div className="mt-4 space-y-3 text-left text-[13px]">
          {partnerConfigured ? (
            <>
              <div className="rounded-xl border border-success/15 bg-card/60 px-3 py-2 text-xs font-medium text-foreground">
                待关注：新增2条AI画像总结
              </div>
              <div className="space-y-2">
                {partnerMetrics.map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between gap-3 rounded-lg px-1 text-xs text-muted-foreground">
                    <span>{metric.label}</span>
                    <span className="flex items-center gap-1.5" aria-label={`${metric.label} ${metric.value}/4`}>
                      {[1, 2, 3, 4].map((dot) => (
                        <span key={dot} className={cn("h-1.5 w-1.5 rounded-full", dot <= metric.value ? "bg-success" : "bg-card")} />
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">简单设定，启动你的AI专家团队</span>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="px-5 pt-7 space-y-2">
        {navItems.map((item, i) => (
          <div key={item.key}>
            <button
              onClick={item.key === "new" ? onNewTask : item.key === "board" ? onBoardClick : item.key === "results" ? onResultsClick : item.key === "market" ? onMarketClick : undefined}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                activeView === item.key
                  ? "text-primary-foreground bg-primary shadow-md shadow-primary/20"
                  : "text-sidebar-foreground hover:bg-muted hover:text-foreground active:scale-[0.99]"
              )}
            >
              <item.icon className="w-[18px] h-[18px]" />
              <span>{item.label}</span>
            </button>
          </div>
        ))}
      </nav>

      <div className="px-5 pt-6 flex-1 overflow-hidden flex flex-col min-h-0">
        <p className="px-3 pb-2 text-xs font-semibold text-muted-foreground">最近会话</p>
        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-0.5 pr-1">
          {RECENT_CONVERSATIONS.map((title, idx) => (
            <button
              key={idx}
              className="w-full flex items-center px-3 py-2 rounded-lg text-left text-[13px] text-sidebar-foreground hover:bg-muted hover:text-foreground transition-colors"
              title={title}
            >
              <span className="truncate">{title}</span>
            </button>
          ))}
        </div>
      </div>
      <button onClick={onLogout} className="mt-auto mx-5 mb-5 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-sidebar-foreground hover:bg-muted hover:text-foreground transition-colors">
        <LogOut className="w-[18px] h-[18px]" />
        退出登录
      </button>
    </aside>
  );
};

export default AppSidebar;
