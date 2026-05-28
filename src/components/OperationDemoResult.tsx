interface OperationDemoResultProps {
  onSendPrompt?: (text: string) => void;
}

const OperationDemoResult = ({ onSendPrompt }: OperationDemoResultProps) => {
  return (
    <div className="text-base leading-relaxed space-y-3">
      <p className="text-foreground">
        根据您提供的链接，已经完成网页内容分析，我识别到：
      </p>

      <div className="space-y-1.5 text-base">
        <p className="text-foreground">
          <span className="text-muted-foreground">产品名称：</span>
          China-24-Inch-48V-15ah-10ah-9-Speed-Cycle-Aluminum-Alloy-Fat-Tire-1000W-Electric-Bike
        </p>
        <p className="text-foreground">
          <span className="text-muted-foreground">有效产品图片：</span>8张
        </p>
        <p className="text-foreground">
          <span className="text-muted-foreground">公司信息：</span>aboutmurals.ca
        </p>
      </div>

      <div className="border-t border-border my-2" />

      <p className="text-foreground/80 text-base">已经提炼产品和图片特征，下一步我可以帮您：</p>

      <div className="flex flex-col gap-0.5">
        <button
          onClick={() => onSendPrompt?.("结合以上产品特征，生成全套产品图文")}
          className="text-left text-primary text-[13px] hover:text-primary/80 hover:underline transition-colors"
        >
          结合以上产品特征，生成全套产品图文
        </button>
        <button
          onClick={() => onSendPrompt?.("优化产品主图，并生成更多场景图")}
          className="text-left text-primary text-[13px] hover:text-primary/80 hover:underline transition-colors"
        >
          优化产品主图，并生成更多场景图
        </button>
      </div>
    </div>
  );
};

export default OperationDemoResult;
