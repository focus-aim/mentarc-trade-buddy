import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { ArrowRight } from "lucide-react";

interface DetailTypeSelectorProps {
  onSubmit: (types: string[]) => void;
}

const DETAIL_TYPES = [
  {
    id: "poster",
    label: "产品海报主图",
    desc: "突出产品卖点与品牌调性，适用于首图或广告投放素材",
  },
  {
    id: "spec",
    label: "产品细节参数图",
    desc: "清晰展示产品尺寸、材质、功能等关键参数信息",
  },
  {
    id: "scene",
    label: "多场景效果图",
    desc: "模拟产品在不同使用场景中的真实效果，提升购买代入感",
  },
];

const DetailTypeSelector = ({ onSubmit }: DetailTypeSelectorProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-3 text-sm leading-relaxed">
      <p className="text-foreground">
        请选择您需要生成的详情图类型（可多选）：
      </p>
      <div className="space-y-2">
        {DETAIL_TYPES.map((type) => (
          <label
            key={type.id}
            className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
              selected.includes(type.id)
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/30 hover:bg-muted/50"
            }`}
            onClick={() => toggle(type.id)}
          >
            <Checkbox
              checked={selected.includes(type.id)}
              className="mt-0.5"
              onCheckedChange={() => {}}
            />
            <div>
              <span className="font-medium text-foreground">{type.label}</span>
              <p className="text-xs text-muted-foreground mt-0.5">{type.desc}</p>
            </div>
          </label>
        ))}
      </div>
      <button
        disabled={selected.length === 0}
        onClick={() => {
          const labels = DETAIL_TYPES.filter((t) => selected.includes(t.id)).map((t) => t.label);
          onSubmit(labels);
        }}
        className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
      >
        开始生成
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default DetailTypeSelector;
