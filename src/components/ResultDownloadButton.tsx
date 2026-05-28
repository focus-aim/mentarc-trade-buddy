import { useState } from "react";
import { Download, FileImage, FileCode, FileText as FileTextIcon, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toPng } from "html-to-image";
import { useToast } from "@/hooks/use-toast";

interface ResultDownloadButtonProps {
  /** Returns the DOM node currently rendering the result. Called lazily on click. */
  getTargetNode: () => HTMLElement | null;
  /** A short label describing the current result, used in the file name. */
  label: string;
  /** Whether there's any result available to download. */
  disabled?: boolean;
}

const sanitize = (s: string) =>
  s
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 60) || "result";

const triggerDownload = (blob: Blob | string, filename: string, mime?: string) => {
  const url =
    typeof blob === "string"
      ? URL.createObjectURL(new Blob([blob], { type: mime || "text/plain;charset=utf-8" }))
      : URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
};

const buildHtmlDoc = (innerHtml: string, title: string) => {
  // Inline the current page's stylesheets so the exported file renders consistently.
  const styleTags = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((el) => el.outerHTML)
    .join("\n");
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${title}</title>
${styleTags}
<style>
  body { margin: 0; padding: 32px; background: hsl(210, 33%, 98.5%); font-family: ui-sans-serif, system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif; }
  .export-shell { max-width: 880px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 28px; box-shadow: 0 8px 30px rgba(0,0,0,0.06); }
  .export-header { font-size: 18px; font-weight: 700; margin-bottom: 16px; color: #0f172a; }
  .export-meta { font-size: 12px; color: #64748b; margin-bottom: 20px; }
</style>
</head>
<body>
  <div class="export-shell">
    <div class="export-header">${title}</div>
    <div class="export-meta">Mentarc · 导出于 ${new Date().toLocaleString("zh-CN")}</div>
    ${innerHtml}
  </div>
</body>
</html>`;
};

const htmlToText = (html: string): string => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  // Insert line breaks for block-level elements before extracting text
  tmp.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
  tmp.querySelectorAll("p, div, li, h1, h2, h3, h4, h5, h6, tr").forEach((el) => {
    el.append("\n");
  });
  tmp.querySelectorAll("li").forEach((el) => {
    el.prepend("• ");
  });
  return tmp.innerText.replace(/\n{3,}/g, "\n\n").trim();
};

const ResultDownloadButton = ({ getTargetNode, label, disabled }: ResultDownloadButtonProps) => {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const filenameBase = `${sanitize(label || "result")}_${new Date()
    .toISOString()
    .slice(0, 10)}`;

  const handlePng = async () => {
    const node = getTargetNode();
    if (!node) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(node, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        cacheBust: true,
        // Skip cross-origin images that fail to load instead of throwing
        filter: (n) => {
          if (n instanceof HTMLElement && n.dataset?.exportIgnore === "true") return false;
          return true;
        },
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      triggerDownload(blob, `${filenameBase}.png`);
      toast({ title: "图片已下载", description: `${label}.png` });
    } catch (e) {
      console.error(e);
      toast({ title: "图片导出失败", description: "请稍后重试或改用 HTML 导出", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const handleHtml = () => {
    const node = getTargetNode();
    if (!node) return;
    try {
      const doc = buildHtmlDoc(node.innerHTML, label || "导出结果");
      triggerDownload(doc, `${filenameBase}.html`, "text/html;charset=utf-8");
      toast({ title: "HTML 已下载", description: `${label}.html` });
    } catch (e) {
      console.error(e);
      toast({ title: "HTML 导出失败", variant: "destructive" });
    }
  };

  const handleText = () => {
    const node = getTargetNode();
    if (!node) return;
    try {
      const text = `${label || "导出结果"}\n导出时间：${new Date().toLocaleString("zh-CN")}\n\n${htmlToText(node.innerHTML)}`;
      triggerDownload(text, `${filenameBase}.txt`, "text/plain;charset=utf-8");
      toast({ title: "文本已下载", description: `${label}.txt` });
    } catch (e) {
      console.error(e);
      toast({ title: "文本导出失败", variant: "destructive" });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={disabled || busy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-3 py-1.5 text-[11.5px] font-semibold text-foreground/85 transition-all hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          title={disabled ? "暂无可下载的结果" : "下载当前结果"}
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
          下载
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-[11px] text-muted-foreground font-normal">
          导出当前结果
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handlePng} className="gap-2 text-[13px]">
          <FileImage className="h-4 w-4 text-primary" />
          <div className="flex flex-col">
            <span>图片 (PNG)</span>
            <span className="text-[10.5px] text-muted-foreground">原样截图</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleHtml} className="gap-2 text-[13px]">
          <FileCode className="h-4 w-4 text-primary" />
          <div className="flex flex-col">
            <span>网页 (HTML)</span>
            <span className="text-[10.5px] text-muted-foreground">保留排版样式</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleText} className="gap-2 text-[13px]">
          <FileTextIcon className="h-4 w-4 text-primary" />
          <div className="flex flex-col">
            <span>纯文本 (TXT)</span>
            <span className="text-[10.5px] text-muted-foreground">仅文字内容</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ResultDownloadButton;
