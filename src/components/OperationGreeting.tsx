

const EXAMPLES = [
  {
    label: "复刻产品风格，生成全套产品详情图文",
    prompt: "帮我复刻这个产品风格，生成全套产品详情图文",
    type: "prefill" as const,
  },
  {
    label: "过程示例",
    prompt: "",
    type: "demo" as const,
  },
];

interface OperationGreetingProps {
  onPrefill: (text: string) => void;
  onStartDemo?: () => void;
}

const OperationGreeting = ({ onPrefill, onStartDemo }: OperationGreetingProps) => {
  return (
    <div className="text-[15px] leading-relaxed space-y-3">
      <p className="text-foreground">我可以帮你复刻一个同行产品，并直接生成可用素材。</p>
      <p className="text-foreground/80">你提供产品，我帮你输出：</p>
      <p className="text-foreground font-medium">详情文案、主图 &amp; 海报</p>
      <p className="text-muted-foreground text-[13px]">👇 点击示例快速开始：</p>
      <div className="flex flex-col gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            onClick={() => ex.type === "demo" ? onStartDemo?.() : onPrefill(ex.prompt)}
            className="group flex items-center gap-1.5 text-left text-[13px] text-primary hover:text-primary/80 hover:underline transition-colors"
          >
            <span>{ex.label}</span>
            {ex.type === "prefill" && <span className="text-muted-foreground text-[11px]">[参考链接]</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OperationGreeting;
