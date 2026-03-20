import { ThemeCard } from "@/components/presentation/edit-panel/sections/theme/ThemeCard";
import { Button } from "@/components/ui/button";
import { ImageSourceSelector } from "@/components/ui/image-source-selector";
import { Label } from "@/components/ui/label";
import { themes } from "@/lib/presentation/themes";
import { usePresentationState } from "@/states/presentation-state";
import { ThemeModal } from "./ThemeModal";

export function ThemeSettings() {
  const {
    theme,
    setTheme,
    imageModel,
    setImageModel,
    imageSource,
    setImageSource,
    stockImageProvider,
    setStockImageProvider,
  } = usePresentationState();

  return (
    <div className="mb-32! space-y-5 rounded-2xl border border-border/60 bg-muted/35 p-4 sm:p-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Customize Theme</h2>
        <p className="text-sm text-muted-foreground">
          Pick a visual direction and image source before rendering slides.
        </p>
      </div>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Label className="text-sm font-medium">Theme & Layout</Label>
            <ThemeModal>
              <Button
                variant="link"
                className="h-auto p-0 text-sm font-medium whitespace-nowrap"
              >
                More Themes
              </Button>
            </ThemeModal>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {Object.entries(themes)
              .splice(0, 9)
              .map(([key, themeOption]) => {
                return (
                  <div key={key} className="h-44">
                    <ThemeCard
                      key={key}
                      theme={themeOption}
                      themeId={key}
                      isSelected={theme === key}
                      showEllipsis={false}
                      showFavoriteButton={false}
                      onSelect={() => setTheme(key)}
                    />
                  </div>
                );
              })}
          </div>
        </div>

        <ImageSourceSelector
          imageSource={imageSource}
          imageModel={imageModel}
          stockImageProvider={stockImageProvider}
          onImageSourceChange={setImageSource}
          onImageModelChange={setImageModel}
          onStockImageProviderChange={setStockImageProvider}
          className="space-y-4"
          showLabel={true}
        />
      </div>
    </div>
  );
}
