import Image from "next/image";
import { cn } from "@/lib/utils";

/** Bump LOGO_VERSION after replacing logo files in /public */
export const LOGO_VERSION = "20260530";
/** Portal + admin sidebar — black banner (white text) */
export const LOGO_SRC_PORTAL = "/logo-sjec-portal.png";
/** @deprecated use LOGO_SRC_PORTAL for UI chrome */
export const LOGO_SRC = "/logo-sjec-banner.png";
/** Official banner — result sheet + PDF (black border frame) */
export const LOGO_SRC_RESULT = "/logo-sjec-result.png";
/** @deprecated shield — use LOGO_SRC_RESULT */
export const LOGO_SRC_SHIELD = "/logo-sjec-shield.png";
const ALT =
  "Schools Joint Exam Center Mogadishu — امتحان مشترك لمدارس مقديشو";

function LogoPlate({
  children,
  className,
  solid = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Rare: black plate only when explicitly needed */
  solid?: boolean;
}) {
  return (
    <div
      className={cn(
        solid ? "logo-brand-frame" : "logo-transparent-wrap",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BrandLogo({
  variant = "sidebar",
  className,
  blend = false,
  framed = false,
}: {
  variant?: "sidebar" | "hero" | "portal" | "result" | "header" | "compact";
  className?: string;
  blend?: boolean;
  /** @deprecated Use transparent wrap; solid black plate only if solid=true via framed on sidebar */
  framed?: boolean;
}) {
  const imgBlend = blend && !framed ? "mix-blend-screen" : "";

  if (variant === "portal") {
    return (
      <div className={cn("portal-logo-wrap w-full", className)}>
        <Image
          src={LOGO_SRC_PORTAL}
          alt={ALT}
          width={1920}
          height={440}
          quality={100}
          sizes="(max-width: 639px) 100vw, (max-width: 1024px) 52rem, 56rem"
          className={cn(
            "portal-logo-img mx-auto block h-auto w-full object-contain object-center",
            imgBlend
          )}
          priority
        />
      </div>
    );
  }

  /** Official result paper — logo only, no border */
  if (variant === "result") {
    return (
      <div className={cn("result-logo-plain mx-auto w-full max-w-2xl", className)}>
        <Image
          src={LOGO_SRC_RESULT}
          alt={ALT}
          width={1200}
          height={280}
          className={cn(
            "logo-img mx-auto block h-auto w-full max-h-[3.75rem] object-contain object-center sm:max-h-[4.75rem] md:max-h-[5.25rem]",
            imgBlend
          )}
          priority
        />
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className={cn("sidebar-logo-wrap w-full", className)}>
        <Image
          src={LOGO_SRC_PORTAL}
          alt={ALT}
          width={1920}
          height={440}
          quality={100}
          sizes="(max-width: 1023px) 240px, 260px"
          className={cn(
            "sidebar-logo-img mx-auto block h-auto w-full object-contain object-center",
            imgBlend
          )}
          priority
        />
      </div>
    );
  }

  if (variant === "hero") {
    const img = (
      <Image
        src={LOGO_SRC}
        alt={ALT}
        width={900}
        height={225}
        className={cn(
          "logo-img h-auto w-full max-h-40 object-contain object-center sm:max-h-48",
          imgBlend
        )}
        priority
      />
    );
    return (
      <LogoPlate className={cn("mx-auto w-full max-w-[min(100%,860px)]", className)}>
        {img}
      </LogoPlate>
    );
  }

  if (variant === "compact") {
    const img = (
      <Image
        src={LOGO_SRC}
        alt={ALT}
        width={500}
        height={125}
        className={cn(
          "logo-img h-12 w-auto max-w-[min(100%,320px)] object-contain object-left sm:h-14",
          imgBlend
        )}
        priority
      />
    );
    return (
      <LogoPlate className={className}>
        {img}
      </LogoPlate>
    );
  }

  const image = (
    <Image
      src={LOGO_SRC}
      alt={ALT}
      width={960}
      height={240}
      className={cn(
        "logo-img h-auto w-full max-h-24 object-contain object-center sm:max-h-36 md:max-h-40",
        imgBlend
      )}
      priority
    />
  );

  return (
    <LogoPlate className={cn("mx-auto w-full max-w-[min(100%,920px)]", className)}>
      {image}
    </LogoPlate>
  );
}
