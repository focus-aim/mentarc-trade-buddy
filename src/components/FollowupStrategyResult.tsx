import { useState } from "react";
import { Compass, MessageSquareText, Copy, Check, ChevronDown, ChevronUp, FileText } from "lucide-react";

const ScriptCard = ({
  type,
  summary,
  body,
}: {
  type: string;
  summary: string;
  body: string;
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-start gap-2 px-3 py-2 border-b border-border/60 bg-muted/30">
        <span className="shrink-0 inline-flex items-center rounded-md px-1.5 py-0.5 text-[10.5px] font-bold bg-primary/10 text-primary border border-primary/20">
          {type}
        </span>
        <p className="min-w-0 flex-1 text-[12.5px] font-medium text-foreground leading-[1.5]">
          {summary}
        </p>
        <button
          onClick={handleCopy}
          className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/[0.08] transition-colors"
          title={copied ? "已复制" : "复制话术"}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <div className="relative">
        <pre
          className={`px-3 py-2.5 whitespace-pre-wrap text-[12px] text-foreground/85 leading-[1.7] font-sans overflow-hidden ${
            expanded ? "" : "max-h-[4.4em]"
          }`}
        >
          {body}
        </pre>
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card/95 to-transparent pointer-events-none" />
        )}
      </div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-center gap-1 px-3 py-1.5 text-[11.5px] text-primary hover:bg-primary/[0.06] border-t border-border/60 transition-colors"
      >
        {expanded ? (
          <>
            收起 <ChevronUp className="w-3 h-3" />
          </>
        ) : (
          <>
            展开全部 <ChevronDown className="w-3 h-3" />
          </>
        )}
      </button>
    </div>
  );
};

interface FollowupStrategyResultProps {
  onGenerateQuote?: () => void;
}

const FollowupStrategyResult = ({ onGenerateQuote }: FollowupStrategyResultProps = {}) => {
  const scriptA = `Dear John,

Thanks again for the inquiry on the 5kW UL1741 hybrid inverter. Just checking in to see if our quote and lead-time options align with your July rollout plan.

To make sure we're proposing the best fit, could you share:
1) Is the July deadline for warehouse arrival or shipment?
2) Has your internal review surfaced any new spec or budget constraint we should adjust for?

If helpful, I can send a 1-min factory walkthrough video and 2 US install cases as reference. Happy to jump on a 20-min call this week.

Best regards,
[Your Name]`;

  const scriptB = `Hi John,

Wanted to give you a quick heads-up — our July production slot is filling up, and we're holding 300 units capacity for your project until the end of this week.

If the timeline still works on your side, just reply "hold" and I'll lock the slot for you (no commitment until PO). If priorities have shifted, let me know what's changed and we'll re-plan together.

Either way, appreciate a quick line so I can plan accordingly.

Best,
[Your Name]`;

  return (
    <div className="space-y-3">
      {/* 跟进诊断 */}
      <section className="rounded-xl border border-primary/20 bg-primary/[0.03] p-3.5">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Compass className="w-3.5 h-3.5 text-primary" />
          <h3 className="font-medium text-foreground text-[12.5px]">跟进诊断</h3>
          {onGenerateQuote && (
            <button
              onClick={onGenerateQuote}
              className="ml-auto inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 hover:bg-primary/15 text-primary px-2 py-1 text-[11.5px] font-medium transition-colors"
              title="发起生成报价单任务"
            >
              <FileText className="w-3 h-3" />
              生成报价单
            </button>
          )}
        </div>
        <div className="space-y-2 text-[12.5px] leading-[1.7]">
          <p className="text-foreground/85">
            <span className="text-muted-foreground">当前阶段：</span>
            报价已发，买家处于<span className="text-primary font-medium">比价评估阶段</span>，成交意向中等。
          </p>
          <p className="text-foreground/85">
            <span className="text-muted-foreground">卡点诊断：</span>
            买家暂未形成明确选择，核心顾虑可能集中在<span className="text-foreground font-medium">价格、交期或方案匹配度</span>。
          </p>
          <p className="text-foreground/85">
            <span className="text-muted-foreground">跟进策略：</span>
            结合你以往的跟进策略偏好，优先确认采购进度和真实需求变化，推动买家给出明确反馈。
          </p>
        </div>
      </section>

      {/* 实战话术 */}
      <div className="space-y-2.5">
        <ScriptCard
          type="温和确认型"
          summary="主动询问采购进度，挖掘真实顾虑，铺垫下一步沟通。"
          body={scriptA}
        />
        <ScriptCard
          type="紧迫促单型"
          summary="用产能紧张制造稀缺感，逼买家给出明确反馈或时间节点。"
          body={scriptB}
        />
      </div>
    </div>
  );
};

export default FollowupStrategyResult;
