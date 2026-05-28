import { useState } from "react";
import { ChevronDown } from "lucide-react";

const MOCK_FIELDS = [
  { label: "产品名称", value: "不锈钢真空保温杯 500ml" },
  { label: "产品材质", value: "食品级304不锈钢，双层真空结构" },
  { label: "产品规格", value: "容量 500ml，口径 6.5cm，高度 22cm" },
  { label: "核心卖点", value: "12小时长效保温，防漏设计，可定制Logo" },
  { label: "参考报价", value: "FOB $4.80–$5.60 / pc（MOQ 1,000）" },
];

const ProductMaterialSection = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-6 py-5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 group"
      >
        <div className="w-1 h-4 rounded-full bg-primary" />
        <h3 className="text-[15px] font-semibold text-foreground">产品信息素材</h3>
        <ChevronDown
          className={`w-4 h-4 ml-auto text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${expanded ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"}`}
      >
        <div className="space-y-3">
          {MOCK_FIELDS.map((field) => (
            <div key={field.label}>
              <span className="text-[13px] text-muted-foreground">{field.label}</span>
              <p className="text-[13px] text-foreground mt-0.5">{field.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductMaterialSection;
