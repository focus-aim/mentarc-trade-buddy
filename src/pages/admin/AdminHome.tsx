import { Link } from "react-router-dom";
import { Coins, Users, ArrowRight } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";

const QUICK_LINKS = [
  {
    icon: Coins,
    title: "贸力值充值",
    desc: "为个人或团队账户充值贸力值点数",
    to: "/admin/points/recharge",
  },
  {
    icon: Users,
    title: "用户管理",
    desc: "管理试用版与付费版会员",
    to: "/admin/users/trial",
  },
];

const AdminHome = () => {
  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <h1 className="text-[22px] font-semibold text-foreground">欢迎使用贸探后台管理系统</h1>
        <p className="text-sm text-muted-foreground mt-1.5">在这里管理会员、贸力值与运营数据</p>

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group block"
            >
              <Card className="p-5 hover:border-primary/40 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <link.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[15px] font-medium text-foreground">
                      {link.title}
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-[13px] text-muted-foreground mt-1">{link.desc}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHome;
