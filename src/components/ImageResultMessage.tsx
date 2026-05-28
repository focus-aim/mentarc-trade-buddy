import { ArrowRight } from "lucide-react";

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&h=300&fit=crop",
];

interface ImageResultMessageProps {
  onAction?: (action: string) => void;
}

const ImageResultMessage = ({ onAction }: ImageResultMessageProps) => {
  return (
    <div className="space-y-3 text-base leading-relaxed">
      <p className="text-foreground">
        好的，亚马逊等电商平台的产品主图通常采用：白底图 + 场景图 + 多角度细节图，已为您结合同行图片优点，生成如下结果：
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {MOCK_IMAGES.map((src, i) => (
          <div
            key={i}
            className="w-[140px] h-[140px] shrink-0 rounded-xl overflow-hidden border border-border bg-muted/30"
          >
            <img
              src={src}
              alt={`产品主图 ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="space-y-2.5 pt-1">
        <p className="font-medium text-foreground">我还可以进一步帮您：</p>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => onAction?.("生成产品详情图")}
            className="inline-flex items-center gap-1 w-fit px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/15 transition-colors active:scale-95"
          >
            生成产品详情图
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button className="inline-flex items-center gap-1 w-fit px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/15 transition-colors active:scale-95">
            优化产品标题与关键词
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageResultMessage;
