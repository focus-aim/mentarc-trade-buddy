import { useState, useEffect, useRef, useMemo } from "react";
import { Loader2, CheckCircle2, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SubStep {
  plugin: string;
  query: string;
  description: string;
}

export interface RichStep {
  label: string;
  subSteps?: SubStep[];
}

interface StepLink {
  stepIndex: number;
  label: string;
  onClick: () => void;
}

interface MindFlowMessageProps {
  onComplete: () => void;
  steps?: string[];
  richSteps?: RichStep[];
  stepLinks?: StepLink[];
}

const MindFlowMessage = ({ onComplete, steps, richSteps, stepLinks }: MindFlowMessageProps) => {
  const resolvedSteps: RichStep[] = useMemo(
    () => richSteps || (steps || []).map((s) => ({ label: s })),
    [richSteps, steps]
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const completedRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isRunning = currentStep < resolvedSteps.length && !completed;

  // Compute per-tick timing so the whole flow finishes in ~3s total
  const totalTicks = useMemo(() => {
    return resolvedSteps.reduce((acc, s) => acc + Math.max(1, s.subSteps?.length || 0), 0);
  }, [resolvedSteps]);
  const tickMs = useMemo(() => Math.max(80, Math.min(220, 2400 / Math.max(1, totalTicks))), [totalTicks]);

  useEffect(() => {
    if (currentStep >= resolvedSteps.length) return;

    const step = resolvedSteps[currentStep];
    const subCount = step.subSteps?.length || 0;

    if (subCount === 0 || currentSubStep >= subCount) {
      const timer = setTimeout(() => {
        setCurrentStep((s) => s + 1);
        setCurrentSubStep(0);
      }, tickMs);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCurrentSubStep((s) => s + 1);
    }, tickMs);
    return () => clearTimeout(timer);
  }, [currentStep, currentSubStep, resolvedSteps, tickMs]);

  // Hard cap: force completion after 3s no matter what.
  useEffect(() => {
    const cap = setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      setCurrentStep(resolvedSteps.length);
      setCompleted(true);
      setCollapsed(true);
      onComplete();
    }, 3000);
    return () => clearTimeout(cap);
  }, [resolvedSteps.length, onComplete]);

  // Finalization: fire once when all steps are done.
  useEffect(() => {
    if (currentStep < resolvedSteps.length) return;
    if (completedRef.current) return;
    completedRef.current = true;
    setCompleted(true);
    const timer = setTimeout(() => {
      setCollapsed(true);
      onComplete();
    }, 200);
    return () => clearTimeout(timer);
  }, [currentStep, resolvedSteps.length, onComplete]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [currentStep, currentSubStep]);

  const getLinkForStep = (index: number) => stepLinks?.find((l) => l.stepIndex === index);

  const isStepDone = (i: number) => currentStep > i;
  const isStepActive = (i: number) => currentStep === i;
  const isStepVisible = (i: number) => currentStep >= i;

  // Completed & collapsed state
  if (completed && collapsed) {
    return (
      <Collapsible>
        <CollapsibleTrigger asChild>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group w-full">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>任务已完成</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/50 transition-transform group-data-[state=open]:rotate-180 ml-auto" />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 border-t border-border/50 pt-2">
            <div className="space-y-2 text-sm">
              {resolvedSteps.map((step, i) => {
                const link = getLinkForStep(i);
                return (
                  <div key={step.label} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="text-muted-foreground">{step.label}</span>
                    {link && (
                      <button
                        onClick={link.onClick}
                        className="text-primary text-[13px] hover:underline transition-colors"
                      >
                        {link.label}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div>
      {/* Loading indicator header */}
      {isRunning && (
        <div className="mb-2">
          <div className="flex items-center gap-2 text-sm text-primary">
            <div className="relative flex items-center justify-center w-4 h-4">
              <div className="absolute w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
            <span className="font-medium">思考中...</span>
          </div>
          <div className="mt-2 h-px bg-border/60" />
        </div>
      )}

      <div className={`max-h-[240px] ${completed ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        <div className="space-y-2.5 py-1 pr-2">
          {resolvedSteps.map((step, i) => {
            const done = isStepDone(i);
            const active = isStepActive(i);
            const visible = isStepVisible(i);
            const link = getLinkForStep(i);

            return (
              <div
                key={step.label}
                className={`transition-all duration-300 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 h-0 overflow-hidden"
                }`}
              >
                <div className="flex items-center gap-2 text-sm">
                  {active ? (
                    <Loader2 className="w-3.5 h-3.5 text-primary animate-spin shrink-0" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  )}
                  <span className={done ? "text-muted-foreground" : "text-foreground font-medium"}>
                    {step.label}
                  </span>
                  {link && done && (
                    <button
                      onClick={link.onClick}
                      className="text-primary text-[13px] hover:underline transition-colors"
                    >
                      {link.label}
                    </button>
                  )}
                </div>

                {step.subSteps && step.subSteps.length > 0 && (active || done) && (
                  <div className="ml-5 mt-1.5 space-y-1.5 border-l-2 border-primary/15 pl-3">
                    {step.subSteps.map((sub, si) => {
                      const subDone = done || (active && si < currentSubStep);
                      const subActive = active && si === currentSubStep;
                      const subVisible = done || (active && si <= currentSubStep);

                      if (!subVisible) return null;

                      return (
                        <div
                          key={si}
                          className={`transition-all duration-300 ${
                            subVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                          }`}
                        >
                        <div className="flex items-center gap-1.5 text-[12px] flex-wrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-primary/25 bg-primary/5 text-primary text-[11px] font-medium shrink-0">
                              {sub.plugin}
                            </span>
                            <span className={`${subDone ? "text-muted-foreground" : "text-foreground/80"}`}>
                              {sub.query}
                            </span>
                            {subActive && (
                              <Loader2 className="w-2.5 h-2.5 text-primary/50 animate-spin shrink-0 ml-0.5" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};

export default MindFlowMessage;
