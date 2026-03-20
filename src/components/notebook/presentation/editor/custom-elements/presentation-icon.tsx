"use client";

import type React from "react";
import { useEffect, useState, type ReactNode } from "react";

type IconModule = Record<string, React.ComponentType<{ size?: number }>>;

export const DEFAULT_PRESENTATION_ICON = "FaHome";

const EXACT_ICON_LOADERS: Record<string, () => Promise<IconModule>> = {
  fa: async () => (await import("react-icons/fa")) as unknown as IconModule,
  fi: async () => (await import("react-icons/fi")) as unknown as IconModule,
  ai: async () => (await import("react-icons/ai")) as unknown as IconModule,
  bs: async () => (await import("react-icons/bs")) as unknown as IconModule,
  bi: async () => (await import("react-icons/bi")) as unknown as IconModule,
  gi: async () => (await import("react-icons/gi")) as unknown as IconModule,
  hi: async () => (await import("react-icons/hi")) as unknown as IconModule,
  im: async () => (await import("react-icons/im")) as unknown as IconModule,
  io: async () => (await import("react-icons/io")) as unknown as IconModule,
  md: async () => (await import("react-icons/md")) as unknown as IconModule,
  ri: async () => (await import("react-icons/ri")) as unknown as IconModule,
  si: async () => (await import("react-icons/si")) as unknown as IconModule,
  ti: async () => (await import("react-icons/ti")) as unknown as IconModule,
  vsc: async () => (await import("react-icons/vsc")) as unknown as IconModule,
  wi: async () => (await import("react-icons/wi")) as unknown as IconModule,
};

const FUZZY_ICON_LOADERS: Array<() => Promise<IconModule>> = [
  async () => (await import("react-icons/fa")) as unknown as IconModule,
  async () => (await import("react-icons/md")) as unknown as IconModule,
  async () => (await import("react-icons/bs")) as unknown as IconModule,
  async () => (await import("react-icons/ai")) as unknown as IconModule,
  async () => (await import("react-icons/fi")) as unknown as IconModule,
  async () => (await import("react-icons/bi")) as unknown as IconModule,
];

function renderIcon(
  iconModule: IconModule,
  iconName: string,
  size: number,
): ReactNode | null {
  const IconComponent = iconModule[iconName];
  return IconComponent ? <IconComponent size={size} /> : null;
}

async function loadExactIcon(
  iconName: string,
  size: number,
): Promise<ReactNode | null> {
  const normalizedName = iconName.trim();
  if (!normalizedName) return null;

  const prefix = normalizedName.slice(0, 3).toLowerCase();
  const fallbackPrefix = normalizedName.slice(0, 2).toLowerCase();
  const loadModule =
    EXACT_ICON_LOADERS[prefix] ?? EXACT_ICON_LOADERS[fallbackPrefix];

  if (!loadModule) return null;

  try {
    return renderIcon(await loadModule(), normalizedName, size);
  } catch {
    return null;
  }
}

async function loadFuzzyIcon(
  iconQuery: string,
  size: number,
): Promise<ReactNode | null> {
  const normalizedQuery = iconQuery.trim().toLowerCase();
  if (!normalizedQuery) return null;

  try {
    const modules = await Promise.all(
      FUZZY_ICON_LOADERS.map((loadModule) => loadModule()),
    );

    for (const iconModule of modules) {
      const iconName = Object.keys(iconModule).find((key) =>
        key.toLowerCase().includes(normalizedQuery),
      );

      if (iconName) {
        return renderIcon(iconModule, iconName, size);
      }
    }
  } catch {
    return null;
  }

  return null;
}

async function resolveIcon(
  icon: string,
  size: number,
): Promise<ReactNode | null> {
  return (await loadExactIcon(icon, size)) ?? loadFuzzyIcon(icon, size);
}

export function PresentationIcon({
  icon,
  size = 24,
  className,
}: {
  icon?: string;
  size?: number;
  className?: string;
}) {
  const [iconNode, setIconNode] = useState<ReactNode>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!icon?.trim()) {
        if (!cancelled) setIconNode(null);
        return;
      }

      const resolvedIcon = await resolveIcon(icon, size);

      if (!cancelled) {
        setIconNode(resolvedIcon);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [icon, size]);

  if (!iconNode) return null;

  return <div className={className}>{iconNode}</div>;
}
