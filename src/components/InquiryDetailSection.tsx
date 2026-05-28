import { useState } from "react";
import { ChevronDown } from "lucide-react";

const MOCK_FIELDS = [
  { label: "询盘主题", value: "Inquiry for Double Wall Insulated Beer Mug" },
  { label: "买家信息", value: "Michael Schneider · Bergmann Home Supplies GmbH · 德国" },
  { label: "产品需求", value: "500ml 双层不锈钢啤酒杯，需定制 Logo" },
  { label: "目标价格", value: "FOB $3.50–$4.20 / pc" },
  { label: "预估数量", value: "5,000 pcs（首单试单）" },
];

const InquiryDetailSection = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-6 py-5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 group"
      >
        <div className="w-1 h-4 rounded-full bg-primary" />
        <h3 className="text-[15px] font-semibold text-foreground">询盘详情解析</h3>
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

export default InquiryDetailSection;
