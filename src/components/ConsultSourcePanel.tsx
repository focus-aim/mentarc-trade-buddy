const TAGS = ["市场趋势", "产品机会", "平台运营", "客户沟通", "多渠道推广", "贸易合规"];

const ConsultSourcePanel = () => {
  return (
    <div className="px-6 pb-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 rounded-full bg-primary" />
        <h3 className="text-sm font-medium text-foreground">能力模块</h3>
      </div>

      <div className="rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-sm font-medium text-foreground">AI外贸专家能力已加载</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            就绪
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-primary bg-primary/5 border border-primary/15"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsultSourcePanel;
