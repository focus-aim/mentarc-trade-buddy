import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquarePlus, Archive, FolderArchive, Users, Monitor, Download, PanelLeftOpen, Briefcase, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import mentarcIcon from "@/assets/mentarc-icon.png";

interface AppSidebarProps {
  onNewTask: () => void;
  onBoardClick?: () => void;
  onResultsClick?: () => void;
  onMarketClick?: () => void;
  collapsed?: boolean;
  activeView?: "new" | "board" | "results" | "market";
}

const topNavItems = [
  { icon: MessageSquarePlus, label: "发起任务", key: "new" },
];

const businessAssets = {
  icon: Briefcase,
  label: "业务资产",
  key: "assets",
  children: [
    { icon: FolderArchive, label: "买家档案", key: "results" },
    { icon: Archive, label: "资源管理", key: "board" },
  ],
};

const bottomNavItems = [
  { icon: Users, label: "专家&连接器", key: "market" },
];

const RECENT_CONVERSATIONS = [
  "南美买家 TechSol US Renewable",
  "中东商用健身房连锁 Desert Gym",
  "询盘分析 1000W Fat Tire",
  "商用动感单车营销素材",
];

const AppSidebar = ({ onNewTask, onBoardClick, onResultsClick, onMarketClick, collapsed = false, activeView = "new" }: AppSidebarProps) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (collapsed) setIsCollapsed(true);
  }, [collapsed]);

  if (isCollapsed) {
    return (
      <aside className="w-16 shrink-0 border-r border-border bg-sidebar-background flex flex-col h-screen items-center py-4 transition-all duration-300">
        <div className="relative group">
          <button onClick={() => navigate("/")} className="w-9 h-9 rounded-lg overflow-hidden hover:opacity-80 transition-opacity" aria-label="返回贸探首页">
            <img src={mentarcIcon} alt="贸探" className="w-full h-full object-cover" />
          </button>
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className={cn(
              "absolute -right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-primary text-primary-foreground shadow-sm",
              "flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              "hover:bg-primary/90 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label="展开侧边栏"
            title="展开侧边栏"
          >
            <PanelLeftOpen className="w-3 h-3" />
          </button>
        </div>
        <nav className="mt-6 space-y-1">
          {topNavItems.map((item) => (
            <button
              key={item.key}
              onClick={item.key === "new" ? onNewTask : undefined}
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
          <button
            onClick={() => {
              setAssetsOpen(true);
              setIsCollapsed(false);
            }}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-lg transition-colors",
              activeView === "results" || activeView === "board"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title={businessAssets.label}
          >
            <businessAssets.icon className="w-[18px] h-[18px]" />
          </button>
          {bottomNavItems.map((item) => (
            <button
              key={item.key}
              onClick={item.key === "market" ? onMarketClick : undefined}
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

  const [assetsOpen, setAssetsOpen] = useState(activeView === "results" || activeView === "board");

  return (
    <aside className="w-[284px] shrink-0 border-r border-border/70 bg-sidebar-background/95 backdrop-blur-sm flex flex-col h-screen transition-all duration-300">
      {/* Logo + PC client */}
      <div className="px-5 pt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity focus-visible:outline-none"
          aria-label="返回贸探首页"
        >
          <img src={mentarcIcon} alt="贸探" className="h-7 w-7 rounded-lg" />
          <span className="text-xl font-bold">贸探</span>
        </button>
        <button
          type="button"
          className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="下载客户端"
        >
          <Monitor className="w-5 h-5" />
        </button>
      </div>

      {/* AI Profile Card */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="mx-4 mt-4 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-sm px-4 py-3 text-left transition-all hover:border-primary/30 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <div className="flex items-center gap-2.5">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground truncate">AI档案：宁波启明智能科技</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              企业知识 <span className="font-medium text-foreground">128</span> 份 · 团队经验 <span className="font-medium text-foreground">56</span> 份
            </p>
          </div>
        </div>
      </button>

      {/* Nav */}
      <nav className="px-5 pt-5 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={item.key === "new" ? onNewTask : item.key === "board" ? onBoardClick : item.key === "results" ? onResultsClick : item.key === "market" ? onMarketClick : undefined}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
              activeView === item.key
                ? "bg-muted text-foreground"
                : "text-sidebar-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <item.icon className="w-[18px] h-[18px]" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Recent conversations */}
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

      {/* Footer */}
      <div className="px-5 pb-5 pt-3 space-y-3">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-border/70 bg-card/60 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Download className="w-4 h-4" />
          下载客户端
        </button>
        <div className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">MC</div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">Mentarc</p>
            <p className="text-xs text-muted-foreground">1,280 点</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
