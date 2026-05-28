import { useNavigate, useLocation } from "react-router-dom";
import mentarcLogoFull from "@/assets/mentarc-logo-full.png";

const SiteNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const linkCls = (path: string) =>
    `transition-colors ${
      pathname === path
        ? "text-[hsl(217,100%,50%)] font-medium"
        : "text-[hsl(220,10%,35%)] hover:text-[hsl(217,100%,50%)]"
    }`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-[hsl(220,15%,94%)]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
        <button onClick={() => navigate("/")} className="flex items-center shrink-0">
          <img src={mentarcLogoFull} alt="Mentarc 贸探" className="h-12 object-contain" />
        </button>
        <div className="hidden md:flex items-center gap-1 ml-10 text-sm">
          <button
            onClick={() => navigate("/updates")}
            className={`px-3 py-1.5 rounded-full ${linkCls("/updates")} ${
              pathname === "/updates" ? "bg-[hsl(217,100%,96%)]" : "hover:bg-[hsl(220,15%,96%)]"
            }`}
          >
            产品动态
          </button>
          <button
            onClick={() => navigate("/about")}
            className={`px-3 py-1.5 rounded-full ${linkCls("/about")} ${
              pathname === "/about" ? "bg-[hsl(217,100%,96%)]" : "hover:bg-[hsl(220,15%,96%)]"
            }`}
          >
            关于我们
          </button>
        </div>
        <button
          onClick={() => navigate("/app")}
          className="ml-auto px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[hsl(217,100%,50%)] hover:bg-[hsl(217,100%,45%)] hover:shadow-lg hover:shadow-[hsl(217,100%,50%)]/20 transition-all active:scale-[0.97]"
        >
          登录
        </button>
      </div>
    </nav>
  );
};

export default SiteNav;
