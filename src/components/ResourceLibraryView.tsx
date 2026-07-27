import { useState } from "react";
import { FileSpreadsheet, FileText, FileCode2, Download } from "lucide-react";

type ResFile = { name: string; type: "xlsx" | "docx" | "pdf" | "code"; size: string; session: string; date: string };
type ResImage = { url: string; name: string; session: string; date: string };

const FILES: ResFile[] = [
  { name: "外贸报价单模板.xlsx", type: "xlsx", size: "42 KB", session: "德国买家询盘跟进", date: "2026-07-20" },
  { name: "Bergmann 询盘分析报告.pdf", type: "pdf", size: "1.2 MB", session: "德国买家询盘跟进", date: "2026-07-19" },
  { name: "保温杯产品详情文案.docx", type: "docx", size: "88 KB", session: "产品详情页生成", date: "2026-07-15" },
  { name: "negotiation-scripts.md", type: "code", size: "12 KB", session: "价格谈判策略", date: "2026-07-12" },
];

const IMAGES: ResImage[] = [
  { url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop", name: "产品海报主图", session: "产品详情页生成", date: "2026-07-15" },
  { url: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=300&h=300&fit=crop", name: "细节参数图", session: "产品详情页生成", date: "2026-07-15" },
  { url: "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=300&h=300&fit=crop", name: "场景效果图", session: "产品详情页生成", date: "2026-07-15" },
  { url: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&h=300&fit=crop", name: "同行参考图", session: "市场分析", date: "2026-07-10" },
];

const ICONS = {
  xlsx: { icon: FileSpreadsheet, tone: "text-emerald-600 bg-emerald-50" },
  pdf: { icon: FileText, tone: "text-rose-600 bg-rose-50" },
  docx: { icon: FileText, tone: "text-primary bg-primary/10" },
  code: { icon: FileCode2, tone: "text-foreground bg-muted" },
} as const;

const ResourceLibraryView = () => {
  const [tab, setTab] = useState<"file" | "image">("file");

  return (
    <main className="flex-1 h-screen overflow-y-auto scrollbar-thin bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-foreground">资源管理</h1>
        <p className="mt-2 text-sm text-muted-foreground">历史会话中产出的文件与图片，按类型统一归档。</p>

        <div className="mt-6 flex items-center gap-1 rounded-full border border-border/60 bg-card/80 p-1 backdrop-blur-sm w-fit">
          {([
            { key: "file", label: `文件（${FILES.length}）` },
            { key: "image", label: `图片（${IMAGES.length}）` },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-1.5 text-[13px] transition-colors ${
                tab === t.key ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "file" ? (
          <div className="mt-5 divide-y divide-border/60 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm">
            {FILES.map((f) => {
              const { icon: Icon, tone } = ICONS[f.type];
              return (
                <div key={f.name} className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] text-foreground">{f.name}</p>
                    <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                      来自「{f.session}」 · {f.date} · {f.size}
                    </p>
                  </div>
                  <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors" aria-label="下载">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {IMAGES.map((img) => (
              <figure key={img.name + img.url} className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm">
                <img src={img.url} alt={img.name} loading="lazy" className="h-32 w-full object-cover" />
                <figcaption className="px-3 py-2.5">
                  <p className="truncate text-[13px] text-foreground">{img.name}</p>
                  <p className="mt-0.5 truncate text-[12px] text-muted-foreground">{img.session} · {img.date}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ResourceLibraryView;
