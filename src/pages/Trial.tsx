import { ArrowLeft, MessageCircle, Briefcase, HelpCircle, Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mentarcLogoFull from "@/assets/mentarc-logo-full.png";
import wechatServiceQr from "@/assets/wechat-service-qr.png";
import operationAvatar from "@/assets/expert-operation.jpg";
import businessAvatar from "@/assets/expert-business.jpg";
import trainingAvatar from "@/assets/expert-training.jpg";

const FEATURES = [
  {
    icon: MessageCircle,
    title: "业务专家",
    desc: "客户沟通 & 跟进策略",
    avatar: businessAvatar,
    color: "from-[hsl(217,100%,50%)] to-[hsl(174,100%,61%)]",
  },
  {
    icon: Briefcase,
    title: "运营专家",
    desc: "产品复刻 & 图文生成",
    avatar: operationAvatar,
    color: "from-[hsl(217,100%,50%)] to-[hsl(217,100%,62%)]",
  },
  {
    icon: HelpCircle,
    title: "培训专家",
    desc: "知识 & 案例建议",
    avatar: trainingAvatar,
    color: "from-[hsl(190,100%,50%)] to-[hsl(174,100%,61%)]",
  },
];

const BENEFITS = [
  "贸探AI专家功能免费试用",
  "客服 1V1 指导和答疑",
  "活动信息抢先知",
];

const Trial = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Soft ambient gradient blobs */}
      <div
        className="pointer-events-none absolute -top-40 -left-32 w-[480px] h-[480px] rounded-full blur-3xl opacity-50"
        style={{ background: "radial-gradient(closest-side, hsl(217 100% 50% / 0.10), transparent)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-40 -right-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-60"
        style={{ background: "radial-gradient(closest-side, hsl(174 100% 61% / 0.12), transparent)" }}
        aria-hidden
      />

      {/* Nav */}
      <nav className="relative z-10 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <button
            onClick={() => navigate("/")}
            className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="返回"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <img src={mentarcLogoFull} alt="Mentarc 贸探" className="h-9 object-contain ml-2" />
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Left - Copy + experts */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">限时免费试用</span>
            </div>

            <h1 className="text-[34px] md:text-[44px] font-bold text-foreground leading-[1.18] tracking-tight">
              做外贸，找贸探
              <br />
              <span className="bg-gradient-to-r from-[hsl(217,100%,50%)] to-[hsl(174,100%,55%)] bg-clip-text text-transparent">
                AI 专家带你干！
              </span>
            </h1>

            <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
              扫描右侧二维码添加贸探客服企微，即可免费试用全部专家能力。
            </p>

            {/* Capability highlights (informational) */}
            <div className="mt-10">
              <div className="grid grid-cols-3 gap-3">
                {FEATURES.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.title}
                      className="relative rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm px-3 py-4 text-center"
                    >
                      <div className={`w-9 h-9 mx-auto rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center shadow-sm shadow-primary/15`}>
                        <Icon className="w-[18px] h-[18px] text-white" strokeWidth={2.2} />
                      </div>
                      <div className="mt-2.5 text-[13.5px] font-semibold text-foreground">{f.title}</div>
                      <div className="mt-0.5 text-[11.5px] text-muted-foreground leading-snug">{f.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right - QR card */}
          <div className="relative">
            <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl border border-border/60 shadow-xl shadow-primary/8 overflow-hidden">
              {/* Top gradient strip (matches ModuleCard accent) */}
              <div className="h-1 bg-gradient-to-r from-[hsl(217,100%,50%)] via-[hsl(190,100%,55%)] to-[hsl(174,100%,61%)]" />

              <div className="px-7 pt-7 pb-7">
                <div className="text-center">
                  <h2 className="text-[20px] font-bold text-foreground">扫码添加贸探客服企微</h2>
                  <p className="text-sm text-muted-foreground mt-1.5">微信扫一扫，开启免费试用</p>
                </div>

                {/* QR */}
                <div className="mt-6 flex justify-center">
                  <img
                    src={wechatServiceQr}
                    alt="贸探客服企微二维码"
                    className="w-56 h-56 object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Benefits */}
                <div className="mt-6 rounded-xl bg-muted/40 p-4 space-y-2.5">
                  {BENEFITS.map((b) => (
                    <div key={b} className="flex items-center gap-2.5 text-[14px] text-foreground/85">
                      <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                      {b}
                    </div>
                  ))}
                </div>

                {/* Note */}
                <p className="mt-5 text-xs text-center text-muted-foreground leading-relaxed">
                  添加时请备注 <span className="font-semibold text-primary">"免费试用"</span>
                  ，客服将优先为您开通
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trial;
