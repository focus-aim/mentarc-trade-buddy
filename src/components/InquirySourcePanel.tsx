import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InquirySourcePanelProps {
  analyzed: boolean;
}

const MOCK_DATA = {
  status: "已解析",
  subject: "Inquiry for Double Wall Insulated Beer Mug",
  buyer: "Michael Schneider · Bergmann Home Supplies GmbH · 德国",
  focus: "服务交期 + 质量认证 + 价格",
};

const InquirySourcePanel = ({ analyzed }: InquirySourcePanelProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="px-6 pb-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 rounded-full bg-primary" />
        <h3 className="text-sm font-medium text-foreground">询盘内容解析</h3>
        <span
          className={`ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            analyzed
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
          }`}
        >
          {analyzed ? MOCK_DATA.status : "待提供"}
        </span>
      </div>

      <div
        className={`space-y-4 ${analyzed ? "cursor-pointer rounded-xl px-3 py-3 -mx-3 hover:bg-muted/50 transition-colors" : ""}`}
        onClick={() => analyzed && setDialogOpen(true)}
      >
        <div>
          <span className="text-[13px] text-muted-foreground">询盘主题</span>
          {analyzed ? (
            <p className="text-[13px] mt-1 truncate text-foreground">{MOCK_DATA.subject}</p>
          ) : (
            <div className="h-3.5 w-3/4 rounded bg-muted animate-pulse mt-1" />
          )}
        </div>

        <div>
          <span className="text-[13px] text-muted-foreground">买家信息</span>
          {analyzed ? (
            <p className="text-[13px] mt-1 truncate text-foreground">{MOCK_DATA.buyer}</p>
          ) : (
            <div className="h-3.5 w-2/3 rounded bg-muted animate-pulse mt-1" />
          )}
        </div>

        <div>
          <span className="text-[13px] text-muted-foreground">核心关注点</span>
          {analyzed ? (
            <p className="text-[13px] mt-1 truncate text-foreground">{MOCK_DATA.focus}</p>
          ) : (
            <div className="h-3.5 w-1/2 rounded bg-muted animate-pulse mt-1" />
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">询盘内容解析</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <span className="text-[13px] font-medium text-muted-foreground">询盘主题</span>
              <p className="text-sm text-foreground mt-1 leading-relaxed">{MOCK_DATA.subject}</p>
            </div>
            <div>
              <span className="text-[13px] font-medium text-muted-foreground">买家信息</span>
              <p className="text-sm text-foreground mt-1 leading-relaxed">{MOCK_DATA.buyer}</p>
            </div>
            <div>
              <span className="text-[13px] font-medium text-muted-foreground">核心关注点</span>
              <p className="text-sm text-foreground mt-1 leading-relaxed">{MOCK_DATA.focus}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InquirySourcePanel;
