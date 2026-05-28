import { Construction } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";

interface PlaceholderProps {
  title: string;
  desc?: string;
}

const Placeholder = ({ title, desc }: PlaceholderProps) => {
  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <Card className="p-12 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Construction className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-[16px] font-semibold text-foreground">{title}</h2>
          <p className="mt-1.5 text-[13px] text-muted-foreground max-w-md">
            {desc ?? "该模块功能正在开发中，敬请期待。"}
          </p>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Placeholder;
