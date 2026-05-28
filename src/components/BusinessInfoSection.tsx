import { useState } from "react";
import { Check, Circle, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface BusinessInfo {
  mainProducts: string;
  businessIntro: string;
  website: string;
}

const BusinessInfoSection = () => {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    mainProducts: "不锈钢保温杯、玻璃水杯、运动水壶",
    businessIntro: "专注饮水容器出口15年，年产能500万件",
    website: "",
  });
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<BusinessInfo>({ mainProducts: "", businessIntro: "", website: "" });

  const hasIncomplete = !businessInfo.mainProducts || !businessInfo.businessIntro || !businessInfo.website;

  return (
    <div className="px-6 py-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 rounded-full bg-primary" />
        <h3 className="text-[15px] font-semibold text-foreground">我的业务信息</h3>
      </div>

      <button
        onClick={() => {
          setEditing({ ...businessInfo });
          setShowDialog(true);
        }}
        className="w-full text-left group rounded-xl border border-border p-4 hover:border-primary/30 hover:bg-muted/40 transition-colors active:scale-[0.98]"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] font-medium text-foreground">公司基本信息</span>
          {hasIncomplete ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-colors">
              <span className="group-hover:hidden">待完善</span>
               <span className="hidden group-hover:inline">重新训练</span>
              <Pencil className="w-3 h-3 hidden group-hover:block" />
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              <Pencil className="w-3 h-3" />
              重新训练
            </span>
          )}
        </div>
        <div className="space-y-2">
          {[
            { label: "主营产品", value: businessInfo.mainProducts },
            { label: "业务介绍", value: businessInfo.businessIntro },
            { label: "公司网址", value: businessInfo.website },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              {item.value ? (
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
              )}
              <span className="text-[13px] text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </button>

      {/* 历史会话和长记忆 */}
      <div className="mt-3 rounded-xl border border-border p-4">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-foreground">会话学习和长记忆</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            生效中
          </span>
        </div>
        <p className="text-[13px] text-muted-foreground mt-2">
          AI 持续记录和学习你的偏好
        </p>
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>重新训练公司基本信息</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-[14px] font-medium text-foreground mb-1.5 block">主营产品</label>
              <input
                value={editing.mainProducts}
                onChange={(e) => setEditing({ ...editing, mainProducts: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                placeholder="例如：不锈钢保温杯、玻璃水杯"
              />
            </div>
            <div>
              <label className="text-[14px] font-medium text-foreground mb-1.5 block">业务介绍</label>
              <textarea
                value={editing.businessIntro}
                onChange={(e) => setEditing({ ...editing, businessIntro: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                placeholder="简要描述公司业务和优势"
              />
            </div>
            <div>
              <label className="text-[14px] font-medium text-foreground mb-1.5 block">公司网址</label>
              <input
                value={editing.website}
                onChange={(e) => setEditing({ ...editing, website: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                placeholder="https://www.example.com"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors active:scale-95"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setBusinessInfo({ ...editing });
                  setShowDialog(false);
                }}
                className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors active:scale-95"
              >
                保存
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessInfoSection;