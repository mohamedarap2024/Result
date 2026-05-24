import Image from "next/image";
import { cn } from "@/lib/utils";

export const LOGO_SRC = "/logo-sjec.png";
const ALT =
  "Schools Joint Exam Center Mogadishu — امتحان مشترك لمدارس مقديشو";

function LogoFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("logo-brand-frame", className)}>{children}</div>;
}

export function BrandLogo({
  variant = "sidebar",
  className,
  blend = false,
  framed = false,
}: {
  variant?: "sidebar" | "hero" | "header" | "compact";
  className?: string;
  /** Screen blend — use on very dark UIs only */
  blend?: boolean;
  /** Black plate behind logo; "hero" adds soft black fade on landing */
  framed?: boolean | "hero";
}) {
  const imgBlend = blend && !framed ? "mix-blend-screen" : "";

  if (variant === "sidebar") {
    const img = (
      <Image
        src={LOGO_SRC}
        alt={ALT}
        width={760}
        height={190}
        className={cn(
          "h-auto w-full max-h-[120px] object-contain object-center",
          imgBlend
        )}
        priority
      />
    );
    if (framed) {
      return <LogoFrame className={cn("w-full", className)}>{img}</LogoFrame>;
    }
    return <div className={cn("px-2 py-2", className)}>{img}</div>;
  }

  if (variant === "hero") {
    const img = (
      <Image
        src={LOGO_SRC}
        alt={ALT}
        width={900}
        height={225}
        className={cn(
          "h-auto w-full max-h-44 object-contain object-center sm:max-h-52",
          imgBlend
        )}
        priority
      />
    );
    if (framed) {
      return (
        <LogoFrame className={cn("mx-auto w-full max-w-[min(100%,860px)]", className)}>
          {img}
        </LogoFrame>
      );
    }
    return (
      <div className={cn("mx-auto w-full max-w-[min(100%,860px)] px-2 py-2", className)}>
        {img}
      </div>
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
          "h-14 w-auto max-w-[min(100%,360px)] object-contain object-left sm:h-16",
          imgBlend
        )}
        priority
      />
    );
    if (framed) {
      return <LogoFrame className={className}>{img}</LogoFrame>;
    }
    return <div className={cn("inline-flex px-1 py-1", className)}>{img}</div>;
  }

  const image = (
    <Image
      src={LOGO_SRC}
      alt={ALT}
      width={960}
      height={240}
      className={cn(
          "h-auto w-full max-h-28 object-contain object-center sm:max-h-44 md:max-h-48",
        imgBlend
      )}
      priority
    />
  );

  if (framed) {
    const plate = (
      <LogoFrame className="mx-auto w-full max-w-[min(100%,920px)]">
        {image}
      </LogoFrame>
    );
    if (framed === "hero") {
      return (
        <div className={cn("logo-hero-band w-full", className)}>{plate}</div>
      );
    }
    return <div className={cn("w-full", className)}>{plate}</div>;
  }

  return (
    <div className={cn("mx-auto w-full max-w-[min(100%,920px)]", className)}>
      {image}
    </div>
  );
}
