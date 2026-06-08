import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Coins, Plus, Trash2, Pencil, UserPlus, Users, AlertCircle, Building2, Hash, CalendarDays, User, Copy, MessageSquare, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TeamManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MOCK_USER = {
  name: "当前账号用户名",
  phone: "13305197053",
};

const MOCK_TEAM = {
  companyName: "南京ABC外贸有限公司",
  teamId: "TEAM-20250401-0038",
  validUntil: "2027/04/13",
  points: 1280,
  totalPoints: 3000,
};

const MOCK_USAGE = [
  { id: 1, date: "2026-04-14 10:32", task: "询盘分析", user: "张三", cost: 15 },
  { id: 2, date: "2026-04-13 16:05", task: "产品详情生成", user: "李四", cost: 25 },
  { id: 3, date: "2026-04-13 09:18", task: "合规咨询", user: "张三", cost: 10 },
  { id: 4, date: "2026-04-12 14:42", task: "回复策略生成", user: "李四", cost: 20 },
  { id: 5, date: "2026-04-11 11:30", task: "竞品分析", user: "张三", cost: 30 },
];

const MAX_MEMBERS = 2;
const MOCK_REGISTERED_PHONES = ["13812345678", "13998765432"];

const MOCK_SUBACCOUNTS = [
  { id: 1, name: "张三", phone: "13812345678", addedAt: "2026-03-15", pending: false },
  { id: 2, name: "李四", phone: "13998765432", addedAt: "2026-03-20", pending: false },
];

type TabKey = "info" | "members" | "usage";

const NAV_ITEMS: { key: TabKey; label: string; icon: typeof Users }[] = [
  { key: "info", label: "团队信息", icon: Building2 },
  { key: "members", label: "成员管理", icon: Users },
  { key: "usage", label: "使用记录", icon: CalendarDays },
];

const TeamManagementDialog = ({ open, onOpenChange }: TeamManagementDialogProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>("info");
  const [subAccounts, setSubAccounts] = useState(MOCK_SUBACCOUNTS);
  const [newPhone, setNewPhone] = useState("");
  const [addError, setAddError] = useState("");
  const [showInvite, setShowInvite] = useState(false);

  const handleAddSubAccount = () => {
    setAddError("");
    setShowInvite(false);
    if (!newPhone.trim()) return;
    if (subAccounts.length >= MAX_MEMBERS) {
      setAddError(`当前团队最多支持 ${MAX_MEMBERS} 个成员`);
      return;
    }
    if (subAccounts.some((a) => a.phone === newPhone.trim())) {
      setAddError("该手机号已添加");
      return;
    }
    if (!MOCK_REGISTERED_PHONES.includes(newPhone.trim())) {
      setShowInvite(true);
      setSubAccounts((prev) => [
        ...prev,
        { id: Date.now(), name: "—", phone: newPhone.trim(), addedAt: "待接受邀请", pending: true },
      ]);
      return;
    }
    setSubAccounts((prev) => [
      ...prev,
      { id: Date.now(), name: "新成员", phone: newPhone.trim(), addedAt: new Date().toISOString().slice(0, 10), pending: false },
    ]);
    setNewPhone("");
  };

  const handleDeleteSubAccount = (id: number) => {
    setSubAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[720px] p-0 overflow-hidden gap-0 rounded-2xl shadow-lg bg-background border-border/50">
        <div className="flex min-h-[500px]">
          {/* Left navigation */}
          <nav className="w-[152px] shrink-0 bg-muted/40 border-r border-border/50 py-7 px-3 flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const active = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`flex items-center gap-2.5 text-left px-3.5 py-2.5 rounded-xl text-[13px] transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-primary/10 text-primary font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                  }`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-primary" : "text-muted-foreground/70"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right content */}
          <div className="flex-1 p-7 overflow-y-auto">
            {activeTab === "info" && <TeamInfoPanel />}
            {activeTab === "members" && (
              <MembersPanel
                subAccounts={subAccounts}
                maxMembers={MAX_MEMBERS}
                onAdd={handleAddSubAccount}
                onDelete={handleDeleteSubAccount}
                addError={addError}
                newPhone={newPhone}
                setNewPhone={setNewPhone}
                showInvite={showInvite}
              />
            )}
            {activeTab === "usage" && <UsagePanel />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ── Team Info Panel ── */
const TeamInfoPanel = () => (
  <div className="space-y-7">
    {/* User profile */}
    <div className="flex items-center gap-4">
      <Avatar className="w-14 h-14 border-2 border-primary/10 shadow-sm">
        <AvatarFallback className="bg-gradient-to-br from-primary/10 to-accent/30 text-primary text-lg font-semibold">
          <User className="w-6 h-6" />
        </AvatarFallback>
      </Avatar>
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{MOCK_USER.name}</span>
          <button className="p-1 rounded-md hover:bg-muted transition-colors">
            <Pencil className="w-3 h-3 text-muted-foreground hover:text-primary transition-colors" />
          </button>
        </div>
        <span className="text-xs text-muted-foreground tracking-wide">{MOCK_USER.phone}</span>
      </div>
    </div>

    <Separator className="bg-border/40" />

    {/* Team card */}
    <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.03] to-accent/[0.04] p-6 relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.04] rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative">
        <div className="space-y-3">
          <h3 className="text-[15px] font-bold text-foreground">{MOCK_TEAM.companyName}</h3>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Hash className="w-3 h-3" />
              <span>{MOCK_TEAM.teamId}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="w-3 h-3" />
              <span>服务有效期至 {MOCK_TEAM.validUntil}</span>
            </div>
          </div>
        </div>

        {/* Points section */}
        <div className="mt-5 pt-4 border-t border-primary/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Coins className="w-3.5 h-3.5 text-[hsl(45,90%,50%)]" />
              <span>贸力值</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-primary">{MOCK_TEAM.points.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">点可用</span>
              <span className="text-xs text-muted-foreground mx-0.5">/</span>
              <span className="text-xs text-muted-foreground">{MOCK_TEAM.totalPoints.toLocaleString()}点</span>
            </div>
          </div>
          <Progress value={(MOCK_TEAM.points / MOCK_TEAM.totalPoints) * 100} className="h-2 bg-primary/10" />
        </div>
      </div>
    </div>
  </div>
);

/* ── Members Panel ── */
interface MembersPanelProps {
  subAccounts: typeof MOCK_SUBACCOUNTS;
  maxMembers: number;
  onAdd: () => void;
  onDelete: (id: number) => void;
  addError: string;
  newPhone: string;
  setNewPhone: (v: string) => void;
  showInvite: boolean;
}

const MembersPanel = ({
  subAccounts, maxMembers, onAdd, onDelete, addError,
  newPhone, setNewPhone, showInvite,
}: MembersPanelProps) => {
  const inviteLink = "https://mentarc.ai/invite?code=TEAM-20250401-0038";
  const handleCopy = () => {
    navigator.clipboard?.writeText(inviteLink);
    toast({ description: "邀请链接已复制" });
  };
  const handleSms = () => {
    toast({ description: "短信提醒已发送" });
  };
  return (
  <div className="space-y-5">
    {/* Capacity indicator */}
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 text-xs text-muted-foreground">
      <Users className="w-3.5 h-3.5" />
      <span>团队成员</span>
      <span className="font-semibold text-foreground">{subAccounts.length}<span className="text-muted-foreground font-normal">/{maxMembers}</span></span>
    </div>

    {/* Add form */}
    <div className="rounded-xl border border-border/50 bg-gradient-to-b from-card to-muted/20 p-4">
      <h4 className="text-[13px] font-semibold text-foreground flex items-center gap-2 mb-3">
        <div className="p-1 rounded-md bg-primary/10">
          <UserPlus className="w-3.5 h-3.5 text-primary" />
        </div>
        添加子账号
      </h4>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="手机号"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          className="flex-1 h-9 text-sm rounded-lg border-border/50 bg-background/80 focus:bg-background"
        />
        <Button onClick={onAdd} size="sm" className="gap-1.5 h-9 rounded-lg shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          添加
        </Button>
      </div>
      {addError && (
        <div className="flex items-center gap-1.5 mt-3 px-2.5 py-1.5 rounded-lg bg-destructive/5 text-xs text-destructive">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {addError}
        </div>
      )}
      {showInvite && (
        <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-2">
          <div className="flex items-start gap-1.5 text-xs text-amber-700">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>该手机号暂未注册贸探，请通过以下方式邀请对方注册。</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCopy} size="sm" variant="outline" className="gap-1.5 h-8 rounded-lg text-xs">
              <Copy className="w-3 h-3" />
              复制邀请链接
            </Button>
            <Button onClick={handleSms} size="sm" variant="outline" className="gap-1.5 h-8 rounded-lg text-xs">
              <MessageSquare className="w-3 h-3" />
              发送短信提醒
            </Button>
          </div>
        </div>
      )}
    </div>

    {/* List */}
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="text-xs font-medium h-9">手机号</TableHead>
            <TableHead className="text-xs font-medium h-9">添加时间</TableHead>
            <TableHead className="w-12 h-9"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subAccounts.map((a) => (
            <TableRow key={a.id} className="hover:bg-muted/20">
              <TableCell className="text-sm text-muted-foreground py-3">{a.phone}</TableCell>
              <TableCell className="text-xs py-3">
                {a.pending ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
                    <Clock className="w-3 h-3" />
                    待接受邀请
                  </span>
                ) : (
                  <span className="text-muted-foreground">{a.addedAt}</span>
                )}
              </TableCell>
              <TableCell className="py-3">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg" onClick={() => onDelete(a.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {subAccounts.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground py-10 text-sm">暂无子账号</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  </div>
  );
};

/* ── Usage Panel ── */
const UsagePanel = () => {
  const totalUsed = MOCK_USAGE.reduce((sum, r) => sum + r.cost, 0);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
          <div className="p-1 rounded-md bg-[hsl(45,90%,50%)]/10">
            <Coins className="w-3.5 h-3.5 text-[hsl(45,90%,50%)]" />
          </div>
          使用记录
        </h3>
        <span className="text-xs text-muted-foreground px-2.5 py-1 rounded-full bg-muted/60">累计消耗 <strong className="text-foreground">{totalUsed}</strong> 点</span>
      </div>
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="text-xs font-medium h-9">时间</TableHead>
              <TableHead className="text-xs font-medium h-9">任务名称</TableHead>
              <TableHead className="text-xs font-medium h-9">使用人</TableHead>
              <TableHead className="text-xs font-medium text-right h-9">消耗点数</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_USAGE.map((r) => (
              <TableRow key={r.id} className="hover:bg-muted/20">
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap py-2.5">{r.date}</TableCell>
                <TableCell className="text-sm py-2.5">{r.task}</TableCell>
                <TableCell className="text-sm text-muted-foreground py-2.5">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6 border border-primary/10">
                      <AvatarFallback className="bg-gradient-to-br from-primary/15 to-accent/30 text-primary text-[10px] font-semibold">
                        {r.user.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-foreground">{r.user}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium text-sm py-2.5">-{r.cost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeamManagementDialog;
