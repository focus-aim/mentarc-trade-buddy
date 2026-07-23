import { useNavigate } from "react-router-dom";
import { ArrowRight, MessageCircle, Briefcase, HelpCircle, UserSearch, Mail, Share2, Image, Video, Eraser, ChevronRight } from "lucide-react";
import mentarcLogoFull from "@/assets/mentarc-logo-full.png";
import { useEffect, useRef, useState } from "react";

const DYNAMIC_HINTS = [
  "正在分析客户背景…",
  "正在拆解竞品卖点…",
  "正在生成优化建议…",
];

const Landing = () => {
  const navigate = useNavigate();
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % DYNAMIC_HINTS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const goToApp = () => navigate("/app");
  const goToTraining = () => navigate("/app?start=training");

  return (
    <div className="min-h-screen bg-white text-[hsl(220,20%,14%)] overflow-x-hidden">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-[hsl(220,15%,94%)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <div className="flex items-center shrink-0">
            <img src={mentarcLogoFull} alt="Mentarc 贸探" className="h-12 object-contain" />
          </div>
          <div className="hidden md:flex items-center gap-1 ml-10 text-sm text-[hsl(220,10%,35%)]">
            <button
              onClick={() => navigate("/updates")}
              className="px-3 py-1.5 rounded-full hover:text-[hsl(217,100%,50%)] hover:bg-[hsl(220,15%,96%)] transition-colors"
            >
              产品动态
            </button>
            <button
              onClick={() => navigate("/about")}
              className="px-3 py-1.5 rounded-full hover:text-[hsl(217,100%,50%)] hover:bg-[hsl(220,15%,96%)] transition-colors"
            >
              关于我们
            </button>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline-flex px-5 py-2.5 rounded-full text-sm font-medium text-[hsl(217,100%,50%)] bg-[hsl(217,100%,96%)] border border-[hsl(217,100%,90%)]">
              新用户免费体验全部功能
            </span>
            <button
              onClick={goToApp}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[hsl(217,100%,50%)] hover:bg-[hsl(217,100%,45%)] hover:shadow-lg hover:shadow-[hsl(217,100%,50%)]/20 transition-all active:scale-[0.97]"
            >
              登录
            </button>
          </div>
        </div>
      </nav>


      {/* Hero */}
      <section className="relative pt-28 pb-24 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(217,60%,97%)] via-white to-[hsl(174,50%,97%)]" />
        <div className="absolute top-[-200px] right-[-100px] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-[hsl(217,100%,50%)]/8 to-[hsl(174,100%,61%)]/8 blur-3xl" />
        <div className="absolute bottom-[-150px] left-[-100px] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[hsl(174,100%,61%)]/6 to-transparent blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          {/* Left */}
          <div className="flex-1 max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[hsl(217,100%,50%)]/15 bg-[hsl(217,100%,50%)]/5 mb-6">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[hsl(217,100%,50%)] to-[hsl(174,100%,61%)] animate-pulse" />
              <span className="text-xs font-medium text-[hsl(217,100%,45%)]">AI 专家团队已就绪</span>
            </div>

            <h1 className="text-[42px] md:text-[52px] font-bold leading-[1.08] tracking-tight text-[hsl(220,20%,14%)]">
              您的外贸
              <span className="relative inline-block mx-1">
                <span className="relative z-10 bg-gradient-to-r from-[hsl(217,100%,50%)] to-[hsl(174,100%,61%)] bg-clip-text text-transparent">AI专家团队</span>
              </span>
              <br />
              已就位
            </h1>

            <p className="mt-6 text-[17px] text-[hsl(220,10%,42%)] leading-relaxed max-w-md">
              客户分析、产品优化、策略指导
              <br />
              新手外贸也能快速做出专业决策
            </p>

            <div className="mt-9 flex items-center gap-4">
              <button
                onClick={goToTraining}
                className="group relative px-8 py-4 rounded-full text-[15px] font-semibold text-white bg-gradient-to-r from-[hsl(217,100%,50%)] to-[hsl(174,100%,61%)] shadow-lg shadow-[hsl(217,100%,50%)]/20 hover:shadow-xl hover:shadow-[hsl(217,100%,50%)]/30 transition-all duration-300 active:scale-[0.97]"
              >
                立即体验
                <ArrowRight className="inline-block ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => navigate("/trial")}
                className="text-sm text-[hsl(217,100%,50%)] hover:text-[hsl(217,100%,40%)] font-medium transition-colors cursor-pointer"
              >
                马上试试，让AI分析你的问题！
              </button>
            </div>
          </div>

          {/* Right - Analysis card */}
          <div className="flex-1 max-w-md w-full">
            <AnalysisCard />
          </div>
        </div>
      </section>


      {/* Expert Capabilities */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center tracking-tight" style={{ textWrap: "balance" }}>
            三大核心技能，让外贸每一步更专业
          </h2>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            <ExpertCard
              icon={<Briefcase className="w-5 h-5" />}
              title="运营专家"
              subtitle="产品优化 & 竞品分析"
              points={["拆解竞品卖点与页面结构", "复刻风格，一键生成产品详情"]}
              highlight="结合同行热品数据，提升产品内容表达"
              color="from-[hsl(217,100%,50%)] to-[hsl(217,100%,62%)]"
            />
            <ExpertCard
              icon={<MessageCircle className="w-5 h-5" />}
              title="业务专家"
              subtitle="客户沟通 & 跟进策略"
              points={["分析客户质量与采购意图", "生成有策略的专业回复建议"]}
              highlight="结合询盘内容，提供针对性沟通方案"
              color="from-[hsl(217,100%,50%)] to-[hsl(174,100%,61%)]"
            />
            <ExpertCard
              icon={<HelpCircle className="w-5 h-5" />}
              title="培训专家"
              subtitle="知识 & 案例建议"
              points={["解答外贸各环节专业问题", "提供决策参考与风险提示"]}
              highlight="覆盖常见外贸场景，提供实用参考建议"
              color="from-[hsl(190,100%,50%)] to-[hsl(174,100%,61%)]"
            />
          </div>
        </div>
      </section>

      {/* Full Workflow */}
      <section className="py-16 bg-[hsl(220,40%,98%)]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center tracking-tight" style={{ textWrap: "balance" }}>
            外贸全流程AI支持
          </h2>

          <div className="mt-14 grid md:grid-cols-3 gap-5">
            <WorkflowCard
              icon={<UserSearch className="w-5 h-5" />}
              title="买家背调"
              desc="快速了解买家背景与采购历史"
              cta="开始背调"
              onClick={goToApp}
            />
            <WorkflowCard
              icon={<Mail className="w-5 h-5" />}
              title="写营销信"
              desc="生成专业、有策略的营销邮件"
              cta="撰写邮件"
              onClick={goToApp}
            />
            <WorkflowCard
              icon={<Share2 className="w-5 h-5" />}
              title="社媒创作"
              desc="一键生成多平台社媒内容"
              cta="开始创作"
              onClick={goToApp}
            />
            <WorkflowCard
              icon={<Image className="w-5 h-5" />}
              title="产品营销图"
              desc="AI生成高质量产品营销图片"
              cta="生成图片"
              onClick={goToApp}
            />
            <WorkflowCard
              icon={<Video className="w-5 h-5" />}
              title="AI营销视频"
              desc="快速制作产品营销短视频"
              cta="制作视频"
              onClick={goToApp}
            />
            <WorkflowCard
              icon={<Eraser className="w-5 h-5" />}
              title="图片去水印"
              desc="一键去除图片水印，还原干净素材"
              cta="去除水印"
              onClick={goToApp}
            />
          </div>
        </div>
      </section>




      {/* Footer */}
      <footer className="border-t border-[hsl(220,15%,94%)] py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center">
            <img src={mentarcLogoFull} alt="Mentarc 贸探" className="h-6 object-contain" />
          </div>
          <div className="flex items-center gap-5 text-xs text-[hsl(220,10%,64%)]">
            <button
              onClick={() => navigate("/admin")}
              className="hover:text-[hsl(220,10%,40%)] transition-colors"
            >
              后台管理
            </button>
            <span>© 2026 Mentarc. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ── Sub-components ── */

const AnalysisCard = () => (
  <div className="rounded-2xl border border-[hsl(220,15%,90%)] bg-white shadow-xl shadow-[hsl(217,100%,50%)]/5 p-6 space-y-4">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-[hsl(220,10%,52%)] uppercase tracking-wider">分析结果</span>
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[hsl(145,60%,95%)] text-[hsl(145,60%,35%)] border border-[hsl(145,60%,85%)]">
        已完成
      </span>
    </div>

    <div className="space-y-3">
      <div>
        <p className="text-xs text-[hsl(220,10%,56%)]">客户质量</p>
        <p className="text-sm font-semibold mt-0.5">中高 <span className="text-xs font-normal text-[hsl(145,60%,40%)]">· 建议跟进</span></p>
      </div>

      <div>
        <p className="text-xs text-[hsl(220,10%,56%)] mb-1">判断依据</p>
        <ul className="space-y-1">
          <li className="flex items-start gap-2 text-sm text-[hsl(220,20%,28%)]">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-[hsl(217,100%,50%)] shrink-0" />
            询盘内容具体，需求明确
          </li>
          <li className="flex items-start gap-2 text-sm text-[hsl(220,20%,28%)]">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-[hsl(174,100%,61%)] shrink-0" />
            来自目标市场（欧洲）
          </li>
        </ul>
      </div>

      <div className="pt-2 border-t border-[hsl(220,15%,94%)]">
        <p className="text-xs text-[hsl(220,10%,56%)] mb-1.5">建议</p>
        <div className="space-y-1.5">
          <p className="text-sm text-[hsl(220,20%,28%)] flex items-center gap-2">
            <ArrowRight className="w-3 h-3 text-[hsl(217,100%,50%)]" />
            优先确认需求细节
          </p>
          <p className="text-sm text-[hsl(220,20%,28%)] flex items-center gap-2">
            <ArrowRight className="w-3 h-3 text-[hsl(174,100%,61%)]" />
            提供差异化卖点
          </p>
        </div>
      </div>
    </div>
  </div>
);

interface ExpertCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  points: string[];
  highlight?: string;
  color: string;
}

const ExpertCard = ({ icon, title, subtitle, points, highlight, color }: ExpertCardProps) => (
  <div className="group rounded-2xl border border-[hsl(220,15%,92%)] bg-white p-6 hover:shadow-lg hover:shadow-[hsl(217,100%,50%)]/5 transition-all duration-300 hover:-translate-y-0.5">
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4`}>
      {icon}
    </div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-sm text-[hsl(220,10%,52%)] mt-1">{subtitle}</p>
    <ul className="mt-4 space-y-2">
      {points.map((p) => (
        <li key={p} className="flex items-start gap-2 text-sm text-[hsl(220,20%,32%)]">
          <span className="mt-1.5 w-1 h-1 rounded-full bg-[hsl(220,10%,72%)] shrink-0" />
          {p}
        </li>
      ))}
    </ul>
    {highlight && (
      <p className="mt-4 text-xs font-medium text-[hsl(217,100%,50%)] bg-[hsl(217,100%,96%)] px-3 py-2 rounded-lg">
        {highlight}
      </p>
    )}
  </div>
);

interface WorkflowCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  cta: string;
  onClick: () => void;
}

const WorkflowCard = ({ icon, title, desc, cta, onClick }: WorkflowCardProps) => (
  <button
    onClick={onClick}
    className="group text-left rounded-2xl border border-[hsl(220,15%,92%)] bg-white p-5"
  >
    <div className="w-9 h-9 rounded-lg bg-[hsl(217,100%,97%)] flex items-center justify-center text-[hsl(217,100%,50%)] mb-3">
      {icon}
    </div>
    <h3 className="text-[15px] font-semibold">{title}</h3>
    <p className="text-sm text-[hsl(220,10%,52%)] mt-1">{desc}</p>
    <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-[hsl(217,100%,50%)]">
      {cta}
      <ArrowRight className="w-3.5 h-3.5" />
    </span>
  </button>
);

export default Landing;
