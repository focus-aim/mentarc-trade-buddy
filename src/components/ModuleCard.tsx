import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ModuleCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  action: string;
  onClick: () => void;
  delay?: number;
  color?: string;
  expertAvatar?: string;
  expertName?: string;
  expertTip?: string;
}

const ModuleCard = ({ icon: Icon, title, subtitle, action, onClick, delay = 0, color = "from-primary to-[hsl(195,80%,50%)]", expertAvatar, expertName, expertTip }: ModuleCardProps) => {
  return (
    <button
      onClick={onClick}
      className="group relative text-left bg-card/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm shadow-primary/4 border border-border/60 hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1.5 hover:border-primary/20 transition-all duration-300 opacity-0 animate-fade-up active:scale-[0.97] overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${color} opacity-40 group-hover:opacity-80 transition-opacity`} />

      <div className="flex items-start gap-3 mb-3">
        {expertAvatar ? (
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-primary/15 shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-300">
            <img src={expertAvatar} alt={expertName || "专家"} className="w-full h-full object-cover object-top" />
          </div>
        ) : (
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm shadow-primary/15 group-hover:shadow-md group-hover:shadow-primary/20 group-hover:scale-105 transition-all duration-300 shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
        <div>
          <h3 className="font-bold text-foreground text-[16px] leading-tight">{title}</h3>
          <p className="text-[13px] text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {/* Expert tip area */}
      {expertTip && (
        <div className="bg-muted/40 rounded-lg px-3 py-2 mb-4">
          <p className="text-[12px] text-foreground/75 leading-relaxed line-clamp-2">{expertTip}</p>
        </div>
      )}

      <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary group-hover:gap-2.5 transition-all">
        {action}
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </span>
    </button>
  );
};

export default ModuleCard;
