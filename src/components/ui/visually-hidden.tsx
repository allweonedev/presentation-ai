import { type ReactNode } from "react";

export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <div className="sr-only">{children}</div>;
}
