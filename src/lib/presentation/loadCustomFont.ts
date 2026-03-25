/**
 * Utility functions for loading custom fonts using the FontFace API
 */

/**
 * Get font format from URL extension
 */
function getFontFormat(url: string): string {
  const extension = url.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "woff2":
      return "woff2";
    case "woff":
      return "woff";
    case "ttf":
      return "truetype";
    case "otf":
      return "opentype";
    default:
      return "truetype";
  }
}

/**
 * Load a custom font using the FontFace API
 * @param fontFamily - The font family name
 * @param fontUrl - The URL to the font file
 * @param weight - Optional font weight (default: 400)
 * @returns Promise that resolves when the font is loaded
 */
export async function loadCustomFont(
  fontFamily: string,
  fontUrl: string,
  weight: number = 400,
): Promise<void> {
  try {
    const font = new FontFace(fontFamily, `url(${fontUrl})`, {
      weight: weight.toString(),
      style: "normal",
      display: "swap",
    });

    // Check if the font is already loaded
    const isAlreadyLoaded = Array.from(document.fonts).some(
      (f) => f.family === fontFamily && f.weight === weight.toString(),
    );

    if (isAlreadyLoaded) {
      return;
    }

    const format = getFontFormat(fontUrl);

    // Load the font
    const loadedFont = await font.load();

    // Add the loaded font to the document
    document.fonts.add(loadedFont);

    console.log(
      `Custom font loaded successfully: ${fontFamily} (${format}) from ${fontUrl}`,
    );
  } catch (error) {
    console.error(`Failed to load custom font ${fontFamily}:`, error);
    // Don't throw - we want the app to continue even if fonts fail to load
  }
}

/**
 * Load custom heading and body fonts if URLs are provided
 * @param headingFont - The heading font family name
 * @param headingUrl - The URL to the heading font file (optional)
 * @param headingWeight - The heading font weight (optional)
 * @param bodyFont - The body font family name
 * @param bodyUrl - The URL to the body font file (optional)
 * @param bodyWeight - The body font weight (optional)
 */
export async function loadCustomFonts(options: {
  headingFont: string;
  headingUrl?: string;
  headingWeight?: number;
  bodyFont: string;
  bodyUrl?: string;
  bodyWeight?: number;
}): Promise<void> {
  const {
    headingFont,
    headingUrl,
    headingWeight = 400,
    bodyFont,
    bodyUrl,
    bodyWeight = 400,
  } = options;

  const promises: Promise<void>[] = [];

  // Load heading font if URL is provided
  if (headingUrl) {
    promises.push(loadCustomFont(headingFont, headingUrl, headingWeight));
  }

  // Load body font if URL is provided and it's different from heading
  if (bodyUrl && bodyFont !== headingFont) {
    promises.push(loadCustomFont(bodyFont, bodyUrl, bodyWeight));
  } else if (bodyUrl && bodyFont === headingFont && headingUrl !== bodyUrl) {
    // Same font family but different weight
    promises.push(loadCustomFont(bodyFont, bodyUrl, bodyWeight));
  }

  try {
    await Promise.all(promises);
  } catch (error) {
    console.error("Failed to load one or more custom fonts:", error);
    // Don't throw - we want the app to continue even if fonts fail to load
  }
}
