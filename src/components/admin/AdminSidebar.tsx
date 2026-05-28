import { NavLink, useLocation } from "react-router-dom";
import { Coins, Wallet, History, Users, UserPlus, CreditCard, Search, ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type Group = {
  label: string;
  icon: typeof Coins;
  children: { title: string; url: string; icon: typeof Coins }[];
};

const GROUPS: Group[] = [
  {
    label: "贸力值管理",
    icon: Coins,
    children: [
      { title: "贸力值查询", url: "/admin/points/query", icon: Wallet },
      { title: "贸力值充值", url: "/admin/points/recharge", icon: Coins },
      { title: "充值记录", url: "/admin/points/history", icon: History },
    ],
  },
  {
    label: "用户管理",
    icon: Users,
    children: [
      { title: "试用版会员", url: "/admin/users/trial", icon: UserPlus },
      { title: "付费版会员", url: "/admin/users/paid", icon: CreditCard },
      { title: "手机账号查询", url: "/admin/users/lookup", icon: Search },
    ],
  },
];

const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  const isActive = (url: string) => pathname === url;

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="bg-background">
        <div className={cn("px-4 py-4 border-b border-border", collapsed && "px-2")}>
          {collapsed ? (
            <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              贸
            </div>
          ) : (
            <div>
              <div className="text-[15px] font-semibold text-foreground">贸探后台管理</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Admin Console</div>
            </div>
          )}
        </div>

        {GROUPS.map((group) => {
          const groupActive = group.children.some((c) => isActive(c.url));
          return (
            <SidebarGroup key={group.label} className="px-2 py-2">
              <Collapsible defaultOpen={groupActive || true}>
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel
                    className={cn(
                      "flex items-center gap-2 cursor-pointer text-foreground/80 hover:text-foreground text-[13px] font-medium py-2 group/label"
                    )}
                  >
                    <group.icon className="w-4 h-4 text-primary" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{group.label}</span>
                        <ChevronDown className="w-3.5 h-3.5 transition-transform group-data-[state=closed]/label:-rotate-90" />
                      </>
                    )}
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.children.map((item) => (
                        <SidebarMenuItem key={item.url}>
                          <SidebarMenuButton asChild isActive={isActive(item.url)}>
                            <NavLink
                              to={item.url}
                              className={cn(
                                "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                                isActive(item.url)
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
                              )}
                            >
                              <item.icon className="w-3.5 h-3.5 shrink-0" />
                              {!collapsed && <span>{item.title}</span>}
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
