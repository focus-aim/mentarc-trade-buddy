import { useState } from "react";
import { ChevronDown, X, Copy, Check, MessageSquareQuote } from "lucide-react";
import type { ChatQuote } from "./InquiryResultMessage";

interface OperationResultMessageProps {
  onAction?: (action: string) => void;
  onQuote?: (quote: ChatQuote) => void;
  onSendPrompt?: (text: string) => void;
  expertAvatar?: string;
  /** 营销素材任务隐藏产品详情描述模块 */
  hideDescription?: boolean;
}

const PRODUCT_COPY = `标题：
40oz Double Wall Vacuum Insulated Beer Tumbler | Premium 304 Stainless Steel | Keep Cold 24H & Hot 12H | Sweat-Proof & Spill-Resistant Design

五点描述：
• DOUBLE WALL VACUUM INSULATION — Advanced copper-lined thermal technology maintains ice-cold beer for 24 hours or piping hot beverages for 12 hours. Say goodbye to lukewarm drinks.

• PREMIUM 304 STAINLESS STEEL — Food-grade, BPA-free interior resists flavor transfer and staining. Your craft beer tastes exactly as the brewer intended, sip after sip.

• SWEAT-PROOF EXTERIOR — Condensation-free outer wall keeps hands dry and surfaces ring-free. No more soggy coasters or slippery grips.

• SPILL-RESISTANT LID — Magnetic slider closure seals tight for confident carrying. Designed for tailgates, camping, backyard BBQs, and everyday use.

• EFFORTLESS CLEANING — Wide-mouth 40oz capacity fits ice cubes easily and allows thorough hand washing. Dishwasher-safe lid for ultimate convenience.

产品描述：
Elevate your drinking experience with our 40oz Double Wall Vacuum Insulated Beer Tumbler. Crafted from premium 304 stainless steel with a copper-lined vacuum layer, this tumbler delivers unmatched thermal performance — keeping your favorite craft beer ice-cold for a full 24 hours.

The sweat-proof exterior eliminates condensation, protecting your furniture and ensuring a confident, slip-free grip. Whether you're hosting a backyard BBQ, tailgating at the big game, or simply relaxing on the patio, this tumbler is built for every occasion.`;

const MOCK_MAIN_IMAGES = [
  "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&h=300&fit=crop",
];

const ImageLightbox = ({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
    <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
      <X className="w-6 h-6" />
    </button>
    <img src={src} alt={alt} className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
  </div>
);

const ImageGrid = ({ images, label }: { images: string[]; label: string }) => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((src, i) => (
          <div
            key={i}
            onClick={() => setLightboxSrc(src)}
            className="w-[120px] h-[120px] shrink-0 rounded-xl overflow-hidden border border-border bg-muted/30 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img src={src} alt={`${label} ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      {lightboxSrc && <ImageLightbox src={lightboxSrc} alt={label} onClose={() => setLightboxSrc(null)} />}
    </>
  );
};

const OperationResultMessage = ({ onQuote, onSendPrompt, expertAvatar, hideDescription }: OperationResultMessageProps) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleQuote = (moduleName: string, content: string) => {
    onQuote?.({
      moduleName,
      preview: content.slice(0, 20) + (content.length > 20 ? "…" : ""),
      fullContent: content,
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(PRODUCT_COPY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 text-base leading-relaxed">
      {/* Expert header */}
      <div className="flex items-center gap-2">
        {expertAvatar && (
          <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
            <img src={expertAvatar} alt="运营专家" className="w-full h-full object-cover object-top" />
          </div>
        )}
        <span className="font-semibold text-foreground text-[14px]">AI专家指点</span>
      </div>

      <p className="text-foreground/85 text-base leading-relaxed">
        B端采购商最关注"采购成本、售后保障、终端适销性"。详情页须明确标注：①阶梯报价（样品/小批量/整柜）；②认证齐全（CE、ROHS、EN15194）；③定制能力（贴牌、配色、电池容量可选）。主图首张用白底加参数标签，第二张展示沙滩/雪地商用场景，视频呈现电池插拔与装柜实拍。用实测续航与承重数据打消顾虑，让采购商放心询盘。
      </p>

      {/* 产品详情描述（营销素材任务隐藏） */}
      {!hideDescription && (
        <div className="border border-border rounded-xl overflow-hidden bg-muted/30">
          <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
            <span className="font-medium text-foreground text-sm">产品详情描述</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleQuote("产品详情描述", PRODUCT_COPY)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="追问"
              >
                <MessageSquareQuote className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title={copied ? "已复制" : "复制"}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div className={`relative ${expanded ? "" : "max-h-[160px] overflow-hidden"}`}>
            <pre className="whitespace-pre-wrap text-[13px] text-foreground/90 leading-relaxed px-4 py-3 font-sans">
              {PRODUCT_COPY}
            </pre>
            {!expanded && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-muted/80 to-transparent" />
            )}
          </div>
          {!expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="w-full flex items-center justify-center gap-1 px-4 py-2 text-xs text-primary font-medium hover:bg-muted/50 transition-colors active:scale-[0.995] border-t border-border/60"
            >
              展开全部
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      <div className="space-y-2">
        <span className="font-medium text-foreground text-sm">产品主图</span>
        <ImageGrid images={MOCK_MAIN_IMAGES} label="产品主图" />
      </div>

      <div className="border-t border-border/60 pt-4 text-[13px] text-foreground/85 leading-relaxed space-y-2">
        <p>我已经为您生成产品的详情文案和描述，接下来您可以：</p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onSendPrompt?.("结合以上产品特性，生成产品详情图片")}
            className="text-left text-primary text-[13px] hover:text-primary/80 hover:underline transition-colors"
          >
            结合以上产品特性，生成产品详情图片
          </button>
          <button
            onClick={() => onSendPrompt?.("优化并生成更多产品场景图")}
            className="text-left text-primary text-[13px] hover:text-primary/80 hover:underline transition-colors"
          >
            优化并生成更多产品场景图
          </button>
        </div>
      </div>
    </div>
  );
};

export default OperationResultMessage;
