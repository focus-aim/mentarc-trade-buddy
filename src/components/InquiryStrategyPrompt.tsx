export type InquiryStrategyChoice = "background" | "emails";

interface InquiryStrategyPromptProps {
  onPick: (choice: InquiryStrategyChoice) => void;
  selected?: InquiryStrategyChoice | null;
}

const InquiryStrategyPrompt = ({ onPick, selected }: InquiryStrategyPromptProps) => {
  return (
    <div className="space-y-3 text-[14px] leading-relaxed">
      <p className="text-foreground/85">
        基于以上分析，建议您可以让我进一步生成以下内容，更有把握地推进这单：
      </p>

      <div className="space-y-2">
        <button
          onClick={() => onPick("background")}
          disabled={!!selected}
          className={`w-full text-left rounded-xl border px-3.5 py-2.5 text-[13.5px] font-medium text-foreground transition-all disabled:cursor-default ${
            selected === "background"
              ? "border-primary/50 bg-primary/8 ring-1 ring-primary/30"
              : "border-border bg-card/60 hover:border-primary/40 hover:bg-primary/[0.04]"
          }`}
        >
          生成买家背调报告
        </button>

        <button
          onClick={() => onPick("emails")}
          disabled={!!selected}
          className={`w-full text-left rounded-xl border px-3.5 py-2.5 text-[13.5px] font-medium text-foreground transition-all disabled:cursor-default ${
            selected === "emails"
              ? "border-primary/50 bg-primary/8 ring-1 ring-primary/30"
              : "border-border bg-card/60 hover:border-primary/40 hover:bg-primary/[0.04]"
          }`}
        >
          生成两版询盘回复邮件
        </button>
      </div>
    </div>
  );
};

export default InquiryStrategyPrompt;
