import { Clock, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HistoryItem {
  title: string;
  module: string;
  time: string;
}

const RECENT_CONVERSATIONS: HistoryItem[] = [
  { title: "保温啤酒杯阶梯报价询盘分析", module: "业务专家", time: "今天 10:24" },
  { title: "1000W Fat Tire 电助力车详情页生成", module: "运营专家", time: "今天 09:12" },
  { title: "TikTok 户外露营趋势采集", module: "市场专家", time: "昨天 18:40" },
  { title: "美国市场 FDA 认证流程咨询", module: "培训专家", time: "昨天 15:02" },
  { title: "买家 TechSol US 背调", module: "业务专家", time: "昨天 11:28" },
  { title: "欧洲电助力自行车市场调研报告", module: "市场专家", time: "前天 16:45" },
  { title: "阿里国际站热门关键词挖掘", module: "运营专家", time: "前天 10:08" },
];

const HistoryDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus:outline-none"
          aria-label="历史对话"
          title="历史对话"
        >
          <Clock className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-80 p-0 overflow-hidden rounded-2xl border-border/60 bg-card/95 backdrop-blur-md shadow-lg animate-fade-in"
      >
        <div className="px-4 py-3 border-b border-border/60 bg-gradient-to-r from-primary/5 to-secondary/5">
          <p className="text-[13px] font-bold text-foreground">最近对话</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            共 {RECENT_CONVERSATIONS.length} 条 · 点击任意记录继续对话
          </p>
        </div>
        <div className="max-h-[360px] overflow-y-auto scrollbar-thin py-1">
          {RECENT_CONVERSATIONS.map((item, idx) => (
            <button
              key={idx}
              className="w-full px-4 py-2.5 flex items-start gap-3 hover:bg-muted/60 transition-colors text-left group"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                <MessageSquare className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-medium text-foreground truncate">
                  {item.title}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground">
                    {item.module}
                  </span>
                  <span>{item.time}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HistoryDropdown;
