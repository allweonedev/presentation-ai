"use client";

import { type ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-full w-full flex-col">
      <main className="relative flex flex-1">{children}</main>
    </div>
  );
}
