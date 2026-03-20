import JSZip from "jszip";

import { type ThemeMode, type ThemeProperties } from "./themes";

// ============ Office Font → Web Font Mapping ============

const OFFICE_FONT_MAP: Record<string, string> = {
  Calibri: "Inter",
  "Calibri Light": "Inter",
  Cambria: "Merriweather",
  Arial: "Inter",
  "Times New Roman": "Lora",
  Verdana: "Open Sans",
  Georgia: "Source Serif Pro",
  "Trebuchet MS": "Montserrat",
  Tahoma: "Inter",
  "Century Gothic": "Poppins",
  Garamond: "Cormorant Garamond",
  "Book Antiqua": "Libre Baskerville",
  Palatino: "Libre Baskerville",
  "Franklin Gothic Medium": "Manrope",
  Impact: "Sora",
  "Lucida Sans": "Nunito",
};

function mapFont(fontName: string): string {
  return OFFICE_FONT_MAP[fontName] ?? fontName;
}

// ============ Color Utilities ============

function getLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function clampHex(n: number): string {
  return Math.max(0, Math.min(255, Math.round(n)))
    .toString(16)
    .padStart(2, "0");
}

function lighten(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `#${clampHex(r + (255 - r) * amount)}${clampHex(g + (255 - g) * amount)}${clampHex(b + (255 - b) * amount)}`;
}

function colorDistance(a: string, b: string): number {
  const ar = parseInt(a.slice(1, 3), 16);
  const ag = parseInt(a.slice(3, 5), 16);
  const ab = parseInt(a.slice(5, 7), 16);
  const br = parseInt(b.slice(1, 3), 16);
  const bg = parseInt(b.slice(3, 5), 16);
  const bb = parseInt(b.slice(5, 7), 16);
  return Math.sqrt((ar - br) ** 2 + (ag - bg) ** 2 + (ab - bb) ** 2);
}

function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `#${clampHex(r * (1 - amount))}${clampHex(g * (1 - amount))}${clampHex(b * (1 - amount))}`;
}

function averageHex(a: string, b: string): string {
  const ar = parseInt(a.slice(1, 3), 16);
  const ag = parseInt(a.slice(3, 5), 16);
  const ab = parseInt(a.slice(5, 7), 16);
  const br = parseInt(b.slice(1, 3), 16);
  const bg = parseInt(b.slice(3, 5), 16);
  const bb = parseInt(b.slice(5, 7), 16);
  return `#${clampHex((ar + br) / 2)}${clampHex((ag + bg) / 2)}${clampHex((ab + bb) / 2)}`;
}

/** Convert hex to HSL [0-360, 0-1, 0-1] */
function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}

/** Convert HSL to hex */
function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  if (s === 0) {
    const v = Math.round(l * 255);
    return `#${clampHex(v)}${clampHex(v)}${clampHex(v)}`;
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h / 360 + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h / 360) * 255);
  const b = Math.round(hue2rgb(p, q, h / 360 - 1 / 3) * 255);
  return `#${clampHex(r)}${clampHex(g)}${clampHex(b)}`;
}

/**
 * Apply OOXML color modifiers (lumMod, lumOff, tint, shade) to a base hex color.
 * Modifier values in OOXML are expressed as 1/1000th percent (e.g., 75000 = 75%).
 */
function applyColorModifiers(
  hex: string,
  modifiers: { type: string; val: number }[],
): string {
  let [h, s, l] = hexToHsl(hex);

  for (const mod of modifiers) {
    const pct = mod.val / 100000; // OOXML uses 100000 = 100%
    switch (mod.type) {
      case "lumMod":
        l = l * pct;
        break;
      case "lumOff":
        l = l + pct;
        break;
      case "tint":
        // Tint: mix towards white
        l = l + (1 - l) * pct;
        break;
      case "shade":
        // Shade: mix towards black
        l = l * pct;
        break;
      case "satMod":
        s = s * pct;
        break;
      case "satOff":
        s = s + pct;
        break;
      // alpha is ignored — we don't want transparency
    }
  }

  return hslToHex(h, s, l);
}

// ============ XML Utilities ============

/** Cache-friendly element search by localName on a single parent's children */
function findChildByLocalName(
  parent: Element | null,
  localName: string,
): Element | null {
  if (!parent) return null;
  for (let i = 0; i < parent.children.length; i++) {
    const child = parent.children[i];
    if (child && child.localName === localName) return child;
  }
  return null;
}

/** Deep search by localName — use sparingly on small subtrees */
function findByLocalName(
  root: Document | Element | null,
  localName: string,
): Element | null {
  if (!root) return null;
  const all = root.getElementsByTagName("*");
  for (let i = 0; i < all.length; i++) {
    const el = all[i];
    if (el && el.localName === localName) return el;
  }
  return null;
}

/** Get hex color from an OOXML color element (handles srgbClr + sysClr) */
function getColorFromElement(parent: Element | null): string | null {
  if (!parent) return null;

  const srgb = findByLocalName(parent, "srgbClr");
  if (srgb) {
    const val = srgb.getAttribute("val");
    if (val) return `#${val.toUpperCase()}`;
  }

  const sys = findByLocalName(parent, "sysClr");
  if (sys) {
    const lastClr = sys.getAttribute("lastClr");
    if (lastClr) return `#${lastClr.toUpperCase()}`;
  }

  return null;
}

/** Collect OOXML modifier children from a color element (srgbClr or schemeClr) */
function collectChildModifiers(el: Element): { type: string; val: number }[] {
  const modifiers: { type: string; val: number }[] = [];
  for (let i = 0; i < el.children.length; i++) {
    const child = el.children[i];
    if (!child) continue;
    const modVal = child.getAttribute("val");
    if (modVal && child.localName) {
      modifiers.push({ type: child.localName, val: parseInt(modVal, 10) });
    }
  }
  return modifiers;
}

/** Resolve a color from a solidFill element (handles srgbClr + schemeClr with modifiers) */
function resolveColorFromFill(
  solidFillEl: Element | null,
  palette: ThemePalette | null,
  clrMap: Record<string, ThemeColorSlot>,
): string | null {
  if (!solidFillEl) return null;

  // Direct srgbClr
  const srgb = findChildByLocalName(solidFillEl, "srgbClr");
  if (srgb) {
    const val = srgb.getAttribute("val");
    if (val) {
      const base = `#${val.toUpperCase()}`;
      const modifiers = collectChildModifiers(srgb);
      return modifiers.length > 0 ? applyColorModifiers(base, modifiers) : base;
    }
  }

  // schemeClr (needs palette to resolve)
  if (palette) {
    const schemeClr = findChildByLocalName(solidFillEl, "schemeClr");
    if (schemeClr) {
      const val = schemeClr.getAttribute("val");
      if (val) {
        const slot = clrMap[val] ?? (val as ThemeColorSlot);
        const baseColor = palette[slot];
        if (baseColor) {
          const modifiers = collectChildModifiers(schemeClr);
          return modifiers.length > 0
            ? applyColorModifiers(baseColor, modifiers)
            : baseColor;
        }
      }
    }
  }

  return null;
}

/** Parse a DOMParser XML string */
function parseXml(xmlString: string): Document {
  return new DOMParser().parseFromString(xmlString, "application/xml");
}

// ============ Design Defaults (matches "standard" style) ============

const STANDARD_DESIGN = {
  borderRadius: {
    card: "0.5rem",
    slide: "0.5rem",
    button: "0.375rem",
  },
  transitions: {
    default: "all 0.2s ease-in-out",
  },
  shadows: {
    card: "0 1px 3px rgba(0,0,0,0.05)",
    button: "0 1px 2px rgba(0,0,0,0.03)",
    slide: "0 2px 4px rgba(0,0,0,0.04)",
  },
} as const;

// ============ OOXML Theme Palette ============

/** The 12 standard OOXML theme color slots */
type ThemeColorSlot =
  | "dk1"
  | "lt1"
  | "dk2"
  | "lt2"
  | "accent1"
  | "accent2"
  | "accent3"
  | "accent4"
  | "accent5"
  | "accent6"
  | "hlink"
  | "folHlink";

const THEME_COLOR_SLOTS: ThemeColorSlot[] = [
  "dk1",
  "lt1",
  "dk2",
  "lt2",
  "accent1",
  "accent2",
  "accent3",
  "accent4",
  "accent5",
  "accent6",
  "hlink",
  "folHlink",
];

type ThemePalette = Record<ThemeColorSlot, string | null>;

/**
 * clrMap maps logical names (bg1, tx1, bg2, tx2, accent1...) to
 * theme palette slots (lt1, dk1, lt2, dk2, accent1...).
 * Default Office mapping if no clrMap is found.
 */
const DEFAULT_CLR_MAP: Record<string, ThemeColorSlot> = {
  bg1: "lt1",
  tx1: "dk1",
  bg2: "lt2",
  tx2: "dk2",
  accent1: "accent1",
  accent2: "accent2",
  accent3: "accent3",
  accent4: "accent4",
  accent5: "accent5",
  accent6: "accent6",
  hlink: "hlink",
  folHlink: "folHlink",
};

// ============ Step 1: Resolve theme via OOXML relationships ============

/**
 * Follow the OOXML relationship chain to find the correct theme XML:
 *   presentation.xml.rels → slideMaster → slideMaster.rels → theme.xml
 */
async function resolveThemeXml(zip: JSZip): Promise<{
  themeXml: string | null;
  slideMasterXml: string | null;
}> {
  // Read presentation.xml.rels to find slide masters
  const presRelsEntry = zip.file("ppt/_rels/presentation.xml.rels");
  if (!presRelsEntry) {
    console.log("[PPTX Resolve] No presentation.xml.rels found");
    return { themeXml: null, slideMasterXml: null };
  }

  const presRelsXml = parseXml(await presRelsEntry.async("string"));
  const presRels = presRelsXml.getElementsByTagName("Relationship");

  // Find first slideMaster relationship
  let slideMasterPath: string | null = null;
  for (let i = 0; i < presRels.length; i++) {
    const rel = presRels[i];
    const type = rel?.getAttribute("Type") ?? "";
    if (type.includes("/slideMaster")) {
      const target = rel?.getAttribute("Target");
      if (target) {
        // Target is relative to ppt/, e.g. "slideMasters/slideMaster1.xml"
        slideMasterPath = target.startsWith("ppt/") ? target : `ppt/${target}`;
        break;
      }
    }
  }

  if (!slideMasterPath) {
    console.log("[PPTX Resolve] No slideMaster relationship found");
    return { themeXml: null, slideMasterXml: null };
  }

  console.log("[PPTX Resolve] Found slideMaster:", slideMasterPath);

  // Read the slide master XML (needed for clrMap)
  const smEntry = zip.file(slideMasterPath);
  const slideMasterXml = smEntry ? await smEntry.async("string") : null;

  // Read slideMaster .rels to find the theme
  const smDir = slideMasterPath.substring(0, slideMasterPath.lastIndexOf("/"));
  const smFileName = slideMasterPath.substring(
    slideMasterPath.lastIndexOf("/") + 1,
  );
  const smRelsPath = `${smDir}/_rels/${smFileName}.rels`;
  const smRelsEntry = zip.file(smRelsPath);

  if (!smRelsEntry) {
    console.log("[PPTX Resolve] No slideMaster .rels found at:", smRelsPath);
    return { themeXml: null, slideMasterXml };
  }

  const smRelsXml = parseXml(await smRelsEntry.async("string"));
  const smRels = smRelsXml.getElementsByTagName("Relationship");

  let themePath: string | null = null;
  for (let i = 0; i < smRels.length; i++) {
    const rel = smRels[i];
    const type = rel?.getAttribute("Type") ?? "";
    if (type.includes("/theme")) {
      const target = rel?.getAttribute("Target");
      if (target) {
        // Target is relative to slideMasters/, e.g. "../theme/theme1.xml"
        themePath = resolveRelativePath(smDir, target);
        break;
      }
    }
  }

  if (!themePath) {
    console.log("[PPTX Resolve] No theme relationship in slideMaster .rels");
    return { themeXml: null, slideMasterXml };
  }

  console.log("[PPTX Resolve] Resolved theme path:", themePath);

  const themeEntry = zip.file(themePath);
  const themeXml = themeEntry ? await themeEntry.async("string") : null;

  return { themeXml, slideMasterXml };
}

/** Resolve a relative path like "../theme/theme1.xml" from a base directory */
function resolveRelativePath(baseDir: string, relative: string): string {
  const parts = baseDir.split("/");
  const relParts = relative.split("/");
  for (const seg of relParts) {
    if (seg === "..") parts.pop();
    else if (seg !== ".") parts.push(seg);
  }
  return parts.join("/");
}

// ============ Step 2: Parse clrMap from slide master ============

function parseClrMap(
  slideMasterXml: string | null,
): Record<string, ThemeColorSlot> {
  if (!slideMasterXml) return { ...DEFAULT_CLR_MAP };

  const doc = parseXml(slideMasterXml);
  const clrMapEl = findByLocalName(doc, "clrMap");
  if (!clrMapEl) {
    console.log("[PPTX clrMap] No clrMap element found, using defaults");
    return { ...DEFAULT_CLR_MAP };
  }

  const map: Record<string, ThemeColorSlot> = { ...DEFAULT_CLR_MAP };
  const attrs = clrMapEl.attributes;
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    if (attr && THEME_COLOR_SLOTS.includes(attr.value as ThemeColorSlot)) {
      map[attr.name] = attr.value as ThemeColorSlot;
    }
  }

  console.log("[PPTX clrMap] Parsed color map:", map);
  return map;
}

// ============ Step 3: Parse theme palette from theme XML ============

function parseThemePalette(themeXml: string): {
  palette: ThemePalette;
  headingFont: string;
  bodyFont: string;
} {
  const doc = parseXml(themeXml);
  const clrScheme = findByLocalName(doc, "clrScheme");

  const palette: ThemePalette = {
    dk1: null,
    lt1: null,
    dk2: null,
    lt2: null,
    accent1: null,
    accent2: null,
    accent3: null,
    accent4: null,
    accent5: null,
    accent6: null,
    hlink: null,
    folHlink: null,
  };

  for (const slot of THEME_COLOR_SLOTS) {
    palette[slot] = getColorFromElement(findChildByLocalName(clrScheme, slot));
  }

  console.log("[PPTX Palette] Raw theme colors:", palette);

  // Extract fonts
  const fontScheme = findByLocalName(doc, "fontScheme");
  const majorFont = findByLocalName(fontScheme, "majorFont");
  const minorFont = findByLocalName(fontScheme, "minorFont");

  const rawHeading = majorFont
    ? findByLocalName(majorFont, "latin")?.getAttribute("typeface")
    : null;
  const rawBody = minorFont
    ? findByLocalName(minorFont, "latin")?.getAttribute("typeface")
    : null;
  const headingFont = mapFont(rawHeading ?? "Inter");
  const bodyFont = mapFont(rawBody ?? "Inter");

  console.log("[PPTX Palette] Fonts:", {
    rawHeading,
    rawBody,
    mappedHeading: headingFont,
    mappedBody: bodyFont,
  });

  return { palette, headingFont, bodyFont };
}

// ============ Step 4: Semantic slide content analysis ============

interface SlideContentAnalysis {
  headingColors: Map<string, number>;
  bodyColors: Map<string, number>;
  backgroundColors: Map<string, number>;
  shapeFillColors: Map<string, number>;
  headingFonts: Map<string, number>;
  bodyFonts: Map<string, number>;
}

/** Font size threshold in OOXML hundredths of a point. >= 3000 = heading */
const HEADING_SIZE_THRESHOLD = 1800;
const BIG_HEADING_SIZE_THRESHOLD = 2500;

/**
 * Scan actual slide content to extract colors by semantic role:
 * - heading: text runs with fontSize >= 3000 (30pt)
 * - body: text runs with fontSize < 3000
 * - background: slide background fills
 * - shapeFill: non-text shape fills (for primary color detection)
 */
async function scanSlideContent(
  zip: JSZip,
  palette: ThemePalette | null,
  clrMap: Record<string, ThemeColorSlot>,
  themeHeadingFont: string | null,
  themeBodyFont: string | null,
): Promise<SlideContentAnalysis> {
  const analysis: SlideContentAnalysis = {
    headingColors: new Map(),
    bodyColors: new Map(),
    backgroundColors: new Map(),
    shapeFillColors: new Map(),
    headingFonts: new Map(),
    bodyFonts: new Map(),
  };

  const slidePaths = Object.keys(zip.files).filter(
    (p) => p.startsWith("ppt/slides/slide") && p.endsWith(".xml"),
  );

  for (const path of slidePaths) {
    const entry = zip.file(path);
    if (!entry) continue;
    const xmlString = await entry.async("string");
    const doc = parseXml(xmlString);
    const allElements = doc.getElementsByTagName("*");
    const slideNumberMatch = path.match(/slide(\d+)\.xml$/i);
    const slideNumber = slideNumberMatch
      ? Math.max(1, parseInt(slideNumberMatch[1]!, 10))
      : 1;
    const slideWeight = 1 / Math.sqrt(slideNumber);
    const slideHeadingWeights = new Map<string, number>();
    const slideLargeHeadingColors = new Set<string>();

    // 1. Extract slide background
    const bg = findByLocalName(doc, "bg");
    if (bg) {
      const bgFill = findByLocalName(bg, "solidFill");
      const bgColor = resolveColorFromFill(bgFill, palette, clrMap);
      if (bgColor) {
        const upper = bgColor.toUpperCase();
        analysis.backgroundColors.set(
          upper,
          (analysis.backgroundColors.get(upper) || 0) + 1,
        );
      }
    }

    // 2. Collect shape fills (spPr > solidFill) for primary color detection
    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i];
      if (!el || el.localName !== "spPr") continue;
      const fill = findChildByLocalName(el, "solidFill");
      const color = resolveColorFromFill(fill, palette, clrMap);
      if (color) {
        const upper = color.toUpperCase();
        analysis.shapeFillColors.set(
          upper,
          (analysis.shapeFillColors.get(upper) || 0) + 1,
        );
      }
    }

    // 3. Scan text runs — classify as heading or body by font size
    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i];
      if (!el || el.localName !== "r") continue;

      // Only count runs with actual text content
      const textEl = findChildByLocalName(el, "t");
      if (!textEl || !textEl.textContent?.trim()) continue;

      const rPr = findChildByLocalName(el, "rPr");

      // --- Resolve font size ---
      // Priority: rPr.sz → parent <a:p> pPr.defRPr.sz → default 1800 (18pt body)
      let fontSize = rPr ? parseInt(rPr.getAttribute("sz") || "0", 10) : 0;

      if (!fontSize && el.parentElement) {
        const pPr = findChildByLocalName(el.parentElement, "pPr");
        if (pPr) {
          const defRPr = findChildByLocalName(pPr, "defRPr");
          if (defRPr) {
            fontSize = parseInt(defRPr.getAttribute("sz") || "0", 10);
          }
        }
      }
      if (!fontSize) fontSize = 1800; // Default 18pt (body)

      // --- Resolve text color ---
      // Priority: rPr > solidFill → parent pPr > defRPr > solidFill
      let color: string | null = null;

      if (rPr) {
        const fill = findChildByLocalName(rPr, "solidFill");
        color = resolveColorFromFill(fill, palette, clrMap);
      }

      if (!color && el.parentElement) {
        const pPr = findChildByLocalName(el.parentElement, "pPr");
        if (pPr) {
          const defRPr = findChildByLocalName(pPr, "defRPr");
          if (defRPr) {
            const fill = findChildByLocalName(defRPr, "solidFill");
            color = resolveColorFromFill(fill, palette, clrMap);
          }
        }
      }

      // --- Classify color by size ---
      if (color) {
        const upper = color.toUpperCase();
        if (fontSize >= HEADING_SIZE_THRESHOLD) {
          const fontSizeWeight = Math.max(1, fontSize);
          const weighted = slideWeight * fontSizeWeight;
          slideHeadingWeights.set(
            upper,
            (slideHeadingWeights.get(upper) || 0) + weighted,
          );
          if (fontSize >= BIG_HEADING_SIZE_THRESHOLD) {
            slideLargeHeadingColors.add(upper);
          }
        } else {
          analysis.bodyColors.set(
            upper,
            (analysis.bodyColors.get(upper) || 0) + 1,
          );
        }
      }

      // --- Resolve font name ---
      // Priority: rPr > latin[@typeface] → parent pPr > defRPr > latin[@typeface]
      // Resolve theme references: +mj-* → themeHeadingFont, +mn-* → themeBodyFont
      let fontName: string | null = null;

      if (rPr) {
        const latin = findChildByLocalName(rPr, "latin");
        const tf = latin?.getAttribute("typeface");
        if (tf) {
          if (tf.startsWith("+mj")) fontName = themeHeadingFont;
          else if (tf.startsWith("+mn")) fontName = themeBodyFont;
          else fontName = tf;
        }
      }

      if (!fontName && el.parentElement) {
        const pPr = findChildByLocalName(el.parentElement, "pPr");
        if (pPr) {
          const defRPr = findChildByLocalName(pPr, "defRPr");
          if (defRPr) {
            const latin = findChildByLocalName(defRPr, "latin");
            const tf = latin?.getAttribute("typeface");
            if (tf) {
              if (tf.startsWith("+mj")) fontName = themeHeadingFont;
              else if (tf.startsWith("+mn")) fontName = themeBodyFont;
              else fontName = tf;
            }
          }
        }
      }

      if (fontName) {
        const mapped = mapFont(fontName);
        if (fontSize >= HEADING_SIZE_THRESHOLD) {
          analysis.headingFonts.set(
            mapped,
            (analysis.headingFonts.get(mapped) || 0) + 1,
          );
        } else {
          analysis.bodyFonts.set(
            mapped,
            (analysis.bodyFonts.get(mapped) || 0) + 1,
          );
        }
      }
    }

    if (slideHeadingWeights.size > 0) {
      const largeCount = slideLargeHeadingColors.size;
      const penaltyFactor = largeCount > 1 ? 1 / largeCount : 1;
      for (const [color, weight] of slideHeadingWeights) {
        const adjusted =
          penaltyFactor !== 1 && slideLargeHeadingColors.has(color)
            ? weight * penaltyFactor
            : weight;
        analysis.headingColors.set(
          color,
          (analysis.headingColors.get(color) || 0) + adjusted,
        );
      }
    }
  }

  return analysis;
}

// ============ Helpers ============

/** Get the most frequent entry from a frequency map */
function getTopColor(map: Map<string, number>): string | null {
  let top: string | null = null;
  let topCount = 0;
  for (const [color, count] of map) {
    if (count > topCount) {
      top = color;
      topCount = count;
    }
  }
  return top;
}

function getTopColorExcluding(
  map: Map<string, number>,
  exclude: string | null,
): string | null {
  if (!exclude) return getTopColor(map);
  let top: string | null = null;
  let topCount = 0;
  for (const [color, count] of map) {
    if (color === exclude) continue;
    if (count > topCount) {
      top = color;
      topCount = count;
    }
  }
  return top;
}

function logAnalysis(label: string, analysis: SlideContentAnalysis): void {
  const sortEntries = (m: Map<string, number>) =>
    [...m.entries()].sort((a, b) => b[1] - a[1]);

  console.log(`[PPTX ${label}] Slide content analysis:`, {
    headingColors: sortEntries(analysis.headingColors)
      .slice(0, 10)
      .map(([c, n]) => `${c} (×${n})`),
    bodyColors: sortEntries(analysis.bodyColors)
      .slice(0, 10)
      .map(([c, n]) => `${c} (×${n})`),
    backgroundColors: sortEntries(analysis.backgroundColors).map(
      ([c, n]) => `${c} (×${n})`,
    ),
    shapeFillColors: sortEntries(analysis.shapeFillColors)
      .slice(0, 10)
      .map(([c, n]) => `${c} (×${n})`),
    headingFonts: sortEntries(analysis.headingFonts)
      .slice(0, 5)
      .map(([f, n]) => `${f} (×${n})`),
    bodyFonts: sortEntries(analysis.bodyFonts)
      .slice(0, 5)
      .map(([f, n]) => `${f} (×${n})`),
  });
}

// ============ Build final ThemeProperties (weighted) ============

/**
 * Build theme using a weighted approach:
 * 1. Start with palette-derived initial values
 * 2. Override with most-frequent slide-scanned colors for heading, body, background, primary
 */
function buildTheme(
  palette: ThemePalette,
  clrMap: Record<string, ThemeColorSlot>,
  headingFont: string,
  bodyFont: string,
  themeName: string,
  analysis: SlideContentAnalysis,
): ThemeProperties {
  const resolveColor = (logicalName: string): string | null => {
    const slot = clrMap[logicalName];
    return slot ? palette[slot] : null;
  };

  // --- Background ---
  // Initial: palette bg1. Override: most frequent slide background.
  let background = resolveColor("bg1") ?? palette.lt1 ?? "#FFFFFF";
  const topBg = getTopColor(analysis.backgroundColors);
  if (topBg) background = topBg;

  const mode: ThemeMode = getLuminance(background) > 0.5 ? "light" : "dark";

  // --- Body text color ---
  // Initial: palette tx1. Override: most frequent body text color from slides.
  let text =
    resolveColor("tx1") ??
    palette.dk1 ??
    (mode === "light" ? "#1F2937" : "#E5E7EB");
  const topBody = getTopColor(analysis.bodyColors);
  if (topBody) text = topBody;

  // --- Heading color ---
  // Initial: palette tx2. Override: most frequent heading text color from slides.
  let heading = resolveColor("tx2") ?? palette.dk2 ?? text;
  const topHeading = getTopColorExcluding(analysis.headingColors, text);
  const topHeadingRaw = getTopColor(analysis.headingColors);
  if (topHeading) {
    heading = topHeading;
  } else if (topHeadingRaw) {
    heading = topHeadingRaw;
  }

  // --- Primary color = same as heading ---
  const primary = heading;

  // --- Smart layout & Card background from shape fills ---
  // Close to primary/heading → smartLayout, close to background → cardBackground
  const CLOSE_THRESHOLD = 120;
  let smartLayout: string | null = null;
  let cardBackground: string | null = null;

  if (analysis.shapeFillColors.size > 0) {
    const sortedFills = [...analysis.shapeFillColors.entries()].sort(
      (a, b) => b[1] - a[1],
    );
    for (const [fillColor] of sortedFills) {
      if (
        !cardBackground &&
        colorDistance(fillColor, background) < CLOSE_THRESHOLD
      ) {
        cardBackground = fillColor;
      }
      if (!smartLayout && colorDistance(fillColor, primary) < CLOSE_THRESHOLD) {
        smartLayout = fillColor;
      }
      if (smartLayout && cardBackground) break;
    }
  }

  // Fallback: use primary for smartLayout, tone down bg for cardBackground
  if (!smartLayout) {
    smartLayout = primary;
  }
  if (!cardBackground) {
    cardBackground =
      resolveColor("bg2") ??
      palette.lt2 ??
      (mode === "light" ? darken(background, 0.04) : lighten(background, 0.06));
  }

  // Accent (secondary) from palette, with fallback when it clashes with primary
  const SECONDARY_OFF_THRESHOLD = 160;
  const linkColor = palette[clrMap.hlink ?? "hlink"];
  let accent = palette[clrMap.accent2 ?? "accent2"] ?? primary;
  if (
    accent &&
    linkColor &&
    colorDistance(accent, primary) > SECONDARY_OFF_THRESHOLD
  ) {
    accent = averageHex(primary, linkColor);
  }

  // --- Fonts ---
  // Initial: theme XML fonts. Override: most frequent slide fonts.
  let finalHeadingFont = headingFont;
  const topHeadingFont = getTopColor(analysis.headingFonts);
  if (topHeadingFont) finalHeadingFont = topHeadingFont;

  let finalBodyFont = bodyFont;
  const topBodyFont = getTopColor(analysis.bodyFonts);
  if (topBodyFont) finalBodyFont = topBodyFont;

  console.log("[PPTX Build] Weighted theme result:", {
    background,
    text,
    primary,
    accent,
    heading,
    cardBackground,
    smartLayout,
    mode,
    headingFont: finalHeadingFont,
    bodyFont: finalBodyFont,
    overrides: {
      background: topBg ? `overridden → ${topBg}` : "from palette",
      text: topBody ? `overridden → ${topBody}` : "from palette",
      heading: topHeading ? `overridden → ${topHeading}` : "from palette",
      primary: "= heading",
      smartLayout:
        analysis.shapeFillColors.size > 0
          ? `from shape fills (${analysis.shapeFillColors.size} unique)`
          : "= primary (no shape fills)",
      headingFont: topHeadingFont
        ? `overridden → ${topHeadingFont}`
        : "from theme XML",
      bodyFont: topBodyFont ? `overridden → ${topBodyFont}` : "from theme XML",
    },
  });

  return {
    name: themeName,
    description: "Imported from PPTX",
    mode,
    colors: {
      primary,
      accent,
      background,
      text,
      heading,
      smartLayout,
      cardBackground,
    },
    fonts: { heading: finalHeadingFont, body: finalBodyFont },
    ...STANDARD_DESIGN,
  };
}

// ============ Fallback: build theme from slide analysis only (no palette) ============

function buildThemeFromSlideAnalysis(
  analysis: SlideContentAnalysis,
  themeName: string,
): ThemeProperties {
  const topBg = getTopColor(analysis.backgroundColors);
  const background = topBg ?? "#FFFFFF";
  const mode: ThemeMode = getLuminance(background) > 0.5 ? "light" : "dark";

  const topBody = getTopColor(analysis.bodyColors);
  const text = topBody ?? (mode === "light" ? "#1F2937" : "#E5E7EB");

  const topHeading = getTopColor(analysis.headingColors);
  const heading =
    getTopColorExcluding(analysis.headingColors, text) ?? topHeading ?? text;

  // Primary = same as heading
  const primary = heading;

  // Smart layout & card background from shape fills
  const CLOSE_THRESHOLD = 120;
  let smartLayout: string | null = null;
  let cardBackground: string | null = null;

  if (analysis.shapeFillColors.size > 0) {
    const sortedFills = [...analysis.shapeFillColors.entries()].sort(
      (a, b) => b[1] - a[1],
    );
    for (const [fillColor] of sortedFills) {
      if (
        !cardBackground &&
        colorDistance(fillColor, background) < CLOSE_THRESHOLD
      ) {
        cardBackground = fillColor;
      }
      if (!smartLayout && colorDistance(fillColor, primary) < CLOSE_THRESHOLD) {
        smartLayout = fillColor;
      }
      if (smartLayout && cardBackground) break;
    }
  }

  if (!smartLayout) {
    smartLayout = primary;
  }
  if (!cardBackground) {
    cardBackground =
      mode === "light" ? darken(background, 0.04) : lighten(background, 0.06);
  }

  const accent = primary;

  // Fonts from slide content
  const headingFont = getTopColor(analysis.headingFonts) ?? "Inter";
  const bodyFont = getTopColor(analysis.bodyFonts) ?? "Inter";

  console.log("[PPTX Fallback] Theme from slide analysis:", {
    background,
    text,
    primary,
    heading,
    mode,
    headingFont,
    bodyFont,
  });

  return {
    name: themeName,
    description: "Imported from PPTX",
    mode,
    colors: {
      primary,
      accent,
      background,
      text,
      heading,
      smartLayout,
      cardBackground,
    },
    fonts: { heading: headingFont, body: bodyFont },
    ...STANDARD_DESIGN,
  };
}

// ============ Main Entry Point ============

export async function extractThemeFromPptx(
  file: File,
): Promise<ThemeProperties> {
  const zip = await JSZip.loadAsync(file);

  const themeName = `Imported: ${file.name.replace(/\.pptx$/i, "").replace(/[_-]/g, " ")}`;

  const allFiles = Object.keys(zip.files);
  console.log(
    "[PPTX Import] Files in archive:",
    allFiles.filter((f) => f.startsWith("ppt/")),
  );

  // Step 1: Resolve theme XML via OOXML relationship chain
  const { themeXml, slideMasterXml } = await resolveThemeXml(zip);

  if (themeXml) {
    // Step 2: Parse clrMap from slide master
    const clrMap = parseClrMap(slideMasterXml);

    // Step 3: Parse theme palette
    const { palette, headingFont, bodyFont } = parseThemePalette(themeXml);

    // Step 4: Scan slide content for semantic color + font analysis
    const analysis = await scanSlideContent(
      zip,
      palette,
      clrMap,
      headingFont,
      bodyFont,
    );
    logAnalysis("Import", analysis);

    // Step 5: Build theme using weighted approach (palette + slide content)
    return buildTheme(
      palette,
      clrMap,
      headingFont,
      bodyFont,
      themeName,
      analysis,
    );
  }

  // Fallback: try any theme file directly (no relationship chain)
  const themeFiles = allFiles.filter(
    (p) => p.startsWith("ppt/theme/") && p.endsWith(".xml"),
  );
  if (themeFiles[0]) {
    console.log(
      "[PPTX Import] Fallback: using theme file directly:",
      themeFiles[0],
    );
    const entry = zip.file(themeFiles[0]);
    if (entry) {
      const xmlString = await entry.async("string");
      const { palette, headingFont, bodyFont } = parseThemePalette(xmlString);

      // Still scan slides for weighted analysis
      const analysis = await scanSlideContent(
        zip,
        palette,
        DEFAULT_CLR_MAP,
        headingFont,
        bodyFont,
      );
      logAnalysis("Fallback", analysis);

      return buildTheme(
        palette,
        DEFAULT_CLR_MAP,
        headingFont,
        bodyFont,
        themeName,
        analysis,
      );
    }
  }

  // Last resort: slide content scan only (no palette available)
  console.log(
    "[PPTX Import] No theme XML found, falling back to slide content scan",
  );
  const analysis = await scanSlideContent(
    zip,
    null,
    DEFAULT_CLR_MAP,
    null,
    null,
  );
  logAnalysis("NoTheme", analysis);
  return buildThemeFromSlideAnalysis(analysis, themeName);
}
