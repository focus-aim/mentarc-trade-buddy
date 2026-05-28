import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const PointsRecharge = () => {
  const [target, setTarget] = useState<"personal" | "team">("personal");
  const [phone, setPhone] = useState("");
  const [teamId, setTeamId] = useState("");
  const [amount, setAmount] = useState("");
  const [expireAt, setExpireAt] = useState<Date | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setTarget("personal");
    setPhone("");
    setTeamId("");
    setAmount("");
    setExpireAt(undefined);
  };

  const submit = () => {
    if (target === "personal" && !/^\d{11}$/.test(phone)) {
      toast.error("请输入 11 位手机号");
      return;
    }
    if (target === "team" && !teamId.trim()) {
      toast.error("请输入团队 ID");
      return;
    }
    const num = Number(amount);
    if (!Number.isInteger(num) || num <= 0) {
      toast.error("请输入大于 0 的整数");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success(
        `已为${target === "personal" ? `手机号 ${phone}` : `团队 ${teamId}`}充值 ${num} 贸力值`
      );
      reset();
    }, 600);
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/40">
            <h2 className="text-[15px] font-semibold text-foreground">贸力值充值</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              支持向个人手机号或团队 ID 充值贸力值点数
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* 充值对象 */}
            <div className="space-y-2.5">
              <Label className="text-[13px] text-foreground/80">
                <span className="text-destructive mr-0.5">*</span>充值对象
              </Label>
              <RadioGroup
                value={target}
                onValueChange={(v) => setTarget(v as "personal" | "team")}
                className="flex gap-6"
              >
                <label className="flex items-center gap-2 cursor-pointer text-[13px]">
                  <RadioGroupItem value="personal" id="personal" />
                  <span>个人（手机号）</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[13px]">
                  <RadioGroupItem value="team" id="team" />
                  <span>团队（团队 ID）</span>
                </label>
              </RadioGroup>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {/* 标识 */}
              <div className="space-y-2">
                <Label className="text-[13px] text-foreground/80">
                  <span className="text-destructive mr-0.5">*</span>
                  {target === "personal" ? "手机号" : "团队 ID"}
                </Label>
                {target === "personal" ? (
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                    placeholder="请输入 11 位手机号"
                    inputMode="numeric"
                  />
                ) : (
                  <Input
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    placeholder="请输入团队 ID"
                  />
                )}
              </div>

              {/* 充值数 */}
              <div className="space-y-2">
                <Label className="text-[13px] text-foreground/80">
                  <span className="text-destructive mr-0.5">*</span>充值贸力值
                </Label>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                  placeholder="整数"
                  inputMode="numeric"
                />
              </div>

              {/* 到期时间 */}
              <div className="space-y-2">
                <Label className="text-[13px] text-foreground/80 flex items-center gap-1">
                  到期时间
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      不填则贸力值长期有效
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !expireAt && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 w-4 h-4" />
                      {expireAt ? format(expireAt, "yyyy-MM-dd") : "选择到期时间"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={expireAt}
                      onSelect={setExpireAt}
                      initialFocus
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="border-t border-dashed border-border pt-5 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={reset} disabled={submitting}>
                重置
              </Button>
              <Button onClick={submit} disabled={submitting}>
                {submitting ? "提交中…" : "提交"}
              </Button>
            </div>
          </div>
        </Card>

        <p className="mt-4 text-[12px] text-muted-foreground">
          提示：当前为前端 Demo，提交后数据不会真实保存。
        </p>
      </div>
    </AdminLayout>
  );
};

export default PointsRecharge;
