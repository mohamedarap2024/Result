import { Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

/** Home / search portal — official logo + search CTA */
export function PortalHero() {
  return (
    <div className="portal-hero mx-auto mb-6 w-full max-w-4xl text-center sm:mb-8">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:mb-5 sm:text-xs">
        <Sparkles className="h-3.5 w-3.5 shrink-0" />
        Official Results Portal
      </div>

      <BrandLogo variant="portal" className="portal-hero-logo mx-auto" />

      <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-primary/40 to-transparent sm:mt-6 sm:w-32" />

      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-[15px]">
        Enter your Student ID below to view your official exam results.
      </p>
    </div>
  );
}
