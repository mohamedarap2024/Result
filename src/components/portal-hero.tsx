import { Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

/** Home / search landing — official transparent logo + subtitle */
export function PortalHero() {
  return (
    <div className="portal-hero mx-auto mb-6 w-full max-w-4xl text-center sm:mb-8">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:mb-6 sm:text-xs">
        <Sparkles className="h-3.5 w-3.5 shrink-0" />
        Official Results Portal
      </div>

      <BrandLogo variant="portal" className="portal-hero-logo" />

      <p
        className="mx-auto mt-4 max-w-lg text-sm font-medium leading-relaxed text-muted-foreground sm:mt-5 sm:text-base"
        dir="rtl"
      >
        امتحان مشترك لمدارس مقديشو
      </p>

      <div className="mx-auto mt-4 h-px w-20 bg-gradient-to-r from-transparent via-primary/45 to-transparent sm:mt-5 sm:w-28" />

      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground/95 sm:mt-5 sm:text-[15px]">
        Enter your Student ID below to view your official exam results.
      </p>
    </div>
  );
}
