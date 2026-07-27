import SiteNav from "@/components/SiteNav";
import { Building2, Mail } from "lucide-react";
import wechatQr from "@/assets/wechat-service-qr.png";
import imgExperience from "@/assets/about-experience.jpg";
import imgAiTech from "@/assets/about-ai-tech.jpg";
import imgEasyUse from "@/assets/about-easy-use.jpg";

type Section = {
  title: string;
  image: string;
  align: "left" | "right";
  points: { strong?: string; text: string }[];
};

const SECTIONS: Section[] = [
  {
    title: "30年外贸经验沉淀",
    image: imgExperience,
    align: "left",
    points: [
      { text: "30年积累", strong: "海量独家外贸课程 + 资料 + 实战经验" },
      { strong: "AI 萃取精华生成知识库", text: "，对话即可直接调用" },
    ],
  },
  {
    title: "先进 AI 技术助力订单转化",
    image: imgAiTech,
    align: "right",
    points: [
      { strong: "订单全流程专业指导", text: "，给到专业跟进建议" },
      { text: "接入时下", strong: "先进大模型 + 图片和视频生成技术" },
      { strong: "一键制作 / 优化产品详情", text: "，提高竞争力" },
      { text: "持续的", strong: "长记忆助力企业沉淀 AI 数字资产" },
    ],
  },
  {
    title: "使用 0 门槛，点开即用",
    image: imgEasyUse,
    align: "left",
    points: [
      { text: "封装", strong: "多项外贸常见任务 Skill" },
      { strong: "无需安装直接可用", text: "，将使用门槛降到最低" },
      { text: "持续学习和更新，打破信息壁垒" },
    ],
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-white text-[hsl(220,20%,14%)]">
      <SiteNav />

      {/* Hero */}
      <section className="relative pt-16 pb-16 md:pt-20 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(217,60%,97%)] via-white to-[hsl(174,50%,98%)]" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[760px] h-[420px] rounded-full bg-[hsl(217,100%,50%)]/10 blur-[110px]" />
        <div className="absolute top-1/3 -right-32 w-[360px] h-[360px] rounded-full bg-[hsl(174,100%,62%)]/15 blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-[360px] h-[360px] rounded-full bg-[hsl(217,100%,60%)]/10 blur-3xl" />
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(217,30%,90%) 1px, transparent 1px), linear-gradient(90deg, hsl(217,30%,90%) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at center, black 25%, transparent 70%)",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(217,100%,50%)]/15 bg-white/70 backdrop-blur-sm shadow-sm mb-6">
            <Building2 className="w-3.5 h-3.5 text-[hsl(217,100%,45%)]" />
            <span className="text-xs font-medium text-[hsl(217,100%,45%)] tracking-wide">
              关于贸探
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.2] lg:text-6xl">
            专为
            <span className="bg-gradient-to-r from-[hsl(217,100%,50%)] to-[hsl(174,100%,42%)] bg-clip-text text-transparent">
              订单转化
            </span>
            打造的外贸 AI工具
          </h1>

          <div className="mt-6 text-base md:text-lg text-[hsl(220,15%,30%)] leading-[1.85] max-w-3xl mx-auto space-y-2">
            <p>
              贸探是焦点科技推出的外贸AI工具，专注提升订单转化效率。
            </p>
            <p>
              基于
              <span className="text-[hsl(220,20%,14%)] font-semibold"> 30 年外贸实战经验</span>，
              聚焦
              <span className="text-[hsl(220,20%,14%)] font-semibold">「市场分析、产品运营、询盘跟进」</span>
              三大核心板块。
            </p>
          </div>

        </div>
      </section>


      {/* Feature sections */}
      <section className="relative max-w-6xl mx-auto px-6 pt-12 md:pt-20 pb-20">
        {/* connecting vertical line */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-[hsl(217,100%,50%)]/25 to-transparent hidden md:block"
        />

        <div className="space-y-16 md:space-y-24">
          {SECTIONS.map((s, i) => (
            <article
              key={s.title}
              className="relative group"
            >
              {/* step node on the connecting line */}
              <div
                aria-hidden
                className="hidden md:flex absolute left-1/2 -translate-x-1/2 -top-3 z-10 w-10 h-10 rounded-full bg-white border border-[hsl(217,100%,50%)]/20 shadow-[0_4px_16px_-4px_hsl(217,100%,50%,0.35)] items-center justify-center"
              >
                <span className="text-xs font-mono font-semibold text-[hsl(217,100%,45%)]">
                  0{i + 1}
                </span>
              </div>

              <div
                className={`flex flex-col ${
                  s.align === "left" ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-8 md:gap-14`}
              >
                {/* Image side */}
                <div className="shrink-0 w-full md:w-[340px]">
                  <div className="relative aspect-square rounded-[28px] overflow-hidden bg-gradient-to-br from-[hsl(217,100%,96%)] to-[hsl(174,60%,95%)] border border-white shadow-[0_20px_60px_-20px_hsl(217,100%,50%,0.35)]">
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      width={1024}
                      height={1024}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                </div>

                {/* Text side */}
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-5 md:hidden">
                    <span className="text-sm font-mono font-semibold text-[hsl(217,100%,45%)] px-2.5 py-0.5 rounded-full bg-[hsl(217,100%,96%)] border border-[hsl(217,100%,50%)]/15">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-5 leading-tight">
                    {s.title}
                  </h3>
                  <ul className="space-y-3.5">
                    {s.points.map((p, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-[15px] leading-relaxed text-[hsl(220,15%,28%)]"
                      >
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[hsl(217,100%,50%)] to-[hsl(174,100%,42%)] shrink-0" />
                        <span>
                          {p.strong && p.text && !p.text.startsWith("，") ? (
                            <>
                              {p.text}
                              <strong className="font-semibold text-[hsl(220,20%,14%)]">
                                {p.strong}
                              </strong>
                            </>
                          ) : p.strong ? (
                            <>
                              <strong className="font-semibold text-[hsl(220,20%,14%)]">
                                {p.strong}
                              </strong>
                              {p.text}
                            </>
                          ) : (
                            p.text
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-gradient-to-br from-[hsl(217,100%,98%)] via-white to-[hsl(174,60%,97%)] border border-[hsl(220,15%,92%)] rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0 bg-white p-3 rounded-2xl shadow-sm border border-[hsl(220,15%,92%)]">
            <img src={wechatQr} alt="企微客服二维码" className="w-44 h-44 object-contain" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(217,100%,96%)] text-[hsl(217,100%,45%)] text-xs font-medium mb-3">
              <Mail className="w-3.5 h-3.5" />
              联系我们
            </div>
            <h2 className="text-2xl font-bold mb-2">扫码添加企微客服</h2>
            <p className="text-[hsl(220,10%,42%)] leading-relaxed">
              产品咨询、试用申请、企业合作、定制方案，欢迎扫码联系我们专属顾问，
              将在 1 个工作日内回复。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
