import { useState } from "react";
import { Check } from "lucide-react";

export type SecondFollowupChoice = "price" | "value" | "urgency";

const APPROACHES: { id: SecondFollowupChoice; label: string; desc: string }[] = [
  {
    id: "price",
    label: "强化价格竞争力",
    desc: "针对其转向价格敏感的心态，提供阶梯让利 + 赠样政策。",
  },
  {
    id: "value",
    label: "强化价值与差异化",
    desc: "突出认证 / 交期 / 售后服务，弱化纯价格对抗。",
  },
  {
    id: "urgency",
    label: "制造紧迫感推进",
    desc: "用库存档期与限时优惠窗口推动买家尽快下单。",
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
        <span className="font-medium text-foreground">Bergmann Home Supplies GmbH</span>{" "}
        前期已向您发起过保温啤酒杯阶梯报价询盘，其核心关注点是{" "}
        <span className="font-medium text-foreground">材质规格与认证文件</span>；在新一轮询价中，买家从{" "}
        <span className="font-medium text-foreground">「认证 / 定制能力」</span> 转向关注{" "}
        <span className="font-medium text-foreground">「价格阶梯与交期承诺」</span>
        ，表明其当前心态已从{" "}
        <span className="font-medium text-foreground">「评估供应商」</span> 推进到{" "}
        <span className="font-medium text-primary">「比价决策窗口」</span>。
      </p>

      <p className="text-foreground/85">
        我将为您拟定下一次跟进话术，您倾向的应对方式是：
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