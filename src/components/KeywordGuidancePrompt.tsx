export type KeywordGuidanceChoice = "home-backup" | "fridge";

interface KeywordGuidancePromptProps {
  onPick: (choice: KeywordGuidanceChoice, prompt: string) => void;
  selected?: KeywordGuidanceChoice | null;
}

const OPTIONS: { key: KeywordGuidanceChoice; title: string; prompt: string }[] = [
  {
    key: "home-backup",
    title: "结合 \"solar generator for home backup\" 生成产品详情卖点",
    prompt: "结合关键词 solar generator for home backup 生成产品详情卖点",
  },
  {
    key: "fridge",
    title: "结合 \"emergency power backup for fridge\" 生成产品详情卖点",
    prompt: "结合关键词 emergency power backup for fridge 生成产品详情卖点",
  },
];

const KeywordGuidancePrompt = ({ onPick, selected }: KeywordGuidancePromptProps) => {
  return (
    <div className="space-y-3 text-[14px] leading-relaxed">
      <p className="text-foreground/85">
        关键词趋势报告已输出到右侧。建议您可以让我进一步围绕以下高潜力关键词，落地到产品页文案：
      </p>

      <div className="space-y-2">
        {OPTIONS.map((opt) => {
          const active = selected === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onPick(opt.key, opt.prompt)}
              disabled={!!selected}
              className={`w-full text-left rounded-xl border px-3.5 py-3 transition-all disabled:cursor-default ${
                active
                  ? "border-primary/50 bg-primary/8 ring-1 ring-primary/30"
                  : "border-border bg-card/60 hover:border-primary/40 hover:bg-primary/[0.04]"
              }`}
            >
              <span className="text-[13.5px] font-medium text-foreground">{opt.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default KeywordGuidancePrompt;
