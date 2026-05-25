import Image from "next/image";
import { cn } from "@/lib/utils";

/** Bump LOGO_VERSION after replacing logo files in /public */
export const LOGO_VERSION = "20260525";
/** Horizontal banner — search portal */
export const LOGO_SRC = "/logo-sjec-banner.png";
/** Shield emblem — result sheet + PDF (no background) */
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
      <LogoPlate className={cn("portal-logo-wrap w-full", className)}>
        <Image
          src={LOGO_SRC}
          alt={ALT}
          width={1200}
          height={300}
          className={cn(
            "logo-img mx-auto h-auto w-full max-h-[7.5rem] object-contain object-center sm:max-h-[9.5rem] md:max-h-[11rem]",
            imgBlend
          )}
          priority
        />
      </LogoPlate>
    );
  }

  /** Official result paper — shield logo, transparent, centered on white */
  if (variant === "result") {
    return (
      <div className={cn("result-logo-wrap w-full", className)}>
        <Image
          src={LOGO_SRC_SHIELD}
          alt={ALT}
          width={480}
          height={520}
          className={cn(
            "logo-img mx-auto h-auto w-auto max-w-[min(100%,220px)] max-h-[5.5rem] object-contain object-center sm:max-h-[7rem] sm:max-w-[260px] md:max-h-[8rem]",
            imgBlend
          )}
          priority
        />
      </div>
    );
  }

  if (variant === "sidebar") {
    const img = (
      <Image
        src={LOGO_SRC}
        alt={ALT}
        width={760}
        height={190}
        className={cn(
          "logo-img h-auto w-full max-h-[100px] object-contain object-center sm:max-h-[120px]",
          imgBlend
        )}
        priority
      />
    );
    if (framed) {
      return (
        <LogoPlate solid className={cn("w-full", className)}>
          {img}
        </LogoPlate>
      );
    }
    return (
      <LogoPlate className={cn("w-full", className)}>
        {img}
      </LogoPlate>
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
