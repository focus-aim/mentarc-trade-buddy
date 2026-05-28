import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OperationSourcePanelProps {
  analyzed: boolean;
  images?: string[];
  onImagesChange?: (images: string[]) => void;
}

const MOCK_DATA = {
  status: "已解析",
  productName: "不锈钢真空保温杯 500ml",
  peerReference: "https://www.example.com/product/12345",
  myProductInfo: "不锈钢双层真空保温杯，容量500ml，食品级304不锈钢",
};


const OperationSourcePanel = ({ analyzed, images = [], onImagesChange }: OperationSourcePanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        newImages.push(url);
      }
    });
    onImagesChange?.([...images, ...newImages]);
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    onImagesChange?.(images.filter((_, i) => i !== index));
  };

  return (
    <div className="px-6 pb-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 rounded-full bg-primary" />
        <h3 className="text-[15px] font-semibold text-foreground">产品信息素材</h3>
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
        {/* 产品名称 */}
        <div>
          <span className="text-[13px] text-muted-foreground">产品名称</span>
          {analyzed ? (
            <p className="text-[13px] mt-1 truncate text-foreground">{MOCK_DATA.productName}</p>
          ) : (
            <div className="h-3.5 w-1/2 rounded bg-muted animate-pulse mt-1" />
          )}
        </div>

        {/* 同行产品参考 */}
        <div>
          <span className="text-[13px] text-muted-foreground">同行产品参考</span>
          {analyzed ? (
            <p className="text-[13px] mt-1 truncate text-foreground">{MOCK_DATA.peerReference}</p>
          ) : (
            <div className="h-3.5 w-2/3 rounded bg-muted animate-pulse mt-1" />
          )}
        </div>

        {/* 我的产品信息 */}
        <div>
          <span className="text-[13px] text-muted-foreground">我的产品信息</span>
          {analyzed ? (
            <p className="text-[13px] mt-1 truncate text-foreground">{MOCK_DATA.myProductInfo}</p>
          ) : (
            <div className="h-3.5 w-3/4 rounded bg-muted animate-pulse mt-1" />
          )}
        </div>
      </div>

      {/* 产品原图 - 独立区块，始终支持上传 */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-muted-foreground">产品原图</span>
        </div>
        {images.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {images.map((src, i) => (
              <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-border group">
                <img src={src} alt={`产品图${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">产品信息素材</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <span className="text-[13px] font-medium text-muted-foreground">产品名称</span>
              <p className="text-[14px] text-foreground mt-1 leading-relaxed">{MOCK_DATA.productName}</p>
            </div>
            <div>
              <span className="text-[13px] font-medium text-muted-foreground">同行产品参考</span>
              <p className="text-[14px] text-foreground mt-1 leading-relaxed break-all">{MOCK_DATA.peerReference}</p>
            </div>
            <div>
              <span className="text-[13px] font-medium text-muted-foreground">我的产品信息</span>
              <p className="text-[14px] text-foreground mt-1 leading-relaxed">{MOCK_DATA.myProductInfo}</p>
            </div>
            {images.length > 0 && (
              <div>
                <span className="text-[13px] font-medium text-muted-foreground">产品原图</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {images.map((src, i) => (
                    <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                      <img src={src} alt={`产品图${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OperationSourcePanel;