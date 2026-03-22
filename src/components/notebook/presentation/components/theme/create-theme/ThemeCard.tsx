import { type ThemeProperties } from "@/lib/presentation/themes";
import { cn } from "@/lib/utils";

export default function ThemeCard({
  theme,
  selectedColorTheme,
  setSelectedColorTheme,
}: {
  theme: ThemeProperties & { id: string };
  selectedColorTheme: string;
  setSelectedColorTheme: (themeId: string) => void;
}) {
  return (
    <button
      key={theme.id}
      onClick={() => setSelectedColorTheme(theme.id)}
      className={cn(
        "rounded-lg border-2 transition-all hover:shadow-md",
        selectedColorTheme === theme.id
          ? "border-purple-600 ring-2 ring-purple-200 dark:ring-purple-800"
          : "border-border hover:border-muted-foreground",
      )}
    >
      <div
        className={cn("rounded-t-md p-3")}
        style={{ borderRadius: theme.borderRadius.button }}
      >
        <div
          className={cn(
            "flex min-h-[80px] flex-col justify-center rounded p-3",
          )}
          style={{
            backgroundColor: theme.colors.primary,
          }}
        >
          <div
            className={cn("mb-1.5 text-center text-xs font-semibold")}
            style={{
              color: theme.colors.text,
            }}
          >
            This is a theme
          </div>
          <div
            className={cn("mb-2 text-center text-[10px] leading-tight")}
            style={{
              color: theme.colors.text,
            }}
          >
            Body text with{" "}
            <span
              className={cn("underline")}
              style={{
                color: theme.colors.accent,
              }}
            >
              link
            </span>
          </div>
          <div className={cn("mx-auto h-1.5 w-1/2 rounded")} />
        </div>
      </div>
    </button>
  );
}
