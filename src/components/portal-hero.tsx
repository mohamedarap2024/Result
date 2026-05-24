import { Sparkles } from "lucide-react";

/** Home / search landing — text only, no logo image */
export function PortalHero() {
  return (
    <div className="portal-hero mx-auto mb-6 max-w-xl text-center sm:mb-8">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
        <Sparkles className="h-3.5 w-3.5 shrink-0" />
        Official Results Portal
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/90 sm:text-xs">
        SJEC · Mogadishu
      </p>

      <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
        <span className="text-gradient">Schools Joint</span>
        <br className="sm:hidden" />
        <span className="text-foreground"> Exam Center</span>
      </h1>

      <p
        className="mt-2 text-sm font-medium text-muted-foreground/90 sm:text-base"
        dir="rtl"
      >
        امتحان مشترك لمدارس مقديشو
      </p>

      <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-primary/50 to-transparent sm:w-24" />

      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
        Enter your Student ID below to view your official exam results.
      </p>
    </div>
  );
}
