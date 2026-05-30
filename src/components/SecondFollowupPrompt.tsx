import { useState } from "react";
import { Check } from "lucide-react";

export type SecondFollowupChoice = "delivery" | "market" | "trend";

const APPROACHES: { id: SecondFollowupChoice; label: string; desc: string; recommend?: boolean }[] = [
  {
    id: "delivery",
    label: "稳住交付，打消顾虑",
    desc: "亮出资质和大客户案例，让他放心选我们。",
    recommend: true,
  },
  {
    id: "market",
    label: "抛个涨价信号",
    desc: "用运费和原材料波动，催一催他的决策。",
  },
  {
    id: "trend",
    label: "聊聊行业，先破冰",
    desc: "放下报价，聊点市场趋势，把话题重新打开。",
  },
];

interface Props {
  onConfirm: (choice: SecondFollowupChoice, label: string) => void;
  selected?: SecondFollowupChoice | null;
}

const SecondFollowupPrompt = ({ onConfirm, selected }: Props) => {
  const [pick, setPick] = useState<SecondFollowupChoice | null>(selected || null);
  const locked = !!selected;

  return (
    <div className="space-y-3.5 text-[15px] leading-relaxed">
      <p className="text-foreground/90">
        已调取该买家的历史互动档案。距离上次提供{" "}
        <span className="font-medium text-foreground">[SKU-123]</span>{" "}
        报价已过去 <span className="font-medium text-foreground">[14]</span> 天。
      </p>

      <div className="space-y-1.5">
        <p className="text-foreground/90">
          <span className="font-medium text-foreground">历史关注：</span>
          前期沟通中，其核心诉求是压缩采购成本。
        </p>
        <p className="text-foreground/90">
          <span className="font-medium text-foreground">当前异动：</span>
          近期问询重点转向交付稳定性和质保条款。
        </p>
        <p className="text-foreground/90">
          <span className="font-medium text-foreground">状态分析：</span>
          买家可能已收到同行的低价方案，但对低价供应商的履约能力存在顾虑。当前处于决策摇摆期。
        </p>
      </div>

      <p className="text-foreground/85">
        为您匹配了以下跟进方向，请选择切入点，我将据此生成话术：
      </p>

      <div className="space-y-2">
        {APPROACHES.map((a) => {
          const active = (locked ? selected : pick) === a.id;
          return (
            <button
              key={a.id}
              onClick={() => !locked && setPick(a.id)}
              disabled={locked}
              className={`w-full text-left rounded-xl border px-3.5 py-2.5 transition-all disabled:cursor-default ${
                active
                  ? "border-primary/50 bg-primary/8 ring-1 ring-primary/30"
                  : "border-border bg-card/60 hover:border-primary/40 hover:bg-primary/[0.04]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[13.5px] font-medium text-foreground">{a.label}</span>
                {a.recommend && (
                  <span className="text-[10.5px] px-1.5 py-0.5 rounded bg-primary text-white font-medium">
                    建议选此项
                  </span>
                )}
                {active && <Check className="w-3.5 h-3.5 text-primary" />}
              </div>
              <p className="mt-1 text-[12.5px] text-muted-foreground">{a.desc}</p>
            </button>
          );
        })}
      </div>

      {!locked && (
        <div className="flex justify-end">
          <button
            onClick={() => {
              if (!pick) return;
              const label = APPROACHES.find((a) => a.id === pick)!.label;
              onConfirm(pick, label);
            }}
            disabled={!pick}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            确认，继续推进
          </button>
        </div>
      )}
    </div>
  );
};

export default SecondFollowupPrompt;