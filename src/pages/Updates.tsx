import SiteNav from "@/components/SiteNav";
import { Sparkles } from "lucide-react";

interface ReleaseItem {
  version: string;
  date: string;
  tag: "新功能" | "优化" | "修复";
  title: string;
  highlights: string[];
}

const RELEASES: ReleaseItem[] = [
  {
    version: "v1.5.0",
    date: "2026-06-04",
    tag: "新功能",
    title: "产品体验优化",
    highlights: [
      "询盘分析模块优化：AI总结风险与合作机会",
      "企业知识库体验优化：扩大文件大小、数量上限要求",
      "对话体验优化：新增询盘回复模板编辑，新增聊天结果点赞/踩评价",
    ],
  },
  {
    version: "v1.4.0",
    date: "2026-05-18",
    tag: "新功能",
    title: "上线AI团队档案模块",
    highlights: [
      "上线企业知识训练与经验沉淀模块",
      "整体流程优化：跟单成交-产品转化-业务沉淀",
      "新增团队成员管理模块",
    ],
  },
  {
    version: "v1.2.0",
    date: "2026-04-30",
    tag: "新功能",
    title: "上线“天使用户”体验计划",
    highlights: [
      "性能体验优化：优化模型输出效率、提升回答质量",
      "上线“贸力值”体系，支持天使用户试用",
    ],
  },
  {
    version: "v1.1.0",
    date: "2026-04-10",
    tag: "新功能",
    title: "功能体验优化",
    highlights: [
      "业务专家：新增买家背调能力，结合实时检索、海关数据，提供买家背景报告",
      "交互体验优化、性能体验优化",
    ],
  },
  {
    version: "v1.0.0",
    date: "2026-04-01",
    tag: "新功能",
    title: "AI外贸专家团队上线",
    highlights: [
      "业务专家：询盘分析与回复跟进",
      "产品专家：产品详情与图片素材生成",
      "培训专家：外贸知识问答",
    ],
  },
];

const tagStyle: Record<ReleaseItem["tag"], string> = {
  新功能: "bg-[hsl(217,100%,96%)] text-[hsl(217,100%,45%)] border-[hsl(217,100%,88%)]",
  优化: "bg-[hsl(174,60%,95%)] text-[hsl(174,80%,30%)] border-[hsl(174,60%,85%)]",
  修复: "bg-[hsl(40,90%,95%)] text-[hsl(35,90%,40%)] border-[hsl(40,90%,85%)]",
};

const Updates = () => {
  return (
    <div className="min-h-screen bg-white text-[hsl(220,20%,14%)]">
      <SiteNav />

      <section className="relative pt-16 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(217,60%,97%)] via-white to-[hsl(174,50%,97%)]" />
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[hsl(217,100%,50%)]/15 bg-[hsl(217,100%,50%)]/5 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[hsl(217,100%,45%)]" />
            <span className="text-xs font-medium text-[hsl(217,100%,45%)]">产品动态</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">版本更新历程</h1>
          <p className="mt-3 text-[hsl(220,10%,42%)]">
            记录贸探每一次进化，让每位外贸人都能用上更聪明的 AI 专家。
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24">
        {Object.entries(
          RELEASES.reduce<Record<string, typeof RELEASES>>((acc, r) => {
            const year = r.date.slice(0, 4);
            (acc[year] ||= []).push(r);
            return acc;
          }, {}),
        ).map(([year, items]) => (
          <div key={year} className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-[hsl(220,20%,14%)]">{year}</h2>
            <ol className="relative border-l border-[hsl(220,15%,90%)] ml-3">
              {items.map((r) => (
                <li key={r.version} className="mb-8 ml-6">
                  <span className="absolute -left-[7px] mt-2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[hsl(217,100%,50%)] shadow-sm" />
                  <div className="bg-white/80 backdrop-blur-sm border border-[hsl(220,15%,92%)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] border ${tagStyle[r.tag]}`}>
                        {r.tag}
                      </span>
                      <span className="text-xs text-[hsl(220,10%,50%)]">{r.date.slice(5)}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{r.title}</h3>
                    <ul className="space-y-1.5 text-sm text-[hsl(220,10%,35%)]">
                      {r.highlights.map((h, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-[hsl(217,100%,50%)] shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>

    </div>
  );
};

export default Updates;
