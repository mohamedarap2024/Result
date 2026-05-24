"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Notice = { id: number; text: string };

const NoticeContext = createContext<{
  notify: (text: string) => void;
} | null>(null);

let idSeq = 0;

export function NoticeProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>([]);

  const notify = useCallback((text: string) => {
    const id = ++idSeq;
    setNotices((n) => [...n, { id, text }]);
    setTimeout(() => {
      setNotices((n) => n.filter((x) => x.id !== id));
    }, 4500);
  }, []);

  return (
    <NoticeContext.Provider value={{ notify }}>
      {children}
      <div
        className="pointer-events-none fixed left-0 right-0 top-3 z-[100] flex flex-col items-center gap-2 px-4 safe-pad-x sm:top-4"
        aria-live="polite"
      >
        {notices.map((n) => (
          <p
            key={n.id}
            className={cn(
              "animate-notice-fade text-center text-xs font-medium tracking-wide text-slate-200 sm:text-sm",
              "max-w-[min(100%,28rem)] px-2"
            )}
          >
            {n.text}
          </p>
        ))}
      </div>
    </NoticeContext.Provider>
  );
}

export function useNotice() {
  const ctx = useContext(NoticeContext);
  if (!ctx) throw new Error("useNotice must be used within NoticeProvider");
  return ctx.notify;
}
