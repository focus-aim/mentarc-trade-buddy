import { useRef } from "react";
import { ImagePlus } from "lucide-react";

interface UploadPromptMessageProps {
  onImagesUploaded: (images: string[]) => void;
}

const UploadPromptMessage = ({ onImagesUploaded }: UploadPromptMessageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        newImages.push(URL.createObjectURL(file));
      }
    });
    if (newImages.length > 0) {
      onImagesUploaded(newImages);
    }
    e.target.value = "";
  };

  return (
    <div className="space-y-3 text-sm leading-relaxed">
      <p className="text-foreground">
        为了更好地生成符合您要求的产品展示效果，请提供1-2张产品原图。收到后我会继续下一步任务。
      </p>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary text-primary text-xs font-medium hover:bg-primary/5 transition-colors active:scale-95"
      >
        <ImagePlus className="w-3.5 h-3.5" />
        上传图片
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default UploadPromptMessage;
