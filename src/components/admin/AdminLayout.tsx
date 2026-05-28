import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";

const ROUTE_LABELS: Record<string, string> = {
  "/admin": "首页",
  "/admin/points/query": "贸力值查询",
  "/admin/points/recharge": "贸力值充值",
  "/admin/points/history": "充值记录",
  "/admin/users/trial": "试用版会员",
  "/admin/users/paid": "付费版会员",
  "/admin/users/lookup": "手机账号查询",
};

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { pathname } = useLocation();
  const currentLabel = ROUTE_LABELS[pathname] ?? "";

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="h-14 bg-background border-b border-border flex items-center px-4 gap-3 sticky top-0 z-30">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="h-5 w-px bg-border" />
            <nav className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <Link to="/admin" className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Home className="w-3.5 h-3.5" />
                <span>首页</span>
              </Link>
              {currentLabel && pathname !== "/admin" && (
                <>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-foreground">{currentLabel}</span>
                </>
              )}
            </nav>
            <div className="ml-auto flex items-center gap-3 text-[13px] text-muted-foreground">
              <span>管理员</span>
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                A
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
