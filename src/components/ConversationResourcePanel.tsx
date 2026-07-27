import { X, UserRound, Sparkles, BrainCircuit, Check } from "lucide-react";

export type ConversationBuyerRef = {
  company: string;
  stage: string;
  fields: string[];
};

export type ConversationResultRef = {
  title: string;
  meta: string;
};

export type ConversationMemoryRef = {
  title: string;
  desc: string;
};

const SectionTitle = ({ icon: Icon, title }: { icon: typeof UserRound; title: string }) => (
  <div className="flex items-center gap-2 mb-3">
    <Icon className="w-4 h-4 text-primary" />
    <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
  </div>
);

const DEFAULT_MEMORIES: ConversationMemoryRef[] = [
  { title: "沟通语气偏正式", desc: "用户偏好使用正式、专业的邮件措辞，避免过多口语化表达。" },
  { title: "报价单币种统一使用 USD", desc: "所有外发报价与合同均以美元结算，除非客户主动指定其它币种。" },
  { title: "主推产品：户外电源 & 逆变器", desc: "重点跟进新能源类目，其它品类只做被动响应。" },
];

const ConversationResourcePanel = ({
  onClose,
  buyers,
  results,
  memories = DEFAULT_MEMORIES,
}: {
  onClose: () => void;
  buyers: ConversationBuyerRef[];
  results: ConversationResultRef[];
  memories?: ConversationMemoryRef[];
}) => {
  return (
    <aside className="hidden lg:flex w-[400px] shrink-0 flex-col h-screen border-l border-border/60 bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-5 h-[60px] border-b border-border/60">
        <h2 className="text-base font-semibold text-foreground">会话资源</h2>
        <button
          onClick={onClose}
          aria-label="关闭会话资源"
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {buyers.length > 0 && (
          <section className="px-5 py-5 border-b border-border/60">
            <SectionTitle icon={UserRound} title="买家档案" />
            <div className="space-y-3">
              {buyers.map((b) => (
                <div key={b.company} className="rounded-2xl border border-border/60 bg-background/60 p-4">
                  <p className="text-[15px] font-semibold text-foreground">{b.company}</p>
                  <span className="inline-flex mt-2 items-center rounded-md bg-primary/10 px-2 py-0.5 text-[12px] font-medium text-primary">
                    {b.stage}
                  </span>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {b.fields.map((f) => (
                      <span key={f} className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
                        <Check className="w-3 h-3 text-emerald-500" />
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {results.length > 0 && (
          <section className="px-5 py-5 border-b border-border/60">
            <SectionTitle icon={Sparkles} title="生成结果" />
            <div className="space-y-3">
              {results.map((r, i) => (
                <div key={`${r.title}-${i}`} className="rounded-2xl border border-border/60 bg-background/60 p-4">
                  <p className="text-[14px] font-semibold text-foreground">{r.title}</p>
                  <p className="mt-1 text-[12px] text-muted-foreground">{r.meta}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="px-5 py-5">
          <SectionTitle icon={BrainCircuit} title="偏好与记忆" />
          <p className="text-[12px] leading-relaxed text-muted-foreground mb-3">
            贸探会在多轮对话中沉淀你的表达习惯与业务偏好，并在下次任务中自动应用。以下是已记录的示例：
          </p>
          <div className="space-y-3">
            {memories.map((m) => (
              <div key={m.title} className="rounded-2xl border border-border/60 bg-background/60 p-4">
                <p className="text-[14px] font-semibold text-foreground">{m.title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
};

export default ConversationResourcePanel;
